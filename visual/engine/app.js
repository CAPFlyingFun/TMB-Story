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
  audio.src = url(scene.audio);
  const clock = new AudioClock(audio, { start, end, silent: q.has("silent") });
  const stage = new Stage($("world"), scene, sprites, url);

  const beats = anchors.segments.map((s) => s.startMs / 1000).filter((t) => t >= start - 0.01 && t < end);
  let dirty = true, lastDebug = 0, showDebug = q.get("debug") !== "0";
  $("debug").hidden = !showDebug;

  const view = () => ({
    w: window.innerWidth,
    h: window.innerHeight,
    safe: { top: 0, left: 0, right: 0, bottom: $("controls").offsetHeight * 0.6 },
  });

  function setPlaying(p) {
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
  $("dbg").onclick = () => {
    showDebug = !showDebug;
    $("debug").hidden = !showDebug;
  };
  const scrub = $("scrub");
  scrub.oninput = () => seek(start + (scrub.value / 1000) * (end - start));
  window.addEventListener("resize", () => (dirty = true));
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space") { e.preventDefault(); $("toggle").onclick(); }
    if (e.code === "ArrowRight") $("fwd").onclick();
    if (e.code === "ArrowLeft") $("back").onclick();
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
    if (clock.playing || dirty) {
      const st = timeline.evaluate(t);
      const cam = stage.render(st, view());
      $("fader").style.opacity = st.fade.toFixed(3);
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
          `clock   ${clock.playing ? "playing" : "paused"}${clock.virtual ? " · SILENT (no audio)" : ""}`;
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
