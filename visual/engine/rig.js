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
  return { ...rig, facing: -(rig.facing || 0), joints };
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

function polyPath(g, poly, W, H) {
  g.beginPath();
  poly.forEach(([x, y], i) => (i ? g.lineTo(x * W, y * H) : g.moveTo(x * W, y * H)));
  g.closePath();
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
  return levels[0];
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
    const base = canvas(W, H), bg = base.getContext("2d");
    bg.drawImage(img, 0, 0);
    bg.globalCompositeOperation = "destination-out";
    for (const [, j] of joints) { polyPath(bg, j.polygon, W, H); bg.fill(); }
    this.base = base;
    for (const [name, j] of joints) {
      // The part as drawn...
      const own = canvas(W, H), og = own.getContext("2d");
      og.save();
      polyPath(og, j.polygon, W, H);
      og.clip();
      og.drawImage(img, 0, 0);
      og.restore();

      // ...and where parts in front of it cover it, a fill from its own colours. The
      // covering shapes are shrunk by 3 px so the edge a part in front blends over is still
      // the original picture: at rest nothing shows a seam.
      const front = joints.filter(([, k]) => k.z > j.z);
      if (front.length) {
        const hole = canvas(W, H), hg = hole.getContext("2d");
        hg.fillStyle = "#000";
        for (const [, k] of front) { polyPath(hg, k.polygon, W, H); hg.fill(); }
        hg.globalCompositeOperation = "destination-out";
        hg.lineWidth = 6;
        for (const [, k] of front) { polyPath(hg, k.polygon, W, H); hg.stroke(); }
        hg.globalCompositeOperation = "destination-in";
        polyPath(hg, j.polygon, W, H);
        hg.fill();
        // own pixels outside the hole, then the fill inside it
        const keep = canvas(W, H), kg = keep.getContext("2d");
        kg.drawImage(own, 0, 0);
        kg.globalCompositeOperation = "destination-out";
        kg.drawImage(hole, 0, 0);
        const filled = pushPull(keep), fg = canvas(W, H), f2 = fg.getContext("2d");
        f2.drawImage(filled, 0, 0);
        f2.globalCompositeOperation = "destination-in";
        f2.drawImage(hole, 0, 0);
        f2.globalCompositeOperation = "source-over";
        f2.drawImage(keep, 0, 0);
        this.layers[name] = fg;
      } else this.layers[name] = own;
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
    for (const name of this.order) {
      g.setTransform(matOf(name));
      g.drawImage(this.layers[name], 0, 0);
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
