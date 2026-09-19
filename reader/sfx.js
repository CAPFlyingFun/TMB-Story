/* TMB ambience and sound-effect layers.
 *
 * Three independent layers play against one manifest:
 *
 *   VOICE     the existing clips, owned by reader/player.js and untouched here
 *   AMBIENCE  looping environmental beds
 *   SFX       short events, plus looping alert beds
 *
 * This file contains NO ElevenLabs API key and makes NO request to ElevenLabs. It
 * fetches static mp3 files and nothing else. Generation happens in a secure
 * environment and never in the browser, because GitHub Pages is public.
 *
 * THE VOICE TRACK MUST NEVER DEPEND ON THIS. Everything here is optional decoration:
 * a missing asset, a failed fetch, a browser that refuses to autoplay a second
 * element, or this script failing to load at all leaves the audiobook playing exactly
 * as it did before. player.js calls into it only if window.TMBLayers exists, and every
 * entry point below is safe to call with no cues, no assets and no network.
 *
 * Cues are anchored to segment ORDER, resolved from clip identity by the manifest
 * builder. Nothing here uses wall-clock timestamps.
 */
(function () {
  "use strict";

  var LAYERS = ["ambience", "sfx"];

  var state = {
    cues: [],
    mix: {},
    enabled: { ambience: true, sfx: true },
    beds: {},            // cueId -> {el, cue, target}
    oneShots: [],        // live one-shot elements, reaped when they end
    timers: [],          // pending `during` offsets
    speaking: false,
    unavailable: {},     // asset -> true once a fetch has failed
    order: null,
    prefired: null,      // order whose `before` cues already fired during the gap
    /* Cues that have already sounded for the segment being played, cleared when a
       DIFFERENT segment begins. A visit, not a call: enterSegment runs again whenever
       the same clip is started again -- a retry after a failed load, or Play after
       Pause -- and without this each of those fired the segment's cues a second time,
       so two copies of the same alarm sounded together and summed 6 dB louder than
       the one the cue sheet placed. */
    fired: {},
    visiting: null,      // the segment those `fired` ids belong to
    paused: false,       // the listener pressed pause; nothing sounds until resume
    held: []             // elements pauseAll() stopped, to be started again on resume
  };

  function num(v, fallback) {
    var n = parseFloat(v);
    return isFinite(n) ? n : fallback;
  }

  function clamp01(v) {
    return Math.max(0, Math.min(1, num(v, 0)));
  }

  function duckFor(category) {
    var table = state.mix.duckUnderSpeechTo || {};
    return num(table[category], 1);
  }

  function layerOf(cue) {
    return cue.layer === "ambience" ? "ambience" : "sfx";
  }

  function enabledFor(cue) {
    return state.enabled[layerOf(cue)] !== false;
  }

  /* A cue whose file is absent is dropped for the rest of the session rather than
     retried on every segment. One HEAD-less failure is enough information. */
  function markUnavailable(asset) {
    state.unavailable[asset] = true;
  }

  function makeEl(cue, loop) {
    var el = new Audio();
    /* Listener FIRST, then src. A browser loads asynchronously so the old order
       happened to work, but it left a window in which a synchronous failure had
       nobody listening -- and the whole point of the listener is that a missing
       asset is noticed and dropped rather than retried on every segment. */
    el.addEventListener("error", function () { markUnavailable(cue.asset); });
    el.loop = !!loop;
    el.preload = "auto";
    el.src = "./" + cue.audio;
    return el;
  }

  // ---- volume ramps --------------------------------------------------------
  /* Plain <audio> has no gain node, so a fade is a short interval on `volume`.
     Deliberately simple: the mix is configurable data, not a DSP graph. */
  function ramp(el, to, ms) {
    if (el._tmbRamp) { clearInterval(el._tmbRamp); el._tmbRamp = null; }
    var target = clamp01(to);
    if (!ms || ms < 40) { try { el.volume = target; } catch (e) {} return; }
    var from = num(el.volume, 0);
    var steps = Math.max(1, Math.round(ms / 40));
    var i = 0;
    el._tmbRamp = setInterval(function () {
      i += 1;
      try { el.volume = clamp01(from + (target - from) * (i / steps)); } catch (e) {}
      if (i >= steps) { clearInterval(el._tmbRamp); el._tmbRamp = null; }
    }, 40);
  }

  function bedTarget(bed) {
    var base = clamp01(bed.cue.gain);
    return state.speaking ? clamp01(base * duckFor(bed.cue.category)) : base;
  }

  function applyDucking() {
    Object.keys(state.beds).forEach(function (id) {
      var bed = state.beds[id];
      ramp(bed.el, bedTarget(bed), 260);
    });
  }

  // ---- beds ----------------------------------------------------------------
  function startBed(cue) {
    if (state.beds[cue.cueId] || state.unavailable[cue.asset]) return;
    if (!enabledFor(cue) || state.paused) return;
    var el = makeEl(cue, true);
    var bed = { el: el, cue: cue };
    state.beds[cue.cueId] = bed;
    try { el.volume = 0; } catch (e) {}
    el.play().then(function () {
      ramp(el, bedTarget(bed), num(cue.fadeInMs, num((state.mix.defaultFadeMs || {}).in, 800)));
    }).catch(function () {
      /* Autoplay refused, or the file is missing. Either way the voice track is
         unaffected; drop the bed and carry on. */
      delete state.beds[cue.cueId];
    });
  }

  function stopBed(cueId, fadeMs) {
    var bed = state.beds[cueId];
    if (!bed) return;
    delete state.beds[cueId];
    var el = bed.el;
    var ms = num(fadeMs, num(bed.cue.fadeOutMs, num((state.mix.defaultFadeMs || {}).out, 1200)));
    ramp(el, 0, ms);
    setTimeout(function () {
      try { el.pause(); el.src = ""; } catch (e) {}
    }, ms + 60);
  }

  function syncBeds(order) {
    state.cues.forEach(function (cue) {
      if (cue.stopOrder === undefined || cue.stopOrder === null) return;
      var inRange = order >= cue.order && order <= cue.stopOrder;
      if (inRange && enabledFor(cue)) startBed(cue);
      if (!inRange && state.beds[cue.cueId]) stopBed(cue.cueId);
    });
  }

  // ---- one-shots -----------------------------------------------------------
  function fire(cue) {
    if (!enabledFor(cue) || state.unavailable[cue.asset] || state.paused) return;
    if (state.fired[cue.cueId]) return;
    state.fired[cue.cueId] = true;
    var el = makeEl(cue, false);
    try { el.volume = clamp01(cue.gain); } catch (e) {}
    if (cue.fadeInMs) { try { el.volume = 0; } catch (e) {} ramp(el, cue.gain, cue.fadeInMs); }
    el.addEventListener("ended", function () {
      state.oneShots = state.oneShots.filter(function (x) { return x !== el; });
    });
    state.oneShots.push(el);
    el.play().catch(function () {
      state.oneShots = state.oneShots.filter(function (x) { return x !== el; });
    });
  }

  /* A VISIT, NOT A CALL. The gap ahead of a segment fires its `before` cues and then
     the segment itself begins, so one segment is reached through two entry points and
     the record has to survive the handover -- otherwise the retry it exists to stop
     would simply refire what the gap already played. */
  function beginVisit(order) {
    if (state.visiting === order) return;
    state.visiting = order;
    state.fired = {};
  }

  function clearTimers() {
    state.timers.forEach(clearTimeout);
    state.timers = [];
  }

  function cuesAt(order, timing) {
    return state.cues.filter(function (c) {
      return c.order === order && c.timing === timing &&
             (c.stopOrder === undefined || c.stopOrder === null);
    });
  }

  // ---- public API ----------------------------------------------------------
  window.TMBLayers = {
    /* Adopt a manifest. Old manifests have no `cues` key; that is a no-op, not an error. */
    load: function (manifest) {
      this.stopAll();
      state.cues = ((manifest && manifest.cues) || []).slice();
      state.mix = (manifest && manifest.mix) || {};
      state.unavailable = {};
      state.order = null;
      var layers = state.mix.layers || {};
      LAYERS.forEach(function (name) {
        if (layers[name] === false) state.enabled[name] = false;
      });
    },

    has: function () { return state.cues.length > 0; },

    count: function () {
      return {
        events: state.cues.length,
        assets: Object.keys(state.cues.reduce(function (acc, c) {
          acc[c.asset] = 1; return acc;
        }, {})).length,
        ambience: state.cues.filter(function (c) { return c.layer === "ambience"; }).length,
        sfx: state.cues.filter(function (c) { return c.layer === "sfx"; }).length,
        ungenerated: Object.keys(state.cues.reduce(function (acc, c) {
          if (!c.cached) acc[c.asset] = 1; return acc;
        }, {})).length
      };
    },

    isEnabled: function (layer) { return state.enabled[layer] !== false; },

    setEnabled: function (layer, on) {
      state.enabled[layer] = !!on;
      if (!on) {
        Object.keys(state.beds).forEach(function (id) {
          if (layerOf(state.beds[id].cue) === layer) stopBed(id, 400);
        });
        if (layer === "sfx") {
          state.oneShots.forEach(function (el) {
            try { el.pause(); el.src = ""; } catch (e) {}
          });
          state.oneShots = [];
          clearTimers();
        }
      } else if (state.order !== null) {
        syncBeds(state.order);
      }
    },

    /* Fires the NEXT segment's `before` cues at the top of the gap, so `before`
       genuinely means before: the listener hears the chirp and then the narrator says
       a warning tone chirped. The combined drama export places them at the same
       instant, which is what keeps the browser and the file agreeing. */
    prefireBefore: function (order) {
      if (order === null || order === undefined) return;
      beginVisit(order);
      state.prefired = order;
      cuesAt(order, "before").forEach(fire);
    },

    /* Called as each voice segment begins: schedules its `during` cues, brings the
       right beds in or out, and fires its `before` cues only if the gap did not. */
    enterSegment: function (order) {
      clearTimers();
      beginVisit(order);
      state.order = order;
      syncBeds(order);
      if (state.prefired !== order) cuesAt(order, "before").forEach(fire);
      state.prefired = null;
      cuesAt(order, "during").forEach(function (cue) {
        var t = setTimeout(function () { fire(cue); }, Math.max(0, num(cue.offsetMs, 0)));
        state.timers.push(t);
      });
    },

    /* Called when a voice segment ends, so `after` cues land in the manifest's gap. */
    leaveSegment: function (order) {
      clearTimers();
      cuesAt(order, "after").forEach(fire);
    },

    /* Beds duck while a voice clip is actually sounding. */
    setSpeaking: function (speaking) {
      if (state.speaking === !!speaking) return;
      state.speaking = !!speaking;
      applyDucking();
    },

    /* PAUSE HOLDS EVERYTHING, which is what a pause button means. Joshua: "pause
       should pause any background and SFX playing." The beds keep their position so
       resuming continues the room rather than restarting it.

       Pending `during` offsets are dropped rather than held: a cue timed to land
       inside a line has nothing to land on while the line is stopped, and firing it
       on resume would put it in the wrong place. */
    pauseAll: function () {
      if (state.paused) return;
      state.paused = true;
      clearTimers();
      state.held = [];
      Object.keys(state.beds).forEach(function (id) {
        var el = state.beds[id].el;
        if (!el.paused) { state.held.push(el); try { el.pause(); } catch (e) {} }
      });
      state.oneShots.forEach(function (el) {
        if (!el.paused) { state.held.push(el); try { el.pause(); } catch (e) {} }
      });
    },

    resumeAll: function () {
      if (!state.paused) return;
      state.paused = false;
      var held = state.held || [];
      state.held = [];
      held.forEach(function (el) {
        var p = el.play();
        if (p && p.catch) p.catch(function () {});
      });
    },

    isPaused: function () { return !!state.paused; },

    stopAll: function () {
      clearTimers();
      Object.keys(state.beds).forEach(function (id) { stopBed(id, 150); });
      state.oneShots.forEach(function (el) {
        try { el.pause(); el.src = ""; } catch (e) {}
      });
      state.oneShots = [];
      state.speaking = false;
      state.order = null;
      state.prefired = null;
      state.fired = {};
      state.visiting = null;
      state.paused = false;
      state.held = [];
    }
  };
})();
