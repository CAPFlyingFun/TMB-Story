// Screen templates for the settlement's lab consoles. A template is a pure function of
// { local (seconds since this state began), params } that returns HTML plus CSS variables,
// so a screen is as seekable as everything else. The stage only rewrites the HTML when it
// changes; per-frame motion (blinks, flashes, scrolling) goes through the variables.
//
// Nothing here is narrated or canon. The narrated lines come from the manifest (params.text).

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const pad = (n, w) => String(n).padStart(w, "0");
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);

// "Several pages of diagnostic data" -- the log Jack fell asleep over.
const DIAG = (() => {
  const r = rng(7), keys = ["ring", "emitter", "coil", "field", "phase", "stab", "flux", "sync"], out = [];
  for (let i = 0; i < 40; i++) {
    const k = keys[Math.floor(r() * keys.length)];
    out.push(`${pad(i * 3 + 101, 4)}  ${k}-${1 + Math.floor(r() * 6)}  ${(r() * 0.004 + 0.9975).toFixed(4)}  ${r() > 0.1 ? "ok" : "chk"}`);
  }
  return out;
})();
const WAVE = (() => {
  let d = "M0 30";
  for (let x = 0; x <= 400; x += 4) d += ` L${x} ${(30 + Math.sin(x / 11) * 14 * Math.sin(x / 57)).toFixed(1)}`;
  return d;
})();

function diagnostics({ params }) {
  const amber = params.tint === "amber";
  const rows = DIAG.slice(0, 14).map(esc).join("\n");
  return {
    className: "diag" + (amber ? " amber" : ""),
    html:
      `<div class="bar"><span>DIAGNOSTICS</span><span>PAGE 4 / 9</span></div>` +
      `<div class="diag-body"><pre>${rows}</pre>` +
      `<svg class="wave" viewBox="0 0 200 60" preserveAspectRatio="none"><path d="${WAVE}"/></svg></div>` +
      `<div class="flash"></div>`,
  };
}

// "Warning. Unauthorized system access." -- the line comes from the manifest, so the screen
// always shows exactly what TOMBS says in the audio.
function warning({ local, params }) {
  const text = params.text || "Warning.";
  const [title, ...rest] = text.split(/(?<=\.)\s+/);
  const body = rest.join(" ").replace(/\.$/, "");
  return {
    className: "warn" + (params.tone === "red" ? " red" : ""),
    html: `<div class="warn-title">${esc(title.replace(/\.$/, "").toUpperCase())}</div><div class="warn-body">${esc(body)}</div><div class="flash"></div>`,
    vars: { "--blink": (0.62 + 0.38 * Math.cos(local * Math.PI * 2 * 1.4)).toFixed(3) },
  };
}

// "Several windows were opening and closing on their own. Lines of commands streamed across
// one side of the display faster than he could read them."
const STREAM = (() => {
  const r = rng(99), verbs = ["open", "auth", "mount", "sync", "exec", "grant", "route", "spawn", "read", "write"], out = [];
  for (let i = 0; i < 400; i++) {
    const v = verbs[Math.floor(r() * verbs.length)];
    out.push(`${v} 0x${Math.floor(r() * 0xffff).toString(16).padStart(4, "0")} ${r() > 0.5 ? "->" : "::"} ${Math.floor(r() * 9000 + 1000)}`);
  }
  return out;
})();
const WINDOWS = (() => {
  const r = rng(3), names = ["session", "proc", "auth", "shell", "cfg", "net", "log", "task"], out = [];
  let t = 0;
  for (let i = 0; i < 80; i++) {
    t += 0.35 + r() * 0.5;
    out.push({ t, life: 0.7 + r() * 1.3, x: 4 + r() * 50, y: 16 + r() * 50, w: 22 + r() * 18, name: names[Math.floor(r() * names.length)] + "-" + Math.floor(r() * 90 + 10) });
  }
  return out;
})();

function intrusion({ local, params }) {
  const lines = Math.floor(local * 11);
  const stream = STREAM.slice(Math.max(0, lines - 13), lines).map(esc).join("\n");
  const wins = WINDOWS.filter((w) => local >= w.t && local < w.t + w.life)
    .map((w) => `<div class="win" style="left:${w.x.toFixed(1)}%;top:${w.y.toFixed(1)}%;width:${w.w.toFixed(1)}%"><b>${w.name}</b><i></i><i></i><i></i></div>`)
    .join("");
  const net = params.networkMonitorAt !== undefined && local >= params.networkMonitorAt
    ? `<div class="netmon"><b>NETWORK MONITOR</b>${[0.62, 0.3, 0.84, 0.47, 0.2]
        .map((v, i) => `<div class="row"><span>if${i}</span><i style="width:${Math.round(100 * v)}%"></i></div>`)
        .join("")}</div>`
    : "";
  return {
    className: "intrusion",
    html: `<div class="alert-strip">WARNING &middot; UNAUTHORIZED SYSTEM ACCESS</div>${wins}<pre class="stream">${stream}</pre>${net}<div class="flash"></div>`,
    vars: { "--blink": (0.6 + 0.4 * Math.cos(local * Math.PI * 2 * 1.4)).toFixed(3) },
  };
}


// "An unfamiliar connection appeared for half a second and vanished." The monitor lists the
// settlement's own links; the stranger shows for exactly `blipFor` seconds from `blipAt`.
const LINKS = [
  ["lab-core", "10.4.0.12", "local"],
  ["tombs-ctl", "10.4.0.40", "local"],
  ["grid-sub-3", "10.2.1.7", "local"],
  ["sec-cam-12", "10.6.3.12", "local"],
  ["archive", "10.4.0.90", "local"],
];
function netmon({ local, params }) {
  const blip = params.blipAt !== undefined && local >= params.blipAt && local < params.blipAt + (params.blipFor || 0.5);
  const rows = LINKS.map(([h, a, k]) => `<tr><td>${h}</td><td>${a}</td><td>${k}</td><td class="ok">OK</td></tr>`).join("") +
    (blip ? `<tr class="stranger"><td>????</td><td>???.???.?.??</td><td>unknown</td><td>OPEN</td></tr>` : "");
  const refreshed = params.refreshAt !== undefined && local >= params.refreshAt;
  const note = refreshed ? "refreshed &middot; 0 unknown connections" : blip ? "1 unknown connection" : "0 unknown connections";
  return {
    className: "netmon-full",
    html: `<div class="bar"><span>NETWORK MONITOR</span><span>${refreshed ? "REFRESHED" : "LIVE"}</span></div>` +
      `<table>${rows}</table><div class="foot">${note}</div><div class="flash"></div>`,
  };
}

// "Jack entered a command and pulled up the laboratory access logs. Nothing looked unusual.
// He tried another search and got the same result."
const ACCESS = (() => {
  const r = rng(21), doors = ["LAB-2 MAIN", "LAB-2 STORE", "CTRL ROOM", "ARRAY HALL", "LAB-4 MAIN"], out = [];
  for (let i = 0; i < 12; i++) {
    const h = 17 + Math.floor(i / 2.4), m = Math.floor(r() * 60);
    out.push(`${pad(h, 2)}:${pad(m, 2)}  ${doors[Math.floor(r() * doors.length)].padEnd(11)}  B-${Math.floor(r() * 9000 + 1000)}  OK`);
  }
  return out;
})();
function logs({ local, params }) {
  const scroll = params.scroll ? Math.floor(local * 1.6) % ACCESS.length : 0;
  const rows = ACCESS.map((_, i) => ACCESS[(i + scroll) % ACCESS.length]).slice(0, 9).map(esc).join("\n");
  const queries = [`> access-log --since 17:00`, ...(params.pass >= 2 ? [`> access-log --remote --all`] : [])];
  return {
    className: "logs",
    html: `<div class="bar"><span>LABORATORY ACCESS LOG</span><span>${params.scroll ? "LIVE" : "QUERY"}</span></div>` +
      `<pre class="q">${queries.map(esc).join("\n")}</pre><pre>${rows}</pre>` +
      `<div class="foot">${params.pass >= 2 ? "0 anomalies &middot; 0 anomalies" : "0 anomalies"}</div><div class="flash"></div>`,
  };
}

// The TOMBS project directory. "The cursor moved without him touching anything. Jack froze
// as a file opened." The cursor glides from the corner to the file between `cursorAt`
// and `openAt`, then the file opens.
const FILES = ["array_control", "boundary_control", "calibration", "field_models", "power_routing", "run_logs"];
function directory({ local, params }) {
  const title = params.text ? params.text.replace(/\.$/, "").toUpperCase() : "TOMBS PROJECT";
  const rows = FILES.map((f) => `<li class="${f === "boundary_control" && params.cursorAt !== undefined && local >= params.cursorAt + 1.6 ? "hot" : ""}">&#128193; ${f}</li>`).join("");
  let cursor = "";
  if (params.cursorAt !== undefined && local >= params.cursorAt) {
    const p = Math.min(1, (local - params.cursorAt) / 1.6), e = p * p * (3 - 2 * p);
    cursor = `<div class="cursor" style="left:${(82 - 58 * e).toFixed(1)}%;top:${(86 - 45 * e).toFixed(1)}%"></div>`;
  }
  const open = params.openAt !== undefined && local >= params.openAt;
  const win = open
    ? `<div class="filewin"><b>${esc(params.fileTitle || "BOUNDARY CONTROL")}</b><pre>radius_m      ----\nprofile       ----\nstate         ARMED\nauthority     ----</pre></div>`
    : "";
  return {
    className: "dir",
    html: `<div class="bar"><span>${esc(title)}</span><span>/projects/tombs</span></div><ul>${rows}</ul>${win}${cursor}<div class="flash"></div>`,
  };
}

// "He immediately locked the terminal. The screen went black..."
function locked({ local }) {
  return { className: "locked", html: `<div class="lk">TERMINAL LOCKED</div>`, vars: { "--lk": Math.max(0, 1 - local / 1.2).toFixed(3) } };
}

// "TOMBS array remote initialization request." Rejecting it gets "Request denied." -- the
// request does not go away -- and the administrator's credentials are then revoked.
function request({ local, params }) {
  const title = (params.text || "Tombs array remote initialization request.").replace(/\.$/, "").toUpperCase();
  const denied = params.denied || 0;
  const stamps = Array.from({ length: denied }, (_, i) => `<div class="stamp" style="top:${58 + i * 13}%">REQUEST DENIED</div>`).join("");
  const creds = params.creds ? `<div class="creds">ADMIN CREDENTIALS <span>&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</span></div>` : "";
  const revoked = params.revoked ? `<div class="revoked">ACCESS REVOKED</div>` : "";
  return {
    className: "request" + (params.revoked ? " is-revoked" : ""),
    html: `<div class="dlg"><b>${esc(title)}</b><div class="src">source: &mdash; &nbsp; authority: &mdash;</div>` +
      `<div class="btns"><span>APPROVE</span><span class="rej">REJECT</span></div></div>${stamps}${creds}${revoked}<div class="flash"></div>`,
    vars: { "--blink": (0.6 + 0.4 * Math.cos(local * Math.PI * 2 * 1.2)).toFixed(3) },
  };
}

// Sarah's console, "the other console next to Jack": as painted, starting up, then her
// connection history -- every session local, "too clean".
function off() {
  return { className: "off", html: "" };
}
function boot({ local }) {
  const p = Math.min(1, local / 3);
  return { className: "boot", html: `<div class="bt">STARTING</div><div class="pb"><i style="width:${Math.round(p * 100)}%"></i></div>` };
}
const HISTORY = (() => {
  const r = rng(5), out = [];
  for (let i = 0; i < 16; i++) out.push(`${pad(22 + Math.floor(i / 9), 2)}:${pad(Math.floor(r() * 60), 2)}  10.4.${Math.floor(r() * 9)}.${Math.floor(r() * 99)}  local`);
  return out;
})();
function history({ local, params }) {
  const scroll = params.clean ? 0 : Math.floor(local * 2.2) % HISTORY.length;
  const rows = HISTORY.map((_, i) => HISTORY[(i + scroll) % HISTORY.length]).slice(0, 8).map(esc).join("\n");
  return {
    className: "hist",
    html: `<div class="bar"><span>CONNECTION HISTORY</span></div><pre>${rows}</pre><div class="foot">${params.clean ? "external: 0 &middot; gaps: 0" : "scanning&hellip;"}</div>`,
  };
}

export const templates = { diagnostics, warning, intrusion, netmon, logs, directory, locked, request };
export const sarahTemplates = { off, boot, history };

