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
from tmbaudio import sfx as sfxmod                                     # noqa: E402
from tmbaudio import combine as combinemod, drama                      # noqa: E402
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

    def test_a_looping_asset_must_say_where_it_stops(self):
        segs = self._segments()
        doc = {"chapter": 9, "cues": [
            {"cueId": "c-runaway", "asset": "amb_lab_night", "timing": "before",
             "anchor": {"clipId": segs[0]["clipId"], "occurrence": 1}}]}
        resolved, problems = sfxmod.resolve_chapter_cues(segs, doc, self.sreg)
        self.assertEqual(resolved, [])
        self.assertIn("sustain", problems[0]["problems"][0])

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


if __name__ == "__main__":
    unittest.main(verbosity=2)
