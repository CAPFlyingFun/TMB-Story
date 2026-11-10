/* Script anchors, not chapter timestamps. The player supplies progress within the
   current audio segment, so another reading/speed and backward seeks use the same list. */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TMBStoryShots = api;
}(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  function norm(text) {
    return String(text || '').replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
      .replace(/\s+/g, ' ').trim().toLowerCase();
  }
  function compile(manifest, sheet) {
    var segments = (manifest && manifest.segments) || [];
    return ((sheet && sheet.shots) || []).map(function (shot) {
      var at = shot.at || {}, line = norm(at.line), hits = [];
      if (!line) throw new Error('Story shot needs a line anchor');
      segments.forEach(function (seg, i) {
        if (norm(seg.displayText).indexOf(line) === 0) hits.push(i);
      });
      if (!hits.length) throw new Error('Missing story shot anchor: ' + at.line);
      if (hits.length > 1 && at.nth == null) throw new Error('Ambiguous story shot anchor: ' + at.line);
      var index = hits[at.nth == null ? 0 : at.nth];
      if (index == null) throw new Error('Missing story shot anchor occurrence: ' + at.line);
      var text = norm(segments[index].displayText), offset = 0;
      if (at.phrase != null) {
        offset = text.indexOf(norm(at.phrase));
        if (offset < 0) throw new Error('Missing story shot phrase: ' + at.phrase);
      }
      return { id: shot.id, src: shot.src || null, portraitSrc: shot.portraitSrc || null, alt: shot.alt || '',
        index: index, fraction: text.length ? offset / text.length : 0 };
    }).sort(function (a, b) { return a.index - b.index || a.fraction - b.fraction; });
  }
  function select(cues, index, fraction) {
    var active = null;
    fraction = Math.max(0, Math.min(1, Number(fraction) || 0));
    for (var i = 0; i < cues.length; i++) {
      var cue = cues[i];
      if (cue.index > index || (cue.index === index && cue.fraction > fraction)) break;
      active = cue;
    }
    return active;
  }
  return { compile: compile, select: select };
}));
