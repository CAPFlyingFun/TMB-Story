# Chapter Workflow

## The unit of work is a movement of about three chapters

1. **Orient.** Read `story-rules/TMB_STORY_RULES.md`, `story-rules/STORY_OVERVIEW.md`,
   the previous movement's chapters in full, and the targeted story-rules files the
   chapter touches. Check `story-rules/OPEN_QUESTIONS.md` so nothing is answered by
   accident.
2. **Confirm the plan with Joshua** before drafting. There is no long outline to draft
   from; the plan for the next three chapters comes from him.
3. **Draft the movement.** Roughly three connected chapters, about 1,200 to 1,400
   words each, about 1,000 the floor, about 1,600 to 1,800 when a chapter earns it.
   Find the natural chapter breaks and cliffhangers inside the material rather than
   forcing them at a word count.
4. **Review.** The five specialists in `.claude/agents/` read the finished draft.
   Run `python3 scripts/style-check.py` on each chapter.
5. **Correct,** then write the handoff report in `reviews/`.
6. **Stop and hand it to Joshua for the audio pass.** He tests it through ElevenLabs
   with one narrator voice. Anything confusing to the ear gets revised.
7. **On his approval,** flip `review_status`, add the `CHAPTER_INDEX.md` rows, apply
   the story-rules updates, move the tracker line in `STORY_OVERVIEW.md`, and commit.
8. **Only then** start the next movement.

## Canon protection

A chapter whose frontmatter says `review_status: approved` is canon and must never be
silently rewritten. `.claude/hooks/protect-approved-chapters.sh` blocks edits to such
files as a backstop. Chapters 1 to 3 carry a `source:` line naming Joshua's Word
manuscript; they are the manuscript and are not edited without his instruction for
that specific chapter.

## What not to do

- Do not invent a fifty-chapter outline. The pre-reboot one is archived and non-canon.
- Do not draft the next movement on the strength of the current one being probably
  fine.
- Do not cite anything in `archive/pre-reboot/` as canon.
