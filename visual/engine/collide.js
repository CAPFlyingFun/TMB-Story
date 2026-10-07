// SIMPLE SURFACE COLLISIONS for the 3D people (Joshua, 2026-10-07: "Jack and Sarah's hands
// and body end up going through objects and should add simple surface collisions").
//
// The room is boxes, so the collision world is boxes: every solid piece of furniture as an
// axis-aligned box in world metres (recorded by labRoom.js's mergeStatic before it merges
// them away), and every chair as a box turned with the chair. Two rules use them:
//
//   - A STANDING BODY is a circle on the floor (BODY_RADIUS_M) kept out of every solid that
//     reaches its hips to its head, and out of every chair. It leaves a box by the side it
//     came in from, not the nearest one, so a walk that runs into a console stops at it
//     instead of jumping through to the far side half-way.
//   - A FREE HAND -- one with nothing to hold, hanging or gesturing -- that would end up inside
//     a solid or a chair is given somewhere to be instead: the nearest point on that box's
//     surface, which is where a real hand meets a desk top or a chair back.
//
// Hands that are reaching for something on purpose (keys, a button, the bump) are left to the
// reach: their targets are on surfaces already. Nothing here moves the room, a chair, or the
// story's marks; it only keeps the people out of them.

export const BODY_RADIUS_M = 0.2;
// A solid counts for a standing body when it reaches between these heights (a step or a
// cable on the floor is walked over; a shelf above the head is walked under).
const BODY_LOW_M = 0.3, BODY_HIGH_M = 1.75;
// A hand is pushed this far clear of a surface.
export const HAND_CLEAR_M = 0.015;

// A chair as a box in its own frame (people3d's CHAIR: seat 0.48 wide, 0.46 deep, the back
// behind it), from just under the seat to the top of the back. The star base is at the
// floor, among the feet, and is left out.
export function chairBox(seatTop) {
  return { min: [-0.28, Math.max(0.3, seatTop - 0.1), -0.32], max: [0.28, seatTop + 0.6, 0.24] };
}

// Every mesh's world box that is a SOLID: something that stands in the room at a person's
// height. Left out: the floor and its seams, the ceiling, and walls and windows (thin and
// large -- the rooms' own bounds, people3d.clampAisle, keep people off those).
export function solidsOf(meshes) {
  const out = [];
  for (const m of meshes) {
    const g = m.geometry;
    if (!g.boundingBox) g.computeBoundingBox();
    const b = g.boundingBox.clone().applyMatrix4(m.matrixWorld);
    const size = [b.max.x - b.min.x, b.max.y - b.min.y, b.max.z - b.min.z];
    if (b.max.y < 0.05 || b.min.y > 2.4) continue;
    const thin = Math.min(...size), big = size.filter((s) => s > 1.5).length;
    if (thin < 0.12 && big >= 2) continue;
    if (Math.max(...size) < 0.03) continue;
    out.push({ min: [b.min.x, b.min.y, b.min.z], max: [b.max.x, b.max.y, b.max.z] });
  }
  return out;
}

const inside = (p, b, m = 0) => p[0] > b.min[0] - m && p[0] < b.max[0] + m && p[1] > b.min[1] - m && p[1] < b.max[1] + m && p[2] > b.min[2] - m && p[2] < b.max[2] + m;

// A point inside a box (grown by `m`), moved out through the nearest face. Returns null when
// the point is not inside.
export function exitBox(p, b, m) {
  if (!inside(p, b, m)) return null;
  let best = Infinity, axis = 0, to = 0;
  for (let i = 0; i < 3; i++) {
    const lo = p[i] - (b.min[i] - m), hi = b.max[i] + m - p[i];
    if (lo < best) { best = lo; axis = i; to = b.min[i] - m; }
    if (hi < best) { best = hi; axis = i; to = b.max[i] + m; }
  }
  const q = p.slice();
  q[axis] = to;
  return q;
}

// The same for a box turned `yaw` about the vertical at (x, z): the point into the box's
// frame, out, and back.
export function exitTurnedBox(p, box, at, yaw, m) {
  const c = Math.cos(yaw), s = Math.sin(yaw);
  const dx = p[0] - at[0], dz = p[2] - at[2];
  const local = [dx * c - dz * s, p[1], dx * s + dz * c];
  const q = exitBox(local, box, m);
  if (!q) return null;
  return [at[0] + q[0] * c + q[2] * s, q[1], at[2] - q[0] * s + q[2] * c];
}

// A circle of radius r on the floor at `at` ([x, y, z]; y is ignored), kept out of a box's
// footprint. `from` is a point the body came from: when given and outside, the circle leaves
// by the face toward it. Returns true when it moved `at`.
export function circleOutOfBox(at, r, b, from) {
  if (b.max[1] < BODY_LOW_M || b.min[1] > BODY_HIGH_M) return false;
  const x0 = b.min[0] - r, x1 = b.max[0] + r, z0 = b.min[2] - r, z1 = b.max[2] + r;
  if (!(at[0] > x0 && at[0] < x1 && at[2] > z0 && at[2] < z1)) return false;
  // Inside the grown footprint. Rounded corners: outside the box's own corner by more than
  // r (Euclidean) is clear.
  const cx = Math.max(b.min[0], Math.min(b.max[0], at[0])), cz = Math.max(b.min[2], Math.min(b.max[2], at[2]));
  const dx = at[0] - cx, dz = at[2] - cz, d = Math.hypot(dx, dz);
  if (d > 0 && dx !== 0 && dz !== 0) {
    if (d >= r) return false;
    at[0] = cx + (dx / d) * r;
    at[2] = cz + (dz / d) * r;
    return true;
  }
  const faces = [[0, x0, at[0] - x0], [0, x1, x1 - at[0]], [2, z0, at[2] - z0], [2, z1, z1 - at[2]]];
  let pick = null;
  if (from) {
    // the face whose outside the body came from
    const out = faces.filter(([axis, v], i) => (i % 2 === 0 ? from[axis] <= v : from[axis] >= v));
    if (out.length) pick = out.reduce((a, f) => (f[2] < a[2] ? f : a));
  }
  if (!pick) pick = faces.reduce((a, f) => (f[2] < a[2] ? f : a));
  at[pick[0]] = pick[1];
  return true;
}

// The same for a chair: a circle kept out of the chair's turned box.
export function circleOutOfChair(at, r, chair, from) {
  const box = chairBox(chair.seatTop);
  const c = Math.cos(chair.yaw), s = Math.sin(chair.yaw);
  const toLocal = (p) => p && [(p[0] - chair.at[0]) * c - (p[2] - chair.at[2]) * s, 0, (p[0] - chair.at[0]) * s + (p[2] - chair.at[2]) * c];
  const local = toLocal(at);
  if (!circleOutOfBox(local, r, box, toLocal(from))) return false;
  at[0] = chair.at[0] + local[0] * c + local[2] * s;
  at[2] = chair.at[2] - local[0] * s + local[2] * c;
  return true;
}

// Where a free hand's fingertip should be instead of `tip`, or null when it is clear:
// the nearest surface point of whatever it is in (solids first, then chairs).
export function handOut(tip, solids, chairs) {
  for (const b of solids) {
    const q = exitBox(tip, b, HAND_CLEAR_M);
    if (q) return q;
  }
  for (const c of chairs) {
    const q = exitTurnedBox(tip, chairBox(c.seatTop), c.at, c.yaw, HAND_CLEAR_M);
    if (q) return q;
  }
  return null;
}
