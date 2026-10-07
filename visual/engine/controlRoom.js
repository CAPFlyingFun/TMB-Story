// THE MAIN CONTROL ROOM AND THE CORRIDOR TO IT, BUILT (Chapters 2 and 3).
//
// Nobody has painted these rooms, so the Watch mode stages them the way it stages the lab
// whenever its camera really moves: as rooms of plain shapes in the lab's own style
// (engine/labRoom.js, after ChatGPT's procedural lab), lit for night. Everything the
// manuscript names is here and in the order it names it:
//
//   Chapter 2: "They reached the main control room, where a reinforced window looked into
//   the chamber beyond. At its center stood the TOMBS Array ... Several articulated rings
//   surrounded a central platform." The primary console, the emitter controls, "Jack opened
//   the emergency panel ... pulled the physical shutdown lever, and the room went dark",
//   "A light blinked inside the chamber", "The emergency lights switched on."
//   Chapter 3: the secondary console, the building shaking, every light turning white, and
//   "Sarah had walked toward a window": the street, "the building across from them",
//   streetlights, "a parked utility vehicle", and beyond the research district, where the
//   hills were, grass "towered above buildings ... until thousands disappeared into the
//   night like a forest."
//
// What moves is driven by the scene's props (`prop` events, engine/timeline.js):
//   rings     the Array's rings, 0 still .. 1 moving .. 2 racing
//   chamber   the chamber's own glow, 0 .. 1 (a blink is a short rise)
//   panel     the emergency panel's door, 0 shut .. 1 open
//   lever     the shutdown lever, 0 up .. 1 pulled
//   lighting  0 normal, 1 dark (the lever), 2 emergency red
//   white     the activation's white light, 0 .. 1
//   outside   0 the night as it was (hills), 1 the grass
//   door      the door to the hallway, 0 shut .. 1 open (Chapters 5 to 9)
//   dawn      Chapter 10's first light: 0 night, 1 deep grey, 2 gold down the blades, 3 morning
//   cups      how many forgotten coffee cups stand on the consoles (0 .. 4, Chapters 4 and 7)
//   case      the equipment case Sarah props her feet on (0/1, Chapter 4)
//
// Metres, the frame people3d.js uses: x right, y up, z toward the camera; the floor at y = 0
// and the base camera at (0, ~1.5, 0) looking down -z. No scale on the page is implied by
// anything here beyond what Chapter 3 says through the window.

import * as THREE from "../vendor/three-human.js";
import { palette, canvasTexture, mergeStatic } from "./labRoom.js";

const DEG = Math.PI / 180;

export const CONTROL = { xl: -3.4, xr: 3.4, zb: -7.0, zs: 1.2, ceiling: 3.1, window: { x0: -2.6, x1: 2.6, y0: 0.95, y1: 2.75 } };
const PRIMARY = { x0: -2.5, x1: 0.35, z0: -5.65, z1: -4.95, top: 0.96 };
const SECONDARY = { x0: 0.95, x1: 2.85, z0: -5.65, z1: -4.95, top: 0.96 };
const OUTWIN = { z0: -3.7, z1: -1.5, y0: 0.9, y1: 2.35 }; // the east wall's window onto the street
const CHAMBER = { z0: -24, z1: -7.15, x0: -11, x1: 11, floor: -2.4, ceiling: 9, core: [0, 2.0, -16.5] };

function helpers(group) {
  const box = (w, h, d, x, y, z, mat, parent = group) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };
  const span = (x0, x1, y0, y1, z0, z1, mat, parent = group) => box(x1 - x0, y1 - y0, z1 - z0, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, mat, parent);
  return { box, span };
}

// A room's lighting by one number: 0 normal, 1 dark, 2 emergency red. Returns how much of
// the normal light is left and how much of the emergency red is on.
function lightingOf(v) {
  const x = Math.max(0, Math.min(2, v || 0));
  return { normal: Math.max(0, 1 - x), red: Math.max(0, x - 1) };
}

export function buildControlRoom() {
  const M = palette();
  // materials that change with the scene: never merged into the static mesh
  const live = (m) => ((m.userData.live = true), m);
  const L = {
    panelLight: live(M.panelLight.clone()),
    emergency: live(new THREE.MeshStandardMaterial({ color: 0x3a0806, emissive: 0xff2a1a, emissiveIntensity: 0 })),
    ringGlow: live(new THREE.MeshStandardMaterial({ color: 0x0f2a2e, emissive: 0x55e0e6, emissiveIntensity: 0.4 })),
    core: live(new THREE.MeshStandardMaterial({ color: 0x0b1e24, emissive: 0x7af2ff, emissiveIntensity: 0.3 })),
    chamberStrip: live(new THREE.MeshStandardMaterial({ color: 0x0f2328, emissive: 0x2e99a4, emissiveIntensity: 0.6 })),
    windowsLit: live(new THREE.MeshStandardMaterial({ color: 0x2a2416, emissive: 0xffcf7a, emissiveIntensity: 0.9 })),
    lamp: live(new THREE.MeshStandardMaterial({ color: 0x3a3020, emissive: 0xffd28a, emissiveIntensity: 2.2 })),
  };
  const group = new THREE.Group();
  group.name = "control-room";
  const { box, span } = helpers(group);
  const anchors = {}, lamps = {}, screens = {}, lights = {}, keyboards = [];
  const R = CONTROL, C = R.ceiling;

  // ------------------------------------------------------------------------ the shell
  span(R.xl, R.xr, -0.02, 0, R.zb, R.zs, M.floor);
  for (let x = Math.ceil(R.xl * 2) / 2; x <= R.xr; x += 0.5) span(x - 0.006, x + 0.006, 0, 0.002, R.zb, R.zs, M.seam);
  for (let z = Math.ceil(R.zb * 2) / 2; z <= R.zs; z += 0.5) span(R.xl, R.xr, 0, 0.002, z - 0.006, z + 0.006, M.seam);
  span(R.xl, R.xr, C, C + 0.05, R.zb, R.zs, M.ceiling);
  // the north wall, round the reinforced window into the chamber
  const W = R.window;
  span(R.xl, W.x0, 0, C, R.zb - 0.25, R.zb, M.shell);
  span(W.x1, R.xr, 0, C, R.zb - 0.25, R.zb, M.shell);
  span(W.x0, W.x1, 0, W.y0, R.zb - 0.25, R.zb, M.shell);
  span(W.x0, W.x1, W.y1, C, R.zb - 0.25, R.zb, M.shell);
  // a reinforced window: a deep steel frame, two mullions and a thick pane
  for (const [x0, x1, y0, y1] of [[W.x0 - 0.1, W.x0, W.y0 - 0.1, W.y1 + 0.1], [W.x1, W.x1 + 0.1, W.y0 - 0.1, W.y1 + 0.1], [W.x0, W.x1, W.y0 - 0.1, W.y0], [W.x0, W.x1, W.y1, W.y1 + 0.1]]) {
    span(x0, x1, y0, y1, R.zb - 0.27, R.zb + 0.04, M.steel);
  }
  for (const x of [-0.87, 0.87]) span(x - 0.035, x + 0.035, W.y0, W.y1, R.zb - 0.27, R.zb + 0.02, M.steel);
  const pane = new THREE.Mesh(new THREE.PlaneGeometry(W.x1 - W.x0, W.y1 - W.y0), live(new THREE.MeshStandardMaterial({ color: 0x9fd8e0, transparent: true, opacity: 0.1, roughness: 0.05, metalness: 0.6, depthWrite: false })));
  pane.position.set(0, (W.y0 + W.y1) / 2, R.zb - 0.12);
  group.add(pane);
  // side walls; the east one round its window onto the street; the south wall round the door
  span(R.xl - 0.1, R.xl, 0, C, R.zb, R.zs, M.shell);
  span(R.xr, R.xr + 0.12, 0, C, R.zb, OUTWIN.z0, M.shell);
  span(R.xr, R.xr + 0.12, 0, C, OUTWIN.z1, R.zs, M.shell);
  span(R.xr, R.xr + 0.12, 0, OUTWIN.y0, OUTWIN.z0, OUTWIN.z1, M.shell);
  span(R.xr, R.xr + 0.12, OUTWIN.y1, C, OUTWIN.z0, OUTWIN.z1, M.shell);
  for (const [z0, z1, y0, y1] of [[OUTWIN.z0 - 0.06, OUTWIN.z0, OUTWIN.y0 - 0.06, OUTWIN.y1 + 0.06], [OUTWIN.z1, OUTWIN.z1 + 0.06, OUTWIN.y0 - 0.06, OUTWIN.y1 + 0.06], [OUTWIN.z0, OUTWIN.z1, OUTWIN.y0 - 0.06, OUTWIN.y0], [OUTWIN.z0, OUTWIN.z1, OUTWIN.y1, OUTWIN.y1 + 0.06]]) {
    span(R.xr - 0.03, R.xr + 0.14, y0, y1, z0, z1, M.steel);
  }
  span(R.xr - 0.03, R.xr + 0.14, (OUTWIN.y0 + OUTWIN.y1) / 2 - 0.02, (OUTWIN.y0 + OUTWIN.y1) / 2 + 0.02, OUTWIN.z0, OUTWIN.z1, M.steel);
  span(R.xr - 0.18, R.xr, OUTWIN.y0 - 0.06, OUTWIN.y0 - 0.02, OUTWIN.z0, OUTWIN.z1, M.top); // a sill
  const door = [-2.2, -1.0, 2.15];
  span(R.xl, door[0], 0, C, R.zs, R.zs + 0.1, M.shell);
  span(door[1], R.xr, 0, C, R.zs, R.zs + 0.1, M.shell);
  span(door[0], door[1], door[2], C, R.zs, R.zs + 0.1, M.shell);
  const doorL = span(door[0], (door[0] + door[1]) / 2, 0, door[2], R.zs + 0.02, R.zs + 0.07, M.dark);
  const doorR = span((door[0] + door[1]) / 2, door[1], 0, door[2], R.zs + 0.02, R.zs + 0.07, M.dark);
  const doorAt = { L: doorL.position.x, R: doorR.position.x, w: (door[1] - door[0]) / 2 };
  // the hallway outside the door (Chapter 5: "Lena stood outside"; Mark "careful not to step
  // past the threshold"), lit, running east-west past the door
  {
    const hz0 = R.zs + 0.1, hz1 = R.zs + 2.6, hx0 = -6, hx1 = 3;
    span(hx0, hx1, -0.02, 0, hz0, hz1, M.floor);
    span(hx0, hx1, 2.6, 2.65, hz0, hz1, M.ceiling);
    span(hx0, hx1, 0, 2.6, hz1, hz1 + 0.1, M.shell);
    span(hx0 - 0.1, hx0, 0, 2.6, hz0, hz1, M.shell);
    span(hx1, hx1 + 0.1, 0, 2.6, hz0, hz1, M.shell);
    for (let x = hx0 + 0.6; x < hx1; x += 1.8) span(x - 0.3, x + 0.3, 2.59, 2.6, hz0 + 0.6, hz0 + 1.9, L.panelLight);
    span(hx0, hx1, 1.2, 1.23, hz1 - 0.02, hz1, M.steel);
  }
  span(door[0] - 0.06, door[1] + 0.06, door[2], door[2] + 0.06, R.zs - 0.02, R.zs, M.teal);
  // skirting, dado, ribs and the teal strips, as in the lab
  for (const [x0, x1, z0, z1] of [[R.xl, R.xl + 0.02, R.zb, R.zs], [R.xr - 0.02, R.xr, R.zb, OUTWIN.z0], [R.xr - 0.02, R.xr, OUTWIN.z1, R.zs]]) {
    span(x0, x1, 0, 0.1, z0, z1, M.dark);
    span(x0, x1, 1.2, 1.23, z0, z1, M.steel);
  }
  for (let z = R.zb + 0.5; z < R.zs; z += 0.85) span(R.xl, R.xl + 0.04, 0.1, C, z - 0.012, z + 0.012, M.steel);
  for (const x of [R.xl, R.xr]) span(x - 0.02, x + 0.02, C - 0.08, C - 0.04, R.zb, R.zs, M.teal);
  // the sign over the window
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.32), new THREE.MeshBasicMaterial({ map: signTexture("TOMBS ARRAY", "MAIN CONTROL  /  CHAMBER VIEW"), toneMapped: false }));
  sign.position.set(0, 2.93, R.zb + 0.01);
  group.add(sign);
  // ceiling panels (their light is the "normal" lighting), and the red emergency lamps high on
  // the walls that come on after the lever
  for (const x of [-1.9, 0, 1.9]) {
    for (let z = R.zb + 0.9; z < R.zs - 0.3; z += 1.7) {
      span(x - 0.32, x + 0.32, C - 0.05, C, z - 0.5, z + 0.5, M.steel);
      span(x - 0.28, x + 0.28, C - 0.06, C - 0.05, z - 0.46, z + 0.46, L.panelLight);
    }
  }
  for (const [x, z, face] of [[R.xl + 0.06, -5.2, 1], [R.xl + 0.06, -1.0, 1], [R.xr - 0.06, -5.2, -1], [R.xr - 0.06, 0.2, -1], [0, R.zs - 0.06, 0]]) {
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), L.emergency);
    dome.rotation.z = face ? (face > 0 ? -Math.PI / 2 : Math.PI / 2) : 0;
    if (!face) dome.rotation.x = Math.PI / 2;
    dome.position.set(x, 2.55, z);
    group.add(dome);
  }

  // --------------------------------------------------------------------- the consoles
  function console_(D, id, monW, monH) {
    // a standing console: a body, a sloped desk and a monitor on an arm
    span(D.x0, D.x1, 0, D.top - 0.05, D.z0, D.z1, M.shell);
    span(D.x0, D.x1, 0, 0.08, D.z0, D.z1 + 0.02, M.dark);
    const desk = span(D.x0 - 0.02, D.x1 + 0.02, D.top - 0.05, D.top, D.z0 - 0.02, D.z1 + 0.08, M.top);
    void desk;
    for (let x = D.x0 + 0.2; x < D.x1 - 0.1; x += 0.36) span(x - 0.12, x + 0.12, 0.2, 0.75, D.z1, D.z1 + 0.01, M.shellDark);
    const cx = (D.x0 + D.x1) / 2;
    // the monitor
    const g = new THREE.Group();
    g.position.set(cx, D.top, D.z0 + 0.12);
    g.rotation.x = -8 * DEG;
    group.add(g);
    box(0.06, 0.3, 0.05, 0, 0.15, -0.02, M.steel, g);
    const cy = 0.3 + monH / 2, zf = 0.03;
    box(monW + 0.04, monH + 0.04, 0.04, 0, cy, 0, M.dark, g);
    g.updateMatrixWorld(true);
    const corner = (u, v) => new THREE.Vector3((u * monW) / 2, cy + (v * monH) / 2, zf).applyMatrix4(g.matrixWorld);
    screens[id] = [corner(-1, 1), corner(1, 1), corner(-1, -1), corner(1, -1)];
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(monW, monH), M.glass);
    glass.position.set(0, cy, zf - 0.005);
    g.add(glass);
    // the keyboard, where hands go
    const k = new THREE.Group();
    k.position.set(cx - 0.05, D.top, D.z1 - 0.12);
    group.add(k);
    box(0.46, 0.018, 0.16, 0, 0.009, 0, M.dark, k);
    const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(0.024, 0.009, 0.022), M.key, 70);
    const mtx = new THREE.Matrix4();
    let n = 0;
    for (let r = 0; r < 5; r++) for (let c = 0; c < 14; c++) mtx.compose(new THREE.Vector3(-0.2 + c * 0.0305, 0.022, 0.06 - r * 0.029), new THREE.Quaternion(), new THREE.Vector3(1, 1, 1)), inst.setMatrixAt(n++, mtx);
    k.add(inst);
    k.updateMatrixWorld(true);
    keyboards.push({ c: new THREE.Vector3(0, 0.03, 0).applyMatrix4(k.matrixWorld), axis: new THREE.Vector3(1, 0, 0) });
    // a strip of status lamps and the emitter controls along the front of the desk
    for (let i = 0; i < 8; i++) span(D.x0 + 0.12 + i * 0.07, D.x0 + 0.16 + i * 0.07, D.top + 0.001, D.top + 0.008, D.z1 - 0.04, D.z1 - 0.02, i % 3 ? M.teal : M.amber);
    return { cx, monitor: screens[id] };
  }
  const prim = console_(PRIMARY, "control-main", 0.92, 0.5);
  console_(SECONDARY, "control-second", 0.7, 0.42);
  // "Four cold cups of coffee sat forgotten along the edge of the console." (Chapter 8)
  const cupM = new THREE.MeshStandardMaterial({ color: 0xe8e4dc, roughness: 0.6 });
  const coffee = new THREE.MeshStandardMaterial({ color: 0x24140a, roughness: 0.2 });
  const cups = [[-2.3, PRIMARY.z1 - 0.05], [0.15, PRIMARY.z1 - 0.06], [1.2, SECONDARY.z1 - 0.05], [2.6, SECONDARY.z1 - 0.06]].map(([x, z]) => {
    const g = new THREE.Group();
    g.position.set(x, PRIMARY.top, z);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.035, 0.1, 18), cupM);
    body.position.y = 0.05;
    const top = new THREE.Mesh(new THREE.CircleGeometry(0.038, 18), coffee);
    top.rotation.x = -Math.PI / 2;
    top.position.y = 0.088;
    g.add(body, top);
    group.add(g);
    g.visible = false;
    return g;
  });
  // the small equipment case Jack brings over for Sarah's feet (Chapter 4)
  const kase = new THREE.Group();
  kase.position.set(1.95, 0, -4.05);
  group.add(kase);
  box(0.5, 0.3, 0.34, 0, 0.15, 0, new THREE.MeshStandardMaterial({ color: 0x2c3238, roughness: 0.55 }), kase);
  box(0.52, 0.02, 0.36, 0, 0.2, 0, M.steel, kase);
  kase.visible = false;
  lights.monitor = lights.alarm = centre(screens["control-main"]).add(new THREE.Vector3(0, 0, 0.1));
  lights.second = centre(screens["control-second"]).add(new THREE.Vector3(0, 0, 0.1));
  void prim;
  // the mapping display, a big screen on the west wall the map comes up on
  {
    const g = new THREE.Group();
    g.position.set(R.xl + 0.06, 1.75, -4.2);
    g.rotation.y = 90 * DEG;
    group.add(g);
    box(1.5, 0.9, 0.04, 0, 0, -0.02, M.dark, g);
    g.updateMatrixWorld(true);
    const c = (u, v) => new THREE.Vector3(u * 0.7, v * 0.41, 0.005).applyMatrix4(g.matrixWorld);
    screens["control-map"] = [c(-1, 1), c(1, 1), c(-1, -1), c(1, -1)];
    lights.map = centre(screens["control-map"]).add(new THREE.Vector3(0.1, 0, 0));
  }

  // ------------------------------------------------- the emergency panel and its lever
  const panelAt = new THREE.Vector3(R.xl + 0.04, 1.25, -2.5);
  span(R.xl, R.xl + 0.12, 0.85, 1.65, -2.85, -2.15, M.shellDark);
  span(R.xl + 0.12, R.xl + 0.13, 0.86, 1.64, -2.84, -2.16, M.dark);
  // yellow and black hazard frame
  const hazard = new THREE.MeshStandardMaterial({ map: hazardTexture(), roughness: 0.6 });
  for (const [y0, y1, z0, z1] of [[1.6, 1.65, -2.85, -2.15], [0.85, 0.9, -2.85, -2.15], [0.85, 1.65, -2.85, -2.8], [0.85, 1.65, -2.2, -2.15]]) span(R.xl + 0.12, R.xl + 0.135, y0, y1, z0, z1, hazard);
  // the lever: a pivot and a red-gripped handle that swings down
  const lever = new THREE.Group();
  lever.position.set(R.xl + 0.16, 1.4, -2.5);
  group.add(lever);
  box(0.06, 0.06, 0.06, 0, 0, 0, M.steel, lever);
  const arm = box(0.035, 0.36, 0.035, 0.0, -0.0 + 0.18, 0, M.steel, lever);
  const grip = box(0.06, 0.1, 0.06, 0, 0.38, 0, live(M.red.clone()), lever);
  void arm; void grip;
  anchors["lever.grip"] = new THREE.Vector3(R.xl + 0.16, 1.78, -2.5);
  anchors["lever"] = anchors["lever.grip"];
  // the panel's door, hinged on its north edge, that Jack opens first
  const panelDoor = new THREE.Group();
  panelDoor.position.set(R.xl + 0.14, 1.25, -2.85);
  group.add(panelDoor);
  box(0.02, 0.78, 0.68, 0.0, 0, 0.34, M.shell, panelDoor);
  box(0.022, 0.12, 0.3, 0.003, 0.2, 0.34, hazard, panelDoor);
  anchors["panel"] = panelAt.clone().add(new THREE.Vector3(0.2, 0, 0));

  // -------------------------------------------------------------- the TOMBS Array chamber
  const K = CHAMBER;
  const chamber = new THREE.Group();
  group.add(chamber);
  const cspan = (x0, x1, y0, y1, z0, z1, mat) => span(x0, x1, y0, y1, z0, z1, mat, chamber);
  cspan(K.x0, K.x1, K.floor - 0.05, K.floor, K.z0, K.z1, M.floor);
  cspan(K.x0, K.x1, K.ceiling, K.ceiling + 0.1, K.z0, K.z1, M.ceiling);
  cspan(K.x0, K.x1, K.floor, K.ceiling, K.z0 - 0.2, K.z0, M.shellDark);
  cspan(K.x0 - 0.2, K.x0, K.floor, K.ceiling, K.z0, K.z1, M.shellDark);
  cspan(K.x1, K.x1 + 0.2, K.floor, K.ceiling, K.z0, K.z1, M.shellDark);
  cspan(K.x0, K.x1, 0, 0.05, K.z1 - 1.2, K.z1, M.top); // the ledge under the window
  for (let x = K.x0 + 1; x < K.x1; x += 2) cspan(x - 0.04, x + 0.04, K.floor, K.ceiling, K.z0, K.z0 + 0.06, L.chamberStrip);
  for (let z = K.z0 + 1.5; z < K.z1; z += 2.4) for (const x of [K.x0, K.x1 - 0.06]) cspan(x, x + 0.06, K.floor, K.ceiling, z - 0.04, z + 0.04, L.chamberStrip);
  // the platform and its emitter core
  const [cx, cy, cz] = K.core;
  const plat = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.9, 0.5, 48), M.steel);
  plat.position.set(cx, K.floor + 0.25, cz);
  chamber.add(plat);
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, cy - K.floor - 0.9, 32), M.unit);
  plinth.position.set(cx, (K.floor + 0.5 + cy - 0.4) / 2, cz);
  chamber.add(plinth);
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 20), L.core);
  core.position.set(cx, cy, cz);
  chamber.add(core);
  // the rings: each on its own gimbal, so they can be "articulated" -- tilted, turned and
  // brought into position around a target, as the manuscript says they normally are
  const rings = [];
  const RINGS = [{ r: 2.2, tube: 0.12, tilt: [0, 0, 0], spin: 0.9 }, { r: 3.0, tube: 0.14, tilt: [70, 0, 0], spin: -0.7 },
    { r: 3.8, tube: 0.15, tilt: [20, 0, 60], spin: 0.55 }, { r: 4.6, tube: 0.17, tilt: [90, 30, 0], spin: -0.42 }];
  for (const [i, def] of RINGS.entries()) {
    const gimbal = new THREE.Group();
    gimbal.position.set(cx, cy, cz);
    gimbal.rotation.set(def.tilt[0] * DEG, def.tilt[1] * DEG, def.tilt[2] * DEG);
    chamber.add(gimbal);
    const ring = new THREE.Group();
    gimbal.add(ring);
    ring.add(new THREE.Mesh(new THREE.TorusGeometry(def.r, def.tube, 12, 96), M.steel));
    const inner = new THREE.Mesh(new THREE.TorusGeometry(def.r - def.tube * 0.9, def.tube * 0.3, 8, 96), L.ringGlow);
    ring.add(inner);
    // emitter heads around each ring, so its turning is visible
    for (let k = 0; k < 6 + i * 2; k++) {
      const a = (k / (6 + i * 2)) * Math.PI * 2;
      const head = new THREE.Mesh(new THREE.BoxGeometry(def.tube * 2.6, def.tube * 2.6, def.tube * 3.2), M.unit);
      head.position.set(Math.cos(a) * def.r, Math.sin(a) * def.r, 0);
      head.rotation.z = a;
      ring.add(head);
    }
    rings.push({ gimbal, ring, def, base: gimbal.rotation.clone(), angle: 0, sway: 0 });
  }
  lights.chamber = new THREE.Vector3(cx, cy, cz);
  anchors["array"] = new THREE.Vector3(cx, cy, cz);

  // ----------------------------------------------------------------- the street outside
  const outside = new THREE.Group();
  group.add(outside);
  const ospan = (x0, x1, y0, y1, z0, z1, mat) => span(x0, x1, y0, y1, z0, z1, mat, outside);
  const asphalt = new THREE.MeshStandardMaterial({ color: 0x15191c, roughness: 0.95 });
  const kerb = new THREE.MeshStandardMaterial({ color: 0x3c4246, roughness: 0.9 });
  const groundM = new THREE.MeshStandardMaterial({ color: 0x0d1410, roughness: 1 });
  ospan(R.xr + 0.12, 420, -0.05, 0, -240, 240, groundM); // out under the grass, too (Chapter 10: something moves in the stems)
  ospan(R.xr + 2.5, R.xr + 10.5, 0, 0.01, -60, 40, asphalt);
  ospan(R.xr + 2.2, R.xr + 2.5, 0, 0.12, -60, 40, kerb);
  ospan(R.xr + 10.5, R.xr + 10.8, 0, 0.12, -60, 40, kerb);
  for (let z = -58; z < 40; z += 4) ospan(R.xr + 6.45, R.xr + 6.55, 0.011, 0.013, z, z + 2, live(new THREE.MeshStandardMaterial({ color: 0x6f6a55, roughness: 0.8 })));
  // the building across from them: two storeys, some windows still lit -- to the left of the
  // view, so the street opens past it to the edge of town
  const across = R.xr + 13;
  ospan(across, across + 9, 0, 6.6, -30, -9, M.shell);
  ospan(across - 0.02, across, 6.3, 6.6, -30, -9, M.steel);
  let s = 11;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let f = 0; f < 2; f++) for (let z = -29; z < -9.5; z += 1.6) {
    const lit = rnd() > 0.72;
    ospan(across - 0.03, across - 0.01, 1.2 + f * 3.1, 2.4 + f * 3.1, z, z + 0.9, lit ? L.windowsLit : M.window);
  }
  // further buildings: down the street, and low workshops to the right
  for (const [z0, z1, h, x0] of [[-60, -36, 7, 1], [10, 24, 5, 2], [-80, -64, 10, 1], [30, 46, 4, 6]]) ospan(across + x0, across + x0 + 9, 0, h, z0, z1, M.shellDark);
  // the edge of the developed area: a fence line and the end of the paving, past the street
  for (let z = -40; z < 40; z += 3) ospan(R.xr + 34, R.xr + 34.08, 0, 1.6, z, z + 0.06, M.steel);
  ospan(R.xr + 34, R.xr + 34.04, 1.5, 1.56, -40, 40, M.steel);
  // streetlights, with the light they throw
  const streetLights = [];
  for (const z of [-26, -12, 2, 16]) {
    const x = R.xr + 2.35;
    ospan(x - 0.06, x + 0.06, 0, 6, z - 0.06, z + 0.06, M.steel);
    ospan(x, x + 1.4, 5.9, 6.0, z - 0.05, z + 0.05, M.steel);
    const head = box(0.5, 0.12, 0.28, x + 1.3, 5.9, z, L.lamp, outside);
    void head;
    streetLights.push(new THREE.Vector3(x + 1.3, 5.6, z));
  }
  // the parked utility vehicle, "exactly where it had been"
  {
    const v = new THREE.Group();
    v.position.set(R.xr + 9.4, 0, -11.5);
    outside.add(v);
    const body = new THREE.MeshStandardMaterial({ color: 0xd8dcd6, roughness: 0.55, metalness: 0.2 });
    box(1.9, 1.0, 4.6, 0, 0.75, 0, body, v);
    box(1.8, 0.75, 2.6, 0, 1.6, -0.5, body, v);
    box(1.82, 0.5, 1.2, 0, 1.62, 0.45, M.window, v);
    box(1.6, 0.06, 0.06, 0, 2.0, 1.0, live(new THREE.MeshStandardMaterial({ color: 0x402000, emissive: 0xff9a2a, emissiveIntensity: 0.6 })), v);
    for (const [x, z] of [[-0.95, 1.5], [0.95, 1.5], [-0.95, -1.5], [0.95, -1.5]]) {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.28, 18), M.dark);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, 0.38, z);
      v.add(w);
    }
  }
  // BEFORE: the hills beyond the research district, low and dark against the sky
  const hills = new THREE.Group();
  outside.add(hills);
  const hillM = new THREE.MeshStandardMaterial({ color: 0x0a120f, roughness: 1 });
  for (const [z, w, h, x] of [[-120, 220, 38, 260], [40, 260, 30, 300], [-20, 200, 46, 340], [160, 220, 26, 280]]) {
    const hill = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), hillM);
    hill.scale.set(w * 0.35, h, w * 0.5);
    hill.position.set(x, 0, z);
    hills.add(hill);
  }
  // AFTER: the grass. "It wasn't inches high or even feet high from where they stood. It
  // towered above buildings. Another stood beside it, then another, until thousands
  // disappeared into the night like a forest." Blades from 40 to 140 m, beyond the edge of
  // the developed area (a few dozen metres past the street), each a tapering, curving ribbon.
  const grass = new THREE.Group();
  outside.add(grass);
  const bladeM = new THREE.MeshStandardMaterial({ color: 0x24402a, roughness: 0.85, side: THREE.DoubleSide, emissive: 0x081208, emissiveIntensity: 0.4 });
  // FIRST LIGHT (Chapter 10): "the first true light of morning reach[ed] the tops of the grass
  // blades ... each one catching the light like a tree catching fire, slow and gold from the
  // top down." A line of gold that comes down each blade from its tip as `gold` rises.
  const goldU = { uGold: { value: 0 }, uGoldColor: { value: new THREE.Color(0xffb44a) } };
  bladeM.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, goldU);
    sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nvarying float vH;").replace("#include <begin_vertex>", "#include <begin_vertex>\nvH = position.y;");
    sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying float vH; uniform float uGold; uniform vec3 uGoldColor;")
      .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\ntotalEmissiveRadiance += uGoldColor * 0.9 * smoothstep(1.0 - uGold - 0.06, 1.0 - uGold + 0.06, vH) * step(0.001, uGold);");
  };
  const bladeGeo = bladeGeometry();
  const N = 260;
  const blades = new THREE.InstancedMesh(bladeGeo, bladeM, N);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  s = 3;
  for (let i = 0; i < N; i++) {
    const d = 28 + Math.pow(rnd(), 0.7) * 260; // distance beyond the edge of town
    const z = -180 + rnd() * 360;
    const x = R.xr + 24 + d;
    const h = 38 + rnd() * 100 * (0.6 + d / 320);
    const wdt = h * (0.035 + rnd() * 0.02);
    e.set((rnd() - 0.5) * 0.25, rnd() * Math.PI * 2, (rnd() - 0.5) * 0.3);
    q.setFromEuler(e);
    m4.compose(new THREE.Vector3(x, 0, z), q, new THREE.Vector3(wdt, h, wdt));
    blades.setMatrixAt(i, m4);
  }
  grass.add(blades);
  // "Dew clung to individual blades in beads the size of boulders, each one glowing faintly
  // as the light passed through it."
  const dewM = live(new THREE.MeshStandardMaterial({ color: 0x9cc8d8, roughness: 0.04, metalness: 0, transparent: true, depthWrite: false, emissive: 0xffc070, emissiveIntensity: 0 }));
  // clear through the middle, bright at the rim (the same water as engine/outdoors.js)
  dewM.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace("#include <dithering_fragment>", `#include <dithering_fragment>
      float rim = pow(1.0 - abs(dot(normalize(-vViewPosition), normal)), 3.0);
      gl_FragColor.rgb += vec3(0.55, 0.75, 0.85) * rim * 0.5;
      gl_FragColor.a = clamp(0.1 + rim * 0.8, 0.0, 1.0);`);
  };
  const dew = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 18, 12), dewM, 70);
  s = 7;
  for (let i = 0; i < 70; i++) {
    // "the size of boulders": 1 to 2.2 m across, a 6 to 12 mm drop at 1:180 (Joshua,
    // 2026-10-01: everything outside the town is 180 times the people)
    const d = 30 + Math.pow(rnd(), 0.8) * 150, z = -120 + rnd() * 240, h = 6 + rnd() * 50, r0 = 0.5 + rnd() * 0.6;
    m4.compose(new THREE.Vector3(R.xr + 24 + d, h, z), new THREE.Quaternion(), new THREE.Vector3(r0, r0 * 1.12, r0));
    dew.setMatrixAt(i, m4);
  }
  grass.add(dew);
  // a soft night sky glow behind it all, so the blades read as silhouettes
  // (a horizon and a zenith, so the sky over the grass reads as sky and not as a wall)
  const skyU = { top: { value: new THREE.Color(0x060c16) }, bottom: { value: new THREE.Color(0x0e1a2a) } };
  const skyM = live(new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, uniforms: skyU,
    vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: "uniform vec3 top; uniform vec3 bottom; varying vec3 vP; void main(){ float k = smoothstep(-0.02, 0.45, vP.y); gl_FragColor = vec4(mix(bottom, top, k), 1.0); }",
  }));
  const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 24, 12), skyM);
  sky.position.set(0, 0, 0);
  outside.add(sky);

  // ---------------------------------------------------------------------- finishing
  group.updateMatrixWorld(true);
  const keep = new Set([doorL, doorR, pane, lever, panelDoor, sky, blades, dew, ...rings.flatMap((r) => [r.gimbal]), core]);
  for (const c of cups) c.traverse((n) => n.isMesh && keep.add(n));
  kase.traverse((n) => n.isMesh && keep.add(n));
  // the moving pieces stay as they are; everything else is merged by material
  for (const r of rings) r.gimbal.traverse((n) => n.isMesh && keep.add(n));
  lever.traverse((n) => n.isMesh && keep.add(n));
  panelDoor.traverse((n) => n.isMesh && keep.add(n));
  hills.traverse((n) => n.isMesh && keep.add(n));
  mergeStatic(group, keep);

  // The room's extra lights: the chamber's teal glow (people catch a little of it through
  // the window), and the streetlights for the window scene.
  const extraLights = [
    { color: 0x55d6e0, intensity: 0, distance: 18, decay: 1.6, at: [cx, cy + 1, cz + 3], people: 0, id: "chamber" },
    ...streetLights.map((p) => ({ color: 0xffd09a, intensity: 60, distance: 22, decay: 1.5, at: [p.x, p.y, p.z] })),
    { color: 0xff2a1a, intensity: 0, distance: 12, decay: 1.4, at: [0, 2.6, -3], id: "emergency", people: 0 },
  ];
  // the morning, coming in at the east window: a low warm sun over the grass and into the room
  const sun = new THREE.DirectionalLight(0xffc88a, 0);
  sun.position.set(400, 60, -40);
  sun.target.position.set(0, 0, -4);
  group.add(sun, sun.target);

  let lastT = null;
  function update(P, t, lightRig) {
    const dt = lastT === null || t < lastT || t - lastT > 0.5 ? 0 : t - lastT;
    lastT = t;
    // The rings: their speed is the prop, their angle is integrated so a change of speed
    // never jumps them. After a seek the angle is a function of t alone, so a scrub lands
    // somewhere sensible rather than where the last frame left them.
    const speed = Math.max(0, P.rings || 0);
    for (const [i, r] of rings.entries()) {
      if (dt === 0) r.angle = (t * r.def.spin * speed) % (Math.PI * 2);
      else r.angle += r.def.spin * speed * dt;
      r.ring.rotation.z = r.angle;
      // articulated: each gimbal leans a little while the array works
      r.sway = Math.min(1, speed) * Math.sin(t * (0.3 + i * 0.11) + i) * 12 * DEG;
      r.gimbal.rotation.set(r.base.x + r.sway, r.base.y + r.sway * 0.5, r.base.z);
    }
    const energy = Math.max(0, Math.min(1.6, P.chamber || 0));
    L.ringGlow.emissiveIntensity = 0.3 + 2.2 * energy;
    L.core.emissiveIntensity = 0.2 + 4 * energy;
    L.chamberStrip.emissiveIntensity = 0.25 + 1.2 * energy;
    lever.rotation.z = -(Math.max(0, Math.min(1, P.lever || 0))) * 115 * DEG;
    panelDoor.rotation.y = -(Math.max(0, Math.min(1, P.panel || 0))) * 100 * DEG;
    const { normal, red } = lightingOf(P.lighting);
    const white = Math.max(0, Math.min(1, P.white || 0));
    L.panelLight.emissiveIntensity = 2 * normal + 6 * white;
    L.emergency.emissiveIntensity = 4 * red;
    if (lightRig) {
      const k = 0.06 + 0.94 * normal + 0.22 * red; // the emergency lights light the room, dimly
      for (const rig of [lightRig.room, lightRig.people]) {
        if (!rig) continue;
        rig.hemi.intensity = rig.base.hemi * k + 3 * white;
        rig.key.intensity = rig.base.key * k + 3 * white;
        rig.hemi.color.setRGB(1, 1 - 0.35 * red * (1 - normal), 1 - 0.4 * red * (1 - normal));
      }
      if (lightRig.scene && !extraRefs.length) {
        lightRig.scene.traverse((n) => { if (n.isPointLight) extraRefs.push(n); });
      }
      for (const l of extraRefs) {
        if (l.color.getHex() === 0x55d6e0) l.intensity = 30 * energy;
        if (l.color.getHex() === 0xff2a1a) l.intensity = 14 * red;
      }
    }
    const out = Math.max(0, Math.min(1, P.outside || 0));
    hills.visible = out < 0.5;
    grass.visible = out >= 0.5;
    // the door slides open, the two halves into the wall
    const dk = Math.max(0, Math.min(1, P.door || 0));
    doorL.position.x = doorAt.L - dk * doorAt.w * 0.95;
    doorR.position.x = doorAt.R + dk * doorAt.w * 0.95;
    for (const [i, c] of cups.entries()) c.visible = i < (P.cups || 0);
    kase.visible = (P.case || 0) > 0.5;
    // first light: black to grey, gold down the blades, then full morning blue
    const dawn = Math.max(0, Math.min(3, P.dawn || 0));
    const grey = Math.min(1, dawn), gold = Math.max(0, Math.min(1, dawn - 1)), day = Math.max(0, dawn - 2);
    // horizon and zenith: night, grey, the gold low in the east, morning blue
    const H = [0x0e1a2a, 0x56606a, 0xc08a5a, 0xb4d4ee], Z = [0x060c16, 0x262e38, 0x3a4c66, 0x5288c8];
    const mix3 = (arr) => new THREE.Color(arr[0]).lerp(new THREE.Color(arr[1]), grey).lerp(new THREE.Color(arr[2]), gold * (1 - day)).lerp(new THREE.Color(arr[3]), day);
    skyU.bottom.value.copy(mix3(H));
    skyU.top.value.copy(mix3(Z));
    // the gold comes down the top of each blade and stops there: "from the top down"
    goldU.uGold.value = 0.45 * gold * (1 - day * 0.7);
    bladeM.emissiveIntensity = 0.4 + 0.5 * grey;
    dewM.emissiveIntensity = 0.6 * gold * (1 - 0.5 * day);
    sun.intensity = 2.4 * Math.max(gold, day);
    if (lightRig) {
      for (const rig of [lightRig.room, lightRig.people]) {
        if (!rig) continue;
        rig.hemi.intensity += rig.base.hemi * 0.25 * grey;
        rig.key.color.setRGB(1, 1 - 0.12 * gold * (1 - day), 1 - 0.3 * gold * (1 - day));
      }
    }
  }
  const extraRefs = [];

  return { group, anchors, lamps, screens, lights, keyboards, doors: [doorL, doorR], room: R, extraLights, update, far: 1200 };
}

// The corridor from the laboratory to the main control room (Chapter 2: "They hurried toward
// the main control room while another alarm sounded overhead." / "The corridor lights
// dimmed."). A long hall down -z: the laboratory's door at its far end, the control room's
// behind the camera. Props: lighting (0 normal .. 1 dark), alarm (the beacon, 0 .. 1).
export function buildCorridor() {
  const M = palette();
  const live = (m) => ((m.userData.live = true), m);
  const panelLight = live(M.panelLight.clone());
  const beacon = live(new THREE.MeshStandardMaterial({ color: 0x402000, emissive: 0xffa030, emissiveIntensity: 0 }));
  const group = new THREE.Group();
  group.name = "corridor";
  const { span } = helpers(group);
  const X0 = -1.3, X1 = 1.3, Z0 = -26, Z1 = 2.5, C = 2.8;
  span(X0, X1, -0.02, 0, Z0, Z1, M.floor);
  for (let z = Z0; z < Z1; z += 0.6) span(X0, X1, 0, 0.002, z - 0.005, z + 0.005, M.seam);
  span(X0, X1, C, C + 0.05, Z0, Z1, M.ceiling);
  span(X0 - 0.1, X0, 0, C, Z0, Z1, M.shell);
  span(X1, X1 + 0.1, 0, C, Z0, Z1, M.shell);
  span(X0, X1, 0, C, Z0 - 0.1, Z0, M.shell);
  span(X0, X1, 0, C, Z1, Z1 + 0.1, M.shell);
  for (const x of [X0, X1 - 0.02]) {
    span(x, x + 0.02, 0, 0.1, Z0, Z1, M.dark);
    span(x, x + 0.02, 1.2, 1.23, Z0, Z1, M.steel);
  }
  // wall ribs, and doors to other rooms along both sides
  for (let z = Z0 + 0.8; z < Z1; z += 1.6) for (const x of [X0, X1 - 0.03]) span(x, x + 0.03, 0.1, C, z - 0.012, z + 0.012, M.steel);
  for (const [z, side] of [[-6, -1], [-13, 1], [-19, -1], [-4, 1]]) {
    const x = side < 0 ? X0 : X1 - 0.04;
    span(x, x + 0.04, 0, 2.1, z - 0.6, z + 0.6, M.dark);
    span(x, x + 0.05, 2.1, 2.16, z - 0.66, z + 0.66, M.teal);
  }
  // the laboratory's door at the far end, open
  span(-0.6, -0.55, 0, 2.15, Z0 - 0.05, Z0 + 0.05, M.dark);
  span(0.55, 0.6, 0, 2.15, Z0 - 0.05, Z0 + 0.05, M.dark);
  const labSign = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.24), new THREE.MeshBasicMaterial({ map: signTexture("TOMBS", "DIAGNOSTIC LABORATORY  /  01"), toneMapped: false }));
  labSign.position.set(0, 2.45, Z0 + 0.02);
  group.add(labSign);
  // ceiling light strips down the middle
  for (let z = Z0 + 1; z < Z1 - 0.5; z += 2.2) span(-0.22, 0.22, C - 0.05, C - 0.04, z - 0.7, z + 0.7, panelLight);
  for (const x of [X0, X1]) span(x - 0.02, x + 0.02, C - 0.08, C - 0.04, Z0, Z1, M.teal);
  // the alarm beacon overhead
  const domes = [];
  for (const z of [-8, -18]) {
    const d = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), beacon);
    d.rotation.x = Math.PI;
    d.position.set(0, C - 0.05, z);
    group.add(d);
    domes.push(d);
  }
  group.updateMatrixWorld(true);
  mergeStatic(group, new Set(domes));
  const extraLights = [{ color: 0xffa030, intensity: 0, distance: 9, decay: 1.6, at: [0, 2.5, -8], id: "beacon", people: 0 }];
  const refs = [];
  function update(P, t, rig) {
    const dim = Math.max(0, Math.min(1, P.lighting || 0));
    const alarm = Math.max(0, Math.min(1, P.alarm || 0));
    panelLight.emissiveIntensity = 2 * (1 - 0.9 * dim);
    const spin = alarm * (0.5 + 0.5 * Math.cos(t * Math.PI * 2 * 1.2));
    beacon.emissiveIntensity = 3 * spin;
    if (rig) {
      for (const r of [rig.room, rig.people]) {
        if (!r) continue;
        r.hemi.intensity = r.base.hemi * (1 - 0.85 * dim);
        r.key.intensity = r.base.key * (1 - 0.85 * dim);
      }
      if (rig.scene && !refs.length) rig.scene.traverse((n) => { if (n.isPointLight && n.color.getHex() === 0xffa030) refs.push(n); });
      for (const l of refs) l.intensity = 18 * spin;
    }
  }
  return { group, anchors: {}, lamps: {}, screens: {}, lights: {}, keyboards: [], room: { xl: X0, xr: X1, zb: Z0, zs: Z1, ceiling: C }, extraLights, update };
}

function centre(q) {
  return q.reduce((a, v) => a.add(v), new THREE.Vector3()).multiplyScalar(1 / q.length);
}

// A blade of grass, 1 unit tall: a ribbon that tapers to a point and bends over a little.
function bladeGeometry() {
  const seg = 8, pos = [], idx = [];
  for (let i = 0; i <= seg; i++) {
    const v = i / seg, w = (1 - v) * 0.5 + 0.02, bend = v * v * 0.35;
    pos.push(-w, v, bend, w, v, bend);
  }
  for (let i = 0; i < seg; i++) {
    const a = i * 2;
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function signTexture(title, sub) {
  return canvasTexture(1024, 220, (g, w, h) => {
    g.fillStyle = "#263b47";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#bad6da";
    g.font = "bold 84px Arial, sans-serif";
    g.fillText(title, 40, 110);
    g.font = "24px monospace";
    g.fillText(sub, 44, 168);
  }).texture;
}

function hazardTexture() {
  const t = canvasTexture(128, 128, (g, w, h) => {
    g.fillStyle = "#d8b21c";
    g.fillRect(0, 0, w, h);
    g.fillStyle = "#151515";
    for (let i = -4; i < 8; i++) {
      g.beginPath();
      g.moveTo(i * 32, 0);
      g.lineTo(i * 32 + 16, 0);
      g.lineTo(i * 32 + 16 + h, h);
      g.lineTo(i * 32 + h, h);
      g.fill();
    }
  }).texture;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
