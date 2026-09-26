// Boots a visual-story scene: loads the chapter manifest, the sprites and the scene data,
// then renders the scene at whatever time the audio clock says, every frame.

import { AudioClock } from "./clock.js";
import { makeAnchors, compileScene } from "./timeline.js";
import { Stage } from "./stage.js";

const SCENES = { "ch01-opening": () => import("../scenes/ch01-opening.js") };

const q = new URLSearchParams(location.search);
const $ = (id) => document.getElementById(id);
const url = (p) => new URL(p, document.baseURI).href;
const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, "0")}`;
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
};

// Closed captions from the manifest: a long line is split into sentences, each given a
// share of the line's time in proportion to its length. Characters are named; the
// narrator is not.
function buildCaptions(segments, start, end) {
  const out = [];
  for (const s of segments) {
    const a = s.startMs / 1000, b = s.endMs / 1000;
    if (b < start || a > end) continue;
    const label = s.speaker === "narrator" ? "" : String(s.speakerName || s.speaker).split(" / ")[0].split(" ")[0];
    // A short line shows whole; only long narration is split, so "What?" never flashes alone.
    const parts = s.displayText.length <= 100 ? [s.displayText] : s.displayText.match(/[^.!?\u2026]+[.!?\u2026]+["\u201d\u2019)]*\s*|[^.!?\u2026]+$/g) || [s.displayText];
    const total = parts.reduce((n, p) => n + p.length, 0);
    let t = a;
    for (const p of parts) {
      const d = ((b - a) * p.length) / total;
      out.push({ start: t, end: t + d, text: p.trim(), label });
      t += d;
    }
  }
  return out;
}

async function loadImage(src) {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  try {
    await img.decode();
  } catch (e) {
    throw new Error("could not load " + src);
  }
}

async function boot() {
  const gateMsg = $("gate-msg");
  const scene = (await SCENES[q.get("scene") || "ch01-opening"]()).default;
  document.title = scene.title;
  const manifest = await (await fetch(url(scene.manifest))).json();
  const anchors = makeAnchors(manifest);
  const timeline = compileScene(scene, anchors);
  const start = anchors.resolve(scene.range.start);
  const end = anchors.resolve(scene.range.end);

  const sprites = {};
  const preload = [url(scene.world.background)];
  for (const [id, a] of Object.entries(scene.actors)) {
    const rec = await (await fetch(url(a.sprite + "sprite.json"))).json();
    rec.base = a.sprite;
    sprites[id] = rec;
    for (const pose of Object.values(rec.poses)) for (const f of Object.values(pose.frames)) preload.push(url(a.sprite + f.file));
  }
  gateMsg.textContent = "Loading the lab…";
  await Promise.all(preload.map(loadImage));

  const audio = $("audio");
  const clock = new AudioClock(audio, { src: url(scene.audio), start, end, silent: q.has("silent") });
  const stage = new Stage($("world"), scene, sprites, url);

  const beats = anchors.segments.map((s) => s.startMs / 1000).filter((t) => t >= start - 0.01 && t < end);
  let dirty = true, lastDebug = 0, showDebug = q.get("debug") === "1";
  $("debug").hidden = !showDebug;

  const view = () => ({
    w: window.innerWidth,
    h: window.innerHeight,
    safe: { top: 0, left: 0, right: 0, bottom: 0 }, // full frame: the controls float over it and hide
  });

  // Movie-style controls: hidden while playing, a tap on the picture brings them back,
  // and they fade again after a few seconds. While paused they stay.
  let uiTimer = 0;
  function showUI(ms = 3000) {
    document.body.classList.remove("ui-hidden");
    clearTimeout(uiTimer);
    if (clock.playing) uiTimer = setTimeout(() => clock.playing && document.body.classList.add("ui-hidden"), ms);
  }
  $("stage").addEventListener("click", (e) => {
    if (e.target.closest("button, a, input")) return;
    if (document.body.classList.contains("ui-hidden") || !clock.playing) showUI();
    else {
      clearTimeout(uiTimer);
      document.body.classList.add("ui-hidden");
    }
  });
  $("controls").addEventListener("pointerdown", () => showUI());

  // Captions: off unless turned on, and remembered.
  const captions = buildCaptions(anchors.segments, start, end);
  const capEl = $("captions");
  let ccOn = store.get("tmb.cc") === "1", capShown = null;
  function setCC(on) {
    ccOn = on;
    store.set("tmb.cc", on ? "1" : "0");
    $("cc").setAttribute("aria-pressed", on ? "true" : "false");
    capShown = null;
    dirty = true;
  }
  setCC(ccOn);
  $("cc").onclick = () => setCC(!ccOn);
  function drawCaption(t) {
    let c = null;
    for (const k of captions) {
      if (k.start <= t) c = k;
      else break;
    }
    if (c && t > c.end + 0.6) c = null;
    const html = ccOn && c ? (c.label ? `<b>${esc(c.label)}:</b> ` : "") + esc(c.text) : "";
    if (html !== capShown) {
      capShown = html;
      capEl.innerHTML = html;
      capEl.hidden = !html;
    }
  }

  let shownPlaying = null;
  function setPlaying(p) {
    shownPlaying = p;
    $("toggle").textContent = p ? "Pause" : "Play";
    $("toggle").setAttribute("aria-pressed", p ? "true" : "false");
  }
  async function play() {
    $("gate").hidden = true;
    $("endcard").hidden = true;
    await clock.play();
    setPlaying(true);
    dirty = true;
  }
  function pause() {
    clock.pause();
    setPlaying(false);
    dirty = true;
  }
  function seek(t) {
    clock.seek(t);
    $("endcard").hidden = true;
    dirty = true;
  }

  // The lock screen and the Dynamic Island drive the same play and pause as the buttons,
  // so pausing from there is a real pause rather than one the clock resumes.
  if ("mediaSession" in navigator) {
    try {
      navigator.mediaSession.metadata = new MediaMetadata({ title: scene.title, artist: "TRADDOMIUM: Micro Battle!" });
      navigator.mediaSession.setActionHandler("play", () => play());
      navigator.mediaSession.setActionHandler("pause", () => pause());
    } catch (e) {
      /* older browsers: the buttons still work */
    }
  }

  $("start").onclick = play;
  $("toggle").onclick = () => (clock.playing ? pause() : play());
  $("restart").onclick = () => {
    seek(start);
    play();
  };
  $("back").onclick = () => {
    const t = clock.now();
    const prev = beats.filter((b) => b < t - 0.8);
    seek(prev.length ? prev[prev.length - 1] : start);
  };
  $("fwd").onclick = () => {
    const t = clock.now();
    const next = beats.find((b) => b > t + 0.05);
    seek(next !== undefined ? next : end);
  };
  $("again").onclick = () => $("restart").onclick();

  const scrub = $("scrub");
  scrub.oninput = () => seek(start + (scrub.value / 1000) * (end - start));
  window.addEventListener("resize", () => (dirty = true));
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") { e.preventDefault(); $("toggle").onclick(); }
    if (e.code === "ArrowRight") $("fwd").onclick();
    if (e.code === "ArrowLeft") $("back").onclick();
    if (e.code === "KeyC") setCC(!ccOn);
    if (e.code === "KeyD") { showDebug = !showDebug; $("debug").hidden = !showDebug; }
  });

  if (q.has("t")) seek(parseFloat(q.get("t")));
  else seek(start);
  if (q.has("nogate")) $("gate").hidden = true;
  else {
    gateMsg.textContent = "";
    $("start").disabled = false;
  }

  function frame(now) {
    const t = clock.now();
    // The clock can stop on its own (the end, a phone call); the button follows it.
    if (clock.playing !== shownPlaying) {
      setPlaying(clock.playing);
      showUI(shownPlaying === null ? 3000 : 2200);
      dirty = true;
    }
    if (clock.playing || dirty) {
      const st = timeline.evaluate(t);
      const cam = stage.render(st, view());
      $("fader").style.opacity = st.fade.toFixed(3);
      $("loading").hidden = !(clock.playing && clock.waiting);
      drawCaption(t);
      if (document.activeElement !== scrub) scrub.value = Math.round(((t - start) / (end - start)) * 1000);
      $("clock").textContent = `${fmt(t - start)} / ${fmt(end - start)}`;
      if (showDebug && (now - lastDebug > 120 || !clock.playing)) {
        lastDebug = now;
        const j = st.actors.jack, line = anchors.lineAt(t);
        $("debug").textContent =
          `audio   ${fmt(t)}  (chapter)   scene ${fmt(t - start)}\n` +
          `scene   ${st.scene}\n` +
          `event   ${st.event ? st.event.label + "  @" + st.event.t.toFixed(2) : "—"}\n` +
          `jack    ${j.pose.v} · ${j.facing.v} · ${j.state.v} · x${j.x.toFixed(0)} y${j.y.toFixed(0)}\n` +
          `camera  ${cam.zoom.toFixed(2)}x · centre ${cam.cx.toFixed(0)},${cam.cy.toFixed(0)}\n` +
          `line    ${line ? `[${line.speakerName || line.speaker}] ${line.displayText.slice(0, 70)}${line.displayText.length > 70 ? "…" : ""}` : "—"}\n` +
          `media   ready ${audio.readyState} \u00b7 ${audio.paused ? "paused" : "running"}${audio.seeking ? " \u00b7 seeking" : ""} \u00b7 at ${audio.currentTime.toFixed(1)}\n` +
          `events  ${clock.log.join(" ") || "\u2014"}\n` +
          `clock   ${clock.playing ? (clock.waiting ? "waiting for audio\u2026" : "playing") : "paused"}${clock.virtual ? " · SILENT (no audio)" : ""}`;
      }
      dirty = false;
    }
    if (clock.ended) {
      setPlaying(false);
      $("endcard").hidden = false;
      clock.ended = false;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  window.__tmb = { clock, timeline, seek, scene }; // for probes and the console
}

boot().catch((err) => {
  console.error(err);
  $("gate-msg").textContent = "Could not start: " + err.message;
});
