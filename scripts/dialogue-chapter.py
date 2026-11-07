#!/usr/bin/env python3
"""Render one chapter in Eleven v4 Text to Dialogue mode, as a listening test.

SPENDS CREDITS (about one per character of the chapter) the first time; every request
is cached as a raw file, so a re-run only re-times and never charges again.
The chapter's manifest is the script: every segment (narration, dialogue, system) is
one dialogue input in its own voice. Requests are cut at segment boundaries, at most
2,000 characters each, and pass previous/next text for continuity.

Then, free: each line is cut out at the returned voice_segments and trimmed to its own
speech. The segments run slightly late, so most lines end with a short blip (the next
speaker's breath or onset, a "heh" or a pop) after a few hundred ms of silence; the
trim drops any edge sound island under 160 ms that is set apart by silence, cuts at
the speech itself and fades each edge (8 ms) so no cut clicks. Then narration is sped up by --narrator-tempo (pitch kept), and the lines are
joined with the manifest's own pauseBeforeMs, the same pauses the Listen tab uses.

Output: audio/tests/dialogue-v4/chapter-NN/ (raw requests, timings, chapter mp3).
Never touches the chapter's real clips, manifest, fingerprints or approval state.
"""
import argparse, base64, json, os, subprocess, sys, urllib.request, urllib.error
import numpy as np

SR = 44100

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

def load(path):
    b = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", path, "-ac", "1", "-ar", str(SR),
                        "-f", "s16le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(b, np.int16).astype(np.float32) / 32768

def speech_bounds(seg, floor_db=-40, min_island=0.16, min_gap=0.05, pad=0.03):
    """Start/end (seconds within seg) of the line's own speech, dropping edge blips."""
    fr = int(0.01 * SR); n = len(seg) // fr
    if n < 3:
        return 0.0, len(seg) / SR
    db = 20 * np.log10(np.sqrt((seg[:n * fr].reshape(n, fr) ** 2).mean(1)) + 1e-9)
    on = db > floor_db
    isl, i = [], 0
    while i < n:
        if on[i]:
            j = i
            while j < n and on[j]:
                j += 1
            isl.append([i, j]); i = j
        else:
            i += 1
    if not isl:
        return 0.0, len(seg) / SR
    def short(k): return (isl[k][1] - isl[k][0]) * 0.01 < min_island
    while len(isl) > 1 and short(-1) and (isl[-1][0] - isl[-2][1]) * 0.01 >= min_gap:
        isl.pop()
    while len(isl) > 1 and short(0) and (isl[1][0] - isl[0][1]) * 0.01 >= min_gap:
        isl.pop(0)
    a = max(0.0, isl[0][0] * 0.01 - pad); b = min(len(seg) / SR, isl[-1][1] * 0.01 + pad)
    return a, b

def ff(*a):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *a], check=True)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("chapter", type=int)
    ap.add_argument("--narrator-tempo", type=float, default=1.1)
    ap.add_argument("--model", default="eleven_v4")
    ap.add_argument("--paragraph-pause-ms", type=int, default=1100,
                    help="pause between two narration paragraphs (the manifest's 260 ms "
                         "runs a narrated passage together)")
    ap.add_argument("--opening-pause-ms", type=int, default=1500,
                    help="pause after the chapter's first line (the date line)")
    a = ap.parse_args()
    segs = json.load(open("audio/manifests/chapter-%02d.json" % a.chapter))["segments"]
    d = "audio/tests/dialogue-v4/chapter-%02d" % a.chapter
    raw = os.path.join(d, "raw"); os.makedirs(raw, exist_ok=True)
    groups = chunks(segs)
    print("chapter %d: %d segments, %d characters, %d requests"
          % (a.chapter, len(segs), sum(len(s["ttsText"]) for s in segs), len(groups)))
    tmp = os.path.join(d, ".tmp"); os.makedirs(tmp, exist_ok=True)
    pieces, k = [], 0
    def pause_for(idx):
        if idx == 0:
            return 0
        cur, prev = segs[idx], segs[idx - 1]
        if idx == 1:
            return a.opening_pause_ms
        if cur["speaker"] == prev["speaker"] == "narrator" and cur["paragraph"] != prev["paragraph"]:
            return a.paragraph_pause_ms
        return cur["pauseBeforeMs"]
    pos = {s["order"]: n for n, s in enumerate(segs)}
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
            json.dump({"voice_segments": res.get("voice_segments"), "alignment": res.get("alignment"),
                       "orders": [s["order"] for s in g]},
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
            pieces.append((pause_for(pos[g[0]["order"]]), w)); continue
        audio = load(mp3)
        for i, s in enumerate(g):
            lo, hi = span[i]
            a0, b0 = speech_bounds(audio[int(lo * SR):int(hi * SR)])
            lo, hi = lo + a0, lo + b0
            w = os.path.join(tmp, "p%04d.wav" % k); k += 1
            af = "afade=t=in:d=0.008,areverse,afade=t=in:d=0.008,areverse"
            if s["speaker"] == "narrator" and a.narrator_tempo != 1.0:
                af += ",atempo=%.3f" % a.narrator_tempo
            ff("-ss", "%.3f" % lo, "-to", "%.3f" % hi, "-i", mp3, "-af", af, "-ac", "1", "-ar", "44100", w)
            pieces.append((pause_for(pos[s["order"]]), w))
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
