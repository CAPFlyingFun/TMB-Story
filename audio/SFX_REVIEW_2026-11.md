# Sound review for the v4 audiobook, Chapters 1 to 9 (for Joshua to approve or change)

Drafted 2026-11-07 while the v4 voices for Chapters 2 to 9 render. **Nothing in this file has been generated or spent.** Mark each row: **keep**, **redo**, **replace**, **cut**, or write the change you want. Generation waits until you have seen how many credits the voices leave.

## What changes, and what's free

- **The voices moved to a new timeline.** The v4 dialogue files have different timing from the v2 clips. Each cue is anchored to a *line*, not to a time, so placing every existing cue on the new timeline is **free**. That alone gives Chapters 1 to 9 their ambience and effects back.
- **The model.** ElevenLabs' newest sound model is still **SFX v3** (`eleven_text_to_sound_v3`, which we already use). There is no SFX v4. v3 follows multi-part prompts better and sounds more natural than v2.
- **One catch on loops.** ElevenLabs says seamless looping only works on **SFX v2**. v3 has no loop option. Our generated beds were made on v3, so they're not true loops, and that matches the "too quiet" and seam trouble we had. For anything that loops, the choice is:
  - (a) **SFX v2 with looping on** (recommended for beds); or
  - (b) a longer **v3** take, up to 20 s, crossfaded into a loop by our own pipeline; or
  - (c) a **supplied recording**, like the three you already chose, which loop perfectly.
- **Cost.** ElevenLabs charges sound effects by length, not by characters. I'll price one generation before any batch, so the totals below are counts, not credits.

## The assets (35 in the library; 29 used in Chapters 1 to 9)

### Beds: ambience and alarms that run under the voices

| Asset | What it is | Chapters | Today | Proposal |
|---|---|---|---|---|
| amb_computer_lab | Your supplied computer-room tone | 1–10 | approved, loops cleanly | **keep** |
| amb_night_outside | Your supplied outdoor night tone | 5, 9 | approved | **keep** |
| amb_nature_outside | Your supplied nature tone | 3, 10 | approved | **keep** |
| amb_intercom_channel_open | Open intercom line, nobody talking | 1–5, 8–10 | too quiet to rescue | **redo** on SFX v2 with looping on, louder hiss in the prompt |
| amb_tombs_lab_night | Lab room tone at night | (library) | too quiet to rescue | **cut**: amb_computer_lab already does this job |
| amb_console_alarm_bed | Two-note security alarm, looping | 1, 2 | usable | **redo** on v2 with looping on (seam check) |
| amb_tombs_array_power_rise | Huge machine drawing power far below | 1, 3 | usable | **keep**, or redo on v2 with looping on if you hear a seam |
| amb_settlement_sirens | Town sirens heard through walls | (library) | quiet | **keep in library** (not used in 1–9) |
| amb_alarm_pulse / _fast | Settlement alert built to your spec | — | approved (procedural) | **keep** |
| sfx_siren_winddown | Siren dying away | — | approved (procedural) | **keep** |

**New beds worth considering (your call):**
1. **Medical center** room tone, for the birth chapters later.
2. **Underground gallery**: water channel, pumps, drips. Used in Chapters 32–45.
3. **Settlement street at night under streetlights**, with distant island sounds. Chapters 12 on.

These are for later chapters, so they're listed now for planning only.

### One-shot effects

| Asset | What it is | Chapters (times used) | Today | Proposal |
|---|---|---|---|---|
| sfx_keyboard_typing_short | Fast typing | 1–4, 6–10 | too quiet to rescue | **redo**: closer mic, "clearly audible keystrokes" |
| sfx_chair_roll_fast | Chair shoved back on castors | 1, 2 | too quiet to rescue | **redo** |
| sfx_chair_roll_slow | Chair rolled a short way | 1 | too quiet to rescue | **redo** |
| sfx_footsteps_sarah_sneakers | Sneaker steps on a lab floor | 1, 2 | quiet | **redo** |
| sfx_terminal_lock_engage | Terminal locking click-clunk | 1 | quiet | **redo** |
| sfx_console_tone_soft | Two-tone console blip | 1, 5, 10 | quiet | **redo** |
| sfx_distant_vibration_deep | Deep vibration through the building | 3, 4, 5, 7 | quiet | **redo**: more body in the low end |
| sfx_system_notify_soft | Computer notification | 1–10 | usable | keep |
| sfx_alert_warning_hit | Sharp warning tone | 1, 2, 3, 9 | usable | keep |
| sfx_console_alarm_erupt | Console bursting into alarm | (library) | usable | keep |
| sfx_equipment_power_up_soft | Equipment coming back on | 1, 2 | usable | keep |
| sfx_intercom_open | Intercom keyed on | 1, 2, 4, 5, 10 | usable | keep |
| sfx_intercom_static | Static burst, no answer | 1, 8, 9 | usable | keep |
| sfx_intercom_close | Intercom closing | 1, 4, 5, 8, 10 | usable | keep |
| sfx_lab_door_slide | Automatic lab door | 1, 2, 5, 8, 9 | usable | keep |
| sfx_access_denied_tone | Command refused | 1, 7 | usable | keep |
| sfx_access_revoked_tone | User locked out | 1 | usable | keep |
| sfx_wrist_terminal_chirp | Wrist device incoming call | 2, 3, 4, 5, 8 | usable | keep |
| sfx_array_rings_move | Huge rings turning | 2, 3 | usable | keep |
| sfx_shutdown_lever_pull | Industrial lever, power dropping | 2 | usable | keep |
| sfx_building_shake | Building shudder | 3, 4, 5, 7 | usable | keep |
| sfx_boundary_event_collapse | The boundary event: air compresses | 3 | usable | keep (the signature moment) |
| sfx_boundary_event_return | Sound rushing back | 3 | usable | keep |
| sfx_stumble_console_catch | Stumble, catching a console | 3 | not measured | keep, measure |

### Cues per chapter (the line each sound is tied to stays the same)

| Ch | Cues | Distinct sounds |
|---|---|---|
| 1 | 34 | 19 |
| 2 | 20 | 14 |
| 3 | 20 | 14 |
| 4 | 18 | 9 |
| 5 | 14 | 11 |
| 6 | 6 | 3 |
| 7 | 6 | 6 |
| 8 | 14 | 8 |
| 9 | 10 | 8 |

Chapters 6 and 7 are thin, with six cues each. If you'd like more texture there, say so and I'll propose cues from the text, such as outdoor beds for the edge scenes.

## My recommendation, cheapest first

1. **Free:** put every existing cue on the v4 timeline and build each chapter's one-file mix (voices plus ambience plus effects) for Chapters 1 to 9.
2. **Small spend:** redo the seven quiet one-shots and the intercom bed. That's 8 generations, about 30 seconds of sound in total.
3. **Optional:** redo the two alarm or power beds as true v2 loops, and add the new beds when we reach those chapters.
