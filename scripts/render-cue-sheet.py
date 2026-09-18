#!/usr/bin/env python3
"""Render a chapter's SFX cue sheet as a reviewable markdown document.

    python3 scripts/render-cue-sheet.py [chapter ...]

The document is derived from `audio/cues/chapter-NN.json`, `audio/sfx-registry.json`
and the built manifest, so it cannot disagree with what the pipeline would play. Run
it again after editing a cue or a prompt.

The approximate timestamps it prints are for a human ear only. Cues anchor to clip
identity, so a recast voice moves every number here and moves nothing about the cue
sheet. Makes no network request and reads no secret.
"""

import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from tmbaudio import cache, manifest as mf, sfx as sfxmod   # noqa: E402
from tmbaudio.registry import ROOT, Registry                # noqa: E402

OUT_DIR = os.path.join(ROOT, "audio", "cues")


def clock(seconds):
    return "%d:%02d" % (int(seconds // 60), int(seconds % 60))


def review_times(manifest):
    """Approximate start of each segment, measured from the clips that exist."""
    at, t = {}, 0.0
    for seg in manifest["segments"]:
        t += (seg.get("pauseBeforeMs") or 0) / 1000.0
        at[seg["order"]] = t
        t += cache.mp3_duration_seconds(os.path.join(ROOT, seg["audio"]))
    return at, t


def render(number, reg, sreg):
    files = mf.chapter_files()
    manifest = mf.build(number, files[number], reg, sfx_registry=sreg)
    cues = manifest["cues"]
    by_order = {s["order"]: s for s in manifest["segments"]}
    at, total = review_times(manifest)

    uses = {}
    for c in cues:
        uses[c["asset"]] = uses.get(c["asset"], 0) + 1
    pending = [a for a in uses if not sfxmod.plan_asset(sreg, a)["cached"]]

    out = []
    w = out.append
    w("# Chapter %d: %s — SFX and ambience cue sheet"
      % (number, manifest["title"].split(":", 1)[-1].strip()))
    w("")
    if pending:
        w("**Status: PROPOSED. %d of %d assets have not been generated and no ElevenLabs"
          % (len(pending), len(uses)))
        w("credits have been spent on them.** Each one below is a prompt awaiting approval.")
    else:
        w("**Status: every cued asset is generated and cached.**")
    w("")
    w("Generated from `audio/cues/chapter-%02d.json` and `audio/sfx-registry.json`, so"
      % number)
    w("this document cannot drift from what the pipeline would actually play. Rebuild it")
    w("with `python3 scripts/render-cue-sheet.py %d`." % number)
    w("")
    w("| | |")
    w("|---|---|")
    w("| Playback events | **%d** |" % len(cues))
    w("| Unique assets | **%d** (%d still to generate) |" % (len(uses), len(pending)))
    w("| Chapter runtime as it plays today | %s |" % clock(total))
    w("| Voice clips regenerated for this | **none** |")
    w("")
    reused = {k: v for k, v in sorted(uses.items()) if v > 1}
    if reused:
        w("Events outnumber assets because sounds are reused: %s."
          % ", ".join("`%s` x%d" % (k, v) for k, v in reused.items()))
        w("")
    w("## How to read the anchor column")
    w("")
    w("**Timestamps are for your ear only and are not the synchronisation mechanism.** A")
    w("cue is anchored to a voice segment's clip identity plus which occurrence of that")
    w("clip it is, so regenerating a voice clip or inserting a paragraph moves the clock")
    w("and moves nothing about the cue sheet. The times below were measured from the")
    w("clips as they stand today and drift the moment any voice is recast.")
    w("")
    w("`before` plays in the gap ahead of the line, `after` in the gap behind it,")
    w("`during +Nms` starts N milliseconds into the line. A sustained cue runs from its")
    w("anchor to its stop anchor and loops underneath.")
    w("")
    w("## Cues")
    w("")
    for c in cues:
        seg = by_order[c["order"]]
        asset = sreg.get(c["asset"]) or {}
        occurrences = [x["order"] for x in manifest["segments"]
                       if x["clipId"] == seg["clipId"]]
        w("### `%s`" % c["cueId"])
        w("")
        w("| | |")
        w("|---|---|")
        w("| Asset | `%s` |" % c["asset"])
        w("| Category | %s (%s layer) |" % (c["category"], c["layer"]))
        w("| Anchor | segment order %d · clip `%s` · occurrence %d |"
          % (c["order"], seg["clipId"], occurrences.index(c["order"]) + 1))
        w("| Timing | %s |" % (c["timing"] +
                               (" +%dms" % c["offsetMs"] if c.get("offsetMs") else "")))
        if c.get("stopOrder") is not None:
            w("| Sustain | loops to segment order %d |" % c["stopOrder"])
        w("| Gain | %.2f |" % c["gain"])
        if c.get("fadeInMs") or c.get("fadeOutMs"):
            w("| Fades | in %sms · out %sms |"
              % (c.get("fadeInMs", "-"), c.get("fadeOutMs", "-")))
        w("| Duration requested | %ss%s |"
          % (asset.get("durationSeconds"), ", looping" if asset.get("loop") else ""))
        w("| Reusable in Godot | %s |" % ("yes" if asset.get("godotReuse") else "no"))
        w("| Approx. review time | ~%s |" % clock(at[c["order"]]))
        w("")
        w("**Manuscript:** %s — “%s”" % (seg["speakerName"], seg["displayText"]))
        w("")
        w("**Why:** %s" % c.get("why", ""))
        w("")
        w("**Prompt:** `%s`" % asset.get("prompt", "(hand-supplied asset; no prompt)"))
        w("")
    w("## Unique assets")
    w("")
    w("| Asset | Category | Loop | Secs | Events | Godot | State |")
    w("|---|---|---|---|---|---|---|")
    for aid in sorted(uses):
        asset = sreg.get(aid) or {}
        plan = sfxmod.plan_asset(sreg, aid)
        w("| `%s` | %s | %s | %s | %d | %s | %s |"
          % (aid, asset.get("category"), "yes" if asset.get("loop") else "no",
             asset.get("durationSeconds"), uses[aid],
             "yes" if asset.get("godotReuse") else "no",
             "cached" if plan["cached"] else "to generate"))
    w("")
    godot = [a for a in uses if (sreg.get(a) or {}).get("godotReuse")]
    w("%d of %d are reusable in Godot. The game decides when each one plays; this cue"
      % (len(godot), len(uses)))
    w("sheet only decides when the audiobook plays it.")
    w("")

    path = os.path.join(OUT_DIR, "CHAPTER_%02d_CUE_SHEET.md" % number)
    os.makedirs(OUT_DIR, exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write("\n".join(out))
    return cache.rel(path), len(cues), len(uses)


def main(argv):
    reg = Registry()
    sreg = sfxmod.SfxRegistry(config=reg.config)
    numbers = [int(a) for a in argv] or sorted(
        n for n in mf.chapter_files() if sfxmod.load_cues(n).get("cues"))
    if not numbers:
        print("No chapter has a cue sheet yet.")
        return 0
    for n in numbers:
        path, events, assets = render(n, reg, sreg)
        print("wrote %s  (%d events, %d unique assets)" % (path, events, assets))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
