# Chapter 2: The Boundary — SFX and ambience cue sheet

**Status: PROPOSED. 4 of 16 assets have not been generated and no ElevenLabs
credits have been spent on them.** Each one below is a prompt awaiting approval.

Generated from `audio/cues/chapter-02.json` and `audio/sfx-registry.json`, so
this document cannot drift from what the pipeline would actually play. Rebuild it
with `python3 scripts/render-cue-sheet.py 2`.

| | |
|---|---|
| Playback events | **23** |
| Unique assets | **16** (4 still to generate) |
| Chapter runtime as it plays today | 8:09 |
| Voice clips regenerated for this | **none** |

Events outnumber assets because sounds are reused: `sfx_alert_warning_hit` x2, `sfx_array_rings_move` x2, `sfx_intercom_open` x2, `sfx_keyboard_typing_short` x3, `sfx_system_notify_soft` x2, `sfx_wrist_terminal_chirp` x2.

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

### `ch02-005-array-hum`

| | |
|---|---|
| Asset | `amb_tombs_array_power_rise` |
| Category | system (sfx layer) |
| Anchor | segment order 0 · clip `narrator-4d144a8eeedd` · occurrence 1 |
| Timing | before |
| Sustain | loops to segment order 181 |
| Gain | 0.18 |
| Fades | in 2000ms · out -ms |
| Duration requested | 20s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~0:00 |

**Manuscript:** Narrator — “The lights flickered as a low hum passed through the floor. Sarah turned toward the far end of the laboratory.”

**Why:** The chapter opens on a hum passing through the floor and the array never stops drawing power. Reusing chapter 1's rise asset ties the two chapters together with one sound: the thing that started at the end of chapter 1 is what chapter 2 is standing inside.

**Prompt:** `A very large machine beginning to draw power somewhere below and far away. Deep sub-bass hum rising slowly in pitch and intensity, layered with a distant electrical charging whine and a faint sense of enormous mass energising. Restrained and ominous, felt more than heard, no impact, no explosion, no siren, no voices, no music, no cinematic riser or trailer hit.`

### `ch02-006-lab-bed`

| | |
|---|---|
| Asset | `amb_tombs_lab_night` |
| Category | ambience (ambience layer) |
| Anchor | segment order 0 · clip `narrator-4d144a8eeedd` · occurrence 1 |
| Timing | before |
| Sustain | loops to segment order 22 |
| Gain | 0.20 |
| Fades | in 1500ms · out 2500ms |
| Duration requested | 20s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~0:00 |

**Manuscript:** Narrator — “The lights flickered as a low hum passed through the floor. Sarah turned toward the far end of the laboratory.”

**Why:** Carries chapter 1's room straight into chapter 2 and leaves when they leave the laboratory. Reused, not remade.

**Prompt:** `Quiet room tone of an advanced, clean research laboratory late at night. Soft steady ventilation, a low continuous electrical hum from racked equipment, faint distant cooling fans, and a barely perceptible high shimmer from instruments on standby. Spacious but enclosed. No voices, no music, no alarms, no beeping, no footsteps. Even throughout so it loops.`

### `ch02-010-out-of-chair`

| | |
|---|---|
| Asset | `sfx_chair_roll_fast` |
| Category | foley (sfx layer) |
| Anchor | segment order 2 · clip `narrator-a1ccdfbe1f2b` · occurrence 1 |
| Timing | during +200ms |
| Gain | 0.42 |
| Duration requested | 2s |
| Reusable in Godot | yes |
| Approx. review time | ~0:08 |

**Manuscript:** Narrator — “Jack was already out of his chair.”

**Why:** The same startled chair as chapter 1, and the chapter's first physical beat.

**Prompt:** `An office chair on castors shoved suddenly backward across a hard floor. A quick startled scuff, castors rumbling fast over a smooth surface, and an abrupt stop. Sharp, physical, slightly alarming, with room reflection. No voices, no music, no crash, no breaking.`

### `ch02-020-door-wider`

| | |
|---|---|
| Asset | `sfx_lab_door_slide` |
| Category | foley (sfx layer) |
| Anchor | segment order 18 · clip `narrator-912881d92852` · occurrence 1 |
| Timing | during +900ms |
| Gain | 0.38 |
| Duration requested | 2.5s |
| Reusable in Godot | yes |
| Approx. review time | ~0:44 |

**Manuscript:** Narrator — “Jack gave in and opened the door wider.”

**Why:** They leave the laboratory. The door marks the move to the corridor, which is the chapter's first location change.

**Prompt:** `An automatic laboratory door sliding open. A soft pneumatic release, a smooth mechanical glide along a track, and a light settling clunk as it reaches the end of its travel. Clean modern facility, close but with room reflection behind it. No voices, no music, no alarm.`

### `ch02-025-corridor-walk`

| | |
|---|---|
| Asset | `sfx_footsteps_sarah_sneakers` |
| Category | foley (sfx layer) |
| Anchor | segment order 20 · clip `narrator-1d83d15de941` · occurrence 1 |
| Timing | during +300ms |
| Gain | 0.32 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~0:49 |

**Manuscript:** Narrator — “Sarah fell into step beside him.”

**Why:** Two people moving fast through a corridor. Sarah's sneakers, per chapter 1 canon.

**Prompt:** `A few unhurried footsteps of an adult in soft rubber-soled sneakers on a hard smooth laboratory floor. Light, quiet, slightly rubbery contact with almost no heel click, four or five steps with a natural gait, modest room reflection. No voices, no music, no heels, no hard shoes, no boots.`

### `ch02-030-overhead-alarm`

| | |
|---|---|
| Asset | `sfx_alert_warning_hit` |
| Category | alarm (sfx layer) |
| Anchor | segment order 22 · clip `narrator-34cd647577e9` · occurrence 1 |
| Timing | before |
| Gain | 0.46 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~0:53 |

**Manuscript:** Narrator — “They hurried toward the main control room while another alarm sounded overhead.”

**Why:** The manuscript sounds the alarm as they move, so the hit lands before the narration names it.

**Prompt:** `One sharp electronic warning tone announcing a new alert on a laboratory display. Single hard synthetic alert stab, urgent and attention-grabbing, short decay, slight room reflection. One hit only, no repeats, no siren, no voices, no music.`

### `ch02-031-alarm-bed`

| | |
|---|---|
| Asset | `amb_console_alarm_bed` |
| Category | alarm (sfx layer) |
| Anchor | segment order 22 · clip `narrator-34cd647577e9` · occurrence 1 |
| Timing | after |
| Sustain | loops to segment order 65 |
| Gain | 0.15 |
| Fades | in 500ms · out 3000ms |
| Duration requested | 12s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~0:53 |

**Manuscript:** Narrator — “They hurried toward the main control room while another alarm sounded overhead.”

**Why:** The building is in alarm from here until they arrive at the control room. Reused at chapter 1's corrected level.

**Prompt:** `A repeating electronic security alarm inside a laboratory, heard as a continuous background state rather than a single event. Insistent two-note warning tone cycling steadily with an even gap between repeats, slightly hard-edged and synthetic, with a faint room reflection. Consistent volume, no build, no crescendo, no siren sweep, no voices, no music. Even throughout so it can loop.`

### `ch02-040-wrist-call`

| | |
|---|---|
| Asset | `sfx_wrist_terminal_chirp` |
| Category | interface (sfx layer) |
| Anchor | segment order 24 · clip `narrator-0dff474a87e9` · occurrence 1 |
| Timing | before |
| Gain | 0.42 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~1:00 |

**Manuscript:** Narrator — “Jack tapped his wrist terminal and called the island utility station.”

**Why:** NEW. The wrist terminal is how Lena exists in this story, and it needs to read as a different device from the laboratory console.

**Prompt:** `An incoming call alert on a small wrist-worn device. Two rising electronic notes with a short clean decay, close to the microphone, recorded at a strong present level with plenty of body. Distinct from a desk console: smaller, tighter, worn on a person. No voices, no music, no alarm.`

### `ch02-041-lena-channel`

| | |
|---|---|
| Asset | `amb_intercom_channel_open` |
| Category | interface (sfx layer) |
| Anchor | segment order 26 · clip `narrator-a2cb0323305a` · occurrence 1 |
| Timing | before |
| Sustain | loops to segment order 51 |
| Gain | 0.14 |
| Fades | in 300ms · out 800ms |
| Duration requested | 10s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~1:08 |

**Manuscript:** Narrator — “Lena Ortiz, the night-shift power technician, answered through his wrist terminal almost immediately.”

**Why:** The same live-channel hiss that told chapter 1's listener Sarah was on a speaker, now telling them Lena is on a wrist call and not in the room.

**Prompt:** `The quiet open-channel hiss of an intercom speaker with the line live and nobody talking. Soft narrow-band electrical noise, a slight carrier hum, thin and boxy as if coming from a small wall-mounted speaker grille. Very low level and unchanging. No voices, no speech, no music, no clicks, no tones. Even throughout so it can loop.`

### `ch02-050-wrist-chirp-2`

| | |
|---|---|
| Asset | `sfx_wrist_terminal_chirp` |
| Category | interface (sfx layer) |
| Anchor | segment order 45 · clip `narrator-84ed69735962` · occurrence 1 |
| Timing | before |
| Gain | 0.40 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~2:08 |

**Manuscript:** Narrator — “Jack's wrist terminal chirped again.”

**Why:** NEW asset, second use. The manuscript says chirped again, so the listener should recognise it.

**Prompt:** `An incoming call alert on a small wrist-worn device. Two rising electronic notes with a short clean decay, close to the microphone, recorded at a strong present level with plenty of body. Distinct from a desk console: smaller, tighter, worn on a person. No voices, no music, no alarm.`

### `ch02-060-rings-turning`

| | |
|---|---|
| Asset | `sfx_array_rings_move` |
| Category | system (sfx layer) |
| Anchor | segment order 66 · clip `narrator-a8a6d825be1f` · occurrence 1 |
| Timing | before |
| Sustain | loops to segment order 83 |
| Gain | 0.30 |
| Fades | in 800ms · out 1500ms |
| Duration requested | 6s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~3:13 |

**Manuscript:** Narrator — “Tonight, every ring was moving.”

**Why:** NEW. The signature machine sound of the chapter. It starts when the manuscript reveals the rings and stops on the sentence that stops them.

**Prompt:** `Large articulated machinery rotating. Heavy rings turning on precision bearings with a deep servo drive under them, metal sliding against metal, a sense of considerable mass moving under control. Full-bodied and close, recorded at a strong present level. No voices, no music, no alarm, no impact.`

### `ch02-070-emitter-work`

| | |
|---|---|
| Asset | `sfx_keyboard_typing_short` |
| Category | foley (sfx layer) |
| Anchor | segment order 78 · clip `narrator-65cca3e20e94` · occurrence 1 |
| Timing | during +200ms |
| Gain | 0.50 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~3:43 |

**Manuscript:** Narrator — “Sarah worked the controls and shook her head.”

**Why:** Sarah at the emitter controls. Reuses the keyboard asset.

**Prompt:** `A short burst of purposeful typing on a low-profile computer keyboard. Quick quiet key presses with a soft plastic action, a few seconds of steady work rhythm, close-mic with a little room. No voices, no music, no beeping, no mouse clicks.`

### `ch02-080-lever`

| | |
|---|---|
| Asset | `sfx_shutdown_lever_pull` |
| Category | foley (sfx layer) |
| Anchor | segment order 82 · clip `narrator-45604f264846` · occurrence 1 |
| Timing | during +1400ms |
| Gain | 0.52 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~3:53 |

**Manuscript:** Narrator — “He pulled the physical shutdown lever, and the room went dark.”

**Why:** NEW. The chapter's biggest physical act, and it has to sound conclusive so that the rings restarting lands as a violation.

**Prompt:** `A heavy industrial disconnect lever thrown by hand, followed by electrical power dropping out of a room. A solid mechanical clack with weight behind it, then the collapse of every hum and fan into silence. Close and physical, recorded at a strong present level. No voices, no music.`

### `ch02-085-rings-restart`

| | |
|---|---|
| Asset | `sfx_array_rings_move` |
| Category | system (sfx layer) |
| Anchor | segment order 88 · clip `narrator-af235e0b4193` · occurrence 1 |
| Timing | before |
| Sustain | loops to segment order 181 |
| Gain | 0.34 |
| Fades | in 600ms · out 2000ms |
| Duration requested | 6s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~4:07 |

**Manuscript:** Narrator — “A light blinked inside the chamber, then another. The rings began moving again.”

**Why:** NEW asset, second use. They do not stop again, so this one runs to the end of the chapter.

**Prompt:** `Large articulated machinery rotating. Heavy rings turning on precision bearings with a deep servo drive under them, metal sliding against metal, a sense of considerable mass moving under control. Full-bodied and close, recorded at a strong present level. No voices, no music, no alarm, no impact.`

### `ch02-090-lights-return`

| | |
|---|---|
| Asset | `sfx_equipment_power_up_soft` |
| Category | system (sfx layer) |
| Anchor | segment order 99 · clip `narrator-9c9eeea288db` · occurrence 1 |
| Timing | before |
| Gain | 0.40 |
| Duration requested | 2.5s |
| Reusable in Godot | yes |
| Approx. review time | ~4:34 |

**Manuscript:** Narrator — “The emergency lights switched on. Jack rushed back to the console, which should have been dead. Instead, the screen was filling with data.”

**Why:** Power returning to a room that should have been dead. Reuses chapter 1's equipment transition.

**Prompt:** `A screen and its equipment quietly powering back on. Soft electrical energising swell, a faint rising high-frequency whine settling into a steady hum, and a subtle capacitive tick as the display wakes. Gentle and unhurried, close-mic. No alarm, no beeping, no voices, no music.`

### `ch02-100-console-alive`

| | |
|---|---|
| Asset | `sfx_system_notify_soft` |
| Category | interface (sfx layer) |
| Anchor | segment order 99 · clip `narrator-9c9eeea288db` · occurrence 1 |
| Timing | during +1800ms |
| Gain | 0.40 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~4:34 |

**Manuscript:** Narrator — “The emergency lights switched on. Jack rushed back to the console, which should have been dead. Instead, the screen was filling with data.”

**Why:** The same calm notification as chapter 1's directory opening by itself: the machine is not warning anyone, it is working.

**Prompt:** `A quiet single electronic notification from a computer doing something on its own. One soft neutral blip followed by a faint digital interface movement, understated and unhurried, close-mic with a little room around it. Not an alarm, not urgent, no voices, no music.`

### `ch02-110-map-work`

| | |
|---|---|
| Asset | `sfx_keyboard_typing_short` |
| Category | foley (sfx layer) |
| Anchor | segment order 119 · clip `narrator-d65b688f1891` · occurrence 1 |
| Timing | during +300ms |
| Gain | 0.50 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~5:24 |

**Manuscript:** Narrator — “Jack opened the mapping controls.”

**Why:** Pulling up the island map, the moment before the red line appears.

**Prompt:** `A short burst of purposeful typing on a low-profile computer keyboard. Quick quiet key presses with a soft plastic action, a few seconds of steady work rhythm, close-mic with a little room. No voices, no music, no beeping, no mouse clicks.`

### `ch02-120-intercom`

| | |
|---|---|
| Asset | `sfx_intercom_open` |
| Category | interface (sfx layer) |
| Anchor | segment order 133 · clip `narrator-6e6f9e1dbe3f` · occurrence 1 |
| Timing | during +500ms |
| Gain | 0.40 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~6:18 |

**Manuscript:** Narrator — “Jack grabbed the intercom.”

**Why:** Reuses chapter 1's intercom. Jack declaring a settlement-wide emergency is the chapter's turn outward from two people to five hundred.

**Prompt:** `An intercom being keyed on. A firm mechanical button press followed immediately by a small electrical pop and the channel opening into a thin live speaker hiss. Close-mic, tactile. No voices, no speech, no music, no tones.`

### `ch02-140-intercom-again`

| | |
|---|---|
| Asset | `sfx_intercom_open` |
| Category | interface (sfx layer) |
| Anchor | segment order 147 · clip `narrator-50d3345e6192` · occurrence 1 |
| Timing | during +400ms |
| Gain | 0.36 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~6:49 |

**Manuscript:** Narrator — “Jack keyed the intercom again.”

**Why:** Changing the evacuation order. Same asset, quieter: the second use is a correction rather than a declaration.

**Prompt:** `An intercom being keyed on. A firm mechanical button press followed immediately by a small electrical pop and the channel opening into a thin live speaker hiss. Close-mic, tactile. No voices, no speech, no music, no tones.`

### `ch02-130-sirens`

| | |
|---|---|
| Asset | `amb_settlement_sirens` |
| Category | alarm (sfx layer) |
| Anchor | segment order 150 · clip `narrator-9e05ce60e7b8` · occurrence 1 |
| Timing | before |
| Sustain | loops to segment order 181 |
| Gain | 0.16 |
| Fades | in 3000ms · out -ms |
| Duration requested | 12s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~7:02 |

**Manuscript:** Narrator — “Sirens began sounding outside.”

**Why:** NEW. Once the emergency is called the sirens do not stop, and they are the only sound in either chapter that comes from outside the building. Heard through walls, which is where the chapters stay.

**Prompt:** `Civil emergency sirens across a small town, heard from indoors through walls and glass. Several units at different distances, rising and falling out of step with each other, with the building muffling the high end. Even and continuous, recorded at a strong present level. No voices, no music, no interior alarm.`

### `ch02-150-overrides`

| | |
|---|---|
| Asset | `sfx_keyboard_typing_short` |
| Category | foley (sfx layer) |
| Anchor | segment order 153 · clip `narrator-f0b9c61b577a` · occurrence 1 |
| Timing | during +400ms |
| Gain | 0.50 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~7:11 |

**Manuscript:** Narrator — “Jack searched through the manual overrides.”

**Why:** Jack working the overrides while the boundary acquires. The last stretch of ordinary work before the readouts take over.

**Prompt:** `A short burst of purposeful typing on a low-profile computer keyboard. Quick quiet key presses with a soft plastic action, a few seconds of steady work rhythm, close-mic with a little room. No voices, no music, no beeping, no mouse clicks.`

### `ch02-160-boundary-acquired`

| | |
|---|---|
| Asset | `sfx_alert_warning_hit` |
| Category | alarm (sfx layer) |
| Anchor | segment order 166 · clip `narrator-6e1c3da3fb9d` · occurrence 1 |
| Timing | after |
| Gain | 0.48 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~7:41 |

**Manuscript:** Narrator — “The display changed.”

**Why:** A hit into the gap before TOMBS says Boundary acquired, so the machine's announcement arrives out of an alert.

**Prompt:** `One sharp electronic warning tone announcing a new alert on a laboratory display. Single hard synthetic alert stab, urgent and attention-grabbing, short decay, slight room reflection. One hit only, no repeats, no siren, no voices, no music.`

### `ch02-170-scale-calculating`

| | |
|---|---|
| Asset | `sfx_system_notify_soft` |
| Category | interface (sfx layer) |
| Anchor | segment order 170 · clip `narrator-ebb691a6c92b` · occurrence 1 |
| Timing | after |
| Gain | 0.40 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~7:47 |

**Manuscript:** Narrator — “A second line appeared.”

**Why:** Scale factor calculating arrives quietly, which is worse. The chapter ends on the calm voice of something that has already decided.

**Prompt:** `A quiet single electronic notification from a computer doing something on its own. One soft neutral blip followed by a faint digital interface movement, understated and unhurried, close-mic with a little room around it. Not an alarm, not urgent, no voices, no music.`

## Unique assets

| Asset | Category | Loop | Secs | Events | Godot | State |
|---|---|---|---|---|---|---|
| `amb_console_alarm_bed` | alarm | yes | 12 | 1 | yes | cached |
| `amb_intercom_channel_open` | interface | yes | 10 | 1 | yes | cached |
| `amb_settlement_sirens` | alarm | yes | 12 | 1 | yes | to generate |
| `amb_tombs_array_power_rise` | system | yes | 20 | 1 | yes | cached |
| `amb_tombs_lab_night` | ambience | yes | 20 | 1 | yes | cached |
| `sfx_alert_warning_hit` | alarm | no | 1.5 | 2 | yes | cached |
| `sfx_array_rings_move` | system | yes | 6 | 2 | yes | to generate |
| `sfx_chair_roll_fast` | foley | no | 2 | 1 | yes | cached |
| `sfx_equipment_power_up_soft` | system | no | 2.5 | 1 | yes | cached |
| `sfx_footsteps_sarah_sneakers` | foley | no | 3 | 1 | yes | cached |
| `sfx_intercom_open` | interface | no | 1.5 | 2 | yes | cached |
| `sfx_keyboard_typing_short` | foley | no | 3 | 3 | yes | cached |
| `sfx_lab_door_slide` | foley | no | 2.5 | 1 | yes | cached |
| `sfx_shutdown_lever_pull` | foley | no | 3 | 1 | yes | to generate |
| `sfx_system_notify_soft` | interface | no | 1.5 | 2 | yes | cached |
| `sfx_wrist_terminal_chirp` | interface | no | 1.5 | 2 | yes | to generate |

16 of 16 are reusable in Godot. The game decides when each one plays; this cue
sheet only decides when the audiobook plays it.
