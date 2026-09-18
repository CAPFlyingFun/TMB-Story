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
3. THE PEAK CEILING WINS, AND IT IS CHECKED AGAINST THE ENCODED FILE. The applied
   gain is the smaller of what the RMS target asks for and what the peak allows. It
   is then VERIFIED: mp3 is lossy, so a decode overshoots what the encoder was given,
   and the first pass here aimed eleven assets at -1.0 dBFS and delivered eleven files
   clamped at 0.0. The gain is backed off and re-encoded until the delivered audio is
   really under the ceiling, and the ceiling itself is -3, which is the headroom the
   codec needs.
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
    "peakCeilingDbfs": -3.0,     # never push a peak above this. NOT -1: mp3 is lossy,
                                 # and a decode overshoots what was encoded. The first
                                 # pass aimed at -1.0 and eleven assets came back at
                                 # 0.0 dBFS -- clamped at full scale -- overshooting by
                                 # 1.0 to 2.8 dB. -3 is the headroom the codec needs.
    "minChangeDb": 0.5,          # below this, re-encoding buys nothing
    "maxGainDb": 40.0,           # a file needing more than this is broken, not quiet
    "peakToleranceDb": 0.2,      # how far over the ceiling a result may land before
                                 # the corrective pass re-encodes it
    "maxCorrections": 2,
}

# Making a big asset smaller without making it worse. Joshua: "Can we compress audio
# or convert to MP3 which is less large?" -- it is already mp3, so the levers are
# bitrate and channels. A supplied bed arrived at 256 kbps joint stereo and 18 MB;
# for a bed sitting 36 dB under the narration, 64 kbps mono is the same sound at a
# quarter of the size. The ORIGINAL is kept, and every pass re-encodes from it, so
# quality cannot decay run after run.
WEB_DEFAULTS = {
    "enabled": True,
    "maxKbps": 64,
    "channels": 1,
    "sampleRate": 44100,
    "minBytesToCompress": 1048576,
}


def web_settings(sreg):
    out = dict(WEB_DEFAULTS)
    out.update({k: v for k, v in (sreg.block().get("webEncode") or {}).items()
                if not str(k).startswith("_")})
    return out

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
        # A SUPPLIED FILE IS MEASURED BUT NEVER RE-ENCODED. Its level is the
        # contributor's decision and its bytes are its identity, so re-encoding it
        # would change what it is. But without a measurement its cue gain cannot be
        # derived from it, and it keeps whatever number the previous asset happened
        # to have -- which is how the supplied lab bed inherited 0.014.
        if not os.path.isfile(audio_abs):
            out["reason"] = "supplied, but no file is there yet"
            return out
        if sreg.source(asset_id) == "procedural":
            # Never compress a procedural loop: re-encoding it to mp3 would put back
            # the encoder padding that made it fail to loop in the first place. It is
            # rebuilt from its recipe, so there is nothing to protect and nothing to
            # shrink that the recipe cannot shrink itself.
            out["action"] = "measure"
            out["reason"] = "procedural: measured, and never re-encoded"
            return out
        web = web_settings(sreg)
        src_abs = os.path.join(ROOT, source_path(audio_path))
        master = src_abs if os.path.isfile(src_abs) else audio_abs
        size = os.path.getsize(master)
        if web.get("enabled") and size >= int(web["minBytesToCompress"]):
            side = cache.read_sidecar(os.path.join(ROOT, sidecar_path)) or {}
            done = side.get("webEncode") or {}
            same = (done.get("maxKbps") == web["maxKbps"]
                    and done.get("channels") == web["channels"])
            if same and os.path.isfile(src_abs) and not force:
                out["reason"] = ("already web-encoded to %s kbps mono (%.1f -> %.1f MB)"
                                 % (web["maxKbps"], done.get("originalMb", 0),
                                    done.get("webMb", 0)))
                return out
            out["action"] = "compress"
            out["_web"] = web
            out["_sizeMb"] = size / 1048576.0
            out["reason"] = ("%.1f MB at the delivered quality; re-encoding a web copy "
                             "at %s kbps, %s channel(s), original kept"
                             % (out["_sizeMb"], web["maxKbps"], web["channels"]))
            return out
        out["action"] = "measure"
        out["reason"] = "supplied by hand: measured, never re-encoded"
        return out
    if not os.path.isfile(audio_abs):
        out["reason"] = "not generated yet"
        return out

    side = cache.read_sidecar(os.path.join(ROOT, sidecar_path)) or {}
    done = side.get("normalize") or {}
    src_abs = os.path.join(ROOT, source_path(audio_path))
    normalised = bool(done) and os.path.isfile(src_abs)

    # ALWAYS DERIVE FROM THE MASTER, then compare with what is recorded. The earlier
    # shortcut -- skip when the target has not changed -- could not notice that the
    # served file no longer matched the rule, which is exactly what happened when the
    # ceiling moved: the right gain became 0, the shortcut said "already normalised",
    # and a clipped file stayed on disk. Comparing gains instead makes the pass
    # self-healing, and the decode it costs is free.
    master = src_abs if normalised else audio_abs
    peak, rms, seconds = measure(master)
    applied, reason = gain_for(peak, rms, conf, allow_attenuation)
    out.update({"sourcePeakDbfs": round(peak, 1) if peak != float("-inf") else None,
                "sourceRmsDbfs": round(rms, 1) if rms != float("-inf") else None,
                "seconds": round(seconds, 2), "appliedDb": applied, "reason": reason,
                "master": source_path(audio_path) if normalised else audio_path})

    if normalised:
        recorded = float(done.get("appliedDb", 0.0))
        # Two ways a normalised asset can still be wrong, and the second is not implied
        # by the first: the GAIN may no longer be what the rule asks for, or the file
        # DELIVERED may sit above the ceiling that is in force now. A tightened ceiling
        # can move the delivered peak 3 dB out of bounds while changing the gain by
        # less than the re-encode threshold, so the peak is checked on its own.
        was_peak = done.get("resultPeakDbfs")
        peak_over = (was_peak is not None
                     and float(was_peak) - conf["peakCeilingDbfs"] > conf["peakToleranceDb"])
        if abs(applied - recorded) < conf["minChangeDb"] and not peak_over and not force:
            out["reason"] = ("already normalised %+.1f dB to %s dBFS"
                             % (recorded, done.get("resultRmsDbfs")))
            return out
        if peak_over:
            out["reason"] = ("delivered peak %.1f is above the %.1f ceiling"
                             % (float(was_peak), conf["peakCeilingDbfs"]))
        if applied == 0.0:
            # The rule now says leave this file alone, but a previous pass did not.
            # Put the generated master back rather than leaving its gain in place.
            out["action"] = "restore"
            out["reason"] = "%s; restoring the generated master" % out["reason"]
            return out

    if applied:
        out["action"] = "normalize"
        out["predictedRmsDbfs"] = round(rms + applied, 1)
        out["predictedPeakDbfs"] = round(peak + applied, 1)
    return out


def _encode(sreg, src_abs, audio_abs, gain_db):
    """One re-encode from the master, then a measurement of what actually came out."""
    tmp = audio_abs + ".part"
    subprocess.run([ffmpeg(), "-v", "error", "-y", "-i", src_abs,
                    "-af", "volume=%.1fdB" % gain_db]
                   + encode_args(sreg.output_format()) + ["-f", "mp3", tmp], check=True)
    os.replace(tmp, audio_abs)
    return measure(audio_abs)


def measure_only(plan):
    """Record what a supplied file's level IS, without changing a byte of it."""
    audio_abs = os.path.join(ROOT, plan["audio"])
    peak, rms, seconds = measure(audio_abs)
    sidecar_abs = os.path.join(ROOT, plan["sidecar"])
    side = cache.read_sidecar(sidecar_abs) or {}
    side["measured"] = {
        "measuredAt": time.strftime("%Y-%m-%d", time.gmtime()),
        "source": "scripts/audio.py normalize-sfx, decoded PCM, file unchanged",
        "seconds": round(seconds, 2),
        "peakDbfs": round(peak, 1) if peak != float("-inf") else None,
        "rmsDbfs": round(rms, 1) if rms != float("-inf") else None,
    }
    cache.write_sidecar(sidecar_abs, side)
    return side["measured"]


def compress_one(plan):
    """Write a web-sized copy and KEEP the delivered file as the master.

    The same discipline normalisation uses: the original is snapshotted once and every
    pass encodes from that snapshot, never from an already-compressed file, so running
    this twice cannot stack generation loss.
    """
    web = plan["_web"]
    audio_abs = os.path.join(ROOT, plan["audio"])
    src_abs = os.path.join(ROOT, source_path(plan["audio"]))
    if not os.path.isfile(src_abs):
        shutil.copy2(audio_abs, src_abs)
    original_mb = os.path.getsize(src_abs) / 1048576.0

    tmp = audio_abs + ".part"
    subprocess.run([ffmpeg(), "-v", "error", "-y", "-i", src_abs,
                    "-c:a", "libmp3lame", "-b:a", "%dk" % int(web["maxKbps"]),
                    "-ar", str(int(web["sampleRate"])), "-ac", str(int(web["channels"])),
                    "-f", "mp3", tmp], check=True)
    os.replace(tmp, audio_abs)

    peak, rms, seconds = measure(audio_abs)
    sidecar_abs = os.path.join(ROOT, plan["sidecar"])
    side = cache.read_sidecar(sidecar_abs) or {}
    side["webEncode"] = {
        "maxKbps": web["maxKbps"], "channels": web["channels"],
        "sampleRate": web["sampleRate"],
        "originalMb": round(original_mb, 2),
        "webMb": round(os.path.getsize(audio_abs) / 1048576.0, 2),
        "masterFile": source_path(plan["audio"]),
        "at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    side["measured"] = {
        "measuredAt": time.strftime("%Y-%m-%d", time.gmtime()),
        "source": "scripts/audio.py normalize-sfx, decoded PCM after web encoding",
        "seconds": round(seconds, 2),
        "peakDbfs": round(peak, 1) if peak != float("-inf") else None,
        "rmsDbfs": round(rms, 1) if rms != float("-inf") else None,
    }
    side["bytes"] = os.path.getsize(audio_abs)
    cache.write_sidecar(sidecar_abs, side)
    out = dict(side["webEncode"])
    out["rmsDbfs"] = side["measured"]["rmsDbfs"]
    return out


def restore_one(plan):
    """Put the generated master back and forget that this asset was ever normalised."""
    audio_abs = os.path.join(ROOT, plan["audio"])
    src_abs = os.path.join(ROOT, source_path(plan["audio"]))
    shutil.copy2(src_abs, audio_abs)
    os.remove(src_abs)
    sidecar_abs = os.path.join(ROOT, plan["sidecar"])
    side = cache.read_sidecar(sidecar_abs) or {}
    side.pop("normalize", None)
    side["bytes"] = os.path.getsize(audio_abs)
    cache.write_sidecar(sidecar_abs, side)


def apply_one(sreg, plan, conf):
    """Snapshot the master, encode, then CHECK THE RESULT and correct it if needed.

    The check is not belt-and-braces. mp3 is lossy, so what a decoder reconstructs
    overshoots what the encoder was given -- by 1.0 to 2.8 dB across this set. A pass
    that trusted its own arithmetic aimed eleven assets at -1.0 dBFS and delivered
    eleven files clamped at 0.0. So the gain is verified against the encoded file and
    backed off until the delivered audio really is under the ceiling.
    """
    audio_abs = os.path.join(ROOT, plan["audio"])
    src_abs = os.path.join(ROOT, source_path(plan["audio"]))
    if not os.path.isfile(src_abs):
        shutil.copy2(audio_abs, src_abs)

    applied = plan["appliedDb"]
    limited_by = plan["reason"]
    corrections = []
    peak, rms, seconds = _encode(sreg, src_abs, audio_abs, applied)
    for _ in range(int(conf["maxCorrections"])):
        over = peak - conf["peakCeilingDbfs"]
        if over <= conf["peakToleranceDb"]:
            break
        applied = round(applied - over - 0.1, 1)
        corrections.append({"overBy": round(over, 1), "newGainDb": applied})
        limited_by = "peak ceiling, measured after encoding"
        peak, rms, seconds = _encode(sreg, src_abs, audio_abs, applied)

    sidecar_abs = os.path.join(ROOT, plan["sidecar"])
    side = cache.read_sidecar(sidecar_abs) or {}
    # The generation fingerprint is deliberately left exactly as it was: normalising
    # is not generating, and a changed fingerprint would buy a credit next run.
    side["normalize"] = {
        "appliedDb": applied,
        "targetRmsDbfs": conf["targetRmsDbfs"],
        "peakCeilingDbfs": conf["peakCeilingDbfs"],
        "limitedBy": limited_by,
        "corrections": corrections,
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
    todo = [p for p in plans if p["action"] in ("normalize", "restore", "measure",
                                               "compress")]
    for p in plans:
        if p["action"] == "compress":
            log("  %-30s  compress  %s" % (p["asset"], p["reason"]))
        elif p["action"] == "measure":
            log("  %-30s  measure   %s" % (p["asset"], p["reason"]))
        elif p["action"] == "restore":
            log("  %-30s  restore   %s" % (p["asset"], p["reason"]))
        elif p["action"] == "normalize":
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
            if p["action"] == "compress":
                result = compress_one(p)
                done += 1
                log("  compressed %-25s %.1f -> %.1f MB  (%.0f%% smaller), %s dBFS rms"
                    % (p["asset"], result["originalMb"], result["webMb"],
                       100 * (1 - result["webMb"] / max(result["originalMb"], 1e-9)),
                       result["rmsDbfs"]))
                continue
            if p["action"] == "measure":
                result = measure_only(p)
                done += 1
                log("  measured %-27s %s dBFS rms, peak %s"
                    % (p["asset"], result["rmsDbfs"], result["peakDbfs"]))
                continue
            if p["action"] == "restore":
                restore_one(p)
                done += 1
                log("  restored %-27s the generated master is served again" % p["asset"])
                continue
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
