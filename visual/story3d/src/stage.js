// THE STAGE: the procedural TOMBS lab (tombs-lab, the one building the story and the game
// share) with the story's people in it, posed by the Watch tab's own rig code
// (visual/vendor/three-human.js). The stage draws a SCENE STATE it is handed (where everyone
// is, how they sit, what they hold, what each screen shows, which camera); it decides nothing
// about the story.
//
// THE CAST is data (CAST below), so a body can be swapped without touching the staging:
// Joshua, 2026-11-10, "for now, just do both the cartoon characters with realistic badges...
// we can always swap the models later once they are more stable". Each person has:
//   url      the rigged GLB (Meshy's 69-joint rig, or the Sarah v2 story bake's 68)
//   pregnant her seated posture and her walk are a pregnant woman's
//   carry    her bump, 0..1+, for her walk's shorter wider steps (the Lab's slider over 100)
//   seat     the chair height her feet reach the floor at (the chair is raised or lowered)
//   badge    she wears the TOMBS badge on its lanyard (assets/models/badge.glb, swinging)
//   armRoll  degrees a hanging arm turns about its own length so the palm faces the thigh
//            (measured per model, 2026-11-10: toon Sarah hangs palm-forward, toon Jack nearly right)
//
// DYNAMICS are anything on a person that moves by itself after the pose is set: the badge's
// swing now, a cloth-sim garment later ("still allow the rooms to be capable with cloth sim
// simulation"). Each is { step(dt), reset(), settle?(frames) } and runs on the STORY clock:
// stepped by the audio time that passed while playing (so a speed change speeds it up with
// everything else), reset and settled at the new pose after a seek or a long pause, never run
// while paused. Add one with stage.addDynamics(id, sim) once the body is in.
import * as THREE from 'three';
import { buildLab, LabState } from '../../../tombs-lab/src/tombs/index.ts';
import { ScreenSet, GLOW } from './screens.js';
import { asset } from './paths.js';

export const CAST = {
  jack: { url: 'assets/models/jack.glb', seat: 0.42, carry: 0, badge: true, armRoll: -20 },
  // GAME TUNING: the toon Sarah's file carries no bump number; 0.55 gives her walk a late-
  // pregnancy shortening without the waddle of the Lab's larger settings.
  sarah: { url: 'assets/models/sarah.glb', seat: 0.49, carry: 0.55, pregnant: true, badge: true, armRoll: 70 },
};
const BADGE_URL = 'assets/models/badge.glb';

const smooth = p => (p <= 0 ? 0 : p >= 1 ? 1 : p * p * (3 - 2 * p));
const qAxis = (x, y, z, a) => { const s = Math.sin(a / 2); return [x * s, y * s, z * s, Math.cos(a / 2)]; };
function qSlerp(a, b, t) {
  let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]; const s = d < 0 ? -1 : 1; d *= s;
  if (d > 0.9995) { const o = a.map((v, i) => v + (s * b[i] - v) * t), n = Math.hypot(...o); return o.map(v => v / n); }
  const th = Math.acos(d), k0 = Math.sin((1 - t) * th) / Math.sin(th), k1 = (s * Math.sin(t * th)) / Math.sin(th);
  return a.map((v, i) => v * k0 + b[i] * k1);
}
const toMap = turns => { const m = new Map(); for (const t of turns) if (t.joint >= 0) m.set(t.joint, qAxis(t.ax, t.ay, t.az, t.radians)); return m; };
function toTurns(map) {
  const out = [];
  for (const [joint, q0] of map) {
    let [x, y, z, w] = q0; if (w < 0) { x = -x; y = -y; z = -z; w = -w; }
    const s = Math.hypot(x, y, z);
    out.push(s < 1e-9 ? { joint, ax: 0, ay: 1, az: 0, radians: 0 } : { joint, ax: x / s, ay: y / s, az: z / s, radians: 2 * Math.atan2(s, w) });
  }
  return out;
}
const ID = [0, 0, 0, 1];
const DEG = Math.PI / 180;
// GAME TUNING, measured on the toon cast (2026-11-10): how far a hanging arm turns in, and how far each finger joint curls at rest
const ARM_ROLL = 0, FINGER_CURL = 14;
// where a tucked tablet sits: this far from the elbow toward the wrist, and this far in from the forearm toward her side (metres)
const TUCK_ALONG = 0.5, TUCK_IN = -0.02, TUCK_TURN = -35;
const qMul = (a, b) => [a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1], a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0], a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3], a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]];
const rx = a => qAxis(1, 0, 0, a), ry = a => qAxis(0, 1, 0, a), rz = a => qAxis(0, 0, 1, a);
function blend(a, b, k) { if (k >= 1) return b; const o = new Map(); for (const j of new Set([...a.keys(), ...b.keys()])) o.set(j, qSlerp(a.get(j) || ID, b.get(j) || ID, k)); return o; }

/** Is this a device to spare: a phone or a small screen? (Fewer pixels, no shadow map.) */
export function lowPower() {
  try {
    const q = new URLSearchParams(location.search).get('quality');
    if (q) return q === 'low';
    return /Mobi|Android|iPhone|iPad/.test(navigator.userAgent) || Math.min(screen.width, screen.height) < 700;
  } catch (e) { return false; }
}

export class Stage {
  constructor(canvasHost, opts = {}) {
    this.low = opts.low ?? lowPower();
    const r = this.renderer = new THREE.WebGLRenderer({ antialias: !this.low, powerPreference: 'high-performance' });
    r.setPixelRatio(Math.min(this.low ? 1.5 : 2, devicePixelRatio || 1)); r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
    r.shadowMap.enabled = !this.low; r.shadowMap.type = THREE.PCFSoftShadowMap;
    canvasHost.appendChild(r.domElement);
    const scene = this.scene = new THREE.Scene(); scene.background = new THREE.Color(0x0b1520); scene.fog = new THREE.Fog(0x0b1520, 30, 140);
    // moonlight through the north windows: a little cool shape on faces and furniture
    const moon = new THREE.DirectionalLight(0x9ec4e8, 0.35); moon.position.set(-6, 9, -22); scene.add(moon);
    // the overhead view looks down with the roof off: a soft light from above, only for that view,
    // so the rooms and the tracker marks read at a phone's size
    this.overheadFill = new THREE.HemisphereLight(0xcfe3f5, 0x2a3340, 0); scene.add(this.overheadFill);
    this.labState = new LabState(); this.labState.setMode('night');
    this.building = buildLab(this.labState); scene.add(this.building.group); this.building.setLabels(false);
    const D = this.building.dressing;
    this.chairs = D.chairs;           // by furniture id: 'jack.chair.primary', 'jack.chair.bench', 'sarah.chair', ...
    this.tablet = D.props.get('sarah.tablet');
    this.lamp = D.lamps.get('jack.lamp');
    if (this.lamp && this.low) this.lamp.light.castShadow = false;
    // every desk's screens, named desk:index ('jack.desk.primary:0' is the one on Jack's left)
    this.screens = new ScreenSet();
    let seed = 1;
    for (const [desk, list] of D.screens) list.forEach((s, i) => this.screens.add(`${desk}:${i}`, s.mesh, seed++));
    if (this.tablet) this.screens.add('sarah.tablet', this.tablet.userData.screen, 99);
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.02, 400);
    this.bodies = {}; this.lastT = null;
    this.alarm = new THREE.PointLight(0xff3030, 0, 9, 2); this.alarm.position.set(-13.5, 2.9, -10.3); scene.add(this.alarm);
    this.markers = this.makeMarkers();
  }

  makeMarkers() {
    const grp = new THREE.Group(); grp.renderOrder = 10; this.scene.add(grp);
    const mk = color => {
      const g = new THREE.Group();
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, depthTest: false, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.55, 40), mat); ring.rotation.x = -Math.PI / 2; g.add(ring);
      const wedgeShape = new THREE.Shape(); wedgeShape.moveTo(-0.28, 0.58); wedgeShape.lineTo(0.28, 0.58); wedgeShape.lineTo(0, 1.05); wedgeShape.closePath();
      const wedge = new THREE.Mesh(new THREE.ShapeGeometry(wedgeShape), mat); wedge.rotation.x = Math.PI / 2; g.add(wedge);
      const glow = new THREE.Mesh(new THREE.CircleGeometry(0.42, 40), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthTest: false })); glow.rotation.x = -Math.PI / 2; g.add(glow);
      for (const o of [ring, wedge, glow]) o.renderOrder = 11;
      const dots = []; for (let i = 0; i < 28; i++) { const d = new THREE.Mesh(new THREE.CircleGeometry(0.09, 12), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthTest: false })); d.rotation.x = -Math.PI / 2; d.renderOrder = 11; grp.add(d); dots.push(d); }
      grp.add(g); return { g, glow, dots, wedge };
    };
    return { jack: mk(0x5aa9ff), sarah: mk(0xff6b7a), grp };
  }

  /** Load the cast (CAST, or another table of the same shape) and hang their badges. */
  async load(cast = CAST, onProgress) {
    const loader = new THREE.GLTFLoader(); loader.setMeshoptDecoder(THREE.MeshoptDecoder);
    const ids = Object.keys(cast); let done = 0;
    const badge = Object.values(cast).some(c => c.badge) ? loader.loadAsync(asset(BADGE_URL)).then(g => g.scene).catch(e => { console.warn('[story3d] the badge did not load; everyone goes without', e); return null; }) : Promise.resolve(null);
    await Promise.all(ids.map(async (id) => {
      const model = (await loader.loadAsync(asset(cast[id].url))).scene;
      this.addBody(id, model, cast[id]); onProgress && onProgress(++done / ids.length);
    }));
    const template = await badge;
    if (template) for (const id of ids) if (cast[id].badge) this.hangBadge(id, template);
    // compile every material now, the lit screens' too, so nothing compiles mid-chapter (a phone hitch)
    try {
      const items = [...this.screens.items.values()];
      for (const it of items) it.mesh.material = it.mat;
      this.renderer.compile(this.scene, this.camera);
      for (const it of items) it.mesh.material = it.off;
    } catch (e) { /* compiling ahead is only a convenience */ }
  }

  hangBadge(id, template) {
    const b = this.bodies[id];
    try {
      const badge = THREE.attachBadge(b.model, b.measure, b.rig.bind, template, { rest: () => b.rig.rest(), label: id });
      if (!badge) return;
      b.model.traverse(n => { if (n.isMesh) { n.castShadow = !this.low; n.frustumCulled = false; } });
      this.addDynamics(id, { step: dt => THREE.swingBadge(badge, dt), reset: () => badge.reset(), name: 'badge' });
    } catch (e) { console.warn(`[story3d] ${id}: the badge could not be hung`, e); }
  }

  /** Something on a person that moves by itself after the pose (a badge's swing, a cloth sim). */
  addDynamics(id, sim) { const b = this.bodies[id]; if (b) b.dynamics.push(sim); }

  addBody(id, model, spec) {
    const rig = new THREE.HumanRig(model), measure = THREE.measureHuman(rig.bind);
    let story = null; model.traverse(n => { if (!story && n.userData && n.userData.storySarah) story = n.userData.storySarah; });
    model.position.set(0, 0, 0); model.rotation.set(0, 0, 0);
    rig.apply(THREE.poseSeated(measure, rig.bind, { style: 'doze', seconds: 0, headSide: 1, arms: 'fold' }, []));
    model.updateMatrixWorld(true);
    const skin = THREE.findSkinnedMesh(model), bones = skin.skeleton.bones, j = measure.joints;
    const w = i => bones[i].getWorldPosition(new THREE.Vector3());
    const hips = w(j.hipL).add(w(j.hipR)).multiplyScalar(0.5);
    // the joint that turns the head itself (the Watch's addBody: the crown's parent when it is not the neck)
    const crownParent = rig.bind[j.head].parent, head = crownParent >= 0 && crownParent !== j.neck ? crownParent : j.head;
    rig.rest(); model.updateMatrixWorld(true);
    model.traverse(n => { if (n.isMesh) { n.frustumCulled = false; n.castShadow = !this.low; n.receiveShadow = !this.low; } });
    // a Sarah v2 story bake carries its own bump, seat corrective and face rig; a toon file does not
    const seat = []; let face = null, carry = spec.carry || 0;
    if (story) {
      carry = Number.isFinite(story.bump) ? story.bump : carry;
      model.traverse(n => {
        const at = n.isMesh && n.morphTargetDictionary ? n.morphTargetDictionary[story.seatMorph || 'storySeat'] : undefined;
        if (at !== undefined) seat.push([n, at]);
        if (n.isMesh) for (const m of [].concat(n.material)) if (m.name === 'sarahHair') THREE.patchHairMaterial(m);
      });
      const fm = [].concat(skin.material).find(m => m.name === 'Material_0');
      if (fm) { THREE.patchFaceRig(fm); face = { mesh: skin, material: fm, motion: new THREE.FaceMotion(7), rest: [0, 0, 0] }; }
    }
    // the finger joints (index, middle, ring, little: three each) and which way each curls
    const fingers = [];
    bones.forEach((bn, i) => { const m = /^(index|middle|ring|pinky)[123]_([LR])$/.exec(bn.name); if (m) fingers.push([i, m[2] === 'L' ? -1 : 1]); });
    this.scene.add(model);
    this.bodies[id] = { fingers, armRoll: spec.armRoll ?? ARM_ROLL, id, model, rig, measure, bones, hips, head, seed: id === 'jack' ? 0.3 : 1.1, seat, face, carry, pregnant: !!spec.pregnant, settled: !!story && !!spec.pregnant, seatH: spec.seat || 0.45, solver: null, dynamics: [] };
  }

  /** a walking step's length in metres (the rig's own stride, in bind units) */
  strideM(id) { const b = this.bodies[id]; return THREE.humanStride(b.measure, 'walk', b.carry) / b.rig.bindScale; }
  /** where a body's bones are, metres (tests and the staging's own checks) */
  bonePoint(id, joint) { const b = this.bodies[id]; return b.bones[b.measure.joints[joint]].getWorldPosition(new THREE.Vector3()); }
  baseMap(b, kind, a, t) {
    const { measure, rig } = b;
    if (kind === 'sit' || kind === 'doze') return toMap(THREE.poseSeated(measure, rig.bind, { style: kind, seconds: t, headSide: 1, arms: b.pregnant ? 'cradle' : 'fold', posture: b.pregnant ? 'pregnant' : undefined, ...(b.settled ? { settled: true, bump: b.carry } : {}) }, []));
    const walking = kind === 'walk';
    const phase = walking ? ((a.walked * rig.bindScale) / THREE.humanStride(measure, 'walk', b.carry)) % 1 : 0;
    // (poseHuman's own `lean` is a sideways roll for a run, -1..1: not this)
    return toMap(THREE.poseHuman(measure, rig.bind, { stance: walking ? 'walk' : 'stand', phase, seconds: t, lean: 0, carry: b.carry }, []));
  }
  /**
   * The Watch's small turns on top of a pose (people3d.js extras), so a body reads as a person:
   * asleep he slumps back into the chair with his head down toward one shoulder; typing leans in
   * so the arms bend instead of locking; a person's head moves with their own line; awake, the
   * neck drifts a little. Each is [joint, quaternion], composed after the pose's own turn.
   */
  extras(b, a, t) {
    const j = { ...b.measure.joints, head: b.head }, L = b.measure.leftSign < 0 ? -1 : 1, out = [];
    const k = a.k < 1 ? smooth(a.k) : 1, w = name => (a.pose === name ? k : 0) + (a.prevPose === name ? 1 - k : 0);
    const asleep = w('doze');
    if (asleep > 0.01) { out.push([j.spine, rx(-9 * DEG * asleep)], [j.neck, rz(L * 12 * DEG * asleep)], [j.head, rz(L * 8 * DEG * asleep)]); }
    if (a.typing) out.push([j.spine, rx((a.pose === 'sit' ? 10 : 6) * DEG)]);
    const awake = 1 - asleep - w('walk');
    if (awake > 0.01) { const s = b.seed, h = Math.sin((2 * Math.PI * t) / (7.3 + s * 1.3) + s) + 0.5 * Math.sin((2 * Math.PI * t) / (3.1 + s * 0.4) + 2 * s); out.push([j.neck, ry(L * 3 * DEG * h * awake)]); }
    // HANGING HANDS face the thighs (Joshua, 2026-11-10: "the hands doing weird twists at the
    // wrists"): on the toon rigs a standing or walking arm hangs palm forward with the fingers
    // spread, which reads as a wrist turned the wrong way. The whole arm turns in from the
    // shoulder, about its own length (CAST armRoll, measured per model; left and right mirrored), so neither the elbow nor the wrist is wrung. A
    // hand that holds something is the reach's again (it replaces the arm's turns).
    const upright = w('stand') + w('walk');
    if (upright > 0.01) {
      const AR = [b.armRoll, b.armRoll];
      for (const [sh, el, deg] of [[j.shoulderL, j.elbowL, AR[0]], [j.shoulderR, j.elbowR, -AR[1]]]) {
        // about the upper arm's OWN bind direction (the toon rigs are modelled arms-angled-down, so a
        // turn about the body's side-to-side axis would swing the arm, not turn it in place)
        const B = b.rig.bind, dx = B[el].x - B[sh].x, dy = B[el].y - B[sh].y, dz = B[el].z - B[sh].z, n = Math.hypot(dx, dy, dz) || 1;
        out.push([sh, qAxis(dx / n, dy / n, dz / n, deg * DEG * upright)]);
      }
    }
    // and the fingers rest a little curled, not splayed (each finger's three joints)
    for (const [bone, sg] of b.fingers) out.push([bone, rz(sg * L * FINGER_CURL * DEG)]);
    if (a.talking && asleep < 0.5) { const s = b.seed; out.push([j.head, rx(3.5 * DEG * Math.sin(t * 2 * Math.PI * 1.6 + s))], [j.neck, ry(L * 3 * DEG * Math.sin(t * 2 * Math.PI * 0.55 + 2 * s))]); }
    return out;
  }
  rootFor(b, kind, a) {
    const yaw = a.yaw, c = Math.cos(yaw), s = Math.sin(yaw), rot = (x, z) => [x * c + z * s, -x * s + z * c];
    if (kind !== 'sit' && kind !== 'doze') return [a.at[0], 0, a.at[1]];
    // seated: her hips' midpoint just ahead of the back of the seat, on its cushion
    const back = rot(0, kind === 'doze' ? 0.07 : 0.02), hip = rot(b.hips.x, b.hips.z);
    return [a.at[0] + back[0] - hip[0], (a.seat || b.seatH) + 0.1 - b.hips.y, a.at[1] + back[1] - hip[1]];
  }

  // a: { at:[x,z], yaw, pose, prevPose, k, walked, look:[x,y,z]|null, hands:[{side,at}], talking, nod }
  pose(id, a, t, steady, dt) {
    const b = this.bodies[id]; if (!b) return;
    if (!a || !a.visible) { b.model.visible = false; return; } b.model.visible = true;
    const { measure, rig } = b; const seated = a.pose === 'sit' || a.pose === 'doze';
    let map = this.baseMap(b, a.pose, a, t);
    let root = this.rootFor(b, a.pose, a);
    if (a.k < 1 && a.prevPose && a.prevPose !== a.pose) {
      const k = smooth(a.k), m0 = this.baseMap(b, a.prevPose, a, t), r0 = this.rootFor(b, a.prevPose, { ...a, at: a.prevAt || a.at, yaw: a.prevYaw ?? a.yaw });
      map = blend(m0, map, k); root = r0.map((v, i) => v + (root[i] - v) * k);
    }
    for (const [joint, q] of this.extras(b, a, t)) if (joint >= 0) map.set(joint, qMul(map.get(joint) || ID, q));
    const turns = toTurns(map);
    const sv = (!steady || !b.solver) ? (b.solver = { feet: THREE.createFeet(measure, rig.bind, -1), aim: THREE.createAim(measure, rig.bind, -1), reach: THREE.createReach(measure, rig.bind, -1), ft: [], at: [], rt: [] }, null) : b.solver;
    const S = b.solver, fresh = sv === null;
    const footing = { dt: fresh ? 0 : dt, released: seated || (a.k < 1 && (a.prevPose === 'sit' || a.pose === 'sit' || a.prevPose === 'doze')), rootX: root[0], rootY: root[1], rootZ: root[2], rootYaw: a.yaw, unitsPerMetre: rig.bindScale, groundAt: () => ({ y: 0, grip: 1 }) };
    if (fresh) for (let i = 0; i < 8; i++) THREE.groundFeet(S.feet, measure, rig.bind, turns, { ...footing, dt: 0.05 }, S.ft);
    const grounded = THREE.groundFeet(S.feet, measure, rig.bind, turns, footing, S.ft);
    const rootY = root[1] - grounded.rootDrop;
    const frame = { rootX: root[0], rootY, rootZ: root[2], rootYaw: a.yaw, unitsPerMetre: rig.bindScale };
    const target = a.look ? { x: a.look[0], y: a.look[1], z: a.look[2] } : null;
    // a hand target may be on another person (a hand on his shoulder): read from his bone as he
    // is posed this frame (he is posed first), so it neither floats nor sinks into him
    const hands = (a.hands || []).map(h => {
      let at = h.at;
      if (h.bone) { const p = this.bonePoint(h.bone[0], h.bone[1]); const o = h.offset || [0, 0, 0]; at = [p.x + o[0], p.y + o[1], p.z + o[2]]; }
      return { side: h.side, x: at[0], y: at[1], z: at[2], kind: h.kind || 'press', palm: h.palm || { x: 0, y: -1, z: 0 } };
    });
    // a free seated hand rests on its thigh (humanReach rule 4) -- but asleep, his folded arms are
    // the pose's own, so a doze is not "seated" for the hands
    const handsSeated = a.pose === 'sit' && !(a.prevPose === 'doze' && a.k < 1);
    // A LEAN (degrees forward) bends the whole back after the look is aimed -- the aim's closed
    // loop would otherwise straighten it to keep the eyes on target -- three fifths low, two
    // fifths at the chest, and the neck gives back about half so the eyes stay on what she reads.
    const J = measure.joints;
    const leaned = (turns) => {
      if (!a.lean) return turns;
      // (measured on the toon rig: this carries her head forward over what she reads; her arms'
      // reach is re-solved from the clavicle, so a hand's reach is staged by where she stands)
      const m = toMap(turns), L = a.lean * DEG;
      for (const [joint, q] of [[J.spine, rx(L * 0.6)], [J.chest, rx(L * 0.4)], [J.neck, rx(-L * 0.45)]]) if (joint >= 0) m.set(joint, qMul(m.get(joint) || ID, q));
      return toTurns(m);
    };
    const solve = d => { const aimed = THREE.aimBody(S.aim, measure, rig.bind, grounded.turns, { ...frame, dt: d, target, bodyFree: false, weight: 1 }, S.at); return THREE.reachHands(S.reach, measure, rig.bind, leaned(aimed.turns), { ...frame, dt: d, seated: handsSeated, hands }, S.rt); };
    // After a seek, a hand is solved as if it had come in from a little above its target, the way
    // it does in playback (the reach takes hold only under 85% of the arm, keeps it to 90%): so a
    // seek lands on the same pose as playing through.
    let out;
    if (fresh) {
      const lifted = hands.map(h => ({ ...h, y: h.y + 0.07 }));
      for (let i = 0; i < 14; i++) { const use = i < 6 ? lifted : hands; const aimed = THREE.aimBody(S.aim, measure, rig.bind, grounded.turns, { ...frame, dt: 0.05, target, bodyFree: false, weight: 1 }, S.at); out = THREE.reachHands(S.reach, measure, rig.bind, leaned(aimed.turns), { ...frame, dt: 0.05, seated: handsSeated, hands: use }, S.rt); }
    } else out = solve(dt);
    rig.apply(out.turns);
    b.reached = out;   // the reach's own report of each hand (tests read whether a hand holds its target)
    b.model.position.set(root[0], rootY, root[2]); b.model.rotation.set(0, a.yaw, 0); b.model.updateMatrixWorld(true);
    for (const [mesh, idx] of b.seat) mesh.morphTargetInfluences[idx] = seated ? (a.prevPose && a.prevPose !== a.pose ? smooth(a.k) : 1) : (a.prevPose === 'sit' ? 1 - smooth(a.k) : 0);
    if (b.face) {
      const F = b.face, M = F.motion; M.talking = !!a.talking; M.blinking = a.pose !== 'doze';
      const tgt = target ? THREE.restFromWorld(F.mesh, new THREE.Vector3(...a.look), F.rest) : null;
      M.mode = tgt ? 'camera' : 'around';
      if (fresh) for (let i = 0; i < 10; i++) M.step(0.05, tgt); else M.step(Math.min(0.25, dt), tgt);
      THREE.setFaceRig(F.material, { jaw: M.jaw, gazeRight: M.gazeRight, gazeLeft: M.gazeLeft, blink: a.pose === 'doze' ? 1 : M.blink });
    }
    // after the pose: the dynamics, on the story clock
    for (const sim of b.dynamics) {
      if (steady && dt > 0 && dt < 0.5) sim.step(dt);
      else if (!steady || dt !== 0) { sim.reset(); if (sim.settle) sim.settle(30); }
    }
  }

  /**
   * A tablet TUCKED against her side under her forearm ("tablet tucked beneath one arm"): its long
   * edge along the forearm, its screen turned to her, between the arm and her side -- outside the
   * body, so it is seen (Joshua, 2026-11-10: "only when she was supposed to place the tablet on the
   * desk, did it suddenly appear"). The hand holds its far corner (ch1.js 'carry').
   */
  tuckPose(id, side = 'R') {
    const b = this.bodies[id], j = b.measure.joints, w = i => b.bones[i].getWorldPosition(new THREE.Vector3());
    const el = w(side === 'R' ? j.elbowR : j.elbowL), wr = w(side === 'R' ? j.wristR : j.wristL);
    const yaw = b.model.rotation.y, f = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw)), left = new THREE.Vector3(f.z, 0, -f.x);
    const out = side === 'R' ? left.clone().negate() : left;
    const T = [TUCK_ALONG, TUCK_IN, 0, TUCK_TURN];
    const x = wr.clone().sub(el); x.addScaledVector(out, -x.dot(out)); if (x.lengthSq() < 1e-6) x.copy(f); x.normalize();
    // (turned out toward the front a little, so it reads from the front as well as the side)
    const turn = (side === 'R' ? 1 : -1) * T[3] * DEG; x.applyAxisAngle(new THREE.Vector3(0, 1, 0), turn); out.applyAxisAngle(new THREE.Vector3(0, 1, 0), turn);
    const y = out.clone().negate(), z = new THREE.Vector3().crossVectors(x, y).normalize(); x.crossVectors(y, z).normalize();
    const p = el.clone().lerp(wr, T[0]).addScaledVector(out, -T[1]).addScaledVector(z, T[2]);
    return { p, q: new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z)) };
  }
  /** a flat thing held in the hand, palm down: its near edge under her fingertips, laid the way she faces */
  inHand(id, side = 'R', depth = 0.175) {
    const b = this.bodies[id], j = b.measure.joints;
    const tip = b.bones.find(x => x.name === (side === 'R' ? 'middle4_R' : 'middle4_L')) || b.bones[side === 'R' ? j.wristR : j.wristL];
    const p = tip.getWorldPosition(new THREE.Vector3()), yaw = b.model.rotation.y;
    p.x += Math.sin(yaw) * depth / 2; p.z += Math.cos(yaw) * depth / 2; p.y -= 0.021;
    return { p, yaw };
  }

  setChair(id, c) {
    const g = this.chairs.get(id); if (!g) return;
    g.position.set(c.at[0], 0, c.at[1]); g.rotation.y = c.yaw;
    if (Math.abs(g.seatTop - (c.seat || 0.47)) > 1e-3) g.setSeat(c.seat || 0.47);
  }

  // Draw one frame of a scene state. S: { t, actors:{jack,sarah}, chairs:{id:{at,yaw,seat}}, tablet, screens, lamp, doors, mode, alarm, camera, markers }
  draw(S, w, h) {
    const t = S.t, dt = this.lastT === null ? 0 : t - this.lastT;
    const steady = this.lastT !== null && dt >= 0 && dt < 0.25 && !this.forceFresh;
    this.forceFresh = false;
    if (this.size !== w + 'x' + h) { this.renderer.setSize(w, h, false); this.size = w + 'x' + h; } this.camera.aspect = w / h;
    for (const [id, c] of Object.entries(S.chairs)) this.setChair(id, c);
    for (const id of Object.keys(this.bodies)) this.pose(id, S.actors[id], t, steady, dt);
    // the tablet: on a desk, in her hand, or tucked under her arm; `from` and k ease it from one
    // place to the next (picked up from the desk, tucked, drawn out to be set down)
    const tb = S.tablet;
    if (this.tablet && tb) {
      const who = this.bodies[tb.who], held = tb.on !== 'desk' && who && who.model.visible;
      const place = (src) => {
        if (src === 'tuck') return this.tuckPose(tb.who, tb.side || 'R');
        if (src === 'hand') { const h = this.inHand(tb.who, tb.side || 'R'); return { p: h.p, q: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, h.yaw + Math.PI, 0)) }; }
        const at = tb.fromAt || tb.at; return { p: new THREE.Vector3(at[0], at[1], at[2]), q: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, tb.fromYaw ?? tb.yaw ?? 0, 0)) };
      };
      if (!held) { this.tablet.position.set(tb.at[0], tb.at[1], tb.at[2]); this.tablet.rotation.set(0, tb.yaw || 0, 0); }
      else {
        const B = place(tb.on), k = smooth(tb.k ?? 1);
        if (tb.from && k < 1) { const A = place(tb.from); B.p.copy(A.p.lerp(B.p, k)); B.q.copy(A.q.slerp(B.q, k)); }
        this.tablet.position.copy(B.p); this.tablet.quaternion.copy(B.q);
      }
    }
    // screens and the glow each desk throws
    if (S.screens) {
      this.screens.update(S.screens, t);
      for (const [desk, glow] of this.building.dressing.glows) {
        const k = [0, 1].map(i => S.screens[`${desk}:${i}`]?.kind).find(k => k && GLOW[k]);
        // (only its intensity changes: a light switched off would recompile every material)
        if (k) { glow.color.setHex(GLOW[k]); glow.intensity = k === 'red' || k === 'revoked' || k === 'denied' ? 1.4 : 1.0; } else glow.intensity = 0;
        const ring = this.building.dressing.powers.get(desk); if (ring) ring.visible = [0, 1].some(i => (S.screens[`${desk}:${i}`]?.kind || 'off') !== 'off');
      }
    }
    if (this.lamp) this.lamp.on = S.lamp !== false;
    // doors and mode (the lab animates its doors; a jump in time settles them at once)
    for (const [id, open] of Object.entries(S.doors)) this.labState.setDoor(id, open);
    if (this.labState.mode !== S.mode) this.labState.setMode(S.mode);
    this.building.update(steady ? Math.max(0, dt) : 5, this.labState);
    this.alarm.intensity = S.alarm;
    // camera
    const C = S.camera; this.camera.fov = C.vfov; this.camera.updateProjectionMatrix();
    this.camera.position.set(...C.pos); this.camera.up.set(0, 1, 0); this.camera.lookAt(new THREE.Vector3(...C.look));
    this.building.setRoof(!C.overhead);
    this.overheadFill.intensity = C.overhead ? 1.6 : 0;
    // tracker markers, overhead only
    this.markers.grp.visible = !!C.overhead;
    if (C.overhead) for (const id of ['jack', 'sarah']) {
      const M = this.markers[id], a = S.actors[id], mk = S.markers[id];
      M.g.visible = !!(a && a.visible);
      if (!M.g.visible) { M.dots.forEach(d => (d.material.opacity = 0)); continue; }
      M.g.position.set(a.at[0], 0.06, a.at[1]); M.g.rotation.y = a.yaw;
      M.glow.material.opacity = a.talking ? 0.45 : 0;
      M.dots.forEach((d, i) => { const p = mk.trail[i]; if (!p) { d.material.opacity = 0; return; } d.position.set(p[0], 0.05, p[1]); d.material.opacity = 0.75 * p[2]; });
    }
    this.renderer.render(this.scene, this.camera);
    this.lastT = t;
  }

  dispose() {
    this.screens.dispose(); this.building.dispose();
    try { this.renderer.dispose(); this.renderer.forceContextLoss(); } catch (e) {}
  }
}
