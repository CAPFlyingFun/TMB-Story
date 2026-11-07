/* TMB offline audio: downloads, background queue, update checks (Joshua, 2026-11-07).
 *
 * Like PocketFM: a chapter's one-file audio can be downloaded and kept on the device,
 * downloads run in the background while another chapter plays, the next chapters are
 * fetched ahead of the listener, and on opening the site the downloaded copies are
 * checked against the current files so a changed chapter is flagged.
 *
 * Storage is the browser's Cache Storage, keyed by the file's URL including its content
 * hash (`?v=<hash>`), so "is my copy current?" is a string comparison. Everything here is
 * a per-device convenience: if Cache Storage is missing or refuses, the player still
 * streams/plays as before. No key, no ElevenLabs request: static files only.
 */
(function () {
  "use strict";

  var CACHE = "tmb-audio-v1";
  var SETTINGS_KEY = "tmb.offline.ahead";
  var ATTEMPTS = 3;            // per download
  var STALL_MS = 20000;        // no data for this long counts as a timeout
  var BACKOFF_MS = [2000, 5000];
  var LOG_MAX = 30;

  var has = !!(window.caches && window.fetch && window.Blob && window.URL && URL.createObjectURL);
  var chapters = [];           // reader manifest chapters that have audio
  var byNum = {};
  var status = {};             // number -> {state, loaded, total, error}
  var queue = [];              // chapter numbers waiting, in order
  var active = null;           // {n, controller} the background download in flight
  var fg = 0;                  // a chapter the listener is waiting on is downloading
  var listeners = [];
  var log = [];
  var changed = [];            // chapters whose downloaded copy is out of date

  function storageGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function storageSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }

  function ahead() {
    var v = parseInt(storageGet(SETTINGS_KEY), 10);
    return isNaN(v) ? 3 : Math.max(0, Math.min(3, v));
  }

  function emit() { listeners.forEach(function (f) { try { f(); } catch (e) {} }); }

  function note(msg, level) {
    var t = new Date();
    log.unshift({ at: t.toLocaleTimeString(), msg: msg, level: level || "info" });
    if (log.length > LOG_MAX) log.length = LOG_MAX;
    emit();
  }

  function url(a) { return "./" + a.audio + "?v=" + (a.hash || a.bytes || 0); }
  function path(a) { return "./" + a.audio; }
  function mb(b) { return (b / 1048576).toFixed(1); }
  function st(n) { return status[n] || (status[n] = { state: "none", loaded: 0, total: 0 }); }

  /* ---- one download, with retries and a stall timeout --------------------- */
  function fetchWithRetry(n, a, onProgress, controller) {
    var started = Date.now(), attempt = 0, lastErr = "";
    var total = a.bytes || 0;
    function once() {
      attempt += 1;
      var ctrl = new AbortController(), timer = null, stalled = false;
      if (controller) controller.current = ctrl;
      function arm() {
        clearTimeout(timer);
        timer = setTimeout(function () { stalled = true; ctrl.abort(); }, STALL_MS);
      }
      arm();
      return fetch(url(a), { signal: ctrl.signal, cache: "no-store" }).then(function (r) {
        if (!r.ok) throw new Error("the server answered HTTP " + r.status);
        var len = parseInt(r.headers.get("Content-Length") || "0", 10);
        if (len) total = len;
        if (!r.body || !r.body.getReader) { return r.blob(); }
        var reader = r.body.getReader(), parts = [], loaded = 0;
        function pump() {
          return reader.read().then(function (x) {
            if (x.done) return new Blob(parts, { type: "audio/mpeg" });
            arm(); parts.push(x.value); loaded += x.value.length;
            onProgress(loaded, total, started);
            return pump();
          });
        }
        return pump();
      }).then(function (blob) {
        clearTimeout(timer);
        if (total && blob.size < total) throw new Error("the file arrived incomplete (" + mb(blob.size) + " of " + mb(total) + " MB)");
        return blob;
      }).catch(function (err) {
        clearTimeout(timer);
        if (!(controller && controller.cancelled)) {
          lastErr = stalled ? "timed out: no data for " + (STALL_MS / 1000) + " s"
                            : (err && err.message) || String(err);
        }
        throw err;
      }).catch(function (err) {
        if (controller && controller.cancelled) { var c = new Error("cancelled"); c.name = "AbortError"; throw c; }
        if (attempt < ATTEMPTS) {
          note("Chapter " + n + ": attempt " + attempt + " failed (" + lastErr + "); retrying.", "warn");
          return new Promise(function (res) { setTimeout(res, BACKOFF_MS[attempt - 1] || 5000); }).then(once);
        }
        var secs = Math.round((Date.now() - started) / 1000);
        var e = new Error("Chapter " + n + " did not download: " + ATTEMPTS + " attempts failed in " +
          secs + " s (last: " + lastErr + "). Please check your internet connection.");
        e.debug = { chapter: n, attempts: ATTEMPTS, seconds: secs, last: lastErr, url: url(a) };
        throw e;
      });
    }
    return once();
  }

  /* Store a downloaded file, dropping any older copy of the same chapter. */
  function store(a, blob) {
    return caches.open(CACHE).then(function (c) {
      return c.keys().then(function (keys) {
        return Promise.all(keys.filter(function (k) {
          var u = new URL(k.url); return u.pathname.endsWith("/" + a.audio) && k.url.indexOf("?v=" + a.hash) < 0;
        }).map(function (k) { return c.delete(k); }));
      }).then(function () {
        return c.put(url(a), new Response(blob, { headers: { "Content-Type": "audio/mpeg",
          "Content-Length": String(blob.size) } }));
      });
    }).catch(function (e) { note("Could not keep this audio on the device (" + e.message + "). It will still play.", "warn"); });
  }

  function cachedBlob(a) {
    if (!has) return Promise.resolve(null);
    return caches.match(url(a)).then(function (r) { return r ? r.blob() : null; }).catch(function () { return null; });
  }

  /* ---- the queue: active chapter first, then background ------------------- */
  function run() {
    if (active || fg || !queue.length) return;
    var n = queue.shift(), a = byNum[n] && byNum[n].audio;
    if (!a) return run();
    var s = st(n);
    var controller = { cancelled: false, current: null };
    active = { n: n, controller: controller };
    s.state = "downloading"; s.loaded = 0; s.total = a.bytes || 0; s.error = null;
    emit();
    fetchWithRetry(n, a, function (loaded, total) {
      s.loaded = loaded; s.total = total; emit();
    }, controller).then(function (blob) {
      return store(a, blob).then(function () {
        s.state = "done"; changed = changed.filter(function (x) { return x !== n; });
        note("Chapter " + n + " downloaded (" + mb(blob.size) + " MB).");
      });
    }, function (err) {
      if (err && err.name === "AbortError") { s.state = queue.indexOf(n) >= 0 ? "queued" : "none"; return; }
      s.state = "error"; s.error = err.message; note(err.message, "error");
    }).then(function () { active = null; emit(); run(); });
  }

  function enqueue(n, front) {
    if (!byNum[n] || !byNum[n].audio) return;
    if (active && active.n === n) return;
    var i = queue.indexOf(n); if (i >= 0) queue.splice(i, 1);
    if (front) queue.unshift(n); else queue.push(n);
    st(n).state = "queued"; emit(); run();
  }

  function cancel(n) {
    var i = queue.indexOf(n); if (i >= 0) queue.splice(i, 1);
    if (active && active.n === n) {
      active.controller.cancelled = true;
      if (active.controller.current) active.controller.current.abort();
    }
    if (st(n).state !== "done") st(n).state = "none";
    emit();
  }

  function remove(n) {
    cancel(n);
    var a = byNum[n] && byNum[n].audio;
    if (!a || !has) return Promise.resolve();
    return caches.open(CACHE).then(function (c) {
      return c.keys().then(function (keys) {
        return Promise.all(keys.filter(function (k) { return new URL(k.url).pathname.endsWith("/" + a.audio); })
          .map(function (k) { return c.delete(k); }));
      });
    }).then(function () { st(n).state = "none"; changed = changed.filter(function (x) { return x !== n; }); emit(); });
  }

  /* ---- what the player calls ---------------------------------------------- */

  /* The active chapter: from the device if it is there, otherwise downloaded now
     (ahead of any background download) and kept. Resolves to a Blob. */
  function getForPlay(n, a, onProgress) {
    return cachedBlob(a).then(function (blob) {
      if (blob) return blob;
      // Pause the background queue for the chapter the listener is waiting on.
      if (active && active.n !== n) {
        var bg = active.n; active.controller.cancelled = true;
        if (active.controller.current) active.controller.current.abort();
        queue.unshift(bg);
      }
      var s = st(n), controller = { cancelled: false, current: null };
      s.state = "downloading"; s.error = null; fg += 1; emit();
      return fetchWithRetry(n, a, function (loaded, total, started) {
        s.loaded = loaded; s.total = total; emit(); onProgress(loaded, total, started);
      }, controller).then(function (blob) {
        if (has) store(a, blob).then(function () { s.state = "done"; emit(); });
        return blob;
      }, function (err) { s.state = "error"; s.error = err.message; note(err.message, "error"); throw err; })
        .then(function (b) { fg -= 1; return b; }, function (e) { fg -= 1; setTimeout(run, 0); throw e; });
    }).then(function (blob) { setTimeout(run, 0); return blob; });
  }

  /* After the active chapter starts: fetch the next `ahead()` chapters that are not
     already on the device. Playing chapter 1 fetches 2 and 3 (and 4); playing 2 then
     only needs the one new chapter at the end of the window. */
  function prefetchAfter(n) {
    var k = ahead(); if (!k || !has) return;
    var nums = chapters.map(function (c) { return c.number; }), i = nums.indexOf(n);
    nums.slice(i + 1, i + 1 + k).forEach(function (m) {
      var a = byNum[m].audio;
      caches.match(url(a)).then(function (r) { if (!r && st(m).state !== "downloading") enqueue(m); });
    });
  }

  /* ---- launch: what is downloaded, and is it current? ---------------------- */
  function scan() {
    if (!has) return Promise.resolve();
    return caches.open(CACHE).then(function (c) { return c.keys(); }).then(function (keys) {
      var urls = keys.map(function (k) { return k.url; });
      changed = [];
      chapters.forEach(function (ch) {
        var a = ch.audio, s = st(ch.number);
        var mine = urls.filter(function (u) { return new URL(u).pathname.endsWith("/" + a.audio); });
        if (!mine.length) { if (s.state === "done") s.state = "none"; return; }
        var current = mine.some(function (u) { return u.indexOf("?v=" + a.hash) >= 0; });
        if (current) s.state = "done";
        else { s.state = "update"; changed.push(ch.number); }
      });
      emit();
    }).catch(function () {});
  }

  function bannerHtml() {
    var list = changed.slice().sort(function (a, b) { return a - b; });
    return '<div class="tmb-update-banner" role="alert"><p><strong>Updated audio</strong> for ' +
      (list.length === 1 ? "Chapter " : "Chapters ") + list.join(", ") +
      '. Your downloaded ' + (list.length === 1 ? "copy is" : "copies are") + ' out of date.</p>' +
      '<div><button type="button" id="tmb-update-now">Update now</button>' +
      '<button type="button" id="tmb-update-later">Later</button></div></div>';
  }

  function showBanner() {
    if (!changed.length || document.getElementById("tmb-update-banner-wrap")) return;
    var wrap = document.createElement("div");
    wrap.id = "tmb-update-banner-wrap";
    wrap.innerHTML = bannerHtml();
    document.body.appendChild(wrap);
    document.getElementById("tmb-update-now").onclick = function () {
      changed.slice().forEach(function (n) { enqueue(n); });
      note("Updating " + changed.length + " downloaded chapter(s).");
      wrap.remove();
    };
    document.getElementById("tmb-update-later").onclick = function () { wrap.remove(); };
  }

  function init(manifestData) {
    chapters = ((manifestData && manifestData.chapters) || [])
      .filter(function (c) { return c.audio && c.audio.audio; })
      .sort(function (a, b) { return a.number - b.number; });
    byNum = {}; chapters.forEach(function (c) { byNum[c.number] = c; });
    return scan().then(showBanner);
  }

  /* Opening the site checks for updated audio, whichever tab is open. */
  function boot() {
    if (!has) return;
    fetch("./reader/manifest.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (m) { if (m) return init(m); })
      .catch(function () {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  window.TMBOffline = {
    available: function () { return has; },
    chapters: function () { return chapters; },
    status: function (n) { return st(n); },
    queueLength: function () { return queue.length + (active ? 1 : 0); },
    log: function () { return log; },
    ahead: ahead,
    setAhead: function (k) { storageSet(SETTINGS_KEY, String(k)); emit(); },
    download: function (n) {
      if (navigator.storage && navigator.storage.persist) { try { navigator.storage.persist(); } catch (e) {} }
      enqueue(n);
    },
    downloadAll: function () { chapters.forEach(function (c) { if (st(c.number).state !== "done") enqueue(c.number); }); },
    cancel: cancel,
    remove: remove,
    removeAll: function () { return Promise.all(chapters.map(function (c) { return remove(c.number); })); },
    getForPlay: getForPlay,
    prefetchAfter: prefetchAfter,
    rescan: scan,
    onChange: function (f) { listeners.push(f); },
    mb: mb
  };
})();
