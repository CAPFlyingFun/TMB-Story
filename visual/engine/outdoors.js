// OUTSIDE, AT THE EDGE (Chapters 5 and 8), BUILT.
//
// Two places the manuscript sends Jack out of the control room, in metres at the
// settlement's own scale (a person about 1.75 m), seen by people3d.js like any built room:
//
//   variant "south" -- Chapter 5, the southern perimeter road. "The pavement ended in a
//   perfectly straight line. Beyond it rose wilderness." The nearest blade of grass "towered
//   over him. Its base was wider than his torso, and fine hairs along its surface looked like
//   stiff branches. A ridge of soil beyond the pavement rose several stories above the road."
//   A droplet "clung beneath a grass blade, rising nearly to Jack's chest". "Something pale
//   lay half buried in the soil ... long. Curved. Kind of like a moon ... smooth and
//   translucent at one end. Fine ridges crossed its surface." Then "The grass stems moved one
//   after another in the darkness, not with the wind but in a line approaching the
//   settlement", and the dark shape between two blades, behind the ridge.
//
//   variant "east" -- Chapter 8, the walk to the eastern sensor marker in the last of the
//   dark: "blades of grass rising on either side of them like a colonnade with no ceiling.
//   Dew hung from the tips in slow, trembling beads, each one large enough to swallow a
//   person whole". At the marker, "a single blade of grass, bent flat and pressed into the
//   dirt". The sky "had started to soften at its edges".
//
// THE BOUNDARY IS INVISIBLE (Chapter 5): no wall, no glow. Asphalt stops and soil begins.
// The sizes are the reference chart's (story-rules/reference, 1:180): a lawn blade is
// ~17 m to them, a 1 mm droplet 18 cm. The droplet and the clipping are the chapter's own
// comparisons (chest height; longer than Jack is tall).
//
// Props: sky (0 night .. 1 the edges softening), headlights (0/1), torch (0/1, the hand
// lights), rustle (0 .. 1: the line of moving stems, far to near), vehicle (0 parked at the
// end of the road .. 1 forty metres back toward town), leaving (0 the vehicle faces the edge,
// as it arrives; 1 it faces town, as it goes), torchZ (where along the path the hand lights
// are, so they travel with the people carrying them).
//
// The objects the 2D sheet has and no model does yet -- the utility vehicle (assets/props,
// "Mark's utility vehicle (Ch 5)"), the security camera pole, the floodlight, barriers and
// cones -- stand in as cards that turn to the camera, as Lena and Mark do (Joshua,
// 2026-10-01: "For any missing 3D model, replace temporarily with the 2D transparent image").

import * as THREE from "../vendor/three-human.js";
import { canvasTexture, mergeStatic } from "./labRoom.js";

// From assets/props/props.json (the sheet's measured sizes).
const PROPS = {
  "suv-front": { file: "suv-front.png", size: [151, 162], anchor: [75.5, 158], ppm: 78.97 },
  "suv-front-quarter": { file: "suv-front-quarter.png", size: [188, 161], anchor: [94, 157], ppm: 78.46 },
  "suv-rear": { file: "suv-rear.png", size: [165, 153], anchor: [82.5, 149], ppm: 74.36 },
  "security-camera-pole": { file: "security-camera-pole.png", size: [91, 246], anchor: [45.5, 242], ppm: 68 },
  floodlight: { file: "floodlight.png", size: [144, 262], anchor: [72, 258], ppm: 42.33 },
  "jersey-barrier": { file: "jersey-barrier.png", size: [204, 125], anchor: [102, 121], ppm: 146.25 },
  "traffic-cone": { file: "traffic-cone.png", size: [113, 156], anchor: [56.5, 152], ppm: 211.43 },
  "electrical-cabinet": { file: "electrical-cabinet.png", size: [158, 169], anchor: [79, 165], ppm: 115 },
};

const DEG = Math.PI / 180;
function rand(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

// A blade of grass, 1 unit tall and 1 wide at the base: a ribbon tapering to a point,
// bending over toward its tip, with a midrib so it is not a flat card from the side.
function bladeGeometry() {
  const seg = 14, pos = [], uv = [], idx = [];
  for (let i = 0; i <= seg; i++) {
    const v = i / seg, w = (1 - Math.pow(v, 1.6)) * 0.5 + 0.01, bend = v * v * 0.3;
    pos.push(-w, v, bend, 0, v, bend - 0.04 * (1 - v), w, v, bend);
    uv.push(0, v, 0.5, v, 1, v);
  }
  for (let i = 0; i < seg; i++) {
    const a = i * 3;
    idx.push(a, a + 1, a + 3, a + 1, a + 4, a + 3, a + 1, a + 2, a + 4, a + 2, a + 5, a + 4);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// The blade's surface: long veins and the "fine hairs ... like stiff branches".
function bladeTexture() {
  const t = canvasTexture(256, 1024, (g, w, h) => {
    const grd = g.createLinearGradient(0, h, 0, 0);
    grd.addColorStop(0, "#2a4220");
    grd.addColorStop(0.6, "#3d5f2c");
    grd.addColorStop(1, "#56783a");
    g.fillStyle = grd;
    g.fillRect(0, 0, w, h);
    const r = rand(4);
    for (let i = 0; i < 18; i++) {
      const x = (i / 18) * w + r() * 4;
      g.strokeStyle = `rgba(${20 + r() * 20},${40 + r() * 30},${16},${0.35 + r() * 0.3})`;
      g.lineWidth = i === 9 ? 6 : 1 + r() * 2;
      g.beginPath();
      g.moveTo(x, h);
      g.lineTo(w / 2 + (x - w / 2) * 0.2, 0);
      g.stroke();
    }
    for (let i = 0; i < 900; i++) {
      const x = r() * w, y = r() * h;
      g.strokeStyle = `rgba(200,220,170,${0.12 + r() * 0.2})`;
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + (r() - 0.5) * 6, y - 6 - r() * 10);
      g.stroke();
    }
  }).texture;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function soilTexture() {
  const t = canvasTexture(512, 512, (g, w, h) => {
    g.fillStyle = "#3a2a1c";
    g.fillRect(0, 0, w, h);
    const r = rand(9);
    for (let i = 0; i < 5000; i++) {
      const v = 30 + r() * 50;
      g.fillStyle = `rgba(${v + 20},${v},${v - 14},${0.25 + r() * 0.4})`;
      const s = 1 + r() * 5;
      g.fillRect(r() * w, r() * h, s, s);
    }
  }).texture;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(10, 10);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function asphaltTexture() {
  const t = canvasTexture(256, 256, (g, w, h) => {
    g.fillStyle = "#1b1e21";
    g.fillRect(0, 0, w, h);
    const r = rand(2);
    for (let i = 0; i < 3000; i++) {
      const v = 20 + r() * 30;
      g.fillStyle = `rgb(${v},${v + 2},${v + 4})`;
      g.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2);
    }
  }).texture;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 12);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// The sky: a dome with a horizon and a zenith colour, both moved by the `sky` prop.
function skyDome() {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: { top: { value: new THREE.Color(0x03060c) }, bottom: { value: new THREE.Color(0x0b1420) } },
    vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: "uniform vec3 top; uniform vec3 bottom; varying vec3 vP; void main(){ float k = smoothstep(-0.05, 0.55, vP.y); gl_FragColor = vec4(mix(bottom, top, k), 1.0); }",
  });
  const m = new THREE.Mesh(new THREE.SphereGeometry(800, 32, 16), mat);
  return { mesh: m, mat };
}

// A card: one of the sheet's drawings standing on the ground, turned to the camera every
// frame. `views` picks a drawing by which way the object faces (the SUV's three).
function makeCard(group, name, x, z, opts = {}) {
  const views = opts.views || { south: name };
  const loader = new THREE.TextureLoader();
  const tex = {};
  for (const [k, n] of Object.entries(views)) {
    const P = PROPS[n];
    const t = loader.load("../assets/props/" + P.file);
    t.colorSpace = THREE.SRGBColorSpace;
    tex[k] = { t, P };
  }
  const mat = new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.5, side: THREE.DoubleSide, toneMapped: false, alphaToCoverage: true });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
  plane.userData.noMask = true; // its empty corners must not hide the people behind it
  const holder = new THREE.Group();
  holder.add(plane);
  holder.position.set(x, 0, z);
  group.add(holder);
  return { holder, plane, mat, tex, yaw: opts.yaw || 0, light: opts.light ?? 1 };
}
function drawCard(c, cam, lightK) {
  const p = c.holder.position, toCam = Math.atan2(cam.x - p.x, cam.z - p.z);
  let rel = c.yaw - toCam;
  while (rel > Math.PI) rel -= 2 * Math.PI;
  while (rel < -Math.PI) rel += 2 * Math.PI;
  let view = "south", flip = false;
  if (c.tex.quarter) {
    const a = Math.abs(rel);
    view = a < 25 * DEG ? "south" : a < 125 * DEG ? "quarter" : "north";
    flip = view === "quarter" && rel < 0;
  }
  const { t, P } = c.tex[view] || c.tex.south;
  if (c.mat.map !== t) { c.mat.map = t; c.mat.needsUpdate = true; }
  const w = P.size[0] / P.ppm, h = P.size[1] / P.ppm;
  c.plane.scale.set(flip ? -w : w, h, 1);
  c.plane.position.set(-(P.anchor[0] / P.size[0] - 0.5) * w * (flip ? -1 : 1), -(0.5 - P.anchor[1] / P.size[1]) * h, 0);
  c.holder.rotation.set(0, toCam, 0);
  c.mat.color.setScalar(Math.max(0.05, Math.min(1, lightK * c.light)));
}

export function buildOutdoors(opts = {}) {
  const variant = opts.variant || "south";
  const group = new THREE.Group();
  group.name = "outdoors-" + variant;
  const live = (m) => ((m.userData.live = true), m);
  const r = rand(variant === "south" ? 17 : 23);

  const soilM = new THREE.MeshStandardMaterial({ map: soilTexture(), roughness: 1, color: 0xb8a088 });
  const asphaltM = new THREE.MeshStandardMaterial({ map: asphaltTexture(), roughness: 0.95 });
  const kerbM = new THREE.MeshStandardMaterial({ color: 0x4a4f53, roughness: 0.9 });
  const lineM = new THREE.MeshStandardMaterial({ color: 0x8a8460, roughness: 0.8 });
  const bladeM = new THREE.MeshStandardMaterial({ map: bladeTexture(), roughness: 0.75, side: THREE.DoubleSide });
  const pebbleM = new THREE.MeshStandardMaterial({ color: 0x6d6150, roughness: 0.95, flatShading: true });
  const rootM = new THREE.MeshStandardMaterial({ color: 0x4a3524, roughness: 1 });
  // water: nearly clear through the middle, bright at the rim where the light skims it
  const waterM = new THREE.MeshStandardMaterial({ color: 0x9cc8d8, roughness: 0.04, metalness: 0, transparent: true, depthWrite: false });
  waterM.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace("#include <dithering_fragment>", `#include <dithering_fragment>
      float rim = pow(1.0 - abs(dot(normalize(-vViewPosition), normal)), 3.0);
      gl_FragColor.rgb += vec3(0.55, 0.75, 0.85) * rim * 0.5;
      gl_FragColor.a = clamp(0.07 + rim * 0.8, 0.0, 1.0);`);
  };
  const box = (w, h, d, x, y, z, m) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); group.add(o); return o; };

  // ------------------------------------------------------------------ the ground
  // EDGE: the z at which the paving stops (south) or the strip of path the boundary hugs (east).
  const EDGE = variant === "south" ? -15 : null;
  const groundH = (x, z) => {
    // the soil beyond the edge: low hummocks, then the ridge "several stories" high
    if (variant === "south") {
      if (z > EDGE) return -0.02;
      const d = EDGE - z;
      const ridge = 12 * Math.exp(-Math.pow((d - 13) / 4, 2)) * (0.85 + 0.15 * Math.sin(x * 0.08)); // level near the edge
      return 0.05 + 0.25 * Math.sin(x * 0.7 + z * 0.4) * Math.min(1, d / 2) + ridge;
    }
    const off = Math.abs(x) - 2.2; // the path is x in [-2.2, 2.2]
    if (off < 0) return -0.02;
    return 0.05 + 0.3 * Math.sin(x * 0.6 + z * 0.5) * Math.min(1, off / 1.5);
  };
  {
    const N = 160, S = 140;
    const g = new THREE.PlaneGeometry(S, S, N, N);
    g.rotateX(-Math.PI / 2);
    const pa = g.attributes.position;
    for (let i = 0; i < pa.count; i++) pa.setY(i, groundH(pa.getX(i), pa.getZ(i) - 30));
    g.translate(0, 0, -30);
    g.computeVertexNormals();
    const soil = new THREE.Mesh(g, soilM);
    group.add(soil);
  }
  // the paving: the road (south), ending in a perfectly straight line; or the path (east)
  if (variant === "south") {
    box(9, 0.04, 40, 0, 0, EDGE + 20, asphaltM);
    for (const x of [-4.6, 4.6]) box(0.3, 0.14, 40, x, 0.05, EDGE + 20, kerbM);
    for (let z = EDGE + 2; z < EDGE + 40; z += 4) box(0.12, 0.045, 2, 0, 0.002, z, lineM);
    // the town behind: dark houses, a porch light or two
    for (let i = 0; i < 9; i++) {
      const x = (i % 2 ? 1 : -1) * (9 + r() * 8), z = EDGE + 10 + i * 4;
      box(6, 4 + r() * 2, 5, x, 2.2, z, new THREE.MeshStandardMaterial({ color: 0x24292e, roughness: 0.9 }));
      if (r() > 0.6) box(0.3, 0.3, 0.1, x - Math.sign(x) * 3.05, 1.8, z, live(new THREE.MeshStandardMaterial({ color: 0x302010, emissive: 0xffc070, emissiveIntensity: 2 })));
    }
  } else {
    box(4.4, 0.04, 70, 0, 0, -30, asphaltM);
    for (const x of [-2.3, 2.3]) box(0.14, 0.1, 70, x, 0.03, -30, kerbM);
  }

  // ------------------------------------------------------------------- the grass
  const bladeGeo = bladeGeometry();
  const spots = [];
  if (variant === "south") {
    // the near blades along the edge: the nearest "towered over him"
    spots.push([2.4, EDGE - 0.6, 15, 0.9, 200], [-3.4, EDGE - 0.9, 17, 1.0, 160], [6.8, EDGE - 1.2, 19, 1.1, 230], [-7.5, EDGE - 0.8, 16, 0.95, 120]);
    for (let i = 0; i < 230; i++) {
      const x = -65 + r() * 130, z = EDGE - 1.5 - Math.pow(r(), 0.8) * 70;
      spots.push([x, z, 14 + r() * 16, 0.6 + r() * 0.5, r() * 360]);
    }
  } else {
    // the colonnade: both sides of the path, all the way to the marker
    for (let i = 0; i < 260; i++) {
      const side = r() < 0.5 ? -1 : 1, x = side * (3 + Math.pow(r(), 1.4) * 40), z = 4 - r() * 80;
      spots.push([x, z, 14 + r() * 18, 0.6 + r() * 0.5, r() * 360]);
    }
  }
  const blades = new THREE.InstancedMesh(bladeGeo, bladeM, spots.length);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  spots.forEach(([x, z, h, w, rot], i) => {
    e.set((r() - 0.5) * 0.12, rot * DEG, (r() - 0.5) * 0.12);
    q.setFromEuler(e);
    m4.compose(new THREE.Vector3(x, groundH(x, z) - 0.1, z), q, new THREE.Vector3(w, h, w));
    blades.setMatrixAt(i, m4);
  });
  group.add(blades);

  // dew: on the near blades (east: "large enough to swallow a person"; south: the one droplet)
  const drops = [];
  if (variant === "east") {
    for (let i = 0; i < 26; i++) {
      const [x, z, h] = spots[(i * 7) % spots.length];
      const d = new THREE.Mesh(new THREE.SphereGeometry(1.1 + r() * 0.5, 24, 16), waterM);
      d.scale.y = 1.15;
      d.position.set(x + 0.2 * h * 0.3, groundH(x, z) + h * (0.55 + r() * 0.3), z + 0.3 * h * 0.3);
      group.add(d);
      drops.push({ d, y: d.position.y, ph: r() * 6 });
    }
  } else {
    // "A droplet of water clung beneath a grass blade, rising nearly to Jack's chest."
    const d = new THREE.Mesh(new THREE.SphereGeometry(0.66, 32, 20), waterM);
    d.scale.set(1, 0.92, 1);
    d.position.set(-1.0, 0.62, EDGE - 0.75);
    group.add(d);
    drops.push({ d, y: d.position.y, ph: 0 });
    // the blade bowing over it
    const over = new THREE.Mesh(bladeGeo, bladeM);
    over.scale.set(0.8, 9, 0.8);
    over.position.set(-2.8, -0.05, EDGE - 1.6);
    over.rotation.set(-1.05, 0.6, 0);
    group.add(over);
  }

  // pebbles: "one pebble appeared nearly as tall as the utility building" (Chapter 4); here,
  // boulders in the soil, and roots like heavy cables across the ridge's face
  for (let i = 0; i < 60; i++) {
    const x = -40 + r() * 80, z = variant === "south" ? EDGE - 1 - r() * 25 : -2 - r() * 70;
    if (variant === "east" && Math.abs(x) < 3) continue;
    const s = 0.3 + Math.pow(r(), 3) * 3.5;
    const p = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), pebbleM);
    p.scale.set(s * (0.8 + r() * 0.5), s * (0.6 + r() * 0.4), s * (0.8 + r() * 0.5));
    p.position.set(x, groundH(x, z) + s * 0.3, z);
    p.rotation.set(r() * 3, r() * 3, r() * 3);
    group.add(p);
  }
  if (variant === "south") {
    for (let i = 0; i < 14; i++) {
      const x0 = -30 + r() * 60, z0 = EDGE - 6 - r() * 4;
      const pts = [];
      for (let k = 0; k < 6; k++) { const x = x0 + k * (2 + r() * 2), z = z0 - k * 0.8 - r(); pts.push(new THREE.Vector3(x, groundH(x, z) + 0.2 + r() * 0.3, z)); }
      group.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.18 + r() * 0.2, 6), rootM));
    }
    // THE CLIPPING: a crescent "longer than Jack is tall", half buried, curving up from the
    // dirt, smooth and translucent at one end, fine ridges across it
    // (an outer arc and an inner one below it: thickest in the middle, ~a ninth of its
    // length, as a clipping is, and a chord of about 2.6 m)
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 1.45, 0.17 * Math.PI, 0.83 * Math.PI, false);
    shape.absarc(0, -0.2, 1.36, 0.82 * Math.PI, 0.18 * Math.PI, true);
    const nailGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.09, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, curveSegments: 40 });
    const nailTex = canvasTexture(512, 64, (g, w, h) => {
      const grd = g.createLinearGradient(0, 0, w, 0);
      grd.addColorStop(0, "#efe4c8");
      grd.addColorStop(0.75, "#e6d8b8");
      grd.addColorStop(1, "#f6f0e2");
      g.fillStyle = grd;
      g.fillRect(0, 0, w, h);
      g.strokeStyle = "rgba(160,140,110,.45)";
      for (let x = 6; x < w; x += 9) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 2, h); g.stroke(); }
    }).texture;
    const nail = new THREE.Mesh(nailGeo, new THREE.MeshPhysicalMaterial({ map: nailTex, roughness: 0.35, transmission: 0, transparent: true, opacity: 0.94, clearcoat: 0.6, sheen: 0.3 }));
    // lying back into the soil with one end buried, curving up out of the dirt
    // (one end under the soil, the arch rising to ~0.6 m, the far end ~0.45 m up)
    nail.position.set(5.4, -0.25, EDGE - 1.3);
    nail.rotation.set(-0.9, -0.3, 0.35);
    group.add(nail);
  } else {
    // the eastern marker: a post with a lit sensor head, at the end of the path
    box(0.16, 1.6, 0.16, 1.6, 0.8, -46, new THREE.MeshStandardMaterial({ color: 0x8a9298, roughness: 0.6 }));
    box(0.4, 0.3, 0.3, 1.6, 1.7, -46, new THREE.MeshStandardMaterial({ color: 0xd8dcd6, roughness: 0.5 }));
    box(0.08, 0.08, 0.02, 1.6, 1.72, -45.84, live(new THREE.MeshStandardMaterial({ color: 0x103020, emissive: 0x40ff90, emissiveIntensity: 2 })));
    // "a single blade of grass, bent flat and pressed into the dirt, far heavier than wind"
    const flat = new THREE.Mesh(bladeGeo, bladeM);
    flat.scale.set(0.9, 16, 0.9);
    flat.rotation.set(-Math.PI / 2 + 0.02, 0, 0.35);
    flat.position.set(3.6, 0.12, -47);
    group.add(flat);
  }

  // the line of stems that moves "one after another ... in a line approaching" (south)
  const rustlers = [];
  if (variant === "south") {
    for (let i = 0; i < 12; i++) {
      const k = i / 11, x = -34 + k * 26, z = EDGE - 48 + k * 30;
      const b = new THREE.Mesh(bladeGeo, bladeM);
      const h = 16 + r() * 8;
      b.scale.set(0.8, h, 0.8);
      b.position.set(x, groundH(x, z) - 0.1, z);
      b.rotation.y = r() * Math.PI * 2;
      group.add(b);
      rustlers.push({ b, k, base: b.rotation.clone() });
    }
  }

  // ------------------------------------------------------------- cards and lights
  const cards = [];
  let suv = null;
  if (variant === "south") {
    suv = makeCard(group, "suv", 1.8, -9.5, { views: { south: "suv-front", quarter: "suv-front-quarter", north: "suv-rear" }, yaw: Math.PI });
    cards.push(suv);
    cards.push(makeCard(group, "security-camera-pole", -4.9, EDGE + 1.5));
    cards.push(makeCard(group, "floodlight", 5.2, EDGE + 3.5, { light: 1.3 }));
    cards.push(makeCard(group, "jersey-barrier", -2.5, EDGE + 0.9));
    cards.push(makeCard(group, "traffic-cone", 0.4, EDGE + 1.1));
    cards.push(makeCard(group, "traffic-cone", 3.0, EDGE + 1.3));
  } else {
    cards.push(makeCard(group, "electrical-cabinet", -1.7, -12));
    cards.push(makeCard(group, "security-camera-pole", 1.9, -30));
  }

  const sky = skyDome();
  sky.mesh.userData.noMask = true;
  group.add(sky.mesh);
  for (const d of drops) d.d.userData.noMask = true;

  group.updateMatrixWorld(true);
  const keep = new Set([blades, sky.mesh, ...drops.map((d) => d.d), ...rustlers.map((x) => x.b), ...cards.map((c) => c.plane)]);
  group.traverse((n) => { if (n.isMesh && n.material && n.material.userData && n.material.userData.live) keep.add(n); });
  mergeStatic(group, keep);

  // Lights: a cold night fill, the floodlight at the end of the road, the vehicle's
  // headlights, the hand lights. The people get their share through `people`.
  const extraLights = variant === "south"
    ? [{ color: 0xffd8a0, intensity: 40, distance: 30, decay: 1.6, at: [5.2, 5.4, EDGE + 3.2], people: 10, id: "flood" },
       { color: 0xf0f4ff, intensity: 0, distance: 28, decay: 1.4, at: [1.8, 1.0, -11.6], people: 0, id: "head" },
       { color: 0xfff2d8, intensity: 0, distance: 14, decay: 1.8, at: [0.6, 1.4, EDGE + 1.0], people: 0, id: "torch" }]
    : [{ color: 0xfff2d8, intensity: 0, distance: 16, decay: 1.7, at: [0.2, 1.4, -10], people: 0, id: "torch" },
       { color: 0xb8d0ff, intensity: 6, distance: 40, decay: 1.2, at: [0, 18, -25], people: 2, id: "skyfill" }];

  const refs = {};
  let fogSet = false;
  function update(P, t, rig) {
    const skyK = Math.max(0, Math.min(1, P.sky || 0));
    sky.mat.uniforms.top.value.setRGB(0.012 + 0.05 * skyK, 0.024 + 0.07 * skyK, 0.05 + 0.12 * skyK);
    sky.mat.uniforms.bottom.value.setRGB(0.04 + 0.22 * skyK, 0.06 + 0.2 * skyK, 0.09 + 0.22 * skyK);
    for (const d of drops) d.d.position.y = d.y + Math.sin(t * 0.9 + d.ph) * 0.02;
    // the stems, leaning one after another as the wave comes through
    const wave = (P.rustle || 0) * 1.3 - 0.15;
    for (const s of rustlers) {
      const k = Math.exp(-Math.pow((wave - s.k) / 0.09, 2));
      s.b.rotation.set(s.base.x + 0.16 * k * Math.sin(t * 7 + s.k * 9), s.base.y, s.base.z + 0.22 * k);
    }
    // the vehicle backing away toward town
    if (suv) {
      const v = Math.max(0, Math.min(1, P.vehicle || 0));
      suv.holder.position.z = -9.5 + v * v * 40;
      suv.yaw = (P.leaving || 0) > 0.5 ? 0 : Math.PI; // nose to the edge arriving, to town leaving
    }
    const night = 0.32 + 0.4 * skyK;
    if (rig) {
      if (rig.scene && !fogSet) {
        rig.scene.fog = new THREE.FogExp2(0x0a121a, variant === "south" ? 0.018 : 0.014);
        fogSet = true;
        // the extra lights by where they stand: the room's copy, and the people's (at half)
        for (const [sc, k] of [[rig.scene, 1], [rig.peopleScene, 0.5]]) {
          if (!sc) continue;
          sc.traverse((n) => { if (n.isPointLight) for (const L of extraLights) if (n.position.x === L.at[0] && n.position.y === L.at[1] && n.position.z === L.at[2]) (refs[L.id] = refs[L.id] || []).push([n, k]); });
        }
      }
      if (rig.scene && rig.scene.fog) rig.scene.fog.color.setRGB(0.04 + 0.2 * skyK, 0.06 + 0.19 * skyK, 0.09 + 0.2 * skyK);
      for (const [k, L] of [["room", rig.room], ["people", rig.people]]) {
        if (!L) continue;
        L.hemi.intensity = L.base.hemi * night * (k === "people" ? 0.9 : 0.55);
        L.key.intensity = L.base.key * night * (k === "people" ? 0.7 : 0.4);
        L.hemi.color.setRGB(0.75, 0.85, 1);
      }
      for (const [l, k] of refs.head || []) l.intensity = (P.headlights || 0) * 70 * k;
      for (const [l, k] of refs.torch || []) {
        l.intensity = (P.torch || 0) * 26 * k;
        if (P.torchZ !== undefined) l.position.z = P.torchZ; // the hand light goes where Jack does
      }
    }
    const cam = rig && rig.camera;
    if (cam) for (const c of cards) drawCard(c, cam.position, night * 1.6);
  }

  return { group, anchors: {}, lamps: {}, screens: {}, lights: {}, keyboards: [], room: { xl: -60, xr: 60, zb: -100, zs: 30, ceiling: 40 }, extraLights, update, far: 900 };
}
