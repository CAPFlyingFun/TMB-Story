#!/usr/bin/env python3
"""TMB audio pipeline CLI.

    python3 scripts/audio.py parse       [--chapters 1-3]
    python3 scripts/audio.py validate    [--chapters 1-3] [--show-review]
    python3 scripts/audio.py generate    [--chapters 1-3] [--missing] [--force ID|--force-chapter N|--force-speaker ID] [--dry-run]
    python3 scripts/audio.py combine     [--chapters 1-3]
    python3 scripts/audio.py export-game [--chapters 1-3]
    python3 scripts/audio.py voices

The repository's toolchain is Python 3 standard library (see scripts/build-manifest.py),
so this is a Python CLI rather than npm scripts. Generation is the only subcommand that
touches the network, needs ELEVENLABS_API_KEY, or can cost money.
"""

import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from tmbaudio import cache, manifest as mf  # noqa: E402
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
    from tmbaudio import combine
    files = mf.chapter_files()
    for n in parse_range(args.chapters, files):
        combine.combine_chapter(n, reg)


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


def main(argv=None):
    ap = argparse.ArgumentParser(description="TMB audio pipeline")
    sub = ap.add_subparsers(dest="cmd", required=True)
    for name in ("parse", "validate", "generate", "combine", "export-game"):
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
    sub.add_parser("voices")
    args = ap.parse_args(argv)
    reg = Registry()
    handlers = {
        "parse": cmd_parse, "validate": cmd_validate, "generate": cmd_generate,
        "combine": cmd_combine, "export-game": cmd_export_game, "voices": cmd_voices,
    }
    return handlers[args.cmd](args, reg) or 0


if __name__ == "__main__":
    sys.exit(main())
