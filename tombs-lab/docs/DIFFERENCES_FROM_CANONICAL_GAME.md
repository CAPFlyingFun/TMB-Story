# Important architectural differences

| Subject | Existing TRADDOMIUM, main (inspected 2026-11-02) | This handoff |
|---|---|---|
| Primary TOMBS plan | `src/world/tombs/plan.ts`, 6 rooms, ~26×26 m, pure procedural | Independent Draft C, 8 rooms, ~36×28 m, octagonal Array, U loop |
| Sarah's office | Not an independent room in original room ID union | Dedicated 6.5×5.5 m office |
| Equipment and break areas | Not separate plan rooms | Storage 5×4 m; Break 5×4 m |
| Security | Entrance hall | Dedicated 6×3 m vestibule and two doors |
| Renderer | Existing `LabView`, batched boxes, metric conversion applied per placement | Independent `buildLab` with InstancedMeshes, 1 metre = 1 unit |
| Island site | Surveyed `TOMBS_SITE` | None selected in module: reuse existing site after footprint check |
| Collisions | Existing `src/world/tombs/collide.ts` | Lightweight standalone wall/portal collision and walkable-footprint guard |
| People | Current Jack and Sarah GLBs, rigging and movement | Placeholder figures with named mounts |
| Story | Existing chapter-driven objects/voice and authored beats | A small set of named object interactions and original camera vignettes |
| Environment scaling | Existing island world/coords and floating-origin rules | New town-only root intended for careful adaptation, not an instant drop-in |

**Source authority:** The blueprint `assets/draft-c-approved-blueprint.png` and October 25 Technical Game Design Document define the architectural direction. The new coordinate manifest is a coherent procedural approximation pending Joshua's metric review. The two are **not** asserted to be pixel-perfect architectural matches.

**Do not assume this is ready for live game production**. Its preview engine intentionally does not implement current character animation, island heightfield, cloud saves, real NPC AI, approved audio, multiplayer or story quest scheduler.
