"""Optional combined chapter export.

The individual clips are the master assets and are never destroyed or replaced by this
step. A combined file is a convenience for listening and sharing.

Pauses live in the manifest, not inside the clips, so timing stays tunable without
regenerating audio. ffmpeg is used when available because it can insert those pauses
accurately. Without ffmpeg the clips are joined directly, which plays fine but has no
gaps; the player applies the pauses properly either way.
"""

import os
import shutil
import subprocess
import tempfile

from . import cache, manifest as mf
from .registry import ROOT

EXPORT_DIR = os.path.join(ROOT, "audio", "exports")


def _have_ffmpeg():
    return shutil.which("ffmpeg") is not None


def combine_chapter(number, registry, log=print):
    man = mf.load(number)
    segs = man["segments"]
    missing = [s for s in segs if not os.path.isfile(os.path.join(ROOT, s["audio"]))]
    if missing:
        log("chapter %d: %d clip(s) not generated yet; nothing to combine."
            % (number, len(missing)))
        return None
    os.makedirs(EXPORT_DIR, exist_ok=True)
    out = os.path.join(EXPORT_DIR, "chapter-%02d.mp3" % number)

    if _have_ffmpeg():
        parts = []
        with tempfile.TemporaryDirectory() as tmp:
            silences = {}
            for seg in segs:
                ms = int(seg.get("pauseBeforeMs") or 0)
                if ms and ms not in silences:
                    sp = os.path.join(tmp, "sil-%d.mp3" % ms)
                    subprocess.run(
                        ["ffmpeg", "-v", "error", "-y", "-f", "lavfi",
                         "-i", "anullsrc=r=44100:cl=mono", "-t", "%.3f" % (ms / 1000.0),
                         "-c:a", "libmp3lame", "-b:a", "128k", sp],
                        check=True)
                    silences[ms] = sp
                if ms:
                    parts.append(silences[ms])
                parts.append(os.path.join(ROOT, seg["audio"]))
            listing = os.path.join(tmp, "concat.txt")
            with open(listing, "w", encoding="utf-8") as fh:
                for p in parts:
                    fh.write("file '%s'\n" % p.replace("'", "'\\''"))
            subprocess.run(
                ["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0",
                 "-i", listing, "-c", "copy", out], check=True)
        log("wrote %s  (%d clips, pauses included via ffmpeg)" % (cache.rel(out), len(segs)))
    else:
        with open(out, "wb") as dest:
            for seg in segs:
                with open(os.path.join(ROOT, seg["audio"]), "rb") as src:
                    shutil.copyfileobj(src, dest)
        log("wrote %s  (%d clips joined without gaps; install ffmpeg for manifest pauses)"
            % (cache.rel(out), len(segs)))
    return out
