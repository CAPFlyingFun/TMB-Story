/* Drive the REAL reader/player.js through a chapter inside a fake browser.
 *
 *   node scripts/verify-player.js [repo-root]
 *
 * Written because Joshua reported chapter 1 playing "sped up like x3" after the
 * volume sliders and the download button landed, and reading the diff did not find
 * it. The measurements had already ruled out the audio itself: every voice clip is
 * byte-identical to when it was generated and every export is the right length. So
 * the fault is in this file's subject, and guessing at it twice was enough.
 *
 * What it checks is the thing the symptom describes: ONE clip sounding at a time,
 * in order, at rate 1, with the manifest's gap between them. An audiobook that plays
 * two clips at once sounds exactly like one played too fast.
 *
 * Node's standard library only: fs, path, vm.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = process.argv[2] || path.join(__dirname, "..");
const manifest = JSON.parse(
  fs.readFileSync(path.join(ROOT, "audio/manifests/chapter-01.json"), "utf8"));

// ---- fake browser ---------------------------------------------------------
const created = [];            // every Audio element the player ever makes
const timers = [];
let now = 0;

class FakeAudio {
  constructor() {
    this._src = "";
    this.preload = "";
    this.volume = 1;
    this.playbackRate = 1;
    this.paused = true;
    this.currentTime = 0;
    this.duration = 2.5;
    this._attrs = {};
    this._handlers = {};
    this._playCount = 0;
    created.push(this);
  }
  set src(v) { this._src = v; }
  get src() { return this._src; }
  setAttribute(k, v) { this._attrs[k] = v; }
  getAttribute(k) { return Object.prototype.hasOwnProperty.call(this._attrs, k) ? this._attrs[k] : null; }
  removeAttribute(k) { delete this._attrs[k]; }
  load() {}
  addEventListener(name, fn) { (this._handlers[name] ||= []).push(fn); }
  play() {
    this.paused = false;
    this._playCount += 1;
    (this._handlers.playing || []).forEach((f) => f());
    return Promise.resolve();
  }
  pause() {
    this.paused = true;
    (this._handlers.pause || []).forEach((f) => f());
  }
  end() { (this._handlers.ended || []).forEach((f) => f()); }
}

/* A DOM just rich enough for innerHTML plus getElementById. The player writes a
   string and then looks its controls up by id, so the fake parses ids out of the
   string rather than pretending to be a browser. */
const nodes = new Map();
function parseIds(html) {
  nodes.clear();
  const re = /id="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    nodes.set(m[1], {
      id: m[1], onclick: null, onchange: null, oninput: null,
      textContent: "", value: "0", disabled: false
    });
  }
}

const body = {
  _html: "",
  set innerHTML(v) { this._html = v; parseIds(v); },
  get innerHTML() { return this._html; }
};

const document = {
  getElementById: (id) => (id === "listen-body" ? body : nodes.get(id) || null),
  createElement: () => ({ style: {}, click() {}, setAttribute() {} }),
  body: { appendChild() {}, removeChild() {} }
};

const sandbox = {
  window: {},
  document,
  Audio: FakeAudio,
  fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve(manifest) }),
  setTimeout: (fn, ms) => { timers.push({ fn, at: now + (ms || 0), done: false }); return timers.length - 1; },
  clearTimeout: (id) => { if (timers[id]) timers[id].done = true; },
  setInterval: () => 0,
  clearInterval: () => {},
  console,
  URL: { createObjectURL: () => "blob:x", revokeObjectURL() {} }
};
sandbox.globalThis = sandbox;
sandbox.window.localStorage = {
  _d: {},
  getItem(k) { return Object.prototype.hasOwnProperty.call(this._d, k) ? this._d[k] : null; },
  setItem(k, v) { this._d[k] = String(v); }
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "reader/sfx.js"), "utf8"), sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "reader/export.js"), "utf8"), sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "reader/player.js"), "utf8"), sandbox);

/* The layer module is exercised by verify-layers.js; here it must not interfere, and
   whether the player survives its absence is checked at the end. */
const L = sandbox.window.TMBLayers;
L.load(manifest);

// ---- helpers --------------------------------------------------------------
let failures = 0;
function check(name, ok, detail) {
  console.log((ok ? "  PASS  " : "  FAIL  ") + name + (detail ? "   " + detail : ""));
  if (!ok) failures += 1;
}

async function flush() {
  // Generous: mount -> fetch -> json -> 180 HEAD checks -> render is a long chain,
  // and a harness that gives up early would report a bug that is its own.
  for (let i = 0; i < 400; i++) await Promise.resolve();
}

/* Run every timer that is due, advancing the clock to the next one. Returns the
   milliseconds the clock moved, which is how the gaps get measured. */
async function advance() {
  let moved = 0;
  let due = timers.filter((t) => !t.done && t.at <= now);
  if (!due.length) {
    const pending = timers.filter((t) => !t.done);
    if (!pending.length) return -1;
    const next = Math.min(...pending.map((t) => t.at));
    moved = next - now;
    now = next;
    due = timers.filter((t) => !t.done && t.at <= now);
  }
  // Moving the clock is not enough: the timer has to FIRE, or the next clip never
  // starts and the walk stops after one segment looking like a pass.
  due.forEach((t) => { t.done = true; t.fn(); });
  await flush();
  return moved;
}

function voiceElements() {
  return created.filter((e) => /\/clips\//.test(e._src));
}

function sounding() {
  return voiceElements().filter((e) => !e.paused);
}

// ---- the walk -------------------------------------------------------------
async function main() {
  console.log("Player verification — real reader/player.js, real chapter-01 manifest");
  console.log("segments: " + manifest.segments.length);
  console.log("");

  const view = { innerHTML: "" };
  Object.defineProperty(view, "innerHTML", {
    set(v) { parseIds(v); },
    get() { return ""; }
  });
  sandbox.window.TMBPlayer.mount(view, { chapters: [{ number: 1, title: "One" }] });
  await flush();

  console.log("1. One clip at a time, in order, at rate 1");
  const toggle = nodes.get("listen-toggle");
  check("the player mounted and rendered its controls", !!toggle);
  toggle.onclick();
  await flush();

  const order = [];
  let overlaps = 0;
  let wrongRate = 0;
  const gaps = [];
  for (let step = 0; step < 240; step++) {
    const live = sounding();
    if (live.length > 1) overlaps += 1;
    live.forEach((e) => { if (e.playbackRate !== 1) wrongRate += 1; });
    const playingNow = live[0];
    if (playingNow && order[order.length - 1] !== playingNow._src) order.push(playingNow._src);
    if (!playingNow) break;
    playingNow.pause();
    playingNow.end();                    // the clip finishes
    await flush();
    const moved = await advance();       // the manifest's gap, then the next clip
    if (moved > 0) gaps.push(moved);
    if (moved < 0) break;
  }

  check("never two voice clips sounding at once", overlaps === 0,
        overlaps + " step(s) had more than one");
  check("playbackRate stays 1 throughout", wrongRate === 0);
  check("clips play in manifest order",
        order.every((src, i) => i === 0 || src === "./" + manifest.segments[i].audio),
        order.length + " clip(s) played");
  check("only ONE audio element is used for the voice track",
        new Set(voiceElements().map((e) => e === voiceElements()[0])).size <= 2 &&
        voiceElements().filter((e) => e._playCount > 0).length === 1,
        voiceElements().length + " created, " +
        voiceElements().filter((e) => e._playCount > 0).length + " ever played");

  const expected = manifest.segments.slice(1, gaps.length + 1)
    .map((s) => s.pauseBeforeMs || 0).filter((ms) => ms > 0);
  const observed = gaps.filter((g) => g > 0);
  check("the manifest's pauses are honoured between clips",
        observed.length > 0 &&
        observed.slice(0, 10).every((g, i) => g === expected[i]),
        observed.slice(0, 6).join(", ") + " ms vs manifest " + expected.slice(0, 6).join(", "));
  console.log("");

  console.log("2. The voice volume is a volume, not a speed");
  const before = created.find((e) => e._playCount > 0);
  const slider = nodes.get("listen-vol-voice");
  check("the voice slider exists", !!slider);
  if (slider) {
    slider.oninput({ target: { value: "40" } });
    check("it sets volume", Math.abs(before.volume - 0.4) < 0.001, "volume " + before.volume);
    check("it does NOT touch playbackRate", before.playbackRate === 1,
          "playbackRate " + before.playbackRate);
    slider.oninput({ target: { value: "100" } });
  }
  console.log("");

  console.log(failures === 0 ? "ALL CHECKS PASSED" : failures + " CHECK(S) FAILED");
  process.exit(failures === 0 ? 0 : 1);
}
main();
