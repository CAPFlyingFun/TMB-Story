#!/usr/bin/env python3
"""Trace the standing legs for the cutout rigs (visual/engine/rig.js) from the silhouette.

    python3 scripts/trace-legs.py jack sarah [--preview DIR]
    (needs Pillow, numpy and opencv-python-headless; run after scripts/trace-arms.py,
    because the arms are taken out of the legs)

The automatic rig cut each leg as a box down the middle of the figure. In a three-quarter
view the legs are not in the middle, so a box held half of one leg and missed a shoe,
and those pieces stayed behind when the character walked. Here every pixel of the
figure below the hips that is not an arm belongs to a leg, so nothing is left behind.

Which leg a pixel belongs to is decided row by row. Below the crotch the two legs are
separate runs of the silhouette with background between them, and the split is the
middle of that gap. Where they touch (at the hips, at crossed ankles), the split is
carried over from the nearest rows where they were apart. Each leg is then cut into
upper leg, lower leg and foot at the knee and ankle, square across the leg, with a small
cap over each joint so a bend does not open a notch.

Skirts: for a character in a skirt (SKIRTS below), the legs start just above the hem,
and the torso is extended down over the whole skirt. The skirt then stays with the body,
the legs move under it, and the skirt is never split down the middle.
"""
import sys, json, os, re
import numpy as np, cv2
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = os.path.join(ROOT, "assets", "characters") + "/"
LEVELS = {"hip": 0.52, "knee": 0.725, "ankle": 0.925}  # of the figure's height, as rig.js
SKIRTS = {"sarah", "lena"}
OUT = None


def raster(polys, W, H):
    m = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(m)
    for p in polys:
        d.polygon([(x * W, y * H) for x, y in p], fill=255)
    return np.asarray(m) > 0


def to_poly(m, W, H, growable, eps=0.6):
    m = m.astype(np.uint8)
    m = (m | (cv2.dilate(m, np.ones((3, 3), np.uint8)) & growable)).astype(np.uint8)
    cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    if not cs:
        return None
    c = max(cs, key=cv2.contourArea)
    a = cv2.approxPolyDP(c, eps, True)[:, 0, :].astype(float)
    return [[round((x + 0.5) / W, 4), round((y + 0.5) / H, 4)] for x, y in a]


def split_rows(legs, top, B):
    """Per row, the x that separates the screen-left leg from the screen-right one."""
    H, W = legs.shape
    split = np.full(H, np.nan)
    for y in range(top, B + 1):
        xs = np.flatnonzero(legs[y])
        if xs.size < 6:
            continue
        lo, hi = xs[0], xs[-1]
        gaps = np.flatnonzero(np.diff(xs) > 1)
        best = None
        for g in gaps:
            a, b = xs[g], xs[g + 1]
            mid = (a + b) / 2
            left, right = (xs <= a).sum(), (xs >= b).sum()
            if left >= 4 and right >= 4 and lo + 0.2 * (hi - lo) <= mid <= hi - 0.2 * (hi - lo):
                if best is None or (b - a) > best[1]:
                    best = (mid, b - a)
        if best:
            split[y] = best[0]
    ok = np.flatnonzero(~np.isnan(split))
    if ok.size < 0.25 * (B - top + 1):  # a side view: the legs overlap, no honest split
        return None, ok.size
    rows = np.arange(top, B + 1)
    # carried over past the ends; between separated rows, interpolated
    first = np.median(split[ok[:8]])
    last = np.median(split[ok[-8:]])
    vals = np.interp(rows, ok, split[ok], left=first, right=last)
    k = 9
    pad = np.pad(vals, k // 2, mode="edge")
    vals = np.array([np.median(pad[i:i + k]) for i in range(vals.size)])
    out = np.full(H, np.nan)
    out[top:B + 1] = vals
    return out, ok.size


def hem_row(im, fig, T, B):
    """The last row of a dark skirt: where the dark share of the figure's row falls away."""
    H = im.shape[0]
    lum = im[..., :3].astype(float) @ [0.3, 0.59, 0.11]
    FH = B - T
    best = None
    for y in range(int(T + 0.5 * FH), int(T + 0.85 * FH)):
        row = fig[y]
        n = row.sum()
        if n < 5:
            continue
        dark = ((lum[y] < 70) & row).sum() / n
        if dark > 0.55:
            best = y
    return best


def trace(c, key, rig, im):
    H, W = im.shape[:2]
    alpha = im[..., 3] > 8
    ys = np.flatnonzero(alpha.any(1))
    T, B = ys[0], ys[-1]
    FH = B - T
    arm_polys = [j["polygon"] for n, j in rig["joints"].items() if re.search("Arm|Forearm|Hand", n)]
    arms = raster(arm_polys, W, H) if arm_polys else np.zeros((H, W), bool)
    hip = int(T + LEVELS["hip"] * FH)
    knee = int(T + LEVELS["knee"] * FH)
    ankle = int(T + LEVELS["ankle"] * FH)
    top = int(T + (LEVELS["hip"] - 0.035) * FH)
    hem = None
    if c in SKIRTS:
        hem = hem_row(im, alpha & ~arms, T, B)
        if hem:
            top = hem - int(0.02 * FH)  # tucked a little under the hem
    fig = alpha & ~arms
    region = fig.copy()
    region[:top] = False
    split, n_ok = split_rows(region, top, B)
    if split is None:
        return None, f"legs never separate ({n_ok} rows): left as the drawing"
    xx = np.arange(W)[None, :]
    lefthalf = xx < split[:, None]
    lefthalf[np.isnan(split)] = False
    legs = {"L": region & lefthalf, "R": region & ~lefthalf & ~np.isnan(split)[:, None]}
    yy = np.arange(H)[:, None] * np.ones((1, W))
    xg = np.ones((H, 1)) * np.arange(W)[None, :]

    # which named leg is on the screen-left: the existing joints say (front view: the
    # character's right), or, for a view with no legs yet, the arm on that side does
    names = [n[:-8] for n in rig["joints"] if n.endswith("UpperLeg")]
    if len(names) == 2:
        byx = sorted(names, key=lambda n: rig["joints"][n + "UpperLeg"]["pivotX"])
    else:
        view = rig.get("view")
        byx = ["right", "left"] if view == "front" else ["left", "right"]
        if view == "side":
            byx = ["left", "right"]
    out = {}
    for scr, name in zip(["L", "R"], byx):
        m = legs[scr]
        if m.sum() < 30:
            continue

        def centre(y0, y1):
            band = m[max(0, y0):y1 + 1]
            xs = np.flatnonzero(band.any(0))
            if xs.size == 0:
                return None
            cols = band.sum(0)
            return float((cols * np.arange(W)).sum() / cols.sum())

        hx = centre(hip - 3, hip + 3) if hem is None else centre(top, top + 6)
        kx = centre(knee - 2, knee + 2)
        axx = centre(ankle - 2, ankle + 2)
        if None in (hx, kx, axx):
            continue
        hy = hip if hem is None else top
        widthK = max(4, m[knee].sum())
        widthA = max(4, m[ankle].sum())
        upper = m & (yy < knee)
        lower = m & (yy >= knee) & (yy < ankle)
        foot = m & (yy >= ankle)
        lower |= m & (np.hypot(xg - kx, yy - knee) < 0.45 * widthK) & (yy < ankle)
        foot |= m & (np.hypot(xg - axx, yy - ankle) < 0.45 * widthA)
        grow = (~alpha) | m
        for part, mask, (px, py) in [("UpperLeg", upper, (hx, hy)), ("LowerLeg", lower, (kx, knee)), ("Foot", foot, (axx, ankle))]:
            poly = to_poly(mask, W, H, grow.astype(np.uint8))
            if not poly:
                continue
            out[name + part] = {
                "parent": {"UpperLeg": None, "LowerLeg": name + "UpperLeg", "Foot": name + "LowerLeg"}[part],
                "pivotX": round(px / W, 4), "pivotY": round(py / H, 4), "z": 1,
                "side": 1 if scr == "L" else -1, "polygon": poly, "traced": True,
            }
    torso = None
    if hem is not None:
        # the torso reaches down over the skirt, so the skirt stays with the body
        tp = rig["joints"]["torso"]["polygon"]
        ttop = min(p[1] for p in tp)
        skirt = alpha & ~arms
        skirt[: int(ttop * H)] = False
        skirt[hem + 2:] = False
        xs = np.flatnonzero(skirt.any(0))
        l, r = (xs[0] - 2) / W, (xs[-1] + 3) / W
        tl = min(p[0] for p in tp); tr = max(p[0] for p in tp)
        waist = max(p[1] for p in tp)
        torso = [[tl, ttop], [tr, ttop], [tr, round(waist - 0.04, 4)], [round(r, 4), round(waist - 0.04, 4)],
                 [round(r, 4), round((hem + 2) / H, 4)], [round(l, 4), round((hem + 2) / H, 4)], [round(l, 4), round(waist - 0.04, 4)], [tl, round(waist - 0.04, 4)]]
    return (out, torso), f"split from {n_ok} rows" + (f", hem at {hem}" if hem else "")


if __name__ == "__main__":
    args = sys.argv[1:]
    if "--preview" in args:
        i = args.index("--preview"); OUT = args[i + 1].rstrip("/") + "/"; del args[i:i + 2]
        os.makedirs(OUT, exist_ok=True)
    COL = {"UpperLeg": (255, 0, 255), "LowerLeg": (0, 220, 255), "Foot": (255, 220, 0)}
    for c in args:
        rf = json.load(open(R + f"{c}/rig.json"))
        sp = json.load(open(R + f"{c}/sprite.json"))
        for d, fr in sp["poses"]["standing"]["frames"].items():
            key = f"standing/{d}"
            if fr.get("mirrorOf") or key not in rf["rigs"]:
                continue
            rig = rf["rigs"][key]
            im = np.asarray(Image.open(R + f"{c}/{fr['file']}").convert("RGBA"))
            res, msg = trace(c, key, rig, im)
            print(c, key, msg)
            if not res:
                continue
            legs, torso = res
            for n in [n for n in rig["joints"] if re.search("UpperLeg|LowerLeg|Foot", n)]:
                del rig["joints"][n]
            rig["joints"].update(legs)
            if torso:
                rig["joints"]["torso"]["polygon"] = torso
            if OUT:
                H, W = im.shape[:2]
                bg = Image.new("RGBA", (W, H), (40, 60, 90, 255)); bg.alpha_composite(Image.fromarray(im))
                dr = ImageDraw.Draw(bg)
                for n, j in rig["joints"].items():
                    for k, col in COL.items():
                        if n.endswith(k):
                            dr.polygon([(x * W, y * H) for x, y in j["polygon"]], outline=col + (255,))
                            dr.ellipse([j["pivotX"] * W - 2, j["pivotY"] * H - 2, j["pivotX"] * W + 2, j["pivotY"] * H + 2], fill=col + (255,))
                if torso:
                    dr.polygon([(x * W, y * H) for x, y in torso], outline=(255, 255, 255, 255))
                bg.save(OUT + f"legs-{c}-{d}.png")
        text = json.dumps(rf, indent=1)
        text = re.sub(r"\[\s+(-?[\d.]+),\s+(-?[\d.]+)\s+\]", r"[\1, \2]", text)
        open(R + f"{c}/rig.json", "w").write(text + "\n")
        print("wrote", c)
