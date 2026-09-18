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
    this._playCount += 1;
    if (this._rejectWith) {
      const err = new Error(this._rejectWith);
      err.name = this._rejectWith;
      return Promise.reject(err);
    }
    if (this._failLoad) {
      // A real element fires `error` and never starts.
      (this._handlers.error || []).forEach((f) => f());
      return Promise.resolve();
    }
    this.paused = false;
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

  console.log("2. Nothing changes the speed");
  const el = created.find((e) => e._playCount > 0);
  check("the one voice element ends at rate 1", el && el.playbackRate === 1,
        "playbackRate " + (el && el.playbackRate));
  check("the rate control offers nothing above 1.5x",
        !/value="(2|2\.5|3)"/.test(body.innerHTML),
        "a speed the listener did not choose has to come from somewhere");
  console.log("");

  console.log("3. A clip that will not load");
  /* The reported symptom, reproduced: the voice races through clip after clip and
     then dies while the beds keep looping. A real element fires `error` on itself
     with its src still set, so that is what the harness does -- an earlier version
     cleared data-src first, which the player rightly ignores as a stale error, and
     the check passed for the wrong reason. */
  const a = created.find((e) => e._playCount > 0);
  function browserError() { (a._handlers.error || []).forEach((f) => f()); }
  function bedsSounding() {
    return created.filter((e) => /\/sfx\//.test(e._src) && e.loop && !e.paused).length;
  }

  // (a) one blip is retried, not skipped
  const attemptsBefore = a._playCount;
  browserError();
  await flush();
  await advance();                            // the retry timer fires
  check("a single load failure is RETRIED, not skipped",
        a._playCount > attemptsBefore && !a.paused,
        "play attempts went " + attemptsBefore + " -> " + a._playCount);

  // (b) a play() the next load supersedes is normal, not a fault
  a._rejectWith = "AbortError";
  a.play().catch(() => {});
  await flush();
  a._rejectWith = null;
  check("an AbortError does not stop the audiobook",
        !/Playback stopped here/.test(body.innerHTML),
        "a play() interrupted by the next load is the browser being busy");

  // (c) a RUN of failures stops and says so, instead of sprinting to the end
  // The failure has to PERSIST. An earlier version fired one error per turn and let
  // the next play() succeed, which cleared the counter every time and made the run
  // look endless -- the harness testing its own recovery rather than the player's.
  a._failLoad = true;
  let attempts = 0;
  browserError();
  await flush();
  for (let i = 0; i < 40; i++) {
    if (/Playback stopped here/.test(body.innerHTML)) break;
    if ((await advance()) < 0) break;
    attempts += 1;
  }
  const stopped = /Playback stopped here/.test(body.innerHTML);
  check("a run of failures stops playback instead of racing the chapter", stopped,
        stopped ? "gave up after " + attempts + " error(s), and the page says why"
                : "still skipping after " + attempts + " error(s)");
  check("it gives up EARLY, not at the end of the chapter",
        attempts < 20, attempts + " error(s) before stopping");
  // stopBed fades first and pauses on a timer, so the clock has to reach it.
  for (let i = 0; i < 8; i++) { if ((await advance()) < 0) break; }
  check("the beds are stopped too, so nothing loops over a dead voice",
        bedsSounding() === 0, bedsSounding() + " bed(s) still sounding");
  console.log("");

  console.log(failures === 0 ? "ALL CHECKS PASSED" : failures + " CHECK(S) FAILED");
  process.exit(failures === 0 ? 0 : 1);
}
main();
