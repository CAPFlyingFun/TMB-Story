// JACK'S LABORATORY, BUILT (Joshua, 2026-09-29: "rebuild the lab... you can use the Lab
// ChatGPT did as it looks better. It's okay if it's a different layout if it works and
// looks better", and, of the picture baked onto boxes: "don't reuse the image textures").
//
// The look is ChatGPT's procedural lab (TMB-Interactive-Story, app/game/three/lab-room.ts):
// a lit room of plain shapes with no photographs in it -- a blue-grey shell with steel ribs,
// teal light strips, warm ceiling panels, a TOMBS sign, racks with teal indicators, keys on
// the keyboards and terminals that draw their own screens. The LAYOUT is the story's: the
// same room the Watch mode has always staged Chapter 1 in (the painted picture's, measured
// in metres), so every mark, walk, chair and camera shot of the chapter still lands --
// Jack's desk across the back, the aisle down the middle, the counters either side, and
// the sliding door behind the camera Sarah comes in through.
//
// Metres, the room frame people3d.js uses: x right, y up, z toward the picture's camera,
// the floor at y = 0 and that camera at (0, 1.43, 0), looking down the aisle (-z).

import { solidsOf } from "./collide.js";
import * as THREE from "../vendor/three-human.js";

const DEG = Math.PI / 180;

// THE ROOM. The side walls, the ceiling and the south wall are the picture's; the back wall
// stands 0.45 m further back than the picture could show it, so the back desk is a real
// 0.7 m deep and a keyboard fits in front of a monitor.
export const ROOM = { xl: -1.45, xr: 2.15, zb: -4.36, zs: 1.1, ceiling: 2.62, door: [-0.28, 0.96, 2.1] };
const DESK = { x0: -0.5, x1: 1.22, z0: -4.36, z1: -3.65, top: 0.78 };
const LEFT = { x0: ROOM.xl, x1: -0.5, z0: ROOM.zb, z1: -0.78, top: 0.9 };
const RIGHT = { x0: 1.2, x1: ROOM.xr, z0: ROOM.zb, z1: -1.46, top: 0.86 };
const NEAR_R = { x0: 1.08, x1: ROOM.xr, z0: -1.04, z1: ROOM.zs, top: 0.9 };
const NEAR_L = { x0: ROOM.xl, x1: -0.62, z0: -0.57, z1: ROOM.zs, top: 0.88 };

export function buildLabRoom() {
  const M = palette();
  const group = new THREE.Group();
  group.name = "lab";
  const anchors = {}, lamps = {}, screens = {}, lights = {}, keyboards = [], terminals = [];
  const add = (o) => (group.add(o), o);
  const box = (w, h, d, x, y, z, mat, parent = group) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };
  const span = (x0, x1, y0, y1, z0, z1, mat, parent = group) => box(x1 - x0, y1 - y0, z1 - z0, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, mat, parent);

  // ---------------------------------------------------------------------- the shell
  const W = ROOM.xr - ROOM.xl, D = ROOM.zs - ROOM.zb, C = ROOM.ceiling, cx = (ROOM.xl + ROOM.xr) / 2, cz = (ROOM.zb + ROOM.zs) / 2;
  span(ROOM.xl, ROOM.xr, -0.02, 0, ROOM.zb, ROOM.zs, M.floor);
  for (let x = Math.ceil(ROOM.xl * 2) / 2; x <= ROOM.xr; x += 0.5) span(x - 0.006, x + 0.006, 0, 0.002, ROOM.zb, ROOM.zs, M.seam);
  for (let z = Math.ceil(ROOM.zb * 2) / 2; z <= ROOM.zs; z += 0.5) span(ROOM.xl, ROOM.xr, 0, 0.002, z - 0.006, z + 0.006, M.seam);
  span(ROOM.xl, ROOM.xr, C, C + 0.05, ROOM.zb, ROOM.zs, M.ceiling);
  // walls: back, left, right, and the south wall round its sliding door
  span(ROOM.xl, ROOM.xr, 0, C, ROOM.zb - 0.1, ROOM.zb, M.shell);
  span(ROOM.xl - 0.1, ROOM.xl, 0, C, ROOM.zb, ROOM.zs, M.shell);
  span(ROOM.xr, ROOM.xr + 0.1, 0, C, ROOM.zb, ROOM.zs, M.shell);
  const [d0, d1, dh] = ROOM.door;
  span(ROOM.xl, d0, 0, C, ROOM.zs, ROOM.zs + 0.1, M.shell);
  span(d1, ROOM.xr, 0, C, ROOM.zs, ROOM.zs + 0.1, M.shell);
  span(d0, d1, dh, C, ROOM.zs, ROOM.zs + 0.1, M.shell);
  const doorL = span(d0, (d0 + d1) / 2, 0, dh, ROOM.zs + 0.02, ROOM.zs + 0.07, M.dark);
  const doorR = span((d0 + d1) / 2, d1, 0, dh, ROOM.zs + 0.02, ROOM.zs + 0.07, M.dark);
  span(d0 - 0.06, d1 + 0.06, dh, dh + 0.06, ROOM.zs - 0.02, ROOM.zs, M.teal);
  // skirting and a dado rail, so the walls read as panels, not paint
  for (const [x0, x1, z0, z1] of [[ROOM.xl, ROOM.xr, ROOM.zb, ROOM.zb + 0.02], [ROOM.xl, ROOM.xl + 0.02, ROOM.zb, ROOM.zs], [ROOM.xr - 0.02, ROOM.xr, ROOM.zb, ROOM.zs]]) {
    span(x0, x1, 0, 0.1, z0, z1, M.dark);
    span(x0, x1, 1.2, 1.23, z0, z1, M.steel);
  }
  // back wall: steel ribs and dark panels between them (ChatGPT's wall), a window onto the
  // dark outside, and the TOMBS sign over it
  for (let x = ROOM.xl + 0.35; x < ROOM.xr; x += 0.7) span(x - 0.01, x + 0.01, 0.1, C, ROOM.zb, ROOM.zb + 0.04, M.steel);
  const win = { x0: -0.05, x1: 0.95, y0: 1.15, y1: 2.0 };
  span(win.x0 - 0.05, win.x1 + 0.05, win.y0 - 0.05, win.y1 + 0.05, ROOM.zb, ROOM.zb + 0.05, M.steel);
  span(win.x0, win.x1, win.y0, win.y1, ROOM.zb + 0.05, ROOM.zb + 0.06, M.window);
  span((win.x0 + win.x1) / 2 - 0.012, (win.x0 + win.x1) / 2 + 0.012, win.y0, win.y1, ROOM.zb + 0.06, ROOM.zb + 0.075, M.steel);
  const sign = add(new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.3), new THREE.MeshBasicMaterial({ map: signTexture(), toneMapped: false })));
  sign.position.set((win.x0 + win.x1) / 2, 2.28, ROOM.zb + 0.06);
  // teal strips down the back corners and along the side walls at the ceiling
  for (const x of [ROOM.xl + 0.12, ROOM.xr - 0.12]) span(x - 0.03, x + 0.03, 0.15, 2.45, ROOM.zb + 0.01, ROOM.zb + 0.05, M.teal);
  for (const x of [ROOM.xl, ROOM.xr]) span(x - 0.02, x + 0.02, C - 0.08, C - 0.04, ROOM.zb, ROOM.zs, M.teal);
  // ceiling: three rows of light panels down the room, each in a steel housing
  for (const x of [-0.75, 0.34, 1.45]) {
    for (let z = ROOM.zb + 0.6; z < ROOM.zs - 0.4; z += 1.35) {
      span(x - 0.3, x + 0.3, C - 0.05, C, z - 0.5, z + 0.5, M.steel);
      span(x - 0.26, x + 0.26, C - 0.06, C - 0.05, z - 0.46, z + 0.46, M.panelLight);
    }
  }

  // ------------------------------------------------------------------- furniture
  cabinets(LEFT, "+x");
  cabinets({ ...RIGHT, x0: RIGHT.x0 + 0.04 }, "-x");
  cabinets({ ...NEAR_R, x0: NEAR_R.x0 + 0.1 }, "-x");
  cabinets({ ...NEAR_L, x1: NEAR_L.x1 - 0.04 }, "+x");
  function cabinets(R, face) {
    const t = R.top;
    span(R.x0, R.x1, 0.08, t - 0.04, R.z0, R.z1, M.shell);
    span(R.x0, R.x1, 0, 0.08, R.z0, R.z1, M.dark); // toe kick
    const lip = 0.025, sx = face === "+x" ? 1 : -1;
    span(R.x0 - (sx < 0 ? lip : 0), R.x1 + (sx > 0 ? lip : 0), t - 0.04, t, R.z0, R.z1 + 0.02, M.top);
    // drawer fronts and handles on the face that looks into the aisle
    const fx = sx > 0 ? R.x1 : R.x0;
    for (let z = R.z0 + 0.25; z < R.z1 - 0.15; z += 0.48) {
      for (const y of [0.2, 0.45, 0.68]) {
        span(fx - 0.004 * sx - 0.002, fx + 0.004 * sx + 0.002, y - 0.1, y + 0.1, z - 0.22, z + 0.22, M.shellDark);
        span(fx + 0.012 * sx - 0.008, fx + 0.012 * sx + 0.008, y + 0.05, y + 0.07, z - 0.12, z + 0.12, M.steel);
      }
    }
  }
  // Jack's desk across the back: a worktop on steel legs, a drawer pedestal, a cable tray
  span(DESK.x0, DESK.x1, DESK.top - 0.035, DESK.top, DESK.z0, DESK.z1, M.top);
  for (const x of [DESK.x0 + 0.04, DESK.x1 - 0.04]) for (const z of [DESK.z0 + 0.06, DESK.z1 - 0.06]) span(x - 0.025, x + 0.025, 0, DESK.top - 0.035, z - 0.025, z + 0.025, M.steel);
  span(0.52, 0.92, 0, DESK.top - 0.04, DESK.z0 + 0.05, DESK.z1 - 0.06, M.shell);
  for (const y of [0.15, 0.4, 0.62]) span(0.6, 0.84, y + 0.05, y + 0.065, DESK.z1 - 0.065, DESK.z1 - 0.05, M.steel);
  span(DESK.x0 + 0.1, DESK.x1 - 0.1, DESK.top - 0.12, DESK.top - 0.1, DESK.z0 + 0.1, DESK.z0 + 0.25, M.dark);
  // equipment racks in the back corners, ChatGPT's: shelves of units with teal lamps
  for (const [x0, x1] of [[ROOM.xl + 0.02, -0.55], [1.25, ROOM.xr - 0.02]]) {
    const z0 = ROOM.zb + 0.02, z1 = ROOM.zb + 0.62;
    span(x0, x1, LEFT.top, 2.25, z0, z1, M.dark);
    for (let i = 0; i < 6; i++) {
      const y = LEFT.top + 0.12 + i * 0.21;
      span(x0 + 0.04, x1 - 0.04, y, y + 0.14, z1 - 0.02, z1 + 0.01, M.unit);
      span(x1 - 0.12, x1 - 0.09, y + 0.05, y + 0.08, z1 + 0.01, z1 + 0.02, i % 3 === 1 ? M.amber : M.teal);
      span(x0 + 0.08, x0 + 0.3, y + 0.05, y + 0.07, z1 + 0.01, z1 + 0.015, M.seamLight);
    }
  }
  // wall shelves over the side counters, with boxed instruments on them (ChatGPT's bench units)
  for (const [x0, x1, face] of [[ROOM.xl, ROOM.xl + 0.42, 1], [ROOM.xr - 0.42, ROOM.xr, -1]]) {
    for (const y of [1.5, 1.86]) {
      span(x0, x1, y, y + 0.03, -3.5, 0.2, M.steel);
      for (let z = -3.2; z < 0.1; z += 0.62) {
        const w = 0.26 + ((Math.abs(z * 7 + y * 3) % 3) * 0.04), fx = face > 0 ? x0 + 0.34 : x1 - 0.34;
        span(Math.min(fx, fx - face * w), Math.max(fx, fx - face * w), y + 0.03, y + 0.25, z - 0.17, z + 0.17, M.unit);
        span(fx - 0.006, fx + 0.006, y + 0.1, y + 0.18, z - 0.12, z + 0.02, (z + y) % 2 > 1 ? M.teal : M.screenDim);
      }
    }
  }

  // ------------------------------------------------------------------ on the desks
  // Monitors: a dark panel on a steel stand; the glass is its own quad so a screen can be
  // drawn on it (Jack's and Sarah's by the story's own screens, the rest by terminals here).
  function monitor(id, x, z, yaw, w, h, lift, surface) {
    const g = new THREE.Group();
    g.position.set(x, surface, z);
    g.rotation.y = yaw;
    group.add(g);
    box(w, h, 0.035, 0, lift + h / 2, 0, M.dark, g);
    box(w * 0.9, h * 0.8, 0.04, 0, lift + h / 2, -0.037, M.dark, g);
    box(0.06, lift + h * 0.35, 0.03, 0, (lift + h * 0.35) / 2, -0.06, M.steel, g);
    box(Math.min(0.3, w * 0.45), 0.012, 0.2, 0, 0.006, -0.03, M.steel, g);
    const sw = w - 0.04, sh = h - 0.05, cy = lift + h / 2 + 0.008, zf = 0.0185;
    g.updateMatrixWorld(true);
    const corner = (u, v) => new THREE.Vector3(u * sw / 2, cy + v * sh / 2, zf).applyMatrix4(g.matrixWorld);
    // top-left, top-right, bottom-left, bottom-right: the order the scene's screens use
    const quad = [corner(-1, 1), corner(1, 1), corner(-1, -1), corner(1, -1)];
    screens[id] = quad;
    return { g, quad, sw, sh, cy, zf };
  }
  function glass(m, texture) {
    const s = new THREE.Mesh(new THREE.PlaneGeometry(m.sw, m.sh), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }));
    s.position.set(0, m.cy, m.zf + 0.001);
    m.g.add(s);
    return s;
  }
  // Jack's and Sarah's: their screens are the story's own (DOM, pinned to these corners)
  const jackMon = monitor("jack-monitor", 0.22, -3.98, 0, 0.62, 0.38, 0.2, DESK.top);
  glass(jackMon, null).material = M.glass;
  const sarahMon = monitor("sarah-monitor", 0.86, -4.0, -4 * DEG, 0.46, 0.3, 0.2, DESK.top);
  glass(sarahMon, null).material = M.glass;
  lights.monitor = lights.alarm = centre(jackMon.quad).add(new THREE.Vector3(0, 0, 0.05));
  lights.sarahScreen = centre(sarahMon.quad).add(new THREE.Vector3(0, 0, 0.05));
  // the rest: terminals drawing their own screens
  const side = [
    ["mon-L-front", -0.9, -0.95, 75 * DEG, 0.34, 0.24],
    ["mon-L-a", -1.1, -1.9, 55 * DEG, 0.42, 0.28],
    ["mon-L-b", -1.12, -2.4, 70 * DEG, 0.42, 0.28],
    ["mon-R", 1.7, -2.35, -75 * DEG, 0.5, 0.32],
    ["mon-R-big", 1.4, -0.72, -40 * DEG, 0.44, 0.3],
  ];
  side.forEach(([id, x, z, yaw, w, h], i) => {
    const surf = x < 0 ? LEFT.top : z > -1.04 ? NEAR_R.top : RIGHT.top;
    const m = monitor(id, x, z, yaw, w, h, 0.12, surf);
    const t = terminalTexture(i);
    terminals.push(t);
    glass(m, t.texture);
  });

  // Keyboards: a board with its keys (ChatGPT's key grid), where hands go to type
  function keyboard(x, z, yaw, surface, w = 0.44, d = 0.15) {
    const g = new THREE.Group();
    g.position.set(x, surface, z);
    g.rotation.y = yaw;
    group.add(g);
    box(w, 0.018, d, 0, 0.009, 0, M.dark, g);
    const cols = 15, rows = 5, kw = (w - 0.03) / cols, kd = (d - 0.03) / rows;
    const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(kw * 0.84, 0.009, kd * 0.82), M.key, rows * cols);
    const mtx = new THREE.Matrix4();
    let n = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const bar = r === 0 && c === 7;
        if (r === 0 && c > 4 && c < 11 && !bar) continue;
        mtx.compose(new THREE.Vector3(-w / 2 + 0.015 + kw * (c + 0.5), 0.022 + r * 0.0015, d / 2 - 0.015 - kd * (r + 0.5)),
          new THREE.Quaternion(), new THREE.Vector3(bar ? 6 : 1, 1, 1));
        inst.setMatrixAt(n++, mtx);
      }
    }
    inst.count = n;
    g.add(inst);
    g.updateMatrixWorld(true);
    keyboards.push({ c: new THREE.Vector3(0, 0.03, 0).applyMatrix4(g.matrixWorld), axis: new THREE.Vector3(1, 0, 0).applyQuaternion(g.quaternion) });
    return g;
  }
  keyboard(0.22, -3.74, 0, DESK.top);
  keyboard(0.86, -3.75, -4 * DEG, DESK.top, 0.4, 0.14);
  keyboard(-0.78, -1.9, 70 * DEG, LEFT.top);
  keyboard(1.55, -2.3, -80 * DEG, RIGHT.top);
  // mice
  for (const [x, z, s] of [[0.6, -3.74, DESK.top], [1.14, -3.76, DESK.top], [-0.8, -2.25, LEFT.top], [1.5, -2.62, RIGHT.top]]) {
    const m = add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 12), M.dark));
    m.scale.set(0.06, 0.036, 0.1);
    m.position.set(x, s, z);
  }

  // The intercom: ChatGPT's teal communicator, as a desk unit -- a sloped speaker face
  // with a grille of slots, a push-to-talk button and a lamp that lights on an open line.
  {
    const g = new THREE.Group();
    g.position.set(-0.28, DESK.top, -3.84);
    group.add(g);
    box(0.24, 0.05, 0.2, 0, 0.025, 0, M.dark, g);
    const face = box(0.24, 0.14, 0.03, 0, 0.11, -0.07, M.dark, g);
    face.rotation.x = -18 * DEG;
    // the grille's slots belong to the sloped face, so they lie on it wherever it leans
    for (let i = 0; i < 6; i++) box(0.15, 0.006, 0.004, 0, -0.05 + i * 0.017, 0.0165, M.steel, face);
    box(0.24, 0.008, 0.012, 0, 0.049, 0.096, M.teal, g); // the teal stripe ChatGPT's unit wears
    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.008, 24), M.steel);
    collar.position.set(0.0, 0.06, 0.05);
    g.add(collar);
    const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.014, 24), M.button);
    btn.position.set(0.0, 0.07, 0.05);
    g.add(btn);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.008, 12, 8), M.lamp.clone());
    lamp.position.set(0.085, 0.06, 0.05);
    g.add(lamp);
    lamps.intercom = lamp.material;
    g.updateMatrixWorld(true);
    anchors["intercom.button"] = new THREE.Vector3(0, 0.078, 0.05).applyMatrix4(g.matrixWorld);
    lights.intercom = new THREE.Vector3(0.085, 0.1, 0.05).applyMatrix4(g.matrixWorld);
  }

  // the red toolbox on the left counter, the oscilloscope and a laptop on the right
  {
    const g = new THREE.Group();
    g.position.set(-0.95, LEFT.top, -1.42);
    g.rotation.y = 35 * DEG;
    group.add(g);
    box(0.34, 0.13, 0.2, 0, 0.065, 0, M.red, g);
    box(0.35, 0.04, 0.21, 0, 0.15, 0, M.red, g);
    box(0.16, 0.012, 0.02, 0, 0.2, 0, M.dark, g);
    for (const s of [-1, 1]) box(0.012, 0.03, 0.016, s * 0.075, 0.185, 0, M.steel, g);
  }
  {
    const g = new THREE.Group();
    g.position.set(1.62, RIGHT.top, -1.62);
    g.rotation.y = -85 * DEG;
    group.add(g);
    box(0.5, 0.26, 0.3, 0, 0.13, 0, M.unit, g);
    const scope = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.16), new THREE.MeshBasicMaterial({ map: scopeTexture(), toneMapped: false }));
    scope.position.set(-0.08, 0.14, 0.151);
    g.add(scope);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const k = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.014, 14), M.steel);
      k.rotation.x = Math.PI / 2;
      k.position.set(0.1 + c * 0.045, 0.07 + r * 0.06, 0.157);
      g.add(k);
    }
  }
  {
    const g = new THREE.Group();
    g.position.set(1.62, RIGHT.top, -2.95);
    g.rotation.y = -70 * DEG;
    group.add(g);
    box(0.32, 0.016, 0.22, 0, 0.008, 0, M.steel, g);
    const lid = new THREE.Group();
    lid.position.set(0, 0.016, -0.11);
    lid.rotation.x = -15 * DEG;
    g.add(lid);
    box(0.32, 0.21, 0.008, 0, 0.105, 0, M.steel, lid);
    const t = terminalTexture(7);
    terminals.push(t);
    const s = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.18), new THREE.MeshBasicMaterial({ map: t.texture, toneMapped: false }));
    s.position.set(0, 0.105, 0.005);
    lid.add(s);
  }

  lamps.intercom.userData = { live: true };
  group.updateMatrixWorld(true);
  mergeStatic(group, new Set([doorL, doorR]));
  return { group, anchors, lamps, screens, lights, keyboards, doors: [doorL, doorR], room: ROOM };
}

// Hundreds of boxes are hundreds of draw calls, drawn twice (the room, and its depth among
// the people): on a phone that is the frame. Everything that never moves is merged into one
// mesh per material. Instanced keys, live lamps and the doors stay as they are.
//
// The pieces are boxes until this merge, so this is also where the room's SOLIDS are taken
// (engine/collide.js): each static piece's world box, before it is merged away, kept on
// group.userData.solids for the people to stay out of.
export function mergeStatic(group, keep) {
  const byMat = new Map(), gone = [];
  group.updateMatrixWorld(true);
  group.traverse((m) => {
    if (!m.isMesh || m.isInstancedMesh || keep.has(m) || (m.material.userData && m.material.userData.live)) return;
    if (!byMat.has(m.material)) byMat.set(m.material, []);
    byMat.get(m.material).push(m);
    gone.push(m);
  });
  group.userData.solids = solidsOf(gone);
  for (const m of gone) m.parent.remove(m);
  for (const [mat, list] of byMat) {
    const pos = [], nor = [], uv = [], idx = [];
    let base = 0;
    for (const m of list) {
      const g = m.geometry.clone().applyMatrix4(m.matrixWorld);
      const P = g.getAttribute("position"), N = g.getAttribute("normal"), U = g.getAttribute("uv");
      for (let i = 0; i < P.count; i++) {
        pos.push(P.getX(i), P.getY(i), P.getZ(i));
        nor.push(N.getX(i), N.getY(i), N.getZ(i));
        uv.push(U ? U.getX(i) : 0, U ? U.getY(i) : 0);
      }
      const I = g.getIndex();
      if (I) for (let i = 0; i < I.count; i++) idx.push(I.getX(i) + base);
      else for (let i = 0; i < P.count; i++) idx.push(i + base);
      base += P.count;
      g.dispose();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(base > 65535 ? new THREE.Uint32BufferAttribute(idx, 1) : new THREE.Uint16BufferAttribute(idx, 1));
    group.add(new THREE.Mesh(geo, mat));
  }
}

function centre(q) {
  return q.reduce((a, v) => a.add(v), new THREE.Vector3()).multiplyScalar(1 / q.length);
}

// ChatGPT's palette (lab-room.ts), with a few more of the same family.
export function palette() {
  const std = (o) => new THREE.MeshStandardMaterial(o);
  return {
    shell: std({ color: 0x344952, roughness: 0.86 }),
    shellDark: std({ color: 0x2c3f47, roughness: 0.8 }),
    dark: std({ color: 0x101e28, roughness: 0.78 }),
    unit: std({ color: 0x17252f, roughness: 0.7, metalness: 0.2 }),
    steel: std({ color: 0x6a7a81, metalness: 0.35, roughness: 0.65 }),
    top: std({ color: 0x71818a, roughness: 0.75 }),
    floor: std({ color: 0x263740, roughness: 0.78 }),
    seam: std({ color: 0x3b4d56, roughness: 0.7 }),
    seamLight: std({ color: 0x8aa0a8, roughness: 0.5 }),
    ceiling: std({ color: 0x223039, roughness: 0.9 }),
    teal: std({ color: 0x64c6cb, emissive: 0x2e99a4, emissiveIntensity: 1.4 }),
    amber: std({ color: 0xe0a24a, emissive: 0xc07a20, emissiveIntensity: 1.2 }),
    panelLight: std({ color: 0xf1edda, emissive: 0xdadaca, emissiveIntensity: 2 }),
    window: std({ color: 0x0b1c26, emissive: 0x0d2a36, emissiveIntensity: 0.6, roughness: 0.15, metalness: 0.4 }),
    glass: std({ color: 0x05090c, roughness: 0.2, metalness: 0.4 }),
    screenDim: std({ color: 0x1a4a55, emissive: 0x1a5563, emissiveIntensity: 0.8 }),
    key: std({ color: 0x5c6b72, metalness: 0.3, roughness: 0.6 }),
    red: std({ color: 0xa82a20, roughness: 0.45, metalness: 0.3 }),
    button: std({ color: 0x8a1d16, roughness: 0.4 }),
    lamp: std({ color: 0x0b2a16, emissive: 0x2dff7a, emissiveIntensity: 0.15, roughness: 0.3 }),
  };
}

export function canvasTexture(w, h, draw) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return { canvas: c, texture: t };
}

// The sign over the window, ChatGPT's: TOMBS / DIAGNOSTIC LABORATORY / 01.
function signTexture() {
  return canvasTexture(1024, 256, (g, w, h) => {
    g.fillStyle = "#263b47";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#bad6da";
    g.font = "bold 92px Arial, sans-serif";
    g.fillText("TOMBS", 45, 125);
    g.font = "24px monospace";
    g.fillText("DIAGNOSTIC LABORATORY  /  01", 49, 185);
  }).texture;
}

// A terminal's screen: a header, lines of status and a trace, in the lab's teal.
function terminalTexture(seed) {
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return canvasTexture(512, 320, (g, w, h) => {
    g.fillStyle = "#06151e";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#69c6ce";
    g.font = "18px monospace";
    g.fillText(["TOMBS / ARRAY", "GRID / SUB-3", "FIELD MODEL", "CALIBRATION", "POWER ROUTING", "SEC-CAM 12", "ARCHIVE", "RUN LOGS"][seed % 8], 22, 34);
    g.fillStyle = "#314b55";
    g.fillRect(22, 46, w - 44, 2);
    g.font = "14px monospace";
    for (let i = 0; i < 7; i++) {
      g.fillStyle = rnd() > 0.8 ? "#e7b375" : "#a9c2cc";
      g.fillText(`${String(100 + i * 7).padStart(4, "0")}  ${["ok", "ok", "chk", "ok", "idle"][Math.floor(rnd() * 5)]}  ${(rnd() * 9.99).toFixed(3)}`, 22, 76 + i * 22);
    }
    g.strokeStyle = "#63d2c5";
    g.lineWidth = 2;
    g.beginPath();
    for (let x = 0; x < 200; x++) g.lineTo(290 + x, 150 + Math.sin(x / (12 + seed) + seed) * 40 * (0.6 + 0.4 * Math.sin(x / 50)));
    g.stroke();
  });
}

function scopeTexture() {
  return canvasTexture(384, 256, (g, w, h) => {
    g.fillStyle = "#041a10";
    g.fillRect(0, 0, w, h);
    g.strokeStyle = "#0f3d25";
    for (let x = 0; x <= w; x += 48) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    for (let y = 0; y <= h; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    g.strokeStyle = "#57f59a";
    g.lineWidth = 3;
    g.beginPath();
    for (let x = 0; x < w; x++) g.lineTo(x, h / 2 + Math.sin(x / 14) * 50 * Math.sin(x / 90 + 1));
    g.stroke();
  }).texture;
}
