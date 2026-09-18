# Ambience and sound effects

The audiobook plays three independent layers against one manifest:

| Layer | What it is | Who owns it |
|---|---|---|
| **VOICE** | the existing Narrator / Jack / Sarah / TOMBS clips | `audio/clips/`, unchanged by any of this |
| **AMBIENCE** | looping environmental beds | `audio/sfx/ambience/` |
| **SFX** | short events, plus looping alert beds | `audio/sfx/<category>/` |

Music is not implemented and nothing here assumes it.

The hierarchy is fixed: **speech is the point.** Ambience establishes location, foley
reinforces physical action that matters, alerts raise tension, and long stretches are
deliberately voices and room tone and nothing else. Restraint is part of the mix.

## An asset is its name; a cue is where it plays

This is the voice pipeline's own rule applied to sound.

- **`audio/sfx-registry.json`** defines assets. `sfx_chair_roll_fast` is one asset,
  identified by its name, used by Chapter 1, by Chapter 27 and by Godot. It is never
  named after where it first appeared and never lives in a chapter folder.
- **`audio/cues/chapter-NN.json`** says when assets play. Cues reference assets.
  Assets never belong to playback positions.

Editing a cue sheet is editorial and costs nothing. Inserting, moving or deleting a cue
cannot invalidate a single generated asset, and a test asserts it.

## Anchors, not timestamps

A cue points at a voice segment by **clip identity plus occurrence**:

```json
"anchor": { "clipId": "system-0fe0cf2a5742", "occurrence": 2 }
```

Two properties make this the right anchor:

- **Regenerating a voice clip changes its length, not its identity.** Recasting the
  narrator moved every absolute time in Chapter 1 and would have invalidated a
  timestamp-based cue sheet entirely. It moved no anchor.
- **Inserting a paragraph shifts every segment order** and, again, no anchor.

The occurrence number is not decoration. A clipId is deliberately shared by identical
lines — Chapter 1 has five such pairs, including both `"Request denied."` readouts — so
a clipId alone names a sound, not a place. The occurrence resolves it.

`python3 scripts/audio.py cues --chapters 1 --timestamps` prints approximate clock
times for a human ear. They are never the synchronisation mechanism, and the command
says so every time it runs.

## Timing and sustain

| `timing` | Effect |
|---|---|
| `before` | plays in the manifest's gap ahead of that segment |
| `after` | plays in the gap behind it |
| `during` + `offsetMs` | starts N ms into that segment |

A looping asset must carry a `sustain` block naming where it stops (`until` an anchor,
or `"chapterEnd"`); a cue sheet that loops a bed with no exit is rejected rather than
left running. `fadeInMs` and `fadeOutMs` are optional and fall back to
`mix.defaultFadeMs`.

`during` offsets are checked against the real clip length, because an offset past the
end of a clip would silently never be heard.

## The layer comes from the category, not from looping

Categories are `ambience`, `foley`, `interface`, `alarm`, `system`. Only `ambience`
answers to the Ambience toggle; everything else answers to Sound Effects. So a looping
alarm bed is still an effect, and switching ambience off cannot silence the chapter's
alarm.

## Mixing

`audio/config.json` holds a `mix` block. Nothing in it is a final artistic level.

- **Voice is the reference and is never attenuated.** The Voices control in the player
  is shown fixed on, because it is the thing the page exists for.
- A cue's own `gain` (0.0–1.0) wins; otherwise `mix.categoryGain` for its category.
- `mix.duckUnderSpeechTo` is a multiplier applied to a sustained bed **while a voice
  clip is actually sounding**, so an alarm can be present in the gaps and still sit
  under dialogue. One-shot foley is not ducked; it is short enough to read through
  speech, and ducking it would make it mush.
- Retuning any of this regenerates nothing.

## The cache

`fingerprint()` covers everything that would change the generated audio: prompt
(whitespace-normalised), requested duration, loop flag, prompt influence, provider,
model, output format, per-asset `assetVersion` and registry-wide `sfxVersion`.

Deliberately **excluded**: category, notes, `godotReuse`, approval state. Re-categorising
a sound or writing a better note is not a reason to pay for it again.

If the file exists and the fingerprint matches, generation is skipped — so a second
chapter cueing an approved sound spends nothing, and `assetVersion` is the lever for a
deliberate retake of one asset without touching any other.

**Generated vs supplied.** `source: "generated"` means ElevenLabs makes it from the
prompt. `source: "supplied"` means a human put the file there: no prompt, fingerprinted
by its own bytes, and generation never runs for it. An asset with no prompt is refused
rather than given an invented one, exactly as an unassigned voice is.

## Generation is manual, and never on a push

```
python3 scripts/audio.py sfx          --chapters 1     # free: what is cued, what is missing
python3 scripts/audio.py cues         --chapters 1 --timestamps
python3 scripts/audio.py generate-sfx --chapters 1 --dry-run
python3 scripts/audio.py generate-sfx --chapters 1     # spends credits
```

In CI: Actions → **Generate TMB audio**, with **generate_sfx** ticked. Two independent
guards keep this off a push — the workflow is `workflow_dispatch` only, and the sound
step additionally requires that input, which defaults to false. Both are pinned by
tests. The test suite itself never makes a real sound-effects request; every generation
test replaces the HTTP call with a local fake.

## The player must never depend on this

`reader/sfx.js` owns the extra layers; `reader/player.js` calls into it only through a
guarded accessor. If `sfx.js` fails to load, every call is a no-op and the audiobook
plays exactly as it did before ambience existed — and a test walks `player.js` line by
line to confirm no call site is unguarded.

A missing asset, a failed fetch, or a browser refusing to autoplay a second element
drops that one sound and leaves the voice track alone. An unresolvable cue is reported
in the manifest's `cueProblems` and left out rather than guessed at.

The browser holds no key, names no ElevenLabs endpoint and fetches only relative paths.
Tests assert all three as text.

## Godot reuse

`python3 scripts/audio.py export-game` writes `audio/game/sfx.json` beside
`dialogue.json`. It lists assets flagged `godotReuse`, pointing at **the same file the
audiobook plays** — never a second copy for the game.

**Timing is not exported.** The audiobook's cue sheet times a sound against narration;
Godot times the same asset against gameplay and animation. A test asserts the export
carries no `timing`, `order`, `anchor` or `cueId`.

## Footsteps

Footwear lives in `sfx-registry.json` under `characters`, one field per character, so a
future outfit system has somewhere to plug in without one existing now. Chapter 1 canon
puts both Jack and Sarah in gray sneakers — **not heels for Sarah**, and a test asserts
the word never appears in her profile.

Footsteps are for someone approaching, someone entering, hurried movement and real
spatial transitions. A listener does not need to hear every step. Jack has a profile and
**no asset**, because he is seated for the whole of Chapter 1 and generating his
footsteps now would be paying for silence.

## What Chapter 1 deliberately has no sound for

Recorded because the omissions are the design as much as the cues are.

| Manuscript moment | Why there is no sound |
|---|---|
| "The cursor moved without him touching anything." | A cursor is silent. Inventing a sound would be untrue, and the silence is what makes the moment frightening. |
| Jack rejecting the request; "He tried again"; "Jack tried his credentials again" | Individual keypresses are the "constant button beeps" failure mode. The refusal tones carry it. |
| "Sarah placed her tablet beside the keyboard" | A trivial gesture. The chairs already show her taking over the workstation, and they do it better. |
| Sarah typing across roughly twenty segments of banter | Typing under the whole conversation would exhaust the listener and fight the dialogue. Three short cues mark where the manuscript actually starts or resumes typing. |
| "Jack rubbed his eyes", "raised an eyebrow", "spread his hands", "nodded solemnly" | Adequately communicated by narration. An SFX would only duplicate it. |
| "Sarah exhaled through her nose", "laughed softly" | Performed by her voice clip. Nothing to add. |
| The last nine segments, after "Access revoked." | The design gets out of the way on purpose. Two voices and the rising array hum is the strongest possible ending, and another effect would weaken it. |
| Music, anywhere | Not used for this test, by instruction. |
