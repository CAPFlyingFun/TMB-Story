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
  /* THE v4 DIALOGUE READING comes first when a chapter has one (Joshua, 2026-11-07,
     "version B"): one file assembled from Eleven v4 Text to Dialogue takes, with its own
     index (exports.dialogue.startMs), so it plays and highlights exactly like the mixed
     file. It carries the voices only; the v2 mix with ambience and effects stays one
     tap away. */
  var MODE_MIXED = "mixed", MODE_CLIPS = "clips", MODE_DIALOGUE = "dialogue";

  var state = {
    chapter: null,
    mode: MODE_CLIPS,
    mixed: null,       // the one-file export being played (dialogue or mixed), when there is one
    chapters: [],      // chapter numbers in order, for previous/next chapter
    blobs: {},         // one-file src -> object URL of the fully downloaded file
    blobOrder: [],     // oldest first, so only the last few chapters stay in memory
    download: null,    // { src, loaded, total, started, abort } while one is coming in
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
        /* The active chapter is playing: now fetch the next ones in the background. */
        if (window.TMBOffline && state.chapter != null) window.TMBOffline.prefetchAfter(state.chapter);
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

  /* "One file" covers both single-file readings: they play, seek and index the same way. */
  function mixedMode() {
    return (state.mode === MODE_MIXED || state.mode === MODE_DIALOGUE) && !!state.mixed;
  }

  function exportFor(m, mode) {
    var e = (m && m.exports) || {};
    var x = mode === MODE_DIALOGUE ? e.dialogue : mode === MODE_MIXED ? e.mixed : null;
    return x && x.audio && x.startMs && x.startMs.length === m.segments.length ? x : null;
  }

  /* THE URL CARRIES A HASH OF THE FILE, and that is a cache key rather than
     decoration. A chapter export keeps its path forever while its contents change
     every time the mix is retuned, and a phone that has played it once will happily
     go on playing the copy it already has. The manifest is fetched with no-cache, so
     this is always the file on the server right now: when the mix changes the URL
     changes, and the old copy is never asked for again.

     IT USED TO BE THE FILE'S SIZE, which nearly failed silently. Chapter 3's opening
     bed changed from a night ambience to the TOMBS array -- four completely different
     minutes of sound -- and the file moved by ONE BYTE. At a fixed bitrate an mp3's
     size is set by its duration, so two mixes of one chapter are nearly always within
     a few bytes and can easily be identical; an identical size is an identical URL,
     and then the phone plays the old mix forever with nothing anywhere to say so.
     `bytes` stays in the manifest because the page prints it as megabytes, but it is
     no longer what identifies the file. */
  function mixedSrc() {
    var m = state.mixed;
    return "./" + m.audio + "?v=" + (m.hash || m.bytes || 0);
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
    if (state.download && state.download.abort) state.download.abort.abort();
    state.download = null;
    state.streamOnly = false;
    state.chapter = n;
    state.index = 0;
    state.pendingSec = null;
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
  function chooseMode(m, prefer) {
    state.mixed = null;
    state.mode = MODE_CLIPS;
    var order = prefer ? [prefer] : [MODE_DIALOGUE, MODE_MIXED];
    var mode = null, mixed = null;
    for (var i = 0; i < order.length && !mixed; i++) {
      mixed = exportFor(m, order[i]); if (mixed) mode = order[i];
    }
    if (!mixed) return checkAvailability(m);
    return fetch("./" + mixed.audio + "?v=" + (mixed.hash || mixed.bytes || 0),
                 { method: "HEAD" })
      .then(function (r) { return r.ok; })
      .catch(function () { return false; })
      .then(function (ok) {
        if (!ok) return checkAvailability(m);
        state.mixed = mixed;
        state.mode = mode;
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

  /* THE WHOLE FILE IS DOWNLOADED BEFORE IT PLAYS (Joshua, 2026-11-07). Streaming it
     let the browser run out of buffer mid-chapter: the voice paused right after a change
     of speaker, then hurried to catch up. So Play fetches the complete file first, shows
     how far along that is ("3.2 MB / 6.4 MB · 1m 19s"), and plays it from memory, where
     a seek or a skip never waits on the network. The last three files are kept, so going
     back a chapter or switching readings is instant. If the download cannot be read as a
     stream, it falls back to the old streamed playback rather than not playing. */
  var KEEP_FILES = 3;

  function mb(b) { return (b / 1048576).toFixed(1); }

  function eta(d) {
    var secs = (Date.now() - d.started) / 1000;
    if (!d.total || d.loaded < 65536 || secs < 0.4) return "";
    var left = (d.total - d.loaded) / (d.loaded / secs);
    if (!isFinite(left)) return "";
    left = Math.max(0, Math.round(left));
    return " · " + (left >= 60 ? Math.floor(left / 60) + "m " : "") + (left % 60) + "s";
  }

  function loadingText() {
    var d = state.download;
    if (!d) return "";
    var total = d.total || (state.mixed && state.mixed.bytes) || 0;
    return "Loading the chapter audio: " + mb(d.loaded) + " MB" +
      (total ? " / " + mb(total) + " MB" : "") + eta({ loaded: d.loaded, total: total, started: d.started });
  }

  function renderLoading() {
    var el = document.getElementById("listen-loading");
    if (el) { el.textContent = loadingText(); el.hidden = !state.download; }
  }

  function remember(src, url) {
    state.blobs[src] = url;
    state.blobOrder.push(src);
    while (state.blobOrder.length > KEEP_FILES) {
      var old = state.blobOrder.shift();
      try { URL.revokeObjectURL(state.blobs[old]); } catch (e) {}
      delete state.blobs[old];
    }
  }

  function download(src) {
    var ctrl = window.AbortController ? new AbortController() : null;
    var d = { src: src, loaded: 0, total: (state.mixed && state.mixed.bytes) || 0,
              started: Date.now(), abort: ctrl };
    state.download = d;
    renderLoading();
    return fetch(src, ctrl ? { signal: ctrl.signal } : {}).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      var len = parseInt(r.headers.get("Content-Length") || "0", 10);
      if (len) d.total = len;
      if (!r.body || !r.body.getReader) return r.blob();
      var reader = r.body.getReader(), parts = [];
      function pump() {
        return reader.read().then(function (x) {
          if (x.done) return new Blob(parts, { type: "audio/mpeg" });
          parts.push(x.value); d.loaded += x.value.length; renderLoading();
          return pump();
        });
      }
      return pump();
    }).then(function (blob) {
      remember(src, URL.createObjectURL(blob));
      if (state.download === d) state.download = null;
      renderLoading();
      return state.blobs[src];
    }, function (err) {
      if (state.download === d) state.download = null;
      renderLoading();
      throw err;
    });
  }

  /* ONE ELEMENT, ONE FILE, AND THE POSITION IS THE ONLY STATE. Where the clip player
     has to decide when a segment ends, what the gap is, which cue belongs in it and
     what to do when a load fails, this asks the element where it is and reads the
     answer off the index. */
  function playMixed() {
    var a = audioEl();
    var src = mixedSrc();
    var seeking = a.getAttribute("data-src") !== src;
    if (seeking && !state.blobs[src] && !state.streamOnly) {
      if (state.download && state.download.src === src) return;   // already coming in
      if (state.download && state.download.abort) state.download.abort.abort();
      state.playing = true;      // the listener asked to play; it starts when the file is here
      var chapter = state.chapter;
      var O = window.TMBOffline, m = state.mixed;
      var got = O && O.available()
        ? O.getForPlay(chapter, { audio: m.audio, hash: m.hash, bytes: m.bytes }, function (loaded, total, started) {
            state.download = state.download || { src: src, loaded: 0, total: total, started: started };
            state.download.loaded = loaded; state.download.total = total; renderLoading();
          }).then(function (blob) {
            state.download = null; renderLoading();
            remember(src, URL.createObjectURL(blob));
          }, function (err) { state.download = null; renderLoading(); throw err; })
        : download(src);
      got.then(function () {
        if (state.chapter === chapter && state.playing && mixedSrc() === src) playMixed();
      }, function (err) {
        if (err && err.name === "AbortError") return;
        /* Say what happened (attempts, time, last error), then fall back to streaming
           rather than not playing at all. */
        state.stalled = (err && err.message) || "The chapter audio did not download.";
        state.streamOnly = true;
        if (state.chapter === chapter && state.playing) playMixed(); else render();
      });
      render();
      return;
    }
    if (seeking) {
      a.src = state.blobs[src] || src;
      a.setAttribute("data-src", src);
      a.load();
      var at = state.pendingSec != null ? state.pendingSec * 1000 : (starts()[state.index] || 0);
      state.pendingSec = null;
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
    if (mixedMode()) {
      state.playing = false;
      /* Like PocketFM: the next chapter follows on, unless the sleep timer was set to the
         end of this one. */
      if (state.sleep && state.sleep.mode === -1) { state.sleep = null; render(); return; }
      if (chapterStep(1) != null) { changeChapter(1); state.autoNext = true; return; }
      render(); return;
    }
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
      var what = state.mode === MODE_DIALOGUE ? "one file, v4 dialogue, voices only" : "one mixed file";
      return total + " segments · " + what + ", " + mb + " MB · " +
             clock(state.mixed.seconds);
    }
    return total + " segments · played clip by clip · " + (m.outputFormat || "");
  }

  function sourceControlHtml() {
    var m = state.manifest, dlg = exportFor(m, MODE_DIALOGUE), mix = exportFor(m, MODE_MIXED);
    if (!dlg && !mix) return "";
    function opt(id, mode, label) {
      return '<label class="listen-layer"><input type="radio" name="listen-source" ' +
        'id="' + id + '"' + (state.mode === mode ? " checked" : "") + '> ' + label + '</label>';
    }
    return '<div class="listen-source" role="group" aria-label="How to play">' +
      (dlg ? opt("listen-source-dialogue", MODE_DIALOGUE, "v4 dialogue (one file)") : "") +
      (mix ? opt("listen-source-mixed", MODE_MIXED, "v2 with ambience &amp; effects (one file)") : "") +
      opt("listen-source-clips", MODE_CLIPS, "Separate clips, live layers") +
      '<span class="listen-layer-note">' +
      (dlg ? 'The v4 dialogue file is voices only. ' : '') +
      'The v2 mixed file carries the ambience and effects at the levels the pipeline ' +
      'measured. Separate clips let you switch those layers off.</span></div>';
  }

  function bindSourceControl() {
    var dlgBtn = document.getElementById("listen-source-dialogue");
    var mixedBtn = document.getElementById("listen-source-mixed");
    var clipsBtn = document.getElementById("listen-source-clips");
    if (!clipsBtn) return;
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
      state.mixed = exportFor(state.manifest, mode);
      if (mode === MODE_CLIPS || !state.mixed) {
        state.mode = MODE_CLIPS; state.mixed = null;
        checkAvailability(state.manifest).then(function () {
          if (wasPlaying) play(); else render();
        });
      } else {
        state.manifest.segments.forEach(function (seg) { seg._have = true; });
        if (wasPlaying) { play(); } else { render(); }
      }
    }
    if (dlgBtn) dlgBtn.onchange = function () { switchTo(MODE_DIALOGUE); };
    if (mixedBtn) mixedBtn.onchange = function () { switchTo(MODE_MIXED); };
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

  /* ---- the transport: seconds and chapters ---------------------------------
     +/-10 s and +/-30 s move through the chapter by time. In one-file mode that is an
     exact seek; clip by clip it lands on the line sounding at that moment. */
  function skip(seconds) {
    var total = chapterTotal();
    var t = Math.max(0, Math.min(total ? total - 0.25 : 0, chapterNow() + seconds));
    seekChapter(t);
  }

  /* ONE BUTTON EACH WAY THAT SPEEDS UP (Joshua, 2026-11-07). The first tap jumps 15 s;
     another tap within 3 s jumps 30 s, and every tap after that keeps jumping 30 s for as
     long as they keep coming within 3 s of each other. Three seconds without a tap and
     the next jump is back to 15 s. The label always shows what the next tap will do. */
  var STEP_FIRST = 15, STEP_REPEAT = 30, STEP_WINDOW_MS = 3000;
  var steps = { "-1": { last: 0, timer: null }, "1": { last: 0, timer: null } };

  function stepSize(dir) {
    return Date.now() - steps[dir].last < STEP_WINDOW_MS ? STEP_REPEAT : STEP_FIRST;
  }

  function stepLabel(dir) {
    var b = document.getElementById(dir > 0 ? "listen-fwd" : "listen-back");
    if (!b) return;
    var n = stepSize(dir);
    b.innerHTML = stepIcon(dir, n);
    b.setAttribute("aria-label", (dir > 0 ? "Forward " : "Back ") + n + " seconds");
  }

  function stepTap(dir) {
    var st = steps[dir], n = stepSize(dir);
    st.last = Date.now();
    skip(dir * n);
    stepLabel(dir);
    clearTimeout(st.timer);
    st.timer = setTimeout(function () { stepLabel(dir); }, STEP_WINDOW_MS + 20);
  }

  function chapterStep(delta) {
    var i = state.chapters.indexOf(state.chapter);
    var j = i + delta;
    return i < 0 || j < 0 || j >= state.chapters.length ? null : state.chapters[j];
  }

  /* Previous and next chapter always start the chapter from the beginning, and keep
     playing if the listener was playing. */
  function changeChapter(delta) {
    var n = chapterStep(delta);
    if (n == null) return;
    var wasPlaying = state.playing || state.autoNext;
    state.autoNext = false;
    var pick = document.getElementById("listen-chapter");
    if (pick) pick.value = String(n);
    loadChapter(n).then(function () { if (wasPlaying && state.manifest) play(); });
  }

  // ---- rendering -----------------------------------------------------------
  function clock(seconds) {
    var t = Math.max(0, Math.round(seconds || 0));
    return Math.floor(t / 60) + ":" + ("0" + (t % 60)).slice(-2);
  }

  /* WHERE WE ARE IN THE CHAPTER, IN TIME. The percentage and the bar both come from
     this, never from the segment count: segments are wildly uneven (a two-word "Jack."
     next to a paragraph of narration), so counting them made the bar lurch and the
     percentage sit still. In the mixed file the element knows the answer. Clip by clip,
     the chapter clock is the current clip's start on the chapter timeline plus how far
     into the clip the element is. */
  function chapterTotal() {
    var a = state.audio;
    if (mixedMode() && a && a.duration && isFinite(a.duration)) return a.duration;
    if (state.mixed && state.mixed.seconds) return state.mixed.seconds;
    var segs = segments(), last = segs[segs.length - 1];
    return last && last.endMs ? last.endMs / 1000 : 0;
  }

  function chapterNow() {
    var a = state.audio;
    if (mixedMode()) {
      if (a && a.getAttribute("data-src") === mixedSrc()) return a.currentTime;
      /* Not loaded yet (nothing has been played): the position is where a skip or a
         drag left it, so -10 s / +30 s still count from there. */
      return state.pendingSec != null ? state.pendingSec : (starts()[state.index] || 0) / 1000;
    }
    var seg = current();
    var base = seg ? ((starts()[state.index] != null ? starts()[state.index] : seg.startMs) || 0) / 1000 : 0;
    var into = (a && seg && a.getAttribute("data-src") === "./" + seg.audio) ? a.currentTime : 0;
    return base + into;
  }

  function seekChapter(seconds) {
    var a = state.audio;
    if (mixedMode()) {
      if (a && a.getAttribute("data-src") === mixedSrc()) {
        try { a.currentTime = seconds; } catch (e) {}
        renderProgress();
      } else {
        state.index = indexAt(seconds * 1000);
        state.pendingSec = seconds;
        if (state.playing) play(); else render();
      }
      return;
    }
    /* Clip by clip: jump to the line that is sounding at that moment. */
    var ms = seconds * 1000, segs = segments(), i = 0;
    while (i + 1 < segs.length && ((starts()[i + 1] != null ? starts()[i + 1] : segs[i + 1].startMs) || 0) <= ms) i += 1;
    if (i !== state.index) go(i - state.index);
  }

  function renderProgress() {
    var a = state.audio;
    if (mixedMode() && a) {
      /* THE FILE IS IN CHARGE. The page does not count segments as it plays them; it
         asks the element where it is and looks the answer up. That is what makes
         scrubbing, a speed change and a seek all land on the right line for free. */
      var i = indexAt(a.currentTime * 1000);
      if (i !== state.index) { state.index = i; renderNow(); }
      else {
        var seg = current();
        if (seg && state.index + ":" + captionPiece(seg).i !== state.capKey) {
          var cap = document.getElementById("listen-now"); if (cap) cap.innerHTML = captionHtml();
        }
      }
    }
    var total = chapterTotal(), now = Math.min(chapterNow(), total || 0);
    var frac = total ? now / total : 0;
    if (!state.dragging) drawScrub(frac);
    var tt = document.getElementById("lp-total");
    if (tt && total) tt.textContent = clock(total);
    checkSleep();
    var pos = document.getElementById("listen-position");
    if (pos) {
      pos.textContent = "Segment " + (state.index + 1) + " of " + segments().length +
        (total ? " · " + clock(now) + " of " + clock(total) : "") +
        " · " + (frac * 100).toFixed(1) + "% through";
    }
  }

  /* timeupdate only fires about four times a second, which makes a bar visibly step.
     While audio is playing, the bar and clock follow the animation frame instead. */
  function tick() {
    state.raf = null;
    if (!state.playing) return;
    renderProgress();
    state.raf = requestAnimationFrame(tick);
  }
  function startTicking() {
    if (!state.raf && state.playing && window.requestAnimationFrame) state.raf = requestAnimationFrame(tick);
  }

  /* Just the line being read. render() rebuilds the whole panel, and rebuilding it
     four times a second would fight every control on it -- which is exactly how the
     volume sliders were destroyed between one segment and the next. */
  function renderNow() {
    var box = document.getElementById("listen-now");
    if (box) box.innerHTML = captionHtml();
    var sc = document.getElementById("lp-script");
    if (sc) sc.innerHTML = nowHtml();
  }

  /* Sleep timer: a set number of minutes, or the end of this chapter (the chapter then
     stops instead of rolling on to the next). The pill counts down. */
  function checkSleep() {
    var z = state.sleep;
    if (!z || z.mode <= 0) return;
    var el = document.getElementById("lp-sleep-left");
    if (el) el.textContent = sleepLabel();
    if (Date.now() >= z.until) { state.sleep = null; if (state.playing) pause(); else render(); }
  }

  /* The line being read, with the one before and the one after dimmed either side, so a
     line that sounds wrong is sitting there in text the moment it is heard. Each line
     carries its speaker's portrait and name (reader/speakers.js); the narrator gets the
     microphone. Spoken lines are quoted, narration is not. */
  function lineHtml(seg, cls) {
    if (!seg) return '<div class="now-line ' + cls + ' now-empty"></div>';
    var S = window.TMBSpeakers, narr = seg.speaker === "narrator";
    var who = S ? S.chip(seg.speaker, seg.speakerName, false) : '<span class="spk-name">' + esc(seg.speakerName || "") + "</span>";
    var text = narr ? esc(seg.displayText) : "\u201C" + esc(seg.displayText) + "\u201D";
    return '<div class="now-line ' + cls + (narr ? " now-narr" : "") + '">' + who +
      (cls === "now-cur" && seg._have === false ? '<span class="listen-missing">(no audio yet)</span>' : "") +
      '<p class="now-text">' + text + "</p></div>";
  }

  function nowHtml() {
    var segs = segments(), i = state.index;
    return lineHtml(segs[i - 1], "now-prev") + lineHtml(segs[i], "now-cur") + lineHtml(segs[i + 1], "now-next");
  }

  /* ---- the PocketFM-style player (Joshua, 2026-11-07) -------------------------
     Picture on top with the line being read in a caption box, the chapter title, a row
     of round pills (chapters, download, speed, sleep), a tall scrubber with the time in a
     bubble, then previous / back / play / forward / next. Chapters and downloads open in
     a sheet; the technical choices (which reading, live layers) are under the menu. */
  var SPEEDS = [1, 1.1, 1.25, 1.5, 1.75, 2, 0.75, 0.9];
  var SLEEPS = [0, -1, 15, 30, 60];          // minutes; -1 = end of this chapter

  function coverFor(n) { return n <= 4 ? "./assets/covers/lab.jpg" : "./assets/covers/island.jpg"; }

  var ICON = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.6v14H7zM13.4 5H17v14h-3.6z" fill="currentColor"/></svg>',
    prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h2.2v14H6zM19 5.5v13L9.5 12z" fill="currentColor"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.8 5H18v14h-2.2zM5 5.5v13L14.5 12z" fill="currentColor"/></svg>',
    list: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h11" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>',
    down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19.5h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
    done: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
    speed: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 16a8 8 0 1 1 15 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M12 13l4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"/></svg>',
    more: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5.5" r="1.8" fill="currentColor"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/><circle cx="12" cy="18.5" r="1.8" fill="currentColor"/></svg>'
  };
  function stepIcon(dir, n) {
    var arc = dir < 0
      ? '<path d="M7.5 6.2A8 8 0 1 1 4.2 13" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" fill="none"/><path d="M7.9 2.6l-.6 4 4 .5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
      : '<path d="M16.5 6.2A8 8 0 1 0 19.8 13" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" fill="none"/><path d="M16.1 2.6l.6 4-4 .5" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" fill="none"/>';
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + arc +
      '<text x="12" y="16" text-anchor="middle" font-size="7.6" font-weight="700" fill="currentColor" font-family="system-ui,sans-serif">' + n + '</text></svg>';
  }

  function chapterInfo(n) {
    var O = window.TMBOffline, list = (O && O.chapters()) || [];
    for (var i = 0; i < list.length; i++) if (list[i].number === n) return list[i];
    return null;
  }

  /* SUBTITLES, NOT PARAGRAPHS. A narrated paragraph can run to 400 characters, which no
     caption box can hold, so the line is cut into subtitle-sized pieces (whole sentences
     where it can, about 90 characters at most) and the piece shown follows the audio: the
     line's time is shared out by length, which lands within a word or two. */
  var CAP_MAX = 90;
  function captionChunks(text) {
    var out = [], parts = String(text).match(/[^.!?…]+[.!?…]+["”’]?\s*|[^.!?…]+$/g) || [text];
    var cur = "";
    parts.forEach(function (p) {
      p = p.trim(); if (!p) return;
      while (p.length > CAP_MAX) {               // a long sentence: break at a space
        var cut = p.lastIndexOf(" ", CAP_MAX); if (cut < 40) cut = CAP_MAX;
        if (cur) { out.push(cur); cur = ""; }
        out.push(p.slice(0, cut).trim()); p = p.slice(cut).trim();
      }
      if (cur && (cur + " " + p).length > CAP_MAX) { out.push(cur); cur = p; }
      else cur = cur ? cur + " " + p : p;
    });
    if (cur) out.push(cur);
    return out.length ? out : [String(text)];
  }

  function captionPiece(seg) {
    var chunks = seg._chunks || (seg._chunks = captionChunks(seg.displayText));
    if (chunks.length < 2 || !mixedMode()) return { i: 0, n: chunks.length, text: chunks[0] };
    var at = starts(), i = state.index;
    var a = (at[i] || 0) / 1000, b = at[i + 1] != null ? at[i + 1] / 1000 : chapterTotal();
    var f = b > a ? Math.max(0, Math.min(0.999, (chapterNow() - a) / (b - a))) : 0;
    var total = chunks.reduce(function (s, c) { return s + c.length; }, 0), acc = 0;
    for (var k = 0; k < chunks.length; k++) { acc += chunks[k].length; if (f < acc / total) return { i: k, n: chunks.length, text: chunks[k] }; }
    return { i: chunks.length - 1, n: chunks.length, text: chunks[chunks.length - 1] };
  }

  function captionHtml() {
    var seg = current();
    if (!seg) return "";
    var narr = seg.speaker === "narrator";
    var piece = captionPiece(seg);
    state.capKey = state.index + ":" + piece.i;
    var t = esc(piece.text);
    var text = narr ? t : (piece.i === 0 ? "“" : "") + t + (piece.i === piece.n - 1 ? "”" : "");
    return (narr ? "" : '<span class="lp-cap-who">' + esc(seg.speakerName || "") + '</span>') +
      '<span class="lp-cap-text">' + text + '</span>';
  }

  function dlPillHtml() {
    var O = window.TMBOffline;
    if (!O || !O.available() || !chapterInfo(state.chapter)) return "";
    var st = O.status(state.chapter), icon = ICON.down, label = "", cls = "";
    if (st.state === "done") { icon = ICON.done; cls = " is-done"; }
    else if (st.state === "downloading") { label = (st.total ? Math.floor(100 * st.loaded / st.total) : 0) + "%"; cls = " is-busy"; }
    else if (st.state === "update") { label = "Update"; cls = " is-busy"; }
    else if (st.state === "error") { label = "Retry"; cls = " is-err"; }
    return '<button type="button" class="lp-pill' + cls + '" id="lp-dl" aria-label="Download this chapter">' +
      icon + (label ? '<span>' + label + '</span>' : '') + '</button>';
  }

  function bindDlPill() {
    var dl = document.getElementById("lp-dl");
    if (dl) dl.onclick = function () {
      var O = window.TMBOffline, st = O.status(state.chapter);
      if (st.state === "done") openSheet("lp-sheet-list"); else if (st.state !== "downloading") O.download(state.chapter);
    };
  }

  function sleepLabel() {
    var z = state.sleep;
    if (!z || !z.mode) return "";
    if (z.mode === -1) return "End";
    var left = Math.max(0, Math.round((z.until - Date.now()) / 1000));
    return clock(left);
  }

  function render() {
    var body = document.getElementById("listen-body");
    if (!body) return;
    var m = state.manifest;
    if (!m) return;
    var info = chapterInfo(state.chapter);
    var stalled = state.stalled ? '<p class="listen-warn">' + esc(state.stalled) + '</p>' : "";
    var warn = state.missing
      ? '<p class="listen-warn">' + state.missing + ' clip(s) in this chapter have no audio yet; the player skips them.</p>'
      : "";
    var total = chapterTotal();
    body.innerHTML =
      '<div class="lp-wrap">' +
      '<div class="lp-visual" style="background-image:url(\'' + coverFor(state.chapter) + '\')">' +
        '<div class="lp-topbar">' +
          '<button type="button" class="lp-icon" id="lp-open-list" aria-label="Chapters">' + ICON.list + '</button>' +
          '<span class="lp-series">TRADDOMIUM: Micro Battle!</span>' +
          '<button type="button" class="lp-icon" id="lp-open-more" aria-label="More options">' + ICON.more + '</button>' +
        '</div>' +
        '<div class="lp-caption" id="listen-now" aria-live="polite">' + captionHtml() + '</div>' +
      '</div>' +
      '<div class="lp-panel">' +
        '<p class="lp-title">Chapter ' + m.chapter + '. ' + esc((info && info.title) || (m.title || "").replace(/^Chapter \d+:\s*/, "")) + '</p>' +
        stalled + warn +
        '<p class="listen-loading" id="listen-loading"' + (state.download ? "" : " hidden") + '>' + esc(loadingText()) + '</p>' +
        '<div class="lp-pills">' +
          '<button type="button" class="lp-pill" id="lp-pill-list" aria-label="Chapters">' + ICON.list + '<span>' + state.chapters.length + '</span></button>' +
          dlPillHtml() +
          '<button type="button" class="lp-pill" id="lp-speed" aria-label="Playback speed">' + ICON.speed + '<span>' + state.rate.toFixed(2) + 'x</span></button>' +
          '<button type="button" class="lp-pill' + (state.sleep && state.sleep.mode ? " is-on" : "") + '" id="lp-sleep" aria-label="Sleep timer">' + ICON.moon +
            '<span id="lp-sleep-left">' + sleepLabel() + '</span></button>' +
        '</div>' +
        '<div class="lp-scrub" id="lp-scrub" role="slider" aria-label="Position in the chapter" tabindex="0">' +
          '<div class="lp-fill" id="lp-fill"></div>' +
          '<div class="lp-head" id="lp-head"><span class="lp-bubble" id="lp-bubble">0:00</span></div>' +
        '</div>' +
        '<div class="lp-times"><span id="lp-total">' + clock(total) + '</span></div>' +
        '<div class="lp-controls" role="group" aria-label="Playback">' +
          '<button type="button" class="lp-btn" id="listen-prev-ch" aria-label="Previous chapter"' + (chapterStep(-1) == null ? " disabled" : "") + '>' + ICON.prev + '</button>' +
          '<button type="button" class="lp-btn lp-step" id="listen-back" aria-label="Back ' + stepSize(-1) + ' seconds">' + stepIcon(-1, stepSize(-1)) + '</button>' +
          '<button type="button" class="lp-play" id="listen-toggle" aria-label="' + (state.playing ? "Pause" : "Play") + '">' + (state.playing ? ICON.pause : ICON.play) + '</button>' +
          '<button type="button" class="lp-btn lp-step" id="listen-fwd" aria-label="Forward ' + stepSize(1) + ' seconds">' + stepIcon(1, stepSize(1)) + '</button>' +
          '<button type="button" class="lp-btn" id="listen-next-ch" aria-label="Next chapter"' + (chapterStep(1) == null ? " disabled" : "") + '>' + ICON.next + '</button>' +
        '</div>' +
        '<p class="lp-pos" id="listen-position"></p>' +
        '<details class="lp-script" id="lp-script-box"' + (state.scriptOpen ? " open" : "") + '><summary>Script</summary>' +
          '<div class="listen-now" id="lp-script">' + nowHtml() + '</div></details>' +
      '</div></div>';

    var more = document.getElementById("lp-more-body");
    if (more) { more.innerHTML = sourceControlHtml() + layerControlsHtml() + '<p class="lp-tech">' + esc(sourceLine(m, segments().length)) + '</p>'; bindSourceControl(); bindLayerControls(); }

    document.getElementById("listen-toggle").onclick = function () { state.playing ? pause() : play(); };
    document.getElementById("listen-back").onclick = function () { stepTap(-1); };
    document.getElementById("listen-fwd").onclick = function () { stepTap(1); };
    document.getElementById("listen-prev-ch").onclick = function () { changeChapter(-1); };
    document.getElementById("listen-next-ch").onclick = function () { changeChapter(1); };
    document.getElementById("lp-open-list").onclick = document.getElementById("lp-pill-list").onclick = function () { openSheet("lp-sheet-list"); };
    document.getElementById("lp-open-more").onclick = function () { openSheet("lp-sheet-more"); };
    document.getElementById("lp-speed").onclick = function () {
      setRate(SPEEDS[(SPEEDS.indexOf(state.rate) + 1) % SPEEDS.length] || 1);
    };
    document.getElementById("lp-sleep").onclick = function () {
      var cur = state.sleep ? state.sleep.mode : 0, nx = SLEEPS[(SLEEPS.indexOf(cur) + 1) % SLEEPS.length];
      state.sleep = nx ? { mode: nx, until: nx > 0 ? Date.now() + nx * 60000 : 0 } : null;
      render();
    };
    bindDlPill();
    var box = document.getElementById("lp-script-box");
    box.ontoggle = function () { state.scriptOpen = box.open; };
    bindScrub();
    renderProgress();
    startTicking();
  }

  /* The tall scrubber: drag (or tap) to move; the bubble shows where you will land, and
     letting go seeks. Keyboard: arrow keys step 15 s. */
  function bindScrub() {
    var bar = document.getElementById("lp-scrub");
    if (!bar) return;
    function frac(e) {
      var r = bar.getBoundingClientRect();
      return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    }
    bar.onpointerdown = function (e) {
      state.dragging = true;
      try { bar.setPointerCapture(e.pointerId); } catch (x) {}
      drawScrub(frac(e));
    };
    bar.onpointermove = function (e) { if (state.dragging) drawScrub(frac(e)); };
    bar.onpointerup = bar.onpointercancel = function (e) {
      if (!state.dragging) return;
      state.dragging = false;
      seekChapter(frac(e) * chapterTotal());
    };
    bar.onkeydown = function (e) {
      if (e.key === "ArrowRight") { skip(15); e.preventDefault(); }
      if (e.key === "ArrowLeft") { skip(-15); e.preventDefault(); }
    };
  }

  function drawScrub(f) {
    var fill = document.getElementById("lp-fill"), head = document.getElementById("lp-head"), bub = document.getElementById("lp-bubble");
    if (fill) fill.style.width = (f * 100) + "%";
    if (head) head.style.left = (f * 100) + "%";
    if (bub) {
      bub.textContent = clock(f * chapterTotal());
      bub.style.transform = "translateX(" + (-f * 100) + "%)";   // stays inside the bar at both ends
    }
    var bar = document.getElementById("lp-scrub");
    if (bar) bar.setAttribute("aria-valuetext", clock(f * chapterTotal()) + " of " + clock(chapterTotal()));
  }

  function openSheet(id) {
    var sh = document.getElementById(id);
    if (!sh) return;
    sh.classList.add("open");
    sh.setAttribute("aria-hidden", "false");
    if (id === "lp-sheet-list") renderDownloads();
  }
  function closeSheets() {
    Array.prototype.forEach.call(document.querySelectorAll(".lp-sheet"), function (sh) {
      sh.classList.remove("open"); sh.setAttribute("aria-hidden", "true");
    });
  }

  /* ---- chapters and downloads (reader/offline.js) ---------------------------
     A PocketFM-style chapter list: each chapter's state on this device, a button to
     download / update / retry / remove it, how many chapters to fetch ahead, and a short
     log so a failed download says what went wrong. */
  function downloadsHtml() {
    var O = window.TMBOffline;
    if (!O || !O.available()) return "";
    var list = O.chapters(), done = 0, bytes = 0;
    var rows = list.map(function (c) {
      var st = O.status(c.number), a = c.audio, label, btn;
      if (st.state === "done") { done += 1; bytes += a.bytes || 0; }
      if (st.state === "done") { label = "Downloaded"; btn = ["remove", "Remove"]; }
      else if (st.state === "downloading") {
        var pct = st.total ? Math.floor(100 * st.loaded / st.total) : 0;
        label = "Downloading " + pct + "%"; btn = ["cancel", "Cancel"];
      }
      else if (st.state === "queued") { label = "Waiting"; btn = ["cancel", "Cancel"]; }
      else if (st.state === "update") { label = "Update available"; btn = ["download", "Update"]; }
      else if (st.state === "error") { label = "Failed"; btn = ["download", "Retry"]; }
      else { label = ""; btn = ["download", "Download"]; }
      return '<li class="dl-row dl-' + st.state + (c.number === state.chapter ? " dl-current" : "") + '">' +
        '<button type="button" class="dl-open" data-ch="' + c.number + '">' +
          '<span class="dl-num">' + c.number + '</span> ' + esc(c.title) + '</button>' +
        '<span class="dl-meta">' + O.mb(a.bytes || 0) + ' MB · ' + clock(a.seconds) +
          (label ? ' · <span class="dl-state">' + esc(label) + '</span>' : '') + '</span>' +
        '<button type="button" class="dl-act" data-act="' + btn[0] + '" data-ch="' + c.number + '">' + btn[1] + '</button>' +
        (st.state === "error" && st.error ? '<p class="dl-err">' + esc(st.error) + '</p>' : '') +
        '</li>';
    }).join("");
    var k = O.ahead();
    var log = O.log().slice(0, 12).map(function (e) {
      return '<li class="dl-log-' + e.level + '">' + esc(e.at) + ' · ' + esc(e.msg) + '</li>';
    }).join("");
    return '<h2 class="dl-head">Chapters</h2>' +
      '<div class="dl-settings">' +
        '<label>Download ahead <select id="dl-ahead">' +
          [0, 1, 2, 3].map(function (n) {
            return '<option value="' + n + '"' + (n === k ? " selected" : "") + '>' +
              (n ? "next " + n + " chapter" + (n > 1 ? "s" : "") : "off") + '</option>';
          }).join("") + '</select></label>' +
        '<span class="dl-sum">' + done + ' downloaded · ' + O.mb(bytes) + ' MB on this device</span>' +
        '<button type="button" id="dl-all">Download all</button>' +
        '<button type="button" id="dl-clear">Remove all</button>' +
      '</div>' +
      '<ul class="dl-list">' + rows + '</ul>' +
      (log ? '<details class="dl-log"><summary>Download log</summary><ul>' + log + '</ul></details>' : '');
  }

  var dlPending = false;
  function renderDownloads() {
    if (dlPending) return;
    dlPending = true;
    (window.requestAnimationFrame || setTimeout)(function () {
      dlPending = false;
      var box = document.getElementById("listen-downloads");
      if (!box) return;
      var open = box.querySelector("details.dl-log") && box.querySelector("details.dl-log").open;
      box.innerHTML = downloadsHtml();
      if (open && box.querySelector("details.dl-log")) box.querySelector("details.dl-log").open = true;
      var O = window.TMBOffline;
      var ahead = document.getElementById("dl-ahead");
      if (ahead) ahead.onchange = function () { O.setAhead(parseInt(ahead.value, 10)); };
      var all = document.getElementById("dl-all");
      if (all) all.onclick = function () { O.downloadAll(); };
      var clear = document.getElementById("dl-clear");
      if (clear) clear.onclick = function () {
        if (window.confirm("Remove every downloaded chapter from this device?")) O.removeAll();
      };
      Array.prototype.forEach.call(box.querySelectorAll(".dl-act"), function (b) {
        b.onclick = function () {
          var n = parseInt(b.getAttribute("data-ch"), 10), act = b.getAttribute("data-act");
          if (act === "download") O.download(n); else if (act === "cancel") O.cancel(n); else O.remove(n);
        };
      });
      Array.prototype.forEach.call(box.querySelectorAll(".dl-open"), function (b) {
        b.onclick = function () {
          var n = parseInt(b.getAttribute("data-ch"), 10);
          var pick = document.getElementById("listen-chapter");
          if (pick) pick.value = String(n);
          closeSheets();
          var wasPlaying = state.playing;
          loadChapter(n).then(function () { if (wasPlaying && state.manifest) play(); });
        };
      });
    });
  }

  // ---- public entry --------------------------------------------------------
  window.TMBPlayer = {
    mount: function (view, manifestData) {
      var chapters = ((manifestData && manifestData.chapters) || [])
        .slice().sort(function (a, b) { return a.number - b.number; });
      state.chapters = chapters.map(function (c) { return c.number; });
      view.innerHTML =
        '<section class="listen lp">' +
        '<select id="listen-chapter" hidden aria-hidden="true">' +
        chapters.map(function (c) { return '<option value="' + c.number + '">' + c.number + '</option>'; }).join("") +
        '</select>' +
        '<div id="listen-body"><p class="state state-loading">Loading audio…</p></div>' +
        '<div class="lp-sheet" id="lp-sheet-list" aria-hidden="true"><div class="lp-scrim" data-close></div>' +
          '<div class="lp-sheet-panel" role="dialog" aria-label="Chapters"><div class="lp-grab" data-close></div>' +
          '<div id="listen-downloads" class="listen-downloads"></div></div></div>' +
        '<div class="lp-sheet" id="lp-sheet-more" aria-hidden="true"><div class="lp-scrim" data-close></div>' +
          '<div class="lp-sheet-panel" role="dialog" aria-label="More options"><div class="lp-grab" data-close></div>' +
          '<h2 class="dl-head">Playback</h2><div id="lp-more-body"></div>' +
          '<p class="lp-tech">Plays existing audio only; this page holds no ElevenLabs key.</p></div></div>' +
        '</section>';
      Array.prototype.forEach.call(view.querySelectorAll("[data-close]"), function (el) { el.onclick = closeSheets; });
      if (window.TMBOffline) {
        if (!state.dlBound) { window.TMBOffline.onChange(function () {
          renderDownloads();
          var p = document.getElementById("lp-dl");
          if (p) { p.outerHTML = dlPillHtml(); bindDlPill(); }
        }); state.dlBound = true; }
        renderDownloads();
      }
      var pick = document.getElementById("listen-chapter");
      pick.onchange = function () { loadChapter(parseInt(pick.value, 10)); };
      if (chapters.length) loadChapter(chapters[0].number);
    }
  };
})();
