// THE PEOPLE IN 3D (Joshua, 2026-09-29: "I was wanting to replace the 2D storyboard with the
// 3D models", and, asked how: "Both, switchable"). Jack and Sarah are the real rigged
// models from TRADDOMIUM: Micro Battle (assets/models/jack.glb, sarah.glb -- that game's
// pair, the ones the 2D sprites were drawn from), posed by that game's own rig code
// (vendor/three-human.js, bundled from its src/actor and src/view), and drawn in the
// painted picture by the picture's own camera.
//
// THE ROOM is built (engine/labRoom.js, after ChatGPT's procedural lab) in the layout the
// scene has always been staged in, and seen through the camera the lab picture was painted
// from: 1300 px focal length on the original frame, level, 1.43 m up, turned 5.2 degrees off
// the room's axis. So a floor point in the scene's stage coordinates is a floor point in the
// room, and a flat shot is that camera cropped. A shot with `cam3` moves the camera for
// real. The room is drawn twice: in its own canvas under the story's screens, and as depth
// among the people, so a desk or a monitor hides whatever is behind it.
//
// SWITCHABLE: `?people=2d` (or the menu) puts the drawn sprites back; the scene is the
// same either way, and a shot with `cam3` falls back to its flat framing.
//
// Units are metres in the ROOM FRAME: x right, y up, z toward the picture's camera, the
// floor at y = 0 and that camera at (0, height, 0).

import * as THREE from "../vendor/three-human.js";
import { envelope } from "./gestures.js";
import { quadMatrix3d } from "./homography.js";
import { buildLabRoom } from "./labRoom.js";
import { buildControlRoom, buildCorridor } from "./controlRoom.js";
import { buildOutdoors } from "./outdoors.js";
import { Creatures } from "./creatures.js";

// The built rooms a set can stand its people in (its `people3d.room`; the lab by default).
const ROOMS = { lab: buildLabRoom, control: buildControlRoom, corridor: buildCorridor, outdoors: buildOutdoors };

const DEG = Math.PI / 180;
const smooth = (p) => (p <= 0 ? 0 : p >= 1 ? 1 : p * p * (3 - 2 * p));
// Which way a body faces for each of the scene's compass directions, as three's rotation.y
// (the models face +z, toward the camera). North is into the picture.
const FACING = { south: 0, southeast: Math.PI / 4, east: Math.PI / 2, northeast: (3 * Math.PI) / 4, north: Math.PI, northwest: (-3 * Math.PI) / 4, west: -Math.PI / 2, southwest: -Math.PI / 4 };
const TURN_SECONDS = 0.45; // a change of facing, as a turn rather than a cut
const BLEND_SECONDS = 0.55; // a change of pose or state (asleep to awake, sitting to standing)
// A walk's phase is advanced by DISTANCE, never by time (TRADDOMIUM's Walker says why: a
// phase run by the clock takes the same stride at any speed, so the planted foot slides).
// The stride is the pose's own (humanStride, in bind units, rig.bindScale of them to the
// metre), so the foot on the floor stays where it was put.
const FLOOR = { y: 0, grip: 1 }; // the lab's floor, level and dry, under every foot
const CHAIR_CLAIM_M = 0.7; // someone sitting down this close to a parked chair takes it

// ------------------------------------------------------------------ small quaternion kit
// [x, y, z, w]; the rig's turns are axis-angle in the bind pose's world frame.
const qAxis = (x, y, z, a) => { const s = Math.sin(a / 2); return [x * s, y * s, z * s, Math.cos(a / 2)]; };
const qMul = (a, b) => [
  a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
  a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
  a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
  a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
];
const rx = (a) => qAxis(1, 0, 0, a), ry = (a) => qAxis(0, 1, 0, a), rz = (a) => qAxis(0, 0, 1, a);
function qSlerp(a, b, t) {
  let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  const s = d < 0 ? -1 : 1;
  d *= s;
  if (d > 0.9995) {
    const o = a.map((v, i) => v + (s * b[i] - v) * t), n = Math.hypot(...o);
    return o.map((v) => v / n);
  }
  const th = Math.acos(d), k0 = Math.sin((1 - t) * th) / Math.sin(th), k1 = (s * Math.sin(t * th)) / Math.sin(th);
  return a.map((v, i) => v * k0 + b[i] * k1);
}
function toMap(turns) {
  const m = new Map();
  for (const t of turns) if (t.joint >= 0) m.set(t.joint, qAxis(t.ax, t.ay, t.az, t.radians));
  return m;
}
function toTurns(map) {
  const out = [];
  for (const [joint, q0] of map) {
    let [x, y, z, w] = q0;
    if (w < 0) { x = -x; y = -y; z = -z; w = -w; }
    const s = Math.hypot(x, y, z);
    out.push(s < 1e-9 ? { joint, ax: 0, ay: 1, az: 0, radians: 0 } : { joint, ax: x / s, ay: y / s, az: z / s, radians: 2 * Math.atan2(s, w) });
  }
  return out;
}
const IDENTITY = [0, 0, 0, 1];
function blendMaps(a, b, k) {
  if (k >= 1) return b;
  const out = new Map();
  for (const j of new Set([...a.keys(), ...b.keys()])) out.set(j, qSlerp(a.get(j) || IDENTITY, b.get(j) || IDENTITY, k));
  return out;
}
// A SKIRT THAT SITS DOWN. Sarah's skirt is weighted to whichever leg bone is nearest, so
// when her thighs come level it tears between them into points at the knees. This is
// ChatGPT's correction (TMB-Interactive-Story, app/game/three/seated-skin.ts), by joint
// rather than by bone name: below the hips, each vertex's weights are blended toward bands
// down the leg on its own side -- the pelvis at the top, then thigh, shin and foot -- so the
// cloth follows the legs smoothly. The GLB is untouched; the rest shape is unchanged, and
// nothing above 0.98 m is.
function smoothSkirt(root, j) {
  const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  root.updateMatrixWorld(true);
  root.traverse((o) => {
    if (!o.isSkinnedMesh) return;
    o.skeleton.update();
    const g = o.geometry, P = g.getAttribute("position"), J0 = g.getAttribute("skinIndex"), W0 = g.getAttribute("skinWeight");
    const J = new Uint16Array(P.count * 4), Wt = new Float32Array(P.count * 4), v = new THREE.Vector3();
    for (let i = 0; i < P.count; i++) {
      v.fromBufferAttribute(P, i);
      o.applyBoneTransform(i, v);
      v.applyMatrix4(o.matrixWorld);
      const y = v.y, amount = 1 - sm(0.86, 0.98, y), sum = new Map();
      const add = (b, w) => { if (b >= 0 && w > 0) sum.set(b, (sum.get(b) || 0) + w); };
      for (let k = 0; k < 4; k++) add(J0.getComponent(i, k), W0.getComponent(i, k) * (1 - amount));
      if (amount > 0) {
        const hip = sm(0.79, 0.94, y), knee = sm(0.38, 0.57, y), ankle = sm(0.065, 0.17, y), right = sm(-0.045, 0.045, v.x);
        add(j.pelvis, amount * hip);
        for (const [legs, f] of [[[j.hipR, j.kneeR, j.ankleR], 1 - right], [[j.hipL, j.kneeL, j.ankleL], right]]) {
          const w = amount * (1 - hip) * f;
          add(legs[0], w * knee);
          add(legs[1], w * (1 - knee) * ankle);
          add(legs[2], w * (1 - knee) * (1 - ankle));
        }
      }
      const best = [...sum].sort((a, b) => b[1] - a[1]).slice(0, 4), total = best.reduce((t, x) => t + x[1], 0) || 1;
      for (let k = 0; k < 4; k++) {
        J[i * 4 + k] = best[k] ? best[k][0] : 0;
        Wt[i * 4 + k] = best[k] ? best[k][1] / total : 0;
      }
    }
    g.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(J, 4));
    g.setAttribute("skinWeight", new THREE.Float32BufferAttribute(Wt, 4));
  });
}

// Gestures that give an arm a job, so a talking hand leaves it alone.
const HANDS_BUSY = new Set(["type", "keys", "reach", "point", "hand-on-belly", "small-hand-gesture", "wave", "press", "tap"]);
// Standing bodies keep this far (metres, floor point to floor point) from anyone else. The
// staging is placed in the picture's pixels, where a few pixels is a step; in 3D Sarah stood
// 0.47 m from Jack's chair and her hand went through him (Joshua, 2026-09-30: "Sarah is a
// little too close as her hand sometimes pass through Jack's body").
const KEEP_APART_M = 0.72;
// How far in front of the chest a keyboard can be and still be reached, metres: a working
// reach, and a longer one for a hand that STAYS on the keys while its owner sits back.
const KEYBOARD_REACH = 0.95, KEYBOARD_HOLD_REACH = 1.2;
// The chair's middle this far behind a keyboard it is pulled in to (the hips sit 4 cm behind
// the middle, so the keys are 0.30 m in front of them: about 65% of Jack's arm, elbows bent),
// and how near the desk's front edge that middle may come, its base rolled under it.
const CHAIR_TO_KEYS_M = 0.26, CHAIR_UNDER_DESK_M = 0.16;
// Holding a button: in over this long, out over this long, whatever the gesture's length.
const PRESS_IN = 0.8, PRESS_OUT = 0.6;
// A fingertip resting on a keyboard sits this far above its anchor (the keys' tops): the
// solver puts the FINGERTIP on a target, where the old reach put the wrist 4.5 cm up.
const KEY_TOP = 0.006;
const pressWeight = (g) => {
  const d = (g.opts && g.opts.dur) || 1, el = g.u * d;
  return smooth(el / PRESS_IN) * smooth((d - el) / PRESS_OUT);
};
// Turn a bone so that the world direction `from` (from its joint) points along `to`.
function turnBone(bone, from, to) {
  const q = new THREE.Quaternion().setFromUnitVectors(from.clone().normalize(), to.clone().normalize());
  worldTurn(bone, q);
}
function spinBone(bone, axis, angle) {
  worldTurn(bone, new THREE.Quaternion().setFromAxisAngle(axis, angle));
}
function worldTurn(bone, q) {
  const pw = bone.parent.getWorldQuaternion(new THREE.Quaternion());
  const bw = bone.getWorldQuaternion(new THREE.Quaternion());
  bone.quaternion.copy(pw.invert().multiply(q).multiply(bw));
  bone.updateMatrixWorld(true);
}
function lerpAngle(a, b, t) {
  let d = b - a;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return a + d * t;
}
function rgba(s) {
  const m = /rgba?\(([^)]+)\)/.exec(s || "");
  if (!m) return { color: new THREE.Color(0xffffff), a: 1 };
  const p = m[1].split(",").map(Number);
  return { color: new THREE.Color(p[0] / 255, p[1] / 255, p[2] / 255), a: p[3] ?? 1 };
}

// --------------------------------------------------------------------- the picture's camera
export class PictureCamera {
  constructor(c) {
    this.F = c.focal;
    this.CX = c.principal[0];
    this.CY = c.principal[1];
    this.H = c.height;
    // A built set may stand its picture camera back from the room's origin (z0, metres), so
    // a doorway behind the old camera is still a place on the floor (Chapters 4 to 9).
    this.Z0 = c.z0 || 0;
    // The room's depth lines vanish at vanishX; the camera is turned that far off its axis.
    this.yaw = Math.atan2(c.principal[0] - c.vanishX, c.focal);
    this.c = Math.cos(this.yaw);
    this.s = Math.sin(this.yaw);
  }
  // The direction through picture pixel (u, v), in the room frame.
  ray(u, v) {
    const dx = (u - this.CX) / this.F, dy = -(v - this.CY) / this.F, dz = -1;
    return [this.c * dx - this.s * dz, dy, this.s * dx + this.c * dz];
  }
  floor(u, v) {
    const r = this.ray(u, v);
    const t = -this.H / Math.min(r[1], -1e-4);
    return [t * r[0], 0, this.Z0 + t * r[2]];
  }
}

// ------------------------------------------------------------------------------- the chair
// A task chair (EN 1335-1 / BIFMA G1 proportions), as in TRADDOMIUM's story lab: five-star
// base on casters, a gas column, a padded seat, arms and a back. The seat's height is the
// sitter's (set per frame), so one chair fits whoever is in it.
const CHAIR = { seatWidth: 0.48, seatDepth: 0.46, seatThickness: 0.07, backWidth: 0.44, backHeight: 0.52, backGap: 0.08, backTiltDeg: 10, armHeight: 0.2, baseRadius: 0.32, casterRadius: 0.028, columnRadius: 0.025 };
function buildChair() {
  const g = new THREE.Group();
  const shell = new THREE.MeshStandardMaterial({ color: 0x1b1d21, roughness: 0.78, metalness: 0.05 });
  const pad = new THREE.MeshStandardMaterial({ color: 0x24272c, roughness: 0.92, metalness: 0 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x70757c, roughness: 0.35, metalness: 0.85 });
  const c = CHAIR, hubY = c.casterRadius * 2 + 0.03;
  const box = (parent, w, h, d, mat, x, y, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    box(g, c.baseRadius, 0.035, 0.05, shell, (Math.sin(a) * c.baseRadius) / 2, hubY, (Math.cos(a) * c.baseRadius) / 2).rotation.y = a - Math.PI / 2;
    const caster = new THREE.Mesh(new THREE.SphereGeometry(c.casterRadius, 10, 8), shell);
    caster.position.set(Math.sin(a) * c.baseRadius, c.casterRadius, Math.cos(a) * c.baseRadius);
    g.add(caster);
  }
  const column = new THREE.Mesh(new THREE.CylinderGeometry(c.columnRadius, c.columnRadius, 1, 12), metal);
  g.add(column);
  const top = new THREE.Group(); // everything that rides at seat height
  g.add(top);
  box(top, c.seatWidth, c.seatThickness, c.seatDepth, pad, 0, -c.seatThickness / 2, 0);
  const back = new THREE.Group();
  back.position.set(0, c.backGap, -(c.seatDepth / 2 - 0.02));
  back.rotation.x = -c.backTiltDeg * DEG;
  box(back, c.backWidth, c.backHeight, 0.06, pad, 0, c.backHeight / 2, 0);
  top.add(back);
  box(top, 0.05, c.backGap + 0.06, 0.03, shell, 0, c.backGap / 2 - 0.02, -c.seatDepth / 2 + 0.01);
  for (const s of [-1, 1]) {
    box(top, 0.03, c.armHeight, 0.03, shell, s * (c.seatWidth / 2 + 0.01), c.armHeight / 2, -0.06);
    box(top, 0.07, 0.03, 0.26, pad, s * (c.seatWidth / 2 + 0.01), c.armHeight, -0.02);
  }
  g.userData.setSeat = (seatTop) => {
    const colH = Math.max(0.05, seatTop - c.seatThickness - hubY);
    column.scale.y = colH;
    column.position.y = hubY + colH / 2;
    top.position.y = seatTop;
  };
  g.userData.setSeat(0.47);
  g.userData.materials = [shell, pad, metal];
  return g;
}

// A soft dark patch on the floor under a body or a chair, so nothing floats.
function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  r.addColorStop(0, "rgba(0,0,0,0.85)");
  r.addColorStop(0.55, "rgba(0,0,0,0.45)");
  r.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ================================================================================ People3D
export class People3D {
  // stage: the Stage this draws for (its layers, floor rule, screens and lights).
  // spec: the set's `people3d` block. options: { url, timeline, setId, range: [start, end] }.
  constructor(stage, spec, options) {
    this.stage = stage;
    this.spec = spec;
    this.url = options.url;
    this.timeline = options.timeline || null; // to find how far a body had walked before a seek
    this.lineAt = options.lineAt || null; // who is speaking when: talking moves the hands
    this.keyboards = [];
    this.cam0 = new PictureCamera(spec.camera);
    this.enabled = true;
    this.readyFlag = false;
    this.bodies = {};
    this.chairs = [];
    this.lightAnchors = {};
    this.screenAnchors = {};
    this.moved = false; // the screens and glows are away from their painted places

    const base = stage.baseLayer;
    const mk = (z) => {
      const c = document.createElement("canvas");
      c.className = "canvas3d";
      c.style.zIndex = z;
      c.style.display = "none";
      base.appendChild(c);
      return c;
    };
    // The room under the story's screens (600); the people over everything, so a person
    // in front of a lit screen or the intercom hides it.
    this.roomCanvas = mk(500);
    this.peopleCanvas = mk(5002);

    this.camera = new THREE.PerspectiveCamera();
    this.camera.rotation.order = "YXZ";
    this.scene = new THREE.Scene();
    this.roomScene = new THREE.Scene();
    this.roomScene.background = new THREE.Color(0x0b0f14);

    // THE PEOPLE'S LIGHT, placed where the painting's is: a cool fill from the ceiling
    // panels, a key down from the panel row over the desks, and the set's own glows (the
    // monitor, the alarm, the intercom) as point lights that take their colour and level
    // from the scene every frame.
    const hemiP = new THREE.HemisphereLight(0xd5e9f4, 0x40505b, 1.9);
    this.scene.add(hemiP);
    const key = new THREE.DirectionalLight(0xffeed8, 2.0);
    key.position.set(0.8, 5, 2.5);
    key.target.position.set(0.2, 0, -2.5);
    this.scene.add(key, key.target);
    // the people's lights, for a room that changes its own lighting (the lever's dark, the
    // emergency red) to change theirs with it
    this.peopleLights = { hemi: hemiP, key, base: { hemi: 1.9, key: 2.0 } };
    this.glows = {};
    this.shadowTex = shadowTexture();

    this.ready = this.load(options).then(() => {
      this.readyFlag = true;
    });
  }

  async load(options) {
    const loader = new THREE.GLTFLoader();
    loader.setMeshoptDecoder(THREE.MeshoptDecoder);
    const ids = Object.keys(this.spec.models);
    // bytes already downloaded (engine/app.js counts them in), or fetched here
    const B = options.buffers || {};
    const people = await Promise.all(ids.map((id) => (B[id] ? loader.parseAsync(B[id], "") : loader.loadAsync(this.url(this.spec.models[id])))));

    // THE ROOM, built (engine/labRoom.js): drawn in its own canvas under the story's screens,
    // and again as depth only among the people, so a cabinet, a desk or a monitor hides
    // whatever is behind it.
    this.lab = (ROOMS[this.spec.room || "lab"] || buildLabRoom)(this.spec.roomOptions || {});
    this.room = this.lab.group;
    this.roomScene.add(this.room);
    const mask = this.room.clone(true);
    mask.traverse((n) => {
      if (n.isMesh) {
        n.material = new THREE.MeshBasicMaterial({ colorWrite: false, side: THREE.DoubleSide });
        n.renderOrder = -1;
      }
    });
    this.scene.add(mask);
    // The mask is a copy; what the room moves (a door sliding open, the lever) has to move in
    // it too, or a person through an open door is hidden by the door that was shut at load.
    const a = [], b = [];
    this.room.traverse((n) => a.push(n));
    mask.traverse((n) => b.push(n));
    this.maskPairs = a.map((n, i) => [n, b[i]]).filter(([n]) => n.isMesh || n.isGroup);
    this.props = { anchors: this.lab.anchors, lamps: this.lab.lamps };
    this.keyboards = this.lab.keyboards;
    // The room's light, ChatGPT's: a cool sky fill, a warm key from the ceiling panels, a
    // teal fill off the racks. The set's glows join it in anchorSetPieces.
    const hemiR = new THREE.HemisphereLight(0xd5e9f4, 0x40505b, 2.3);
    this.roomScene.add(hemiR);
    const key = new THREE.DirectionalLight(0xffeed8, 2.4);
    key.position.set(0.8, 5, 2.5);
    key.target.position.set(0.2, 0, -2.5);
    this.roomScene.add(key, key.target);
    this.roomLights = { hemi: hemiR, key, base: { hemi: 2.3, key: 2.4 } };
    // the room's own extra lights (the lab's teal fill off the racks, the chamber's glow)
    const extra = this.lab.extraLights || [{ type: "point", color: 0x53bacc, intensity: 10, distance: 7, decay: 2, at: [-0.9, 2.1, -3.6] }];
    for (const L of extra) {
      const l = new THREE.PointLight(L.color, L.intensity, L.distance, L.decay);
      l.position.set(...L.at);
      this.roomScene.add(l);
      if (L.people !== undefined) {
        const lp = l.clone();
        lp.intensity = L.people;
        this.scene.add(lp);
      }
    }
    this.anchorSetPieces();

    ids.forEach((id, i) => this.addBody(id, people[i].scene));
    await this.addBoards();
    // the set's animals (engine/creatures.js), drawn with the room so the grass hides them
    this.creatures = new Creatures(this.roomScene, this.spec.creatures, this.url);
    await this.creatures.load(B);
    this.planChairs(options);

    this.peopleRenderer = new THREE.WebGLRenderer({ canvas: this.peopleCanvas, alpha: true, antialias: true, premultipliedAlpha: true });
    this.peopleRenderer.setClearColor(0x000000, 0);
    this.roomRenderer = new THREE.WebGLRenderer({ canvas: this.roomCanvas, antialias: true });
    for (const r of [this.peopleRenderer, this.roomRenderer]) {
      r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
      r.toneMapping = THREE.ACESFilmicToneMapping;
      r.toneMappingExposure = 1.05;
    }
    this.roomRenderer.compile(this.roomScene, this.camera);
  }

  // Where the story's screens and glows are in the room: the lab's own monitors and lamps
  // (engine/labRoom.js), each glow also a light for the people and the room.
  anchorSetPieces() {
    const eye = new THREE.Vector3(0, this.cam0.H, this.cam0.Z0);
    const fwd = new THREE.Vector3(this.cam0.s, 0, -this.cam0.c);
    const depth = (p) => p.clone().sub(eye).dot(fwd);
    for (const id of Object.keys(this.stage.set.screens || {})) {
      if (this.lab.screens[id]) this.screenAnchors[id] = this.lab.screens[id];
    }
    this.roomGlows = {};
    for (const [id, l] of Object.entries(this.stage.set.lights || {})) {
      const p = (this.lab.lights[id] || new THREE.Vector3(0.2, 1.1, -3.9)).clone();
      this.lightAnchors[id] = { p, depth: depth(p), radius: l.radius };
      // a little in front of whatever it glows on
      const glow = new THREE.PointLight(0xffffff, 0, 3.2, 1.6);
      glow.position.copy(p).addScaledVector(p.clone().sub(eye).normalize(), -0.3);
      this.scene.add(glow);
      this.glows[id] = glow;
      const g2 = glow.clone();
      this.roomScene.add(g2);
      this.roomGlows[id] = g2;
    }
  }

  addBody(id, model) {
    const rig = new THREE.HumanRig(model);
    const measure = THREE.measureHuman(rig.bind);
    if ((this.spec.skirted || []).includes(id)) smoothSkirt(model, measure.joints);
    // Seat geometry, measured once: pose the doze at the origin and read where it put the
    // hips and the ankles. A pose never moves the hips, so this holds for every pose.
    model.position.set(0, 0, 0);
    model.rotation.set(0, 0, 0);
    rig.apply(THREE.poseSeated(measure, rig.bind, { style: "doze", seconds: 0, headSide: 1 }, []));
    model.updateMatrixWorld(true);
    const skin = THREE.findSkinnedMesh(model), bones = skin.skeleton.bones, j = measure.joints;
    const w = (i) => bones[i].getWorldPosition(new THREE.Vector3());
    // THE HEAD. What the rig measures as `head` is the crown (the highest joint, inside the
    // skull), so turning it turns only the hair. The head turns at the base of the skull,
    // its parent. (Joshua, 2026-09-29: "only his hair moves".)
    const crownParent = rig.bind[j.head].parent;
    const head = crownParent >= 0 && crownParent !== j.neck ? crownParent : j.head;
    // Each hand's rotation in the bind, to know which way its palm faces once posed.
    const bindQ = (i) => {
      const q = new THREE.Quaternion();
      new THREE.Matrix4().copy(skin.skeleton.boneInverses[i]).invert().decompose(new THREE.Vector3(), q, new THREE.Vector3());
      return q.normalize().invert();
    };
    const handBindInv = { L: bindQ(j.wristL), R: bindQ(j.wristR) };
    const hips = w(j.hipL).add(w(j.hipR)).multiplyScalar(0.5);
    const ankle = Math.min(w(j.ankleL).y, w(j.ankleR).y);
    const headAboveHips = w(head).y - hips.y;
    rig.rest();
    model.updateMatrixWorld(true);
    const standEye = w(head).y - Math.min(w(j.ankleL).y, w(j.ankleR).y) + 0.08 + 0.06;
    // a sole and a heel put the ankle ~8 cm off the floor; the hip joint sits ~10 cm above the pad
    const seatTop = Math.min(0.55, Math.max(0.4, hips.y - ankle + 0.08 - 0.1));
    const materials = [];
    model.traverse((n) => {
      if (n.isMesh) {
        n.frustumCulled = false;
        for (const m of [].concat(n.material)) materials.push(m);
      }
    });
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: this.shadowTex, transparent: true, depthWrite: false, opacity: 0.5 }));
    shadow.rotation.x = -Math.PI / 2;
    this.scene.add(model, shadow);
    const eye = { stand: standEye, sit: seatTop + 0.1 + headAboveHips + 0.04 };
    this.bodies[id] = { id, model, rig, measure, materials, shadow, seatTop, hips, head, bones, handBindInv, eye, seed: Object.keys(this.bodies).length, opacity: 1 };
  }

  // Where a character is on the floor, in metres: the stage's own rule first (the floor
  // polygon keeps a chair's base out of the cabinets), then the room's aisle in 3D.
  floorOf(id, a, poseName) {
    const node = this.stage.actors[id];
    const pose = node.sprite.poses[poseName];
    const [fx, fy] = this.stage.onFloor(a, pose);
    const p = this.cam0.floor(fx, fy);
    return this.clampAisle(p, poseName === "sitting" ? CHAIR.baseRadius + CHAIR.casterRadius + 0.03 : 0.2);
  }

  facingAt(a, t) {
    const f = a.facing, k = smooth((t - f.since) / TURN_SECONDS);
    return lerpAngle(FACING[f.prev] ?? FACING[f.v], FACING[f.v] ?? 0, k);
  }

  // The chairs, decided once for the whole scene so a seek lands on the same answer: a
  // body that sits takes the parked chair it sits down at, or brings its own; a body that
  // stands leaves its chair where it was. (Chapter 1: Jack gives Sarah his chair, and
  // comes back rolling the one from the next workstation.)
  planChairs({ timeline, setId, range }) {
    this.chairs = [];
    if (!timeline) return;
    const held = {};
    const parked = [];
    const step = 0.1;
    for (let t = range[0]; t <= range[1]; t += step) {
      const st = timeline.evaluate(t);
      if (st.set !== setId) continue;
      for (const [id, a] of Object.entries(st.actors)) {
        if (!this.bodies[id]) continue;
        // on the floor (state "fallen", Chapter 3) is sitting without a chair
        const sitting = a.pose.v === "sitting" && a.state.v !== "fallen";
        if (sitting && held[id] === undefined) {
          const p = this.floorOf(id, a, "sitting");
          let k = parked.findIndex((c) => Math.hypot(c.at[0] - p[0], c.at[2] - p[2]) < CHAIR_CLAIM_M);
          let chair;
          if (k >= 0) {
            chair = parked.splice(k, 1)[0];
            chair.segs[chair.segs.length - 1].t1 = t;
          } else {
            chair = { segs: [], at: p, yaw: 0, seatTop: this.bodies[id].seatTop };
            chair.segs.push({ t0: -Infinity, t1: t, hidden: true });
            this.chairs.push(chair);
          }
          chair.segs.push({ t0: t, t1: Infinity, owner: id });
          held[id] = chair;
        } else if (!sitting && held[id] !== undefined) {
          const chair = held[id];
          const last = chair.segs[chair.segs.length - 1];
          last.t1 = t;
          const prev = timeline.evaluate(Math.max(range[0], t - step)).actors[id];
          const at = this.floorOf(id, prev, "sitting");
          chair.segs.push({ t0: t, t1: Infinity, at, yaw: this.facingAt(prev, t - step), seatTop: this.bodies[id].seatTop });
          parked.push(Object.assign(chair, { at }));
          delete held[id];
        }
      }
    }
    for (const c of this.chairs) {
      c.mesh = buildChair();
      c.shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: this.shadowTex, transparent: true, depthWrite: false, opacity: 0.55 }));
      c.shadow.rotation.x = -Math.PI / 2;
      c.shadow.scale.set(0.8, 0.8, 1);
      for (const m of c.mesh.userData.materials) m.transparent = false;
      this.scene.add(c.mesh, c.shadow);
    }
  }

  // ------------------------------------------------------------------------ billboards
  // THE PEOPLE WITHOUT A MODEL YET (Joshua, 2026-10-01: Lena and Mark "don't have the 3D
  // models yet, just use the images like a Billboard with the 3D models so it will still
  // have some depth"). Each stands in the room as their drawing on an upright card that turns
  // to the camera, with the one of their eight drawings (assets/characters/<id>/) that shows
  // them from where the camera is, at their real height, feet on the floor, behind or in
  // front of the desks as the room says. A model, when one arrives, replaces the card: give
  // the set's people3d.models an entry for them.
  async addBoards() {
    this.boards = {};
    if (this.spec.billboards === false) return;
    const loader = new THREE.TextureLoader();
    for (const id of Object.keys(this.stage.actors)) {
      if (this.spec.models[id]) continue;
      const spr = this.stage.actors[id].sprite;
      if (!spr) continue;
      const poses = {};
      for (const [pn, pose] of Object.entries(spr.poses)) {
        const frames = {};
        await Promise.all(Object.entries(pose.frames).map(async ([dir, f]) => {
          const tex = await loader.loadAsync(this.url(spr.base + f.file));
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 4;
          frames[dir] = tex;
        }));
        const [W, H] = pose.canvas, m = pose.pxPerMeter, [ax, ay] = pose.anchor;
        // the card's size in metres, and where on it the feet (the anchor) are
        poses[pn] = { frames, w: W / m, h: H / m, ax: (ax / W - 0.5) * (W / m), ay: (0.5 - ay / H) * (H / m), eye: pose.heightM ? pose.heightM - 0.1 : 1.55 };
      }
      const mat = new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.5, side: THREE.DoubleSide, toneMapped: false, alphaToCoverage: true });
      const card = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
      card.frustumCulled = false;
      const group = new THREE.Group();
      group.add(card);
      const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: this.shadowTex, transparent: true, depthWrite: false, opacity: 0.5 }));
      shadow.rotation.x = -Math.PI / 2;
      this.scene.add(group, shadow);
      this.boards[id] = { id, group, card, mat, poses, shadow, opacity: 1 };
    }
  }

  placeBoard(id, a, t) {
    if (!(a.visible && a.opacity > 0.001)) return null;
    const B = this.boards[id];
    const pose = B.poses[a.pose.v] ? a.pose.v : "standing";
    return { at: this.floorOf(id, a, pose), yaw: this.facingAt(a, t), seated: pose === "sitting", pose, board: true, eye: B.poses[pose].eye };
  }

  drawBoard(id, a, t, place) {
    const B = this.boards[id];
    B.group.visible = B.shadow.visible = !!place;
    if (!place) return;
    const cam = this.camera.position;
    const toCam = Math.atan2(cam.x - place.at[0], cam.z - place.at[2]);
    // which drawing: the way they face, seen from the camera (south = facing it)
    const rel = place.yaw - toCam;
    let best = "south", bd = 9;
    for (const [dir, v] of Object.entries(FACING)) {
      const e = Math.abs(lerpAngle(0, rel - v, 1));
      if (e < bd) { bd = e; best = dir; }
    }
    const P = B.poses[place.pose], tex = P.frames[best] || P.frames.south;
    if (B.mat.map !== tex) { B.mat.map = tex; B.mat.needsUpdate = true; }
    B.card.scale.set(P.w, P.h, 1);
    B.card.position.set(-P.ax, -P.ay, 0);
    const bob = a.state.v === "walking" ? 0.012 * Math.abs(Math.sin((t * Math.PI * 2) / 1.05)) : 0;
    B.group.position.set(place.at[0], bob, place.at[2]);
    B.group.rotation.set(0, toCam, 0);
    // lit as the people are: the room going dark takes the card with it
    const L = this.peopleLights, k = 0.86 * Math.max(0.04, Math.min(1.15, (L.hemi.intensity / L.base.hemi) * 0.55 + (L.key.intensity / L.base.key) * 0.45)); // a drawing is lit flat; a little under the models'
    B.mat.color.setRGB(k * L.hemi.color.r, k * L.hemi.color.g, k * L.hemi.color.b);
    if (a.opacity !== B.opacity) {
      B.opacity = a.opacity;
      B.mat.opacity = a.opacity;
      B.mat.alphaTest = a.opacity < 0.999 ? 0.02 : 0.5;
      B.mat.needsUpdate = true;
    }
    B.shadow.position.set(place.at[0], 0.004, place.at[2]);
    const size = place.seated ? 0.62 : 0.5;
    B.shadow.scale.set(size, size, 1);
    B.shadow.material.opacity = 0.5 * a.opacity;
  }

  setEnabled(on) {
    this.enabled = on;
    if (!on) {
      this.roomCanvas.style.display = this.peopleCanvas.style.display = "none";
      this.restoreSetPieces();
    }
  }

  get active() {
    return this.enabled && this.readyFlag;
  }

  // ---------------------------------------------------------------------------- the pose
  basePose(body, kind, t, a) {
    const { measure, rig } = body;
    let turns;
    if (kind === "doze" || kind === "sit") turns = THREE.poseSeated(measure, rig.bind, { style: kind, seconds: t + body.seed * 1.7, headSide: 1 }, []);
    else {
      const walking = kind === "walk";
      const phase = walking ? ((body.walked * rig.bindScale) / THREE.humanStride(measure, "walk")) % 1 : 0;
      turns = THREE.poseHuman(measure, rig.bind, { stance: walking ? "walk" : "stand", phase, seconds: t + body.seed * 1.7, lean: 0 }, []);
    }
    return toMap(turns);
  }

  // What the story asks of a body on top of its pose: leaning in, a start, the idle drift
  // of someone awake, and the gestures (engine/gestures.js names them; here they are joint
  // turns in the bind frame -- see TRADDOMIUM's humanSeated.ts for the sign rules).
  extras(body, a, t, seated) {
    const j = { ...body.measure.joints, head: body.head }, L = body.measure.leftSign < 0 ? -1 : 1;
    const out = [];
    const add = (joint, q) => out.push([joint, q]);
    const st = a.state, k = smooth((t - st.since) / 0.8);
    const w = (name) => (st.v === name ? k : 0) + (st.prev === name ? 1 - k : 0);
    const lean = w("leaning");
    if (lean) {
      add(j.spine, rx((seated ? 10 : 6) * DEG * lean));
      add(j.neck, rx(4 * DEG * lean));
    }
    if (a.jolt) {
      add(j.spine, rx(-7 * DEG * a.jolt));
      add(j.head, rx(-6 * DEG * a.jolt));
    }
    const awake = 1 - w("asleep") - w("still") - w("walking");
    if (awake > 0.01) {
      const s = body.seed, h = Math.sin((2 * Math.PI * t) / (7.3 + s * 1.3) + s) + 0.5 * Math.sin((2 * Math.PI * t) / (3.1 + s * 0.4) + 2 * s);
      add(j.neck, ry(L * 3 * DEG * h * awake));
    }
    // Standing still, the arms hang relaxed: barely bent, the hands a little forward. (It was
    // 14 degrees at the elbow, on top of the pose's own: Joshua, 2026-09-30, "Jack's arms are
    // folded in his sides".)
    const standing = !seated && st.v !== "walking";
    if (standing) {
      for (const [sh, el, s] of [[j.shoulderL, j.elbowL, L], [j.shoulderR, j.elbowR, -L]]) {
        add(sh, rx(-3 * DEG));
        add(el, ry(-s * 5 * DEG));
      }
    }
    // Typing: lean in to the keys, so the arms bend instead of locking straight.
    if (a._typingIK) add(j.spine, rx(12 * DEG * a._typingIK));
    if (a._pressing) add(j.spine, rx(16 * DEG * a._pressing));
    // Talking: while their own line is heard, the head moves with the words and a hand
    // comes up and goes down again, slowly, at each person's own pace.
    const talk = this.talking(body.id, t);
    if (talk > 0 && st.v !== "asleep") {
      const s = body.seed;
      add(j.head, rx(3.5 * DEG * talk * Math.sin(t * 2 * Math.PI * 1.6 + s)));
      add(j.neck, ry(L * 3 * DEG * talk * Math.sin(t * 2 * Math.PI * 0.55 + 2 * s)));
      if (!seated && !(a.gestures || []).some((g) => HANDS_BUSY.has(g.name))) {
        const g = talk * (0.55 + 0.45 * Math.sin(t * 2 * Math.PI * 0.42 + 3 * s));
        const [sh, el, sg] = s % 2 ? [j.shoulderL, j.elbowL, L] : [j.shoulderR, j.elbowR, -L];
        add(sh, rx(-(seated ? 10 : 18) * DEG * g));
        add(el, ry(-sg * (seated ? 22 : 45) * DEG * g));
      }
    }
    // The arm a gesture uses: the right unless the scene says otherwise. `s` is the way the
    // arm runs in the bind (+1 along +x); the rig bends an elbow with ry(-s * angle).
    const armOf = (o) => (o.arm === "left" ? { sh: j.shoulderL, el: j.elbowL, wr: j.wristL, s: L } : { sh: j.shoulderR, el: j.elbowR, wr: j.wristR, s: -L });
    for (const g of a.gestures || []) {
      const u = g.u, o = g.opts || {};
      switch (g.name) {
        case "look-left":
        case "look-right": {
          const e = envelope(u), d = g.name === "look-left" ? L : -L;
          add(j.neck, ry(d * 16 * DEG * e));
          add(j.head, ry(d * 10 * DEG * e));
          break;
        }
        case "look-up":
          add(j.head, rx(-12 * DEG * envelope(u)));
          add(j.neck, rx(-5 * DEG * envelope(u)));
          break;
        case "look-down":
          add(j.head, rx(14 * DEG * envelope(u)));
          break;
        case "nod": {
          const e = envelope(u, 0.15), n = Math.max(0, Math.sin(u * 2 * Math.PI * 2));
          add(j.head, rx(14 * DEG * e * n));
          break;
        }
        case "shake-head": {
          const e = envelope(u, 0.15);
          add(j.neck, ry(12 * DEG * e * Math.sin(u * 2 * Math.PI * 3)));
          break;
        }
        case "stir": {
          const e = envelope(u, 0.35);
          add(j.neck, rz(-L * 10 * DEG * e));
          add(j.spine, rx(2 * DEG * e));
          break;
        }
        case "lean-forward":
          add(j.spine, rx(8 * DEG * envelope(u, 0.3)));
          add(j.head, rx(4 * DEG * envelope(u, 0.3)));
          break;
        case "lean-back":
          add(j.spine, rx(-7 * DEG * envelope(u, 0.3)));
          add(j.head, rx(-3 * DEG * envelope(u, 0.3)));
          break;
        case "stand-up":
        case "sit-down":
          add(j.spine, rx(14 * DEG * Math.sin(Math.PI * u)));
          break;
        case "point": {
          const A = armOf(o), e = envelope(u, 0.2);
          add(A.sh, rx(-(seated ? 38 : 60) * DEG * e));
          if (seated) add(A.el, ry(A.s * 40 * DEG * e));
          break;
        }
        case "reach": {
          const A = armOf(o), e = envelope(u, 0.3);
          if (a._typingIK) { add(j.spine, rx(5 * DEG * e)); break; }
          add(A.sh, rx(-(seated ? 30 : 45) * DEG * e));
          if (seated) add(A.el, ry(A.s * 30 * DEG * e));
          add(j.spine, rx(5 * DEG * e));
          break;
        }
        case "hand-on-belly":
          break; // an arm reach (reachArms), not a turn
        case "small-hand-gesture": {
          const A = armOf(o), e = envelope(u), v = Math.sin(u * 2 * Math.PI * 1.5);
          add(A.sh, rx(-14 * DEG * e));
          add(A.el, ry(-A.s * (22 + 8 * v) * DEG * e));
          add(A.wr, rz(-A.s * 8 * v * DEG * e));
          break;
        }
        case "wave": {
          const A = armOf(o), e = envelope(u, 0.2), v = Math.sin(u * 2 * Math.PI * 3);
          add(A.sh, rx(-70 * DEG * e));
          add(A.el, ry(-A.s * (50 + 15 * v) * DEG * e));
          break;
        }
        case "type": {
          if (a._typingIK) break; // the hands are on the keys (reachArms)
          const e = envelope(u, 0.1);
          for (const [el, wr, s, ph] of [[j.elbowL, j.wristL, L, 0], [j.elbowR, j.wristR, -L, Math.PI]]) {
            add(el, ry(-s * 3 * DEG * e * Math.sin(t * 2 * Math.PI * 5.5 + ph)));
            add(wr, rx(5 * DEG * e * Math.sin(t * 2 * Math.PI * 7 + ph)));
          }
          add(j.head, rx(4 * DEG * e));
          break;
        }
        default:
          break;
      }
    }
    return out;
  }

  // How much this person is talking at t (0..1, easing in and out of each of their lines).
  talking(id, t) {
    if (!this.lineAt) return 0;
    const line = this.lineAt(t);
    if (!line || !String(line.speaker || "").startsWith(id)) return 0;
    const a = line.startMs / 1000, b = line.endMs / 1000;
    return smooth((t - a) / 0.4) * smooth((b - t) / 0.4);
  }

  // WHERE THEY LOOK (Joshua, 2026-09-29: Jack's head "needs to face in the direction of the
  // computer and Sarah"; Sarah's "between Jack and the computer"). The scene says which way
  // a body faces in eight directions; what it looks at is whatever lies that way: the other
  // person's eyes, a monitor, or the lit intercom -- ONE of them, the one nearest that
  // direction (Joshua, 2026-09-30: "it will know exactly where to position the head angles
  // to face each thing"). It used to be an average of all of them, which looked at the empty
  // air between two things. The head is then aimed at that point by TRADDOMIUM's
  // humanAim, which eases from one target to the next, so a turn between them is a glance.
  gaze(id, at, faceYaw, seated, state, placedAt) {
    const body = this.bodies[id];
    const eye = new THREE.Vector3(at[0], seated ? body.eye.sit : body.eye.stand, at[2]);
    let sum = 0, best = 0;
    const tgt = new THREE.Vector3();
    const consider = (p, bias) => {
      const d = lerpAngle(0, Math.atan2(p.x - eye.x, p.z - eye.z) - faceYaw, 1);
      const w = bias * smooth((Math.abs(d) < Math.PI ? (70 * DEG - Math.abs(d)) : -1) / (40 * DEG));
      if (w > 0) sum += w;
      if (w > best) { best = w; tgt.copy(p); }
    };
    for (const [other, p] of Object.entries(placedAt)) {
      if (other !== id && p && p.board) consider(new THREE.Vector3(p.at[0], p.eye, p.at[2]), 1.4);
      else if (other !== id && p) {
        // their real eye, as their own head last aimed it, so two people meet eye to eye
        const them = this.bodies[other], e = them.aim && them.aimedAt && Math.abs(them.aimedAt - this.now) < 0.25 ? them.aim.eye : null;
        consider(e ? new THREE.Vector3(e.x, e.y, e.z) : new THREE.Vector3(p.at[0], p.seated ? them.eye.sit : them.eye.stand, p.at[2]), 1.4);
      }
    }
    for (const P of Object.values(this.screenAnchors)) {
      consider(P[0].clone().add(P[1]).add(P[2]).add(P[3]).multiplyScalar(0.25), 1);
    }
    // a lit call point (the intercom) draws the eye while it is on
    for (const id of this.spec.lookAtLights || []) {
      const l = this.lights && this.lights[id], A = this.lightAnchors[id];
      if (l && A && l.intensity > 0.05) consider(A.p, 1.6);
    }
    if (sum < 1e-3) return null;
    return { eye, target: tgt, amount: Math.min(1, sum) };
  }

  poseKind(pose, state) {
    if (pose === "sitting") return state === "asleep" ? "doze" : "sit";
    return state === "walking" ? "walk" : "stand";
  }

  // Where a body is and which way it faces, before its joints: the look decides the last
  // part of the turn, so this runs for everyone first (drawBody reads the others' places).
  placeBody(id, a, t) {
    const shown = a.visible && a.opacity > 0.001;
    if (!shown) return null;
    const seated = a.pose.v === "sitting";
    const at = this.floorOf(id, a, a.pose.v);
    // Reaching for something further than an arm (the intercom at the back of the desk):
    // a seated person rolls the chair in toward it first, as far as the desk allows.
    const press = (a.gestures || []).find((g) => (g.name === "press" || g.name === "tap") && this.targetOf(g));
    if (press && seated) {
      const T = this.targetOf(press), w = press.name === "press" ? pressWeight(press) : envelope(press.u, 0.3);
      const dx = T.x - at[0], dz = T.z - at[2], dist = Math.hypot(dx, dz), want = 0.58;
      if (dist > want) {
        const k = ((dist - want) / dist) * w;
        at[0] += dx * k;
        at[2] += dz * k;
        this.clampAisle(at, CHAIR.baseRadius + CHAIR.casterRadius + 0.03);
      }
    }
    // At the keys: how far into the hold, for the chair to be pulled in (pullChairsIn).
    const keys = seated && !press && a.state.v !== "asleep" && (a.gestures || []).find((g) => g.name === "keys" || g.name === "type");
    const pull = keys ? envelope(keys.u, Math.min(0.3, 0.6 / Math.max(0.6, (keys.opts && keys.opts.dur) || 1))) : 0;
    return { at, yaw: this.facingAt(a, t), seated, pull };
  }

  // AT THE KEYS, the chair is pulled in until the keyboard is a comfortable reach in front of
  // the hips (Joshua, 2026-09-30, on Jack's stiff straight arms: the keyboard sat 0.62 m off,
  // past the end of his 0.60 m arm, and TRADDOMIUM's reach solver will not hold a grip past
  // 90% of the arm). A chair base rolls under a desk's edge; the clamp keeps the seat itself
  // out from under it. Eased by the hold's own envelope: he pulls himself in when his hands
  // go to the keys and pushes back when they leave. EACH KEYBOARD IS ONE PERSON'S -- the
  // seated one nearest it -- or two people at the keys would be pulled into one chair.
  pullChairsIn(places) {
    const claims = [];
    for (const [id, P] of Object.entries(places)) {
      if (!P || !(P.pull > 0)) continue;
      const fwd = [Math.sin(P.yaw), Math.cos(P.yaw)];
      let kb = null, best = KEYBOARD_HOLD_REACH;
      for (const K of this.keyboards) {
        const dx = K.c.x - P.at[0], dz = K.c.z - P.at[2], d = Math.hypot(dx, dz);
        if (d < best && dx * fwd[0] + dz * fwd[1] > 0.6 * d) { best = d; kb = K; }
      }
      if (kb) claims.push({ id, P, kb, d: best });
    }
    for (const c of claims) {
      if (claims.some((o) => o !== c && o.kb === c.kb && o.d < c.d)) continue;
      // to the spot square in front of the keyboard along the way the body faces, so the two
      // hands come to it evenly rather than from off to one side
      const fx = Math.sin(c.P.yaw), fz = Math.cos(c.P.yaw);
      const wantX = c.kb.c.x - fx * CHAIR_TO_KEYS_M, wantZ = c.kb.c.z - fz * CHAIR_TO_KEYS_M;
      c.P.at[0] += (wantX - c.P.at[0]) * c.P.pull;
      c.P.at[2] += (wantZ - c.P.at[2]) * c.P.pull;
      this.clampAisle(c.P.at, CHAIR_UNDER_DESK_M);
    }
  }

  // No two bodies closer than KEEP_APART_M: whoever is standing gives way, along the line
  // between them (both, half each, when both stand). Continuous in distance, so a body
  // walking up to another simply stops at the gap rather than jumping.
  keepApart(places) {
    const ids = Object.keys(places).filter((id) => places[id]);
    for (let i = 0; i < ids.length; i++) for (let k = i + 1; k < ids.length; k++) {
      const A = places[ids[i]], B = places[ids[k]];
      const dx = B.at[0] - A.at[0], dz = B.at[2] - A.at[2], d = Math.hypot(dx, dz);
      if (d >= KEEP_APART_M || d < 1e-6) continue;
      const moveA = !A.seated, moveB = !B.seated;
      if (!moveA && !moveB) continue;
      const push = KEEP_APART_M - d, ux = dx / d, uz = dz / d;
      const shareA = moveA ? (moveB ? 0.5 : 1) : 0, shareB = moveB ? (moveA ? 0.5 : 1) : 0;
      A.at[0] -= ux * push * shareA; A.at[2] -= uz * push * shareA;
      B.at[0] += ux * push * shareB; B.at[2] += uz * push * shareB;
      if (moveA) this.clampAisle(A.at, 0.2);
      if (moveB) this.clampAisle(B.at, 0.2);
    }
  }

  targetOf(g) {
    const name = g.opts && g.opts.target;
    return name && this.props ? this.props.anchors[name + ".button"] || this.props.anchors[name] || null : null;
  }

  clampAisle(p, r) {
    const A = this.spec.aisle;
    if (!A) return p;
    const right = p[2] + r > A.rightRunEnds ? Math.min(A.right, A.rightNear) : A.right;
    p[0] = Math.min(Math.max(p[0], A.left + r), right - r);
    p[2] = Math.max(p[2], A.deskFront + r);
    return p;
  }

  // After a seek there is no last frame to count from, so the distance is read off the
  // timeline: where the body stood at points since its walk began. A body sought to
  // mid-walk then lands mid-stride, instead of with its feet together every time.
  walkedSince(id, a, t) {
    if (!this.timeline || a.state.v !== "walking") return 0;
    const from = a.state.since;
    let d = 0, prev = null;
    for (let i = 0; i <= 16; i++) {
      const s = this.timeline.evaluate(from + ((t - from) * i) / 16).actors[id];
      if (!s) continue;
      const p = this.floorOf(id, s, s.pose.v);
      if (prev) d += Math.hypot(p[0] - prev[0], p[2] - prev[2]);
      prev = p;
    }
    return d;
  }

  // Everything about one body at time t: its joints, where it stands, which way it faces.
  drawBody(id, a, t, place, placedAt) {
    const body = this.bodies[id];
    body.model.visible = body.shadow.visible = !!place;
    if (!place) return null;
    const j = body.measure.joints, L = body.measure.leftSign < 0 ? -1 : 1;
    const seated = place.seated;
    // How far this body has walked, for the stride (see humanStride above). Counted frame to frame
    // along the floor, and started again after a seek: a jump in time is not a walk.
    const was = body.walkedAt;
    body.walked = was && t >= was.t && t - was.t < 0.25 ? body.walked + Math.hypot(place.at[0] - was.x, place.at[2] - was.z) : this.walkedSince(id, a, t);
    body.walkedAt = { t, x: place.at[0], z: place.at[2] };

    // The look: turn the body part of the way (a seated person swivels the chair), the
    // neck and head the rest.
    const awake = a.state.v === "asleep" ? 0 : 1;
    const look = awake ? this.gaze(id, place.at, place.yaw, seated, a.state.v, placedAt) : null;
    let yaw = place.yaw;
    if (look) {
      const want = Math.atan2(look.target.x - look.eye.x, look.target.z - look.eye.z);
      const d = lerpAngle(0, want - yaw, 1);
      yaw += Math.max(-25 * DEG, Math.min(25 * DEG, d)) * (seated ? 0.7 : 0.5) * look.amount;
    }
    place.yaw = yaw;

    // Hands at work: typing on the nearest keyboard in reach, reaching for it, a hand on
    // Sarah's stomach. Decided first, because the turns leave these arms to the reach.
    const reaches = this.reachesFor(body, a, t, place);
    a._typingIK = reaches.reduce((m, r) => (r.typing ? Math.max(m, r.weight) : m), 0);
    a._pressing = reaches.reduce((m, r) => (r.pressing ? Math.max(m, r.pressing) : m), 0);

    // The pose, blended from whatever it was a moment ago (asleep to awake, standing up).
    const cur = this.poseKind(a.pose.v, a.state.v);
    const poseChangedLast = a.pose.since >= a.state.since;
    const changedAt = Math.max(a.pose.since, a.state.since);
    const prev = poseChangedLast ? this.poseKind(a.pose.prev, a.state.v) : this.poseKind(a.pose.v, a.state.prev);
    const k = smooth((t - changedAt) / BLEND_SECONDS);
    let map = this.basePose(body, cur, t, a);
    if (prev !== cur && k < 1) map = blendMaps(this.basePose(body, prev, t, a), map, k);
    // the poses turn the crown; the head turns at the base of the skull
    if (body.head !== j.head && map.has(j.head)) {
      map.set(body.head, qMul(map.get(j.head), map.get(body.head) || IDENTITY));
      map.delete(j.head);
    }
    const add = (joint, q) => map.set(joint, qMul(q, map.get(joint) || IDENTITY));
    for (const [joint, q] of this.extras(body, a, t, seated)) add(joint, q);
    // THE SHOULDERS (Joshua, 2026-09-29: "Jack's shoulders look weird"). The poses lower
    // each arm from the T at the upper arm alone, and the skin there folds into a hard
    // square shoulder. A real shoulder drops the collarbone too: it takes part of the
    // turn, and the upper arm keeps the same direction in the world. (Joshua, again the same
    // day: "Jack's shoulders still look off sometimes".)
    for (const [sh, s] of [[j.shoulderL, L], [j.shoulderR, -L]]) {
      const clav = body.rig.bind[sh].parent;
      if (clav < 0 || clav === j.chest || !map.has(sh)) continue;
      // 9 degrees, chosen by rendering 0, 8, 11 and 16 side by side: none squares the
      // shoulders off, 16 narrows them and bunches the sleeve, and twisting the upper arm
      // to turn the palms in (tried, 2026-09-29) folded the sleeve into a lump
      const Rc = qMul(ry(-s * (seated ? 10 : 5) * DEG), rz(-s * 9 * DEG));
      map.set(clav, qMul(Rc, map.get(clav) || IDENTITY));
      map.set(sh, qMul([-Rc[0], -Rc[1], -Rc[2], Rc[3]], map.get(sh)));
    }
    const posed = toTurns(map);

    // Where: the floor point, and for a seated body the hips over the chair's seat.
    const root = (poseName) => {
      const p = poseName === a.pose.v ? place.at.slice() : this.floorOf(id, a, poseName);
      if (poseName !== "sitting") return { p, root: [p[0], 0, p[2]] };
      const c = Math.cos(yaw), s = Math.sin(yaw);
      const rot = (x, z) => [x * c + z * s, -x * s + z * c];
      const back = rot(0, -0.04), hip = rot(body.hips.x, body.hips.z);
      // FALLEN (Chapter 3: "Jack hit the floor and Sarah landed beside him"): the seated pose
      // with the hips on the floor instead of a chair; the floor hides the shins below it.
      const seatY = a.state.v === "fallen" ? 0.02 : body.seatTop;
      return { p, root: [p[0] + back[0] - hip[0], seatY + 0.1 - body.hips.y, p[2] + back[1] - hip[1]] };
    };
    const now = root(a.pose.v);
    let r = now.root;
    if (poseChangedLast && a.pose.prev !== a.pose.v && k < 1) {
      const was = root(a.pose.prev).root;
      r = was.map((v, i) => v + (r[i] - v) * k);
    }
    // THE FEET (TRADDOMIUM's humanFeet): each foot is put on the floor and held there
    // while it carries weight, and the body comes down onto them -- the feet drive the
    // body. They let go while a body sits, stands up or sits down, and start again after a
    // seek, because a jump in time is not a step.
    const steady = was && t >= was.t && t - was.t < 0.25;
    const changingSeat = poseChangedLast && k < 1 && (a.pose.prev === "sitting" || a.pose.v === "sitting");
    const footing = {
      dt: steady ? t - was.t : 0, released: seated || changingSeat,
      rootX: r[0], rootY: r[1], rootZ: r[2], rootYaw: yaw, unitsPerMetre: body.rig.bindScale,
      groundAt: () => FLOOR,
    };
    const feetTurns = body.feetTurns || (body.feetTurns = []);
    if (!steady || !body.feet) {
      // Fresh feet ease onto the floor over a blend; a seek lands paused, where no time
      // passes, so they are settled here instead -- the frame after a seek already stands.
      body.feet = THREE.createFeet(body.measure, body.rig.bind, -1);
      for (let i = 0; i < 8; i++) THREE.groundFeet(body.feet, body.measure, body.rig.bind, posed, { ...footing, dt: 0.05 }, feetTurns);
    }
    const grounded = THREE.groundFeet(body.feet, body.measure, body.rig.bind, posed, footing, feetTurns);
    const hop = a.jolt ? 0.015 * a.jolt : 0;
    const rootY = r[1] + hop - grounded.rootDrop;

    // THE HEAD AND THE HANDS (TRADDOMIUM's humanAim and humanReach, the game's own): the
    // head is aimed at the one thing it looks at, eased; the hands go to their targets and
    // let go by REACH -- a hand holds while its grip is within 90% of its own arm -- and a
    // free seated hand rests on its thigh. Both run on the scene's clock, and after a seek
    // they are settled at once, as the feet are.
    if (!body.aim) {
      body.aim = THREE.createAim(body.measure, body.rig.bind, -1);
      body.reach = THREE.createReach(body.measure, body.rig.bind, -1);
      body.aimTurns = [];
      body.reachTurns = [];
    }
    const frame = { rootX: r[0], rootY, rootZ: r[2], rootYaw: yaw, unitsPerMetre: body.rig.bindScale };
    const target = look ? { x: look.target.x, y: look.target.y, z: look.target.z } : null;
    const hands = this.handTargets(body, reaches);
    const solve = (dt) => {
      const aimed = THREE.aimBody(body.aim, body.measure, body.rig.bind, grounded.turns,
        { ...frame, dt, target, bodyFree: false, weight: look ? look.amount : 1 }, body.aimTurns);
      return THREE.reachHands(body.reach, body.measure, body.rig.bind, aimed.turns,
        { ...frame, dt, seated, hands }, body.reachTurns);
    };
    if (!steady) for (let i = 0; i < 12; i++) solve(0.05);
    const reached = solve(steady ? t - was.t : 0);
    body.aimedAt = t;
    body.hands = reached;
    // An arm the pose is animating (a gesture) keeps the pose's turns, eased in and out by the
    // gesture's own envelope: seated, the solver would otherwise rest that hand on its thigh.
    let finalTurns = reached.turns;
    const anim = reaches.filter((R) => R.anim && R.weight > 0);
    if (anim.length) {
      const mR = toMap(reached.turns), mA = toMap(body.aimTurns);
      for (const R of anim) {
        const arm = R.side === "L" ? [j.shoulderL, j.elbowL, j.wristL] : [j.shoulderR, j.elbowR, j.wristR];
        for (const joint of arm) mR.set(joint, qSlerp(mR.get(joint) || IDENTITY, mA.get(joint) || IDENTITY, Math.min(1, R.weight)));
      }
      finalTurns = toTurns(mR);
    }
    body.rig.apply(finalTurns);
    body.model.position.set(r[0], rootY, r[2]);
    body.model.rotation.set(0, yaw, 0);
    body.model.updateMatrixWorld(true);

    body.shadow.position.set(now.p[0], 0.004, now.p[2]);
    const size = seated ? 0.62 : 0.5;
    body.shadow.scale.set(size, size, 1);
    body.shadow.material.opacity = 0.5 * a.opacity;
    if (a.opacity !== body.opacity) {
      body.opacity = a.opacity;
      for (const m of body.materials) {
        m.transparent = a.opacity < 0.999;
        m.opacity = a.opacity;
        m.needsUpdate = true;
      }
    }
    return { at: now.p, yaw, seated };
  }

  // ------------------------------------------------------------------------ the reaches
  // Arms that have somewhere to be, in the room: { side, target (world), weight, palm }.
  reachesFor(body, a, t, place) {
    const out = [];
    const gest = a.gestures || [];
    const yaw = place.yaw, fwd = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    const L = body.measure.leftSign < 0 ? -1 : 1;
    const left = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw)).multiplyScalar(L);
    const shoulderY = place.seated ? body.eye.sit - 0.22 : body.eye.stand - 0.22;
    const chest = new THREE.Vector3(place.at[0], shoulderY, place.at[2]);
    // the nearest keyboard in front, within an arm and a lean
    const nearestKeyboard = (reach) => {
      let found = null, best = reach;
      for (const K of this.keyboards) {
        const v = K.c.clone().sub(chest);
        const d = Math.hypot(v.x, v.z);
        if (d < best && v.x * fwd.x + v.z * fwd.z > 0.2) { best = d; found = K; }
      }
      return found;
    };
    const kb = nearestKeyboard(KEYBOARD_REACH);
    // Seated and awake, the hands rest on the thighs instead of hanging in the air, and
    // while this person talks one of them comes up in front of the chest and goes back.
    const busy = new Set();
    // Pressing a button: the fingertip on it, pushed in on each tap.
    const taps = gest.filter((g) => g.name === "tap");
    for (const g of gest) {
      if (g.name !== "press" && !(g.name === "tap" && !gest.some((p) => p.name === "press"))) continue;
      const T = this.targetOf(g);
      if (!T) continue;
      const side = g.opts && g.opts.arm === "left" ? "L" : "R";
      const w = g.name === "press" ? pressWeight(g) : envelope(g.u, 0.3);
      const push = taps.reduce((m, tp) => Math.max(m, Math.sin(Math.PI * tp.u)), 0);
      out.push({ side, target: T.clone().add(new THREE.Vector3(0, 0.006 - 0.012 * push, 0)), weight: w, palm: new THREE.Vector3(0, -1, 0), pressing: w });
      busy.add(side);
    }
    for (const g of gest) {
      if (g.name === "type" && kb && g.opts && g.opts.arm) busy.add(g.opts.arm === "left" ? "L" : "R");
      else if ((g.name === "type" || g.name === "reach") && kb) { busy.add("L"); busy.add("R"); }
      if (["point", "small-hand-gesture", "wave", "hand-on-belly"].includes(g.name)) busy.add(g.opts && g.opts.arm === "left" ? "L" : "R");
      // an arm the pose animates (a point, a wave, a small gesture): the solver must not rest it
      if (["point", "small-hand-gesture", "wave"].includes(g.name)) out.push({ side: g.opts && g.opts.arm === "left" ? "L" : "R", anim: true, weight: envelope(g.u, 0.25) });
    }
    // HANDS ON THE KEYS ("keys", over a stretch of the chapter): both hands -- or the one
    // the event names -- rest on the nearest keyboard, the fingers never quite still, for as
    // long as nothing else needs that hand. A point, the intercom button or a reach takes its
    // own hand and the other stays; "type" with no arm takes both and types.
    const keys = gest.find((g) => g.name === "keys");
    const holdKb = keys ? nearestKeyboard(KEYBOARD_HOLD_REACH) : null;
    const typingBoth = gest.some((g) => g.name === "type" && kb && !(g.opts && g.opts.arm));
    if (keys && holdKb && !typingBoth) {
      const d = (keys.opts && keys.opts.dur) || 1;
      const e = envelope(keys.u, Math.min(0.3, 0.6 / Math.max(0.6, d)));
      const sgn = holdKb.axis.dot(left) > 0 ? 1 : -1;
      const sides = keys.opts && keys.opts.arm ? [keys.opts.arm === "left" ? "L" : "R"] : ["L", "R"];
      for (const [side, off, ph] of [["L", 0.1 * sgn, 0], ["R", -0.1 * sgn, 2.1]]) {
        if (!sides.includes(side) || busy.has(side)) continue;
        const target = holdKb.c.clone().addScaledVector(holdKb.axis, off);
        target.y += KEY_TOP + 0.004 * Math.sin(t * 2 * Math.PI * 0.9 + ph + body.seed);
        out.push({ side, target, weight: e, palm: new THREE.Vector3(0, -1, 0), typing: true, axis: holdKb.axis });
        busy.add(side);
      }
    }
    if (place.seated && a.state.v !== "asleep") {
      const wake = a.state.prev === "asleep" ? smooth((t - a.state.since) / 0.8) : 1;
      const talk = this.talking(body.id, t), s = body.seed;
      const lift = talk * (0.55 + 0.45 * Math.sin(t * 2 * Math.PI * 0.42 + 3 * s));
      const talker = s % 2 ? "L" : "R";
      for (const side of ["L", "R"]) {
        if (busy.has(side)) continue;
        out.push({ side, rest: true, weight: wake, lift: side === talker ? lift : 0 });
      }
    }
    for (const g of gest) {
      if (g.name === "type" && kb) {
        const e = envelope(g.u, Math.min(0.3, 0.5 / Math.max(0.5, (g.opts && g.opts.dur) || 1)));
        const sgn = kb.axis.dot(left) > 0 ? 1 : -1;
        const only = g.opts && g.opts.arm ? (g.opts.arm === "left" ? "L" : "R") : null;
        for (const [side, off, ph] of [["L", 0.1 * sgn, 0], ["R", -0.1 * sgn, Math.PI]]) {
          if (only && side !== only) continue;
          const target = kb.c.clone().addScaledVector(kb.axis, off);
          target.y += KEY_TOP + 0.012 * Math.max(0, Math.sin(t * 2 * Math.PI * 5.5 + ph));
          out.push({ side, target, weight: e, palm: new THREE.Vector3(0, -1, 0), typing: true, axis: kb.axis });
        }
      } else if (g.name === "reach" && kb) {
        const e = envelope(g.u, 0.3), side = g.opts && g.opts.arm === "left" ? "L" : "R";
        const target = kb.c.clone().addScaledVector(kb.axis, (side === "L" ? 1 : -1) * (kb.axis.dot(left) > 0 ? 0.08 : -0.08));
        target.y += KEY_TOP + 0.01;
        out.push({ side, target, weight: e, palm: new THREE.Vector3(0, -1, 0), typing: true, axis: kb.axis });
      } else if (g.name === "hand-on-belly") {
        const e = envelope(g.u, 0.25), side = g.opts && g.opts.arm === "left" ? "L" : "R";
        out.push({ side, belly: true, weight: e }); // the spot is read off the placed body (reachArm)
      }
    }
    return out;
  }

  // The reaches as the solver's hand targets: where each FINGERTIP goes, in the world. A
  // free seated hand is not listed -- the solver rests it on its thigh. A talking hand and a
  // hand on Sarah's stomach are placed off the body as it stood last frame.
  handTargets(body, reaches) {
    const out = [];
    const j = body.measure.joints, B = body.bones;
    const pos = (b) => b.getWorldPosition(new THREE.Vector3());
    const yaw = body.model.rotation.y, fwd = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    const put = (side, p, kind, palm, axis) => out.push({
      side, x: p.x, y: p.y, z: p.z, kind,
      ...(palm ? { palm: { x: palm.x, y: palm.y, z: palm.z } } : {}),
      ...(axis ? { slideAxis: { x: axis.x, y: axis.y, z: axis.z } } : {}),
    });
    for (const R of reaches) {
      if (R.anim) continue;
      if (R.rest) {
        if (!(R.lift > 0.35 && R.weight > 0.5)) continue;
        // up in front of the chest, palm turned in and up: a hand that talks
        const [sh] = R.side === "L" ? [j.shoulderL] : [j.shoulderR];
        const S = pos(B[sh]), chest = pos(B[j.chest]), out2 = S.clone().sub(chest).setY(0).normalize();
        const up = chest.clone().addScaledVector(fwd, 0.34).add(new THREE.Vector3(0, -0.12, 0)).addScaledVector(out2, 0.12);
        put(R.side, up, "hold", out2.clone().negate().add(new THREE.Vector3(0, 0.6, 0)).normalize());
        continue;
      }
      if (!(R.weight > 0.5)) continue;
      if (R.belly) {
        const [sh] = R.side === "L" ? [j.shoulderL] : [j.shoulderR];
        const spine = pos(B[j.spine]), pelvis = pos(B[j.pelvis]);
        const p = spine.clone().lerp(pelvis, 0.35).addScaledVector(fwd, 0.26).addScaledVector(pos(B[sh]).sub(spine).setY(0).normalize(), 0.03);
        put(R.side, p, "hold", fwd.clone().negate());
        continue;
      }
      put(R.side, R.target, R.pressing ? "press" : "hold", R.palm, R.axis);
    }
    return out;
  }

  drawChairs(state, t, placed) {
    for (const c of this.chairs) {
      const seg = c.segs.find((s) => s.t0 <= t && t < s.t1);
      let show = !!seg && !seg.hidden, at, yaw, opacity = 1, seatTop;
      if (show && seg.owner) {
        const p = placed[seg.owner], a = state.actors[seg.owner];
        if (!p || !p.seated) show = false;
        else {
          at = p.at;
          yaw = p.yaw;
          opacity = a.opacity;
          seatTop = this.bodies[seg.owner].seatTop;
        }
      } else if (show) {
        at = seg.at;
        yaw = seg.yaw;
        seatTop = seg.seatTop;
      }
      c.mesh.visible = c.shadow.visible = show && opacity > 0.001;
      if (!c.mesh.visible) continue;
      c.mesh.position.set(at[0], 0, at[2]);
      c.mesh.rotation.set(0, yaw, 0);
      c.mesh.userData.setSeat(seatTop);
      c.shadow.position.set(at[0], 0.003, at[2]);
      c.shadow.material.opacity = 0.55 * opacity;
      for (const m of c.mesh.userData.materials) {
        m.transparent = opacity < 0.999;
        m.opacity = opacity;
      }
    }
  }

  // ------------------------------------------------------------------------- one frame
  // cam: the stage's framing (camera.js frameShot). The 3D camera is the picture's, cropped
  // the same way, unless the shot moves it (`cam3`): then position, turn and lens blend
  // toward the shot's by d3, and the painted room gives way to the baked one.
  render(state, cam, view) {
    if (!this.active) return;
    const t = state.t, W = view.w, H = view.h, z = cam.zoom;
    this.now = t;
    for (const c of [this.peopleCanvas, this.roomCanvas]) {
      Object.assign(c.style, { left: -cam.tx / z + "px", top: -cam.ty / z + "px", width: W / z + "px", height: H / z + "px" });
    }
    for (const r of [this.peopleRenderer, this.roomRenderer]) {
      const s = r.getSize(new THREE.Vector2());
      if (s.x !== W || s.y !== H) r.setSize(W, H, false);
    }

    // a probe may hold a camera of its own (window.__tmbCam3 = { at, look, hfov }): never set
    // by the page itself
    const hold = typeof window !== "undefined" && window.__tmbCam3;
    let s3 = state.camera;
    if (hold) {
      const d = [hold.look[0] - hold.at[0], hold.look[1] - hold.at[1], hold.look[2] - hold.at[2]];
      s3 = { ...s3, d3: 1, cx3: hold.at[0], cy3: hold.at[1], cz3: hold.at[2], yaw3: (Math.atan2(-d[0], -d[2]) * 180) / Math.PI,
        pitch3: (Math.atan2(d[1], Math.hypot(d[0], d[2])) * 180) / Math.PI, hfov3: hold.hfov || 60 };
    }
    const d3 = this.spec.moves === false ? 0 : Math.max(0, Math.min(1, s3.d3 || 0));
    const F0 = this.cam0.F;
    const A = { f: z * F0, cx: z * this.cam0.CX + cam.tx, cy: z * this.cam0.CY + cam.ty };
    const fB = W / 2 / Math.tan(((s3.hfov3 || 60) * DEG) / 2);
    const f = A.f + (fB - A.f) * d3, cx = A.cx + (W / 2 - A.cx) * d3, cy = A.cy + (H / 2 - A.cy) * d3;
    const C = this.camera, n = 0.05, far = this.lab.far || 40; // a room with a view (the control room's window) sees further
    if (d3 > 0) {
      C.position.set(s3.cx3, s3.cy3, s3.cz3);
      C.rotation.set(s3.pitch3 * DEG, s3.yaw3 * DEG, 0);
    } else {
      C.position.set(0, this.cam0.H, this.cam0.Z0);
      C.rotation.set(0, -this.cam0.yaw, 0);
    }
    C.updateMatrixWorld(true);
    C.projectionMatrix.makePerspective((-cx / f) * n, ((W - cx) / f) * n, (cy / f) * n, (-(H - cy) / f) * n, n, far);
    C.projectionMatrixInverse.copy(C.projectionMatrix).invert();

    this.lights = state.lights;
    // a room that moves (the TOMBS rings, the lever, the lighting) moves by the scene's props
    if (this.lab.update) this.lab.update(state.props || {}, t, { room: this.roomLights, people: this.peopleLights, scene: this.roomScene, peopleScene: this.scene, camera: this.camera });
    for (const [n, m] of this.maskPairs || []) {
      m.position.copy(n.position);
      m.quaternion.copy(n.quaternion);
      m.scale.copy(n.scale);
      m.visible = n.visible && !n.userData.noMask;
    }
    const places = {}, placed = {};
    for (const id of Object.keys(this.bodies)) if (state.actors[id]) places[id] = this.placeBody(id, state.actors[id], t);
    this.pullChairsIn(places);
    this.keepApart(places);
    const boardPlaces = {};
    for (const id of Object.keys(this.boards || {})) if (state.actors[id]) boardPlaces[id] = this.placeBoard(id, state.actors[id], t);
    for (const id of Object.keys(places)) placed[id] = this.drawBody(id, state.actors[id], t, places[id], { ...places, ...boardPlaces });
    for (const [id, p] of Object.entries(boardPlaces)) this.drawBoard(id, state.actors[id], t, p);
    if (this.creatures) this.creatures.update(state.props || {}, t);
    this.drawChairs(state, t, placed);
    for (const [id, g] of Object.entries(this.glows)) {
      const l = state.lights[id];
      if (!l) continue;
      const { color, a } = rgba(l.color);
      const v = Math.max(0, l.intensity * (l.throbbing ? 0.55 + 0.45 * l.throb : 1) + l.pulse);
      g.color.copy(color);
      g.intensity = 2.2 * a * v;
      const r = this.roomGlows && this.roomGlows[id];
      if (r) { r.color.copy(color); r.intensity = 1.6 * a * v; }
    }
    // the intercom's lamp is lit while its line is open
    const lamp = this.props && this.props.lamps.intercom, il = state.lights.intercom;
    if (lamp && il) lamp.emissiveIntensity = 0.15 + 3 * Math.max(0, il.intensity + il.pulse * 0.5);

    this.peopleCanvas.style.display = "";
    this.peopleRenderer.render(this.scene, C);

    // The built room is the set now, for every shot: the painting stays for the drawn people.
    this.roomCanvas.style.display = "";
    this.roomRenderer.render(this.roomScene, C);
    this.carrySetPieces(cam, W, H, f);
  }

  // THE ROOM shots: the screens and the glows go where the moving camera sees them.
  carrySetPieces(cam, W, H, f) {
    const z = cam.zoom, v = new THREE.Vector3();
    const toLayer = (p) => {
      v.copy(p).project(this.camera);
      return [((v.x + 1) / 2 * W - cam.tx) / z, ((1 - v.y) / 2 * H - cam.ty) / z];
    };
    const eye = this.camera.position, fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    for (const [id, node] of Object.entries(this.stage.screens)) {
      const P = this.screenAnchors[id];
      if (!P) continue;
      if (node.painted === undefined) node.painted = node.host.style.transform;
      const behind = P.some((p) => p.clone().sub(eye).dot(fwd) < 0.06);
      node.host.style.visibility = behind ? "hidden" : "";
      if (!behind) node.host.style.transform = quadMatrix3d(node.spec.width, node.spec.height, P.map(toLayer));
    }
    // The painting and its painted glows step aside: in the built room the glows are lights
    // (this.glows, this.roomGlows) and the intercom has a lamp.
    // The built room is lit for night; the painting's night grade is for the painting.
    if (this.stage.bgImg) this.stage.bgImg.style.visibility = "hidden";
    if (this.stage.grade) this.stage.grade.style.display = "none";
    for (const node of Object.values(this.stage.lights)) node.el.style.display = "none";
    this.moved = true;
  }

  restoreSetPieces() {
    if (!this.moved) return;
    for (const node of Object.values(this.stage.screens)) {
      if (node.painted !== undefined) node.host.style.transform = node.painted;
      node.host.style.visibility = "";
    }
    for (const node of Object.values(this.stage.lights)) node.el.style.display = "";
    if (this.stage.bgImg) this.stage.bgImg.style.visibility = "";
    if (this.stage.grade) this.stage.grade.style.display = "";
    this.moved = false;
  }
}
