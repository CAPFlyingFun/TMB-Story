/* Render a whole chapter -- voices, beds and effects -- to one file the listener keeps.
 *
 * Joshua asked for "the option to download and save audio files per chapter which
 * saved the master audio file with the custom volumes", and the last three words are
 * the whole design. There is already a mixed file in the repository; downloading that
 * would ignore the sliders. So the mix is rebuilt here, in the browser, with whatever
 * the listener has set.
 *
 * It reproduces scripts/tmbaudio/drama.py exactly -- the same timeline from
 * `pauseBeforeMs` and real clip durations, the same `before`-at-the-top-of-the-gap
 * rule, the same bed spans, fades and ducking. Two renderers that disagree would be
 * worse than one, so where this file makes a choice it is the choice drama.py makes,
 * and the comments say which function it is mirroring.
 *
 * No key, no network beyond the static files this page already fetches, no library.
 * OfflineAudioContext renders faster than real time and WAV is forty lines, which is
 * a better trade than vendoring an encoder.
 */
(function () {
  "use strict";

  var RATE = 44100;
  var DUCK_RAMP = 0.12;          // seconds; the live player ramps beds over 260 ms

  function ctxClass() {
    return window.OfflineAudioContext || window.webkitOfflineAudioContext || null;
  }

  function decoderClass() {
    return window.AudioContext || window.webkitAudioContext || null;
  }

  function num(v, fallback) {
    var n = parseFloat(v);
    return isFinite(n) ? n : fallback;
  }

  function clamp01(v) { return Math.max(0, Math.min(1, num(v, 0))); }

  /* ---- fetching and decoding ---------------------------------------------- */
  function decodeAll(paths, decoder, onProgress) {
    var out = {};
    var done = 0;
    return paths.reduce(function (chain, path) {
      return chain.then(function () {
        return fetch("./" + path)
          .then(function (r) {
            if (!r.ok) throw new Error(path);
            return r.arrayBuffer();
          })
          .then(function (buf) {
            return new Promise(function (resolve, reject) {
              // The callback form, not the promise form: older Safari only has this one.
              decoder.decodeAudioData(buf, resolve, reject);
            });
          })
          .then(function (audio) { out[path] = audio; })
          .catch(function () { out[path] = null; })   // a missing clip is skipped, as in the player
          .then(function () {
            done += 1;
            if (onProgress) onProgress(done, paths.length);
          });
      });
    }, Promise.resolve()).then(function () { return out; });
  }

  /* ---- the timeline, mirroring drama.timeline() ---------------------------- */
  function timeline(manifest, buffers) {
    var starts = {}, ends = {}, t = 0;
    manifest.segments.forEach(function (seg) {
      t += num(seg.pauseBeforeMs, 0) / 1000;
      starts[seg.order] = t;
      var b = buffers[seg.audio];
      t += b ? b.duration : 0;
      ends[seg.order] = t;
    });
    return { starts: starts, ends: ends, total: t };
  }

  /* ---- where a cue sounds, mirroring drama.cue_start() -------------------- */
  function cueStart(cue, manifest, tl) {
    if (cue.timing === "after") return tl.ends[cue.order];
    if (cue.timing === "during") return tl.starts[cue.order] + num(cue.offsetMs, 0) / 1000;
    var gap = 0;
    for (var i = 0; i < manifest.segments.length; i++) {
      if (manifest.segments[i].order === cue.order) {
        gap = num(manifest.segments[i].pauseBeforeMs, 0) / 1000;
        break;
      }
    }
    return Math.max(0, tl.starts[cue.order] - gap);
  }

  /* ---- scheduling ---------------------------------------------------------- */
  function addVoice(ctx, buffer, at, gain) {
    var src = ctx.createBufferSource();
    src.buffer = buffer;
    var g = ctx.createGain();
    g.gain.value = gain;
    src.connect(g).connect(ctx.destination);
    src.start(at);
  }

  function addShot(ctx, buffer, at, level, fadeIn) {
    if (level <= 0) return;
    var src = ctx.createBufferSource();
    src.buffer = buffer;
    var g = ctx.createGain();
    if (fadeIn > 0) {
      g.gain.setValueAtTime(0, at);
      g.gain.linearRampToValueAtTime(level, at + fadeIn);
    } else {
      g.gain.setValueAtTime(level, at);
    }
    src.connect(g).connect(ctx.destination);
    src.start(at);
  }

  /* A bed loops for its whole span and ducks under every voice clip inside it, which
     is what the live player does with `duckUnderSpeechTo` and what the ffmpeg export
     does with sidechaincompress. Doing it as scheduled ramps rather than as a
     compressor keeps this renderer deterministic: the same inputs give the same file. */
  function addBed(ctx, buffer, spec, segments, tl) {
    if (spec.level <= 0 || spec.until <= spec.at) return;
    var src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    var g = ctx.createGain();
    var open = spec.level;
    var ducked = clamp01(spec.level * spec.duck);

    g.gain.setValueAtTime(0, spec.at);
    if (spec.fadeIn > 0) g.gain.linearRampToValueAtTime(open, spec.at + spec.fadeIn);
    else g.gain.setValueAtTime(open, spec.at);

    if (ducked !== open) {
      segments.forEach(function (seg) {
        var s = tl.starts[seg.order], e = tl.ends[seg.order];
        if (e <= spec.at || s >= spec.until) return;
        var inAt = Math.max(spec.at, s);
        var outAt = Math.min(spec.until, e);
        g.gain.setValueAtTime(g.gain.value, Math.max(spec.at, inAt - DUCK_RAMP));
        g.gain.linearRampToValueAtTime(ducked, inAt);
        g.gain.setValueAtTime(ducked, outAt);
        g.gain.linearRampToValueAtTime(open, Math.min(spec.until, outAt + DUCK_RAMP));
      });
    }
    var fadeOutAt = Math.max(spec.at, spec.until - spec.fadeOut);
    if (spec.fadeOut > 0) {
      g.gain.setValueAtTime(g.gain.value, fadeOutAt);
      g.gain.linearRampToValueAtTime(0, spec.until);
    }
    src.connect(g).connect(ctx.destination);
    src.start(spec.at);
    src.stop(spec.until + 0.05);
  }

  /* ---- WAV ---------------------------------------------------------------- */
  function toWav(buffer) {
    var channels = buffer.numberOfChannels;
    var frames = buffer.length;
    var bytes = 44 + frames * channels * 2;
    var out = new DataView(new ArrayBuffer(bytes));
    var pos = 0;
    function str(s) { for (var i = 0; i < s.length; i++) out.setUint8(pos++, s.charCodeAt(i)); }
    function u32(v) { out.setUint32(pos, v, true); pos += 4; }
    function u16(v) { out.setUint16(pos, v, true); pos += 2; }
    str("RIFF"); u32(bytes - 8); str("WAVE");
    str("fmt "); u32(16); u16(1); u16(channels);
    u32(buffer.sampleRate); u32(buffer.sampleRate * channels * 2); u16(channels * 2); u16(16);
    str("data"); u32(frames * channels * 2);
    var data = [];
    for (var c = 0; c < channels; c++) data.push(buffer.getChannelData(c));
    for (var i = 0; i < frames; i++) {
      for (var ch = 0; ch < channels; ch++) {
        var v = Math.max(-1, Math.min(1, data[ch][i]));
        out.setInt16(pos, v < 0 ? v * 0x8000 : v * 0x7fff, true);
        pos += 2;
      }
    }
    return new Blob([out.buffer], { type: "audio/wav" });
  }

  /* ---- the whole job ------------------------------------------------------ */
  function render(manifest, opts, onProgress) {
    var Ctx = ctxClass(), Dec = decoderClass();
    if (!Ctx || !Dec) return Promise.reject(new Error("This browser has no Web Audio support."));
    var volumes = opts.volumes || {};
    var enabled = opts.enabled || {};
    var voiceVol = clamp01(num(volumes.voice, 1));
    var mix = manifest.mix || {};
    var duckTable = mix.duckUnderSpeechTo || {};

    var cues = (manifest.cues || []).filter(function (c) {
      var layer = c.layer === "ambience" ? "ambience" : "sfx";
      return enabled[layer] !== false && clamp01(num(volumes[layer], 1)) > 0;
    });

    var paths = {};
    manifest.segments.forEach(function (s) { paths[s.audio] = true; });
    cues.forEach(function (c) { paths[c.audio] = true; });

    var decoder = new Dec();
    return decodeAll(Object.keys(paths), decoder, function (done, total) {
      if (onProgress) onProgress("loading", done, total);
    }).then(function (buffers) {
      try { decoder.close(); } catch (e) {}
      var tl = timeline(manifest, buffers);
      if (!(tl.total > 0)) throw new Error("no audio to render: the clips are not generated yet");
      var frames = Math.ceil((tl.total + 2) * RATE);
      var ctx = new Ctx(1, frames, RATE);

      manifest.segments.forEach(function (seg) {
        var b = buffers[seg.audio];
        if (b) addVoice(ctx, b, tl.starts[seg.order], voiceVol);
      });

      cues.forEach(function (cue) {
        var b = buffers[cue.audio];
        if (!b) return;
        var layer = cue.layer === "ambience" ? "ambience" : "sfx";
        var level = clamp01(num(cue.gain, 0) * clamp01(num(volumes[layer], 1)));
        var at = cueStart(cue, manifest, tl);
        if (cue.stopOrder !== undefined && cue.stopOrder !== null) {
          addBed(ctx, b, {
            at: at, until: tl.ends[cue.stopOrder], level: level,
            duck: num(duckTable[cue.category], 1),
            fadeIn: num(cue.fadeInMs, 0) / 1000,
            fadeOut: num(cue.fadeOutMs, 0) / 1000
          }, manifest.segments, tl);
        } else {
          addShot(ctx, b, at, level, num(cue.fadeInMs, 0) / 1000);
        }
      });

      if (onProgress) onProgress("rendering", 0, 1);
      return ctx.startRendering();
    }).then(function (rendered) {
      if (onProgress) onProgress("encoding", 0, 1);
      return { blob: toWav(rendered), seconds: rendered.duration };
    });
  }

  function save(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }

  window.TMBExport = {
    available: function () { return !!(ctxClass() && decoderClass()); },
    render: render,
    save: save,
    /* Rough, for the warning the button carries: mono 16-bit at 44.1 kHz. */
    estimateMb: function (seconds) { return Math.round(seconds * RATE * 2 / 1048576); },
    _internals: { timeline: timeline, cueStart: cueStart, toWav: toWav }
  };
})();
