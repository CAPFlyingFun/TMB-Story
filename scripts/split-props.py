#!/usr/bin/env python3
"""Cut the props sheet into one PNG per object.

    python3 scripts/split-props.py          (needs Pillow, numpy, scipy)

Reads assets/props/sheet.json, writes assets/props/<name>.png and assets/props/props.json.
As with the characters (scripts/split-sprites.py), the artwork is never scaled or redrawn:
each object is cut out by its own silhouette, its faint alpha haze is removed and its
near-opaque pixels made opaque. The anchor is the middle of its base, where it meets the
ground, and pxPerMeter comes from heightM, so the stage sizes it in world units.
"""
import json, os
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG = os.path.join(ROOT, "assets", "props", "sheet.json")
OUT = os.path.join(ROOT, "assets", "props")
PAD = 4

cfg = json.load(open(CONFIG))
rgba = np.asarray(Image.open(os.path.join(ROOT, cfg["sheet"])).convert("RGBA")).copy()
alpha = rgba[:, :, 3]
lab, n = ndimage.label(alpha > 128, structure=np.ones((3, 3)))
index = {}
for p in cfg["props"]:
    x, y, w, h = p["box"]
    ids, counts = np.unique(lab[y:y + h, x:x + w], return_counts=True)
    keep = [(c, i) for i, c in zip(ids, counts) if i]
    if not keep:
        raise SystemExit("no artwork inside the box for " + p["name"])
    idx = max(keep)[1]
    mask = ndimage.binary_dilation(lab == idx, iterations=3) & (alpha > 0)
    ys, xs = np.nonzero(mask)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    crop = rgba[y0:y1, x0:x1].copy()
    crop[~mask[y0:y1, x0:x1]] = 0
    a = crop[:, :, 3]
    a[a < 24] = 0
    a[a >= 235] = 255
    crop[a == 0, :3] = 0
    out = np.zeros((crop.shape[0] + 2 * PAD, crop.shape[1] + 2 * PAD, 4), np.uint8)
    out[PAD:-PAD, PAD:-PAD] = crop
    Image.fromarray(out, "RGBA").save(os.path.join(OUT, p["name"] + ".png"), optimize=True)
    hpx = y1 - y0
    index[p["name"]] = {
        "file": p["name"] + ".png",
        "size": [int(out.shape[1]), int(out.shape[0])],
        "anchor": [out.shape[1] / 2, float(out.shape[0] - PAD)],
        "heightM": p["heightM"],
        "pxPerMeter": round(hpx / p["heightM"], 2),
        "what": p["what"],
    }
    print("%-22s %4dx%-4d %5.2f m" % (p["name"], out.shape[1], out.shape[0], p["heightM"]))
json.dump({"source": cfg["sheet"], "props": index}, open(os.path.join(OUT, "props.json"), "w"), indent=1)
