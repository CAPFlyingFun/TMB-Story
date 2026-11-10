// THE CLOCK: everything on screen is a pure function of the audio time t.
//  - Continuous things (where someone is, which way they face, their pose, the camera) are
//    worked out from the timeline at t, never accumulated frame to frame.
//  - Discrete things (who sits in which chair, where the tablet is, doors, alarm) are
//    rebuilt from the events up to t. Seeking anywhere, in either direction, lands right.
const smooth = p => (p <= 0 ? 0 : p >= 1 ? 1 : p * p * (3 - 2 * p));
const lerp = (a, b, k) => a + (b - a) * k;
const wrap = a => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
const lerpAngle = (a, b, k) => a + wrap(b - a) * k;
export const yawTo = (dx, dz) => Math.atan2(dx, dz);

// A path: points [[x,z]...] and when it passes some of them: keys [[pointIndex, time]...].
function makeWalk(points, keys) {
  const cum = [0]; for (let i = 1; i < points.length; i++) cum.push(cum[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
  const K = keys.map(([i, t]) => [cum[i], t]);
  const dist = t => { if (t <= K[0][1]) return 0; for (let i = 1; i < K.length; i++) if (t <= K[i][1]) return lerp(K[i - 1][0], K[i][0], (t - K[i - 1][1]) / (K[i][1] - K[i - 1][1])); return cum[cum.length - 1]; };
  const at = d => { d = Math.max(0, Math.min(cum[cum.length - 1], d)); for (let i = 1; i < points.length; i++) if (d <= cum[i] || i === points.length - 1) { const k = (d - cum[i - 1]) / Math.max(1e-6, cum[i] - cum[i - 1]); return [lerp(points[i - 1][0], points[i][0], k), lerp(points[i - 1][1], points[i][1], k)]; } };
  return { points, cum, length: cum[cum.length - 1], t0: K[0][1], t1: K[K.length - 1][1], dist, at };
}

// Evaluate one actor's event list at time t. Events (sorted by t):
//  {t, place:{at,yaw,pose}}  {t, pose, at?, yaw?}  {t, face:yaw}  {t, move:{to,dur}}
//  {t, walk:{points, keys, endYaw}}  {t, look}  {t, hands}  {t, visible}
export function evalActor(events, t) {
  const S = { at: [0, 0], yaw: 0, yawFrom: 0, yawT: -1e9, turn: 0.5, pose: 'stand', prevPose: null, poseT: -1e9, blend: 0.55, prevAt: null, prevYaw: null,
    walked: 0, motion: null, look: null, hands: null, handsT: 0, visible: true, baseWalked: 0 };
  const posAt = (time) => {
    const m = S.motion; if (!m) return S.at;
    if (m.kind === 'move') return [lerp(m.from[0], m.to[0], smooth((time - m.t0) / m.dur)), lerp(m.from[1], m.to[1], smooth((time - m.t0) / m.dur))];
    return m.w.at(m.w.dist(time));
  };
  const yawAt = (time) => {
    const m = S.motion;
    if (m && m.kind === 'walk' && m.keepYaw) return lerpAngle(m.startYaw, m.endYaw ?? m.startYaw, smooth((time - m.w.t0) / Math.max(0.3, m.w.t1 - m.w.t0)));
    if (m && m.kind === 'walk' && time < m.w.t1) {
      const d = m.w.dist(time), p = m.w.at(d), q = m.w.at(d + 0.6);
      const head = (Math.hypot(q[0] - p[0], q[1] - p[1]) > 1e-3) ? yawTo(q[0] - p[0], q[1] - p[1]) : S.yaw;
      return lerpAngle(m.startYaw, head, smooth((time - m.w.t0) / 0.45));
    }
    if (m && m.kind === 'walk') { // arrived: turn to the end facing
      const last = m.w.at(m.w.length - 0.05), end = m.w.at(m.w.length);
      const head = yawTo(end[0] - last[0], end[1] - last[1]);
      return m.endYaw === undefined ? head : lerpAngle(head, m.endYaw, smooth((time - m.w.t1) / 0.5));
    }
    return lerpAngle(S.yawFrom, S.yaw, smooth((time - S.yawT) / S.turn));
  };
  const poseAt = (time) => {
    const m = S.motion;
    if (m && m.kind === 'walk') {
      if (time < m.w.t1) return { pose: 'walk', prevPose: m.prevPose, k: (time - m.w.t0) / 0.3, prevAt: m.w.points[0], prevYaw: m.startYaw };
      return { pose: 'stand', prevPose: 'walk', k: (time - m.w.t1) / 0.3 };
    }
    return { pose: S.pose, prevPose: S.prevPose, k: (time - S.poseT) / S.blend, prevAt: S.prevAt, prevYaw: S.prevYaw };
  };
  // settle the running motion into plain state at time te
  const settle = (te) => {
    const p = posAt(te), y = yawAt(te), ps = poseAt(te);
    if (S.motion && S.motion.kind === 'walk') { S.walked = S.baseWalked + S.motion.w.dist(te); S.baseWalked = S.walked; if (te >= S.motion.w.t1) { S.pose = 'stand'; S.prevPose = 'walk'; S.poseT = S.motion.w.t1; S.blend = 0.3; } else { S.pose = 'walk'; } }
    S.at = p; S.yawFrom = y; S.yaw = y; S.yawT = te; S.motion = null;
    return ps;
  };
  for (const e of events) {
    if (e.t > t) break;
    if (e.place) { S.motion = null; S.at = e.place.at; S.yaw = S.yawFrom = e.place.yaw; S.yawT = e.t; S.pose = e.place.pose; S.prevPose = null; S.poseT = e.t; }
    if (e.pose) { const cur = settle(e.t); S.prevPose = cur.pose; S.prevAt = S.at; S.prevYaw = S.yaw; S.pose = e.pose; S.poseT = e.t; S.blend = e.blend || 0.6; if (e.at) S.at = e.at; if (e.yaw !== undefined) { S.yawFrom = S.yaw; S.yaw = e.yaw; S.yawT = e.t; S.turn = e.blend || 0.6; } }
    if (e.face !== undefined) { const y = yawAt(e.t); if (S.motion && S.motion.kind === 'walk') settle(e.t); S.yawFrom = y; S.yaw = e.face; S.yawT = e.t; S.turn = e.turn || 0.5; }
    if (e.move) { const from = posAt(e.t); const y = yawAt(e.t); if (S.motion && S.motion.kind === 'walk') settle(e.t); S.yawFrom = y; S.yawT = e.t; S.motion = { kind: 'move', from, to: e.move.to, t0: e.t, dur: e.move.dur }; S.at = e.move.to; }
    if (e.walk) { const cur = settle(e.t); const w = makeWalk([S.at, ...e.walk.points], e.walk.keys.map(([i, tt]) => [i, tt])); S.motion = { kind: 'walk', w, startYaw: S.yaw, endYaw: e.walk.endYaw, keepYaw: !!e.walk.keepYaw, prevPose: cur.pose === 'walk' ? 'stand' : cur.pose }; }
    if (e.look !== undefined) S.look = e.look;
    if (e.hands !== undefined) { if (e.hands !== S.hands) S.handsT = e.t; S.hands = e.hands; }
    if (e.visible !== undefined) S.visible = e.visible;
  }
  const ps = poseAt(t);
  let walked = S.walked;
  if (S.motion && S.motion.kind === 'walk') walked = S.baseWalked + S.motion.w.dist(t);
  const k = Math.min(1, Math.max(0, ps.k));
  return { at: posAt(t), yaw: yawAt(t), pose: ps.pose, prevPose: k < 1 ? ps.prevPose : null, k, prevAt: ps.prevAt || null, prevYaw: ps.prevYaw ?? null, walked, look: S.look, hands: S.hands, handsT: S.handsT, visible: S.visible };
}

// Discrete state from events up to t: the last value of each key wins.
export function evalDiscrete(events, t, init) {
  const S = { ...init };
  for (const e of events) { if (e.t > t) break; Object.assign(S, e.set); }
  return S;
}

// Chairs: follow their sitter while sat in; otherwise their own place, which may roll.
export function evalChair(events, t) {
  let C = { at: [0, 0], yaw: 0, occupant: null, motion: null };
  for (const e of events) {
    if (e.t > t) break;
    if (e.place) { C.at = e.place.at; C.yaw = e.place.yaw; C.motion = null; }
    if (e.occupant !== undefined) C.occupant = e.occupant;
    if (e.move) { const from = C.motion ? cur(C, e.t) : C.at; C.motion = { from, to: e.move.to, t0: e.t, dur: e.move.dur, yawFrom: C.yaw, yawTo: e.move.yaw ?? C.yaw }; C.at = e.move.to; C.yaw = e.move.yaw ?? C.yaw; }
  }
  const at = C.motion ? cur(C, t) : C.at;
  const yaw = C.motion ? lerpAngle(C.motion.yawFrom, C.motion.yawTo, smooth((t - C.motion.t0) / C.motion.dur)) : C.yaw;
  return { at, yaw, occupant: C.occupant };
  function cur(c, time) { const m = c.motion, k = smooth((time - m.t0) / m.dur); return [lerp(m.from[0], m.to[0], k), lerp(m.from[1], m.to[1], k)]; }
}
export { smooth, lerp, lerpAngle };
