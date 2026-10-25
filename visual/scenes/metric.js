// Staging helpers for the BUILT sets nobody painted (the corridor and the main control room,
// engine/controlRoom.js; the edge of the settlement, engine/outdoors.js). A set still has a
// "picture" -- the stage places people in picture pixels, and people3d.js reads the floor
// through the picture's camera -- but here the picture is a virtual one: a level camera
// 1.5 m up looking down -z, so a place on the floor in metres converts to pixels by one
// rule, P(x, z), and every mark in these scenes is written in metres.
//
// The camera stands at the room's origin (Chapters 2 and 3), or z0 metres behind it
// (makeMetric(z0)): a mark has to be in front of the picture's camera to be a place on its
// floor, and from Chapter 4 people arrive at the control room's door, behind the origin.

export const FRAME = { width: 2048, height: 1152 };

// THE PEOPLE'S MODELS, for every set with 3D people (engine/people3d.js). Sarah is Sarah v2
// as Joshua saved her in TRADDOMIUM's Sarah Lab (2026-10-24: "add this new Sarah into the
// TMB-Story so I can watch Sarah and see how it looks"), baked for the story by that game's
// scripts/sarahV2Recovery/story-sarah.mjs. `?sarah=toon` brings back the toon Sarah of
// 2026-10-07, to compare the two in the same scene.
const TOON_SARAH = typeof location !== "undefined" && new URLSearchParams(location.search).get("sarah") === "toon";
export const PEOPLE_MODELS = Object.freeze({
  jack: "../assets/models/jack.glb",
  sarah: TOON_SARAH ? "../assets/models/sarah.glb" : "../assets/models/sarah-v2.glb",
});
export const L = (line, o = {}) => ({ line, ...o });
export const plus = (a, s) => ({ ...a, offset: (a.offset || 0) + s });

// A real camera in metres: `at` the eye, `look` what it looks at, `hfov` degrees. The flat
// framing (x, y, w, h) is only for drawn people and is the whole virtual picture.
export function shot3(at, look, hfov = 55) {
  return { x: 0, y: 0, w: FRAME.width, h: FRAME.height, focus: [FRAME.width / 2, FRAME.height / 2], cam3: { at, look, hfov } };
}

export function makeMetric(z0 = 0) {
  const CAM = { focal: 1300, principal: [1024, 576], height: 1.5, vanishX: 1024, z0 };

  // A floor point (x right, z toward the camera; in front of it is z < z0) as picture pixels.
  function P(x, z) {
    const d = z0 - z;
    return [CAM.principal[0] + (CAM.focal * x) / d, CAM.principal[1] + (CAM.focal * CAM.height) / d];
  }

  // The floor perspective the stage sizes drawn people by, from the same camera: at depth d
  // a metre is focal / d pixels, at picture row principal_y + focal * height / d.
  const PERSPECTIVE = { horizonY: CAM.principal[1], ref: { y: CAM.principal[1] + (CAM.focal * CAM.height) / 5, pxPerMeter: CAM.focal / 5 } };

  // A set's world block for a built room.
  function builtWorld(room, extra = {}) {
    return {
      width: FRAME.width,
      height: FRAME.height,
      background: "../assets/backgrounds/built-room.jpg", // a dark plate: the built room is drawn over it
      bounds: { x: 0, y: 0, w: FRAME.width, h: FRAME.height },
      perspective: PERSPECTIVE,
      layers: [{ id: "room", parallax: 1 }],
      people3d: {
        models: { ...PEOPLE_MODELS },
        camera: CAM,
        room,
        // Sarah is 32 weeks pregnant: seated, she sits upright with her hips a little more
        // open and her hands resting on her thighs (posture "pregnant"); a doze, if a scene
        // ever gives her one, cradles the bump rather than folding arms over it.
        pregnant: ["sarah"],
        cradle: ["sarah"],
        ...extra,
      },
    };
  }

  // A walk in metres, from (x0, z0) to (x1, z1), as equal steps in METRES (a single move would
  // be even in picture pixels, which toward or away from the camera is not even on the floor).
  function walkM(actor, at, from, to, dur, dir, then, steps = 6) {
    const ev = [
      { at, action: "state", actor, state: "walking" },
      { at, action: "face", actor, direction: dir },
    ];
    for (let i = 1; i <= steps; i++) {
      const k = i / steps;
      const [x, y] = P(from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k);
      ev.push({ at: plus(at, (dur * (i - 1)) / steps), action: "move", actor, x, y, duration: dur / steps, ease: i === 1 ? "in" : i === steps ? "out" : "linear" });
    }
    ev.push({ at: plus(at, dur), action: "state", actor, state: "idle" });
    if (then) ev.push({ at: plus(at, dur), action: "face", actor, direction: then });
    return ev;
  }

  // A walk through waypoints, in metres, at one even pace: each leg faces the way it goes, and
  // the last facing is `then` (or the last leg's). For a way AROUND furniture -- a straight
  // walkM through a console is stopped at it in 3D (engine/collide.js), and the person stands a
  // metre off their mark for the rest of the scene.
  function routeM(actor, at, points, dur, then) {
    const legs = [];
    let total = 0;
    for (let i = 1; i < points.length; i++) {
      const d = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
      legs.push(d);
      total += d;
    }
    const ev = [{ at, action: "state", actor, state: "walking" }];
    let t = 0;
    for (let i = 1; i < points.length; i++) {
      const [x0, z0] = points[i - 1], [x1, z1] = points[i], legDur = (dur * legs[i - 1]) / total;
      ev.push({ at: plus(at, t), action: "face", actor, direction: compass(x1 - x0, z1 - z0) });
      const steps = Math.max(2, Math.round(legs[i - 1] / 0.6));
      for (let k = 1; k <= steps; k++) {
        const [x, y] = P(x0 + ((x1 - x0) * k) / steps, z0 + ((z1 - z0) * k) / steps);
        const first = i === 1 && k === 1, last = i === points.length - 1 && k === steps;
        ev.push({ at: plus(at, t + (legDur * (k - 1)) / steps), action: "move", actor, x, y, duration: legDur / steps, ease: first ? "in" : last ? "out" : "linear" });
      }
      t += legDur;
    }
    ev.push({ at: plus(at, dur), action: "state", actor, state: "idle" });
    if (then) ev.push({ at: plus(at, dur), action: "face", actor, direction: then });
    return ev;
  }

  // Put someone somewhere at once (behind a cut).
  function placeM(actor, at, x, z) {
    const [px, py] = P(x, z);
    return { at, action: "move", actor, x: px, y: py, duration: 0 };
  }

  return { CAM, P, PERSPECTIVE, builtWorld, walkM, routeM, placeM, shot3, L, plus };
}

// The scene's compass for a step on the floor: north is into the picture (-z), east is +x.
const COMPASS = ["north", "northeast", "east", "southeast", "south", "southwest", "west", "northwest"];
function compass(dx, dz) {
  const a = Math.atan2(dx, -dz);
  return COMPASS[((Math.round(a / (Math.PI / 4)) % 8) + 8) % 8];
}

// Chapters 2 and 3: the camera at the origin.
export const { CAM, P, PERSPECTIVE, builtWorld, walkM, routeM, placeM } = makeMetric(0);
