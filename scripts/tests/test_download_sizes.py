#!/usr/bin/env python3
"""visual/download-sizes.json must match the files, or the Watch tab's loading bar lies.

Run: python3 scripts/tests/test_download_sizes.py
Fix a failure with: python3 scripts/build-manifest.py
"""

import glob
import json
import os
import unittest

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class DownloadSizes(unittest.TestCase):
    def test_every_downloaded_file_is_listed_at_its_real_size(self):
        sizes = json.load(open(os.path.join(ROOT, "visual", "download-sizes.json")))
        files = glob.glob(os.path.join(ROOT, "visual", "vendor", "*.js")) + glob.glob(os.path.join(ROOT, "assets", "models", "*.glb"))
        self.assertTrue(files)
        for f in files:
            key = os.path.relpath(f, ROOT).replace(os.sep, "/")
            self.assertEqual(sizes.get(key), os.path.getsize(f), key + " -- run scripts/build-manifest.py")


if __name__ == "__main__":
    unittest.main()
