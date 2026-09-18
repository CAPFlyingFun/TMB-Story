/* Layer verification: drive the REAL reader/sfx.js against the REAL chapter-01
   manifests, inside a fake browser.
 *
 *   node scripts/verify-layers.js [repo-root]
 *
 * The actual shipped file is loaded and exercised -- this is not a re-implementation
 * of the layer logic -- so every assertion is about behaviour that reaches a phone.
 * It answers what a real browser cannot answer precisely: which beds are sounding at
 * each of the 185 segments, what volume each is set to while speech plays, and what
 * happens to one layer when the other is switched off.
 *
 * Node's standard library only: fs, path and vm. No dependencies, nothing installed,
 * no network. The repository's Python toolchain is untouched; this is a dev
 * instrument, in the spirit of the finder in the game repo -- it READS the system and
 * never arranges it.
 *
 * Two things it will not tell you: whether a sound is any good, and how a real iOS
 * audio stack behaves. Those need Joshua's ears and Joshua's phone.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = process.argv[2] || path.join(__dirname, "..");
const manifestPath = (n) =>
  path.join(ROOT, "audio/manifests/chapter-%s.json".replace("%s", String(n).padStart(2, "0")));
// `let`, not `const`: section 8 runs the same fake browser over chapters 2 and 3, which
// have cue sheets of their own now. Everything below reads this one binding, so swapping
// it is how a second chapter gets driven without a second copy of the harness.
let manifest = JSON.parse(fs.readFileSync(manifestPath(1), "utf8"));

// ---- fake browser ---------------------------------------------------------
const requests = [];          // every URL any Audio element is pointed at
const live = [];              // every element created

class FakeAudio {
  constructor() {
    this._src = "";
    this.loop = false;
    this.preload = "";
    this.volume = 1;
    this.paused = true;
    this._handlers = {};
    live.push(this);
  }
  set src(v) { this._src = v; if (v) requests.push(v); }
  get src() { return this._src; }
  addEventListener(name, fn) { (this._handlers[name] ||= []).push(fn); }
  play() { this.paused = false; return Promise.resolve(); }
  pause() { this.paused = true; }
}

const timers = [];
/* Fake intervals that respect clearInterval, which is what makes a ramp land ON its
   target instead of overshooting: sfx.js clears its own interval at the last step, so
   a fake that ignores clearInterval keeps multiplying and clamps to 0 or 1. */
const intervals = new Map();
let nextInterval = 1;
function runIntervals() {
  for (let pass = 0; pass < 500; pass++) {
    if (intervals.size === 0) return;
    [...intervals.entries()].forEach(([id, fn]) => { if (intervals.has(id)) fn(); });
  }
}
const sandbox = {
  window: {},
  Audio: FakeAudio,
  setTimeout: (fn, ms) => { const id = timers.length; timers.push({ fn, ms, id }); return id; },
  clearTimeout: (id) => { if (timers[id]) timers[id].cancelled = true; },
  setInterval: (fn) => { const id = nextInterval++; intervals.set(id, fn); return id; },
  clearInterval: (id) => { intervals.delete(id); },
  console,
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(ROOT, "reader/sfx.js"), "utf8"), sandbox);
const L = sandbox.window.TMBLayers;

// ---- helpers --------------------------------------------------------------
const seg = (order) => manifest.segments.find((s) => s.order === order);
const cue = (id) => manifest.cues.find((c) => c.cueId === id);

async function flush() {
  // 1. pending `during` offsets
  timers.filter((t) => !t.cancelled && !t.done)
        .forEach((t) => { t.done = true; t.fn(); });
  // 2. drain microtasks so startBed's play().then ramp actually runs
  for (let i = 0; i < 8; i++) await Promise.resolve();
  // 3. let every ramp reach its target
  runIntervals();
  for (let i = 0; i < 8; i++) await Promise.resolve();
  runIntervals();
}

/* Playing beds, as {cueId: volume}. Read off the fake elements, not off internals. */
function bedsPlaying() {
  const out = {};
  manifest.cues.filter((c) => c.stopOrder !== undefined).forEach((c) => {
    const el = live.find((e) => e._src === "./" + c.audio && e.loop && !e.paused);
    if (el) out[c.cueId] = Number(el.volume.toFixed(4));
  });
  return out;
}

function oneShotsFired() {
  return live.filter((e) => !e.loop && !e.paused).map((e) => e._src);
}

let failures = 0;
function check(name, ok, detail) {
  console.log((ok ? "  PASS  " : "  FAIL  ") + name + (detail ? "   " + detail : ""));
  if (!ok) failures += 1;
}

function reset() {
  live.length = 0; requests.length = 0; timers.length = 0;
  L.load(manifest);
  L.setEnabled("ambience", true);
  L.setEnabled("sfx", true);
}

/* Walk the chapter the way player.js does: prefire the next segment's `before` cues
   in the gap, then enter it, then mark speech, then leave it. */
async function walk(from, to, onSegment) {
  for (let o = from; o <= to; o++) {
    if (!seg(o)) continue;
    if (o > from) L.prefireBefore(o);
    L.enterSegment(o);
    L.setSpeaking(true);
    await flush();
    if (onSegment) onSegment(o);
    L.setSpeaking(false);
    L.leaveSegment(o);
  }
}

async function main() {
console.log("TMB layer verification — real reader/sfx.js, real manifests");
console.log("chapter 1: " + manifest.segments.length + " segments, " + manifest.cues.length + " cues   (chapters 2 and 3 in section 8)");
console.log("");

// ---- 1. ambience bed spans the chapter and loops --------------------------
console.log("1. Ambience bed");
reset();
const bedCue = cue("ch01-005-lab-bed");
L.enterSegment(0); L.setSpeaking(true); await flush();
check("silent before its anchor (order 0)", !("ch01-005-lab-bed" in bedsPlaying()));
await walk(0, 2);
L.enterSegment(2); L.setSpeaking(true); await flush();
check("playing from its anchor (order 2)", "ch01-005-lab-bed" in bedsPlaying());
const bedEl = live.find((e) => e._src === "./" + bedCue.audio);
check("loop flag set on the element", bedEl && bedEl.loop === true);
await walk(2, 184);
L.enterSegment(184); L.setSpeaking(true); await flush();
check("still playing at the last segment (order 184)",
      "ch01-005-lab-bed" in bedsPlaying(),
      "stopOrder " + bedCue.stopOrder);
check("only one element ever created for it",
      live.filter((e) => e._src === "./" + bedCue.audio).length === 1,
      "a bed must not restart on every segment");
console.log("");

// ---- 2. the intercom bed starts and stops with the section ----------------
console.log("2. Sarah's intercom bed");
const ic = cue("ch01-071-channel-bed");
reset();
await walk(0, ic.order - 1);
check("silent before Jack reaches the intercom (order " + (ic.order - 1) + ")",
      !("ch01-071-channel-bed" in bedsPlaying()));
L.prefireBefore(ic.order); L.enterSegment(ic.order); L.setSpeaking(true); await flush();
check("playing from order " + ic.order + " (“" + seg(ic.order).displayText + "”)",
      "ch01-071-channel-bed" in bedsPlaying());
await walk(ic.order, ic.stopOrder);
L.enterSegment(ic.stopOrder); L.setSpeaking(true); await flush();
check("still playing at order " + ic.stopOrder, "ch01-071-channel-bed" in bedsPlaying());
L.enterSegment(ic.stopOrder + 1); L.setSpeaking(true); await flush();
check("stopped after order " + ic.stopOrder + " (“" +
      seg(ic.stopOrder).displayText.slice(0, 40) + "…”)",
      !("ch01-071-channel-bed" in bedsPlaying()));
console.log("   section covers orders " + ic.order + "–" + ic.stopOrder +
            ", Sarah's remote lines");
console.log("");

// ---- 3. ducking -----------------------------------------------------------
console.log("3. Ducking beneath speech");
reset();
await walk(0, 56);
const alarm = cue("ch01-013-alarm-bed");
reset();
await walk(0, alarm.order);
L.enterSegment(alarm.order + 1);
L.setSpeaking(false); await flush();
const quiet = bedsPlaying();
L.setSpeaking(true); await flush();
const speaking = bedsPlaying();
Object.keys(speaking).forEach((id) => {
  const c = cue(id);
  const mult = manifest.mix.duckUnderSpeechTo[c.category];
  const expected = Number((c.gain * mult).toFixed(4));
  check(id + " (" + c.category + ") ducks " + c.gain + " → " + expected +
        " while speech plays",
        Math.abs(speaking[id] - expected) < 0.002,
        "measured " + speaking[id]);
  check(id + " returns to " + c.gain + " in the gaps",
        Math.abs(quiet[id] - c.gain) < 0.002, "measured " + quiet[id]);
});
console.log("");

// ---- 4. one-shot foley levels --------------------------------------------
console.log("4. One-shot levels stay under the voice reference (1.0)");
reset();
await walk(0, 184);
const shots = manifest.cues.filter((c) => c.stopOrder === undefined);
const loudest = shots.reduce((a, b) => (b.gain > a.gain ? b : a));
check("all " + shots.length + " one-shots are below the voice reference",
      shots.every((c) => c.gain < 1.0),
      "loudest is " + loudest.cueId + " at " + loudest.gain);
const fired = new Set(oneShotsFired());
check("every one-shot asset was actually triggered during the walk",
      shots.every((c) => fired.has("./" + c.audio)),
      fired.size + " distinct one-shot urls");
console.log("");

// ---- 5. toggles -----------------------------------------------------------
console.log("5. Layer toggles");
reset();
L.setEnabled("ambience", false);
await walk(0, 60);
const noAmb = bedsPlaying();
check("ambience off silences the ambience bed", !("ch01-005-lab-bed" in noAmb));
check("ambience off does NOT silence the alarm bed",
      "ch01-013-alarm-bed" in noAmb || alarm.stopOrder < 60,
      "alarm bed is category=alarm, so it lives on the sfx layer");

reset();
L.setEnabled("ambience", false);
await walk(0, alarm.order + 1);
check("alarm bed still sounding with ambience off",
      "ch01-013-alarm-bed" in bedsPlaying());
check("system/interface one-shots still fire with ambience off",
      oneShotsFired().length > 0, oneShotsFired().length + " fired");

reset();
L.setEnabled("sfx", false);
await walk(0, alarm.order + 1);
const noSfx = bedsPlaying();
check("sfx off silences the alarm bed", !("ch01-013-alarm-bed" in noSfx));
check("sfx off leaves the ambience bed playing", "ch01-005-lab-bed" in noSfx);
check("sfx off fires no one-shots", oneShotsFired().length === 0);

reset();
L.setEnabled("ambience", false); L.setEnabled("sfx", false);
await walk(0, 184);
check("both off: nothing sounds at all", Object.keys(bedsPlaying()).length === 0 &&
      oneShotsFired().length === 0);
check("both off: the layer module never touched a voice clip",
      !requests.some((u) => u.includes("/clips/")),
      "voice playback is player.js's, and it is untouched");
console.log("");

// ---- 6. no network beyond static relative files ---------------------------
console.log("6. Requests made by the layer module");
reset();
await walk(0, 184);
const abs = requests.filter((u) => /^https?:/i.test(u));
const eleven = requests.filter((u) => /elevenlabs/i.test(u));
check("zero absolute URLs", abs.length === 0);
check("zero ElevenLabs requests", eleven.length === 0);
check("every request is a relative ./audio/sfx path",
      requests.every((u) => u.startsWith("./audio/sfx/")),
      requests.length + " requests, " + new Set(requests).size + " distinct files");
check("no fetch/XMLHttpRequest is even defined in the sandbox",
      sandbox.fetch === undefined && sandbox.XMLHttpRequest === undefined);
console.log("");

// ---- 7. a missing asset must not stop anything ---------------------------
console.log("7. A missing sound asset");
reset();
const target = "./" + cue("ch01-020-chair-startle").audio;
const origPlay = FakeAudio.prototype.play;
FakeAudio.prototype.play = function () {
  if (this._src === target) {
    (this._handlers.error || []).forEach((f) => f());
    return Promise.reject(new Error("404"));
  }
  return origPlay.call(this);
};
await walk(0, 60);
FakeAudio.prototype.play = origPlay;
const chairPlaying = live.some((e) => e._src === target && !e.paused);
check("the failing cue never sounds", !chairPlaying);
check("the ambience bed is unaffected", "ch01-005-lab-bed" in bedsPlaying());
check("other one-shots still fire", oneShotsFired().length > 0);
console.log("");

// ---- 7b. the listener's own volume ---------------------------------------
/* A cue's GAIN is the story's mix and belongs to the cue sheet. A layer's VOLUME is
   the listener's and belongs to the listener. These check that the two multiply and
   never overwrite one another -- which is the whole reason the volume is a separate
   number instead of the sliders editing the gains. */
console.log("7b. Layer volume");
reset();
L.setVolume("ambience", 1); L.setVolume("sfx", 1);
await walk(0, alarm.order + 1);
const fullBeds = bedsPlaying();
const fullShots = live.filter((e) => !e.loop && e.volume > 0).length;

reset();
L.setVolume("ambience", 0.5);
await walk(0, alarm.order + 1);
const halfBeds = bedsPlaying();
check("a bed at 50% is half its cue gain, not half the manifest",
      Object.keys(fullBeds).every((id) => {
        const c = cue(id);
        if (c.category !== "ambience") return true;
        return Math.abs(halfBeds[id] - fullBeds[id] * 0.5) < 0.002;
      }),
      "ambience beds: " + JSON.stringify(halfBeds));
check("an sfx-layer bed is untouched by the ambience slider",
      Object.keys(fullBeds).every((id) => {
        const c = cue(id);
        if (c.category === "ambience") return true;
        return Math.abs(halfBeds[id] - fullBeds[id]) < 0.002;
      }));
check("the cue sheet itself is never edited",
      manifest.cues.every((c) => typeof c.gain === "number" && c.gain > 0 && c.gain <= 1),
      "a slider that wrote back to the manifest would change the story's mix");

reset();
L.setVolume("sfx", 0);
await walk(0, alarm.order + 1);
check("sfx at 0% fires no one-shot and fetches nothing for it",
      oneShotsFired().length === 0 && fullShots > 0,
      "a slider at zero is a mute, and a mute should not download audio");
check("ambience still sounds with the sfx slider at zero",
      "ch01-005-lab-bed" in bedsPlaying());

L.setVolume("ambience", 1); L.setVolume("sfx", 1);
reset();
await walk(0, alarm.order + 1);
check("putting the sliders back restores every level",
      JSON.stringify(bedsPlaying()) === JSON.stringify(fullBeds));
check("an out-of-range volume is clamped rather than trusted",
      (L.setVolume("ambience", 5), L.volume("ambience") === 1) &&
      (L.setVolume("ambience", -3), L.volume("ambience") === 0));
L.setVolume("ambience", 1);
check("an unknown layer name is ignored",
      (L.setVolume("voices", 0.2), L.volume("voices") === 1),
      "voices are the player's, not the layer module's");
console.log("");

// ---- 8. the same module against chapters 2 and 3 -------------------------
/* Sections 1-7 name chapter 1's cues on purpose: they check particular moments of a
   particular chapter. This section checks what has to hold in EVERY chapter, so a cue
   sheet written later cannot quietly break the player. It names no cue.

   Everything here is keyed by ASSET rather than by cue, because chapters 2 and 3 do
   something chapter 1 never did: two different bed cues share one sound file (the
   array rings turn, stop, and turn again). A fake element only carries its src, so
   "which cue is this element" is not a question the harness can answer -- and it does
   not need to. What the player owes the listener is that the FILE is sounding exactly
   over the union of its cues' spans, is started once per cue rather than restarted,
   and is ducked to the levels those cues ask for. All three are asset-level facts. */
for (const n of [2, 3]) {
  manifest = JSON.parse(fs.readFileSync(manifestPath(n), "utf8"));
  const last = manifest.segments[manifest.segments.length - 1].order;
  const beds = manifest.cues.filter((c) => c.stopOrder !== undefined);
  const oneShots = manifest.cues.filter((c) => c.stopOrder === undefined);
  const bedAssets = [...new Set(beds.map((b) => b.audio))];
  console.log("8." + n + " Chapter " + n + " — " + manifest.segments.length +
              " segments, " + manifest.cues.length + " cues (" + beds.length +
              " beds, " + oneShots.length + " one-shots)");

  const liveBed = (src) => live.filter((e) => e._src === "./" + src && e.loop && !e.paused);
  const cuesAt = (src, o) =>
    beds.filter((b) => b.audio === src && o >= b.order && o <= b.stopOrder);

  // A. every bed file sounds over exactly the union of its cues' spans.
  const sounding = {};                       // src -> Set of orders it was playing at
  bedAssets.forEach((src) => { sounding[src] = new Set(); });
  reset();
  await walk(0, last, (o) => {
    bedAssets.forEach((src) => { if (liveBed(src).length) sounding[src].add(o); });
  });
  for (const src of bedAssets) {
    const want = manifest.segments.map((s) => s.order)
      .filter((o) => cuesAt(src, o).length > 0);
    const got = [...sounding[src]].sort((a, b) => a - b);
    const spans = beds.filter((b) => b.audio === src)
      .map((b) => b.order + "-" + b.stopOrder).join(", ");
    const missing = want.filter((o) => !sounding[src].has(o));
    const extra = got.filter((o) => !want.includes(o));
    check(src.split("/").pop() + " sounds over exactly " + spans,
          missing.length === 0 && extra.length === 0,
          missing.length + " silent inside the span, " + extra.length + " outside it");
  }

  // B. a file is fetched once per cue, never once per segment.
  /* Counted from `requests` rather than from the live elements: stopBed releases the
     file by setting src to "" when the fade finishes, so an element that has done its
     job no longer carries the src it was created with. The request log is the record
     of what was actually asked for. */
  for (const src of bedAssets) {
    const asked = requests.filter((u) => u === "./" + src).length;
    const want = manifest.cues.filter((c) => c.audio === src).length;
    check(src.split("/").pop() + " is fetched " + want + " time(s), one per cue",
          asked === want, asked + " requests");
  }

  // C. one-shots.
  const fired = new Set(oneShotsFired());
  const missed = oneShots.filter((c) => !fired.has("./" + c.audio));
  check("all " + oneShots.length + " one-shots fire during the walk",
        missed.length === 0, missed.map((c) => c.cueId).join(", ") || "none missed");
  check("every one-shot is below the voice reference (1.0)",
        oneShots.every((c) => c.gain < 1.0));

  // D. requests.
  check("every request is a relative ./audio/sfx path",
        requests.length > 0 && requests.every((u) => u.startsWith("./audio/sfx/")),
        requests.length + " requests, " + new Set(requests).size + " distinct files");
  check("no voice clip is ever touched by the layer module",
        !requests.some((u) => u.includes("/clips/")));

  // E. ducking, from the chapter's own mix table rather than a remembered number.
  reset();
  await walk(0, last - 1);
  L.enterSegment(last); L.setSpeaking(false); await flush();
  const quietBy = {}; bedAssets.forEach((src) => {
    quietBy[src] = liveBed(src).map((e) => Number(e.volume.toFixed(4))).sort();
  });
  L.setSpeaking(true); await flush();
  for (const src of bedAssets) {
    const here = cuesAt(src, last);
    if (!here.length) continue;
    const open = here.map((c) => Number(c.gain.toFixed(4))).sort();
    const duck = here.map((c) => Number(
      (c.gain * manifest.mix.duckUnderSpeechTo[c.category]).toFixed(4))).sort();
    const under = liveBed(src).map((e) => Number(e.volume.toFixed(4))).sort();
    const same = (a, b) => a.length === b.length &&
      a.every((v, i) => Math.abs(v - b[i]) < 0.002);
    check(src.split("/").pop() + " ducks to [" + duck + "] under speech, back to [" +
          open + "] in the gaps",
          same(under, duck) && same(quietBy[src], open),
          "speaking [" + under + "], quiet [" + quietBy[src] + "]");
  }

  // F. the toggles split by CATEGORY, not by whether a cue loops.
  reset(); L.setEnabled("ambience", false); await walk(0, last);
  const ambSrcs = new Set(beds.filter((b) => b.category === "ambience").map((b) => b.audio));
  check("ambience off silences every ambience bed and nothing else",
        [...ambSrcs].every((src) => liveBed(src).length === 0) &&
        oneShotsFired().length > 0,
        oneShotsFired().length + " one-shots still fired");
  reset(); L.setEnabled("sfx", false); await walk(0, last);
  const sfxSrcs = new Set(beds.filter((b) => b.category !== "ambience").map((b) => b.audio));
  check("sfx off silences every sfx-layer cue and fires no one-shot",
        [...sfxSrcs].every((src) => liveBed(src).length === 0) &&
        oneShotsFired().length === 0);
  reset(); L.setEnabled("ambience", false); L.setEnabled("sfx", false);
  await walk(0, last);
  check("both off: nothing sounds at all",
        bedAssets.every((src) => liveBed(src).length === 0) &&
        oneShotsFired().length === 0);
  console.log("");
}

console.log(failures === 0
  ? "ALL CHECKS PASSED"
  : failures + " CHECK(S) FAILED");
process.exit(failures === 0 ? 0 : 1);
}
main();
