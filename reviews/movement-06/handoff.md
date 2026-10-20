# Movement 6 (Chapters 18 to 20) — handoff, 2026-10-20

Drafted by Claude in the weekly writing run. **🟡 PENDING APPROVAL.** Audio: **not generated.**

## Before writing

- No edits by Joshua since the 2026-10-13 run (git log, chapter files and reviews checked).
- ChatGPT's Monday handoff (Trello "🧭 Weekly ChatGPT → Claude Handoff", updated 2026-10-19)
  was read and checked against the manuscript. It agrees with it: Chapters 1 to 6 approved,
  7 revision-pending, 8 to 17 in review; next is B4, preparation on March 7 and the edge-only
  run at first light on March 8, back by nine. Its "full continuity and approval details to
  follow" had not arrived; nothing else on the card or in the B4 card conflicted.
- Eleven chapters were awaiting review (7 to 17), so this run wrote **three**, as
  `SCHEDULED_WRITING.md` §2 requires. B4 fits them naturally.

## Review

All five specialists advised before drafting and reviewed the draft. What changed because of them:

- **World and creature:** the spider comes out of its retreat at first sun and sits still before
  hunting, matching Chapter 11 (it was already out, cold, at sunrise on March 6). The trapped
  insect is a midge stuck since the night, not a fly arriving cold. The spider has the midge
  before it looks at Aiden, and carries it off. The falling drop is knee-high, not waist-high.
  The midge's drop is "no bigger than a beach ball", the midge "the size of a cat". The robin is
  an ordinary song, not one made louder by scale. Aiden's test claims only "filter and boil".
- **Mystery:** a "creak like a ship settling at anchor" was cut; it pointed at the island itself
  (WORLD_RULES §2, §3). It is now "like a tree leaning in the wind". The impact uses "perimeter
  sensors", not a new installation, and stays unexplained.
- **Continuity:** the rope runs from the cart, with Unit Four at the cart, ready to haul, and
  Mark nearest him. First sun is six forty-two, to match Chapter 17's six-forty frame. "Forty
  minutes" became half an hour. Mark, not Jack, calls the retreat. Mercer's "straight to me" is
  honored (Sarah calls her). The edge of town is dark, and the red lamp points straight down.
  The drop hangs three meters up, which is why a pole is needed. The drop is "hardly any smaller"
  after three liters.
- **Character and scene:** split lines were made whole with the beat first (rule 8a). Sarah's
  "Same is bad?" became "Same as better, or same as high?". Jack gets a beat weighing Sarah
  against the water, and answers "He kicked." Paul's "Your funeral. Literally." became "Then
  don't fall in." Mercer's "boring" line and "Mark already does the voice" were cut. The ending
  now hooks the next chapter on Mark's undecided list instead of closing.
- Chapter 17's frontmatter `elapsed` now runs "to near midnight", for the impact at eleven forty.

## Also fixed in a pending chapter (please check)

- **Chapter 16:** the paragraph "Jack looked at him for a long moment… / 'You'll have them. And
  your coolant goes on the list.' / Paul nodded once…" had landed after "Then a little less than
  three weeks.", where "him" had no antecedent. It now sits right after Paul's "Give me my night
  shift and a day.", reads "Jack looked at Paul" and "earlier that morning" (was "less than two
  hours ago"). No other words changed. Its speaker pin was re-keyed. Chapter 16's audio had not
  been generated.
- **Resolved 2026-10-20 at Joshua's request (decision 0036):** Chapter 14's "Nobody walks to the
  end of the road" stays (Mark's order to a resident). Chapter 17's recall now reads "This morning
  I told that kid nobody even walks to the end of the road. You told the whole town nobody goes
  past it." 

## Style and speaker data

- Words: 1,631 / 1,631 / 1,746, roughly 10 to 11 minutes of audio each. All are above the
  1,400-word guide and under the 1,800 ceiling. Chapter 20 is the longest, the expedition itself,
  and has been trimmed once.
- `style-check.py`: every metric passes. The "half past" clock-time flags are US usage.
- Speakers: every dialogue line in 18 to 20 was read against the scene. **62 lines pinned** in
  `audio/speaker-overrides.json`, plus one re-keyed for Chapter 16. Validation for Chapters 1 to
  20 reports `READY FOR GENERATION: YES`. No new speakers. Unit Four speaks in person for the
  first time (`unit-four`), and Mark is `security-officer`.

## Canon candidates (for Joshua)

- About six weeks of food at careful portions, announced at noon on March 7.
- Paul's treated-water line to the greenhouse was finished at three in the morning on March 7.
- The jumping spider's silk retreat sits in the stems above the end of the western road. It
  comes out at first sun and hunts from about seven. It carries prey off.
- Water at this scale: it climbs a cup's rim and clings to skin. A sponge on a pole wicks a drop
  without bursting it, and the water creeps down the pole. A falling drop lands like a wave.
- Dew at the edge is low in minerals, possibly drinkable once filtered and boiled, with more
  tests pending.
- The trough method: shake the drops down onto a trough on the asphalt, in the gray, before the
  spider is warm. Not agreed yet.
- Sarah's blood pressure is unchanged, with no protein. Jack's stitches got wet. Aiden is
  chilled, not hurt.
- Unit Four is a young officer whose name is what the radio calls him.

## For Joshua — noticed, not changed

1. `story-rules/CHARACTERS.md`, `CREATURES.md`, `OPEN_QUESTIONS.md`, `TIMELINE.md` and
   `CHAPTER_INDEX.md` stop at Chapter 7. Mark, Mercer, Aiden, Paul and Unit Four, the jumping
   spider, Phase Two, the tablet and badge, and the night impacts have no entries. These follow
   approval.
2. The continuity agent's memory (`.claude/agent-memory/`) still describes Chapters 1 to 3. The
   agents are read-only, so it was not updated.
