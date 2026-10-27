# Movement 7 (Chapters 21 to 23) — handoff, 2026-10-27

Drafted by Claude in the weekly writing run. **🟡 PENDING APPROVAL.** Audio: **not generated.**

## Before writing

- **Joshua's changes since the 2026-10-20 run** (git log, chapter files, reviews, Trello): Chapters 7
  to 10 approved and audio for 1 to 10 approved (decision 0040); Jack's "No." deliveries; Chapters 11
  to 20 translated into five languages (0028 addendum); Watch decisions 0037 to 0039 (presentation
  only). One pending-chapter edit: Chapter 19 "half past" → "half past five". Nothing in Chapters 11
  to 20 that affects these chapters. Nothing was overwritten.
- **ChatGPT's Monday handoff** (Trello, updated 2026-10-26) was read and checked against the
  manuscript. Its story facts agree with Chapters 18 to 20. **Its approval section is one day out of
  date:** it says Chapters 7 to 20 await review and audio 1 to 13 is pending; since 2026-10-27, 1 to
  10 are approved (story and audio) and 11 to 20 await review. Its recommended direction (B4
  aftermath, then B5, overlapping) was followed.
- **Backlog:** ten chapters (11 to 20) were awaiting review, so this run wrote **three**, as
  `SCHEDULED_WRITING.md` §2 requires.

## Review

All five specialists advised on the plan and reviewed the draft. What changed because of them:

- **Continuity:** March 6 — the spider was in the grass just past the pavement at dawn, not on the
  pavement. The greenhouse had no climate sensors, so the thermometer is an old dial one on the
  greenhouse door frame (new canon, flagged). First gray is about half past six; Chapter 22's
  opening at ten to six now passes to "by half past six". The midnight thermometer reading is
  compared with the morning before. The drill drum is refilled from the holding-tank line, not a
  hose. "Quarter of an hour" applies to March 7 only. Paul's "you said" became "he says". Mercer's
  "You said that last time" now follows Jack's "Yes, Doctor" (his Ch 19 reply).
- **World and creature:** the spider notices movement first and does not scavenge; it drinks dew
  (real behavior). Light decides when it comes out, warmth decides how soon it hunts. Under cloud
  there is less edge dew but the tips still drip. It stalks before pouncing. It turns its whole front
  end (a jumping spider has no separate head). The trough had to be a deep box, not a gutter; the
  drill drum is "a fifth of one of your drops". A drop falling on the empty road slumps and shivers
  rather than racing off.
- **Mystery:** the night impacts are "a different question" ("hitting the ground", not "coming
  down", so no one links them to falling drops). Paul's sabotage question gets "Not yet" and nothing
  more. No sky or edge oddity is described.
- **Character:** retired repeats (the coolant gag, "Don't thank me", "straight to me", "I'm lying
  down", "didn't say yes", Mark in the doorway, "Thank you, sir / Don't call me sir"). Added Jack
  keeping his Ch 20 promise to the baby, Mercer's tiredness, the crib, and the reversed rules quiz.
- **Scene:** the shop scene got a spoken time; the evening check in Ch 21 was folded into narration;
  the splash board moved to "our side, between the drop and the people"; Mark's numbers became one
  quote.

## Style and speaker data

- Words: 1,690 / 1,629 / 1,635 — roughly 10 to 11 minutes each. Above the 1,400 guide, under 1,800.
- `style-check.py`: every metric passes.
- Speakers: every dialogue line in 21 to 23 read against the scene. **45 lines pinned** in
  `audio/speaker-overrides.json` (two of them by adding Chapter 23 to an existing pin with the same
  speaker). Validation for Chapters 1 to 23: `READY FOR GENERATION: YES`. No new speakers.
- `build-manifest.py` run (7 movements, 23 chapters). Audio tests: 223 pass.
- **Translations:** Chapters 21 to 23 have none yet; the reader shows them in English (decision 0028).

## Canon candidates (for Joshua)

- Mercer has antibiotics and wants never to open them; she cannot make more.
- An old dial thermometer on the greenhouse front door frame, read every morning.
- Boiled dew is drinkable; it tastes flat. The long test: something living at a low level; boil it,
  always.
- The spider: comes out around first light with or without sun; basks only when cold; drinks dew;
  notices movement first; on a mild morning it crosses the asphalt after a fly on the cart.
- Clear cold nights give the most dew; cloud gives less along the edges, the tips still drip; the
  sugary tips draw flies.
- Paul's trough and pole collar; treated water is used for drills.
- Mark's go-rules for the test (clear; eight or under at first gray; one shake; off at first sun or
  ten degrees). One test is set for first gray, March 10.
- Sarah's pressure: March 8 same as high, no protein; March 9 a little better.

## For Joshua — noticed, not changed

1. `story-rules/CREATURES.md`, `OPEN_QUESTIONS.md` (who-knows-what) and `CHARACTERS.md` stop at
   Chapter 10; Paul and Unit Four have no entries. These follow approval.
2. Pending Chapter 17's frontmatter says Sarah's March 6 evening pressure was "better"; pending
   Chapter 19 has Mercer say March 7 is "same as high". It reads as better-but-still-high, then
   flat, so it is consistent; noted only in case you want it plainer.
3. Units: temperatures are spoken without a unit ("eleven", "ten degrees"), consistent with the
   story's metric measures. Say if you want "degrees Celsius" said once.
