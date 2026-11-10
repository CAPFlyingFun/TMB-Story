/* Keep an opaque frame underneath a decoded incoming frame for the entire fade.
   The two image nodes are retained when the player rebuilds its controls. */
(function (root) {
  'use strict';
  function decode(img) { return img.decode ? img.decode() : Promise.resolve(); }
  function create(front, next, isCurrent) {
    var desired = null, revision = 0, ready = null, busy = false, displayed = null;
    front.style.opacity = '1'; front.style.zIndex = '0';
    next.style.opacity = '0'; next.style.zIndex = '1';
    async function advance() {
      if (busy || !ready || !isCurrent()) return;
      var frame = ready; ready = null;
      if (frame.src === displayed) return;
      busy = true;
      try {
        if (!displayed) {
          front.src = frame.src; front.alt = frame.alt;
          await decode(front);
          if (!isCurrent()) return;
          if (frame.revision !== revision) { busy = false; advance(); return; }
          front.hidden = false;
        } else {
          next.src = frame.src;
          await decode(next);
          if (!isCurrent()) return;
          if (frame.revision !== revision) { busy = false; advance(); return; }
          next.hidden = false;
          var fade = next.animate([{ opacity: 0 }, { opacity: 1 }],
            { duration: 500, easing: 'linear', fill: 'forwards' });
          await fade.finished;
          if (!isCurrent()) { fade.cancel(); return; }
          // Promote the already decoded incoming node rather than copying its src
          // into the base and risking another load/decode at the handoff.
          var previous = front; front = next; next = previous;
          front.alt = frame.alt; front.ariaHidden = 'false';
          front.style.opacity = '1'; front.style.zIndex = '0';
          next.hidden = true; next.ariaHidden = 'true';
          next.style.opacity = '0'; next.style.zIndex = '1';
          fade.cancel();
        }
        displayed = frame.src;
      } catch (err) {
        // A load/decode failure keeps the last displayed image, never the cover.
        if (fade) fade.cancel();
        next.hidden = true; next.style.opacity = '0';
      }
      busy = false;
      advance();
    }
    function request(src, alt) {
      if (!src || desired === src) return;
      desired = src;
      var ticket = ++revision, pending = new Image();
      pending.onload = function () {
        decode(pending).then(function () {
          if (ticket !== revision || !isCurrent()) return;
          ready = { src: src, alt: alt || '', revision: ticket };
          advance();
        }).catch(function () {});
      };
      pending.onerror = function () {};
      pending.src = src;
    }
    return { request: request };
  }
  root.TMBShotFrames = { create: create };
}(typeof window !== 'undefined' ? window : globalThis));
