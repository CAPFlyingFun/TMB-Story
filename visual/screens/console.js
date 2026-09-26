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
    className: "warn",
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

export const templates = { diagnostics, warning, intrusion };
