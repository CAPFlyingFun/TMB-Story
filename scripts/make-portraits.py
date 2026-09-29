#!/usr/bin/env python3
"""Caption portraits: a small head-and-shoulders picture of each speaking character.

    python3 scripts/make-portraits.py        (needs Pillow and numpy)

Writes assets/portraits/<name>.png, 192 px square, transparent round the figure:
  - jack, sarah, mark, lena: cut from each character's front-facing standing sprite
    (assets/characters/<name>/standing/south.png), the drawn art the Watch mode shows
    when the people are drawn;
  - system: the settlement's systems speaking (TOMBS, the consoles), a terminal prompt.
The 3D portraits of Jack and Sarah (<name>-3d.png) are rendered from their models by
visual/portraits.html. The captions show the one that matches the people on screen.
"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "portraits")
SIZE = 192

def cut(name):
    im = Image.open(os.path.join(ROOT, "assets", "characters", name, "standing", "south.png")).convert("RGBA")
    a = np.array(im)[:, :, 3] > 40
    rows = np.where(a.any(1))[0]
    top, bottom = rows[0], rows[-1]
    h = bottom - top
    # the head's middle: the centre of the figure's pixels in its top tenth
    band = a[top:top + max(4, h // 10)]
    cx = np.where(band.any(0))[0].mean()
    side = h * 0.25
    box = (cx - side / 2, top - side * 0.08, cx + side / 2, top + side * 0.92)
    im.crop(tuple(int(round(v)) for v in box)).resize((SIZE, SIZE), Image.LANCZOS).save(os.path.join(OUT, name + ".png"))

def system():
    im = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((34, 46, 158, 136), radius=10, fill=(14, 22, 34, 255), outline=(126, 212, 255, 255), width=5)
    d.rectangle((84, 136, 108, 150), fill=(126, 212, 255, 255))
    d.rounded_rectangle((62, 148, 130, 158), radius=4, fill=(126, 212, 255, 255))
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf", 40)
    d.text((52, 64), ">_", font=font, fill=(255, 176, 60, 255))
    im.save(os.path.join(OUT, "system.png"))

for n in ["jack", "sarah", "mark", "lena"]:
    cut(n)
system()
print("wrote", sorted(os.listdir(OUT)))
