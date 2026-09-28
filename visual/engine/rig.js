// Optional 2D cutout rig for a character sprite (experimental, off unless asked for).
//
// The full-body sprite stays the canonical picture. A rig says which polygon of that
// sprite is which body part, where each part pivots, and what it hangs from; the parts are
// cut from the sprite at run time, so the artwork is never edited or duplicated on disk.
// At rest the rig draws the sprite back pixel for pixel. Rotating a part reveals what was
// behind it, so each part's hidden area (where a part in front of it covers it) is filled
// from its own neighbouring colours: a shirt behind an arm stays shirt, never a hole.
//
// Coordinates are normalized to the sprite canvas (0..1 across, 0..1 down), so a rig is
// not tied to a resolution. A rig for one pose and direction looks like:
//   { view: "front"|"back"|"side", facing: 1|-1|0,
//     joints: { head: { parent: "torso", pivotX, pivotY, z, side, polygon: [[x, y], ...] }, ... } }
// Rigs live in assets/characters/<name>/rig.json ("<pose>/<direction>" keys); any
// direction without one is rigged automatically from the silhouette (autoRig below).

export const JOINTS = [
  "torso", "head",
  "leftUpperArm", "leftForearm", "leftHand", "rightUpperArm", "rightForearm", "rightHand",
  "leftUpperLeg", "leftLowerLeg", "leftFoot", "rightUpperLeg", "rightLowerLeg", "rightFoot",
];
const PARENT = {
  torso: null, head: "torso",
  leftUpperArm: "torso", leftForearm: "leftUpperArm", leftHand: "leftForearm",
  rightUpperArm: "torso", rightForearm: "rightUpperArm", rightHand: "rightForearm",
  leftUpperLeg: null, leftLowerLeg: "leftUpperLeg", leftFoot: "leftLowerLeg",
  rightUpperLeg: null, rightLowerLeg: "rightUpperLeg", rightFoot: "rightLowerLeg",
};

export function viewOf(direction) {
  if (direction === "east" || direction === "west") return "side";
  return direction.startsWith("north") ? "back" : "front";
}

// A rig for the mirror image of a direction: x flipped, left and right swapped.
export function mirrorRig(rig) {
  const swap = (n) => (n.startsWith("left") ? "right" + n.slice(4) : n.startsWith("right") ? "left" + n.slice(5) : n);
  const joints = {};
  for (const [name, j] of Object.entries(rig.joints)) {
    joints[swap(name)] = {
      ...j,
      parent: j.parent ? swap(j.parent) : null,
      pivotX: 1 - j.pivotX,
      side: -(j.side || 0),
      polygon: j.polygon.map(([x, y]) => [1 - x, y]),
    };
  }
  const fill = rig.fill && rig.fill.map((poly) => poly.map(([x, y]) => [1 - x, y]));
  return { ...rig, facing: -(rig.facing || 0), joints, ...(fill ? { fill } : {}) };
}

// ---------------------------------------------------------------------------------------
// Automatic rig from the silhouette: body landmarks at fixed fractions of the figure's
// height (measured on these sheets), widths read row by row from the alpha. It is a
// starting point for the rig editor, not a finished rig.
const LEVELS = {
  standing: { neck: 0.125, shoulder: 0.185, elbow: 0.375, wrist: 0.515, handEnd: 0.585, waist: 0.46, hip: 0.52, knee: 0.725, ankle: 0.925 },
  sitting: { neck: 0.215, shoulder: 0.285, elbow: 0.445, wrist: 0.56, handEnd: 0.62, waist: 0.56 },
};

export function autoRig(img, pose, direction) {
  const W = img.naturalWidth || img.width, H = img.naturalHeight || img.height;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d", { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const a = g.getImageData(0, 0, W, H).data;
  const L = new Array(H).fill(-1), R = new Array(H).fill(-1), C = new Array(H).fill(W / 2);
  let T = H, B = 0;
  for (let y = 0; y < H; y++) {
    let lo = -1, hi = -1, sum = 0, n = 0;
    for (let x = 0; x < W; x++) {
      if (a[(y * W + x) * 4 + 3] > 100) {
        if (lo < 0) lo = x;
        hi = x;
        sum += x;
        n++;
      }
    }
    if (n) {
      L[y] = lo;
      R[y] = hi;
      C[y] = sum / n;
      T = Math.min(T, y);
      B = Math.max(B, y);
    }
  }
  const FH = B - T, lv = LEVELS[pose] || LEVELS.standing;
  const row = (f) => Math.round(T + f * FH);
  const at = (arr, f) => { const y = Math.min(B, Math.max(T, row(f))); return arr[y] >= 0 ? arr[y] : W / 2; };
  const nx = (x) => Math.max(0, Math.min(1, x / W)), ny = (y) => Math.max(0, Math.min(1, y / H));
  const P = (pts) => pts.map(([x, y]) => [+nx(x).toFixed(4), +ny(y).toFixed(4)]);
  const view = viewOf(direction), facing = direction === "east" ? 1 : direction === "west" ? -1 : 0;
  const pad = 0.02 * W, fy = (f) => T + f * FH;
  const joints = {};
  const put = (name, pivot, poly, z, side = 0) =>
    (joints[name] = { parent: PARENT[name], pivotX: +nx(pivot[0]).toFixed(4), pivotY: +ny(pivot[1]).toFixed(4), z, side, polygon: P(poly) });

  // Head: everything above the neck, with the neck itself, overlapping the shoulders.
  let hl = W, hr = 0;
  for (let y = T; y <= row(lv.neck); y++) if (L[y] >= 0) { hl = Math.min(hl, L[y]); hr = Math.max(hr, R[y]); }
  put("head", [at(C, lv.neck), fy(lv.neck)], [[hl - pad, T - pad], [hr + pad, T - pad], [hr + pad * 0.5, fy(lv.neck + 0.035)], [hl - pad * 0.5, fy(lv.neck + 0.035)]], 3);

  const shW = at(R, lv.shoulder + 0.03) - at(L, lv.shoulder + 0.03);
  if (view === "side") {
    // Side view: the near arm hangs over the middle of the body; the far arm is hidden.
    const armW = 0.3 * shW, ax = at(C, lv.shoulder + 0.03);
    const near = facing > 0 ? "right" : "left";
    // The trunk's width comes from the chest, not the waist row: seated in profile, the waist
    // row runs out along the thighs to the knees.
    const torsoL = at(L, lv.shoulder + 0.06), torsoR = at(R, lv.shoulder + 0.06), bot = (lv.hip || lv.waist) + 0.03;
    const bl = pose === "standing" ? at(L, lv.waist) : torsoL, br = pose === "standing" ? at(R, lv.waist) : torsoR;
    put("torso", [at(C, lv.shoulder + 0.2), fy(lv.waist)], [[torsoL - pad, fy(lv.shoulder - 0.06)], [torsoR + pad, fy(lv.shoulder - 0.06)], [br + pad, fy(bot)], [bl - pad, fy(bot)]], 2);
    armChain(put, near, ax, ax, ax, armW, lv, fy, 0);
  } else {
    // Front or back: the arms are the outer strips of the silhouette.
    const armW = 0.2 * shW;
    const torsoHalf = Math.max(4, (shW - 2 * armW) / 2 + 0.25 * armW);
    const cx = at(C, lv.shoulder + 0.05);
    const bottom = lv.hip ? lv.hip + 0.03 : lv.waist + 0.03;
    put("torso", [at(C, lv.waist), fy(lv.waist)], [[cx - torsoHalf, fy(lv.shoulder - 0.05)], [cx + torsoHalf, fy(lv.shoulder - 0.05)], [cx + torsoHalf, fy(bottom)], [cx - torsoHalf, fy(bottom)]], 2);
    // Screen-left arm is the character's right in a front view and left in a back view.
    const leftSide = view === "front" ? "right" : "left", rightSide = view === "front" ? "left" : "right";
    armChain(put, leftSide, at(L, lv.shoulder + 0.03) + armW * 0.55, at(L, lv.elbow) + armW * 0.5, at(L, lv.wrist) + armW * 0.5, armW, lv, fy, +1);
    armChain(put, rightSide, at(R, lv.shoulder + 0.03) - armW * 0.55, at(R, lv.elbow) - armW * 0.5, at(R, lv.wrist) - armW * 0.5, armW, lv, fy, -1);
    if (pose === "standing") {
      // Legs split down the middle, each overlapping the other a little.
      const ov = 0.02 * W, hipHalf = torsoHalf * 0.95;
      for (const [name, s] of [[leftSide, +1], [rightSide, -1]]) {
        const inner = (f) => at(C, f) + s * ov;
        const outer = (f) => (s > 0 ? Math.max(at(L, f), at(C, f) - hipHalf) - pad : Math.min(at(R, f), at(C, f) + hipHalf) + pad);
        const mid = (f) => (inner(f) + outer(f)) / 2;
        const seg = (n, f0, f1, pivotF, z) =>
          put(name + n, [mid(pivotF), fy(pivotF)], [[outer(f0), fy(f0)], [inner(f0), fy(f0)], [inner(f1), fy(f1)], [outer(f1), fy(f1)]].map(([x, y]) => [x, y]), z, s);
        seg("UpperLeg", lv.hip - 0.035, lv.knee + 0.02, lv.hip, 1);
        seg("LowerLeg", lv.knee - 0.02, lv.ankle + 0.012, lv.knee, 1);
        seg("Foot", lv.ankle - 0.015, 1.02, lv.ankle, 1);
      }
    }
  }
  // An automatic arm over the body (a side view) or over the chair (seated) is a rectangle
  // that also holds the shirt, trousers or armrest behind it, and a big turn carries those
  // along. Until someone draws its shape in the rig editor it may only move a little:
  // enough to type, not to point.
  if (view === "side" || pose === "sitting")
    for (const [name, j] of Object.entries(joints)) if (/Arm|Forearm|Hand/.test(name)) j.maxAngle = 4;
  return { view, facing, auto: true, joints };
}

function armChain(put, side, xs, xe, xw, armW, lv, fy, s) {
  // s: +1 for an arm on the screen-left edge, -1 on the screen-right edge, 0 side view.
  const box = (x, w) => [x - w, x + w];
  const hw = armW * 0.62;
  const [a0, a1] = box(xs, hw), [e0, e1] = box(xe, hw), [w0, w1] = box(xw, hw * 0.95);
  put(side + "UpperArm", [xs, fy(lv.shoulder + 0.015)], [[a0, fy(lv.shoulder - 0.03)], [a1, fy(lv.shoulder - 0.03)], [e1, fy(lv.elbow + 0.02)], [e0, fy(lv.elbow + 0.02)]], 4, s);
  put(side + "Forearm", [xe, fy(lv.elbow)], [[e0, fy(lv.elbow - 0.02)], [e1, fy(lv.elbow - 0.02)], [w1, fy(lv.wrist + 0.012)], [w0, fy(lv.wrist + 0.012)]], 5, s);
  put(side + "Hand", [xw, fy(lv.wrist)], [[w0, fy(lv.wrist - 0.015)], [w1, fy(lv.wrist - 0.015)], [w1 + s * 0, fy(lv.handEnd + 0.015)], [w0, fy(lv.handEnd + 0.015)]], 6, s);
}

// ---------------------------------------------------------------------------------------
// Building the layers: one canvas per part plus a base for whatever no part covers.

const MARGIN = 0.3; // room around the sprite for a part that swings out, as a share of its width
const GROW = 2; // px: how far past a covering part's pixels the part behind it is refilled

function polyPath(g, poly, W, H) {
  g.beginPath();
  poly.forEach(([x, y], i) => (i ? g.lineTo(x * W, y * H) : g.moveTo(x * W, y * H)));
  g.closePath();
}

// A part's shape as a hard-edged mask: every pixel wholly in or wholly out. Cutting the
// sprite with soft (anti-aliased) edges leaves each edge pixel half in the part and half in
// the base, and two half-transparent pixels drawn over each other are not a solid one: a
// faint seam shows along every cut. With hard masks the part and the base add up to the
// sprite exactly.
function polyMask(poly, W, H) {
  const c = canvas(W, H), g = c.getContext("2d", { willReadFrequently: true });
  polyPath(g, poly, W, H);
  g.fillStyle = "#000";
  g.fill();
  const d = g.getImageData(0, 0, W, H), a = d.data;
  for (let i = 3; i < a.length; i += 4) a[i] = a[i] >= 128 ? 255 : 0;
  g.putImageData(d, 0, 0);
  return c;
}

function canvas(W, H) {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  return c;
}

// Push-pull hole filling: shrink the picture by halves (the browser averages only the
// opaque pixels, since it works in premultiplied alpha), then paint each coarser level
// UNDER the finer one. Every transparent pixel ends up with the average colour around it.
function pushPull(src) {
  const levels = [src];
  let c = src;
  while (c.width > 2 && c.height > 2) {
    const d = canvas(Math.max(1, c.width >> 1), Math.max(1, c.height >> 1));
    const g = d.getContext("2d");
    g.imageSmoothingQuality = "high";
    g.drawImage(c, 0, 0, d.width, d.height);
    levels.push(d);
    c = d;
  }
  for (let i = levels.length - 2; i >= 0; i--) {
    const up = canvas(levels[i].width, levels[i].height), g = up.getContext("2d");
    g.drawImage(levels[i], 0, 0);
    g.globalCompositeOperation = "destination-over";
    g.drawImage(levels[i + 1], 0, 0, up.width, up.height);
    levels[i] = up;
  }
  // The averaging leaves the invented colours partly transparent (it counted the empty
  // background around the figure too): make them solid, or a fill lets the background
  // show through as a dark line.
  const out = levels[0], g = out.getContext("2d", { willReadFrequently: true });
  const d = g.getImageData(0, 0, out.width, out.height), a = d.data;
  for (let i = 3; i < a.length; i += 4) if (a[i] > 0) a[i] = 255;
  g.putImageData(d, 0, 0);
  return out;
}

export class Rig {
  constructor(img, rig, limits = {}) {
    this.img = img;
    this.rig = rig;
    this.limits = limits;
    const W = (this.W = img.naturalWidth || img.width), H = (this.H = img.naturalHeight || img.height);
    this.M = Math.round(MARGIN * W);
    const joints = Object.entries(rig.joints).filter(([, j]) => j.polygon && j.polygon.length >= 3);
    this.order = joints.sort((a, b) => a[1].z - b[1].z).map(([n]) => n);
    this.layers = {};
    // The base: the sprite with every part cut out (the chair, anything unrigged).
    const masks = {};
    for (const [name, j] of joints) masks[name] = polyMask(j.polygon, W, H);
    // The sprite's fully opaque pixels. Anything painted in to hide what a moved part
    // uncovers goes only under these: a half-transparent edge pixel drawn over a fill is
    // no longer the pixel the artist drew, so at rest the rig would not be the sprite.
    const solid = canvas(W, H);
    {
      const sg = solid.getContext("2d", { willReadFrequently: true });
      sg.drawImage(img, 0, 0);
      const d = sg.getImageData(0, 0, W, H), a = d.data;
      for (let i = 0; i < a.length; i += 4) { const on = a[i + 3] === 255; a[i] = a[i + 1] = a[i + 2] = 0; a[i + 3] = on ? 255 : 0; }
      sg.putImageData(d, 0, 0);
    }
    const binary = (c) => {
      const g = c.getContext("2d", { willReadFrequently: true }), d = g.getImageData(0, 0, W, H), a = d.data;
      for (let i = 3; i < a.length; i += 4) a[i] = a[i] > 0 ? 255 : 0;
      g.putImageData(d, 0, 0);
      return c;
    };
    const base = canvas(W, H), bg = base.getContext("2d");
    bg.drawImage(img, 0, 0);
    bg.globalCompositeOperation = "destination-out";
    for (const [name] of joints) bg.drawImage(masks[name], 0, 0);
    // What the parts uncover inside the figure (a thigh under a resting hand, a chair's
    // armrest): rig.fill marks those areas, and they are filled from the colours around
    // them. Elsewhere the base stays open, so a hand held against the background leaves
    // background behind it.
    // The same for the torso while it is still an automatic box: its straight edge crosses
    // the shirt, and a breath or a lean would open a hairline to the background along it.
    // Only inside the figure, so a box's empty corners never paint anything.
    // Inside the body, as the tracer found it (rig.fill): only there is what a traced limb
    // uncovers painted in. Elsewhere under a limb is the room, and it shows.
    const bodyFill = canvas(W, H);
    {
      const g = bodyFill.getContext("2d");
      g.fillStyle = "#000";
      for (const poly of rig.fill || []) { polyPath(g, poly, W, H); g.fill(); }
      binary(bodyFill);
    }
    const tracedCore = canvas(W, H);
    {
      const g = tracedCore.getContext("2d");
      for (const [n, j] of joints) if (j.traced) g.drawImage(masks[n], 0, 0);
      g.globalCompositeOperation = "destination-out";
      g.drawImage(bodyFill, 0, 0);
    }
    const boxes = joints.filter(([n, j]) => !j.traced && n !== "head");
    if ((rig.fill && rig.fill.length) || boxes.length) {
      const mask = canvas(W, H), mg = mask.getContext("2d");
      mg.drawImage(bodyFill, 0, 0);
      // a band just inside each box's straight edge, where a breath would open a hairline
      for (const [n, j] of boxes) {
        const band = canvas(W, H), bg3 = band.getContext("2d");
        bg3.drawImage(masks[n], 0, 0);
        bg3.globalCompositeOperation = "destination-out";
        bg3.fillStyle = "#000";
        polyPath(bg3, j.polygon, W, H); bg3.fill();
        bg3.globalCompositeOperation = "source-over";
        bg3.lineWidth = 14; bg3.strokeStyle = "#000";
        polyPath(bg3, j.polygon, W, H); bg3.stroke();
        bg3.globalCompositeOperation = "destination-in";
        bg3.drawImage(masks[n], 0, 0);
        mg.drawImage(band, 0, 0);
      }
      mg.globalCompositeOperation = "destination-in";
      mg.drawImage(solid, 0, 0);
      mg.globalCompositeOperation = "destination-out";
      mg.drawImage(tracedCore, 0, 0);
      // not under the head: what a turned head uncovers is the room behind it, not shirt
      if (masks.head) {
        mg.globalCompositeOperation = "destination-out";
        for (let dx = -4; dx <= 4; dx += 2) for (let dy = -4; dy <= 4; dy += 2) mg.drawImage(masks.head, dx, dy);
      }
      const under = canvas(W, H), ug = under.getContext("2d");
      ug.drawImage(pushPull(base), 0, 0);
      ug.globalCompositeOperation = "destination-in";
      ug.drawImage(binary(mask), 0, 0);
      bg.globalCompositeOperation = "destination-over";
      bg.drawImage(under, 0, 0);
    }
    this.base = base;
    // Each part as drawn: the sprite cut by its mask. Parts overlap by a pixel on purpose
    // (a turn must not open a hairline between them), and an opaque pixel drawn twice is
    // the same pixel; a half-transparent one is not. So an edge pixel already drawn by a
    // part further back is left out of the parts in front of it.
    const own = {}, soft = canvas(W, H), claimed = canvas(W, H), cg = claimed.getContext("2d");
    {
      const g = soft.getContext("2d");
      g.drawImage(img, 0, 0);
      g.globalCompositeOperation = "destination-out";
      g.drawImage(solid, 0, 0);
      binary(soft);
    }
    for (const name of this.order) {
      const c = canvas(W, H), g = c.getContext("2d");
      g.drawImage(img, 0, 0);
      g.globalCompositeOperation = "destination-in";
      g.drawImage(masks[name], 0, 0);
      const taken = canvas(W, H), tg = taken.getContext("2d");
      tg.drawImage(claimed, 0, 0);
      tg.globalCompositeOperation = "destination-in";
      tg.drawImage(soft, 0, 0);
      g.globalCompositeOperation = "destination-out";
      g.drawImage(taken, 0, 0);
      cg.drawImage(masks[name], 0, 0);
      own[name] = c;
    }
    // Where a part in front covers this one (a traced part's drawn pixels and GROW px more,
    // so the edge it blended over goes too; an automatic box's polygon shrunk by 3 px),
    // this part has a fill from its own colours around the hole. So a moved hand uncovers
    // trousers, not a hand-shaped ghost of itself. A limb's own next piece (the forearm over
    // the end of the upper arm) is the same limb, not a cover.
    //
    // Each part is kept as three layers that add up to it exactly: `keep` (outside the
    // hole), `hole` (its own pixels inside the hole) and `fill`. draw() lays the fill
    // under the hole's own pixels and fades those out only as the covering part actually
    // moves away (this.cover), so at rest the rig is the sprite, pixel for pixel.
    this.cover = {};
    for (const [name, j] of joints) {
      const sameLimb = (k) => k.parent === name && name !== "torso" && name !== "head";
      const front = joints.filter(([, k]) => k.z > j.z && !sameLimb(k));
      if (!front.length) { this.layers[name] = { keep: own[name] }; continue; }
      const hole = canvas(W, H), hg = hole.getContext("2d");
      for (const [kn, k] of front) {
        if (k.traced) {
          for (let dx = -GROW; dx <= GROW; dx++)
            for (let dy = -GROW; dy <= GROW; dy++) if (dx * dx + dy * dy <= GROW * GROW + 1) hg.drawImage(own[kn], dx, dy);
        } else {
          const b = canvas(W, H), bg2 = b.getContext("2d");
          bg2.fillStyle = "#000";
          polyPath(bg2, k.polygon, W, H); bg2.fill();
          bg2.globalCompositeOperation = "destination-out";
          bg2.lineWidth = 6;
          polyPath(bg2, k.polygon, W, H); bg2.stroke();
          hg.drawImage(b, 0, 0);
        }
      }
      binary(hole);
      hg.globalCompositeOperation = "destination-in";
      hg.drawImage(masks[name], 0, 0);
      hg.drawImage(solid, 0, 0);
      const keep = canvas(W, H), kg = keep.getContext("2d");
      kg.drawImage(own[name], 0, 0);
      kg.globalCompositeOperation = "destination-out";
      kg.drawImage(hole, 0, 0);
      const inHole = canvas(W, H), ig = inHole.getContext("2d");
      ig.drawImage(own[name], 0, 0);
      ig.globalCompositeOperation = "destination-in";
      ig.drawImage(hole, 0, 0);
      const fill = canvas(W, H), f2 = fill.getContext("2d");
      f2.drawImage(pushPull(keep), 0, 0);
      f2.globalCompositeOperation = "destination-in";
      f2.drawImage(hole, 0, 0);
      f2.globalCompositeOperation = "destination-out";
      f2.drawImage(tracedCore, 0, 0); // under a traced limb and not inside the body: the room
      this.layers[name] = { keep, hole: inHole, fill };
      this.cover[name] = front.map(([kn]) => kn);
    }
  }

  // Draw the rig in a pose. angles: { joint: degrees } (clockwise positive); shift:
  // { joint: [dx, dy] } in normalized units. The target canvas is the sprite's size plus a
  // margin M on the left, right and top (the anchor moves by M, M).
  draw(target, angles = {}, shift = {}) {
    const { W, H, M } = this, g = target.getContext("2d");
    if (target.width !== W + 2 * M || target.height !== H + M) {
      target.width = W + 2 * M;
      target.height = H + M;
    }
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, target.width, target.height);
    g.setTransform(1, 0, 0, 1, M, M);
    g.drawImage(this.base, 0, 0);
    const mats = {};
    const matOf = (name) => {
      if (mats[name]) return mats[name];
      const j = this.rig.joints[name];
      const parent = j.parent && this.rig.joints[j.parent] ? matOf(j.parent) : new DOMMatrix([1, 0, 0, 1, M, M]);
      let a = angles[name] || 0;
      if (j.maxAngle !== undefined) a = Math.max(-j.maxAngle, Math.min(j.maxAngle, a));
      const lim = this.limits[name];
      if (lim !== undefined) a = Math.max(-lim, Math.min(lim, a));
      const [dx, dy] = shift[name] || [0, 0];
      const px = j.pivotX * W, py = j.pivotY * H;
      const m = parent.translate(dx * W, dy * H).translate(px, py).rotate(a).translate(-px, -py);
      return (mats[name] = m);
    };
    for (const name of this.order) matOf(name);
    for (const name of this.order) {
      const L = this.layers[name], m = mats[name];
      g.setTransform(m);
      g.drawImage(L.keep, 0, 0);
      if (!L.hole) continue;
      // how far the parts covering this one have moved relative to it, in pixels
      let moved = 0;
      const inv = m.inverse();
      for (const kn of this.cover[name]) {
        const k = this.rig.joints[kn], r = inv.multiply(mats[kn]);
        const px = k.pivotX * W, py = k.pivotY * H, far = 0.25 * H;
        const at = (x, y) => Math.hypot(r.a * x + r.c * y + r.e - x, r.b * x + r.d * y + r.f - y);
        moved = Math.max(moved, at(px, py), at(px + far, py), at(px, py + far));
      }
      const show = Math.min(1, moved / 2); // fully refilled once the cover has moved 2 px
      if (show > 0.001) g.drawImage(L.fill, 0, 0);
      if (show < 0.999) { g.globalAlpha = 1 - show; g.drawImage(L.hole, 0, 0); g.globalAlpha = 1; }
    }
    g.setTransform(1, 0, 0, 1, 0, 0);
  }
}

// rig.json for one character: explicit rigs by "<pose>/<direction>", with a mirrored
// direction derived from its source when it has none of its own.
export function rigFor(rigFile, sprite, pose, direction, img) {
  const key = `${pose}/${direction}`;
  const rigs = (rigFile && rigFile.rigs) || {};
  if (rigs[key]) return rigs[key];
  const frame = sprite.poses[pose].frames[direction];
  if (frame.mirrorOf && rigs[`${pose}/${frame.mirrorOf}`]) return mirrorRig(rigs[`${pose}/${frame.mirrorOf}`]);
  return autoRig(img, pose, direction);
}
