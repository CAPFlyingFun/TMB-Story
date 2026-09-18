/* TMB audiobook player.
 *
 * Reads audio/manifests/chapter-NN.json and plays the cached clips in story order, so a
 * chapter assembled from many clips listens like one continuous chapter.
 *
 * This file contains NO ElevenLabs API key and makes NO request to ElevenLabs. It only
 * fetches static manifests and static audio files. Generation happens in a secure
 * environment (scripts/audio.py, or the GitHub Actions workflow) and never in the
 * browser, because GitHub Pages is public.
 */
(function () {
  "use strict";

  var VOICE_STORE = "tmb.voiceVolume";

  /* The voice level is the player's, not the layer module's: it multiplies the one
     <audio> element the chapter plays through. Remembered per browser and wrapped,
     like the layer volumes, and it deliberately has no OFF -- the audiobook is the
     thing this page is for. */
  function loadVoiceVolume() {
    try {
      var v = parseFloat(window.localStorage.getItem(VOICE_STORE));
      if (isFinite(v)) return Math.max(0.1, Math.min(1, v));
    } catch (e) {}
    return 1;
  }

  var state = {
    chapter: null,
    voiceVolume: loadVoiceVolume(),
    exporting: false,
    manifest: null,
    index: 0,
    playing: false,
    rate: 1,
    audio: null,       // one element, created once: most reliable on iOS
    preloaders: [],
    pauseTimer: null,
    missing: 0
  };

  /* Optional layers. If reader/sfx.js did not load, every call below is a no-op and
     the audiobook plays exactly as it did before ambience existed. */
  function layers() {
    return window.TMBLayers || null;
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function audioEl() {
    if (!state.audio) {
      var a = new Audio();
      a.preload = "auto";
      a.addEventListener("ended", onEnded);
      a.addEventListener("timeupdate", renderProgress);
      a.addEventListener("error", onError);
      a.volume = state.voiceVolume;
      a.addEventListener("playing", function () {
        var l = layers(); if (l) l.setSpeaking(true);
      });
      a.addEventListener("pause", function () {
        var l = layers(); if (l) l.setSpeaking(false);
      });
      state.audio = a;
    }
    return state.audio;
  }

  function segments() {
    return (state.manifest && state.manifest.segments) || [];
  }

  function current() {
    return segments()[state.index] || null;
  }

  // ---- loading -------------------------------------------------------------
  function loadChapter(n) {
    stop();
    state.chapter = n;
    state.index = 0;
    return fetch("./audio/manifests/chapter-" + String(n).padStart(2, "0") + ".json",
                 { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("no manifest for chapter " + n);
        return r.json();
      })
      .then(function (m) {
        state.manifest = m;
        var l = layers(); if (l) l.load(m);
        return checkAvailability(m);
      })
      .then(render)
      .catch(function (err) {
        state.manifest = null;
        var view = document.getElementById("listen-body");
        if (view) {
          view.innerHTML = '<div class="empty"><h2>No audio manifest</h2><p>' + esc(err.message) +
            '</p><p>Run <code>python3 scripts/audio.py parse</code> to build the manifests.</p></div>';
        }
      });
  }

  /* One HEAD per distinct clip tells us whether the audio has been generated yet.
     Cheap, and it lets the player say "not generated" instead of failing mid-play. */
  function checkAvailability(m) {
    var distinct = {};
    m.segments.forEach(function (s) { distinct[s.audio] = true; });
    var paths = Object.keys(distinct);
    return Promise.all(paths.map(function (p) {
      return fetch("./" + p, { method: "HEAD" })
        .then(function (r) { return { p: p, ok: r.ok }; })
        .catch(function () { return { p: p, ok: false }; });
    })).then(function (results) {
      var have = {};
      results.forEach(function (r) { have[r.p] = r.ok; });
      state.missing = results.filter(function (r) { return !r.ok; }).length;
      m.segments.forEach(function (s) { s._have = !!have[s.audio]; });
      return m;
    });
  }

  // ---- playback ------------------------------------------------------------
  function play() {
    var seg = current();
    if (!seg) return;
    if (!seg._have) { skipForward(); return; }
    var a = audioEl();
    var src = "./" + seg.audio;
    if (a.getAttribute("data-src") !== src) {
      a.src = src;
      a.setAttribute("data-src", src);
      a.load();
    }
    a.playbackRate = state.rate;
    state.playing = true;
    var l = layers(); if (l) l.enterSegment(seg.order);
    a.play().catch(function () { state.playing = false; render(); });
    preloadAhead();
    render();
  }

  function pause() {
    state.playing = false;
    if (state.pauseTimer) { clearTimeout(state.pauseTimer); state.pauseTimer = null; }
    if (state.audio) state.audio.pause();
    var l = layers(); if (l) l.setSpeaking(false);
    render();
  }

  function stop() {
    pause();
    var l = layers(); if (l) l.stopAll();
    if (state.audio) { state.audio.removeAttribute("data-src"); state.audio.src = ""; }
  }

  function onEnded() {
    var done = current();
    var l = layers();
    if (l) { l.setSpeaking(false); if (done) l.leaveSegment(done.order); }
    var next = segments()[state.index + 1];
    if (!next) { state.playing = false; render(); return; }
    /* The next segment's `before` cues belong in this gap, not on top of its first
       word. enterSegment will not fire them again. */
    if (l && state.playing) l.prefireBefore(next.order);
    /* The gap between clips comes from the manifest, not from silence baked into the
       audio, so pacing can be retuned without regenerating anything. */
    var gap = Math.max(0, next.pauseBeforeMs || 0);
    state.pauseTimer = setTimeout(function () {
      state.pauseTimer = null;
      state.index += 1;
      if (state.playing) play(); else render();
    }, gap);
  }

  function onError() {
    var seg = current();
    if (seg) seg._have = false;
    skipForward();
  }

  function skipForward() {
    if (state.index + 1 < segments().length) {
      state.index += 1;
      if (state.playing) play(); else render();
    } else {
      state.playing = false;
      render();
    }
  }

  function go(delta) {
    var n = state.index + delta;
    if (n < 0) n = 0;
    if (n >= segments().length) n = segments().length - 1;
    state.index = n;
    if (state.audio) state.audio.removeAttribute("data-src");
    if (state.playing) play(); else render();
  }

  function preloadAhead() {
    var next = segments().slice(state.index + 1, state.index + 3);
    state.preloaders = next.filter(function (s) { return s._have; }).map(function (s) {
      var p = new Audio();
      p.preload = "auto";
      p.src = "./" + s.audio;
      return p;
    });
  }

  function setVoiceVolume(v) {
    state.voiceVolume = Math.max(0.1, Math.min(1, v));
    if (state.audio) state.audio.volume = state.voiceVolume;
    try { window.localStorage.setItem(VOICE_STORE, String(state.voiceVolume)); } catch (e) {}
    var out = document.getElementById("listen-vol-voice-out");
    if (out) out.textContent = Math.round(state.voiceVolume * 100) + "%";
  }

  function setRate(r) {
    state.rate = r;
    if (state.audio) state.audio.playbackRate = r;
    render();
  }


  /* ---- layer controls ------------------------------------------------------
     Voices is deliberately present but fixed on: it is the reference layer and the
     thing the page exists for, so it reads as the anchor rather than as a switch that
     could silence the audiobook. Ambience and Sound Effects are real toggles, and the
     whole block is absent when a chapter has no cue sheet -- there is nothing to
     switch, and an empty control panel is a worse answer than no panel. */
  function sliderHtml(id, label, value, min) {
    return '<div class="listen-vol">' +
      '<label for="' + id + '">' + label + '</label>' +
      '<input id="' + id + '" type="range" min="' + min + '" max="100" step="1" value="' +
        Math.round(value * 100) + '" aria-label="' + label + ' volume">' +
      '<output id="' + id + '-out">' + Math.round(value * 100) + '%</output></div>';
  }

  /* Voices is present but has no OFF switch and its slider floors at 10%: it is the
     reference layer and the thing the page exists for, so it reads as the anchor
     rather than as a control that could silence the audiobook. Ambience and Sound
     effects get both a switch and a slider, and the whole block is absent when a
     chapter has no cue sheet -- an empty control panel is a worse answer than none. */
  function layerControlsHtml() {
    var l = layers();
    var voice = '<div class="listen-vols">' +
      sliderHtml("listen-vol-voice", "Voices", state.voiceVolume, 10);
    if (!l || !l.has()) return voice + '</div>';
    var c = l.count();
    var ungenerated = c.ungenerated
      ? '<span class="listen-layer-note">' + c.ungenerated +
        ' of ' + c.assets + ' sound assets not generated yet; those cues are skipped.</span>'
      : '<span class="listen-layer-note">' + c.events + ' cues · ' + c.assets + ' assets</span>';
    return voice +
      sliderHtml("listen-vol-ambience", "Ambience", l.volume("ambience"), 0) +
      sliderHtml("listen-vol-sfx", "Sound effects", l.volume("sfx"), 0) +
      '</div>' +
      '<div class="listen-layers" role="group" aria-label="Audio layers">' +
      '<span class="listen-layer listen-layer-fixed">' +
        '<input type="checkbox" checked disabled aria-label="Voices (always on)"> Voices</span>' +
      '<label class="listen-layer"><input id="listen-layer-ambience" type="checkbox"' +
        (l.isEnabled("ambience") ? " checked" : "") + '> Ambience</label>' +
      '<label class="listen-layer"><input id="listen-layer-sfx" type="checkbox"' +
        (l.isEnabled("sfx") ? " checked" : "") + '> Sound effects</label>' +
      ungenerated + '</div>';
  }

  function bindLayerControls() {
    var l = layers();
    var voice = document.getElementById("listen-vol-voice");
    if (voice) voice.oninput = function (e) { setVoiceVolume(parseInt(e.target.value, 10) / 100); };
    if (!l || !l.has()) return;
    [["listen-layer-ambience", "ambience"], ["listen-layer-sfx", "sfx"]].forEach(function (pair) {
      var el = document.getElementById(pair[0]);
      if (el) el.onchange = function (e) { l.setEnabled(pair[1], e.target.checked); };
    });
    ["ambience", "sfx"].forEach(function (layer) {
      var el = document.getElementById("listen-vol-" + layer);
      if (!el) return;
      el.oninput = function (e) {
        var v = parseInt(e.target.value, 10) / 100;
        l.setVolume(layer, v);
        var out = document.getElementById("listen-vol-" + layer + "-out");
        if (out) out.textContent = Math.round(v * 100) + "%";
      };
    });
  }

  /* ---- download ------------------------------------------------------------
     Rebuilt in the browser rather than served from audio/exports/, because the point
     is the listener's own levels. reader/export.js mirrors drama.py's timeline and
     mixing so the file is the same mix the page just played. */
  function downloadHtml() {
    if (!window.TMBExport || !window.TMBExport.available()) return "";
    var m = state.manifest;
    var mins = m ? Math.round((m.segments.length * 2.7) / 60) : 0;
    return '<div class="listen-save">' +
      '<button id="listen-save" type="button"' + (state.exporting ? " disabled" : "") + '>' +
        (state.exporting ? "Building…" : "Download this chapter (WAV)") + '</button>' +
      '<span id="listen-save-note" class="listen-layer-note">' +
        'Mixed here with the volumes above, so the file matches what you are hearing. ' +
        'Roughly ' + Math.max(1, mins * 5) + ' MB; best on a computer.</span></div>';
  }

  function bindDownload() {
    var btn = document.getElementById("listen-save");
    if (!btn) return;
    btn.onclick = function () {
      var m = state.manifest, l = layers();
      if (!m || state.exporting) return;
      state.exporting = true;
      btn.disabled = true;
      var note = document.getElementById("listen-save-note");
      function say(text) { if (note) note.textContent = text; }
      window.TMBExport.render(m, {
        volumes: {
          voice: state.voiceVolume,
          ambience: l ? l.volume("ambience") : 0,
          sfx: l ? l.volume("sfx") : 0
        },
        enabled: {
          ambience: l ? l.isEnabled("ambience") : false,
          sfx: l ? l.isEnabled("sfx") : false
        }
      }, function (phase, done, total) {
        if (phase === "loading") say("Loading audio… " + done + " of " + total);
        else if (phase === "rendering") say("Mixing the chapter…");
        else say("Writing the file…");
      }).then(function (result) {
        window.TMBExport.save(result.blob,
          "TMB-chapter-" + String(m.chapter).padStart(2, "0") + "-mix.wav");
        say("Saved. " + Math.round(result.seconds / 60) + " min, " +
            window.TMBExport.estimateMb(result.seconds) + " MB.");
      }).catch(function (err) {
        say("Could not build the file: " + err.message);
      }).then(function () {
        state.exporting = false;
        btn.disabled = false;
        btn.textContent = "Download this chapter (WAV)";
      });
    };
  }

  // ---- rendering -----------------------------------------------------------
  function renderProgress() {
    var a = state.audio, seg = current();
    var bar = document.getElementById("listen-seg-bar");
    if (bar && a && a.duration) {
      bar.value = String((a.currentTime / a.duration) * 100);
    }
    var pos = document.getElementById("listen-position");
    if (pos && seg) {
      pos.textContent = "Segment " + (state.index + 1) + " of " + segments().length;
    }
  }

  function render() {
    var body = document.getElementById("listen-body");
    if (!body) return;
    var m = state.manifest;
    if (!m) return;
    var seg = current() || {};
    var total = segments().length;
    var pct = total ? Math.round(((state.index) / total) * 100) : 0;
    var warn = state.missing
      ? '<p class="listen-warn">' + state.missing + ' of ' +
        Object.keys(segments().reduce(function (acc, s) { acc[s.audio] = 1; return acc; }, {})).length +
        ' clip(s) have not been generated yet. The player skips them. Generate with ' +
        '<code>python3 scripts/audio.py generate</code> in a secure environment.</p>'
      : "";
    body.innerHTML =
      '<div class="listen-head"><h2>' + esc(m.title || ("Chapter " + m.chapter)) + '</h2>' +
      '<p class="listen-sub">' + total + ' segments · ' + esc(m.outputFormat || "") + '</p></div>' +
      warn +
      '<div class="listen-now"><p class="listen-speaker">' + esc(seg.speakerName || "") +
        (seg._have === false ? ' <span class="listen-missing">(no audio yet)</span>' : '') + '</p>' +
      '<p class="listen-text">' + esc(seg.displayText || "") + '</p></div>' +
      '<div class="listen-controls">' +
      '<button id="listen-prev" type="button" aria-label="Previous segment">&#9664;&#9664;</button>' +
      '<button id="listen-toggle" type="button">' + (state.playing ? "Pause" : "Play") + '</button>' +
      '<button id="listen-next" type="button" aria-label="Next segment">&#9654;&#9654;</button>' +
      '<label class="listen-rate">Speed ' +
      '<select id="listen-rate">' +
      [0.75, 0.9, 1, 1.1, 1.25, 1.5].map(function (r) {
        return '<option value="' + r + '"' + (r === state.rate ? " selected" : "") + '>' + r + '×</option>';
      }).join("") + '</select></label></div>' +
      layerControlsHtml() +
      downloadHtml() +
      '<input id="listen-seg-bar" class="listen-bar" type="range" min="0" max="100" value="0" ' +
        'aria-label="Position in this segment">' +
      '<p class="listen-meta"><span id="listen-position">Segment ' + (state.index + 1) +
        ' of ' + total + '</span> · chapter ' + pct + '% through</p>';

    document.getElementById("listen-prev").onclick = function () { go(-1); };
    document.getElementById("listen-next").onclick = function () { go(1); };
    document.getElementById("listen-toggle").onclick = function () {
      state.playing ? pause() : play();
    };
    document.getElementById("listen-rate").onchange = function (e) {
      setRate(parseFloat(e.target.value));
    };
    document.getElementById("listen-seg-bar").oninput = function (e) {
      var a = state.audio;
      if (a && a.duration) a.currentTime = (parseFloat(e.target.value) / 100) * a.duration;
    };
    bindLayerControls();
    bindDownload();
    renderProgress();
  }

  // ---- public entry --------------------------------------------------------
  window.TMBPlayer = {
    mount: function (view, manifestData) {
      var chapters = ((manifestData && manifestData.chapters) || [])
        .slice().sort(function (a, b) { return a.number - b.number; });
      view.innerHTML =
        '<section class="listen"><h1>Listen</h1>' +
        '<p class="listen-intro">The audiobook, assembled from the cached voice clips in ' +
        'story order. This page plays existing audio only and contains no ElevenLabs key.</p>' +
        '<label class="listen-pick">Chapter <select id="listen-chapter">' +
        chapters.map(function (c) {
          return '<option value="' + c.number + '">' + c.number + ' · ' + esc(c.title) + '</option>';
        }).join("") + '</select></label>' +
        '<div id="listen-body"><p class="state state-loading">Loading audio manifest…</p></div>' +
        '</section>';
      var pick = document.getElementById("listen-chapter");
      pick.onchange = function () { loadChapter(parseInt(pick.value, 10)); };
      if (chapters.length) loadChapter(chapters[0].number);
    }
  };
})();
