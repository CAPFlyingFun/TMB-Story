"""Derive every cue's gain from the level the asset actually has.

Joshua, after the first normalised build: "The SFX and ambient noise I am hearing on
the Repo as super loud." He is right, and it is the predictable consequence of doing
half the job: normalising raised sixteen assets by 1 to 27 dB and the cue gains were
left where they were -- and several of those had been pushed to 0.85 precisely BECAUSE
the asset used to be near-silent. A 0.85 on a rescued file is a siren at speech level.

So gains stop being hand-set numbers that drift out of date, and become a calculation:

    gain = 10 ^ ((categoryTarget + emphasisDb - assetRmsDbfs) / 20)

`categoryTarget` is where a sound of that kind should sit against speech, which runs
about -22 dBFS in these chapters. `assetRmsDbfs` is MEASURED, not assumed -- the
normalised result where there is one, the decoded reading otherwise. And `emphasisDb`
is the one hand-written number left: a per-cue nudge for the moments the manuscript
actually wants loud, kept in the cue sheet where a person can see it.

The point is that a gain now survives its asset changing. Re-run this after any
generation or normalisation and every cue lands where it is supposed to, instead of
carrying a rescue attempt for a file that no longer needs rescuing.

THE LEVEL IS MEASURED IN LUFS, NOT RMS, AND THAT IS THE CORRECTION THIS FILE EXISTS
TO RECORD. Joshua, 2026-09-19: "The first alarm sound in the first chapter is louder
than the narrator's voice... can't hear him talking." He was right again, and the
cue sheet said the opposite -- that alarm was placed at -39.1 dBFS against narration
at -20.9, seventeen decibels down, and measuring what actually comes out of the file
says why it did not sound like it: the alarm reads -5.6 LUFS where its RMS reads
-11.5, so it arrives nearly SIX DECIBELS louder than the number the mix was built on.

That error is not uniform, which is what made it so hard to chase by ear. Measured
across the whole asset set, RMS minus LUFS runs from +5.6 (a deep vibration, which
RMS calls louder than it is) to -13.1 (an alert sting, which RMS calls quieter), an
18.7 dB spread. For SPEECH the two agree within a decibel -- and speech is the
reference, which is exactly why placing effects by RMS against it looked like it was
working while every alert, notify tone and alarm in the set sat up to 13 dB hot.

Every "still too loud" round this project has had was chasing that. So the placement
now uses BS.1770 integrated loudness, which is what the ear does: K-weighted for the
head and outer ear, and gated so the silence between hits is not averaged in.

Normalisation still targets RMS and peak, and that is not an inconsistency. Making a
file use its bit depth is a question about samples; deciding how loud it is against a
voice is a question about hearing. Two jobs, two measures, both written down in the
sidecar.
"""

import json
import math
import os

from . import cache, sfx as sfxmod
from .registry import ROOT

# Where each kind of sound sits, in LUFS, with the narration at about -20. Overridable
# from audio/config.json's mix.categoryTargetLufs.
DEFAULT_TARGETS = {
    "ambience": -58.0,     # a bed you notice when the voice stops, not during it
    "alarm": -45.1,        # present and threatening, never fighting the narrator
    "system": -45.1,
    "interface": -45.1,
    "foley": -47.1,
}

# The narration's own integrated loudness, measured from the combined chapter-01 voice
# export: -19.8 LUFS, with individual narrator clips at -20.7. Not a setting -- it is
# recorded so a target can be read as "so many dB under the voice" without re-deriving
# it, and so a future re-cast that changes it is noticed rather than absorbed.
SPEECH_LUFS = -20.0

# The floor is 0.002, not 0.01, because 0.01 turned out to BIND. A procedural siren
# asked to sit 18 dB below its category needs about 0.007, and clamping that to 0.01
# quietly delivered a sound 3 dB louder than the cue sheet says. A floor should catch
# an absurd number, not a deliberate one.
GAIN_FLOOR, GAIN_CEILING = 0.002, 1.0


def targets(sreg):
    """The LUFS table, falling back to the older dBFS one where it has no entry.

    The fallback is deliberate rather than tidy: the two tables carry the same numbers
    today, so a category that has not been moved to the new block yet still lands
    where it did, and the only thing that changes for it is the MEASURE.
    """
    mix = sreg.mix()
    out = dict(DEFAULT_TARGETS)
    for block in ("categoryTargetDbfs", "categoryTargetLufs"):
        out.update({k: float(v) for k, v in (mix.get(block) or {}).items()
                    if not str(k).startswith("_")})
    return out


def asset_level(sreg, asset_id):
    """The loudness the FILE has right now, and where that reading came from.

    Two orderings at once, and both matter.

    FRESHEST FIRST: the normalised result outranks the sidecar's plain measurement,
    which outranks the registry's, because the later reading is of the file the player
    and the export will actually pull off disk.

    LOUDNESS BEFORE RMS at each of those steps: `lufs` is the number the mix is
    placed by. RMS is kept as a fallback for an asset measured before loudness was
    recorded, and the origin SAYS SO -- "measured, rms fallback" -- because a gain
    derived from RMS is the thing that has been getting this wrong, and it should be
    visible in the retune report rather than silently mixed in with the rest.
    """
    audio_path, sidecar_path = sfxmod.asset_paths(sreg, asset_id)
    side = cache.read_sidecar(os.path.join(ROOT, sidecar_path)) or {}
    registry = (sreg.get(asset_id) or {}).get("measured") or {}
    # A supplied file is measured, never normalised: its bytes are its identity.
    sources = [
        (side.get("normalize") or {}, "normalised", "resultLufs", "resultRmsDbfs"),
        (side.get("measured") or {}, "measured", "lufs", "rmsDbfs"),
        (registry, "registry", "lufs", "rmsDbfs"),
    ]
    for block, name, lufs_key, rms_key in sources:
        if block.get(lufs_key) is not None:
            return float(block[lufs_key]), name
    for block, name, _lufs_key, rms_key in sources:
        if block.get(rms_key) is not None:
            return float(block[rms_key]), name + ", rms fallback"
    return None, "unmeasured"


def gain_for(level_db, target_db, emphasis_db=0.0):
    want = target_db + float(emphasis_db or 0.0)
    gain = 10.0 ** ((want - level_db) / 20.0)
    return round(max(GAIN_FLOOR, min(GAIN_CEILING, gain)), 3)


def plan_chapter(number, sreg):
    """What each cue's gain would become. Reads the cue sheet; writes nothing."""
    doc = sfxmod.load_cues(number)
    tbl = targets(sreg)
    rows = []
    for cue in doc.get("cues") or []:
        aid = cue.get("asset")
        level, origin = asset_level(sreg, aid)
        category = sreg.category(aid) if sreg.get(aid) else None
        row = {"cueId": cue.get("cueId"), "asset": aid, "category": category,
               "was": cue.get("gain"), "levelLufs": level, "origin": origin,
               "emphasisDb": float(cue.get("emphasisDb") or 0.0)}
        if level is None or category is None:
            row["now"] = cue.get("gain")
            row["note"] = "no measurement; left alone"
        else:
            target = tbl.get(category, -40.0)
            row["now"] = gain_for(level, target, row["emphasisDb"])
            row["targetLufs"] = round(target + row["emphasisDb"], 1)
            row["effectiveLufs"] = round(level + 20.0 * math.log10(row["now"]), 1)
            if row["now"] >= GAIN_CEILING:
                row["note"] = "at the ceiling: the asset is too quiet to reach its target"
            elif row["now"] <= GAIN_FLOOR:
                row["note"] = "at the floor: the asset is far louder than its target"
            else:
                row["note"] = ""
        rows.append(row)
    return doc, rows


def apply_chapter(number, doc, rows):
    by_id = {r["cueId"]: r for r in rows}
    changed = 0
    for cue in doc.get("cues") or []:
        row = by_id.get(cue.get("cueId"))
        if row and row["now"] is not None and row["now"] != cue.get("gain"):
            cue["gain"] = row["now"]
            changed += 1
    path = os.path.join(ROOT, "audio", "cues", "chapter-%02d.json" % number)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(doc, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
    return changed


def retune(numbers, sreg, dry_run=False, log=print):
    tbl = targets(sreg)
    log("Category targets, LUFS (the narration runs about %.0f): " % SPEECH_LUFS
        + ", ".join("%s %.0f" % (k, tbl[k]) for k in sorted(tbl)))
    total = 0
    for n in numbers:
        doc, rows = plan_chapter(n, sreg)
        moved = [r for r in rows if r["now"] != r["was"]]
        log("\nChapter %d: %d cue(s), %d gain(s) change." % (n, len(rows), len(moved)))
        for r in rows:
            if r["now"] == r["was"] and not r["note"]:
                continue
            log("  %-28s %-28s %5s -> %-6s  asset %s -> mix %s LUFS (%s)  %s"
                % (r["cueId"], r["asset"], r["was"], r["now"],
                   r["levelLufs"], r.get("effectiveLufs"), r["origin"], r["note"]))
        if not dry_run:
            total += apply_chapter(n, doc, rows)
    if dry_run:
        log("\nDry run. No cue sheet was written.")
    else:
        log("\n%d cue gain(s) rewritten across %d chapter(s)." % (total, len(numbers)))
    return total
