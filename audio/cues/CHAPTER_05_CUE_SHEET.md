# Chapter 5: The Edge — SFX and ambience cue sheet

**Status: every cued asset is generated and cached.**

Generated from `audio/cues/chapter-05.json` and `audio/sfx-registry.json`, so
this document cannot drift from what the pipeline would actually play. Rebuild it
with `python3 scripts/render-cue-sheet.py 5`.

| | |
|---|---|
| Playback events | **14** |
| Unique assets | **11** (0 still to generate) |
| Chapter runtime as it plays today | 13:31 |
| Voice clips regenerated for this | **none** |

Events outnumber assets because sounds are reused: `sfx_distant_vibration_deep` x2, `sfx_system_notify_soft` x2, `sfx_wrist_terminal_chirp` x2.

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

### `ch05-005-control-room`

| | |
|---|---|
| Asset | `amb_computer_lab` |
| Category | ambience (ambience layer) |
| Anchor | segment order 3 · clip `narrator-ecedb483a4db` · occurrence 1 |
| Timing | before |
| Sustain | loops to segment order 180 |
| Gain | 0.12 |
| Fades | in 2500ms · out 3000ms |
| Duration requested | 45.1s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~0:25 |

**Manuscript:** Narrator — “Jack stood over the main control console with a cup of coffee he had forgotten to drink. The incident map was crowded with reports, but there had been no mass panic and, so far, no serious injuries.”

**Why:** The control room again, and it STOPS when Jack gets into the vehicle. A bed that followed him outdoors would say the room came with him, which is exactly the thing this chapter is about not being true any more.

**Prompt:** `(hand-supplied asset; no prompt)`

### `ch05-020-broadcast-open`

| | |
|---|---|
| Asset | `sfx_intercom_open` |
| Category | interface (sfx layer) |
| Anchor | segment order 21 · clip `narrator-6ba4c994a0eb` · occurrence 1 |
| Timing | after |
| Gain | 0.05 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~1:39 |

**Manuscript:** Narrator — “He opened the settlement broadcast controls.”

**Why:** 'He opened the settlement broadcast controls.' The same intercom the lab uses, because it is the settlement's own system -- and it is the first time in the story anyone addresses the whole town.

**Prompt:** `An intercom being keyed on. A firm mechanical button press followed immediately by a small electrical pop and the channel opening into a thin live speaker hiss. Close-mic, tactile. No voices, no speech, no music, no tones.`

### `ch05-021-transmit`

| | |
|---|---|
| Asset | `sfx_console_tone_soft` |
| Category | interface (sfx layer) |
| Anchor | segment order 35 · clip `narrator-a48183c13a91` · occurrence 1 |
| Timing | during +2200ms |
| Gain | 0.07 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~2:05 |

**Manuscript:** Narrator — “Jack looked through the reinforced window toward the silent array. Then he pressed transmit.”

**Why:** 'Then he pressed transmit.' One small tone under the last word of the beat, so the announcement begins on a machine rather than on a breath.

**Prompt:** `A two-tone electronic blip from a laboratory console, microphone close to the speaker. Two rounded mid-range notes with a clean decay, synthetic and warm rather than piercing, sounding once and not repeating. Filling the frame, recorded at a strong present level, with a little room reflection. No alarm, no siren, no voices, no music.`

### `ch05-022-broadcast-close`

| | |
|---|---|
| Asset | `sfx_intercom_close` |
| Category | interface (sfx layer) |
| Anchor | segment order 41 · clip `narrator-07b6f90af556` · occurrence 1 |
| Timing | after |
| Gain | 0.03 |
| Duration requested | 1s |
| Reusable in Godot | yes |
| Approx. review time | ~2:59 |

**Manuscript:** Narrator — “Jack ended the broadcast.”

**Why:** 'Jack ended the broadcast.' The silence after it is doing the work, so nothing else sounds here.

**Prompt:** `An intercom channel closing. A light mechanical release click and the live speaker hiss cutting away to room silence. Close-mic, small and final. No voices, no speech, no music, no tones.`

### `ch05-030-lena-call`

| | |
|---|---|
| Asset | `sfx_wrist_terminal_chirp` |
| Category | interface (sfx layer) |
| Anchor | segment order 50 · clip `narrator-6d37e43f62b9` · occurrence 1 |
| Timing | before |
| Gain | 0.04 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~3:17 |

**Manuscript:** Narrator — “A call indicator appeared on Jack's console. Lena had left the utility station after another technician relieved her and joined the emergency coordination channel from a secure room closer to the center of town.”

**Why:** 'A call indicator appeared on Jack's console.' Lena, from the emergency coordination channel.

**Prompt:** `An incoming call alert on a small wrist-worn device. Two rising electronic notes with a short clean decay, close to the microphone, recorded at a strong present level with plenty of body. Distinct from a desk console: smaller, tighter, worn on a person. No voices, no music, no alarm.`

### `ch05-031-coordination-channel`

| | |
|---|---|
| Asset | `amb_intercom_channel_open` |
| Category | ambience (ambience layer) |
| Anchor | segment order 50 · clip `narrator-6d37e43f62b9` · occurrence 1 |
| Timing | after |
| Sustain | loops to segment order 116 |
| Gain | 0.01 |
| Fades | in 400ms · out 1500ms |
| Duration requested | 10s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~3:17 |

**Manuscript:** Narrator — “A call indicator appeared on Jack's console. Lena had left the utility station after another technician relieved her and joined the emergency coordination channel from a secure room closer to the center of town.”

**Why:** Held open through the water estimate and the vibration map, closing on the knock at the door -- which is where Lena stops being a voice and walks in.

**Prompt:** `An intercom speaker with the line open and nobody talking, microphone right at the grille. Narrow-band electrical hiss with a steady carrier hum under it, band-limited and boxy the way a small wall-mounted speaker colours everything. Filling the frame, recorded at a strong present level. Even throughout so it loops. No voices, no speech, no music, no clicks, no tones.`

### `ch05-040-building-vibrates`

| | |
|---|---|
| Asset | `sfx_distant_vibration_deep` |
| Category | system (sfx layer) |
| Anchor | segment order 73 · clip `narrator-b83ab5a146d3` · occurrence 1 |
| Timing | before |
| Gain | 0.11 |
| Duration requested | 6s |
| Reusable in Godot | yes |
| Approx. review time | ~4:24 |

**Manuscript:** Narrator — “Then the building vibrated again.”

**Why:** 'Then the building vibrated again.' It arrives on the one light moment in the movement, mid-laugh, and takes it away. Carried over at Chapter 4's loudest level because it is the same thing, no nearer yet.

**Prompt:** `A deep vibration arriving from somewhere far outside a building and passing through it. Sub-bass swell with a slow approach and a slower departure, felt through the structure rather than heard as an event, like distant thunder with no crack. Recorded at a strong present level with real low end. No voices, no music, no impact.`

### `ch05-050-knock`

| | |
|---|---|
| Asset | `sfx_lab_door_slide` |
| Category | foley (sfx layer) |
| Anchor | segment order 119 · clip `narrator-2b548f3e754e` · occurrence 1 |
| Timing | before |
| Gain | 0.02 |
| Duration requested | 2.5s |
| Reusable in Godot | yes |
| Approx. review time | ~6:36 |

**Manuscript:** Narrator — “Lena stepped through when the door opened and held up both hands.”

**Why:** The control-room door opening for Lena and the two officers. The knock itself has no asset and is left to the prose; what is heard is the door, which is the part that changes the room.

**Prompt:** `An automatic laboratory door sliding open. A soft pneumatic release, a smooth mechanical glide along a track, and a light settling clunk as it reaches the end of its travel. Clean modern facility, close but with room reflection behind it. No voices, no music, no alarm.`

### `ch05-060-camera-feeds`

| | |
|---|---|
| Asset | `sfx_system_notify_soft` |
| Category | interface (sfx layer) |
| Anchor | segment order 137 · clip `narrator-fe59c3c50ed5` · occurrence 1 |
| Timing | after |
| Gain | 0.03 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~7:32 |

**Manuscript:** Narrator — “Jack looked at the camera feeds. The southern boundary had better lighting than the east and no recent vibration reports.”

**Why:** Jack checking the southern boundary feeds before agreeing to go.

**Prompt:** `A single electronic notification from a computer acting on its own, microphone close to the speaker. One rounded mid-range blip with a short clean tail, followed by a brief digital interface flourish, sounding once and not repeating. Filling the frame, recorded at a strong present level, with a little room around it. Not an alarm, no voices, no music.`

### `ch05-100-night-outside`

| | |
|---|---|
| Asset | `amb_night_outside` |
| Category | ambience (ambience layer) |
| Anchor | segment order 180 · clip `narrator-0dd40c74284b` · occurrence 1 |
| Timing | before |
| Sustain | loops to segment order 265 |
| Gain | 0.16 |
| Fades | in 3500ms · out 2500ms |
| Duration requested | 180.07s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~9:12 |

**Manuscript:** Narrator — “The southern perimeter was less than five minutes away by utility vehicle. Jack rode with the two security officers while Sarah and Lena remained connected through his wrist terminal.”

**Why:** THE FIRST TIME THE STORY GOES OUTSIDE AT THE NEW SCALE, and it uses the night ambience Joshua supplied. It has to be quiet and ordinary -- crickets, air, a night like any other -- because the horror of the scene is that it SOUNDS normal while a blade of grass stands over a man. Runs to the end of the chapter, through the drive back.

**Prompt:** `(hand-supplied asset; no prompt)`

### `ch05-110-sensor-readings`

| | |
|---|---|
| Asset | `sfx_wrist_terminal_chirp` |
| Category | interface (sfx layer) |
| Anchor | segment order 187 · clip `narrator-7e7f414a1666` · occurrence 1 |
| Timing | after |
| Gain | 0.02 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~9:49 |

**Manuscript:** Narrator — “The nearest blade of grass towered over him. Its base was wider than his torso, and fine hairs along its surface looked like stiff branches. A ridge of soil beyond the pavement rose several stories above the road.”

**Why:** The environmental sensor taking its first reading at the boundary. Six dB under the other terminal chirps: outdoors, in the open, a small instrument in one hand.

**Prompt:** `An incoming call alert on a small wrist-worn device. Two rising electronic notes with a short clean decay, close to the microphone, recorded at a strong present level with plenty of body. Distinct from a desk console: smaller, tighter, worn on a person. No voices, no music, no alarm.`

### `ch05-120-flashlight-finds-it`

| | |
|---|---|
| Asset | `sfx_system_notify_soft` |
| Category | interface (sfx layer) |
| Anchor | segment order 229 · clip `narrator-a9df6306c7cd` · occurrence 1 |
| Timing | after |
| Gain | 0.02 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~11:50 |

**Manuscript:** Narrator — “Jack zoomed his wrist camera.”

**Why:** Jack zooming the wrist camera onto the pale object. Quiet, because the next sound in the scene should be nothing at all -- 'Nobody spoke for several seconds' is four beats away.

**Prompt:** `A single electronic notification from a computer acting on its own, microphone close to the speaker. One rounded mid-range blip with a short clean tail, followed by a brief digital interface flourish, sounding once and not repeating. Filling the frame, recorded at a strong present level, with a little room around it. Not an alarm, no voices, no music.`

### `ch05-130-vibration-close`

| | |
|---|---|
| Asset | `sfx_distant_vibration_deep` |
| Category | system (sfx layer) |
| Anchor | segment order 247 · clip `narrator-57ba1779f3a7` · occurrence 1 |
| Timing | before |
| Gain | 0.15 |
| Duration requested | 6s |
| Reusable in Godot | yes |
| Approx. review time | ~12:38 |

**Manuscript:** Narrator — “A vibration rolled through the ground.”

**Why:** 'A vibration rolled through the ground.' The loudest in the movement so far, +7 dB, and the first one heard from OUTSIDE a building rather than through a floor. This is the moment the thing stops being a report.

**Prompt:** `A deep vibration arriving from somewhere far outside a building and passing through it. Sub-bass swell with a slow approach and a slower departure, felt through the structure rather than heard as an event, like distant thunder with no crack. Recorded at a strong present level with real low end. No voices, no music, no impact.`

### `ch05-140-vehicle-away`

| | |
|---|---|
| Asset | `sfx_building_shake` |
| Category | foley (sfx layer) |
| Anchor | segment order 264 · clip `narrator-a09ea1792947` · occurrence 1 |
| Timing | during +200ms |
| Gain | 0.03 |
| Duration requested | 4s |
| Reusable in Godot | yes |
| Approx. review time | ~13:26 |

**Manuscript:** Narrator — “The vehicle accelerated away from the boundary.”

**Why:** 'The vehicle accelerated away from the boundary.' A low body of sound under the line rather than an engine, which the library does not have. Eight dB down: it is a departure, not an event, and the chapter's last line belongs to the grass still moving behind them.

**Prompt:** `A building structure shuddering. Low-frequency rumble through a concrete floor with light fittings and loose equipment rattling above it, building and then easing. Interior perspective, recorded at a strong present level with real low end. No voices, no music, no collapse, no debris.`

## Unique assets

| Asset | Category | Loop | Secs | Events | Godot | State |
|---|---|---|---|---|---|---|
| `amb_computer_lab` | ambience | yes | 45.1 | 1 | yes | cached |
| `amb_intercom_channel_open` | ambience | yes | 10 | 1 | yes | cached |
| `amb_night_outside` | ambience | yes | 180.07 | 1 | yes | cached |
| `sfx_building_shake` | foley | no | 4 | 1 | yes | cached |
| `sfx_console_tone_soft` | interface | no | 1.5 | 1 | yes | cached |
| `sfx_distant_vibration_deep` | system | no | 6 | 2 | yes | cached |
| `sfx_intercom_close` | interface | no | 1 | 1 | yes | cached |
| `sfx_intercom_open` | interface | no | 1.5 | 1 | yes | cached |
| `sfx_lab_door_slide` | foley | no | 2.5 | 1 | yes | cached |
| `sfx_system_notify_soft` | interface | no | 1.5 | 2 | yes | cached |
| `sfx_wrist_terminal_chirp` | interface | no | 1.5 | 2 | yes | cached |

11 of 11 are reusable in Godot. The game decides when each one plays; this cue
sheet only decides when the audiobook plays it.
