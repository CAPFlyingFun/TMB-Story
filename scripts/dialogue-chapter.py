#!/usr/bin/env python3
"""Render one chapter in Eleven v4 Text to Dialogue mode, as a listening test.

SPENDS CREDITS (about one per character of the chapter) the first time; every request
is cached as a raw file, so a re-run only re-times and never charges again.
The chapter's manifest is the script: every segment (narration, dialogue, system) is
one dialogue input in its own voice. Requests are cut at segment boundaries, at most
2,000 characters each, and pass previous/next text for continuity.

Then, free: each line is cut out at the returned voice_segments, its edge silence is
trimmed, narration is sped up by --narrator-tempo (pitch kept), and the lines are
joined with the manifest's own pauseBeforeMs, the same pauses the Listen tab uses.

Output: audio/tests/dialogue-v4/chapter-NN/ (raw requests, timings, chapter mp3).
Never touches the chapter's real clips, manifest, fingerprints or approval state.
"""
import argparse, base64, json, os, subprocess, sys, urllib.request, urllib.error

LIMIT = 1900

def chunks(segs):
    out, cur, n = [], [], 0
    for s in segs:
        L = len(s["ttsText"])
        if cur and n + L > LIMIT:
            out.append(cur); cur, n = [], 0
        cur.append(s); n += L
    if cur:
        out.append(cur)
    return out

def render(inputs, prev_text, next_text, model):
    body = {"inputs": inputs, "model_id": model}
    if prev_text: body["previous_text"] = prev_text[-100:]
    if next_text: body["future_text"] = next_text[:100]
    req = urllib.request.Request(
        "https://api.elevenlabs.io/v1/text-to-dialogue/with-timestamps?output_format=mp3_44100_128",
        data=json.dumps(body).encode(),
        headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        if "future_text" in body or "previous_text" in body:
            print("  retrying without previous/future text (HTTP %d: %s)" % (e.code, e.read().decode()[:300]))
            body.pop("previous_text", None); body.pop("future_text", None)
            req.data = json.dumps(body).encode()
            with urllib.request.urlopen(req, timeout=300) as r:
                return json.load(r)
        print("HTTP", e.code, e.read().decode()[:2000]); raise

def ff(*a):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *a], check=True)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("chapter", type=int)
    ap.add_argument("--narrator-tempo", type=float, default=1.1)
    ap.add_argument("--model", default="eleven_v4")
    a = ap.parse_args()
    segs = json.load(open("audio/manifests/chapter-%02d.json" % a.chapter))["segments"]
    d = "audio/tests/dialogue-v4/chapter-%02d" % a.chapter
    raw = os.path.join(d, "raw"); os.makedirs(raw, exist_ok=True)
    groups = chunks(segs)
    print("chapter %d: %d segments, %d characters, %d requests"
          % (a.chapter, len(segs), sum(len(s["ttsText"]) for s in segs), len(groups)))
    tmp = os.path.join(d, ".tmp"); os.makedirs(tmp, exist_ok=True)
    pieces, k = [], 0
    for gi, g in enumerate(groups):
        mp3 = os.path.join(raw, "request-%02d.mp3" % gi)
        tj = os.path.join(raw, "request-%02d.timing.json" % gi)
        if not os.path.exists(mp3):
            prev_t = groups[gi - 1][-1]["ttsText"] if gi else ""
            next_t = groups[gi + 1][0]["ttsText"] if gi + 1 < len(groups) else ""
            inputs = [{"text": s["ttsText"], "voice_id": s["voiceId"]} for s in g]
            print("request %d: %d lines, %d characters" % (gi, len(g), sum(len(s["ttsText"]) for s in g)))
            res = render(inputs, prev_t, next_t, a.model)
            open(mp3, "wb").write(base64.b64decode(res["audio_base64"]))
            json.dump({"voice_segments": res.get("voice_segments"), "orders": [s["order"] for s in g]},
                      open(tj, "w"), indent=1)
        vs = sorted(json.load(open(tj))["voice_segments"] or [], key=lambda s: s["start_time_seconds"])
        span = {}
        for s in vs:
            i = s["dialogue_input_index"]
            lo, hi = span.get(i, (s["start_time_seconds"], s["end_time_seconds"]))
            span[i] = (min(lo, s["start_time_seconds"]), max(hi, s["end_time_seconds"]))
        if len(span) != len(g):
            print("  request %d returned %d segments for %d lines; using it unsplit" % (gi, len(span), len(g)))
            w = os.path.join(tmp, "p%04d.wav" % k); k += 1
            ff("-i", mp3, "-ac", "1", "-ar", "44100", w)
            pieces.append((g[0]["pauseBeforeMs"] if pieces else 0, w)); continue
        for i, s in enumerate(g):
            lo, hi = span[i]
            w = os.path.join(tmp, "p%04d.wav" % k); k += 1
            af = ("silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02,areverse,"
                  "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06,areverse")
            if s["speaker"] == "narrator" and a.narrator_tempo != 1.0:
                af += ",atempo=%.3f" % a.narrator_tempo
            ff("-ss", "%.3f" % lo, "-to", "%.3f" % hi, "-i", mp3, "-af", af, "-ac", "1", "-ar", "44100", w)
            pieces.append((s["pauseBeforeMs"] if pieces else 0, w))
    lst = os.path.join(tmp, "list.txt")
    with open(lst, "w") as f:
        for n, (pause, w) in enumerate(pieces):
            if pause:
                g = os.path.join(tmp, "gap%d.wav" % pause)
                if not os.path.exists(g):
                    ff("-f", "lavfi", "-t", str(pause / 1000), "-i", "anullsrc=r=44100:cl=mono", g)
                f.write("file '%s'\n" % os.path.abspath(g))
            f.write("file '%s'\n" % os.path.abspath(w))
    out = os.path.join(d, "chapter-%02d-v4-dialogue.mp3" % a.chapter)
    ff("-f", "concat", "-safe", "0", "-i", lst, "-b:a", "128k", out)
    for f in os.listdir(tmp):
        os.remove(os.path.join(tmp, f))
    os.rmdir(tmp)
    print("wrote", out)

if __name__ == "__main__":
    main()
