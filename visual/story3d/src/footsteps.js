// PROCEDURAL FOOTSTEPS (Joshua, 2026-11-07): a sneaker on a hard lab floor, synthesised with
// the Web Audio API each time a foot lands. The idea and the three layers (a low sole tap, a
// filtered-noise scuff, a small rubber squeak, through a short room reflection) come from
// the example Joshua found; changed here so it fits a player that seeks and changes speed:
//  - one AudioContext and one noise buffer for the whole page, not one per step;
//  - each step's variation is seeded by its step number, so a replay sounds the same;
//  - a step is heard only when a foot actually lands during continuous play (never on a
//    seek), quieter with distance from the camera, panned to where the walker is on screen.
const rng = seed => () => { seed = (seed + 0x6d2b79f5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

export class Foley {
  constructor() { this.ctx = null; this.enabled = true; }
  // render into a given context (an OfflineAudioContext for a sample file)
  attach(ctx) { const keep = this.ctx; this.ctx = null; this._make(ctx); return keep; }
  // must be called from a tap (browsers start audio only after the viewer interacts)
  async ensure() {
    if (!this.ctx) this._make(new (window.AudioContext || window.webkitAudioContext)());
    if (this.ctx.state !== 'running') await this.ctx.resume();
  }
  _make(ctx) {
    {
      this.ctx = ctx;
      this.master = ctx.createGain(); this.master.gain.value = 0.9; this.master.connect(ctx.destination);
      // a short reflection: a clean room with hard walls
      const delay = ctx.createDelay(); delay.delayTime.value = 0.075;
      const echo = ctx.createGain(); echo.gain.value = 0.16; delay.connect(echo); echo.connect(this.master);
      this.room = ctx.createGain(); this.room.gain.value = 0.8; this.room.connect(this.master); this.room.connect(delay);
      const n = Math.ceil(ctx.sampleRate * 0.12), buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0), r = rng(11);
      for (let i = 0; i < n; i++) d[i] = r() * 2 - 1;
      this.noise = buf;
    }
  }
  // one footfall. o: { gain 0..1, pan -1..1, weight (1 heavier, 0 lighter), seed }
  step(o) {
    const ctx = this.ctx; if (!ctx || !this.enabled || (o.when === undefined && ctx.state !== 'running') || o.gain < 0.01) return;
    const r = rng(o.seed), time = o.when ?? ctx.currentTime + 0.01, s = o.gain, heavy = o.weight;
    const out = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
    if (out.pan) out.pan.value = Math.max(-1, Math.min(1, o.pan)); out.connect(this.room);
    // the sole: a quick, low tap on tile
    const thump = ctx.createOscillator(), tg = ctx.createGain();
    thump.type = 'sine'; thump.frequency.setValueAtTime((heavy ? 120 : 150) + r() * 25, time); thump.frequency.exponentialRampToValueAtTime(60 + r() * 10, time + 0.075);
    tg.gain.setValueAtTime(0.0001, time); tg.gain.exponentialRampToValueAtTime((heavy ? 0.26 : 0.18) * s, time + 0.006); tg.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);
    thump.connect(tg); tg.connect(out); thump.start(time); thump.stop(time + 0.13);
    // the scuff: filtered noise
    const sc = ctx.createBufferSource(), f = ctx.createBiquadFilter(), sg = ctx.createGain();
    sc.buffer = this.noise; f.type = 'highpass'; f.frequency.value = 1000 + r() * 300;
    sg.gain.setValueAtTime(0.0001, time); sg.gain.exponentialRampToValueAtTime((heavy ? 0.12 : 0.1) * s, time + 0.008); sg.gain.exponentialRampToValueAtTime(0.0001, time + 0.09);
    sc.connect(f); f.connect(sg); sg.connect(out); sc.start(time); sc.stop(time + 0.11);
    // a small rubber squeak, on about two steps in three
    if (r() > 0.35) {
      const q = ctx.createOscillator(), qg = ctx.createGain(), qt = time + 0.025;
      q.type = 'sine'; q.frequency.setValueAtTime(2200 + r() * 500, qt); q.frequency.exponentialRampToValueAtTime(1500 + r() * 300, qt + 0.045);
      qg.gain.setValueAtTime(0.0001, qt); qg.gain.exponentialRampToValueAtTime(0.035 * s, qt + 0.01); qg.gain.exponentialRampToValueAtTime(0.0001, qt + 0.055);
      q.connect(qg); qg.connect(out); q.start(qt); q.stop(qt + 0.06);
    }
    if (o.when === undefined) setTimeout(() => out.disconnect(), 400);
  }
}

// Where in each person's walk cycle a foot lands, measured on their own rig (the ankle comes
// down to standing height in front of the body): left foot, then the right half a cycle on.
export const LANDS = { jack: 0.40, sarah: 0.37 };
// Which step a walker is on: increases by one at each footfall.
export const stepIndex = (walked, strideM, land) => Math.floor((walked / strideM - land) * 2);
