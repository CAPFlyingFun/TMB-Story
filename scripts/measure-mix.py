#!/usr/bin/env python3
"""Measure what is actually in the audio, rather than what the manifest intends.

    python3 scripts/measure-mix.py [--asset ASSET_ID] [--chapters 1-3]

Written because a cue sheet can be perfectly correct and the sound still inaudible.
Joshua could not hear the keyboard typing in the exported mix even though all nine
cues resolved, so "the manifest says it is there" stopped being an acceptable answer.

Three measurements, all from decoded PCM:

1. EVERY SOUND ASSET: duration, peak and RMS in dBFS, and an RMS envelope in 250 ms
   buckets. The envelope is what distinguishes a three-second typing burst from one
   keystroke followed by silence -- a distinction no duration field can make.
2. A LAYERS-ONLY RENDER of the chapter: the same mix graph with the voices left out,
   so each cue's contribution can be measured on its own and located in time.
3. THE FULL MIX at each cue position, against the layers-only render at the same
   position, which is what says whether a cue survived into the exported file and how
   far under the speech it sits.

Needs ffmpeg for decoding. Without it the script says so and exits, because guessing
at a level is the thing this exists to stop.
"""

import argparse
import audioop
import json
import math
import os
import shutil
import subprocess
import sys
import tempfile
import wave

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from tmbaudio import drama, manifest as mf, sfx as sfxmod   # noqa: E402
from tmbaudio.registry import ROOT, Registry               # noqa: E402

BUCKET_MS = 250


def ffmpeg():
    exe = shutil.which("ffmpeg")
    if not exe:
        sys.exit("ffmpeg is not on the path. This script measures decoded audio, and "
                 "without a decoder it would have to guess -- which is the thing it "
                 "exists to prevent. Run it where ffmpeg is installed (the CI job "
                 "installs it).")
    return exe


def decode(path, start=None, duration=None):
    """(samples_bytes, rate) of mono 16-bit PCM. A window if start/duration given."""
    with tempfile.TemporaryDirectory() as tmp:
        out = os.path.join(tmp, "x.wav")
        cmd = [ffmpeg(), "-v", "error", "-y"]
        if start is not None:
            cmd += ["-ss", "%.3f" % start]
        cmd += ["-i", path]
        if duration is not None:
            cmd += ["-t", "%.3f" % duration]
        cmd += ["-ac", "1", "-ar", "44100", "-acodec", "pcm_s16le", "-f", "wav", out]
        subprocess.run(cmd, check=True)
        with wave.open(out) as w:
            return w.readframes(w.getnframes()), w.getframerate()


def dbfs(value):
    """16-bit full scale is 32768. Returns -inf as a readable floor."""
    if value <= 0:
        return float("-inf")
    return 20.0 * math.log10(value / 32768.0)


def fmt(db):
    return "  -inf" if db == float("-inf") else "%6.1f" % db


def envelope(pcm, rate, bucket_ms=BUCKET_MS):
    """RMS dBFS per bucket, so a burst can be told from a click."""
    step = int(rate * bucket_ms / 1000) * 2          # 2 bytes a sample
    out = []
    for i in range(0, len(pcm) - step + 1, step):
        out.append(dbfs(audioop.rms(pcm[i:i + step], 2)))
    return out


def sparkline(env, floor=-60.0):
    """A crude picture of the envelope. Eight levels from the floor to 0 dBFS."""
    chars = " ._-=+*#"
    out = []
    for db in env:
        if db == float("-inf") or db < floor:
            out.append(chars[0])
        else:
            idx = int((db - floor) / (-floor) * (len(chars) - 1))
            out.append(chars[max(0, min(len(chars) - 1, idx))])
    return "".join(out)


def audible_span(env, floor_db):
    """Seconds of the envelope above a floor: how long the sound actually sounds."""
    above = sum(1 for db in env if db != float("-inf") and db > floor_db)
    return above * BUCKET_MS / 1000.0


# ---- 1. the assets ---------------------------------------------------------
def measure_assets(sreg, only=None):
    print("=" * 78)
    print("SOUND ASSETS, as decoded. Peak and RMS are dBFS; 0 is full scale.")
    print("`sounds for` is the time the RMS envelope stays within 20 dB of the")
    print("asset's own peak -- a 3 s file that sounds for 0.4 s is a click.")
    print("=" * 78)
    rows = []
    for aid in sorted(sreg.assets):
        if only and aid != only:
            continue
        path = os.path.join(ROOT, sfxmod.asset_paths(sreg, aid)[0])
        if not os.path.isfile(path):
            print("  %-30s (not generated)" % aid)
            continue
        pcm, rate = decode(path)
        peak, rms = dbfs(audioop.max(pcm, 2)), dbfs(audioop.rms(pcm, 2))
        env = envelope(pcm, rate)
        dur = len(pcm) / 2.0 / rate
        sounds = audible_span(env, peak - 20)
        rows.append((aid, dur, peak, rms, sounds))
        print("  %-30s %5.2fs  peak %s  rms %s  sounds for %4.2fs"
              % (aid, dur, fmt(peak), fmt(rms), sounds))
        print("  %-30s %s" % ("", sparkline(env)))
    return rows


# ---- 2 and 3. the mix ------------------------------------------------------
def render_layers_only(number, reg, sreg, out_path):
    """The mix graph with the voices removed, so each cue can be heard alone."""
    manifest = mf.load(number)
    spec = drama.plan(manifest, sreg)
    # One silent voice input keeps the graph's shape (build_graph needs a voice) while
    # contributing nothing measurable, so the beds still duck exactly as they do in the
    # real mix and every cue keeps its real position.
    silent = os.path.join(os.path.dirname(out_path), "silence.wav")
    subprocess.run([ffmpeg(), "-v", "error", "-y", "-f", "lavfi",
                    "-i", "anullsrc=r=44100:cl=mono",
                    "-t", "%.3f" % spec["total"], silent], check=True)
    spec["voices"] = [{"path": silent, "at": 0.0, "gain": 1.0}]
    inputs, graph, label = drama.build_graph(spec)
    cmd = [ffmpeg(), "-v", "error", "-y"]
    for p in inputs:
        cmd += ["-i", p]
    cmd += ["-filter_complex", graph, "-map", label,
            "-c:a", "pcm_s16le", "-ar", "44100", "-ac", "1", out_path]
    subprocess.run(cmd, check=True)
    return manifest, spec


def measure_cues(number, reg, sreg, asset_filter=None):
    manifest = mf.load(number)
    full = os.path.join(ROOT, "audio", "exports", "chapter-%02d-drama.mp3" % number)
    if not os.path.isfile(full):
        print("\nNo drama export for chapter %d yet." % number)
        return []
    with tempfile.TemporaryDirectory() as tmp:
        layers = os.path.join(tmp, "layers.wav")
        _, spec = render_layers_only(number, reg, sreg, layers)
        by_cue = {c["cueId"]: c for c in spec["shots"]}
        by_cue.update({c["cueId"]: c for c in spec["beds"]})

        print()
        print("=" * 78)
        print("CUES IN THE EXPORTED MIX. `layers` is the cue's own contribution,")
        print("measured from a render with the voices removed. `full` is the same")
        print("window of the delivered file, which is mostly speech.")
        print("=" * 78)
        rows = []
        cues = sorted(manifest["cues"], key=lambda c: c["order"])
        for cue in cues:
            if asset_filter and cue["asset"] != asset_filter:
                continue
            plan = by_cue.get(cue["cueId"])
            if not plan:
                print("  %-28s NOT IN THE MIX (asset missing)" % cue["cueId"])
                rows.append((cue["cueId"], None, None, None))
                continue
            at = plan["at"]
            window = min(4.0, plan.get("duration", 3.0))
            lp, rate = decode(layers, at, window)
            fp, _ = decode(full, at, window)
            l_rms, l_peak = dbfs(audioop.rms(lp, 2)), dbfs(audioop.max(lp, 2))
            f_rms = dbfs(audioop.rms(fp, 2))
            # A quiet control window just before the cue, from the layers render: if the
            # cue is really there, its window is louder than the moment before it.
            before = max(0.0, at - window - 0.2)
            bp, _ = decode(layers, before, window)
            b_rms = dbfs(audioop.rms(bp, 2))
            lift = l_rms - b_rms if l_rms != float("-inf") and b_rms != float("-inf") else None
            env = envelope(lp, rate)
            sounds = audible_span(env, l_peak - 20) if l_peak != float("-inf") else 0.0
            rows.append((cue["cueId"], l_rms, f_rms, lift))
            print("  %-28s at %6.1fs  gain %.2f  layers rms %s peak %s  full rms %s"
                  % (cue["cueId"], at, cue["gain"], fmt(l_rms), fmt(l_peak), fmt(f_rms)))
            print("  %-28s   lift over the moment before: %s dB   sounds for %4.2fs"
                  % ("", ("%+.1f" % lift) if lift is not None else "n/a", sounds))
            print("  %-28s   %s" % ("", sparkline(env)))
        return rows


def parse_chapters(spec):
    out = set()
    for part in str(spec).split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            a, b = part.split("-", 1)
            out.update(range(int(a), int(b) + 1))
        else:
            out.add(int(part))
    return sorted(out)


def main(argv):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    # A RANGE, not an int: the workflow passes its own `chapters` input straight
    # through, so "2-3" has to work here exactly as it does for audio.py. It did not,
    # and because the step is continue-on-error the measurement simply never ran.
    ap.add_argument("--chapter", "--chapters", dest="chapters", default="1",
                    help="e.g. 1, 2-3, 1,3")
    ap.add_argument("--asset", default=None, help="measure only this asset and its cues")
    ap.add_argument("--assets-only", action="store_true")
    args = ap.parse_args(argv)
    ffmpeg()
    reg = Registry()
    sreg = sfxmod.SfxRegistry(config=reg.config)
    measure_assets(sreg, only=args.asset)
    if args.assets_only:
        return 0
    for number in parse_chapters(args.chapters):
        measure_cues(number, reg, sreg, asset_filter=args.asset)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
