// THE 3D PICTURE INSIDE THE LISTEN PLAYER. The player owns the one audio element; this
// module never plays, seeks or loads audio. Every frame it asks the player where the chapter
// is (api.now()) and draws the scene for that moment, so pause, seek, buffering and a speed
// change need nothing special: the scene is a function of the audio time.
//
// mount(host, api) -> { ready: Promise, destroy() }
//   api.now()     -> chapter seconds on the current audio file
//   api.playing() -> true while the audio is advancing
//   api.stills    -> the player shows its own approved island stills under this picture: the
//                    3D stays clear through the island opening and comes in with the lab
import { Stage, CAST } from './stage.js';
import { frame, DURATION } from './ch1.js';
import { loadIntro, drawIntro, INTRO_UNTIL } from './intro.js';
import { Foley, LANDS, stepIndex } from './footsteps.js';
import * as THREE from 'three';


export function mount(host, api) {
  host.innerHTML = '<div class="s3-stage"></div><canvas class="s3-intro"></canvas><div class="s3-hud"></div>';
  const box = host.querySelector('.s3-stage'), intro = host.querySelector('.s3-intro'), hud = host.querySelector('.s3-hud');
  const stage = new Stage(box);
  const foley = new Foley();
  let alive = true, ready = false, raf = 0, lastT = -1, lastW = 0, lastH = 0, lastSec;
  const prevWalk = { jack: null, sarah: null }; let prevT = null;

  function footsteps(S, t) {
    const playing = api.playing() && prevT !== null && t > prevT && t - prevT < 0.3;
    for (const id of ['jack', 'sarah']) {
      const a = S.actors[id], w = a.walked, cam = stage.camera;
      if (playing && foley.enabled && prevWalk[id] !== null && (a.pose === 'walk' || a.prevPose === 'walk')) {
        const L = stage.strideM(id), n0 = stepIndex(prevWalk[id], L, LANDS[id]), n1 = stepIndex(w, L, LANDS[id]);
        for (let k = n0 + 1; k <= Math.min(n1, n0 + 2); k++) {
          const p = new THREE.Vector3(a.at[0], 0.1, a.at[1]), dist = p.distanceTo(cam.position), q = p.clone().project(cam);
          const onScreen = Math.abs(q.x) < 1.05 && Math.abs(q.y) < 1.1 && q.z < 1;
          const gain = dist > 9 ? 0 : Math.min(1, 3 / dist) * (onScreen ? 1 : 0.35);
          foley.step({ gain, pan: onScreen ? q.x * 0.7 : 0, weight: id === 'jack' ? 1 : 0, seed: (id === 'jack' ? 1000 : 2000) + k });
        }
      }
      prevWalk[id] = w;
    }
    prevT = t;
  }

  function draw() {
    if (!alive) return;
    raf = requestAnimationFrame(draw);
    if (!ready) return;
    const W = host.clientWidth, H = host.clientHeight;
    if (!W || !H) return;
    const t = Math.max(0, Math.min(DURATION - 0.02, api.now() || 0));
    const sized = W !== lastW || H !== lastH;
    if (!sized && t === lastT && !api.playing() && !api.camera) return;   // nothing moves while paused
    if (Math.abs(t - lastT) > 0.5) stage.forceFresh = true;   // a seek: no easing from the old place
    lastW = W; lastH = H; lastT = t;
    host.dataset.t = t.toFixed(2);   // the audio time this picture shows (tests read it)
    const aspect = W / H, S = frame(t, aspect, aspect < 1.3 ? 'slot' : 'wide');
    // a probe may look from its own camera (tests and review; the player never passes one)
    const own = api.camera && api.camera();
    if (own) S.camera = { pos: own.pos, look: own.look, vfov: own.vfov || 40, label: 'PROBE' };
    const clear = !!api.stills && t < INTRO_UNTIL;
    host.classList.toggle('s3-clear', clear);
    const island = clear ? true : drawIntro(intro, t, W, H, Math.min(2, devicePixelRatio || 1));
    if (!island) { stage.draw(S, W, H); footsteps(S, t); } else { stage.lastT = null; prevT = null; }
    const sec = island ? null : S.camera.sec;
    if (sec !== lastSec) { lastSec = sec; host.classList.toggle('s3-sec', !!sec); hud.innerHTML = sec ? '<span class="s3-tl">' + sec + '</span><span class="s3-tr"><b>●</b> REC 03.05.2110</span>' : ''; }
  }

  // The first sound of a step needs a user gesture on phones; the player's play button is one.
  const unlock = () => { foley.ensure().catch(() => {}); };
  document.addEventListener('pointerdown', unlock, { passive: true });

  const ready$ = Promise.all([loadIntro(), stage.load(CAST)]).then(() => {
    if (!alive) return;
    ready = true; lastT = -1;
  });
  raf = requestAnimationFrame(draw);

  return {
    ready: ready$,
    footsteps(on) { foley.enabled = !!on; },
    destroy() {
      alive = false; cancelAnimationFrame(raf);
      document.removeEventListener('pointerdown', unlock);
      try { stage.dispose(); } catch (e) {}
      host.innerHTML = '';
    },
    debug: { stage, frame },
  };
}
