# Chapter 1: The Alarm — SFX and ambience cue sheet

**Status: every cued asset is generated and cached.**

Generated from `audio/cues/chapter-01.json` and `audio/sfx-registry.json`, so
this document cannot drift from what the pipeline would actually play. Rebuild it
with `python3 scripts/render-cue-sheet.py 1`.

| | |
|---|---|
| Playback events | **34** |
| Unique assets | **19** (0 still to generate) |
| Chapter runtime as it plays today | 7:57 |
| Voice clips regenerated for this | **none** |

Events outnumber assets because sounds are reused: `sfx_access_denied_tone` x2, `sfx_alert_warning_hit` x2, `sfx_chair_roll_slow` x2, `sfx_console_tone_soft` x2, `sfx_footsteps_sarah_sneakers` x2, `sfx_intercom_open` x2, `sfx_keyboard_typing_short` x9, `sfx_system_notify_soft` x2.

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

### `ch01-005-lab-bed`

| | |
|---|---|
| Asset | `amb_computer_lab` |
| Category | ambience (ambience layer) |
| Anchor | segment order 2 · clip `narrator-0b2f58c70a4c` · occurrence 1 |
| Timing | before |
| Sustain | loops to segment order 184 |
| Gain | 0.12 |
| Fades | in 3000ms · out 4000ms |
| Duration requested | 45.1s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~0:28 |

**Manuscript:** Narrator — “Deep inside one of those laboratories, Dr. Jack Bennett was hard at work. Technically.”

**Why:** Enters on 'Deep inside one of those laboratories' -- the sentence that puts us in the room -- and never leaves, because the chapter never leaves. Establishes an occupied but near-empty building at night so that every later silence reads as a room and not as dead air. GAIN 0.08 -> 0.2: Joshua could not hear the room tone at all. 0.08 against a voice reference of 1.0 is roughly -22 dB, which is below the floor of a phone speaker in a room.

**Prompt:** `(hand-supplied asset; no prompt)`

### `ch01-010-first-chirp`

| | |
|---|---|
| Asset | `sfx_console_tone_soft` |
| Category | interface (sfx layer) |
| Anchor | segment order 4 · clip `narrator-1de8e47c4e66` · occurrence 1 |
| Timing | before |
| Gain | 0.07 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~0:47 |

**Manuscript:** Narrator — “A warning tone chirped from Jack's console. He shifted but did not wake. A second tone followed, louder than the first, and the diagnostic display flashed amber.”

**Why:** The listener hears the chirp, then the narrator says a warning tone chirped. Putting it first makes the sound the event and the narration the confirmation, which is how the scene actually happens to Jack.

**Prompt:** `A two-tone electronic blip from a laboratory console, microphone close to the speaker. Two rounded mid-range notes with a clean decay, synthetic and warm rather than piercing, sounding once and not repeating. Filling the frame, recorded at a strong present level, with a little room reflection. No alarm, no siren, no voices, no music.`

### `ch01-011-second-chirp`

| | |
|---|---|
| Asset | `sfx_console_tone_soft` |
| Category | interface (sfx layer) |
| Anchor | segment order 4 · clip `narrator-1de8e47c4e66` · occurrence 1 |
| Timing | during +2600ms |
| Gain | 0.07 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~0:47 |

**Manuscript:** Narrator — “A warning tone chirped from Jack's console. He shifted but did not wake. A second tone followed, louder than the first, and the diagnostic display flashed amber.”

**Why:** The same asset, louder, because the manuscript says the second tone was louder than the first. One generated sound covers both, and the escalation is done with gain rather than with a second file.

**Prompt:** `A two-tone electronic blip from a laboratory console, microphone close to the speaker. Two rounded mid-range notes with a clean decay, synthetic and warm rather than piercing, sounding once and not repeating. Filling the frame, recorded at a strong present level, with a little room reflection. No alarm, no siren, no voices, no music.`

### `ch01-013-alarm-bed`

| | |
|---|---|
| Asset | `amb_console_alarm_bed` |
| Category | alarm (sfx layer) |
| Anchor | segment order 4 · clip `narrator-1de8e47c4e66` · occurrence 1 |
| Timing | after |
| Sustain | loops to segment order 19 |
| Gain | 0.01 |
| Fades | in 400ms · out 2500ms |
| Duration requested | 12s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~0:47 |

**Manuscript:** Narrator — “A warning tone chirped from Jack's console. He shifted but did not wake. A second tone followed, louder than the first, and the diagnostic display flashed amber.”

**Why:** The alarm does not stop when the sentence does -- the manuscript has the warning repeating and a second alarm sounding later. A low looping bed under the opening carries that, ducks hard beneath speech, and fades out after 'That's impossible', which is where the scene stops shouting and starts being strange. GAIN 0.2 -> 0.15: Joshua's instruction: turn the alarm bed down. EMPHASIS DROPPED TO 0 on 2026-09-19. The +6.0/+8.3 here were raising the one sound Joshua said he could not hear the narrator past, and they were chosen when the mix was placed by RMS -- which reads this asset 3 to 6 dB quieter than the ear does. With loudness measured properly the category target is already where this moment should sit.

**Prompt:** `A repeating electronic security alarm inside a laboratory, heard as a continuous background state rather than a single event. Insistent two-note warning tone cycling steadily with an even gap between repeats, slightly hard-edged and synthetic, with a faint room reflection. Consistent volume, no build, no crescendo, no siren sweep, no voices, no music. Even throughout so it can loop.`

### `ch01-020-chair-startle`

| | |
|---|---|
| Asset | `sfx_chair_roll_fast` |
| Category | foley (sfx layer) |
| Anchor | segment order 6 · clip `narrator-32bdc09c24ff` · occurrence 1 |
| Timing | during +1100ms |
| Gain | 0.05 |
| Duration requested | 2s |
| Reusable in Godot | yes |
| Approx. review time | ~0:48 |

**Manuscript:** Narrator — “Jack jerked awake so quickly that his chair rolled backward and nearly struck another workstation.”

**Why:** Gives the alarm a physical consequence in a body rather than only on a screen. It is the one sound in the chapter that tells the listener how hard Jack was asleep.

**Prompt:** `An office chair on castors shoved hard backward across a hard floor, microphone right at the castors. A fast scuff, castors rumbling over a smooth surface with the frame rattling above them, and an abrupt stop. Physical and close, filling the frame, recorded at a strong present level, with room reflection. No voices, no music, no crash, no breaking.`

### `ch01-030-jack-types`

| | |
|---|---|
| Asset | `sfx_keyboard_typing_short` |
| Category | foley (sfx layer) |
| Anchor | segment order 10 · clip `narrator-93519474e9ea` · occurrence 1 |
| Timing | during +4200ms |
| Gain | 0.23 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~1:01 |

**Manuscript:** Narrator — “Several windows were opening and closing on their own. Lines of commands streamed across one side of the display faster than he could read them. Jack grabbed the keyboard and opened the network monitor.”

**Why:** Lands on 'Jack grabbed the keyboard'. Establishes that he is working the problem with his hands, which is what makes the later moment when the cursor moves by itself frightening.

**Prompt:** `Continuous fast typing on a low-profile computer keyboard, microphone directly over the keys. Keystrokes landing without a gap for the whole recording, about six a second, each a crisp plastic click with the dense clatter of the key bed under it. No pauses, no fade in, no fade out. Filling the frame, recorded at a strong present level. No voices, no music, no beeping, no mouse clicks.`

### `ch01-040-second-alarm`

| | |
|---|---|
| Asset | `sfx_alert_warning_hit` |
| Category | alarm (sfx layer) |
| Anchor | segment order 15 · clip `narrator-5290a9122d0f` · occurrence 1 |
| Timing | during +2300ms |
| Gain | 0.02 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~1:23 |

**Manuscript:** Narrator — “He refreshed the display, but the connection was gone. Another warning tone sounded from the console and a red message filled the center of his screen.”

**Why:** One sharp hit on 'Another alarm sounded'. Distinct from the opening eruption: this is the system finding something new, not the system panicking.

**Prompt:** `One sharp electronic warning tone announcing a new alert on a laboratory display. Single hard synthetic alert stab, urgent and attention-grabbing, short decay, slight room reflection. One hit only, no repeats, no siren, no voices, no music.`

### `ch01-031-jack-searches`

| | |
|---|---|
| Asset | `sfx_keyboard_typing_short` |
| Category | foley (sfx layer) |
| Anchor | segment order 18 · clip `narrator-36d912fb5b4f` · occurrence 1 |
| Timing | during +1200ms |
| Gain | 0.23 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~1:27 |

**Manuscript:** Narrator — “Jack entered a command and pulled up the laboratory access logs. Nothing looked unusual. He tried another search and got the same result.”

**Why:** Jack entering a command and running a second search. The manuscript has him working the logs by hand here, and it was silent.

**Prompt:** `Continuous fast typing on a low-profile computer keyboard, microphone directly over the keys. Keystrokes landing without a gap for the whole recording, about six a second, each a crisp plastic click with the dense clatter of the key bed under it. No pauses, no fade in, no fade out. Filling the frame, recorded at a strong present level. No voices, no music, no beeping, no mouse clicks.`

### `ch01-050-directory-opens`

| | |
|---|---|
| Asset | `sfx_system_notify_soft` |
| Category | interface (sfx layer) |
| Anchor | segment order 20 · clip `narrator-1008b9e9b430` · occurrence 1 |
| Timing | before |
| Gain | 0.03 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~1:38 |

**Manuscript:** Narrator — “The system beeped, and a directory opened by itself. Jack stopped typing when he recognized the folder.”

**Why:** The manuscript says the system beeped and a directory opened by itself. A calm, polite notification is more unsettling here than an alarm would be -- the machine is not warning him, it is working.

**Prompt:** `A single electronic notification from a computer acting on its own, microphone close to the speaker. One rounded mid-range blip with a short clean tail, followed by a brief digital interface flourish, sounding once and not repeating. Filling the frame, recorded at a strong present level, with a little room around it. Not an alarm, no voices, no music.`

### `ch01-060-terminal-lock`

| | |
|---|---|
| Asset | `sfx_terminal_lock_engage` |
| Category | interface (sfx layer) |
| Anchor | segment order 23 · clip `narrator-c2bcc3f581cf` · occurrence 1 |
| Timing | during +800ms |
| Gain | 0.07 |
| Duration requested | 2s |
| Reusable in Godot | yes |
| Approx. review time | ~1:48 |

**Manuscript:** Narrator — “He immediately locked the terminal. The screen went black for three seconds, then came back on and reopened the same directory.”

**Why:** It has to sound like the lock worked, or the terminal coming back on by itself is not a violation.

**Prompt:** `A computer terminal locking. A firm confirming electronic click-clunk with a short descending two-tone confirmation, then the display going dark with a faint electrical fade. Decisive and final, close-mic. No alarm, no voices, no music.`

### `ch01-061-terminal-returns`

| | |
|---|---|
| Asset | `sfx_equipment_power_up_soft` |
| Category | system (sfx layer) |
| Anchor | segment order 23 · clip `narrator-c2bcc3f581cf` · occurrence 1 |
| Timing | after |
| Gain | 0.04 |
| Duration requested | 2.5s |
| Reusable in Godot | yes |
| Approx. review time | ~1:48 |

**Manuscript:** Narrator — “He immediately locked the terminal. The screen went black for three seconds, then came back on and reopened the same directory.”

**Why:** Three seconds of black screen and then the machine wakes itself. Placed after the narration so the listener hears the thing happen having just been told it would not.

**Prompt:** `A display and the equipment behind it coming back on, microphone at the machine. An energising swell with a rising high-frequency whine settling into a steady hum, and a capacitive tick as the panel wakes. One unhurried movement, close-mic, filling the frame, recorded at a strong present level. No alarm, no beeping, no voices, no music.`

### `ch01-070-intercom-open`

| | |
|---|---|
| Asset | `sfx_intercom_open` |
| Category | interface (sfx layer) |
| Anchor | segment order 27 · clip `jack-bennett-a8a6aa7ae3b3` · occurrence 1 |
| Timing | before |
| Gain | 0.05 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~2:01 |

**Manuscript:** Jack Bennett — “Sarah?”

**Why:** Jack's 'Sarah?' has to arrive into an open channel, or the listener does not know he is talking to a wall. This is the cue that changes the acoustic space for the next twenty segments.

**Prompt:** `An intercom being keyed on. A firm mechanical button press followed immediately by a small electrical pop and the channel opening into a thin live speaker hiss. Close-mic, tactile. No voices, no speech, no music, no tones.`

### `ch01-071-channel-bed`

| | |
|---|---|
| Asset | `amb_intercom_channel_open` |
| Category | ambience (ambience layer) |
| Anchor | segment order 27 · clip `jack-bennett-a8a6aa7ae3b3` · occurrence 1 |
| Timing | before |
| Sustain | loops to segment order 49 |
| Gain | 0.01 |
| Fades | in 200ms · out 600ms |
| Duration requested | 10s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~2:01 |

**Manuscript:** Jack Bennett — “Sarah?”

**Why:** A faint live-channel hiss under the whole intercom exchange is the only way to make Sarah read as remote without filtering her approved voice clips. One asset covers twenty segments and nothing of hers is regenerated. GAIN 0.06 -> 0.14: Quieter than the bed he could not hear, so it cannot have been audible either -- and an inaudible intercom bed cannot be judged, which is what he approved it to test.

**Prompt:** `An intercom speaker with the line open and nobody talking, microphone right at the grille. Narrow-band electrical hiss with a steady carrier hum under it, band-limited and boxy the way a small wall-mounted speaker colours everything. Filling the frame, recorded at a strong present level. Even throughout so it loops. No voices, no speech, no music, no clicks, no tones.`

### `ch01-072-static-answers`

| | |
|---|---|
| Asset | `sfx_intercom_static` |
| Category | interface (sfx layer) |
| Anchor | segment order 28 · clip `narrator-d3ceae9f0f0b` · occurrence 1 |
| Timing | before |
| Gain | 0.01 |
| Duration requested | 2.5s |
| Reusable in Godot | yes |
| Approx. review time | ~2:02 |

**Manuscript:** Narrator — “Static answered him.”

**Why:** The manuscript makes static the answer to his question. It is the scene's reply, so it plays before the line that names it.

**Prompt:** `A burst of static from an intercom speaker with no answer. Uneven narrow-band crackle and hiss through a small speaker grille, rising briefly and falling away to nothing. Thin and boxy. No voices, no speech, no music, no tones.`

### `ch01-073-intercom-retap`

| | |
|---|---|
| Asset | `sfx_intercom_open` |
| Category | interface (sfx layer) |
| Anchor | segment order 29 · clip `narrator-ed5637682370` · occurrence 1 |
| Timing | during +500ms |
| Gain | 0.05 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~2:04 |

**Manuscript:** Narrator — “Jack tapped the button again.”

**Why:** 'Jack tapped the button again' -- the same asset, slightly quieter. The repeat is the information: he is not getting an answer.

**Prompt:** `An intercom being keyed on. A firm mechanical button press followed immediately by a small electrical pop and the channel opening into a thin live speaker hiss. Close-mic, tactile. No voices, no speech, no music, no tones.`

### `ch01-080-intercom-close`

| | |
|---|---|
| Asset | `sfx_intercom_close` |
| Category | interface (sfx layer) |
| Anchor | segment order 49 · clip `narrator-91b25dbe2d24` · occurrence 1 |
| Timing | during +700ms |
| Gain | 0.03 |
| Duration requested | 1s |
| Reusable in Godot | yes |
| Approx. review time | ~2:46 |

**Manuscript:** Narrator — “Jack released the intercom and looked back at the monitor. The TOMBS directory was still open.”

**Why:** Closes the frame cue ch01-070 opened. Without it the listener has no signal that Sarah's channel is gone, and the room he is left alone in is the point of the next four segments.

**Prompt:** `An intercom channel closing. A light mechanical release click and the live speaker hiss cutting away to room silence. Close-mic, small and final. No voices, no speech, no music, no tones.`

### `ch01-090-file-opens`

| | |
|---|---|
| Asset | `sfx_system_notify_soft` |
| Category | interface (sfx layer) |
| Anchor | segment order 53 · clip `system-49a4bf38c005` · occurrence 1 |
| Timing | before |
| Gain | 0.03 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~3:00 |

**Manuscript:** TOMBS / settlement systems — “Boundary control.”

**Why:** 'Jack froze as a file opened', then TOMBS says Boundary control. Reusing the same calm notification ties this to the directory opening earlier: it is the same intruder, doing the same unhurried thing.

**Prompt:** `A single electronic notification from a computer acting on its own, microphone close to the speaker. One rounded mid-range blip with a short clean tail, followed by a brief digital interface flourish, sounding once and not repeating. Filling the frame, recorded at a strong present level, with a little room around it. Not an alarm, no voices, no music.`

### `ch01-100-door-slides`

| | |
|---|---|
| Asset | `sfx_lab_door_slide` |
| Category | foley (sfx layer) |
| Anchor | segment order 55 · clip `narrator-e2bfa452045f` · occurrence 1 |
| Timing | during +1500ms |
| Gain | 0.02 |
| Duration requested | 2.5s |
| Reusable in Godot | yes |
| Approx. review time | ~3:02 |

**Manuscript:** Narrator — “He reached for the keyboard just as the laboratory door slid open behind him.”

**Why:** The manuscript puts the door mid-sentence and behind him. The listener should know someone is in the room a beat before Jack does.

**Prompt:** `An automatic laboratory door sliding open. A soft pneumatic release, a smooth mechanical glide along a track, and a light settling clunk as it reaches the end of its travel. Clean modern facility, close but with room reflection behind it. No voices, no music, no alarm.`

### `ch01-101-sarah-enters`

| | |
|---|---|
| Asset | `sfx_footsteps_sarah_sneakers` |
| Category | foley (sfx layer) |
| Anchor | segment order 56 · clip `narrator-1fe67963523b` · occurrence 1 |
| Timing | during +300ms |
| Gain | 0.15 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~3:07 |

**Manuscript:** Narrator — “Sarah Bennett stepped inside with a tablet tucked beneath one arm. She glanced from Jack to the computer.”

**Why:** Someone entering is one of the few things footsteps are for. Soft rubber soles on a hard floor, because Chapter 1 canon puts her in gray sneakers.

**Prompt:** `Four or five footsteps of an adult in rubber-soled sneakers on a hard smooth laboratory floor, microphone at floor level beside them. Rubbery contact with a broad low thud under it and no heel click, an even walking gait. Close and filling the frame, recorded at a strong present level, with modest room reflection. No voices, no music, no heels, no hard shoes, no boots.`

### `ch01-110-sarah-crosses`

| | |
|---|---|
| Asset | `sfx_footsteps_sarah_sneakers` |
| Category | foley (sfx layer) |
| Anchor | segment order 67 · clip `narrator-98744cc92aa4` · occurrence 1 |
| Timing | during +900ms |
| Gain | 0.15 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~3:34 |

**Manuscript:** Narrator — “Jack pointed toward the monitor as she walked over.”

**Why:** 'as she walked over' -- the second and last time the chapter hears her walk. It moves her from the doorway to Jack's shoulder, which is where she stays.

**Prompt:** `Four or five footsteps of an adult in rubber-soled sneakers on a hard smooth laboratory floor, microphone at floor level beside them. Rubbery contact with a broad low thud under it and no heel click, an even walking gait. Close and filling the frame, recorded at a strong present level, with modest room reflection. No voices, no music, no heels, no hard shoes, no boots.`

### `ch01-120-second-chair`

| | |
|---|---|
| Asset | `sfx_chair_roll_slow` |
| Category | foley (sfx layer) |
| Anchor | segment order 99 · clip `narrator-a1d352c4ee9f` · occurrence 1 |
| Timing | during +400ms |
| Gain | 0.04 |
| Duration requested | 2.5s |
| Reusable in Godot | yes |
| Approx. review time | ~4:47 |

**Manuscript:** Narrator — “She pulled another chair beside him and nudged his out of the way.”

**Why:** Two people arranging themselves around one workstation. The chairs are how the chapter shows them working as a pair, and it is worth hearing once.

**Prompt:** `An office chair on castors rolled a short distance across a hard floor, microphone right at the castors. An even castor rumble at walking pace over a smooth surface, ending in a settle as the chair takes weight. Close and physical, filling the frame, recorded at a strong present level, with room reflection. No voices, no music, no impact.`

### `ch01-121-jack-makes-room`

| | |
|---|---|
| Asset | `sfx_chair_roll_slow` |
| Category | foley (sfx layer) |
| Anchor | segment order 106 · clip `narrator-0444653f442f` · occurrence 1 |
| Timing | during +200ms |
| Gain | 0.04 |
| Duration requested | 2.5s |
| Reusable in Godot | yes |
| Approx. review time | ~5:02 |

**Manuscript:** Narrator — “Jack rolled sideways to give her room.”

**Why:** The same asset closing the small joke that started with 'Move.' Jack gives up the keyboard, physically.

**Prompt:** `An office chair on castors rolled a short distance across a hard floor, microphone right at the castors. An even castor rumble at walking pace over a smooth surface, ending in a settle as the chair takes weight. Close and physical, filling the frame, recorded at a strong present level, with room reflection. No voices, no music, no impact.`

### `ch01-130-sarah-types`

| | |
|---|---|
| Asset | `sfx_keyboard_typing_short` |
| Category | foley (sfx layer) |
| Anchor | segment order 107 · clip `narrator-2fd1747b8b44` · occurrence 1 |
| Timing | during +300ms |
| Gain | 0.23 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~5:04 |

**Manuscript:** Narrator — “Sarah immediately started typing.”

**Why:** 'Sarah immediately started typing' -- the moment the competent one takes over. Marking who has the keyboard is the scene's quiet shift of authority.

**Prompt:** `Continuous fast typing on a low-profile computer keyboard, microphone directly over the keys. Keystrokes landing without a gap for the whole recording, about six a second, each a crisp plastic click with the dense clatter of the key bed under it. No pauses, no fade in, no fade out. Filling the frame, recorded at a strong present level. No voices, no music, no beeping, no mouse clicks.`

### `ch01-131-sarah-history`

| | |
|---|---|
| Asset | `sfx_keyboard_typing_short` |
| Category | foley (sfx layer) |
| Anchor | segment order 111 · clip `narrator-94fb639def2d` · occurrence 1 |
| Timing | during +250ms |
| Gain | 0.23 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~5:13 |

**Manuscript:** Narrator — “Sarah opened the connection history.”

**Why:** Sarah opening the connection history. She has the keyboard now and the scene should keep saying so.

**Prompt:** `Continuous fast typing on a low-profile computer keyboard, microphone directly over the keys. Keystrokes landing without a gap for the whole recording, about six a second, each a crisp plastic click with the dense clatter of the key bed under it. No pauses, no fade in, no fade out. Filling the frame, recorded at a strong present level. No voices, no music, no beeping, no mouse clicks.`

### `ch01-132-sarah-digs`

| | |
|---|---|
| Asset | `sfx_keyboard_typing_short` |
| Category | foley (sfx layer) |
| Anchor | segment order 118 · clip `narrator-d4aef8b58a3e` · occurrence 1 |
| Timing | during +1600ms |
| Gain | 0.23 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~5:26 |

**Manuscript:** Narrator — “Jack watched as Sarah opened another window and began digging through the security logs.”

**Why:** “began digging through the security logs” is the longest stretch of work in the chapter and had no sound under it at all.

**Prompt:** `Continuous fast typing on a low-profile computer keyboard, microphone directly over the keys. Keystrokes landing without a gap for the whole recording, about six a second, each a crisp plastic click with the dense clatter of the key bed under it. No pauses, no fade in, no fade out. Filling the frame, recorded at a strong present level. No voices, no music, no beeping, no mouse clicks.`

### `ch01-133-sarah-keeps-typing`

| | |
|---|---|
| Asset | `sfx_keyboard_typing_short` |
| Category | foley (sfx layer) |
| Anchor | segment order 132 · clip `narrator-a1ae4cf23cd8` · occurrence 1 |
| Timing | during +200ms |
| Gain | 0.23 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~6:02 |

**Manuscript:** Narrator — “Sarah kept typing.”

**Why:** The narration says plainly that she kept typing. Quiet, because it is under a line of banter rather than under the investigation.

**Prompt:** `Continuous fast typing on a low-profile computer keyboard, microphone directly over the keys. Keystrokes landing without a gap for the whole recording, about six a second, each a crisp plastic click with the dense clatter of the key bed under it. No pauses, no fade in, no fade out. Filling the frame, recorded at a strong present level. No voices, no music, no beeping, no mouse clicks.`

### `ch01-140-sarah-resumes`

| | |
|---|---|
| Asset | `sfx_keyboard_typing_short` |
| Category | foley (sfx layer) |
| Anchor | segment order 151 · clip `narrator-75a8844f5b06` · occurrence 1 |
| Timing | during +200ms |
| Gain | 0.23 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~6:46 |

**Manuscript:** Narrator — “Sarah returned to the keyboard.”

**Why:** “Sarah continued typing.” Re-anchored on 2026-09-18 when Joshua's approved manuscript correction changed that line: the text changed, so the clip's identity changed, and this is the one case where an anchor is SUPPOSED to be edited. Validation caught it rather than letting the cue land somewhere plausible.

**Prompt:** `Continuous fast typing on a low-profile computer keyboard, microphone directly over the keys. Keystrokes landing without a gap for the whole recording, about six a second, each a crisp plastic click with the dense clatter of the key bed under it. No pauses, no fade in, no fade out. Filling the frame, recorded at a strong present level. No voices, no music, no beeping, no mouse clicks.`

### `ch01-150-interrupting-tone`

| | |
|---|---|
| Asset | `sfx_alert_warning_hit` |
| Category | alarm (sfx layer) |
| Anchor | segment order 153 · clip `narrator-2525fa15c09f` · occurrence 1 |
| Timing | before |
| Gain | 0.02 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~6:50 |

**Manuscript:** Narrator — “A new warning tone interrupted them. Both turned toward the main console as another message appeared.”

**Why:** The manuscript says a new warning tone interrupted them, so the tone must arrive before the narration, into the middle of the warmest moment in the chapter. Same asset as the earlier alert -- the same machine is calling again.

**Prompt:** `One sharp electronic warning tone announcing a new alert on a laboratory display. Single hard synthetic alert stab, urgent and attention-grabbing, short decay, slight room reflection. One hit only, no repeats, no siren, no voices, no music.`

### `ch01-151-array-rise`

| | |
|---|---|
| Asset | `amb_tombs_array_power_rise` |
| Category | system (sfx layer) |
| Anchor | segment order 154 · clip `system-f6a28699a3b1` · occurrence 1 |
| Timing | after |
| Gain | 0.02 |
| Fades | in 4000ms · out -ms |
| Duration requested | 20s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~6:56 |

**Manuscript:** TOMBS / settlement systems — “Tombs array remote initialization request.”

**Why:** The array waking up, ONCE, from the remote initialization request. It used to sustain to the end of the chapter, and that was the same mistake chapters 2 and 3 carried: this asset is a 20-second RISE, a bed loops, so it climbed, snapped back and climbed again under the last thirty segments. A rise played once is what the moment actually is -- something enormous starting -- and the chapter ends before it would have needed to repeat.

**Prompt:** `A very large machine beginning to draw power somewhere below and far away. Deep sub-bass hum rising slowly in pitch and intensity, layered with a distant electrical charging whine and a faint sense of enormous mass energising. Restrained and ominous, felt more than heard, no impact, no explosion, no siren, no voices, no music, no cinematic riser or trailer hit.`

### `ch01-160-denied-first`

| | |
|---|---|
| Asset | `sfx_access_denied_tone` |
| Category | system (sfx layer) |
| Anchor | segment order 162 · clip `system-0fe0cf2a5742` · occurrence 1 |
| Timing | before |
| Gain | 0.08 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~7:13 |

**Manuscript:** TOMBS / settlement systems — “Request denied.”

**Why:** The refusal tone before TOMBS says Request denied, so the system rejects him and then explains itself.

**Prompt:** `A system refusing a command. One short blunt descending two-note electronic rejection tone, flat and unsympathetic, close-mic with slight room. Final but not an alarm. No voices, no music, no siren.`

### `ch01-161-denied-second`

| | |
|---|---|
| Asset | `sfx_access_denied_tone` |
| Category | system (sfx layer) |
| Anchor | segment order 164 · clip `system-0fe0cf2a5742` · occurrence 2 |
| Timing | before |
| Gain | 0.08 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~7:16 |

**Manuscript:** TOMBS / settlement systems — “Request denied.”

**Why:** The second occurrence of the same clip, and the same asset again. Hearing the identical refusal twice is the information: he tried again and got exactly nowhere. This cue is why anchors carry an occurrence number.

**Prompt:** `A system refusing a command. One short blunt descending two-note electronic rejection tone, flat and unsympathetic, close-mic with slight room. Final but not an alarm. No voices, no music, no siren.`

### `ch01-171-jack-credentials`

| | |
|---|---|
| Asset | `sfx_keyboard_typing_short` |
| Category | foley (sfx layer) |
| Anchor | segment order 167 · clip `narrator-cddc94b869d1` · occurrence 1 |
| Timing | during +500ms |
| Gain | 0.23 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~7:22 |

**Manuscript:** Narrator — “He entered his administrator credentials, but a new message appeared before he could issue another command.”

**Why:** Jack entering his administrator credentials. Slightly louder than the rest: this is the keystroke the chapter turns on, and the refusal answers it.

**Prompt:** `Continuous fast typing on a low-profile computer keyboard, microphone directly over the keys. Keystrokes landing without a gap for the whole recording, about six a second, each a crisp plastic click with the dense clatter of the key bed under it. No pauses, no fade in, no fade out. Filling the frame, recorded at a strong present level. No voices, no music, no beeping, no mouse clicks.`

### `ch01-170-revoked`

| | |
|---|---|
| Asset | `sfx_access_revoked_tone` |
| Category | system (sfx layer) |
| Anchor | segment order 168 · clip `system-28a18477a67e` · occurrence 1 |
| Timing | before |
| Gain | 0.08 |
| Duration requested | 2s |
| Reusable in Godot | yes |
| Approx. review time | ~7:28 |

**Manuscript:** TOMBS / settlement systems — “Access revoked.”

**Why:** The chapter's turn. Being locked out is not the same event as being refused, and it should not sound like it -- heavier, lower, final. After this the sound design gets out of the way and leaves the last nine segments to two voices and the rising array.

**Prompt:** `A system locking a user out for good. A heavier descending electronic tone with a low weighted thud underneath it and a short cold decay, more serious and more final than an ordinary rejection. Close-mic with slight room. No voices, no music, no siren, no alarm.`

### `ch01-172-jack-retries`

| | |
|---|---|
| Asset | `sfx_keyboard_typing_short` |
| Category | foley (sfx layer) |
| Anchor | segment order 175 · clip `narrator-7fd987f61325` · occurrence 1 |
| Timing | during +250ms |
| Gain | 0.23 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~7:41 |

**Manuscript:** Narrator — “Jack tried his credentials again.”

**Why:** “Jack tried his credentials again.” The same sound a second time is the information, exactly as the two denial tones are.

**Prompt:** `Continuous fast typing on a low-profile computer keyboard, microphone directly over the keys. Keystrokes landing without a gap for the whole recording, about six a second, each a crisp plastic click with the dense clatter of the key bed under it. No pauses, no fade in, no fade out. Filling the frame, recorded at a strong present level. No voices, no music, no beeping, no mouse clicks.`

## Unique assets

| Asset | Category | Loop | Secs | Events | Godot | State |
|---|---|---|---|---|---|---|
| `amb_computer_lab` | ambience | yes | 45.1 | 1 | yes | cached |
| `amb_console_alarm_bed` | alarm | yes | 12 | 1 | yes | cached |
| `amb_intercom_channel_open` | ambience | yes | 10 | 1 | yes | cached |
| `amb_tombs_array_power_rise` | system | yes | 20 | 1 | yes | cached |
| `sfx_access_denied_tone` | system | no | 1.5 | 2 | yes | cached |
| `sfx_access_revoked_tone` | system | no | 2 | 1 | yes | cached |
| `sfx_alert_warning_hit` | alarm | no | 1.5 | 2 | yes | cached |
| `sfx_chair_roll_fast` | foley | no | 2 | 1 | yes | cached |
| `sfx_chair_roll_slow` | foley | no | 2.5 | 2 | yes | cached |
| `sfx_console_tone_soft` | interface | no | 1.5 | 2 | yes | cached |
| `sfx_equipment_power_up_soft` | system | no | 2.5 | 1 | yes | cached |
| `sfx_footsteps_sarah_sneakers` | foley | no | 3 | 2 | yes | cached |
| `sfx_intercom_close` | interface | no | 1 | 1 | yes | cached |
| `sfx_intercom_open` | interface | no | 1.5 | 2 | yes | cached |
| `sfx_intercom_static` | interface | no | 2.5 | 1 | yes | cached |
| `sfx_keyboard_typing_short` | foley | no | 3 | 9 | yes | cached |
| `sfx_lab_door_slide` | foley | no | 2.5 | 1 | yes | cached |
| `sfx_system_notify_soft` | interface | no | 1.5 | 2 | yes | cached |
| `sfx_terminal_lock_engage` | interface | no | 2 | 1 | yes | cached |

19 of 19 are reusable in Godot. The game decides when each one plays; this cue
sheet only decides when the audiobook plays it.
