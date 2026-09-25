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
- 0013 — Complete sentences; fragments only for a joke, a cut-off or a trail-off — **Accepted (Joshua, 2026-09-16)**
- 0014 — No accidental rhyme or verse cadence; Chapter 1 re-opened for 0013/0014 — **Accepted (Joshua, 2026-09-16)**
- 0015 — The plain register: Beyond Extinction's style is the model; measured by `scripts/style-check.py` — **Accepted (Joshua, 2026-09-16)**
- 0016 — Batch approval: Chapters 1–10 pending together; rule changes are asked before being applied to earlier chapters — **Accepted (Joshua, 2026-09-16)**
- 0017 — Audiobook-first dialogue: write for one narrator reading every character — **Accepted (Joshua, 2026-09-16)**
- 0018 — THE REBOOT: the catastrophe happens in Chapters 1 to 3; the fifty-chapter plan is archived and non-canon — **Accepted (Joshua, 2026-09-17)**
- 0019 — "Story bible" renamed "TMB Story Rules"; `bible/` becomes `story-rules/` — **Accepted (Joshua, 2026-09-17)**
- 0020 — Length band 1,200-1,400 (1,000 floor, 1,800 ceiling) and the three-chapter movement; supersedes 0001 and 0010 — **Accepted (Joshua, 2026-09-17)**
- 0021 — The voice cast is a registry: one entry per speaker, a recast replaces it, a clip is identified by speaker and text but invalidated by voice — **Accepted (Joshua, 2026-09-18)**
- 0022 — The first authorized edit to the imported manuscript; Chapters 1-3 are no longer byte-identical and the file says so — **Accepted (Joshua, 2026-09-18)**
- 0023 — The aftermath is a stretch of its own, not a bridge to the time jump; its length is deliberately open — **Accepted (Joshua, 2026-09-18)**

---

### 0001 — Chapter length
**Amended by decision 0010, and 0010 was itself amended when Joshua approved Chapter 1 at 3,294 words. Read 0010 for the rule in force; the range below is history.**
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
**Amendment (Joshua, 2026-09-16):** US English is idiom and vocabulary, not only spelling. "Then wear them wetter" is a British joke shape; the American line is "Wear them wet. Sorry about that." A watch-list of British idioms lives in `docs/STYLE_GUIDE.md` and `scripts/style-check.py` flags them. Applied to both chapters: properly, love, Sorry?, cross, another go, in the wet, kit, do the boots, the state of you, moving house, carpet, corridor, cupboards, weed, the sea, parcel, backwards, work out, garden, half past, and the fixed words' closer "That's the whole of it" becomes "That's the whole story" (bible updated; M33 wording is provisional until batch approval).
**Consequences:** `CLAUDE.md` carries the rule. The specialists' review passes flag British forms.
**Status:** Accepted, 2026-09-16.

### 0013 — Complete sentences
**Context:** Joshua, reading Chapter 2: the prose should read like a plain modern translation rather than an ornate old one; "make sure it's a complete sentence unless a joke, someone is cutting them off, or they stop talking."
**Decision:** Narration and dialogue in complete sentences. Fragments only as the joke, the interruption or the trail-off. Inventory-style lists become sentences. Applied to Chapter 2 in review (the two-count line, the jar slip, the photograph description, the repacking list, the ending's "Not at the keys"). Chapter 1 is approved and untouched; its fragments are listed in Chapter 2's handoff report for Joshua to keep or convert.
**Consequences:** `CLAUDE.md` carries the rule; the scene specialist flags fragments in review.
**Status:** Accepted, 2026-09-16.

### 0014 — No accidental verse; Chapter 1 re-opened
**Context:** Joshua: "make sure the words and sentences don't rhyme or sound like a poem unless needed for a reason," and, so the rule and decision 0013 could be applied to Chapter 1, "temporarily place back in pending."
**Decision:** Prose avoids rhyme, chime and sing-song cadence unless the moment needs it. Chapter 1's `review_status` goes back to `in-review` on Joshua's instruction (the approval date is kept in a comment), its index row and the tracker say so, and it returns to `approved` only when he re-approves it. Applied to Chapter 1: eleven fragment passages rewritten as sentences (the joke "Not snatched. Took." kept), "dark trees on a dark hump" flattened, "ticking and bubbling like something cooking" and "Then the middle of the saddle" flattened.
**Consequences:** `CLAUDE.md` carries the rule; the scene specialist flags rhyme and cadence in review.
**Status:** Accepted, 2026-09-16.

### 0015 — The plain register (Beyond Extinction as the model)
**Context:** Joshua, having read both chapters: "there is nothing really wrong with the story itself, it's the writing style that is slightly hard to understand in a few spots. It needs to be able to be understood from like a 5 year old to a 105 year old person. Please look and analyze Beyond Extinction's story and writing style to apply the same concept with TMB." He supplied Beyond Extinction Chapters 1–41.
**Analysis:** measured in `docs/STYLE_GUIDE.md`. BE's finished chapters average 6 words a sentence (median 5), 0.13 commas a sentence, no sentence over 30 words, paragraphs of one or two sentences. TMB's chapters averaged 11–13 words a sentence with a comma in most and sentences of 60+ words. The habits that make BE readable: one idea per sentence, very short sentences, almost no commas, beat fragments that are whole images, short paragraphs, plain words and familiar similes, feelings named then shown, parallel structure for steps.
**Decision:** TMB adopts the register. Numeric targets per chapter (average sentence ≤ 9 words, median ≤ 7, narration sentences over 30 words ≤ 2%, commas ≤ 0.5 a sentence, "and" ≤ 0.3, paragraphs ≤ 60 words with none over 80) are checked by `scripts/style-check.py` before a chapter goes to review. Decision 0013 is refined: beat fragments of one to five words are allowed; clause fragments are not. BE's "• • •" scene breaks and journal epigraphs are NOT adopted (decision 0009 stands; TMB has no narrator-character).
**Consequences:** Chapter 2 (in review) rewritten in the register and passes every target. Chapter 1 is approved and untouched; its numbers fail every sentence-level target, so it needs Joshua's re-open to be rewritten. The scene specialist runs the checker in review. `CLAUDE.md` carries the rule.
**Status:** Accepted, 2026-09-16.

### 0016 — Batch approval; ask before applying a rule change backward
**Context:** Joshua, after re-opening Chapter 1 twice in one day for new writing rules: "let me review both before approval again so it's not approved and disapproved the next message... How about I not approve it until chapter 10... keep it pending until chapter 10. However, I may approve it sooner if good this time... just make a note and ask if I change something with the writing later if I want to apply it to all past chapters. Hopefully, they will be the last major writing change."
**Decision:** Chapters 1–10 stay `in-review` and are approved together once Chapter 10 is written, or sooner at Joshua's word. An in-review chapter is provisional canon: the next chapter builds on it as written; its index row, bible updates (tagged `[ch NNNN, in review]`) and the tracker move at draft-complete and are confirmed at approval. When a writing rule changes, Claude records it, applies it to the chapter in hand, and asks Joshua whether to apply it to earlier chapters before touching them.
**Consequences:** Chapter 1 re-opened for decision 0015 and rewritten in the plain register; both chapters `in-review`. Chapter 2's bible updates applied now, tagged in review. `CLAUDE.md` workflow steps 7–8 and `outline/WORKFLOW.md` updated. The approved-chapter hook still guards `approved` files only.
**Status:** Accepted, 2026-09-16.

### 0017 — One narrator reads everyone
**Context:** Joshua began testing Chapters 1 and 2 as an audiobook through a single ElevenLabs voice. It exposed a class of problem invisible on the page: lines whose speaker the reader infers from paragraph alternation are briefly ambiguous when one voice performs everybody. His example is Chapter 1's "I've got the water," clear in print, a two-second question out loud. He asked for a dialogue-clarity and scene-presence pass on both chapters, and set the principle for all future chapters.
**Decision:** TMB is written as audiobook-first prose. The prose, not the layout, carries who is speaking, who is being spoken to, where people are and what they are doing. Dialogue is anchored to a character by name regularly, and more often early in the series; three spoken lines never pass in a row with nobody named. A plain "said" tag is good and often best. Where a natural beat exists, prefer one that also shows the task, the place, the look or the mood; where none exists, take the bare tag rather than invent a gesture. Exchanges that are already unmistakable are left alone. `scripts/style-check.py` gained an unanchored-run report.
**Consequences:** Chapters 1 and 2 passed for clarity (16 and 15 changes), no story, clue, motivation, continuity or ending altered, and no bible-quoted line changed. `CLAUDE.md` and `docs/STYLE_GUIDE.md` carry the rule; the scene specialist runs the check. Both chapters remain `in-review` under decision 0016 pending Joshua's listening pass.
**Amendment (Joshua, 2026-09-16, from the one-voice listening test):** the first version of this rule was not strong enough. An exchange can pass "no run of three unnamed lines" and still be ambiguous, because naming speaker A resets the counter without making the NEXT line audible. Two principles are added and outrank the counter. (1) The speaker must be identifiable as the line is heard, or from what was heard immediately before it; identifying narration that arrives only after the speech is too late, so the action goes BEFORE the line. (2) A/B alternation is never an anchor: "Caleb said" does not identify the following untagged line as Nora's, because the listener cannot see the paragraph break. Short exchanges may stay untagged only when the audible CONTEXT, not the layout, makes them unmistakable; prefer relocating an action the character is already performing, and a plain tag over an invented gesture. `scripts/style-check.py` was rewritten to report late anchors and unanchored lines instead of counting runs. Applied: 7 further changes in Chapter 1 (including two speeches that an earlier paragraph pass had split mid-quotation) and 7 in Chapter 2; both now read zero on both reports.
**Status:** Accepted, 2026-09-16.

### 0018 — The story is rebooted; the catastrophe happens immediately
**Context:** Joshua, 2026-09-17, supplying an approved Word manuscript of Chapters 1 to 3: "The overall plot and chapter structure of TRADDOMIUM: Micro Battle has been substantially rebooted. This is NOT simply a rewrite of the old Chapters 1–3. The previous long-form outline in which the story spent roughly fifty chapters before reaching the miniature-island / survival portion is OBSOLETE."
**Decision:** The miniature-world catastrophe happens at the start. Chapters 1 to 3 are The Alarm, The Boundary and The Activation: Dr. Jack Bennett and Sarah Bennett, the TOMBS Array, March fifth in the year twenty-one ten, a research settlement of nearly five hundred people on a remote Atlantic island reduced in scale while the island itself is untouched. Sarah is thirty-two weeks pregnant. Lena Ortiz is the night-shift power technician at the island utility station and is reached only by wrist-terminal call; she is never in the laboratory. Chapters 4 to 6 will cover the immediate aftermath. Later the story jumps about eighteen years, after which Jack and Sarah's son, born after the catastrophe and having never known normal human scale, becomes the primary protagonist; the academy and survival-training material belongs after that jump.
**The manuscript is the source of truth.** Chapters 1 to 3 were imported verbatim and verified byte-identical against Joshua's document, 304 prose paragraphs with zero mismatches. They are not rewritten, improved or reinterpreted.
**Consequences:** The entire pre-reboot repository — the previous Chapters 1 to 3, the fifty-chapter outline, the bible, the reviews and the series architecture — moved to `archive/pre-reboot/` under a README stating plainly that none of it is canon. `story-rules/` was rebuilt from the manuscript alone. Decisions 0001 to 0017 that concern craft still stand and are restated in `story-rules/TMB_STORY_RULES.md`; decisions that concern the old plot and structure (0005, 0008 and the mystery ladder) are historical. No replacement long outline was created, per his instruction.
**Status:** Accepted, 2026-09-17.

### 0019 — "Story bible" is renamed "TMB Story Rules"
**Context:** Joshua, 2026-09-17: "Yes, 'Story Bible' is a legitimate writing term, but people unfamiliar with the term have reasonably wondered what the story has to do with the Bible. Nothing. So we're using a clearer name."
**Decision:** The concept is called **TMB Story Rules**. `bible/` becomes `story-rules/`, with `story-rules/TMB_STORY_RULES.md` as the master document. Filenames, headings, internal references, the README and the reader's navigation were updated. `MYSTERIES.md` became `OPEN_QUESTIONS.md` in the same spirit. The word "bible" is left untouched wherever it appears inside archived material, dated decision text, or any other historical record.
**Status:** Accepted, 2026-09-17.

### 0020 — Length band and the three-chapter movement
**Context:** Joshua's reboot instructions, 2026-09-17, replacing the length rule of decisions 0001 and 0010.
**Decision:** A normal chapter targets about 1,200 to 1,400 words. About 1,000 words is the normal minimum. An important chapter may reach about 1,600 to 1,800 words when the story needs the space. Never add filler to reach a count. The story is planned and written about three connected chapters at a time as one movement, with natural chapter breaks and cliffhangers found inside the material, then tested as audio through ElevenLabs before the next movement begins. The approved Chapters 1 to 3 run 1,160, 1,083 and 1,384 words.
**The two-turn anchor guideline:** after roughly two unanchored dialogue turns, identify a speaker again with an action beat, a reaction, a name or a natural tag. This relaxes decision 0017's stricter reading into a practical rule, and 0017's principle still governs judgment: the speaker should be identifiable as the line is heard, not afterward.
**Consequences:** `scripts/style-check.py` retargeted to the manuscript's actual profile and to the two-turn rule; `docs/STYLE_GUIDE.md` marked superseded on word counts. Decisions 0001 and 0010 are history.
**Status:** Accepted, 2026-09-17.

### 0021 — The voice cast is a registry, and a voice is replaced, never duplicated
**Context:** Joshua built the audiobook pipeline on 2026-09-17 under the rule "write once, voice once, cache once, use in audiobook and game," approved five voices that day, and on 2026-09-18 replaced two of them after listening: "The previous Narrator and Lena voice IDs are no longer canonical. Replace their assignments in the voice registry rather than creating duplicate character entries."
**Decision:** `story-rules/voice-registry.json` is the one canonical record of who speaks and in which voice. A speaker has exactly one entry; a recast overwrites that entry's `elevenLabsVoiceId` and re-stamps `voiceApproved`. Never add a second entry for the same character, and never invent a voice ID — an unassigned voice is `null` and blocks generation with a named error rather than being filled in with a guess.

The current cast: Narrator `XjLkpWUlnhS8i7gGz3lZ`, TOMBS / settlement systems `QpRibeuwXoGrlpLFDwqY`, Jack Bennett `mkT7KpSQR9btjx2rHpQY`, Sarah Bennett `MClEFoImJXBTgLwdLI5n`, Lena Ortiz `4O1sYUnmtThcBoSBrri7`. Voice IDs are not secrets and live in the repository. The `ELEVENLABS_API_KEY` is, lives only in the GitHub secret and a developer's shell, and reaches no file, manifest, log or page.

**A clip is identified by its speaker and its text; it is invalidated by its voice.** `clipId` is `<speaker>-<sha1(speaker + normalized text)[:12]>`, so inserting a paragraph renames nothing and a line repeated later is the same clip already paid for. The separate fingerprint covers text, voice, voice version, model, format and settings, which is what makes a recast cost one speaker instead of a chapter.

**Consequences:** Replacing the narrator invalidated 92 of chapter 1's 180 clips and left Jack's 47, Sarah's 34 and TOMBS' 7 as verified cache hits — 4,893 characters rather than 6,789 — and Lena's replacement cost nothing in chapter 1, where she does not speak. The new narrator audio landed at the same 92 paths, so nothing was orphaned. Generation runs only in the manual `Generate TMB audio` workflow, which validates before spending anything and refuses to commit if the key appears in the working tree. The browser plays static files and has no path to ElevenLabs, so listening and replaying are free.
**Status:** Accepted, 2026-09-18.

### 0022 — The first authorized edit to the imported manuscript
**Context:** Joshua, 2026-09-18, listening to the Chapter 1 audio drama: "I don't know I missed it before but was obvious this time and that's in the dialogue, it says she resumes back to the keyboard." Paragraph 76 ends "before returning to the keyboard" and paragraph 78 then opens "Sarah returned to the keyboard." — a repetition invisible on the page and obvious out loud, two narration lines and about five seconds apart. He proposed the fix himself: "make the actual text and that one narration like 'Sarah continued typing' or something that fits."
**Decision:** Paragraph 78's narration becomes **"Sarah continued typing."** His wording, used as given. "Sarah kept typing." was not available as a fix because it is already the narration at paragraph 68, and a third phrasing of the same idea was the problem rather than the solution. This is the ONLY change; no other line of Chapters 1 to 3 was touched.

**Chapters 1 to 3 are no longer byte-identical to the imported Word document, and the manuscript now says so.** Decision 0018 recorded a verbatim import verified at 304 paragraphs with zero mismatches, and that is still how the file began. Chapter 1's `source:` line now records the deviation, and an `approved_edits:` block in its frontmatter carries the date, the authorization, the exact before and after, the reason and the audio consequence. A future agent reading "imported verbatim" must not conclude the file has never been touched.

**Process:** the `review_status: approved` hook exists to stop exactly this kind of edit happening quietly. Joshua authorized flipping the status to `in-review` first, in writing, naming the chapter and the line; the flip was made, the prose edit went through the ordinary tools, validation ran, and the status returned to `approved`. The hook was not circumvented.

**Consequences, and why they were cheap:** a clip is identified by its speaker and its text, so changing one line re-identified exactly one clip — `narrator-75a8844f5b06` became `narrator-668b2dc69db1` — and one narrator line was regenerated. Every other one of the chapter's 180 clips stayed cached. One cue, `ch01-140-sarah-resumes`, was anchored to the old clip; validation reported the broken anchor instead of letting the cue land on a plausible-looking neighbour, and it was re-anchored to the new identity. **That is the one case where a cue anchor is supposed to be edited:** the line's text changed, so its identity changed. Word count 1,160 to 1,158. The old clip is left on disk rather than deleted, because it is the cheapest possible revert.
**Status:** Accepted, 2026-09-18.

### 0023 — The aftermath is a stretch of its own, not a bridge to the time jump
**Context:** Joshua, 2026-09-18, after approving Chapters 1 to 3: "We are NOT rushing directly into the 18-year time jump after Chapter 3. I want several chapters in the immediate aftermath first, letting the miniature-world situation become a mystery and giving the settlement time to react, investigate, adapt, and survive."
**Decision:** Decision 0018's eventual eighteen-year jump still stands and is NOT next. The chapters after 3 explore the aftermath: emergency response across the five-hundred-person settlement, what infrastructure survived and what failed, the loss of outside communications, attempts to understand or reverse TOMBS, evidence the event was deliberate, the unexplained external vibrations and the threats of a giant world, first controlled exploration near the boundary, Jack and Sarah facing it while Sarah is still thirty-two weeks pregnant, the settlement realising this may not be reversible quickly, and the early foundations of the post-jump society.

**What is deliberately left open, and must not be filled in:** the number of pre-jump chapters; any replacement long outline; the son as protagonist, who is not born yet; and when the jump happens, which is Joshua's choice of a specific chapter rather than a consequence of the aftermath feeling long enough. Chapters 4 onward are not drafted until he asks — recording a direction is not an instruction to write.

**Consequences:** `outline/STORY_DIRECTION.md` holds the note. `story-rules/STORY_OVERVIEW.md` said "Chapters 4 to 6, next" followed immediately by the jump, which read as a three-chapter bridge; it now says the aftermath runs at a length not yet fixed. `outline/WORKFLOW.md` and `CLAUDE.md` point at the direction file. The aftermath grows from what the manuscript already planted — dead communications in every direction, two unexplained vibrations with no seismic cause, and Jack deciding he is not certain he wants to know what they were — rather than from a plan laid over it.
**Status:** Accepted, 2026-09-18.

### 0024 — The bare said-tags come out of Chapters 4 to 6, because the voices now carry the speaker
**Context:** Joshua, 2026-09-22, after listening to a test cut of Chapter 4 built from the existing clips with seven bare tags left out: "dropping the 'person said' made a difference for audio especially since you can hear the voice differences... it also makes it sound more natural." The rules file assumes ONE narrator reads every character, so the prose has to name the speaker at the moment the line is heard; the audio no longer works that way. Each character has their own voice, and a tag after a line the listener has already placed is a second, redundant answer.
**Decision:** A tag of the shape `"...," Name said.` with NOTHING else in the sentence is removed from Chapters 4, 5 and 6 — twenty-two of them — and the comma before the closing quote becomes a period. Everything that carries a beat stays exactly as written: `"...," she said, before Jack could even greet her.`, `"...," Mark said, and stepped back from the doorway.`, `"I know," Jack said, keeping his voice even.`, `Doctor Mercer said nothing.` His instruction: "leave the actions, poses, and everything else as is."

**This does not change the rule for the page.** The text still has to be unambiguous to a reader with no voices, which is why the removal is limited to the isolated tag and why each de-tagged line was checked against the manuscript for what now anchors it. Where nothing in the prose does, the anchor moves into `audio/speaker-overrides.json`: eight of the twenty-two needed a pin ("They don't know.", "Nothing clear...", "Nobody goes outside the developed zone.", "Give it time.", "Okay. You can go.", "Noted.", "Not tonight.", "It was given a target scale."). Chapters 1 to 3 are untouched; whether the same edit goes there is a separate instruction.

**Consequences:** Word counts 1,571 / 1,584 / 2,102 become 1,558 / 1,562 / 2,094. A de-tagged line is a new clip (its text changed), so the twenty-two lines regenerate; the tag clips are simply no longer referenced. The same import carries his other two fixes: Chapter 4's Unit Twelve is now named as Mark, and the midnight paragraph separates the residents who went back to bed from the utility and security staff already on duty.
**Status:** Accepted, 2026-09-22.

**0024, addendum (2026-09-22, same day):** Joshua: "you'll also check chapters 1 through three to make sure they're also good from 'Said'?" Scanned with the same rule. Chapter 1 and Chapter 3 have no bare tag (their "said"s are inside dialogue, or "Jack said nothing."). Chapter 2 has two -- `"It just hid them," she said.` and `"Understood," Lena said.` -- and they come out the same way. Chapter 2 is otherwise still the verbatim 2026-09-21 import, and its `source:` line says so. 1,008 words become 1,004.

**0024, second addendum (2026-09-23):** Joshua's next documents (01-03 and 04-06) carried a new chair exchange in Chapter 1 and, being based on the pre-strip text, the bare tags again; imported, and the tags stripped again on his instruction: "remove for audio the extra or minor '... said' parts and combine any split audio parts that you see into 1 new audio file." The second half is the join he had already made by hand in Chapters 4 to 6: a line one person says, cut in two by a beat, becomes the beat and then the whole line. Seven such paragraphs in Chapters 1 to 3 joined (Jack's "Whatever this is..." and "Right. Problem...", Sarah's "I'm here. What's wrong?", Jack's "Exactly. If anything changes...", "Sarah! Are you hurt?", "No. Offline because it finished.", "Everything says we're fine. Which means..."). Two in Chapter 2 deliberately NOT joined, because the beat between the halves is an event or a change of listener: "I didn't do it the first time." / Sarah tried the command anyway. / "Mapping access denied.", and "That's what I want to know." / Jack keyed his wrist terminal. / "Lena, keep the laboratory isolated...". A system readout followed by a person's line is two speakers, not a split, and is untouched. Chapters 1 to 3 now carry the same source-line record of deviation as Chapter 2 did.

### 0025 — TOMBS transforms space once; the island is transformed too; the characters know neither
**Context:** Joshua, 2026-09-25, after working a scale-and-geometry question through with another writer: "TOMBS does NOT simply shrink physical objects inside an ordinary fixed space. Instead, TOMBS performs a one-time spatial-scale transformation." The story had never said how a town can shrink without collapsing to a point, leaving an empty footprint, keeping its buildings kilometers apart relative to its people, or sitting in a powered bubble. Several canon files said, as flat fact, that "the island was not affected" — which was only ever the characters' conclusion.
**Decision:** `story-rules/WORLD_RULES.md` is created and holds the author-level rules, each tagged KNOWN, HIDDEN or NOT CANON:
- **The settlement is transformed uniformly to about 1:180 island-relative,** joined to the island by a gradual scale-transition region. TOMBS fires once and shuts down; nothing holds the result in place and nothing needs to stay powered. The result is permanent unless deliberately reversed. **Hidden.** The characters take the visible edge for "the boundary", and the manuscript keeps that word.
- **The island is itself about 1:180 relative to Earth,** so the people are about 1:32,400 relative to Earth. **Hidden.** Chapter 3's "Their town had shrunk. / And the island had not." is Jack and Sarah's reasonable, wrong conclusion and stays exactly as written.
- **The island is artificial,** about fifty-six kilometers across before the event, with engineered infrastructure inside it. **Known** to the characters, not yet said on the page. The settlement has its own microgrid and backups, normally tied to an island-wide master grid, and full local communications; external communications are gone. **Known.**
- **A signature-management or concealment system is a candidate only.** Not canon, not named, not linked to anything, until Joshua approves it.

**Chapters 1 to 6 are not touched.** Joshua: "Do NOT go back and rewrite Chapters 1–6 around this." The canon files are corrected instead, so that a statement of what the characters believe is labelled as belief: `STORY_OVERVIEW.md` (premise), `LOCATIONS.md` (the island, the boundary), `TECHNOLOGY.md` (the mechanism, the scale factor's author value, the settlement's systems), `OPEN_QUESTIONS.md` (a section of what the author knows and no character does; Q03, Q05 and Q07 stay open), `TIMELINE.md`, and `reference/README.md` (the hidden second scale).

**Also recorded, from the same instruction:** the story continues from "PHASE ONE READY" overnight with dawn approaching; it stays in twenty-one ten through the birth and then jumps to twenty-one twenty-eight with the son nearing eighteen; style targets of roughly seventy percent dialogue and action, technology shown through concrete cues rather than explained, and humor under pressure (`TMB_STORY_RULES.md` 3a, 3b); and the review path for a ChatGPT-drafted block (`outline/WORKFLOW.md`).

**The five specialist agents were describing the pre-reboot story,** including a settlement "behind a shield that keeps its surface doors scale-stable" — the powered fishbowl this decision rules out — and a continuity check against a file that does not exist. Their contradicting lines are fixed and each now defers to `WORLD_RULES.md`. They were not rewritten wholesale.

**Two questions this raises are left to Joshua,** in `WORLD_RULES.md` section 7: Chapter 5 puts full island-scale material right at the pavement line, which a scale gradient starting at the pavement would not; and the timing of the island's own transformation.
**Status:** Accepted, 2026-09-25.
