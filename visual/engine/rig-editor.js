// The rig editor (visual/rig.html, development only). Pick a character, pose and
// direction; see the parts and pivots; drag pivots and part corners; turn joints; play
// the presets; export the rig as JSON for assets/characters/<name>/rig.json.

import { Rig, autoRig, mirrorRig, JOINTS } from "./rig.js";
import { PRESETS, PRESET_NAMES, poseFrom } from "./gestures.js";

const DIRS = ["south", "southwest", "west", "northwest", "north", "northeast", "east", "southeast"];
const $ = (id) => document.getElementById(id);
const store = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } },
};
const COLORS = ["#ff6b6b", "#ffd166", "#06d6a0", "#4cc9f0", "#b388ff", "#f78c6b", "#83e377", "#f15bb5", "#9bf6ff", "#fee440", "#00bbf9", "#e0aaff", "#ff99c8", "#caffbf"];

let sprite, rigFile, img, rig, built, angles = {}, selected = null, anim = null, scale = 1;
const cache = {};

for (const d of DIRS) $("dir").append(new Option(d, d));
for (const p of PRESET_NAMES) $("preset").append(new Option(p, p));
$("preset").value = "nod";

function key() { return `${$("pose").value}/${$("dir").value}`; }
// Browser edits are kept against the rig.json revision they were made on; when the file
// moves on (a newer, hand-traced rig), older edits are set aside rather than hiding it.
function revision() { return (rigFile && rigFile.revision) || 1; }
function edits() {
  const e = store.get("tmb.rig." + $("char").value);
  return e && e.revision === revision() && e.rigs ? e.rigs : {};
}
function saveEdit(r) { const e = edits(); e[key()] = r; store.set("tmb.rig." + $("char").value, { revision: revision(), rigs: e }); }
function dropEdit() { const e = edits(); delete e[key()]; store.set("tmb.rig." + $("char").value, { revision: revision(), rigs: e }); }

async function loadImage(src) {
  const i = new Image();
  i.src = src;
  await i.decode();
  return i;
}

async function loadCharacter() {
  const c = $("char").value;
  if (!cache[c]) {
    const base = `../assets/characters/${c}/`;
    const s = await (await fetch(base + "sprite.json")).json();
    let f = null;
    try { const r = await fetch(base + "rig.json"); if (r.ok) f = await r.json(); } catch (e) { /* none yet */ }
    cache[c] = { sprite: s, rigFile: f || { character: c, rigs: {} }, base };
  }
  ({ sprite, rigFile } = cache[c]);
  await loadView();
}

function currentRigData() {
  const k = key(), e = edits();
  if (e[k]) return e[k];
  if (rigFile.rigs[k]) return rigFile.rigs[k];
  const fr = sprite.poses[$("pose").value].frames[$("dir").value];
  const src = fr.mirrorOf && (e[`${$("pose").value}/${fr.mirrorOf}`] || rigFile.rigs[`${$("pose").value}/${fr.mirrorOf}`]);
  if (src) return mirrorRig(src);
  return autoRig(img, $("pose").value, $("dir").value);
}

async function loadView() {
  const c = cache[$("char").value], fr = sprite.poses[$("pose").value].frames[$("dir").value];
  img = await loadImage(c.base + fr.file);
  rig = JSON.parse(JSON.stringify(currentRigData()));
  angles = {};
  rebuild();
  buildJointList();
  layout();
  draw();
  const src = edits()[key()] ? "edited in this browser" : rigFile.rigs[key()] ? "from rig.json" : fr.mirrorOf ? `mirrored from ${fr.mirrorOf}` : "automatic";
  $("msg").textContent = `${$("char").value} · ${key()} · ${img.naturalWidth}x${img.naturalHeight} · rig: ${src}`;
}

function rebuild() { built = new Rig(img, rig, rigFile.limits || {}); }

function buildJointList() {
  const box = $("joints");
  box.innerHTML = "";
  for (const name of JOINTS) {
    if (!rig.joints[name]) continue;
    const row = document.createElement("div");
    row.className = "joint" + (name === selected ? " sel" : "");
    const cap = rig.joints[name].maxAngle !== undefined ? ` <i title="automatic shape: capped until drawn by hand">\u00b1${rig.joints[name].maxAngle}</i>` : "";
    row.innerHTML = `<span>${name}${cap}</span><input type="range" min="-45" max="45" step="0.5" value="${angles[name] || 0}"><b>${(angles[name] || 0).toFixed(1)}</b>`;
    const input = row.querySelector("input"), out = row.querySelector("b");
    input.oninput = () => { angles[name] = +input.value; out.textContent = (+input.value).toFixed(1); anim = null; draw(); };
    row.querySelector("span").onclick = () => { selected = name; buildJointList(); draw(); };
    box.append(row);
  }
}

function layout() {
  const main = document.querySelector("main"), M = built.M;
  const W = built.W + 2 * M, H = built.H + M;
  scale = Math.min((main.clientWidth - 20) / W, (main.clientHeight - 30) / H, 3);
  for (const id of ["bg", "ghost", "art", "ov"]) {
    const cv = $(id);
    cv.width = Math.round(W * scale);
    cv.height = Math.round(H * scale);
  }
  $("stagebox").style.width = $("bg").width + "px";
  $("stagebox").style.height = $("bg").height + "px";
}

const off = document.createElement("canvas");
function draw(pose = { angles, shift: {} }) {
  const M = built.M;
  built.draw(off, pose.angles, pose.shift);
  const g = $("art").getContext("2d");
  g.clearRect(0, 0, g.canvas.width, g.canvas.height);
  g.imageSmoothingQuality = "high";
  g.drawImage(off, 0, 0, g.canvas.width, g.canvas.height);
  const gh = $("ghost").getContext("2d");
  gh.clearRect(0, 0, gh.canvas.width, gh.canvas.height);
  if ($("showOriginal").checked) {
    gh.globalAlpha = 0.35;
    gh.drawImage(img, M * scale, M * scale, built.W * scale, built.H * scale);
    gh.globalAlpha = 1;
  }
  const o = $("ov").getContext("2d");
  o.clearRect(0, 0, o.canvas.width, o.canvas.height);
  const X = (x) => (M + x * built.W) * scale, Y = (y) => (M + y * built.H) * scale;
  const names = Object.keys(rig.joints);
  names.forEach((name, i) => {
    const j = rig.joints[name], col = COLORS[i % COLORS.length], sel = name === selected;
    if ($("showParts").checked || sel) {
      o.beginPath();
      j.polygon.forEach(([x, y], k) => (k ? o.lineTo(X(x), Y(y)) : o.moveTo(X(x), Y(y))));
      o.closePath();
      o.strokeStyle = col;
      o.lineWidth = sel ? 2.5 : 1.2;
      o.stroke();
      if ($("editShapes").checked) for (const [x, y] of j.polygon) { o.fillStyle = col; o.fillRect(X(x) - 4, Y(y) - 4, 8, 8); }
    }
    if ($("showPivots").checked || sel) {
      o.beginPath();
      o.arc(X(j.pivotX), Y(j.pivotY), sel ? 7 : 5, 0, 2 * Math.PI);
      o.fillStyle = col;
      o.fill();
      o.strokeStyle = "#000";
      o.lineWidth = 1.5;
      o.stroke();
      if (sel || $("showParts").checked) { o.fillStyle = "#fff"; o.font = "11px system-ui"; o.fillText(name, X(j.pivotX) + 8, Y(j.pivotY) - 6); }
    }
  });
}

// Dragging pivots and polygon corners (in the rest pose: the handles are drawn there).
let drag = null;
$("ov").addEventListener("pointerdown", (e) => {
  if (e.button !== 0) return; // right-click removes a corner (contextmenu), it never drags
  const r = $("ov").getBoundingClientRect(), M = built.M;
  const px = (e.clientX - r.left) / scale - M, py = (e.clientY - r.top) / scale - M;
  const near = (x, y) => Math.hypot(x * built.W - px, y * built.H - py) < 9 / scale + 3;
  // Traced parts overlap at the elbow and wrist, so the selected part's corners come first.
  const order = Object.entries(rig.joints).sort(([a], [b]) => (b === selected) - (a === selected));
  for (const [name, j] of order) {
    if ($("editShapes").checked) {
      const k = j.polygon.findIndex(([x, y]) => near(x, y));
      if (k >= 0) { drag = { name, k }; selected = name; break; }
    }
    if ($("showPivots").checked && near(j.pivotX, j.pivotY)) { drag = { name, pivot: true }; selected = name; break; }
  }
  if (drag) { $("ov").setPointerCapture(e.pointerId); angles = {}; buildJointList(); draw(); }
});
$("ov").addEventListener("pointermove", (e) => {
  if (!drag) return;
  const r = $("ov").getBoundingClientRect(), M = built.M;
  const x = +(((e.clientX - r.left) / scale - M) / built.W).toFixed(4), y = +(((e.clientY - r.top) / scale - M) / built.H).toFixed(4);
  const j = rig.joints[drag.name];
  if (drag.pivot) { j.pivotX = x; j.pivotY = y; } else { j.polygon[drag.k] = [x, y]; delete j.maxAngle; } // a hand-drawn shape may move freely
  rig.auto = false;
  draw();
});
$("ov").addEventListener("pointerup", () => {
  if (!drag) return;
  if (!drag.pivot) rebuild(); // a new shape needs new layers
  drag = null;
  saveEdit(rig);
  draw();
});

// Outlining a part closely: double-click near an edge of the selected part to add a
// corner there; Alt-click (or long-press-free: right-click) a corner to remove it.
function localPoint(e) {
  const r = $("ov").getBoundingClientRect(), M = built.M;
  return [((e.clientX - r.left) / scale - M) / built.W, ((e.clientY - r.top) / scale - M) / built.H];
}
$("ov").addEventListener("dblclick", (e) => {
  if (!selected || !$("editShapes").checked) return;
  const [x, y] = localPoint(e), poly = rig.joints[selected].polygon;
  let best = 0, bd = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const [ax, ay] = poly[i], [bx, by] = poly[(i + 1) % poly.length];
    const dx = (bx - ax) * built.W, dy = (by - ay) * built.H, L2 = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, (((x - ax) * built.W) * dx + ((y - ay) * built.H) * dy) / L2));
    const d = Math.hypot((ax + t * (bx - ax) - x) * built.W, (ay + t * (by - ay) - y) * built.H);
    if (d < bd) { bd = d; best = i; }
  }
  poly.splice(best + 1, 0, [+x.toFixed(4), +y.toFixed(4)]);
  delete rig.joints[selected].maxAngle;
  rig.auto = false;
  rebuild(); saveEdit(rig); draw();
});
function removeCorner(e) {
  if (!selected || !$("editShapes").checked) return false;
  const [x, y] = localPoint(e), poly = rig.joints[selected].polygon;
  const k = poly.findIndex(([px, py]) => Math.hypot((px - x) * built.W, (py - y) * built.H) < 9 / scale + 3);
  if (k < 0 || poly.length <= 3) return false;
  poly.splice(k, 1);
  rebuild(); saveEdit(rig); draw();
  return true;
}
$("ov").addEventListener("contextmenu", (e) => { if (removeCorner(e)) e.preventDefault(); });
$("ov").addEventListener("pointerdown", (e) => { if (e.altKey && removeCorner(e)) { drag = null; e.stopImmediatePropagation(); } }, true);

// Presets
$("play").onclick = () => {
  const dur = Math.max(0.2, +$("dur").value || 1.2), t0 = performance.now();
  anim = { name: $("preset").value, dur, t0, arm: $("arm").value || undefined };
  requestAnimationFrame(tick);
};
$("walk").onchange = () => { if ($("walk").checked) requestAnimationFrame(tick); else draw(); };
function tick(now) {
  const t = now / 1000, gestures = [];
  if (anim) {
    const u = (now - anim.t0) / 1000 / anim.dur;
    if (u >= 1) anim = null;
    else gestures.push({ name: anim.name, u, opts: { arm: anim.arm } });
  }
  const p = poseFrom(rig, gestures, t, $("walk").checked ? 1 : 0);
  for (const [k, v] of Object.entries(angles)) p.angles[k] = (p.angles[k] || 0) + v;
  draw(p);
  if (anim || $("walk").checked) requestAnimationFrame(tick);
  else draw();
}

$("reset").onclick = () => { angles = {}; anim = null; $("walk").checked = false; buildJointList(); draw(); };
$("auto").onclick = () => {
  rig = autoRig(img, $("pose").value, $("dir").value);
  saveEdit(rig);
  angles = {}; rebuild(); buildJointList(); draw();
};
// Forget this browser's edits to this view and show rig.json's again.
$("revert").onclick = () => { dropEdit(); loadView(); };

function exportAll() {
  // Everything known for this character: rig.json entries overlaid with this browser's edits.
  const out = { character: $("char").value, version: 1, revision: revision(), units: "normalized to the sprite canvas (0..1)", limits: rigFile.limits || {}, rigs: { ...rigFile.rigs, ...edits() } };
  return JSON.stringify(out, null, 1);
}
function copy(text) {
  $("out").value = text;
  navigator.clipboard && navigator.clipboard.writeText(text).catch(() => {});
}
$("copyView").onclick = () => copy(JSON.stringify({ character: $("char").value, key: key(), ...rig }, null, 1));
$("copyAll").onclick = () => copy(exportAll());
$("download").onclick = () => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([exportAll()], { type: "application/json" }));
  a.download = "rig.json";
  a.click();
};

for (const id of ["showParts", "showPivots", "editShapes", "showOriginal"]) $(id).onchange = () => draw();
for (const id of ["pose", "dir"]) $(id).onchange = () => loadView();
$("char").onchange = () => loadCharacter();
window.addEventListener("resize", () => { layout(); draw(); });
loadCharacter();
window.__rig = { get rig() { return rig; }, get built() { return built; }, PRESETS, loadView, draw, poseFrom }; // for probes
