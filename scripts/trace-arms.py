#!/usr/bin/env python3
"""Trace each arm's own outline for the cutout rigs (visual/engine/rig.js).

    python3 scripts/trace-arms.py jack sarah [--preview DIR]
    (needs Pillow, numpy and opencv-python-headless)

The automatic rig cuts arms as boxes, and a box around a hand resting on a thigh carries
the trousers with it when the hand moves. This replaces the arm parts in rig.json with
the arm's real outline. For every view, assets/characters/<name>/arms.json holds a
hand-placed skeleton per visible arm (shoulder, elbow, wrist, fingertip, and widths).
Around that line GrabCut separates the arm from what it lies on by colour and edges:
a sure-arm core along the line, a probable band around it, and anything further away
held as not-arm. Seeds in arms.json settle what colour alone cannot: the chair's
armrest, a patch of cloth between a thumb and a wrist, Sarah's belly beside her arm. The
arm is split into upper arm, forearm and hand by whichever bone each pixel is nearest,
each piece is outlined as a polygon, and the pivots are the shoulder, elbow and wrist.

It also writes `fill` for each view: the parts of the arm lying inside the figure (a hand
on a thigh, an elbow on an armrest), which the renderer fills from the colours around
them when the arm moves. Heads, torsos and legs keep their automatic boxes.
"""
import sys, json, os, re
import numpy as np, cv2
from PIL import Image, ImageDraw
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = os.path.join(ROOT, "assets", "characters") + "/"
OUT = None  # --preview DIR writes outline pictures there

def seg_dist(px, py, a, b):
    ax, ay = a; bx, by = b; dx, dy = bx-ax, by-ay; L2 = dx*dx+dy*dy or 1
    t = np.clip(((px-ax)*dx+(py-ay)*dy)/L2, 0, 1)
    return np.hypot(px-(ax+t*dx), py-(ay+t*dy)), ((px-ax)*dx+(py-ay)*dy)/L2

def trace_arm(img, pts, widths, bg=(), fg=(), hem=None):
    """pts: [shoulder, elbow, wrist, tip] in px; widths: full widths (px) per segment.
    Returns the arm mask split into three part masks."""
    H, W = img.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    D = []; T = []
    for i in range(3):
        d, t = seg_dist(xx, yy, pts[i], pts[i+1]); D.append(d / (widths[i]/2)); T.append(t)
    D = np.stack(D); near = D.argmin(0); dn = D.min(0)
    before = (T[0] < 0) & (near == 0)            # above the shoulder cut
    alpha = img[..., 3] > 8
    mask = np.full((H, W), cv2.GC_BGD, np.uint8)
    mask[dn < 2.3] = cv2.GC_PR_BGD
    mask[dn < 1.25] = cv2.GC_PR_FGD
    mask[dn < 0.4] = cv2.GC_FGD
    mask[~alpha] = cv2.GC_BGD
    mask[before] = cv2.GC_BGD
    sleeve = np.zeros((H, W), bool)
    if hem:  # the sleeve, above its hem, is taken as it is; GrabCut then sees only skin below
        (hx1, hy1), (hx2, hy2) = hem
        side = lambda X, Y: (hx2 - hx1) * (Y - hy1) - (hy2 - hy1) * (X - hx1)
        up = np.sign(side(*pts[0]))
        above = np.sign(side(xx, yy)) == up
        sleeve = above & (near == 0) & (dn < 1.0) & alpha & ~before
        mask[above] = cv2.GC_BGD
    for x, y, r in bg: mask[np.hypot(xx - x, yy - y) < r] = cv2.GC_BGD
    for x, y, r in fg: mask[(np.hypot(xx - x, yy - y) < r) & alpha] = cv2.GC_FGD
    rgb = np.ascontiguousarray(img[..., :3][..., ::-1])
    bgd = np.zeros((1, 65), np.float64); fgd = np.zeros((1, 65), np.float64)
    cv2.grabCut(rgb, mask, None, bgd, fgd, 6, cv2.GC_INIT_WITH_MASK)
    arm = (((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD)) & alpha & ~before) | sleeve
    # keep what is connected to the skeleton core, fill pinholes
    n, lab = cv2.connectedComponents(arm.astype(np.uint8))
    core = set(np.unique(lab[(dn < 0.4) & arm & ~sleeve])) - {0}
    arm = np.isin(lab, list(core)) | sleeve
    arm = cv2.morphologyEx(arm.astype(np.uint8), cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    arm = (cv2.medianBlur(arm * 255, 3) > 127) & alpha  # smooth single-pixel bumps along the edge
    # Split at the joints square to the bone above, not on the bisector: a pixel nearer the
    # forearm but still above the elbow belongs to the upper arm, and one nearer the upper
    # arm but past the elbow belongs to the forearm. Otherwise the corner of the upper arm
    # past the joint pokes out when the forearm turns away (a step at the wrist).
    seg = near.copy()
    for i in range(2):
        seg[(near == i) & (T[i] > 1)] = i + 1
        seg[(near == i + 1) & (T[i + 1] < 0) & (T[i] <= 1)] = i
    parts = [(arm & (seg == i)) for i in range(3)]
    # Caps: the forearm also carries the end of the upper arm around the elbow, and the hand
    # the end of the forearm around the wrist. At rest these are the same pixels drawn twice;
    # when a joint bends, the cap turns with the lower piece and closes the notch that a
    # straight cut would open on the outside of the bend.
    for i in (1, 2):
        cx, cy = pts[i]
        # Just the joint: a cap reaching further up the bone draws its round edge across
        # the forearm as a visible offset when the hand tilts.
        parts[i] = parts[i] | (arm & (np.hypot(xx - cx, yy - cy) < min(widths[i - 1], widths[i]) * 0.5))
    return parts, arm

def to_poly(m, W, H, growable, eps=0.6):
    # Grow one pixel only into empty background, where it takes the arm's soft edge along.
    # Against the body (a hand on a knee) the edge pixels are part khaki, so the outline
    # stops at the arm's own pixels and the part behind is refilled under it.
    m = m.astype(np.uint8)
    # growable: empty background, and the arm's own other pieces, so that neighbouring
    # pieces overlap by a pixel instead of leaving a hairline between them.
    m = (m | (cv2.dilate(m, np.ones((3, 3), np.uint8)) & growable)).astype(np.uint8)
    cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    if not cs: return None
    c = max(cs, key=cv2.contourArea)
    a = cv2.approxPolyDP(c, eps, True)[:, 0, :].astype(float)
    return [[round((x + 0.5) / W, 4), round((y + 0.5) / H, 4)] for x, y in a]

if __name__ == "__main__":
    args = sys.argv[1:]
    if "--preview" in args:
        i = args.index("--preview"); OUT = args[i + 1].rstrip("/") + "/"; del args[i:i + 2]
        os.makedirs(OUT, exist_ok=True)
    for c in args:
        views = json.load(open(R + f"{c}/arms.json"))["views"]
        rf = json.load(open(R + f"{c}/rig.json"))
        for key, arms in views.items():
            im = np.asarray(Image.open(R + f"{c}/{key}.png").convert("RGBA"))
            H, W = im.shape[:2]
            rig = rf["rigs"][key]
            allarm = np.zeros((H, W), bool)
            shoulders = np.zeros((H, W), bool)
            nofill = np.zeros((H, W), bool)
            prev = Image.fromarray(im).convert("RGBA"); bg = Image.new("RGBA", prev.size, (90, 140, 90, 255)); bg.alpha_composite(prev)
            d = ImageDraw.Draw(bg)
            for side, a in arms.items():
                if a.get("drop"):  # an arm hidden behind the chair: not a part at all
                    for n in ["UpperArm", "Forearm", "Hand"]: rig["joints"].pop(side + n, None)
                    continue
                pts = [(x * W, y * H) for x, y in a["pts"]]
                ws = [w * W for w in a["w"]]
                if a.get("upperOnly"):  # forearm and hand hidden (behind an armrest): one piece
                    for n in ["Forearm", "Hand"]: rig["joints"].pop(side + n, None)
                parts, arm = trace_arm(im, pts, ws, [(x*W, y*H, r*W) for x, y, r in a.get('bg', [])], [(x*W, y*H, r*W) for x, y, r in a.get('fg', [])], [(x*W, y*H) for x, y in a['hem']] if 'hem' in a else None); allarm |= arm
                if a.get("noFill"): nofill |= arm
                names, pivs = ["UpperArm", "Forearm", "Hand"], pts[:3]
                # the top of the arm is the shoulder: when the arm swings, the body is still there
                yy0, xx0 = np.mgrid[0:H, 0:W]
                shoulders |= parts[0] & (np.hypot(xx0 - pts[0][0], yy0 - pts[0][1]) < 0.75 * ws[0])
                if a.get("upperOnly"): parts = [parts[0] | parts[1] | parts[2]]
                if a.get("handOnly"):  # only the hand shows (the rest is behind her): one piece about the wrist
                    for n in ["UpperArm", "Forearm"]: rig["joints"].pop(side + n, None)
                    rig["joints"][side + "Hand"]["parent"] = "torso"
                    parts, names, pivs = [parts[0] | parts[1] | parts[2]], ["Hand"], [pts[2]]
                for name, m, pv in zip(names, parts, pivs):
                    j = rig["joints"][side + name]
                    j["polygon"] = to_poly(m, W, H, ((im[..., 3] <= 8) | arm).astype(np.uint8)); j["pivotX"] = round(pv[0] / W, 4); j["pivotY"] = round(pv[1] / H, 4)
                    j.pop("maxAngle", None)
                    j["traced"] = True
                    col = {"UpperArm": (0, 220, 255, 255), "Forearm": (255, 220, 0, 255), "Hand": (255, 40, 40, 255)}[name]
                    d.polygon([(x * W, y * H) for x, y in j["polygon"]], outline=col)
                    d.ellipse([pv[0]-2, pv[1]-2, pv[0]+2, pv[1]+2], fill=col)
            # where the base must be filled when an arm moves: arm pixels enclosed by the rest of the figure
            rest = (im[..., 3] > 8) & ~allarm
            r = max(5, int(0.05 * W)) | 1
            closed = cv2.morphologyEx(rest.astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2*r+1, 2*r+1))).astype(bool)
            fillm = closed & allarm
            # A limb lying ON something (a forearm across a lap, on an armrest) has the room
            # above it, not the body: walking straight up through the arm from such a pixel
            # reaches empty background within a short distance. Those pixels get no fill, so
            # a lifted forearm uncovers the room, not a block of invented trousers.
            D = max(8, int(0.08 * W))
            opaque = im[..., 3] > 8
            for x in range(W):
                col = fillm[:, x]
                if not col.any():
                    continue
                run = 0
                for y in range(H):
                    if allarm[y, x]:
                        run += 1
                        if col[y] and run <= D:
                            # look up past the arm pixels above this one
                            yy_ = y - 1
                            while yy_ >= 0 and allarm[yy_, x]:
                                yy_ -= 1
                            if (y - yy_) <= D and (yy_ < 0 or not opaque[yy_, x]):
                                fillm[y, x] = False
                    else:
                        run = 0
            fillm &= ~nofill
            fillm |= shoulders
            polys = []
            if fillm.sum() > 20:
                fm = cv2.dilate(fillm.astype(np.uint8), np.ones((3, 3), np.uint8))
                cs, _ = cv2.findContours(fm, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
                for cc in cs:
                    if cv2.contourArea(cc) < 12: continue
                    a2 = cv2.approxPolyDP(cc, 0.8, True)[:, 0, :].astype(float)
                    polys.append([[round((x + .5) / W, 4), round((y + .5) / H, 4)] for x, y in a2])
                    d.polygon([(x * W, y * H) for x, y in polys[-1]], outline=(255, 0, 255, 255))
            if polys: rig["fill"] = polys
            else: rig.pop("fill", None)
            rig["auto"] = False
            if OUT: bg.resize((W * 2, H * 2), Image.NEAREST).save(OUT + f"t-{c}-{key.replace('/', '-')}.png")
            print(c, key, "fill", len(polys))
        if True:  # always: the rig is a function of arms.json and the sprites
            rf["revision"] = 2
            rf["note"] = ("Arms and hands in every view were traced to the arm's own outline (GrabCut "
                          "seeded from a hand-placed shoulder-elbow-wrist-fingertip line, scripts/trace-arms.py "
                          "with the skeletons in arms.json). 'fill' marks what a moved arm uncovers inside the figure. "
                          "Heads, torsos and legs are still the automatic boxes.")
            text = json.dumps(rf, indent=1)
            # one [x, y] point per line instead of three lines per number pair
            text = re.sub(r"\[\s+(-?[\d.]+),\s+(-?[\d.]+)\s+\]", r"[\1, \2]", text)
            open(R + f"{c}/rig.json", "w").write(text + "\n")
            print("wrote", c)
