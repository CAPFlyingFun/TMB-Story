# Movement 5 (Chapters 14 to 17) — handoff, 2026-10-13

Drafted by Claude in the weekly writing run. **🟡 PENDING APPROVAL.** Audio: **not generated.**

## Before writing

- Joshua approved Chapters 1 to 6 at their current revision this morning (decision 0035).
  Chapter 7 was not in his list and stays `revision-pending`; 8 to 13 stay `in-review`.
- ChatGPT's Monday handoff (Trello card "🧭 Weekly ChatGPT → Claude Handoff", checklist
  2026-10-12) was read and checked against the manuscript. It agrees with it: finish B2 from
  Paul Harlan's question, then B3 if earned. No Joshua edits since 2026-10-07 were found.
- Seven chapters were awaiting review (7 to 13), under the nine that would limit the run to
  three, so four were written: B2 finished in one chapter, and B3 took three.

## Review

All five specialists read the draft. What changed because of them:

- **Mystery:** the first draft had Paul Harlan's crew maintaining the pumps at the north
  wastewater plant, the same place the tablet was used in Chapter 9, with nobody reacting.
  That would have been a new sabotage clue, which the pacing note rules out. Now Lena's plant
  treats the water and Paul only makes fittings and lays pipe to the greenhouse. Jack's
  promise to Paul is "everything that won't tip them off. Which is most of it", so it no longer
  contradicts the withholding.
- **World and continuity:** the tank capacity was cut from nine hundred thousand to five
  hundred thousand liters, so a nightly refill and a low at eleven agree with three hundred
  and fifty thousand left. Toilets are flushed with used washing water rather than with treated
  water, since nothing establishes separate pipes. The fifteen-thousand-a-day figure now comes
  after the greenhouse is taken off the tanks. Droplets are sized to Chapter 5 (chest height,
  "most of a meter across", more than two hundred liters), and the screen is "covered in them"
  rather than "thousands". Dawn moved to half past six to fit Chapters 10 and 11. The breeze
  line no longer suggests a barrier.
- **Character and scene:** lines split around a beat were made whole (rule 8a). Sarah's
  answer to Paul became a question. Jack's plan became an exchange with Mark. The team's goal
  is concrete: one jug and a sample. Lena now calls in the draw during the stitches, so the
  clock runs under the medical scene. Chapter 16 says aloud that the rest of the morning goes
  into the rules before 11:52. Mercer's two jokes about water became one.
- Not changed: Chapter 15 still ends on Paul waiting at the station door. Chapter 16 settles
  his complaint, but it costs something: the night shift's fairness reshapes the rules.

## Style and speaker data

- Words: 1,568 / 1,356 / 1,556 / 1,497. These are about 9 to 10 minutes of audio each, inside
  the 7 to 11 minute target. Chapters 14 and 16 are slightly over the 1,400-word guide, and
  they earn it.
- `style-check.py`: every metric passes. Chapter 14's two "British-isms" are both "I'd
  rather", a false positive. "Tap" became "faucet" throughout.
- Speakers: every dialogue line in the four chapters was read against the scene. 91
  parser guesses were wrong and are pinned in `audio/speaker-overrides.json`. Validation
  reports `READY FOR GENERATION: YES`. No new speakers: the two mothers use
  `resident-woman`, and the barefoot young man uses `resident`.

## Also fixed (metadata only, from ChatGPT's QA list)

- Chapters 8 and 9 frontmatter: "Early on March sixth (the night of the fifth)". Chapter 10:
  "March sixth". Chapters 5 and 6 are approved and were not touched; their frontmatter still
  says March fifth for after-midnight scenes.
- Chapter 7 frontmatter `new_canon`: "There is a phase two" now reads "The label PHASE ONE
  READY implies a later phase; whether a phase two exists, and what it is, is unknown".

## Canon candidates (for Joshua)

- The town knows the activation was deliberate and used Jack's credentials. It does not know
  about the file, the tablet, the badge or PHASE ONE READY.
- Security investigates and reports to the settlement. Paul sees what can be shown.
- Water:
  - Two tanks, about five hundred thousand liters full, plus a fire reserve. They refill
    nightly from the reservoir between midnight and five.
  - About three hundred and fifty thousand liters were left on the morning of March sixth.
    Normal use is about a hundred thousand a day.
  - The rules: twenty liters a person a day in two windows, the greenhouse on treated water,
    a drinking point at the community center, and stored water stays with its household.
    That makes a little over three weeks.
- Dew and guttation at the edge every morning, gone by nine. Drops can trap a person.
- Sarah: slightly raised blood pressure; Mercer rechecks nightly. The baby is well and active.
- Jack: four stitches, back of the left hand.

## For Joshua — noticed, not changed

1. `story-rules/CHARACTERS.md` has no entries for Mark, Mercer, Aiden or Paul. It still
   describes Lena as reachable only by wrist terminal, but she is in person from Chapter 10.
   Neither `CREATURES.md` (the jumping spider) nor `OPEN_QUESTIONS.md` (no rows for Phase
   Two, the tablet and badge, or the night impacts) is up to date. These should follow
   approval.
2. Chapter 13 runs 1,818 words, over the new preferred length (ChatGPT's note). It was left as
   is.
