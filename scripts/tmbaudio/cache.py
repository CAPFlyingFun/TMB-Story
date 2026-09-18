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


# ---- durations -------------------------------------------------------------
# MPEG-1 and MPEG-2/2.5 Layer III differ in THREE ways at once -- bitrate table,
# sample rate table, and samples per frame -- and reading a version-2 file with
# version-1 numbers does not fail, it just lies. A 45-second 24 kHz file supplied by
# Joshua read as 0.37 seconds, which as a bed would have been sized as a third-of-a-
# second loop.
_BITRATES_V1 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0]
_BITRATES_V2 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0]
_RATES_V1 = [44100, 48000, 32000, 0]
_RATES_V2 = [22050, 24000, 16000, 0]        # MPEG-2
_RATES_V25 = [11025, 12000, 8000, 0]        # MPEG-2.5


def mp3_duration_seconds(path):
    """Length of an MPEG Layer III file, by summing its frames. Stdlib only.

    Handles MPEG-1, MPEG-2 and MPEG-2.5. It used to assume version 1 throughout, which
    is true of everything ElevenLabs returns and false of the first file a human
    supplied -- and the failure was silent: a real 45-second recording measured 0.37
    seconds, because a version-2 header read with version-1 tables is still a number.


    Used for the cue sheet's approximate review timestamps and for reporting. It is
    NOT a synchronisation mechanism: cues anchor to clip identity, not to time.
    Returns 0.0 for a missing or unreadable file rather than raising, because a
    duration is a convenience and must never break a build.
    """
    try:
        with open(path, "rb") as fh:
            data = fh.read()
    except OSError:
        return 0.0
    i = 0
    if data[:3] == b"ID3" and len(data) > 10:
        i = 10 + (((data[6] & 0x7F) << 21) | ((data[7] & 0x7F) << 14)
                  | ((data[8] & 0x7F) << 7) | (data[9] & 0x7F))
    total = 0.0
    while i + 4 <= len(data):
        if data[i] != 0xFF or (data[i + 1] & 0xE0) != 0xE0:
            i += 1
            continue
        version = (data[i + 1] >> 3) & 3         # 3 = MPEG-1, 2 = MPEG-2, 0 = MPEG-2.5
        if version == 1 or ((data[i + 1] >> 1) & 3) != 1:   # 1 is reserved; layer must be III
            i += 1
            continue
        if version == 3:
            bitrate = _BITRATES_V1[(data[i + 2] >> 4) & 0xF]
            rate = _RATES_V1[(data[i + 2] >> 2) & 3]
            per_frame, coefficient = 1152.0, 144
        else:
            bitrate = _BITRATES_V2[(data[i + 2] >> 4) & 0xF]
            rate = (_RATES_V2 if version == 2 else _RATES_V25)[(data[i + 2] >> 2) & 3]
            per_frame, coefficient = 576.0, 72
        if bitrate == 0 or rate == 0:
            i += 1
            continue
        i += coefficient * bitrate * 1000 // rate + ((data[i + 2] >> 1) & 1)
        total += per_frame / rate
    return total
