# Supplying your own ambience

Joshua, 2026-09-18: *"remove all ambient noise for the moment (leave voices and SFX)
and I can upload my own background ambient sounds."*

Ambience is **switched off**, not deleted. Every ambience cue is still in the cue
sheets with its reasoning, the generated assets are still on disk, and one flag turns
the whole layer back on. This is how to put your own files in its place.

## The short version

1. Drop an mp3 into `audio/sfx/ambience/`, named after the asset it replaces.
2. Mark that asset `"source": "supplied"` in `audio/sfx-registry.json`.
3. Set `mix.layers.ambience` back to `true` in `audio/config.json`.
4. Run `python3 scripts/audio.py retune-cues --chapters 1-3`.

No ElevenLabs credits are involved at any point. A supplied asset is never generated.

## What the pipeline does with a supplied file

`source: "supplied"` means a human put the file there. It has no prompt, it is
fingerprinted by **its own bytes** rather than by a prompt, and generation refuses to
run for it — so a regeneration pass can never overwrite something you recorded or
licensed. Replacing the file changes its fingerprint, which validation notices.

Leave `durationSeconds` accurate, because the mixer uses it to size the loop buffer.

## The three ambience assets and what each one is for

| asset | where it plays | what it has to be |
|---|---|---|
| `amb_tombs_lab_night` | the lab, most of Ch 1 and Ch 2, and Ch 3 after the event | steady room tone: ventilation, racked equipment, no events |
| `amb_intercom_channel_open` | under Sarah's and Lena's remote lines | an open intercom channel with nobody talking |
| `amb_settlement_sirens` | Ch 2 and Ch 3 outdoors | civil sirens heard from indoors |

There is no sustained array hum. `amb_tombs_array_power_rise` is a 20-second **rise**,
an event, and it now plays once in Chapter 1 where the array actually comes up. If you
want the array present underneath Chapters 2 and 3, that is a fourth asset and it has
to be a genuine seamless loop.

## What makes a good bed here, learned the hard way

**It must loop seamlessly.** This is the one that cost us. A looping bed restarts every
N seconds forever, so anything with a shape — a rise, a swell, a passing event — turns
into that shape repeating. The generated array rise did exactly that and read as the
audio speeding up. Match the start and end, or cross-fade the file into itself before
you save it.

**It must be even.** A bed with a loud middle and quiet ends announces its own seam.
`scripts/measure-mix.py` prints a `sounds for` figure next to each asset: a 20-second
bed that "sounds for" 20 seconds is even, and one that sounds for 5 is not.

**No voices, no music, no alarms, no footsteps.** Those are events and they belong in
the SFX layer, where they can be moved or switched off separately.

**Don't worry about the level.** `normalize-sfx` measures the file and bakes a gain in,
and every cue gain is then derived from `mix.categoryTargetDbfs`. Give us clean audio
at any sane level and the pipeline places it. Ambience currently targets −58 dBFS in
the mix, which is about 36 dB under the narration.

## Checking your file before you commit it

```
python3 scripts/audio.py sfx --chapters 1-3      # the cue sheets still resolve
python3 scripts/measure-mix.py --asset amb_tombs_lab_night   # level, and the envelope
python3 scripts/audio.py combine --chapters 1    # rebuild the mixed chapter
```

`measure-mix.py` needs ffmpeg. The GitHub Actions run installs it, so pushing and
running the workflow is the other way to see the numbers.
