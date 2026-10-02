/* THE STORY IN OTHER LANGUAGES (Joshua, 2026-10-02: a friend in Indonesia finds "some
   English words that sound a bit strange when translated into Indonesian ... so I have to
   re-read the entire sentence"; asked how, "Both": a translation made by hand, and the
   phone's own translator for anyone else).

   One script for the reader (index.html) and the Watch mode (visual/): window.TMBLang.

   THE UNIT IS THE AUDIO MANIFEST'S LINE (audio/manifests/chapter-NN.json, `segments`).
   Every paragraph of every chapter is its lines joined in order, dialogue in quotation
   marks -- checked for Chapters 1 to 9 when this was written -- so one translation per line
   serves the reader's paragraphs and the Watch mode's captions alike, and the two can never
   disagree.

   HAND-MADE (lang/<code>/chapter-NN.json): each line keeps the English it was made from.
   A line whose English has since changed is not shown translated -- it shows in English,
   marked -- so a stale translation can never stand in for the story. lang/<code>/GLOSSARY.md
   fixes the story's own words.

   AUTOMATIC: the browser's built-in, on-device Translator (where the browser has one): free,
   private, any language it offers, and machine translation, with the strangeness that
   brings. Where there is none the reader says so and points at the browser's own
   "Translate page". */
(function () {
  var BASE = (document.currentScript && document.currentScript.src) ? new URL(".", document.currentScript.src).href : "./lang/";
  var KEY = "tmb.lang";
  var CURATED = { id: "Bahasa Indonesia" };
  // Offered for the automatic translator; the browser decides which it can actually do.
  var AUTO = [
    ["es", "Español"], ["pt", "Português"], ["fr", "Français"], ["de", "Deutsch"], ["it", "Italiano"],
    ["nl", "Nederlands"], ["pl", "Polski"], ["ru", "Русский"], ["uk", "Українська"], ["tr", "Türkçe"],
    ["ar", "العربية"], ["hi", "हिन्दी"], ["bn", "বাংলা"], ["ms", "Bahasa Melayu"], ["tl", "Filipino"],
    ["vi", "Tiếng Việt"], ["th", "ไทย"], ["ja", "日本語"], ["ko", "한국어"], ["zh", "中文"]
  ];

  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
    return null;
  }
  function get() { return store(KEY) || "en"; }
  function set(code) { store(KEY, code || "en"); }
  function name(code) {
    if (!code || code === "en") return "English";
    if (CURATED[code]) return CURATED[code];
    for (var i = 0; i < AUTO.length; i++) if (AUTO[i][0] === code) return AUTO[i][1];
    return code;
  }
  function isCurated(code) { return !!CURATED[code]; }
  function hasAuto() { return typeof self !== "undefined" && "Translator" in self; }

  var curatedCache = {};
  function loadCurated(code, chapter) {
    var k = code + "/" + chapter;
    if (!curatedCache[k]) {
      var file = BASE + code + "/chapter-" + (chapter < 10 ? "0" : "") + chapter + ".json";
      curatedCache[k] = fetch(file, { cache: "no-cache" }).then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      });
    }
    return curatedCache[k];
  }

  var translators = {};
  // The on-device translator for a language. Needs a tap (user activation) the first time a
  // language's model has to download; after that it is on the phone.
  function autoTranslator(code, onProgress) {
    if (!hasAuto()) return Promise.reject(new Error("no-translator"));
    if (!translators[code]) {
      translators[code] = self.Translator.availability({ sourceLanguage: "en", targetLanguage: code }).then(function (av) {
        if (av === "unavailable") throw new Error("unavailable");
        return self.Translator.create({
          sourceLanguage: "en", targetLanguage: code,
          monitor: function (m) { m.addEventListener("downloadprogress", function (e) { if (onProgress) onProgress(e.loaded); }); }
        });
      });
      translators[code].catch(function () { delete translators[code]; });
    }
    return translators[code];
  }

  /* The lines of a chapter in `code`: resolves to
       { source: "en" | "curated" | "auto", title, text: { [order]: string }, stale: [orders] }
     A line with no translation (or a stale one) is simply absent from `text`. */
  function forSegments(chapter, segments, code, onProgress) {
    if (!code || code === "en") return Promise.resolve({ source: "en", text: {}, stale: [] });
    if (isCurated(code)) {
      return loadCurated(code, chapter).then(function (f) {
        var text = {}, stale = [];
        segments.forEach(function (s) {
          var e = f.segments[String(s.order)];
          if (e && e.en === s.displayText && e[code]) text[s.order] = e[code];
          else stale.push(s.order);
        });
        return { source: "curated", title: f.title, text: text, stale: stale };
      });
    }
    return autoTranslator(code, onProgress).then(function (tr) {
      var text = {}, i = 0;
      function next() {
        if (i >= segments.length) return { source: "auto", text: text, stale: [] };
        var s = segments[i++];
        return tr.translate(s.displayText).then(function (out) { text[s.order] = out; if (onProgress) onProgress(i / segments.length, true); return next(); });
      }
      return next();
    });
  }

  // A chapter's paragraphs from its lines: [{ paragraph, en, tr, missing }], dialogue in
  // quotation marks, exactly as the chapter is written.
  function paragraphs(segments, text) {
    var out = [], cur = null;
    segments.forEach(function (s) {
      if (!cur || cur.paragraph !== s.paragraph) { cur = { paragraph: s.paragraph, en: [], tr: [], missing: 0 }; out.push(cur); }
      var q = s.speaker !== "narrator";
      var en = s.displayText, tr = text[s.order];
      if (tr === undefined) { tr = en; cur.missing++; }
      cur.en.push(q ? '"' + en + '"' : en);
      cur.tr.push(q ? '"' + tr + '"' : tr);
    });
    return out.map(function (p) { return { paragraph: p.paragraph, en: p.en.join(" "), tr: p.tr.join(" "), missing: p.missing }; });
  }

  window.TMBLang = { get: get, set: set, name: name, isCurated: isCurated, hasAuto: hasAuto, curated: CURATED, auto: AUTO,
    forSegments: forSegments, paragraphs: paragraphs, autoTranslator: autoTranslator };
})();
