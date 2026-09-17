"""Clip fingerprinting and the on-disk cache.

Two independent mechanisms keep credit use minimal:

1. IDENTITY. A clip id is a hash of the speaker plus the spoken text, so changing one
   Jack sentence produces one new clip id and leaves every other clip untouched.
2. FINGERPRINT. A hash of everything that materially changes the generated audio:
   the text, the voice id, the voice version, the model, the output format and the
   resolved voice settings. It is stored beside the mp3. If the file exists and the
   fingerprint matches, generation is skipped.

So editing text regenerates that line only, and re-tuning Sarah's settings regenerates
Sarah's clips only.
"""

import hashlib
import json
import os

from .parse import normalize
from .registry import ROOT

CLIPS_DIR = os.path.join(ROOT, "audio", "clips")


def fingerprint(tts_text, voice_id, voice_version, model, output_format, settings):
    payload = json.dumps({
        "text": normalize(tts_text),
        "voiceId": voice_id,
        "voiceVersion": voice_version,
        "model": model,
        "outputFormat": output_format,
        "settings": {k: settings[k] for k in sorted(settings)},
    }, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def clip_paths(registry, speaker_id, clip_id):
    """Canonical location for a clip. Grouped by speaker, not by chapter.

    One generated line exists once, wherever it is used. Grouping by speaker keeps
    per-character reprocessing and the Godot export simple; grouping by chapter would
    duplicate a repeated line and break reuse.
    """
    key = registry.audio_key(speaker_id)
    directory = os.path.join(CLIPS_DIR, key)
    return (
        os.path.join(directory, clip_id + ".mp3"),
        os.path.join(directory, clip_id + ".json"),
    )


def rel(path):
    return os.path.relpath(path, ROOT).replace(os.sep, "/")


def read_sidecar(path):
    if not os.path.isfile(path):
        return None
    try:
        with open(path, encoding="utf-8") as fh:
            return json.load(fh)
    except (OSError, ValueError):
        return None


def is_cached(audio_path, sidecar_path, expected_fingerprint):
    """True when the audio exists and was generated from the same inputs."""
    if not os.path.isfile(audio_path) or os.path.getsize(audio_path) == 0:
        return False
    meta = read_sidecar(sidecar_path)
    return bool(meta) and meta.get("fingerprint") == expected_fingerprint


def write_sidecar(sidecar_path, meta):
    os.makedirs(os.path.dirname(sidecar_path), exist_ok=True)
    tmp = sidecar_path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as fh:
        json.dump(meta, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
    os.replace(tmp, sidecar_path)


def plan_segment(registry, seg):
    """Attach generation-relevant fields to a segment. No network, no secret."""
    sid = seg["speaker"]
    voice_id = registry.voice_id(sid)
    settings = registry.settings_for(sid)
    fp = fingerprint(
        seg["ttsText"], voice_id, registry.voice_version(sid),
        registry.model(), registry.output_format(), settings)
    audio_path, sidecar_path = clip_paths(registry, sid, seg["clipId"])
    out = dict(seg)
    out["voiceId"] = voice_id
    out["voiceVersion"] = registry.voice_version(sid)
    out["fingerprint"] = fp
    out["audio"] = rel(audio_path)
    out["cached"] = is_cached(audio_path, sidecar_path, fp)
    return out
