// WHAT IS ON A SCREEN. Each of the lab's named screens (tombs-lab dressing.ts) gets its own
// small canvas, drawn from the story's state at the audio time: a kind ("diag", "amber",
// "directory", ...) and the second it came up, so a screen that has just changed can animate
// in and a seek lands on the same picture. Redrawn only when its kind changes or, for the
// moving kinds, about five times a second -- a phone's budget.
//
// Wording follows the manuscript's system lines (Chapter 1) and shows nothing the characters
// do not know.
import * as THREE from 'three';

const W = 512, H = 288;
const TEAL = '#58e0e6', DIM = '#1e6f78', AMBER = '#ffb347', RED = '#ff4d4d', INK = '#061015';
const MOVING = new Set(['windows', 'netmon', 'feed', 'boot', 'logs', 'diag', 'amber']);
// what colour each kind throws on the person in front of it (the desk's glow light)
export const GLOW = { off: null, black: null, diag: 0x58d6e0, amber: 0xffa64a, windows: 0x58d6e0, netmon: 0x58d6e0, red: 0xff4a4a, logs: 0x58d6e0,
  directory: 0x58d6e0, boundary: 0x58d6e0, boot: 0x6fb6ff, feed: 0x58d6e0, request: 0xffa64a, denied: 0xff4a4a, revoked: 0xff4a4a, tablet: 0x8fc8ff };

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function chrome(c, title, col = TEAL) {
  c.fillStyle = INK; c.fillRect(0, 0, W, H);
  c.fillStyle = 'rgba(88,224,230,.08)'; c.fillRect(0, 0, W, 22);
  c.fillStyle = col; c.font = 'bold 13px ui-monospace, Menlo, monospace'; c.textBaseline = 'middle'; c.fillText(title, 10, 11);
  c.fillStyle = DIM; c.fillRect(0, 22, W, 1);
}
function waves(c, t, y0, h, col, seed) {
  const r = rng(seed);
  for (let k = 0; k < 3; k++) {
    c.strokeStyle = k ? DIM : col; c.lineWidth = k ? 1 : 2; c.beginPath();
    const ph = r() * 6, f = 0.02 + r() * 0.03;
    for (let x = 0; x <= W - 20; x += 4) { const y = y0 + h / 2 + Math.sin(x * f + t * 1.3 + ph) * h * 0.3 * (1 + 0.4 * Math.sin(x * 0.007 + k)); x ? c.lineTo(10 + x, y) : c.moveTo(10, y); }
    c.stroke();
  }
}
function bars(c, t, x0, y0, w, h, seed) {
  const r = rng(seed); const n = 22;
  for (let i = 0; i < n; i++) { const v = 0.25 + 0.6 * Math.abs(Math.sin(i * 0.7 + r() * 3 + t * 0.35)); c.fillStyle = i % 5 === 0 ? TEAL : DIM; c.fillRect(x0 + i * (w / n), y0 + h * (1 - v), w / n - 3, h * v); }
}
function banner(c, text, col) {
  c.fillStyle = col === RED ? 'rgba(120,10,10,.92)' : 'rgba(110,60,0,.92)'; c.fillRect(30, H / 2 - 34, W - 60, 68);
  c.strokeStyle = col; c.lineWidth = 3; c.strokeRect(30, H / 2 - 34, W - 60, 68);
  c.fillStyle = '#fff'; c.font = 'bold 22px ui-monospace, Menlo, monospace'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(text, W / 2, H / 2, W - 80); c.textAlign = 'left';
}
function list(c, rows, y0, col = TEAL, step = 17) { c.font = '13px ui-monospace, Menlo, monospace'; c.textBaseline = 'top'; rows.forEach((row, i) => { c.fillStyle = typeof row === 'string' ? col : row[1]; c.fillText(typeof row === 'string' ? row : row[0], 12, y0 + i * step); }); }

const PAINT = {
  off(c) { c.fillStyle = '#000'; c.fillRect(0, 0, W, H); },
  black(c) { c.fillStyle = '#000'; c.fillRect(0, 0, W, H); },
  diag(c, t, s) { chrome(c, 'DIAGNOSTICS · TEST 0304 RESULTS'); waves(c, t, 34, 120, TEAL, s.seed); bars(c, t, 12, 170, W - 24, 100, s.seed + 1); },
  amber(c, t, s) { PAINT.diag(c, t, s); if (Math.floor((t - s.t0) * 2) % 2 === 0) { c.fillStyle = 'rgba(255,170,60,.18)'; c.fillRect(0, 0, W, H); } banner(c, 'WARNING · UNAUTHORIZED SYSTEM ACCESS', AMBER); },
  windows(c, t, s) {
    chrome(c, 'SESSION 3 · REMOTE');
    const r = rng(s.seed + Math.floor((t - s.t0) * 3)), rows = [];
    for (let i = 0; i < 14; i++) rows.push('> ' + Array.from({ length: 6 + Math.floor(r() * 8) }, () => 'abcdefghijklmnopqrstuvwxyz0123456789_./'[Math.floor(r() * 38)]).join('') + '  ' + Math.floor(r() * 9999));
    list(c, rows, 30, DIM, 17);
    for (let k = 0; k < 3; k++) { const x = 160 + r() * 280, y = 40 + r() * 180; c.fillStyle = 'rgba(10,40,48,.95)'; c.fillRect(x, y, 150, 80); c.strokeStyle = TEAL; c.strokeRect(x, y, 150, 80); c.fillStyle = TEAL; c.fillRect(x, y, 150, 14); }
  },
  netmon(c, t, s) {
    chrome(c, 'NETWORK MONITOR');
    const rows = [['LOCAL   lab-jack       ESTABLISHED', TEAL], ['LOCAL   lab-sarah      IDLE', DIM], ['LOCAL   control-01     IDLE', DIM]];
    if (s.flash && t - s.t0 < 0.6) rows.push(['??????  unknown        ESTABLISHED', AMBER]);
    list(c, rows, 34, TEAL, 20);
    c.fillStyle = DIM; c.fillRect(12, 120, W - 24, 1);
    bars(c, t, 12, 140, W - 24, 120, s.seed + 3);
  },
  red(c, t, s) { PAINT.netmon(c, t, s); c.fillStyle = 'rgba(255,40,40,.16)'; c.fillRect(0, 0, W, H); banner(c, 'SECURITY PROTOCOL VIOLATION', RED); },
  logs(c, t, s) {
    chrome(c, 'LABORATORY ACCESS LOGS');
    const rows = ['22:41  J. BENNETT     LAB-J   BADGE', '21:07  S. BENNETT     OFFICE  BADGE', '19:55  J. BENNETT     LAB-J   BADGE', '18:30  CONTROL-01     SYSTEM  CHECK', '17:12  S. BENNETT     LAB-J   BADGE', '16:03  J. BENNETT     LAB-J   BADGE', '...', 'NO UNUSUAL ENTRIES'];
    list(c, rows, 34, TEAL, 19);
  },
  directory(c, t, s) {
    chrome(c, 'TOMBS');
    const rows = ['[ ] Research', '[ ] Models', '[ ] Images', '[ ] Systems', '[ ] Boundary control', '[ ] Array'];
    c.font = '15px ui-monospace, Menlo, monospace'; c.textBaseline = 'top';
    rows.forEach((row, i) => { c.fillStyle = '#e6c15a'; c.fillRect(14, 38 + i * 30, 16, 12); c.fillStyle = TEAL; c.fillText(row.slice(4), 40, 36 + i * 30); });
    waves(c, t, 200, 70, DIM, s.seed);
  },
  boundary(c, t, s) {
    chrome(c, 'BOUNDARY CONTROL');
    waves(c, t, 34, 110, TEAL, s.seed + 5);
    for (let i = 0; i < 3; i++) { const y = 170 + i * 32; c.fillStyle = DIM; c.fillRect(40, y, W - 120, 4); c.fillStyle = TEAL; c.beginPath(); c.arc(40 + (W - 120) * (0.3 + 0.2 * i), y + 2, 7, 0, Math.PI * 2); c.fill(); }
  },
  boot(c, t, s) {
    c.fillStyle = INK; c.fillRect(0, 0, W, H);
    const k = Math.min(1, Math.max(0, (t - s.t0) / 3.5));
    c.fillStyle = TEAL; c.font = 'bold 26px ui-monospace, Menlo, monospace'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('LAB-J · CONSOLE 2', W / 2, H / 2 - 24); c.textAlign = 'left';
    c.strokeStyle = DIM; c.strokeRect(96, H / 2 + 10, W - 192, 12); c.fillStyle = TEAL; c.fillRect(98, H / 2 + 12, (W - 196) * k, 8);
  },
  feed(c, t, s) {
    chrome(c, 'CONNECTION HISTORY');
    const r = rng(s.seed + Math.floor((t - s.t0) * 2)), rows = [];
    for (let i = 0; i < 12; i++) rows.push(`${String(22 - Math.floor(i / 4)).padStart(2, '0')}:${String(59 - i * 4).padStart(2, '0')}  lab-${r() < 0.5 ? 'jack ' : 'sarah'}  ${r() < 0.6 ? 'LOCAL' : 'CTRL '}  OK`);
    list(c, rows, 30, TEAL, 20);
  },
  request(c, t, s) { PAINT.directory(c, t, s); c.fillStyle = 'rgba(255,160,60,.12)'; c.fillRect(0, 0, W, H); banner(c, 'TOMBS ARRAY · REMOTE INITIALIZATION REQUEST', AMBER); },
  denied(c, t, s) { PAINT.directory(c, t, s); banner(c, 'REQUEST DENIED', RED); },
  revoked(c, t, s) { PAINT.directory(c, t, s); c.fillStyle = 'rgba(255,40,40,.14)'; c.fillRect(0, 0, W, H); banner(c, 'ACCESS REVOKED', RED); },
  tablet(c, t, s) { c.fillStyle = '#0c1a26'; c.fillRect(0, 0, W, H); c.fillStyle = '#8fc8ff'; for (let i = 0; i < 6; i++) c.fillRect(30, 40 + i * 34, 200 + (i * 53) % 220, 10); },
};

export class ScreenSet {
  constructor() { this.items = new Map(); }
  /** a screen mesh to drive, under a name the story uses */
  add(name, mesh, seed = 1) {
    const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
    const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, color: 0xd8d8d8 });
    this.items.set(name, { mesh, off: mesh.material, mat, canvas, c: canvas.getContext('2d'), tex, kind: null, t0: 0, drawn: -1, seed });
  }
  /** states: { name: { kind, t0, flash } } at time t */
  update(states, t) {
    for (const [name, it] of this.items) {
      const s = states[name] || { kind: 'off', t0: 0 };
      const kind = s.kind || 'off';
      if (kind === 'off') { if (it.mesh.material !== it.off) it.mesh.material = it.off; it.kind = kind; continue; }
      if (it.mesh.material !== it.mat) it.mesh.material = it.mat;
      const bucket = MOVING.has(kind) ? Math.floor(t * 5) : 0;
      if (kind === it.kind && s.t0 === it.t0 && bucket === it.drawn) continue;
      it.kind = kind; it.t0 = s.t0; it.drawn = bucket;
      (PAINT[kind] || PAINT.off)(it.c, t, { ...s, seed: it.seed });
      it.tex.needsUpdate = true;
    }
  }
  dispose() { for (const it of this.items.values()) { it.tex.dispose(); it.mat.dispose(); it.mesh.material = it.off; } }
}
