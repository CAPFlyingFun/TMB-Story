# Chapter 1 laboratory stills — batch 2

Joshua approved images 11–20 and requested their push on November 10, 2026. This extends the Listen cue sheet from fourteen to twenty-four images, including the four island images. Both corrected Sarah illustrations use her anatomical right hand at the intercom and left hand on her lap. The first Jack intercom image uses the corrected TOMBS directory screen. Superseded hand poses and the incorrect network-screen version are not included.

| Batch image / WebP | Script anchor |
| --- | --- |
| 11 / 015-jack-access-logs | pulled up the laboratory access logs, within Jack entered a command |
| 12 / 016-tombs-directory | a directory opened by itself, within The system beeped |
| 13 / 017-terminal-locked | The screen went black, within He immediately locked the terminal |
| 14 / 018-terminal-reopened | then came back on, within that same segment |
| 15 / 019-jack-intercom | He reached for the intercom |
| 16 / 020-sarah-intercom | Sarah's voice came through the speaker |
| 17 / 021-jack-intercom-network | Jack reopened the network monitor |
| 18 / 022-sarah-good-answer | Sarah laughed softly through the speaker |
| 19 / 023-jack-who-are-you | Jack released the intercom and looked back at the monitor |
| 20 / 024-boundary-control | a file opened, within Jack froze as a file opened |

Sarah appears in her separate Draft C office during the intercom conversation; she has not entered Jack's lab in this batch. Her tablet stays on her desk. The station reserved for her in Jack's lab remains chairless and powered off. Jack stays within keyboard reach, and his paired monitors/intercom retain their approved arrangement.

All ten approved PNGs were converted to quality-90 WebP without resizing: 1254 × 1254 each, 2,109,602 bytes total. Existing images, player logic, 500ms decoded-image crossfades, manuscript and audio are unchanged. The last Boundary Control still holds for the unfinished remainder of the chapter until the next approved batch adds Sarah's entrance and their shared lab scene.

Phrase cuts are approximate character-share positions within the active reading's narration segment. They are not word-aligned timings. The monitor-black image is an illustrated terminal state with the room still lit; it is not a black player frame or a null-cover fallback.

## Validation and deployment diagnosis

All nineteen player tests pass. The real cue-sheet check now covers twenty-four ordered anchors, both cuts inside the lock/reopen segment, Sarah's first appearance at her response cue, file existence, and the last-frame hold. The active-reading integration check traverses every lab cue and backward seeks. All ten WebPs decode at their original dimensions, and diff whitespace checks pass.

The previous commit b675578 reached main and its Pages build/artifact upload succeeded. Pages run 42844406268 failed in the deploy step after the ten-minute actions/deploy-pages timeout while status remained syncing_files. Its artifact was 560,072,346 bytes; the preceding successful run's was 557,976,265 bytes. No script/image validation failure was reported. This batch leaves infrastructure unchanged and triggers a new publishing attempt; its deployment result must be checked separately from the successful repository push.
