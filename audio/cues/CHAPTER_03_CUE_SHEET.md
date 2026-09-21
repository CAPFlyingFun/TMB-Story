# Chapter 3: The Activation — SFX and ambience cue sheet

**Status: every cued asset is generated and cached.**

Generated from `audio/cues/chapter-03.json` and `audio/sfx-registry.json`, so
this document cannot drift from what the pipeline would actually play. Rebuild it
with `python3 scripts/render-cue-sheet.py 3`.

| | |
|---|---|
| Playback events | **18** |
| Unique assets | **12** (0 still to generate) |
| Chapter runtime as it plays today | 9:28 |
| Voice clips regenerated for this | **none** |

Events outnumber assets because sounds are reused: `sfx_building_shake` x2, `sfx_distant_vibration_deep` x2, `sfx_keyboard_typing_short` x3, `sfx_system_notify_soft` x3.

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

### `ch03-002-night-outside`

| | |
|---|---|
| Asset | `amb_night_outside` |
| Category | ambience (ambience layer) |
| Anchor | segment order 0 · clip `narrator-59502f926e4e` · occurrence 1 |
| Timing | before |
| Sustain | loops to segment order 118 |
| Gain | 0.16 |
| Fades | in 4000ms · out 2500ms |
| Duration requested | 180.07s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~0:00 |

**Manuscript:** Narrator — “Jack's fingers raced over the keyboard.”

**Why:** The ordinary night outside the settlement, from the chapter's first line until the moment Jack looks out of the window. It exists to be UNREMARKABLE: a normal night behind the glass while the alarms and the vibrations happen indoors, so that what replaces it lands.

**Prompt:** `(hand-supplied asset; no prompt)`

### `ch03-010-jack-typing`

| | |
|---|---|
| Asset | `sfx_keyboard_typing_short` |
| Category | foley (sfx layer) |
| Anchor | segment order 0 · clip `narrator-59502f926e4e` · occurrence 1 |
| Timing | during +200ms |
| Gain | 0.23 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~0:00 |

**Manuscript:** Narrator — “Jack's fingers raced over the keyboard.”

**Why:** The manuscript opens on his hands. Loudest of the typing cues because it is the first sound of the chapter.

**Prompt:** `Continuous fast typing on a low-profile computer keyboard, microphone directly over the keys. Keystrokes landing without a gap for the whole recording, about six a second, each a crisp plastic click with the dense clatter of the key bed under it. No pauses, no fade in, no fade out. Filling the frame, recorded at a strong present level. No voices, no music, no beeping, no mouse clicks.`

### `ch03-020-sarah-console`

| | |
|---|---|
| Asset | `sfx_keyboard_typing_short` |
| Category | foley (sfx layer) |
| Anchor | segment order 10 · clip `narrator-6efc9471f9db` · occurrence 1 |
| Timing | during +200ms |
| Gain | 0.23 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~0:20 |

**Manuscript:** Narrator — “Her fingers moved quickly across the controls.”

**Why:** Sarah at the secondary console, working the interrupt.

**Prompt:** `Continuous fast typing on a low-profile computer keyboard, microphone directly over the keys. Keystrokes landing without a gap for the whole recording, about six a second, each a crisp plastic click with the dense clatter of the key bed under it. No pauses, no fade in, no fade out. Filling the frame, recorded at a strong present level. No voices, no music, no beeping, no mouse clicks.`

### `ch03-030-building-shake`

| | |
|---|---|
| Asset | `sfx_building_shake` |
| Category | foley (sfx layer) |
| Anchor | segment order 16 · clip `narrator-e9056d35cd7a` · occurrence 1 |
| Timing | before |
| Gain | 0.08 |
| Duration requested | 4s |
| Reusable in Godot | yes |
| Approx. review time | ~0:32 |

**Manuscript:** Narrator — “The building shook hard enough that Sarah caught herself against the console. Jack immediately grabbed her arm.”

**Why:** NEW. The shake arrives before the narration names it, so the listener feels it with Sarah rather than being told about it.

**Prompt:** `A building structure shuddering. Low-frequency rumble through a concrete floor with light fittings and loose equipment rattling above it, building and then easing. Interior perspective, recorded at a strong present level with real low end. No voices, no music, no collapse, no debris.`

### `ch03-040-second-vibration`

| | |
|---|---|
| Asset | `sfx_building_shake` |
| Category | foley (sfx layer) |
| Anchor | segment order 24 · clip `narrator-167649217e77` · occurrence 1 |
| Timing | before |
| Gain | 0.08 |
| Duration requested | 4s |
| Reusable in Godot | yes |
| Approx. review time | ~0:50 |

**Manuscript:** Narrator — “Another vibration rolled through the floor. The muted warning tones at the consoles cut off one by one. Jack's screen flashed.”

**Why:** NEW asset, second use, quieter. The manuscript calls it another vibration, so it should be the same sound diminished rather than a new one.

**Prompt:** `A building structure shuddering. Low-frequency rumble through a concrete floor with light fittings and loose equipment rattling above it, building and then easing. Interior perspective, recorded at a strong present level with real low end. No voices, no music, no collapse, no debris.`

### `ch03-050-scale-locked`

| | |
|---|---|
| Asset | `sfx_alert_warning_hit` |
| Category | alarm (sfx layer) |
| Anchor | segment order 24 · clip `narrator-167649217e77` · occurrence 1 |
| Timing | after |
| Gain | 0.02 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~0:50 |

**Manuscript:** Narrator — “Another vibration rolled through the floor. The muted warning tones at the consoles cut off one by one. Jack's screen flashed.”

**Why:** Into the gap before Scale factor locked. Reused.

**Prompt:** `One sharp electronic warning tone announcing a new alert on a laboratory display. Single hard synthetic alert stab, urgent and attention-grabbing, short decay, slight room reflection. One hit only, no repeats, no siren, no voices, no music.`

### `ch03-060-event-collapse`

| | |
|---|---|
| Asset | `sfx_boundary_event_collapse` |
| Category | system (sfx layer) |
| Anchor | segment order 35 · clip `narrator-9d4ae01eedee` · occurrence 1 |
| Timing | during +1200ms |
| Gain | 0.05 |
| Duration requested | 4s |
| Reusable in Godot | yes |
| Approx. review time | ~1:08 |

**Manuscript:** Narrator — “Before he could respond, every light in the laboratory turned white.”

**Why:** NEW. The event. It ends in real silence rather than a tail, because the manuscript is explicit that the sound does not fade or become muffled, it ceases to exist.

**Prompt:** `An electrical charge rising over a room, then the whole air of that room compressing inward in one second, the way a hatch sealing on a pressurised chamber pulls at your ears. A deep inward suck with the room's hum bending downward in pitch as it goes. Close and enveloping, filling the frame, recorded at a strong present level. No voices, no music, no impact, no explosion.`

### `ch03-070-event-return`

| | |
|---|---|
| Asset | `sfx_boundary_event_return` |
| Category | system (sfx layer) |
| Anchor | segment order 43 · clip `narrator-9ac25b040210` · occurrence 1 |
| Timing | before |
| Gain | 0.03 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~1:43 |

**Manuscript:** Narrator — “Sound returned all at once as Jack hit the floor and Sarah landed beside him. Somewhere inside the array chamber, metal rang once and went still.”

**Why:** NEW. The other half. The silence between the two is carried by the manifest's own pauses across the four narration segments in between, so the quiet is real rather than printed into a file.

**Prompt:** `Sound rushing back into a room all at once after total silence. A sharp pressure return with room ambience and machinery slamming back to full in a single instant, then settling. Close and enveloping, recorded at a strong present level. No voices, no music.`

### `ch03-080-lab-after`

| | |
|---|---|
| Asset | `amb_computer_lab` |
| Category | ambience (ambience layer) |
| Anchor | segment order 61 · clip `narrator-4ede4886737f` · occurrence 1 |
| Timing | after |
| Sustain | loops to segment order 182 |
| Gain | 0.12 |
| Fades | in 4000ms · out -ms |
| Duration requested | 45.1s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~2:14 |

**Manuscript:** Narrator — “The laboratory settled into an unsettling silence. Jack slowly stood and looked around. Nothing appeared different. The consoles were intact, the TOMBS Array had stopped, and even the emergency lighting had returned to normal.”

**Why:** Reused. The room tone returns alone into the silence the alarms left, and stays for the rest of the chapter. After the event it is the only thing that sounds normal.

**Prompt:** `(hand-supplied asset; no prompt)`

### `ch03-090-console-check`

| | |
|---|---|
| Asset | `sfx_keyboard_typing_short` |
| Category | foley (sfx layer) |
| Anchor | segment order 64 · clip `narrator-b77666d9bee8` · occurrence 1 |
| Timing | during +900ms |
| Gain | 0.23 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~2:19 |

**Manuscript:** Narrator — “Jack glanced back at the main console. The display had gone dark except for a single status light. He crossed the room and touched the controls.”

**Why:** Jack checking whether TOMBS is off. Quiet work in a quiet room.

**Prompt:** `Continuous fast typing on a low-profile computer keyboard, microphone directly over the keys. Keystrokes landing without a gap for the whole recording, about six a second, each a crisp plastic click with the dense clatter of the key bed under it. No pauses, no fade in, no fade out. Filling the frame, recorded at a strong present level. No voices, no music, no beeping, no mouse clicks.`

### `ch03-100-wrist-call`

| | |
|---|---|
| Asset | `sfx_wrist_terminal_chirp` |
| Category | interface (sfx layer) |
| Anchor | segment order 83 · clip `narrator-a19597e328c5` · occurrence 1 |
| Timing | before |
| Gain | 0.04 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~3:24 |

**Manuscript:** Narrator — “His wrist terminal chirped with an incoming call from island utility control. Jack answered, and Lena's voice burst through it.”

**Why:** NEW asset, reused from chapter 2. Lena getting through is the first contact with anyone outside the room since the event.

**Prompt:** `An incoming call alert on a small wrist-worn device. Two rising electronic notes with a short clean decay, close to the microphone, recorded at a strong present level with plenty of body. Distinct from a desk console: smaller, tighter, worn on a person. No voices, no music, no alarm.`

### `ch03-101-lena-channel`

| | |
|---|---|
| Asset | `amb_intercom_channel_open` |
| Category | ambience (ambience layer) |
| Anchor | segment order 83 · clip `narrator-a19597e328c5` · occurrence 1 |
| Timing | before |
| Sustain | loops to segment order 115 |
| Gain | 0.01 |
| Fades | in 300ms · out 800ms |
| Duration requested | 10s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~3:24 |

**Manuscript:** Narrator — “His wrist terminal chirped with an incoming call from island utility control. Jack answered, and Lena's voice burst through it.”

**Why:** Reused. The channel stays open through the communications check and closes on the sentence where Jack lowers his wrist.

**Prompt:** `An intercom speaker with the line open and nobody talking, microphone right at the grille. Narrow-band electrical hiss with a steady carrier hum under it, band-limited and boxy the way a small wall-mounted speaker colours everything. Filling the frame, recorded at a strong present level. Even throughout so it loops. No voices, no speech, no music, no clicks, no tones.`

### `ch03-119-forest-outside`

| | |
|---|---|
| Asset | `amb_nature_outside` |
| Category | ambience (ambience layer) |
| Anchor | segment order 119 · clip `narrator-223aa91e6a75` · occurrence 1 |
| Timing | before |
| Sustain | loops to segment order 182 |
| Gain | 0.14 |
| Fades | in 5000ms · out 6000ms |
| Duration requested | 593.03s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~4:48 |

**Manuscript:** Narrator — “He looked outside.”

**Why:** THE SOUND OF THE WORLD CHANGING, on 'He looked outside.' The night bed stops and this takes its place and holds to the last line of the chapter. The settlement has not moved and nothing outside has actually started making a new noise -- but the hills are grass now, and the listener is told that by the air rather than by a line of dialogue. Nine and a half minutes long, so it never reaches a loop seam inside the scene it covers.

**Prompt:** `(hand-supplied asset; no prompt)`

### `ch03-110-camera-feeds`

| | |
|---|---|
| Asset | `sfx_system_notify_soft` |
| Category | interface (sfx layer) |
| Anchor | segment order 133 · clip `narrator-1d87e70736f6` · occurrence 1 |
| Timing | during +1200ms |
| Gain | 0.03 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~5:48 |

**Manuscript:** Narrator — “He rushed to the console and opened the camera controls.”

**Why:** Reused. The cameras answering is the mechanism by which the chapter shows the scale of what happened.

**Prompt:** `A single electronic notification from a computer acting on its own, microphone close to the speaker. One rounded mid-range blip with a short clean tail, followed by a brief digital interface flourish, sounding once and not repeating. Filling the frame, recorded at a strong present level, with a little room around it. Not an alarm, no voices, no music.`

### `ch03-120-camera-switch`

| | |
|---|---|
| Asset | `sfx_system_notify_soft` |
| Category | interface (sfx layer) |
| Anchor | segment order 142 · clip `narrator-e1a1af798ecd` · occurrence 1 |
| Timing | during +300ms |
| Gain | 0.03 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~6:39 |

**Manuscript:** Narrator — “Jack changed cameras again. A security light near the southern boundary illuminated what looked like a curved glass wall. For a moment he could not place it. Then a bead of water slid down the surface, trembling in the light.”

**Why:** Reused, quieter. One more feed, and the drop of water.

**Prompt:** `A single electronic notification from a computer acting on its own, microphone close to the speaker. One rounded mid-range blip with a short clean tail, followed by a brief digital interface flourish, sounding once and not repeating. Filling the frame, recorded at a strong present level, with a little room around it. Not an alarm, no voices, no music.`

### `ch03-130-vibration-one`

| | |
|---|---|
| Asset | `sfx_distant_vibration_deep` |
| Category | system (sfx layer) |
| Anchor | segment order 146 · clip `narrator-8f37a665e497` · occurrence 1 |
| Timing | before |
| Gain | 0.11 |
| Duration requested | 6s |
| Reusable in Godot | yes |
| Approx. review time | ~7:02 |

**Manuscript:** Narrator — “A faint vibration passed through the building. It was softer than the TOMBS Array had been, but deeper, almost like distant thunder. Both of them froze.”

**Why:** NEW, and the most important new asset in either chapter. The first sound of the giant world, arriving from outside with no seismic cause. It plays before the narration so the listener hears it exactly as Jack and Sarah do: an event first, an explanation never.

**Prompt:** `A deep vibration arriving from somewhere far outside a building and passing through it. Sub-bass swell with a slow approach and a slower departure, felt through the structure rather than heard as an event, like distant thunder with no crack. Recorded at a strong present level with real low end. No voices, no music, no impact.`

### `ch03-140-vibration-two`

| | |
|---|---|
| Asset | `sfx_distant_vibration_deep` |
| Category | system (sfx layer) |
| Anchor | segment order 151 · clip `narrator-cf34684c56da` · occurrence 1 |
| Timing | before |
| Gain | 0.11 |
| Duration requested | 6s |
| Reusable in Godot | yes |
| Approx. review time | ~7:20 |

**Manuscript:** Narrator — “The vibration came again, then faded into the night.”

**Why:** NEW asset, second use. The manuscript brings it back and then lets it go, and Jack decides he is not certain he wants to know what it was. The same sound twice is the whole point.

**Prompt:** `A deep vibration arriving from somewhere far outside a building and passing through it. Sub-bass swell with a slow approach and a slower departure, felt through the structure rather than heard as an event, like distant thunder with no crack. Recorded at a strong present level with real low end. No voices, no music, no impact.`

### `ch03-150-event-log`

| | |
|---|---|
| Asset | `sfx_system_notify_soft` |
| Category | interface (sfx layer) |
| Anchor | segment order 157 · clip `narrator-0608e9f2317e` · occurrence 1 |
| Timing | during +1000ms |
| Gain | 0.03 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~7:36 |

**Manuscript:** Narrator — “Jack opened the TOMBS event log. One final record remained.”

**Why:** Reused. One final record remains, and the machine reports the scale factor as calmly as it reported everything else.

**Prompt:** `A single electronic notification from a computer acting on its own, microphone close to the speaker. One rounded mid-range blip with a short clean tail, followed by a brief digital interface flourish, sounding once and not repeating. Filling the frame, recorded at a strong present level, with a little room around it. Not an alarm, no voices, no music.`

## Unique assets

| Asset | Category | Loop | Secs | Events | Godot | State |
|---|---|---|---|---|---|---|
| `amb_computer_lab` | ambience | yes | 45.1 | 1 | yes | cached |
| `amb_intercom_channel_open` | ambience | yes | 10 | 1 | yes | cached |
| `amb_nature_outside` | ambience | yes | 593.03 | 1 | yes | cached |
| `amb_night_outside` | ambience | yes | 180.07 | 1 | yes | cached |
| `sfx_alert_warning_hit` | alarm | no | 1.5 | 1 | yes | cached |
| `sfx_boundary_event_collapse` | system | no | 4 | 1 | yes | cached |
| `sfx_boundary_event_return` | system | no | 3 | 1 | yes | cached |
| `sfx_building_shake` | foley | no | 4 | 2 | yes | cached |
| `sfx_distant_vibration_deep` | system | no | 6 | 2 | yes | cached |
| `sfx_keyboard_typing_short` | foley | no | 3 | 3 | yes | cached |
| `sfx_system_notify_soft` | interface | no | 1.5 | 3 | yes | cached |
| `sfx_wrist_terminal_chirp` | interface | no | 1.5 | 1 | yes | cached |

12 of 12 are reusable in Godot. The game decides when each one plays; this cue
sheet only decides when the audiobook plays it.
