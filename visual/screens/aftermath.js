// Screen templates for the night after the activation (Chapters 4 to 9), on the same three
// control-room screens as Chapters 2 and 3 (screens/control.js): the primary console, the
// secondary console and the mapping display. Same contract: a pure function of
// { local, params } returning HTML and CSS variables, so every screen is seekable.
//
// THE RULES control.js keeps, kept here:
//  - THE SCALE FACTOR IS NEVER SHOWN (story-rules/WORLD_RULES.md). "Several millimeters" is
//    said aloud in Chapter 6, so the calculator's answer is drawn as a smear with its unit.
//  - Nothing here names anyone the manuscript does not name. The checkout log, the badge
//    record and the lost-badge ticket show their names unreadable: the chapters say a
//    groundskeeper, "a woman he'd never met", and that Lena knows half the list.
//  - What is on a screen is what the chapter says is on it, drawn rather than filmed.

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
const bar = (a, b) => `<div class="bar"><span>${a}</span><span>${b}</span></div>`;
const SMEAR = "&#9619;&#9619;&#9619;&#9619;&#9619;";
const blurName = (r, w = 9) => `<span class="nm">${"x".repeat(5 + Math.floor(r() * w))} ${"x".repeat(4 + Math.floor(r() * w))}</span>`;
const clock = (p) => (p.clock ? `<div class="clk">${esc(p.clock)}</div>` : "");

// A grass blade in a drawn camera picture.
function blades(seed, n, base, top, w0 = 640, tint = 0) {
  const r = rng(seed);
  let s = "";
  for (let i = 0; i < n; i++) {
    const x = r() * w0, w = 18 + r() * 46, lean = (r() - 0.5) * 120, shade = 26 + Math.floor(r() * 34) + tint;
    s += `<path d="M${x - w / 2} ${base} Q${x + lean * 0.4} ${(base + top) / 2} ${x + lean} ${top + r() * 60} Q${x + lean * 0.4 + w * 0.3} ${(base + top) / 2} ${x + w / 2} ${base} Z" fill="rgb(${shade - 12},${shade + 28},${shade - 8})"/>`;
  }
  return s;
}
const camShell = (svg, label, t, extra = "") => {
  const noise = Math.floor(t * 12) % 2 ? 0.05 : 0.08;
  return { className: "ctl cam", html: `<svg viewBox="0 0 640 348" preserveAspectRatio="xMidYMid slice">${svg}</svg><div class="cam-lbl">${label}</div><div class="rec">&#9679; REC</div>${extra}<div class="noise" style="opacity:${noise}"></div>` };
};

// ---------------------------------------------------------------------------- Chapter 4
// An incoming call on the console, the way the wrist terminal shows it.
function call({ local, params }) {
  const ring = 0.6 + 0.4 * Math.cos(local * Math.PI * 4);
  return {
    className: "ctl call",
    html: `${bar("INCOMING", params.channel || "WRIST LINK")}<div class="who">${esc(params.who || "ISLAND UTILITY CONTROL")}</div><div class="sub">${esc(params.sub || "")}</div>${clock(params)}`,
    vars: { "--ring": ring.toFixed(3) },
  };
}

// "The utility station appeared intact beneath its exterior lights. Transformers, service
// vehicles, and the perimeter fence ... Beyond the fence stood a wall of brown earth. Roots
// curled through it like heavy cables. Pebbles protruded from the surface, except one pebble
// appeared nearly as tall as the utility building." Then (Chapter 4's end) dust trickling,
// a shadow crossing the lit soil, stepped through frame by frame, and a pebble rolling down.
// params: zoom, dust, shadow (0..1 across, or undefined), frame (a frozen frame number),
// pebble (0..1, its roll).
function utilcam({ local, params }) {
  const z = params.zoom ? 1.35 : 1;
  const r = rng(5);
  let roots = "", pebbles = "";
  for (let i = 0; i < 9; i++) {
    const y = 30 + r() * 140, x0 = r() * 640;
    roots += `<path d="M${x0} ${y} q${60 + r() * 80} ${20 + r() * 40} ${140 + r() * 120} ${r() * 30 - 10}" stroke="#4a3220" stroke-width="${6 + r() * 8}" fill="none" stroke-linecap="round"/>`;
  }
  for (let i = 0; i < 14; i++) pebbles += `<ellipse cx="${r() * 640}" cy="${20 + r() * 170}" rx="${6 + r() * 12}" ry="${5 + r() * 9}" fill="#6a5a48"/>`;
  // the one pebble as tall as the building, and later the one that rolls
  const roll = params.pebble === true ? Math.min(1, local / 1.6) : params.pebble !== undefined ? Math.min(1, params.pebble) : 0; // true: it rolls now
  const py = 120 + roll * 120, px = 470 - roll * 30;
  const big = `<ellipse cx="160" cy="150" rx="70" ry="58" fill="#7a6a56"/><ellipse cx="140" cy="132" rx="30" ry="18" fill="#8d7d68"/>`;
  const rolling = params.pebble !== undefined ? `<ellipse cx="${px}" cy="${py}" rx="34" ry="28" fill="#776652"/>` + (roll >= 1 ? `<ellipse cx="${px}" cy="${py + 30}" rx="${90}" ry="16" fill="rgba(140,110,80,0.45)"/>` : "") : "";
  const dust = params.dust ? Array.from({ length: 18 }, (_, i) => { const rr = rng(i + 40); const x = 200 + rr() * 300, y = ((local * (30 + rr() * 30) + rr() * 200) % 200); return `<circle cx="${x}" cy="${y}" r="${1 + rr() * 2}" fill="rgba(170,140,100,.7)"/>`; }).join("") : "";
  const sh = params.shadow !== undefined ? `<path d="M${-120 + params.shadow * 900} 40 q60 -20 120 10 l-30 140 q-50 20 -110 -10 Z" fill="rgba(0,0,0,0.55)"/>` : "";
  const svg = `<g transform="translate(320 174) scale(${z}) translate(-320 -174)"><rect width="640" height="348" fill="#2e2016"/>` +
    `<rect width="640" height="215" fill="#3d2a1a"/>${roots}${pebbles}${big}${sh}${dust}${rolling}` +
    `<rect y="215" width="640" height="133" fill="#14181b"/>` +
    // the fence and the station's lit yard
    Array.from({ length: 17 }, (_, i) => `<rect x="${i * 40}" y="196" width="3" height="60" fill="#8a9298"/>`).join("") +
    `<rect y="196" width="640" height="2" fill="#8a9298"/><rect x="40" y="236" width="150" height="70" fill="#2e3a40"/><rect x="60" y="226" width="40" height="14" fill="#3d4a50"/>` +
    `<rect x="260" y="246" width="54" height="40" fill="#4a5258"/><rect x="330" y="246" width="54" height="40" fill="#4a5258"/><rect x="470" y="262" width="96" height="36" fill="#d0d4d0"/><rect x="478" y="250" width="60" height="14" fill="#a8b0b0"/>` +
    `<radialGradient id="ul" cx="0.5" cy="0.75" r="0.7"><stop offset="0" stop-color="#ffe6b0" stop-opacity="0.35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient><rect width="640" height="348" fill="url(#ul)"/></g>`;
  const frame = params.frame !== undefined ? `<div class="zoom">FRAME ${String(params.frame).padStart(4, "0")}  &#10074;&#10074;</div>` : params.zoom ? `<div class="zoom">ZOOM 2.0</div>` : "";
  return camShell(svg, "UTILITY STATION  EXT 03", local, frame);
}

// SOUTH PATROL: ROAD ENDS AT PERIMETER. REQUEST INSTRUCTIONS.
function message({ params }) {
  return { className: "ctl msg", html: `${bar("SETTLEMENT SECURITY", params.unit || "UNIT 12")}<div class="txt">${esc(params.text || "")}</div>${clock(params)}` };
}

// The settlement's infrastructure schematic: power, water, drainage, communications and
// service conduits, several ending exactly at the red boundary. `trace`: the freshwater
// intake highlighted toward the reservoir, which past the boundary is simply not there.
const TOWN = "M120 210 L160 120 L250 90 L330 104 L400 80 L470 120 L520 190 L500 260 L430 300 L330 296 L240 310 L160 280 Z";
function infra({ local, params }) {
  const r = rng(8);
  let lines = "";
  const col = ["#ffcf6a", "#4ab8ff", "#7d8a96", "#c08aff", "#52e0b0"];
  for (let i = 0; i < 26; i++) {
    const x0 = 160 + r() * 330, y0 = 110 + r() * 170, x1 = 160 + r() * 330, y1 = 110 + r() * 170;
    lines += `<path d="M${x0} ${y0} L${x1} ${y0} L${x1} ${y1}" stroke="${col[i % 5]}" stroke-width="2" fill="none" opacity="0.8"/>`;
  }
  // the external connections, cut at the boundary
  const ext = [["M470 200 L520 196", "#ffcf6a"], ["M430 150 L492 150", "#4ab8ff"], ["M250 180 L132 186", "#c08aff"], ["M330 280 L332 296", "#7d8a96"]];
  const cuts = ext.map(([d, c]) => `<path d="${d}" stroke="${c}" stroke-width="3" fill="none"/>`).join("");
  const p = params.trace ? Math.min(1, local / 2) : 0;
  const intake = params.trace ? `<path d="M380 210 L430 150 L492 150" stroke="#4ab8ff" stroke-width="6" fill="none" stroke-dasharray="220" stroke-dashoffset="${(220 * (1 - p)).toFixed(0)}"/><circle cx="492" cy="150" r="7" fill="none" stroke="#fff" stroke-width="2" opacity="${p}"/><text x="500" y="140" fill="#bfe6ff" font-size="15" opacity="${p}">INTAKE  &#8594;  NO SIGNAL</text><text x="560" y="110" fill="#3a5568" font-size="14">RESERVOIR</text>` : "";
  return {
    className: "ctl map",
    html: `<svg viewBox="0 0 640 380"><rect width="640" height="380" fill="#061019"/><path d="${TOWN}" fill="#0b1c28"/>${lines}${cuts}<path d="${TOWN}" fill="none" stroke="#ff3020" stroke-width="3"/>${intake}</svg><div class="bar2">INFRASTRUCTURE SCHEMATIC</div>`,
  };
}

// "The pipe emerged from beneath a utility building and crossed several meters of developed
// ground ... Instead, it ended. The exposed end was smooth. No torn metal." `angle` 1 or 2.
function pipecam({ local, params }) {
  const a = params.angle || 1;
  const svg = a === 1
    ? `<rect width="640" height="348" fill="#0a0d0f"/><radialGradient id="wl" cx="0.45" cy="0.55" r="0.6"><stop offset="0" stop-color="#e8e0c8" stop-opacity="0.35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>` +
      `<rect y="230" width="640" height="118" fill="#2a2e31"/><rect x="0" y="120" width="170" height="130" fill="#3a444a"/><rect width="640" height="348" fill="url(#wl)"/>` +
      `<rect x="150" y="196" width="330" height="44" fill="#8a98a0"/><rect x="150" y="196" width="330" height="10" fill="#c0ccd2"/><rect x="150" y="232" width="330" height="8" fill="#5a666c"/>` +
      `<ellipse cx="480" cy="218" rx="10" ry="22" fill="#d8e2e6"/><ellipse cx="480" cy="218" rx="6" ry="16" fill="#1a2024"/>` +
      `<rect x="482" y="150" width="158" height="198" fill="#2c2016"/><g transform="translate(486 0)">${blades(13, 5, 230, 40, 150, -6)}</g>`
    : `<rect width="640" height="348" fill="#0a0d0f"/><rect y="250" width="640" height="98" fill="#1c2023"/>` +
      `<ellipse cx="300" cy="190" rx="120" ry="120" fill="#7d8a92"/><ellipse cx="300" cy="190" rx="100" ry="100" fill="#141a1e"/><ellipse cx="300" cy="190" rx="112" ry="112" fill="none" stroke="#c8d2d6" stroke-width="3" opacity=".6"/>` +
      `<path d="M190 120 q40 -30 90 -40" stroke="#e8f0f2" stroke-width="4" fill="none" opacity=".5"/>`;
  return camShell(svg, `MAINT  E-SERVICE ${a === 1 ? "04" : "05"}`, local);
}

// Sarah's console: the incoming reports, sorted by medical, structural and utility.
function reports({ local, params }) {
  const rows = [["MEDICAL", "STABLE", "ok"], ["STRUCTURAL", "NO DAMAGE", "ok"], ["UTILITY", "3 FAULTS", "wait"], ["SECURITY", "PERIMETER", "wait"], ["RESIDENTIAL", "ASLEEP", "ok"]];
  const n = Math.min(rows.length, params.rows || 1 + Math.floor(local / 1.2));
  return { className: "ctl sensors", html: `${bar("INCOMING REPORTS", "BY PRIORITY")}<table>${rows.slice(0, n).map(([k, v, c]) => `<tr><td>${k}</td><td class="${c}">${v}</td></tr>`).join("")}</table>${clock(params)}` };
}

// The residential blocks at night, a porch light at a time (params.lit, 0 .. 1).
function homes({ local, params }) {
  const r = rng(12);
  let blocks = "";
  const lit = params.lit || 0;
  for (let i = 0; i < 46; i++) {
    const x = 150 + r() * 330, y = 110 + r() * 170, on = r() < lit * 0.35;
    blocks += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${(10 + r() * 22).toFixed(0)}" height="${(8 + r() * 14).toFixed(0)}" fill="#1c3646"/>` + (on ? `<circle cx="${(x + 6).toFixed(0)}" cy="${(y + 5).toFixed(0)}" r="3" fill="#ffd27a"/>` : "");
  }
  const marks = (params.marks || []).map(([x, y, s]) => `<circle cx="${x}" cy="${y}" r="${8 + 4 * Math.sin(local * 4)}" fill="none" stroke="#ff7a3a" stroke-width="3"/><text x="${x + 14}" y="${y + 5}" fill="#ffb080" font-size="14">${esc(s || "")}</text>`).join("");
  return { className: "ctl map", html: `<svg viewBox="0 0 640 380"><rect width="640" height="380" fill="#061019"/><path d="M0 0 H640 V380 H0 Z" fill="#0b1a12"/><path d="${TOWN}" fill="#0d2230"/>${blocks}<path d="${TOWN}" fill="none" stroke="#ff3020" stroke-width="2" opacity=".6"/>${marks}</svg><div class="bar2">${esc(params.title || "SETTLEMENT MAP · RESIDENTIAL")}</div>` };
}

// "We have a water estimate." Words, not numbers: "Several days".
function water({ params }) {
  const rows = [["STORED WATER", "TANKS ONLY", "wait"], ["RESERVOIR", "NOT CONNECTED", "bad"], ["NORMAL USE", "SEVERAL DAYS", "wait"], ["RESTRICTED", "LONGER", "ok"], ["RESTRICTIONS", params.started ? "STARTED" : "PENDING", params.started ? "ok" : "wait"]];
  return { className: "ctl sensors", html: `${bar("UTILITY · WATER", "ESTIMATE")}<table>${rows.map(([k, v, c]) => `<tr><td>${k}</td><td class="${c}">${v}</td></tr>`).join("")}</table>${clock(params)}` };
}

// ---------------------------------------------------------------------------- Chapter 5
// "Jack overlaid the reports on the settlement map. The first vibrations had been strongest
// near the eastern boundary. Later reports came from the north."
function vibmap({ local }) {
  const pts = [[505, 205, 0], [512, 170, 0.5], [490, 130, 1.2], [440, 96, 1.9], [380, 82, 2.6]];
  const shown = pts.filter((p) => local >= p[2]);
  const rings = shown.map(([x, y, a], i) => `<circle cx="${x}" cy="${y}" r="${10 + ((local - a) * 10) % 22}" fill="none" stroke="#ffb03a" stroke-width="2" opacity="${(1 - (((local - a) * 10) % 22) / 22).toFixed(2)}"/><circle cx="${x}" cy="${y}" r="5" fill="#ff7a3a"/><text x="${x - 30}" y="${y - 12}" fill="#ffcf96" font-size="12">V${i + 1}</text>`).join("");
  const path = shown.length > 1 ? `<path d="M${shown.map((p) => p[0] + " " + p[1]).join(" L")}" stroke="#ff7a3a" stroke-dasharray="6 6" stroke-width="2" fill="none"/>` : "";
  return { className: "ctl map", html: `<svg viewBox="0 0 640 380"><rect width="640" height="380" fill="#061019"/><path d="M0 0 H640 V380 H0 Z" fill="#0b1a12"/><path d="${TOWN}" fill="#0d2230" stroke="#ff3020" stroke-width="2"/>${path}${rings}</svg><div class="bar2">VIBRATION REPORTS · NOT SEISMIC</div>` };
}

// The event record again: "Boundary event complete. / No error. / No failure. / No emergency
// shutdown. / Complete."
function complete({ local, params }) {
  const rows = ["NO ERROR", "NO FAILURE", "NO EMERGENCY SHUTDOWN", "COMPLETE"];
  const n = params.all ? rows.length : Math.min(rows.length, Math.floor(local / 0.9));
  return { className: "ctl eventlog", html: `${bar("TOMBS EVENT LOG", "FINAL ENTRY")}<div class="rec1">BOUNDARY EVENT COMPLETE</div><table>${rows.slice(0, n).map((k) => `<tr><td>${k}</td></tr>`).join("")}</table>` };
}

// "He searched the event sequence for a source address. Nothing. Authentication history had
// been stripped. Remote command records existed, but every identifying field was blank."
// `perms`: the permissions table -- "They had control."
function source({ local, params }) {
  if (params.perms) {
    const rows = [["READ", "&#10003;"], ["CONFIGURE", "&#10003;"], ["AUTHORIZE", "&#10003;"], ["DELETE LOGS", "&#10003;"], ["ACTIVATE", "&#10003;"]];
    return { className: "ctl sensors", html: `${bar("PERMISSIONS", "REMOTE SESSION")}<table>${rows.map(([k, v]) => `<tr><td>${k}</td><td class="bad">${v}</td></tr>`).join("")}</table><div class="foot bad">FULL ADMINISTRATIVE CONTROL</div>` };
  }
  const rows = [["SOURCE ADDRESS", ""], ["AUTH HISTORY", "STRIPPED"], ["REMOTE COMMANDS", "PRESENT"], ["OPERATOR ID", ""], ["DEVICE", ""], ["SESSION", ""]];
  const n = Math.min(rows.length, 1 + Math.floor(local / 0.8));
  return { className: "ctl sensors", html: `${bar("EVENT SEQUENCE", "SEARCH: SOURCE")}<table>${rows.slice(0, n).map(([k, v]) => `<tr><td>${k}</td><td class="${v ? "wait" : "blank"}">${v || "&mdash; blank &mdash;"}</td></tr>`).join("")}</table>` };
}

// The southern perimeter camera, "the same still grass. The same dark, unreadable line where
// the settlement stopped". `frozen`: the shape on the security feed that never resolves.
function southcam({ local, params }) {
  const sway = Math.sin(local * 0.7) * 6;
  const svg = `<rect width="640" height="348" fill="#05080a"/><rect y="240" width="640" height="108" fill="#1a1e21"/><rect x="0" y="236" width="640" height="6" fill="#0a0c0d"/>` +
    `<g transform="translate(${sway.toFixed(1)} 0)">${blades(31, 20, 250, -40)}</g>` +
    `<radialGradient id="sl" cx="0.3" cy="0.95" r="0.6"><stop offset="0" stop-color="#ffe6b0" stop-opacity="0.25"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient><rect width="640" height="348" fill="url(#sl)"/>` +
    (params.frozen ? `<path d="M380 150 q30 -20 60 0 l-8 60 q-20 10 -44 0 Z" fill="rgba(0,0,0,.6)"/><rect x="368" y="138" width="88" height="90" fill="none" stroke="#ffcf6a" stroke-dasharray="4 4"/>` : "");
  return camShell(svg, "CAM 09  SOUTH ROAD", local, params.frozen ? `<div class="zoom">HOLD  &#10074;&#10074;</div>` : "");
}

// Sarah's console while Jack is out: his sensor feed and his wrist camera. `nail`: the pale
// curved thing in the soil, zoomed until the ridges show.
function feed({ local, params }) {
  const rows = [["AIR", "NORMAL"], ["TEMPERATURE", "NEGLIGIBLE &Delta;"], ["PRESSURE", "NORMAL"], ["RADIATION", "BACKGROUND"]];
  const n = params.readings || 0;
  const z = params.zoom || 0;
  const nail = params.nail
    ? `<svg viewBox="0 0 320 220" class="wrist"><rect width="320" height="220" fill="#1e1610"/>${blades(51, 5, 230, -10, 320, -10)}<g transform="translate(160 130) scale(${1 + z * 0.8}) translate(-160 -130)"><path d="M60 150 Q160 60 270 140 Q160 92 60 150 Z" fill="#e8dcc0" opacity=".92"/><path d="M230 120 Q250 128 270 140" stroke="#fff" stroke-width="3" opacity=".6"/>${z > 0.5 ? Array.from({ length: 9 }, (_, i) => `<path d="M${90 + i * 18} ${132 - Math.sin((i / 8) * Math.PI) * 26} q4 8 2 16" stroke="#c4b496" stroke-width="1.5" fill="none"/>`).join("") : ""}</g><text x="10" y="18" fill="#e8f2ea" font-size="12">WRIST CAM  J.BENNETT</text></svg>`
    : "";
  return { className: "ctl feed", html: `${bar("FIELD SENSOR · J. BENNETT", "LIVE")}<table>${rows.slice(0, n).map(([k, v]) => `<tr><td>${k}</td><td class="ok">${v}</td></tr>`).join("")}</table>${nail}` };
}

// ---------------------------------------------------------------------------- Chapter 6
// The wrist-camera recording, replayed: the clipping, then the grass moving, the image
// shaking, frame by frame, the leg, and the curved shape "faintly reflecting the security
// lights" enlarged until the pixels break apart. `stage`: nail | grass | leg | curve | pixels.
function footage({ local, params }) {
  const st = params.stage || "nail";
  const frame = params.frame !== undefined ? params.frame : 1200 + Math.floor(local * 24);
  const shake = st === "grass" ? Math.sin(local * 37) * 6 : 0;
  let svg = `<rect width="640" height="348" fill="#0c0a08"/>`;
  if (st === "nail") svg += `<rect y="180" width="640" height="168" fill="#2a1e14"/>${blades(61, 10, 200, -40)}<path d="M140 290 Q320 140 520 270 Q320 200 140 290 Z" fill="#e6dac0" opacity=".9"/>`;
  else {
    // the gap between the stems, where the security light gets through: what crosses it is
    // a silhouette
    svg += `<g transform="translate(${shake.toFixed(1)} ${(-shake * 0.6).toFixed(1)})"><radialGradient id="gap" cx="0.55" cy="0.42" r="0.32"><stop offset="0" stop-color="#8a7a5a"/><stop offset="0.6" stop-color="#3a3224"/><stop offset="1" stop-color="#0c0a08" stop-opacity="0"/></radialGradient>` +
      `<rect width="640" height="348" fill="url(#gap)"/><rect y="230" width="640" height="118" fill="#1d1712"/>${blades(62, 7, 250, -40, 200, -8)}<g transform="translate(450 0)">${blades(63, 6, 250, -40, 190, -8)}</g>`;
    if (st === "leg" || st === "curve" || st === "pixels") svg += `<path d="M300 92 L338 160 L322 252" stroke="#030303" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M372 96 L410 168 L404 236" stroke="#030303" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/><path d="M262 110 L270 180 L250 246" stroke="#030303" stroke-width="5" fill="none" stroke-linecap="round" opacity=".6"/>`;
    // "A curved shape hung above the leg, faintly reflecting the security lights."
    if (st === "curve" || st === "pixels") svg += `<path d="M236 96 Q340 18 456 98 Q340 66 236 96 Z" fill="#050505"/><path d="M286 66 Q340 40 394 62" stroke="rgba(255,230,170,.75)" stroke-width="3.5" fill="none"/>`;
    svg += `</g>`;
  }
  let overlay = "";
  if (st === "pixels") {
    // enlarged past what the camera recorded: the curve and its one highlight as blocks
    const r = rng(9);
    let px = "";
    for (let y = 0; y < 6; y++) for (let x = 0; x < 10; x++) { const v = Math.floor(10 + r() * 22 + (y === 1 && x > 3 && x < 7 ? 110 : 0)); px += `<rect x="${x * 64}" y="${y * 58}" width="64" height="58" fill="rgb(${v},${v - 2},${Math.max(0, v - 6)})"/>`; }
    overlay = `<svg viewBox="0 0 640 348" class="px">${px}</svg>`;
  }
  return camShell(svg, "WRIST CAM REPLAY", local, `<div class="zoom">FRAME ${frame}${params.frame !== undefined ? "  &#10074;&#10074;" : ""}</div>${overlay}`);
}

// The calibration records and the surviving parameter block: "Target height normalization."
// `calc`: the conversion and the adult height applied -- the answer a smear in millimetres.
function calibration({ local, params }) {
  const rows = [["MODE", "TARGET SCALE"], ["TARGET HEIGHT NORMALIZATION", "SET"], ["AUTHORIZATION", "SKIPPED"]];
  const calc = params.calc ? `<div class="calc"><div>AVERAGE ADULT HEIGHT &times; SCALE</div><b>${SMEAR}</b><em>mm</em></div>` : "";
  return { className: "ctl sensors calib", html: `${bar("TOMBS · COMMAND SEQUENCE", params.calc ? "CONVERSION" : "SURVIVING BLOCK")}<table>${rows.map(([k, v]) => `<tr><td>${k}</td><td class="${v === "SKIPPED" ? "bad" : "wait"}">${v}</td></tr>`).join("")}</table>${calc}` };
}

// The medical center's status panel.
function medical({ params }) {
  const rows = [["BACKUP POWER", "READY"], ["MEDICAL GASES", "NORMAL"], ["WATER PRESSURE", "NORMAL"], ["PATIENTS", params.awake ? params.awake + " AWAKE" : "ASLEEP"], ["DAMAGE", "NONE"]];
  return { className: "ctl sensors", html: `${bar("MEDICAL CENTER", "NIGHT SHIFT")}<table>${rows.map(([k, v]) => `<tr><td>${k}</td><td class="${/AWAKE/.test(v) ? "wait" : "ok"}">${v}</td></tr>`).join("")}</table>${clock(params)}` };
}

// "He overlaid the island development survey beneath it. The match was nearly exact." The
// boundary curving round the north maintenance yard, out to a small pumping station, in to
// avoid the woodland; the backup substation; the reservoir outside. `step` adds the callouts.
function selection({ local, params }) {
  const survey = "M122 212 L162 118 L248 92 L330 102 L402 82 L472 118 L522 192 L502 262 L432 302 L330 298 L240 312 L158 282 Z";
  const sel = "M120 210 L160 120 L250 90 L300 66 L340 72 L330 104 L400 80 L470 120 L560 150 L548 176 L520 190 L500 260 L430 300 L330 296 L240 310 L160 280 Z";
  const step = params.step || 0, p = Math.min(1, local / 2.5);
  const call = (x, y, s, left) => `<circle cx="${x}" cy="${y}" r="6" fill="#ffcf6a"/><text x="${left ? x - 10 : x + 10}" y="${y + (left ? 22 : 4)}" text-anchor="${left ? "end" : "start"}" fill="#ffe2a8" font-size="13">${s}</text>`;
  let notes = "";
  if (step >= 1) notes += call(312, 70, "MAINTENANCE YARD");
  if (step >= 2) notes += call(552, 160, "PUMPING STATION &middot; WASTEWATER", true);
  if (step >= 3) notes += call(240, 312, "BACKUP SUBSTATION");
  if (step >= 4) notes += `<ellipse cx="600" cy="40" rx="34" ry="18" fill="#123a52" stroke="#4ab8ff"/><text x="520" y="78" fill="#7fb8d8" font-size="13">RESERVOIR &middot; OUTSIDE</text>`;
  const wood = `<path d="M180 70 Q220 40 270 60 L260 90 L200 110 Z" fill="#14301c"/><text x="150" y="54" fill="#3f7a52" font-size="12">WOODLAND</text>`;
  return {
    className: "ctl map",
    html: `<svg viewBox="0 0 640 380"><rect width="640" height="380" fill="#061019"/>${wood}<path d="${survey}" fill="#123040" opacity="${params.survey ? 1 : 0.2}"/><path d="${sel}" fill="rgba(255,48,32,0.08)" stroke="#ff3020" stroke-width="3" stroke-dasharray="2600" stroke-dashoffset="${(2600 * (1 - p)).toFixed(0)}"/>${notes}</svg><div class="bar2">BOUNDARY DEFINITION${params.survey ? " &middot; DEVELOPMENT SURVEY" : ""}</div>`,
  };
}

// The diagnostic trace in the maintenance partition: lines of machine data, a search for the
// boundary coordinates, the earliest match. `found`: the matches; `loaded`: LOADED, NOT
// CREATED.
const TRACE = (() => {
  const r = rng(99), out = [];
  for (let i = 0; i < 260; i++) out.push(`${(r() * 0xffffff | 0).toString(16).padStart(6, "0")}  FC-${(r() * 64) | 0}  ${(r() * 9999).toFixed(2).padStart(8)}  ${["CALC", "MASS", "BND", "STAB", "EMIT", "PWR"][(r() * 6) | 0]}`);
  return out;
})();
function trace({ local, params }) {
  const head = params.found ? 40 : Math.floor(local * 10) % 240;
  const rows = TRACE.slice(head, head + 12).map(esc);
  if (params.found) for (const k of [2, 5, 9]) rows[k] = `<b class="hit">${rows[k]}  BND-COORD</b>`;
  const msg = params.loaded ? `<div class="banner amberb">BOUNDARY DEFINITION &middot; LOADED, NOT CREATED</div>` : params.found ? `<div class="foot">SEARCH: BOUNDARY COORDINATES &middot; ${params.found} MATCHES</div>` : "";
  return { className: "ctl data trace", html: `${bar("MAINTENANCE PARTITION", "DIAGNOSTIC TRACE")}<pre>${rows.join("\n")}</pre>${msg}` };
}

// The file metadata, a field at a time: created three weeks ago (the date, never a clock
// time the chapter does not give), on both clocks; the snapshot; the owner; the signature;
// the calendar; then the label. `show`: how many of the fields are open.
function metadata({ params }) {
  const show = params.show || 1;
  const rows = [
    ["CREATED", "FEB 12, 2110 &middot; THREE WEEKS AGO", "wait"],
    ["ISLAND CLOCK / BACKUP", "MATCH", "ok"],
    ["SNAPSHOT", "EXISTED &lt; 1 MIN, DELETED", "bad"],
    ["OWNER", "BENNETT, J.", "bad"],
    ["SIGNATURE", "ADMIN CERTIFICATE &middot; VALID", "bad"],
  ];
  const cal = show >= 6 ? `<div class="cal">CALENDAR &middot; FEB 12 &middot; SETTLEMENT PLANNING MEETING &middot; COMMUNITY CENTER &middot; ~2 H</div>` : "";
  return { className: "ctl sensors meta", html: `${bar("FILE METADATA", "BOUNDARY DEFINITION")}<table>${rows.slice(0, Math.min(5, show)).map(([k, v, c]) => `<tr><td>${k}</td><td class="${c}">${v}</td></tr>`).join("")}</table>${cal}` };
}

// PHASE ONE READY. Three words, glowing, and still there at dawn.
function phase({ local, params }) {
  const g = 0.75 + 0.25 * Math.cos(local * 1.6);
  const search = params.search ? `<div class="foot">SEARCH &ldquo;PHASE&rdquo; &middot; ${esc(params.search)}</div>` : "";
  return { className: "ctl phase", html: `${bar("DIAGNOSTIC SNAPSHOT", "LABEL")}<div class="p1">PHASE ONE READY.</div>${search}${clock(params)}`, vars: { "--glow": g.toFixed(3) } };
}

// ---------------------------------------------------------------------------- Chapter 7
// A search that takes too long, then one result loading line by line "slower than the
// connection should have allowed". `from`: when the result appears (seconds into the state).
function loading({ local, params }) {
  const at = params.from ?? 2.5;
  if (local < at) return { className: "ctl data", html: `${bar("DIAGNOSTIC SNAPSHOT", "SEARCHING")}<pre>${"&middot;".repeat(1 + (Math.floor(local * 3) % 12))}</pre>` };
  const lines = ["RECORD 0001", "TYPE: DEVICE SESSION", "PARTITION: MAINT/DEEP", "COORDS: 4 POINTS", "DEVICE SIG: UNRECOGNIZED", "LOADING&hellip;"];
  const n = Math.min(lines.length, 1 + Math.floor((local - at) / 1.4));
  return { className: "ctl data", html: `${bar("DIAGNOSTIC SNAPSHOT", "1 RESULT")}<pre>${lines.slice(0, n).join("\n")}</pre>` };
}

// ---------------------------------------------------------------------------- Chapter 8
// "A maintenance tablet. Logged into the network for six minutes, three weeks ago."
function tablet() {
  const rows = [["DEVICE", "MAINTENANCE TABLET"], ["ON NETWORK", "6 MIN"], ["DATE", "FEB 12, 2110"], ["LOCATION", "EQUIPMENT SHED &middot; N PUMPING STN"]];
  return { className: "ctl sensors", html: `${bar("DEVICE RECORD", "FACILITIES")}<table>${rows.map(([k, v]) => `<tr><td>${k}</td><td class="wait">${v}</td></tr>`).join("")}</table>` };
}
// The tablet's checkout log: dozens of names, none standing apart (unreadable here).
function checkout({ local }) {
  const r = rng(3 + Math.floor(local * 3));
  const rows = Array.from({ length: 9 }, () => `<tr><td>${blurName(r)}</td><td class="dim">FACILITIES</td><td class="dim">OUT/IN</td></tr>`).join("");
  return { className: "ctl sensors names", html: `${bar("TABLET CHECKOUT LOG", "THAT WEEK")}<table>${rows}</table>` };
}
// The facilities map with a marker (the shed by the north pumping station), the badge-tracking
// overlay (`badges`), or the two impacts (`impacts`: 1 or 2).
function facility({ local, params }) {
  const r = rng(12);
  let blocks = "";
  for (let i = 0; i < 46; i++) blocks += `<rect x="${(150 + r() * 330).toFixed(0)}" y="${(110 + r() * 170).toFixed(0)}" width="${(10 + r() * 22).toFixed(0)}" height="${(8 + r() * 14).toFixed(0)}" fill="#1c3646"/>`;
  let extra = "";
  if (params.shed) extra += `<circle cx="372" cy="92" r="${9 + 3 * Math.sin(local * 5)}" fill="#ff3020"/><text x="386" y="86" fill="#ffb4a8" font-size="13">EQUIPMENT SHED</text>`;
  if (params.badges) {
    const rr = rng(7);
    for (let i = 0; i < 26; i++) { const x = 150 + rr() * 330, y = 110 + rr() * 170, ph = (local * 2 + rr() * 6) % 3; extra += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(2 + ph * 3).toFixed(1)}" fill="none" stroke="#52e0b0" opacity="${(1 - ph / 3).toFixed(2)}"/>`; }
    if (params.found) extra += `<rect x="352" y="140" width="40" height="30" fill="none" stroke="#ffcf6a" stroke-width="3"/><text x="398" y="160" fill="#ffe2a8" font-size="13">BADGE PING</text>`;
  }
  if (params.impacts) {
    extra += `<circle cx="470" cy="270" r="14" fill="none" stroke="#ff7a3a" stroke-width="3"/><text x="440" y="300" fill="#ffb080" font-size="12">03:30 &middot; SOUTH</text>`;
    if (params.impacts > 1) extra += `<circle cx="540" cy="168" r="9" fill="none" stroke="#ffcf6a" stroke-width="3"/><text x="500" y="150" fill="#ffe2a8" font-size="12">03:18 &middot; EAST</text><path d="M540 168 L470 270" stroke="#ffcf6a" stroke-dasharray="5 5" stroke-width="2"/>`;
  }
  return { className: "ctl map", html: `<svg viewBox="0 0 640 380"><rect width="640" height="380" fill="#061019"/><path d="M0 0 H640 V380 H0 Z" fill="#0b1a12"/><path d="${TOWN}" fill="#0d2230" stroke="#ff3020" stroke-width="2"/>${blocks}${extra}</svg><div class="bar2">${esc(params.title || "FACILITIES MAP")}</div>` };
}
// The perimeter sensors, the last hour, every side.
function perimeter({ local, params }) {
  const rows = [["SOUTH ARRAY", "IMPACT 03:30", "bad"], ["NORTH ARRAY", "&mdash;", "ok"], ["WEST ARRAY", "&mdash;", "ok"], ["EAST ARRAY", params.east ? "IMPACT 03:18 &middot; SMALLER" : "&hellip;", params.east ? "wait" : "ok"]];
  return { className: "ctl sensors", html: `${bar("PERIMETER SENSORS", "LAST HOUR")}<table>${rows.map(([k, v, c]) => `<tr><td>${k}</td><td class="${c}">${v}</td></tr>`).join("")}</table>` };
}

// ---------------------------------------------------------------------------- Chapter 9
// The badge: a groundskeeper, retired two years ago, reported lost eight days before. The
// ticket: three lines, filed by someone Jack never met, closed with a replacement order.
function badge({ params }) {
  const r = rng(41);
  const ticket = params.ticket ? `<div class="ticket"><div>FACILITIES TICKET &middot; LOST BADGE &middot; CLOSED</div><div>FILED BY ${blurName(r, 4)}</div><div>8 DAYS BEFORE &middot; REPLACEMENT ORDERED</div></div>` : "";
  return { className: "ctl sensors names", html: `${bar("BADGE RECORD", "DOOR LOG")}<table><tr><td>HOLDER</td><td>${blurName(r)}</td></tr><tr><td>ROLE</td><td class="wait">GROUNDSKEEPER</td></tr><tr><td>STATUS</td><td class="bad">RETIRED &middot; 2 YEARS</td></tr><tr><td>BADGE</td><td class="bad">REPORTED LOST</td></tr></table>${ticket}` };
}
// Lena's briefing: every camera they have, in a grid.
function cameras({ local }) {
  const cells = Array.from({ length: 6 }, (_, i) => `<svg viewBox="0 0 640 348">${i % 2 ? `<rect width="640" height="348" fill="#3a3020"/>` : `<rect width="640" height="348" fill="#2a3a3a"/>`}${blades(70 + i, 10, 360, -40, 640, 18)}</svg>`).join("");
  return { className: "ctl grid6", html: `${bar("CAMERA BRIEFING", "DRAFT")}<div class="cells">${cells}</div>`, vars: { "--t": local.toFixed(2) } };
}

const ALL = { call, utilcam, message, infra, pipecam, reports, homes, water, vibmap, complete, source, southcam, feed, footage, calibration, medical, selection, trace, metadata, phase, loading, tablet, checkout, facility, perimeter, badge, cameras };
// A set's starting screen has been in its state "forever" (local is Infinity), and a pulse of
// sin(Infinity) is NaN: such a screen is drawn as though it had just settled, a minute in.
export const aftermathTemplates = Object.fromEntries(Object.entries(ALL).map(([k, f]) => [k, (a) => f({ ...a, local: Number.isFinite(a.local) ? a.local : 60 })]));
