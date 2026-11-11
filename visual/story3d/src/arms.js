// THE ARMS (Joshua, 2026-11-10: "Still weird hand positions… and clipping into the body"). Every
// hand is placed, every frame, by this file: on what it holds, or at rest where a person's hand
// rests -- hanging beside the thigh standing, swinging walking, on the thigh by the knee seated,
// the arms folded asleep. Nothing is left to the base animation's arms, whose hands hung palm
// forward, fingers spread, and reached through the body.
//
// HOW AN ARM IS SOLVED. The upper arm and the forearm are placed exactly as TRADDOMIUM's reach
// places them (humanReach rules 6-10: a hinge elbow hanging down and a little out, the hinge axis
// the bind's bone x forward, half of the palm's roll taken along the forearm), and the turns are
// written in the rig's own frame (HumanRig: a bone's world rotation is A . B, its turn A carried
// from the bind B). What is different is the HAND. The reach held every hand level, tipped 10
// degrees, so a standing hand reaching down to a desk, or up to a seated man's shoulder, bent back
// 80 to 125 degrees at the wrist (measured on the pose sheet, 2026-11-10). Here a hand continues
// its forearm, turned toward level only by `keep` of the way and never bent more than MAX_BEND, and
// the wrist is placed a hand's length back along that direction, so the fingertip still lands.
//
// A pure function of the pose and the targets: nothing carried from frame to frame, so a seek
// lands where playing would.
import * as THREE from 'three';

const DEG = Math.PI / 180;
/** BIOLOGICAL SHAPE: the most a wrist bends from its forearm here (a real wrist extends ~70, flexes ~80; 40 reads relaxed). */
export const MAX_BEND = 40 * DEG;
/** The reach's own numbers (humanReach): the hand's tip below level, the elbow's outward lean, the pole's fallback, the longest arm, the forearm's share of the palm's roll. */
const TIP = 10 * DEG, POLE_OUT = 0.6, POLE_MIN = 0.3, REACH = 0.995, FOREARM_ROLL = 0.5;
const UP = new THREE.Vector3(0, 1, 0);

/** The rotation that takes a to b and n to m (a perpendicular to n, b to m; all unit). */
function frames(a, n, b, m, out) {
  const c = new THREE.Vector3().crossVectors(a, n), d = new THREE.Vector3().crossVectors(b, m);
  const M0 = new THREE.Matrix4().makeBasis(a, n, c), M1 = new THREE.Matrix4().makeBasis(b, m, d);
  return out.setFromRotationMatrix(M1.multiply(M0.transpose())).normalize();
}
/** u turned toward v by k of the angle between them (both unit). */
function toward(u, v, k) {
  const c = Math.max(-1, Math.min(1, u.dot(v))), ang = Math.acos(c);
  if (ang < 1e-5) return u.clone();
  const axis = new THREE.Vector3().crossVectors(u, v);
  if (axis.lengthSq() < 1e-12) axis.set(0, 1, 0).cross(u);
  return u.clone().applyAxisAngle(axis.normalize(), ang * k).normalize();
}

export class Arms {
  /** b: a stage body ({ model, bones, measure, rig }). */
  constructor(b) {
    this.b = b;
    const { rig, measure, bones } = b, J = measure.joints, bind = rig.bind;
    const P = (i) => new THREE.Vector3(bind[i].x, bind[i].y, bind[i].z);
    const kids = (i) => bones[i].children.filter((c) => c.isBone).map((c) => bones.indexOf(c)).filter((k) => k >= 0);
    this.root = bind.findIndex((j) => j.parent < 0);
    this.side = {};
    for (const s of ['L', 'R']) {
      const sh = J['shoulder' + s], el = J['elbow' + s], wr = J['wrist' + s], clav = bind[sh].parent;
      // the hand bone carries the five fingers; each finger is a chain of joints
      let hand = wr; for (const k of kids(wr)) if (kids(k).length >= 4) hand = k;
      const chains = kids(hand).map((c) => { const ch = [c]; for (let x = c, k = kids(x); k.length; x = k[0], k = kids(x)) ch.push(k[0]); return ch; });
      // the fingertip: the wrist's descendant furthest from it in the bind (humanReach's rule)
      let tip = wr, far = 0;
      bones[wr].traverse((o) => { const i = bones.indexOf(o); if (i >= 0) { const d = P(i).distanceTo(P(wr)); if (d > far) { far = d; tip = i; } } });
      // the thumb stands furthest forward of the hand in the T (palms down), the index next to it
      const ahead = (ch) => P(ch[0]).z - P(hand).z;
      const order = chains.slice().sort((x, y) => ahead(y) - ahead(x));
      // the hand's own axis, wrist to the four fingers' knuckles: what a curl does not move
      const knuckles = order.slice(1).reduce((v, ch) => v.add(P(ch[0])), new THREE.Vector3()).divideScalar(Math.max(1, order.length - 1));
      const kb = knuckles.sub(P(wr)).normalize();
      const ub = P(el).sub(P(sh)).normalize(), fb = P(wr).sub(P(el)).normalize();
      // the hinge: the bind's bone x forward (0, 0, 1), as humanReach's hingeOf
      const uh = new THREE.Vector3(ub.y, -ub.x, 0).normalize(), fh = new THREE.Vector3(fb.y, -fb.x, 0).normalize();
      this.side[s] = { s, sh, el, wr, clav, hand, chains, thumb: order[0], index: order[1], tip, kb, ub, uh, fb, fh, curlSign: s === 'L' ? -1 : 1, last: null };
    }
    const L = measure.leftSign < 0 ? -1 : 1;
    this.leftSign = L;
  }

  /** The armature's world rotation, so a bind direction can be read in the world. */
  base() {
    const r = this.root, bone = this.b.bones[r];
    const q = bone.parent ? bone.parent.getWorldQuaternion(new THREE.Quaternion()) : new THREE.Quaternion();
    return q.multiply(this.b.rig.pre[r]).normalize();
  }

  /**
   * The finger turns for one hand (bind-frame turns, [joint, [x,y,z,w]]), curled by `c`:
   * { f: every finger, i: the index (if it differs), t: the thumb }, degrees per joint.
   */
  curlTurns(s, c) {
    const A = this.side[s], out = [];
    for (const ch of A.chains) {
      const thumb = ch === A.thumb, index = ch === A.index;
      const deg = thumb ? c.t : index && c.i !== undefined ? c.i : c.f;
      if (!deg) continue;
      const a = deg * DEG, h = Math.sin(a / 2), w = Math.cos(a / 2);
      // fingers curl toward the palm (-y in the T) about the bind's forward axis; the thumb folds
      // down across it about the axis the hand runs along
      const q = thumb ? [h, 0, 0, w] : [0, 0, A.curlSign * h, w];
      for (let k = 0; k < ch.length - 1; k++) out.push([ch[k], q]);
    }
    return out;
  }

  /**
   * Put one hand's fingertip at T (world metres), its palm facing `palm` (world). Options:
   *   keep    how much the hand follows its forearm (1 straight on, 0 along `axis`)
   *   axis    the way the hand would lie by itself (world); default its horizontal approach,
   *           tipped down by `tip` degrees (default 10, the reach's)
   *   pole, poleFwd, poleUp   the elbow leaning out / forward / up more than the reach's
   * Call after the body's pose is applied and its matrices updated. The hand's own axis (wrist to
   * knuckles) is what is aimed; the fingertip, curled as the fingers stand, is carried with it, and
   * the wrist placed so that tip lands on T. Returns { share, bend, err } (err: tip from T, metres).
   */
  solve(s, T, palm, o = {}) {
    const keep = o.keep ?? 0.5, tipDeg = o.tip ?? 10, poleOut = o.pole || 0, poleFwd = o.poleFwd || 0, poleUp = o.poleUp || 0;
    const b = this.b, bones = b.bones, A = this.side[s], rig = b.rig;
    const S = bones[A.sh].getWorldPosition(new THREE.Vector3()), E0 = bones[A.el].getWorldPosition(new THREE.Vector3());
    const W0 = bones[A.wr].getWorldPosition(new THREE.Vector3()), tip0 = bones[A.tip].getWorldPosition(new THREE.Vector3());
    const l1 = S.distanceTo(E0), l2 = E0.distanceTo(W0);
    const yaw = b.model.rotation.y, f = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    const left = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw)).multiplyScalar(this.leftSign);
    const out = s === 'L' ? left : left.clone().negate();
    const base = this.base(), bw = (v) => v.clone().applyQuaternion(base), B = (j) => rig.bindWorld[j];

    // the approach: horizontal, shoulder to target (straight ahead when the target is overhead)
    const ap = new THREE.Vector3(T.x - S.x, 0, T.z - S.z);
    if (ap.length() < 0.05) ap.addScaledVector(f, 0.05 - ap.length());
    ap.normalize();
    const tipA = tipDeg * DEG;
    const lie = o.axis ? o.axis.clone().normalize() : ap.clone().multiplyScalar(Math.cos(tipA)).addScaledVector(UP, -Math.sin(tipA)).normalize();

    // the hand in the bind: its axis (to the knuckles), its palm, and its tip as the fingers stand now
    const Wcur = bones[A.wr].getWorldQuaternion(new THREE.Quaternion());
    const Acur = Wcur.clone().multiply(base.clone().multiply(B(A.wr)).invert());
    const tb = tip0.clone().sub(W0).applyQuaternion(Acur.clone().invert());
    const a0 = bw(A.kb).normalize();
    const n0 = bw(new THREE.Vector3(0, -1, 0)); n0.addScaledVector(a0, -n0.dot(a0)).normalize();
    // the hand's rotation for an axis h: its palm on `palm` (a palm along the hand falls back,
    // continuously, on one facing back along the approach)
    const handQ = (h) => {
      const n1 = palm.clone(); const pn = n1.length() || 1; n1.addScaledVector(h, -n1.dot(h));
      if (n1.length() / pn < POLE_MIN) { const t = ap.clone().negate(); t.addScaledVector(h, -t.dot(h)).normalize(); n1.addScaledVector(t, (POLE_MIN - n1.length() / pn) * pn); }
      n1.normalize();
      return { q: frames(a0, n0, h, n1, new THREE.Quaternion()), n1 };
    };

    const two = (Wt) => {
      const dir = Wt.clone().sub(S); let d = dir.length(); if (d > 1e-9) dir.divideScalar(d); else { dir.copy(f); d = 0; }
      const reach = Math.max(Math.abs(l1 - l2) + 1e-6, Math.min(d, REACH * (l1 + l2)));
      const pole = out.clone().multiplyScalar(POLE_OUT + poleOut).addScaledVector(f, poleFwd).addScaledVector(UP, poleUp - 1).normalize();
      pole.addScaledVector(dir, -pole.dot(dir));
      const pl = pole.length();
      if (pl < POLE_MIN) {
        const back = f.clone().negate(); back.addScaledVector(dir, -back.dot(dir)).normalize();
        pole.addScaledVector(back, POLE_MIN - pl);
      }
      pole.normalize();
      const cosA = Math.max(-1, Math.min(1, (l1 * l1 + reach * reach - l2 * l2) / (2 * l1 * reach))), sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
      const un = dir.clone().multiplyScalar(cosA).addScaledVector(pole, sinA).normalize();
      const E = S.clone().addScaledVector(un, l1), Wp = S.clone().addScaledVector(dir, reach);
      const fn = Wp.clone().sub(E).normalize(), hn = new THREE.Vector3().crossVectors(pole, dir).normalize();
      return { dir, reach, un, E, Wp, fn, hn, d };
    };
    // the hand's axis: from how it would lie, toward the forearm by `keep`, never bent past
    // MAX_BEND; the wrist placed so the tip, carried with the hand, lands on T
    let h = lie, H = handQ(h), sol = two(T.clone().sub(tb.clone().applyQuaternion(H.q)));
    for (let it = 0; it < 8; it++) {
      let hk = toward(sol.fn, lie, 1 - keep);
      const bend = Math.acos(Math.max(-1, Math.min(1, hk.dot(sol.fn))));
      if (bend > MAX_BEND) hk = toward(sol.fn, hk, MAX_BEND / bend);
      h = hk; H = handQ(h); sol = two(T.clone().sub(tb.clone().applyQuaternion(H.q)));
    }
    // and, where so near a reach would not settle, the wrist held to MAX_BEND all the same: a
    // fingertip a little short reads; a wrist bent back does not
    {
      const bend = Math.acos(Math.max(-1, Math.min(1, h.dot(sol.fn))));
      if (bend > MAX_BEND) { h = toward(sol.fn, h, MAX_BEND / bend); H = handQ(h); }
    }
    const { un, fn, hn } = sol;

    // the frames: bind directions read in the world, to where they are now
    const Qs = frames(bw(A.ub), bw(A.uh), un, hn, new THREE.Quaternion());
    const Qe = frames(bw(A.fb), bw(A.fh), fn, hn, new THREE.Quaternion());
    const Qw = H.q;
    // pronation: FOREARM_ROLL of the hand's roll about the forearm goes on the elbow
    const delta = Qw.clone().multiply(Qe.clone().invert());
    if (delta.w < 0) delta.set(-delta.x, -delta.y, -delta.z, -delta.w);
    const phi = 2 * Math.atan2(delta.x * fn.x + delta.y * fn.y + delta.z * fn.z, delta.w);
    Qe.premultiply(new THREE.Quaternion().setFromAxisAngle(fn, phi * FOREARM_ROLL));

    // the world rotations, written as each bone's local one under its parent as it now stands
    const Ws = Qs.clone().multiply(base).multiply(B(A.sh));
    const We = Qe.clone().multiply(base).multiply(B(A.el));
    const Ww = Qw.clone().multiply(base).multiply(B(A.wr));
    const parentQ = (j) => bones[j].parent.getWorldQuaternion(new THREE.Quaternion());
    bones[A.sh].quaternion.copy(parentQ(A.sh).invert().multiply(Ws)); bones[A.sh].updateMatrixWorld(true);
    bones[A.el].quaternion.copy(parentQ(A.el).invert().multiply(We)); bones[A.el].updateMatrixWorld(true);
    bones[A.wr].quaternion.copy(parentQ(A.wr).invert().multiply(Ww)); bones[A.wr].updateMatrixWorld(true);
    const tip = bones[A.tip].getWorldPosition(new THREE.Vector3());
    const res = { share: sol.d / (l1 + l2), bend: Math.round(Math.acos(Math.max(-1, Math.min(1, fn.dot(h)))) / DEG), err: tip.distanceTo(T), holding: true };
    A.last = { tip, wrist: sol.Wp.clone(), dir: h.clone(), palm: H.n1.clone(), ...res };
    return res;
  }
}
