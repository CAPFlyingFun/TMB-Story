# Decisions Log

Creative and workflow decisions made AFTER Series Architecture Rev 3, one dated entry
each, append-only. **Decide once, never re-argue.** A new session reads this to inherit
calls already made. If a decision changes, add a new entry that supersedes it and
mark the old one superseded; never rewrite an entry. Format: Context → Decision →
Consequences → Status. Anything here outranks the bible file it changes until that
file is updated.

## Index

- 0001 — Chapter length 1,800–2,500 (target 2,100–2,300) supersedes Rev 1 §12's 1,600–1,800; amended by 0010 — **Accepted (Joshua, 2026-09-16)**
- 0002 — Four-digit chapter numbering (`chapter-0001.md`) — **Accepted with the foundation build (2026-09-16)**
- 0003 — `main` is the only branch; protection via frontmatter + hook, not branching — **Accepted (Joshua, 2026-09-16)**
- 0004 — Future reader: GitHub Pages serves from `main`; visual theme follows Portrait-Lifesyle-Prompt-Studio — **Accepted (Joshua, 2026-09-16), not yet built**
- 0005 — M07 and M30 are introduced in Part One (Mini-Arcs 2–3), not Part 2 — **Accepted with the Part One outline (Joshua, 2026-09-16)**
- 0006 — Prose voice follows the mood: light and simple when happy or funny, dramatic when serious; humour in every chapter — **Accepted (Joshua, 2026-09-16)**
- 0007 — Trello is the planning board (checked first, every chapter); the story and the game follow the same canonical adventure — **Accepted (Joshua, 2026-09-16)**
- 0008 — New opening: Alder Sound and Tern Island; the crash at Ch. 3; M33 and M34 added; M34's answer is Rachel — **Accepted via Trello (Joshua + ChatGPT, 2026-09-16)**
- 0009 — Endings hook the next chapter; time passing is spoken, never `***` — **Accepted (Joshua, 2026-09-16)**
- 0010 — Chapter length about 2,200 average, range 1,800–3,000; amends 0001 — **Accepted (Joshua, 2026-09-16)**
- 0011 — Dialogue carries a body: beats, looks and reactions on most lines, no bare back-and-forth — **Accepted (Joshua, 2026-09-16)**
- 0012 — The series is written in US English — **Accepted (Joshua, 2026-09-16)**

---

### 0001 — Chapter length
**Context:** Rev 1 §12 set 1,600–1,800 words, matched to Beyond Extinction; Rev 2 and Rev 3 carried "audio-clarity rules" forward without restating a number. Joshua's repository-initialization brief sets 1,800–2,500 with a natural target of 2,100–2,300.
**Decision:** 1,800–2,500, target 2,100–2,300; never pad or cut a good chapter to hit a number.
**Consequences:** `CLAUDE.md` carries the rule; the architecture file is not edited (historical record).
**Status:** Accepted, 2026-09-16.

### 0002 — Chapter numbering
**Context:** The brief writes `chapter-NNN.md`; the roadmap runs to 1,000+ chapters and Beyond Extinction already uses four digits.
**Decision:** `chapter-NNNN.md`, zero-padded to four digits, in `chapters/part-NN/`.
**Consequences:** Sorting stays correct past chapter 999; index and hook match on the four-digit form.
**Status:** Accepted with the foundation build, 2026-09-16. Say the word to change it before Chapter 1 exists.

### 0003 — Single branch
**Context:** `docs/claude-code-workflow-design.md` §7 recommended per-chapter draft branches; Joshua's brief replaced that with main-only.
**Decision:** `main` only. Approved chapters are protected by their own frontmatter and by `.claude/hooks/protect-approved-chapters.sh` on every branch. Commits at draft and at approval are the audit trail.
**Consequences:** No PRs, no merges. A single long-lived experimental branch may be added later if wanted.
**Status:** Accepted, 2026-09-16.

### 0004 — Reader tool: hosting and look
**Context:** The reader (`reader/`) is deliberately not part of the foundation; it comes once there are chapters to read. On creating the repository, Joshua set GitHub Pages to serve from `main` so a reader can go live as soon as a few chapters exist, and named the look he wants: the theme and UI of https://github.com/CAPFlyingFun/Portrait-Lifesyle-Prompt-Studio.
**Decision:** When the reader is built it is a static site on `main` served by Pages, consuming approved chapters and bible material only (never a second place the story is written). Its visual language follows that repo's dark warm theme, recorded here so the reference survives if that repo changes: backgrounds `#12100E` / `#1C1917` / `#262220` / `#302C28`, text `#F5EDE4` / `#C4B49A` / `#8B7E6E`, borders `#3D3733` / `#8B7355`, accents gold `#D4A853`, warm `#C9845C`, sage `#7BA68A`, sky `#6B9FBF`, rose `#C47070`, violet `#9B87B2`; display font Playfair Display, body font DM Sans.
**Consequences:** Nothing to build now. Until a reader exists, Pages on `main` simply serves the repository's Markdown as-is, which is harmless. `voices/` and `audio/` remain out of scope until audio production starts.
**Status:** Accepted, 2026-09-16; build deferred.

### 0005 — Ladder Part column for M07 and M30
**Context:** Rev 2 §17 lists M07 (who funded/monitored Dad's work) and M30 (Kessler's real connection) as "Introduced: Part 2 (professor)". Rev 2 §10 places Kessler's first appearance in Mini-Arc 2 (Chapters 11–20) and Rev 1 §8 places the funder's name in Mini-Arc 3 (Chapters 21–30), both inside Part One. The mini-arc text is the more specific source.
**Decision (proposed):** Treat the ladder's "Part 2" for these two rows as "Part 1, Mini-Arcs 2–3". `bible/MYSTERIES.md` is updated to say so once approved.
**Consequences:** The Part One outline introduces M30 at Chapter 14 and M07 at Chapter 23. Partial and full answer columns are unchanged.
**Status:** Accepted with the Part One outline approval, 2026-09-16.

### 0006 — Prose voice follows the mood
**Context:** Joshua read the first draft of Chapter 1 and found it a little boring, hard to follow, and short on humour. His instruction, in two parts: write "like explaining to a young child or in the style of Disney," and then, refining it, "match the style of writing with the story, so if it's a happy or funny part it will be more lighthearted and simple; something more serious, maybe more dramatic tones."
**Decision:** The register follows the scene. Light, simple, playful and funny where the story is happy; fuller, slower and dramatic where it is serious or dangerous; the turn between them felt on the page. In every register the listener must never get lost, wonder lives in small things, and there is humour somewhere in every chapter. The architecture's restraint (violence, romance, profanity) stands.
**Consequences:** `CLAUDE.md` writing rules carry this as the first rule. Chapter 1, a happy chapter, rewritten in the light register before approval. The specialists' review passes check register against mood.
**Status:** Accepted, 2026-09-16.

### 0007 — Trello plans, GitHub is canon; the story and the game are one adventure
**Context:** Joshua and ChatGPT will plan Chapters 1–50 on Trello at three levels (50-chapter overview, ten-chapter mini-arcs, one card per chapter with a compact PLAYABLE BEAT FLOW). TMB is not a novel with a loosely related game later: the audiobook tells what the characters did; the game lets the player perform those same canonical actions.
**Decision:** Before any chapter, Trello is checked first, then GitHub canon, then the previous chapter in full and the next planned chapter. Trello = what we plan; GitHub = what is canon. A conflict is flagged to Joshua, never resolved silently. Chapters are written as a lived adventure with dialogue on the move where it fits and stillness where it is earned; each chapter answers the twelve mission questions and carries `objective` and `playable_beat_flow` in its frontmatter. Gameplay comes from the story's objectives, never from added chores. Claude remains the prose writer, editor and checker, not a stenographer: weak, passive, repetitive or contradictory plans are flagged before drafting.
**Where the plan lives (Joshua, 2026-09-16):** no separate story board. The list `📖 STORY — Chapters 1–50` on BOTH TRADDOMIUM: Micro Battle! boards, each with a `📚 Chapters 1–50 — Master Story + Game Overview` card: Godot board https://trello.com/b/MS7jRvdI (card https://trello.com/c/cXzGstfx) and TypeScript board https://trello.com/b/DoBMcBRT (card https://trello.com/c/xXl1l7gw). The STORY content on the two boards represents the same canonical plan and stays synchronized; the GAME implementation cards may diverge. Planning proceeds top-down: 50-chapter overview → five ten-chapter overviews → chapter cards; then the finished plan is reconciled with GitHub before Chapter 1 is drafted.
**Refinement (Joshua, 2026-09-16):** the test is not "does every chapter contain gameplay" but "does the overall adventure give the future player meaningful opportunities to perform the same important actions the characters performed." Quiet and cutscene chapters remain legitimate. For clues: do not change the clue to create gameplay; change how and where the characters obtain it, and never manufacture activity to satisfy the rule.
**Consequences:** `CLAUDE.md` (truth order and a new section), `outline/WORKFLOW.md` §0, `chapters/CHAPTER_TEMPLATE.md` updated. The activity review of the proposed Chapters 1–10 and approved 11–50 is kept at `docs/planning/2026-09-16-activity-review.md` for the planning room.
**Status:** Accepted, 2026-09-16.

### 0008 — The new opening, reconciled from Trello
**Context:** Joshua found the boatyard Chapter 1 made Caleb read older than eighteen. The replacement (Alder Sound Field Station, Tern Island, the crash on the return trip, "Where was he?", the halves fitting at Ch. 5, the enclosure card at Ch. 10) was proposed in this repo and then planned by Joshua and ChatGPT on Trello (master card, ten-chapter cards, chapter cards 01–10), with additions: gear cleaning in Ch. 2, the vision drawing in Ch. 5, the boathouse loft in Ch. 9, a hide-and-detour complication in Ch. 10.
**Decision:** `outline/part-01/mini-arc-01.md` mirrors the Trello plan and is approved. The 21–30 card fixes M34's answer: Rachel quietly kept Daniel-linked equipment alive through legitimate Tidewater work and has been watching for something. M33 (the family's story) and M34 (the enclosure) join the ladder. Caleb's wrist: cast six weeks, then a brace, off at Ch. 31. Nora's library job, Harlow's Boatyard, the drowned engine, the customer and the Mayor are retired. The boatyard Chapter 1 draft is deleted from `chapters/` and kept in git history (`a2a7320`).
**Consequences:** Mini-Arcs 2–5 in GitHub carry a note that Trello's ten-chapter cards supersede them where they differ, pending chapter cards. Sync discrepancies found on 2026-09-16: duplicate ten-chapter overview cards on both boards; the TypeScript board lacks the `10 — Low Water` card. Flagged, not fixed by Claude.
**Flag, unresolved:** the Trello 41–50 card places "the crossing" around Ch. 50 with a Ch. 51 handoff of "SURVIVE", while Rev 2 §10/§20 LOCK Part One's ending on the wolf-spider rescue and "Where did you come from?" (the approved outline crosses at Ch. 44 and spends 45–50 on the island). To be resolved by Joshua before the 41–50 chapter cards are written.
**Status:** Accepted, 2026-09-16.

### 0009 — Endings hook; time passing is spoken
**Context:** Joshua read the corrected Chapter 1 and asked for two craft changes that apply to every chapter: no `***` scene breaks (state the gap in words, "an hour later", "after they got home"), and endings that hook the listener into the next chapter rather than stopping. His named devices: an unfinished line of dialogue, an event, a sound, an action.
**Decision:** Both become audiobook writing rules in `CLAUDE.md`. A scene transition names the time passed and, if it changes, the place. A chapter's final lines lead into the next chapter's plan without revealing early; a warm or funny beat may precede the hook but not replace it. The ending-type rotation still applies to the hook.
**Consequences:** Chapter 1's two `***` breaks replaced with spoken transitions; its ending now runs past the scale gag into Rachel's texts (the joke, then "which island?", then an instant reply Caleb does not see), which is the door Chapter 2's card opens on (Rachel and the letter, Rachel's one professional question too many). `ending_type` for Chapter 1 changes from funny character beat to unanswered question. The scene specialist's review checklist gains both rules.
**Status:** Accepted, 2026-09-16.

### 0010 — Chapter length: around 2,200, free between 1,800 and 3,000
**Context:** Chapter 1 kept landing over decision 0001's 2,500 ceiling (2,990 after the hook), and each round asked Joshua whether to cut a beat. His answer set the rule instead: "the average should be around 2,200 words, but can fluctuate from 1,800–3,000 words depending on the story's chapter and plot."
**Decision:** Amends 0001. Target average about 2,200; range 1,800–3,000; where a chapter lands is decided by what the chapter has to do, not by the number. "Never pad or cut a good chapter to hit a number" stands.
**Amendment (Joshua, 2026-09-16, approving Chapter 1 at 3,294):** the range is a TARGET, not a hard limit. A chapter may exceed it when the story naturally earns the length, especially a major set piece, an opening, a finale or a high-dialogue chapter. Do not pad to reach the minimum; do not cut useful material to hit the maximum.
**Consequences:** `CLAUDE.md` length rule rewritten. Mini-Arc 1 per-chapter targets adjusted upward for the set-piece chapters; the rest stay near 2,100–2,300. Chapter 1 at 2,990 is inside the range and is not cut. The running average is checked at the ten-chapter boundary, not per chapter.
**Status:** Accepted, 2026-09-16.

### 0011 — Dialogue carries a body
**Context:** Joshua, on the round-two Chapter 1: avoid bare back-and-forth dialogue, and avoid fixing it with repetitive "he said, she said"; instead attach actions, emotion, reactions and looks to the lines. His example turned three bare lines into lines with a speaker, a feeling and a small action each.
**Decision:** A standing audiobook rule in `CLAUDE.md`. Most lines in an exchange carry a beat a listener can picture; constructions vary; speakers are named often enough that nobody counts back. Ornate tags and stacked adverbs remain out; the beat does the work the adverb would.
**Consequences:** Chapter 1 revised line by line. The revision added about 300 words; with small trims it stands at the count in its frontmatter, over decision 0010's 3,000 by a margin flagged in the handoff report for Joshua's ruling (accept, trim, or split, where a split would shift every Trello chapter number and produce two chapters under 1,800). The scene and character specialists check the rule in review.
**Status:** Accepted, 2026-09-16.

### 0012 — US English
**Context:** Chapters 1 and 2 mixed "Mom" with British spelling and vocabulary (colour, metres, car park, trousers, maths, half twelve). Asked which English the series speaks, Joshua: "make it US English, not UK English."
**Decision:** American spelling and vocabulary in all prose, bible and outline text. Metric units stay, spelled the American way (meters, centimeters, liters), because the characters are field scientists. Applied to the approved Chapter 1 on Joshua's instruction alongside his eleven approved proofing fixes, and to Chapter 2 in review; the bible, outline and review files converted in the same pass. `architecture/` is a historical record and is not edited.
**Consequences:** `CLAUDE.md` carries the rule. The specialists' review passes flag British forms.
**Status:** Accepted, 2026-09-16.
