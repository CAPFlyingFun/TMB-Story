"""The Listen player with the Chapter 1 3D scene, in a real (headless) browser.

    python3 scripts/tests/player-3d.py [out-dir]

Serves the repository, opens #listen/1/3d at phone sizes (portrait, then landscape) and checks
that the one audio element drives the picture:
  - the scene loads over the stills and shows the audio's own time;
  - playing advances both together; a seek backward and forward lands the picture on the new
    time at once; a speed change keeps them together;
  - switching the 3D off and on while playing neither restarts nor moves the audio, and the
    chapter's audio file is fetched once (no second player);
  - if the scene bundle fails to load, the stills come back and the audio plays on;
  - with the 3D on no still shows under or before it, and a first visit has it on.
Screenshots go to out-dir (default: a temp folder). Needs Playwright's Chromium.
"""
import functools, http.server, json, os, sys, tempfile, threading, asyncio
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = sys.argv[1] if len(sys.argv) > 1 else tempfile.mkdtemp(prefix="player3d-")
CHROME = os.environ.get("PLAYWRIGHT_CHROMIUM", "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome")
os.makedirs(OUT, exist_ok=True)
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT); H.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), H); threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = "http://127.0.0.1:%d/" % srv.server_port
failures = []

def check(ok, what):
    print(("  ok   " if ok else "  FAIL ") + what)
    if not ok: failures.append(what)

async def state(pg):
    return await pg.evaluate("""() => {
      const host = document.querySelector('.lp-3d'), a = [...document.querySelectorAll('audio')];
      const mp3 = performance.getEntriesByType('resource').filter(e => /chapter-01-clips\\.mp3/.test(e.name)).length;
      return { ready: !!host && host.classList.contains('is-ready'), t: host ? +host.dataset.t : null,
               audios: a.length, mp3, pill: !!document.getElementById('lp-3d'),
               on: document.getElementById('lp-3d') ? document.getElementById('lp-3d').classList.contains('is-on') : null,
               still: !!document.getElementById('listen-shot') };
    }""")

async def audio_time(pg):
    return await pg.evaluate("() => { const a = window.__tmbAudio; return a ? { t: a.currentTime, paused: a.paused, rate: a.playbackRate } : null; }")

async def run(p, w, h, tag):
    b = await p.chromium.launch(executable_path=CHROME, args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--autoplay-policy=no-user-gesture-required"])
    ctx = await b.new_context(viewport={"width": w, "height": h}, device_scale_factor=2, is_mobile=True, has_touch=True,
                              user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148")
    # find the player's audio element: it is made with new Audio() and may never be in the page
    await ctx.add_init_script("""(() => { const A = window.Audio; window.Audio = function (...x) { const a = new A(...x); window.__tmbAudio = a; return a; }; window.Audio.prototype = A.prototype; })();""")
    pg = await ctx.new_page()
    errors = []
    pg.on("pageerror", lambda e: errors.append(str(e)[:300]))
    await pg.goto(BASE + "index.html#listen/1/3d")
    await pg.wait_for_function("() => { const h = document.querySelector('.lp-3d'); return h && h.classList.contains('is-ready'); }", timeout=300000)
    s = await state(pg)
    check(s["ready"] and s["pill"] and s["on"], f"{tag}: the 3D scene loads, the 3D pill on")
    hidden = await pg.evaluate("() => { const v = document.getElementById('listen-visual'), i = document.getElementById('listen-shot'); return v.classList.contains('is-3d') && getComputedStyle(v).backgroundImage === 'none' && (!i || getComputedStyle(i).visibility === 'hidden'); }")
    check(hidden, f"{tag}: with the 3D on, no still shows under or before it")
    await pg.screenshot(path=os.path.join(OUT, f"{tag}-0-loaded.png"))
    # play
    await pg.click("#listen-toggle")
    await pg.wait_for_function("() => window.__tmbAudio && !window.__tmbAudio.paused && window.__tmbAudio.currentTime > 2", timeout=240000)
    await pg.wait_for_timeout(1500)
    a, s = await audio_time(pg), await state(pg)
    check(abs(s["t"] - a["t"]) < 0.35, f"{tag}: playing, the picture shows the audio's time ({s['t']:.2f} vs {a['t']:.2f})")
    # seek forward to the chair scene and back to the intercom
    for target in (340.0, 155.0, 60.0):
        await pg.evaluate(f"() => {{ window.__tmbAudio.currentTime = {target}; }}")
        await pg.wait_for_timeout(1200)
        a, s = await audio_time(pg), await state(pg)
        # (the audio plays on past the target while this waits; the picture must show where it is)
        check(abs(s["t"] - a["t"]) < 0.35 and target - 0.5 < a["t"] < target + 6, f"{tag}: seek to {target:.0f}s: the picture follows at once ({s['t']:.2f} vs {a['t']:.2f})")
    await pg.screenshot(path=os.path.join(OUT, f"{tag}-1-seek60.png"))
    # speed
    await pg.evaluate("() => { window.__tmbAudio.playbackRate = 1.5; }")
    t0 = (await audio_time(pg))["t"]; await pg.wait_for_timeout(2000)
    a, s = await audio_time(pg), await state(pg)
    check(abs(s["t"] - a["t"]) < 0.4 and a["t"] - t0 > 2.2, f"{tag}: at 1.5x the picture keeps up ({a['t'] - t0:.2f}s of audio in 2s; picture {s['t']:.2f} vs {a['t']:.2f})")
    await pg.evaluate("() => { window.__tmbAudio.playbackRate = 1; }")
    # toggle the 3D off and on while playing
    before, fetched = (await audio_time(pg))["t"], (await state(pg))["mp3"]
    await pg.click("#lp-3d"); await pg.wait_for_timeout(800)
    s_off, a_off = await state(pg), await audio_time(pg)
    check(not s_off["ready"] and s_off["still"] and not a_off["paused"] and a_off["t"] >= before, f"{tag}: 3D off: the stills show, the audio plays on ({before:.2f} -> {a_off['t']:.2f})")
    await pg.click("#lp-3d")
    await pg.wait_for_function("() => { const h = document.querySelector('.lp-3d'); return h && h.classList.contains('is-ready'); }", timeout=120000)
    await pg.wait_for_timeout(800)
    a, s = await audio_time(pg), await state(pg)
    check(not a["paused"] and a["t"] > a_off["t"] and abs(s["t"] - a["t"]) < 0.4, f"{tag}: 3D on again: same audio, not restarted ({a['t']:.2f}), picture in step ({s['t']:.2f})")
    # (the player's own download already fetches it as it always has; switching 3D adds no fetch and no second audio element)
    check(s["mp3"] == fetched and s["audios"] == 0, f"{tag}: switching the 3D fetched no more audio ({fetched} -> {s['mp3']}) and made no audio element in the page")
    await pg.evaluate("() => { window.__tmbAudio.currentTime = 300; }"); await pg.wait_for_timeout(1500)
    await pg.screenshot(path=os.path.join(OUT, f"{tag}-2-at300.png"))
    check(not errors, f"{tag}: no page errors ({'; '.join(errors)[:200]})")
    await b.close()

async def fallback(p):
    b = await p.chromium.launch(executable_path=CHROME, args=["--autoplay-policy=no-user-gesture-required"])
    pg = await b.new_page(viewport={"width": 390, "height": 844})
    await pg.route("**/story3d.js", lambda r: r.abort())
    await pg.add_init_script("""(() => { const A = window.Audio; window.Audio = function (...x) { const a = new A(...x); window.__tmbAudio = a; return a; }; window.Audio.prototype = A.prototype; })();""")
    await pg.goto(BASE + "index.html#listen/1/3d")
    await pg.wait_for_selector(".listen-warn", timeout=120000)
    await pg.click("#listen-toggle")
    await pg.wait_for_function("() => window.__tmbAudio && !window.__tmbAudio.paused && window.__tmbAudio.currentTime > 1", timeout=240000)
    s = await state(pg)
    check(s["still"] and not s["ready"], "fallback: the 3D bundle fails, the stills stay and the audio plays")
    await pg.screenshot(path=os.path.join(OUT, "fallback.png"))
    await b.close()

async def default_on(p):
    # a first visit, no saved choice: Chapter 1 opens with its 3D on (Joshua, 2026-11-10)
    b = await p.chromium.launch(executable_path=CHROME, args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
    pg = await b.new_page(viewport={"width": 390, "height": 844})
    await pg.goto(BASE + "index.html#listen/1")
    await pg.wait_for_selector("#lp-3d", timeout=120000)
    s = await state(pg)
    check(s["on"] and await pg.evaluate("() => !!document.querySelector('.lp-3d')"), "default: a first visit opens Chapter 1 with the 3D on")
    await b.close()

async def main():
    async with async_playwright() as p:
        await run(p, 390, 844, "portrait")
        await run(p, 844, 390, "landscape")
        await fallback(p)
        await default_on(p)
    print(f"\n{len(failures)} failure(s). Screenshots: {OUT}")
    sys.exit(1 if failures else 0)

asyncio.run(main())
