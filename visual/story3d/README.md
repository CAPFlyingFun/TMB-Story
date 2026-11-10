# Chapter 1 in the one player — the 3D story picture

The Listen player's **3D** pill (`reader/player.js`) draws this scene over the chapter's stills,
from the player's one audio element. Watch → Chapter 1 opens the same player
(`#listen/1/3d`; `visual/?old=1` keeps the older Watch staging). Presentation only: nothing in
`chapters/` or the audio changes for it.

## How it stays in step
- `src/mount.js` — `mount(host, { now, playing, stills })`. Every frame it asks the player for
  the audio time and draws that moment. It never plays, seeks or loads audio, so pause, seek,
  buffering, speed and switching the 3D off and on need nothing special.
- `src/timeline.js` — the clock: positions, poses and cameras are worked out from the time;
  chairs, the tablet, doors and screens are rebuilt from the events up to it. Any seek lands
  right. Dynamics (the badge's swing, a cloth sim later) step only while time advances and are
  reset and settled after a seek.
- `src/lines.js` — the chapter's lines on the current audio file (the manifest's own index), so
  a re-recorded line moves everything anchored to it.

## What it draws
- `src/stage.js` — the Plan C building from `tombs-lab/` (the one source of the lab for the story
  and the game, decision 0042) and the **cast as data** (`CAST`): today the toon Jack and Sarah
  with the swinging TOMBS badge (Joshua, 2026-11-10). Swapping in the CCBS bodies is a change to
  `CAST`; a cloth-sim garment goes in with `stage.addDynamics(id, sim)`.
- `src/ch1.js` — Chapter 1 line by line: marks, walks, hands, leans, chairs, the tablet, every
  screen's content, and the shot list. Places are measured on the lab as built.
- `src/screens.js` — what each named screen shows, drawn from the manuscript's system lines.
- `src/intro.js` — the Watch's painted island opening, used when there are no stills (the player
  shows its own approved island stills instead and the 3D comes in with the lab).

## Build and check
- `scripts/build-story3d.sh` writes `dist/story3d.js` (about 1 MB). **It is committed**: Pages
  serves the repository as it is, with no build step.
- `probe.html?t=SECONDS[&w=&h=&cam=x,y,z,lx,ly,lz,fov&quality=low]` — one moment, outside the
  player.
- `python3 scripts/tests/player-3d.py [out]` — the player in a headless phone browser,
  portrait and landscape: play, seek both ways, 1.5x, 3D off and on mid-play, the bundle failing.

## Parked for later
- `ccbs-story-bake.patch` — a local fix of CCBS's `story-sarah.mjs` bake (her new finger weights
  and finger fills, sneakers exported as their own parts, the fitted tee instead of the raglan
  cloth-sim tee for a skinned file). Not applied in CCBS: for whoever brings the CCBS Sarah in.
  Note: that fitted tee no longer clears her newer approved belly; it needs a fit pass, or the
  room's cloth sim run here through `addDynamics`.
