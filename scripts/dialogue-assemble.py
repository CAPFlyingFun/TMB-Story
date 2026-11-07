#!/usr/bin/env python3
"""Assemble a chapter's Eleven v4 dialogue takes into ONE listening file, with an index.

Free: no request is made. It reads the takes saved under audio/tests/dialogue-v4/
chapter-NN/ (raw/request-*.{mp3,timing.json} from dialogue-chapter.py, plus any
"patch" takes such as merged-opening/, which replace the lines they cover) and writes

  audio/exports/chapter-NN-dialogue.mp3    the chapter, one file
  audio/exports/chapter-NN-dialogue.json   startMs/endMs for every segment order

so the reader plays one file and still knows which line is sounding.

How a line is placed (Joshua's approved "version B", 2026-11-07):
  * Each dialogue input is cut out at its voice_segment and trimmed to its own speech:
    edge blips under 160 ms set apart by silence (the next voice's breath or onset)
    are dropped, and each cut is faded 8 ms so nothing clicks.
  * Narration is sped up by --narrator-tempo (pitch kept).
  * An input that carries several narration paragraphs (a merged passage) keeps the
    narrator's own pacing inside it; each paragraph's start inside it comes from the
    take's character alignment, scaled by the tempo.
  * Between inputs: the manifest's pauseBeforeMs, except --paragraph-pause-ms between
    two separate narration paragraphs and --opening-pause-ms after a lone first line.
"""
import argparse, glob, json, os, subprocess, sys
import numpy as np

SR = 44100
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def ff(*a):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *a], check=True)


def load(path):
    b = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", path, "-ac", "1", "-ar", str(SR),
                        "-f", "s16le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(b, np.int16).astype(np.float32) / 32768


def speech_bounds(seg, floor_db=-40, min_island=0.16, min_gap=0.05, pad=0.03):
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
    return max(0.0, isl[0][0] * 0.01 - pad), min(len(seg) / SR, isl[-1][1] * 0.01 + pad)


def takes_for(chapter):
    """Every saved take, patches last so they win: [(mp3, timing, groups)]."""
    base = os.path.join(ROOT, "audio", "tests", "dialogue-v4", "chapter-%02d" % chapter)
    out = []
    for tj in sorted(glob.glob(os.path.join(base, "raw", "request-*.timing.json"))):
        t = json.load(open(tj))
        groups = t.get("groups") or [[o] for o in t["orders"]]
        out.append((tj.replace(".timing.json", ".mp3"), t, groups))
    for tj in sorted(glob.glob(os.path.join(base, "*", "timing.json"))):
        if os.path.basename(os.path.dirname(tj)) == "raw":
            continue
        t = json.load(open(tj))
        out.append((os.path.join(os.path.dirname(tj), "take.mp3"), t, t["groups"]))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("chapter", type=int)
    ap.add_argument("--narrator-tempo", type=float, default=1.1)
    ap.add_argument("--paragraph-pause-ms", type=int, default=1100)
    ap.add_argument("--opening-pause-ms", type=int, default=1500)
    a = ap.parse_args()
    segs = json.load(open(os.path.join(ROOT, "audio", "manifests", "chapter-%02d.json" % a.chapter)))["segments"]
    by_order = {s["order"]: s for s in segs}
    # Which take and which input covers each order (later takes override earlier ones).
    cover = {}
    for ti, (mp3, t, groups) in enumerate(takes_for(a.chapter)):
        for gi, g in enumerate(groups):
            for o in g:
                cover[o] = (ti, gi)
    missing = [s["order"] for s in segs if s["order"] not in cover]
    if missing:
        sys.exit("no take covers orders %s" % missing[:10])
    takes = takes_for(a.chapter)
    # Story-order list of inputs to place, each a (take, input) used once.
    units, seen = [], set()
    for s in segs:
        key = cover[s["order"]]
        if key in seen:
            continue
        seen.add(key)
        ti, gi = key
        units.append((ti, gi, [o for o in takes[ti][2][gi] if cover.get(o) == key]))
    tmp = os.path.join(ROOT, "audio", "exports", ".dialogue-tmp"); os.makedirs(tmp, exist_ok=True)
    cache, pieces, starts, ends = {}, [], {}, {}
    t_out, prev_order = 0.0, None
    for k, (ti, gi, orders) in enumerate(units):
        mp3, timing, groups = takes[ti]
        if ti not in cache:
            cache[ti] = load(mp3)
        audio = cache[ti]
        vs = [v for v in timing["voice_segments"] if v["dialogue_input_index"] == gi]
        lo = min(v["start_time_seconds"] for v in vs); hi = max(v["end_time_seconds"] for v in vs)
        a0, b0 = speech_bounds(audio[int(lo * SR):int(hi * SR)])
        cut0, cut1 = lo + a0, lo + b0
        first = by_order[orders[0]]
        narr = first["speaker"] == "narrator"
        tempo = a.narrator_tempo if narr else 1.0
        # pause before this unit
        if prev_order is None:
            pause = 0
        else:
            prev = by_order[prev_order]
            if prev_order == segs[0]["order"] and len(units[k - 1][2]) == 1:
                pause = a.opening_pause_ms
            elif narr and prev["speaker"] == "narrator" and first["paragraph"] != prev["paragraph"]:
                pause = a.paragraph_pause_ms
            else:
                pause = first["pauseBeforeMs"]
        if pause:
            g = os.path.join(tmp, "gap%d.wav" % pause)
            if not os.path.exists(g):
                ff("-f", "lavfi", "-t", str(pause / 1000), "-i", "anullsrc=r=44100:cl=mono", g)
            pieces.append(g); t_out += pause / 1000
        w = os.path.join(tmp, "u%04d.wav" % k)
        af = "afade=t=in:d=0.008,areverse,afade=t=in:d=0.008,areverse"
        if tempo != 1.0:
            af += ",atempo=%.3f" % tempo
        ff("-ss", "%.3f" % cut0, "-to", "%.3f" % cut1, "-i", mp3, "-af", af, "-ac", "1", "-ar", "44100", w)
        dur = len(load(w)) / SR
        # Where each order in this unit begins: alignment inside a merged passage.
        if len(orders) == 1:
            starts[orders[0]] = t_out
        else:
            al = timing.get("alignment") or {}
            chars = "".join(al.get("characters") or [])
            cst = al.get("character_start_times_seconds") or []
            pos = vs[0]["character_start_index"]
            for o in orders:
                txt = by_order[o]["ttsText"]
                idx = chars.find(txt[:24], pos)
                if idx < 0 or idx >= len(cst):
                    starts[o] = t_out
                else:
                    starts[o] = t_out + max(0.0, cst[idx] - cut0) / tempo
                    pos = idx + len(txt)
        for o in orders:
            ends[o] = t_out + dur
        pieces.append(w); t_out += dur
        prev_order = orders[-1]
    # A line's end is the next line's start when they share a unit.
    ordered = [s["order"] for s in segs]
    for i, o in enumerate(ordered[:-1]):
        nxt = ordered[i + 1]
        if cover[o] == cover[nxt]:
            ends[o] = starts[nxt]
    lst = os.path.join(tmp, "list.txt")
    with open(lst, "w") as f:
        for p in pieces:
            f.write("file '%s'\n" % p)
    out = os.path.join(ROOT, "audio", "exports", "chapter-%02d-dialogue.mp3" % a.chapter)
    ff("-f", "concat", "-safe", "0", "-i", lst, "-b:a", "128k", out)
    for f in os.listdir(tmp):
        os.remove(os.path.join(tmp, f))
    os.rmdir(tmp)
    side = {
        "_comment": ["Index for chapter-%02d-dialogue.mp3, written by scripts/dialogue-assemble.py." % a.chapter,
                     "Eleven v4 Text to Dialogue takes, narrator x%.2f; approach approved by Joshua 2026-11-07." % a.narrator_tempo],
        "model": "eleven_v4", "narratorTempo": a.narrator_tempo,
        "paragraphPauseMs": a.paragraph_pause_ms,
        "startMs": [int(round(starts[o] * 1000)) for o in ordered],
        "endMs": [int(round(ends[o] * 1000)) for o in ordered],
        "seconds": round(t_out, 2),
    }
    json.dump(side, open(out.replace(".mp3", ".json"), "w"), indent=1)
    print("wrote %s (%.1f s, %d lines, %d units)" % (os.path.relpath(out, ROOT), t_out, len(ordered), len(units)))


if __name__ == "__main__":
    main()
