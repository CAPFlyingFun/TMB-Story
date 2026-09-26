// Draws one SET of a scene -- a room, an island -- at a given state. One DOM layer per
// depth plane, moved as a whole by one GPU transform; each character or object is one
// element with a single transform. Nothing is laid out per frame and nothing is
// re-rendered unless it changed. A scene with several sets gets one Stage per set, and
// only the active one is drawn.

import { frameShot, layerTransform } from "./camera.js";
import { quadMatrix3d } from "./homography.js";

const IDLE = {
  // Breathing and weight are a slow sway about the ground point, so the chair or the feet
  // stay planted: nothing bobs, nothing is stretched.
  idle: { sway: 0.2, period: 3.4, lean: 0 },
  asleep: { sway: 0.5, period: 5.4, lean: -1.6 },
  awake: { sway: 0.22, period: 3.0, lean: 0 },
  leaning: { sway: 0.14, period: 2.8, lean: 1.4 },
};
const CROSSFADE = 0.14; // seconds, when a character turns or changes pose

export class Stage {
  constructor(root, set, sprites, url, painters = {}) {
    this.root = root;
    this.set = set;
    const W = set.world;
    this.world = { w: W.width, h: W.height };
    this.url = url;
    if (W.color) root.style.background = W.color; // fills past the layers: an open sea, a sky
    const p = W.perspective;
    if (p) {
      this.ppmK = p.ref.pxPerMeter / (p.ref.y - p.horizonY);
      this.horizonY = p.horizonY;
    }
    this.layers = {};
    for (const L of W.layers) {
      const e = el("div", "layer", root);
      e.style.width = this.world.w + "px";
      e.style.height = this.world.h + "px";
      e.style.zIndex = L.z || 0;
      if (L.color) e.style.background = L.color;
      this.layers[L.id] = { el: e, parallax: L.parallax ?? 1, zoomDepth: L.zoomDepth || 0 };
    }
    const base = this.layers[W.backgroundLayer || W.layers[0].id].el;
    const r = W.backgroundRect || { x: 0, y: 0, w: this.world.w, h: this.world.h };
    const bg = document.createElement("img");
    bg.className = "bg";
    bg.src = url(W.background);
    bg.width = r.w;
    bg.height = r.h;
    bg.style.left = r.x + "px";
    bg.style.top = r.y + "px";
    bg.alt = "";
    base.appendChild(bg);
    if (W.grade) {
      this.grade = el("div", "grade", base);
      this.grade.style.background = W.grade;
    }

    // Objects: sprites or procedurally painted canvases placed in world coordinates.
    this.objects = {};
    for (const o of set.objects || []) {
      const layer = this.layers[o.layer || W.layers[0].id].el;
      let node;
      if (o.paint) {
        node = document.createElement("canvas");
        node.width = o.canvas ? o.canvas[0] : o.w;
        node.height = o.canvas ? o.canvas[1] : o.h;
        painters[o.paint](node, o);
      } else {
        node = document.createElement("img");
        node.src = url(o.src);
        node.alt = "";
      }
      node.className = "object";
      Object.assign(node.style, { left: o.x - o.w / 2 + "px", top: o.y - o.h / 2 + "px", width: o.w + "px", height: o.h + "px", zIndex: o.z || 10 });
      layer.appendChild(node);
      this.objects[o.id] = { node, spec: o, shown: -1 };
    }

    this.actors = {};
    for (const [id, a] of Object.entries(set.actors || {})) {
      const wrap = el("div", "actor", this.layers[a.layer || W.layers[0].id].el);
      const prev = el("img", "frame prev", wrap);
      const cur = el("img", "frame", wrap);
      prev.alt = cur.alt = "";
      this.actors[id] = { wrap, cur, prev, sprite: sprites[id], curSrc: "", prevSrc: "" };
    }
    this.lights = {};
    for (const [id, l] of Object.entries(set.lights || {})) {
      const g = el("div", "light", base);
      g.style.left = l.x - l.radius + "px";
      g.style.top = l.y - l.radius + "px";
      g.style.width = g.style.height = 2 * l.radius + "px";
      this.lights[id] = { el: g, color: "" };
    }
    this.screens = {};
    for (const [id, s] of Object.entries(set.screens || {})) {
      const host = el("div", "screen", base);
      host.style.width = s.width + "px";
      host.style.height = s.height + "px";
      host.style.transform = quadMatrix3d(s.width, s.height, s.corners);
      this.screens[id] = { host, html: "", cls: "", spec: s };
    }
  }

  ppm(y) {
    return this.ppmK * (y - this.horizonY);
  }

  render(state, view) {
    const shot = state.camera;
    const cam = frameShot(shot, view, this.world);
    const sx = shot.shake ? shot.shake * 0.8 : 0, sy = shot.shake ? shot.shake * 0.5 : 0;
    for (const L of Object.values(this.layers)) {
      const m = layerTransform(cam, this.world, L.parallax, L.zoomDepth);
      L.el.style.transform = `translate3d(${(m.tx + sx).toFixed(2)}px,${(m.ty + sy).toFixed(2)}px,0) scale(${m.zoom.toFixed(5)})`;
    }
    for (const [id, node] of Object.entries(this.actors)) this.drawActor(node, state.actors[id], state.t);
    for (const [id, node] of Object.entries(this.lights)) this.drawLight(node, state.lights[id]);
    for (const [id, node] of Object.entries(this.screens)) this.drawScreen(node, state.screens[id], state.t);
    for (const [id, node] of Object.entries(this.objects)) {
      const o = state.objects[id];
      const v = Math.round(Math.max(0, Math.min(1, o.opacity)) * 1000) / 1000;
      if (v !== node.shown) {
        node.node.style.opacity = v;
        node.node.style.visibility = v > 0 ? "visible" : "hidden";
        node.shown = v;
      }
      // A slow drift (clouds) is a function of time, so a seek puts it back exactly.
      const d = node.spec.drift;
      if (d && v > 0) node.node.style.transform = `translate3d(${(d[0] * state.t).toFixed(2)}px,${(d[1] * state.t).toFixed(2)}px,0)`;
    }
    return cam;
  }

  drawActor(node, a, t) {
    node.wrap.style.display = a.visible ? "" : "none";
    if (!a.visible) return;
    const spr = node.sprite;
    const pose = spr.poses[a.pose.v];
    const frame = (poseName, dir) => this.url(spr.base + spr.poses[poseName].frames[dir].file);
    const src = frame(a.pose.v, a.facing.v);
    if (src !== node.curSrc) {
      node.cur.src = src;
      node.curSrc = src;
    }
    // A turn or a sit/stand crossfades from the previous frame, briefly.
    const changedAt = Math.max(a.facing.since, a.pose.since);
    const p = (t - changedAt) / CROSSFADE;
    if (p >= 0 && p < 1) {
      const prevPose = a.pose.since >= a.facing.since ? a.pose.prev : a.pose.v;
      const prevDir = a.facing.since >= a.pose.since ? a.facing.prev : a.facing.v;
      const psrc = frame(prevPose, prevDir);
      if (psrc !== node.prevSrc) {
        node.prev.src = psrc;
        node.prevSrc = psrc;
      }
      node.prev.style.opacity = (1 - p).toFixed(3);
      node.cur.style.opacity = p.toFixed(3);
    } else {
      node.prev.style.opacity = "0";
      node.cur.style.opacity = "1";
    }
    // One scale from world units: the pose's pixels per metre against the room's
    // pixels per metre at this depth. Moving toward the camera makes a character larger.
    const s = this.ppm(a.y) / pose.pxPerMeter;
    const [ax, ay] = pose.anchor;
    for (const img of [node.cur, node.prev]) {
      img.style.left = -ax + "px";
      img.style.top = -ay + "px";
    }
    // Idle: blend the new state's sway and lean in over ~0.8 s so a change of state settles.
    const st = IDLE[a.state.v] || IDLE.idle, pv = IDLE[a.state.prev] || st;
    const k = Math.min(1, Math.max(0, (t - a.state.since) / 0.8));
    const sway = pv.sway + (st.sway - pv.sway) * k, lean = pv.lean + (st.lean - pv.lean) * k;
    const period = pv.period + (st.period - pv.period) * k;
    const rot = lean + sway * Math.sin((2 * Math.PI * t) / period) - a.jolt * 3.2;
    const hop = -a.jolt * 5;
    node.wrap.style.zIndex = Math.round(a.y);
    node.wrap.style.transform = `translate3d(${a.x.toFixed(2)}px,${(a.y + hop).toFixed(2)}px,0) rotate(${rot.toFixed(3)}deg) scale(${s.toFixed(4)})`;
  }

  drawLight(node, l) {
    if (l.color !== node.color) {
      node.el.style.background = `radial-gradient(closest-side, ${l.color}, transparent)`;
      node.color = l.color;
    }
    const v = l.intensity * (l.throbbing ? 0.55 + 0.45 * l.throb : 1) + l.pulse;
    node.el.style.opacity = Math.max(0, Math.min(1, v)).toFixed(3);
  }

  drawScreen(node, s, t) {
    const tpl = node.spec.templates[s.state];
    if (!tpl) return;
    const out = tpl({ t, local: Math.max(0, t - s.since), params: s.params });
    const cls = "screen-inner " + (out.className || "");
    if (out.html !== node.html || cls !== node.cls) {
      node.host.innerHTML = `<div class="${cls}">${out.html}</div>`;
      node.html = out.html;
      node.cls = cls;
    }
    const inner = node.host.firstElementChild;
    inner.style.setProperty("--flash", s.flash.toFixed(3));
    for (const [k, v] of Object.entries(out.vars || {})) inner.style.setProperty(k, v);
  }
}

function el(tag, cls, parent) {
  const e = document.createElement(tag);
  e.className = cls;
  parent.appendChild(e);
  return e;
}
