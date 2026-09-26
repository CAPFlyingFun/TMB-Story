// A game camera over a fixed world. A shot names the world rectangle the director wants
// to see, plus a focus point that must stay in view. The camera fits that rectangle into
// whatever viewport it has -- portrait, landscape, desktop -- without ever stretching the
// world or showing past its edges:
//   - zoom fits the rectangle, but never drops below "cover", so the world always fills
//     the screen (no letterbox, no stretched background);
//   - when the viewport is narrower than the shot (a phone held upright), the crop slides
//     toward the focus point instead of cutting it off;
//   - `safe` insets (the controls bar) are left out of the framing box.

export function frameShot(shot, view, world, bounded = true) {
  const box = {
    x: view.safe.left,
    y: view.safe.top,
    w: view.w - view.safe.left - view.safe.right,
    h: view.h - view.safe.top - view.safe.bottom,
  };
  const cover = Math.max(view.w / world.w, view.h / world.h);
  const fit = Math.min(box.w / shot.w, box.h / shot.h);
  // An open world (a sea that runs on in one colour past its edge) may be framed wider
  // than the world, so a long zoom never parks at the widest framing.
  const zoom = bounded ? Math.max(cover, fit) : fit;
  const visW = box.w / zoom, visH = box.h / zoom;
  let cx = shot.x + shot.w / 2, cy = shot.y + shot.h / 2;
  if (shot.w > visW) cx = clamp(shot.fx, shot.x + visW / 2, shot.x + shot.w - visW / 2);
  if (shot.h > visH) cy = clamp(shot.fy, shot.y + visH / 2, shot.y + shot.h - visH / 2);
  // Keep the whole viewport on the world: the framing box sits at bcx, the screen edges at 0 and view.w.
  const bcx = box.x + box.w / 2, bcy = box.y + box.h / 2;
  if (bounded) {
    cx = clamp(cx, bcx / zoom, world.w - (view.w - bcx) / zoom);
    cy = clamp(cy, bcy / zoom, world.h - (view.h - bcy) / zoom);
  }
  return { zoom, tx: bcx - cx * zoom, ty: bcy - cy * zoom, cx, cy, bcx, bcy, cover };
}

// Depth for flat layers. A layer with parallax p pans p times as far as the camera around
// the world's centre (p = 1 is the ground; clouds above it are > 1). zoomDepth makes a
// layer also ZOOM faster than the ground as the camera pushes in, the way something
// nearer the lens does: its scale is zoom * (zoom / cover) ^ zoomDepth, so at the widest
// framing every layer lines up and they separate as the camera descends.
export function layerTransform(cam, world, p = 1, zoomDepth = 0) {
  if (p === 1 && !zoomDepth) return cam;
  const zoom = cam.zoom * Math.pow(cam.zoom / cam.cover, zoomDepth);
  const cx = world.w / 2 + (cam.cx - world.w / 2) * p;
  const cy = world.h / 2 + (cam.cy - world.h / 2) * p;
  return { zoom, tx: cam.bcx - cx * zoom, ty: cam.bcy - cy * zoom };
}

function clamp(v, lo, hi) {
  return lo > hi ? (lo + hi) / 2 : Math.min(Math.max(v, lo), hi);
}
