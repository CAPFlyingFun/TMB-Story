# Chapter 4: The First Calls — SFX and ambience cue sheet

**Status: every cued asset is generated and cached.**

Generated from `audio/cues/chapter-04.json` and `audio/sfx-registry.json`, so
this document cannot drift from what the pipeline would actually play. Rebuild it
with `python3 scripts/render-cue-sheet.py 4`.

| | |
|---|---|
| Playback events | **18** |
| Unique assets | **9** (0 still to generate) |
| Chapter runtime as it plays today | 10:39 |
| Voice clips regenerated for this | **none** |

Events outnumber assets because sounds are reused: `amb_intercom_channel_open` x3, `sfx_distant_vibration_deep` x4, `sfx_intercom_close` x2, `sfx_system_notify_soft` x2, `sfx_wrist_terminal_chirp` x3.

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

### `ch04-005-control-room`

| | |
|---|---|
| Asset | `amb_computer_lab` |
| Category | ambience (ambience layer) |
| Anchor | segment order 0 · clip `narrator-16633fc3a0e5` · occurrence 1 |
| Timing | before |
| Sustain | loops to segment order 194 |
| Gain | 0.12 |
| Fades | in 2000ms · out 4000ms |
| Duration requested | 45.1s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~0:00 |

**Manuscript:** Narrator — “The first call arrived before Jack could let go of Sarah's hand.”

**Why:** The same room Chapter 3 ended in, and the chapter never leaves it. It carries straight through three calls and four vibrations, which is what makes the vibrations read as something arriving from outside a room rather than as the room changing.

**Prompt:** `(hand-supplied asset; no prompt)`

### `ch04-010-answer-first-call`

| | |
|---|---|
| Asset | `sfx_wrist_terminal_chirp` |
| Category | interface (sfx layer) |
| Anchor | segment order 7 · clip `narrator-966cd55a8eb9` · occurrence 1 |
| Timing | before |
| Gain | 0.04 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~0:38 |

**Manuscript:** Narrator — “He answered the call.”

**Why:** The connect tone as Jack answers. DELIBERATELY NOT ON THE LINE ABOVE IT: the manuscript says the terminal VIBRATED against his skin, and a chirp there would contradict the sentence and the whole point of the scene, which is that this catastrophe does not announce itself.

**Prompt:** `An incoming call alert on a small wrist-worn device. Two rising electronic notes with a short clean decay, close to the microphone, recorded at a strong present level with plenty of body. Distinct from a desk console: smaller, tighter, worn on a person. No voices, no music, no alarm.`

### `ch04-015-lena-channel`

| | |
|---|---|
| Asset | `amb_intercom_channel_open` |
| Category | ambience (ambience layer) |
| Anchor | segment order 9 · clip `narrator-38fe6a375dd7` · occurrence 1 |
| Timing | before |
| Sustain | loops to segment order 45 |
| Gain | 0.01 |
| Fades | in 300ms · out 900ms |
| Duration requested | 10s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~0:41 |

**Manuscript:** Narrator — “Lena's voice came through quietly.”

**Why:** An open channel under Lena's call, as in Chapters 1 and 3. It ends when the second call arrives, because the line is handed to Sarah's tablet there.

**Prompt:** `An intercom speaker with the line open and nobody talking, microphone right at the grille. Narrow-band electrical hiss with a steady carrier hum under it, band-limited and boxy the way a small wall-mounted speaker colours everything. Filling the frame, recorded at a strong present level. Even throughout so it loops. No voices, no speech, no music, no clicks, no tones.`

### `ch04-020-utility-cameras`

| | |
|---|---|
| Asset | `sfx_system_notify_soft` |
| Category | interface (sfx layer) |
| Anchor | segment order 29 · clip `narrator-9994bf580737` · occurrence 1 |
| Timing | after |
| Gain | 0.03 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~1:37 |

**Manuscript:** Narrator — “Jack brought up the utility station's exterior cameras.”

**Why:** Bringing up the utility station's exterior cameras. The same notify tone the first three chapters use for a screen answering a request.

**Prompt:** `A single electronic notification from a computer acting on its own, microphone close to the speaker. One rounded mid-range blip with a short clean tail, followed by a brief digital interface flourish, sounding once and not repeating. Filling the frame, recorded at a strong present level, with a little room around it. Not an alarm, no voices, no music.`

### `ch04-030-second-call`

| | |
|---|---|
| Asset | `sfx_wrist_terminal_chirp` |
| Category | interface (sfx layer) |
| Anchor | segment order 45 · clip `narrator-1a17f7f63618` · occurrence 1 |
| Timing | before |
| Gain | 0.04 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~2:36 |

**Manuscript:** Narrator — “A second call appeared on Jack's terminal.”

**Why:** The medical centre calling in. This one IS an arriving call, so the chirp is what the sentence says.

**Prompt:** `An incoming call alert on a small wrist-worn device. Two rising electronic notes with a short clean decay, close to the microphone, recorded at a strong present level with plenty of body. Distinct from a desk console: smaller, tighter, worn on a person. No voices, no music, no alarm.`

### `ch04-035-medical-channel`

| | |
|---|---|
| Asset | `amb_intercom_channel_open` |
| Category | ambience (ambience layer) |
| Anchor | segment order 49 · clip `narrator-a0a1327af7a1` · occurrence 1 |
| Timing | before |
| Sustain | loops to segment order 82 |
| Gain | 0.01 |
| Fades | in 400ms · out 1200ms |
| Duration requested | 10s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~2:45 |

**Manuscript:** Narrator — “Jack transferred Lena to Sarah's tablet and answered. The medical center sounded strangely normal in the background: ventilation, distant footsteps, a cart rolling over tile.”

**Why:** Doctor Mercer's line, open from the moment Jack answers until 'The call ended'. The manuscript describes the medical centre sounding strangely normal behind her, and a bare open channel is that: a room that has not heard yet.

**Prompt:** `An intercom speaker with the line open and nobody talking, microphone right at the grille. Narrow-band electrical hiss with a steady carrier hum under it, band-limited and boxy the way a small wall-mounted speaker colours everything. Filling the frame, recorded at a strong present level. Even throughout so it loops. No voices, no speech, no music, no clicks, no tones.`

### `ch04-036-medical-call-ends`

| | |
|---|---|
| Asset | `sfx_intercom_close` |
| Category | interface (sfx layer) |
| Anchor | segment order 82 · clip `narrator-e3336da71c28` · occurrence 1 |
| Timing | after |
| Gain | 0.03 |
| Duration requested | 1s |
| Reusable in Godot | yes |
| Approx. review time | ~4:34 |

**Manuscript:** Narrator — “The call ended.”

**Why:** 'The call ended.' A close on the sentence that says so.

**Prompt:** `An intercom channel closing. A light mechanical release click and the live speaker hiss cutting away to room silence. Close-mic, small and final. No voices, no speech, no music, no tones.`

### `ch04-040-security-channel-open`

| | |
|---|---|
| Asset | `sfx_intercom_open` |
| Category | interface (sfx layer) |
| Anchor | segment order 91 · clip `narrator-ec959f4dbe3a` · occurrence 1 |
| Timing | before |
| Gain | 0.05 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~5:00 |

**Manuscript:** Narrator — “Jack opened the channel.”

**Why:** 'Jack opened the channel.' Security, on the settlement net rather than his wrist, so it gets the intercom rather than the terminal chirp.

**Prompt:** `An intercom being keyed on. A firm mechanical button press followed immediately by a small electrical pop and the channel opening into a thin live speaker hiss. Close-mic, tactile. No voices, no speech, no music, no tones.`

### `ch04-041-security-channel`

| | |
|---|---|
| Asset | `amb_intercom_channel_open` |
| Category | ambience (ambience layer) |
| Anchor | segment order 91 · clip `narrator-ec959f4dbe3a` · occurrence 1 |
| Timing | after |
| Sustain | loops to segment order 105 |
| Gain | 0.01 |
| Fades | in 250ms · out 700ms |
| Duration requested | 10s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~5:00 |

**Manuscript:** Narrator — “Jack opened the channel.”

**Why:** Held open across the exchange with Unit Twelve, closing on 'The channel closed.'

**Prompt:** `An intercom speaker with the line open and nobody talking, microphone right at the grille. Narrow-band electrical hiss with a steady carrier hum under it, band-limited and boxy the way a small wall-mounted speaker colours everything. Filling the frame, recorded at a strong present level. Even throughout so it loops. No voices, no speech, no music, no clicks, no tones.`

### `ch04-042-security-channel-close`

| | |
|---|---|
| Asset | `sfx_intercom_close` |
| Category | interface (sfx layer) |
| Anchor | segment order 105 · clip `narrator-2fb1e7b6491e` · occurrence 1 |
| Timing | after |
| Gain | 0.03 |
| Duration requested | 1s |
| Reusable in Godot | yes |
| Approx. review time | ~5:39 |

**Manuscript:** Narrator — “The channel closed.”

**Why:** The channel closing, and with it the last voice from outside the building before the settlement's first porch lights come on.

**Prompt:** `An intercom channel closing. A light mechanical release click and the live speaker hiss cutting away to room silence. Close-mic, small and final. No voices, no speech, no music, no tones.`

### `ch04-050-divide-the-screens`

| | |
|---|---|
| Asset | `sfx_keyboard_typing_short` |
| Category | foley (sfx layer) |
| Anchor | segment order 121 · clip `narrator-aea5703667cd` · occurrence 1 |
| Timing | during +900ms |
| Gain | 0.23 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~6:35 |

**Manuscript:** Narrator — “They divided the screens between them. Sarah began organizing incoming reports by medical, structural, and utility priority while Jack opened the settlement's infrastructure schematic.”

**Why:** Two people settling into work. It is the only ordinary sound in the chapter and it is there so the vibration that follows has something to interrupt.

**Prompt:** `Continuous fast typing on a low-profile computer keyboard, microphone directly over the keys. Keystrokes landing without a gap for the whole recording, about six a second, each a crisp plastic click with the dense clatter of the key bed under it. No pauses, no fade in, no fade out. Filling the frame, recorded at a strong present level. No voices, no music, no beeping, no mouse clicks.`

### `ch04-055-maintenance-camera`

| | |
|---|---|
| Asset | `sfx_system_notify_soft` |
| Category | interface (sfx layer) |
| Anchor | segment order 133 · clip `narrator-1bdfc9b381e6` · occurrence 1 |
| Timing | after |
| Gain | 0.03 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~7:28 |

**Manuscript:** Narrator — “Jack selected a maintenance camera near the eastern service corridor.”

**Why:** Selecting the maintenance camera that shows the cut intake pipe.

**Prompt:** `A single electronic notification from a computer acting on its own, microphone close to the speaker. One rounded mid-range blip with a short clean tail, followed by a brief digital interface flourish, sounding once and not repeating. Filling the frame, recorded at a strong present level, with a little room around it. Not an alarm, no voices, no music.`

### `ch04-060-lena-returns`

| | |
|---|---|
| Asset | `sfx_wrist_terminal_chirp` |
| Category | interface (sfx layer) |
| Anchor | segment order 143 · clip `narrator-e427e80d25fd` · occurrence 1 |
| Timing | before |
| Gain | 0.04 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~8:02 |

**Manuscript:** Narrator — “Lena's call returned through Sarah's tablet.”

**Why:** Lena calling back through Sarah's tablet, having checked three boundary crossings.

**Prompt:** `An incoming call alert on a small wrist-worn device. Two rising electronic notes with a short clean decay, close to the microphone, recorded at a strong present level with plenty of body. Distinct from a desk console: smaller, tighter, worn on a person. No voices, no music, no alarm.`

### `ch04-070-vibration-one`

| | |
|---|---|
| Asset | `sfx_distant_vibration_deep` |
| Category | system (sfx layer) |
| Anchor | segment order 161 · clip `narrator-3f307738c15f` · occurrence 1 |
| Timing | before |
| Gain | 0.07 |
| Duration requested | 6s |
| Reusable in Godot | yes |
| Approx. review time | ~8:54 |

**Manuscript:** Narrator — “A low vibration passed through the floor.”

**Why:** 'A low vibration passed through the floor.' The first of four, and the quietest. Placed BEFORE its line so the room feels it and the narration then names it, which is the order the people in the room experience.

**Prompt:** `A deep vibration arriving from somewhere far outside a building and passing through it. Sub-bass swell with a slow approach and a slower departure, felt through the structure rather than heard as an event, like distant thunder with no crack. Recorded at a strong present level with real low end. No voices, no music, no impact.`

### `ch04-071-vibration-two`

| | |
|---|---|
| Asset | `sfx_distant_vibration_deep` |
| Category | system (sfx layer) |
| Anchor | segment order 164 · clip `narrator-1f8f509a6195` · occurrence 1 |
| Timing | during +1800ms |
| Gain | 0.09 |
| Duration requested | 6s |
| Reusable in Godot | yes |
| Approx. review time | ~9:01 |

**Manuscript:** Narrator — “The vibration faded, then returned several seconds later, deeper than before. A loose pen rolled across the console and tapped against Jack's hand.”

**Why:** '...returned several seconds later, deeper than before.' Same asset, +2 dB. The manuscript says deeper, and the escalation across this chapter is done with level on one sound rather than with four different ones -- which is also how it stays recognisable as the same thing getting closer.

**Prompt:** `A deep vibration arriving from somewhere far outside a building and passing through it. Sub-bass swell with a slow approach and a slower departure, felt through the structure rather than heard as an event, like distant thunder with no crack. Recorded at a strong present level with real low end. No voices, no music, no impact.`

### `ch04-080-vibration-three`

| | |
|---|---|
| Asset | `sfx_distant_vibration_deep` |
| Category | system (sfx layer) |
| Anchor | segment order 178 · clip `narrator-68d24043e521` · occurrence 1 |
| Timing | before |
| Gain | 0.11 |
| Duration requested | 6s |
| Reusable in Godot | yes |
| Approx. review time | ~9:45 |

**Manuscript:** Narrator — “Another vibration rolled through the settlement.”

**Why:** 'Another vibration rolled through the settlement.' +4 dB. This is the one the shadow crosses the camera on.

**Prompt:** `A deep vibration arriving from somewhere far outside a building and passing through it. Sub-bass swell with a slow approach and a slower departure, felt through the structure rather than heard as an event, like distant thunder with no crack. Recorded at a strong present level with real low end. No voices, no music, no impact.`

### `ch04-085-ground-trembles`

| | |
|---|---|
| Asset | `sfx_distant_vibration_deep` |
| Category | system (sfx layer) |
| Anchor | segment order 185 · clip `narrator-c11d964ea699` · occurrence 1 |
| Timing | before |
| Gain | 0.12 |
| Duration requested | 6s |
| Reusable in Godot | yes |
| Approx. review time | ~10:09 |

**Manuscript:** Narrator — “The ground trembled again.”

**Why:** 'The ground trembled again.' +5 dB, the loudest in the chapter, and the last thing before Jack says nobody goes outside.

**Prompt:** `A deep vibration arriving from somewhere far outside a building and passing through it. Sub-bass swell with a slow approach and a slower departure, felt through the structure rather than heard as an event, like distant thunder with no crack. Recorded at a strong present level with real low end. No voices, no music, no impact.`

### `ch04-086-pebble-falls`

| | |
|---|---|
| Asset | `sfx_building_shake` |
| Category | foley (sfx layer) |
| Anchor | segment order 186 · clip `narrator-0fc21b63ffa7` · occurrence 1 |
| Timing | during +2400ms |
| Gain | 0.10 |
| Duration requested | 4s |
| Reusable in Godot | yes |
| Approx. review time | ~10:11 |

**Manuscript:** Narrator — “On the camera, a pebble shifted and rolled down the dirt wall. It struck the earth beside the fence hard enough to throw dust across the service road.”

**Why:** A pebble rolling down the dirt wall and striking the earth hard enough to throw dust across a road. It is a pebble; at this scale it is a boulder, and the sound has to be the boulder rather than the word.

**Prompt:** `A building structure shuddering. Low-frequency rumble through a concrete floor with light fittings and loose equipment rattling above it, building and then easing. Interior perspective, recorded at a strong present level with real low end. No voices, no music, no collapse, no debris.`

## Unique assets

| Asset | Category | Loop | Secs | Events | Godot | State |
|---|---|---|---|---|---|---|
| `amb_computer_lab` | ambience | yes | 45.1 | 1 | yes | cached |
| `amb_intercom_channel_open` | ambience | yes | 10 | 3 | yes | cached |
| `sfx_building_shake` | foley | no | 4 | 1 | yes | cached |
| `sfx_distant_vibration_deep` | system | no | 6 | 4 | yes | cached |
| `sfx_intercom_close` | interface | no | 1 | 2 | yes | cached |
| `sfx_intercom_open` | interface | no | 1.5 | 1 | yes | cached |
| `sfx_keyboard_typing_short` | foley | no | 3 | 1 | yes | cached |
| `sfx_system_notify_soft` | interface | no | 1.5 | 2 | yes | cached |
| `sfx_wrist_terminal_chirp` | interface | no | 1.5 | 3 | yes | cached |

9 of 9 are reusable in Godot. The game decides when each one plays; this cue
sheet only decides when the audiobook plays it.
