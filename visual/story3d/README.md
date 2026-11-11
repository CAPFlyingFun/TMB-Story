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

## The hands (`src/arms.js`, 2026-11-10)
Every hand is placed every frame, by its job or by its rest, and nothing is left to the base
animation's arms (whose hands hung palm forward and reached through the body):
- a job is a fingertip target from `ch1.js` (`handTargets`: typing, pressing, holding, pointing,
  her hand on his shoulder, carrying, on her bump), drawn by its kind (`stage.js` `HAND`: how the
  hand tips toward what it touches, how much it follows its forearm, how its fingers curl);
- a hand with no job rests as its pose rests it (`restHand`): hanging beside the thigh, clear of the
  hips, palm to the thigh; swinging against the opposite leg walking; on the thigh by the knee
  seated (beyond Sarah's bump); folded across the chest asleep (`FOLD`: the forearms crossed and
  lying on his slumped chest, each hand at the other elbow). Each body's outline numbers are
  MEASURED on its skinned mesh (`CAST` `hands`);
- the arm is solved as TRADDOMIUM's reach solves it (a hinge elbow hanging down and a little out,
  half the palm's roll along the forearm), but the HAND continues its forearm, bent at most 40
  degrees at the wrist, and the wrist is placed so the curled fingertip lands on the target;
- going from one job to the next takes 0.55 s, along an arc clear of the body (lifting up and back
  from another person); a pure function of the moment, so a seek lands where playing would.

Staged for the toon cast's short arms and Sarah's bump: her reaches are to targets beside her bump,
never in front of it below it (she stands so; the hand on that side reaches); she turns toward
Jack to rest her hand on his shoulder, her elbow lifted out; she pushes the top corner of his
chair's back (the arm, 0.65 m up, is out of a standing toon Sarah's reach).

## Other staging rules learned on the toon cast (2026-11-10)
- Every shot pushes in slowly while it holds (`PUSH`, `PUSH_SECONDS` in ch1.js), as the Watch
  tab's opening does.
- Chairs sit back from the desks and the keyboards are 16 cm from the edge, so knees, bump and
  forearms clear the desk.
- Sarah's tablet is a light case, picked up on camera, tucked under her right arm and carried
  (her forearm forward along its lower edge, her hand round its front edge, its screen to her; the
  tablet is placed from where that hand is, `tuckPose`, so it never floats free of the hand), drawn
  out and set down.
- A gesture the narration names is acted, not left on the thighs: Jack's point, Sarah's point,
  her hand on her bump, and "Jack spread his hands" (`spread`: both hands up, open, palms up).
- The hand tables (`HAND`, `FOLD`, `TUCK`, `CARRY`) are reachable in the page as
  `story3d.view.debug.stage.tune`, to try numbers live on the pose sheet before writing them in.
- Her lines are shot from the side or front (`sarahPick`, `entrance`, `sarahFront`,
  `sarahProfile`, `sarahSide`) so her pregnancy is seen.

## Build and check
- `scripts/build-story3d.sh` writes `dist/story3d.js` (about 1 MB). **It is committed**: Pages
  serves the repository as it is, with no build step.
- `probe.html?t=SECONDS[&w=&h=&cam=x,y,z,lx,ly,lz,fov&quality=low]` — one moment, outside the
  player.
- `python3 scripts/story3d/pose-sheet.py scripts/story3d/ch1-poses.json OUT TAG` — the POSE SHEET:
  every pose Jack and Sarah take in Chapter 1, each alone in a plain studio from the front, both
  sides and each hand close up, beside the story's own shot, with how far any hand or forearm
  sinks into a body and how each arm's joints are turned.
- `python3 scripts/story3d/hands-scan.py OUT.json` — the whole chapter played and measured every
  0.4 s; prints every span where a hand is inside a body or a wrist is bent too far.
- `python3 scripts/story3d/close-shots.py WHO SECONDS OUT.jpg [--joint wristR] [--js ...]` — one
  person at one moment, close on a joint from several sides, measured; `--js` tries a number live
  (`stage.tune`) before it is written into `stage.js`.
- `python3 scripts/tests/player-3d.py [out]` — the player in a headless phone browser,
  portrait and landscape: play, seek both ways, 1.5x, 3D off and on mid-play, the bundle failing,
  no still under the 3D, and the 3D on by default on a first visit.

## Parked for later
- `ccbs-story-bake.patch` — a local fix of CCBS's `story-sarah.mjs` bake (her new finger weights
  and finger fills, sneakers exported as their own parts, the fitted tee instead of the raglan
  cloth-sim tee for a skinned file). Not applied in CCBS: for whoever brings the CCBS Sarah in.
  Note: that fitted tee no longer clears her newer approved belly; it needs a fit pass, or the
  room's cloth sim run here through `addDynamics`.
