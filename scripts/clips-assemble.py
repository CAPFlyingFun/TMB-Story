#!/usr/bin/env python3
"""Assemble a chapter rendered as separate single-voice clips (scripts/clips-chapter.py)
into one listening file and its line index. FREE: it only reads saved clips.

Nothing is cut inside a clip. Each clip loses only the quiet air at its two ends
(scripts/dialogue-assemble.py's speech_bounds, safe on a single voice), then the
clips are joined with the manifest's pause before each line. A clip holding several
lines (a same-speaker run) is played whole; its lines' start times for the captions
come from the clip's own character timings.

Writes audio/exports/chapter-NN-clips.mp3 and .json (same index shape as the dialogue
file: startMs/endMs per manifest segment).
"""
import argparse, importlib.util, json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = importlib.util.spec_from_file_location("da", os.path.join(ROOT, "scripts", "dialogue-assemble.py"))
da = importlib.util.module_from_spec(spec); spec.loader.exec_module(da)
SR, ff, load, speech_bounds = da.SR, da.ff, da.load, da.speech_bounds


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("chapter", type=int)
    ap.add_argument("--narrator-speed", type=float, default=1.1)
    ap.add_argument("--out-dir", default=os.path.join(ROOT, "audio", "exports"))
    a = ap.parse_args()
    segs = json.load(open(os.path.join(ROOT, "audio/manifests/chapter-%02d.json" % a.chapter)))["segments"]
    pos = {s["order"]: i for i, s in enumerate(segs)}
    src = os.path.join(ROOT, "audio/tests/clips-v4/chapter-%02d" % a.chapter)
    units = []
    k = 0
    while os.path.exists(os.path.join(src, "unit-%03d.json" % k)):
        units.append(json.load(open(os.path.join(src, "unit-%03d.json" % k)))); k += 1
    covered = [o for u in units for o in u["orders"]]
    if sorted(covered) != sorted(s["order"] for s in segs):
        sys.exit("the saved clips do not cover the chapter's lines exactly; render the missing ones first")
    tmp = os.path.join(a.out_dir, ".clips-tmp"); os.makedirs(tmp, exist_ok=True)
    pieces, starts, ends, t_out = [], {}, {}, 0.0
    for k, u in enumerate(units):
        mp3 = os.path.join(src, "unit-%03d.mp3" % k)
        audio = load(mp3)
        a0, b0 = speech_bounds(audio)
        narr = u["speaker"] == "narrator"
        # the narrator's speed: asked of the model; if it refused, speed the clip up whole
        tempo = a.narrator_speed if (narr and "voice_settings" in u.get("dropped", [])) else 1.0
        if k:
            pause = segs[pos[u["orders"][0]]].get("pauseBeforeMs", 350) or 0
            if pause:
                g = os.path.join(tmp, "gap%d.wav" % pause)
                if not os.path.exists(g):
                    ff("-f", "lavfi", "-t", str(pause / 1000), "-i", "anullsrc=r=44100:cl=mono", g)
                pieces.append(g); t_out += pause / 1000
        w = os.path.join(tmp, "u%04d.wav" % k)
        af = "afade=t=in:d=0.008,areverse,afade=t=in:d=0.008,areverse" + (",atempo=%.3f" % tempo if tempo != 1.0 else "")
        ff("-ss", "%.3f" % a0, "-to", "%.3f" % b0, "-i", mp3, "-af", af, "-ac", "1", "-ar", "44100", w)
        dur = len(load(w)) / SR
        # each line's start inside the clip, from the clip's own character timings
        al = u.get("alignment") or {}
        chars = "".join(al.get("characters") or []); cst = al.get("character_start_times_seconds") or []
        p = 0
        for o in u["orders"]:
            txt = segs[pos[o]]["ttsText"]
            i = chars.find(txt[:24], p) if len(u["orders"]) > 1 else -1
            starts[o] = t_out + (max(0.0, cst[i] - a0) / tempo if 0 <= i < len(cst) else 0.0)
            if i >= 0: p = i + len(txt)
            ends[o] = t_out + dur
        for x, y in zip(u["orders"], u["orders"][1:]):
            ends[x] = starts[y]
        pieces.append(w); t_out += dur
    lst = os.path.join(tmp, "list.txt")
    open(lst, "w").write("".join("file '%s'\n" % p for p in pieces))
    out = os.path.join(a.out_dir, "chapter-%02d-clips.mp3" % a.chapter)
    ff("-f", "concat", "-safe", "0", "-i", lst, "-b:a", "128k", out)
    for f in os.listdir(tmp):
        os.remove(os.path.join(tmp, f))
    os.rmdir(tmp)
    side = {"_comment": ["Index for chapter-%02d-clips.mp3, written by scripts/clips-assemble.py." % a.chapter,
                         "Separate single-voice Eleven v4 clips; same-speaker runs are one clip; nothing cut inside a clip."],
            "model": units[0].get("model"), "narratorSpeed": a.narrator_speed,
            "startMs": [round(starts[s["order"]] * 1000) for s in segs],
            "endMs": [round(ends[s["order"]] * 1000) for s in segs], "seconds": round(t_out, 2)}
    json.dump(side, open(out.replace(".mp3", ".json"), "w"), indent=1)
    print("wrote %s (%.1f s, %d lines, %d clips)" % (os.path.relpath(out, ROOT), t_out, len(segs), len(units)))


if __name__ == "__main__":
    main()
