#!/usr/bin/env python3
"""Make the wide lab backdrop: Joshua's expanded picture with the original lab set into it.

    python3 scripts/make-lab-wide.py        (needs Pillow, numpy)

assets/source/lab-expanded.jpg (2576 x 1449) is an image expansion of
assets/backgrounds/lab-main.jpg: the original sits inside it unchanged, scaled by 0.71,
with its top-left corner at (561, 129) -- found by normalized cross-correlation, match
0.973 (2026-09-26). The expansion adds the floor nearer the camera and the room either
side, which the scene uses for its wide shot and for people passing the camera.

The output keeps the lab's own coordinates, so nothing in the scene moves: it is the
expansion enlarged to the original's scale (1 / 0.71), with the ORIGINAL pasted back
where it belongs. The original is sharper, and close shots only ever frame it. Its edge is
feathered over FEATHER px, because the expansion repainted a band along the border
(a 20 px band differs by ~20 levels, the interior by ~8), so a hard paste would seam.
World coordinates of the output: x from -790 to 2838, y from -182 to 1859.
"""
import os
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "source", "lab-expanded.jpg")
ORIG = os.path.join(ROOT, "assets", "backgrounds", "lab-main.jpg")
OUT = os.path.join(ROOT, "assets", "backgrounds", "lab-wide.jpg")
SCALE, AT = 0.71, (561, 129)  # the original inside the expansion
FEATHER = 70

wide = Image.open(SRC).convert("RGB")
orig = Image.open(ORIG).convert("RGB")
W, H = round(wide.width / SCALE), round(wide.height / SCALE)
ox, oy = round(AT[0] / SCALE), round(AT[1] / SCALE)
base = np.asarray(wide.resize((W, H), Image.LANCZOS), np.float32)
o = np.asarray(orig, np.float32)
h, w = o.shape[:2]
yy, xx = np.mgrid[0:h, 0:w]
edge = np.minimum.reduce([xx, yy, w - 1 - xx, h - 1 - yy]).astype(np.float32)
a = np.clip(edge / FEATHER, 0, 1)[..., None]
a = a * a * (3 - 2 * a)
base[oy:oy + h, ox:ox + w] = o * a + base[oy:oy + h, ox:ox + w] * (1 - a)
Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).save(OUT, quality=84, optimize=True, progressive=True)
print("wrote", os.path.relpath(OUT, ROOT), f"{W}x{H}", os.path.getsize(OUT) // 1024, "KB; the original's origin is at", (ox, oy))
