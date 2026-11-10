import * as THREE from 'three';
import { FURNITURE, type Furniture } from './furniture';
import { grille, laminate } from './textures';

/**
 * THE PIECES OF THE LAB THAT A STORY OR A GAME MOVES OR SWITCHES (2026-11-10), built as their own
 * meshes instead of into the static batches, and handed back by id:
 *  - every CHAIR is its own group: an office chair with a five-star base, a gas column, a seat, a
 *    curved back and arms, whose seat can be raised or lowered for whoever sits in it;
 *  - every DESK's monitors are named SCREENS, dark until someone puts a picture on them, each desk
 *    with one soft GLOW light that is off until its screens are on;
 *  - every DESK LAMP has its warm spot light.
 * Plus the dressing Joshua's approved Chapter 1 stills show that the boxes did not: dual monitors
 * on stands, a keyboard and mouse, the intercom's grille and green ring, a glass-fronted cabinet
 * of bottles, a microscope and tube rack, a bottle shelf and a trailing plant.
 *
 * Only the BUILDING is here. What is on a screen, who sits where, whether the lamp is on: that is
 * the story's or the game's state, set through these handles (decision 0042, addendum).
 *
 * Conventions: metres; a chair group's own +z is the way its sitter faces (its back at -z), and
 * its yaw turns that to the world (yaw 0 faces +z, PI faces north, -z).
 */
export interface LabChair extends THREE.Group {
  /** The top of the seat cushion above the floor, metres (0.47 as built). */
  seatTop: number;
  /** Raise or lower the seat: the cushion's top to `h` metres, the back and arms with it. */
  setSeat(h: number): void;
}
export interface LabScreen { readonly mesh: THREE.Mesh; readonly width: number; readonly height: number }
export interface LabLamp { readonly light: THREE.SpotLight; readonly bulb: THREE.Mesh; on: boolean }
export interface LabDressing {
  readonly group: THREE.Group;
  readonly chairs: ReadonlyMap<string, LabChair>;
  /** each desk's screens, left to right as its user sees them */
  readonly screens: ReadonlyMap<string, readonly LabScreen[]>;
  readonly glows: ReadonlyMap<string, THREE.PointLight>;
  readonly lamps: ReadonlyMap<string, LabLamp>;
  /** small things a person picks up (Sarah's tablet): each its own group, origin on its underside */
  readonly props: ReadonlyMap<string, THREE.Group>;
  /** the screens' material while nothing is shown on them */
  readonly screenOff: THREE.Material;
  dispose(): void;
}

const FACE = { n: [0, -1], s: [0, 1], e: [1, 0], w: [-1, 0] } as const;
/** yaw that turns a piece built facing +z to face the way its user looks */
const yawOf = (f: Furniture['facing']) => Math.atan2(FACE[f][0], FACE[f][1]);

export function buildDressing(): LabDressing {
  const group = new THREE.Group(); group.name = 'TOMBS:dressing';
  const mats: THREE.Material[] = [], geos: THREE.BufferGeometry[] = [];
  const std = (p: THREE.MeshStandardMaterialParameters) => { const m = new THREE.MeshStandardMaterial(p); mats.push(m); return m; };
  const M = {
    chairFabric: std({ color: 0x2f343b, roughness: 0.92, metalness: 0 }),
    chairShell: std({ color: 0x24282e, roughness: 0.55, metalness: 0.1 }),
    chrome: std({ color: 0x9aa2aa, roughness: 0.32, metalness: 0.8 }),
    blackPlastic: std({ color: 0x15181c, roughness: 0.45, metalness: 0.15 }),
    keyCaps: std({ color: 0x23272c, roughness: 0.6, metalness: 0.05 }),
    lampMetal: std({ color: 0x1d2024, roughness: 0.4, metalness: 0.6 }),
    white: std({ color: 0xe4e7ea, roughness: 0.6, metalness: 0.05 }),
    steelTop: std({ color: 0x7d858d, roughness: 0.38, metalness: 0.55, map: laminate() }),
    grey: std({ color: 0xaeb4ba, roughness: 0.5, metalness: 0.2 }),
    grille: std({ color: 0xffffff, roughness: 0.6, metalness: 0.1, map: grille() }),
    ring: new THREE.MeshBasicMaterial({ color: 0x5dff8a }),
    bulb: new THREE.MeshBasicMaterial({ color: 0xfff1d0 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0xcfe6ee, roughness: 0.08, metalness: 0, transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide }),
    bottle: new THREE.MeshPhysicalMaterial({ color: 0xd8eef4, roughness: 0.1, metalness: 0, transparent: true, opacity: 0.45, depthWrite: false }),
    capBlue: std({ color: 0x1f4fa3, roughness: 0.5, metalness: 0 }),
    leaf: std({ color: 0x3b8a47, roughness: 0.8, metalness: 0, side: THREE.DoubleSide }),
    pot: std({ color: 0xe9e3d7, roughness: 0.7, metalness: 0 }),
  };
  mats.push(M.ring, M.bulb, M.glass, M.bottle);
  const screenOff = std({ color: 0x07090c, roughness: 0.18, metalness: 0.3 });
  const geo = <T extends THREE.BufferGeometry>(g: T) => { geos.push(g); return g; };
  const box = (w: number, h: number, d: number) => geo(new THREE.BoxGeometry(w, h, d));
  const cyl = (r0: number, r1: number, h: number, n = 12) => geo(new THREE.CylinderGeometry(r0, r1, h, n));
  const add = (parent: THREE.Object3D, g: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number, ry = 0, rx = 0, rz = 0) => {
    const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.rotation.set(rx, ry, rz); o.castShadow = true; o.receiveShadow = true; parent.add(o); return o;
  };
  /** A round rod from a to b (a lamp's arm). */
  const rod = (parent: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, r: number, m: THREE.Material) => {
    const len = a.distanceTo(b), o = new THREE.Mesh(cyl(r, r, len, 8), m);
    o.position.copy(a).add(b).multiplyScalar(0.5); o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    o.castShadow = true; parent.add(o); return o;
  };
  /** A piece's own frame: origin at its footprint's centre on its underside, +z the way its user looks. */
  const frame = (it: Furniture) => { const g = new THREE.Group(); g.name = `tombs:piece:${it.id}`; g.position.set(it.x, it.y0 ?? 0, it.z); g.rotation.y = yawOf(it.facing); group.add(g); return g; };
  /** width across the user and depth along the way they look, from a world-axis footprint */
  const dims = (it: Furniture) => { const alongZ = it.facing === 'n' || it.facing === 's'; return { W: alongZ ? it.w : it.d, D: alongZ ? it.d : it.w }; };

  const props = new Map<string, THREE.Group>();
  const chairs = new Map<string, LabChair>(), screens = new Map<string, LabScreen[]>(), glows = new Map<string, THREE.PointLight>(), lamps = new Map<string, LabLamp>();

  for (const it of FURNITURE) {
    const { W, D } = dims(it), H = it.h;
    switch (it.kind) {
      case 'chair': {
        // Built at (it.x, it.z) facing its desk; a story moves the whole group.
        const c = new THREE.Group() as LabChair; c.name = `tombs:chair:${it.id}`;
        c.position.set(it.x, 0, it.z); c.rotation.y = yawOf(it.facing); group.add(c);
        // the five-star base and its casters
        for (let i = 0; i < 5; i++) {
          const a = (i / 5) * Math.PI * 2, leg = add(c, box(0.035, 0.03, 0.3), M.chairShell, Math.sin(a) * 0.15, 0.07, Math.cos(a) * 0.15, a);
          leg.rotation.x = 0.08;
          add(c, cyl(0.025, 0.025, 0.03, 10), M.blackPlastic, Math.sin(a) * 0.3, 0.025, Math.cos(a) * 0.3, 0, 0, Math.PI / 2);
        }
        const column = add(c, cyl(0.025, 0.025, 1, 10), M.chrome, 0, 0.09, 0);
        const lift = new THREE.Group(); c.add(lift);   // everything that rides the gas column
        add(lift, box(0.5, 0.075, 0.47), M.chairFabric, 0, -0.0375, 0.01);
        add(lift, box(0.46, 0.03, 0.42), M.chairShell, 0, -0.09, 0.01);
        // the back: a slight curve (three panels) and a little recline, its foot behind the seat
        const back = new THREE.Group(); back.position.set(0, 0.08, -0.25); back.rotation.x = -0.14; lift.add(back);
        for (const [x, ry] of [[-0.185, 0.34], [0, 0], [0.185, -0.34]] as const) add(back, box(0.19, 0.64, 0.07), M.chairFabric, x, 0.34, Math.abs(x) * 0.22, ry);
        const top = add(back, geo(new THREE.CylinderGeometry(0.27, 0.27, 0.07, 20, 1, false, -Math.PI / 2, Math.PI)), M.chairFabric, 0, 0.66, 0.05); top.rotation.set(Math.PI / 2, 0, 0); top.scale.set(1, 1, 0.35);
        add(lift, box(0.05, 0.16, 0.05), M.chairShell, 0, 0.03, -0.27);
        // arms: posts and pads, 21 cm over the seat and 30 cm out, clear of a broad sitter's thighs
        for (const s of [-1, 1]) {
          add(lift, box(0.03, 0.2, 0.03), M.chairShell, s * 0.3, 0.1, -0.02);
          add(lift, box(0.075, 0.035, 0.25), M.blackPlastic, s * 0.3, 0.21, 0.0);
        }
        c.seatTop = 0.47;
        c.setSeat = (h: number) => {
          c.seatTop = h;
          lift.position.y = h;
          // the column runs from the base to under the seat pan
          const len = Math.max(0.05, h - 0.21); column.scale.y = len; column.position.y = 0.1 + len / 2;
        };
        c.setSeat(0.47);
        chairs.set(it.id, c);
        break;
      }
      case 'desk': {
        const g = frame(it);
        // dual monitors on stands, turned in a little toward the user, 0.26 m from the back edge
        const n = W >= 1.6 ? 2 : 1, sw = 0.54, sh = 0.31, list: LabScreen[] = [];
        for (let i = 0; i < n; i++) {
          const x = n === 2 ? (i ? -0.295 : 0.295) : 0, turn = n === 2 ? (i ? 0.2 : -0.2) : 0, zc = D / 2 - 0.26;
          // (turned about its stand so its face looks back toward the middle of the user's place)
          const mon = new THREE.Group(); mon.position.set(x, H, zc); mon.rotation.y = turn; g.add(mon);
          add(mon, box(0.2, 0.012, 0.16), M.blackPlastic, 0, 0.006, 0.03);
          add(mon, box(0.04, 0.2, 0.025), M.blackPlastic, 0, 0.11, 0.035);
          add(mon, box(sw + 0.022, sh + 0.022, 0.025), M.blackPlastic, 0, 0.36, 0.0);
          const screen = new THREE.Mesh(geo(new THREE.PlaneGeometry(sw, sh)), screenOff);
          screen.position.set(0, 0.36, -0.0135); screen.rotation.y = Math.PI; screen.name = `tombs:screen:${it.id}:${i}`;
          mon.add(screen);
          list.push({ mesh: screen, width: sw, height: sh });
        }
        screens.set(it.id, list);
        const glow = new THREE.PointLight(0x58d6e0, 0, 2.6, 2); glow.position.set(0, H + 0.36, D / 2 - 0.45); glow.visible = false; g.add(glow); glows.set(it.id, glow);
        // keyboard and mouse
        add(g, box(0.44, 0.022, 0.14), M.blackPlastic, 0.05, H + 0.011, -D / 2 + 0.23);
        add(g, box(0.42, 0.006, 0.12), M.keyCaps, 0.05, H + 0.024, -D / 2 + 0.23);
        const mouse = add(g, geo(new THREE.SphereGeometry(0.032, 12, 8)), M.blackPlastic, -0.30, H + 0.012, -D / 2 + 0.23); mouse.scale.set(0.9, 0.45, 1.5);
        break;
      }
      case 'desk-lamp': {
        const g = frame(it);
        add(g, cyl(0.075, 0.08, 0.02, 20), M.lampMetal, 0, 0.01, 0);
        // In the lamp's frame the user is at -z and their keyboard to +x: the arm rises from the
        // base at the back corner, folds at the elbow, and the shade hangs over the desk's middle.
        const base = new THREE.Vector3(0, 0.02, 0), elbow = new THREE.Vector3(0.02, 0.4, 0.06), head = new THREE.Vector3(0.14, 0.36, -0.2);
        const aim = new THREE.Vector3(0.75, 0, -0.42);   // the keyboard, on the desk top
        for (const [a, b] of [[base, elbow], [elbow, head]] as const) rod(g, a, b, 0.011, M.lampMetal);
        add(g, geo(new THREE.SphereGeometry(0.018, 10, 8)), M.lampMetal, elbow.x, elbow.y, elbow.z);
        const dir = aim.clone().sub(head).normalize();
        const shade = add(g, geo(new THREE.SphereGeometry(0.1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2)), M.lampMetal, head.x, head.y, head.z);
        shade.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().negate()); shade.position.addScaledVector(dir, -0.02);
        (shade.material as THREE.Material).side = THREE.DoubleSide;
        const bulbAt = head.clone().addScaledVector(dir, 0.07);
        const bulb = add(g, geo(new THREE.SphereGeometry(0.028, 12, 8)), M.bulb, bulbAt.x, bulbAt.y, bulbAt.z);
        bulb.castShadow = false;
        const light = new THREE.SpotLight(0xffc98a, 6, 3.2, 1.0, 0.7, 2);
        light.position.copy(head.clone().addScaledVector(dir, 0.09)); g.add(light);
        const target = new THREE.Object3D(); target.position.copy(aim); g.add(target); light.target = target;
        light.castShadow = true; light.shadow.mapSize.set(1024, 1024); light.shadow.bias = -0.0008; light.shadow.normalBias = 0.02; light.shadow.camera.near = 0.05; light.shadow.camera.far = 3.2;
        const lamp: LabLamp = { light, bulb, get on() { return light.visible; }, set on(v: boolean) { light.visible = v; bulb.visible = v; } };
        lamps.set(it.id, lamp);
        break;
      }
      case 'intercom': {
        const g = frame(it);
        const body = add(g, box(W, H, D), M.grey, 0, H / 2, 0);
        (body as THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>).material = [M.grey, M.grey, M.grey, M.grey, M.grey, M.grille];   // its face toward the user (-z in its frame)
        const ring = add(g, geo(new THREE.TorusGeometry(0.018, 0.004, 8, 24)), M.ring, 0, H * 0.28, -D / 2 - 0.002);
        ring.castShadow = false;
        break;
      }
      case 'glass-cabinet': {
        const g = frame(it);
        // carcass open at the front, glass doors, three shelves of bottles
        const t = 0.02;
        add(g, box(W, H, t), M.white, 0, H / 2, D / 2 - t / 2);
        for (const s of [-1, 1]) add(g, box(t, H, D), M.white, s * (W / 2 - t / 2), H / 2, 0);
        add(g, box(W, t, D), M.white, 0, t / 2, 0); add(g, box(W, t, D), M.white, 0, H - t / 2, 0);
        add(g, box(W, 0.6, D - 0.02), M.white, 0, 0.3, 0.01);   // closed base cupboard
        for (let i = 0; i < 3; i++) {
          const y = 0.75 + i * 0.42;
          add(g, box(W - 2 * t, 0.015, D - 0.04), M.white, 0, y, 0.01);
          for (let k = 0; k < 7; k++) {
            const x = -W / 2 + 0.1 + k * ((W - 0.2) / 6), r = 0.028 + ((k + i) % 3) * 0.006, h = 0.14 + ((k * 3 + i) % 4) * 0.03;
            const b = add(g, cyl(r, r, h, 12), M.bottle, x, y + h / 2 + 0.008, 0.02 + ((k + i) % 2) * 0.06); b.castShadow = false;
            add(g, cyl(r * 0.6, r * 0.6, 0.025, 10), M.capBlue, x, y + h + 0.02, b.position.z);
          }
        }
        for (const s of [-1, 1]) { const door = add(g, box(W / 2 - 0.01, H - 0.64, 0.01), M.glass, s * W / 4, 0.62 + (H - 0.64) / 2, -D / 2 + 0.005); door.castShadow = false;
          add(g, box(0.012, 0.18, 0.02), M.chrome, s * 0.04, 1.2, -D / 2 - 0.01); }
        break;
      }
      case 'wall-shelf': {
        const g = frame(it);
        add(g, box(W, 0.025, D), M.white, 0, 0, 0);
        for (const s of [-1, 1]) add(g, box(0.02, 0.12, D * 0.8), M.chrome, s * (W / 2 - 0.15), -0.06, 0.02);
        for (let k = 0; k < 14; k++) {
          const x = -W / 2 + 0.12 + k * ((W - 0.24) / 13), r = 0.026 + (k % 3) * 0.005, h = 0.12 + ((k * 5) % 4) * 0.035;
          if (k === 6 || k === 7) continue;
          const b = add(g, cyl(r, r, h, 12), M.bottle, x, 0.012 + h / 2, (k % 2) * 0.05 - 0.02); b.castShadow = false;
          add(g, cyl(r * 0.6, r * 0.6, 0.024, 10), M.capBlue, x, 0.012 + h + 0.012, b.position.z);
        }
        break;
      }
      case 'microscope': {
        const g = frame(it);
        add(g, box(0.2, 0.03, 0.24), M.white, 0, 0.015, 0);
        const arm = add(g, box(0.06, 0.3, 0.07), M.white, 0, 0.17, 0.08); arm.rotation.x = -0.15;
        add(g, box(0.12, 0.015, 0.12), M.blackPlastic, 0, 0.13, -0.01);
        const head = add(g, cyl(0.03, 0.03, 0.12, 14), M.white, 0, 0.32, 0.03); head.rotation.x = -0.5;
        for (const s of [-1, 1]) { const ep = add(g, cyl(0.012, 0.014, 0.08, 10), M.blackPlastic, s * 0.025, 0.39, -0.01); ep.rotation.x = -0.7; }
        add(g, cyl(0.018, 0.012, 0.07, 10), M.chrome, 0, 0.21, -0.02);
        break;
      }
      case 'tube-rack': {
        const g = frame(it);
        add(g, box(W, 0.01, D), M.white, 0, 0.005, 0); add(g, box(W, 0.01, D), M.white, 0, 0.07, 0);
        for (let k = 0; k < 6; k++) { const x = -W / 2 + 0.03 + k * ((W - 0.06) / 5); const tb = add(g, cyl(0.008, 0.008, 0.1, 8), M.bottle, x, 0.06, 0); tb.castShadow = false;
          add(g, cyl(0.009, 0.009, 0.014, 8), M.capBlue, x, 0.115, 0); }
        break;
      }
      case 'pot-plant': {
        const g = frame(it);
        add(g, cyl(0.07, 0.055, 0.12, 16), M.pot, 0, 0.06, 0);
        // trailing leaves down the front, heart-shaped cards
        for (let k = 0; k < 22; k++) {
          const a = k * 2.4, r = 0.04 + (k % 5) * 0.02, y = 0.12 - (k % 7) * 0.07 + (k < 8 ? 0.06 : 0);
          const l = add(g, geo(new THREE.CircleGeometry(0.035, 6)), M.leaf, Math.cos(a) * r, y, Math.sin(a) * r * 0.6 + 0.05, a, -0.6 + (k % 3) * 0.3, 0.2);
          l.castShadow = false;
        }
        break;
      }
      case 'tablet': {
        // a tablet on its back, its screen up; the group is what a hand carries
        const g = new THREE.Group(); g.name = `tombs:prop:${it.id}`; g.position.set(it.x, it.y0 ?? 0, it.z); g.rotation.y = yawOf(it.facing); group.add(g);
        add(g, box(0.25, 0.008, 0.175), M.blackPlastic, 0, 0.004, 0);
        const face = new THREE.Mesh(geo(new THREE.PlaneGeometry(0.228, 0.155)), screenOff); face.rotation.x = -Math.PI / 2; face.position.y = 0.0085; face.name = `tombs:screen:${it.id}`; g.add(face);
        g.userData.screen = face;
        props.set(it.id, g);
        break;
      }
      default: break;
    }
  }
  return {
    group, chairs, screens, glows, lamps, props, screenOff,
    dispose() { for (const g of geos) g.dispose(); for (const m of mats) m.dispose(); group.removeFromParent(); },
  };
}
