# Chapter Workflow

How one chapter goes from outline to canon. The main session (the session Joshua is
talking to) owns every step and every write. The five specialists in
`.claude/agents/` advise twice and write nothing.

## 0. Preconditions, and the pre-draft check

**Trello is checked FIRST, every chapter** (decision 0007). Where: the list
`📖 STORY — Chapters 1–50` on the TRADDOMIUM: Micro Battle! boards (Godot
https://trello.com/b/MS7jRvdI and TypeScript https://trello.com/b/DoBMcBRT; the
STORY content is one plan mirrored on both, and a difference between them is a
conflict to flag). Read the `📚 Chapters 1–50 — Master Story + Game Overview`
card, the current ten-chapter overview, this chapter's card, and nearby cards
that affect continuity. Plan content is in card DESCRIPTIONS; comments do not
reach Claude. Then read GitHub canon: the approved outline, the bible
files this chapter touches, the previous finalized chapter in FULL, the next
planned chapter, `architecture/DECISIONS.md`. Compare the card against canon. If
there is a meaningful conflict (a card contradicts an approved chapter, a LOCKED
item, the timeline, or an earlier decision), STOP and flag it for Joshua. Do not
choose, do not reconcile, do not draft. If the card is newer than a committed
outline and Joshua approved it, the card wins and the outline is reconciled into
GitHub before prose becomes canon.

Before drafting, the chapter must be able to answer the twelve chapter-as-mission
questions (the chapter is still a natural audiobook chapter, never a quest log):

1. What is the POV character trying to accomplish?
2. Where do they physically go?
3. What do they actually DO?
4. Which people do they interact with?
5. Which animals or creatures do they encounter or interact with?
6. Which objects, equipment, tools or environmental elements do they use?
7. What changes or complicates the original objective?
8. What choice or problem must they deal with?
9. What character or relationship development happens through those actions?
10. What mystery is opened, advanced, answered, or deliberately left untouched?
11. What has physically, emotionally or informationally changed by the end?
12. How does the ending hand off to the next chapter?

If the planned chapter is boring, repetitive, implausible, contradictory, reveals
something too early, lacks meaningful activity, or would not translate naturally
into the game, say so BEFORE drafting and suggest an improvement. Do not replace
Joshua's approved event with a preferred one.

- The chapter has a Trello card and an entry in `outline/part-NN/mini-arc-NN.md`
  (or the Part overview) that Joshua has approved, and the two agree.
- The previous chapter is `review_status: approved`, or Joshua has explicitly said
  to draft ahead of an unapproved one (rare; flag it in the report).
- `bible/STORY_OVERVIEW.md`'s tracker line says where the series is.

## 1. Orient (main session reads, directly)

Read, in this order:

1. `bible/STORY_OVERVIEW.md` in full.
2. This chapter's outline entry and the mini-arc it belongs to.
3. The **complete** previous finalized chapter (the prose, not just its frontmatter).
4. The next chapter's outline-level direction, so this chapter hands off cleanly.
5. `bible/CHAPTER_INDEX.md`: the last ~10 rows, plus any older rows that mention the
   locations, characters, creatures or mystery ids this chapter touches.
6. Targeted bible excerpts: the `CHARACTERS.md` entries for everyone present, the
   `CREATURES.md` entries for every species present, the `LOCATIONS.md` entry for
   each location, the `MYSTERIES.md` rows this chapter may touch (and their "who
   knows what"), and `TIMELINE.md`'s current position on both clocks.

Do not read every prior chapter. The index exists so you never have to.

## 2. Pre-draft advisory pass (five specialists, in parallel, one message)

Dispatch all five at once. Each starts with an empty context, so each delegation
prompt must carry what it needs: chapter number, POV, the outline entry verbatim, the
previous chapter's frontmatter and closing scene, the relevant bible file paths, and
the specific question you want answered. Ask for short, concrete, ranked input.

| Agent | Ask it for |
|---|---|
| `scene-agent` | The chapter's primary event: sequence, physical stakes, scale-true logistics, where the scene turns. |
| `character-agent` | Emotional beats, relationship movement, dialogue opportunities, growth, voice notes for the POV character. |
| `world-creature-agent` | Creature behavior against `bible/CREATURES.md`, scale-state implications, survival logic, settlement and environment texture. |
| `mystery-agent` | Which `M##` questions this chapter can introduce/advance/answer, clues to plant, whether a reveal is due on the 5–15 chapter rhythm. |
| `continuity-agent` | What must be true at the chapter's opening: positions, time on both clocks, injuries, equipment, knowledge, unresolved actions, active mysteries. |

Weigh their input; they will disagree, and that is fine. You decide.

## 3. Draft (main session writes, alone)

Copy `chapters/CHAPTER_TEMPLATE.md` to `chapters/part-NN/chapter-NNNN.md`, fill the
frontmatter you already know, set `review_status: draft`, and write the chapter under
the rules in `CLAUDE.md`. One canonical draft. No alternates, no agent-written prose.

Run `python3 scripts/build-manifest.py` so the reader page lists the new chapter.

Commit: `Draft chapter NNNN: <title>`.

## 4. Post-draft review pass (the same five, in parallel)

Dispatch the same five agents against the finished draft, each with the chapter's
path, the previous chapter's path, and its specialty's checklist. Ask each for a
ranked list of concrete problems with line references, and for what it would change,
not a rewrite. `continuity-agent` also updates its own memory with what the chapter
established.

## 5. Corrections and self-check (main session)

Make the corrections you can justify; record the ones you rejected and why. Then
self-check against `CLAUDE.md`:

- word count in range and recorded; past tense; one POV; one to three scenes
- no exposition block over ~200 words
- `ending_type` set, and different from the previous chapter's
- distinct voices, action beats over tags, profanity and violence within policy
- every frontmatter field filled, including `objective` and `playable_beat_flow`;
  mystery ids valid against `MYSTERIES.md`
- every required Trello beat is on the page; nothing contradicts canon; nothing
  is revealed early
- nothing contradicts a LOCKED item or a DECISIONS entry

Set `review_status: in-review`.

## 6. Handoff report

Write `reviews/part-NN/chapter-NNNN-review.md`:

- what the chapter does, in three lines
- what changed from the outline and why
- what the specialists flagged, what was acted on, what was not and why
- proposed bible updates (new canon, character/creature/location changes, mystery
  movements, timeline advance), listed but NOT yet applied to `bible/`
- open questions for Joshua

Commit: `Chapter NNNN ready for review: <title>`.

## 7. STOP

Tell Joshua the chapter is ready and stop. Do not begin the next chapter. Do not
outline further. Do not touch `bible/` beyond `continuity-agent`'s own memory.

## 8. On approval only

When Joshua approves (possibly after his own edits or requested changes, which loop
back to step 5):

1. Set `review_status: approved` and `approved_on`.
2. Append the chapter's row to `bible/CHAPTER_INDEX.md`.
3. Apply the proposed bible updates from the report to `bible/*.md`; log anything
   that is a creative decision in `architecture/DECISIONS.md`.
4. Advance the tracker line in `bible/STORY_OVERVIEW.md`.
5. Run `python3 scripts/build-manifest.py` (the reader page reads `reader/manifest.json`).
6. Commit: `Approve chapter NNNN: <title>`.

From here the chapter is canon and the protection hook guards it.

## Every ~10 chapters

Run a heavier audit and record it in `bible/CONTINUITY_LOG.md`: contradictions across
the last stretch, "who knows what" drift, both clocks in `TIMELINE.md`, bible files
that need splitting or compressing, mystery rhythm (has 5–15 chapters gone by without
a question being answered or asked?). Housekeeping happens here, not mid-chapter.
