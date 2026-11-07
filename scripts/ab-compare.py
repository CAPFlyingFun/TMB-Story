#!/usr/bin/env python3
"""Build a v2-vs-v4 listening comparison from a spec (audio/tests/<name>/spec.json).

Downloads each v4 take from the ElevenLabs history by id (free: it fetches audio that
was already generated and paid for), then writes, next to the spec:
  v4/NN-<speaker>.mp3        the individual v4 takes
  scene-v2.mp3, scene-v4.mp3 each side stitched with the project's dialogue gaps
  compare-v2-then-v4.mp3     v2 scene, a short break, the v4 scene
Needs ELEVENLABS_API_KEY and ffmpeg. Never generates speech, never edits a manifest.
"""
import json, os, subprocess, sys, urllib.request

def fetch(hid, out):
    req = urllib.request.Request("https://api.elevenlabs.io/v1/history/%s/audio" % hid,
                                 headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"]})
    with urllib.request.urlopen(req, timeout=60) as r, open(out, "wb") as f:
        f.write(r.read())

def silence(sec, out):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-t", str(sec),
                    "-i", "anullsrc=r=44100:cl=mono", "-b:a", "128k", out], check=True)

def concat(parts, out):
    args, n = [], len(parts)
    for p in parts:
        args += ["-i", p]
    fc = "".join("[%d:a]aresample=44100,aformat=channel_layouts=mono[a%d];" % (k, k) for k in range(n))
    fc += "".join("[a%d]" % k for k in range(n)) + "concat=n=%d:v=0:a=1[out]" % n
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args, "-filter_complex", fc,
                    "-map", "[out]", "-b:a", "128k", out], check=True)

def main(spec_path):
    d = os.path.dirname(spec_path)
    spec = json.load(open(spec_path))
    os.makedirs(os.path.join(d, "v4"), exist_ok=True)
    tmp = os.path.join(d, ".tmp"); os.makedirs(tmp, exist_ok=True)
    gaps = {}
    for ms in (spec["gapSameSpeakerMs"], spec["gapDifferentSpeakerMs"]):
        gaps[ms] = os.path.join(tmp, "gap%d.mp3" % ms); silence(ms / 1000, gaps[ms])
    brk = os.path.join(tmp, "break.mp3"); silence(spec["breakSeconds"], brk)
    side = {"v2": [], "v4": []}
    prev = None
    for i, L in enumerate(spec["lines"], 1):
        v4 = os.path.join(d, "v4", "%02d-%s.mp3" % (i, L["speaker"]))
        if not os.path.exists(v4):
            fetch(L["v4HistoryItemId"], v4)
        print("line %2d  %-16s %s" % (i, L["speaker"], L["text"]))
        if prev is not None:
            g = gaps[spec["gapSameSpeakerMs"] if prev == L["speaker"] else spec["gapDifferentSpeakerMs"]]
            side["v2"].append(g); side["v4"].append(g)
        side["v2"].append(L["v2"]); side["v4"].append(v4)
        prev = L["speaker"]
    concat(side["v2"], os.path.join(d, "scene-v2.mp3"))
    concat(side["v4"], os.path.join(d, "scene-v4.mp3"))
    concat([os.path.join(d, "scene-v2.mp3"), brk, os.path.join(d, "scene-v4.mp3")],
           os.path.join(d, "compare-v2-then-v4.mp3"))
    for f in os.listdir(tmp):
        os.remove(os.path.join(tmp, f))
    os.rmdir(tmp)
    print("wrote", os.path.join(d, "compare-v2-then-v4.mp3"))

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "audio/tests/ab-v4-ch9/spec.json")
