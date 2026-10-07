# Movement 4 (Chapters 10 to 12) — draft handoff, 2026-10-06

> **Renumbered 2026-10-07 (decision 0033).** This record keeps the chapter numbers it was written with. The original Chapter 6 has since been split into Chapter 6 (Several Millimeters) and Chapter 7 (Someone Knew), so the old Chapters 7 to 12 named below are now Chapters 8 to 13.

Drafted by Claude under Joshua's scheduled TMB-Story workflow. **🟡 PENDING APPROVAL.**
Audio: **not generated** (hard gate: approved canon only).

## Sources checked before writing

- Chapters 7 to 9 in the repo were compared word-for-word against Joshua's uploaded
  `07-09 Chapters` Word document: identical apart from the Decision 0024 bare-tag
  removals. No newer edits by Joshua were found; the chapters continue from his text.
- Master Event Roadmap (B1, B2), `story-rules/`, `WORLD_RULES.md`, `OPEN_QUESTIONS.md`,
  the Trello STORY EVENTS lists (A1 to A8 in Complete; nothing yet for B-events).

## Style and audio checks

`scripts/style-check.py`: all sentence and paragraph metrics pass. Word counts 1,544 /
1,685 / 1,791, inside the 1,600 to 1,800 band for chapters that earn it. No bare
`"...," Name said.` tags (Decision 0024). The five specialist agents were not run; this
handoff is the review.

## New canon candidates (for Joshua's approval)

- The spider is a **jumping spider**, named on the page by Aiden. This matches Decision
  0027's Watch-mode plan for first light.
- Size: **a small car**, not a delivery truck (regal jumping spider, about 15 mm, from the
  reference chart). Aiden's call exaggerated.
- **Aiden** is about twenty-five, works with the greenhouse's beneficial insects.
- **Doctor Mercer** in person: sixties, short gray hair, medical bag.
- **Paul Harlan**, machine-shop foreman. New character.
- The greenhouse's grow lights run overnight; roof vents open at seven on a timer; three
  vents sit on the west feeder isolated during the night (one of Chapter 4's three faults).
- An animal can step out of the grass onto the settlement's own pavement.
- The settlement's first creature rules (Sarah): it's an animal; nobody attacks; no
  outward light at the edge after dark; close anything an insect fits through; move slowly
  near glass; nobody goes out alone.
- Lena can route the community-center microphone to every public speaker.

## Consequences tracked

- **Jack:** cut on the back of his left hand from the cracked pane; minor, wrapped in a
  shop rag, untreated. Awake all night.
- **Sarah:** thirty-two weeks; Mercer has ordered her to medical after the address (seeds
  B7). The baby is not mentioned moving in these chapters.
- **Greenhouse:** one cracked roof pane; three vents now hand-closed and unpowered;
  blackout blinds proposed for the western glass.
- **Water:** restrictions announced settlement-wide; limits to be posted by noon.
- **Public knowledge:** everyone now knows TOMBS activated without authorization and that
  the town shrank. Nobody outside the core group knows it was deliberate.

## Mystery handling

- The no-trail impact marks (Chapters 7 and 8) are **not** answered. Sarah proposes the
  jump; Aiden objects that jumpers don't hunt in the dark. Left open on purpose.
- PHASE ONE READY, Phase Two, the saboteur, the power source (Q03), external comms (Q07)
  and every `WORLD_RULES.md` hidden item are untouched. Jack refuses to try reversing TOMBS
  until he understands it, which keeps Q-reversal open without implying an answer.

## For Joshua — noticed, not changed

1. **Chapter 9's frontmatter dates the dawn "March fifth"**; the night passed midnight in
   Chapter 4, so these chapters use March sixth in their frontmatter. The prose never says
   the date.
2. **Chapter 9 shows `audio_status: recorded`** although it is pending approval. Under the
   new workflow's audio gate that audio would be treated as provisional; nothing was
   regenerated or deleted.
3. **`CLAUDE.md` and `outline/STORY_DIRECTION.md` say nothing past Chapter 6 is drafted
   unasked.** Your scheduled-workflow instruction (2026-10-06) is newer and explicit, so it
   was followed; Decision 0029 records it.
4. **Aiden's voice** is still unassigned in `voice-registry.json`; Paul Harlan, Doctor
   Mercer and Unit Four's officer will need voices too, after approval.

## Audio pass, 2026-10-06 (Joshua's request)

Joshua: lines split by narration, or tagged after the line, sound wrong now that each
character has their own voice. Every paragraph in Chapters 10 to 12 was checked: 50 had a
tag after the quote or narration inside one speaker's line. Each now puts the beat first
and keeps the line whole. One deliberate pause stays as its own paragraph: Paul Harlan's
"Somebody switched it on." / He let that sit for a long moment before he finished. / "So
who was it?" The rule is now `TMB_STORY_RULES.md` 8a. Word counts 1,575 / 1,726 / 1,821;
Chapter 12 is twenty-one words over the 1,800 guide, left as is rather than cut.

## Speaker attribution pass, 2026-10-06 (decision 0030)

Joshua's DIALOGUE ATTRIBUTION RULE applied to Chapters 1 to 12: speaker-only tags out,
story-carrying narration kept, every bare line pinned in `audio/speaker-overrides.json`,
and the reader now shows a portrait and name before every spoken line. In these three
chapters, 67 parser guesses were wrong and are pinned; every dialogue line in 10 to 12
was read against the scene. New speakers without voices: Paul Harlan, Unit Four, and a
placeholder "Resident" for the unnamed townspeople.
