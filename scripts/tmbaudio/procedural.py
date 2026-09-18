"""Sounds built from arithmetic, so the loop is seamless by construction.

Joshua, on chapter 3's opening: "The siren doesn't loop cleanly, so maybe do a
procedural sound until I find one that works and loops."

That is the right instinct, and it is stronger than a workaround. A recorded loop is
seamless only if someone matched its ends by ear. A SYNTHESISED one can be seamless
because the maths says so: if every component's phase returns to where it started at
the end of the file, the join is silent, and that is checkable rather than hopeful.

A siren is a tone whose pitch sweeps, so its phase is the INTEGRAL of its frequency:

    f(t)     = centre + sweep * sin(2*pi*t / period)
    phase(t) = 2*pi*centre*t - sweep*period*cos(2*pi*t / period)

Writing sin(2*pi*f(t)*t) instead -- the obvious-looking thing -- is not a sweeping
tone at all, and it does not close. Two conditions make the file loop exactly:

1. `seconds` is a whole number of sweep `period`s, so the cosine term returns.
2. `centre * seconds` is a whole number, so the carrier returns.

Both are checked before anything is written, and a recipe that fails is refused with
the arithmetic rather than rendered and left to sound wrong.

Nothing here calls a provider. It is ffmpeg and a formula, so a procedural asset
costs nothing to rebuild and can be retuned as often as it takes.
"""

import hashlib
import json
import math
import os
import shutil
import subprocess

from . import cache, sfx as sfxmod
from .registry import ROOT

DEFAULT_SAMPLE_RATE = 44100
DEFAULT_KBPS = 64


def ffmpeg():
    exe = shutil.which("ffmpeg")
    if not exe:
        raise RuntimeError("ffmpeg is not on the path; procedural audio is built with it.")
    return exe


def recipe_fingerprint(recipe):
    """The recipe IS the asset. Change a number, rebuild; change nothing, rebuild nothing."""
    return hashlib.sha256(
        json.dumps(recipe, sort_keys=True, separators=(",", ":")).encode("utf-8")
    ).hexdigest()


def seam_problems(recipe):
    """Every reason this recipe would not loop cleanly, as plain sentences.

    A recipe that does NOT loop is exempt, and that is the point rather than a let-off:
    a one-shot may fade, and a fade is exactly what a loop must not have.
    """
    if recipe.get("loop") is False or recipe.get("kind") == "winddown":
        return []
    problems = []
    seconds = float(recipe.get("seconds") or 0)
    if seconds <= 0:
        return ["seconds must be positive"]
    units = recipe.get("units") or []
    if not units:
        return ["a recipe needs at least one unit"]
    for i, u in enumerate(units):
        period = float(u.get("periodSeconds") or 0)
        centre = float(u.get("centreHz") or 0)
        if period <= 0 or centre <= 0:
            problems.append("unit %d needs a positive centreHz and periodSeconds" % i)
            continue
        cycles = seconds / period
        if abs(cycles - round(cycles)) > 1e-9:
            problems.append(
                "unit %d sweeps every %gs, which does not divide the %gs file (%.3f "
                "cycles): the sweep would be cut mid-stroke at the loop point"
                % (i, period, seconds, cycles))
        turns = centre * seconds
        if abs(turns - round(turns)) > 1e-6:
            problems.append(
                "unit %d centres on %g Hz, and %g x %g = %.4f is not a whole number of "
                "cycles: the carrier would jump at the loop point"
                % (i, centre, centre, seconds, turns))
    return problems


def winddown_expression(recipe):
    """A siren losing power: it holds, then its pitch falls away.

    Same principle -- phase is the integral of frequency -- with a frequency that
    decays instead of sweeping:

        f(t)     = start                       while t < hold
                 = start * exp(-(t-hold)/tau)  after
        phase(t) = 2*pi*[ start*min(t,hold) + start*tau*(1 - exp(-max(0,t-hold)/tau)) ]

    Nothing here has to close, because this one is played once.
    """
    start = float(recipe["startHz"])
    hold = float(recipe.get("holdSeconds") or 0)
    tau = float(recipe.get("tauSeconds") or 2)
    level = float(recipe.get("level") or 0.5)
    phase = ("2*PI*(%g*min(t,%g)+%g*(1-exp(-max(0,t-%g)/%g)))"
             % (start, hold, start * tau, hold, tau))
    return "%g*sin(%s)" % (level, phase)


def expression(recipe):
    """The ffmpeg `aevalsrc` expression: the summed phase integrals, as written above."""
    if recipe.get("kind") == "winddown":
        return winddown_expression(recipe)
    parts = []
    for u in recipe.get("units") or []:
        centre = float(u["centreHz"])
        sweep = float(u.get("sweepHz") or 0)
        period = float(u["periodSeconds"])
        level = float(u.get("level") or 0.3)
        phase = "2*PI*%g*t" % centre
        if sweep:
            phase += "-%g*cos(2*PI*t/%g)" % (sweep * period, period)
        parts.append("%g*sin(%s)" % (level, phase))
    return "+".join(parts)


def build_one(registry, asset_id, log=print):
    """Render one procedural asset. Refuses a recipe whose loop would not close."""
    asset = registry.get(asset_id) or {}
    recipe = asset.get("recipe") or {}
    problems = seam_problems(recipe)
    if problems:
        raise RuntimeError("%s: %s" % (asset_id, "; ".join(problems)))

    audio_rel, sidecar_rel = sfxmod.asset_paths(registry, asset_id)
    audio_abs = os.path.join(ROOT, audio_rel)
    os.makedirs(os.path.dirname(audio_abs), exist_ok=True)
    rate = int(recipe.get("sampleRate") or DEFAULT_SAMPLE_RATE)
    seconds = float(recipe["seconds"])
    ext = sfxmod.asset_extension(registry, asset_id)

    # A comma separates FILTERS in a filtergraph, so any comma inside the expression --
    # min(), max(), exp() all take them -- has to be escaped or ffmpeg reads the rest of
    # the formula as a second filter.
    src = "aevalsrc=exprs=%s:d=%g:s=%d" % (expression(recipe).replace(",", "\\,"),
                                           seconds, rate)
    chain = []
    if recipe.get("lowpassHz"):
        # Heard through a wall, which is what the manuscript says. A filter, not a
        # fade -- a fade would put a seam back in.
        chain.append("lowpass=f=%g" % float(recipe["lowpassHz"]))
    if recipe.get("highpassHz"):
        chain.append("highpass=f=%g" % float(recipe["highpassHz"]))
    # Fades belong ONLY to a one-shot. On a loop they would put back the seam the whole
    # module exists to remove, so they are refused rather than quietly ignored.
    fade_in = float(recipe.get("fadeInMs") or 0) / 1000.0
    fade_out = float(recipe.get("fadeOutMs") or 0) / 1000.0
    if (fade_in or fade_out) and recipe.get("loop") is not False \
            and recipe.get("kind") != "winddown":
        raise RuntimeError("%s: a looping recipe cannot have fades; that is a seam"
                           % asset_id)
    if fade_in:
        chain.append("afade=t=in:st=0:d=%g" % fade_in)
    if fade_out:
        chain.append("afade=t=out:st=%g:d=%g" % (max(0.0, seconds - fade_out), fade_out))

    tmp = audio_abs + ".part"
    cmd = [ffmpeg(), "-v", "error", "-y", "-f", "lavfi", "-i", src]
    if chain:
        cmd += ["-af", ",".join(chain)]
    # A LOOP IS WRITTEN AS WAV, and this is the whole reason the first procedural siren
    # still did not loop. The waveform closed exactly; the CONTAINER did not. An mp3
    # carries encoder delay in front and padding behind, a browser's `<audio loop>`
    # plays both, and the file comes back late every single time round.
    #
    # WAV stores an exact sample count, so the last sample is followed by the first.
    # It costs almost nothing here because these sirens are band-limited by design:
    # filtered to a few hundred hertz, 8 kHz is a lossless rate for them, and twelve
    # seconds of 8 kHz mono is under 200 KB.
    if ext == "wav":
        cmd += ["-c:a", "pcm_s16le", "-ar", str(rate), "-ac", "1", "-f", "wav", tmp]
    else:
        cmd += ["-c:a", "libmp3lame",
                "-b:a", "%dk" % int(recipe.get("kbps") or DEFAULT_KBPS),
                "-ar", str(rate), "-ac", "1", "-f", "mp3", tmp]
    subprocess.run(cmd, check=True)
    os.replace(tmp, audio_abs)

    cache.write_sidecar(os.path.join(ROOT, sidecar_rel), {
        "asset": asset_id,
        "source": "procedural",
        "category": registry.category(asset_id),
        "loop": registry.loops(asset_id),
        "recipe": recipe,
        "recipeFingerprint": recipe_fingerprint(recipe),
        "fingerprint": sfxmod.content_fingerprint(audio_abs),
        "bytes": os.path.getsize(audio_abs),
        "seconds": seconds,
        "format": ext,
        "expression": expression(recipe),
    })
    log("  %-30s %6.2f s  %s" % (asset_id, seconds, expression(recipe)[:60] + "..."))
    return audio_rel


def build_all(registry, force=False, log=print):
    built = skipped = failed = 0
    for aid in sorted(registry.assets):
        if registry.source(aid) != "procedural":
            continue
        recipe = (registry.get(aid) or {}).get("recipe") or {}
        audio_rel, sidecar_rel = sfxmod.asset_paths(registry, aid)
        side = cache.read_sidecar(os.path.join(ROOT, sidecar_rel)) or {}
        current = (side.get("recipeFingerprint") == recipe_fingerprint(recipe)
                   and os.path.isfile(os.path.join(ROOT, audio_rel)))
        if current and not force:
            skipped += 1
            continue
        try:
            build_one(registry, aid, log=log)
            built += 1
        except Exception as exc:                 # noqa: BLE001 - reported, not raised
            failed += 1
            log("  FAILED %s: %s" % (aid, exc))
    log("\nBuilt %d procedural asset(s), %d already current, %d failed."
        % (built, skipped, failed))
    return built, failed
