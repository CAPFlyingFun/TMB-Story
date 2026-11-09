#!/usr/bin/env python3
"""Render one chapter as SEPARATE single-voice Eleven v4 clips (Joshua, 2026-11-09).

SPENDS CREDITS (about one per character, plus the delivery tags) the first time. Every
clip is kept under audio/tests/clips-v4/chapter-NN/, so a re-run only renders what is
missing, then re-assembles (free).

Why: the multi-voice dialogue takes are cut apart at the speaker boundaries ElevenLabs
reports, and a cut that lands a little late keeps the start of the next voice, so a line
seems to stutter ("I", pause, "I don't know"). A single-voice clip has no other voice in
it to bleed in, so nothing is ever cut inside a clip.

The units (Joshua's rule): back-to-back lines by the same speaker are ONE clip, never
split (the narrator's long opening is one clip; captions are timed inside it from the
clip's own character timings). Every other line is its own clip.

Delivery: a character line may carry tags from audio/tags/chapter-NN.json, written in
front of the line as [tag] [tag] -- they set the delivery and are not spoken. Each
request also carries the text before and after it, unspoken, so the reading fits the
scene. The narrator is asked for speed 1.1 directly; if the model refuses a field, the
request is retried without it and the fallback is recorded in the clip's sidecar
(the assembler then speeds that narrator clip up whole, never cutting it).
"""
import argparse, base64, json, os, subprocess, sys, time, urllib.request, urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API = "https://api.elevenlabs.io/v1/text-to-speech/%s/with-timestamps?output_format=mp3_44100_128"
LIMIT = 2500  # characters per clip; a longer same-speaker run is split at a line boundary


def load_tags(ch):
    p = os.path.join(ROOT, "audio", "tags", "chapter-%02d.json" % ch)
    if not os.path.exists(p):
        return {}
    out = {}
    for t in json.load(open(p))["lines"]:
        out[t["order"]] = t
    return out


def units(segs):
    out = []
    for s in segs:
        prev = out[-1] if out else None
        if prev and prev[-1]["speaker"] == s["speaker"] and sum(len(x["ttsText"]) + 2 for x in prev) + len(s["ttsText"]) <= LIMIT:
            prev.append(s)
        else:
            out.append([s])
    return out


def tag_prefix(seg, tags):
    t = tags.get(seg["order"])
    if not t or not t.get("tag"):
        return ""
    if t.get("text") and t["text"] != seg["ttsText"]:
        print("  tag for order %d skipped: the line changed (%r)" % (seg["order"], seg["ttsText"][:40]))
        return ""
    return " ".join("[%s]" % p.strip() for p in t["tag"].split(",") if p.strip()) + " "


def unit_text(u, tags):
    return "\n\n".join(tag_prefix(s, tags) + s["ttsText"] for s in u)


def call(voice, body):
    req = urllib.request.Request(API % voice, data=json.dumps(body).encode(),
                                 headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=300) as r:
        return json.load(r)


def render(voice, text, prev_text, next_text, speed, model):
    body = {"text": text, "model_id": model}
    if speed and speed != 1.0:
        body["voice_settings"] = {"speed": speed}
    if prev_text: body["previous_text"] = prev_text[-300:]
    if next_text: body["next_text"] = next_text[:300]
    dropped = []
    for attempt in range(6):
        try:
            return call(voice, body), dropped
        except urllib.error.HTTPError as e:
            msg = e.read().decode()[:400]
            if e.code in (400, 422):
                for k in ("next_text", "previous_text", "voice_settings"):
                    if k in body:
                        print("  model refused a field (HTTP %d: %s); retrying without %s" % (e.code, msg[:160], k))
                        body.pop(k); dropped.append(k); break
                else:
                    print("HTTP", e.code, msg); raise
            elif e.code in (429, 500, 502, 503, 504):
                time.sleep(3 * (attempt + 1))
            else:
                print("HTTP", e.code, msg); raise
    raise RuntimeError("gave up after retries")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("chapter", type=int)
    ap.add_argument("--model", default="eleven_v4")
    ap.add_argument("--narrator-speed", type=float, default=1.1)
    ap.add_argument("--estimate", action="store_true")
    a = ap.parse_args()
    segs = json.load(open(os.path.join(ROOT, "audio/manifests/chapter-%02d.json" % a.chapter)))["segments"]
    tags = load_tags(a.chapter)
    us = units(segs)
    out = os.path.join(ROOT, "audio/tests/clips-v4/chapter-%02d" % a.chapter)
    os.makedirs(out, exist_ok=True)
    texts = [unit_text(u, tags) for u in us]
    plain = ["\n\n".join(s["ttsText"] for s in u) for u in us]
    def key(k): return os.path.join(out, "unit-%03d" % k)
    todo = [k for k in range(len(us)) if not os.path.exists(key(k) + ".json")]
    cost = sum(len(texts[k]) for k in todo)
    print("chapter %d: %d lines, %d clips (%d narrator, %d merged), %d to render, ~%d credits"
          % (a.chapter, len(segs), len(us), sum(u[0]["speaker"] == "narrator" for u in us), sum(len(u) > 1 for u in us), len(todo), cost))
    if a.estimate:
        return
    for k in todo:
        u = us[k]; narr = u[0]["speaker"] == "narrator"
        print("clip %d/%d: %s, %d characters" % (k + 1, len(us), u[0]["speaker"], len(texts[k])))
        res, dropped = render(u[0]["voiceId"], texts[k], plain[k - 1] if k else "", plain[k + 1] if k + 1 < len(us) else "",
                              a.narrator_speed if narr else 1.0, a.model)
        open(key(k) + ".mp3", "wb").write(base64.b64decode(res["audio_base64"]))
        json.dump({"orders": [s["order"] for s in u], "speaker": u[0]["speaker"], "text": texts[k], "model": a.model,
                   "speedRequested": a.narrator_speed if narr else 1.0, "dropped": dropped,
                   "alignment": res.get("alignment"), "normalized_alignment": res.get("normalized_alignment")},
                  open(key(k) + ".json", "w"), indent=1)
    subprocess.run([sys.executable, os.path.join(ROOT, "scripts/clips-assemble.py"), str(a.chapter),
                    "--narrator-speed", str(a.narrator_speed)], check=True)


if __name__ == "__main__":
    main()
