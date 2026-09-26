#!/usr/bin/env python3
"""Split the character turnaround sheets into one PNG per pose and direction.

    python3 scripts/split-sprites.py          (needs Pillow, numpy, scipy)

Reads assets/characters/sheets.json, writes assets/characters/<name>/<pose>/<direction>.png
and assets/characters/<name>/sprite.json. Re-run after correcting a direction in the json.

The artwork is never scaled, stretched or redrawn. What it does to each figure:
  - cuts it out by its own silhouette, so a neighbour's chair wheel never rides along;
  - removes the faint alpha haze around it (alpha < 24, the red/yellow halo that shows on
    dark backgrounds) and makes near-opaque body pixels fully opaque (alpha >= 235 -> 255);
    the source figures sit at alpha ~250, which lets the room show faintly through them;
  - places every frame of a pose on ONE shared canvas with the same ground point, so turning
    from one direction to another never makes the character jump. The ground point is the
    centre of the feet standing, and of the chair's black star base sitting.
"""
import json, os
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG = os.path.join(ROOT, "assets", "characters", "sheets.json")
DIRECTIONS = ["south", "southwest", "west", "northwest", "north", "northeast", "east", "southeast"]
PAD = 6            # transparent margin around the widest frame
GROUND_BAND = 0.06 # standing: the lowest 6% of the figure (the feet) is the ground point
CHAIR_BAND = 0.18  # sitting: the dark chair base within the lowest 18%


def clean_alpha(rgba):
    a = rgba[:, :, 3]
    a[a < 24] = 0
    a[a >= 235] = 255
    rgba[a == 0, :3] = 0
    return rgba


def figures(rgba):
    """The sixteen figures, as (row, column, mask), found by connectivity rather than a grid."""
    alpha = rgba[:, :, 3]
    lab, n = ndimage.label(alpha > 128, structure=np.ones((3, 3)))
    sizes = ndimage.sum(np.ones_like(alpha), lab, index=range(1, n + 1))
    objs = ndimage.find_objects(lab)
    big = [(i + 1, objs[i]) for i in range(n) if sizes[i] > 800]
    if len(big) != 16:
        raise SystemExit("expected 16 figures, found %d" % len(big))
    mid = np.median([sl[0].start for _, sl in big])
    top = sorted([b for b in big if b[1][0].start <= mid], key=lambda b: b[1][1].start)
    bottom = sorted([b for b in big if b[1][0].start > mid], key=lambda b: b[1][1].start)
    if len(top) != 8 or len(bottom) != 8:
        raise SystemExit("rows did not split 8/8: %d/%d" % (len(top), len(bottom)))
    out = {}
    for row, group in (("standing", top), ("sitting", bottom)):
        for col, (idx, _) in enumerate(group, start=1):
            # Grow the core a few pixels to keep its anti-aliased edge, and no further.
            out[(row, col)] = ndimage.binary_dilation(lab == idx, iterations=4) & (alpha > 0)
    return out


def measure(mask, rgba, pose):
    ys, xs = np.nonzero(mask)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    if pose == "sitting":
        # The CHAIR is the ground point, not the feet: in a side view the feet sit well
        # forward of the base, and averaging them in slid the chair ~35 px on a turn.
        # The star base and wheels are near-black; the shoes are grey with white soles.
        lum = rgba[ys, xs, :3].astype(int).mean(axis=1)
        band = (ys >= y1 - int((y1 - y0) * CHAIR_BAND)) & (lum < 60)
    else:
        band = ys >= y1 - max(3, int((y1 - y0) * GROUND_BAND))
    return {"x0": x0, "x1": x1, "y0": y0, "y1": y1, "ax": float(xs[band].mean()), "ay": float(y1)}


def main():
    cfg = json.load(open(CONFIG, encoding="utf-8"))
    for name, spec in cfg["figures"].items():
        rgba = clean_alpha(np.array(Image.open(os.path.join(ROOT, spec["sheet"])).convert("RGBA")))
        figs = figures(rgba)
        out_dir = os.path.join(ROOT, "assets", "characters", name)
        record = {"name": name, "heightM": spec["heightM"], "source": spec["sheet"], "poses": {}}
        for pose in ("standing", "sitting"):
            mapping = spec[pose]
            direct = {d: v for d, v in mapping.items() if d in DIRECTIONS and isinstance(v, int)}
            mirrored = {d: v["mirror"] for d, v in mapping.items() if d in DIRECTIONS and isinstance(v, dict)}
            missing = set(DIRECTIONS) - set(direct) - set(mirrored)
            if missing:
                raise SystemExit("%s %s: no source for %s" % (name, pose, sorted(missing)))
            m = {d: measure(figs[(pose, c)], rgba, pose) for d, c in direct.items()}
            half = max(max(v["ax"] - v["x0"], v["x1"] - v["ax"]) for v in m.values())
            up = max(v["ay"] - v["y0"] for v in m.values())
            W, H = int(np.ceil(2 * (half + PAD))), int(np.ceil(up + 2 * PAD))
            anchor = (W / 2.0, H - PAD)
            fig_px = float(np.median([v["ay"] - v["y0"] for v in m.values()]))
            os.makedirs(os.path.join(out_dir, pose), exist_ok=True)
            frames, canv = {}, {}
            for d, c in direct.items():
                v = m[d]
                cut = rgba[v["y0"]:v["y1"], v["x0"]:v["x1"]].copy()
                cut[~figs[(pose, c)][v["y0"]:v["y1"], v["x0"]:v["x1"]]] = 0
                canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
                canvas.paste(Image.fromarray(cut), (int(round(anchor[0] - (v["ax"] - v["x0"]))),
                                                   int(round(anchor[1] - (v["ay"] - v["y0"])))))
                canv[d] = canvas
                frames[d] = {"file": "%s/%s.png" % (pose, d), "sourceColumn": c}
            for d, src in mirrored.items():
                # The canvas is symmetric about the ground point, so a mirror keeps it in place.
                canv[d] = canv[src].transpose(Image.FLIP_LEFT_RIGHT)
                frames[d] = {"file": "%s/%s.png" % (pose, d), "mirrorOf": src}
            for d, im in canv.items():
                im.save(os.path.join(out_dir, pose, d + ".png"), optimize=True)
            height_m = spec["heightM"] * (spec.get("sittingHeightRatio", 0.72) if pose == "sitting" else 1.0)
            record["poses"][pose] = {
                "canvas": [W, H], "anchor": [anchor[0], anchor[1]], "figureHeightPx": round(fig_px, 1),
                "heightM": round(height_m, 3), "pxPerMeter": round(fig_px / height_m, 2),
                "frames": {d: frames[d] for d in DIRECTIONS},
            }
            print("%-6s %-8s canvas %dx%d  figure %.0f px  mirrored: %s"
                  % (name, pose, W, H, fig_px, ", ".join(sorted(mirrored)) or "none"))
        json.dump(record, open(os.path.join(out_dir, "sprite.json"), "w"), indent=2)


if __name__ == "__main__":
    main()
