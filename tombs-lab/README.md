# TOMBS Laboratory, Draft C — standalone module (review copy)

ChatGPT's Draft C TOMBS laboratory as one self-contained module, brought into TMB-Story by
Joshua on 2026-11-03 so it can be used here first and in TRADDOMIUM later (decision 0042).

**Status: for Joshua's review. Not wired into the Watch tab or any chapter yet.** The Watch's
Chapters 1 to 10 still play in `visual/engine/labRoom.js` and `visual/engine/controlRoom.js`.
Moving them into this building is the next step, and only once Joshua has approved the
layout.

- **Preview:** `tombs-lab/preview/index.html` (on the site: `/tombs-lab/preview/`). Cinematic
  tour, walk-around (WASD or the on-screen pad), top view, roof, doors, and the town-only shrink.
- **Design document:** `docs/Reference_TOMBS_Laboratory_TGDD_2026-10-25.docx`.
- **Selected blueprint:** `assets/draft-c-approved-blueprint.png`.
- **ChatGPT's notes:** `README-chatgpt.md`, `docs/INTEGRATION_FOR_CLAUDE.md`,
  `docs/DIFFERENCES_FROM_CANONICAL_GAME.md`.

## What changed on import

- The build failed on one unused parameter (`buildLab(state)` in `src/tombs/geometry.ts`). It is
  now `_state`. Typecheck, the 7 tests and the build pass. ChatGPT's container could not run
  the browser build. It was run and screenshotted here.
- **Canon (Joshua, 2026-11-03):**
  - "Research Station · 2083" and "Somewhere in the Pacific · 2083" are now 2110 and "The
    Atlantic · March 5, 2110".
  - "Palmdale Research Settlement" is "The Research Settlement". The settlement has no name
    on the page.
  - The activation captions no longer say "field", "anomalous field", "spatial compression"
    or "Phase One". There is no field ([HIDDEN], `story-rules/WORLD_RULES.md` §1), and PHASE
    ONE READY is a clue.
  - The HUD's "TOWN SCALE 1:180" readout stays. This is a development tool, and the number is
    still never said in the story (Q05).
- `vite.config.ts` was added so the build lands in `preview/` with relative paths, for GitHub Pages.

## Rebuilding

```bash
cd tombs-lab && npm install && npm run typecheck && npm test && npm run build
```

`node_modules/` is not committed. `preview/` is, so the page works as plain files.
