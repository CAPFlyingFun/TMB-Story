# THE POSE SHEET (Joshua, 2026-11-10: "render the static poses for Jack and Sarah and then have
# something to go off of"). Every pose in POSES.json (a list of [who, seconds, label]: the moment
# in Chapter 1 and what the person is doing) as a row of views -- the story's own camera, then the
# person alone in a plain studio from the front, left, right, and each hand close up -- with each
# hand's measurements under the row: how far it sinks into its own body or the other person's
# (visual/story3d/posekit.js), and how its arm's joints are turned. Three rows a sheet.
#
#   python3 scripts/story3d/pose-sheet.py scripts/story3d/ch1-poses.json OUTDIR TAG
#       [--per 3] [--size 300] [--views story,front,left,right,handL,handR] [--only jack]
#       [--quality low] [--bundle dist]
# writes OUTDIR/TAG-NN.jpg and TAG.json. Needs Playwright's Chromium.
import asyncio, http.server, threading, sys, json, os, argparse
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont

ap = argparse.ArgumentParser()
ap.add_argument('poses'); ap.add_argument('out'); ap.add_argument('tag')
ap.add_argument('--per', type=int, default=3); ap.add_argument('--size', type=int, default=300)
ap.add_argument('--views', default='story,front,left,right,handL,handR')
ap.add_argument('--quality', default='low'); ap.add_argument('--bundle', default='dist'); ap.add_argument('--warm', type=int, default=3)
ap.add_argument('--only', default=None)
A = ap.parse_args()
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); KIT = os.path.join(ROOT, 'visual', 'story3d', 'posekit.js')
POSES = [p for p in json.load(open(A.poses)) if not A.only or p[0] == A.only]
VIEWS = A.views.split(','); S = A.size
os.makedirs(A.out, exist_ok=True)

class Q(http.server.SimpleHTTPRequestHandler):
    def __init__(s, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def log_message(s, *a): pass
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Q); threading.Thread(target=srv.serve_forever, daemon=True).start()
B = "http://127.0.0.1:%d/visual/story3d/probe.html" % srv.server_port
FONT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed.ttf', 15)
FONTB = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf', 16)

def hand_text(s, h):
    if not h: return f'{s}: -'
    def c(x): return '-' if not x or not x['n'] else f"{x['cm']}cm x{x['n']} {x['where']}"
    return (f"{s} {h['hold']:4}  in own body: {c(h['self'])}   in other: {c(h['cross'])}   "
            f"twist upper {h['upper']['twist']}  fore {h['fore']['twist']}  wrist {h['wrist']['twist']} (bend {h['wrist']['swing']})")

async def main():
    rows, data = [], []
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
        pg = await b.new_page(viewport={"width": S, "height": S})
        pg.on("pageerror", lambda e: print("PAGE ERROR", str(e)[:300]))
        await pg.goto(B + "?t=%s&w=%d&h=%d&quality=%s&bundle=%s" % (POSES[0][1], S, S, A.quality, A.bundle))
        await pg.wait_for_function("window.done===true", timeout=300000)
        await pg.add_script_tag(content=open(KIT).read())
        async def at(t, cam=None):
            await pg.evaluate(f"window.story3d.at({t}, {json.dumps(cam)})"); await pg.wait_for_function("window.done===true")
        for who, t, label in POSES:
            # play into the moment, as the player does (steady steps), then hold it
            for i in range(A.warm, 0, -1): await at(round(t - 0.2 * i, 3))
            await at(t)
            tiles = []
            m = await pg.evaluate("window.posekit.measure()")
            for v in VIEWS:
                if v == 'story':
                    await pg.evaluate("window.posekit.solo=null; window.posekit.isolate(false)"); await at(t)
                else:
                    await pg.evaluate(f"window.posekit.solo={json.dumps(who)}; window.posekit.isolate(true, {json.dumps(who)})")
                    cams = await pg.evaluate(f"window.posekit.views({json.dumps(who)})")
                    await at(t, cams[v])
                f = os.path.join(A.out, f"_{A.tag}_{who}_{t}_{v}.png"); await pg.screenshot(path=f); tiles.append(f)
            await pg.evaluate("window.posekit.solo=null; window.posekit.isolate(false)"); await at(t)
            data.append({'who': who, 't': t, 'label': label, 'm': m})
            rows.append((who, t, label, tiles, m))
            print(f"{who:5} {t:7.2f} {label[:40]:40} | {hand_text('L', m.get(who, {}).get('L'))[:90]} | {hand_text('R', m.get(who, {}).get('R'))[:90]}", flush=True)
        await b.close()
    json.dump(data, open(os.path.join(A.out, A.tag + '.json'), 'w'), indent=1)
    # sheets
    LH = 64
    for si in range(0, len(rows), A.per):
        chunk = rows[si:si + A.per]
        sheet = Image.new('RGB', (S * len(VIEWS), (S + LH) * len(chunk)), (20, 22, 26))
        d = ImageDraw.Draw(sheet)
        for r, (who, t, label, tiles, m) in enumerate(chunk):
            y0 = r * (S + LH)
            for c, f in enumerate(tiles): sheet.paste(Image.open(f).resize((S, S)), (c * S, y0))
            for c, v in enumerate(VIEWS): d.text((c * S + 6, y0 + 4), v, font=FONT, fill=(255, 235, 120))
            mm = m.get(who, {})
            d.text((6, y0 + S + 2), f"{who.upper()}  {t:.1f}s  {label}", font=FONTB, fill=(255, 255, 255))
            d.text((6, y0 + S + 22), hand_text('L', mm.get('L')), font=FONT, fill=(200, 230, 255))
            d.text((6, y0 + S + 41), hand_text('R', mm.get('R')), font=FONT, fill=(200, 230, 255))
        out = os.path.join(A.out, f"{A.tag}-{si // A.per:02d}.jpg"); sheet.save(out, quality=86); print(out, flush=True)

asyncio.run(main())
