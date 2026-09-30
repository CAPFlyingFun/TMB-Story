// Animation presets for the cutout rig: a scene says "gesture: nod" instead of setting
// joint angles. Each preset is a function of its progress u (0..1 over the event's
// duration) returning joint angles in degrees (clockwise positive) and small head shifts
// in normalized units. Every preset eases in and out, and the ranges stay SMALL (the
// artwork is realistic; big turns expose it as paper): head 5-10 deg, torso 3-6, upper
// arm 10-30, forearm 10-35.
//
// Directions differ: "outward" for an arm is away from the body (sideways in a front or
// back view), "forward" is the way the character faces (in a side view). The rig tells a
// preset which: rig.view ("front" | "back" | "side"), rig.facing (+1 east, -1 west) and
// each arm joint's side (+1 on the screen-left edge, -1 screen-right).

const smooth = (p) => (p <= 0 ? 0 : p >= 1 ? 1 : p * p * (3 - 2 * p));
// Rise over the first `a` of the gesture, hold, fall over the last `a`.
export const envelope = (u, a = 0.25) => Math.min(smooth(u / a), smooth((1 - u) / a));

function armNames(rig, want) {
  // "left"/"right" is the character's own; default to the arm nearest the camera or the
  // screen-right one, which in these sheets is the freer of the two.
  const has = (s) => rig.joints[s + "UpperArm"];
  if (want && has(want)) return want;
  if (has("right") && has("left")) return rig.view === "back" ? "right" : "left";
  return has("right") ? "right" : "left";
}

function armSigns(rig, side) {
  const j = rig.joints[side + "UpperArm"];
  const s = (j && j.side) || 0;
  // out: the rotation that swings the hand away from the body; fwd: toward the facing.
  return { out: s || 1, fwd: rig.view === "side" ? -(rig.facing || 1) : s || 1, inward: -(s || 1) };
}

export const PRESETS = {
  idle: () => ({}),
  breathe: (u, rig, o, t) => ({ angles: { torso: 0.6 * Math.sin(t * 2 * Math.PI / 4) } }),
  "look-left": (u) => ({ angles: { head: -9 * envelope(u) }, shift: { head: [-0.02 * envelope(u), 0] } }),
  "look-right": (u) => ({ angles: { head: 9 * envelope(u) }, shift: { head: [0.02 * envelope(u), 0] } }),
  "look-up": (u, rig) => ({ angles: { head: (rig.facing || 1) * -7 * envelope(u) }, shift: { head: [0, -0.01 * envelope(u)] } }),
  "look-down": (u, rig) => ({ angles: { head: (rig.facing || 1) * 9 * envelope(u) }, shift: { head: [0, 0.014 * envelope(u)] } }),
  nod: (u, rig) => {
    const e = envelope(u, 0.15), w = Math.sin(u * 2 * Math.PI * 2);
    return { angles: { head: (rig.facing || 1) * 8 * e * Math.max(0, w) }, shift: { head: [0, 0.016 * e * Math.max(0, w)] } };
  },
  "shake-head": (u) => {
    const e = envelope(u, 0.15), w = Math.sin(u * 2 * Math.PI * 3);
    return { angles: { head: 6 * e * w }, shift: { head: [0.018 * e * w, 0] } };
  },
  // Asleep in the chair: the head tipped toward one shoulder and sunk a little, drifting
  // lower on each slow breath. Already there when the event starts (he is asleep when we
  // arrive); it snaps back in the last 0.35 s (he jerks awake).
  doze: (u, rig, o, t) => {
    const d = o.dur || 10, left = (1 - u) * d;
    const e = Math.min(1, left / 0.35), br = Math.sin((2 * Math.PI * t) / 5.4);
    const side = o.side || 1;
    return {
      angles: { head: side * (9 + 1.2 * br) * e, torso: 0.8 * br * e },
      shift: { head: [side * 0.014 * e, (0.009 + 0.003 * br) * e] },
    };
  },
  // Shifting in sleep: a slow roll of the head, and back.
  stir: (u, rig, o) => {
    const e = envelope(u, 0.35), side = o.side || 1;
    return { angles: { head: -side * 5 * e, torso: 1.5 * e }, shift: { head: [-side * 0.01 * e, -0.006 * e] } };
  },
  "small-hand-gesture": (u, rig, o) => {
    const arm = armNames(rig, o.arm), s = armSigns(rig, arm), w = Math.sin(u * 2 * Math.PI * 1.5);
    // seated, the hand lifts off the lap only half as far: what the lap hid was never drawn
    const e = envelope(u) * (rig.pose === "sitting" ? 0.5 : 1);
    // the wrist only follows a little: a hand that turns much on the forearm reads as a break
    return { angles: { [arm + "UpperArm"]: s.fwd * 10 * e, [arm + "Forearm"]: s.inward * (20 + 6 * w) * e, [arm + "Hand"]: 4 * w * e } };
  },
  point: (u, rig, o) => {
    const arm = armNames(rig, o.arm), s = armSigns(rig, arm), e = envelope(u, 0.2);
    const up = rig.view === "side" ? s.fwd : s.out;
    return { angles: { [arm + "UpperArm"]: up * 26 * e, [arm + "Forearm"]: up * 14 * e, [arm + "Hand"]: up * 6 * e } };
  },
  wave: (u, rig, o) => {
    const arm = armNames(rig, o.arm), s = armSigns(rig, arm), e = envelope(u, 0.2), w = Math.sin(u * 2 * Math.PI * 3);
    return { angles: { [arm + "UpperArm"]: s.out * 30 * e, [arm + "Forearm"]: s.inward * (30 + 8 * w) * e, [arm + "Hand"]: 10 * w * e } };
  },
  reach: (u, rig, o) => {
    const arm = armNames(rig, o.arm), s = armSigns(rig, arm), e = envelope(u, 0.3);
    return { angles: { [arm + "UpperArm"]: s.fwd * 22 * e, [arm + "Forearm"]: s.fwd * 8 * e, torso: (rig.facing || 0) * 2 * e } };
  },
  type: (u, rig, o, t) => {
    const e = envelope(u, 0.1), a = {};
    for (const side of ["left", "right"]) {
      if (!rig.joints[side + "Forearm"]) continue;
      const ph = side === "left" ? 0 : Math.PI;
      a[side + "Forearm"] = 4 * e * Math.sin(t * 2 * Math.PI * 5.5 + ph);
      a[side + "Hand"] = 5 * e * Math.sin(t * 2 * Math.PI * 7 + ph);
    }
    // eyes on the screen while typing: the head dips a touch
    if (rig.joints.head) {
      a.head = (a.head || 0) + (rig.facing || 1) * 2 * e;
    }
    return { angles: a };
  },
  "lean-forward": (u, rig) => ({ angles: { torso: (rig.facing || 0.6) * 5 * envelope(u, 0.3), head: (rig.facing || 0.6) * 3 * envelope(u, 0.3) }, shift: { head: [0, 0.008 * envelope(u, 0.3)] } }),
  "lean-back": (u, rig) => ({ angles: { torso: -(rig.facing || 0.6) * 4 * envelope(u, 0.3), head: -(rig.facing || 0.6) * 2 * envelope(u, 0.3) }, shift: { head: [0, -0.006 * envelope(u, 0.3)] } }),
  "stand-up": (u, rig) => ({ angles: { torso: (rig.facing || 0.6) * 5 * Math.sin(Math.PI * u) } }),
  "sit-down": (u, rig) => ({ angles: { torso: (rig.facing || 0.6) * 4 * Math.sin(Math.PI * u) } }),
  // Walking: opposing arm and leg swing, small torso turn. Deliberately restrained; in a
  // side view the legs are one piece of art, so only the arms and torso move.
  walk: (u, rig, o, t) => {
    const ph = t * 2 * Math.PI * 1 / 1.05, e = o.envelope ?? 1, a = {};
    const k = rig.view === "side" ? 1 : 0.35; // front/back: a sideways swing reads wrong, keep it tiny
    const sh = {};
    for (const [side, sgn] of [["left", 1], ["right", -1]]) {
      if (rig.joints[side + "UpperArm"]) a[side + "UpperArm"] = sgn * 7 * k * e * Math.sin(ph);
      if (rig.joints[side + "Forearm"]) a[side + "Forearm"] = sgn * 4 * k * e * Math.sin(ph - 0.4);
      if (rig.view === "side") {
        if (rig.joints[side + "UpperLeg"]) a[side + "UpperLeg"] = -sgn * 4 * e * Math.sin(ph);
        if (rig.joints[side + "LowerLeg"]) a[side + "LowerLeg"] = 3 * e * Math.max(0, -sgn * Math.sin(ph));
      } else if (rig.joints[side + "LowerLeg"]) {
        // toward or away from the camera a step is the knee coming forward: the shin and
        // shoe rise over the thigh, and the shoe leaves the floor
        sh[side + "LowerLeg"] = [0, -0.02 * e * Math.max(0, sgn * Math.sin(ph))];
      }
    }
    a.torso = 0.8 * e * Math.sin(ph);
    return { angles: a, shift: sh };
  },
};

// A hand on the stomach: in 3D the hand really goes there (engine/people3d.js); the drawn
// rig can only lift a hand a little, so it borrows the small gesture.
PRESETS["hand-on-belly"] = PRESETS["small-hand-gesture"];
// Pressing a button (the intercom): in 3D the finger goes to it; drawn, a reach and a
// small push.
PRESETS.press = PRESETS.reach;
PRESETS.tap = () => ({});
PRESETS.keys = () => ({}); // hands resting on a keyboard: the 3D people's reach, nothing drawn

export const PRESET_NAMES = Object.keys(PRESETS);

// Alive while nothing else is happening: slow breathing in the torso and a small drift of
// the head, at a pace of each character's own (seed) so two people never move in step.
PRESETS.alive = (u, rig, o, t) => {
  const s = o.seed || 0, b = Math.sin((2 * Math.PI * t) / (4.2 + s * 0.7) + s * 2.1);
  const h = Math.sin((2 * Math.PI * t) / (7.3 + s * 1.3) + s) + 0.5 * Math.sin((2 * Math.PI * t) / (3.1 + s * 0.4) + 2 * s);
  return { angles: { torso: 0.7 * b, head: 1.6 * h }, shift: { head: [0, 0.003 * b] } };
};

// Everything active on a character at once, summed: returns { angles, shift }. idle: a
// seed for PRESETS.alive, or null for none.
export function poseFrom(rig, gestures, t, walking, idle = null) {
  const angles = {}, shift = {};
  const add = (r) => {
    for (const [k, v] of Object.entries(r.angles || {})) angles[k] = (angles[k] || 0) + v;
    for (const [k, v] of Object.entries(r.shift || {})) shift[k] = [(shift[k] || [0, 0])[0] + v[0], (shift[k] || [0, 0])[1] + v[1]];
  };
  for (const gz of gestures) {
    const f = PRESETS[gz.name];
    if (f) add(f(gz.u, rig, gz.opts || {}, t));
  }
  if (walking) add(PRESETS.walk(0, rig, { envelope: walking }, t));
  if (idle !== null && !gestures.some((g) => g.name === "doze")) add(PRESETS.alive(0, rig, { seed: idle }, t));
  return { angles, shift };
}
