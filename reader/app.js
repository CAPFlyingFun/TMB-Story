/* TMB reader — vanilla JS, no build step.
   Routes: #overview, #outline/<part>, #story, #story/<NNNN>,
           #rules/<key>, #index, #canon/<decisions>.
   Fetches Markdown relative to the page; caches in memory. */
(function () {
  "use strict";

  var view = document.getElementById("view");
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab[data-tab]"));
  var cache = {};           // path -> Promise<string>
  var manifest = null;
  var LAST_READ_KEY = "tmb.reader.lastChapter";

  // ------------------------------------------------------------------
  // Utilities
  // ------------------------------------------------------------------

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function pad4(n) {
    var s = String(n);
    while (s.length < 4) s = "0" + s;
    return s;
  }

  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* private mode etc. */ }
  }

  function fetchText(path) {
    if (!cache[path]) {
      cache[path] = fetch("./" + path, { cache: "no-cache" }).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status + " for " + path);
        return res.text();
      }).catch(function (err) {
        delete cache[path];
        throw err;
      });
    }
    return cache[path];
  }

  function loadManifest() {
    if (manifest) return Promise.resolve(manifest);
    return fetch("./reader/manifest.json", { cache: "no-cache" }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status + " for reader/manifest.json");
      return res.json();
    }).then(function (m) {
      manifest = m;
      return m;
    });
  }

  function setLoading(text) {
    view.innerHTML = '<p class="state state-loading">' + esc(text || "Loading…") + "</p>";
  }

  function errorBlock(err, path) {
    var msg = err && err.message ? err.message : String(err);
    return '<div class="state state-error">Could not load ' +
      (path ? "<code>" + esc(path) + "</code>" : "this section") +
      ". " + esc(msg) + "</div>";
  }

  function setActiveTab(name) {
    tabs.forEach(function (t) {
      t.classList.toggle("active", t.getAttribute("data-tab") === name);
    });
  }

  // ------------------------------------------------------------------
  // Markdown
  // ------------------------------------------------------------------

  function renderMd(text) {
    if (!window.marked) return "<pre>" + esc(text) + "</pre>";
    var html;
    try {
      html = window.marked.parse(text, { gfm: true, breaks: false });
    } catch (e) {
      return "<pre>" + esc(text) + "</pre>";
    }
    var box = document.createElement("div");
    box.className = "md";
    box.innerHTML = html;
    // Tables scroll inside their own wrapper.
    Array.prototype.forEach.call(box.querySelectorAll("table"), function (table) {
      var wrap = document.createElement("div");
      wrap.className = "table-wrap";
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    });
    // Links to repository Markdown become in-app routes where we have one.
    Array.prototype.forEach.call(box.querySelectorAll("a[href]"), function (a) {
      var href = a.getAttribute("href") || "";
      if (/^(https?:)?\/\//.test(href)) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener");
        return;
      }
      var route = routeForPath(href);
      if (route) a.setAttribute("href", route);
    });
    return box.outerHTML;
  }

  function routeForPath(href) {
    var clean = href.replace(/^(\.\/|\/)+/, "").replace(/^(\.\.\/)+/, "").split("#")[0];
    var m;
    if ((m = clean.match(/^story-rules\/([A-Z_]+)\.md$/))) {
      if (m[1] === "STORY_OVERVIEW") return "#overview";
      if (m[1] === "CHAPTER_INDEX") return "#index";
      return "#rules/" + m[1].toLowerCase();
    }
    if (clean === "architecture/DECISIONS.md") return "#canon/decisions";
    if (clean === "architecture/SERIES_ARCHITECTURE.md") return "#canon/architecture";
    if ((m = clean.match(/^chapters\/movement-\d+\/chapter-(\d{4})\.md$/))) return "#story/" + m[1];
    if ((m = clean.match(/^outline\/movement-(\d+)\//))) return "#outline/" + parseInt(m[1], 10);
    return null;
  }

  // Split YAML frontmatter from a chapter file.
  function splitFrontmatter(text) {
    if (text.slice(0, 3) !== "---") return { fm: "", body: text };
    var lines = text.split("\n");
    if (lines[0].trim() !== "---") return { fm: "", body: text };
    for (var i = 1; i < lines.length; i++) {
      if (lines[i].trim() === "---") {
        return { fm: lines.slice(1, i).join("\n"), body: lines.slice(i + 1).join("\n") };
      }
    }
    return { fm: "", body: text };
  }

  // Tiny YAML-subset reader for the details panel: top-level `key: value`,
  // one nested level, inline [a, b] and "- item" lists, "# comments".
  function parseFrontmatter(fm) {
    var out = [];
    var lines = fm.split("\n");
    var current = null;
    function stripComment(s) {
      var q = null, r = "";
      for (var i = 0; i < s.length; i++) {
        var c = s[i];
        if (q) { r += c; if (c === q) q = null; }
        else if (c === '"' || c === "'") { q = c; r += c; }
        else if (c === "#" && (i === 0 || /\s/.test(s[i - 1]))) break;
        else r += c;
      }
      return r.replace(/\s+$/, "");
    }
    function scalar(s) {
      s = s.trim();
      if (!s) return "";
      if (s.length >= 2 && (s[0] === '"' || s[0] === "'") && s[s.length - 1] === s[0]) return s.slice(1, -1);
      if (s[0] === "[" && s[s.length - 1] === "]") {
        var inner = s.slice(1, -1).trim();
        if (!inner) return [];
        return inner.split(/,(?=(?:[^"']*["'][^"']*["'])*[^"']*$)/).map(function (x) { return scalar(x); });
      }
      return s;
    }
    lines.forEach(function (raw) {
      var line = stripComment(raw);
      if (!line.trim()) return;
      var indent = line.match(/^ */)[0].length;
      var t = line.trim();
      var m = t.match(/^([A-Za-z0-9_\-\.]+)\s*:\s*(.*)$/);
      if (indent === 0 && m) {
        current = { key: m[1], value: m[2] === "" ? null : scalar(m[2]), children: [] };
        out.push(current);
      } else if (indent > 0 && current) {
        if (t.indexOf("- ") === 0) {
          // "- item" belongs to the nearest open key: a nested one if present, else the top-level one.
          var target = current.children.length ? current.children[current.children.length - 1] : current;
          if (!Array.isArray(target.value)) target.value = [];
          target.value.push(scalar(t.slice(2)));
        } else if (m) {
          current.children.push({ key: m[1], value: m[2] === "" ? [] : scalar(m[2]) });
        }
      }
    });
    return out;
  }

  function fmValueHtml(v) {
    if (v == null || v === "") return '<span class="sub">—</span>';
    if (Array.isArray(v)) return v.length ? esc(v.join(", ")) : '<span class="sub">—</span>';
    return esc(v);
  }

  function frontmatterHtml(fm) {
    var entries = parseFrontmatter(fm);
    if (!entries.length) return '<p class="state">No frontmatter.</p>';
    var html = '<dl class="fm">';
    entries.forEach(function (e) {
      if (e.children.length) {
        html += "<dt>" + esc(e.key) + "</dt><dd>";
        html += e.children.map(function (c) {
          return '<span class="sub">' + esc(c.key) + ":</span> " + fmValueHtml(c.value);
        }).join("<br>");
        html += "</dd>";
      } else {
        html += "<dt>" + esc(e.key) + "</dt><dd>" + fmValueHtml(e.value) + "</dd>";
      }
    });
    return html + "</dl>";
  }

  // ------------------------------------------------------------------
  // Badges
  // ------------------------------------------------------------------

  function reviewBadge(status) {
    var s = String(status || "draft");
    var cls = s === "approved" ? "badge-sage" : s === "in-review" ? "badge-gold" : "";
    return '<span class="badge ' + cls + '">' + esc(s) + "</span>";
  }

  function audioBadge(status) {
    var s = String(status || "not-started");
    var cls = s === "published" ? "badge-sky" : s === "recorded" ? "badge-violet" : "";
    return '<span class="badge ' + cls + '" title="Audio">audio: ' + esc(s) + "</span>";
  }

  function fmtWords(n) {
    n = Number(n) || 0;
    return n.toLocaleString ? n.toLocaleString("en-US") : String(n);
  }

  // ------------------------------------------------------------------
  // Views
  // ------------------------------------------------------------------

  function showMarkdownFile(path, opts) {
    opts = opts || {};
    setLoading();
    return fetchText(path).then(function (text) {
      if (opts.stripFrontmatter) text = splitFrontmatter(text).body;
      view.innerHTML = (opts.before || "") + renderMd(text);
    }).catch(function (err) {
      view.innerHTML = (opts.before || "") + errorBlock(err, path);
    });
  }

  function viewOverview() {
    setActiveTab("overview");
    return showMarkdownFile("story-rules/STORY_OVERVIEW.md");
  }

  function pillsHtml(items, activeKey) {
    return '<div class="pills">' + items.map(function (it) {
      return '<a class="pill' + (it.key === activeKey ? " active" : "") + '" href="' + esc(it.href) + '">' + esc(it.label) + "</a>";
    }).join("") + "</div>";
  }

  function viewOutline(partArg) {
    setActiveTab("outline");
    setLoading();
    return loadManifest().then(function (m) {
      var parts = m.movements || [];
      if (!parts.length) {
        view.innerHTML = '<div class="empty"><h2>No outline yet</h2><p>Movement folders will appear here once <code>outline/movement-NN/</code> exists.</p></div>';
        return;
      }
      var num = parseInt(partArg, 10);
      var part = parts.filter(function (p) { return p.number === num; })[0] || parts[0];
      var pills = pillsHtml(parts.map(function (p) {
        return { key: p.number, label: "Part " + p.number, href: "#outline/" + p.number };
      }), part.number);

      var files = [];
      if (part.overview) files.push({ path: part.overview, title: "Part " + part.number + " overview" });
      else files.push({ path: null, title: "Part " + part.number + " overview", missing: part.dir + "/overview.md" });
      (part.miniArcs || []).forEach(function (p, i) {
        var mm = p.match(/mini-arc-(\d+)\.md$/);
        files.push({ path: p, title: "Mini-arc " + (mm ? parseInt(mm[1], 10) : i + 1) });
      });

      var cards = files.map(function (f, i) {
        return '<section class="card" id="ol-card-' + i + '"><div class="card-head"><h2 class="card-title">' + esc(f.title) +
          '</h2><span class="card-meta">' + esc(f.path || f.missing || "") + '</span></div>' +
          '<div class="card-body"><p class="state">Loading…</p></div></section>';
      }).join("");

      var note = (part.miniArcs || []).length ? "" :
        '<p class="state">No mini-arc files yet for this Part. They appear here as <code>mini-arc-NN.md</code> files are added.</p>';

      view.innerHTML = pills + cards + note;

      files.forEach(function (f, i) {
        var body = document.querySelector("#ol-card-" + i + " .card-body");
        if (!body) return;
        if (!f.path) {
          body.innerHTML = '<p class="state">Not written yet.</p>';
          return;
        }
        fetchText(f.path).then(function (text) {
          body.innerHTML = renderMd(text);
        }).catch(function (err) {
          if (/HTTP 404/.test(err.message)) body.innerHTML = '<p class="state">Not written yet.</p>';
          else body.innerHTML = errorBlock(err, f.path);
        });
      });
    }).catch(function (err) {
      view.innerHTML = errorBlock(err, "reader/manifest.json");
    });
  }

  function chapterRow(c, lastRead) {
    var isLast = lastRead && pad4(c.number) === lastRead;
    return '<li><a class="chapter-row' + (isLast ? " last-read" : "") + '" href="#story/' + pad4(c.number) + '">' +
      '<span class="ch-num">' + pad4(c.number) + "</span>" +
      '<span class="ch-title">' + (c.title ? esc(c.title) : '<span class="untitled">Untitled</span>') + "</span>" +
      '<span class="ch-meta">' +
        (c.pov ? "<span>" + esc(c.pov) + "</span>" : "") +
        "<span>" + fmtWords(c.word_count) + " words</span>" +
        reviewBadge(c.review_status) + audioBadge(c.audio_status) +
      "</span></a></li>";
  }

  function viewStoryList() {
    setActiveTab("story");
    setLoading();
    return loadManifest().then(function (m) {
      var chapters = (m.chapters || []).slice().sort(function (a, b) { return a.number - b.number; });
      if (!chapters.length) {
        view.innerHTML = '<div class="empty"><h2>No chapters yet</h2>' +
          '<p>The story has not been drafted. Chapters will appear here as <code>chapters/movement-NN/chapter-NNNN.md</code> files are written and the manifest is rebuilt.</p>' +
          '<p>Until then, the <a href="#overview">Overview</a> and <a href="#outline/1">Outline</a> are where the story lives.</p></div>';
        return;
      }
      var lastRead = storageGet(LAST_READ_KEY);
      var groups = {};
      var order = [];
      chapters.forEach(function (c) {
        var k = c.movement || 0;
        if (!groups[k]) { groups[k] = []; order.push(k); }
        groups[k].push(c);
      });
      order.sort(function (a, b) { return a - b; });
      var html = "";
      if (lastRead) {
        var lr = chapters.filter(function (c) { return pad4(c.number) === lastRead; })[0];
        if (lr) html += '<p class="state">Last read: <a href="#story/' + lastRead + '">Chapter ' + lastRead + (lr.title ? " — " + esc(lr.title) : "") + "</a></p>";
      }
      order.forEach(function (k) {
        html += '<section class="part-group"><h2>Movement ' + esc(k) + "</h2><ul class=\"chapter-list\">" +
          groups[k].map(function (c) { return chapterRow(c, lastRead); }).join("") + "</ul></section>";
      });
      view.innerHTML = html;
    }).catch(function (err) {
      view.innerHTML = errorBlock(err, "reader/manifest.json");
    });
  }

  function navBtn(label, chapter, cls) {
    if (!chapter) return '<span class="nav-btn ' + cls + '" aria-disabled="true">' + esc(label) + "</span>";
    return '<a class="nav-btn ' + cls + '" href="#story/' + pad4(chapter.number) + '">' + esc(label) + "</a>";
  }

  function viewChapter(numArg) {
    setActiveTab("story");
    setLoading();
    return loadManifest().then(function (m) {
      var chapters = (m.chapters || []).slice().sort(function (a, b) { return a.number - b.number; });
      var num = parseInt(numArg, 10);
      var idx = -1;
      chapters.forEach(function (c, i) { if (c.number === num) idx = i; });
      if (idx < 0) {
        view.innerHTML = '<div class="empty"><h2>Chapter ' + esc(numArg) + " not found</h2>" +
          '<p>It is not in the manifest. <a href="#story">Back to the chapter list</a>.</p></div>';
        return;
      }
      var c = chapters[idx];
      var prev = idx > 0 ? chapters[idx - 1] : null;
      var next = idx < chapters.length - 1 ? chapters[idx + 1] : null;

      var navTop = '<div class="reader-nav">' + navBtn("← Prev", prev, "prev") +
        '<a class="nav-btn back" href="#story">All chapters</a>' + navBtn("Next →", next, "next") + "</div>";
      var navBottom = '<div class="reader-nav bottom">' + navBtn("← Previous chapter", prev, "prev") + navBtn("Next chapter →", next, "next") + "</div>";

      return fetchText(c.path).then(function (text) {
        var parts = splitFrontmatter(text);
        var head = '<header class="reader-head"><p class="reader-kicker">Movement ' + esc(c.movement) + " · Chapter " + pad4(c.number) + "</p>" +
          '<h1 class="reader-title">' + (c.title ? esc(c.title) : "Untitled") + "</h1>" +
          '<div class="reader-meta">' + (c.pov ? "<span>POV: " + esc(c.pov) + "</span>" : "") +
          "<span>" + fmtWords(c.word_count) + " words</span>" + reviewBadge(c.review_status) + audioBadge(c.audio_status) + "</div></header>";
        var details = '<details class="details"><summary>Chapter details</summary><div class="details-body">' +
          frontmatterHtml(parts.fm) + "</div></details>";
        var prose = renderMd(parts.body).replace('class="md"', 'class="md prose"');
        view.innerHTML = '<article class="reader">' + navTop + head + details + prose + navBottom + "</article>";
        storageSet(LAST_READ_KEY, pad4(c.number));   // remembered only once the chapter actually loaded
        window.scrollTo(0, 0);
      }).catch(function (err) {
        view.innerHTML = '<div class="reader">' + navTop + errorBlock(err, c.path) + "</div>";
      });
    }).catch(function (err) {
      view.innerHTML = errorBlock(err, "reader/manifest.json");
    });
  }

  var BIBLE_TABS = ["CHARACTERS", "CREATURES", "LOCATIONS", "TECHNOLOGY", "MYSTERIES", "TIMELINE", "CONTINUITY_LOG"];

  function viewRules(keyArg) {
    setActiveTab("rules");
    var key = String(keyArg || "characters").toLowerCase();
    var known = BIBLE_TABS.map(function (k) { return k.toLowerCase(); });
    if (known.indexOf(key) < 0) key = known[0];
    var pills = pillsHtml(BIBLE_TABS.map(function (k) {
      return { key: k.toLowerCase(), label: k.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, function (ch) { return ch.toUpperCase(); }), href: "#bible/" + k.toLowerCase() };
    }), key);
    return showMarkdownFile("story-rules/" + key.toUpperCase() + ".md", { before: pills });
  }

  function viewIndex() {
    setActiveTab("index");
    return showMarkdownFile("story-rules/CHAPTER_INDEX.md");
  }

  function viewCanon(subArg) {
    setActiveTab("canon");
    var sub = String(subArg || "architecture").toLowerCase();
    if (sub !== "architecture" && sub !== "decisions") sub = "architecture";
    var pills = pillsHtml([
      { key: "architecture", label: "Architecture", href: "#canon/architecture" },
      { key: "decisions", label: "Decisions", href: "#canon/decisions" }
    ], sub);
    var path = sub === "decisions" ? "architecture/DECISIONS.md" : "architecture/SERIES_ARCHITECTURE.md";
    return showMarkdownFile(path, { before: pills });
  }

  // ------------------------------------------------------------------
  // Router
  // ------------------------------------------------------------------

  function route() {
    var hash = (window.location.hash || "#overview").replace(/^#/, "");
    var segs = hash.split("/");
    var tab = (segs[0] || "overview").toLowerCase();
    var arg = segs.slice(1).join("/");
    if (!/^story\/\d+$/.test(hash)) window.scrollTo(0, 0);
    switch (tab) {
      case "overview": return viewOverview();
      case "outline": return viewOutline(arg || "1");
      case "story": return arg ? viewChapter(arg) : viewStoryList();
      case "rules": return viewRules(arg);
      case "index": return viewIndex();
      case "canon": return viewCanon(arg);
      default:
        window.location.replace("#overview");
        return viewOverview();
    }
  }

  window.addEventListener("hashchange", route);

  loadManifest().then(function (m) {
    var note = document.getElementById("footer-note");
    if (note && m.generated) note.textContent = "Reader · manifest built " + m.generated + " · " + (m.chapters || []).length + " chapter(s)";
  }).catch(function () { /* the views report the error themselves */ });

  route();
})();
