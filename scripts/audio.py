#!/usr/bin/env python3
"""TMB audio pipeline CLI.

    python3 scripts/audio.py parse       [--chapters 1-3]
    python3 scripts/audio.py validate    [--chapters 1-3] [--show-review]
    python3 scripts/audio.py generate    [--chapters 1-3] [--missing] [--force ID|--force-chapter N|--force-speaker ID] [--dry-run]
    python3 scripts/audio.py combine     [--chapters 1-3]
    python3 scripts/audio.py export-game [--chapters 1-3]
    python3 scripts/audio.py voices
    python3 scripts/audio.py cues        [--chapters 1-3] [--timestamps]
    python3 scripts/audio.py sfx         [--chapters 1-3]
    python3 scripts/audio.py generate-sfx [--chapters 1-3] [--all] [--force-asset ID] [--dry-run]

The repository's toolchain is Python 3 standard library (see scripts/build-manifest.py),
so this is a Python CLI rather than npm scripts. Generation is the only subcommand that
touches the network, needs ELEVENLABS_API_KEY, or can cost money.
"""

import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from tmbaudio import cache, manifest as mf, sfx as sfxmod  # noqa: E402
from tmbaudio.registry import REVIEW, Registry, ROOT  # noqa: E402


def parse_range(spec, available):
    if not spec:
        return sorted(available)
    out = set()
    for part in str(spec).split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            a, b = part.split("-", 1)
            out.update(range(int(a), int(b) + 1))
        else:
            out.add(int(part))
    unknown = sorted(out - set(available))
    if unknown:
        sys.exit("no manuscript for chapter(s): %s" % ", ".join(map(str, unknown)))
    return sorted(out)


def cmd_parse(args, reg):
    files = mf.chapter_files()
    for n in parse_range(args.chapters, files):
        m = mf.build(n, files[n], reg)
        print("wrote %s  (%d segments, %d distinct clips)" % (
            mf.write(m), m["segmentCount"],
            len({s["clipId"] for s in m["segments"]})))


def cmd_validate(args, reg):
    files = mf.chapter_files()
    numbers = parse_range(args.chapters, files)
    all_ready = True
    all_missing = set()
    for n in numbers:
        m = mf.build(n, files[n], reg)
        mf.write(m)
        s = mf.summarize(m, reg)
        print("\nChapter %d — %s" % (s["chapter"], s["title"]))
        print("Segments: %d   Distinct clips: %d   Cached: %d   To generate: %d"
              % (s["segments"], s["distinctClips"], s["cachedClips"], s["toGenerate"]))
        print("")
        for sid, count in sorted(s["bySpeaker"].items(), key=lambda p: -p[1]):
            label = REVIEW if sid == REVIEW else reg.name(sid)
            flag = ""
            if sid != REVIEW and not reg.has_voice(sid):
                flag = "   << no voice assigned"
            print("  %-28s %4d%s" % (label, count, flag))
        print("\n  attribution method:")
        for method, count in sorted(s["byMethod"].items(), key=lambda p: -p[1]):
            note = "   (inference, review these)" if method == "alternation" else ""
            print("    %-28s %4d%s" % (method, count, note))
        print("\nMissing voice assignments: %s"
              % (", ".join(reg.name(x) for x in s["missingVoices"]) or "none"))
        print("Ambiguous speakers: %d" % len(s["reviewRequired"]))
        if s["reviewRequired"] and args.show_review:
            print("\n  needs pinning in audio/speaker-overrides.json:")
            for seg in s["reviewRequired"]:
                print("    %s  order %d  para %d" % (seg["clipId"], seg["order"], seg["paragraph"]))
                print('      text: "%s"' % seg["displayText"][:88])
                print("      why : %s" % seg["note"])
        print("READY FOR GENERATION: %s" % ("YES" if s["ready"] else "NO"))
        all_ready = all_ready and s["ready"]
        all_missing.update(s["missingVoices"])
    print("\n" + "=" * 62)
    if all_missing:
        print("BLOCKED. Assign an ElevenLabs voice for: %s"
              % ", ".join(reg.name(x) for x in sorted(all_missing)))
        print("Add the voice id to story-rules/voice-registry.json. Never invent one.")
    print("OVERALL READY FOR GENERATION: %s" % ("YES" if all_ready else "NO"))
    return 0 if all_ready else 1


# ---- sound effects and ambience -------------------------------------------
def _sfx_registry(reg):
    return sfxmod.SfxRegistry(config=reg.config)


def _chapter_cues(n, reg, sreg):
    files = mf.chapter_files()
    m = mf.build(n, files[n], reg, sfx_registry=sreg)
    doc = sfxmod.load_cues(n)
    resolved, problems = sfxmod.resolve_chapter_cues(m["segments"], doc, sreg)
    return m, resolved, problems


def _review_timestamps(manifest):
    """Approximate start time of each segment, for HUMAN REVIEW ONLY.

    Measured from the clips that exist plus the manifest's pauses. Regenerating one
    voice clip moves every number after it, which is exactly why cues anchor to clip
    identity instead. Never use these to synchronise anything.
    """
    at, t = {}, 0.0
    for seg in manifest["segments"]:
        t += (seg.get("pauseBeforeMs") or 0) / 1000.0
        at[seg["order"]] = t
        t += cache.mp3_duration_seconds(os.path.join(ROOT, seg["audio"]))
    return at


def _clock(seconds):
    return "%d:%05.2f" % (int(seconds // 60), seconds % 60)


def cmd_cues(args, reg):
    sreg = _sfx_registry(reg)
    files = mf.chapter_files()
    ok = True
    for n in parse_range(args.chapters, files):
        m, resolved, problems = _chapter_cues(n, reg, sreg)
        s = sfxmod.summarize_chapter(resolved, problems, sreg)
        by_order = {seg["order"]: seg for seg in m["segments"]}
        stamps = _review_timestamps(m) if args.timestamps else {}
        print("\nChapter %d — %s" % (n, m["title"]))
        print("Playback events: %d   Unique assets: %d" % (s["events"], s["uniqueAssets"]))
        if s["byCategory"]:
            print("  " + "   ".join("%s %d" % (k, v)
                                    for k, v in sorted(s["byCategory"].items())))
        print("")
        for c in resolved:
            seg = by_order.get(c["order"], {})
            when = ("  ~%s" % _clock(stamps[c["order"]])) if args.timestamps else ""
            sustain = ""
            if c.get("stopOrder") is not None:
                sustain = "  sustain->order %d" % c["stopOrder"]
            offset = "+%dms" % c["offsetMs"] if c.get("offsetMs") else ""
            print("  %-26s %-30s %-9s %-6s gain %.2f%s%s"
                  % (c["cueId"], c["asset"], c["timing"] + offset, c["category"],
                     c["gain"], sustain, when))
            print("        order %-4d %-14s \"%s\""
                  % (c["order"], seg.get("speakerName", ""), (seg.get("displayText") or "")[:58]))
        # A `during` offset past the end of its clip would silently never fire. Clip
        # lengths change when a voice is recast, so this is checked, not assumed.
        late = []
        for c in resolved:
            if not c.get("offsetMs"):
                continue
            seg = by_order.get(c["order"])
            if not seg:
                continue
            room = cache.mp3_duration_seconds(os.path.join(ROOT, seg["audio"])) * 1000 \
                - c["offsetMs"]
            if 0 < room < 250:
                late.append((c["cueId"], room))
            elif room <= 0:
                late.append((c["cueId"], room))
        if late:
            print("\n  OFFSETS AT OR PAST THE END OF THEIR CLIP (they would not be heard):")
            for cue_id, room in late:
                print("    %-26s %.0fms of room left" % (cue_id, room))
        if s["reusedAssets"]:
            print("\n  reused assets (one generation, several events):")
            for aid, count in s["reusedAssets"].items():
                print("    %-32s x%d" % (aid, count))
        if problems:
            ok = False
            print("\n  PROBLEMS:")
            for p in problems:
                for line in p["problems"]:
                    print("    %s: %s" % (p["cueId"], line))
        if args.timestamps:
            print("\n  Timestamps are APPROXIMATE and for review only. Cues anchor to clip"
                  "\n  identity, so regenerating a voice clip moves these numbers and moves"
                  "\n  nothing about the cue sheet.")
    return 0 if ok else 1


def cmd_sfx(args, reg):
    """What the cue sheets ask for, and what would have to be generated."""
    sreg = _sfx_registry(reg)
    files = mf.chapter_files()
    numbers = parse_range(args.chapters, files)
    wanted, problems = {}, []
    for n in numbers:
        _, resolved, probs = _chapter_cues(n, reg, sreg)
        problems.extend(probs)
        for c in resolved:
            wanted.setdefault(c["asset"], []).append(n)
    lo, hi = sreg.duration_limits()
    print("%-32s %-10s %-6s %-7s %-6s %s"
          % ("asset", "category", "loop", "secs", "godot", "state"))
    to_generate = []
    for aid in sorted(wanted):
        plan = sfxmod.plan_asset(sreg, aid)
        if plan["cached"]:
            state = "cached"
        elif plan["source"] == "generated":
            state = "to generate"
        elif plan["source"] == "procedural":
            # Not missing: built from its recipe by `build-procedural`, for free.
            state = "to build"
        else:
            state = "MISSING FILE"
        if not plan["cached"] and plan["source"] == "generated":
            to_generate.append(aid)
        dur = plan["durationSeconds"]
        flag = ""
        if plan["source"] == "generated" and dur is not None and not lo <= float(dur) <= hi:
            flag = "  << duration outside %.1f-%.1fs" % (lo, hi)
            problems.append({"cueId": aid, "problems": ["requested duration %s is outside the "
                                                        "provider's %.1f-%.1fs range" % (dur, lo, hi)]})
        # Prompt length is checked for free here, because discovering it by request
        # costs a call: a 476-character prompt was rejected twice with HTTP 400.
        prompt_len = len(plan.get("prompt") or "")
        if plan["source"] == "generated" and prompt_len > sreg.prompt_limit():
            flag = "  << prompt %d chars, over the %d limit" % (prompt_len, sreg.prompt_limit())
            problems.append({"cueId": aid, "problems": [
                "prompt is %d characters, over the measured %d-character limit; shorten it "
                "rather than spending a call to be refused" % (prompt_len, sreg.prompt_limit())]})
        print("%-32s %-10s %-6s %-7s %-6s %s%s"
              % (aid, plan["category"], "yes" if plan["loop"] else "no",
                 dur if dur is not None else "-",
                 "yes" if plan["godotReuse"] else "no", state, flag))
    unused = sorted(set(sreg.assets) - set(wanted))
    if unused:
        print("\nRegistered but not cued in chapter(s) %s: %s"
              % (", ".join(map(str, numbers)), ", ".join(unused)))
    print("\nUnique assets cued: %d   Already generated: %d   To generate: %d"
          % (len(wanted), len(wanted) - len(to_generate), len(to_generate)))
    if problems:
        print("\nPROBLEMS:")
        for p in problems:
            for line in p["problems"]:
                print("  %s: %s" % (p["cueId"], line))
    print("\nSFX READY FOR GENERATION: %s" % ("YES" if not problems else "NO"))
    return 0 if not problems else 1


def cmd_generate_sfx(args, reg):
    from tmbaudio import elevenlabs
    sreg = _sfx_registry(reg)
    files = mf.chapter_files()
    numbers = parse_range(args.chapters, files)
    wanted = set()
    blocked = False
    for n in numbers:
        _, resolved, probs = _chapter_cues(n, reg, sreg)
        if probs:
            blocked = True
            print("chapter %d has %d unresolved cue(s); fix those first." % (n, len(probs)))
        wanted.update(c["asset"] for c in resolved)
    if args.all:
        wanted = set(sreg.assets)
    if blocked:
        print("\nNothing was generated and no credit was spent.")
        return 1
    plans = []
    for aid in sorted(wanted):
        plan = sfxmod.plan_asset(sreg, aid)
        if plan["source"] != "generated":
            continue
        if plan["cached"] and args.force_asset != aid:
            continue
        plans.append(plan)
    if not plans:
        print("Nothing to generate. Every cued sound asset is cached and current.")
        return 0
    print("\n%d sound asset(s) to generate." % len(plans))
    for plan in plans:
        print("  %-32s %-10s %ss  \"%s\""
              % (plan["asset"], plan["category"], plan["durationSeconds"],
                 (plan["prompt"] or "")[:64]))
    if args.dry_run:
        print("\nDry run. No ElevenLabs request was made and no credit was used.")
        return 0
    ok, failed = elevenlabs.generate_all_sfx(plans, sreg)
    for n in numbers:
        mf.write(mf.build(n, files[n], reg, sfx_registry=sreg))
    print("\nGenerated %d, failed %d." % (ok, failed))
    return 1 if failed else 0


def cmd_build_procedural(args, reg):
    """Render every procedural asset. ffmpeg and arithmetic; no provider, no credits."""
    from tmbaudio import procedural as proc
    sreg = _sfx_registry(reg)
    try:
        built, failed = proc.build_all(sreg, force=args.force)
    except RuntimeError as exc:
        print(exc)
        return 1
    return 1 if failed else 0


def cmd_adopt_sfx(args, reg):
    """Register hand-supplied sound files: write each one's sidecar from its own bytes.

    A supplied asset has no prompt, so its identity IS its content. Until a sidecar
    records that, the report calls it a missing file -- true of the first file Joshua
    sent. This is also where the credit is checked, because a file we did not make
    does not go in without one.
    """
    from tmbaudio import cache as cachemod, normalize as norm
    import time
    sreg = _sfx_registry(reg)
    done = refused = 0
    for aid in sorted(sreg.assets):
        if sreg.source(aid) != "supplied":
            continue
        audio_rel, sidecar_rel = sfxmod.asset_paths(sreg, aid)
        audio_abs = os.path.join(ROOT, audio_rel)
        if not os.path.isfile(audio_abs):
            print("  %-30s no file at %s" % (aid, audio_rel))
            refused += 1
            continue
        bad = sfxmod.credit_problems(sreg, aid)
        if bad:
            print("  %-30s REFUSED: %s" % (aid, bad[0]))
            refused += 1
            continue
        plan = sfxmod.plan_asset(sreg, aid)
        seconds = cachemod.mp3_duration_seconds(audio_abs)
        declared = sreg.get(aid).get("durationSeconds")
        note = ""
        if declared and abs(float(declared) - seconds) > 0.5:
            note = ("   << registry says %.2f s, the file is %.2f s"
                    % (float(declared), seconds))
        cachemod.write_sidecar(os.path.join(ROOT, sidecar_rel), {
            "asset": aid,
            "source": "supplied",
            "category": plan["category"],
            "loop": plan["loop"],
            "fingerprint": plan["fingerprint"],
            "bytes": os.path.getsize(audio_abs),
            "measuredSeconds": round(seconds, 2),
            "credit": sreg.get(aid).get("credit"),
            "adopted": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        })
        print("  %-30s %7.2f s  %s%s"
              % (aid, seconds, (sreg.get(aid).get("credit") or {}).get("author", "?"), note))
        done += 1
    print("\nAdopted %d supplied asset(s), refused %d." % (done, refused))
    return 1 if refused else 0


def cmd_credits(args, reg):
    """Write the attribution page from the registry, so the two cannot drift."""
    sreg = _sfx_registry(reg)
    rows = sfxmod.credits(sreg)
    out = os.path.join(ROOT, "story-rules", "reference", "AUDIO_CREDITS.md")
    lines = [
        "# Audio credits",
        "",
        "**Generated by `python3 scripts/audio.py credits`. Do not edit by hand.**",
        "Every entry comes from the `credit` block of a `source: \"supplied\"` asset in",
        "`audio/sfx-registry.json`, which is the one place a supplied file's provenance",
        "lives. Validation refuses a supplied file that has no credit, so this page",
        "cannot fall behind the audio.",
        "",
        "Voice audio is generated with ElevenLabs from the manuscript and needs no",
        "third-party attribution. Generated sound effects carry their prompt instead of a",
        "credit: they have no author but this project.",
        "",
    ]
    if not rows:
        lines += ["No supplied audio yet. Everything in the repository is generated.", ""]
    else:
        lines += ["| sound | used as | by | from | licence |", "|---|---|---|---|---|"]
        for c in rows:
            author = c.get("author", "")
            if c.get("authorUrl"):
                author = "[%s](%s)" % (author, c["authorUrl"])
            src = c.get("source", "")
            if c.get("sourceUrl"):
                src = "[%s](%s)" % (src, c["sourceUrl"])
            lic = c.get("license", "")
            if c.get("licenseUrl"):
                lic = "[%s](%s)" % (lic, c["licenseUrl"])
            lines.append("| %s | `%s` | %s | %s | %s |"
                         % (c.get("title", ""), c["asset"], author, src, lic))
        lines += ["", "## Attribution, as shown at the bottom of the page", "",
                  "These are the exact lines the site displays. They are derived from the",
                  "fields above, so an author corrected in one place cannot leave a",
                  "hand-written sentence saying something else.", ""]
        for c in rows:
            lines.append("- **%s** (`%s`): %s" % (c.get("title", ""), c["asset"],
                                                  c.get("attributionLine", "")))
        lines += ["", "## Added", ""]
        for c in rows:
            lines.append("- `%s` — %s, added by %s on %s."
                         % (c["asset"], c.get("title", ""),
                            c.get("addedBy", "?"), c.get("addedOn", "?")))
        lines.append("")
    with open(out, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))
    print("wrote %s  (%d supplied asset(s))" % (cache.rel(out), len(rows)))

    # The same credits as data, for the page to show at the bottom. Generated from the
    # registry like the markdown, so the site, the repository record and the audio
    # cannot disagree with one another.
    feed = os.path.join(ROOT, "reader", "credits.json")
    with open(feed, "w", encoding="utf-8") as fh:
        json.dump({
            "_comment": ["Generated by scripts/audio.py credits. Do not edit by hand.",
                         "Shown in the page footer. Every line comes from a supplied",
                         "asset's credit block in audio/sfx-registry.json."],
            "attributions": [
                {"asset": c["asset"], "title": c.get("title", ""),
                 "text": c.get("attributionLine", ""),
                 "authorUrl": c.get("authorUrl", ""), "sourceUrl": c.get("sourceUrl", "")}
                for c in rows if c.get("attributionLine")
            ],
        }, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
    print("wrote %s  (footer credits for the page)" % cache.rel(feed))
    return 0


def cmd_retune_cues(args, reg):
    """Derive every cue gain from the level its asset actually has. Free."""
    from tmbaudio import mixtune
    sreg = _sfx_registry(reg)
    numbers = parse_range(args.chapters, mf.chapter_files())
    mixtune.retune(numbers, sreg, dry_run=args.dry_run)
    return 0


def cmd_normalize_sfx(args, reg):
    """Bake a level into the generated assets. Free: decodes and re-encodes locally,
    and never touches a generation fingerprint, so no run spends a credit for it."""
    from tmbaudio import normalize as norm
    sreg = _sfx_registry(reg)
    files = mf.chapter_files()
    if args.all or not args.chapters:
        wanted = set(sreg.assets)
    else:
        wanted = set()
        for n in parse_range(args.chapters, files):
            _, resolved, _ = _chapter_cues(n, reg, sreg)
            wanted.update(c["asset"] for c in resolved)
    if args.asset:
        if args.asset not in sreg.assets:
            print("no such asset: %s" % args.asset)
            return 1
        wanted = {args.asset}
    try:
        done, failed = norm.normalize_assets(
            sreg, wanted, force=args.force, allow_attenuation=args.allow_attenuation,
            dry_run=args.dry_run)
    except RuntimeError as exc:
        print(exc)
        return 1
    return 1 if failed else 0


def cmd_voices(args, reg):
    print("%-30s %-10s %-26s %s" % ("speaker", "audioKey", "voice id", "game export"))
    for sid, s in reg.speakers.items():
        vid = s.get("elevenLabsVoiceId") or "-- UNASSIGNED --"
        print("%-30s %-10s %-26s %s" % (s["name"], s.get("audioKey", ""), vid,
                                        "yes" if s.get("gameExport") else "no"))
    print("\nVoice ids are not secrets. The ELEVENLABS_API_KEY is, and is read from the"
          "\nenvironment at generation time only.")


def cmd_generate(args, reg):
    from tmbaudio import elevenlabs
    files = mf.chapter_files()
    numbers = parse_range(args.chapters, files)
    scene = None
    if getattr(args, "scene", False):
        with open(os.path.join(ROOT, "audio", "test-scene.json"), encoding="utf-8") as fh:
            scene = json.load(fh)
        numbers = [scene["chapter"]]
        print("Audition scene: chapter %d, segments %d-%d."
              % (scene["chapter"], scene["firstOrder"], scene["lastOrder"]))
    jobs, seen = [], set()
    blocked = set()
    for n in numbers:
        m = mf.build(n, files[n], reg)
        mf.write(m)
        s = mf.summarize(m, reg)
        if not s["ready"]:
            blocked.add(n)
            if s["missingVoices"]:
                print("chapter %d blocked: no voice for %s"
                      % (n, ", ".join(reg.name(x) for x in s["missingVoices"])))
            if s["reviewRequired"]:
                print("chapter %d blocked: %d segment(s) need review"
                      % (n, len(s["reviewRequired"])))
            continue
        for seg in m["segments"]:
            if scene and not (scene["firstOrder"] <= seg["order"] <= scene["lastOrder"]):
                continue
            if seg["clipId"] in seen:
                continue
            seen.add(seg["clipId"])
            force = (
                args.force == seg["clipId"]
                or (args.force_chapter is not None and int(args.force_chapter) == n)
                or (args.force_speaker is not None and args.force_speaker == seg["speaker"])
            )
            if seg["cached"] and not force:
                continue
            jobs.append(seg)
    if blocked:
        print("\nRefusing to generate for chapter(s) %s until validation passes."
              % ", ".join(map(str, sorted(blocked))))
    if not jobs:
        if blocked:
            print("Nothing was generated and no credit was spent.")
            return 1
        print("Nothing to generate. Every required clip is cached and current.")
        return 0
    print("\n%d clip(s) to generate (%d already cached and skipped)."
          % (len(jobs), len(seen) - len(jobs)))
    if args.dry_run:
        for seg in jobs[:40]:
            print("  would generate %s  [%s]  \"%s\""
                  % (seg["clipId"], reg.name(seg["speaker"]), seg["displayText"][:60]))
        if len(jobs) > 40:
            print("  ... and %d more" % (len(jobs) - 40))
        print("\nDry run. No ElevenLabs request was made and no credit was used.")
        return 0
    ok, failed = elevenlabs.generate_all(jobs, reg)
    # rebuild so the manifests record the new cache state
    for n in numbers:
        if n not in blocked:
            mf.write(mf.build(n, files[n], reg))
    print("\nGenerated %d, failed %d." % (ok, failed))
    return 1 if failed else 0


def cmd_combine(args, reg):
    from tmbaudio import combine, drama
    files = mf.chapter_files()
    for n in parse_range(args.chapters, files):
        combine.combine_chapter(n, reg)
        if not getattr(args, "no_drama", False):
            try:
                sreg = _sfx_registry(reg)
            except (OSError, ValueError):
                continue
            # A convenience output. A failure here must never cost the assets that
            # were just generated, so it is reported and the run continues.
            try:
                drama.export_chapter(n, reg, sreg)
            except Exception as exc:                  # noqa: BLE001
                print("  drama export for chapter %d failed: %s" % (n, exc))
                print("  the voice clips, ambience and effects are all unaffected.")


def cmd_export_game(args, reg):
    files = mf.chapter_files()
    numbers = parse_range(args.chapters, files)
    for n in numbers:
        if not os.path.isfile(os.path.join(ROOT, "audio", "manifests", "chapter-%02d.json" % n)):
            mf.write(mf.build(n, files[n], reg))
    data = mf.game_export(numbers, reg)
    out = os.path.join(ROOT, "audio", "game", "dialogue.json")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
    print("wrote %s  (%d line(s), narration excluded)" % (cache.rel(out), data["lineCount"]))

    # The same command refreshes the sound-asset export, so the two never drift.
    try:
        sreg = _sfx_registry(reg)
    except (OSError, ValueError):
        return
    sfx_data = sfxmod.game_export(sorted(mf.chapter_files()), sreg)
    sfx_out = os.path.join(ROOT, "audio", "game", "sfx.json")
    with open(sfx_out, "w", encoding="utf-8") as fh:
        json.dump(sfx_data, fh, indent=2, ensure_ascii=False)
        fh.write("\n")
    print("wrote %s  (%d sound asset(s) the game may reuse)"
          % (cache.rel(sfx_out), sfx_data["assetCount"]))


def main(argv=None):
    ap = argparse.ArgumentParser(description="TMB audio pipeline")
    sub = ap.add_subparsers(dest="cmd", required=True)
    for name in ("parse", "validate", "generate", "combine", "export-game",
                 "cues", "sfx", "generate-sfx", "normalize-sfx", "retune-cues",
                 "adopt-sfx", "credits", "build-procedural"):
        p = sub.add_parser(name)
        p.add_argument("--chapters", help="e.g. 1, 1-3, 1,3")
        if name == "validate":
            p.add_argument("--show-review", action="store_true",
                           help="print every segment that needs a pinned speaker")
        if name == "generate":
            p.add_argument("--missing", action="store_true",
                           help="default behaviour: generate only what is missing or changed")
            p.add_argument("--force", metavar="CLIP_ID", help="force one clip")
            p.add_argument("--force-chapter", metavar="N", help="force a whole chapter")
            p.add_argument("--force-speaker", metavar="SPEAKER_ID", help="force one speaker's clips")
            p.add_argument("--dry-run", action="store_true",
                           help="show what would be generated; makes no request")
            p.add_argument("--scene", action="store_true",
                           help="only the audition scene in audio/test-scene.json")
        if name == "combine":
            p.add_argument("--no-drama", action="store_true",
                           help="voices only; skip the layered audio-drama export")
        if name == "cues":
            p.add_argument("--timestamps", action="store_true",
                           help="approximate clock times, for human review only")
        if name == "build-procedural":
            p.add_argument("--force", action="store_true",
                           help="rebuild even when the recipe has not changed")
        if name == "retune-cues":
            p.add_argument("--dry-run", action="store_true",
                           help="show the gains that would change; writes nothing")
        if name == "normalize-sfx":
            p.add_argument("--all", action="store_true",
                           help="every registered asset, not only the cued ones")
            p.add_argument("--asset", metavar="ASSET_ID", default=None,
                           help="normalise one asset only")
            p.add_argument("--force", action="store_true",
                           help="redo assets already normalised at this target")
            p.add_argument("--allow-attenuation", action="store_true",
                           help="also turn DOWN assets above the target (off by default: "
                                "nothing already approved gets quieter by accident)")
            p.add_argument("--dry-run", action="store_true",
                           help="show the gains; writes nothing")
        if name == "generate-sfx":
            p.add_argument("--all", action="store_true",
                           help="every registered asset, not only the cued ones")
            p.add_argument("--force-asset", metavar="ASSET_ID", default=None,
                           help="regenerate one asset even though it is cached")
            p.add_argument("--dry-run", action="store_true",
                           help="show what would be generated; makes no request")
    sub.add_parser("voices")
    args = ap.parse_args(argv)
    reg = Registry()
    handlers = {
        "parse": cmd_parse, "validate": cmd_validate, "generate": cmd_generate,
        "combine": cmd_combine, "export-game": cmd_export_game, "voices": cmd_voices,
        "cues": cmd_cues, "sfx": cmd_sfx, "generate-sfx": cmd_generate_sfx,
        "normalize-sfx": cmd_normalize_sfx, "retune-cues": cmd_retune_cues,
        "adopt-sfx": cmd_adopt_sfx, "credits": cmd_credits,
        "build-procedural": cmd_build_procedural,
    }
    return handlers[args.cmd](args, reg) or 0


if __name__ == "__main__":
    sys.exit(main())
