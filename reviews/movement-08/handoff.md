# Movement 8 (Chapters 24 to 26) — handoff, 2026-11-03

Drafted by Claude in the weekly writing run. **🟡 PENDING APPROVAL.** Audio: **not generated.**

## Before writing

- **Joshua's changes since the 2026-10-27 run** (git log, chapter files, reviews, Trello): decision
  0041 (SFX moved to eleven_text_to_sound_v3, Chapters 1 to 13 remixed), decision 0042 and its
  addendum (ChatGPT's Draft C TOMBS lab as a standalone module in `tombs-lab/`, one look for the
  Watch and the game), and lab/reader commits on 2026-11-03. **No chapter text changed** since the
  last run, so nothing in Chapters 11 to 23 needed fixing or flagging, and nothing was overwritten.
- **ChatGPT's Monday handoff** (Trello, updated 2026-11-02) was read and checked against the
  manuscript and approvals. It matches: 23 chapters, Chapters 1 to 10 approved (story and audio),
  11 to 23 pending, B5 in progress, Chapter 24 to open before dawn on March 10 with the trough still
  on the truck. Its direction (the single controlled pilot, then the debrief against ~15,000 L/day)
  was followed. No conflicts.
- **Backlog:** thirteen chapters (11 to 23) were awaiting review, so this run wrote **three**, as
  `SCHEDULED_WRITING.md` §2 requires.

## Review

One independent reviewer read the drafts against the rules and Chapters 19 to 23. Changed because
of it:

- The drop under the retreat is no longer played as a surprise: Mark states the plan in the dark
  (Ch 21 list, item three) — if the drop over the crack is under the retreat at first light, they move.
- Mark drags the trough back after saying "nothing gets dragged", so he now says why ("I'd rather
  loud than wet"). Jack and Mark unclip from the main rope and use Unit Four's spare line.
- The spider at the end of Ch 26 no longer "looks toward the town" (no recognition or intent toward
  people). It came out "legs first, the way it had on the cold mornings" (Ch 22's mild morning was a
  smooth exit).
- Why nobody saw the seven oh four footage live is now said (Sarah switched to the station camera;
  Aiden reviewed only to the lid).
- Volume: the second drop holds "maybe half the water of the first"; the 110 liters fill five
  twenty-liter jugs and half a sixth (not drums, so the drill drum's size is untouched).
- Rule 8a: three beats that split one speaker's quote were moved in front of the whole line; bare
  lines that were hard to place by ear got beats; "Not today" became "Not again today".

## Style and speaker data

- Words: 1,529 / 1,662 / 1,568 — roughly 10 to 11 minutes each. Above the 1,400 guide, under 1,800.
- `style-check.py`: every metric passes on all three.
- Speakers: every dialogue line in 24 to 26 read against the scene. **28 new pins** in
  `audio/speaker-overrides.json`, plus Chapter 24 and order 10 added to the existing "I know." pin
  (Jack, same text; Chapter 7's manifest is unchanged). Validation for every chapter: `READY FOR
  GENERATION: YES`. No new speakers. In Chapter 26, Jack's reply to Mercer's "It's dry." is "Dry as a
  bone." so two speakers never share one clip.
- `build-manifest.py` run (8 movements, 26 chapters). Audio tests: 223 pass.
- **Translations:** Chapters 24 to 26 have none yet; the reader shows them in English (decision 0028).
  Last week Joshua asked for translations after the run; not done this time without his word.

## Canon candidates (for Joshua)

- A crack across the end of the western road, usable to place things from the camera footage.
- A leaf sprung back from below throws its drop forward, toward whoever is under it.
- Paul's drip collar works; his trough has a drain spigot.
- One shake of the smaller leaf on a four-degree morning: about a hundred and ten liters.
- The shake brings down insects stuck in the drops; a kicking one draws the spider's attention.
- March 10 tank reading about 280,000 L; real use about 17,000 L a day; about sixteen days.
- The community center kitchens can boil a hundred liters at once.
- There are cameras at every road end; most unwatched since March 6. Sarah starts a survey.
- The spider drank the team's spilled water on the asphalt and followed the wet line halfway to the
  cart.
- Mark's rule: one leaf near that retreat on any morning, never the one under it.

## For Joshua — noticed, not changed

1. `story-rules/CREATURES.md`, `OPEN_QUESTIONS.md` and `CHARACTERS.md` still stop at Chapter 10;
   Paul and Unit Four have no entries. These follow approval.
2. Chapter 17's estimate (a drop "most of a meter across… more than two hundred liters") and
   Chapter 19's "a single drop as tall as Jack's chest" describe different drops; Chapter 25's
   110 liters for the smaller drop sits between them. Fine as is; noted in case you want one figure.
3. Reference repos (read-only): TRADDOMIUM's Sarah (thirty-two weeks, the v2 model) and cast names
   match the story. Nothing in Chapters 24 to 26 describes a character's look that the game
   contradicts. Beyond-Extinction was cloned for reference; nothing in it bears on these chapters.

## Pushed from another session (2026-11-03)

The run that wrote these chapters (the "+ reference repos" scheduled task) could not push to
TMB-Story. Joshua passed its files to the session that had push access, which committed them.
It did:
- Took the three chapters, this handoff and the movement overview **as written**, with one word
  changed. Chapter 26 had "lifted its head"; it now says "lifted its face", because a jumping
  spider has no separate head (Chapter 22 makes the same choice). That puts Chapter 26 at 1,570
  words.
- Re-did the speaker data here, because the run's `speaker-overrides.json` was not in the files
  it passed on. It read every dialogue line against the scene and made **29 pins**. Chapter 24
  order 10 ("I know.") was added to the existing Chapter 7 pin for the same line, so the Chapter 7
  clip and its approved audio are unchanged. Only that pin's note changed in Chapter 7's manifest.
  Validation for Chapters 1 to 26 is READY.
- Rebuilt the reader manifest and the `22-24` and `25-27` Word files from the chapter files. The
  run's own copies were not used. The audio tests pass.
