#!/usr/bin/env python3
"""Tests for the TMB audio pipeline.

Run: python3 scripts/tests/test_audio.py

These tests NEVER call ElevenLabs. Every generation test replaces the HTTP request with
a local fake, and one test asserts that no API key can reach any output file.
"""

import json
import os
import re
import subprocess
import shutil
import sys
import tempfile
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))          # scripts/

from tmbaudio import cache, elevenlabs, manifest as mf, parse          # noqa: E402
from tmbaudio.parse import clip_id, split_paragraph                    # noqa: E402
from tmbaudio.registry import NARRATOR, REVIEW, SYSTEM, Registry       # noqa: E402

FAKE_AUDIO = b"ID3fake-mp3-bytes-for-testing"

REG_DATA = {
    "speakers": {
        "narrator": {"id": "narrator", "name": "Narrator", "audioKey": "narrator",
                     "kind": "narration", "elevenLabsVoiceId": None,
                     "voiceVersion": 1, "gameExport": False},
        "system": {"id": "system", "name": "System", "audioKey": "system",
                   "kind": "system", "elevenLabsVoiceId": "SYSVOICE",
                   "voiceVersion": 1, "gameExport": True},
        "jack-bennett": {"id": "jack-bennett", "name": "Jack Bennett", "audioKey": "jack",
                         "kind": "character", "elevenLabsVoiceId": "JACKVOICE",
                         "voiceVersion": 1, "gameExport": True,
                         "aliases": ["Jack"], "pronouns": ["he", "him", "his"]},
        "sarah-bennett": {"id": "sarah-bennett", "name": "Sarah Bennett", "audioKey": "sarah",
                          "kind": "character", "elevenLabsVoiceId": "SARAHVOICE",
                          "voiceVersion": 1, "gameExport": True,
                          "aliases": ["Sarah"], "pronouns": ["she", "her", "hers"]},
        "lena-ortiz": {"id": "lena-ortiz", "name": "Lena Ortiz", "audioKey": "lena",
                       "kind": "character", "elevenLabsVoiceId": None,
                       "voiceVersion": 1, "gameExport": True,
                       "aliases": ["Lena"], "pronouns": ["she", "her", "hers"]},
    }
}

CFG = {
    "model": "test_model",
    "outputFormat": "mp3_44100_128",
    "defaultSettings": {"stability": 0.5, "similarity_boost": 0.75},
    "speakerSettings": {"sarah-bennett": {"stability": 0.6}},
    "pausesMs": {"narration-dialogue": 320, "dialogue-differentSpeaker": 420, "default": 300},
    "generation": {"concurrency": 1, "maxRetries": 2, "baseBackoffSeconds": 0,
                   "requestTimeoutSeconds": 5},
    "systemLines": {"exact": ["Warning. unauthorized system access.", "Access denied."]},
}


def reg():
    return Registry(data=json.loads(json.dumps(REG_DATA)), config=json.loads(json.dumps(CFG)))


CHAPTER = """---
chapter: 9
title: "Fixture"
---

# Chapter 9: Fixture

It was late.

"Warning. unauthorized system access." Jack jerked awake. "What? Okay, I'm awake."

Jack pulled up the power diagnostic. "The array shouldn't even have power."

"I'm here," Sarah answered through the speaker. "What's wrong?"

She leaned over his shoulder. "Jack."

"Access denied." He tried a second route.

Somebody spoke in an empty room.

"Unattributable line with no signal at all."
"""


class ParsingTests(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.mkdtemp()
        self.path = os.path.join(self.dir, "chapter-0009.md")
        with open(self.path, "w", encoding="utf-8") as fh:
            fh.write(CHAPTER)

    def tearDown(self):
        shutil.rmtree(self.dir, ignore_errors=True)

    def parsed(self):
        return parse.parse_chapter(self.path, reg())["segments"]

    def test_paragraph_splits_into_narration_and_quotes(self):
        spans = split_paragraph('Jack pulled up the diagnostic. "No power." He frowned.')
        self.assertEqual([s[0] for s in spans], ["narration", "quote", "narration"])
        self.assertEqual(spans[1][1], "No power.")

    def test_narration_and_dialogue_are_separate_segments(self):
        """The example from the brief must become two segments, not one."""
        segs = self.parsed()
        pair = [s for s in segs if "power diagnostic" in s["displayText"]
                or "array shouldn't even have power" in s["displayText"]]
        self.assertEqual(len(pair), 2)
        narr = [s for s in pair if s["speaker"] == NARRATOR]
        line = [s for s in pair if s["speaker"] == "jack-bennett"]
        self.assertEqual(len(narr), 1)
        self.assertEqual(len(line), 1)
        self.assertEqual(narr[0]["displayText"], "Jack pulled up the power diagnostic.")
        self.assertEqual(line[0]["displayText"], "The array shouldn't even have power.")

    def test_system_readout_attributed_to_system_not_to_a_character(self):
        segs = self.parsed()
        warn = next(s for s in segs if s["displayText"].startswith("Warning."))
        self.assertEqual(warn["speaker"], SYSTEM)
        self.assertEqual(warn["method"], "system-line")

    def test_quote_after_a_system_line_does_not_inherit_the_system_voice(self):
        segs = self.parsed()
        awake = next(s for s in segs if "Okay, I'm awake" in s["displayText"])
        self.assertEqual(awake["speaker"], "jack-bennett")

    def test_explicit_tag_attribution(self):
        segs = self.parsed()
        here = next(s for s in segs if s["displayText"] == "I'm here,")
        self.assertEqual(here["speaker"], "sarah-bennett")
        self.assertEqual(here["method"], "explicit-tag")

    def test_pronoun_actor_resolves_to_the_most_recently_named_character(self):
        segs = self.parsed()
        jack_call = next(s for s in segs if s["displayText"] == "Jack.")
        self.assertEqual(jack_call["speaker"], "sarah-bennett")
        self.assertEqual(jack_call["method"], "pronoun-actor")

    def test_bare_quote_inference_is_labelled_not_presented_as_certain(self):
        """A lone quote in a two-hander may be inferred, but must say so."""
        segs = self.parsed()
        orphan = next(s for s in segs if "Unattributable line" in s["displayText"])
        self.assertEqual(orphan["method"], "alternation")
        self.assertIn("inferred", orphan["note"])

    def test_quote_with_no_signal_at_all_is_flagged_never_guessed(self):
        att = parse.Attributor(reg())
        sid, method, note = att.attribute(
            "Who said this?", before="", after="", speaker_in_paragraph=None,
            lone_paragraph_quote=False)
        self.assertEqual(sid, REVIEW)
        self.assertEqual(method, "unresolved")
        self.assertTrue(note)

    def test_alternation_never_fires_without_two_known_speakers(self):
        att = parse.Attributor(reg())
        sid, method, _ = att.attribute("Hello.", "", "", None, lone_paragraph_quote=True)
        self.assertEqual(sid, REVIEW, "must not invent a speaker from an empty history")

    def test_overrides_pin_a_reviewed_speaker(self):
        segs = self.parsed()
        orphan = next(s for s in segs if "Unattributable line" in s["displayText"])
        overrides = {orphan["clipId"]: {"speaker": "sarah-bennett", "note": "reviewed"}}
        again = parse.parse_chapter(self.path, reg(), overrides)["segments"]
        fixed = next(s for s in again if "Unattributable line" in s["displayText"])
        self.assertEqual(fixed["speaker"], "sarah-bennett")
        self.assertEqual(fixed["method"], "override")

    def test_order_is_recorded_and_monotonic(self):
        segs = self.parsed()
        self.assertEqual([s["order"] for s in segs], list(range(len(segs))))

    def test_clip_identity_is_independent_of_position(self):
        """Inserting a paragraph at the top must not change any other clip id."""
        before = {s["displayText"]: s["clipId"] for s in self.parsed()}
        with open(self.path, encoding="utf-8") as fh:
            text = fh.read()
        text = text.replace("It was late.", "A brand new opening paragraph.\n\nIt was late.")
        with open(self.path, "w", encoding="utf-8") as fh:
            fh.write(text)
        after = {s["displayText"]: s["clipId"] for s in self.parsed()}
        for display, cid in before.items():
            self.assertEqual(after.get(display), cid,
                             "clip id moved for: %s" % display)

    def test_identical_line_by_same_speaker_shares_one_clip(self):
        self.assertEqual(clip_id("jack-bennett", "Yes."), clip_id("jack-bennett", "Yes."))
        self.assertNotEqual(clip_id("jack-bennett", "Yes."), clip_id("sarah-bennett", "Yes."))

    def test_variant_forces_a_distinct_clip(self):
        self.assertNotEqual(clip_id("jack-bennett", "Yes."),
                            clip_id("jack-bennett", "Yes.", "angry"))


class FingerprintTests(unittest.TestCase):
    def setUp(self):
        self.r = reg()

    def fp(self, speaker, text):
        return cache.fingerprint(text, self.r.voice_id(speaker),
                                 self.r.voice_version(speaker), self.r.model(),
                                 self.r.output_format(), self.r.settings_for(speaker))

    def test_same_inputs_give_the_same_fingerprint(self):
        self.assertEqual(self.fp("jack-bennett", "Hello."), self.fp("jack-bennett", "Hello."))

    def test_changed_text_changes_only_that_fingerprint(self):
        a, b = self.fp("jack-bennett", "One."), self.fp("jack-bennett", "Two.")
        self.assertNotEqual(a, b)
        self.assertEqual(a, self.fp("jack-bennett", "One."))

    def test_changed_voice_id_changes_the_fingerprint(self):
        settings = self.r.settings_for("jack-bennett")
        a = cache.fingerprint("Hello.", "JACKVOICE", 1, CFG["model"], CFG["outputFormat"], settings)
        b = cache.fingerprint("Hello.", "RECAST", 1, CFG["model"], CFG["outputFormat"], settings)
        self.assertNotEqual(a, b)

    def test_voice_version_bump_invalidates_that_speaker_only(self):
        jack_before = self.fp("jack-bennett", "Hello.")
        sarah_before = self.fp("sarah-bennett", "Hello.")
        bumped = cache.fingerprint("Hello.", "JACKVOICE", 2, CFG["model"],
                                   CFG["outputFormat"], self.r.settings_for("jack-bennett"))
        self.assertNotEqual(jack_before, bumped)
        self.assertEqual(sarah_before, self.fp("sarah-bennett", "Hello."))

    def test_speaker_settings_override_affects_only_that_speaker(self):
        self.assertEqual(self.r.settings_for("sarah-bennett")["stability"], 0.6)
        self.assertEqual(self.r.settings_for("jack-bennett")["stability"], 0.5)


class GenerationTests(unittest.TestCase):
    """All of these use a fake transport. No ElevenLabs request is ever made."""

    def setUp(self):
        self.dir = tempfile.mkdtemp()
        self.orig_clips = cache.CLIPS_DIR
        cache.CLIPS_DIR = os.path.join(self.dir, "clips")
        self.orig_request = elevenlabs._request
        self.calls = []
        os.environ["ELEVENLABS_API_KEY"] = "test-key-never-written"
        self.r = reg()

    def tearDown(self):
        cache.CLIPS_DIR = self.orig_clips
        elevenlabs._request = self.orig_request
        os.environ.pop("ELEVENLABS_API_KEY", None)
        shutil.rmtree(self.dir, ignore_errors=True)

    def fake_ok(self, *a, **k):
        self.calls.append(a)
        return FAKE_AUDIO

    def seg(self, speaker="jack-bennett", text="Hello."):
        s = {"speaker": speaker, "ttsText": text, "displayText": text,
             "clipId": clip_id(speaker, text)}
        return cache.plan_segment(self.r, s)

    def test_generates_then_skips_when_unchanged(self):
        elevenlabs._request = self.fake_ok
        s = self.seg()
        self.assertEqual(elevenlabs.generate_one(s, self.r, log=lambda *a: None), "generated")
        self.assertEqual(len(self.calls), 1)
        s2 = self.seg()                      # re-planned: sees the cache
        self.assertTrue(s2["cached"])
        self.assertEqual(elevenlabs.generate_one(s2, self.r, log=lambda *a: None), "cached")
        self.assertEqual(len(self.calls), 1, "a cached clip must not be requested again")

    def test_changing_one_line_leaves_the_other_clip_cached(self):
        elevenlabs._request = self.fake_ok
        a, b = self.seg(text="Line one."), self.seg(text="Line two.")
        elevenlabs.generate_one(a, self.r, log=lambda *x: None)
        elevenlabs.generate_one(b, self.r, log=lambda *x: None)
        self.assertEqual(len(self.calls), 2)
        edited = self.seg(text="Line one, edited.")
        self.assertFalse(edited["cached"])
        self.assertTrue(self.seg(text="Line two.")["cached"], "unrelated clip was invalidated")

    def test_missing_voice_blocks_generation_and_substitutes_nothing(self):
        elevenlabs._request = self.fake_ok
        s = self.seg(speaker="lena-ortiz", text="Doing it now.")
        with self.assertRaises(RuntimeError) as ctx:
            elevenlabs.generate_one(s, self.r, log=lambda *a: None)
        self.assertIn("no voice assigned", str(ctx.exception))
        self.assertEqual(self.calls, [], "no request may be made without a voice")

    def test_missing_api_key_refuses_rather_than_falling_back(self):
        os.environ.pop("ELEVENLABS_API_KEY", None)
        with self.assertRaises(SystemExit):
            elevenlabs.api_key()

    def test_no_secret_reaches_any_output_file(self):
        elevenlabs._request = self.fake_ok
        secret = os.environ["ELEVENLABS_API_KEY"]
        elevenlabs.generate_one(self.seg(), self.r, log=lambda *a: None)
        found = []
        for root, _dirs, files in os.walk(self.dir):
            for name in files:
                with open(os.path.join(root, name), "rb") as fh:
                    if secret.encode() in fh.read():
                        found.append(name)
        self.assertEqual(found, [], "the API key leaked into: %s" % found)

    def test_interrupted_run_resumes_from_the_cache(self):
        """A clip that fails every attempt must not cost the others their progress."""
        def flaky(text, *a, **k):
            if text == "B.":
                raise RuntimeError("network died")
            return FAKE_AUDIO

        elevenlabs._request = flaky
        segs = [self.seg(text="A."), self.seg(text="B."), self.seg(text="C.")]
        ok, failed = elevenlabs.generate_all(segs, self.r, log=lambda *a: None)
        self.assertEqual((ok, failed), (2, 1))
        # rerun: the two good clips are cached, only the failed one is attempted
        elevenlabs._request = lambda *a, **k: FAKE_AUDIO
        again = [self.seg(text="A."), self.seg(text="B."), self.seg(text="C.")]
        todo = [s for s in again if not s["cached"]]
        self.assertEqual(len(todo), 1)
        ok2, failed2 = elevenlabs.generate_all(todo, self.r, log=lambda *a: None)
        self.assertEqual((ok2, failed2), (1, 0))

    def test_retry_is_bounded(self):
        attempts = {"n": 0}

        def always_fail(*a, **k):
            attempts["n"] += 1
            raise RuntimeError("boom")

        elevenlabs._request = always_fail
        with self.assertRaises(RuntimeError):
            elevenlabs.generate_one(self.seg(), self.r, log=lambda *a: None)
        self.assertEqual(attempts["n"], CFG["generation"]["maxRetries"])


class ExportTests(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.mkdtemp()
        self.orig_manifest_dir = mf.MANIFEST_DIR
        mf.MANIFEST_DIR = self.dir
        self.r = reg()
        chapter_dir = os.path.join(self.dir, "src")
        os.makedirs(chapter_dir)
        self.path = os.path.join(chapter_dir, "chapter-0009.md")
        with open(self.path, "w", encoding="utf-8") as fh:
            fh.write(CHAPTER)

    def tearDown(self):
        mf.MANIFEST_DIR = self.orig_manifest_dir
        shutil.rmtree(self.dir, ignore_errors=True)

    def test_game_export_excludes_narration_and_keeps_system(self):
        man = mf.build(9, self.path, self.r, overrides={})
        mf.write(man)
        data = mf.game_export([9], self.r)
        speakers = {line["character"] for line in data["lines"]}
        self.assertNotIn(NARRATOR, speakers)
        self.assertNotIn(REVIEW, speakers)
        self.assertIn(SYSTEM, speakers)
        self.assertIn("jack-bennett", speakers)

    def test_game_export_points_at_the_canonical_clip(self):
        man = mf.build(9, self.path, self.r, overrides={})
        mf.write(man)
        data = mf.game_export([9], self.r)
        by_id = {s["clipId"]: s["audio"] for s in man["segments"]}
        for line in data["lines"]:
            self.assertEqual(line["audio"], by_id[line["lineId"]],
                             "game export must reference the audiobook's own clip")

    def test_manifest_records_pauses_between_segments(self):
        man = mf.build(9, self.path, self.r, overrides={})
        self.assertEqual(man["segments"][0]["pauseBeforeMs"], 0)
        self.assertTrue(any(s["pauseBeforeMs"] for s in man["segments"][1:]))

    def test_summary_reports_blockers(self):
        man = mf.build(9, self.path, self.r, overrides={})
        s = mf.summarize(man, self.r)
        self.assertIn("narrator", s["missingVoices"],
                      "a speaker with no voice id must be reported")
        self.assertFalse(s["ready"], "missing voices must block generation")
        self.assertTrue(s["inferred"], "inferred attributions must be surfaced for review")


class WorkflowTests(unittest.TestCase):
    """The CI workflow is the only place the secret is used, so it has to be right.

    It cannot be exercised end to end from here, but parts of it are checkable as
    text, and one of them earns its keep: the workflow once built its argv without
    the `generate` subcommand, so argparse would have rejected the very step that
    holds the API key. These tests make no network request.
    """

    WORKFLOW = os.path.join(os.path.dirname(os.path.dirname(HERE)),
                            ".github", "workflows", "audio-generate.yml")
    CLI = os.path.join(os.path.dirname(HERE), "audio.py")

    def setUp(self):
        if not os.path.exists(self.WORKFLOW):
            self.skipTest("workflow file is not present")
        with open(self.WORKFLOW) as fh:
            self.text = fh.read()

    def _run_lines(self):
        """Every shell fragment the workflow runs, as flat lines."""
        return [line.strip() for line in self.text.splitlines()]

    def test_workflow_is_manual_only(self):
        trigger = self.text.split("jobs:", 1)[0]
        for auto in ("push:", "pull_request:", "schedule:"):
            self.assertNotIn(auto, trigger,
                             auto + " would let an ordinary commit spend credits")
        self.assertIn("workflow_dispatch:", trigger)

    def test_every_cli_invocation_is_a_command_the_cli_accepts(self):
        calls = re.findall(r"scripts/audio\.py ([a-z][a-z-]*)", self.text)
        self.assertTrue(calls, "expected the workflow to call the CLI")
        for name in sorted(set(calls)):
            done = subprocess.run([sys.executable, self.CLI, name, "--help"],
                                  capture_output=True, text=True)
            self.assertEqual(done.returncode, 0,
                             "the workflow runs `audio.py " + name +
                             "`, which this CLI rejects:\n" + done.stderr)

    def test_the_generate_step_argv_begins_with_the_subcommand(self):
        built = [l for l in self._run_lines() if l.startswith("ARGS=(")]
        self.assertTrue(built, "expected the generate step to build an argv array")
        first = built[0][len("ARGS=("):].split()[0]
        self.assertEqual(first, "generate",
                         "the step that holds the API key must name its subcommand")

    def test_combine_runs_with_ffmpeg_and_refuses_a_gapless_export(self):
        """The pauses are the whole reason pauses live in the manifest.

        Chapter 1's first export was byte-identical to its own clips concatenated,
        because the ubuntu-24.04 runner image has no ffmpeg and combine quietly took
        its gapless fallback. A silent fallback in CI is a wrong file committed, so
        the runner installs ffmpeg first and the step fails if the fallback speaks.
        """
        text = self.text
        install = text.find("apt-get install")
        combine = text.find("scripts/audio.py combine")
        self.assertNotEqual(combine, -1, "the workflow should combine what it generates")
        self.assertNotEqual(install, -1, "the runner has to install ffmpeg itself")
        self.assertLess(install, combine, "ffmpeg must be installed before combining")
        step = text[combine:combine + 600]
        self.assertIn("without gaps", step,
                      "the combine step must detect the gapless fallback")
        self.assertIn("exit 1", step,
                      "a gapless export must fail the run rather than be committed")

    def test_the_game_export_is_not_narrowed_to_the_generated_chapters(self):
        """dialogue.json is the whole story's line index, not this run's output.

        Scoping it to inputs.chapters rewrites the file with only those chapters in
        it. A chapter-1 run cut it from 237 lines to 88 that way, silently dropping
        chapters 2 and 3 from the index Godot reads.
        """
        step = [l for l in self._run_lines() if "audio.py export-game" in l]
        self.assertTrue(step, "the workflow should refresh the game export")
        self.assertNotIn("--chapters", step[0],
                         "the game export must cover every chapter, not just this run's")

    def test_the_secret_is_never_interpolated_into_a_shell_line(self):
        self.assertIn("secrets.ELEVENLABS_API_KEY", self.text,
                      "the workflow has to read the secret from somewhere")
        for line in self._run_lines():
            if "secrets.ELEVENLABS_API_KEY" not in line:
                continue
            self.assertTrue(line.startswith("ELEVENLABS_API_KEY:"),
                            "the secret may only be bound to an env var, never pasted "
                            "into a command where a log could capture it: " + line)


if __name__ == "__main__":
    unittest.main(verbosity=2)
