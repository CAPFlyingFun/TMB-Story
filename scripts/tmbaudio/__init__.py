"""TMB audio pipeline: manuscript -> segment manifests -> cached ElevenLabs clips.

Python 3 standard library only, matching the rest of scripts/. No secret is ever read,
written or logged by anything in this package except elevenlabs.py, which reads
ELEVENLABS_API_KEY from the environment at request time and never stores it.
"""
