// THE STAGE: the procedural TOMBS lab (tombs-lab) with the approved Jack and Sarah models,
// posed by the Watch tab's own rig code (visual/vendor/three-human.js). The stage draws a
// SCENE STATE it is handed (where everyone is, how they sit, what they hold, which camera);
// it decides nothing about the story.
import * as THREE from 'three';
import { buildLab, LabState } from '../../../tombs-lab/src/tombs/index.ts';

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
function blend(a, b, k) { if (k >= 1) return b; const o = new Map(); for (const j of new Set([...a.keys(), ...b.keys()])) o.set(j, qSlerp(a.get(j) || ID, b.get(j) || ID, k)); return o; }

export class Stage {
  constructor(canvasHost) {
    const r = this.renderer = new THREE.WebGLRenderer({ antialias: true });
    r.setPixelRatio(Math.min(2, devicePixelRatio || 1)); r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.12;
    canvasHost.appendChild(r.domElement);
    const scene = this.scene = new THREE.Scene(); scene.background = new THREE.Color(0x101d2d); scene.fog = new THREE.Fog(0x101d2d, 40, 160);
    const sun = new THREE.DirectionalLight(0xc3e3ff, 2); sun.position.set(-18, 32, 24); scene.add(sun);
    scene.add(new THREE.HemisphereLight(0xd5e9f4, 0x40505b, 0.9));
    this.labState = new LabState(); this.labState.setMode('night');
    this.building = buildLab(this.labState); scene.add(this.building.group); this.building.setLabels(false);
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.02, 400);
    this.bodies = {}; this.chairs = {}; this.lastT = null;
    this.hideInstances();
    this.makeChairs();
    this.tablet = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.012, 0.18), new THREE.MeshStandardMaterial({ color: 0x1b2633, roughness: 0.4, metalness: 0.3, emissive: 0x2a6f9a, emissiveIntensity: 0.25 }));
    scene.add(this.tablet);
    this.alarm = new THREE.PointLight(0xff3030, 0, 9, 2); this.alarm.position.set(-13.5, 2.9, -10.3); scene.add(this.alarm);
    this.markers = this.makeMarkers();
  }

  // The lab's own chairs and Sarah's tablet are instanced and fixed; the story moves them, so
  // they are hidden here and drawn as objects of their own.
  hideInstances() {
    const m4 = new THREE.Matrix4(), p = new THREE.Vector3(), q = new THREE.Quaternion(), sc = new THREE.Vector3();
    const chairsAt = [[-13, -11.55], [-15.3, -11.55], [15.55, -10.4]];
    this.building.group.traverse(o => {
      if (!o.isInstancedMesh) return;
      if (/batch:chair$/.test(o.name)) this.chairMat = o.material;
      if (/batch:metal$/.test(o.name)) this.metalMat = o.material;
      let hit = false;
      for (let i = 0; i < o.count; i++) {
        o.getMatrixAt(i, m4); m4.decompose(p, q, sc);
        const chair = /batch:(chair|metal)$/.test(o.name) && p.y < 1.3 && chairsAt.some(([x, z]) => Math.abs(p.x - x) < 0.4 && Math.abs(p.z - z) < 0.4);
        const tablet = /batch:console$/.test(o.name) && Math.abs(p.x - 16.3) < 0.05 && Math.abs(p.z + 9.75) < 0.05 && sc.y < 0.05;
        if (chair || tablet) { sc.set(1e-5, 1e-5, 1e-5); m4.compose(p, q, sc); o.setMatrixAt(i, m4); hit = true; }
      }
      if (hit) o.instanceMatrix.needsUpdate = true;
    });
  }

  makeChairs() {
    for (const id of ['jackChair', 'secondChair', 'sarahChair']) {
      const g = new THREE.Group(), W = 0.62, D = 0.6;
      const box = (mat, x, y, z, sx, sy, sz) => { const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat); m.position.set(x, y, z); g.add(m); return m; };
      box(this.metalMat, 0, 0.03, 0, W * 0.75, 0.04, D * 0.75);
      const column = box(this.metalMat, 0, 0.25, 0, 0.06, 0.4, 0.06);
      const seat = box(this.chairMat, 0, 0.48, 0, W * 0.9, 0.08, D * 0.9);
      const back = box(this.chairMat, 0, 0.82, -D / 2 + 0.06, W * 0.85, 0.55, 0.07);
      g.userData = { column, seat, back };
      this.scene.add(g); this.chairs[id] = g;
    }
  }
  setChair(id, c) {
    const g = this.chairs[id]; g.position.set(c.at[0], 0, c.at[1]); g.rotation.y = c.yaw;
    const top = c.seat || 0.45, { column, seat, back } = g.userData;
    seat.position.y = top - 0.04; column.scale.y = (top - 0.09) / 0.4; column.position.y = 0.05 + (top - 0.09) / 2; back.position.y = top + 0.30;
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

  async load(urls, onProgress) {
    const loader = new THREE.GLTFLoader(); loader.setMeshoptDecoder(THREE.MeshoptDecoder);
    let done = 0; const n = Object.keys(urls).length;
    await Promise.all(Object.entries(urls).map(async ([id, url]) => {
      const model = (typeof url === 'function' ? await loader.parseAsync(await url(), '') : await loader.loadAsync(url)).scene; this.addBody(id, model, { pregnant: id === 'sarah' }); onProgress && onProgress(++done / n);
    }));
  }

  addBody(id, model, opts) {
    const rig = new THREE.HumanRig(model), measure = THREE.measureHuman(rig.bind);
    let story = null; model.traverse(n => { if (!story && n.userData && n.userData.storySarah) story = n.userData.storySarah; });
    model.position.set(0, 0, 0); model.rotation.set(0, 0, 0);
    rig.apply(THREE.poseSeated(measure, rig.bind, { style: 'doze', seconds: 0, headSide: 1, arms: 'fold' }, []));
    model.updateMatrixWorld(true);
    const skin = THREE.findSkinnedMesh(model), bones = skin.skeleton.bones, j = measure.joints;
    const w = i => bones[i].getWorldPosition(new THREE.Vector3());
    const crownParent = rig.bind[j.head].parent; const head = crownParent >= 0 && crownParent !== j.neck ? crownParent : j.head;
    const hips = w(j.hipL).add(w(j.hipR)).multiplyScalar(0.5);
    const ankleDoze = Math.min(w(j.ankleL).y, w(j.ankleR).y);
    const naturalSeat = Math.min(0.55, Math.max(0.4, hips.y - ankleDoze + 0.08 - 0.1));
    rig.rest(); model.updateMatrixWorld(true);
    const standAnkle = Math.min(w(j.ankleL).y, w(j.ankleR).y);
    model.traverse(n => { if (n.isMesh) n.frustumCulled = false; });
    const seat = []; let face = null, carry = 0;
    if (story) {
      carry = Number.isFinite(story.bump) ? story.bump : 0;
      model.traverse(n => {
        const at = n.isMesh && n.morphTargetDictionary ? n.morphTargetDictionary[story.seatMorph || 'storySeat'] : undefined;
        if (at !== undefined) seat.push([n, at]);
        if (n.isMesh) for (const m of [].concat(n.material)) if (m.name === 'sarahHair') THREE.patchHairMaterial(m);
      });
      const fm = [].concat(skin.material).find(m => m.name === 'Material_0');
      if (fm) { THREE.patchFaceRig(fm); face = { mesh: skin, material: fm, motion: new THREE.FaceMotion(7), rest: [0, 0, 0], t: null }; }
    }
    this.scene.add(model);
    this.bodies[id] = { id, model, rig, measure, bones, head, hips, standAnkle, naturalSeat, seatUsed: naturalSeat, seat, face, carry, pregnant: !!opts.pregnant, solver: null, lift: 0 };
  }

  // a walking step's length in metres (the rig's own stride, in bind units)
  strideM(id) { const b = this.bodies[id]; return THREE.humanStride(b.measure, 'walk', b.carry) / b.rig.bindScale; }
  // test hook: ankle heights over one gait cycle, to find where each foot lands
  gaitProbe(id) {
    const b = this.bodies[id], j = b.measure.joints, out = [], L = this.strideM(id);
    for (let i = 0; i < 40; i++) { const ph = i / 40; const m = this.baseMap(b, 'walk', { walked: ph * L }, 0); b.rig.apply(toTurns(m)); b.model.position.set(0, 0, 0); b.model.rotation.set(0, 0, 0); b.model.updateMatrixWorld(true);
      const y = k => b.bones[k].getWorldPosition(new THREE.Vector3()); const l = y(j.ankleL), r = y(j.ankleR); out.push([ph, +l.y.toFixed(3), +r.y.toFixed(3), +l.z.toFixed(3), +r.z.toFixed(3)]); }
    return { strideM: L, out };
  }
  baseMap(b, kind, a, t) {
    const { measure, rig } = b;
    if (kind === 'sit' || kind === 'doze') return toMap(THREE.poseSeated(measure, rig.bind, { style: kind, seconds: t, headSide: 1, arms: b.pregnant ? 'cradle' : 'fold', posture: b.pregnant ? 'pregnant' : undefined, ...(b.pregnant ? { settled: true, bump: b.carry } : {}) }, []));
    const walking = kind === 'walk';
    const phase = walking ? ((a.walked * rig.bindScale) / THREE.humanStride(measure, 'walk', b.carry)) % 1 : 0;
    return toMap(THREE.poseHuman(measure, rig.bind, { stance: walking ? 'walk' : 'stand', phase, seconds: t, lean: 0, carry: b.carry }, []));
  }
  rootFor(b, kind, a) {
    const yaw = a.yaw, c = Math.cos(yaw), s = Math.sin(yaw), rot = (x, z) => [x * c + z * s, -x * s + z * c];
    if (kind !== 'sit' && kind !== 'doze') return [a.at[0], 0, a.at[1]];
    const back = rot(0, -0.04), hip = rot(b.hips.x, b.hips.z);
    return [a.at[0] + back[0] - hip[0], b.seatUsed + 0.1 - b.hips.y, a.at[1] + back[1] - hip[1]];
  }

  // a: { at:[x,z], yaw, pose, prevPose, k, walked, look:[x,y,z]|null, hands:[{side,at}], talking }
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
    const turns = toTurns(map);
    const sv = (!steady || !b.solver) ? (b.solver = { feet: THREE.createFeet(measure, rig.bind, -1), aim: THREE.createAim(measure, rig.bind, -1), reach: THREE.createReach(measure, rig.bind, -1), ft: [], at: [], rt: [] }, null) : b.solver;
    const S = b.solver, fresh = sv === null;
    const footing = { dt: fresh ? 0 : dt, released: seated || (a.k < 1 && (a.prevPose === 'sit' || a.pose === 'sit')), rootX: root[0], rootY: root[1], rootZ: root[2], rootYaw: a.yaw, unitsPerMetre: rig.bindScale, groundAt: () => ({ y: 0, grip: 1 }) };
    if (fresh) for (let i = 0; i < 8; i++) THREE.groundFeet(S.feet, measure, rig.bind, turns, { ...footing, dt: 0.05 }, S.ft);
    const grounded = THREE.groundFeet(S.feet, measure, rig.bind, turns, footing, S.ft);
    const rootY = root[1] - grounded.rootDrop;
    const frame = { rootX: root[0], rootY, rootZ: root[2], rootYaw: a.yaw, unitsPerMetre: rig.bindScale };
    const target = a.look ? { x: a.look[0], y: a.look[1], z: a.look[2] } : null;
    const hands = (a.hands || []).map(h => ({ side: h.side, x: h.at[0], y: h.at[1], z: h.at[2], kind: h.kind || 'press', palm: h.palm || { x: 0, y: -1, z: 0 } }));
    const solve = d => { const aimed = THREE.aimBody(S.aim, measure, rig.bind, grounded.turns, { ...frame, dt: d, target, bodyFree: false, weight: 1 }, S.at); return THREE.reachHands(S.reach, measure, rig.bind, aimed.turns, { ...frame, dt: d, seated, hands }, S.rt); };
    let out; if (fresh) for (let i = 0; i < 12; i++) out = solve(0.05); else out = solve(dt);
    rig.apply(out.turns);
    b.model.position.set(root[0], rootY, root[2]); b.model.rotation.set(0, a.yaw, 0); b.model.updateMatrixWorld(true);
    for (const [mesh, idx] of b.seat) mesh.morphTargetInfluences[idx] = seated ? (a.prevPose && a.prevPose !== a.pose ? smooth(a.k) : 1) : (a.prevPose === 'sit' ? 1 - smooth(a.k) : 0);
    if (b.face) {
      const F = b.face, M = F.motion; M.talking = !!a.talking; M.blinking = a.pose !== 'doze';
      const tgt = target ? THREE.restFromWorld(F.mesh, new THREE.Vector3(...a.look), F.rest) : null;
      M.mode = tgt ? 'camera' : 'around';
      if (fresh) for (let i = 0; i < 10; i++) M.step(0.05, tgt); else M.step(Math.min(0.25, dt), tgt);
      THREE.setFaceRig(F.material, { jaw: M.jaw, gazeRight: M.gazeRight, gazeLeft: M.gazeLeft, blink: a.pose === 'doze' ? 1 : M.blink });
    }
  }

  // where a body's left armpit is, for a tablet tucked under that arm
  underArm(id) {
    const b = this.bodies[id], j = b.measure.joints, w = i => b.bones[i].getWorldPosition(new THREE.Vector3());
    const sh = w(j.shoulderL), el = w(j.elbowL), chest = w(j.chest);
    const p = sh.clone().lerp(el, 0.55).lerp(chest, 0.25);
    return { p, yaw: b.model.rotation.y };
  }

  // Draw one frame of a scene state. S: { t, actors:{jack,sarah}, chairs:{...}, tablet, doors, mode, alarm, camera, overhead, markers }
  draw(S, w, h) {
    const t = S.t, dt = this.lastT === null ? 0 : t - this.lastT;
    const steady = this.lastT !== null && dt >= 0 && dt < 0.25 && !this.forceFresh;
    this.forceFresh = false;
    if (this.size !== w + 'x' + h) { this.renderer.setSize(w, h, false); this.size = w + 'x' + h; } this.camera.aspect = w / h;
    for (const [id, c] of Object.entries(S.chairs)) this.setChair(id, c);
    for (const id of ['jack', 'sarah']) {
      const a = S.actors[id], b = this.bodies[id]; if (!b) continue;
      if (a && a.seat) b.seatUsed = a.seat;
      this.pose(id, a, t, steady, dt);
    }
    // tablet
    const tb = S.tablet;
    if (tb.on === 'arm' && this.bodies[tb.who] && this.bodies[tb.who].model.visible) {
      const { p, yaw } = this.underArm(tb.who); this.tablet.position.copy(p); this.tablet.rotation.set(0, yaw, Math.PI / 2 - 0.15, 'YXZ');
    } else { this.tablet.position.set(tb.at[0], tb.at[1] + 0.006, tb.at[2]); this.tablet.rotation.set(0, tb.yaw || 0, 0); }
    // doors and mode (the lab animates its doors; a jump in time settles them at once)
    for (const [id, open] of Object.entries(S.doors)) this.labState.setDoor(id, open);
    if (this.labState.mode !== S.mode) this.labState.setMode(S.mode);
    this.building.update(steady ? Math.max(0, dt) : 5, this.labState);
    this.alarm.intensity = S.alarm;
    // camera
    const C = S.camera; this.camera.fov = C.vfov; this.camera.updateProjectionMatrix();
    this.camera.position.set(...C.pos); this.camera.up.set(0, 1, 0); this.camera.lookAt(new THREE.Vector3(...C.look));
    this.building.setRoof(!C.overhead);
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
}
