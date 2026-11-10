import * as THREE from 'three';

/**
 * The lab's drawn surfaces (2026-11-10, toward Joshua's approved Chapter 1 stills): dark grey
 * floor tiles, a laminate desk top, a speaker grille, night foliage outside the windows. Each is
 * drawn once on a canvas and shared; nothing is downloaded. Without a document (tests, Node)
 * every function returns null and the materials stay plain colours.
 */
const cache = new Map<string, THREE.Texture | null>();
function canvasTexture(key: string, w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, repeat?: [number, number]): THREE.Texture | null {
  if (cache.has(key)) return cache.get(key)!;
  if (typeof document === 'undefined') { cache.set(key, null); return null; }
  const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h;
  const c = canvas.getContext('2d');
  if (!c) { cache.set(key, null); return null; }
  draw(c);
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
  cache.set(key, t);
  return t;
}
/** A small deterministic noise, so the same texture is drawn every time. */
function rng(seed: number): () => number { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

/** Floor tiles 60 cm square, UV in metres (the floor slab's UVs are its plan coordinates). */
export function floorTiles(): THREE.Texture | null {
  return canvasTexture('floor', 512, 512, (c) => {
    const r = rng(7);
    c.fillStyle = '#5d636a'; c.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
      const v = 88 + Math.floor(r() * 10);
      c.fillStyle = `rgb(${v},${v + 3},${v + 8})`; c.fillRect(i * 256 + 2, j * 256 + 2, 252, 252);
      for (let k = 0; k < 900; k++) { const g = v + Math.floor((r() - 0.5) * 18); c.fillStyle = `rgba(${g},${g + 2},${g + 6},.5)`; c.fillRect(i * 256 + 2 + r() * 250, j * 256 + 2 + r() * 250, 2, 2); }
    }
    c.fillStyle = '#3f444a'; c.fillRect(0, 0, 512, 3); c.fillRect(0, 254, 512, 4); c.fillRect(0, 0, 3, 512); c.fillRect(254, 0, 4, 512);
  }, [1 / 1.2, 1 / 1.2]);
}
/** A fine laminate: a desk or bench top, close to grey with a faint grain. */
export function laminate(): THREE.Texture | null {
  return canvasTexture('laminate', 256, 256, (c) => {
    const r = rng(11);
    c.fillStyle = '#8a9097'; c.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y++) { const g = 128 + Math.floor((r() - 0.5) * 10); c.fillStyle = `rgba(${g},${g + 3},${g + 7},.35)`; c.fillRect(0, y, 256, 1); }
  }, [3, 1]);
}
/** The intercom's face: a grey box with a round grille. */
export function grille(): THREE.Texture | null {
  return canvasTexture('grille', 128, 128, (c) => {
    c.fillStyle = '#b8bec4'; c.fillRect(0, 0, 128, 128);
    c.fillStyle = '#2a2f35';
    for (let y = 18; y < 82; y += 7) for (let x = 18; x < 112; x += 7) if (Math.hypot(x - 64, y - 48) < 40) { c.beginPath(); c.arc(x, y, 2, 0, Math.PI * 2); c.fill(); }
  });
}
/** Night foliage outside a window: palms and broad leaves, dark green under a moonlit blue sky. */
export function nightFoliage(): THREE.Texture | null {
  return canvasTexture('foliage', 1024, 512, (c) => {
    const r = rng(23);
    const sky = c.createLinearGradient(0, 0, 0, 512); sky.addColorStop(0, '#0b1a2b'); sky.addColorStop(1, '#102a2a');
    c.fillStyle = sky; c.fillRect(0, 0, 1024, 512);
    const leaf = (x: number, y: number, len: number, ang: number, col: string) => {
      c.save(); c.translate(x, y); c.rotate(ang); c.fillStyle = col; c.beginPath(); c.moveTo(0, 0);
      c.quadraticCurveTo(len * 0.5, -len * 0.22, len, 0); c.quadraticCurveTo(len * 0.5, len * 0.22, 0, 0); c.fill(); c.restore();
    };
    for (let layer = 0; layer < 3; layer++) {
      const tone = ['#0f2b22', '#143a2b', '#1b4a35'][layer];
      for (let i = 0; i < 14; i++) {
        const x = r() * 1024, y = 140 + layer * 110 + r() * 120, n = 6 + Math.floor(r() * 6), len = 90 + r() * 120 - layer * 15;
        for (let k = 0; k < n; k++) leaf(x, y, len, -Math.PI * 0.95 + (k / n) * Math.PI * 0.9 + (r() - 0.5) * 0.2, tone);
      }
    }
    // moonlight on a few leaf edges
    for (let i = 0; i < 60; i++) { c.strokeStyle = 'rgba(120,170,190,.10)'; c.lineWidth = 2; c.beginPath(); const x = r() * 1024, y = 120 + r() * 380; c.moveTo(x, y); c.lineTo(x + 30 + r() * 40, y - 8 - r() * 14); c.stroke(); }
  });
}
