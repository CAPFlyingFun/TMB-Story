# Working on TMB-Story

TRADDOMIUM: Micro Battle! is a serialized, audiobook-first science fiction story. A
research settlement on a remote Atlantic island is reduced to insect scale by its own
experimental system, and the people inside it have to live there. This repository is
the story: the manuscript, the rules, the canon reference and the review trail. It is
not the game; the game adapts what is canon here, never the other way round.

## THE STORY WAS REBOOTED ON 2026-09-17. READ THIS FIRST.

Joshua replaced the opening of the series. The catastrophe now happens immediately,
in Chapters 1 to 3, and the story is already in the miniature setting by the end of
Chapter 3.

- **Current canon** is the manuscript in `chapters/` plus `story-rules/`.
- **`archive/pre-reboot/` is NOT canon.** It holds a completely different story:
  Caleb and Nora Bennett, eighteen-year-old twins at Alder Sound Field Station looking
  for their father Daniel Mercer, Tern Island, and a fifty-chapter outline that spent
  roughly fifty chapters before reaching the island. None of that is current. Do not
  cite it, do not draft from it, and do not try to reconcile it with the reboot. Read
  `archive/pre-reboot/README.md` before opening anything in there.
- If a current file appears to conflict with an archived one, the current file wins
  and the archived one is simply old. Say so rather than merging them.

## Where the truth lives

1. **Joshua's newest explicit instruction.**
2. **The approved manuscript in `chapters/`.** Chapters 1 to 3 were imported verbatim
   from his approved Word document and carry a `source:` line saying so. They are the
   manuscript. Do not edit them without his instruction for that specific chapter.
3. **`story-rules/TMB_STORY_RULES.md`** — the writing rules and the canon index. Read
   it every chapter, along with `story-rules/STORY_OVERVIEW.md`.
4. **The rest of `story-rules/`** — canon as the manuscript establishes it.
5. **`architecture/DECISIONS.md`** — dated decisions, append-only. A decision outranks
   the file it changes until that file is updated to match.
6. This file — stable operating guidance, not design truth.

If two sources disagree, do not invent a compromise. Name the conflict, follow the
newer or more authoritative source, and flag it in the handoff report.

## The writing rules live in one place

`story-rules/TMB_STORY_RULES.md` holds them: audiobook-first prose, close third person
and past tense, natural US English in spelling and idiom, dialogue-heavy with physical
action, the two-turn speaker-anchor guideline, spoken numbers written the way they are
pronounced, system readouts as story content rather than headings, the length band,
and the game-adaptation relationship. Do not restate them here and let the two drift.

The short version, because it governs every line: **one narrator will read every
character.** The listener has no quotation marks and no paragraph breaks, so the prose
has to carry who is speaking, at the moment the line is heard.

## How we work now

The unit of work is a **movement of about three connected chapters**, not a chapter and
not a fifty-chapter arc. Full version: `outline/WORKFLOW.md`. In short:

1. Orient in `story-rules/` and the previous movement.
2. Get the plan for the next three chapters from Joshua. There is no long outline to
   draft from, and one is not to be invented.
3. Draft the movement, about 1,200 to 1,400 words a chapter.
4. The five specialists in `.claude/agents/` review the finished draft. Run
   `python3 scripts/style-check.py` on each chapter.
5. Correct, write the handoff report in `reviews/`, commit.
6. **Stop.** Joshua tests the movement as audio through ElevenLabs with one narrator
   voice. Anything confusing to the ear gets revised.
7. On his approval, flip `review_status`, add the `CHAPTER_INDEX.md` rows, apply the
   story-rules updates, move the tracker line, and commit.

Chapters 4 to 6 are not finalized. Do not draft them unasked.

## Canon protection

A chapter whose frontmatter says `review_status: approved` is canon and **must never
be silently rewritten.** Any change needs an explicit instruction from Joshua for that
chapter, and must be named in the handoff report and the commit message.
`.claude/hooks/protect-approved-chapters.sh` blocks Edit and Write on such files as a
backstop; if it fires, that is the workflow working.

Chapters 1 to 3 are Joshua's manuscript, verified byte-identical to his document on
import. They get the strictest reading of this rule.

## Getting oriented without re-reading everything

`story-rules/CHAPTER_INDEX.md` is one append-only table, one row per approved chapter.
Read the rows around the stretch you need, then open only the chapters they point at.
Always read the previous chapter in full.

## The specialists

Five read-only subagents in `.claude/agents/`, used twice per movement, before drafting
and after: `scene-agent`, `character-agent`, `world-creature-agent`, `mystery-agent`
(open questions), `continuity-agent` (keeps project memory in
`.claude/agent-memory/`). They advise; the main session decides and writes. They cannot
write chapters, so they cannot create conflicting canon.

## Files and naming

- Chapters: `chapters/movement-NN/chapter-NNNN.md`, four-digit chapter numbers.
  Frontmatter schema: `chapters/CHAPTER_TEMPLATE.md`.
- Reviews: `reviews/movement-NN/chapter-NNNN-review.md`.
- Movement records: `outline/movement-NN/overview.md`.
- Canon and rules: `story-rules/`.
- Anything pre-reboot: `archive/pre-reboot/`, never cited as canon.

## Git

`main` is the only branch. Commit at natural checkpoints: when a draft is first
written, and again when Joshua approves it. No per-chapter branches, no draft
branches, no pull requests. Git history is the audit and undo trail.

## Keep this file useful

Stable guidance only. The writing rules belong in `story-rules/TMB_STORY_RULES.md`,
current canon in the rest of `story-rules/`, and one-off decisions in
`architecture/DECISIONS.md`. If this file starts contradicting them, fix this file.
