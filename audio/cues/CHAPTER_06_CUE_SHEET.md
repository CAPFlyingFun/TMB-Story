# Chapter 6: Someone Knew — SFX and ambience cue sheet

**Status: every cued asset is generated and cached.**

Generated from `audio/cues/chapter-06.json` and `audio/sfx-registry.json`, so
this document cannot drift from what the pipeline would actually play. Rebuild it
with `python3 scripts/render-cue-sheet.py 6`.

| | |
|---|---|
| Playback events | **11** |
| Unique assets | **6** (0 still to generate) |
| Chapter runtime as it plays today | 12:57 |
| Voice clips regenerated for this | **none** |

Events outnumber assets because sounds are reused: `sfx_keyboard_typing_short` x3, `sfx_system_notify_soft` x4.

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
| Sustain | loops to segment order 303 |
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
| Approx. review time | ~1:20 |

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
| Approx. review time | ~1:52 |

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
| Approx. review time | ~2:09 |

**Manuscript:** Narrator — “Jack advanced the recording until the grass began moving. The image shook as he returned to the vehicle.”

**Why:** Advancing the footage a frame at a time. Three dB under the chapter's other typing: this is one finger, not two hands working.

**Prompt:** `Continuous fast typing on a low-profile computer keyboard, microphone directly over the keys. Keystrokes landing without a gap for the whole recording, about six a second, each a crisp plastic click with the dense clatter of the key bed under it. No pauses, no fade in, no fade out. Filling the frame, recorded at a strong present level. No voices, no music, no beeping, no mouse clicks.`

### `ch06-040-calibration-records`

| | |
|---|---|
| Asset | `sfx_keyboard_typing_short` |
| Category | foley (sfx layer) |
| Anchor | segment order 83 · clip `narrator-cd12a3d3327b` · occurrence 1 |
| Timing | after |
| Gain | 0.23 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~3:44 |

**Manuscript:** Narrator — “Sarah noticed the new window.”

**Why:** Jack searching the original TOMBS calibration records for the scale target.

**Prompt:** `Continuous fast typing on a low-profile computer keyboard, microphone directly over the keys. Keystrokes landing without a gap for the whole recording, about six a second, each a crisp plastic click with the dense clatter of the key bed under it. No pauses, no fade in, no fade out. Filling the frame, recorded at a strong present level. No voices, no music, no beeping, no mouse clicks.`

### `ch06-050-parameter-block`

| | |
|---|---|
| Asset | `sfx_system_notify_soft` |
| Category | interface (sfx layer) |
| Anchor | segment order 95 · clip `narrator-a3ac616be3fd` · occurrence 1 |
| Timing | after |
| Gain | 0.03 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~4:24 |

**Manuscript:** Narrator — “Jack highlighted a surviving parameter block.”

**Why:** The surviving parameter block coming up: 'Target height normalization', the line that proves somebody chose how small.

**Prompt:** `A single electronic notification from a computer acting on its own, microphone close to the speaker. One rounded mid-range blip with a short clean tail, followed by a brief digital interface flourish, sounding once and not repeating. Filling the frame, recorded at a strong present level, with a little room around it. Not an alarm, no voices, no music.`

### `ch06-060-machine-data`

| | |
|---|---|
| Asset | `sfx_keyboard_typing_short` |
| Category | foley (sfx layer) |
| Anchor | segment order 203 · clip `narrator-b4f6f627bc1d` · occurrence 1 |
| Timing | before |
| Gain | 0.17 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~9:11 |

**Manuscript:** Narrator — “Lines of machine data filled the screen.”

**Why:** The maintenance partition opening, filling the screen with machine data the intruder did not erase.

**Prompt:** `Continuous fast typing on a low-profile computer keyboard, microphone directly over the keys. Keystrokes landing without a gap for the whole recording, about six a second, each a crisp plastic click with the dense clatter of the key bed under it. No pauses, no fade in, no fade out. Filling the frame, recorded at a strong present level. No voices, no music, no beeping, no mouse clicks.`

### `ch06-070-timestamp`

| | |
|---|---|
| Asset | `sfx_access_denied_tone` |
| Category | system (sfx layer) |
| Anchor | segment order 232 · clip `narrator-8bb6c152c79e` · occurrence 1 |
| Timing | before |
| Gain | 0.05 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~10:12 |

**Manuscript:** Narrator — “Lena looked at the boundary map and then back at the timestamp.”

**Why:** A single flat system tone as the creation time is checked against the island clock and the backup server. Not an alarm -- four dB down, and the same tone Chapter 1 uses when TOMBS refuses him -- because what it marks is a machine calmly confirming something nobody wants confirmed.

**Prompt:** `A system refusing a command. One short blunt descending two-note electronic rejection tone, flat and unsympathetic, close-mic with slight room. Final but not an alarm. No voices, no music, no siren.`

### `ch06-080-three-words`

| | |
|---|---|
| Asset | `sfx_system_notify_soft` |
| Category | interface (sfx layer) |
| Anchor | segment order 292 · clip `narrator-78184efa1ff6` · occurrence 1 |
| Timing | before |
| Gain | 0.02 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~12:26 |

**Manuscript:** Narrator — “Three words appeared on the screen.”

**Why:** 'Three words appeared on the screen.' The notify tone lands just before the narration, so the listener hears the screen answer and is then told what it said: PHASE ONE READY.

**Prompt:** `A single electronic notification from a computer acting on its own, microphone close to the speaker. One rounded mid-range blip with a short clean tail, followed by a brief digital interface flourish, sounding once and not repeating. Filling the frame, recorded at a strong present level, with a little room around it. Not an alarm, no voices, no music.`

### `ch06-090-something-struck`

| | |
|---|---|
| Asset | `sfx_distant_vibration_deep` |
| Category | system (sfx layer) |
| Anchor | segment order 298 · clip `narrator-f5344ff6ac69` · occurrence 1 |
| Timing | before |
| Gain | 0.17 |
| Duration requested | 6s |
| Reusable in Godot | yes |
| Approx. review time | ~12:37 |

**Manuscript:** Narrator — “Outside, something struck the distant ground.”

**Why:** 'Outside, something struck the distant ground.' The last sound of the movement and the loudest, +8 dB -- one step beyond the boundary vibration in Chapter 5, because the point of the ending is that it is still coming.

**Prompt:** `A deep vibration arriving from somewhere far outside a building and passing through it. Sub-bass swell with a slow approach and a slower departure, felt through the structure rather than heard as an event, like distant thunder with no crack. Recorded at a strong present level with real low end. No voices, no music, no impact.`

### `ch06-091-window-trembles`

| | |
|---|---|
| Asset | `sfx_building_shake` |
| Category | foley (sfx layer) |
| Anchor | segment order 299 · clip `narrator-80850872cb2d` · occurrence 1 |
| Timing | during +300ms |
| Gain | 0.08 |
| Duration requested | 4s |
| Reusable in Godot | yes |
| Approx. review time | ~12:40 |

**Manuscript:** Narrator — “The control-room window trembled.”

**Why:** 'The control-room window trembled.' The building's answer to it, under the line. Nothing sounds after this: the chapter ends on 'It had gone exactly the way someone planned', and that belongs to the narrator alone.

**Prompt:** `A building structure shuddering. Low-frequency rumble through a concrete floor with light fittings and loose equipment rattling above it, building and then easing. Interior perspective, recorded at a strong present level with real low end. No voices, no music, no collapse, no debris.`

## Unique assets

| Asset | Category | Loop | Secs | Events | Godot | State |
|---|---|---|---|---|---|---|
| `amb_computer_lab` | ambience | yes | 45.1 | 1 | yes | cached |
| `sfx_access_denied_tone` | system | no | 1.5 | 1 | yes | cached |
| `sfx_building_shake` | foley | no | 4 | 1 | yes | cached |
| `sfx_distant_vibration_deep` | system | no | 6 | 1 | yes | cached |
| `sfx_keyboard_typing_short` | foley | no | 3 | 3 | yes | cached |
| `sfx_system_notify_soft` | interface | no | 1.5 | 4 | yes | cached |

6 of 6 are reusable in Godot. The game decides when each one plays; this cue
sheet only decides when the audiobook plays it.
