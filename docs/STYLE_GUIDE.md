# TMB prose style guide — the Beyond Extinction register

Joshua, 2026-09-16: "There is nothing really wrong with the story itself, it's the
writing style that is slightly hard to understand in a few spots. It needs to be
able to be understood by a 5-year-old and a 105-year-old. Analyze Beyond
Extinction's writing style and apply the same concept to TMB." Recorded as
decision 0015. This file is the analysis and the rules that come out of it.

## What Beyond Extinction does (measured on Chapters 1–41, Chapters 1–3 Final)

| | BE 1–3 Final | BE 1–41 | TMB Ch 1 (before) | TMB Ch 2 (before) |
|---|---|---|---|---|
| Average sentence | 6 words | 9 words | 11 words | 13 words |
| Median sentence | 5 words | 6 words | 8 words | 7 words |
| Sentences over 30 words | 0% | 4% | 7% | 11% |
| Commas per sentence | 0.13 | 0.48 | 0.80 | 1.08 |
| "and" per sentence | 0.15 | 0.29 | 0.49 | 0.51 |
| Average paragraph | 14 words | 27 words | 31 words | 32 words |
| Paragraphs over 80 words | 0% | 6% | 8% | 10% |
| One-sentence paragraphs | 50% | 39% | 36% | 47% |

The finished BE chapters are the target. The drafts drift longer and Joshua's
"Final" pass pulled them back, which tells us what he wants.

### The eight habits

1. **One idea per sentence.** "He bought two coffees from the cart on Level B. He
   carried them down the long corridor past the security checkpoints." Nothing is
   nested inside anything else. A listener never holds a clause open.
2. **Very short sentences, most of the time.** Half of BE's sentences are six
   words or fewer. Length is spent only when the idea needs it, and even then a
   sentence stays under about twenty-five words.
3. **Almost no commas.** Where TMB wrote "and then the boots went under the
   faucet, and then the laces came out, and then the boots got stuffed with
   newspaper", BE writes three sentences.
4. **Beat fragments, not clause fragments.** BE uses fragments constantly and they
   never confuse: "Not jogging. Not sprinting. Full terror running." "Lower. More
   physical." Each is one whole image or one whole feeling, one to five words,
   standing alone for emphasis. What BE never does is leave a long descriptive
   fragment with the verb missing ("A bent metal post with nothing on it. A lump of
   concrete with a rusted ring."). That is the distinction decision 0013 was
   reaching for: a beat fragment is a complete thought; a clause fragment is a
   sentence with a hole in it.
5. **Short paragraphs, lots of air.** Half of BE's paragraphs are one sentence.
   A paragraph is one moment. The white space is the pacing.
6. **Plain words, familiar pictures.** "Trees splintered like dry bones." "Teeth
   gleamed like wet daggers." "The dream clung to him like wet cloth." The simile
   is something a child has seen. TMB's "the sea had left its laundry" and "the
   way you carry a full cup" are in this family; "dark trees on a dark hump" and
   "the color of the inside of a shell" are a step too clever.
7. **Feelings are named, then shown.** "Her voice was tight. Controlled. The voice
   she used when she was scared and refusing to show it." BE says the feeling in
   plain words and then gives the picture. TMB tended to give only the picture and
   trust the listener to infer.
8. **Parallel structure for clarity, not music.** "He collected the coffees. He
   walked the corridor. He badged through the door." Repetition of the frame
   makes the sequence easy to follow. It is used for steps and routines, never
   for decoration, which keeps it on the right side of decision 0014.

### Things BE does that TMB keeps or does not adopt

- BE marks scene breaks with "• • •". TMB speaks its time transitions (decision
  0009). Keep TMB's rule.
- BE opens each chapter with a short italic journal entry from Jack. TMB has no
  narrator-character. Not adopted; the chapter opens in scene.
- BE is first-person-adjacent in tone (Jack's journal frames it). TMB stays close
  third, one POV.

## The TMB rules (decision 0015)

Numbers are checked by `scripts/style-check.py`; targets are per chapter, prose only.

- Average sentence length at or under 9 words; median at or under 7.
- No narration sentence over 30 words. Dialogue may run longer only when a
  character is the kind who talks that way, and rarely.
- Commas per sentence at or under 0.5. "and" per sentence at or under 0.3. If a
  sentence needs a second comma, it is two sentences.
- Paragraphs at or under 60 words; none over 80.
- Beat fragments allowed (one to five words, a whole image or feeling). Clause
  fragments not allowed. This refines decision 0013.
- Every simile is something a five-year-old has seen.
- Name the feeling, then show it.
- The test for every line: read it aloud once. If a listener would need it twice,
  cut it in half.

## Before and after, from Chapter 2

Before (68 words): "The net bag was hanging over the heater, dry now, stiff, with a
white bloom of salt in every seam, and it smelled like low water warmed up, and
Nora took it down and folded it and set it on her mother's kitchen scale, the
little flat one that read in grams, and then went and got her kit sheet out of the
front pocket of her pack."

After: "The net bag hung over the heater. It was dry now, and stiff. There was a
white bloom of salt in every seam. It smelled like low tide, warmed up. Nora took it
down and folded it. She set it on her mother's kitchen scale, the little flat one
that read in grams. Then she went to the hall and got her kit sheet out of her
pack."

Before (59 words): "She was standing at the shelf by the door, where the keys lived
and the photograph lived, with a sheet of paper in her hands, and as the door
opened she folded it in three, quickly and neatly, the way you fold a letter that
came in an envelope, and slid it into the back pocket of her jeans."

After: "She was standing at the shelf by the door. That was where the keys lived,
and the photograph. She had a sheet of paper in her hands. As the door opened she
folded it in three, quick and neat, the way you fold a letter that came in an
envelope. She slid it into the back pocket of her jeans."

## US English is idiom, not just spelling (decision 0012, amended)

Joshua, 2026-09-16: "Then wear them wetter" is not normal US English; "Wear them
wet. Sorry about that." is. The spelling pass caught colour and metres; the ear
catches the rest. Watch-list, all checked by `scripts/style-check.py`:

| British | US |
|---|---|
| properly ("laughed properly", "dry them properly") | really, all the way, right |
| love (as an endearment), Sorry? | hon, sweetheart; What? |
| cross (angry), another go, in the wet | mad, round two / another try, in the rain |
| kit, field kit, kit sheet | gear, field gear, gear sheet |
| do the boots / plates / numbers / sum | clean the boots, get the plates, give the numbers, do the math |
| the state of you, moving house | look at you, moving out |
| corridor, cupboard, garden, carpet (rolled) | hallway, cabinet, yard, rug |
| weed (on a beach), the sea | seaweed; the ocean, the tide, the water |
| parcel, backwards, work out | package, backward, figure out |
| half past seven, a quarter to seven | seven thirty, six forty-five |
| the whole of it | the whole story, all of it |
| have got, had got | have, had gotten |
| whilst, quite, rather, a bit, brilliant, rubbish, sorted, mate | do not use |

A dry British joke shape ("Then wear them wetter") reads as odd rather than funny
to a US listener. Marco's jokes are American: a shrug, a fake apology, a made-up
rule.

## Audiobook-first dialogue: one narrator reads everyone (decision 0017)

Joshua tested Chapters 1 and 2 through a single ElevenLabs voice and found what the
page hides: a line that is obvious in print can be briefly confusing out loud,
because the listener cannot see the paragraph break that tells them the speaker
changed. Even a two-second "wait, who said that?" is a defect, worst of all in
Chapter 1 where the audience is still learning the cast.

The test, applied to every exchange: one narrator, one voice for everybody, no
quotation marks, no paragraph breaks, no portraits, no screen, a listener who may
have looked away. Would they know who is speaking, who is being spoken to, where
everyone is, and what they are doing? "Probably, because the lines alternate" is a
fail.

Seven ways to anchor a line, in no order of preference:

1. **A plain tag.** "I've got the water," Caleb said. Always acceptable.
2. **Physical action.** Marco caught her reflection in the mirror. "You're eighteen."
3. **Reaction.** Nora looked up from the logger. "That isn't what the table says."
4. **Emotion or body language.** Caleb's smile disappeared. "Where's Ines?"
5. **POV thought.** Caleb knew Marco was not going to let that one survive.
6. **Environmental interaction.** Rachel set the spoon beside the stove. "What did the unit read?"
7. **Movement or task.** Nora tightened the label around the jar. "Saturday?"

The limit: a beat should do at least one job beyond naming the speaker. Do not
build a chapter out of frowns, sighs, chuckles, raised eyebrows and shifted weight.
If no natural beat exists, "Caleb said" is better than an invented gesture. Do not
tag an exchange that is already unmistakable, and do not reach for "exclaimed",
"retorted" or "opined"; "said" disappears into the narration, which is the point.

`scripts/style-check.py` reports every run of three or more spoken lines that name
nobody. Zero is the target for both chapters.
