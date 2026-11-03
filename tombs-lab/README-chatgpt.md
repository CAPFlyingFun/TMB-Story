# TRADDOMIUM: Micro Battle! · TOMBS Laboratory, Draft C

**Standalone procedural TypeScript/Three.js lab**, packaged for Claude to import later. Created from the October 25, 2026 **TOMBS Laboratory Technical Game Design Document (Draft C)** and the selected blueprint supplied in `assets/`.

## What is actually in this ZIP?

- A metric 36 × 28 m Draft C U-shaped facility, **8 named rooms**, **10 controllable doors**, hallway sections, an octagonal Array chamber, observation glass, external windows, floors/roof, desks, chairs, monitors, sensor/storage/server props, security reader, and five animated Array rings.
- **The same wall-opening cuts feed visible geometry and player collision**. Collision and room layout code is in independent, deterministic TypeScript files.
- An interactive in-browser preview: WASD/arrows or touch movement; pointer drag to look; E/use to interact; top-down orbit and roof toggle; light/alarm/Array states; save/load of preview state to local browser storage.
- A **camera fly-in** for the opening (original, no Jurassic Park assets/audio) and a separate Array activation/shrink vignette.
- A **single synchronized town scale controller**. The lab, props, mannequin stand-ins and character camera share one `TOWN:SHRINK-ROOT`, transitioning from **1:1 to 1:180**. Island, vegetation and insect reference objects stay in their unscaled `ISLAND` parent.
- Stable story anchors and interaction IDs; placeholder character mounts that can be replaced with Jack/Sarah’s current GLBs later.
- Core collision/layout/state tests and an import guide for Claude.

### Quick start

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Run:

```bash
npm run typecheck
npm test
npm run build
```

**Build verification note:** In the authoring container, npm package downloading timed out. The dependency-free core compiled with TypeScript and its route/collision tests were executed locally, but the Vite/Three.js browser application has **not** been run or visually reviewed here. Please run `npm install && npm run build && npm test` on a machine with package-registry access before integration.

## Controls

| Control | Action |
|---|---|
| CINEMATIC TOUR | Fly in from above and follow the entrance/corridor toward Jack’s room |
| EXPLORE | Human-scale walkthrough, start inside Jack’s laboratory |
| TOP VIEW | Orbit and inspect the building / room layout |
| ROOF | Toggle roof mesh |
| WASD or arrows | Walk and strafe, with sliding collision |
| Mouse drag / swipe | First-person look |
| E / INTERACT | Open/close nearby door, use intercom/terminal/lever/tablet/sensor |
| ACTIVATE ARRAY | Animate the rings, apply screen transition, shrink the entire town root |
| NORMAL SIZE | Restore the town to its initial size |
| SAVE / LOAD | Save room state and camera locally (preview only) |

**Important:** For this standalone preview, scale-aware collisions occur in the building's **local metres**. Actual island-scale collisions, biome data, save-game integration, floating origin, character rigs and story scene events must be adapted by Claude as described below.

## Scale contract (critical)

The earlier two-shield outline does not require scaling the island in the rendering engine. The current gameplay contract from Joshua is:

```
ISLAND (constant world scale)
├── existing island terrain, vegetation, rivers, ocean
├── ants and other insects: existing normal size
└── site / floating-origin-compatible placement
    └── METRIC BRIDGE: 100 island render units / human metre [GAME ONLY]
        └── TOWN ROOT: relative scale 1 → 1/180
            ├── TOMBS building and ALL town buildings
            ├── equipment, chairs, doors, monitors, Array
            ├── Jack, Sarah, humans, NPCs
            └── camera while inside human POV
```

- At normal size: a 36 m lab remains 36 m and a 1.7 m person remains 1.7 m.
- After scale 1/180: the 36 m lab is **0.2 m** wide in island-world metres, and a 1.7 m person is about **9.44 mm** tall.
- A real 5 mm ant remains 5 mm in island-world metres, and thus approaches half the shrunken human’s height.
- Lab and humans shrink **together**, retaining their same interior ratio. The world and insects do NOT change scale here.
- **No per-object `scale = 1/180`**, no changing individual GLB dimensions, no scaling terrain/ant parents.
- Keep all underlying authored dimensions and character measurements in normal local metres; convert positions and velocity through transforms at the integration boundary.
- `TownScaleController(..., metresToIslandUnits)` accepts `1` in this preview and **`UNITS_PER_METRE` from `src/world/dem.ts` (currently 100)** in the actual game. Do not wrap an already ×100-converted `LabView` or double-apply the conversion.

## What is NOT implemented

This is a **playable lab environment and cinematic/scale prototype**, not a finished Chapter 1–10 quest system:

- No imported Jack/Sarah GLBs, professional materials, facial performance, or precise story choreography. Instead there are named mounts and visibly non-canonical stand-ins.
- No existing TMB-Story dialogue/audio/voice tracks bundled. No unauthorized adaptation of canon lines.
- No production island placement, terrain flattening, island navigation, streaming, networking, multiplayer, physics integration, or save migration.
- The standalone preview's ant and grass are tiny procedural **scale references only**, not the repo's actual insects and vegetation.
- No guarantee of 30–60 FPS on iPhone, full mobile gameplay acceptance, or medically realistic systems. The preview should be reviewed on a device.
- The blueprint is visual direction; its artistic labels aren't guaranteed to be a coherent measured structural survey. The `spec.ts` metre coordinates are the executable blockout to review.

## Files

- `src/tombs/spec.ts` authoritative dimensions, room manifest, corridors, portals, story anchors.
- `src/tombs/collision.ts` cuts walls around all window/door portals and resolves walk collisions.
- `src/tombs/geometry.ts` procedural Three.js environment and door/Array runtime.
- `src/tombs/scale.ts` one-root town scale and coordinate conversions.
- `src/tombs/characters.ts` GLB-compatible Jack/Sarah mounts and mannequins.
- `src/tombs/state.ts` serializable door and environment state.
- `src/tombs/interactions.ts` reusable story/object IDs and interactions.
- `src/tombs/cinematic.ts` camera opening and separate shrink vignette.
- `src/main.ts` optional standalone browser host and controls.
- `tests/*.test.ts` geometry, connectivity, collision, saves and scale invariants.
- `assets/draft-c-approved-blueprint.png` selected concept reference, plus `docs/Reference_TOMBS_Laboratory_TGDD_2026-10-25.docx` the original technical brief.
- `docs/metric-layout.svg` and PNG code-derived plan to compare with the concept blueprint.
- `docs/INTEGRATION_FOR_CLAUDE.md` non-destructive integration procedure.
- `docs/DIFFERENCES_FROM_CANONICAL_GAME.md` differences from the existing game lab.

### Progress / approval

This ZIP is an **experimental handoff**. No GitHub changes, Trello changes, commits or pushes were made by this package creation. Joshua reviews the standalone preview/screenshots and explicitly approves before Claude integrates anything into production.
