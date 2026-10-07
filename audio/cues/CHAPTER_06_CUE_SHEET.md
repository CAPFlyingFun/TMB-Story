# Chapter 6: Several Millimeters — SFX and ambience cue sheet

**Status: every cued asset is generated and cached.**

Generated from `audio/cues/chapter-06.json` and `audio/sfx-registry.json`, so
this document cannot drift from what the pipeline would actually play. Rebuild it
with `python3 scripts/render-cue-sheet.py 6`.

| | |
|---|---|
| Playback events | **6** |
| Unique assets | **3** (0 still to generate) |
| Chapter runtime as it plays today | 7:57 |
| Voice clips regenerated for this | **none** |

Events outnumber assets because sounds are reused: `sfx_keyboard_typing_short` x2, `sfx_system_notify_soft` x3.

## How to read the anchor column

**Timestamps are for your ear only and are not the synchronisation mechanism.** A
cue is anchored to a voice segment's clip identity plus which occurrence of that
clip it is, so regenerating a voice clip or inserting a paragraph moves the clock
and moves nothing about the cue sheet. The times below were measured from the
clips as they stand today and drift the moment any voice is recast.

`before` plays in the gap ahead of the line, `after` in the gap behind it,
`during +Nms` starts N milliseconds into the line. A sustained cue runs from its
anchor to its stop anchor and loops underneath.

## Cues

### `ch06-005-control-room`

| | |
|---|---|
| Asset | `amb_computer_lab` |
| Category | ambience (ambience layer) |
| Anchor | segment order 0 · clip `narrator-a2dfc5c78254` · occurrence 1 |
| Timing | before |
| Sustain | loops to segment order 173 |
| Gain | 0.12 |
| Fades | in 2500ms · out 5000ms |
| Duration requested | 45.1s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~0:00 |

**Manuscript:** Narrator — “Jack watched the southern camera feed all the way back to the laboratory.”

**Why:** Back in the laboratory for the whole chapter. The bed returns as the vehicle arrives, which closes the round trip Chapter 5 opened.

**Prompt:** `(hand-supplied asset; no prompt)`

### `ch06-010-sensor-connected`

| | |
|---|---|
| Asset | `sfx_system_notify_soft` |
| Category | interface (sfx layer) |
| Anchor | segment order 29 · clip `narrator-7c3a78817f70` · occurrence 1 |
| Timing | after |
| Gain | 0.03 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~1:19 |

**Manuscript:** Narrator — “Jack ignored both of them and connected the environmental sensor to the console.”

**Why:** The environmental sensor reading out into the console.

**Prompt:** `A single electronic notification from a computer acting on its own, microphone close to the speaker. One rounded mid-range blip with a short clean tail, followed by a brief digital interface flourish, sounding once and not repeating. Filling the frame, recorded at a strong present level, with a little room around it. Not an alarm, no voices, no music.`

### `ch06-020-recording-uploads`

| | |
|---|---|
| Asset | `sfx_system_notify_soft` |
| Category | interface (sfx layer) |
| Anchor | segment order 42 · clip `narrator-0857837994e5` · occurrence 1 |
| Timing | during +1500ms |
| Gain | 0.03 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~1:51 |

**Manuscript:** Narrator — “Jack uploaded the wrist-camera recording from the perimeter. The image of the enormous fingernail clipping appeared on the main screen.”

**Why:** The wrist-camera recording arriving on the main screen, with the fingernail clipping on it.

**Prompt:** `A single electronic notification from a computer acting on its own, microphone close to the speaker. One rounded mid-range blip with a short clean tail, followed by a brief digital interface flourish, sounding once and not repeating. Filling the frame, recorded at a strong present level, with a little room around it. Not an alarm, no voices, no music.`

### `ch06-030-frame-by-frame`

| | |
|---|---|
| Asset | `sfx_keyboard_typing_short` |
| Category | foley (sfx layer) |
| Anchor | segment order 47 · clip `narrator-e5d219e3eb1c` · occurrence 1 |
| Timing | during +600ms |
| Gain | 0.17 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~2:07 |

**Manuscript:** Narrator — “Jack advanced the recording until the grass began moving. The image shook as he returned to the vehicle.”

**Why:** Advancing the footage a frame at a time. Three dB under the chapter's other typing: this is one finger, not two hands working.

**Prompt:** `Continuous fast typing on a low-profile computer keyboard, microphone directly over the keys. Keystrokes landing without a gap for the whole recording, about six a second, each a crisp plastic click with the dense clatter of the key bed under it. No pauses, no fade in, no fade out. Filling the frame, recorded at a strong present level. No voices, no music, no beeping, no mouse clicks.`

### `ch06-040-calibration-records`

| | |
|---|---|
| Asset | `sfx_keyboard_typing_short` |
| Category | foley (sfx layer) |
| Anchor | segment order 82 · clip `narrator-cd12a3d3327b` · occurrence 1 |
| Timing | after |
| Gain | 0.23 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~3:41 |

**Manuscript:** Narrator — “Sarah noticed the new window.”

**Why:** Jack searching the original TOMBS calibration records for the scale target.

**Prompt:** `Continuous fast typing on a low-profile computer keyboard, microphone directly over the keys. Keystrokes landing without a gap for the whole recording, about six a second, each a crisp plastic click with the dense clatter of the key bed under it. No pauses, no fade in, no fade out. Filling the frame, recorded at a strong present level. No voices, no music, no beeping, no mouse clicks.`

### `ch06-050-parameter-block`

| | |
|---|---|
| Asset | `sfx_system_notify_soft` |
| Category | interface (sfx layer) |
| Anchor | segment order 94 · clip `narrator-a3ac616be3fd` · occurrence 1 |
| Timing | after |
| Gain | 0.03 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~4:21 |

**Manuscript:** Narrator — “Jack highlighted a surviving parameter block.”

**Why:** The surviving parameter block coming up: 'Target height normalization', the line that proves somebody chose how small.

**Prompt:** `A single electronic notification from a computer acting on its own, microphone close to the speaker. One rounded mid-range blip with a short clean tail, followed by a brief digital interface flourish, sounding once and not repeating. Filling the frame, recorded at a strong present level, with a little room around it. Not an alarm, no voices, no music.`

## Unique assets

| Asset | Category | Loop | Secs | Events | Godot | State |
|---|---|---|---|---|---|---|
| `amb_computer_lab` | ambience | yes | 45.1 | 1 | yes | cached |
| `sfx_keyboard_typing_short` | foley | no | 3 | 2 | yes | cached |
| `sfx_system_notify_soft` | interface | no | 1.5 | 3 | yes | cached |

3 of 3 are reusable in Godot. The game decides when each one plays; this cue
sheet only decides when the audiobook plays it.
