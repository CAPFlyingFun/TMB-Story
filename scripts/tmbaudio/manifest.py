"""Chapter manifest building, validation and the Godot dialogue export."""

import json
import os
import re

from . import cache
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


def build(number, path, registry, overrides=None):
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
    return {
        "chapter": number,
        "title": parsed["title"],
        "source": cache.rel(path),
        "model": registry.model(),
        "outputFormat": registry.output_format(),
        "segmentCount": len(segments),
        "segments": segments,
    }


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
        "ready": not review and not missing,
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
