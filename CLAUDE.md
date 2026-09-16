# Working on TMB-Story

TMB is a serialized, audiobook-first sci-fi/fantasy adventure series: two siblings,
Caleb and Nora Bennett, searching for their missing father across an island where
humans live at insect scale. This repository is the story itself: the living bible,
the outlines, the chapters, and the review trail. It is not the game; the game
adapts what is strongest and stable here, never the other way round.

## Where the truth lives

1. **Joshua's newest explicit instruction.**
2. **`architecture/SERIES_ARCHITECTURE.md`** — Revision 3, the approved creative
   authority. It layers on Rev 2 and Rev 1 in `architecture/history/`; where Rev 3
   is silent, the newest earlier revision that speaks stands, and where they
   conflict, Rev 3 wins. Nothing in `history/` overrides it.
3. **`bible/STORY_OVERVIEW.md`** — the lean distillation. Read it EVERY chapter.
   Premise, locked cast, rules that bite, the 20-Part roadmap, and the
   "currently at" tracker line.
4. **The rest of `bible/`** — living canon as the chapters establish it.
5. **`architecture/DECISIONS.md`** — creative decisions made after Rev 3, one dated
   entry each, append-only. A decision recorded there outranks the bible file it
   changes until the bible is updated to match.
6. This file — stable operating guidance, not design truth.

If two sources disagree, do not invent a compromise. Name the conflict, follow the
newer or more authoritative source, and flag it in the handoff report.

## Audiobook writing rules

These are craft invariants. The prose is heard, not seen.

- **Voice follows the mood (Joshua, 2026-09-16, decision 0006).** The prose
  changes register with the scene. A happy or funny stretch is light, simple and
  playful: plain words, short sentences, one idea at a time, jokes from character
  that land out loud, the warmth of a story told to a bright child. A serious or
  dangerous stretch earns weight: fuller sentences, slower beats, real dread or
  grief, said plainly rather than hinted. Move between the two inside a chapter
  when the story turns, and let the turn be felt. Whatever the register, a listener
  must never get lost: concrete pictures, clear geography, one actor per clause.
  Wonder in small things everywhere. Humour somewhere in every chapter, even the
  dark ones, because that is who these people are. Subtext is allowed under either
  register; it never replaces a surface that is a pleasure on its own.
- **Length:** 1,800–2,500 words; natural target 2,100–2,300. Never pad or cut a good
  chapter to hit a number. Record the real count in the frontmatter.
- **Tense and person:** past tense, close third person. **One POV per chapter**, no
  head-hopping. Alternate primarily between Caleb and Nora; Rachel, Daniel and others
  earn POV only once they are active in the story.
- **Scenes:** one to three per chapter. More than three usually means the chapter
  wants to split.
- **Dialogue and action forward.** Description orients a listener; if a paragraph of
  description changes nothing the audience understands or feels, cut it.
- **Action clarity:** short sentences, one actor per clause, name who is doing what
  once more than one person is moving.
- **Distinct voices, not tags.** Each recurring character has their own vocabulary and
  rhythm so dialogue identifies itself. Prefer action beats to dialogue tags. Use
  "said" sparingly and never ornate synonyms.
- **Profanity:** minimal to none.
- **Violence:** real consequences with real weight, no graphic anatomical description,
  no lingering.
- **Romance:** allowed, understated, slow, mostly in secondary threads.
- **Exposition:** roughly 150–200 words is the ceiling for unbroken exposition before
  returning to scene or dialogue.
- **Chapter endings rotate.** Types: revelation, emotional beat, discovery, unanswered
  question, threat, quiet unsettling line, funny character beat, decision, arrival,
  betrayal, piece of evidence, creature encounter. Never two of the same type back to
  back; never default to "sudden danger." The previous chapter's `ending_type` is in
  `bible/CHAPTER_INDEX.md`.
- **Humor** arises from the relationships, not from jokes.
- **Insects stay structural.** Every Part needs at least one insect-driven beat that
  materially changes human stakes.

## The mystery rhythm

Question → clue → investigation → answer → bigger question, roughly every 5–15
chapters, enforced at chapter level as well as Part level. `bible/MYSTERIES.md` is the
ladder; every open question has an id (`M01`…). A chapter's frontmatter records which
ids it introduces, advances or answers. "Who knows what" is the field most likely to
prevent a contradiction: keep it current.

## Chapter workflow (summary)

Full version: `outline/WORKFLOW.md`. In short:

1. Orient: outline for this chapter, the complete previous finalized chapter, the next
   chapter's outline-level direction, `bible/STORY_OVERVIEW.md`, and targeted bible
   excerpts found through `bible/CHAPTER_INDEX.md`.
2. Dispatch the five specialists in parallel for advisory input (read-only).
3. The main session writes the one canonical draft. Nothing else writes chapters.
4. Dispatch the same five specialists to review the finished draft.
5. Make justified corrections; self-check against the rules above.
6. Write the handoff report in `reviews/`. Commit the draft.
7. **Stop and wait for Joshua.** Only on his approval does `review_status` become
   `approved`, `CHAPTER_INDEX.md` gain its row, the tracker line in
   `STORY_OVERVIEW.md` move, and the approval get committed.

Do not outline further than Joshua has asked for. Do not draft the next chapter on the
strength of the current one being "probably fine."

## Canon protection

A chapter file whose frontmatter says `review_status: approved` is canon. **It must
never be silently rewritten.** Any change to an approved chapter, down to a comma,
requires an explicit instruction from Joshua for that chapter, and the change must be
flagged in the handoff report and the commit message, not made quietly.
`.claude/hooks/protect-approved-chapters.sh` blocks Edit/Write on such files as a
backstop; if it fires, that is the workflow working, not an obstacle to route around.
The same respect applies to `bible/` entries marked LOCKED and to
`architecture/SERIES_ARCHITECTURE.md`, which is a historical record and is not edited.

## Getting oriented without re-reading the series

`bible/CHAPTER_INDEX.md` is one append-only table, one row per approved chapter, built
from each chapter's frontmatter. To learn what happened around chapter 340, read the
rows around 340, then open only the chapters those rows point at. Never re-read every
prior chapter to get oriented. Read the previous chapter in full, always; read older
ones only when the index or a specialist points there.

## The specialists

Five read-only subagents in `.claude/agents/`, used twice per chapter, before drafting
and after: `scene-agent`, `character-agent`, `world-creature-agent`, `mystery-agent`,
`continuity-agent` (the last keeps project memory). They advise; the main session
decides and writes. They can never create conflicting canon because they cannot
write. Do not add a sixth agent unless drafting proves a gap none of the five cover.

## Files and naming

- Chapters: `chapters/part-NN/chapter-NNNN.md`, four-digit numbers because the
  roadmap runs past 1,000. Frontmatter schema: `chapters/CHAPTER_TEMPLATE.md`.
- Reviews: `reviews/part-NN/chapter-NNNN-review.md`.
- Outlines: `outline/part-NN/overview.md` and `mini-arc-NN.md`.
- Bible files split (e.g. `bible/characters/`) only when a single file becomes a
  scroll rather than a reference; resolved material rolls into short historical
  notes rather than being deleted or re-read forever.

## Git

`main` is the only branch. Commit at natural checkpoints: when a draft is first
written, and again when Joshua approves it. Commit messages say what changed and why;
an approved chapter being touched must say so in the subject line. No per-chapter
branches, no draft branches, no pull requests. Git history is the audit and undo trail.

## Keep this file useful

Stable guidance only. Current Part, current chapter, open questions and one-off
decisions belong in `bible/STORY_OVERVIEW.md`, `architecture/DECISIONS.md`, the
handoff reports and the commits. If this file starts contradicting the architecture
or the bible, fix this file.
