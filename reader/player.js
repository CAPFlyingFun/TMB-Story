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

  /* A clip that fails to load used to cost the whole chapter. onError skipped
     STRAIGHT to the next segment and called play() again, so one bad stretch of
     network raced through clip after clip -- the voice sounding like it had sped up --
     and then a rejected play() set playing=false and everything stopped, while the
     looping beds carried on underneath. That is the lock-up Joshua described: the
     voice sprints, dies, and the room tone keeps going.

     Three numbers make that a recoverable blip instead. */
  var LOAD_RETRIES = 1;          // a blip deserves one retry; a pattern does not
  var RETRY_DELAY_MS = 500;
  var MAX_CONSECUTIVE_SKIPS = 3; // then STOP and say so, rather than sprint to the end

  /* TWO WAYS TO PLAY A CHAPTER, and the first one is now the default.

     MIXED: one file, `audio/exports/chapter-NN-drama.mp3`, with the voices, ambience
     and effects already mixed into the samples. There is no clip-to-clip handover to
     get wrong, no gap to time, no second element to keep in step and no gain to
     apply in the browser -- so what Joshua hears is by construction the file the
     pipeline measured. Every bug this player has had came from doing that assembly
     live: the voice racing then dying, the beds carrying on over a dead voice, a cue
     firing twice on a retry.

     CLIPS: the original path -- 185 elements in order, with reader/sfx.js firing the
     cues alongside. It is what plays when the mixed export is missing (a chapter not
     combined yet), and it is where the Ambience and Sound effects switches live,
     because those can only mean something while the layers are still separate.

     The manifest says which are available; the page does not guess. */
  var MODE_MIXED = "mixed", MODE_CLIPS = "clips";

  var state = {
    chapter: null,
    mode: MODE_CLIPS,
    mixed: null,       // the export entry from the manifest, when there is one
    retries: 0,
    consecutiveFailures: 0,
    playToken: 0,
    stalled: null,
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
      a.addEventListener("playing", function () {
        state.consecutiveFailures = 0;
        state.retries = 0;
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

  function mixedMode() {
    return state.mode === MODE_MIXED && !!state.mixed;
  }

  /* THE URL CARRIES THE FILE'S SIZE, and that is a cache key rather than decoration.
     A chapter export keeps its path forever while its contents change every time the
     mix is retuned, and a phone that has played it once will happily go on playing
     the copy it already has. The manifest is fetched with no-cache, so `bytes` is
     always the size of the file on the server right now: when the mix changes, the
     URL changes, and the old copy is simply never asked for again. */
  function mixedSrc() {
    return "./" + state.mixed.audio + "?v=" + (state.mixed.bytes || 0);
  }

  /* The index the mixed file was built with. A mixed export is placed clip by clip at
     exactly these offsets, so this is not an estimate -- it is the same arithmetic,
     read back. */
  function starts() {
    return (state.mixed && state.mixed.startMs) || [];
  }

  /* Which segment is sounding at a given moment. A linear scan over 185 numbers runs
     on every timeupdate, which is four times a second: cheap, and a binary search
     here would be harder to read than it is fast. */
  function indexAt(ms) {
    var at = starts(), i = 0;
    while (i + 1 < at.length && at[i + 1] <= ms) i += 1;
    return i;
  }

  // ---- loading -------------------------------------------------------------
  function loadChapter(n) {
    stop();
    state.chapter = n;
    state.index = 0;
    state.retries = 0;
    state.consecutiveFailures = 0;
    state.stalled = null;
    return fetch("./audio/manifests/chapter-" + String(n).padStart(2, "0") + ".json",
                 { cache: "no-cache" })
      .then(function (r) {
        if (!r.ok) throw new Error("no manifest for chapter " + n);
        return r.json();
      })
      .then(function (m) {
        state.manifest = m;
        var l = layers(); if (l) l.load(m);
        return chooseMode(m);
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

  /* A mixed export is only usable if the file is really there AND the manifest gave
     it an index, because without the index the page cannot say which line is being
     read. Either missing and we fall back to the clips, which still work. */
  function chooseMode(m) {
    var mixed = ((m.exports || {}).mixed) || null;
    state.mixed = null;
    state.mode = MODE_CLIPS;
    if (!mixed || !mixed.audio || !mixed.startMs ||
        mixed.startMs.length !== m.segments.length) {
      return checkAvailability(m);
    }
    return fetch("./" + mixed.audio + "?v=" + (mixed.bytes || 0), { method: "HEAD" })
      .then(function (r) { return r.ok; })
      .catch(function () { return false; })
      .then(function (ok) {
        if (!ok) return checkAvailability(m);
        state.mixed = mixed;
        state.mode = MODE_MIXED;
        state.missing = 0;
        /* Nothing in reader/sfx.js may sound in this mode: the effects are already in
           the file, and a live cue on top would be the same sound twice. */
        var l = layers(); if (l) l.stopAll();
        m.segments.forEach(function (seg) { seg._have = true; });
        return m;
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
    if (mixedMode()) return playMixed();
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
    state.stalled = null;
    var resume = layers(); if (resume) resume.resumeAll();
    var token = ++state.playToken;
    var l = layers(); if (l) l.enterSegment(seg.order);
    /* Deliberately NO success handler. A resolved play() means the request was
       accepted, not that audio is sounding -- an element can resolve it and then fire
       `error` moments later, which is exactly how a failing clip looked like a
       succeeding one. The `playing` event is the only honest proof, and that is where
       the failure counters are cleared. */
    a.play().catch(function (err) {
      /* Two rejections that are NOT failures and must not stop the audiobook:
         a play() superseded by the next segment's load (the browser reports
         AbortError, "interrupted by a new load request"), and any rejection for a
         token we have already moved past. Treating those as failures is what turned
         a busy moment into a dead player. */
      if (token !== state.playToken) return;
      if (err && err.name === "AbortError") return;
      if (err && err.name === "NotAllowedError") {
        state.playing = false;
        state.stalled = "The browser wants a tap before it will play audio.";
        render();
        return;
      }
      failCurrent("could not start playback");
    });
    preloadAhead();
    render();
  }

  /* ONE ELEMENT, ONE FILE, AND THE POSITION IS THE ONLY STATE. Where the clip player
     has to decide when a segment ends, what the gap is, which cue belongs in it and
     what to do when a load fails, this asks the element where it is and reads the
     answer off the index. */
  function playMixed() {
    var a = audioEl();
    var src = mixedSrc();
    var seeking = a.getAttribute("data-src") !== src;
    if (seeking) {
      a.src = src;
      a.setAttribute("data-src", src);
      a.load();
      var at = starts()[state.index] || 0;
      if (at) {
        /* The metadata has to be in before a seek will hold, so it is deferred once
           rather than issued into a src that has not loaded. */
        a.addEventListener("loadedmetadata", function once() {
          a.removeEventListener("loadedmetadata", once);
          try { a.currentTime = at / 1000; } catch (e) {}
        });
      }
    }
    a.playbackRate = state.rate;
    state.playing = true;
    state.stalled = null;
    var token = ++state.playToken;
    a.play().catch(function (err) {
      if (token !== state.playToken) return;
      if (err && err.name === "AbortError") return;
      state.playing = false;
      state.stalled = err && err.name === "NotAllowedError"
        ? "The browser wants a tap before it will play audio."
        : "The chapter's audio would not start. Check the connection and press Play.";
      render();
    });
    render();
  }

  function seekToSegment(i) {
    var a = state.audio;
    state.index = Math.max(0, Math.min(segments().length - 1, i));
    var at = (starts()[state.index] || 0) / 1000;
    if (a && a.getAttribute("data-src") === mixedSrc()) {
      try { a.currentTime = at; } catch (e) {}
      render();
      if (state.playing) { var p = a.play(); if (p && p.catch) p.catch(function () {}); }
    } else if (state.playing) {
      play();
    } else {
      render();
    }
  }

  function pause() {
    state.playing = false;
    if (state.pauseTimer) { clearTimeout(state.pauseTimer); state.pauseTimer = null; }
    if (state.audio) state.audio.pause();
    var l = layers(); if (l) { l.setSpeaking(false); l.pauseAll(); }
    render();
  }

  function stop() {
    pause();
    var l = layers(); if (l) l.stopAll();
    if (state.audio) { state.audio.removeAttribute("data-src"); state.audio.src = ""; }
  }

  function onEnded() {
    if (mixedMode()) { state.playing = false; render(); return; }
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
    if (mixedMode()) {
      state.playing = false;
      state.stalled = "The chapter's audio file would not load. Check the connection " +
        "and press Play.";
      render();
      return;
    }
    var a = state.audio, seg = current();
    if (!a || !seg) return;
    /* An error for a clip we have already moved past is noise: the element fires it
       while its src is being replaced. Acting on it skipped a segment that was fine. */
    if (a.getAttribute("data-src") !== "./" + seg.audio) return;
    failCurrent("could not load");
  }

  /* One retry, then give up on THIS clip -- and count it, because the count is what
     separates a blip from a chapter that is not going to play. */
  function failCurrent(reason) {
    var seg = current();
    if (state.retries < LOAD_RETRIES) {
      state.retries += 1;
      if (state.audio) state.audio.removeAttribute("data-src");
      state.pauseTimer = setTimeout(function () {
        state.pauseTimer = null;
        if (state.playing) play(); else render();
      }, RETRY_DELAY_MS);
      return;
    }
    state.retries = 0;
    if (seg) seg._have = false;
    skipForward(reason);
  }

  function skipForward(reason) {
    if (reason) {
      state.consecutiveFailures += 1;
      if (state.consecutiveFailures > MAX_CONSECUTIVE_SKIPS) {
        /* STOP, rather than sprint. Racing through the rest of the chapter is what
           made this sound like the voice speeding up, and it left nothing on screen
           to say why the audiobook had gone quiet. */
        state.playing = false;
        state.stalled = state.consecutiveFailures + " clips in a row would not play (" +
          reason + "). Playback stopped here rather than skipping the rest of the " +
          "chapter. Check the connection and press Play.";
        var l = layers(); if (l) l.stopAll();
        render();
        return;
      }
    }
    if (state.index + 1 < segments().length) {
      state.index += 1;
      if (state.playing) play(); else render();
    } else {
      state.playing = false;
      render();
    }
  }

  function go(delta) {
    if (mixedMode()) return seekToSegment(state.index + delta);
    var n = state.index + delta;
    if (n < 0) n = 0;
    if (n >= segments().length) n = segments().length - 1;
    state.index = n;
    if (state.audio) state.audio.removeAttribute("data-src");
    if (state.playing) play(); else render();
  }

  function preloadAhead() {
    if (mixedMode()) { state.preloaders = []; return; }
    var next = segments().slice(state.index + 1, state.index + 3);
    state.preloaders = next.filter(function (s) { return s._have; }).map(function (s) {
      var p = new Audio();
      p.preload = "auto";
      p.src = "./" + s.audio;
      return p;
    });
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
  function layerControlsHtml() {
    var l = layers();
    if (!l || !l.has() || mixedMode()) return "";
    var c = l.count();
    var ungenerated = c.ungenerated
      ? '<span class="listen-layer-note">' + c.ungenerated +
        ' of ' + c.assets + ' sound assets not generated yet; those cues are skipped.</span>'
      : '<span class="listen-layer-note">' + c.events + ' cues · ' + c.assets + ' assets</span>';
    return '<div class="listen-layers" role="group" aria-label="Audio layers">' +
      '<span class="listen-layer listen-layer-fixed">' +
        '<input type="checkbox" checked disabled aria-label="Voices (always on)"> Voices</span>' +
      '<label class="listen-layer"><input id="listen-layer-ambience" type="checkbox"' +
        (l.isEnabled("ambience") ? " checked" : "") + '> Ambience</label>' +
      '<label class="listen-layer"><input id="listen-layer-sfx" type="checkbox"' +
        (l.isEnabled("sfx") ? " checked" : "") + '> Sound effects</label>' +
      ungenerated + '</div>';
  }

  /* ---- how the chapter is played ------------------------------------------
     A switch only where there is a real choice. When a chapter has been combined
     both readings exist and the listener picks; when it has not, there is nothing to
     offer and the line simply says what is playing. */
  function sourceLine(m, total) {
    if (mixedMode()) {
      var mb = (state.mixed.bytes / 1048576).toFixed(1);
      return total + " segments · one mixed file, " + mb + " MB · " +
             clock(state.mixed.seconds);
    }
    return total + " segments · played clip by clip · " + (m.outputFormat || "");
  }

  function sourceControlHtml() {
    var mixed = ((state.manifest || {}).exports || {}).mixed;
    if (!mixed || !mixed.startMs) return "";
    return '<div class="listen-source" role="group" aria-label="How to play">' +
      '<label class="listen-layer"><input type="radio" name="listen-source" ' +
        'id="listen-source-mixed"' + (mixedMode() ? " checked" : "") +
        '> One mixed file</label>' +
      '<label class="listen-layer"><input type="radio" name="listen-source" ' +
        'id="listen-source-clips"' + (mixedMode() ? "" : " checked") +
        '> Separate clips, live layers</label>' +
      '<span class="listen-layer-note">The mixed file carries the ambience and effects ' +
      'at the levels the pipeline measured. Separate clips let you switch those layers ' +
      'off, and assemble the chapter in the browser.</span></div>';
  }

  function bindSourceControl() {
    var mixedBtn = document.getElementById("listen-source-mixed");
    var clipsBtn = document.getElementById("listen-source-clips");
    if (!mixedBtn || !clipsBtn) return;
    function switchTo(mode) {
      if (state.mode === mode) return;
      var wasPlaying = state.playing;
      var at = state.index;
      pause();
      var l = layers(); if (l) l.stopAll();
      if (state.audio) { state.audio.removeAttribute("data-src"); state.audio.src = ""; }
      state.mode = mode;
      state.index = at;
      state.retries = 0;
      state.consecutiveFailures = 0;
      state.stalled = null;
      if (mode === MODE_CLIPS) {
        checkAvailability(state.manifest).then(function () {
          if (wasPlaying) play(); else render();
        });
      } else if (wasPlaying) { play(); } else { render(); }
    }
    mixedBtn.onchange = function () { switchTo(MODE_MIXED); };
    clipsBtn.onchange = function () { switchTo(MODE_CLIPS); };
  }

  function bindLayerControls() {
    var l = layers();
    if (!l || !l.has() || mixedMode()) return;
    [["listen-layer-ambience", "ambience"], ["listen-layer-sfx", "sfx"]].forEach(function (pair) {
      var el = document.getElementById(pair[0]);
      if (el) el.onchange = function (e) { l.setEnabled(pair[1], e.target.checked); };
    });
  }

  // ---- rendering -----------------------------------------------------------
  function clock(seconds) {
    var t = Math.max(0, Math.round(seconds || 0));
    return Math.floor(t / 60) + ":" + ("0" + (t % 60)).slice(-2);
  }

  function renderProgress() {
    var a = state.audio;
    var bar = document.getElementById("listen-seg-bar");
    if (bar && a && a.duration) {
      bar.value = String((a.currentTime / a.duration) * 100);
    }
    if (mixedMode() && a) {
      /* THE FILE IS IN CHARGE. The page does not count segments as it plays them; it
         asks the element where it is and looks the answer up. That is what makes
         scrubbing, a speed change and a seek all land on the right line for free. */
      var i = indexAt(a.currentTime * 1000);
      if (i !== state.index) { state.index = i; renderNow(); }
    }
    var pos = document.getElementById("listen-position");
    if (pos) {
      pos.textContent = "Segment " + (state.index + 1) + " of " + segments().length +
        (a && a.duration ? " · " + clock(a.currentTime) + " of " + clock(a.duration) : "");
    }
  }

  /* Just the line being read. render() rebuilds the whole panel, and rebuilding it
     four times a second would fight every control on it -- which is exactly how the
     volume sliders were destroyed between one segment and the next. */
  function renderNow() {
    var seg = current() || {};
    var who = document.getElementById("listen-speaker");
    var text = document.getElementById("listen-text");
    if (who) who.textContent = seg.speakerName || "";
    if (text) text.textContent = seg.displayText || "";
  }

  function render() {
    var body = document.getElementById("listen-body");
    if (!body) return;
    var m = state.manifest;
    if (!m) return;
    var seg = current() || {};
    var total = segments().length;
    var pct = total ? Math.round(((state.index) / total) * 100) : 0;
    var stalled = state.stalled
      ? '<p class="listen-warn">' + esc(state.stalled) + '</p>'
      : "";
    var warn = state.missing
      ? '<p class="listen-warn">' + state.missing + ' of ' +
        Object.keys(segments().reduce(function (acc, s) { acc[s.audio] = 1; return acc; }, {})).length +
        ' clip(s) have not been generated yet. The player skips them. Generate with ' +
        '<code>python3 scripts/audio.py generate</code> in a secure environment.</p>'
      : "";
    body.innerHTML =
      '<div class="listen-head"><h2>' + esc(m.title || ("Chapter " + m.chapter)) + '</h2>' +
      '<p class="listen-sub">' + esc(sourceLine(m, total)) + '</p></div>' +
      stalled + warn +
      '<div class="listen-now"><p class="listen-speaker" id="listen-speaker">' +
        esc(seg.speakerName || "") + '</p>' +
      (seg._have === false ? '<p class="listen-missing">(no audio yet)</p>' : '') +
      '<p class="listen-text" id="listen-text">' + esc(seg.displayText || "") + '</p></div>' +
      '<div class="listen-controls">' +
      '<button id="listen-prev" type="button" aria-label="Previous segment">&#9664;&#9664;</button>' +
      '<button id="listen-toggle" type="button">' + (state.playing ? "Pause" : "Play") + '</button>' +
      '<button id="listen-next" type="button" aria-label="Next segment">&#9654;&#9654;</button>' +
      '<label class="listen-rate">Speed ' +
      '<select id="listen-rate">' +
      [0.75, 0.9, 1, 1.1, 1.25, 1.5].map(function (r) {
        return '<option value="' + r + '"' + (r === state.rate ? " selected" : "") + '>' + r + '×</option>';
      }).join("") + '</select></label></div>' +
      sourceControlHtml() +
      layerControlsHtml() +
      '<input id="listen-seg-bar" class="listen-bar" type="range" min="0" max="100" value="0" ' +
        'aria-label="Position in the chapter">' +
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
    bindSourceControl();
    bindLayerControls();
    renderProgress();
  }

  // ---- public entry --------------------------------------------------------
  window.TMBPlayer = {
    mount: function (view, manifestData) {
      var chapters = ((manifestData && manifestData.chapters) || [])
        .slice().sort(function (a, b) { return a.number - b.number; });
      view.innerHTML =
        '<section class="listen"><h1>Listen</h1>' +
        '<p class="listen-intro">The audiobook. A combined chapter plays as one mixed ' +
        'file, with the ambience and effects already in it at the levels the pipeline ' +
        'measured; anything not combined yet plays clip by clip with the layers live. ' +
        'This page plays existing audio only and contains no ElevenLabs key.</p>' +
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
