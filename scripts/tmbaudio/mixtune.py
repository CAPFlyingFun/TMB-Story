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
"""

import json
import math
import os

from . import cache, sfx as sfxmod
from .registry import ROOT

# Where each kind of sound sits, in dBFS RMS, with speech at about -22. Overridable
# from audio/config.json's mix.categoryTargetDbfs.
DEFAULT_TARGETS = {
    "ambience": -46.0,     # a bed you notice when the voice stops, not during it
    "alarm": -40.0,        # present and threatening, never fighting the narrator
    "system": -38.0,
    "interface": -38.0,
    "foley": -40.0,
}

GAIN_FLOOR, GAIN_CEILING = 0.01, 1.0


def targets(sreg):
    out = dict(DEFAULT_TARGETS)
    out.update({k: float(v) for k, v in (sreg.mix().get("categoryTargetDbfs") or {}).items()
                if not str(k).startswith("_")})
    return out


def asset_level(sreg, asset_id):
    """The level the FILE has right now, and where that reading came from.

    The normalised result outranks the registry's reading, because it is what the
    player and the export will actually pull off disk. Falling back to the registry
    covers the assets normalisation left alone for being loud enough already.
    """
    audio_path, sidecar_path = sfxmod.asset_paths(sreg, asset_id)
    side = cache.read_sidecar(os.path.join(ROOT, sidecar_path)) or {}
    norm = side.get("normalize") or {}
    if norm.get("resultRmsDbfs") is not None:
        return float(norm["resultRmsDbfs"]), "normalised"
    # A supplied file is measured, never normalised: its bytes are its identity.
    supplied = side.get("measured") or {}
    if supplied.get("rmsDbfs") is not None:
        return float(supplied["rmsDbfs"]), "supplied, measured"
    measured = (sreg.get(asset_id) or {}).get("measured") or {}
    if measured.get("rmsDbfs") is not None:
        return float(measured["rmsDbfs"]), "measured"
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
               "was": cue.get("gain"), "levelDbfs": level, "origin": origin,
               "emphasisDb": float(cue.get("emphasisDb") or 0.0)}
        if level is None or category is None:
            row["now"] = cue.get("gain")
            row["note"] = "no measurement; left alone"
        else:
            target = tbl.get(category, -40.0)
            row["now"] = gain_for(level, target, row["emphasisDb"])
            row["targetDbfs"] = round(target + row["emphasisDb"], 1)
            row["effectiveDbfs"] = round(level + 20.0 * math.log10(row["now"]), 1)
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
    log("Category targets, dBFS RMS (speech runs about -22): "
        + ", ".join("%s %.0f" % (k, tbl[k]) for k in sorted(tbl)))
    total = 0
    for n in numbers:
        doc, rows = plan_chapter(n, sreg)
        moved = [r for r in rows if r["now"] != r["was"]]
        log("\nChapter %d: %d cue(s), %d gain(s) change." % (n, len(rows), len(moved)))
        for r in rows:
            if r["now"] == r["was"] and not r["note"]:
                continue
            log("  %-28s %-28s %5s -> %-6s  asset %s dBFS -> mix %s dBFS  %s"
                % (r["cueId"], r["asset"], r["was"], r["now"],
                   r["levelDbfs"], r.get("effectiveDbfs"), r["note"]))
        if not dry_run:
            total += apply_chapter(n, doc, rows)
    if dry_run:
        log("\nDry run. No cue sheet was written.")
    else:
        log("\n%d cue gain(s) rewritten across %d chapter(s)." % (total, len(numbers)))
    return total
