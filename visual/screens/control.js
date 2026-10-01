// Screen templates for the main control room (Chapters 2 and 3): the primary console, the
// secondary console and the mapping display on the west wall. The same contract as
// screens/console.js: a pure function of { local, params } returning HTML and CSS
// variables, so every screen is as seekable as the rest of the scene.
//
// What TOMBS says aloud comes from the manifest (params.text), so the screen always shows
// exactly the line the audio speaks. Nothing here is narrated or canon.
//
// ONE RULE ABOVE THE REST: THE SCALE FACTOR IS NEVER SHOWN. The manuscript has Jack and
// Sarah stare at it and never says it, and the settlement's scale is a HIDDEN item in
// story-rules/WORLD_RULES.md. Every screen that carries it carries a value nobody can
// read -- placeholders, then a smeared lock -- and no template takes a number for it.

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const pad = (n, w) => String(n).padStart(w, "0");
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
const upper = (s, d) => esc(String(s || d).replace(/\.$/, "").toUpperCase());

// The array at work: four rings, their angles turning, the power climbing. `mw` is the
// figure Lena reads out (14, then 15), so the screen agrees with the call.
function array({ local, params }) {
  const turning = params.still ? 0 : 1;
  const rows = [0, 1, 2, 3].map((i) => {
    const a = (((local * (24 + i * 9) * turning) + i * 77) % 360).toFixed(1);
    return `<tr><td>RING ${i + 1}</td><td>${pad(a, 5)}&deg;</td><td class="${turning ? "hot" : ""}">${turning ? "MOVING" : "HOLD"}</td></tr>`;
  }).join("");
  const mw = params.mw !== undefined ? params.mw : 14;
  return {
    className: "ctl array",
    html: `<div class="bar"><span>TOMBS ARRAY</span><span>${params.offline ? "OFFLINE" : "UNSCHEDULED ACTIVITY"}</span></div>` +
      `<table>${rows}</table><div class="mw"><span>POWER DRAW</span><b>${esc(mw)} MW</b></div><div class="flash"></div>`,
    vars: { "--blink": (0.6 + 0.4 * Math.cos(local * Math.PI * 2 * 1.4)).toFixed(3) },
  };
}

// "Boundary emitters are active." / "Kill them." / "They're not responding."
function emitters({ local, params }) {
  const n = 12, r = rng(31);
  const bars = Array.from({ length: n }, (_, i) => {
    const lvl = 55 + 40 * Math.abs(Math.sin(local * 1.7 + i * 0.9 + r() * 3));
    return `<i style="height:${lvl.toFixed(0)}%"></i>`;
  }).join("");
  const refused = params.refusedAt !== undefined && local >= params.refusedAt;
  return {
    className: "ctl emit",
    html: `<div class="bar"><span>BOUNDARY EMITTERS</span><span>${n} / ${n} ACTIVE</span></div><div class="bars">${bars}</div>` +
      `<div class="cmd">EMITTER SHUTDOWN ${refused ? '<b class="no">NO RESPONSE</b>' : '<b class="wait">SENT&hellip;</b>'}</div><div class="flash"></div>`,
  };
}

// The console after the lever: dead, as it should be.
function dead() {
  return { className: "ctl dead", html: "" };
}

// "The screen was filling with data." -- lines arriving faster than anyone could read.
const DATA = (() => {
  const r = rng(77), out = [];
  const w = ["ACQ", "EMIT", "RING", "FIELD", "MAP", "SYNC", "PWR", "GRID"];
  for (let i = 0; i < 300; i++) out.push(`${pad(Math.floor(r() * 99999), 5)} ${w[Math.floor(r() * w.length)]}-${Math.floor(r() * 16)} ${(r() * 999).toFixed(2)} ${r() > 0.9 ? "LOCK" : "OK"}`);
  return out;
})();
function data({ local, params }) {
  const head = Math.floor(local * 14);
  const rows = DATA.slice(head % 280, (head % 280) + 14).map(esc).join("\n");
  const msg = params.text ? `<div class="banner">${upper(params.text)}</div>` : "";
  return { className: "ctl data", html: `<pre>${rows}</pre>${msg}<div class="flash"></div>` };
}

// "Boundary acquisition in progress." Then the target parameters -- "The values flickered,
// vanished, and returned as unreadable placeholders" from `hiddenAt` on.
function acquire({ local, params }) {
  const title = upper(params.text, "Boundary acquisition in progress");
  const spin = "|/-\\"[Math.floor(local * 6) % 4];
  let table = "";
  if (params.paramsAt !== undefined && local >= params.paramsAt) {
    const since = local - params.paramsAt, gone = params.hiddenAt !== undefined && local >= params.hiddenAt;
    const flick = !gone && since > 0.6 && Math.floor(since * 9) % 3 === 0;
    const r = rng(Math.floor(local * 9));
    const val = (i) => (gone ? "&#9618;&#9618;&#9618;&#9618;&#9618;" : flick ? "" : `${(r() * 900 + 100).toFixed(1)}`);
    table = `<table class="tp"><tr><th colspan="2">TARGET PARAMETERS</th></tr>` +
      ["EXTENT X", "EXTENT Y", "EXTENT Z", "PROFILE"].map((k, i) => `<tr><td>${k}</td><td class="${gone ? "ph" : ""}">${val(i)}</td></tr>`).join("") + `</table>`;
  }
  return {
    className: "ctl acq" + (params.highlight ? " hl" : ""),
    html: `<div class="acq-title">${title} <span>${spin}</span></div>${table}<div class="flash"></div>`,
    vars: { "--blink": (0.65 + 0.35 * Math.cos(local * Math.PI * 2)).toFixed(3) },
  };
}

// "Boundary acquired." / "Scale factor calculating." / "Scale factor locked." The value is
// never readable: calculating, it churns as smears; locked, it is one smeared block.
function scale({ local, params }) {
  const lines = (params.lines || []).map((l) => `<div class="ln">${upper(l)}</div>`).join("");
  const locked = !!params.locked;
  const r = rng(Math.floor(local * 12));
  const churn = Array.from({ length: 7 }, () => "\u2591\u2592\u2593"[Math.floor(r() * 3)]).join("");
  return {
    className: "ctl scale" + (locked ? " locked" : ""),
    html: `${lines}<div class="sf"><span>SCALE FACTOR</span><b>${locked ? "&#9619;&#9619;&#9619;&#9619;&#9619;&#9619;&#9619;" : churn}</b><em>${locked ? "LOCKED" : "CALCULATING"}</em></div><div class="flash"></div>`,
    vars: { "--blink": (0.6 + 0.4 * Math.cos(local * Math.PI * 2 * (locked ? 0.5 : 2))).toFixed(3) },
  };
}

// "Access denied." -- stamped, once per attempt.
function denied({ local, params }) {
  const n = params.count || 1;
  const stamps = Array.from({ length: n }, (_, i) => `<div class="stamp" style="top:${30 + i * 18}%">ACCESS DENIED</div>`).join("");
  return { className: "ctl denied", html: `<div class="bar"><span>MANUAL CONTROL</span><span>REQUEST</span></div>${stamps}<div class="flash"></div>` };
}

// Every light turned white.
function white() {
  return { className: "ctl white", html: "" };
}

// "The display had gone dark except for a single status light." / "TOMBS is offline."
function offline({ params }) {
  return { className: "ctl offline", html: `<i class="dot"></i>${params.label ? `<div class="lbl">TOMBS OFFLINE</div>` : ""}` };
}

// "Temperature, pressure, and atmosphere all looked normal. Structural sensors showed no
// collapse. The laboratory had power."
function sensors({ local }) {
  const rows = [["TEMPERATURE", "21.4 C"], ["PRESSURE", "101.3 kPa"], ["ATMOSPHERE", "NOMINAL"], ["STRUCTURE", "NO COLLAPSE"], ["POWER", "AVAILABLE"]];
  const shown = Math.min(rows.length, 1 + Math.floor(local * 2));
  return {
    className: "ctl sensors",
    html: `<div class="bar"><span>LOCAL SENSOR GRID</span><span>ALL NORMAL</span></div><table>${rows.slice(0, shown).map(([k, v]) => `<tr><td>${k}</td><td class="ok">${v}</td></tr>`).join("")}</table>`,
  };
}

// Communications, a row at a time as Lena answers each: internal fine, everything outside
// gone.
function comms({ params }) {
  const rows = [["INTERNAL", "ONLINE", "ok"], ["EXTERNAL", "NO LINK", "bad"], ["SATELLITE", "NO LINK", "bad"], ["RADIO", "NO LINK", "bad"], ["EMERGENCY", "SCANNING", "wait"]];
  const n = params.rows || 1;
  return {
    className: "ctl comms",
    html: `<div class="bar"><span>COMMUNICATIONS</span><span>SETTLEMENT</span></div><table>${rows.slice(0, n).map(([k, v, c]) => `<tr><td>${k}</td><td class="${c}">${v}</td></tr>`).join("")}</table>`,
  };
}

// The perimeter cameras, each the picture the manuscript describes, drawn rather than
// filmed. `cam`: 1 the northern edge under grass, 2 the western road ending at a wall of
// earth, 3 the tree whose trunk will not fit, 4 the communications building's camera turned
// toward the coast (no horizon, only stems, leaves and soil), 5 the southern security light
// on a curved glass wall -- the drop of water.
function cam({ local, params }) {
  const n = params.cam || 1;
  const labels = { 1: "CAM 01  NORTH EDGE", 2: "CAM 02  WEST ROAD", 3: "CAM 03  EAST GROVE", 4: "COMMS BLDG  PTZ", 5: "CAM 07  SOUTH LIGHT" };
  const t = local;
  let svg = "";
  const blades = (seed, n0, base, top) => {
    const r = rng(seed);
    let s2 = "";
    for (let i = 0; i < n0; i++) {
      const x = r() * 640, w = 18 + r() * 46, lean = (r() - 0.5) * 120, shade = 30 + Math.floor(r() * 40);
      s2 += `<path d="M${x - w / 2} ${base} Q${x + lean * 0.4} ${(base + top) / 2} ${x + lean} ${top + r() * 60} Q${x + lean * 0.4 + w * 0.3} ${(base + top) / 2} ${x + w / 2} ${base} Z" fill="rgb(${shade - 12},${shade + 30},${shade - 8})"/>`;
    }
    return s2;
  };
  if (n === 1) svg = `<rect width="640" height="348" fill="#05090a"/><rect y="250" width="640" height="98" fill="#1a1f22"/><rect x="40" y="200" width="120" height="60" fill="#2b3338"/>${blades(4, 22, 360, -40)}`;
  else if (n === 2) svg = `<rect width="640" height="348" fill="#06080a"/><path d="M250 348 L300 180 L340 180 L400 348 Z" fill="#20262a"/><path d="M0 170 Q320 120 640 175 L640 348 L0 348 Z" fill="#2a1f16"/><path d="M0 170 Q320 120 640 175 L640 190 Q320 140 0 186 Z" fill="#3d2d1e"/>${blades(9, 10, 175, -30)}<path d="M250 348 L300 180 L340 180 L400 348 Z" fill="#20262a"/>`;
  else if (n === 3) svg = `<rect width="640" height="348" fill="#050707"/><rect x="60" y="0" width="520" height="348" fill="#2b2118"/>${Array.from({ length: 14 }, (_, i) => `<path d="M${70 + i * 37} 0 Q${60 + i * 37 + 12} 174 ${74 + i * 37} 348" stroke="#1d160f" stroke-width="7" fill="none"/>`).join("")}<rect x="0" y="300" width="640" height="48" fill="#141815"/>`;
  else if (n === 4) {
    const pan = (Math.sin(t * 0.25) * 60).toFixed(1);
    svg = `<rect width="640" height="348" fill="#040606"/><g transform="translate(${pan} 0)">${blades(21, 26, 380, -60)}<path d="M-100 260 Q200 220 400 270 T760 250 L760 348 L-100 348 Z" fill="#2b1f15"/><ellipse cx="460" cy="90" rx="120" ry="40" fill="#1c3a1e" transform="rotate(-18 460 90)"/></g>`;
  } else if (n === 5) {
    const slide = Math.min(1, t / 6), y = 80 + slide * 120;
    svg = `<rect width="640" height="348" fill="#030506"/><radialGradient id="lt" cx="0.2" cy="0.1" r="0.9"><stop offset="0" stop-color="#ffe7b0" stop-opacity="0.55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient><rect width="640" height="348" fill="url(#lt)"/>` +
      `<path d="M0 300 L640 290 L640 348 L0 348 Z" fill="#1d2124"/>` +
      `<ellipse cx="350" cy="210" rx="250" ry="190" fill="rgba(150,200,220,0.10)" stroke="rgba(220,240,255,0.55)" stroke-width="3"/>` +
      `<ellipse cx="290" cy="130" rx="70" ry="28" fill="rgba(255,255,255,0.35)" transform="rotate(-25 290 130)"/>` +
      `<circle cx="${430}" cy="${y.toFixed(1)}" r="14" fill="rgba(210,235,255,0.6)"/>`;
  }
  const noise = Math.floor(t * 12) % 2 ? 0.05 : 0.08;
  return {
    className: "ctl cam",
    html: `<svg viewBox="0 0 640 348" preserveAspectRatio="xMidYMid slice">${svg}</svg><div class="cam-lbl">${labels[n]}</div><div class="rec">&#9679; REC</div>${params.zoom ? `<div class="zoom">ZOOM  MIN</div>` : ""}<div class="noise" style="opacity:${noise}"></div>`,
  };
}

// "No seismic event."
function structural({ local }) {
  let d = "M0 60";
  for (let x = 0; x <= 600; x += 6) d += ` L${x} ${(60 + Math.sin(x / 7 + local * 4) * 3 * Math.sin(x / 90)).toFixed(1)}`;
  return { className: "ctl struct", html: `<div class="bar"><span>STRUCTURAL MONITOR</span><span>NO SEISMIC EVENT</span></div><svg viewBox="0 0 600 120" preserveAspectRatio="none"><path d="${d}"/></svg>` };
}

// "Boundary event complete." Below it, the scale factor -- unreadable.
function eventlog({ params }) {
  return {
    className: "ctl eventlog",
    html: `<div class="bar"><span>TOMBS EVENT LOG</span><span>1 RECORD</span></div><div class="rec1">${upper(params.text, "Boundary event complete")}</div>` +
      `<div class="sf"><span>SCALE FACTOR</span><b>&#9619;&#9619;&#9619;&#9619;&#9619;&#9619;&#9619;</b></div>`,
  };
}

// The settlement map: dark, then (params.flashAt) a red outline for less than a second that
// clears itself; or, in Chapter 3, the boundary overlaid on the settlement, stopping "almost
// perfectly where the developed town gave way to untouched island".
const TOWN = "M120 210 L160 120 L250 90 L330 104 L400 80 L470 120 L520 190 L500 260 L430 300 L330 296 L240 310 L160 280 Z";
function townMap(extra) {
  const r = rng(12);
  let blocks = "";
  for (let i = 0; i < 46; i++) {
    const x = 150 + r() * 330, y = 110 + r() * 170;
    blocks += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${(10 + r() * 22).toFixed(0)}" height="${(8 + r() * 14).toFixed(0)}" fill="#24485c"/>`;
  }
  return `<svg viewBox="0 0 640 380" preserveAspectRatio="xMidYMid meet"><rect width="640" height="380" fill="#061019"/><path d="M0 0 H640 V380 H0 Z" fill="#0b1a12"/>` +
    `<path d="${TOWN}" fill="#0d2230"/>${blocks}<path d="M170 300 L330 150 L470 250" stroke="#335a6e" stroke-width="5" fill="none"/>${extra}</svg>`;
}
function map({ local, params }) {
  let extra = "";
  if (params.flashAt !== undefined && local >= params.flashAt && local < params.flashAt + 0.7) extra = `<path d="${TOWN}" fill="none" stroke="#ff3020" stroke-width="5"/>`;
  if (params.overlay) {
    const p = Math.min(1, local / 3);
    extra = `<path d="${TOWN}" fill="rgba(255,48,32,0.10)" stroke="#ff3020" stroke-width="4" stroke-dasharray="2200" stroke-dashoffset="${(2200 * (1 - p)).toFixed(0)}"/>`;
  }
  const cleared = params.flashAt !== undefined && local >= params.flashAt + 0.7;
  const msg = params.denied ? `<div class="mapmsg">MAPPING ACCESS DENIED</div>` : "";
  return { className: "ctl map", html: `${townMap(extra)}<div class="bar2">SETTLEMENT MAP${cleared ? " &middot; CLEARED" : ""}</div>${msg}` };
}

// A console with nothing new on it: the settlement's normal status board.
function status() {
  const r = rng(3);
  const rows = ["GRID", "WATER", "HVAC", "MEDICAL", "HOUSING", "WORKSHOPS"].map((k) => `<tr><td>${k}</td><td class="ok">${r() > 0.1 ? "NORMAL" : "CHECK"}</td></tr>`).join("");
  return { className: "ctl sensors", html: `<div class="bar"><span>SETTLEMENT STATUS</span><span>NIGHT</span></div><table>${rows}</table>` };
}

export const controlTemplates = { array, emitters, dead, data, acquire, scale, denied, white, offline, sensors, comms, cam, structural, eventlog, status };
export const mapTemplates = { map, dead, white };
