# Chapter 7: Someone Knew — SFX and ambience cue sheet

**Status: every cued asset is generated and cached.**

Generated from `audio/cues/chapter-07.json` and `audio/sfx-registry.json`, so
this document cannot drift from what the pipeline would actually play. Rebuild it
with `python3 scripts/render-cue-sheet.py 7`.

| | |
|---|---|
| Playback events | **6** |
| Unique assets | **6** (0 still to generate) |
| Chapter runtime as it plays today | 7:24 |
| Voice clips regenerated for this | **none** |

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

### `ch07-005-control-room`

| | |
|---|---|
| Asset | `amb_computer_lab` |
| Category | ambience (ambience layer) |
| Anchor | segment order 0 · clip `narrator-3e960cb08736` · occurrence 1 |
| Timing | before |
| Sustain | loops to segment order 175 |
| Gain | 0.12 |
| Fades | in 2500ms · out 5000ms |
| Duration requested | 45.1s, looping |
| Reusable in Godot | yes |
| Approx. review time | ~0:00 |

**Manuscript:** Narrator — “Sarah broke the silence.”

**Why:** Still in the control room, straight on from the end of Doctor Mercer's call. Chapter 7 opens where Chapter 6 stopped, so the same computer-lab bed fades back in under 'Sarah broke the silence.' and holds to the end.

**Prompt:** `(hand-supplied asset; no prompt)`

### `ch07-060-machine-data`

| | |
|---|---|
| Asset | `sfx_keyboard_typing_short` |
| Category | foley (sfx layer) |
| Anchor | segment order 78 · clip `narrator-b4f6f627bc1d` · occurrence 1 |
| Timing | before |
| Gain | 0.17 |
| Duration requested | 3s |
| Reusable in Godot | yes |
| Approx. review time | ~3:41 |

**Manuscript:** Narrator — “Lines of machine data filled the screen.”

**Why:** The maintenance partition opening, filling the screen with machine data the intruder did not erase.

**Prompt:** `Continuous fast typing on a low-profile computer keyboard, microphone directly over the keys. Keystrokes landing without a gap for the whole recording, about six a second, each a crisp plastic click with the dense clatter of the key bed under it. No pauses, no fade in, no fade out. Filling the frame, recorded at a strong present level. No voices, no music, no beeping, no mouse clicks.`

### `ch07-070-timestamp`

| | |
|---|---|
| Asset | `sfx_access_denied_tone` |
| Category | system (sfx layer) |
| Anchor | segment order 107 · clip `narrator-8bb6c152c79e` · occurrence 1 |
| Timing | before |
| Gain | 0.05 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~4:43 |

**Manuscript:** Narrator — “Lena looked at the boundary map and then back at the timestamp.”

**Why:** A single flat system tone as the creation time is checked against the island clock and the backup server. Not an alarm -- four dB down, and the same tone Chapter 1 uses when TOMBS refuses him -- because what it marks is a machine calmly confirming something nobody wants confirmed.

**Prompt:** `A system refusing a command. One short blunt descending two-note electronic rejection tone, flat and unsympathetic, close-mic with slight room. Final but not an alarm. No voices, no music, no siren.`

### `ch07-080-three-words`

| | |
|---|---|
| Asset | `sfx_system_notify_soft` |
| Category | interface (sfx layer) |
| Anchor | segment order 164 · clip `narrator-78184efa1ff6` · occurrence 1 |
| Timing | before |
| Gain | 0.02 |
| Duration requested | 1.5s |
| Reusable in Godot | yes |
| Approx. review time | ~6:53 |

**Manuscript:** Narrator — “Three words appeared on the screen.”

**Why:** 'Three words appeared on the screen.' The notify tone lands just before the narration, so the listener hears the screen answer and is then told what it said: PHASE ONE READY.

**Prompt:** `A single electronic notification from a computer acting on its own, microphone close to the speaker. One rounded mid-range blip with a short clean tail, followed by a brief digital interface flourish, sounding once and not repeating. Filling the frame, recorded at a strong present level, with a little room around it. Not an alarm, no voices, no music.`

### `ch07-090-something-struck`

| | |
|---|---|
| Asset | `sfx_distant_vibration_deep` |
| Category | system (sfx layer) |
| Anchor | segment order 170 · clip `narrator-f5344ff6ac69` · occurrence 1 |
| Timing | before |
| Gain | 0.17 |
| Duration requested | 6s |
| Reusable in Godot | yes |
| Approx. review time | ~7:04 |

**Manuscript:** Narrator — “Outside, something struck the distant ground.”

**Why:** 'Outside, something struck the distant ground.' The last sound of the movement and the loudest, +8 dB -- one step beyond the boundary vibration in Chapter 5, because the point of the ending is that it is still coming.

**Prompt:** `A deep vibration arriving from somewhere far outside a building and passing through it. Sub-bass swell with a slow approach and a slower departure, felt through the structure rather than heard as an event, like distant thunder with no crack. Recorded at a strong present level with real low end. No voices, no music, no impact.`

### `ch07-091-window-trembles`

| | |
|---|---|
| Asset | `sfx_building_shake` |
| Category | foley (sfx layer) |
| Anchor | segment order 171 · clip `narrator-80850872cb2d` · occurrence 1 |
| Timing | during +300ms |
| Gain | 0.08 |
| Duration requested | 4s |
| Reusable in Godot | yes |
| Approx. review time | ~7:07 |

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
| `sfx_keyboard_typing_short` | foley | no | 3 | 1 | yes | cached |
| `sfx_system_notify_soft` | interface | no | 1.5 | 1 | yes | cached |

6 of 6 are reusable in Godot. The game decides when each one plays; this cue
sheet only decides when the audiobook plays it.
