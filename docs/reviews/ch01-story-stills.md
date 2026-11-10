# Chapter 1 opening stills — November 10, 2026

Update: the next approved ten-image lab sequence now replaces the cover fallback described below. See [ch01-lab-batch-01.md](ch01-lab-batch-01.md) for current cues and continuity. This report retains the original opening integration record.

The Listen player switches the four reviewed island illustrations on script cues and crossfades directly to the next decoded image over 500ms. It returns to the previous laboratory cover when the narration enters the lab. Audio and manuscript files are unchanged.

| Image | Cue |
| --- | --- |
| 001 island wide | Opening date line |
| 002 island approach | “The island stretched” |
| 003 settlement distant | “but most of it remained” |
| 004 settlement close | “Near its center” |
| Existing lab cover | “Deep inside one of those laboratories” |

The third image is the revised view matching the closer settlement architecture. The four wide WebPs retain their original 1672 × 941 resolution and total 1,200,644 bytes. Four approved 1024 × 1536 portrait extensions fill the phone's image frame. The player uses centered cover sizing and a matching wide frame in landscape. New image authoring follows docs/ILLUSTRATION_GUIDE.md: square masters with a central 50–55% safe action region.

## Adding the next batch

Add WebPs under assets/story/ch01 and append/replace cues in reader/shots/chapter-01.json. Each cue has an id, at.line (a unique prefix of an audio manifest segment), optional at.phrase within that segment, src and alt. A null src restores the chapter cover. Use at.nth only when deliberately choosing among repeated matching lines. Unresolved anchors fail safely to the cover rather than silently selecting unrelated art.

The player resolves segment progress using the active audio reading's timing, or the current clip duration in clip mode. Within a long narration segment, phrase timing is estimated from its character position, as in the existing Watch timeline. It is not word-aligned. A future word-timed index could make those cuts more precise without changing the artistic sequence.

## Verification

- node --test scripts/tests/story-shots.test.cjs scripts/tests/player-story-state.test.cjs scripts/tests/shot-frames.test.cjs — 18 checks pass.
- JavaScript syntax checks, WebP decoding and git diff --check pass.
- Supported browser QA: displayed all four images, played the actual Chapter 1 export, checked paused seeking, lab fallback, the revised third view, narrow-screen composition and the Chapter 2 cover fallback.
- Independent review found a paused-seek/reading-switch clock issue. Added a failing regression, then guarded export indexing against an unloaded or previous audio source; regression and complete new test suite pass.
- Existing scripts/verify-player.js fails before this change because its fake view lacks querySelectorAll. Existing scripts/verify-layers.js has two unchanged failures: the lab bed's expected last segment is 184 while the current cue stops at 181, and the associated single-element assumption. These legacy checks need a separate update.

Image loading is independent of audio. Missing files retain the current story frame; a late response cannot replace the selected frame after a seek or chapter switch. The artwork nodes are retained across pause, seek and speed-control rebuilds so their pixels and in-progress fades are not cleared. Only Chapter 1 currently has a shot list. Offline audio downloads do not explicitly download this illustration batch.

Follow-up review: a decode-failure handoff could leave an opaque overlay active. A failing regression reproduced it; the presenter now promotes the decoded incoming node instead of copying its source into another image. The retired node is hidden before reuse. Portrait 390 × 844 and landscape 844 × 390 / 667 × 375 were checked in the supported browser; the narrow layout has no horizontal overflow, and the current image stayed opaque during a speed change midway through a fade.
