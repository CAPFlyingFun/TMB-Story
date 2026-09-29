// THE PEOPLE IN 3D (Joshua, 2026-09-29: "I was wanting to replace the 2D storyboard with the
// 3D models", and, asked how: "Both, switchable"). Jack and Sarah are the real rigged
// models from TRADDOMIUM: Micro Battle (assets/models/jack.glb, sarah.glb -- that game's
// pair, the ones the 2D sprites were drawn from), posed by that game's own rig code
// (vendor/three-human.js, bundled from its src/actor and src/view), and drawn in the
// painted picture by the picture's own camera.
//
// TWO WAYS TO SEE THE ROOM, per shot:
//   - THE PAINTING (every shot by default). The lab picture stays exactly as painted and
//     the camera crops it the way it always has. The people are drawn over it through the
//     camera the picture was painted from (recovered from its lines: scripts/bake-lab-3d.py),
//     so a floor point in the scene's stage coordinates is the same floor point in 3D.
//     The room is also drawn, invisibly, into the depth buffer, so a cabinet in front of
//     someone hides them the way it hides the floor.
//   - THE ROOM (a shot with `cam3`). The camera really moves: the room is the picture
//     baked back onto its own shapes (assets/models/lab-3d.glb), and seen from where the
//     picture was painted it IS the picture, so the cut from painting to room cannot be
//     seen. The screens and the glows are carried along to where the new camera sees them.
//
// SWITCHABLE: `?people=2d` (or the menu) puts the drawn sprites back; the scene is the
// same either way, and a shot with `cam3` falls back to its flat framing.
//
// Units are metres in the ROOM FRAME: x right, y up, z toward the picture's camera, the
// floor at y = 0 and that camera at (0, height, 0).

import * as THREE from "../vendor/three-human.js";
import { envelope } from "./gestures.js";
import { quadMatrix3d } from "./homography.js";

const DEG = Math.PI / 180;
const smooth = (p) => (p <= 0 ? 0 : p >= 1 ? 1 : p * p * (3 - 2 * p));
// Which way a body faces for each of the scene's compass directions, as three's rotation.y
// (the models face +z, toward the camera). North is into the picture.
const FACING = { south: 0, southeast: Math.PI / 4, east: Math.PI / 2, northeast: (3 * Math.PI) / 4, north: Math.PI, northwest: (-3 * Math.PI) / 4, west: -Math.PI / 2, southwest: -Math.PI / 4 };
const TURN_SECONDS = 0.45; // a change of facing, as a turn rather than a cut
const BLEND_SECONDS = 0.55; // a change of pose or state (asleep to awake, sitting to standing)
const WALK_CYCLE = 1.05; // seconds per stride pair, the 2D walk's period
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
    return [t * r[0], 0, t * r[2]];
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
    // The room, under the screens (600); the people, over every sprite and under the grade.
    this.roomCanvas = mk(500);
    this.peopleCanvas = mk(4000);

    this.camera = new THREE.PerspectiveCamera();
    this.camera.rotation.order = "YXZ";
    this.scene = new THREE.Scene();
    this.roomScene = new THREE.Scene();
    this.roomScene.background = new THREE.Color(0x0b0f14);

    // THE PEOPLE'S LIGHT, placed where the painting's is: a cool fill from the ceiling
    // panels, a key down from the panel row over the desks, and the set's own glows (the
    // monitor, the alarm, the intercom) as point lights that take their colour and level
    // from the scene every frame.
    this.scene.add(new THREE.HemisphereLight(0xb8cee0, 0x22272c, 1.0));
    const key = new THREE.DirectionalLight(0xe6f1ff, 1.2);
    key.position.set(0.3, 2.6, -1.6);
    key.target.position.set(-0.3, 0, -3.0);
    this.scene.add(key, key.target);
    this.glows = {};
    this.shadowTex = shadowTexture();

    this.ready = this.load(options).then(() => {
      this.readyFlag = true;
    });
  }

  async load(options) {
    const loader = new THREE.GLTFLoader();
    loader.setMeshoptDecoder(THREE.MeshoptDecoder);
    const get = (p) => loader.loadAsync(this.url(p));
    const [room, ...people] = await Promise.all([get(this.spec.room), ...Object.values(this.spec.models).map(get)]);
    const ids = Object.keys(this.spec.models);

    // The room, twice: textured for THE ROOM shots, and depth only for the painting, where
    // it hides whatever stands behind a cabinet and draws nothing itself.
    this.room = room.scene;
    this.roomScene.add(this.room);
    const mask = room.scene.clone(true);
    mask.traverse((n) => {
      if (n.isMesh) {
        n.material = new THREE.MeshBasicMaterial({ colorWrite: false });
        n.renderOrder = -1;
      }
    });
    this.scene.add(mask);
    this.room.updateMatrixWorld(true);
    this.anchorSetPieces();

    ids.forEach((id, i) => this.addBody(id, people[i].scene));
    this.planChairs(options);

    this.peopleRenderer = new THREE.WebGLRenderer({ canvas: this.peopleCanvas, alpha: true, antialias: true, premultipliedAlpha: true });
    this.peopleRenderer.setClearColor(0x000000, 0);
    this.roomRenderer = new THREE.WebGLRenderer({ canvas: this.roomCanvas, antialias: true });
    for (const r of [this.peopleRenderer, this.roomRenderer]) r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    // Upload the room's texture now, not on the first frame of the first camera move.
    this.roomRenderer.compile(this.roomScene, this.camera);
    this.room.traverse((n) => n.isMesh && n.material.map && this.roomRenderer.initTexture(n.material.map));
  }

  // Where the screens and the glows are in the room: the painted pixel, followed from the
  // picture's camera until it meets the room's shapes.
  anchorSetPieces() {
    const ray = new THREE.Raycaster();
    const eye = new THREE.Vector3(0, this.cam0.H, 0);
    const hit = (u, v) => {
      const d = new THREE.Vector3(...this.cam0.ray(u, v)).normalize();
      ray.set(eye, d);
      const h = ray.intersectObject(this.room, true)[0];
      return h ? h.point.clone() : eye.clone().addScaledVector(d, 3.5);
    };
    const fwd = new THREE.Vector3(this.cam0.s, 0, -this.cam0.c);
    const depth = (p) => p.clone().sub(eye).dot(fwd);
    for (const [id, s] of Object.entries(this.stage.set.screens || {})) {
      this.screenAnchors[id] = s.corners.map(([u, v]) => hit(u, v));
    }
    for (const [id, l] of Object.entries(this.stage.set.lights || {})) {
      const p = hit(l.x, l.y);
      this.lightAnchors[id] = { p, depth: depth(p), radius: l.radius };
      // the glow as a light for the people: a little in front of whatever it is painted on
      const glow = new THREE.PointLight(0xffffff, 0, 3.2, 1.6);
      glow.position.copy(p).addScaledVector(p.clone().sub(eye).normalize(), -0.3);
      this.scene.add(glow);
      this.glows[id] = glow;
    }
  }

  addBody(id, model) {
    const rig = new THREE.HumanRig(model);
    const measure = THREE.measureHuman(rig.bind);
    // Seat geometry, measured once: pose the doze at the origin and read where it put the
    // hips and the ankles. A pose never moves the hips, so this holds for every pose.
    model.position.set(0, 0, 0);
    model.rotation.set(0, 0, 0);
    rig.apply(THREE.poseSeated(measure, rig.bind, { style: "doze", seconds: 0, headSide: 1 }, []));
    model.updateMatrixWorld(true);
    const skin = THREE.findSkinnedMesh(model), bones = skin.skeleton.bones, j = measure.joints;
    const w = (i) => bones[i].getWorldPosition(new THREE.Vector3());
    const hips = w(j.hipL).add(w(j.hipR)).multiplyScalar(0.5);
    const ankle = Math.min(w(j.ankleL).y, w(j.ankleR).y);
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
    this.bodies[id] = { id, model, rig, measure, materials, shadow, seatTop, hips, seed: Object.keys(this.bodies).length, opacity: 1 };
  }

  // Where a character is on the floor, in metres: the stage's own rule first (the floor
  // polygon keeps a chair's base out of the cabinets), then the room's aisle in 3D.
  floorOf(id, a, poseName) {
    const node = this.stage.actors[id];
    const pose = node.sprite.poses[poseName];
    const [fx, fy] = this.stage.onFloor(a, pose);
    const p = this.cam0.floor(fx, fy);
    const A = this.spec.aisle;
    if (A) {
      const r = poseName === "sitting" ? CHAIR.baseRadius + CHAIR.casterRadius + 0.03 : 0.2;
      const right = p[2] + r > A.rightRunEnds ? Math.min(A.right, A.rightNear) : A.right;
      p[0] = Math.min(Math.max(p[0], A.left + r), right - r);
      p[2] = Math.max(p[2], A.deskFront + r);
    }
    return p;
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
        const sitting = a.pose.v === "sitting";
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
      const phase = walking ? ((t - a.state.since) / WALK_CYCLE) % 1 : 0;
      turns = THREE.poseHuman(measure, rig.bind, { stance: walking ? "walk" : "stand", phase, seconds: t + body.seed * 1.7, lean: 0 }, []);
    }
    return toMap(turns);
  }

  // What the story asks of a body on top of its pose: leaning in, a start, the idle drift
  // of someone awake, and the gestures (engine/gestures.js names them; here they are joint
  // turns in the bind frame -- see TRADDOMIUM's humanSeated.ts for the sign rules).
  extras(body, a, t, seated) {
    const j = body.measure.joints, L = body.measure.leftSign < 0 ? -1 : 1;
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
          add(A.sh, rx(-(seated ? 30 : 45) * DEG * e));
          if (seated) add(A.el, ry(A.s * 30 * DEG * e));
          add(j.spine, rx(5 * DEG * e));
          break;
        }
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

  poseKind(pose, state) {
    if (pose === "sitting") return state === "asleep" ? "doze" : "sit";
    return state === "walking" ? "walk" : "stand";
  }

  // Everything about one body at time t: its joints, where it stands, which way it faces.
  drawBody(id, a, t) {
    const body = this.bodies[id];
    const shown = a.visible && a.opacity > 0.001;
    body.model.visible = body.shadow.visible = shown;
    if (!shown) return null;
    // The pose, blended from whatever it was a moment ago (asleep to awake, standing up).
    const cur = this.poseKind(a.pose.v, a.state.v);
    const poseChangedLast = a.pose.since >= a.state.since;
    const changedAt = Math.max(a.pose.since, a.state.since);
    const prev = poseChangedLast ? this.poseKind(a.pose.prev, a.state.v) : this.poseKind(a.pose.v, a.state.prev);
    const k = smooth((t - changedAt) / BLEND_SECONDS);
    let map = this.basePose(body, cur, t, a);
    if (prev !== cur && k < 1) map = blendMaps(this.basePose(body, prev, t, a), map, k);
    const seated = a.pose.v === "sitting";
    for (const [joint, q] of this.extras(body, a, t, seated)) map.set(joint, qMul(q, map.get(joint) || IDENTITY));
    body.rig.apply(toTurns(map));

    // Where: the floor point, and for a seated body the hips over the chair's seat.
    const yaw = this.facingAt(a, t);
    const root = (poseName) => {
      const p = this.floorOf(id, a, poseName);
      if (poseName !== "sitting") return { p, root: [p[0], 0, p[2]] };
      const c = Math.cos(yaw), s = Math.sin(yaw);
      const rot = (x, z) => [x * c + z * s, -x * s + z * c];
      const back = rot(0, -0.04), hip = rot(body.hips.x, body.hips.z);
      return { p, root: [p[0] + back[0] - hip[0], body.seatTop + 0.1 - body.hips.y, p[2] + back[1] - hip[1]] };
    };
    const now = root(a.pose.v);
    let r = now.root;
    if (poseChangedLast && a.pose.prev !== a.pose.v && k < 1) {
      const was = root(a.pose.prev).root;
      r = was.map((v, i) => v + (r[i] - v) * k);
    }
    const hop = a.jolt ? 0.015 * a.jolt : 0;
    body.model.position.set(r[0], r[1] + hop, r[2]);
    body.model.rotation.set(0, yaw, 0);
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
    for (const c of [this.peopleCanvas, this.roomCanvas]) {
      Object.assign(c.style, { left: -cam.tx / z + "px", top: -cam.ty / z + "px", width: W / z + "px", height: H / z + "px" });
    }
    for (const r of [this.peopleRenderer, this.roomRenderer]) {
      const s = r.getSize(new THREE.Vector2());
      if (s.x !== W || s.y !== H) r.setSize(W, H, false);
    }

    const s3 = state.camera, d3 = this.spec.moves === false ? 0 : Math.max(0, Math.min(1, s3.d3 || 0));
    const F0 = this.cam0.F;
    const A = { f: z * F0, cx: z * this.cam0.CX + cam.tx, cy: z * this.cam0.CY + cam.ty };
    const fB = W / 2 / Math.tan(((s3.hfov3 || 60) * DEG) / 2);
    const f = A.f + (fB - A.f) * d3, cx = A.cx + (W / 2 - A.cx) * d3, cy = A.cy + (H / 2 - A.cy) * d3;
    const C = this.camera, n = 0.05, far = 40;
    if (d3 > 0) {
      C.position.set(s3.cx3, s3.cy3, s3.cz3);
      C.rotation.set(s3.pitch3 * DEG, s3.yaw3 * DEG, 0);
    } else {
      C.position.set(0, this.cam0.H, 0);
      C.rotation.set(0, -this.cam0.yaw, 0);
    }
    C.updateMatrixWorld(true);
    C.projectionMatrix.makePerspective((-cx / f) * n, ((W - cx) / f) * n, (cy / f) * n, (-(H - cy) / f) * n, n, far);
    C.projectionMatrixInverse.copy(C.projectionMatrix).invert();

    const placed = {};
    for (const id of Object.keys(this.bodies)) {
      const a = state.actors[id];
      if (a) placed[id] = this.drawBody(id, a, t);
    }
    this.drawChairs(state, t, placed);
    for (const [id, g] of Object.entries(this.glows)) {
      const l = state.lights[id];
      if (!l) continue;
      const { color, a } = rgba(l.color);
      const v = Math.max(0, l.intensity * (l.throbbing ? 0.55 + 0.45 * l.throb : 1) + l.pulse);
      g.color.copy(color);
      g.intensity = 2.2 * a * v;
    }

    this.peopleCanvas.style.display = "";
    this.peopleRenderer.render(this.scene, C);

    const roomOn = d3 > 0.0005;
    if (roomOn) {
      this.roomCanvas.style.display = "";
      this.roomCanvas.style.opacity = Math.min(1, d3 * 25).toFixed(3);
      this.roomRenderer.render(this.roomScene, C);
      this.carrySetPieces(cam, W, H, f);
    } else {
      this.roomCanvas.style.display = "none";
      this.restoreSetPieces();
    }
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
    for (const [id, node] of Object.entries(this.stage.lights)) {
      const L = this.lightAnchors[id];
      if (!L) continue;
      if (!node.painted) node.painted = { left: node.el.style.left, top: node.el.style.top, width: node.el.style.width };
      const d = L.p.clone().sub(eye).dot(fwd);
      if (d < 0.06) { node.el.style.visibility = "hidden"; continue; }
      node.el.style.visibility = "";
      const [x, y] = toLayer(L.p);
      const r = (L.radius * (L.depth / this.cam0.F) * (f / d)) / z;
      Object.assign(node.el.style, { left: x - r + "px", top: y - r + "px", width: 2 * r + "px", height: 2 * r + "px" });
    }
    this.moved = true;
  }

  restoreSetPieces() {
    if (!this.moved) return;
    for (const node of Object.values(this.stage.screens)) {
      if (node.painted !== undefined) node.host.style.transform = node.painted;
      node.host.style.visibility = "";
    }
    for (const node of Object.values(this.stage.lights)) {
      if (node.painted) Object.assign(node.el.style, { ...node.painted, height: node.painted.width });
      node.el.style.visibility = "";
    }
    this.moved = false;
  }
}
