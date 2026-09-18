"""The combined audio-drama export: voices, ambience and effects in one file.

A CONVENIENCE OUTPUT, never a master. The individual voice clips, ambience beds and
effect assets stay exactly where they are and remain the canonical assets; this file is
rebuilt from them and can be deleted without losing anything. Nothing is ever mixed
permanently into a voice clip.

The timeline here is computed the same way the player computes it -- each segment's
pause, then its clip -- so the mix and the browser agree about where a cue lands. That
timeline is derived from clip identity every time it is built, which is why a recast
voice needs no edit to the cue sheet: the offsets are recomputed, not stored.

Needs ffmpeg. Without it there is no honest way to overlay two sounds, so the export is
skipped with a message rather than faked.
"""

import os
import shutil
import subprocess

from . import cache, manifest as mf, sfx as sfxmod
from .registry import ROOT

EXPORT_DIR = os.path.join(ROOT, "audio", "exports")

# Ducking of the sustained beds against the voice track. Conservative on purpose: the
# point is that speech always wins, not that the beds disappear.
SIDECHAIN = "threshold=0.03:ratio=6:attack=20:release=400:makeup=1"


def have_ffmpeg():
    return shutil.which("ffmpeg") is not None


def timeline(manifest):
    """(starts, ends, total) in seconds, keyed by segment order."""
    starts, ends = {}, {}
    t = 0.0
    for seg in manifest["segments"]:
        t += (seg.get("pauseBeforeMs") or 0) / 1000.0
        starts[seg["order"]] = t
        t += cache.mp3_duration_seconds(os.path.join(ROOT, seg["audio"]))
        ends[seg["order"]] = t
    return starts, ends, t


def cue_start(cue, manifest, starts, ends):
    """When a cue sounds, in seconds.

    `before` starts at the top of the GAP ahead of its segment, which is what the
    player does and what the cue sheet's reasoning depends on -- the chirp is heard,
    and then the narrator says a warning tone chirped. A cue longer than the gap
    bleeds into the speech on purpose: the console alarm should still be ringing when
    TOMBS speaks over it.
    """
    order = cue["order"]
    if cue["timing"] == "after":
        return ends[order]
    if cue["timing"] == "during":
        return starts[order] + (cue.get("offsetMs") or 0) / 1000.0
    gap = 0.0
    for seg in manifest["segments"]:
        if seg["order"] == order:
            gap = (seg.get("pauseBeforeMs") or 0) / 1000.0
            break
    return max(0.0, starts[order] - gap)


def plan(manifest, sfx_registry):
    """Everything the mix needs, as data. No ffmpeg, no files written.

    Separated out so the timeline and the graph can be inspected and tested in an
    environment with no ffmpeg at all.
    """
    starts, ends, total = timeline(manifest)
    voices, beds, shots, missing = [], [], [], []
    for seg in manifest["segments"]:
        path = os.path.join(ROOT, seg["audio"])
        if not os.path.isfile(path):
            missing.append(seg["audio"])
            continue
        voices.append({"path": path, "at": starts[seg["order"]], "gain": 1.0})
    # THE EXPORT OBEYS THE SAME LAYER SWITCHES THE PLAYER DOES. It did not, and that
    # was a quiet way for the file and the page to disagree: turning ambience off in
    # the mix silenced it in the browser while the delivered mp3 still carried it.
    layers_on = (manifest.get("mix") or {}).get("layers") or {}
    for cue in manifest.get("cues") or []:
        if layers_on.get(cue.get("layer")) is False:
            continue
        path = os.path.join(ROOT, cue["audio"])
        if not os.path.isfile(path):
            missing.append(cue["audio"])
            continue
        entry = {
            "path": path, "cueId": cue["cueId"], "asset": cue["asset"],
            "at": cue_start(cue, manifest, starts, ends),
            "gain": float(cue["gain"]),
            "fadeIn": (cue.get("fadeInMs") or 0) / 1000.0,
            "fadeOut": (cue.get("fadeOutMs") or 0) / 1000.0,
        }
        if cue.get("stopOrder") is not None:
            entry["until"] = ends[cue["stopOrder"]]
            entry["duration"] = max(0.5, entry["until"] - entry["at"])
            asset = sfx_registry.get(cue["asset"]) or {}
            entry["assetSeconds"] = float(asset.get("durationSeconds") or 22)
            beds.append(entry)
        else:
            shots.append(entry)
    return {
        "total": total, "voices": voices, "beds": beds, "shots": shots,
        "missing": sorted(set(missing)),
    }


def _ms(seconds):
    return int(round(seconds * 1000))


def build_graph(spec):
    """(inputs, filtergraph, out_label). Pure string building, unit-testable."""
    inputs, parts = [], []
    vlabels, blabels, slabels = [], [], []

    for i, v in enumerate(spec["voices"]):
        inputs.append(v["path"])
        label = "v%d" % i
        parts.append("[%d:a]aresample=44100,adelay=%d:all=1[%s]"
                     % (len(inputs) - 1, _ms(v["at"]), label))
        vlabels.append(label)

    for i, b in enumerate(spec["beds"]):
        inputs.append(b["path"])
        idx = len(inputs) - 1
        label = "b%d" % i
        # size is a SAMPLE COUNT that ffmpeg sizes a buffer from, so it is computed
        # from the asset's own length rather than left as a huge sentinel: a 2e9
        # sentinel asks for a two-billion-sample buffer per bed. It never actually
        # misbehaved -- the combine has always run in about 17 seconds -- so this is
        # a latent risk removed, not a fix for an observed slowdown.
        loop_samples = int(b.get("assetSeconds") or 22) * 44100 + 4096
        chain = ["[%d:a]aresample=44100" % idx,
                 "aloop=loop=-1:size=%d" % loop_samples,
                 "atrim=duration=%.3f" % b["duration"],
                 "volume=%.4f" % b["gain"]]
        if b["fadeIn"]:
            chain.append("afade=t=in:st=0:d=%.3f" % b["fadeIn"])
        if b["fadeOut"]:
            chain.append("afade=t=out:st=%.3f:d=%.3f"
                         % (max(0.0, b["duration"] - b["fadeOut"]), b["fadeOut"]))
        chain.append("adelay=%d:all=1" % _ms(b["at"]))
        parts.append(",".join(chain) + "[%s]" % label)
        blabels.append(label)

    for i, s in enumerate(spec["shots"]):
        inputs.append(s["path"])
        idx = len(inputs) - 1
        label = "s%d" % i
        chain = ["[%d:a]aresample=44100" % idx, "volume=%.4f" % s["gain"]]
        if s["fadeIn"]:
            chain.append("afade=t=in:st=0:d=%.3f" % s["fadeIn"])
        chain.append("adelay=%d:all=1" % _ms(s["at"]))
        parts.append(",".join(chain) + "[%s]" % label)
        slabels.append(label)

    if not vlabels:
        raise RuntimeError("no voice clips to mix")

    # normalize=0 throughout: gains are already decided by the cue sheet and the mix
    # config, and amix's default averaging would quietly undo every one of them.
    parts.append("%samix=inputs=%d:normalize=0:dropout_transition=0[vmix]"
                 % ("".join("[%s]" % x for x in vlabels), len(vlabels)))
    final = ["[vmix]"]

    if blabels:
        parts.append("%samix=inputs=%d:normalize=0:dropout_transition=0[bmix]"
                     % ("".join("[%s]" % x for x in blabels), len(blabels)))
        # Real ducking: the voice track drives a compressor on the beds, so a bed is
        # present in the gaps and under the speech rather than flatly quiet throughout.
        parts.append("[vmix]asplit=2[vout][vkey]")
        parts.append("[bmix][vkey]sidechaincompress=%s[bduck]" % SIDECHAIN)
        final = ["[vout]", "[bduck]"]

    final += ["[%s]" % x for x in slabels]
    if len(final) == 1:
        out = final[0]
    else:
        parts.append("%samix=inputs=%d:normalize=0:dropout_transition=0[mix]"
                     % ("".join(final), len(final)))
        out = "[mix]"
    return inputs, ";".join(parts), out


DEFAULT_EXPORT_ENCODE = {"dramaKbps": 96, "voiceKbps": 80, "channels": 1,
                         "sampleRate": 44100}


def export_encode(sfx_registry):
    """How the chapter file is written. Was 192 kbps STEREO from mono sources, which
    paid twice the bitrate for a duplicate channel."""
    out = dict(DEFAULT_EXPORT_ENCODE)
    block = (getattr(sfx_registry, "mix", dict)() or {}).get("exportEncode") or {}
    out.update({k: v for k, v in block.items() if not str(k).startswith("_")})
    return out


def export_chapter(number, registry, sfx_registry=None, log=print):
    """Write audio/exports/chapter-NN-drama.mp3. Returns the path, or None."""
    manifest = mf.load(number)
    if not manifest.get("cues"):
        log("chapter %d has no cues; the plain combined export already is the mix."
            % number)
        return None
    if not have_ffmpeg():
        log("chapter %d: ffmpeg is not on the path, so the layers cannot be overlaid. "
            "Skipping the drama export rather than writing something misleading."
            % number)
        return None

    sreg = sfx_registry or sfxmod.SfxRegistry(config=registry.config)
    enc = export_encode(sreg)
    spec = plan(manifest, sreg)
    if spec["missing"]:
        log("  %d asset(s) are not generated yet and are left out of the mix:"
            % len(spec["missing"]))
        for m in spec["missing"][:10]:
            log("    %s" % m)
    inputs, graph, out_label = build_graph(spec)

    os.makedirs(EXPORT_DIR, exist_ok=True)
    out = os.path.join(EXPORT_DIR, "chapter-%02d-drama.mp3" % number)
    cmd = ["ffmpeg", "-v", "error", "-y"]
    for path in inputs:
        cmd += ["-i", path]
    cmd += ["-filter_complex", graph, "-map", out_label,
            "-c:a", "libmp3lame", "-b:a", "%dk" % enc["dramaKbps"],
            "-ar", str(enc["sampleRate"]), "-ac", str(enc["channels"]), out]
    subprocess.run(cmd, check=True)
    log("wrote %s  (%d voice clips, %d bed(s), %d effect(s), %.1f min)"
        % (cache.rel(out), len(spec["voices"]), len(spec["beds"]), len(spec["shots"]),
           spec["total"] / 60.0))
    return out
