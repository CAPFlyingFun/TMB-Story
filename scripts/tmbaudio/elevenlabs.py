"""ElevenLabs generation, with caching, controlled concurrency and bounded retries.

This is the ONLY module that reads the API key. It reads ELEVENLABS_API_KEY from the
environment at request time, never stores it, never writes it to a manifest or a
sidecar, and never prints it. If the variable is absent the module refuses to run
rather than falling back to anything.

Standard library only: urllib, threading, no third-party HTTP client.
"""

import json
import os
import random
import sys
import threading
import time
import urllib.error
import urllib.request

from . import cache

API_ROOT = "https://api.elevenlabs.io/v1/text-to-speech"
KEY_ENV = "ELEVENLABS_API_KEY"

# HTTP statuses worth another attempt. 401/403 (bad key) and 422 (bad request) are not.
RETRYABLE = {408, 425, 429, 500, 502, 503, 504}


def api_key():
    key = os.environ.get(KEY_ENV, "").strip()
    if not key:
        sys.exit(
            "%s is not set.\n\n"
            "Generation needs the ElevenLabs API key, and it is a secret: it must never be\n"
            "committed, printed, or put in any file in this repository. Supply it through the\n"
            "environment only:\n\n"
            "  local:          export %s=...   (in your shell, not in a tracked file)\n"
            "  GitHub Actions: the ELEVENLABS_API_KEY repository secret, which the\n"
            "                  .github/workflows/audio-generate.yml workflow passes in.\n"
            % (KEY_ENV, KEY_ENV))
    return key


def _request(text, voice_id, model, output_format, settings, timeout):
    """One synchronous request. Returns audio bytes. Raises on failure."""
    url = "%s/%s?output_format=%s" % (API_ROOT, voice_id, output_format)
    body = json.dumps({
        "text": text,
        "model_id": model,
        "voice_settings": settings,
    }).encode("utf-8")
    req = urllib.request.Request(url, data=body, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "audio/mpeg")
    req.add_header("xi-api-key", api_key())   # never logged
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = resp.read()
    if not data:
        raise RuntimeError("empty audio response")
    return data


def generate_one(seg, registry, log=print):
    """Generate one clip if it is not already cached and current.

    Returns "cached", "generated", or raises after exhausting retries.
    """
    sid = seg["speaker"]
    voice_id = registry.voice_id(sid)
    if not voice_id:
        raise RuntimeError("no voice assigned for %s; refusing to substitute one" % sid)
    settings = registry.settings_for(sid)
    audio_path, sidecar_path = cache.clip_paths(registry, sid, seg["clipId"])
    if cache.is_cached(audio_path, sidecar_path, seg["fingerprint"]):
        return "cached"

    gen = registry.generation()
    attempts = int(gen.get("maxRetries", 4))
    base = float(gen.get("baseBackoffSeconds", 2))
    timeout = float(gen.get("requestTimeoutSeconds", 120))

    last = None
    for attempt in range(1, attempts + 1):
        try:
            data = _request(seg["ttsText"], voice_id, registry.model(),
                            registry.output_format(), settings, timeout)
        except urllib.error.HTTPError as exc:
            last = exc
            if exc.code in (401, 403):
                raise RuntimeError(
                    "ElevenLabs rejected the credentials (HTTP %d). Check the "
                    "%s secret. The key itself is not printed." % (exc.code, KEY_ENV))
            if exc.code == 422:
                raise RuntimeError("ElevenLabs rejected the request for %s (HTTP 422); "
                                   "check the voice id and settings" % seg["clipId"])
            if exc.code not in RETRYABLE or attempt == attempts:
                raise RuntimeError("HTTP %d after %d attempt(s) for %s"
                                   % (exc.code, attempt, seg["clipId"]))
        except (urllib.error.URLError, TimeoutError, RuntimeError) as exc:
            last = exc
            if attempt == attempts:
                raise RuntimeError("%s after %d attempt(s) for %s"
                                   % (exc, attempt, seg["clipId"]))
        else:
            # Write the audio first, then the sidecar. A crash between the two leaves
            # the clip looking uncached, which regenerates one file rather than
            # trusting audio whose inputs we cannot prove.
            os.makedirs(os.path.dirname(audio_path), exist_ok=True)
            tmp = audio_path + ".part"
            with open(tmp, "wb") as fh:
                fh.write(data)
            os.replace(tmp, audio_path)
            cache.write_sidecar(sidecar_path, {
                "clipId": seg["clipId"],
                "speaker": sid,
                "voiceId": voice_id,
                "voiceVersion": registry.voice_version(sid),
                "model": registry.model(),
                "outputFormat": registry.output_format(),
                "settings": settings,
                "fingerprint": seg["fingerprint"],
                "text": seg["ttsText"],
                "bytes": len(data),
                "generated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            })
            return "generated"
        sleep = base * (2 ** (attempt - 1)) + random.uniform(0, 0.5)
        log("  retry %d/%d for %s in %.1fs (%s)" % (attempt, attempts, seg["clipId"], sleep, last))
        time.sleep(sleep)
    raise RuntimeError("exhausted retries for %s" % seg["clipId"])


def generate_all(segments, registry, log=print):
    """Generate a list of planned segments with bounded concurrency.

    Progress is durable: each clip's audio and sidecar are written as it completes, so
    an interrupted run resumes from the cache instead of starting the chapter again.
    """
    gen = registry.generation()
    workers = max(1, int(gen.get("concurrency", 3)))
    queue = list(segments)
    lock = threading.Lock()
    counts = {"generated": 0, "cached": 0, "failed": 0}
    index = {"i": 0}

    def worker():
        while True:
            with lock:
                if index["i"] >= len(queue):
                    return
                seg = queue[index["i"]]
                index["i"] += 1
                position = index["i"]
            try:
                result = generate_one(seg, registry, log=log)
                with lock:
                    counts[result] += 1
                    log("  [%d/%d] %s %s  %s" % (
                        position, len(queue), result,
                        registry.name(seg["speaker"]), seg["clipId"]))
            except Exception as exc:                      # noqa: BLE001 - reported, not raised
                with lock:
                    counts["failed"] += 1
                    log("  [%d/%d] FAILED %s: %s" % (position, len(queue), seg["clipId"], exc))

    threads = [threading.Thread(target=worker, daemon=True) for _ in range(workers)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    if counts["cached"]:
        log("  %d clip(s) were already current and were skipped." % counts["cached"])
    return counts["generated"], counts["failed"]
