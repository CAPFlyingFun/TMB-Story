/* Who is speaking: one place for every speaker's portrait and display name, shared by
   the Story tab (app.js, tagSpeakers) and the Listen player (player.js). Decision 0030;
   the portrait-and-name presentation is the approved TMB-Story standard (0031).
   A speaker with no portrait yet gets their initial; the narrator gets a small
   microphone rather than a face, because the narrator is not a person in the scene. */
(function () {
  // Jack and Sarah are their Pixar-style 3D faces (Joshua, 2026-10-07: the toon models replace the old look).
  var FACES = { "jack-bennett": ["jack-3d", "Jack"], "sarah-bennett": ["sarah-3d", "Sarah"], "lena-ortiz": ["lena", "Lena"],
    "security-officer": ["mark", "Mark"], "system": ["system", "TOMBS"] };
  var NAMES = { "narrator": "Narrator", "doctor-mercer": "Dr. Mercer", "aiden": "Aiden", "paul-harlan": "Paul",
    "unit-four": "Unit Four", "resident": "Resident" };
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function name(id, fallback) { var f = FACES[id]; return f ? f[1] : (NAMES[id] || fallback || id || ""); }
  function face(id, fallback) {
    var f = FACES[id];
    if (f) return '<img class="spk-face" src="assets/portraits/' + f[0] + '.png" alt="" loading="lazy">';
    if (id === "narrator") return '<span class="spk-face spk-mic" aria-hidden="true">🎤</span>';
    return '<span class="spk-face spk-initial" aria-hidden="true">' + esc(name(id, fallback).replace(/^Dr\. /, "").charAt(0)) + "</span>";
  }
  function chip(id, fallback, colon) {
    return '<span class="spk' + (id === "narrator" ? " spk-narrator" : "") + '">' + face(id, fallback) +
      '<span class="spk-name">' + esc(name(id, fallback)) + (colon ? ":" : "") + "</span></span>";
  }
  window.TMBSpeakers = { name: name, face: face, chip: chip };
})();
