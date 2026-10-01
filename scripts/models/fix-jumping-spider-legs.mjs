// The Meshy jumping spider (Joshua's release "Jumping Spider Model + Image", TRADDOMIUM,
// 2026-10-01) came with five legs a side, and only eight of the ten had their own bones: the
// hind leg hugging the abdomen on the right had none (skinned to the abdomen), and the two
// front-left legs shared one leg's bones. This hides the extra hind pair (bone 058's leg and
// its unrigged twin) and gives the left second leg bones of its own, mirrored from the right
// second leg's (bone 037's chain, as Bone_0NN_L). Run it on Meshy's file before
// prepare-model.mjs:   node fix-jumping-spider-legs.mjs <meshy.glb> <fixed.glb>
// The Meshy jumping spider: hide the extra hind pair (bone 058's leg and its unrigged twin
// on the abdomen) and give the left second leg its own bones, mirrored from the right one.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
// column-major 4x4, as glTF stores them
const mat4 = {
  create: () => [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1],
  fromScaling: (o, v) => [v[0],0,0,0, 0,v[1],0,0, 0,0,v[2],0, 0,0,0,1],
  multiply: (o, a, b) => { const r = new Array(16); for (let c = 0; c < 4; c++) for (let row = 0; row < 4; row++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + row] * b[c * 4 + k]; r[c * 4 + row] = s; } return r; },
  invert: (o, m) => { const a = [...m], inv = mat4.create(); // Gauss-Jordan on rows of the row-major view
    const A = [0,1,2,3].map(r => [0,1,2,3].map(c => a[c * 4 + r])), I = [0,1,2,3].map(r => [0,1,2,3].map(c => (r === c ? 1 : 0)));
    for (let c = 0; c < 4; c++) { let p = c; for (let r = c + 1; r < 4; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r; [A[c], A[p]] = [A[p], A[c]]; [I[c], I[p]] = [I[p], I[c]];
      const d = A[c][c]; for (let k = 0; k < 4; k++) { A[c][k] /= d; I[c][k] /= d; }
      for (let r = 0; r < 4; r++) if (r !== c) { const f = A[r][c]; for (let k = 0; k < 4; k++) { A[r][k] -= f * A[c][k]; I[r][k] -= f * I[c][k]; } } }
    const out = new Array(16); for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) out[c * 4 + r] = I[r][c]; return out; },
};
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(process.argv[2]);
const r = doc.getRoot(); const skin = r.listSkins()[0]; let J = skin.listJoints();
const nameOf = J.map(j => j.getName());
const chain = (root) => { const s = new Set([root]); let g = true; while (g) { g = false; for (const j of J) { const pn = j.getParentNode()?.getName(); if (s.has(pn) && !s.has(j.getName())) { s.add(j.getName()); g = true; } } } return s; };
const p = r.listMeshes()[0].listPrimitives()[0];
const pos = p.getAttribute('POSITION'), n = pos.getCount();
const sets = [0, 1, 2].map(i => [p.getAttribute('JOINTS_' + i), p.getAttribute('WEIGHTS_' + i)]).filter(([j]) => j);
// every vertex's influences, flattened (any number of sets)
const inf = []; const a = [0, 0, 0, 0], b = [0, 0, 0, 0];
const dom = new Int32Array(n);
for (let i = 0; i < n; i++) { const L = []; for (const [ja, wa] of sets) { ja.getElement(i, a); wa.getElement(i, b); for (let k = 0; k < 4; k++) if (b[k] > 0) L.push([a[k], b[k]]); } L.sort((x, y) => y[1] - x[1]); inf.push(L); dom[i] = L[0][0]; }
const P = new Float32Array(n * 3); { const v = [0, 0, 0]; for (let i = 0; i < n; i++) { pos.getElement(i, v); P.set(v, i * 3); } }
const inChain = (root) => { const s = chain(root); return (i) => s.has(nameOf[dom[i]]); };
const isBlue = inChain('Bone_058'), isGrey = inChain('Bone_016'), isRedL = inChain('Bone_044'), isOrange = inChain('Bone_037'), isRedR = inChain('Bone_051');
// a spatial hash for nearest-vertex queries
function grid(filter) { const g = new Map(), h = 0.04; for (let i = 0; i < n; i++) if (filter(i)) { const k = [0, 1, 2].map(c => Math.floor(P[i * 3 + c] / h)).join(); (g.get(k) || g.set(k, []).get(k)).push(i); } return { g, h }; }
function nearest({ g, h }, x, y, z, R = 2) { let best = -1, bd = 1e9; const c = [x, y, z].map(v => Math.floor(v / h)); for (let dx = -R; dx <= R; dx++) for (let dy = -R; dy <= R; dy++) for (let dz = -R; dz <= R; dz++) { const L = g.get([c[0] + dx, c[1] + dy, c[2] + dz].join()); if (!L) continue; for (const i of L) { const d = (P[i * 3] - x) ** 2 + (P[i * 3 + 1] - y) ** 2 + (P[i * 3 + 2] - z) ** 2; if (d < bd) { bd = d; best = i; } } } return [best, Math.sqrt(bd)]; }
// 1. the hind pair: blue is bone 058's leg; its twin is whatever on the abdomen's bones mirrors it
const gBlue = grid(isBlue);
const drop = new Uint8Array(n);
let nb = 0, ng = 0;
for (let i = 0; i < n; i++) {
  if (isBlue(i)) { drop[i] = 1; nb++; continue; }
  if (isGrey(i) && P[i * 3] > 0.05) { const [, d] = nearest(gBlue, -P[i * 3], P[i * 3 + 1], P[i * 3 + 2]); if (d < 0.09) { drop[i] = 1; ng++; } }
}
// 2. the left second leg: on the left front leg's bones, but the mirror of the right second leg
const gOr = grid(isOrange), gRR = grid(isRedR);
const second = new Int32Array(n); let ns = 0;
for (let i = 0; i < n; i++) if (isRedL(i) && P[i * 3] < 0) {
  const [io_, dO] = nearest(gOr, -P[i * 3], P[i * 3 + 1], P[i * 3 + 2]); const [, dR] = nearest(gRR, -P[i * 3], P[i * 3 + 1], P[i * 3 + 2]);
  if (dO < dR) { second[i] = io_ + 1; ns++; }
}
console.log('dropped blue', nb, 'twin', ng, 'left second leg', ns);
// new bones: bone 037's chain mirrored across x = 0 (W' = M W M is still a rotation)
const M = mat4.fromScaling(mat4.create(), [-1, 1, 1]);
const orange = [...chain('Bone_037')];
const ibm = skin.getInverseBindMatrices(); const ibmArr = Array.from(ibm.getArray());
const world = (node) => node.getWorldMatrix();
const map = new Map();
for (const nm of orange) {
  const src = J.find(j => j.getName() === nm);
  const Wm = mat4.multiply(mat4.create(), mat4.multiply(mat4.create(), M, world(src)), M);
  const parentSrc = src.getParentNode(); const parentNew = map.get(parentSrc.getName()) || parentSrc; // root's parent is shared (Bone_001)
  const node = doc.createNode(nm + '_L'); parentNew.addChild(node);
  const PW = parentNew.getWorldMatrix(); const local = mat4.multiply(mat4.create(), mat4.invert(mat4.create(), PW), Wm);
  node.setMatrix(local);
  map.set(nm, node);
  skin.addJoint(node);
  const inv = mat4.invert(mat4.create(), Wm); ibmArr.push(...inv);
}
ibm.setArray(new Float32Array(ibmArr));
J = skin.listJoints(); const idxOf = new Map(J.map((j, k) => [j, k]));
const remap = new Map(orange.map(nm => [nameOf.indexOf(nm), idxOf.get(map.get(nm))]));
for (let i = 0; i < n; i++) if (second[i]) inf[i] = inf[second[i] - 1].map(([j, w]) => [remap.has(j) ? remap.get(j) : j, w]);
// four influences per vertex, renormalised
const JA = new Uint16Array(n * 4), WA = new Float32Array(n * 4);
for (let i = 0; i < n; i++) { const t = inf[i].slice(0, 4), s = t.reduce((q, x) => q + x[1], 0) || 1; for (let k = 0; k < 4; k++) { JA[i * 4 + k] = t[k] ? t[k][0] : 0; WA[i * 4 + k] = t[k] ? t[k][1] / s : 0; } }
for (const i of [1, 2]) for (const s of ['JOINTS_', 'WEIGHTS_']) { const at = p.getAttribute(s + i); if (at) { p.setAttribute(s + i, null); at.dispose(); } }
p.getAttribute('JOINTS_0').setArray(JA); p.getAttribute('WEIGHTS_0').setArray(WA);
// the triangles of the hidden pair go
const ind = p.getIndices().getArray(); const keep = [];
for (let t = 0; t < ind.length; t += 3) if (!(drop[ind[t]] || drop[ind[t + 1]] || drop[ind[t + 2]])) keep.push(ind[t], ind[t + 1], ind[t + 2]);
p.getIndices().setArray(new Uint32Array(keep));
console.log('triangles', ind.length / 3, '->', keep.length / 3, 'joints', J.length);
await io.write(process.argv[3], doc);
