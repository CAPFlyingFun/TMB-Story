# Chapter 1 laboratory stills — batch 1

Update: [batch 2](ch01-lab-batch-02.md) extends the approved sequence through Boundary Control, replacing this batch's final-image hold. This document retains the original batch-1 record.

Joshua approved this ten-image batch for repository integration on November 10, 2026. It follows the four existing island images. The retained amber-warning illustration is batch image 4; the other nine are the corrected workstation sequence approved afterward.

## Player behavior

The old null laboratory cue is replaced by the first approved Jack still. Ten script anchors follow the narration from entering the laboratory through the first red security warning. Existing decoded-image loading and direct 500ms crossfades are unchanged. The last approved image remains visible for the rest of the chapter until the next batch adds more cues; this batch does not illustrate the whole chapter. No manuscript, spoken text, audio exports, or audio manifests were edited.

| Batch image / WebP | Script cue |
| --- | --- |
| 1 / 005-jack-lab | Deep inside one of those laboratories |
| 2 / 006-jack-asleep | Jack sat slumped in his chair |
| 3 / 007-jack-first-chirp | A warning tone chirped from Jack's console |
| 4 / 008-jack-amber-warning | A second tone followed, within that narration segment |
| 5 / 009-jack-startled | Jack jerked awake |
| 6 / 010-jack-rubs-eyes | The warning repeated while Jack rubbed his eyes |
| 7 / 011-jack-unsolicited-windows | Several windows were opening and closing on their own |
| 8 / 012-jack-network-monitor | Jack grabbed the keyboard, within that narration segment |
| 9 / 013-jack-connection-vanishes | An unfamiliar connection appeared |
| 10 / 014-jack-red-warning | a red message, within He refreshed the display |

Cues use the currently selected reading's segment progress, not fixed chapter timestamps. As in the island sequence, phrase positions inside narration segments use approximate character-share timing, not word alignment. Future wording changes require revalidating these anchors against the updated manifest.

## Approved visual continuity for future batches

- Use the selected Draft C TOMBS plan: Jack's lab in the upper-left wing, Sarah's office across the facility, and the Array chamber in a separate room. The amber-warning still is the approved camera/set reference for this batch.
- Jack begins seated directly at his console within keyboard reach, arms folded, eyes shut, head tilted. Move his chair backward only at the scripted startle, then bring him forward as he rubs his eyes and investigates. Change cameras without rearranging the desk or room.
- Sarah's adjacent workstation has no chair; its monitor stays black until she powers it up later. Jack retrieves another chair from across the room after giving her his own. Her station is outside the framing of this batch.
- Jack's own paired monitors show diagnostics, then amber, then unsolicited windows/network activity, then the red warning. Do not confuse his paired screens with Sarah's separate powered-off computer.
- Keep the approved chestnut hair, beard, navy T-shirt, beige cargo trousers and dark watch. Sarah is not physically present yet. Her intercom and entrance moments belong to later batches.

The generated source PNGs are 1254 × 1254 square images. All ten WebPs retain those dimensions, converted at quality 90 without rescaling, totaling 2,091,850 bytes. The retained warning source is unchanged except for WebP encoding. Existing island images and their portrait extensions are unchanged.

## Validation

The 19 player tests pass, including the real fourteen-image cue sheet, island-to-lab transition, every lab cue in the active reading, backward seeking, phase boundaries for amber, typing and the red message, retained last image, loading failures, stale callbacks and the 500ms crossfade. All ten WebPs decode at the original square dimensions, and `git diff --check` passes. Independent review identified a red warning starting too early during the refresh narration; a failing cue-boundary regression reproduced it, and the cue now waits for the red-message phrase.

Historical browser checks and unrelated baseline failures are recorded in ch01-story-stills.md. Offline audio downloads still do not explicitly download the illustration batch.

Browser check for this batch: the Listen player displayed the new sleeping-Jack image after seeking into the lab and the retained amber-warning image at the second-tone narration. Both decoded at 1254 × 1254, and the settled current layer remained fully opaque after the direct crossfade. This check used the desktop preview; no new phone-device validation was performed for this asset-only update.
