# CLOSE SHOTS of one person at one moment of Chapter 1: alone in the plain studio, the camera close on
# a joint (the chest by default, or a wrist), from several sides, side by side, with how far each hand
# sinks into a body and how far its wrist bends (visual/story3d/posekit.js). For looking hard at one
# pose after the pose sheet shows it is wrong.
#
#   python3 scripts/story3d/close-shots.py WHO SECONDS OUT.jpg [--views front,frontL,frontR,top]
#       [--joint chest|wristL|wristR|...] [--drop 0.12] [--dist 0.95] [--size 520] [--js "..."]
#
# Views: front, frontL, frontR, top, left, right, low, backL, backR (directions in the person's own
# frame). --js runs in the page first, e.g. to try a number live before writing it into stage.js:
#   --js "window.story3d.view.debug.stage.tune.FOLD.over.at[1] = -0.10"
# Needs Playwright's Chromium.
import asyncio, http.server, threading, json, os, argparse
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont

ap = argparse.ArgumentParser(); ap.add_argument('who'); ap.add_argument('t', type=float); ap.add_argument('out')
ap.add_argument('--views', default='front,frontL,frontR,top'); ap.add_argument('--size', type=int, default=520)
ap.add_argument('--joint', default='chest'); ap.add_argument('--drop', type=float, default=0.12); ap.add_argument('--dist', type=float, default=0.95)
ap.add_argument('--bundle', default='dist'); ap.add_argument('--warm', type=int, default=3); ap.add_argument('--js', default=None)
A = ap.parse_args()
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); KIT = os.path.join(ROOT, 'visual', 'story3d', 'posekit.js')
# each view: the camera's direction from the joint in the person's frame [left, up, forward]
V = {'front': [0, 0.25, 1], 'frontL': [0.8, 0.3, 1], 'frontR': [-0.8, 0.3, 1], 'top': [0, 1.4, 1], 'left': [1, 0.15, 0.1],
     'right': [-1, 0.15, 0.1], 'low': [0, -0.5, 1], 'backL': [1, 0.3, -0.6], 'backR': [-1, 0.3, -0.6]}

class Q(http.server.SimpleHTTPRequestHandler):
    def __init__(s, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def log_message(s, *a): pass
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Q); threading.Thread(target=srv.serve_forever, daemon=True).start()
B = "http://127.0.0.1:%d/visual/story3d/probe.html" % srv.server_port
CAM = """([who, joint, drop, d, dist]) => {
  const st = window.story3d.view.debug.stage, b = st.bodies[who], y = b.model.rotation.y;
  const f = [Math.sin(y), 0, Math.cos(y)], l = [Math.cos(y), 0, -Math.sin(y)].map(v => v * b.arms.leftSign);
  const c = st.bonePoint(who, joint), t = [c.x, c.y - drop, c.z];
  const dir = [0, 1, 2].map(i => l[i] * d[0] + (i === 1 ? d[1] : 0) + f[i] * d[2]), n = Math.hypot(...dir);
  return [...t.map((v, i) => v + dir[i] / n * dist), ...t, 34];
}"""

async def main():
    names = A.views.split(','); S = A.size; tiles = []
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
        pg = await b.new_page(viewport={"width": S, "height": S})
        pg.on("pageerror", lambda e: print("PAGE ERROR", str(e)[:300]))
        await pg.goto(B + "?t=%s&w=%d&h=%d&quality=low&bundle=%s" % (A.t, S, S, A.bundle)); await pg.wait_for_function("window.done===true", timeout=300000)
        await pg.add_script_tag(content=open(KIT).read())
        async def at(t, cam=None):
            await pg.evaluate(f"window.story3d.at({t}, {json.dumps(cam)})"); await pg.wait_for_function("window.done===true")
        if A.js: await pg.evaluate(A.js)
        await pg.evaluate(f"window.posekit.solo={json.dumps(A.who)}; window.posekit.isolate(true, {json.dumps(A.who)})")
        # play into the moment, as the player does (steady steps), then hold it
        for i in range(A.warm, 0, -1): await at(round(A.t - 0.2 * i, 3))
        await at(A.t)
        for n in names:
            cam = await pg.evaluate(CAM, [A.who, A.joint, A.drop, V[n], A.dist])
            await at(A.t, cam); f = A.out + f'.{n}.png'; await pg.screenshot(path=f); tiles.append((n, f))
        m = await pg.evaluate("window.posekit.measure()")
        await b.close()
    sheet = Image.new('RGB', (S * len(tiles), S + 26), (20, 22, 26)); d = ImageDraw.Draw(sheet)
    F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed.ttf', 15)
    for i, (n, f) in enumerate(tiles): sheet.paste(Image.open(f), (i * S, 0)); d.text((i * S + 6, 4), n, font=F, fill=(255, 235, 120)); os.remove(f)
    h = m.get(A.who, {})
    def hand(s):
        x = h[s]; own = f"{x['self']['cm']} cm {x['self']['where']}" if x['self']['n'] else '-'
        other = f"{x['cross']['cm']} cm {x['cross']['where']}" if x['cross'] and x['cross']['n'] else '-'
        return f"{s}: in own body {own}, in other {other}, wrist bend {x['wrist']['swing']}"
    txt = '   '.join(hand(s) for s in 'LR' if s in h)
    d.text((6, S + 4), f"{A.who} {A.t:g} s   {txt}", font=F, fill=(220, 230, 255))
    sheet.save(A.out); print(A.out, '|', txt)

asyncio.run(main())
