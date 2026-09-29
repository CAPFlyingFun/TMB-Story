// Draws one SET of a scene -- a room, an island -- at a given state. One DOM layer per
// depth plane, moved as a whole by one GPU transform; each character or object is one
// element with a single transform. Nothing is laid out per frame and nothing is
// re-rendered unless it changed. A scene with several sets gets one Stage per set, and
// only the active one is drawn.

import { frameShot, layerTransform } from "./camera.js";
import { quadMatrix3d } from "./homography.js";
import { Rig, rigFor } from "./rig.js";
import { poseFrom } from "./gestures.js";

const IDLE = {
  // Breathing and weight are a slow sway about the ground point, so the chair or the feet
  // stay planted: nothing bobs, nothing is stretched.
  idle: { sway: 0.2, period: 3.4, lean: 0 },
  asleep: { sway: 0.5, period: 5.4, lean: -1.6 },
  awake: { sway: 0.22, period: 3.0, lean: 0 },
  leaning: { sway: 0.14, period: 2.8, lean: 1.4 },
  still: { sway: 0.03, period: 4, lean: 0 }, // froze, holding his breath
  walking: { sway: 0.9, period: 1.05, lean: 0.6, step: 1 }, // a storybook walk: a sway and a light step
};
const CROSSFADE = 0.14; // seconds, when a character turns or changes pose
const FEET_HALF_M = 0.2; // half the width a standing person's feet take on the floor

export class Stage {
  constructor(root, set, sprites, url, painters = {}, options = {}) {
    this.rigFiles = options.rigs || null; // { actorId: rig.json or {} } when cutout rigs are on
    this.root = root;
    this.set = set;
    const W = set.world;
    // `bounds` widens the world past its measured picture (negative x/y allowed); the
    // camera may frame anything inside it.
    const B = W.bounds || { x: 0, y: 0, w: W.width, h: W.height };
    this.world = { x: B.x, y: B.y, w: B.w, h: B.h };
    this.url = url;
    if (W.color) root.style.background = W.color; // fills past the layers: an open sea, a sky
    const p = W.perspective;
    if (p) {
      this.ppmK = p.ref.pxPerMeter / (p.ref.y - p.horizonY);
      this.horizonY = p.horizonY;
      this.lockHeadsAt = p.lockHeadsAt; // see scaleAt
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
    this.baseLayer = base;
    const r = W.backgroundRect || B;
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
      Object.assign(this.grade.style, { inset: "auto", left: B.x + "px", top: B.y + "px", width: B.w + "px", height: B.h + "px" });
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
      if (this.rigFiles) {
        const rc = el("canvas", "frame rig", wrap);
        rc.style.display = "none";
        Object.assign(this.actors[id], { rigCanvas: rc, rigs: {}, rigFile: this.rigFiles[id] || {}, seed: Object.keys(this.actors).length - 1 });
      }
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
    // The people in 3D (engine/people3d.js), for a set that has them and when they are on.
    // The sprites stay until the models have loaded, and come back if 3D is turned off.
    this.people = null;
    if (options.People3D && W.people3d) this.people = new options.People3D(this, W.people3d, { url, ...options.people3d });
  }

  // The walkable floor (world.floor, a polygon in world units). A character's footprint --
  // the chair's base seated, the feet standing -- is kept inside it every frame, so a chair
  // wheel never sinks into a cabinet whatever the scene asks for.
  floorRange(y) {
    const P = this.set.world.floor;
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i < P.length; i++) {
      const [x1, y1] = P[i], [x2, y2] = P[(i + 1) % P.length];
      if ((y1 <= y && y <= y2) || (y2 <= y && y <= y1)) {
        const x = y1 === y2 ? Math.min(x1, x2) : x1 + ((y - y1) * (x2 - x1)) / (y2 - y1);
        const xb = y1 === y2 ? Math.max(x1, x2) : x;
        lo = Math.min(lo, x, xb);
        hi = Math.max(hi, x, xb);
      }
    }
    return lo <= hi ? [lo, hi] : null;
  }

  // How big a character is drawn with their feet at floor depth y. By perspective alone the
  // size is proportional to the distance below the horizon, and a person taller than the
  // camera is high has their head climb as they come toward the lens. With lockHeadsAt set
  // (Joshua, 2026-09-27: "lock the max height... the bottom stretches in the correct aspect
  // ratio"), each person keeps the head height they have at that depth wherever they
  // stand, and the figure grows or shrinks from the head downward, in proportion. At that
  // depth the two rules agree exactly, so seated pairs and matched chairs are unchanged.
  scaleAt(y, pose) {
    const L = this.lockHeadsAt;
    if (L === undefined) return this.ppm(y) / pose.pxPerMeter;
    const head = L - pose.heightM * this.ppm(L); // the locked head line for this person and pose
    return Math.max(0.02, (y - head) / pose.figureHeightPx);
  }

  onFloor(a, pose) {
    const F = this.set.world.floor;
    let y = F ? Math.max(a.y, Math.min(...F.map((p) => p[1]))) : a.y;
    const s = this.scaleAt(y, pose);
    const r = F && this.floorRange(y);
    if (!r) return [a.x, y, s];
    const half = (pose.chairBaseM ? pose.chairBaseM / 2 : FEET_HALF_M) * pose.pxPerMeter * s;
    const lo = r[0] + half, hi = r[1] - half;
    return [lo > hi ? (r[0] + r[1]) / 2 : Math.min(Math.max(a.x, lo), hi), y, s];
  }

  ppm(y) {
    return this.ppmK * (y - this.horizonY);
  }

  render(state, view) {
    const shot = state.camera;
    const cam = frameShot(shot, view, this.world, this.set.world.bounded !== false);
    const sx = shot.shake ? shot.shake * 0.8 : 0, sy = shot.shake ? shot.shake * 0.5 : 0;
    for (const L of Object.values(this.layers)) {
      const m = layerTransform(cam, this.world, L.parallax, L.zoomDepth);
      L.el.style.transform = `translate3d(${(m.tx + sx).toFixed(2)}px,${(m.ty + sy).toFixed(2)}px,0) scale(${m.zoom.toFixed(5)})`;
    }
    const in3d = this.people && this.people.active;
    for (const [id, node] of Object.entries(this.actors)) {
      if (in3d && this.people.bodies[id]) node.wrap.style.display = "none";
      else this.drawActor(node, state.actors[id], state.t);
    }
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
    if (in3d) this.people.render(state, cam, view);
    return cam;
  }

  drawActor(node, a, t) {
    const shown = a.visible && a.opacity > 0.001;
    node.wrap.style.display = shown ? "" : "none";
    if (!shown) return;
    node.wrap.style.opacity = a.opacity < 1 ? a.opacity.toFixed(3) : "";
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
    const [fx, fy, s] = this.onFloor(a, pose);
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
    const step = (pv.step || 0) + ((st.step || 0) - (pv.step || 0)) * Math.min(1, (t - a.state.since) / 0.25);
    const hop = -a.jolt * 5 - step * Math.abs(Math.sin((2 * Math.PI * t) / period)) * 5;
    node.wrap.style.zIndex = Math.round(fy);
    node.wrap.style.transform = `translate3d(${fx.toFixed(2)}px,${(fy + hop).toFixed(2)}px,0) rotate(${rot.toFixed(3)}deg) scale(${s.toFixed(4)})`;
    // The cutout rig (?rig=1): gestures, the walk and a quiet idle (breathing, a small drift
    // of the head), never during a turn's crossfade, which stays the two plain sprites.
    if (node.rigCanvas) {
      const gestures = a.gestures || [];
      const turning = p >= 0 && p < 1;
      const R = !turning ? this.rigInstance(node, a.pose.v, a.facing.v) : null;
      if (R) {
        const P = poseFrom(R.rig, gestures, t, step, step > 0.01 ? null : node.seed);
        R.draw(node.rigCanvas, P.angles, P.shift);
        node.rigCanvas.style.left = -(ax + R.M) + "px";
        node.rigCanvas.style.top = -(ay + R.M) + "px";
        node.rigCanvas.style.display = "";
        node.cur.style.visibility = node.prev.style.visibility = "hidden";
      } else {
        node.rigCanvas.style.display = "none";
        node.cur.style.visibility = node.prev.style.visibility = "";
      }
    }
  }

  // A rig for this pose and direction, built once from the decoded sprite frame. Returns
  // null until it is ready; the plain sprite shows meanwhile.
  rigInstance(node, pose, dir) {
    const k = pose + "/" + dir;
    if (node.rigs[k] !== undefined) return node.rigs[k];
    node.rigs[k] = null;
    const img = new Image();
    img.src = this.url(node.sprite.base + node.sprite.poses[pose].frames[dir].file);
    img.decode().then(() => {
      const r = { ...rigFor(node.rigFile, node.sprite, pose, dir, img), pose };
      node.rigs[k] = new Rig(img, r, (node.rigFile && node.rigFile.limits) || {});
    }).catch(() => {});
    return null;
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
