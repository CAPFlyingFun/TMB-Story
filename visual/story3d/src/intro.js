// THE ISLAND INTRO, as the Watch tab plays it (visual/scenes/ch01-opening.js): the date over
// black, the island at night from high above, one slow descent through two layers of cloud
// to the settlement's lights, a dip to black, then the lab. Same picture, same painter, same
// beats; only the times come from the v4 file's line index. Kept as Joshua asked (2026-11-07).
import { settlementLights } from '../../paint/island.js';
import { L } from './ch1.js';

const smooth = p => (p <= 0 ? 0 : p >= 1 ? 1 : p * p * (3 - 2 * p));
const ramp = (t, t0, dur) => Math.min(1, Math.max(0, (t - t0) / dur));
const SEA = '#040812';
const BG = { x: 3476, y: 3476, w: 2048, h: 2048 };
const HIGH = { x: 2200, y: 2200, w: 4600, h: 4600, focus: [4500, 4500] };
const TOWN = { x: 4396, y: 4441, w: 520, h: 390, focus: [4656, 4636] };
const SETTLEMENT = { x: 4656, y: 4636, w: 560, h: 400, canvas: [1120, 800], seed: 7 };
const CLOUDS = [
  { id: 'low-w', p: 1.1, src: 'wisp-1.png', x: 3800, y: 4950, w: 1300, h: 480, o: 0.85, drift: [5, 1], low: true },
  { id: 'low-e', p: 1.1, src: 'wisp-2.png', x: 5450, y: 4350, w: 1200, h: 450, o: 0.8, drift: [4, 1], low: true },
  { id: 'low-s', p: 1.1, src: 'wisp-3.png', x: 4900, y: 5500, w: 1200, h: 560, o: 0.8, drift: [4, 1], low: true },
  { id: 'high-a', p: 1.3, src: 'wisp-4.png', x: 3950, y: 4250, w: 1700, h: 520, o: 0.75, drift: [9, 2] },
  { id: 'high-b', p: 1.3, src: 'wisp-1.png', x: 5350, y: 5150, w: 1600, h: 590, o: 0.7, drift: [8, 2] },
  { id: 'high-c', p: 1.3, src: 'wisp-3.png', x: 5250, y: 3600, w: 1300, h: 600, o: 0.7, drift: [8, 2] },
  { id: 'high-d', p: 1.3, src: 'wisp-2.png', x: 3550, y: 5350, w: 1300, h: 490, o: 0.7, drift: [9, 2] },
];

// the beats, on the v4 timeline
const T = {
  title: 0.25, titleDur: 4.6,
  descend0: L('It was almost eleven', { offset: -0.3 }), descend1: L('It was almost eleven', { edge: 'end' }),
  lights: L('It was almost eleven', { phrase: 'Near its center', offset: -0.4 }),
  highOff: L('It was almost eleven', { phrase: 'Near its center', offset: 1 }),
  lowOff: L('It was almost eleven', { phrase: 'medical facilities' }),
  dip: L('It was almost eleven', { edge: 'end', offset: -1.0 }),
  lab: L('Deep inside one of those laboratories'),
};
export const INTRO_END = T.lab; // the lab set starts here
export const LAB_FADE = 2.2;

const imgs = {}; let town = null;
export async function loadIntro() {
  const DIR = { 'island-night.jpg': './assets/backgrounds/', 'wisp-1.png': './assets/backgrounds/clouds/', 'wisp-2.png': './assets/backgrounds/clouds/', 'wisp-3.png': './assets/backgrounds/clouds/', 'wisp-4.png': './assets/backgrounds/clouds/' };
  const load = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error(src)); i.src = DIR[src] + src; });
  await Promise.all(['island-night.jpg', 'wisp-1.png', 'wisp-2.png', 'wisp-3.png', 'wisp-4.png'].map(async s => (imgs[s] = await load(s))));
  town = document.createElement('canvas'); town.width = SETTLEMENT.canvas[0]; town.height = SETTLEMENT.canvas[1];
  settlementLights(town, { w: SETTLEMENT.w, h: SETTLEMENT.h, seed: SETTLEMENT.seed });
}

// Draws the intro (or the black over the lab's first seconds). Returns true while the intro
// covers the whole picture, so the 3D lab need not be drawn underneath.
export function drawIntro(cv, t, W, H, dpr) {
  if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
  const g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
  if (t >= T.lab) { // the lab comes up from black
    const a = 1 - smooth(ramp(t, T.lab, LAB_FADE)); cv.style.display = a > 0 ? 'block' : 'none';
    if (a > 0) { g.fillStyle = `rgba(0,0,0,${a})`; g.fillRect(0, 0, W, H); }
    return false;
  }
  cv.style.display = 'block';
  g.fillStyle = SEA; g.fillRect(0, 0, W, H);
  // the camera: one descent at a constant rate of zoom from HIGH to TOWN
  const fit = r => Math.min(W / r.w, H / r.h);
  const s0 = fit(HIGH), s1 = fit(TOWN), k = ramp(t, T.descend0, T.descend1 - T.descend0);
  const s = s0 * Math.pow(s1 / s0, k);
  const kc = (1 / s0 - 1 / s) / (1 / s0 - 1 / s1 || 1);
  const cx = HIGH.focus[0] + (TOWN.focus[0] - HIGH.focus[0]) * kc, cy = HIGH.focus[1] + (TOWN.focus[1] - HIGH.focus[1]) * kc;
  const X = (x, p = 1) => W / 2 + (x - cx) * s * p, Y = (y, p = 1) => H / 2 + (y - cy) * s * p;
  if (imgs['island-night.jpg']) g.drawImage(imgs['island-night.jpg'], X(BG.x), Y(BG.y), BG.w * s, BG.h * s);
  // the settlement's lights come up as the narration reaches it
  if (town) {
    g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.4 + 0.6 * smooth(ramp(t, T.lights, 2.6));
    g.drawImage(town, X(SETTLEMENT.x - SETTLEMENT.w / 2), Y(SETTLEMENT.y - SETTLEMENT.h / 2), SETTLEMENT.w * s, SETTLEMENT.h * s); g.restore();
  }
  // two layers of cloud, nearer than the ground, drifting east
  for (const c of CLOUDS) {
    const off = c.low ? smooth(ramp(t, T.lowOff, 3)) : smooth(ramp(t, T.highOff, 4));
    const a = c.o * (1 - off); if (a <= 0.003 || !imgs[c.src]) continue;
    const x = c.x + c.drift[0] * t, y = c.y + c.drift[1] * t;
    g.globalAlpha = a; g.drawImage(imgs[c.src], X(x - c.w / 2, c.p), Y(y - c.h / 2, c.p), c.w * s * c.p, c.h * s * c.p); g.globalAlpha = 1;
  }
  // black: before the island fades up, and the dip before the lab
  const up = smooth(ramp(t, T.descend0, 3.5)), dip = smooth(ramp(t, T.dip, 1.0));
  const black = Math.max(1 - up, dip);
  if (black > 0) { g.fillStyle = `rgba(0,0,0,${black})`; g.fillRect(0, 0, W, H); }
  // the date, over black
  const tt = t - T.title;
  if (tt > 0 && tt < T.titleDur) {
    const a = Math.min(smooth(tt / 1.0), smooth((T.titleDur - tt) / 1.3));
    g.globalAlpha = a; g.fillStyle = '#f2ece2'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `500 ${Math.round(Math.min(W, H) * 0.075)}px Georgia, "Times New Roman", serif`;
    g.fillText('March 5, 2110', W / 2, H / 2); g.globalAlpha = 1;
  }
  return true;
}
