"""Sound effects and ambience: the asset registry, the cue sheet and their cache.

The voice pipeline already separates two ideas, and this module reuses both rather
than inventing a parallel system:

1. IDENTITY is content, not position. A voice clip is identified by its speaker and
   its text, so `chair_roll_fast` is likewise identified by its NAME and nothing else.
   The same asset serves Chapter 1, Chapter 27 and the Godot game.
2. FINGERPRINT is everything that would change the generated audio. For a voice clip
   that is the text plus the voice; for a sound effect it is the prompt, the requested
   duration, the loop flag, the prompt influence, the provider, the output format and
   the asset version. If the file exists and the fingerprint matches, generation is
   skipped, so an approved sound is never paid for twice.

WHERE a sound plays is a separate document. `audio/cues/chapter-NN.json` holds cues;
each cue names an asset and an ANCHOR. Assets never belong to playback positions.

ANCHORS ARE NOT TIMESTAMPS. A cue points at a voice segment by its clipId plus which
occurrence of that clip it is, because a clipId can legitimately appear twice in one
chapter ("Yep." and "Request denied." both do). Regenerating a voice clip changes its
length but not its identity, so the cue survives; inserting a paragraph shifts every
absolute time but no anchor. Timestamps are computed for human review only.

Nothing here reads the API key or touches the network.
"""

import hashlib
import json
import os

from .registry import ROOT

SFX_REGISTRY_PATH = os.path.join(ROOT, "audio", "sfx-registry.json")
CUES_DIR = os.path.join(ROOT, "audio", "cues")
SFX_DIR = os.path.join(ROOT, "audio", "sfx")

CATEGORIES = ("ambience", "foley", "interface", "alarm", "system")

# Which user-facing toggle a category answers to. Ambience is its own switch; everything
# else is "sound effects". An alarm that loops is still an effect, not room tone, so
# turning ambience off must not silence it -- which is why the layer comes from the
# CATEGORY and not from whether the asset happens to loop.
LAYER_FOR_CATEGORY = {
    "ambience": "ambience",
    "foley": "sfx",
    "interface": "sfx",
    "alarm": "sfx",
    "system": "sfx",
}

TIMINGS = ("before", "during", "after")
SOURCES = ("generated", "supplied")


def _read_json(path):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def normalize_prompt(text):
    """Whitespace-insensitive so reflowing a prompt does not invalidate the audio."""
    return " ".join(str(text or "").split())


class SfxRegistry:
    """Assets and the character footstep profiles. Never invents an asset."""

    def __init__(self, data=None, config=None):
        self.data = data if data is not None else _read_json(SFX_REGISTRY_PATH)
        self.config = config or {}
        self.assets = {
            k: v for k, v in (self.data.get("assets") or {}).items()
            if not k.startswith("_")
        }

    # -- assets -------------------------------------------------------------
    def get(self, asset_id):
        return self.assets.get(asset_id)

    def category(self, asset_id):
        a = self.get(asset_id)
        return (a or {}).get("category", "sfx")

    def layer(self, asset_id):
        return LAYER_FOR_CATEGORY.get(self.category(asset_id), "sfx")

    def loops(self, asset_id):
        return bool((self.get(asset_id) or {}).get("loop"))

    def source(self, asset_id):
        return (self.get(asset_id) or {}).get("source", "generated")

    def is_generated(self, asset_id):
        return self.source(asset_id) == "generated"

    def exports_to_game(self, asset_id):
        return bool((self.get(asset_id) or {}).get("godotReuse"))

    def sfx_version(self):
        return self.data.get("sfxVersion", 1)

    def character_profile(self, speaker_id):
        return (self.data.get("characters") or {}).get(speaker_id) or {}

    # -- generation settings ------------------------------------------------
    def block(self):
        return self.config.get("sfx") or {}

    def provider(self):
        return self.block().get("provider", "elevenlabs-sfx")

    def model(self):
        """May be None on purpose: see audio/config.json. An unset model means the
        provider's own default, which is preferable to inventing a model id."""
        return self.block().get("model")

    def output_format(self):
        return self.block().get("outputFormat", "mp3_44100_128")

    def default_prompt_influence(self):
        return self.block().get("defaultPromptInfluence", 0.3)

    def duration_limits(self):
        lim = self.block().get("durationLimitsSeconds") or {}
        return float(lim.get("min", 0.5)), float(lim.get("max", 20))

    def prompt_limit(self):
        """Measured, not documented: see the note in audio/config.json."""
        return int(self.block().get("promptMaxCharacters", 400))

    def generation(self):
        return self.block().get("generation") or {}

    # -- mix ----------------------------------------------------------------
    def mix(self):
        return {k: v for k, v in (self.config.get("mix") or {}).items()
                if not k.startswith("_")}

    def category_gain(self, asset_id):
        return (self.mix().get("categoryGain") or {}).get(self.category(asset_id), 0.4)

    def resolved_gain(self, asset_id, cue_gain):
        """A cue's own gain wins; otherwise the category default. Neither is final art."""
        return float(cue_gain) if cue_gain is not None else float(self.category_gain(asset_id))


# ---- fingerprints and paths ------------------------------------------------
def fingerprint(asset, provider, model, output_format, sfx_version):
    """Everything that could materially change the generated audio, and nothing else.

    Deliberately excluded: the asset's category, notes, godotReuse flag and approval
    state. Re-categorising a sound or writing a better note is not a reason to pay for
    it again.
    """
    payload = json.dumps({
        "prompt": normalize_prompt(asset.get("prompt")),
        "durationSeconds": asset.get("durationSeconds"),
        "loop": bool(asset.get("loop")),
        "promptInfluence": asset.get("promptInfluence"),
        "provider": provider,
        "model": model,
        "outputFormat": output_format,
        "assetVersion": asset.get("assetVersion", 1),
        "sfxVersion": sfx_version,
    }, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def content_fingerprint(path):
    """For a hand-supplied asset there is no prompt, so the file's own bytes are its
    identity. Replacing the file is then visible to validation, and generation still
    never runs for it."""
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for block in iter(lambda: fh.read(65536), b""):
            h.update(block)
    return "supplied:" + h.hexdigest()


def asset_paths(registry, asset_id):
    """Grouped by category, never by chapter -- the same reason clips group by speaker.
    A chapter folder would duplicate a reused sound and break the reuse it exists for."""
    directory = os.path.join(SFX_DIR, registry.category(asset_id))
    return (
        os.path.join(directory, asset_id + ".mp3"),
        os.path.join(directory, asset_id + ".json"),
    )


def plan_asset(registry, asset_id):
    """Attach generation-relevant fields to one asset. No network, no secret."""
    from . import cache
    asset = registry.get(asset_id)
    if asset is None:
        raise KeyError(asset_id)
    audio_path, sidecar_path = asset_paths(registry, asset_id)
    if registry.is_generated(asset_id):
        fp = fingerprint(asset, registry.provider(), registry.model(),
                         registry.output_format(), registry.sfx_version())
    else:
        fp = content_fingerprint(audio_path) if os.path.isfile(audio_path) else None
    return {
        "asset": asset_id,
        "category": registry.category(asset_id),
        "layer": registry.layer(asset_id),
        "source": registry.source(asset_id),
        "loop": registry.loops(asset_id),
        "prompt": asset.get("prompt"),
        "durationSeconds": asset.get("durationSeconds"),
        "promptInfluence": asset.get("promptInfluence", registry.default_prompt_influence()),
        "assetVersion": asset.get("assetVersion", 1),
        "provider": registry.provider(),
        "model": registry.model(),
        "outputFormat": registry.output_format(),
        "fingerprint": fp,
        "audio": cache.rel(audio_path),
        "cached": bool(fp) and cache.is_cached(audio_path, sidecar_path, fp),
        "godotReuse": registry.exports_to_game(asset_id),
    }


# ---- cue sheets ------------------------------------------------------------
def cue_path(number):
    return os.path.join(CUES_DIR, "chapter-%02d.json" % number)


def load_cues(number):
    path = cue_path(number)
    if not os.path.isfile(path):
        return {"chapter": number, "cues": []}
    data = _read_json(path)
    data["cues"] = [c for c in (data.get("cues") or []) if not str(c.get("cueId", "")).startswith("_")]
    return data


def _occurrence_index(segments):
    """clipId -> [order, order, ...] in playback order, so an anchor can say WHICH one."""
    index = {}
    for seg in segments:
        index.setdefault(seg["clipId"], []).append(seg["order"])
    return index


def resolve_anchor(anchor, index, segments):
    """An anchor to a segment order, or None when it cannot be resolved.

    `chapterEnd` is allowed for a sustained bed that runs to the end of the chapter.
    """
    if anchor == "chapterEnd":
        return segments[-1]["order"] if segments else None
    if not isinstance(anchor, dict):
        return None
    orders = index.get(anchor.get("clipId")) or []
    occurrence = int(anchor.get("occurrence", 1))
    if occurrence < 1 or occurrence > len(orders):
        return None
    return orders[occurrence - 1]


def validate_cue(cue, registry, resolved_order, stop_order):
    """Every reason a cue is not playable, as plain sentences. Empty list means fine."""
    problems = []
    asset_id = cue.get("asset")
    if not registry.get(asset_id):
        problems.append("unknown asset %r; add it to audio/sfx-registry.json rather "
                        "than inventing one at the cue" % asset_id)
    timing = cue.get("timing", "before")
    if timing not in TIMINGS:
        problems.append("timing %r is not one of %s" % (timing, ", ".join(TIMINGS)))
    gain = cue.get("gain")
    if gain is not None:
        try:
            g = float(gain)
        except (TypeError, ValueError):
            problems.append("gain %r is not a number" % (gain,))
        else:
            if not 0.0 <= g <= 1.0:
                problems.append("gain %s is outside 0.0-1.0" % g)
    for key in ("fadeInMs", "fadeOutMs", "offsetMs"):
        if cue.get(key) is not None and float(cue[key]) < 0:
            problems.append("%s must not be negative" % key)
    if resolved_order is None:
        problems.append("anchor does not resolve to a segment in this chapter")
    problems.extend(credit_problems(registry, asset_id))
    sustain = cue.get("sustain")
    if sustain is not None:
        if stop_order is None:
            problems.append("sustain.until does not resolve to a segment in this chapter")
        elif resolved_order is not None and stop_order < resolved_order:
            problems.append("sustain.until resolves before the cue starts")
        elif registry.get(asset_id) and not registry.loops(asset_id):
            # THE CHECK RUNS THIS WAY ROUND, and it used to run the other way: it used
            # to insist that a loopable asset be given a sustain, which is what walked
            # me into the bug. amb_tombs_array_power_rise is a 20-second RISE marked
            # loop; the rule required it to be a bed; a bed loops; so it climbed,
            # snapped back and climbed again every 20 seconds under two whole chapters.
            #
            # `loop` on an ASSET means the file is built to be looped. Whether a CUE
            # uses it as a bed is the cue's decision, and using a loopable file once is
            # always safe. Sustaining a file that was NOT built to loop is the thing
            # that actually sounds wrong, so that is what is flagged.
            problems.append("%s is not built to loop, so sustaining it will repeat a "
                            "file with an audible seam; either drop the sustain or give "
                            "the cue an asset made to loop" % asset_id)
    return problems


CREDIT_FIELDS = ("title", "author", "source", "license")


def credit_problems(registry, asset_id):
    """A hand-supplied file MUST say where it came from.

    Joshua, 2026-09-18, sending the first one: "we need to keep track of who does it
    for attribution." A credit written down once, next to the file, in the same place
    the pipeline already reads -- rather than in someone's memory or a chat message
    that scrolls away. Generated assets need no credit; their prompt is their
    provenance.
    """
    asset = registry.get(asset_id) or {}
    if asset.get("source") != "supplied":
        return []
    credit = asset.get("credit") or {}
    missing = [f for f in CREDIT_FIELDS if not str(credit.get(f) or "").strip()]
    if missing:
        return ["supplied file with no %s in its credit block; a file we did not make "
                "does not go in without one" % ", ".join(missing)]
    return []


def credits(registry):
    """Every supplied asset's attribution, sorted, for the generated credits page."""
    out = []
    for aid in sorted(registry.assets):
        asset = registry.get(aid) or {}
        if asset.get("source") != "supplied":
            continue
        c = dict(asset.get("credit") or {})
        c["asset"] = aid
        c["category"] = registry.category(aid)
        out.append(c)
    return out


def resolve_chapter_cues(segments, cue_doc, registry):
    """Cues with their anchors resolved to orders and their assets planned.

    Returns (resolved, problems). A cue that cannot be resolved is reported and left
    out rather than guessed at, and it never blocks the voice track.
    """
    index = _occurrence_index(segments)
    resolved, problems = [], []
    for cue in cue_doc.get("cues") or []:
        order = resolve_anchor(cue.get("anchor"), index, segments)
        sustain = cue.get("sustain") or None
        stop_order = resolve_anchor(sustain.get("until"), index, segments) if sustain else None
        bad = validate_cue(cue, registry, order, stop_order)
        if bad:
            problems.append({"cueId": cue.get("cueId"), "problems": bad})
            continue
        asset_id = cue["asset"]
        plan = plan_asset(registry, asset_id)
        entry = {
            "cueId": cue["cueId"],
            "asset": asset_id,
            "category": plan["category"],
            "layer": plan["layer"],
            "timing": cue.get("timing", "before"),
            "order": order,
            "gain": registry.resolved_gain(asset_id, cue.get("gain")),
            "loop": plan["loop"],
            "audio": plan["audio"],
            "cached": plan["cached"],
            "why": cue.get("why", ""),
        }
        if cue.get("offsetMs") is not None:
            entry["offsetMs"] = int(cue["offsetMs"])
        for key in ("fadeInMs", "fadeOutMs"):
            if cue.get(key) is not None:
                entry[key] = int(cue[key])
        if sustain:
            entry["stopOrder"] = stop_order
            entry["stopTiming"] = sustain.get("timing", "after")
        resolved.append(entry)
    resolved.sort(key=lambda c: (c["order"], c["cueId"]))
    return resolved, problems


def summarize_chapter(resolved, problems, registry):
    """Counts the cue sheet's shape and what still has to be generated."""
    assets = sorted({c["asset"] for c in resolved})
    to_generate = sorted({
        c["asset"] for c in resolved
        if not c["cached"] and registry.is_generated(c["asset"])
    })
    missing_supplied = sorted({
        c["asset"] for c in resolved
        if not c["cached"] and not registry.is_generated(c["asset"])
    })
    by_category = {}
    for c in resolved:
        by_category[c["category"]] = by_category.get(c["category"], 0) + 1
    reuse = {}
    for c in resolved:
        reuse[c["asset"]] = reuse.get(c["asset"], 0) + 1
    return {
        "events": len(resolved),
        "uniqueAssets": len(assets),
        "assets": assets,
        "byCategory": by_category,
        "reusedAssets": {k: v for k, v in sorted(reuse.items()) if v > 1},
        "toGenerate": to_generate,
        "missingSupplied": missing_supplied,
        "problems": problems,
        "ready": not problems,
    }


def game_export(numbers, registry):
    """Approved effects the game can reuse, pointing at the audiobook's own files.

    WHEN a sound plays is not exported. The audiobook's cue sheet decides that for
    narration; Godot decides it from gameplay. Only the asset is shared.
    """
    used = {}
    for n in numbers:
        for cue in load_cues(n).get("cues") or []:
            aid = cue.get("asset")
            if registry.get(aid) and registry.exports_to_game(aid):
                used.setdefault(aid, set()).add(n)
    assets = []
    for aid in sorted(used):
        plan = plan_asset(registry, aid)
        asset = registry.get(aid)
        assets.append({
            "assetId": aid,
            "category": plan["category"],
            "loop": plan["loop"],
            "audio": plan["audio"],
            "durationSeconds": plan["durationSeconds"],
            "source": plan["source"],
            "generated": plan["cached"],
            "suggestedGain": registry.category_gain(aid),
            "description": asset.get("notes", ""),
            "chapters": sorted(used[aid]),
        })
    return {
        "_comment": (
            "Canonical sound assets the game may reuse. `audio` points at the same file "
            "the audiobook plays: one generated effect, used in both places, never a "
            "second copy for Godot. Playback timing is NOT exported -- the audiobook's "
            "cue sheet times these against narration, and the game times them against "
            "gameplay. `generated` false means the asset is approved but not yet made."
        ),
        "assetCount": len(assets),
        "assets": assets,
    }
