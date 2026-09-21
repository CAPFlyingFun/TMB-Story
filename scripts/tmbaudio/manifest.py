"""Chapter manifest building, validation and the Godot dialogue export."""

import hashlib
import json
import os
import re

from . import cache
from . import sfx as sfxmod
from .parse import parse_chapter
from .registry import NARRATOR, REVIEW, ROOT, SYSTEM

CHAPTERS_DIR = os.path.join(ROOT, "chapters")
MANIFEST_DIR = os.path.join(ROOT, "audio", "manifests")
OVERRIDES_PATH = os.path.join(ROOT, "audio", "speaker-overrides.json")


def load_overrides():
    if not os.path.isfile(OVERRIDES_PATH):
        return {}
    with open(OVERRIDES_PATH, encoding="utf-8") as fh:
        data = json.load(fh)
    return {k: v for k, v in (data.get("clips") or {}).items() if not k.startswith("_")}


def chapter_files():
    """Every chapter manuscript, as {number: path}."""
    out = {}
    if not os.path.isdir(CHAPTERS_DIR):
        return out
    for movement in sorted(os.listdir(CHAPTERS_DIR)):
        d = os.path.join(CHAPTERS_DIR, movement)
        if not os.path.isdir(d):
            continue
        for name in sorted(os.listdir(d)):
            m = re.fullmatch(r"chapter-(\d{4})\.md", name)
            if m:
                out[int(m.group(1))] = os.path.join(d, name)
    return out


def _pause_for(prev, seg, pauses):
    if prev is None:
        return 0
    a, b = prev["speaker"], seg["speaker"]
    if a == SYSTEM or b == SYSTEM:
        return pauses.get("system-any", pauses.get("default", 300))
    if a == NARRATOR and b == NARRATOR:
        return pauses.get("narration-narration", pauses.get("default", 300))
    if a == NARRATOR:
        return pauses.get("narration-dialogue", pauses.get("default", 300))
    if b == NARRATOR:
        return pauses.get("dialogue-narration", pauses.get("default", 300))
    if a == b:
        return pauses.get("dialogue-sameSpeaker", pauses.get("default", 300))
    return pauses.get("dialogue-differentSpeaker", pauses.get("default", 300))


EXPORT_DIR = os.path.join(ROOT, "audio", "exports")


def timeline(segments):
    """Where every segment starts and ends, in seconds: pause first, then the clip.

    ONE PIECE OF ARITHMETIC, THREE CONSUMERS. The player uses it to know which line is
    being spoken, the mixed export uses it to place a cue, and the voice-only export
    uses it to size the silence it splices in. They agreed by accident before, because
    each did the same sum separately; they agree by construction now.

    A clip that has not been generated contributes nothing, which is why the caller
    asks whether the timeline is COMPLETE before trusting it to address a file.
    """
    starts, ends = {}, {}
    t = 0.0
    for seg in segments:
        t += (seg.get("pauseBeforeMs") or 0) / 1000.0
        starts[seg["order"]] = t
        t += cache.mp3_duration_seconds(os.path.join(ROOT, seg["audio"]))
        ends[seg["order"]] = t
    return starts, ends, t


def _content_hash(path):
    """Twelve hex characters of the file's sha256. The page's cache key.

    IT USED TO BE THE FILE'S SIZE, and that was very nearly a silent disaster. When
    Chapter 3's opening bed changed from a night ambience to the TOMBS array -- a
    completely different four minutes of sound -- the file went from 7,231,470 bytes to
    7,231,469. ONE BYTE. It happened to be enough, and it happened to be luck: at a
    fixed bitrate an mp3's size is set by its duration, so two mixes of the same
    chapter are nearly always within a few bytes and can trivially be identical.

    An identical size means an identical URL, which means a phone that has played the
    chapter once goes on playing the old mix forever, with nothing anywhere to say so.
    The listener hears a change that was never made and the repository looks correct.
    A hash cannot do that.
    """
    digest = hashlib.sha256()
    with open(path, "rb") as fh:
        for block in iter(lambda: fh.read(1 << 20), b""):
            digest.update(block)
    return digest.hexdigest()[:12]


def _export(number, suffix):
    rel = os.path.join("audio", "exports", "chapter-%02d%s.mp3" % (number, suffix))
    full = os.path.join(ROOT, rel)
    if not os.path.isfile(full):
        return None
    return {"audio": rel.replace(os.sep, "/"),
            "bytes": os.path.getsize(full),
            "hash": _content_hash(full),
            "seconds": round(cache.mp3_duration_seconds(full), 2)}


def attach_timeline(manifest):
    """Stamp each segment with its place in the chapter, and list the whole-chapter
    files that exist.

    This is what lets the page play ONE file per chapter instead of a hundred and
    eighty-five. A single element has no clip-to-clip handover to get wrong, no gap to
    time, and the mix is already in the samples -- so a chapter sounds the same on the
    page as it does in the file, which is the thing that kept not being true.

    `complete` is the honest part: the offsets only address a real position in an
    export if every clip they are summed from exists. When one is missing the player
    is told so and falls back to playing the clips.
    """
    segments = manifest["segments"]
    missing = [s["audio"] for s in segments
               if not os.path.isfile(os.path.join(ROOT, s["audio"]))]
    starts, ends, total = timeline(segments)
    for seg in segments:
        seg["startMs"] = int(round(starts[seg["order"]] * 1000))
        seg["endMs"] = int(round(ends[seg["order"]] * 1000))
    manifest["timeline"] = {
        "totalMs": int(round(total * 1000)),
        "complete": not missing,
        "missingClips": len(missing),
        "source": "each segment's pause then its clip; the same sum the exports are built with",
    }
    # EACH EXPORT CARRIES ITS OWN INDEX, because the two files are built differently
    # and only one of them matches the arithmetic. The mixed file places every clip
    # with `adelay` at exactly these offsets, so it is exact by construction. The
    # voice-only file is an mp3 `-c copy` join, which keeps each clip's encoder
    # padding and so runs progressively late; `combine` measures what it actually
    # produced and that measurement is what goes here. An export with no usable index
    # is still listed and still plays -- the page just does not claim to know which
    # line is sounding.
    canonical = [seg["startMs"] for seg in segments]
    exports = {}
    mixed = _export(manifest["chapter"], "-drama")
    voice = _export(manifest["chapter"], "")
    if mixed:
        mixed["layers"] = ["voice", "ambience", "sfx"]
        mixed["startMs"] = canonical if manifest["timeline"]["complete"] else None
        mixed["indexSource"] = "the manifest timeline, which the mix is built from"
        exports["mixed"] = mixed
    if voice:
        voice["layers"] = ["voice"]
        voice["startMs"] = None
        voice["indexSource"] = (
            "none: an mp3 -c copy join cannot be addressed by the arithmetic, and "
            "summing the parts overstates it because the demuxer applies each clip's "
            "gapless padding. Measured, chapter one runs 3.2 s longer than the sum "
            "says while a part-by-part index drifts 12 s -- so this file is offered "
            "for download and listening, never as something the page indexes into.")
        exports["voice"] = voice
    manifest["exports"] = exports
    return manifest


def build(number, path, registry, overrides=None, sfx_registry=None):
    parsed = parse_chapter(path, registry, overrides or load_overrides())
    pauses = registry.pauses()
    segments = []
    prev = None
    for seg in parsed["segments"]:
        planned = cache.plan_segment(registry, seg)
        planned["pauseBeforeMs"] = _pause_for(prev, planned, pauses)
        planned["speakerName"] = registry.name(planned["speaker"])
        segments.append(planned)
        prev = planned
    manifest = {
        "chapter": number,
        "title": parsed["title"],
        "source": cache.rel(path),
        "model": registry.model(),
        "outputFormat": registry.output_format(),
        "segmentCount": len(segments),
        "segments": segments,
    }
    attach_cues(manifest, registry, sfx_registry)
    attach_timeline(manifest)
    return manifest


def attach_cues(manifest, registry, sfx_registry=None):
    """Resolve this chapter's cue sheet into the manifest, or record that there is none.

    Additive on purpose. `segments` keeps its existing shape, so a player that knows
    nothing about `cues` still plays the voice track exactly as before. Ambience and
    effects are optional decoration on a voice track that must never depend on them.
    """
    try:
        sreg = sfx_registry if sfx_registry is not None else sfxmod.SfxRegistry(
            config=registry.config)
    except (OSError, ValueError):
        manifest["cues"] = []
        manifest["cueProblems"] = []
        return manifest
    doc = sfxmod.load_cues(manifest["chapter"])
    resolved, problems = sfxmod.resolve_chapter_cues(manifest["segments"], doc, sreg)
    manifest["cues"] = resolved
    manifest["cueProblems"] = problems
    manifest["mix"] = sreg.mix()
    return manifest


def write(manifest):
    os.makedirs(MANIFEST_DIR, exist_ok=True)
    path = os.path.join(MANIFEST_DIR, "chapter-%02d.json" % manifest["chapter"])
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(manifest, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
    return cache.rel(path)


def load(number):
    path = os.path.join(MANIFEST_DIR, "chapter-%02d.json" % number)
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def summarize(manifest, registry):
    """Counts and blockers. Pure data; the CLI does the printing."""
    by_speaker, by_method = {}, {}
    review = []
    for seg in manifest["segments"]:
        by_speaker[seg["speaker"]] = by_speaker.get(seg["speaker"], 0) + 1
        by_method[seg["method"]] = by_method.get(seg["method"], 0) + 1
        if seg["speaker"] == REVIEW or seg["method"] == "unresolved":
            review.append(seg)
    speakers_used = {s for s in by_speaker if s != REVIEW}
    missing = registry.missing_voices(speakers_used)
    distinct = {seg["clipId"] for seg in manifest["segments"]}
    cached = {seg["clipId"] for seg in manifest["segments"] if seg["cached"]}
    inferred = [s for s in manifest["segments"] if s["method"] == "alternation"]
    return {
        "chapter": manifest["chapter"],
        "title": manifest["title"],
        "segments": len(manifest["segments"]),
        "distinctClips": len(distinct),
        "cachedClips": len(cached),
        "toGenerate": len(distinct - cached),
        "bySpeaker": by_speaker,
        "byMethod": by_method,
        "reviewRequired": review,
        "inferred": inferred,
        "missingVoices": missing,
        # `ready` is the strict reading: everything resolved AND every voice assigned.
        # `blocked` is the one that stops a run, and it is narrower on purpose. An
        # ambiguous speaker is a question nobody has answered, so generating would pick
        # a voice by coin toss; an unassigned voice is a question already answered, and
        # holds up its own lines and nothing else.
        "ready": not review and not missing,
        "blocked": bool(review),
        "waitingOnVoice": [s for s in manifest["segments"] if s["speaker"] in set(missing)],
    }


def game_export(numbers, registry):
    """Character and system lines only. Narration is audiobook-only."""
    lines, seen = [], set()
    for n in numbers:
        man = load(n)
        for seg in man["segments"]:
            sid = seg["speaker"]
            if sid == NARRATOR or sid == REVIEW:
                continue
            if not registry.exports_to_game(sid):
                continue
            key = seg["clipId"]
            if key in seen:
                for line in lines:
                    if line["lineId"] == key and n not in line["chapters"]:
                        line["chapters"].append(n)
                continue
            seen.add(key)
            lines.append({
                "lineId": key,
                "character": sid,
                "characterName": registry.name(sid),
                "kind": (registry.get(sid) or {}).get("kind", "character"),
                "text": seg["displayText"],
                "audio": seg["audio"],
                "chapters": [n],
            })
    return {
        "_comment": (
            "Canonical character and system voice lines for the game. Narration is "
            "excluded because it is audiobook-only. `audio` points at the same clip the "
            "audiobook plays: one generated line, used in both places."
        ),
        "lineCount": len(lines),
        "lines": lines,
    }
