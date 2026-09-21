#!/usr/bin/env python3
"""Tests for the TMB audio pipeline.

Run: python3 scripts/tests/test_audio.py

These tests NEVER call ElevenLabs. Every generation test replaces the HTTP request with
a local fake, and one test asserts that no API key can reach any output file.
"""

import json
import math
import os
import re
import subprocess
import shutil
import sys
import tempfile
import types
import unittest
import urllib.error

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))          # scripts/

from tmbaudio import cache, elevenlabs, manifest as mf, parse          # noqa: E402
from tmbaudio import sfx as sfxmod                                     # noqa: E402
from tmbaudio import combine as combinemod, drama                      # noqa: E402
from tmbaudio import normalize as normmod                              # noqa: E402
from tmbaudio import procedural as procmod                             # noqa: E402
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


# ---------------------------------------------------------------------------
# Sound effects and ambience
# ---------------------------------------------------------------------------
SFX_DATA = {
    "sfxVersion": 1,
    "characters": {
        "sarah-bennett": {"footwear": "gray sneakers",
                          "footstepProfile": "adult-sneakers-lighter",
                          "footstepAsset": "sfx_footsteps_sarah_sneakers"},
        "jack-bennett": {"footwear": "gray sneakers",
                         "footstepProfile": "adult-sneakers-heavier",
                         "footstepAsset": None},
    },
    "assets": {
        "amb_lab_night": {"category": "ambience", "source": "generated",
                          "prompt": "quiet lab room tone", "durationSeconds": 22,
                          "loop": True, "promptInfluence": 0.3, "assetVersion": 1,
                          "godotReuse": True},
        "sfx_chair_roll_fast": {"category": "foley", "source": "generated",
                                "prompt": "chair shoved back", "durationSeconds": 2,
                                "loop": False, "promptInfluence": 0.35,
                                "assetVersion": 1, "godotReuse": True},
        "sfx_denied": {"category": "system", "source": "generated",
                       "prompt": "rejection tone", "durationSeconds": 1.5,
                       "loop": False, "promptInfluence": 0.4, "assetVersion": 1,
                       "godotReuse": True},
        "sfx_narration_only": {"category": "interface", "source": "generated",
                               "prompt": "page turn", "durationSeconds": 1,
                               "loop": False, "promptInfluence": 0.3,
                               "assetVersion": 1, "godotReuse": False},
        "sfx_handmade": {"category": "foley", "source": "supplied",
                         "loop": False, "assetVersion": 1, "godotReuse": True},
    },
}

SFX_CFG = dict(CFG)
SFX_CFG["sfx"] = {
    "provider": "elevenlabs-sfx", "model": None, "outputFormat": "mp3_44100_128",
    "defaultPromptInfluence": 0.3, "promptMaxCharacters": 400,
    "durationLimitsSeconds": {"min": 0.5, "max": 20},
    "generation": {"concurrency": 1, "maxRetries": 2, "baseBackoffSeconds": 0,
                   "requestTimeoutSeconds": 5},
}
SFX_CFG["mix"] = {
    "layers": {"voice": True, "ambience": True, "sfx": True},
    "categoryGain": {"ambience": 0.10, "foley": 0.45, "interface": 0.40,
                     "alarm": 0.50, "system": 0.45},
    "duckUnderSpeechTo": {"ambience": 0.55, "alarm": 0.40},
    "defaultFadeMs": {"in": 800, "out": 1200},
}


def sfx_reg():
    return sfxmod.SfxRegistry(data=json.loads(json.dumps(SFX_DATA)),
                              config=json.loads(json.dumps(SFX_CFG)))


class SfxIdentityTests(unittest.TestCase):
    """An asset is its name. Where it plays is somebody else's document."""

    def setUp(self):
        self.reg = sfx_reg()

    def test_asset_id_is_not_derived_from_a_chapter_or_a_position(self):
        plan = sfxmod.plan_asset(self.reg, "sfx_chair_roll_fast")
        self.assertEqual(plan["asset"], "sfx_chair_roll_fast")
        self.assertNotIn("chapter", plan["audio"])
        self.assertNotIn("01", plan["audio"],
                         "an asset path must not encode the chapter that first used it")
        self.assertEqual(plan["audio"], "audio/sfx/foley/sfx_chair_roll_fast.mp3")

    def test_layer_comes_from_the_category_not_from_looping(self):
        """A looping alarm is still an effect. Turning ambience off must not mute it."""
        data = json.loads(json.dumps(SFX_DATA))
        data["assets"]["amb_alarm"] = {"category": "alarm", "source": "generated",
                                       "prompt": "alarm bed", "durationSeconds": 12,
                                       "loop": True, "assetVersion": 1, "godotReuse": True}
        reg = sfxmod.SfxRegistry(data=data, config=json.loads(json.dumps(SFX_CFG)))
        self.assertTrue(reg.loops("amb_alarm"))
        self.assertEqual(reg.layer("amb_alarm"), "sfx")
        self.assertEqual(reg.layer("amb_lab_night"), "ambience")

    def test_generated_and_supplied_assets_are_distinguishable(self):
        self.assertTrue(self.reg.is_generated("sfx_chair_roll_fast"))
        self.assertFalse(self.reg.is_generated("sfx_handmade"))

    def test_character_footstep_profile_is_available_but_optional(self):
        sarah = self.reg.character_profile("sarah-bennett")
        jack = self.reg.character_profile("jack-bennett")
        self.assertEqual(sarah["footstepAsset"], "sfx_footsteps_sarah_sneakers")
        self.assertIn("sneaker", sarah["footstepProfile"])
        self.assertNotIn("heel", json.dumps(sarah).lower(),
                         "Chapter 1 canon puts Sarah in gray sneakers, not heels")
        self.assertIsNone(jack["footstepAsset"],
                          "Jack never walks in chapter 1; no asset should be implied")


class SfxFingerprintTests(unittest.TestCase):
    def setUp(self):
        self.reg = sfx_reg()

    def _fp(self, asset_id):
        return sfxmod.fingerprint(self.reg.get(asset_id), self.reg.provider(),
                                  self.reg.model(), self.reg.output_format(),
                                  self.reg.sfx_version())

    def test_same_inputs_give_the_same_fingerprint(self):
        self.assertEqual(self._fp("sfx_denied"), self._fp("sfx_denied"))

    def test_reflowing_a_prompt_does_not_invalidate_the_audio(self):
        a = dict(self.reg.get("sfx_denied"))
        b = dict(a, prompt="  rejection\n   tone  ")
        self.assertEqual(
            sfxmod.fingerprint(a, "p", None, "f", 1),
            sfxmod.fingerprint(b, "p", None, "f", 1),
            "whitespace is not a material change to the requested sound")

    def test_each_generation_input_changes_the_fingerprint(self):
        base = self.reg.get("sfx_denied")
        original = sfxmod.fingerprint(base, "p", None, "f", 1)
        for field, value in (("prompt", "a different sound"),
                             ("durationSeconds", 4),
                             ("loop", True),
                             ("promptInfluence", 0.9),
                             ("assetVersion", 2)):
            changed = dict(base)
            changed[field] = value
            self.assertNotEqual(original, sfxmod.fingerprint(changed, "p", None, "f", 1),
                                "%s must invalidate the asset" % field)
        self.assertNotEqual(original, sfxmod.fingerprint(base, "other", None, "f", 1))
        self.assertNotEqual(original, sfxmod.fingerprint(base, "p", "a-model", "f", 1))
        self.assertNotEqual(original, sfxmod.fingerprint(base, "p", None, "f", 2),
                            "the registry-wide sfxVersion must invalidate assets")

    def test_cosmetic_metadata_does_not_cost_a_regeneration(self):
        base = self.reg.get("sfx_denied")
        original = sfxmod.fingerprint(base, "p", None, "f", 1)
        for field, value in (("category", "alarm"), ("godotReuse", False),
                             ("notes", "a better explanation"), ("approved", True)):
            self.assertEqual(original,
                             sfxmod.fingerprint(dict(base, **{field: value}), "p", None, "f", 1),
                             "%s is not part of the audio and must not invalidate it" % field)

    def test_bumping_one_asset_version_leaves_the_others_alone(self):
        data = json.loads(json.dumps(SFX_DATA))
        before = {k: sfxmod.fingerprint(v, "p", None, "f", 1)
                  for k, v in data["assets"].items() if v.get("prompt")}
        data["assets"]["sfx_denied"]["assetVersion"] = 2
        after = {k: sfxmod.fingerprint(v, "p", None, "f", 1)
                 for k, v in data["assets"].items() if v.get("prompt")}
        changed = [k for k in before if before[k] != after[k]]
        self.assertEqual(changed, ["sfx_denied"])


CUE_CHAPTER = """---
chapter: 9
title: "Cue fixture"
---

# Chapter 9: Cue fixture

It was late.

Jack jerked awake so quickly that his chair rolled backward.

Jack reached across the console and rejected the request.

"Access denied." He tried again.

"Access denied." Jack's expression hardened.

Sarah turned toward him. "Jack."
"""


CUE_DOC = {
    "chapter": 9,
    "cues": [
        {"cueId": "c-bed", "asset": "amb_lab_night", "gain": 0.08,
         "anchor": {"clipId": None, "occurrence": 1},
         "timing": "before",
         "sustain": {"until": "chapterEnd", "timing": "after"}},
        {"cueId": "c-chair", "asset": "sfx_chair_roll_fast", "gain": 0.4,
         "anchor": {"clipId": None, "occurrence": 1}, "timing": "during",
         "offsetMs": 900},
        {"cueId": "c-denied-1", "asset": "sfx_denied",
         "anchor": {"clipId": None, "occurrence": 1}, "timing": "before"},
        {"cueId": "c-denied-2", "asset": "sfx_denied",
         "anchor": {"clipId": None, "occurrence": 2}, "timing": "before"},
    ],
}


class SfxProviderLimitTests(unittest.TestCase):
    """Limits learned by being refused, so they are never learned twice.

    A 476-character prompt was rejected with HTTP 400 at 22 seconds and again at 20,
    while every asset at 385 characters or fewer generated first time -- including a
    20-second looping bed. The cause was prompt LENGTH. Both limits are now data, and
    validation spends nothing to enforce them.
    """

    def setUp(self):
        self.reg = sfx_reg()

    def test_the_limits_are_configuration_rather_than_folklore(self):
        self.assertEqual(self.reg.prompt_limit(), 400)
        self.assertEqual(self.reg.duration_limits(), (0.5, 20.0))

    def test_http_400_is_reported_as_malformed_and_never_retried(self):
        src = open(os.path.join(os.path.dirname(HERE), "tmbaudio", "elevenlabs.py"),
                   encoding="utf-8").read()
        self.assertIn("if exc.code in (400, 422):", src)
        self.assertNotIn("400", str(sorted(elevenlabs.RETRYABLE)),
                         "a malformed request must not be retried")

    def test_the_real_registry_is_inside_both_limits(self):
        """The shipped prompts, checked against the limits that refused one of them."""
        reg = sfxmod.SfxRegistry(config=json.loads(json.dumps(SFX_CFG)))
        try:
            real = sfxmod.SfxRegistry()
        except (OSError, ValueError):
            self.skipTest("no registry on disk")
        lo, hi = reg.duration_limits()
        for aid, asset in real.assets.items():
            if asset.get("source") != "generated":
                continue
            self.assertLessEqual(len(asset.get("prompt") or ""), reg.prompt_limit(),
                                 "%s has an over-long prompt" % aid)
            self.assertTrue(lo <= float(asset["durationSeconds"]) <= hi,
                            "%s requests %ss, outside %s-%ss"
                            % (aid, asset["durationSeconds"], lo, hi))


class CueSheetTests(unittest.TestCase):
    """Cues anchor to clip identity plus occurrence. Never to a timestamp."""

    def setUp(self):
        self.dir = tempfile.mkdtemp()
        self.path = os.path.join(self.dir, "chapter-0009.md")
        self.reg = reg()
        self.sreg = sfx_reg()
        self._write(CUE_CHAPTER)

    def tearDown(self):
        shutil.rmtree(self.dir, ignore_errors=True)

    def _write(self, text):
        with open(self.path, "w", encoding="utf-8") as fh:
            fh.write(text)

    def _segments(self):
        return mf.build(9, self.path, self.reg, overrides={},
                        sfx_registry=self.sreg)["segments"]

    def _doc(self, segments):
        """Point the fixture cues at real clips: the first narration, and the twice-used
        system line, which is the case that makes an occurrence number necessary."""
        doc = json.loads(json.dumps(CUE_DOC))
        narration = [s for s in segments if s["speaker"] == NARRATOR]
        repeated = [s for s in segments if s["displayText"] == "Access denied."]
        doc["cues"][0]["anchor"]["clipId"] = narration[0]["clipId"]
        doc["cues"][1]["anchor"]["clipId"] = narration[1]["clipId"]
        doc["cues"][2]["anchor"]["clipId"] = repeated[0]["clipId"]
        doc["cues"][3]["anchor"]["clipId"] = repeated[0]["clipId"]
        return doc

    def test_cues_resolve_to_segment_orders(self):
        segs = self._segments()
        doc = self._doc(segs)
        doc["cues"] = doc["cues"][:2]
        resolved, problems = sfxmod.resolve_chapter_cues(segs, doc, self.sreg)
        self.assertEqual(problems, [])
        self.assertEqual(len(resolved), 2)
        for cue in resolved:
            self.assertIsInstance(cue["order"], int)

    def test_a_repeated_line_is_disambiguated_by_occurrence(self):
        """"Access denied." is one clip heard twice, so a clipId alone is not a position.

        This is the property that makes anchors work at all: the same asset identity
        that lets one generated line serve two places makes the clipId ambiguous as a
        cue target, and the occurrence number resolves it.
        """
        segs = self._segments()
        doc = self._doc(segs)
        repeated = [s for s in segs if s["displayText"] == "Access denied."]
        self.assertGreaterEqual(len(repeated), 2, "fixture must repeat a line")
        self.assertEqual(repeated[0]["clipId"], repeated[1]["clipId"],
                         "a repeated line shares one clip")
        resolved, problems = sfxmod.resolve_chapter_cues(segs, doc, self.sreg)
        self.assertEqual(problems, [])
        orders = {c["cueId"]: c["order"] for c in resolved}
        self.assertNotEqual(orders["c-denied-1"], orders["c-denied-2"])
        self.assertEqual(orders["c-denied-1"], repeated[0]["order"])
        self.assertEqual(orders["c-denied-2"], repeated[1]["order"])

    def test_inserting_a_paragraph_does_not_move_any_cue(self):
        """The whole reason anchors are not timestamps."""
        segs = self._segments()
        doc = self._doc(segs)
        before, problems = sfxmod.resolve_chapter_cues(segs, doc, self.sreg)
        self.assertEqual(problems, [])
        orders_before = {c["cueId"]: c["order"] for c in before}

        self._write(CUE_CHAPTER.replace("It was late.",
                                        "A brand new opening paragraph.\n\nIt was late."))
        after, problems2 = sfxmod.resolve_chapter_cues(self._segments(), doc, self.sreg)
        self.assertEqual(problems2, [], "every anchor must still resolve")

        # The cue sheet is untouched and every cue still points at its own line...
        self.assertEqual({c["cueId"]: c["asset"] for c in after},
                         {c["cueId"]: c["asset"] for c in before})
        # ...even though every segment order moved, which is the point.
        orders_after = {c["cueId"]: c["order"] for c in after}
        self.assertNotEqual(orders_after, orders_before)
        self.assertTrue(all(orders_after[k] == orders_before[k] + 1 for k in orders_before),
                        "one inserted paragraph shifts every order by one, and the cue "
                        "sheet needed no edit to survive it")

    def test_inserting_a_cue_does_not_invalidate_any_asset(self):
        """A cue sheet edit is editorial. It must never cost a single generation."""
        segs = self._segments()
        doc = self._doc(segs)
        fps_before = {a: sfxmod.plan_asset(self.sreg, a)["fingerprint"]
                      for a in self.sreg.assets if self.sreg.is_generated(a)}
        doc["cues"].insert(0, {"cueId": "c-new", "asset": "sfx_denied", "gain": 0.3,
                               "anchor": doc["cues"][0]["anchor"], "timing": "after"})
        resolved, problems = sfxmod.resolve_chapter_cues(segs, doc, self.sreg)
        self.assertEqual(problems, [])
        self.assertEqual(len(resolved), 5)
        fps_after = {a: sfxmod.plan_asset(self.sreg, a)["fingerprint"]
                     for a in self.sreg.assets if self.sreg.is_generated(a)}
        self.assertEqual(fps_before, fps_after)

    def test_one_asset_can_serve_several_events(self):
        segs = self._segments()
        resolved, _ = sfxmod.resolve_chapter_cues(segs, self._doc(segs), self.sreg)
        summary = sfxmod.summarize_chapter(resolved, [], self.sreg)
        self.assertEqual(summary["events"], 4)
        self.assertEqual(summary["uniqueAssets"], 3,
                         "four events, three assets: the denial tone is heard twice")
        self.assertEqual(summary["reusedAssets"], {"sfx_denied": 2})

    def test_an_unresolvable_anchor_is_reported_and_never_guessed(self):
        segs = self._segments()
        doc = {"chapter": 9, "cues": [
            {"cueId": "c-ghost", "asset": "sfx_denied", "timing": "before",
             "anchor": {"clipId": "narrator-doesnotexist", "occurrence": 1}}]}
        resolved, problems = sfxmod.resolve_chapter_cues(segs, doc, self.sreg)
        self.assertEqual(resolved, [])
        self.assertEqual(len(problems), 1)
        self.assertIn("anchor does not resolve", problems[0]["problems"][0])

    def test_a_third_occurrence_of_a_twice_used_clip_is_reported(self):
        segs = self._segments()
        repeated = [s for s in segs if s["displayText"] == "Access denied."]
        doc = {"chapter": 9, "cues": [
            {"cueId": "c-too-far", "asset": "sfx_denied", "timing": "before",
             "anchor": {"clipId": repeated[0]["clipId"], "occurrence": 3}}]}
        resolved, problems = sfxmod.resolve_chapter_cues(segs, doc, self.sreg)
        self.assertEqual(resolved, [])
        self.assertTrue(problems)

    def test_an_unknown_asset_is_refused_rather_than_invented(self):
        segs = self._segments()
        doc = {"chapter": 9, "cues": [
            {"cueId": "c-bad", "asset": "sfx_not_registered", "timing": "before",
             "anchor": {"clipId": segs[0]["clipId"], "occurrence": 1}}]}
        resolved, problems = sfxmod.resolve_chapter_cues(segs, doc, self.sreg)
        self.assertEqual(resolved, [])
        self.assertIn("unknown asset", problems[0]["problems"][0])

    def test_gain_outside_zero_to_one_is_rejected(self):
        segs = self._segments()
        for bad in (-0.1, 1.4, "loud"):
            doc = {"chapter": 9, "cues": [
                {"cueId": "c-gain", "asset": "sfx_denied", "timing": "before",
                 "gain": bad, "anchor": {"clipId": segs[0]["clipId"], "occurrence": 1}}]}
            resolved, problems = sfxmod.resolve_chapter_cues(segs, doc, self.sreg)
            self.assertEqual(resolved, [], "gain %r must not be accepted" % (bad,))
            self.assertTrue(problems)

    def test_a_cue_without_a_gain_falls_back_to_its_category_default(self):
        segs = self._segments()
        doc = self._doc(segs)
        resolved, _ = sfxmod.resolve_chapter_cues(segs, doc, self.sreg)
        denied = [c for c in resolved if c["asset"] == "sfx_denied"][0]
        self.assertAlmostEqual(denied["gain"], 0.45)
        bed = [c for c in resolved if c["asset"] == "amb_lab_night"][0]
        self.assertAlmostEqual(bed["gain"], 0.08, msg="the cue's own gain wins")

    def test_a_loopable_asset_may_be_used_once(self):
        """The rule used to run the other way, and it walked me into a real bug.

        It insisted that any asset marked `loop` be given a sustain -- so a cue that
        wanted a sound ONCE could not have it. amb_tombs_array_power_rise is a
        20-second RISE marked loop; the rule made it a bed; a bed loops; so under two
        whole chapters it climbed, snapped back and climbed again every 20 seconds.
        Joshua heard it at clip 8 of chapter 2, 21.8 s in, the first wrap.

        `loop` on an ASSET means the file is built to be looped. Whether a CUE uses it
        as a bed is the cue's business, and playing a loopable file once is always
        safe."""
        segs = self._segments()
        doc = {"chapter": 9, "cues": [
            {"cueId": "c-once", "asset": "amb_lab_night", "timing": "before",
             "anchor": {"clipId": segs[0]["clipId"], "occurrence": 1}}]}
        resolved, problems = sfxmod.resolve_chapter_cues(segs, doc, self.sreg)
        self.assertEqual(problems, [])
        self.assertEqual(len(resolved), 1)
        self.assertIsNone(resolved[0].get("stopOrder"),
                          "no sustain means a one-shot, however the asset is marked")

    def test_sustaining_an_asset_not_built_to_loop_is_refused(self):
        """The direction that actually sounds wrong: repeating a file with a seam."""
        segs = self._segments()
        doc = {"chapter": 9, "cues": [
            {"cueId": "c-bad-bed", "asset": "sfx_denied", "timing": "before",
             "anchor": {"clipId": segs[0]["clipId"], "occurrence": 1},
             "sustain": {"until": "chapterEnd", "timing": "after"}}]}
        resolved, problems = sfxmod.resolve_chapter_cues(segs, doc, self.sreg)
        self.assertEqual(resolved, [])
        self.assertIn("not built to loop", problems[0]["problems"][0])

    def test_looping_metadata_survives_into_the_resolved_cue(self):
        segs = self._segments()
        resolved, _ = sfxmod.resolve_chapter_cues(segs, self._doc(segs), self.sreg)
        bed = [c for c in resolved if c["cueId"] == "c-bed"][0]
        self.assertTrue(bed["loop"])
        self.assertEqual(bed["layer"], "ambience")
        self.assertEqual(bed["stopOrder"], segs[-1]["order"])
        chair = [c for c in resolved if c["cueId"] == "c-chair"][0]
        self.assertFalse(chair["loop"])
        self.assertNotIn("stopOrder", chair)
        self.assertEqual(chair["offsetMs"], 900)

    def test_a_sustain_that_ends_before_it_starts_is_rejected(self):
        segs = self._segments()
        doc = {"chapter": 9, "cues": [
            {"cueId": "c-backwards", "asset": "amb_lab_night", "timing": "before",
             "anchor": {"clipId": segs[-1]["clipId"], "occurrence": 1},
             "sustain": {"until": {"clipId": segs[0]["clipId"], "occurrence": 1}}}]}
        resolved, problems = sfxmod.resolve_chapter_cues(segs, doc, self.sreg)
        self.assertEqual(resolved, [])
        self.assertTrue(problems)


class SfxGenerationTests(unittest.TestCase):
    """Every request is mocked. No ElevenLabs sound-effects call happens in the suite."""

    def setUp(self):
        self.dir = tempfile.mkdtemp()
        self.sreg = sfx_reg()
        self._sfx_dir = sfxmod.SFX_DIR
        sfxmod.SFX_DIR = os.path.join(self.dir, "sfx")
        self._real = elevenlabs._sfx_request
        self.calls = []

        def fake(plan, timeout):
            self.calls.append(plan["asset"])
            return FAKE_AUDIO + plan["asset"].encode()
        elevenlabs._sfx_request = fake
        os.environ["ELEVENLABS_API_KEY"] = "test-key-never-written-anywhere"

    def tearDown(self):
        elevenlabs._sfx_request = self._real
        sfxmod.SFX_DIR = self._sfx_dir
        os.environ.pop("ELEVENLABS_API_KEY", None)
        shutil.rmtree(self.dir, ignore_errors=True)

    def _plan(self, asset_id):
        return sfxmod.plan_asset(self.sreg, asset_id)

    def test_generates_then_skips_when_unchanged(self):
        ok, failed = elevenlabs.generate_all_sfx([self._plan("sfx_denied")], self.sreg)
        self.assertEqual((ok, failed), (1, 0))
        self.assertEqual(self.calls, ["sfx_denied"])
        ok2, failed2 = elevenlabs.generate_all_sfx([self._plan("sfx_denied")], self.sreg)
        self.assertEqual((ok2, failed2), (0, 0))
        self.assertEqual(self.calls, ["sfx_denied"],
                         "an approved sound must never be paid for twice")

    def test_another_chapter_reusing_an_asset_spends_nothing(self):
        elevenlabs.generate_all_sfx([self._plan("sfx_chair_roll_fast")], self.sreg)
        self.assertEqual(len(self.calls), 1)
        # A second chapter cues the same asset. Same name, same fingerprint, no request.
        plan = self._plan("sfx_chair_roll_fast")
        self.assertTrue(plan["cached"])
        elevenlabs.generate_all_sfx([plan], self.sreg)
        self.assertEqual(len(self.calls), 1)

    def test_changing_one_prompt_leaves_the_other_assets_cached(self):
        for a in ("sfx_denied", "sfx_chair_roll_fast"):
            elevenlabs.generate_all_sfx([self._plan(a)], self.sreg)
        self.calls = []
        self.sreg.assets["sfx_denied"]["prompt"] = "a completely different tone"
        self.assertFalse(self._plan("sfx_denied")["cached"])
        self.assertTrue(self._plan("sfx_chair_roll_fast")["cached"])
        elevenlabs.generate_all_sfx(
            [self._plan("sfx_denied"), self._plan("sfx_chair_roll_fast")], self.sreg)
        self.assertEqual(self.calls, ["sfx_denied"])

    def test_a_supplied_asset_is_never_generated(self):
        ok, failed = elevenlabs.generate_all_sfx([self._plan("sfx_handmade")], self.sreg)
        self.assertEqual((ok, failed), (0, 0))
        self.assertEqual(self.calls, [], "a hand-supplied file must not be requested")

    def test_an_asset_with_no_prompt_refuses_rather_than_inventing_one(self):
        self.sreg.assets["sfx_denied"]["prompt"] = ""
        ok, failed = elevenlabs.generate_all_sfx([self._plan("sfx_denied")], self.sreg)
        self.assertEqual((ok, failed), (0, 1))
        self.assertEqual(self.calls, [])

    def test_no_secret_reaches_any_sfx_output_file(self):
        secret = os.environ["ELEVENLABS_API_KEY"]
        elevenlabs.generate_all_sfx([self._plan("sfx_denied")], self.sreg)
        found = []
        for root, _dirs, names in os.walk(self.dir):
            for name in names:
                with open(os.path.join(root, name), "rb") as fh:
                    if secret.encode() in fh.read():
                        found.append(name)
        self.assertEqual(found, [], "the API key must not appear in audio or sidecars")

    def test_sfx_generation_does_not_touch_the_voice_cache(self):
        """Changing sound design must never invalidate an approved performance."""
        vreg = reg()
        seg = {"speaker": "jack-bennett", "clipId": "jack-x", "ttsText": "Yep."}
        planned = cache.plan_segment(vreg, seg)
        before = planned["fingerprint"]
        self.sreg.assets["sfx_denied"]["prompt"] = "something else entirely"
        self.sreg.data["sfxVersion"] = 99
        elevenlabs.generate_all_sfx([self._plan("sfx_chair_roll_fast")], self.sreg)
        after = cache.plan_segment(vreg, seg)["fingerprint"]
        self.assertEqual(before, after)


class SfxExportAndPlayerTests(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.mkdtemp()
        self.path = os.path.join(self.dir, "chapter-0009.md")
        with open(self.path, "w", encoding="utf-8") as fh:
            fh.write(CHAPTER)
        self.reg = reg()
        self.sreg = sfx_reg()

    def tearDown(self):
        shutil.rmtree(self.dir, ignore_errors=True)

    def test_game_export_shares_the_asset_and_not_the_timing(self):
        cues = {"chapter": 9, "cues": [
            {"cueId": "c1", "asset": "sfx_chair_roll_fast", "timing": "before",
             "anchor": {"clipId": "x", "occurrence": 1}},
            {"cueId": "c2", "asset": "sfx_narration_only", "timing": "before",
             "anchor": {"clipId": "x", "occurrence": 1}}]}
        real = sfxmod.load_cues
        sfxmod.load_cues = lambda n: cues
        try:
            data = sfxmod.game_export([9], self.sreg)
        finally:
            sfxmod.load_cues = real
        ids = [a["assetId"] for a in data["assets"]]
        self.assertIn("sfx_chair_roll_fast", ids)
        self.assertNotIn("sfx_narration_only", ids,
                         "godotReuse false must keep an asset out of the game export")
        entry = data["assets"][0]
        self.assertEqual(entry["audio"], "audio/sfx/foley/sfx_chair_roll_fast.mp3")
        for forbidden in ("timing", "order", "anchor", "cueId", "offsetMs"):
            self.assertNotIn(forbidden, entry,
                             "the audiobook's playback timing is not the game's business")

    def test_the_manifest_carries_cues_without_disturbing_the_voice_track(self):
        plain = mf.build(9, self.path, self.reg, overrides={})
        voice_only = [dict(s) for s in plain["segments"]]
        real = sfxmod.load_cues
        sfxmod.load_cues = lambda n: {"chapter": 9, "cues": [
            {"cueId": "c1", "asset": "sfx_denied", "timing": "before",
             "anchor": {"clipId": voice_only[0]["clipId"], "occurrence": 1}}]}
        try:
            withcues = mf.build(9, self.path, self.reg, overrides={},
                                sfx_registry=self.sreg)
        finally:
            sfxmod.load_cues = real
        self.assertEqual(withcues["segments"], voice_only,
                         "adding a cue sheet must not alter one voice segment")
        self.assertEqual(len(withcues["cues"]), 1)
        self.assertIn("mix", withcues)

    def test_a_missing_sound_asset_leaves_the_voice_track_playable(self):
        """The cue is still published with cached false; the player skips it.

        The audiobook must never fail merely because optional ambience is unavailable.
        """
        real = sfxmod.load_cues
        sfxmod.load_cues = lambda n: {"chapter": 9, "cues": [
            {"cueId": "c1", "asset": "sfx_denied", "timing": "before",
             "anchor": {"clipId": "narrator-nope", "occurrence": 1}},
            {"cueId": "c2", "asset": "amb_lab_night", "timing": "before",
             "anchor": {"clipId": "narrator-nope", "occurrence": 1},
             "sustain": {"until": "chapterEnd"}}]}
        try:
            man = mf.build(9, self.path, self.reg, overrides={}, sfx_registry=self.sreg)
        finally:
            sfxmod.load_cues = real
        self.assertEqual(man["cues"], [], "unresolvable cues are dropped, not fatal")
        self.assertEqual(len(man["cueProblems"]), 2)
        self.assertTrue(man["segments"], "the voice track survives a broken cue sheet")
        self.assertTrue(all(s["audio"] for s in man["segments"]))

    def test_a_chapter_with_no_cue_sheet_still_builds(self):
        real = sfxmod.load_cues
        sfxmod.load_cues = lambda n: {"chapter": n, "cues": []}
        try:
            man = mf.build(9, self.path, self.reg, overrides={}, sfx_registry=self.sreg)
        finally:
            sfxmod.load_cues = real
        self.assertEqual(man["cues"], [])
        self.assertEqual(man["cueProblems"], [])


class LayerClientTests(unittest.TestCase):
    """The browser gets static files and no credentials. Asserted as text."""

    READER = os.path.join(os.path.dirname(os.path.dirname(HERE)), "reader")
    SFX_JS = os.path.join(READER, "sfx.js")
    PLAYER_JS = os.path.join(READER, "player.js")

    def _read(self, path):
        with open(path, encoding="utf-8") as fh:
            return fh.read()

    def test_the_layer_client_holds_no_key_and_no_elevenlabs_endpoint(self):
        text = self._read(self.SFX_JS)
        for forbidden in ("api.elevenlabs.io", "xi-api-key", "ELEVENLABS_API_KEY",
                          "sound-generation"):
            self.assertNotIn(forbidden, text,
                             "%s must never appear in browser code" % forbidden)

    def test_the_layer_client_only_fetches_relative_paths(self):
        text = self._read(self.SFX_JS)
        self.assertNotIn("http://", text)
        self.assertNotIn("https://", text)
        self.assertIn('"./" + cue.audio', text)

    def test_the_player_guards_every_call_into_the_optional_layers(self):
        """If reader/sfx.js does not load, the audiobook must be exactly as before."""
        text = self._read(self.PLAYER_JS)
        self.assertIn("window.TMBLayers || null", text)
        calls = re.findall(r"l\.(setSpeaking|enterSegment|leaveSegment|stopAll|load)\(", text)
        self.assertTrue(calls, "expected the player to drive the layers")
        for line in text.splitlines():
            if re.search(r"\bl\.(setSpeaking|enterSegment|leaveSegment|stopAll|load)\(", line):
                self.assertIn("if (l)", line,
                              "an unguarded layer call would break voice-only "
                              "playback when sfx.js is absent: " + line.strip())

    def test_the_voice_toggle_cannot_silence_the_audiobook(self):
        text = self._read(self.PLAYER_JS)
        self.assertIn("listen-layer-ambience", text)
        self.assertIn("listen-layer-sfx", text)
        self.assertNotIn('id="listen-layer-voice"', text,
                         "voices are the reference layer, not a switch that mutes the book")


class DramaExportTests(unittest.TestCase):
    """The layered convenience mix. Builds its plan and graph with no ffmpeg."""

    def setUp(self):
        self.manifest = {
            "chapter": 9,
            "segments": [
                {"order": 0, "audio": "a.mp3", "pauseBeforeMs": 0},
                {"order": 1, "audio": "b.mp3", "pauseBeforeMs": 300},
                {"order": 2, "audio": "c.mp3", "pauseBeforeMs": 500},
            ],
            "cues": [
                {"cueId": "bed", "asset": "amb", "audio": "bed.mp3", "gain": 0.1,
                 "timing": "before", "order": 0, "category": "ambience",
                 "layer": "ambience", "loop": True, "stopOrder": 2,
                 "fadeInMs": 1000, "fadeOutMs": 2000, "cached": True},
                {"cueId": "hit", "asset": "sfx", "audio": "hit.mp3", "gain": 0.5,
                 "timing": "before", "order": 2, "category": "alarm",
                 "layer": "sfx", "loop": False, "cached": True},
                {"cueId": "mid", "asset": "sfx", "audio": "hit.mp3", "gain": 0.4,
                 "timing": "during", "offsetMs": 400, "order": 1,
                 "category": "foley", "layer": "sfx", "loop": False, "cached": True},
                {"cueId": "tail", "asset": "sfx", "audio": "hit.mp3", "gain": 0.3,
                 "timing": "after", "order": 1, "category": "foley",
                 "layer": "sfx", "loop": False, "cached": True},
            ],
        }
        self._dur = drama.cache.mp3_duration_seconds
        drama.cache.mp3_duration_seconds = lambda p: 2.0
        self._isfile = drama.os.path.isfile
        drama.os.path.isfile = lambda p: True

    def tearDown(self):
        drama.cache.mp3_duration_seconds = self._dur
        drama.os.path.isfile = self._isfile

    def test_timeline_is_pause_then_clip(self):
        starts, ends, total = drama.timeline(self.manifest)
        self.assertAlmostEqual(starts[0], 0.0)
        self.assertAlmostEqual(ends[0], 2.0)
        self.assertAlmostEqual(starts[1], 2.3, msg="the 300ms pause comes first")
        self.assertAlmostEqual(starts[2], 4.8)
        self.assertAlmostEqual(total, 6.8)

    def test_before_lands_in_the_gap_and_after_lands_at_the_end(self):
        """`before` must precede the line, or the cue sheet's reasoning is wrong.

        The chirp is heard and THEN the narrator says a warning tone chirped.
        """
        starts, ends, _ = drama.timeline(self.manifest)
        hit = [c for c in self.manifest["cues"] if c["cueId"] == "hit"][0]
        at = drama.cue_start(hit, self.manifest, starts, ends)
        self.assertLess(at, starts[2], "a before cue must start before its segment")
        self.assertAlmostEqual(at, starts[2] - 0.5, msg="it starts at the top of the gap")

        tail = [c for c in self.manifest["cues"] if c["cueId"] == "tail"][0]
        self.assertAlmostEqual(drama.cue_start(tail, self.manifest, starts, ends), ends[1])

        mid = [c for c in self.manifest["cues"] if c["cueId"] == "mid"][0]
        self.assertAlmostEqual(drama.cue_start(mid, self.manifest, starts, ends),
                               starts[1] + 0.4)

    def test_a_bed_runs_from_its_anchor_to_its_stop(self):
        spec = drama.plan(self.manifest, sfx_reg())
        self.assertEqual(len(spec["beds"]), 1)
        bed = spec["beds"][0]
        self.assertAlmostEqual(bed["at"], 0.0)
        self.assertAlmostEqual(bed["until"], 6.8)
        self.assertAlmostEqual(bed["duration"], 6.8)
        self.assertEqual(len(spec["shots"]), 3)
        self.assertEqual(len(spec["voices"]), 3)

    def test_the_graph_ducks_beds_and_never_averages_the_gains(self):
        spec = drama.plan(self.manifest, sfx_reg())
        inputs, graph, out = drama.build_graph(spec)
        self.assertEqual(len(inputs), 7, "three voices, one bed, three one-shots")
        self.assertIn("sidechaincompress", graph,
                      "the beds must duck against the voice track")
        self.assertNotIn("normalize=1", graph)
        self.assertEqual(graph.count("normalize=0"), graph.count("amix"),
                         "every amix must keep the gains the cue sheet decided")
        self.assertIn("aloop", graph, "a bed has to loop to fill its span")
        self.assertIn("afade=t=in", graph)
        self.assertIn("afade=t=out", graph)
        self.assertEqual(out, "[mix]")

    def test_the_loop_buffer_is_sized_from_the_asset_not_from_a_sentinel(self):
        """aloop's `size` is a sample count and ffmpeg sizes a buffer from it.

        A 2e9 sentinel asks for a two-billion-sample buffer per bed. It never
        misbehaved in practice, so this guards a latent risk rather than fixing an
        observed fault.
        """
        spec = drama.plan(self.manifest, sfx_reg())
        bed = spec["beds"][0]
        self.assertIn("assetSeconds", bed, "the bed must carry its own file length")
        _inputs, graph, _out = drama.build_graph(spec)
        self.assertNotIn("2e9", graph)
        expected = int(bed["assetSeconds"]) * 44100 + 4096
        self.assertIn("aloop=loop=-1:size=%d" % expected, graph)
        self.assertLess(expected, 2_000_000,
                        "a bed's loop buffer should be seconds of audio, not gigabytes")

    def test_an_ungenerated_asset_is_left_out_rather_than_failing_the_mix(self):
        drama.os.path.isfile = lambda p: not p.endswith("hit.mp3")
        spec = drama.plan(self.manifest, sfx_reg())
        self.assertEqual(spec["shots"], [])
        self.assertEqual(len(spec["voices"]), 3, "the voice track is still complete")
        self.assertIn("hit.mp3", spec["missing"])
        inputs, graph, _ = drama.build_graph(spec)
        self.assertEqual(len(inputs), 4)

    def test_the_mix_is_never_written_into_a_voice_clip(self):
        """The export is a convenience. The clips stay canonical."""
        spec = drama.plan(self.manifest, sfx_reg())
        for v in spec["voices"]:
            self.assertEqual(v["gain"], 1.0, "voice is the reference level")
        self.assertIn("-drama", "chapter-09-drama.mp3")
        src = open(os.path.join(os.path.dirname(HERE), "tmbaudio", "drama.py"),
                   encoding="utf-8").read()
        self.assertIn("chapter-%02d-drama.mp3", src,
                      "the layered mix must be its own file, not the voice export")
        self.assertNotIn("clip_paths", src,
                         "the drama export must never write into the clip cache")


def mpeg_frames(version, count):
    """A synthetic Layer III file. version 3 = MPEG-1 44.1k/128k, 2 = MPEG-2 24k/160k."""
    if version == 3:
        header = bytes([0xFF, 0xFB, 0x90, 0x00])      # MPEG-1, layer III, 128 kbps, 44100
        length = 144 * 128 * 1000 // 44100
        seconds = 1152.0 / 44100
    else:
        header = bytes([0xFF, 0xF2, 0xE4, 0x00])      # MPEG-2, layer III, 160 kbps, 24000
        length = 72 * 160 * 1000 // 24000
        seconds = 576.0 / 24000
    frame = header + b"\x00" * (length - 4)
    return frame * count, seconds * count


class Mp3DurationTests(unittest.TestCase):
    """The reader used to assume MPEG-1 and say nothing when it was wrong.

    Everything ElevenLabs returns is MPEG-1 44.1 kHz, so the assumption held until the
    first file a human supplied: a real 45-second 24 kHz recording measured 0.37
    seconds. Nothing raised -- a version-2 header read with version-1 tables is still
    a number -- and as a bed it would have been treated as a third-of-a-second loop.
    MPEG-2 and 2.5 differ in bitrate table, sample-rate table AND samples per frame.
    """

    def setUp(self):
        self.dir = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.dir, ignore_errors=True)

    def _write(self, data):
        path = os.path.join(self.dir, "x.mp3")
        with open(path, "wb") as fh:
            fh.write(data)
        return path

    def test_mpeg1_is_unchanged(self):
        data, expected = mpeg_frames(3, 100)
        self.assertAlmostEqual(cache.mp3_duration_seconds(self._write(data)), expected, places=6)

    def test_mpeg2_is_not_read_with_mpeg1_numbers(self):
        data, expected = mpeg_frames(2, 100)
        got = cache.mp3_duration_seconds(self._write(data))
        self.assertAlmostEqual(got, expected, places=6)
        self.assertAlmostEqual(expected, 2.4, places=6)
        self.assertGreater(got, 1.0,
                           "the old reader returned a small fraction of the real length")

    def test_an_id3_tag_is_skipped(self):
        data, expected = mpeg_frames(2, 50)
        tag = b"ID3\x03\x00\x00\x00\x00\x02\x01" + b"\x00" * 257
        self.assertAlmostEqual(
            cache.mp3_duration_seconds(self._write(tag + data)), expected, places=6)

    def test_a_missing_file_is_zero_not_an_exception(self):
        self.assertEqual(cache.mp3_duration_seconds(os.path.join(self.dir, "nope.mp3")), 0.0)


class SuppliedAudioTests(unittest.TestCase):
    """A file we did not make does not go in without saying who did."""

    SUPPLIED = {"category": "ambience", "source": "supplied", "loop": True,
                "durationSeconds": 30, "approved": True, "godotReuse": True}

    def setUp(self):
        data = json.loads(json.dumps(SFX_DATA))
        data["assets"]["amb_supplied"] = dict(self.SUPPLIED)
        self.sreg = sfxmod.SfxRegistry(data=data,
                                       config=json.loads(json.dumps(SFX_CFG)))

    def _credit(self, **fields):
        self.sreg.assets["amb_supplied"]["credit"] = fields

    def test_a_supplied_asset_without_a_credit_is_refused(self):
        problems = sfxmod.credit_problems(self.sreg, "amb_supplied")
        self.assertTrue(problems)
        for field in ("title", "author", "source", "license"):
            self.assertIn(field, problems[0])

    def test_a_partial_credit_names_what_is_missing(self):
        self._credit(title="Computer Lab", author="freesound_community")
        problems = sfxmod.credit_problems(self.sreg, "amb_supplied")
        self.assertTrue(problems)
        self.assertIn("source", problems[0])
        self.assertIn("license", problems[0])
        self.assertNotIn("author", problems[0])

    def test_a_complete_credit_passes(self):
        self._credit(title="Computer Lab", author="freesound_community",
                     source="Pixabay", license="Pixabay Content License")
        self.assertEqual(sfxmod.credit_problems(self.sreg, "amb_supplied"), [])

    def test_a_generated_asset_needs_no_credit(self):
        self.assertEqual(sfxmod.credit_problems(self.sreg, "sfx_denied"), [],
                         "a generated sound has no author but this project")

    def test_credits_lists_only_supplied_assets(self):
        self._credit(title="Computer Lab", author="freesound_community",
                     source="Pixabay", license="Pixabay Content License")
        rows = sfxmod.credits(self.sreg)
        listed = [r["asset"] for r in rows]
        self.assertIn("amb_supplied", listed)
        self.assertEqual(rows[listed.index("amb_supplied")]["author"], "freesound_community")
        for aid in listed:
            self.assertEqual(self.sreg.source(aid), "supplied",
                             "a generated asset has no credit to list")
        self.assertNotIn("sfx_denied", listed)

    def test_the_attribution_sentence_is_the_wording_joshua_asked_for(self):
        self._credit(title="Night Ambience", author="freesound_community",
                     source="Pixabay", license="Pixabay Content License")
        rows = sfxmod.credits(self.sreg)
        line = [r for r in rows if r["asset"] == "amb_supplied"][0]["attributionLine"]
        self.assertEqual(line, "Sound Effect by freesound_community from Pixabay")

    def test_a_different_author_changes_only_the_name(self):
        self._credit(title="Nature Ambience", author="u_vr5icvkppa",
                     source="Pixabay", license="Pixabay Content License")
        rows = sfxmod.credits(self.sreg)
        line = [r for r in rows if r["asset"] == "amb_supplied"][0]["attributionLine"]
        self.assertEqual(line, "Sound Effect by u_vr5icvkppa from Pixabay")

    def test_the_sentence_is_derived_not_stored(self):
        """An author corrected in one place must not leave a stale sentence behind."""
        self._credit(title="X", author="old_name", source="Pixabay", license="L")
        self.sreg.assets["amb_supplied"]["credit"]["author"] = "new_name"
        rows = sfxmod.credits(self.sreg)
        self.assertIn("new_name",
                      [r for r in rows if r["asset"] == "amb_supplied"][0]["attributionLine"])

    def test_an_explicit_attribution_wins_where_the_standard_form_is_wrong(self):
        self._credit(title="X", author="a", source="Pixabay", license="L",
                     attribution="Music by a from Pixabay")
        self.assertEqual(sfxmod.attribution_line(self.sreg.assets["amb_supplied"]["credit"]),
                         "Music by a from Pixabay")

    def test_kind_can_be_set_without_writing_the_whole_sentence(self):
        self.assertEqual(
            sfxmod.attribution_line({"kind": "Music", "author": "a", "source": "Pixabay"}),
            "Music by a from Pixabay")

    def test_an_incomplete_credit_produces_no_sentence_rather_than_a_broken_one(self):
        self.assertEqual(sfxmod.attribution_line({"author": "a"}), "")
        self.assertEqual(sfxmod.attribution_line({}), "")
        self.assertEqual(sfxmod.attribution_line(None), "")

    def test_the_page_shows_the_credits_at_the_bottom(self):
        root = os.path.dirname(os.path.dirname(HERE))
        page = open(os.path.join(root, "index.html"), encoding="utf-8").read()
        self.assertIn('id="audio-credits"', page)
        self.assertIn("./reader/credits.js", page)
        foot = page.index("<footer")
        self.assertGreater(page.index('id="audio-credits"'), foot,
                           "Joshua asked for it at the bottom")
        feed = json.load(open(os.path.join(root, "reader", "credits.json"), encoding="utf-8"))
        reg = json.load(open(os.path.join(root, "audio", "sfx-registry.json"), encoding="utf-8"))
        supplied = {a for a, v in reg["assets"].items() if v.get("source") == "supplied"}
        self.assertEqual({e["asset"] for e in feed["attributions"]}, supplied,
                         "the footer feed and the registry must list the same sounds")
        for entry in feed["attributions"]:
            self.assertTrue(entry["text"].strip(), "%s has no line" % entry["asset"])

    def test_the_shipped_registry_credits_every_supplied_file(self):
        root = os.path.dirname(os.path.dirname(HERE))
        reg = json.load(open(os.path.join(root, "audio", "sfx-registry.json"), encoding="utf-8"))
        supplied = [a for a, v in reg["assets"].items() if v.get("source") == "supplied"]
        self.assertTrue(supplied, "there is at least one supplied file by now")
        page = open(os.path.join(root, "story-rules", "reference", "AUDIO_CREDITS.md"),
                    encoding="utf-8").read()
        for a in supplied:
            self.assertIn(a, page, "%s is not on the credits page" % a)
            for field in ("title", "author", "source", "license"):
                self.assertTrue(str((reg["assets"][a].get("credit") or {}).get(field) or "").strip(),
                                "%s has no %s" % (a, field))

    def test_every_asset_file_sits_in_its_category_directory(self):
        """Category decides the folder, so re-categorising ORPHANS the file.

        Moving amb_intercom_channel_open from interface to ambience left its mp3
        behind, and the report then offered to generate it again -- a recategorisation
        that would have cost credits. Cheap to check, so it is checked.
        """
        root = os.path.dirname(os.path.dirname(HERE))
        reg = json.load(open(os.path.join(root, "audio", "sfx-registry.json"), encoding="utf-8"))
        stray = []
        for aid, a in reg["assets"].items():
            expected = os.path.join(root, "audio", "sfx", a["category"], aid + ".mp3")
            if not os.path.isfile(expected):
                continue
            for other in os.listdir(os.path.join(root, "audio", "sfx")):
                wrong = os.path.join(root, "audio", "sfx", other, aid + ".mp3")
                if other != a["category"] and os.path.isfile(wrong):
                    stray.append(wrong)
        self.assertEqual(stray, [], "a file left behind by a category change")


class ProceduralTests(unittest.TestCase):
    """A synthesised loop can be PROVEN seamless; a recorded one can only be listened to.

    Joshua, on chapter 3: "The siren doesn't loop cleanly, so maybe do a procedural
    sound until I find one that works and loops." A sweeping tone's phase is the
    INTEGRAL of its frequency, and it returns to where it started only when the file
    is a whole number of sweeps AND a whole number of carrier cycles. Both are checked
    before anything is rendered.
    """

    GOOD = {"seconds": 12, "units": [
        {"centreHz": 500, "sweepHz": 120, "periodSeconds": 6, "level": 0.5}]}

    def test_a_closing_recipe_passes(self):
        self.assertEqual(procmod.seam_problems(self.GOOD), [])

    def test_a_sweep_that_does_not_divide_the_file_is_refused(self):
        bad = {"seconds": 12, "units": [
            {"centreHz": 500, "sweepHz": 120, "periodSeconds": 5, "level": 0.5}]}
        problems = procmod.seam_problems(bad)
        self.assertTrue(problems)
        self.assertIn("mid-stroke", problems[0])

    def test_a_carrier_that_does_not_close_is_refused(self):
        bad = {"seconds": 12, "units": [
            {"centreHz": 500.37, "sweepHz": 120, "periodSeconds": 6, "level": 0.5}]}
        problems = procmod.seam_problems(bad)
        self.assertTrue(problems)
        self.assertIn("whole number of", problems[0])

    def test_the_expression_is_the_phase_integral_not_the_naive_form(self):
        expr = procmod.expression(self.GOOD)
        self.assertIn("cos(2*PI*t/6)", expr,
                      "the cosine term IS the integral; without it this is not a sweep")
        self.assertIn("2*PI*500*t", expr)
        self.assertNotIn("sin(2*PI*(", expr, "sin(2*pi*f(t)*t) is the wrong thing")

    def test_the_sweep_amplitude_is_scaled_by_the_period(self):
        """sweep * period is what the integral produces; dropping the period would
        make a 3-second sweep and a 12-second sweep move the same distance."""
        a = procmod.expression({"seconds": 12, "units": [
            {"centreHz": 500, "sweepHz": 100, "periodSeconds": 6, "level": 1}]})
        b = procmod.expression({"seconds": 12, "units": [
            {"centreHz": 500, "sweepHz": 100, "periodSeconds": 3, "level": 1}]})
        self.assertIn("600*cos", a)
        self.assertIn("300*cos", b)

    def test_a_recipe_change_is_what_triggers_a_rebuild(self):
        one = procmod.recipe_fingerprint(self.GOOD)
        self.assertEqual(one, procmod.recipe_fingerprint(dict(self.GOOD)))
        other = dict(self.GOOD)
        other["seconds"] = 24
        self.assertNotEqual(one, procmod.recipe_fingerprint(other))

    def test_the_shipped_sirens_close_exactly(self):
        root = os.path.dirname(os.path.dirname(HERE))
        reg = json.load(open(os.path.join(root, "audio", "sfx-registry.json"), encoding="utf-8"))
        procedural = {a: v for a, v in reg["assets"].items() if v.get("source") == "procedural"}
        self.assertTrue(procedural, "the sirens are procedural now")
        for aid, asset in procedural.items():
            self.assertEqual(procmod.seam_problems(asset.get("recipe") or {}), [],
                             "%s would not loop cleanly" % aid)

    def test_procedural_audio_is_never_sent_to_the_provider(self):
        root = os.path.dirname(os.path.dirname(HERE))
        reg = json.load(open(os.path.join(root, "audio", "sfx-registry.json"), encoding="utf-8"))
        sreg = sfxmod.SfxRegistry(data=reg, config=json.loads(json.dumps(SFX_CFG)))
        for aid, asset in reg["assets"].items():
            if asset.get("source") != "procedural":
                continue
            plan = sfxmod.plan_asset(sreg, aid)
            self.assertNotEqual(plan["source"], "generated",
                                "%s must never reach generate-sfx" % aid)
            self.assertIsNone(asset.get("prompt"),
                              "a procedural asset has a recipe, not a prompt")

    def test_a_procedural_loop_is_written_as_wav_not_mp3(self):
        """The waveform closed and the file still looped late: the CONTAINER was wrong.

        mp3 carries encoder delay in front and padding behind, and `<audio loop>` plays
        both, so a perfect twelve seconds comes back a few dozen milliseconds late every
        time round -- "not looping with a slight offset", as Joshua put it. WAV stores
        an exact sample count.
        """
        root = os.path.dirname(os.path.dirname(HERE))
        reg = json.load(open(os.path.join(root, "audio", "sfx-registry.json"), encoding="utf-8"))
        sreg = sfxmod.SfxRegistry(data=reg, config=json.loads(json.dumps(SFX_CFG)))
        for aid, asset in reg["assets"].items():
            if asset.get("source") != "procedural":
                continue
            audio, _ = sfxmod.asset_paths(sreg, aid)
            if asset.get("loop"):
                self.assertTrue(audio.endswith(".wav"),
                                "%s loops, so it must not be an mp3" % aid)
            else:
                self.assertTrue(audio.endswith(".mp3"),
                                "%s is played once; mp3 padding costs nothing" % aid)

    def test_a_procedural_asset_is_never_web_compressed(self):
        src = open(os.path.join(os.path.dirname(os.path.dirname(HERE)),
                                "scripts", "tmbaudio", "normalize.py"), encoding="utf-8").read()
        self.assertIn('sreg.source(asset_id) == "procedural"', src)
        self.assertIn("encoder padding", src,
                      "compressing a wav loop to mp3 would undo the fix")

    PULSE = {"kind": "pulse", "seconds": 18.6, "toneHz": 760, "onSeconds": 0.65,
             "offSeconds": 0.35, "pulsesPerGroup": 3, "gapSeconds": 1.65, "level": 0.5}

    def test_joshuas_pattern_is_what_gets_built(self):
        """"Ping (last 0.65s) > (Duration between next ping 1s) for a total of 3 pings
        > 2s silence." Every one of those numbers has to survive into the file."""
        self.assertEqual(procmod.pulse_seam_problems(self.PULSE), [])
        r = self.PULSE
        period = r["onSeconds"] + r["offSeconds"]
        group = r["pulsesPerGroup"] * period + r["gapSeconds"]
        self.assertAlmostEqual(period, 1.0, places=9, msg="one second from ping to ping")
        self.assertAlmostEqual(r["onSeconds"], 0.65, places=9)
        self.assertEqual(r["pulsesPerGroup"], 3)
        self.assertAlmostEqual(r["offSeconds"] + r["gapSeconds"], 2.0, places=9,
                               msg="two seconds of silence after the third ping")
        self.assertAlmostEqual(r["seconds"] / group, round(r["seconds"] / group), places=9)

    def test_the_pulse_is_timed_from_the_group_not_the_file(self):
        """A global mod counts from the start of the FILE, so it only lines up when the
        gap is a whole number of on/off cycles -- which would have forced the 2-second
        silence to some other number. Nesting the mods removes the constraint."""
        expr = procmod.expression(self.PULSE)
        self.assertIn("mod(mod(t,4.65),1)", expr)
        self.assertNotIn("*lt(mod(t,1),", expr, "that is the file-relative version")

    def test_a_pulse_is_one_tone_not_several(self):
        """Joshua: "I'm also hearing a crossing two sirens at once?" He was."""
        expr = procmod.expression(self.PULSE)
        self.assertEqual(expr.count("sin(2*PI*"), 1, "one carrier, one machine")

    def test_the_loop_point_falls_inside_silence(self):
        """Which is why the pause cannot come back, whatever the container adds."""
        r = self.PULSE
        group = r["pulsesPerGroup"] * (r["onSeconds"] + r["offSeconds"]) + r["gapSeconds"]
        last_ping_ends = (r["pulsesPerGroup"] - 1) * (r["onSeconds"] + r["offSeconds"]) \
            + r["onSeconds"]
        self.assertLess(last_ping_ends, group,
                        "the group must end quiet, or the join is audible again")
        self.assertGreater(group - last_ping_ends, 1.0,
                           "and with room to spare, so padding is swallowed by it")

    def test_a_gap_of_zero_is_refused(self):
        bad = dict(self.PULSE, gapSeconds=0)
        problems = procmod.pulse_seam_problems(bad)
        self.assertTrue(problems)
        self.assertIn("silence", problems[0])

    def test_a_file_that_cuts_a_group_in_half_is_refused(self):
        bad = dict(self.PULSE, seconds=17.0)
        self.assertIn("cut a group in half", procmod.pulse_seam_problems(bad)[0])

    def test_the_alarms_joshua_kept_are_untouched(self):
        """"Alarms are fine with the existing audio files." Only the sirens changed."""
        root = os.path.dirname(os.path.dirname(HERE))
        reg = json.load(open(os.path.join(root, "audio", "sfx-registry.json"), encoding="utf-8"))
        for aid in ("amb_console_alarm_bed", "sfx_alert_warning_hit",
                    "sfx_console_alarm_erupt"):
            self.assertEqual(reg["assets"][aid]["source"], "generated",
                             "%s must stay the file it already is" % aid)
            self.assertNotIn("recipe", reg["assets"][aid])

    def test_a_one_shot_may_fade_and_a_loop_may_not(self):
        """A fade is a seam. On a one-shot it is shape; on a loop it is the bug."""
        winddown = {"kind": "winddown", "seconds": 10, "startHz": 600,
                    "holdSeconds": 3, "tauSeconds": 3, "fadeOutMs": 4000, "loop": False}
        self.assertEqual(procmod.seam_problems(winddown), [],
                         "a sound played once has nothing to close")
        self.assertEqual(procmod.seam_problems({"seconds": 12, "loop": False,
                                                "units": []}), [])

    def test_the_winddown_phase_falls_away_rather_than_sweeping(self):
        expr = procmod.expression({"kind": "winddown", "seconds": 10, "startHz": 600,
                                   "holdSeconds": 3, "tauSeconds": 3, "level": 0.6})
        self.assertIn("min(t,3)", expr, "it holds before it falls")
        self.assertIn("exp(-max(0,t-3)/3)", expr, "and then decays")
        self.assertNotIn("cos(", expr, "a wind-down does not sweep back up")

class ApiRefusalTests(unittest.TestCase):
    """A 401 is two different problems, and the message has to say which.

    On 2026-09-21 a run generated 156 clips and then failed 572 in a row, and all the
    pipeline could say was "Check the ELEVENLABS_API_KEY secret" -- which pointed at
    the one thing that had not changed. The reason is in the response body and was
    being thrown away.
    """

    class FakeError(urllib.error.HTTPError):
        def __init__(self, code, body):
            self._body = body.encode("utf-8")
            urllib.error.HTTPError.__init__(self, "u", code, "m", {}, None)

        def read(self):
            return self._body

    def test_a_spent_quota_does_not_send_anyone_to_check_the_key(self):
        said = elevenlabs._refusal(self.FakeError(401, json.dumps(
            {"detail": {"status": "quota_exceeded",
                        "message": "You have 0 credits remaining"}})))
        self.assertIn("quota_exceeded", said)
        self.assertIn("ACCOUNT IS OUT", said)
        self.assertNotIn("Check the ELEVENLABS_API_KEY", said)

    def test_a_bad_key_still_says_to_check_the_key(self):
        said = elevenlabs._refusal(self.FakeError(401, json.dumps(
            {"detail": {"status": "invalid_api_key", "message": "bad key"}})))
        self.assertIn("invalid_api_key", said)
        self.assertIn("Check the ELEVENLABS_API_KEY", said)

    def test_a_flagged_account_says_re_running_will_not_help(self):
        said = elevenlabs._refusal(self.FakeError(401, json.dumps(
            {"detail": {"status": "detected_unusual_activity", "message": "blocked"}})))
        self.assertIn("re-running will not help", said)

    def test_an_unreadable_body_still_produces_a_usable_message(self):
        said = elevenlabs._refusal(self.FakeError(403, "<html>gateway</html>"))
        self.assertIn("HTTP 403", said)
        self.assertIn("Check the ELEVENLABS_API_KEY", said)

    def test_the_key_is_never_echoed_even_if_the_server_sends_it_back(self):
        """Belt and braces: printing a secret once is permanent."""
        os.environ["ELEVENLABS_API_KEY"] = "sk_secret_value"
        try:
            said = elevenlabs._refusal(self.FakeError(401, json.dumps(
                {"detail": {"status": "invalid_api_key",
                            "message": "key sk_secret_value is not valid"}})))
        finally:
            del os.environ["ELEVENLABS_API_KEY"]
        self.assertNotIn("sk_secret_value", said)
        self.assertIn("<the key>", said)


class SingleFileExportTests(unittest.TestCase):
    """Every chapter gets an indexable one-file export, sound design or not.

    The export used to refuse a chapter with no cue sheet, on the grounds that the
    plain combined file "already is the mix". True about the sound and false about the
    page: the plain file is an mp3 `-c copy` join, which cannot be seeked into, so
    chapters 4 to 6 would have played as 195, 266 and 304 separate elements assembled
    live -- the arrangement every playback bug this project has had came from.
    """

    def test_the_mix_does_not_depend_on_a_chapter_having_cues(self):
        """Tested on the BEHAVIOUR, not on a chapter that happens to lack a cue sheet.

        This used to assert that chapters 4 to 6 had no cues -- true when they were
        voices only, false an hour later when they were designed, and it failed saying
        so. The circumstance was never the point: the point is that a chapter with
        nothing but voices still produces a mixable, indexable timeline, because that
        is what lets it play as one file."""
        manifest = {
            "chapter": 99, "cues": [],
            "segments": [
                {"order": 0, "audio": "audio/clips/n/a.mp3", "pauseBeforeMs": 0},
                {"order": 1, "audio": "audio/clips/n/b.mp3", "pauseBeforeMs": 300},
            ],
        }
        real = drama.cache.mp3_duration_seconds
        drama.cache.mp3_duration_seconds = lambda p: 2.0
        real_isfile, drama.os.path.isfile = drama.os.path.isfile, lambda p: True
        try:
            spec = drama.plan(manifest, sfx_reg())
        finally:
            drama.cache.mp3_duration_seconds = real
            drama.os.path.isfile = real_isfile
        self.assertEqual(len(spec["voices"]), 2)
        self.assertEqual(spec["beds"], [])
        self.assertEqual(spec["shots"], [])
        self.assertAlmostEqual(spec["voices"][1]["at"], 2.3, places=3)
        inputs, graph, out = drama.build_graph(spec)
        self.assertEqual(len(inputs), 2)
        self.assertIn("adelay=2300", graph)

    def test_a_finished_chapter_is_never_left_playing_clip_by_clip(self):
        """The invariant, not the release state.

        This asserted that every chapter's audio existed, which made the tests fail the
        moment a line was edited -- and the tests are the FIRST step of the generation
        workflow, so it blocked the run that would have fixed it. A test that fails
        because work is outstanding is a test that has to be disabled to do the work.

        What actually matters is the implication: a chapter with all its clips is
        playable as one file. A chapter mid-edit is exempt, and the manifest says which
        it is."""
        checked = 0
        for n in sorted(mf.chapter_files()):
            m = json.load(open("audio/manifests/chapter-%02d.json" % n, encoding="utf-8"))
            if not m["timeline"]["complete"]:
                continue
            checked += 1
            self.assertTrue(((m.get("exports") or {}).get("mixed") or {}).get("startMs"),
                            "chapter %d has every clip and still cannot be played as "
                            "one file" % n)
        self.assertTrue(checked, "no chapter is complete; the check proved nothing")

    def test_the_index_is_the_arithmetic_the_mix_was_built_from(self):
        """If these drift apart the page highlights one line while another is read."""
        for n in (4, 6):
            m = json.load(open("audio/manifests/chapter-%02d.json" % n, encoding="utf-8"))
            if not m["timeline"]["complete"]:
                continue
            self.assertEqual(m["exports"]["mixed"]["startMs"],
                             [s["startMs"] for s in m["segments"]])


class SmartQuoteTests(unittest.TestCase):
    """Word's autocorrect must not be able to re-identify a line.

    Joshua edits the manuscript in Word and re-sends it. Word turns a typed apostrophe
    into a curly one, and a curly apostrophe used to hash differently from a straight
    one -- so a round trip through Word would have regenerated every line it touched
    for a difference nobody can hear. Caught on 2026-09-21 when exactly that happened
    to one line of chapter 1.
    """

    STRAIGHT = "Sarah's hands went still."
    CURLY = "Sarah\u2019s hands went still."

    def test_a_curly_apostrophe_is_the_same_clip_as_a_straight_one(self):
        self.assertEqual(parse.clip_id("narrator", self.STRAIGHT),
                         parse.clip_id("narrator", self.CURLY))

    def test_curly_double_quotes_fold_too(self):
        self.assertEqual(parse.normalize("\u201cWarning.\u201d"), '"Warning."')

    def test_a_dash_or_an_ellipsis_is_left_alone(self):
        """Those change how a line is READ, so they are a real difference."""
        for mark in ("\u2014", "\u2013", "\u2026"):
            self.assertIn(mark, parse.normalize("stopped %s then went on" % mark))

    def test_no_existing_clip_changed_identity(self):
        """The fold was free: nothing in the book used curly punctuation, so every id
        this pins is the one already generated."""
        reg = Registry()
        for n, path in sorted(mf.chapter_files().items()):
            for seg in parse.parse_chapter(path, reg, mf.load_overrides())["segments"]:
                self.assertEqual(seg["clipId"],
                                 parse.clip_id(seg["speaker"], seg["ttsText"]))


class QuietEventTests(unittest.TestCase):
    """The catastrophe is quiet, and that is a thing the audio can contradict.

    Joshua's revision, 2026-09-21: Jack tells Lena to keep the laboratory isolated and
    NOT sound a settlement alarm, and nearly five hundred people sleep through the
    activation. The distinction he drew is the one these tests hold:

        a local console warning tone  -- yes, the revised text keeps them
        a settlement-wide siren       -- no, not before the activation

    These replace five tests that pinned the old sirens' level, filtering and pitch
    change. Those were correct about a story that no longer exists; a test that
    defends deleted canon is worse than no test, because it argues for putting it back.
    """

    SETTLEMENT = ("amb_alarm_pulse", "amb_alarm_pulse_fast", "sfx_siren_winddown",
                  "amb_settlement_sirens")

    def _cues(self, n):
        return sfxmod.load_cues(n).get("cues") or []

    def test_no_settlement_siren_sounds_anywhere_in_the_quiet_night(self):
        for n in (1, 2, 3, 4):
            for cue in self._cues(n):
                self.assertNotIn(cue["asset"], self.SETTLEMENT,
                                 "chapter %d still cues %s (%s). The settlement does "
                                 "not sound an alarm before the activation."
                                 % (n, cue["asset"], cue["cueId"]))

    def test_the_local_console_tones_are_still_there(self):
        """The other half of the rule. Silencing the lab's own warnings would be the
        opposite mistake: the chapter opens on a console waking Jack up."""
        assets = {c["asset"] for c in self._cues(1)}
        self.assertIn("sfx_console_tone_soft", assets)
        self.assertIn("sfx_alert_warning_hit", assets)

    def test_no_spoken_line_orders_an_evacuation_or_a_settlement_alarm(self):
        reg = Registry()
        overrides = mf.load_overrides()
        for n, path in sorted(mf.chapter_files().items()):
            for seg in parse.parse_chapter(path, reg, overrides)["segments"]:
                said = seg["displayText"].lower()
                for phrase in ("full evacuation", "evacuation protocol",
                               "settlement-wide emergency", "sirens began"):
                    self.assertNotIn(phrase, said,
                                     "chapter %d still says %r: %r"
                                     % (n, phrase, seg["displayText"][:70]))

    def test_the_removed_cues_are_recorded_rather_than_vanished(self):
        """A cue sheet says why a cue went, so the next person does not re-add it."""
        removed = []
        for n in (1, 2, 3):
            removed += sfxmod.load_cues(n).get("_removed") or []
        self.assertGreaterEqual(len(removed), 6)
        for entry in removed:
            self.assertTrue(entry.get("why"), "%s was removed with no reason" % entry)


class VoiceAssignmentTests(unittest.TestCase):
    """An unassigned voice holds up its own lines. An ambiguous speaker stops the run.

    These were the same condition until 2026-09-21, and collapsing them meant Doctor
    Mercer's nine lines could hold up the other 186 segments of chapter 4. Joshua: "Do
    not block the entire audio update because one new character needs a voice."
    """

    def _summary(self, number):
        reg = Registry()
        m = mf.build(number, mf.chapter_files()[number], reg)
        return mf.summarize(m, reg), reg

    def test_a_character_with_no_voice_does_not_block_the_chapter(self):
        """Driven against a registry with the voice taken back out, so it keeps testing
        the rule after Joshua assigned one -- the whole point is the state the book was
        in for the hours between Chapter 4 arriving and its voices being chosen."""
        reg = Registry()
        m = mf.build(4, mf.chapter_files()[4], reg)
        speakers = {seg["speaker"] for seg in m["segments"]}
        self.assertIn("doctor-mercer", speakers)
        unvoiced = {"doctor-mercer"}
        waiting = [x for x in m["segments"] if x["speaker"] in unvoiced]
        others = [x for x in m["segments"] if x["speaker"] not in unvoiced]
        self.assertTrue(waiting)
        self.assertGreater(len(others), 150,
                           "the rest of the chapter has to remain generatable")
        self.assertFalse(mf.summarize(m, reg)["blocked"])

    def test_an_ambiguous_speaker_still_stops_everything(self):
        """The narrower rule must not have widened into 'nothing ever blocks'."""
        reg = Registry()
        m = mf.build(1, mf.chapter_files()[1], reg)
        m["segments"][0] = dict(m["segments"][0], speaker=REVIEW, method="unresolved")
        self.assertTrue(mf.summarize(m, reg)["blocked"])

    def test_every_voice_in_use_is_the_one_the_repository_configured(self):
        """Joshua listed four ids and told us to take Lena's from the repository. This
        pins all five so a regeneration cannot quietly recast anybody."""
        reg = Registry()
        expect = {
            "jack-bennett": "mkT7KpSQR9btjx2rHpQY",
            "sarah-bennett": "MClEFoImJXBTgLwdLI5n",
            "system": "QpRibeuwXoGrlpLFDwqY",
            "narrator": "XjLkpWUlnhS8i7gGz3lZ",
            "lena-ortiz": "4O1sYUnmtThcBoSBrri7",
            "doctor-mercer": "EXAVITQu4vr4xnSDxMaL",
            "security-officer": "TX3LPaxmHKxFdv7VOQHJ",
        }
        for speaker, voice in expect.items():
            self.assertEqual(reg.voice_id(speaker), voice, speaker)


class WebEncodeTests(unittest.TestCase):
    """Smaller files, and the original never lost.

    Joshua: "Can we compress audio or convert to MP3 which is less large?" It is
    already mp3, so the levers are bitrate and channels -- and the risk is that a
    second pass re-encodes an already-compressed file and quality decays quietly.
    """

    def setUp(self):
        self.dir = tempfile.mkdtemp()
        self.sreg = sfx_reg()
        self._sfx_dir = sfxmod.SFX_DIR
        sfxmod.SFX_DIR = os.path.join(self.dir, "sfx")
        self.sreg.assets["amb_big"] = {
            "category": "ambience", "source": "supplied", "loop": True,
            "durationSeconds": 600, "approved": True, "godotReuse": True,
            "credit": {"title": "Nature Ambience", "author": "u_vr5icvkppa",
                       "source": "Pixabay", "license": "Pixabay Content License"},
        }
        self._measure, self._ffmpeg, self._run = (
            normmod.measure, normmod.ffmpeg, normmod.subprocess.run)
        normmod.measure = lambda p: (-20.0, -40.0, 600.0)
        normmod.ffmpeg = lambda: "ffmpeg"
        self.encodes = []

        self.loudness = FakeLoudness()

        def fake_run(cmd, **kw):
            if self.loudness.handles(cmd):
                return self.loudness.answer(cmd, lambda p: (-20.0, -40.0, 600.0))
            src = cmd[cmd.index("-i") + 1]
            kbps = cmd[cmd.index("-b:a") + 1]
            chans = cmd[cmd.index("-ac") + 1]
            self.encodes.append({"from": src, "kbps": kbps, "channels": chans})
            with open(cmd[-1], "wb") as fh:
                fh.write(b"x" * 4000)          # a much smaller file
            return None
        normmod.subprocess.run = fake_run

    def tearDown(self):
        normmod.measure, normmod.ffmpeg = self._measure, self._ffmpeg
        normmod.subprocess.run = self._run
        sfxmod.SFX_DIR = self._sfx_dir
        shutil.rmtree(self.dir, ignore_errors=True)

    def _place(self, megabytes):
        audio, sidecar = sfxmod.asset_paths(self.sreg, "amb_big")
        os.makedirs(os.path.dirname(audio), exist_ok=True)
        with open(audio, "wb") as fh:
            fh.write(b"y" * int(megabytes * 1048576))
        return audio, sidecar

    def test_a_large_supplied_file_is_compressed_and_the_original_kept(self):
        audio, sidecar = self._place(18)
        done, failed = normmod.normalize_assets(self.sreg, ["amb_big"], log=lambda *a: None)
        self.assertEqual((done, failed), (1, 0))
        master = normmod.source_path(audio)
        self.assertTrue(os.path.isfile(master), "the delivered file must be kept")
        self.assertEqual(os.path.getsize(master), 18 * 1048576)
        self.assertLess(os.path.getsize(audio), os.path.getsize(master))
        block = cache.read_sidecar(sidecar)["webEncode"]
        self.assertEqual(block["maxKbps"], 64)
        self.assertEqual(block["channels"], 1)
        self.assertAlmostEqual(block["originalMb"], 18.0, places=1)
        self.assertEqual(self.encodes[0]["kbps"], "64k")
        self.assertEqual(self.encodes[0]["channels"], "1")

    def test_a_small_supplied_file_is_only_measured(self):
        audio, sidecar = self._place(0.4)
        normmod.normalize_assets(self.sreg, ["amb_big"], log=lambda *a: None)
        self.assertEqual(self.encodes, [], "nothing to gain, so nothing is re-encoded")
        self.assertFalse(os.path.isfile(normmod.source_path(audio)))
        self.assertIn("measured", cache.read_sidecar(sidecar))

    def test_compressing_twice_re_encodes_from_the_original(self):
        audio, _ = self._place(18)
        normmod.normalize_assets(self.sreg, ["amb_big"], log=lambda *a: None)
        normmod.normalize_assets(self.sreg, ["amb_big"], force=True, log=lambda *a: None)
        self.assertEqual(len(self.encodes), 2)
        self.assertTrue(self.encodes[1]["from"].endswith(normmod.SOURCE_SUFFIX),
                        "a second pass must not compress an already-compressed file")

    def test_a_second_run_at_the_same_settings_does_nothing(self):
        self._place(18)
        normmod.normalize_assets(self.sreg, ["amb_big"], log=lambda *a: None)
        done, _ = normmod.normalize_assets(self.sreg, ["amb_big"], log=lambda *a: None)
        self.assertEqual((done, len(self.encodes)), (0, 1))

    def test_changing_the_bitrate_re_encodes(self):
        self._place(18)
        normmod.normalize_assets(self.sreg, ["amb_big"], log=lambda *a: None)
        self.sreg.config["sfx"]["webEncode"] = {"maxKbps": 48}
        done, _ = normmod.normalize_assets(self.sreg, ["amb_big"], log=lambda *a: None)
        self.assertEqual(done, 1)
        self.assertEqual(self.encodes[-1]["kbps"], "48k")

    def test_the_measurement_is_of_what_actually_plays(self):
        _, sidecar = self._place(18)
        normmod.normalize_assets(self.sreg, ["amb_big"], log=lambda *a: None)
        m = cache.read_sidecar(sidecar)["measured"]
        self.assertIn("after web encoding", m["source"],
                      "the cue gain is derived from this, so it must be the served file")

    def test_the_drama_export_encodes_from_config(self):
        sreg = sfx_reg()
        sreg.config["mix"]["exportEncode"] = {"dramaKbps": 96, "channels": 1,
                                              "sampleRate": 44100}
        self.assertEqual(drama.export_encode(sreg)["dramaKbps"], 96)
        src = open(os.path.join(os.path.dirname(os.path.dirname(HERE)),
                                "scripts", "tmbaudio", "drama.py"), encoding="utf-8").read()
        self.assertNotIn('"-b:a", "192k"', src, "the hard-coded stereo bitrate is gone")
        self.assertIn('enc["dramaKbps"]', src)

    def test_the_voice_export_is_still_a_lossless_copy(self):
        src = open(os.path.join(os.path.dirname(os.path.dirname(HERE)),
                                "scripts", "tmbaudio", "combine.py"), encoding="utf-8").read()
        self.assertIn('"-c", "copy"', src,
                      "re-encoding the narration to save a few megabytes spends quality "
                      "on the one thing the project is for")


class LayerSwitchTests(unittest.TestCase):
    """A layer switched off must be off in BOTH renderers.

    drama.py used to ignore mix.layers, so turning ambience off silenced it in the
    browser while the delivered mp3 still carried it -- the page and the file quietly
    disagreeing, which is the failure mode this project has paid for twice.
    """

    def _manifest(self, layers):
        return {
            "chapter": 1,
            "segments": [{"order": 0, "audio": "a.mp3", "pauseBeforeMs": 0}],
            "mix": {"layers": layers},
            "cues": [
                {"cueId": "bed", "asset": "amb", "category": "ambience",
                 "layer": "ambience", "timing": "before", "order": 0, "gain": 0.1,
                 "audio": "amb.mp3", "stopOrder": 0},
                {"cueId": "hit", "asset": "fx", "category": "foley", "layer": "sfx",
                 "timing": "during", "order": 0, "gain": 0.4, "audio": "fx.mp3"},
            ],
        }

    def _plan(self, layers, tmp):
        for name in ("a.mp3", "amb.mp3", "fx.mp3"):
            with open(os.path.join(tmp, name), "wb") as fh:
                fh.write(FAKE_AUDIO)
        real_root = drama.ROOT
        real_dur = cache.mp3_duration_seconds
        drama.ROOT = tmp
        cache.mp3_duration_seconds = lambda p: 2.0
        try:
            return drama.plan(self._manifest(layers), sfx_reg())
        finally:
            drama.ROOT = real_root
            cache.mp3_duration_seconds = real_dur

    def test_ambience_off_keeps_it_out_of_the_exported_file(self):
        tmp = tempfile.mkdtemp()
        try:
            spec = self._plan({"voice": True, "ambience": False, "sfx": True}, tmp)
            self.assertEqual(spec["beds"], [],
                             "an ambience bed must not reach the mp3 when the layer is off")
            self.assertEqual([s["cueId"] for s in spec["shots"]], ["hit"],
                             "the sfx layer is unaffected")
            self.assertEqual(len(spec["voices"]), 1, "the voices are never switched off")
        finally:
            shutil.rmtree(tmp, ignore_errors=True)

    def test_both_layers_on_is_the_old_behaviour(self):
        tmp = tempfile.mkdtemp()
        try:
            spec = self._plan({"voice": True, "ambience": True, "sfx": True}, tmp)
            self.assertEqual([b["cueId"] for b in spec["beds"]], ["bed"])
            self.assertEqual([s["cueId"] for s in spec["shots"]], ["hit"])
        finally:
            shutil.rmtree(tmp, ignore_errors=True)

    def test_a_missing_layers_block_switches_nothing_off(self):
        tmp = tempfile.mkdtemp()
        try:
            spec = self._plan({}, tmp)
            self.assertEqual(len(spec["beds"]) + len(spec["shots"]), 2,
                             "absence of a switch is not the same as off")
        finally:
            shutil.rmtree(tmp, ignore_errors=True)

    def test_one_switch_drives_both_renderers(self):
        """Whatever the layers are set to, the page and the file must agree.

        Ambience went off when Joshua had no bed he liked and back on when he supplied
        one, so the VALUE is his to change. What must not change is that changing it
        in one place changes both."""
        root = os.path.dirname(os.path.dirname(HERE))
        cfg = json.load(open(os.path.join(root, "audio", "config.json"), encoding="utf-8"))
        layers = cfg["mix"]["layers"]
        for name in ("voice", "ambience", "sfx"):
            self.assertIsInstance(layers[name], bool, "%s must be a real switch" % name)
        self.assertIs(layers["voice"], True, "the voices are never switched off")
        src = open(os.path.join(root, "reader", "sfx.js"), encoding="utf-8").read()
        self.assertIn("layers[name] === false", src,
                      "the browser reads the same switch")
        dram = open(os.path.join(root, "scripts", "tmbaudio", "drama.py"), encoding="utf-8").read()
        self.assertIn('layers_on.get(cue.get("layer")) is False', dram,
                      "and so does the exported file")


class CombineGuardTests(unittest.TestCase):
    """Without ffmpeg the join has no gaps, which must not replace a good export."""

    def test_source_refuses_to_overwrite_a_good_export_with_a_gapless_one(self):
        src = open(os.path.join(os.path.dirname(HERE), "tmbaudio", "combine.py"),
                   encoding="utf-8").read()
        self.assertIn("force_gapless", src)
        self.assertIn("Refusing", src)
        head = src[src.index("else:"):]
        self.assertLess(head.index("force_gapless"), head.index('open(out, "wb")'),
                        "the guard has to come before the write")


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

    def test_sfx_generation_is_opt_in_and_unreachable_from_a_push(self):
        """Joshua's rule: sound generation is never wired to a push or a deploy.

        Two independent guards: the workflow is workflow_dispatch only (asserted
        above), and the sound step additionally requires an input that defaults to
        false, so even a manual voice run does not quietly spend credits on audio.
        """
        text = self.text
        self.assertIn("generate_sfx:", text, "expected an explicit opt-in input")
        block = text[text.index("generate_sfx:"):text.index("generate_sfx:") + 260]
        self.assertIn("default: false", block,
                      "sound generation must be off unless a human ticks it")
        step = text[text.index("Generate sound effects"):]
        self.assertIn("if: inputs.generate_sfx", step.split("run:")[0],
                      "the sound step must be gated on that input")

    def test_the_measurement_step_accepts_the_same_chapter_range_as_everything_else(self):
        """The workflow passes its `chapters` input straight through.

        measure-mix.py took an int, so "2-3" made it exit 2 -- and because the step is
        continue-on-error the measurement simply never ran and said nothing about it.
        """
        import importlib.util
        path = os.path.join(os.path.dirname(HERE), "measure-mix.py")
        spec = importlib.util.spec_from_file_location("measure_mix", path)
        mm = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mm)
        self.assertEqual(mm.parse_chapters("2-3"), [2, 3])
        self.assertEqual(mm.parse_chapters("1"), [1])
        self.assertEqual(mm.parse_chapters("1,3"), [1, 3])
        step = self.text[self.text.index("measure-mix.py"):]
        self.assertIn("inputs.chapters", step.split("\n")[0],
                      "the step passes the workflow's range, so the script must take one")

    def test_paid_for_audio_is_committed_even_when_generation_partly_fails(self):
        """The failure that cost 19 already-generated assets.

        One HTTP 400 aborted the job, which skipped the commit, and the runner took
        19 paid-for sounds with it. Generation steps now continue on error so the
        commit still runs, and a report step AFTER the commit fails the run. The
        ORDER is the fix -- a report before the commit is the original bug.
        """
        text = self.text
        for step in ("Generate sound effects and ambience", "Generate\n"):
            idx = text.find("- name: " + step.rstrip("\n"))
            self.assertNotEqual(idx, -1, "expected a %r step" % step)
            block = text[idx:idx + 900]
            self.assertIn("continue-on-error: true", block,
                          "%s must not abort the job and strand paid-for audio" % step)
        commit = text.index("- name: Commit the generated audio")
        report = text.index("- name: Report any generation failures")
        self.assertLess(commit, report,
                        "the failure report must come AFTER the commit, or a partial "
                        "run loses the assets it already paid for")
        self.assertIn("exit 1", text[report:], "a partial run must still fail visibly")

    def test_the_secret_is_never_interpolated_into_a_shell_line(self):
        self.assertIn("secrets.ELEVENLABS_API_KEY", self.text,
                      "the workflow has to read the secret from somewhere")
        for line in self._run_lines():
            if "secrets.ELEVENLABS_API_KEY" not in line:
                continue
            self.assertTrue(line.startswith("ELEVENLABS_API_KEY:"),
                            "the secret may only be bound to an env var, never pasted "
                            "into a command where a log could capture it: " + line)


# ---- normalisation ---------------------------------------------------------
# No ffmpeg and no audio. The fake below stands in for BOTH the decoder and the
# encoder, carrying a level in the file's own bytes, so the tests exercise the real
# decision-making and the real file handling rather than a description of them.

def fake_file(rms, peak):
    return ("LEVEL rms=%.2f peak=%.2f" % (rms, peak)).encode()


class FakeLoudness(object):
    """Answers an `ebur128` call the way ffmpeg does, and DELIBERATELY NOT AT THE RMS.

    A fake that returned the RMS back would reproduce exactly the mistake this whole
    change is about -- treating two different measurements as one number -- and every
    test would pass while the code went on reading the wrong one. The offset is
    settable so a test can say which number it expects to come out the other end.
    """

    def __init__(self, offset=-6.0):
        self.offset = offset
        self.calls = []

    def handles(self, cmd):
        return any("ebur128" in str(a) for a in cmd)

    def answer(self, cmd, level_of):
        path = cmd[cmd.index("-i") + 1]
        self.calls.append(path)
        try:
            _peak, rms, _sec = level_of(path)
        except Exception:                      # a file the level fake cannot read
            rms = -20.0
        text = ("  Integrated loudness:\n    I:  %.1f LUFS\n    Threshold: -30.0 LUFS\n"
                % (rms + self.offset))
        return types.SimpleNamespace(returncode=0, stdout="", stderr=text)


def read_level(path):
    text = open(path, "rb").read().decode()
    rms = float(text.split("rms=")[1].split()[0])
    peak = float(text.split("peak=")[1].split()[0])
    return peak, rms, 3.0


class NormalizeMathTests(unittest.TestCase):
    """The gain is a decision with two constraints, and the tighter one wins."""

    CONF = dict(normmod.DEFAULTS)

    def test_rms_target_when_there_is_headroom(self):
        applied, why = normmod.gain_for(-40.0, -50.0, self.CONF)
        self.assertEqual(applied, 30.0)          # -50 -> -20
        self.assertEqual(why, "rms target")

    def test_peak_ceiling_wins_over_the_rms_target(self):
        # A transient-heavy one-shot: quiet on average, already loud at its peak.
        applied, why = normmod.gain_for(-6.0, -40.0, self.CONF)
        self.assertEqual(applied, 3.0)           # -6 -> -3, not -40 -> -20
        self.assertEqual(why, "peak ceiling")

    def test_raise_only_by_default(self):
        applied, why = normmod.gain_for(-1.0, -11.0, self.CONF)
        self.assertEqual(applied, 0.0)
        self.assertIn("raise-only", why)

    def test_attenuation_when_explicitly_allowed(self):
        applied, _ = normmod.gain_for(-30.0, -11.0, self.CONF, allow_attenuation=True)
        self.assertEqual(applied, -9.0)

    def test_a_file_needing_absurd_gain_is_refused_not_amplified(self):
        applied, why = normmod.gain_for(-90.0, -95.0, self.CONF)
        self.assertEqual(applied, 0.0)
        self.assertIn("broken asset", why)

    def test_close_enough_is_left_alone(self):
        applied, why = normmod.gain_for(-10.0, -20.2, self.CONF)
        self.assertEqual(applied, 0.0)
        self.assertIn("within", why)

    def test_silence_is_not_divided_by(self):
        applied, why = normmod.gain_for(float("-inf"), float("-inf"), self.CONF)
        self.assertEqual(applied, 0.0)
        self.assertIn("silent", why)

    def test_encode_args_follow_the_registry_format(self):
        self.assertEqual(normmod.encode_args("mp3_44100_128"),
                         ["-ar", "44100", "-ac", "1", "-b:a", "128k"])
        self.assertEqual(normmod.encode_args("mp3_22050_64"),
                         ["-ar", "22050", "-ac", "1", "-b:a", "64k"])
        # An unparseable format must not produce a broken ffmpeg command line.
        self.assertEqual(normmod.encode_args("weird"),
                         ["-ar", "44100", "-ac", "1", "-b:a", "128k"])

    def test_settings_come_from_the_registry_when_present(self):
        sreg = sfx_reg()
        sreg.config["sfx"]["normalize"] = {"targetRmsDbfs": -14.0, "_comment": ["x"]}
        conf = normmod.settings(sreg)
        self.assertEqual(conf["targetRmsDbfs"], -14.0)
        self.assertEqual(conf["peakCeilingDbfs"], normmod.DEFAULTS["peakCeilingDbfs"])
        self.assertNotIn("_comment", conf)


class SpeakerCorrectionTests(unittest.TestCase):
    """The pinned speakers, checked against the real manuscript and the real registry.

    A wrong voice is the one audio fault no amount of measuring finds: the file is
    perfect, the level is right, and the wrong person is talking. It survived three
    chapters of listening before Joshua caught it, so the corrections are pinned by a
    test rather than left to a comment in a JSON file.
    """

    PINS = [
        (2, "Jack? We disconnected you.", "lena-ortiz"),
        (3, "Jack! Jack, answer me!", "lena-ortiz"),
    ]

    def setUp(self):
        self.reg = Registry()
        self.overrides = mf.load_overrides()
        self.files = mf.chapter_files()

    def _segments(self, number):
        return parse.parse_chapter(self.files[number], self.reg, self.overrides)["segments"]

    def test_a_voice_arriving_through_jacks_terminal_is_not_jack(self):
        for number, text, speaker in self.PINS:
            found = [s for s in self._segments(number) if s["displayText"] == text]
            self.assertEqual(len(found), 1, "%r in chapter %d" % (text, number))
            self.assertEqual(found[0]["speaker"], speaker,
                             "%r must be spoken by %s" % (text, speaker))

    def test_sarah_calls_jacks_name_in_her_own_voice_both_times(self):
        """Two identical one-word lines four segments apart. The parser got the second
        right and the first wrong, which is what made the mistake audible at all."""
        calls = [s for s in self._segments(3) if s["displayText"] == "Jack."]
        self.assertEqual(len(calls), 2)
        self.assertEqual([s["speaker"] for s in calls],
                         ["sarah-bennett", "sarah-bennett"])

    def test_no_pin_has_been_orphaned_by_a_manuscript_edit(self):
        """An override is keyed by the clip id the PARSER produced. Edit the line and
        the key stops matching -- silently, and the wrong voice comes back. So every
        pin has to still land on a segment."""
        provisional = set()
        for number in sorted(self.files):
            for seg in parse.parse_chapter(self.files[number], self.reg)["segments"]:
                provisional.add(parse.clip_id(seg["speaker"], seg["ttsText"]))
        for key in self.overrides:
            # assertTrue, not assertIn: a failing assertIn prints all 520 clip ids,
            # which buries the one line that says what is wrong.
            self.assertTrue(key in provisional,
                            "override %s no longer matches anything the parser "
                            "produces, so its correction is not being applied" % key)
        landed = {}
        for n in sorted(self.files):
            for seg in self._segments(n):
                if seg.get("method") == "override":
                    landed[(n, seg["order"])] = seg
        # Every pin has to land somewhere, and the number of pinned segments has to be
        # accounted for: a pin that fires in more than one place must SAY it is meant
        # to, because a global pin on a line like "No." would rewrite the voice of
        # every other "No." in six chapters and nothing would complain.
        self.assertGreaterEqual(len(landed), len(self.overrides))
        for key, pin in self.overrides.items():
            scope = pin.get("chapters") or ([pin["chapter"]] if pin.get("chapter") else None)
            if scope is None:
                self.assertEqual(pin.get("scope"), "everywhere",
                                 "override %s names no chapter, so it applies to every "
                                 "matching line in the book. Say `\"scope\": "
                                 "\"everywhere\"` if that is intended." % key)


class ChapterTimelineTests(unittest.TestCase):
    """One sum, three consumers: the page, the mix and the join all read the same one."""

    SEGMENTS = [
        {"order": 0, "audio": "audio/clips/n/a.mp3", "pauseBeforeMs": 0},
        {"order": 1, "audio": "audio/clips/n/b.mp3", "pauseBeforeMs": 260},
        {"order": 2, "audio": "audio/clips/n/c.mp3", "pauseBeforeMs": 380},
    ]

    def setUp(self):
        self.dir = tempfile.mkdtemp()
        self._root, self._dur = mf.ROOT, mf.cache.mp3_duration_seconds
        mf.ROOT = self.dir
        mf.cache.mp3_duration_seconds = lambda p: 2.0
        os.makedirs(os.path.join(self.dir, "audio", "clips", "n"))
        os.makedirs(os.path.join(self.dir, "audio", "exports"))

    def tearDown(self):
        mf.ROOT, mf.cache.mp3_duration_seconds = self._root, self._dur
        shutil.rmtree(self.dir, ignore_errors=True)

    def _clips(self, which="abc"):
        for name in which:
            with open(os.path.join(self.dir, "audio", "clips", "n", name + ".mp3"), "wb") as fh:
                fh.write(b"x")

    def _export(self, suffix):
        path = os.path.join(self.dir, "audio", "exports", "chapter-01%s.mp3" % suffix)
        with open(path, "wb") as fh:
            fh.write(b"x" * 1024)

    def _manifest(self):
        return {"chapter": 1, "segments": json.loads(json.dumps(self.SEGMENTS))}

    def test_a_segment_starts_after_its_own_pause_not_before_it(self):
        self._clips()
        m = mf.attach_timeline(self._manifest())
        starts = [s["startMs"] for s in m["segments"]]
        self.assertEqual(starts, [0, 2260, 4640])
        self.assertEqual(m["segments"][0]["endMs"], 2000)
        self.assertEqual(m["timeline"]["totalMs"], 6640)
        self.assertTrue(m["timeline"]["complete"])

    def test_the_index_is_the_same_arithmetic_the_mix_is_built_with(self):
        """If these ever diverge, the page highlights one line while another is read."""
        self._clips()
        m = mf.attach_timeline(self._manifest())
        starts, _ends, _total = drama.timeline(m)
        self.assertEqual([int(round(starts[s["order"]] * 1000)) for s in m["segments"]],
                         [s["startMs"] for s in m["segments"]])

    def test_a_missing_clip_withdraws_the_index_rather_than_shifting_it(self):
        """A timeline summed over a clip that does not exist addresses nothing. The
        page is told so and plays the clips instead of seeking into a file."""
        self._clips("ac")
        self._export("-drama")
        m = mf.attach_timeline(self._manifest())
        self.assertFalse(m["timeline"]["complete"])
        self.assertEqual(m["timeline"]["missingClips"], 1)
        self.assertIsNone(m["exports"]["mixed"]["startMs"])

    def test_only_the_exports_that_exist_are_offered(self):
        self._clips()
        m = mf.attach_timeline(self._manifest())
        self.assertEqual(m["exports"], {})
        self._export("-drama")
        m = mf.attach_timeline(self._manifest())
        self.assertIn("mixed", m["exports"])
        self.assertNotIn("voice", m["exports"])
        self.assertEqual(m["exports"]["mixed"]["startMs"], [0, 2260, 4640])

    def test_the_voice_only_join_is_offered_without_an_index(self):
        """It is an mp3 -c copy join, so it runs longer than the arithmetic and cannot
        be seeked into by it. Offered to listen to, never to address."""
        self._clips()
        self._export("")
        m = mf.attach_timeline(self._manifest())
        self.assertIsNone(m["exports"]["voice"]["startMs"])
        self.assertIn("gapless", m["exports"]["voice"]["indexSource"])


class LoudnessTests(unittest.TestCase):
    """RMS says how big the samples are. Loudness says how loud it sounds."""

    def setUp(self):
        self._run, self._ffmpeg = normmod.subprocess.run, normmod.ffmpeg
        normmod.ffmpeg = lambda: "ffmpeg"

    def tearDown(self):
        normmod.subprocess.run, normmod.ffmpeg = self._run, self._ffmpeg

    def _answer(self, stderr):
        normmod.subprocess.run = lambda *a, **k: types.SimpleNamespace(
            returncode=0, stdout="", stderr=stderr)

    def test_reads_the_summary_and_not_a_per_frame_line(self):
        """ebur128 prints a running `I:` on EVERY frame. Taking the first one read a
        value from a quarter of a second in, which for a one-shot is its attack."""
        self._answer(
            "[Parsed_ebur128_0 @ 0x1] t: 0.4  M: -9.0 S: -9.1  I: -9.2 LUFS  LRA: 0.0 LU\n"
            "[Parsed_ebur128_0 @ 0x1] t: 0.8  M: -30.0 S: -29.0  I: -25.0 LUFS  LRA: 1.0 LU\n"
            "[Parsed_ebur128_0 @ 0x1] Summary:\n"
            "\n"
            "  Integrated loudness:\n"
            "    I:         -21.4 LUFS\n"
            "    Threshold: -31.6 LUFS\n")
        self.assertEqual(normmod.loudness_lufs("x.mp3"), -21.4)

    def test_silence_reads_as_no_measurement_rather_than_a_huge_negative(self):
        self._answer("  Integrated loudness:\n    I:      -inf LUFS\n")
        self.assertIsNone(normmod.loudness_lufs("x.mp3"))

    def test_no_summary_at_all_is_no_measurement(self):
        self._answer("some other ffmpeg output\n")
        self.assertIsNone(normmod.loudness_lufs("x.mp3"))


class LoudnessBackfillTests(unittest.TestCase):
    """Loudness is a reading, so learning it must never re-encode anything."""

    def setUp(self):
        self.dir = tempfile.mkdtemp()
        self.sreg = sfx_reg()
        self._sfx_dir = sfxmod.SFX_DIR
        sfxmod.SFX_DIR = os.path.join(self.dir, "sfx")
        self._run, self._ffmpeg = normmod.subprocess.run, normmod.ffmpeg
        normmod.ffmpeg = lambda: "ffmpeg"
        self.loudness = FakeLoudness(offset=-6.0)
        self.other_calls = []

        def fake_run(cmd, **kw):
            if self.loudness.handles(cmd):
                return self.loudness.answer(cmd, lambda p: (-3.0, -20.0, 3.0))
            self.other_calls.append(cmd)
            raise AssertionError("measure-loudness must not encode anything")
        normmod.subprocess.run = fake_run

    def tearDown(self):
        normmod.subprocess.run, normmod.ffmpeg = self._run, self._ffmpeg
        sfxmod.SFX_DIR = self._sfx_dir
        shutil.rmtree(self.dir, ignore_errors=True)

    def _place(self, asset_id, sidecar_body):
        audio, sidecar = sfxmod.asset_paths(self.sreg, asset_id)
        os.makedirs(os.path.dirname(audio), exist_ok=True)
        with open(audio, "wb") as fh:
            fh.write(b"audio")
        cache.write_sidecar(sidecar, dict(sidecar_body, asset=asset_id))
        return sidecar

    def test_a_measured_asset_gains_a_loudness_and_keeps_its_rms(self):
        sidecar = self._place("sfx_chair_roll_fast",
                              {"measured": {"rmsDbfs": -20.0, "peakDbfs": -3.0}})
        filled, failed = normmod.measure_loudness(
            self.sreg, ["sfx_chair_roll_fast"], log=lambda *a: None)
        side = cache.read_sidecar(sidecar)
        self.assertEqual((filled, failed), (1, 0))
        self.assertEqual(side["measured"]["lufs"], -26.0)
        self.assertEqual(side["measured"]["rmsDbfs"], -20.0)
        self.assertEqual(self.other_calls, [])

    def test_a_normalised_asset_is_written_where_the_mix_reads(self):
        """The mix reads `normalize.resultLufs` for a normalised asset. A loudness put
        anywhere else would be a reading of a file the player does not play."""
        sidecar = self._place("sfx_chair_roll_fast",
                              {"normalize": {"resultRmsDbfs": -20.0, "appliedDb": 6.0},
                               "measured": {"rmsDbfs": -26.0}})
        normmod.measure_loudness(self.sreg, ["sfx_chair_roll_fast"], log=lambda *a: None)
        side = cache.read_sidecar(sidecar)
        self.assertEqual(side["normalize"]["resultLufs"], -26.0)
        self.assertNotIn("lufs", side["measured"])

    def test_running_it_twice_measures_nothing_the_second_time(self):
        self._place("sfx_chair_roll_fast", {"measured": {"rmsDbfs": -20.0}})
        normmod.measure_loudness(self.sreg, ["sfx_chair_roll_fast"], log=lambda *a: None)
        before = len(self.loudness.calls)
        filled, _ = normmod.measure_loudness(
            self.sreg, ["sfx_chair_roll_fast"], log=lambda *a: None)
        self.assertEqual(filled, 0)
        self.assertEqual(len(self.loudness.calls), before)

    def test_force_re_reads_a_file_that_has_changed(self):
        self._place("sfx_chair_roll_fast", {"measured": {"rmsDbfs": -20.0}})
        normmod.measure_loudness(self.sreg, ["sfx_chair_roll_fast"], log=lambda *a: None)
        filled, _ = normmod.measure_loudness(
            self.sreg, ["sfx_chair_roll_fast"], force=True, log=lambda *a: None)
        self.assertEqual(filled, 1)


class MixPlacementTests(unittest.TestCase):
    """Where a cue lands is decided by LOUDNESS, and the report says when it is not."""

    def setUp(self):
        from tmbaudio import mixtune
        self.mixtune = mixtune
        self.dir = tempfile.mkdtemp()
        self.sreg = sfx_reg()
        self._sfx_dir = sfxmod.SFX_DIR
        sfxmod.SFX_DIR = os.path.join(self.dir, "sfx")

    def tearDown(self):
        sfxmod.SFX_DIR = self._sfx_dir
        shutil.rmtree(self.dir, ignore_errors=True)

    def _place(self, body):
        audio, sidecar = sfxmod.asset_paths(self.sreg, "sfx_chair_roll_fast")
        os.makedirs(os.path.dirname(audio), exist_ok=True)
        with open(audio, "wb") as fh:
            fh.write(b"audio")
        cache.write_sidecar(sidecar, dict(body, asset="sfx_chair_roll_fast"))

    def test_loudness_wins_over_rms_in_the_same_block(self):
        self._place({"measured": {"rmsDbfs": -20.0, "lufs": -14.0}})
        level, origin = self.mixtune.asset_level(self.sreg, "sfx_chair_roll_fast")
        self.assertEqual(level, -14.0)
        self.assertEqual(origin, "measured")

    def test_the_normalised_reading_still_outranks_an_older_one(self):
        self._place({"normalize": {"resultRmsDbfs": -20.0, "resultLufs": -15.0},
                     "measured": {"rmsDbfs": -40.0, "lufs": -38.0}})
        level, origin = self.mixtune.asset_level(self.sreg, "sfx_chair_roll_fast")
        self.assertEqual((level, origin), (-15.0, "normalised"))

    def test_an_asset_with_no_loudness_falls_back_and_the_report_says_so(self):
        """A gain derived from RMS is the thing that has been getting this wrong, so it
        is visible in the retune output instead of blending in."""
        self._place({"measured": {"rmsDbfs": -20.0}})
        level, origin = self.mixtune.asset_level(self.sreg, "sfx_chair_roll_fast")
        self.assertEqual(level, -20.0)
        self.assertIn("rms fallback", origin)

    def test_the_hot_asset_joshua_heard_is_placed_quieter_than_rms_would(self):
        """sfx_console_alarm_erupt reads -11.5 dBFS RMS and -5.6 LUFS. Placed by RMS at
        a -45.1 target it gets gain 0.042; placed by what it actually sounds like it
        gets 0.011 -- the 11.9 dB that was burying the narrator."""
        was = self.mixtune.gain_for(-11.5, -45.1, emphasis_db=6.0)   # RMS, plus a nudge
        now = self.mixtune.gain_for(-5.6, -45.1)                     # what it sounds like
        self.assertAlmostEqual(was, 0.042, places=3)
        self.assertAlmostEqual(now, 0.011, places=3)
        self.assertAlmostEqual(20 * math.log10(was / now), 11.6, delta=0.5)

    def test_an_asset_rms_calls_loud_and_the_ear_does_not_gets_raised(self):
        """The correction runs both ways: a deep vibration reads 5 dB QUIETER than its
        RMS, and under RMS placement it was being pushed down for no reason."""
        self.assertGreater(self.mixtune.gain_for(-21.7, -45.1),
                           self.mixtune.gain_for(-17.4, -45.1))


class NormalizeFileTests(unittest.TestCase):
    """The master is kept, the gain never stacks, and no credit is ever implied."""

    def setUp(self):
        self.dir = tempfile.mkdtemp()
        self.sreg = sfx_reg()
        self._sfx_dir = sfxmod.SFX_DIR
        sfxmod.SFX_DIR = os.path.join(self.dir, "sfx")
        self._measure, self._ffmpeg, self._run = (
            normmod.measure, normmod.ffmpeg, normmod.subprocess.run)
        normmod.measure = read_level
        normmod.ffmpeg = lambda: "ffmpeg"
        self.encodes = []

        # The fake encoder OVERSHOOTS THE PEAK, because the real one does: mp3 is lossy
        # and a decode reconstructs more than was encoded. A fake that reproduced the
        # arithmetic perfectly would have passed every test while shipping clipped
        # audio, which is exactly what happened on the first real run.
        self.overshoot = 1.5

        self.loudness = FakeLoudness()

        def fake_run(cmd, **kw):
            if self.loudness.handles(cmd):
                return self.loudness.answer(cmd, read_level)
            gain = float([a for a in cmd if a.startswith("volume=")][0][7:-2])
            src = cmd[cmd.index("-i") + 1]
            peak, rms, _ = read_level(src)
            self.encodes.append((src, gain))
            with open(cmd[-1], "wb") as fh:
                fh.write(fake_file(rms + gain, peak + gain + self.overshoot))
            return None
        normmod.subprocess.run = fake_run

    def tearDown(self):
        normmod.measure, normmod.ffmpeg = self._measure, self._ffmpeg
        normmod.subprocess.run = self._run
        sfxmod.SFX_DIR = self._sfx_dir
        shutil.rmtree(self.dir, ignore_errors=True)

    def _place(self, asset_id, rms, peak):
        audio, sidecar = sfxmod.asset_paths(self.sreg, asset_id)
        os.makedirs(os.path.dirname(audio), exist_ok=True)
        with open(audio, "wb") as fh:
            fh.write(fake_file(rms, peak))
        plan = sfxmod.plan_asset(self.sreg, asset_id)
        cache.write_sidecar(sidecar, {"asset": asset_id, "fingerprint": plan["fingerprint"],
                                      "bytes": os.path.getsize(audio)})
        return audio, sidecar

    def test_normalises_and_keeps_the_generated_master(self):
        audio, sidecar = self._place("sfx_denied", rms=-50.0, peak=-40.0)
        done, failed = normmod.normalize_assets(self.sreg, ["sfx_denied"], log=lambda *a: None)
        self.assertEqual((done, failed), (1, 0))
        self.assertTrue(os.path.isfile(normmod.source_path(audio)),
                        "the generated file must be kept as the master")
        self.assertEqual(read_level(normmod.source_path(audio))[1], -50.0,
                         "the master keeps the level it was generated at")
        self.assertEqual(read_level(audio)[1], -20.0, "the served file hits the target")
        block = cache.read_sidecar(sidecar)["normalize"]
        self.assertEqual(block["appliedDb"], 30.0)
        self.assertEqual(block["resultRmsDbfs"], -20.0)
        self.assertEqual(block["limitedBy"], "rms target")
        self.assertEqual(block["corrections"], [])

    def test_the_gain_never_stacks(self):
        audio, _ = self._place("sfx_denied", rms=-50.0, peak=-40.0)
        normmod.normalize_assets(self.sreg, ["sfx_denied"], log=lambda *a: None)
        normmod.normalize_assets(self.sreg, ["sfx_denied"], force=True, log=lambda *a: None)
        self.assertEqual(read_level(audio)[1], -20.0,
                         "a second pass must re-derive from the master, not add to the "
                         "file it already lifted")
        self.assertTrue(all(src.endswith(normmod.SOURCE_SUFFIX)
                            for src in [s for s, _ in self.encodes][1:]),
                        "every pass after the first encodes from the snapshot")

    def test_second_run_is_a_no_op_without_force(self):
        self._place("sfx_denied", rms=-50.0, peak=-40.0)
        normmod.normalize_assets(self.sreg, ["sfx_denied"], log=lambda *a: None)
        done, failed = normmod.normalize_assets(self.sreg, ["sfx_denied"], log=lambda *a: None)
        self.assertEqual((done, failed), (0, 0))
        self.assertEqual(len(self.encodes), 1)

    def test_a_changed_target_re_plans_without_force(self):
        self._place("sfx_denied", rms=-50.0, peak=-40.0)
        normmod.normalize_assets(self.sreg, ["sfx_denied"], log=lambda *a: None)
        self.sreg.config["sfx"]["normalize"] = {"targetRmsDbfs": -16.0}
        done, _ = normmod.normalize_assets(self.sreg, ["sfx_denied"], log=lambda *a: None)
        self.assertEqual(done, 1, "a new target is a new decision, not a cached one")

    def test_normalising_never_makes_an_asset_look_uncached(self):
        audio, sidecar = self._place("sfx_denied", rms=-50.0, peak=-40.0)
        before = cache.read_sidecar(sidecar)["fingerprint"]
        normmod.normalize_assets(self.sreg, ["sfx_denied"], log=lambda *a: None)
        after = cache.read_sidecar(sidecar)
        self.assertEqual(after["fingerprint"], before,
                         "normalising is not generating: a changed fingerprint would "
                         "buy the asset again on the next run")
        plan = sfxmod.plan_asset(self.sreg, "sfx_denied")
        self.assertTrue(cache.is_cached(audio, sidecar, plan["fingerprint"]))

    def test_dry_run_writes_nothing(self):
        audio, sidecar = self._place("sfx_denied", rms=-50.0, peak=-40.0)
        normmod.normalize_assets(self.sreg, ["sfx_denied"], dry_run=True, log=lambda *a: None)
        self.assertEqual(self.encodes, [])
        self.assertFalse(os.path.isfile(normmod.source_path(audio)))
        self.assertNotIn("normalize", cache.read_sidecar(sidecar))

    def test_regenerating_an_asset_drops_the_stale_master(self):
        audio, _ = self._place("sfx_denied", rms=-50.0, peak=-40.0)
        normmod.normalize_assets(self.sreg, ["sfx_denied"], log=lambda *a: None)
        self.assertTrue(os.path.isfile(normmod.source_path(audio)))
        self.assertTrue(normmod.clear_source(audio))
        self.assertFalse(os.path.isfile(normmod.source_path(audio)),
                         "a regenerated asset is its own new master")

    def test_the_generator_clears_the_master_itself(self):
        src = open(os.path.join(os.path.dirname(os.path.abspath(normmod.__file__)),
                                "elevenlabs.py"), encoding="utf-8").read()
        self.assertIn("clear_source(audio_path)", src,
                      "generate_one_sfx must drop the snapshot, or the next normalise "
                      "pass would work from the file it just replaced")

    def test_an_ungenerated_or_supplied_asset_is_left_alone(self):
        conf = normmod.settings(self.sreg)
        plan = normmod.plan_one(self.sreg, "sfx_denied", conf)
        self.assertEqual(plan["action"], "skip")
        self.assertIn("not generated yet", plan["reason"])


class NormalizeOvershootTests(NormalizeFileTests):
    """The codec is measured, not trusted. This is the bug the first real pass shipped."""

    def test_a_peak_over_the_ceiling_is_backed_off_and_re_encoded(self):
        # Peak-limited: the gain aims the peak exactly at the ceiling, and the encoder
        # then puts it 1.5 dB over. The delivered file must still end up under.
        audio, sidecar = self._place("sfx_denied", rms=-40.0, peak=-9.0)
        normmod.normalize_assets(self.sreg, ["sfx_denied"], log=lambda *a: None)
        peak, _, _ = read_level(audio)
        conf = normmod.settings(self.sreg)
        self.assertLessEqual(peak, conf["peakCeilingDbfs"] + conf["peakToleranceDb"],
                             "the DELIVERED peak is what the ceiling is about")
        block = cache.read_sidecar(sidecar)["normalize"]
        self.assertEqual(len(block["corrections"]), 1)
        self.assertEqual(block["corrections"][0]["overBy"], 1.5)
        self.assertIn("measured after encoding", block["limitedBy"])

    def test_the_correction_re_encodes_from_the_master_not_the_last_attempt(self):
        self._place("sfx_denied", rms=-40.0, peak=-9.0)
        normmod.normalize_assets(self.sreg, ["sfx_denied"], log=lambda *a: None)
        sources = [src for src, _ in self.encodes]
        self.assertEqual(len(sources), 2, "one encode, one correction")
        self.assertTrue(all(s.endswith(normmod.SOURCE_SUFFIX) for s in sources[1:]),
                        "a correction that encoded the corrected file would compound")

    def test_corrections_are_bounded(self):
        self.overshoot = 40.0            # a codec behaving absurdly
        self._place("sfx_denied", rms=-40.0, peak=-9.0)
        normmod.normalize_assets(self.sreg, ["sfx_denied"], log=lambda *a: None)
        conf = normmod.settings(self.sreg)
        self.assertLessEqual(len(self.encodes), 1 + int(conf["maxCorrections"]),
                             "it gives up rather than looping on a file it cannot fix")

    def test_a_tightened_ceiling_restores_the_master_rather_than_leaving_it_hot(self):
        # The exact shape of the real bug: normalised under a loose ceiling, then the
        # ceiling moves and the right gain becomes zero. Skipping would serve the file
        # the old rule produced -- and here the two gains differ by less than the
        # re-encode threshold, so only checking the DELIVERED PEAK catches it.
        audio, sidecar = self._place("sfx_denied", rms=-24.0, peak=-2.2)
        self.sreg.config["sfx"]["normalize"] = {"peakCeilingDbfs": -1.0}
        normmod.normalize_assets(self.sreg, ["sfx_denied"], log=lambda *a: None)
        self.assertIn("normalize", cache.read_sidecar(sidecar))
        self.sreg.config["sfx"]["normalize"] = {"peakCeilingDbfs": -3.0}
        done, failed = normmod.normalize_assets(self.sreg, ["sfx_denied"], log=lambda *a: None)
        self.assertEqual((done, failed), (1, 0))
        self.assertEqual(read_level(audio), (-2.2, -24.0, 3.0),
                         "the generated master is served again")
        self.assertNotIn("normalize", cache.read_sidecar(sidecar))
        self.assertFalse(os.path.isfile(normmod.source_path(audio)))

    def test_an_unchanged_gain_is_still_a_no_op(self):
        self._place("sfx_denied", rms=-50.0, peak=-40.0)
        normmod.normalize_assets(self.sreg, ["sfx_denied"], log=lambda *a: None)
        before = len(self.encodes)
        done, _ = normmod.normalize_assets(self.sreg, ["sfx_denied"], log=lambda *a: None)
        self.assertEqual((done, len(self.encodes)), (0, before),
                         "deriving from the master every time must not mean "
                         "re-encoding every time")


if __name__ == "__main__":
    unittest.main(verbosity=2)
