# Chapter 1 in the one player — the 3D story picture

The Listen player draws this scene from its one audio element. It is **on by default** where a
chapter has one (Joshua, 2026-11-10): while it is on the stills are hidden, so none flashes
before the scene, and the 3D draws the island opening too; the **3D** pill switches back to the
stills (remembered), and if the scene cannot load the stills come back by themselves. Watch → Chapter 1 opens the same player
(`#listen/1/3d`; `visual/?old=1` keeps the older Watch staging). Presentation only: nothing in
`chapters/` or the audio changes for it.

## How it stays in step
- `src/mount.js` — `mount(host, { now, playing })`. Every frame it asks the player for
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
- `src/intro.js` — the Watch's painted island opening, then the lab coming up from black.

## Staging rules learned on the toon cast (2026-11-10)
- Every shot pushes in slowly while it holds (`PUSH`, `PUSH_SECONDS` in ch1.js), as the Watch
  tab's opening does.
- A hanging hand faces the thigh: the arm turns in from the shoulder (`ARM_ROLL`), so the wrist
  is never wrung; free fingers rest slightly curled (Sarah's rig names them; Jack's does not).
- Chairs sit back from the desks and the keyboards are 16 cm from the edge, so knees, bump and
  forearms clear the desk; every reach is checked to HOLD (the reach's own report).
- Sarah's tablet is a light case, picked up on camera, tucked against her right side under her
  forearm (turned a little to the front so it reads), drawn out and set down.
- Her lines are shot from the side or front (`sarahPick`, `entrance`, `sarahFront`,
  `sarahProfile`, `sarahSide`) so her pregnancy is seen.

## Build and check
- `scripts/build-story3d.sh` writes `dist/story3d.js` (about 1 MB). **It is committed**: Pages
  serves the repository as it is, with no build step.
- `probe.html?t=SECONDS[&w=&h=&cam=x,y,z,lx,ly,lz,fov&quality=low]` — one moment, outside the
  player.
- `python3 scripts/tests/player-3d.py [out]` — the player in a headless phone browser,
  portrait and landscape: play, seek both ways, 1.5x, 3D off and on mid-play, the bundle failing,
  no still under the 3D, and the 3D on by default on a first visit.

## Parked for later
- `ccbs-story-bake.patch` — a local fix of CCBS's `story-sarah.mjs` bake (her new finger weights
  and finger fills, sneakers exported as their own parts, the fitted tee instead of the raglan
  cloth-sim tee for a skinned file). Not applied in CCBS: for whoever brings the CCBS Sarah in.
  Note: that fitted tee no longer clears her newer approved belly; it needs a fit pass, or the
  room's cloth sim run here through `addDynamics`.
