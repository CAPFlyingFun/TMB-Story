#!/usr/bin/env python3
"""One-off listening test: render a chapter's opening with consecutive narration
paragraphs MERGED into one dialogue input, so the narrator paces the passage himself.

SPENDS CREDITS once (about one per character); refuses to run again if the output
exists. Writes audio/tests/dialogue-v4/chapter-NN/merged-opening/{take.mp3,timing.json}.
Usage: dialogue-merged-test.py CHAPTER FIRST_ORDER LAST_ORDER
"""
import base64, json, os, sys, urllib.request, urllib.error

ch, first, last = (int(x) for x in sys.argv[1:4])
segs = [s for s in json.load(open("audio/manifests/chapter-%02d.json" % ch))["segments"]]
part = [s for s in segs if first <= s["order"] <= last]
nxt = next((s for s in segs if s["order"] == last + 1), None)
d = "audio/tests/dialogue-v4/chapter-%02d/merged-opening" % ch
os.makedirs(d, exist_ok=True)
if os.path.exists(os.path.join(d, "take.mp3")):
    print("take.mp3 already exists; not generating again."); sys.exit(0)
inputs, groups = [], []
for s in part:
    if inputs and s["speaker"] == "narrator" and groups[-1][0]["speaker"] == "narrator":
        inputs[-1]["text"] += "\n\n" + s["ttsText"]; groups[-1].append(s)
    else:
        inputs.append({"text": s["ttsText"], "voice_id": s["voiceId"]}); groups.append([s])
print("inputs:", len(inputs), " characters:", sum(len(i["text"]) for i in inputs))
body = {"inputs": inputs, "model_id": "eleven_v4"}
if nxt: body["future_text"] = nxt["ttsText"][:100]
req = urllib.request.Request(
    "https://api.elevenlabs.io/v1/text-to-dialogue/with-timestamps?output_format=mp3_44100_128",
    data=json.dumps(body).encode(),
    headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json"})
try:
    with urllib.request.urlopen(req, timeout=300) as r:
        res = json.load(r)
except urllib.error.HTTPError as e:
    print("HTTP", e.code, e.read().decode()[:2000]); sys.exit(1)
open(os.path.join(d, "take.mp3"), "wb").write(base64.b64decode(res["audio_base64"]))
json.dump({"voice_segments": res.get("voice_segments"), "alignment": res.get("alignment"),
           "groups": [[s["order"] for s in g] for g in groups]},
          open(os.path.join(d, "timing.json"), "w"), indent=1)
print("wrote", d)
