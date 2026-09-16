# Working on TMB-Story

TMB is a serialized, audiobook-first sci-fi/fantasy adventure series: two siblings,
Caleb and Nora Bennett, searching for their missing father across an island where
humans live at insect scale. This repository is the story itself: the living bible,
the outlines, the chapters, and the review trail. It is not the game; the game
adapts what is strongest and stable here, never the other way round.

## Where the truth lives

1. **Joshua's newest explicit instruction.**
2. **Trello, for what is PLANNED to happen** (Joshua, 2026-09-16, decision 0007).
   There is NO separate story board. Story planning lives beside game planning,
   in the list `📖 STORY — Chapters 1–50` on BOTH TRADDOMIUM: Micro Battle!
   boards (Godot: https://trello.com/b/MS7jRvdI · TypeScript:
   https://trello.com/b/DoBMcBRT), each with a `📚 Chapters 1–50 — Master Story
   + Game Overview` card. The STORY content on the two boards is the same
   canonical plan and must stay synchronized; the boards' GAME implementation
   cards may diverge. If the two STORY lists disagree, that is a conflict to
   flag, not a choice to make. Joshua and ChatGPT plan at three levels: the
   50-chapter overview, the ten-chapter mini-arc overview, and one card per
   chapter. Trello says what we currently plan; GitHub says what has already
   become canon. A newer approved Trello plan outranks an older committed outline.
   Trello may never outrank an approved chapter or a LOCKED item: if a card
   conflicts with GitHub canon, STOP and flag it for Joshua before drafting;
   never pick one silently, never rewrite canon, never invent a reconciliation.
   Card COMMENTS do not reach Claude through the connector; plan content belongs
   in card DESCRIPTIONS.
3. **`architecture/SERIES_ARCHITECTURE.md`** — Revision 3, the approved creative
   authority. It layers on Rev 2 and Rev 1 in `architecture/history/`; where Rev 3
   is silent, the newest earlier revision that speaks stands, and where they
   conflict, Rev 3 wins. Nothing in `history/` overrides it.
4. **`bible/STORY_OVERVIEW.md`** — the lean distillation. Read it EVERY chapter.
   Premise, locked cast, rules that bite, the 20-Part roadmap, and the
   "currently at" tracker line.
5. **The rest of `bible/`** — living canon as the chapters establish it.
6. **`architecture/DECISIONS.md`** — creative decisions made after Rev 3, one dated
   entry each, append-only. A decision recorded there outranks the bible file it
   changes until the bible is updated to match.
7. This file — stable operating guidance, not design truth.

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
- **Length (Joshua, 2026-09-16, decision 0010):** about 2,200 words on average,
  running anywhere from 1,800 to 3,000 as the chapter's story and plot need. That
  range is a target, not a hard limit: a major set piece, an opening, a finale or a
  high-dialogue chapter may exceed it when the story earns the length. Never pad to
  reach the minimum; never cut useful material to hit the maximum. Record the real
  count in the frontmatter.
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
- **Dialogue carries a body (Joshua, 2026-09-16, decision 0011).** No runs of bare
  back-and-forth lines, and no "he said, she said" to fix them. Most lines in an
  exchange come with something a listener can picture: an action, a look, a reaction,
  a feeling, a pause, what the hands are doing. Vary the construction (beat before
  the line, beat after, beat in the middle, the odd line left bare for pace). Name
  who is speaking often enough that a listener never has to count back.
- **US English (Joshua, 2026-09-16, decision 0012).** American spelling and
  vocabulary throughout: color, gray, meter, math, parking lot, pants, gotten,
  twelve-thirty, turn around, faucet, washer. The science stays metric because the
  characters are field scientists. "Mom", never "Mum".
- **The plain register (Joshua, 2026-09-16, decision 0015).** The prose must be
  understood by a five-year-old and a hundred-and-five-year-old on one hearing. The
  model is Beyond Extinction's finished chapters, analyzed in `docs/STYLE_GUIDE.md`:
  one idea per sentence; most sentences six words or fewer; almost no commas; no
  narration sentence over 30 words; paragraphs of one to three sentences; plain
  words and similes a child has seen; name the feeling, then show it. Measure every
  chapter with `python3 scripts/style-check.py` before review; the targets are in
  the guide and a FLAG is a rewrite, not a note.
- **Complete sentences (Joshua, 2026-09-16, decision 0013; refined by 0015).** Narration and
  dialogue are written in complete sentences. A fragment is allowed only when it is
  the joke ("Not snatched. Took."), when someone is cut off ("Don't you—"), when a
  speaker trails off, or as a BEAT FRAGMENT in the Beyond Extinction manner: one to
  five words that are a whole image or feeling on their own ("Weed. Grit. One small
  dead fly in a bee costume."). What is not allowed is a clause fragment, a sentence
  with the verb missing, or a stacked list of them. The style to aim for is plain and clear, the way a modern
  translation reads next to an old one: nothing a listener has to untangle.
- **No accidental verse (Joshua, 2026-09-16, decision 0014).** Prose should not
  rhyme, chime or fall into a sing-song cadence unless the moment needs it. Watch
  for stacked -ing words, matched pairs ("dark trees on a dark hump"), and rhythmic
  triplets; read the line aloud and flatten it if it sounds like a poem.
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
- **Every ending hooks the next chapter (Joshua, 2026-09-16, decision 0009).** A
  chapter never simply finishes; its last lines give the listener a reason to press
  play on the next one. Ways in: a line of dialogue cut off unfinished, an event, a
  sound, an arrival, an action started and not completed, a message received and not
  read out. The hook must lead into what the next chapter's plan actually does, and
  it must not reveal early. A funny or warm beat can still be the ending; it comes
  before the hook, not instead of it.
- **Time passing is said, never drawn.** No `***`, no row of asterisks, no blank
  gap between scenes. A listener cannot hear a scene break, so the prose states it:
  "An hour later, at the island end of the bar", "Ten minutes down the road", "That
  night, after everyone had gone up". The transition names the time and, when the
  place changes, the place.
- **Humor** arises from the relationships, not from jokes.
- **Insects stay structural.** Every Part needs at least one insect-driven beat that
  materially changes human stakes.

## The story is the adventure; the game lives the same adventure

TMB is written so that the eventual game performs the same canonical actions
the audiobook narrates (Joshua, 2026-09-16, decision 0007). The audiobook stays
in close third person, one POV per chapter, never second-person command
language. But the POV character regularly travels, explores, investigates,
uses equipment, handles objects, reads and interacts with creatures, solves
practical problems, helps people, sneaks, escapes, prepares, and discovers
places, creatures, clues, technology and information. Those are not
"gameplay sections"; they are the story. Let dialogue happen while people are
doing something whenever it fits: walking, driving, packing, repairing,
cooking, examining evidence, tending a creature. Stillness is still allowed
when the moment deserves it (Rachel does not collect samples while she
confesses). The goal is rhythm, not action for its own sake.

Every chapter should be able to answer the twelve chapter-as-mission
questions in `outline/WORKFLOW.md` §0, and its frontmatter carries a compact
`playable_beat_flow`: what the future player could actually do during this
part of the canonical story. Gameplay comes from what the characters need to
accomplish, never from chores added because there will be a game.

The test is NOT "does every chapter contain gameplay?" It is: **does the
overall adventure give the future player meaningful opportunities to perform
the same important actions the characters performed?** Some chapters and
scenes should stay quiet, or work as cutscenes, when that serves the story.
For a clue: **do not change the clue to create gameplay; change how and where
the characters have to obtain it.** A clue found through travel, exploration,
a person, a creature, a piece of equipment or a physical place is preferred
over repeated desk research when both make narrative sense, and never
manufactured when they do not. When an
action could matter to the game, keep the concrete details straight: where
people are, which route, what they carried, which hand is hurt, what was left
behind, who witnessed it.

## The mystery rhythm

Question → clue → investigation → answer → bigger question, roughly every 5–15
chapters, enforced at chapter level as well as Part level. `bible/MYSTERIES.md` is the
ladder; every open question has an id (`M01`…). A chapter's frontmatter records which
ids it introduces, advances or answers. "Who knows what" is the field most likely to
prevent a contradiction: keep it current.

## Chapter workflow (summary)

Full version: `outline/WORKFLOW.md`. In short:

0. **Check Trello first**: the 50-chapter overview, the current ten-chapter
   overview, this chapter's card, and nearby cards that touch continuity.
1. Orient in GitHub: the approved outline, the complete previous finalized chapter,
   the next planned chapter, `bible/STORY_OVERVIEW.md`, and targeted bible excerpts
   found through `bible/CHAPTER_INDEX.md`. Compare the card against canon. A
   meaningful conflict means STOP and flag it; only alignment means draft.
2. Dispatch the five specialists in parallel for advisory input (read-only).
3. The main session writes the one canonical draft. Nothing else writes chapters.
4. Dispatch the same five specialists to review the finished draft.
5. Make justified corrections; self-check against the rules above.
6. Verify every required Trello beat is on the page and nothing contradicts canon or
   reveals early. Write the handoff report in `reviews/`. Commit the draft.
7. **Stop and wait for Joshua's notes.** Chapters stay `in-review` until he approves
   them, and he approves in BATCHES (Joshua, 2026-09-16, decision 0016): the first
   batch is Chapters 1–10, approved together once Chapter 10 is written, unless he
   approves sooner. While a chapter is in review it is still the ground the next
   chapter stands on: `CHAPTER_INDEX.md` gets its row (Rev column `in-review`), the
   bible gets its updates tagged `[ch NNNN, in review]`, and the tracker line moves.
   Approval flips the status, the Rev column and the tags, and is committed.
8. **A writing rule that changes mid-stream is a question, not a sweep.** When
   Joshua changes how the prose is written (voice, sentences, register, English),
   record the decision, apply it to the chapter in hand, and ASK him whether to
   apply it to every earlier chapter. Do not rewrite earlier chapters until he says
   so. Decisions 0006–0015 are the writing rules as of Chapter 2; he hopes they are
   the last major change.

Do not outline further than Joshua has asked for. Do not draft the next chapter on the
strength of the current one being "probably fine."

## Canon protection

A chapter file whose frontmatter says `review_status: approved` is canon. **It must
never be silently rewritten.** A chapter `in-review` is provisional canon: later
chapters build on it as written, and it is edited only for Joshua's notes, the
current writing rules, or a continuity error, each named in the commit. Any change to an approved chapter, down to a comma,
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
