// posekit: the pose sheet's and the hands scan's helpers inside visual/story3d/probe.html
// (window.posekit; scripts/story3d/pose-sheet.py and hands-scan.py load it into the page)
//  solo(id)        only that person drawn (the other is still posed, so a hand on him stays right)
//  isolate(on)     the room hidden except the chairs and the tablet; a plain grey studio, lit
//  views(id)       cameras around that person: front, back, left, right, hand close-ups
//  measure()       how far each person's forearms and hands sink into a body (their own, or the
//                  other person's), and how twisted each arm's joints are against the bind
(() => {
  const view = window.story3d.view, st = view.debug.stage;
  const V3 = st.camera.position.constructor, Q4 = st.camera.quaternion.constructor, M4 = st.camera.matrixWorld.constructor;
  const K = (window.posekit = { solo: null });

  // ---- solo
  const pose0 = st.pose.bind(st);
  st.pose = function (id, a, ...r) { pose0(id, a, ...r); if (K.solo && id !== K.solo && st.bodies[id]) st.bodies[id].model.visible = false; };

  // ---- isolate
  const keep = new Set([...st.chairs.values(), st.tablet].filter(Boolean));
  const under = (o) => { for (let p = o; p; p = p.parent) if (keep.has(p)) return true; return false; };
  const saved = new Map();
  let studio = null;
  K.isolate = (on, id) => {
    st.building.group.traverse((o) => { if (!o.isMesh) return; if (!saved.has(o)) saved.set(o, o.visible); o.visible = on ? under(o) : saved.get(o); });
    if (on && !studio) {
      let dl = null; st.scene.traverse((o) => { if (!dl && o.isDirectionalLight) dl = o; });
      studio = [dl.clone(), dl.clone(), st.overheadFill.clone()];
      studio[0].color.setHex(0xffffff); studio[1].color.setHex(0xdfe8ff);
      studio[0].intensity = 2.4; studio[1].intensity = 1.0; studio[2].intensity = 0.9;
      st.scene.add(studio[0], studio[1], studio[2]);
      K.bg = st.scene.background.clone();
    }
    if (studio) studio.forEach((l) => (l.visible = on));
    if (on) st.scene.background.setHex(0x5b6470); else if (K.bg) st.scene.background.copy(K.bg);
    st.scene.fog.near = on ? 1e5 : 30; st.scene.fog.far = on ? 2e5 : 140;
    if (on && id) {
      const b = st.bodies[id], y = b.model.rotation.y, p = b.model.position;
      const f = [Math.sin(y), Math.cos(y)], l = [Math.cos(y), -Math.sin(y)];
      studio[0].target = b.model; studio[1].target = b.model;
      studio[0].position.set(p.x + f[0] * 2 + l[0] * 1.2, 3.2, p.z + f[1] * 2 + l[1] * 1.2);
      studio[1].position.set(p.x - f[0] * 1.5 - l[0] * 1.5, 2.2, p.z - f[1] * 1.5 - l[1] * 1.5);
    }
  };

  // ---- cameras around one person
  const P = (id, n) => { const v = st.bonePoint(id, n); return [v.x, v.y, v.z]; };
  const add = (a, b, k = 1) => a.map((v, i) => v + b[i] * k);
  const neg = (a) => a.map((v) => -v);
  const nrm = (a) => { const n = Math.hypot(...a) || 1; return a.map((v) => v / n); };
  K.handPoint = (id, s) => { const w = P(id, 'wrist' + s), e = P(id, 'elbow' + s); return add(w, add(w, e, -1), 0.45); };
  K.views = (id) => {
    const b = st.bodies[id], y = b.model.rotation.y, f = [Math.sin(y), 0, Math.cos(y)], l = [Math.cos(y), 0, -Math.sin(y)], up = [0, 1, 0];
    const head = P(id, 'head'), hl = P(id, 'hipL'), hr = P(id, 'hipR');
    const foot = Math.min(P(id, 'ankleL')[1], P(id, 'ankleR')[1]) - 0.1, top = head[1] + 0.2;
    const c = [(hl[0] + hr[0]) / 2, (top + foot) / 2, (hl[2] + hr[2]) / 2];
    const vfov = 30, d = ((top - foot) / 2 * 1.08) / Math.tan(vfov / 2 * Math.PI / 180);
    const cam = (dir, dist, tgt, fov) => { const n = nrm(dir); return [...add(tgt, n, dist), ...tgt, fov]; };
    const hand = (s) => K.handPoint(id, s);
    return {
      front: cam(add(f, up, 0.12), d, c, vfov),
      left: cam(add(l, up, 0.12), d, c, vfov),
      back: cam(add(neg(f), up, 0.12), d, c, vfov),
      right: cam(add(neg(l), up, 0.12), d, c, vfov),
      handL: cam(add(add(f, l, 0.9), up, 0.7), 0.62, hand('L'), 42),
      handR: cam(add(add(f, neg(l), 0.9), up, 0.7), 0.62, hand('R'), 42),
    };
  };

  // ---- measuring
  const prep = {};
  function prepBody(id) {
    const b = st.bodies[id]; let mesh = null; b.model.traverse((o) => { if (!mesh && o.isSkinnedMesh) mesh = o; });
    const g = mesh.geometry, pos = g.attributes.position, nor = g.attributes.normal, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, n = pos.count;
    const bones = mesh.skeleton.bones, J = b.measure.joints, idx = new Map(bones.map((x, i) => [x, i]));
    const desc = (i) => { const s = new Set(); bones[i].traverse((o) => { if (idx.has(o)) s.add(idx.get(o)); }); return s; };
    const handL = desc(J.wristL), handR = desc(J.wristR), headS = desc(J.neck);
    const cls = new Int8Array(n), dom = new Int16Array(n);
    // 1 L forearm/hand, 2 R forearm/hand, 3 L upper arm, 4 R upper arm, 5 head, 0 body
    const SI = new Uint16Array(n * 4), SW = new Float32Array(n * 4), PB = new Float32Array(n * 3), NB = new Float32Array(n * 3);
    const bm = mesh.bindMatrix.elements;
    for (let i = 0; i < n; i++) {
      let best = 0, bw = -1;
      for (let k = 0; k < 4; k++) { const bi = si.getComponent(i, k), w = sw.getComponent(i, k); SI[i * 4 + k] = bi; SW[i * 4 + k] = w; if (w > bw) { bw = w; best = bi; } }
      dom[i] = best;
      cls[i] = best === J.elbowL || handL.has(best) ? 1 : best === J.elbowR || handR.has(best) ? 2 : best === J.shoulderL ? 3 : best === J.shoulderR ? 4 : headS.has(best) ? 5 : 0;
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      PB[i * 3] = bm[0] * x + bm[4] * y + bm[8] * z + bm[12]; PB[i * 3 + 1] = bm[1] * x + bm[5] * y + bm[9] * z + bm[13]; PB[i * 3 + 2] = bm[2] * x + bm[6] * y + bm[10] * z + bm[14];
      const a = nor.getX(i), c = nor.getY(i), e = nor.getZ(i);
      NB[i * 3] = bm[0] * a + bm[4] * c + bm[8] * e; NB[i * 3 + 1] = bm[1] * a + bm[5] * c + bm[9] * e; NB[i * 3 + 2] = bm[2] * a + bm[6] * c + bm[10] * e;
    }
    const pick = (want, every) => { const out = []; for (let i = 0; i < n; i++) if (want(cls[i]) && i % every === 0) out.push(i); return Uint32Array.from(out); };
    const jointName = {}; for (const [k, v] of Object.entries(J)) jointName[v] = k;
    // the parent bones a region name is read from (the nearest named joint up the chain)
    const region = (bi) => { for (let o = bones[bi]; o; o = o.parent) { const i = idx.get(o); if (i !== undefined && jointName[i]) return jointName[i]; } return bones[bi].name; };
    prep[id] = { b, mesh, n, cls, dom, SI, SW, PB, NB, arm: { L: pick((c) => c === 1, 2), R: pick((c) => c === 2, 2) }, body: pick(() => true, 3), region, J };
    return prep[id];
  }
  function skin(p, list) {
    const { mesh, SI, SW, PB, NB } = p; mesh.skeleton.update();
    const bmx = mesh.skeleton.boneMatrices, A = new M4().multiplyMatrices(mesh.matrixWorld, mesh.bindMatrixInverse).elements;
    const out = new Float32Array(list.length * 6);
    for (let q = 0; q < list.length; q++) {
      const i = list[q], px = PB[i * 3], py = PB[i * 3 + 1], pz = PB[i * 3 + 2], nx = NB[i * 3], ny = NB[i * 3 + 1], nz = NB[i * 3 + 2];
      let x = 0, y = 0, z = 0, a = 0, c = 0, e = 0;
      for (let k = 0; k < 4; k++) {
        const w = SW[i * 4 + k]; if (!w) continue; const o = SI[i * 4 + k] * 16, m = bmx;
        x += w * (m[o] * px + m[o + 4] * py + m[o + 8] * pz + m[o + 12]); y += w * (m[o + 1] * px + m[o + 5] * py + m[o + 9] * pz + m[o + 13]); z += w * (m[o + 2] * px + m[o + 6] * py + m[o + 10] * pz + m[o + 14]);
        a += w * (m[o] * nx + m[o + 4] * ny + m[o + 8] * nz); c += w * (m[o + 1] * nx + m[o + 5] * ny + m[o + 9] * nz); e += w * (m[o + 2] * nx + m[o + 6] * ny + m[o + 10] * nz);
      }
      const X = A[0] * x + A[4] * y + A[8] * z + A[12], Y = A[1] * x + A[5] * y + A[9] * z + A[13], Z = A[2] * x + A[6] * y + A[10] * z + A[14];
      let NX = A[0] * a + A[4] * c + A[8] * e, NY = A[1] * a + A[5] * c + A[9] * e, NZ = A[2] * a + A[6] * c + A[10] * e; const L = Math.hypot(NX, NY, NZ) || 1;
      out[q * 6] = X; out[q * 6 + 1] = Y; out[q * 6 + 2] = Z; out[q * 6 + 3] = NX / L; out[q * 6 + 4] = NY / L; out[q * 6 + 5] = NZ / L;
    }
    return out;
  }
  const CELL = 0.025;
  function grid(pts, n) {
    const m = new Map();
    for (let q = 0; q < n; q++) { const k = `${Math.floor(pts[q * 6] / CELL)},${Math.floor(pts[q * 6 + 1] / CELL)},${Math.floor(pts[q * 6 + 2] / CELL)}`; let a = m.get(k); if (!a) m.set(k, (a = [])); a.push(q); }
    return m;
  }
  // arm points of one hand against a body's points (skipping the classes in `skip`)
  function inside(armPts, nA, bodyPts, bodyList, bodyCls, G, skip, p) {
    let count = 0, deepest = 0, where = null;
    for (let q = 0; q < nA; q++) {
      const x = armPts[q * 6], y = armPts[q * 6 + 1], z = armPts[q * 6 + 2];
      const cx = Math.floor(x / CELL), cy = Math.floor(y / CELL), cz = Math.floor(z / CELL);
      let b1 = -1, d1 = 1e9, b2 = -1, d2 = 1e9;
      for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) {
        const a = G.get(`${cx + i},${cy + j},${cz + k}`); if (!a) continue;
        for (const r of a) {
          if (skip.has(bodyCls[bodyList[r]])) continue;
          const dx = x - bodyPts[r * 6], dy = y - bodyPts[r * 6 + 1], dz = z - bodyPts[r * 6 + 2], d = dx * dx + dy * dy + dz * dz;
          if (d < d1) { b2 = b1; d2 = d1; b1 = r; d1 = d; } else if (d < d2) { b2 = r; d2 = d; }
        }
      }
      if (b1 < 0 || b2 < 0) continue;
      const s = (r) => (x - bodyPts[r * 6]) * bodyPts[r * 6 + 3] + (y - bodyPts[r * 6 + 1]) * bodyPts[r * 6 + 4] + (z - bodyPts[r * 6 + 2]) * bodyPts[r * 6 + 5];
      const s1 = s(b1), s2 = s(b2);
      if (s1 < -0.006 && s2 < -0.003) { count++; if (-s1 > deepest) { deepest = -s1; where = p.region(p.dom[bodyList[b1]]); } }
    }
    return { n: count, cm: +(deepest * 100).toFixed(1), where };
  }
  // ---- joint twists against the bind: upper arm about its own length, forearm, wrist
  const bindWorldQ = (p, i) => { const q = new Q4(); new M4().copy(p.mesh.skeleton.boneInverses[i]).invert().decompose(new V3(), q, new V3()); return q.normalize(); };
  const bindWorldP = (p, i) => new V3().setFromMatrixPosition(new M4().copy(p.mesh.skeleton.boneInverses[i]).invert());
  function twist(p, parent, child, axisFrom, axisTo) {
    const bones = p.mesh.skeleton.bones;
    const qp = bones[parent].getWorldQuaternion(new Q4()), qc = bones[child].getWorldQuaternion(new Q4());
    const L = qp.clone().invert().multiply(qc), L0 = bindWorldQ(p, parent).invert().multiply(bindWorldQ(p, child));
    const R = L0.clone().invert().multiply(L);
    const ax = bindWorldP(p, axisTo).sub(bindWorldP(p, axisFrom)).normalize().applyQuaternion(bindWorldQ(p, child).invert());
    const dot = R.x * ax.x + R.y * ax.y + R.z * ax.z;
    const tw = new Q4(ax.x * dot, ax.y * dot, ax.z * dot, R.w).normalize();
    let tAng = 2 * Math.atan2(Math.hypot(tw.x, tw.y, tw.z) * Math.sign(dot || 1), tw.w) * 180 / Math.PI;
    if (tAng > 180) tAng -= 360; if (tAng < -180) tAng += 360;
    const sw = R.clone().multiply(tw.clone().invert());
    const sAng = 2 * Math.acos(Math.min(1, Math.abs(sw.w))) * 180 / Math.PI;
    return { twist: Math.round(tAng), swing: Math.round(sAng) };
  }
  K.measure = (ids = ['jack', 'sarah']) => {
    const res = {}, pts = {};
    for (const id of ids) {
      const p = prep[id] || prepBody(id);
      if (!p.b.model.visible && !(K.solo && K.solo !== id)) continue;
      const body = skin(p, p.body), L = skin(p, p.arm.L), R = skin(p, p.arm.R);
      pts[id] = { p, body, L, R, G: grid(body, p.body.length) };
    }
    for (const id of Object.keys(pts)) {
      const { p, L, R } = pts[id], J = p.J, out = (res[id] = {});
      for (const [s, A, own] of [['L', L, new Set([1, 3, 5])], ['R', R, new Set([2, 4, 5])]]) {
        const self = inside(A, A.length / 6, pts[id].body, p.body, p.cls, pts[id].G, own, p);
        const other = Object.keys(pts).find((k) => k !== id);
        const cross = other ? inside(A, A.length / 6, pts[other].body, pts[other].p.body, pts[other].p.cls, pts[other].G, new Set(), pts[other].p) : null;
        const sh = J['shoulder' + s], el = J['elbow' + s], wr = J['wrist' + s], clav = p.b.rig.bind[sh].parent;
        out[s] = {
          self, cross,
          upper: twist(p, clav, sh, sh, el), fore: twist(p, sh, el, el, wr), wrist: twist(p, el, wr, el, wr),
          hold: p.b.reached && p.b.reached[s] ? (p.b.reached[s].holding ? 'hold' : 'free') : 'free',
        };
      }
    }
    return res;
  };
})();
