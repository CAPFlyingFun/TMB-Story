#!/usr/bin/env python3
"""Make the island art for the visual story's opening.

    python3 scripts/make-island-art.py        (needs Pillow, numpy and scipy)

Source: assets/source/island-color.jpg, the aerial island from Beyond Extinction
(artifacts/beyond-extinction/public/assets/textures/island_color.jpg). Outputs:

- assets/backgrounds/island-night.jpg: the same picture graded to moonlight (darker,
  bluer, less saturated), with its edges feathered into one flat ocean colour so the
  page can extend the ocean past the picture with a plain background colour instead of
  a huge image. A standing cloud is painted over the cone in the north: TMB's island is
  man-made (story-rules/WORLD_RULES.md), and the source art has a volcano on it. Nothing
  else is redrawn.
- assets/backgrounds/clouds/wisp-N.png: moonlit cloud wisps with alpha, which the scene
  flies past the camera on its depth layers.

Everything is seeded, so running it again makes the same files.
"""
import os
import numpy as np
from PIL import Image
from scipy.ndimage import zoom, gaussian_filter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "source", "island-color.jpg")
OUT = os.path.join(ROOT, "assets", "backgrounds", "island-night.jpg")
CLOUDS = os.path.join(ROOT, "assets", "backgrounds", "clouds")
OCEAN = np.array([4, 8, 18], dtype=np.float32)  # the page's sea colour, #040812: the graded open sea at the corners
FEATHER = 380  # px over which the picture fades into it
CONE = (975, 545)  # the volcano's summit in the source image, px
SHADOW = np.array([34, 42, 62], dtype=np.float32)  # cloud undersides
LIT = np.array([128, 142, 172], dtype=np.float32)  # cloud tops in moonlight


def fbm(h, w, seed, base=6, octaves=6, persistence=0.52):
    """Fractal value noise in 0..1: octaves of smoothly enlarged random grids."""
    rng = np.random.default_rng(seed)
    out = np.zeros((h, w), np.float32)
    amp, total = 1.0, 0.0
    for o in range(octaves):
        cells = base * 2**o
        gh, gw = max(4, int(cells * h / max(h, w)) + 3), max(4, int(cells * w / max(h, w)) + 3)
        g = rng.random((gh, gw)).astype(np.float32)
        z = zoom(g, (h / (gh - 3) * 1.0001, w / (gw - 3) * 1.0001), order=3)
        out += amp * z[:h, :w]
        total += amp
        amp *= persistence
    out /= total
    return (out - out.min()) / (out.max() - out.min())


def cloud(h, w, seed, cover=0.5, strength=1.0):
    """A moonlit cloud seen from above: returns (rgb float 0..255, alpha 0..1).

    Density is fractal noise inside an ellipse whose outline is itself bent by noise, so
    no two are the same shape and none is a disc. `cover` (0..1) is how solid the middle
    is. Opacity follows the density the way light through a cloud does (1 - e^-kd), so
    the edges thin out rather than stopping. Seen from above, thicker cloud is brighter;
    the side of each billow away from the moon (upper left) sits in its own shadow.
    """
    n = fbm(h, w, seed)
    warp = fbm(h, w, seed + 1000, base=3, octaves=3)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    dx, dy = (xx - w / 2) / (w / 2), (yy - h / 2) / (h / 2)
    r0 = np.sqrt(dx * dx + dy * dy)
    r = r0 + (warp - 0.5) * 0.8
    base = np.clip((0.85 - r) / 0.55, 0, 1)
    base = base * base * (3 - 2 * base)
    dens = np.clip(base * 1.2 + (n - 0.5) * 1.7 - (1 - cover), 0, None)
    dens *= np.clip((1 - r0) * 5, 0, 1)  # never reaches the image edge
    alpha = (1 - np.exp(-dens * 3)) * strength
    soft = gaussian_filter(dens, max(1.0, min(h, w) / 120))
    s = max(2, int(min(h, w) / 40))
    toward_moon = np.roll(np.roll(soft, s, 0), s, 1)  # the density between here and the moon
    lit = 0.2 + 0.6 * (1 - np.exp(-soft * 2)) + 0.9 * (soft - toward_moon)
    lit = np.clip(lit, 0, 1)
    rgb = SHADOW + (LIT - SHADOW) * lit[..., None]
    return rgb, np.clip(alpha, 0, 1)


def grade():
    im = np.asarray(Image.open(SRC).convert("RGB"), dtype=np.float32) / 255.0
    lum = (im * [0.30, 0.59, 0.11]).sum(axis=2, keepdims=True)
    moon = lum * np.array([0.52, 0.64, 0.95])  # moonlight: luminance, pushed blue
    night = 0.35 * im * np.array([0.55, 0.65, 0.9]) + 0.65 * moon
    night = np.power(np.clip(night, 0, 1), 1.2) * 0.8  # darker, deeper shadows
    night = night * 255.0

    # The standing cloud over the cone: a thick cap, and a thinner skirt around it so the
    # cap does not sit on the island like a disc.
    h, w = night.shape[:2]
    for (ch, cw, seed, cover, dx, dy, strength) in [
        (860, 1040, 41, 0.35, -30, 20, 0.75),   # skirt
        (740, 860, 42, 1.0, 0, 0, 1.0),         # cap
    ]:
        rgb, a = cloud(ch, cw, seed, cover, strength)
        x0, y0 = CONE[0] + dx - cw // 2, CONE[1] + dy - ch // 2
        sl = (slice(max(0, y0), min(h, y0 + ch)), slice(max(0, x0), min(w, x0 + cw)))
        cs = (slice(sl[0].start - y0, sl[0].stop - y0), slice(sl[1].start - x0, sl[1].stop - x0))
        aa = a[cs][..., None]
        # The cloud's own shadow on the forest south-east of it, then the cloud.
        sh = np.roll(np.roll(aa, 18, 0), 22, 1) * 0.35
        night[sl] = night[sl] * (1 - sh)
        night[sl] = night[sl] * (1 - aa) + rgb[cs] * aa

    yy, xx = np.mgrid[0:h, 0:w]
    edge = np.minimum.reduce([xx, yy, w - 1 - xx, h - 1 - yy]).astype(np.float32)
    k = np.clip(edge / FEATHER, 0, 1)[..., None]
    k = k * k * (3 - 2 * k)
    out = night * k + OCEAN * (1 - k)
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(OUT, quality=86, optimize=True, progressive=True)
    print("wrote", os.path.relpath(OUT, ROOT), os.path.getsize(OUT) // 1024, "KB")


def wisps():
    os.makedirs(CLOUDS, exist_ok=True)
    for i, (h, w, seed, cover) in enumerate([
        (220, 600, 11, 0.5),
        (240, 640, 12, 0.42),
        (260, 560, 13, 0.55),
        (200, 660, 14, 0.4),
    ], start=1):
        rgb, a = cloud(h, w, seed, cover, 0.9)
        img = np.dstack([np.clip(rgb, 0, 255), np.clip(a * 255, 0, 255)]).astype(np.uint8)
        path = os.path.join(CLOUDS, f"wisp-{i}.png")
        Image.fromarray(img, "RGBA").save(path, optimize=True)
        print("wrote", os.path.relpath(path, ROOT), os.path.getsize(path) // 1024, "KB")


if __name__ == "__main__":
    grade()
    wisps()
