"""Voice registry and generation config loading."""

import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
REGISTRY_PATH = os.path.join(ROOT, "story-rules", "voice-registry.json")
CONFIG_PATH = os.path.join(ROOT, "audio", "config.json")

NARRATOR = "narrator"
SYSTEM = "system"
REVIEW = "REVIEW_REQUIRED"


def _read_json(path):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


class Registry:
    """Speakers and their voice assignments. Never invents a voice ID."""

    def __init__(self, data=None, config=None):
        self.data = data if data is not None else _read_json(REGISTRY_PATH)
        self.config = config if config is not None else _read_json(CONFIG_PATH)
        self.speakers = {
            k: v for k, v in self.data.get("speakers", {}).items()
            if not k.startswith("_")
        }

    # -- speakers -----------------------------------------------------------
    def get(self, speaker_id):
        return self.speakers.get(speaker_id)

    def name(self, speaker_id):
        s = self.get(speaker_id)
        return s["name"] if s else speaker_id

    def audio_key(self, speaker_id):
        s = self.get(speaker_id)
        return (s.get("audioKey") or speaker_id) if s else speaker_id

    def voice_id(self, speaker_id):
        s = self.get(speaker_id)
        return s.get("elevenLabsVoiceId") if s else None

    def voice_version(self, speaker_id):
        s = self.get(speaker_id)
        return s.get("voiceVersion", 1) if s else 1

    def has_voice(self, speaker_id):
        return bool(self.voice_id(speaker_id))

    def exports_to_game(self, speaker_id):
        s = self.get(speaker_id)
        return bool(s.get("gameExport")) if s else False

    def characters(self):
        """Speakers who are people in the story, for name-based attribution."""
        return {k: v for k, v in self.speakers.items() if v.get("kind") == "character"}

    def name_index(self):
        """Map every surface name and alias -> speaker id, longest name first."""
        pairs = []
        for sid, s in self.characters().items():
            names = [s["name"]] + list(s.get("aliases") or [])
            for n in names:
                pairs.append((n, sid))
        pairs.sort(key=lambda p: -len(p[0]))
        return pairs

    def missing_voices(self, speaker_ids):
        return sorted({s for s in speaker_ids if not self.has_voice(s) and s != REVIEW})

    # -- generation settings ------------------------------------------------
    def model(self):
        return self.config.get("model")

    def output_format(self):
        return self.config.get("outputFormat")

    def settings_for(self, speaker_id):
        """Global defaults with the speaker's overrides applied. Comment keys dropped."""
        merged = dict(self.config.get("defaultSettings", {}))
        override = dict((self.config.get("speakerSettings") or {}).get(speaker_id, {}))
        merged.update(override)
        return {k: v for k, v in merged.items() if not k.startswith("_")}

    def pauses(self):
        return {k: v for k, v in (self.config.get("pausesMs") or {}).items()
                if not k.startswith("_")}

    def generation(self):
        return self.config.get("generation", {})

    def system_lines(self):
        block = self.config.get("systemLines") or {}
        return [s for s in (block.get("exact") or [])]
