# TMB audio pipeline

Write once. Voice once. Cache once. Use in the audiobook and the game.

The manuscript in `chapters/` is canonical. This pipeline reads it, works out who speaks
each line, generates that line through ElevenLabs with the right voice, caches the clip
permanently, and plays a whole chapter in the browser. The same clips are what the Godot
game will use for character dialogue.

The repository's toolchain is Python 3 standard library, so these are Python commands
rather than npm scripts. Nothing here needs a dependency install.

## The security rule, first

The **ElevenLabs API key is a secret.** It lives in the `ELEVENLABS_API_KEY` GitHub
secret and, for local work, in your shell environment. It is never committed, never
printed, never written to a manifest or a sidecar, and never sent to the browser.
`scripts/tmbaudio/elevenlabs.py` is the only file that reads it.

**ElevenLabs voice IDs are not secrets** and live in `story-rules/voice-registry.json`.

GitHub Pages is public, so the player never calls ElevenLabs. It plays static files that
were generated in a secure environment.

## How to add a character voice

1. Create or pick the voice in ElevenLabs and copy its voice ID.
2. Open `story-rules/voice-registry.json` and set `elevenLabsVoiceId` for that speaker.
   Add the speaker if they are new, with an `id`, `name`, `audioKey`, `kind`
   (`character`, `narration` or `system`), `gameExport`, any `aliases` the manuscript
   uses, and `pronouns` if they are a person.
3. Optionally add a tuning override in `audio/config.json` under `speakerSettings`.
4. Check it: `python3 scripts/audio.py voices`

Never invent a voice ID. A speaker with `null` is reported as unassigned and generation
refuses to run for them.

## How to validate a chapter

```
python3 scripts/audio.py validate --chapters 1-3
python3 scripts/audio.py validate --chapters 1 --show-review
```

This parses the manuscript, writes the manifests, and reports segment counts per
speaker, how each attribution was decided, any missing voices, and any ambiguous
speakers. It costs nothing and touches no network. `READY FOR GENERATION` is only `YES`
when there are no unresolved speakers and every speaker used has a voice.

If a line cannot be attributed from an explicit signal, it is marked
`REVIEW_REQUIRED` and never guessed. Pin it in `audio/speaker-overrides.json`:

```json
{ "clips": { "REVIEW_REQUIRED-abc123def456": {
    "speaker": "jack-bennett", "note": "why, and that you checked the manuscript" } } }
```

Attributions labelled `alternation` are inferences from a two-speaker exchange. They are
allowed, but they are counted separately so you can spot-check them.

## How to generate missing audio

```
export ELEVENLABS_API_KEY=...            # your shell, never a tracked file
python3 scripts/audio.py generate --chapters 1-3 --dry-run   # costs nothing
python3 scripts/audio.py generate --chapters 1-3             # generates what is missing
```

Default behaviour always minimises credit use: a clip is generated only when its audio
is absent or when something that changes the audio has changed.

Or run it in CI: Actions → **Generate TMB audio** → Run workflow. It is manual only and
never runs on a push. A CI run does the whole round trip: the tests, then validation,
then generation, then `combine`, then `export-game`, then a check that the secret is
nowhere in the working tree, and only then the commit. It has `ffmpeg`, which this
development environment does not, so a CI run is currently the only way to get a
combined chapter with the manifest's pauses in it.

## How to regenerate one line, or one chapter, or one character

```
python3 scripts/audio.py generate --force jack-bennett-a83f2b1c4d5e
python3 scripts/audio.py generate --chapters 2 --force-chapter 2
python3 scripts/audio.py generate --chapters 1-3 --force-speaker sarah-bennett
```

Usually you do not need `--force`. Editing a line changes its text, which changes its
clip identity, so the next ordinary run generates exactly that one clip. Re-tuning a
character's settings or bumping their `voiceVersion` changes only their fingerprints, so
the next run regenerates only their clips.

## How to listen

Open the reader and choose the **Listen** tab, or `#listen`. Pick a chapter and press
play. The player walks the manifest in order, applies the pause before each segment,
preloads the next clips, and shows the current speaker and line. It plays existing audio
only: replaying a chapter costs nothing. Clips that have not been generated yet are
reported and skipped rather than breaking playback.

Speed, previous and next segment, and a position slider are all there. It is built for a
phone as well as a desktop.

## How to create a combined chapter

```
python3 scripts/audio.py combine --chapters 1-3
```

Writes `audio/exports/chapter-NN.mp3`. The individual clips are the master assets and are
never deleted or replaced by this step; they are still what selective regeneration, the
game and any future editing use.

With `ffmpeg` on the path the manifest's pauses are inserted accurately. Without it the
clips are joined directly, which plays but has no gaps. The player applies the pauses
properly either way, which is why pauses are kept out of the clips themselves.

## How Godot consumes the dialogue manifest

```
python3 scripts/audio.py export-game --chapters 1-3
```

Writes `audio/game/dialogue.json`: character and system lines only, because narration is
audiobook-only. Each entry carries a stable `lineId`, the character, the text, the
chapters it appears in, and an `audio` path pointing at **the same clip the audiobook
plays**. One generated Jack line exists once and serves both.

In Godot, load the JSON, index it by `lineId` or by character, and stream the referenced
file. A line repeated in two chapters appears once with both chapter numbers.

## How the secret is configured

- **CI:** the repository secret `ELEVENLABS_API_KEY`. The workflow passes it to the
  process environment for the generation step only, then asserts that it does not appear
  anywhere in the working tree before committing.
- **Locally:** `export ELEVENLABS_API_KEY=...` in your shell. `.env` and `.env.*` are
  git-ignored; `.env.example` is committed and holds no value.
- **Browser:** never. There is no key in the player, and there is no code path from the
  player to ElevenLabs.

## Design notes worth knowing

**Clip identity is content-addressed, not positional.** A clip id is a hash of the
speaker plus the spoken text. Inserting a paragraph at the top of a chapter leaves every
other clip id untouched, and the manifest carries `order` separately for playback. Two
identical lines by the same speaker deliberately share one clip, which is why three
`"Access denied."` readouts cost one generation. Set a `variant` on a segment if a
repeated line ever needs a different delivery.

**Two independent invalidation mechanisms.** Identity covers text changes. The
fingerprint, a hash of text plus voice ID plus voice version plus model plus output
format plus resolved settings, covers everything else. A clip is regenerated only when
one of those actually changed.

**Clips are grouped by speaker, not by chapter.** `audio/clips/<audioKey>/<clipId>.mp3`,
with a `.json` sidecar recording the fingerprint. Grouping by chapter would duplicate a
repeated line and break the reuse the whole design is for.

**Narration and dialogue are always separate segments,** even inside one paragraph, so a
character's line is a self-contained asset the game can use. `Jack pulled up the power
diagnostic. "The array shouldn't even have power."` is two segments: one narrator, one
Jack.

**`displayText` and `ttsText` are separate fields.** They are normally identical. The
split exists so a pronunciation problem can be fixed in the TTS layer later without ever
editing canonical manuscript text. Nothing rewrites names or acronyms today.

**This pipeline never rewrites the manuscript.** If something is ambiguous it is flagged
for review. The story stays a human-reviewed creative artifact.
