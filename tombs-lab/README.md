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

## One look for the movie and the game

Joshua, 2026-11-03: the Watch tab ("movie style") and TRADDOMIUM's playable lab must look the
same. This module is the one source of the building for both: the same manifest, geometry and
materials, with no copy of the lab's look kept on either side. Improvements to the look are
made here. Cameras, story events and who is playing stay outside the geometry.

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

## Fixes after Joshua's first look (2026-11-03)

- **Looking left and right was backwards.** Dragging right now turns right.
- **Gaps in the floor.** The floor was one box per room and per corridor, which left holes
  wherever none of them reached and overlapped where corridors crossed. It is now one slab
  traced along the outside walls. The north face between the office wings and the control
  room had no wall at all, so two outside wall pieces were added there.
- **Flickering (z-fighting) on doors and windows.**
  - Door panels were exactly the size of their opening. They are now a centimetre smaller,
    and the top strip sits below the lintel.
  - Sliding doors now slide into the longer side of their wall and never past its end. Some
    used to run out into the corridor.
  - Window glass stops short of the sill and the lintel.
  - Sills and lintels reach just into the wall beside them, which removes the sparkling crack
    up each side of every opening.
  - Wall corners are filled without overlapping faces, and wall tops no longer share a height
    where they overlap.
- **Room name tags** drew through every wall. They now show only in the top view.

## Layout and furniture pass (2026-11-03, second round)

Joshua: a desk stood in front of Jack's door, the open doors still flickered, and the layout
should be checked against the blueprint "like a home or office decorator".

- **Plan from the model:** the PLAN button (and `docs/plan-from-model.svg`/`.png`) draws the
  building top-down from the same data as the 3D. `docs/blueprint-vs-model.png` sets it beside
  the blueprint. ChatGPT's `docs/metric-layout.*` show the first draft and are out of date.
- **Building, to match the blueprint:**
  - **Corridor ring.** The first draft stood a small 10 m chamber in one wide open hall. The
    Array chamber is now an 18 × 10.7 m octagon with a corridor about 3 m wide all the way
    round it, as drawn.
  - **Wings.** The west wing is one stack (Jack's laboratory, storage, the break nook) and the
    east wing is Sarah's office over the server room. There is no dead space between rooms.
  - **Outer walls** follow the corridor, with the cut corners at the south.
  - **North face.** The north face steps in between the office wings and the control room.
  - **Control room.** It now has its own reinforced window onto the Array (Chapter 2). Before,
    a solid wall stood between the consoles and the chamber.
- **Furniture** lives in one list, `src/tombs/furniture.ts`. The renderer, the plan and the
  walk collision all read it, so you can no longer walk through a desk. Every room was placed
  for use:
  - **Jack's laboratory.** His workstation and "the other console next to Jack" sit side by
    side under the window, with the intercom on his desk. The bench and rack are on the walls,
    and the door's approach is clear.
  - **Sarah's office.** Her desk is against the wall opposite her door, as the design document
    asks, so the camera at the door finds the back of her chair. The credenza sits under the
    window, with a bookcase, an armchair corner and a plant.
  - **Control room.** Three consoles face the observation glass, with 2.4 m clear inside each
    door. The shutdown lever and the sensor cabinet are on the north wall, which leaves the
    exterior window clear for the settlement view.
  - **Utility rooms.** Storage has shelving, a workbench and a field case. The break nook has a
    counter, a coffee machine, a fridge and a table for three. The server room has racks, UPS
    cabinets and an electrical panel.
  - **Security vestibule.** A counter and the badge reader by the inner door, with the 2.4 m
    walkway clear.
  - **Array chamber.** Research stations stand along its sides.
- **Doors:** the wide entrance doors now part in two. The top strip of each door sits inside
  its leaf's ends; their ends were in the same plane, which flickered whenever a door stood
  open.
- Anchors and interactions (Jack's and Sarah's seats, the intercom, the tablet, the lever, the
  badge reader, the sensor drawer) moved to the furniture they belong to. The tour's path
  follows the corridor.

## Rebuilding

```bash
cd tombs-lab && npm install && npm run typecheck && npm test && npm run build
```

`node_modules/` is not committed. `preview/` is, so the page works as plain files.
