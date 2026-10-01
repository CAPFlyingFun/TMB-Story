// Prepares a Meshy creature GLB for the Watch mode: the four strongest bone influences per
// vertex (three.js skins with four), a texture-aware simplify, the base colour at 1024 px
// JPEG, the metallic-roughness map dropped, and meshopt compression.
//
//   node prepare-model.mjs <in.glb> <out.glb> <ratio> <error>      (UVW=80)
//   black widow:    UVW=80 ratio 0.15, error 0.05 -> ~42k triangles, 1.1 MB
//
// Meshy's unwrap puts nearly every vertex on a UV seam, so a seam-respecting simplify stops
// at about 55%; a plain permissive one crosses the seams and smears the fur. The UVs as a
// heavily weighted attribute (UVW) let it cross a seam only where the texture agrees.
// Needs @gltf-transform/core, extensions, functions, meshoptimizer and sharp: run it from
// any checkout that has them (TRADDOMIUM's tooling does).
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, simplify, textureCompress, meshopt, dedup } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder } from 'meshoptimizer';
import sharp from 'sharp';
const [src, dst, ratio, err] = process.argv.slice(2);
await MeshoptSimplifier.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(src);
const r = doc.getRoot();
for (const m of r.listMaterials()) { const t = m.getMetallicRoughnessTexture(); m.setMetallicRoughnessTexture(null); if (t) t.dispose(); m.setMetallicFactor(0); m.setRoughnessFactor(0.6); }
// three.js skins with four influences: keep each vertex's four strongest, renormalised
for (const p of r.listMeshes()[0].listPrimitives()) {
  const sets = [0, 1, 2].map((i) => [p.getAttribute('JOINTS_' + i), p.getAttribute('WEIGHTS_' + i)]).filter(([j]) => j);
  const n = p.getAttribute('POSITION').getCount();
  const J = new Uint16Array(n * 4), W = new Float32Array(n * 4);
  const a = [0, 0, 0, 0], b = [0, 0, 0, 0];
  for (let v = 0; v < n; v++) {
    const all = [];
    for (const [ja, wa] of sets) { ja.getElement(v, a); wa.getElement(v, b); for (let k = 0; k < 4; k++) if (b[k] > 0) all.push([a[k], b[k]]); }
    all.sort((x, y) => y[1] - x[1]);
    const top = all.slice(0, 4), s = top.reduce((q, t) => q + t[1], 0) || 1;
    for (let k = 0; k < 4; k++) { J[v * 4 + k] = top[k] ? top[k][0] : 0; W[v * 4 + k] = top[k] ? top[k][1] / s : 0; }
  }
  for (const i of [1, 2]) { for (const s of ['JOINTS_', 'WEIGHTS_']) { const at = p.getAttribute(s + i); if (at) { p.setAttribute(s + i, null); at.dispose(); } } }
  p.getAttribute('JOINTS_0').setArray(J);
  p.getAttribute('WEIGHTS_0').setArray(W);
}
// Meshy's unwrap splits nearly every vertex on a UV seam, so a seam-respecting simplify
// stops at ~70%. Permissive lets collapses cross the seams; each kept vertex keeps its own UV.
async function permissive(doc) {
  for (const p of r.listMeshes()[0].listPrimitives()) {
    const pos = p.getAttribute('POSITION').getArray();
    const idx = new Uint32Array(p.getIndices().getArray());
    const target = Math.floor(idx.length * Number(ratio) / 3) * 3;
    const uv = p.getAttribute('TEXCOORD_0').getArray(), nrm = p.getAttribute('NORMAL').getArray();
    const nv = pos.length / 3, att = new Float32Array(nv * 5);
    for (let v = 0; v < nv; v++) { att[v * 5] = uv[v * 2]; att[v * 5 + 1] = uv[v * 2 + 1]; att[v * 5 + 2] = nrm[v * 3]; att[v * 5 + 3] = nrm[v * 3 + 1]; att[v * 5 + 4] = nrm[v * 3 + 2]; }
    const UVW = Number(process.env.UVW || 1), NW = Number(process.env.NW || 0.2);
    const flags = (process.env.FLAGS || 'Permissive').split(',').filter(Boolean);
    const [out, e] = MeshoptSimplifier.simplifyWithAttributes(idx, pos, 3, att, 5, [UVW, UVW, NW, NW, NW], null, target, Number(err), flags);
    console.log('simplified', idx.length / 3, '->', out.length / 3, 'error', e);
    // compact: only the vertices still used
    const remap = new Int32Array(pos.length / 3).fill(-1); let n = 0;
    for (const i of out) if (remap[i] < 0) remap[i] = n++;
    for (const sem of p.listSemantics()) {
      const a = p.getAttribute(sem), src = a.getArray(), k = a.getElementSize();
      const dst = new src.constructor(n * k);
      for (let v = 0; v < remap.length; v++) if (remap[v] >= 0) for (let c = 0; c < k; c++) dst[remap[v] * k + c] = src[v * k + c];
      a.setArray(dst);
    }
    p.getIndices().setArray(Uint32Array.from(out, (i) => remap[i]));
  }
}
await doc.transform(dedup(), weld());
await permissive(doc);
await doc.transform(
  dedup(), weld(),
  textureCompress({ encoder: sharp, targetFormat: 'jpeg', resize: [1024, 1024], quality: 82 }),
  meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
);
await io.write(dst, doc);
const p = r.listMeshes()[0].listPrimitives()[0];
console.log('verts', p.getAttribute('POSITION').getCount(), 'tris', p.getIndices().getCount() / 3, p.listSemantics().join(','), 'skins', r.listSkins().length);
