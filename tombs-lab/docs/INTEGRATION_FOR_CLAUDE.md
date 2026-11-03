# Claude integration guide · Read before copying anything

## Priority order

1. Latest Joshua instructions (including town-only shrink at 1:180).
2. Latest **approved** TMB-Story manuscript and current TRADDOMIUM repository code.
3. This ZIP as a candidate independent level module.
4. October 25 Draft C blueprint/spec (older conceptual document, NOT newer story canon).

Do not replace the current playable lab or island just because this ZIP supplies a Draft C alternative. Compare first, review screenshots and test, ask Joshua's approval before any push.

## Existing repository findings, inspected 2026-11-02

- `src/world/tombs/site.ts` already defines a surveyed candidate site as `TOMBS_SITE = world(1_842_969, 377_344)`, recorded height 89.3 m and slope ~0.0067 (0.38°). A ~100 m neighbourhood has only ~1.4 m relief. **Site exists. Don't search for a random new one unless the new 36 × 28 m envelope conflicts with terrain or settlement plans.**
- Current game `src/world/tombs/plan.ts` is a six-room **26 × 26 m** procedural layout; `src/world/tombs/types.ts` and `collide.ts` are its pure data/collision engine.
- `src/tombs/LabView.ts` converts local metres to island world units **PER PLACEMENT** (`UNITS_PER_METRE`, 100), and intentionally keeps its group scale at 1. This is incompatible with blindly nesting the existing view under a second metric multiplier.
- `src/tombs/TombsLabScene.ts` already connects the planned lab to people, movement, input, audio and interaction. Reuse what works rather than replacing those systems.
- Existing `src/actor/humanFeet.ts` and body rigs are better for actual Jack/Sarah walking than the preview's simplified first-person collision.
- The current repo version may have advanced again by the time you integrate. Re-read actual files and tests.

## Recommended merge path

### 0. Preserve the baseline

Record repo SHA, screenshot current production lab, build, and test. Import this ZIP to a **separate** `src/experiments/tombsDraftC/` namespace or integration branch. Do not overwrite `src/world/tombs/` or `/island/` until Joshua approves the visual and metric comparison.

### 1. Adapt the DATA, not blindly the renderer

Review `src/tombs/spec.ts` against current `LAB_SPEC` and actual Oct 25 Draft C concept.

- New manifest includes Jack's laboratory, Sarah's office, Main Control, Array, Storage, Break, Utility and Security Vest.; 10 doors, 10 corridor regions, 46 wall segments.
- Walls use the same exact cut sections in visual geometry and collision.
- Convert this layout to `LabLayout`/`planLab` concepts where beneficial. Avoid maintaining two conflicting authoritatively placed TOMBS buildings.
- Inspect top-down distances, door clearances, Array sightlines and complete walk loop before attaching story scripts.
- `src/tombs/geometry.ts` is a stand-alone renderer reference and can be discarded if the existing `LabView` can render the new manifest more efficiently.

### 2. Keep the coordinate conversion in ONE place

The standalone preview uses 1 Three.js unit = 1 m; the live island uses 100 render units per metre. The actual world uses a floating origin and a canonical `WorldPoint`. Put an `ISLAND-SITE-ANCHOR` at **render-world coordinates derived from** `TOMBS_SITE`, plus live `Heightfield.heightAt` when terrain tiles change.

**Choice A (preferred when using this renderer):** make an adapter group with `scale=UNITS_PER_METRE`, then attach `TownScaleController.townRoot` and author all child shapes/characters in local metres. The town root animates `1 → 1/180`. Do not multiply again in child meshes.

**Choice B (preferred if keeping existing `LabView`):** keep all existing meshes converted to world units (`UNITS_PER_METRE` applied once), put a `townRoot` with scale `1 → 1/180` above only town meshes, and compute the root pivot/translation carefully. The current `LabView` assumes a translation-only group; update its coordinate/collision assumptions intentionally, not by magic.

In either choice, the authoritative island position remains immutable. Child `localToWorld` and `worldToLocal` conversions are mandatory for nav targets, foot ground sampling, prop attachment, physics/contact, scene save/reload, and external island encounters. Do not use raw local metres as island world coordinates, or accidentally double-scale model GLBs.

### 3. Town grouping contract

```text
islandSceneRoot (scale 1, existing terrain and insects)
  islandSiteAnchor (translation from world+floating-origin system)
    metricBridge (x100 if children authored in metres)
      townRoot (1 -> 1/180, pivot at building floor)
        Draft C lab, all town fixtures and other settlement structures
        Jack, Sarah, human NPC characters, attachment bones, cameras
```

The standalone scale controller has `setWorldAnchor`, `setTownPivot`, `localToIsland` and `islandToLocal`. Use the current game coordinate conventions, not independently invented island math. Do **not** shrink the island, water or insects.

### 4. Character integration

Replace `createCharacterMounts()` primitive stand-ins with actual current `Jack` and `Sarah` GLBs/rigs using stable `jackDeskSeat` and `sarahDeskSeat`. Both models are children of the same `townRoot`; no additional 1/180 scale on them. Their local height remains normal human metres (or metric-bridged equivalents). Preserve Sarah v2 approved appearance and outfit; don't overwrite Character Studio data. Ensure first-person Sarah can look down and see visible torso/belly/clothing without showing the inside of head meshes.

### 5. Cinematic and story hooks

`CinematicDirector.startIntro()` is an **original fly-in test**, not canonical Chapter 1 screenplay. The selected Draft C Oct 25 document requested a Jack → intercom → cinematic through halls → Sarah first-person → Jack flow. The ZIP includes only camera fly-in, scripted portal openings, an Array activation/scale vignette, and a minimal set of interactive props. Build the actual player handoff with the current story's authored dialogue and the current `TMB-Story` IDs. Use narration/music only from properly licensed/owned assets; do not copy Jurassic Park cinematics/music.

The existing lab's story event ordering takes precedence over the preview's simplified button actions.

### 6. Placement on island

The current site is already flat enough for the OLD 26×26 building in survey data; evaluate the proposed 36×28 footprint with live terrain heights before accepting it. Check entry orientation, exterior stairs, field equipment, water, nearby trees, camera horizon, roads, future settlement and the post-shrink scale. Avoid unapproved terrain deformation. The local `PLAN` contains no Kauaʻi coordinates intentionally.

### 7. Actual tests and approval

- Compare old production lab and new metric layout visually, top-down and interior.
- Test Jack and Sarah path to each other, corridor loops, control observation, service door, Array, foyer, outdoors. Test every door open/closed and check windows remain solid.
- Check both original size and 1/180 with *unchanged* island/insect geometry; no camera clipping, z fighting, floating origin drift, terrain scale errors or foot grounding errors.
- Run real device tests at low/medium settings with both characters, all active material layers and expected screen/audio states. FPS 30–60 is an unverified goal, not a guarantee.
- Verify save/reload after scaling; authoritative world coordinates must not become local scaled positions.
- Preserve Chapter 1 approved text/audio. First playable approval gate is a short Jack → Sarah → Jack handoff, then add the rest of canon.
- Show Joshua review images/video and tests BEFORE a PR/push to main.

## Scale gotcha (important)

If the island uses 100 units/m and the standalone facility is already built in metres, after shrinking:

`worldPosition = siteWorldPosition + (localMetres * 100 / 180)`

(with appropriate rotation, origin shift, and pivot). If the camera is kept in island world-space instead of being parented to the town, it needs an equivalent target-follow transform or it will appear to jump away from the newly tiny building. In this package, the preview camera is already a child of `townRoot`.
