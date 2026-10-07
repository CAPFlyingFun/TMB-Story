#!/usr/bin/env python3
"""Guards on the Watch tab's 3D people (visual/engine/people3d.js).

Run: python3 scripts/tests/test_people3d.py

The toon Sarah (2026-10-07) wears leggings, and her bump's bone weights are fixed in the
model's own bake (TRADDOMIUM scripts/protectBumpWeights.mjs). The scan Sarah's load-time
skirt pass -- weights blended down the legs below the hips -- dragged that bump with her
thighs when she sat. These tests keep it from coming back by name or by flag, and keep
every scene that seats Sarah on her pregnancy-aware posture.
"""

import glob
import os
import re
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ENGINE = os.path.join(ROOT, "visual", "engine", "people3d.js")
SCENES = glob.glob(os.path.join(ROOT, "visual", "scenes", "*.js"))


class People3d(unittest.TestCase):
    def test_no_load_time_skirt_pass(self):
        src = open(ENGINE, encoding="utf-8").read()
        self.assertNotIn("function smoothSkirt", src)
        self.assertNotIn("spec.skirted", src)
        self.assertNotIn("prepareSeatedSarah", src)

    def test_no_scene_asks_for_one(self):
        for path in SCENES:
            self.assertIsNone(re.search(r"\bskirted\s*:", open(path, encoding="utf-8").read()), path)

    def test_seated_sarah_is_posed_pregnant(self):
        src = open(ENGINE, encoding="utf-8").read()
        self.assertIn('spec.pregnant', src)
        for path in SCENES:
            text = open(path, encoding="utf-8").read()
            if "people3d" in text and "sarah.glb" in text:
                self.assertRegex(text, r'pregnant:\s*\[\s*"sarah"\s*\]', path)


if __name__ == "__main__":
    unittest.main()
