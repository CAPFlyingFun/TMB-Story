#!/usr/bin/env python3
"""Render one chapter in Eleven v4 Text to Dialogue mode ("version B", Joshua 2026-11-07).

SPENDS CREDITS (about one per character of the chapter) the first time. Every request
is kept under audio/tests/dialogue-v4/chapter-NN/raw/, so a re-run makes no request
and only re-assembles.

The chapter's manifest is the script. Each segment is one dialogue input in its own
voice, except that a run of narration paragraphs with nothing between them is ONE
input, so the narrator paces the passage himself (Joshua preferred this, version B).
Requests are cut at input boundaries, at most 1,900 characters each, and carry the
neighbouring text for continuity. Then scripts/dialogue-assemble.py builds the one
listening file and its index (free).
"""
import argparse, base64, json, os, subprocess, sys, urllib.request, urllib.error

LIMIT = 1900
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def units(segs):
    """Groups of segments that are one dialogue input each."""
    out = []
    for s in segs:
        prev = out[-1] if out else None
        if (prev and s["speaker"] == "narrator" and prev[-1]["speaker"] == "narrator"
                and s["paragraph"] != prev[-1]["paragraph"]
                and sum(len(x["ttsText"]) + 2 for x in prev) + len(s["ttsText"]) <= LIMIT):
            prev.append(s)
        else:
            out.append([s])
    return out


def requests_for(us):
    out, cur, n = [], [], 0
    for u in us:
        L = sum(len(s["ttsText"]) + 2 for s in u)
        if cur and n + L > LIMIT:
            out.append(cur); cur, n = [], 0
        cur.append(u); n += L
    if cur:
        out.append(cur)
    return out


def text(u):
    return "\n\n".join(s["ttsText"] for s in u)


def render(inputs, prev_text, next_text, model):
    body = {"inputs": inputs, "model_id": model}
    if prev_text: body["previous_text"] = prev_text[-100:]
    if next_text: body["future_text"] = next_text[:100]
    def call(b):
        req = urllib.request.Request(
            "https://api.elevenlabs.io/v1/text-to-dialogue/with-timestamps?output_format=mp3_44100_128",
            data=json.dumps(b).encode(),
            headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=300) as r:
            return json.load(r)
    try:
        return call(body)
    except urllib.error.HTTPError as e:
        msg = e.read().decode()[:500]
        if "previous_text" in body or "future_text" in body:
            print("  retrying without previous/future text (HTTP %d: %s)" % (e.code, msg))
            body.pop("previous_text", None); body.pop("future_text", None)
            return call(body)
        print("HTTP", e.code, msg); raise


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("chapter", type=int)
    ap.add_argument("--narrator-tempo", type=float, default=1.1)
    ap.add_argument("--paragraph-pause-ms", type=int, default=1100)
    ap.add_argument("--model", default="eleven_v4")
    ap.add_argument("--estimate", action="store_true", help="print the plan and cost; make no request")
    a = ap.parse_args()
    segs = json.load(open(os.path.join(ROOT, "audio/manifests/chapter-%02d.json" % a.chapter)))["segments"]
    raw = os.path.join(ROOT, "audio/tests/dialogue-v4/chapter-%02d/raw" % a.chapter)
    have = os.path.isdir(raw) and any(f.endswith(".mp3") for f in os.listdir(raw))
    reqs = requests_for(units(segs))
    chars = sum(len(text(u)) for r in reqs for u in r)
    print("chapter %d: %d segments, %d inputs, %d requests, ~%d credits%s"
          % (a.chapter, len(segs), sum(len(r) for r in reqs), len(reqs), chars,
             " (already rendered: re-assembling only, free)" if have else ""))
    if a.estimate:
        return
    if not have:
        os.makedirs(raw, exist_ok=True)
        for ri, r in enumerate(reqs):
            prev_t = text(reqs[ri - 1][-1]) if ri else ""
            next_t = text(reqs[ri + 1][0]) if ri + 1 < len(reqs) else ""
            inputs = [{"text": text(u), "voice_id": u[0]["voiceId"]} for u in r]
            print("request %d: %d inputs, %d characters" % (ri, len(r), sum(len(i["text"]) for i in inputs)))
            res = render(inputs, prev_t, next_t, a.model)
            open(os.path.join(raw, "request-%02d.mp3" % ri), "wb").write(base64.b64decode(res["audio_base64"]))
            json.dump({"voice_segments": res.get("voice_segments"), "alignment": res.get("alignment"),
                       "groups": [[s["order"] for s in u] for u in r]},
                      open(os.path.join(raw, "request-%02d.timing.json" % ri), "w"), indent=1)
    subprocess.run([sys.executable, os.path.join(ROOT, "scripts/dialogue-assemble.py"), str(a.chapter),
                    "--narrator-tempo", str(a.narrator_tempo),
                    "--paragraph-pause-ms", str(a.paragraph_pause_ms)], check=True)


if __name__ == "__main__":
    main()
