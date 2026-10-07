// Unit tests for visual/engine/collide.js. Run: node --test scripts/tests/collide.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { circleOutOfBox, circleOutOfChair, exitBox, exitTurnedBox, handOut, chairBox, BODY_RADIUS_M } from "../../visual/engine/collide.js";

// a console 2.8 m wide, 0.7 deep, 0.96 high (Chapter 2's primary console)
const consoleBox = { min: [-2.5, 0, -5.65], max: [0.35, 0.96, -4.95] };

test("a body walking into a console stops at the side it came from", () => {
  const at = [-0.75, 0, -5.5]; // most of the way through, nearer the far side
  assert.ok(circleOutOfBox(at, BODY_RADIUS_M, consoleBox, [-1.5, 0, -0.4]));
  assert.ok(Math.abs(at[2] - (-4.95 + BODY_RADIUS_M)) < 1e-9, `z ${at[2]}`);
});

test("with nowhere it came from, it leaves by the nearest side", () => {
  const at = [-0.75, 0, -5.6];
  circleOutOfBox(at, BODY_RADIUS_M, consoleBox, null);
  assert.ok(Math.abs(at[2] - (-5.65 - BODY_RADIUS_M)) < 1e-9);
});

test("a body clear of the box, or past a rounded corner, is left alone", () => {
  const far = [-0.75, 0, -4.0];
  assert.equal(circleOutOfBox(far, BODY_RADIUS_M, consoleBox, null), false);
  const corner = [0.35 + 0.15, 0, -4.95 + 0.15]; // 0.21 m from the corner
  assert.equal(circleOutOfBox(corner, BODY_RADIUS_M, consoleBox, null), false);
});

test("a shelf above the head and a cable on the floor do not stop a body", () => {
  assert.equal(circleOutOfBox([0, 0, 0], BODY_RADIUS_M, { min: [-1, 1.9, -1], max: [1, 2.0, 1] }, null), false);
  assert.equal(circleOutOfBox([0, 0, 0], BODY_RADIUS_M, { min: [-1, 0, -1], max: [1, 0.05, 1] }, null), false);
});

test("a hand inside a desk top comes out through the top", () => {
  const q = exitBox([-1, 0.93, -5.3], consoleBox, 0.015);
  assert.deepEqual(q.map((v) => +v.toFixed(3)), [-1, 0.975, -5.3]);
  assert.equal(exitBox([-1, 1.2, -5.3], consoleBox, 0.015), null);
});

test("a turned chair: a hand in its back comes out behind it, in the world", () => {
  const chair = { at: [1, 0, 2], yaw: Math.PI / 2, seatTop: 0.47 }; // facing +x
  // the back is at local z -0.3, which is world x 1 - 0.3
  const q = exitTurnedBox([0.72, 0.9, 2], chairBox(0.47), chair.at, chair.yaw, 0.015);
  assert.ok(q && q[0] < 1 - 0.32, `x ${q && q[0]}`);
  assert.ok(Math.abs(q[2] - 2) < 1e-9);
  const body = [0.8, 0, 2];
  assert.ok(circleOutOfChair(body, BODY_RADIUS_M, chair, [0, 0, 2]));
  assert.ok(body[0] <= 1 - 0.32 - BODY_RADIUS_M + 1e-9, `x ${body[0]}`);
});

test("handOut checks solids, then chairs, and leaves a clear hand alone", () => {
  assert.equal(handOut([5, 1, 5], [consoleBox], [{ at: [0, 0, 0], yaw: 0, seatTop: 0.47 }]), null);
  assert.ok(handOut([0, 0.8, -0.3], [], [{ at: [0, 0, 0], yaw: 0, seatTop: 0.47 }]));
});
