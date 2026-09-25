# Chapter Workflow

## The unit of work is a movement of about three chapters

1. **Orient.** Read `story-rules/TMB_STORY_RULES.md`, `story-rules/STORY_OVERVIEW.md`,
   the previous movement's chapters in full, and the targeted story-rules files the
   chapter touches. Check `story-rules/OPEN_QUESTIONS.md` so nothing is answered by
   accident.
2. **Confirm the plan with Joshua** before drafting. There is no long outline to draft
   from; the plan for the next three chapters comes from him. Read
   `outline/STORY_DIRECTION.md` first: it says what the stretch after Chapter 3 is
   about and, just as importantly, what has deliberately NOT been decided.
3. **Draft the movement.** Roughly three connected chapters, about 1,200 to 1,400
   words each, about 1,000 the floor, about 1,600 to 1,800 when a chapter earns it.
   Find the natural chapter breaks and cliffhangers inside the material rather than
   forcing them at a word count.
4. **Review.** The five specialists in `.claude/agents/` read the finished draft.
   Run `python3 scripts/style-check.py` on each chapter.
5. **Correct,** then write the handoff report in `reviews/`.
6. **Stop and hand it to Joshua for the audio pass.** He tests it through ElevenLabs.
   Anything confusing to the ear gets revised.
7. **On his approval,** flip `review_status`, add the `CHAPTER_INDEX.md` rows, apply
   the story-rules updates, move the tracker line in `STORY_OVERVIEW.md`, and commit.
8. **Only then** start the next movement.

## When the draft comes from ChatGPT

Joshua, 2026-09-25: ChatGPT may sometimes draft a block of about three chapters. When
he hands one over:

1. **It is a proposed continuation, not canon.** Nothing in it is canon until he
   approves the reviewed version.
2. **Review it** against Chapters 1 to 6, `story-rules/`, and
   `story-rules/WORLD_RULES.md` in particular. The five specialists in
   `.claude/agents/` and `scripts/style-check.py` do the same job they do on our own
   drafts.
3. **Keep what is good.** Preserve its scenes and dialogue. Do not rewrite for
   stylistic preference alone; this is one voice shared by two writers.
4. **Fix** continuity problems, unclear speakers, pacing and contradictions.
5. **Add** physical and action beats where a scene lacks them.
6. **Check it against the scale rules.** Nothing may imply a field, a dome, a second
   scale on the page, or a TOMBS that stays powered.
7. **Protect hidden knowledge.** Nothing may reveal or hint at a [HIDDEN] item in
   `WORLD_RULES.md`, or answer an open question in `OPEN_QUESTIONS.md`, early.
8. **Flag any major story change before making it.** Examples: a new character, a
   death, a reveal, a change of timeline, or a scene moved or cut. Ask first; do not
   decide.
9. **Return the polished version with a short summary of the meaningful changes,**
   then continue from step 5 above (the handoff report and the audio pass).

## Canon protection

A chapter whose frontmatter says `review_status: approved` is canon and must never be
silently rewritten. `.claude/hooks/protect-approved-chapters.sh` blocks edits to such
files as a backstop. Chapters 1 to 6 carry a `source:` line naming Joshua's Word
manuscript. They are the manuscript and the foundation, and are not rewritten or
restructured without his instruction for that specific chapter. That holds even when
a new rule would read more neatly if an old line changed. Decision 0025 is the example:
"the boundary" stays, because it is what the characters believe.

## What not to do

- Do not invent a fifty-chapter outline. The pre-reboot one is archived and non-canon.
- Do not draft the next movement on the strength of the current one being probably
  fine.
- Do not cite anything in `archive/pre-reboot/` as canon.
