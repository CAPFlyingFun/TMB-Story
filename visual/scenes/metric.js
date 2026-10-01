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
        models: { jack: "../assets/models/jack.glb", sarah: "../assets/models/sarah.glb" },
        camera: CAM,
        room,
        skirted: ["sarah"],
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

  // Put someone somewhere at once (behind a cut).
  function placeM(actor, at, x, z) {
    const [px, py] = P(x, z);
    return { at, action: "move", actor, x: px, y: py, duration: 0 };
  }

  return { CAM, P, PERSPECTIVE, builtWorld, walkM, placeM, shot3, L, plus };
}

// Chapters 2 and 3: the camera at the origin.
export const { CAM, P, PERSPECTIVE, builtWorld, walkM, placeM } = makeMetric(0);
