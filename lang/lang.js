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
  // Translated by hand, in lang/<code>/ (Joshua, 2026-10-02: friends in Indonesia, Brazil,
  // the Philippines and Burundi).
  var CURATED = { id: "Bahasa Indonesia", "pt-BR": "Português (Brasil)", es: "Español", fil: "Filipino", fr: "Français" };
  // Offered for the automatic translator; the browser decides which it can actually do.
  var AUTO = [
    ["de", "Deutsch"], ["it", "Italiano"],
    ["nl", "Nederlands"], ["pl", "Polski"], ["ru", "Русский"], ["uk", "Українська"], ["tr", "Türkçe"],
    ["ar", "العربية"], ["hi", "हिन्दी"], ["bn", "বাংলা"], ["ms", "Bahasa Melayu"], ["sw", "Kiswahili"],
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

  // The few words the reader and the captions say about a translation, in its own language
  // (a reader who needs the story translated needs this translated too).
  var UI = {
    en: { loading: "Loading the translation…", hand: "Translated by hand · tap a paragraph to see the English.",
      handCap: "Translated by hand · tap a caption for the English.",
      stale: function (n) { return n + (n === 1 ? " line has" : " lines have") + " changed since and show in English."; },
      none: "This chapter isn't translated yet, so it shows in English." },
    id: { loading: "Memuat terjemahan…", hand: "Terjemahan buatan tangan · ketuk paragraf untuk melihat bahasa Inggris.",
      handCap: "Terjemahan buatan tangan · ketuk teks untuk bahasa Inggris.",
      stale: function (n) { return n + " baris belum diterjemahkan ulang dan tampil dalam bahasa Inggris."; },
      none: "Terjemahan bab ini belum tersedia, jadi ditampilkan dalam bahasa Inggris." },
    "pt-BR": { loading: "Carregando a tradução…", hand: "Tradução feita à mão · toque num parágrafo para ver o inglês.",
      handCap: "Tradução feita à mão · toque na legenda para ver o inglês.",
      stale: function (n) { return n + (n === 1 ? " linha mudou" : " linhas mudaram") + " desde então e aparece" + (n === 1 ? "" : "m") + " em inglês."; },
      none: "Este capítulo ainda não foi traduzido, então aparece em inglês." },
    es: { loading: "Cargando la traducción…", hand: "Traducido a mano · toca un párrafo para ver el inglés.",
      handCap: "Traducido a mano · toca un subtítulo para ver el inglés.",
      stale: function (n) { return n + (n === 1 ? " línea cambió" : " líneas cambiaron") + " desde entonces y se muestra" + (n === 1 ? "" : "n") + " en inglés."; },
      none: "Este capítulo aún no está traducido, así que se muestra en inglés." },
    fil: { loading: "Nilo-load ang salin…", hand: "Isinalin nang mano-mano · i-tap ang talata para makita ang Ingles.",
      handCap: "Isinalin nang mano-mano · i-tap ang caption para sa Ingles.",
      stale: function (n) { return n + " linya ang nagbago at nasa Ingles muna."; },
      none: "Hindi pa naisasalin ang kabanatang ito, kaya nasa Ingles ito." },
    fr: { loading: "Chargement de la traduction…", hand: "Traduit à la main · touchez un paragraphe pour voir l'anglais.",
      handCap: "Traduit à la main · touchez un sous-titre pour voir l'anglais.",
      stale: function (n) { return n + (n === 1 ? " ligne a changé" : " lignes ont changé") + " depuis et s'affiche" + (n === 1 ? "" : "nt") + " en anglais."; },
      none: "Ce chapitre n'est pas encore traduit, il s'affiche donc en anglais." }
  };
  function ui(code) {
    var out = {}, k;
    for (k in UI.en) out[k] = UI.en[k];
    for (k in (UI[code] || {})) out[k] = UI[code][k];
    return out;
  }
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
        if (!Object.keys(text).length) throw new Error("not-translated"); // a file begun but not yet filled
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

  window.TMBLang = { get: get, set: set, name: name, isCurated: isCurated, hasAuto: hasAuto, curated: CURATED, auto: AUTO, ui: ui,
    forSegments: forSegments, paragraphs: paragraphs, autoTranslator: autoTranslator };
})();
