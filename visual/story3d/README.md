# Chapter 1 staging prototype — handoff (not wired into the site)

Joshua moved the 3D story work (one player for Listen and Watch, Plan C lab, CCBS
characters) to another agent on 2026-11-10. This folder hands over what this session had,
so nothing is lost. **Nothing here is loaded by the reader.** Use it, change it, or
discard it.

- `src/`: the staging prototype from 2026-11-07 to 2026-11-09 (the published "Chapter 1
  staging" artifact). It has the procedural Plan C lab (`tombs-lab/src/tombs`), the Watch
  tab's rig and posing code (`visual/vendor/three-human.js`), and Chapter 1 staged line by
  line in `ch1.js` in lab metres. That staging includes:
  - the chair fetched from the bench;
  - footsteps on real footfalls;
  - the island intro;
  - seek-safe state.
- **Models.** It uses TMB-Story's `jack.glb` (the toon Jack) and `sarah-v2.glb`. These are
  **not** the approved non-cartoon CCBS models, which still need to replace them.
- **Timing.** Every action is anchored to a line of the chapter (`L("...")`), never to raw
  seconds. `src/lines.js` reads the lines from `globalThis.__TMB_STORY3D`, as
  `{ lines: [{ text, who, s, e }], seconds }`. These come from the current audio file's
  index (`audio/exports/chapter-01-clips.json`), so the re-recorded 43-people opening
  lines up.
- **Entry point.** `src/mount.js` exports `mount(host, { now, playing })`. It draws what
  the scene looks like at the player's audio time and never touches audio.
- **Build.** `scripts/build-story3d.sh` writes `visual/story3d/dist/story3d.js` (about
  1 MB). The build output is not committed.
- `player-wiring.patch` is an UNTESTED draft for `reader/player.js` and
  `reader/style.css`. It adds a "3D" pill on Chapter 1, lazy-loads the bundle into the
  picture slot over the stills, and keeps the stills if loading fails. It was not
  applied.
- **Known gaps.** These are listed in `outline/LISTEN_VISUALS_IDEAS.md`:
  - believable seat clearance and hand contact;
  - Sarah's console staying off until she powers it up;
  - eye lines;
  - the relaxed pregnancy rule, which `ch1.js`'s header still describes the old way.
