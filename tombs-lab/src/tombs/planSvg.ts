import { PLAN, FOOTPRINT } from './spec';
import { cutWall } from './collision';
import { FURNITURE, type Furniture } from './furniture';

/**
 * A top-down floor plan of the lab, drawn from the SAME data the 3D building and the collision
 * use (spec.ts and furniture.ts): walls with their real thickness and openings, glass, doors,
 * every piece of furniture, room names and sizes, a scale bar and north. It is the plan to hold
 * up against the Draft C blueprint, and it can never drift from the model because it is not
 * drawn by hand.
 */
const PX = 28; // pixels per metre
const X0 = -19, X1 = 19, Z0 = -15, Z1 = 16.5;
const sx = (x: number) => ((x - X0) * PX).toFixed(1);
const sz = (z: number) => ((z - Z0) * PX).toFixed(1);
const len = (m: number) => (m * PX).toFixed(1);

const COLORS = {
  bg: '#0b2545', grid: '#16365e', wall: '#e8f4ff', glass: '#69d7ff', door: '#ffd166',
  furniture: '#9cc9ef', furnitureFill: 'rgba(120,180,230,0.16)', text: '#e8f4ff', dim: '#8fb8de', chair: '#7fa7cc',
};

function wallPolys(): string {
  const out: string[] = [];
  for (const wall of PLAN.walls) {
    const thick = wall.material === 'external' ? .28 : wall.material === 'array' ? .25 : .16;
    for (const part of cutWall(wall)) {
      if (part.y0 > 0.01) continue; // lintels are above head height; a plan shows the cut at ~1.2 m
      const dx = part.to[0] - part.from[0], dz = part.to[1] - part.from[1], L = Math.hypot(dx, dz);
      const nx = -dz / L * thick / 2, nz = dx / L * thick / 2;
      const pts = [[part.from[0] + nx, part.from[1] + nz], [part.to[0] + nx, part.to[1] + nz], [part.to[0] - nx, part.to[1] - nz], [part.from[0] - nx, part.from[1] - nz]];
      const fill = part.glass ? COLORS.glass : COLORS.wall;
      if (part.glass || part.y1 > 1.2)
        out.push(`<polygon points="${pts.map(p => `${sx(p[0])},${sz(p[1])}`).join(' ')}" fill="${fill}" opacity="${part.glass ? .75 : 1}"/>`);
      else // a sill under a window: the glass above it is what the plan shows
        out.push(`<polygon points="${pts.map(p => `${sx(p[0])},${sz(p[1])}`).join(' ')}" fill="${COLORS.glass}" opacity=".75"/>`);
    }
  }
  return out.join('');
}

function doors(): string {
  return PLAN.doors.map(d => {
    const w = d.width;
    if (d.along === 'z') return `<rect x="${sx(d.at[0] - .05)}" y="${sz(d.at[1] - w / 2)}" width="${len(.1)}" height="${len(w)}" fill="${COLORS.door}" opacity=".85"/>`;
    return `<rect x="${sx(d.at[0] - w / 2)}" y="${sz(d.at[1] - .05)}" width="${len(w)}" height="${len(.1)}" fill="${COLORS.door}" opacity=".85"/>`;
  }).join('');
}

function piece(f: Furniture): string {
  const x = f.x - f.w / 2, z = f.z - f.d / 2;
  const stroke = f.kind === 'chair' ? COLORS.chair : COLORS.furniture;
  if (f.kind === 'round-table') return `<circle cx="${sx(f.x)}" cy="${sz(f.z)}" r="${len(f.w / 2)}" fill="${COLORS.furnitureFill}" stroke="${stroke}" stroke-width="1.4"/>`;
  if (f.kind === 'plant') return `<circle cx="${sx(f.x)}" cy="${sz(f.z)}" r="${len(f.w / 2)}" fill="rgba(90,170,110,.35)" stroke="#7fd39a" stroke-width="1.2"/>`;
  if (f.kind === 'chair') return `<rect x="${sx(x)}" y="${sz(z)}" width="${len(f.w)}" height="${len(f.d)}" rx="${len(.1)}" fill="none" stroke="${stroke}" stroke-width="1.2"/>`;
  // the side a person uses it from, marked with a thicker line
  const [fx, fz] = { n: [0, -1], s: [0, 1], e: [1, 0], w: [-1, 0] }[f.facing];
  const fx0 = f.x - fx * f.w / 2, fz0 = f.z - fz * f.d / 2;
  const edge = fz !== 0
    ? `<line x1="${sx(x)}" y1="${sz(fz0)}" x2="${sx(x + f.w)}" y2="${sz(fz0)}" stroke="${COLORS.text}" stroke-width="2"/>`
    : `<line x1="${sx(fx0)}" y1="${sz(z)}" x2="${sx(fx0)}" y2="${sz(z + f.d)}" stroke="${COLORS.text}" stroke-width="2"/>`;
  return `<rect x="${sx(x)}" y="${sz(z)}" width="${len(f.w)}" height="${len(f.d)}" fill="${COLORS.furnitureFill}" stroke="${stroke}" stroke-width="1.4"/>${f.kind === 'desk' || f.kind === 'console' || f.kind === 'counter' || f.kind === 'bench' ? '' : ''}${edge}`;
}

export function planSvg(): string {
  const W = (X1 - X0) * PX, H = (Z1 - Z0) * PX;
  const grid: string[] = [];
  for (let x = Math.ceil(X0); x <= X1; x++) grid.push(`<line x1="${sx(x)}" y1="0" x2="${sx(x)}" y2="${H}" stroke="${COLORS.grid}" stroke-width="${x % 5 === 0 ? 1 : .5}"/>`);
  for (let z = Math.ceil(Z0); z <= Z1; z++) grid.push(`<line x1="0" y1="${sz(z)}" x2="${W}" y2="${sz(z)}" stroke="${COLORS.grid}" stroke-width="${z % 5 === 0 ? 1 : .5}"/>`);
  const floor = FOOTPRINT;
  const labels = PLAN.rooms.map(r => {
    const cx = (r.bounds.x0 + r.bounds.x1) / 2, cz = (r.bounds.z0 + r.bounds.z1) / 2;
    const w = (r.bounds.x1 - r.bounds.x0).toFixed(1), d = (r.bounds.z1 - r.bounds.z0).toFixed(1);
    const y = r.id === 'array' ? cz + 3.4 : r.id === 'control' ? cz + 0.2 : cz;
    return `<text x="${sx(cx)}" y="${sz(y)}" fill="${COLORS.text}" font-size="12" font-weight="700" text-anchor="middle" letter-spacing=".5">${r.label}</text>`
      + `<text x="${sx(cx)}" y="${sz(y) }" dy="15" fill="${COLORS.dim}" font-size="10.5" text-anchor="middle">${w} m × ${d} m</text>`;
  }).join('');
  const ring = [2.65, 2.3, 1.95].map(r => r * 1.15).map(r => `<circle cx="${sx(0)}" cy="${sz(0)}" r="${len(r)}" fill="none" stroke="${COLORS.glass}" stroke-width="1.2" opacity=".7"/>`).join('')
    + `<circle cx="${sx(0)}" cy="${sz(0)}" r="${len(1.9 * 1.15)}" fill="rgba(105,215,255,.12)" stroke="${COLORS.furniture}" stroke-width="1.2"/>`;
  const scale = `<g transform="translate(${W - 12 * PX - 30},${H - 34})"><text x="0" y="-8" fill="${COLORS.text}" font-size="11" font-weight="700">SCALE (METRES)</text>`
    + [0, 2, 4, 6, 8, 10].map(m => `<line x1="${len(m)}" y1="0" x2="${len(m)}" y2="8" stroke="${COLORS.text}"/><text x="${len(m)}" y="22" fill="${COLORS.dim}" font-size="10" text-anchor="middle">${m}</text>`).join('')
    + `<line x1="0" y1="4" x2="${len(10)}" y2="4" stroke="${COLORS.text}" stroke-width="2"/></g>`;
  const north = `<g transform="translate(40,44)"><circle r="20" fill="none" stroke="${COLORS.text}"/><path d="M0,-15 L7,8 L0,3 L-7,8 Z" fill="${COLORS.text}"/><text y="-25" fill="${COLORS.text}" font-size="12" text-anchor="middle">N</text></g>`;
  const title = `<text x="${W / 2}" y="26" fill="${COLORS.text}" font-size="17" font-weight="700" text-anchor="middle" letter-spacing="1">TOMBS LABORATORY · DRAFT C · PLAN FROM THE MODEL</text>`
    + `<text x="${W / 2}" y="44" fill="${COLORS.dim}" font-size="11" text-anchor="middle">36 m × 28 m envelope · walls, glass (cyan), doors (yellow), furniture (heavy edge = the side you use it from), drawn from spec.ts and furniture.ts</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="system-ui,Segoe UI,Arial">`
    + `<rect width="${W}" height="${H}" fill="${COLORS.bg}"/>${grid.join('')}`
    + `<polygon points="${floor.map(p => `${sx(p[0])},${sz(p[1])}`).join(' ')}" fill="#123a66"/>`
    + ring + FURNITURE.map(piece).join('') + wallPolys() + doors() + labels + scale + north + title + `</svg>`;
}
