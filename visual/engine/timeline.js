// Data-driven story timeline.
//
// A scene is plain data: objects with starting values, and a list of events. Each event
// has an `at` anchor and an `action`. This file turns that list into tracks, and
// `evaluate(t)` returns the complete state of the scene at time t -- computed, not
// accumulated, so seeking anywhere reconstructs the scene exactly.
//
// Anchors tie events to the AUDIO rather than to hand-typed seconds, so a regenerated
// clip or an edited line moves the visuals with it:
//   12.4                                    chapter seconds
//   { line: "What? Okay, I'm awake." }       start of the line that begins with this text
//   { line: "...", edge: "end" }             end of it
//   { cue: "ch01-011-second-chirp" }         when the drama mix plays that sound cue
//   { seg: 7 }                               segment by order
// Any anchor takes `offset` in seconds; a line anchor takes `nth` when a line repeats.

export const EASE = {
  linear: (p) => p,
  in: (p) => p * p,
  out: (p) => 1 - (1 - p) * (1 - p),
  inOut: (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
  smooth: (p) => p * p * (3 - 2 * p),
  slow: (p) => 1 - Math.pow(1 - p, 3), // long camera drifts: moves, then settles
};

const norm = (s) =>
  String(s).toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim();

export function makeAnchors(manifest) {
  const segs = manifest.segments;
  const byOrder = new Map(segs.map((s) => [s.order, s]));
  // The same rule scripts/tmbaudio/drama.py uses to place a cue in the mixed export.
  const cueTimes = new Map();
  for (const c of manifest.cues || []) {
    const s = byOrder.get(c.order);
    if (!s) continue;
    let t;
    if (c.timing === "after") t = s.endMs / 1000;
    else if (c.timing === "during") t = (s.startMs + (c.offsetMs || 0)) / 1000;
    else t = Math.max(0, (s.startMs - (s.pauseBeforeMs || 0)) / 1000);
    cueTimes.set(c.cueId, t);
  }
  function lineSeg(text, nth = 0) {
    const n = norm(text);
    let hits = segs.filter((s) => norm(s.displayText).startsWith(n));
    if (!hits.length) hits = segs.filter((s) => norm(s.displayText).includes(n));
    if (!hits.length) throw new Error(`timeline: no line in the manifest matches "${text}"`);
    if (hits.length > 1 && nth === 0) console.warn(`timeline: "${text}" matches ${hits.length} lines; using the first (pass nth to choose)`);
    return hits[Math.min(nth, hits.length - 1)];
  }
  function resolve(at) {
    if (typeof at === "number") return at;
    if (!at || typeof at !== "object") throw new Error("timeline: event has no `at`");
    const off = at.offset || 0;
    if (at.line !== undefined || at.seg !== undefined) {
      const s = at.line !== undefined ? lineSeg(at.line, at.nth) : byOrder.get(at.seg);
      if (!s) throw new Error(`timeline: no segment ${at.seg}`);
      return (at.edge === "end" ? s.endMs : s.startMs) / 1000 + off;
    }
    if (at.cue !== undefined) {
      if (!cueTimes.has(at.cue)) throw new Error(`timeline: no cue "${at.cue}" in the manifest`);
      return cueTimes.get(at.cue) + off;
    }
    throw new Error("timeline: unknown anchor " + JSON.stringify(at));
  }
  function lineAt(t) {
    const ms = t * 1000;
    let cur = null;
    for (const s of segs) {
      if (s.startMs <= ms) cur = s;
      else break;
    }
    return cur && ms <= cur.endMs + 150 ? cur : null;
  }
  return { resolve, lineText: (text, nth) => lineSeg(text, nth).displayText, lineAt, segments: segs };
}

// A continuous track: numeric fields that interpolate. Each keyframe records the value it
// starts FROM, measured at its own start time, so an event that interrupts a move that is
// still running continues from wherever that move had got to.
class Cont {
  constructor(init) {
    this.init = { ...init };
    this.k = [];
  }
  valueAt(t, n = this.k.length) {
    for (let i = n - 1; i >= 0; i--) {
      const kf = this.k[i];
      if (kf.t <= t) {
        const p = kf.dur > 0 ? Math.min(1, (t - kf.t) / kf.dur) : 1;
        const e = kf.ease(p);
        const out = { ...kf.from };
        for (const key in kf.to) out[key] = kf.from[key] + (kf.to[key] - kf.from[key]) * e;
        return out;
      }
    }
    return { ...this.init };
  }
  add(t, dur, to, ease) {
    const from = this.valueAt(t);
    for (const key in to) if (from[key] === undefined) from[key] = to[key];
    this.k.push({ t, dur, to, ease, from });
  }
}

// A step track: a value that changes instantly, remembering what it changed from and when
// (which is what a crossfade or a settling idle needs).
class Step {
  constructor(init) {
    this.init = init;
    this.k = [];
  }
  add(t, v) {
    this.k.push({ t, v });
  }
  at(t) {
    let v = this.init, since = -Infinity, prev = this.init, prevSince = -Infinity;
    for (const kf of this.k) {
      if (kf.t > t) break;
      prev = v;
      prevSince = since;
      v = kf.v;
      since = kf.t;
    }
    return { v, since, prev, prevSince };
  }
}

// Short transient shapes (a jolt, a flash, a shake), summed over whatever is active.
function impulses(list, t, shape) {
  let s = 0;
  for (const im of list) {
    if (t < im.t || t > im.t + im.dur) continue;
    s += im.amp * shape((t - im.t) / im.dur, t - im.t);
  }
  return s;
}
const bump = (p) => Math.sin(Math.PI * p) * (1 - p * 0.35);

const RESERVED = new Set(["sound", "parallax", "interaction"]); // named in the design, not built yet

export function compileScene(scene, anchors) {
  const shots = scene.shots || {};
  const shotOf = (ev) => {
    const r = ev.shot ? shots[ev.shot] : ev;
    if (!r) throw new Error(`timeline: unknown shot "${ev.shot}"`);
    return { x: r.x, y: r.y, w: r.w, h: r.h, fx: r.focus ? r.focus[0] : r.x + r.w / 2, fy: r.focus ? r.focus[1] : r.y + r.h / 2 };
  };

  const T = {
    camera: new Cont(shotOf(scene.camera.initial)),
    shakes: [],
    fade: new Cont({ v: scene.fadeFromBlack ? 1 : 0 }),
    sceneName: new Step(scene.camera.name || ""),
    actors: {},
    screens: {},
    lights: {},
    log: [],
  };
  for (const [id, a] of Object.entries(scene.actors || {})) {
    T.actors[id] = {
      pos: new Cont({ x: a.x, y: a.y }),
      facing: new Step(a.facing),
      pose: new Step(a.pose),
      state: new Step(a.state || "idle"),
      visible: new Step(a.visible !== false),
      jolts: [],
    };
  }
  for (const [id, s] of Object.entries(scene.screens || {})) {
    T.screens[id] = { state: new Step({ state: s.state, params: s.params || {} }), flashes: [] };
  }
  for (const [id, l] of Object.entries(scene.lights || {})) {
    T.lights[id] = { level: new Cont({ i: l.intensity || 0 }), color: new Step(l.color), throb: new Step(l.throb || 0), pulses: [] };
  }

  const events = scene.events
    .map((e, i) => ({ ...e, t: anchors.resolve(e.at), i }))
    .sort((a, b) => a.t - b.t || a.i - b.i);

  for (const ev of events) {
    const dur = ev.duration || 0;
    const ease = EASE[ev.ease || "inOut"] || EASE.inOut;
    const need = (group, id) => {
      const o = T[group][id];
      if (!o) throw new Error(`timeline: event at ${ev.t.toFixed(2)}s names unknown ${group.slice(0, -1)} "${id}"`);
      return o;
    };
    switch (ev.action) {
      case "camera":
        T.camera.add(ev.t, dur, shotOf(ev), ease);
        break;
      case "shake":
        T.shakes.push({ t: ev.t, dur: dur || 0.35, amp: ev.amount ?? 4 });
        break;
      case "move": {
        const a = need("actors", ev.actor);
        const cur = a.pos.valueAt(ev.t);
        const to = { x: ev.x ?? cur.x + (ev.dx || 0), y: ev.y ?? cur.y + (ev.dy || 0) };
        a.pos.add(ev.t, dur, to, ease);
        break;
      }
      case "face":
        need("actors", ev.actor).facing.add(ev.t, ev.direction);
        break;
      case "sit":
      case "stand":
      case "pose":
        need("actors", ev.actor).pose.add(ev.t, ev.action === "pose" ? ev.pose : ev.action === "sit" ? "sitting" : "standing");
        break;
      case "state":
        need("actors", ev.actor).state.add(ev.t, ev.state);
        break;
      case "jolt":
        need("actors", ev.actor).jolts.push({ t: ev.t, dur: dur || 0.55, amp: ev.amount ?? 1 });
        break;
      case "show":
      case "hide":
        need("actors", ev.actor).visible.add(ev.t, ev.action === "show");
        break;
      case "screen": {
        const s = need("screens", ev.target);
        if (ev.state) {
          const params = { ...(ev.params || {}) };
          if (ev.text && ev.text.line) params.text = anchors.lineText(ev.text.line, ev.text.nth);
          else if (typeof ev.text === "string") params.text = ev.text;
          s.state.add(ev.t, { state: ev.state, params });
        }
        if (ev.flash) s.flashes.push({ t: ev.t, dur: ev.flashDuration || 0.8, amp: ev.flash });
        break;
      }
      case "light": {
        const l = need("lights", ev.target);
        if (ev.color) l.color.add(ev.t, ev.color);
        if (ev.intensity !== undefined) l.level.add(ev.t, dur, { i: ev.intensity }, ease);
        if (ev.throb !== undefined) l.throb.add(ev.t, ev.throb);
        if (ev.pulse) l.pulses.push({ t: ev.t, dur: ev.pulseDuration || 0.7, amp: ev.pulse });
        break;
      }
      case "fade":
        T.fade.add(ev.t, dur, { v: ev.to }, ease);
        break;
      case "scene":
        T.sceneName.add(ev.t, ev.name);
        break;
      default:
        if (RESERVED.has(ev.action)) console.info(`timeline: "${ev.action}" is reserved and not implemented yet; skipped`);
        else console.warn(`timeline: unknown action "${ev.action}"; skipped`);
    }
    T.log.push({ t: ev.t, label: ev.label || `${ev.action} ${ev.actor || ev.target || ev.shot || ev.name || ""}`.trim() });
  }

  function evaluate(t) {
    const cam = T.camera.valueAt(t);
    const shake = T.shakes.length ? impulses(T.shakes, t, (p, dt) => Math.sin(dt * 2 * Math.PI * 17) * (1 - p)) : 0;
    const actors = {};
    for (const [id, a] of Object.entries(T.actors)) {
      const pos = a.pos.valueAt(t);
      actors[id] = {
        x: pos.x,
        y: pos.y,
        facing: a.facing.at(t),
        pose: a.pose.at(t),
        state: a.state.at(t),
        visible: a.visible.at(t).v,
        jolt: impulses(a.jolts, t, bump),
      };
    }
    const screens = {};
    for (const [id, s] of Object.entries(T.screens)) {
      const st = s.state.at(t);
      screens[id] = { state: st.v.state, params: st.v.params, since: st.since, flash: impulses(s.flashes, t, bump) };
    }
    const lights = {};
    for (const [id, l] of Object.entries(T.lights)) {
      const hz = l.throb.at(t);
      const throb = hz.v ? 0.5 + 0.5 * Math.cos(2 * Math.PI * hz.v * (t - hz.since)) : 0;
      lights[id] = { intensity: l.level.valueAt(t).i, color: l.color.at(t).v, throb, throbbing: !!hz.v, pulse: impulses(l.pulses, t, bump) };
    }
    let event = null;
    for (const e of T.log) {
      if (e.t <= t) event = e;
      else break;
    }
    return { t, camera: { ...cam, shake }, fade: T.fade.valueAt(t).v, scene: T.sceneName.at(t).v, actors, screens, lights, event };
  }

  return { evaluate, events: T.log };
}
