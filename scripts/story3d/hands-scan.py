# THE HANDS SCAN: play Chapter 1 (steps of 0.2 s, nothing drawn) and measure every 0.4 s each
# hand and forearm's depth inside its own body or the other person's (visual/story3d/posekit.js),
# the wrist's bend and how far the fingertip is from its target (arms.js). Prints every span where
# a hand is 1 cm or more inside a body, a wrist is bent past 45 degrees, or a fingertip is more than
# 3 cm from where it should be (brief misses while a hand travels between jobs are expected).
#
#   python3 scripts/story3d/hands-scan.py OUT.json [t0 t1] [--every 0.4] [--bundle dist]
import asyncio, http.server, threading, sys, json, os, argparse
from playwright.async_api import async_playwright
ap = argparse.ArgumentParser(); ap.add_argument('out'); ap.add_argument('t0', type=float, nargs='?', default=140); ap.add_argument('t1', type=float, nargs='?', default=527)
ap.add_argument('--bundle', default='dist'); ap.add_argument('--every', type=float, default=0.4)
A = ap.parse_args()
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))); KIT = os.path.join(ROOT, 'visual', 'story3d', 'posekit.js')
class Q(http.server.SimpleHTTPRequestHandler):
    def __init__(s, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def log_message(s, *a): pass
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Q); threading.Thread(target=srv.serve_forever, daemon=True).start()
B = "http://127.0.0.1:%d/visual/story3d/probe.html" % srv.server_port
STEP = """async ([t0, t1, every]) => {
  const V = window.story3d.view, st = V.debug.stage, out = [];
  st.renderer.render = () => {};
  let next = t0;
  for (let t = t0; t <= t1 + 1e-6; t = Math.round((t + 0.2) * 1000) / 1000) {
    const S = V.debug.frame(t, 1, 'slot'); st.draw(S, 320, 320);
    if (t + 1e-6 >= next) {
      next += every;
      const m = window.posekit.measure();
      const row = { t };
      for (const id of ['jack', 'sarah']) for (const sd of ['L', 'R']) {
        const h = m[id] && m[id][sd]; if (!h) continue;
        const r = st.bodies[id].reached && st.bodies[id].reached[sd];
        row[id + sd] = { self: h.self.n ? [h.self.cm, h.self.n, h.self.where] : null, cross: h.cross && h.cross.n ? [h.cross.cm, h.cross.n, h.cross.where] : null,
          bend: r && r.bend !== undefined ? r.bend : h.wrist.swing, err: r && r.err !== undefined ? +(r.err * 100).toFixed(1) : null, wtw: h.wrist.twist, ftw: h.fore.twist, utw: h.upper.twist };
      }
      out.push(row);
    }
  }
  return out;
}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
        pg = await b.new_page(viewport={"width": 200, "height": 200})
        pg.on("pageerror", lambda e: print("PAGE ERROR", str(e)[:300]))
        await pg.goto(B + "?t=%s&w=200&h=200&quality=low&bundle=%s" % (A.t0, A.bundle)); await pg.wait_for_function("window.done===true", timeout=300000)
        await pg.add_script_tag(content=open(KIT).read())
        rows = []
        t = A.t0
        while t < A.t1:
            seg = min(A.t1, t + 20)
            rows += await pg.evaluate(STEP, [t, seg, A.every]); t = seg + 0.2
            print(f"... {t:.0f}s", flush=True)
        await b.close()
    json.dump(rows, open(A.out, 'w'))
    # report: moments where something is wrong, merged into spans per hand
    bad = {}
    for r in rows:
        for k, h in r.items():
            if k == 't': continue
            why = []
            if h['self'] and h['self'][0] >= 1.0: why.append(f"in own {h['self'][2]} {h['self'][0]}cm")
            if h['cross'] and h['cross'][0] >= 1.0: why.append(f"in other {h['cross'][2]} {h['cross'][0]}cm")
            if h['bend'] is not None and h['bend'] > 45: why.append(f"wrist bent {h['bend']}")
            if h['err'] is not None and h['err'] > 3: why.append(f"tip {h['err']}cm off")
            if why: bad.setdefault(k, []).append((r['t'], '; '.join(why)))
    for k, lst in sorted(bad.items()):
        spans, cur = [], None
        for t, w in lst:
            if cur and t - cur[1] <= A.every * 1.6: cur[1] = t; cur[2].append(w)
            else: cur = [t, t, [w]]; spans.append(cur)
        print(f"\n{k}: {len(lst)} moments")
        for a, z, ws in spans: print(f"  {a:6.1f}-{z:6.1f}  {max(ws, key=len)}")
asyncio.run(main())
