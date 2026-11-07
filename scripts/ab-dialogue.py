#!/usr/bin/env python3
"""Render a comparison spec's lines as ONE Text to Dialogue request (Eleven v4).

SPENDS CREDITS (about one per character of the lines). Run only on Joshua's say-so.
Writes next to the spec:
  dialogue-v4.mp3            the dialogue exactly as ElevenLabs returned it
  dialogue-v4.timing.json    voice_segments (per-line start/end) for later cutting
  dialogue-v4-cut.mp3        the same take cut per line at voice_segments and
                             re-stitched with the project's gaps (tests whether a
                             dialogue render can still become per-line clips)
Refuses to run if dialogue-v4.mp3 already exists, so a re-run never charges twice.
Never touches a manifest, a fingerprint or a chapter.
"""
import base64, json, os, subprocess, sys, urllib.request

def main(spec_path, model="eleven_v4"):
    d = os.path.dirname(spec_path)
    out = os.path.join(d, "dialogue-v4.mp3")
    if os.path.exists(out):
        print("dialogue-v4.mp3 already exists; not generating again."); return
    spec = json.load(open(spec_path))
    voices = json.load(open("story-rules/voice-registry.json"))
    voices = voices.get("speakers", voices)
    inputs = [{"text": L["text"], "voice_id": voices[L["speaker"]]["elevenLabsVoiceId"]} for L in spec["lines"]]
    chars = sum(len(i["text"]) for i in inputs)
    print("characters:", chars, " model:", model)
    assert chars <= 2000, "Text to Dialogue allows at most 2,000 characters per request"
    req = urllib.request.Request(
        "https://api.elevenlabs.io/v1/text-to-dialogue/with-timestamps?output_format=mp3_44100_128",
        data=json.dumps({"inputs": inputs, "model_id": model}).encode(),
        headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            res = json.load(r)
    except urllib.error.HTTPError as e:
        print("HTTP", e.code, e.read().decode()[:2000]); sys.exit(1)
    open(out, "wb").write(base64.b64decode(res["audio_base64"]))
    timing = {k: res.get(k) for k in ("voice_segments", "alignment")}
    json.dump(timing, open(os.path.join(d, "dialogue-v4.timing.json"), "w"), indent=1)
    segs = sorted(res.get("voice_segments") or [], key=lambda s: s["start_time_seconds"])
    print("segments:", len(segs))
    for s in segs:
        print("  input %2d  %6.2f-%6.2f s" % (s["dialogue_input_index"], s["start_time_seconds"], s["end_time_seconds"]))
    # Cut test: one clip per input (first start to last end for that input), re-stitched.
    by = {}
    for s in segs:
        a, b = by.get(s["dialogue_input_index"], (s["start_time_seconds"], s["end_time_seconds"]))
        by[s["dialogue_input_index"]] = (min(a, s["start_time_seconds"]), max(b, s["end_time_seconds"]))
    if len(by) != len(inputs):
        print("Not one segment per line (%d for %d); skipping the cut test." % (len(by), len(inputs))); return
    args, fc, n, prev = [], "", 0, None
    for i, L in enumerate(spec["lines"]):
        if prev is not None:
            gap = (spec["gapSameSpeakerMs"] if prev == L["speaker"] else spec["gapDifferentSpeakerMs"]) / 1000
            args += ["-f", "lavfi", "-t", str(gap), "-i", "anullsrc=r=44100:cl=mono"]; n += 1
        a, b = by[i]
        args += ["-ss", "%.3f" % a, "-to", "%.3f" % b, "-i", out]; n += 1
        prev = L["speaker"]
    fc = "".join("[%d:a]aresample=44100,aformat=channel_layouts=mono[a%d];" % (k, k) for k in range(n))
    fc += "".join("[a%d]" % k for k in range(n)) + "concat=n=%d:v=0:a=1[out]" % n
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args, "-filter_complex", fc, "-map", "[out]",
                    "-b:a", "128k", os.path.join(d, "dialogue-v4-cut.mp3")], check=True)
    print("wrote dialogue-v4.mp3 and dialogue-v4-cut.mp3")

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "audio/tests/ab-v4-ch9/spec.json")
