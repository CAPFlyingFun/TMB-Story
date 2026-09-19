# Supplying your own ambience

Joshua, 2026-09-18: *"remove all ambient noise for the moment (leave voices and SFX)
and I can upload my own background ambient sounds."*

Ambience was switched off for a few hours while he had no bed he liked, and back on
the same day when he supplied one. It is **on** now, with `amb_computer_lab` — a real
recorded computer room — as the lab bed. `mix.layers.ambience` in `audio/config.json`
is the switch, and both the browser and the exported mp3 read it, so the page and the
file always agree. This is how to put more of your own files in.

## The short version

1. Drop an mp3 into `audio/sfx/ambience/`, named after the asset it is.
2. Add it to `audio/sfx-registry.json` with `"source": "supplied"` **and a `credit`
   block**. Validation refuses a supplied file without one.
3. Push. The workflow adopts it, measures it, places it at the category target,
   refreshes the credits and rebuilds the exports.

No ElevenLabs credits are involved at any point. A supplied asset is never generated
and never re-encoded — only measured, so its cue gain can be derived from its real
level.

## Attribution

Every supplied file carries a `credit` block, and the sentence shown on the site is
**derived** from it, so correcting an author in one place cannot leave a stale
sentence somewhere else:

```json
"credit": {
  "title": "Night Ambience",
  "author": "freesound_community",
  "authorUrl": "https://pixabay.com/users/freesound_community-46691455/",
  "source": "Pixabay",
  "sourceUrl": "https://pixabay.com/sound-effects/",
  "license": "Pixabay Content License",
  "licenseUrl": "https://pixabay.com/service/license-summary/",
  "addedBy": "Joshua",
  "addedOn": "2026-09-18"
}
```

That produces **"Sound Effect by freesound_community from Pixabay"**, shown at the
bottom of every page of the reader and listed in `AUDIO_CREDITS.md`. Add `"kind":
"Music"` for music, or an explicit `"attribution"` string where a source demands its
own wording.

### Incoming, from Joshua on 2026-09-18

Two more beds are on their way in a zip. Their attributions, as he gave them:

| sound | author |
|---|---|
| Night Ambience | `freesound_community` |
| Nature Ambience | `u_vr5icvkppa` |

Both from Pixabay, both "Sound Effect by … from Pixabay". Recorded here so the
attribution is not waiting on anyone's memory when the files arrive.

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

**Don't worry about the level.** `normalize-sfx` measures the file, `measure-loudness`
records how loud it actually sounds, and every cue gain is then derived from
`mix.categoryTargetLufs`. Give us clean audio at any sane level and the pipeline
places it. Ambience currently targets −58 LUFS in the mix, which is about 38 dB under
the narration.

The placement moved from RMS to **LUFS** on 2026-09-19, and it is worth knowing why if
you are ever surprised by where a bed lands. RMS measures how big the samples are;
BS.1770 loudness measures what the ear does with them, and across this asset set the
two disagree by as much as 13 dB — a bright alert tone reads far louder than its RMS,
a deep rumble far quieter. Speech is the one signal where they agree, which is exactly
why placing effects by RMS against a voice reference seemed to work for as long as it
did. Your file is measured both ways and placed by the second.

## Checking your file before you commit it

```
python3 scripts/audio.py sfx --chapters 1-3      # the cue sheets still resolve
python3 scripts/measure-mix.py --asset amb_tombs_lab_night   # level, and the envelope
python3 scripts/audio.py combine --chapters 1    # rebuild the mixed chapter
```

`measure-mix.py` needs ffmpeg. The GitHub Actions run installs it, so pushing and
running the workflow is the other way to see the numbers.
