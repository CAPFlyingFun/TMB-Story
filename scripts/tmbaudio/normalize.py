"""Bake a level into a generated sound asset, so the mix stops fighting the provider.

Why this exists. ElevenLabs returns a one-off event at whatever level the prompt's
language implies, and returns a CONTINUOUS texture -- a room tone, a channel hiss, a
castor rumble, a stream of keystrokes -- near the noise floor whatever the prompt
says. Two rounds of prompt work moved that second group by about 2 dB, so prompting
is not the lever. The player cannot make up the difference either: HTML `volume` is
capped at 1.0, so a cue gain can only ever attenuate.

The file has no such cap. So the pipeline measures each asset after generation and
bakes a fixed gain into the mp3, and the cue gain goes back to being what it should
always have been -- a MIX decision about how loud this sound is relative to the
others, not a rescue attempt.

Four rules hold it together:

1. THE GENERATED FILE IS KEPT, always, as `<asset>.source.mp3`. Every normalisation
   encodes from that snapshot, never from the served file, so re-running can never
   stack gain on gain. Regenerating an asset deletes the snapshot, because the
   generator has just produced a new source.
2. RAISE ONLY, by default. Nothing Joshua has already approved gets quieter without
   `--allow-attenuation`. The point is to lift the floor, not to re-mix the set.
3. THE PEAK CEILING WINS. The applied gain is the smaller of what the RMS target
   asks for and what the peak allows, so normalising never clips an asset whose
   peak is already near full scale -- which several of the good ones are.
4. THE GENERATION FINGERPRINT IS NOT TOUCHED. Normalising is not generating; the
   sidecar keeps the fingerprint it was written with, so the cache still reads
   "cached" and no run spends a credit because a level changed.

Needs ffmpeg, and says so rather than guessing -- the same rule measure-mix.py
follows, and for the same reason.
"""

import audioop
import json
import math
import os
import shutil
import subprocess
import tempfile
import time
import wave

from . import cache, sfx as sfxmod
from .registry import ROOT

# Defaults. `audio/config.json`'s sfx.normalize overrides any of them; the numbers
# live in data for the same reason every other tuning number does.
DEFAULTS = {
    "targetRmsDbfs": -20.0,      # where a normalised asset lands, loud enough to sit
                                 # under speech at about -22 without disappearing
    "peakCeilingDbfs": -1.0,     # never push a peak above this
    "minChangeDb": 0.5,          # below this, re-encoding buys nothing
    "maxGainDb": 40.0,           # a file needing more than this is broken, not quiet
}

SOURCE_SUFFIX = ".source.mp3"


def settings(sreg):
    out = dict(DEFAULTS)
    out.update({k: v for k, v in (sreg.block().get("normalize") or {}).items()
                if not str(k).startswith("_")})
    return out


def ffmpeg():
    exe = shutil.which("ffmpeg")
    if not exe:
        raise RuntimeError(
            "ffmpeg is not on the path. Normalising means decoding an asset and "
            "re-encoding it, and without a decoder this would have to guess at a "
            "level -- which is the thing it exists to stop.")
    return exe


def source_path(audio_path):
    """The kept generated file. `<id>.mp3` is served; `<id>.source.mp3` is the master."""
    base, _ = os.path.splitext(audio_path)
    return base + SOURCE_SUFFIX


def clear_source(audio_path):
    """Called when an asset is REGENERATED: the new file is the new master."""
    src = source_path(audio_path)
    if os.path.isfile(src):
        os.remove(src)
        return True
    return False


def _dbfs(value):
    return float("-inf") if value <= 0 else 20.0 * math.log10(value / 32768.0)


def measure(path):
    """(peakDbfs, rmsDbfs, seconds) from decoded mono PCM."""
    with tempfile.TemporaryDirectory() as tmp:
        out = os.path.join(tmp, "x.wav")
        subprocess.run([ffmpeg(), "-v", "error", "-y", "-i", path,
                        "-ac", "1", "-ar", "44100", "-acodec", "pcm_s16le",
                        "-f", "wav", out], check=True)
        with wave.open(out) as w:
            pcm = w.readframes(w.getnframes())
            rate = w.getframerate()
    if not pcm:
        return float("-inf"), float("-inf"), 0.0
    return (_dbfs(audioop.max(pcm, 2)), _dbfs(audioop.rms(pcm, 2)),
            len(pcm) / 2.0 / rate)


def gain_for(peak_db, rms_db, conf, allow_attenuation=False):
    """The applied gain in dB, and why it is that and not something else.

    The RMS target says how much lift the sound wants; the peak ceiling says how much
    it can take. The smaller wins, which is what keeps a transient-heavy one-shot from
    clipping when its RMS looks quiet only because it is mostly silence between hits.
    """
    if rms_db == float("-inf"):
        return 0.0, "silent: nothing to raise"
    want = conf["targetRmsDbfs"] - rms_db
    headroom = conf["peakCeilingDbfs"] - peak_db
    applied = min(want, headroom)
    reason = "rms target" if want <= headroom else "peak ceiling"
    if not allow_attenuation and applied < 0:
        return 0.0, "already above the target; raise-only"
    if applied > conf["maxGainDb"]:
        return 0.0, ("needs %+.1f dB, past the %.0f dB limit: this is a broken asset, "
                     "not a quiet one" % (applied, conf["maxGainDb"]))
    if abs(applied) < conf["minChangeDb"]:
        return 0.0, "within %.1f dB of the target already" % conf["minChangeDb"]
    return round(applied, 1), reason


def encode_args(output_format):
    """`mp3_44100_128` -> the ffmpeg flags that produce it. Same string the generator
    asks the provider for, so a normalised file matches its siblings."""
    parts = str(output_format).split("_")
    rate = parts[1] if len(parts) > 2 and parts[1].isdigit() else "44100"
    kbps = parts[2] if len(parts) > 2 and parts[2].isdigit() else "128"
    return ["-ar", rate, "-ac", "1", "-b:a", kbps + "k"]


def plan_one(sreg, asset_id, conf, force=False, allow_attenuation=False):
    """What normalising this asset would do. Decodes; writes nothing."""
    audio_path, sidecar_path = sfxmod.asset_paths(sreg, asset_id)
    audio_abs = os.path.join(ROOT, audio_path)
    out = {"asset": asset_id, "audio": audio_path, "sidecar": sidecar_path,
           "appliedDb": 0.0, "action": "skip", "reason": ""}
    if sreg.source(asset_id) != "generated":
        out["reason"] = "supplied by hand; the pipeline does not touch its level"
        return out
    if not os.path.isfile(audio_abs):
        out["reason"] = "not generated yet"
        return out

    side = cache.read_sidecar(os.path.join(ROOT, sidecar_path)) or {}
    done = side.get("normalize") or {}
    src_abs = os.path.join(ROOT, source_path(audio_path))
    if done and not force:
        same = (abs(float(done.get("targetRmsDbfs", 0)) - conf["targetRmsDbfs"]) < 0.01
                and abs(float(done.get("peakCeilingDbfs", 0)) - conf["peakCeilingDbfs"]) < 0.01)
        if same and os.path.isfile(src_abs):
            out["reason"] = ("already normalised %+.1f dB to %.1f dBFS"
                             % (done.get("appliedDb", 0.0), done.get("resultRmsDbfs", 0.0)))
            return out

    # Always measure the MASTER. On the first pass the served file is the master;
    # after that the snapshot is, and measuring the served file instead would read a
    # level this pass already applied and then apply it again.
    master = src_abs if os.path.isfile(src_abs) else audio_abs
    peak, rms, seconds = measure(master)
    applied, reason = gain_for(peak, rms, conf, allow_attenuation)
    out.update({"sourcePeakDbfs": round(peak, 1) if peak != float("-inf") else None,
                "sourceRmsDbfs": round(rms, 1) if rms != float("-inf") else None,
                "seconds": round(seconds, 2), "appliedDb": applied, "reason": reason,
                "master": source_path(audio_path) if master == src_abs else audio_path})
    if applied:
        out["action"] = "normalize"
        out["predictedRmsDbfs"] = round(rms + applied, 1)
        out["predictedPeakDbfs"] = round(peak + applied, 1)
    return out


def apply_one(sreg, plan, conf):
    """Snapshot the master if needed, re-encode with the gain, record what was done."""
    audio_abs = os.path.join(ROOT, plan["audio"])
    src_abs = os.path.join(ROOT, source_path(plan["audio"]))
    if not os.path.isfile(src_abs):
        shutil.copy2(audio_abs, src_abs)

    tmp = audio_abs + ".part"
    subprocess.run([ffmpeg(), "-v", "error", "-y", "-i", src_abs,
                    "-af", "volume=%.1fdB" % plan["appliedDb"]]
                   + encode_args(sreg.output_format()) + ["-f", "mp3", tmp], check=True)
    os.replace(tmp, audio_abs)

    peak, rms, seconds = measure(audio_abs)
    sidecar_abs = os.path.join(ROOT, plan["sidecar"])
    side = cache.read_sidecar(sidecar_abs) or {}
    # The generation fingerprint is deliberately left exactly as it was: normalising
    # is not generating, and a changed fingerprint would buy a credit next run.
    side["normalize"] = {
        "appliedDb": plan["appliedDb"],
        "targetRmsDbfs": conf["targetRmsDbfs"],
        "peakCeilingDbfs": conf["peakCeilingDbfs"],
        "limitedBy": plan["reason"],
        "sourceRmsDbfs": plan["sourceRmsDbfs"],
        "sourcePeakDbfs": plan["sourcePeakDbfs"],
        "resultRmsDbfs": round(rms, 1) if rms != float("-inf") else None,
        "resultPeakDbfs": round(peak, 1) if peak != float("-inf") else None,
        "sourceFile": source_path(plan["audio"]),
        "at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    side["bytes"] = os.path.getsize(audio_abs)
    cache.write_sidecar(sidecar_abs, side)
    return side["normalize"]


def normalize_assets(sreg, asset_ids, force=False, allow_attenuation=False,
                     dry_run=False, log=print):
    conf = settings(sreg)
    log("Target %.1f dBFS RMS, peak ceiling %.1f dBFS, %s."
        % (conf["targetRmsDbfs"], conf["peakCeilingDbfs"],
           "raise or attenuate" if allow_attenuation else "raise only"))
    plans = [plan_one(sreg, a, conf, force, allow_attenuation) for a in sorted(asset_ids)]
    todo = [p for p in plans if p["action"] == "normalize"]
    for p in plans:
        if p["action"] == "normalize":
            log("  %-30s %+6.1f dB  %6.1f -> %6.1f dBFS rms   (%s)"
                % (p["asset"], p["appliedDb"], p["sourceRmsDbfs"],
                   p["predictedRmsDbfs"], p["reason"]))
        else:
            log("  %-30s      --      %s" % (p["asset"], p["reason"]))
    if dry_run:
        log("\nDry run. %d asset(s) would be normalised; nothing was written." % len(todo))
        return 0, 0
    done = failed = 0
    for p in todo:
        try:
            result = apply_one(sreg, p, conf)
            done += 1
            log("  wrote %-28s %+6.1f dB -> %.1f dBFS rms, peak %.1f"
                % (p["asset"], result["appliedDb"], result["resultRmsDbfs"],
                   result["resultPeakDbfs"]))
        except Exception as exc:                     # noqa: BLE001 - reported, not raised
            failed += 1
            log("  FAILED %s: %s" % (p["asset"], exc))
    log("\nNormalised %d, failed %d, unchanged %d."
        % (done, failed, len(plans) - len(todo)))
    return done, failed
