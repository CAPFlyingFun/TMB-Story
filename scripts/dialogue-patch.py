#!/usr/bin/env python3
"""Re-record only the inputs of a v4 dialogue chapter whose text changed (2026-11-10).

SPENDS CREDITS: about one per character of the inputs patched, nothing else. Each named
manifest order is found in the dialogue take that covers it; the whole input holding it
(one line, or a merged run of narration) is rendered again as a single-voice Eleven v4
take and saved as a patch under audio/tests/dialogue-v4/chapter-NN/patch-<orders>/, in
the same shape as a dialogue take. scripts/dialogue-assemble.py already lets a later
patch take replace the lines it covers, so the chapter file is then rebuilt (free) with
everything else exactly as it was.

The narrator is rendered at normal speed: the assembler speeds narration up by
--narrator-tempo as it always has. Delivery tags for character lines come from
audio/tags/chapter-NN.json when present.
"""
import argparse, base64, importlib.util, json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cc = importlib.util.spec_from_file_location("cc", os.path.join(ROOT, "scripts", "clips-chapter.py"))
clips = importlib.util.module_from_spec(cc); cc.loader.exec_module(clips)
da_spec = importlib.util.spec_from_file_location("da", os.path.join(ROOT, "scripts", "dialogue-assemble.py"))
da = importlib.util.module_from_spec(da_spec); da_spec.loader.exec_module(da)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("chapter", type=int)
    ap.add_argument("orders", help="manifest orders whose text changed, e.g. 167,169")
    ap.add_argument("--model", default="eleven_v4")
    ap.add_argument("--dictionaries", default="auto")
    ap.add_argument("--estimate", action="store_true")
    a = ap.parse_args()
    segs = json.load(open(os.path.join(ROOT, "audio/manifests/chapter-%02d.json" % a.chapter)))["segments"]
    by = {s["order"]: s for s in segs}
    tags = clips.load_tags(a.chapter)
    want = [int(x) for x in a.orders.split(",") if x.strip()]
    # the input (group of orders) that covers each wanted order, in the latest take
    cover = {}
    for _mp3, _t, groups in da.takes_for(a.chapter):
        for g in groups:
            for o in g:
                cover[o] = g
    groups = []
    for o in want:
        g = cover.get(o)
        if g is None:
            sys.exit("order %d is not in any take of chapter %d" % (o, a.chapter))
        if g not in groups:
            groups.append(g)
    base = os.path.join(ROOT, "audio/tests/dialogue-v4/chapter-%02d" % a.chapter)
    total = 0
    plans = []
    for g in groups:
        text = "\n\n".join(clips.tag_prefix(by[o], tags) + by[o]["ttsText"] for o in g)
        out = os.path.join(base, "patch-%s" % "-".join(str(o) for o in g))
        plans.append((g, text, out)); total += len(text)
        print("patch orders %s (%s, %d characters)%s" % (g, by[g[0]]["speaker"], len(text),
              " -- already rendered" if os.path.exists(os.path.join(out, "timing.json")) else ""))
    print("about %d credits" % total)
    if a.estimate:
        return
    dicts = clips.dictionaries() if a.dictionaries == "auto" else []
    pos = {s["order"]: i for i, s in enumerate(segs)}
    for g, text, out in plans:
        if os.path.exists(os.path.join(out, "timing.json")):
            continue
        i0, i1 = pos[g[0]], pos[g[-1]]
        prev_t = segs[i0 - 1]["ttsText"] if i0 else ""
        next_t = segs[i1 + 1]["ttsText"] if i1 + 1 < len(segs) else ""
        voice = by[g[0]]["voiceId"]
        res, dropped = clips.render(voice, text, prev_t, next_t, 1.0, a.model, dicts)
        os.makedirs(out, exist_ok=True)
        open(os.path.join(out, "take.mp3"), "wb").write(base64.b64decode(res["audio_base64"]))
        al = res.get("alignment") or {}
        ends = al.get("character_end_times_seconds") or [0]
        json.dump({"voice_segments": [{"voice_id": voice, "start_time_seconds": 0.0,
                                       "end_time_seconds": round(max(ends) + 0.4, 3),
                                       "character_start_index": 0, "character_end_index": len(text),
                                       "dialogue_input_index": 0}],
                   "alignment": al, "groups": [g], "model": a.model, "dropped": dropped,
                   "dictionaries": dicts, "text": text},
                  open(os.path.join(out, "timing.json"), "w"), indent=1)
        print("rendered patch for orders %s" % g)
    subprocess.run([sys.executable, os.path.join(ROOT, "scripts/dialogue-assemble.py"), str(a.chapter)], check=True)


if __name__ == "__main__":
    main()
