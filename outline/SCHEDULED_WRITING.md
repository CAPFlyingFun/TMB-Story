# Weekly scheduled writing — TMB-Story

**Joshua, 2026-10-06.** The weekly rhythm: **Monday** ChatGPT reviews the manuscript and
plans the next events · **Tuesday** Claude writes · **rest of the week** Joshua reads,
listens, revises and approves. One writing run a week, on **Tuesday** (10:58 AM Central). The week in between is for
Joshua's reading, listening, revisions, audio generation and approvals. Joshua plans the
story events with ChatGPT and keeps them on Trello; Claude writes. This file is what the
weekly scheduled task follows. Edit this file to change the rules; the task reads it fresh
every week. It replaces the daily three-chapter workflow of decision 0029.

TMB-Story (`CAPFlyingFun/TMB-Story`) is the STORY repository. TRADDOMIUM is the separate
game: never put story writing there.

## 1. Before writing

1. Read `CLAUDE.md`, `story-rules/TMB_STORY_RULES.md`, `story-rules/STORY_OVERVIEW.md`,
   `story-rules/WORLD_RULES.md`, `story-rules/OPEN_QUESTIONS.md`, the newest
   `architecture/DECISIONS.md` entries, and the latest `outline/movement-NN/overview.md`
   (including any pacing note).
2. **Check for Joshua's changes since the last run** (`git log`, the chapter files, the
   `reviews/` folder, Trello comments). His newest edits win. Never restore an older AI
   draft over them. If he changed a pending chapter, check whether later pending chapters
   are affected and fix or flag them.
3. Read the previous chapter in full and the last three at least.
4. **Read ChatGPT's Monday handoff first:** the Trello card
   **"🧭 Weekly ChatGPT → Claude Handoff"** in the list **🔎 STORY EVENTS — ChatGPT
   Reviewed** (https://trello.com/c/89ui5937), its description and newest comments. Every
   Monday ChatGPT reads the current TMB-Story manuscript, reconciles Trello with it, and
   updates that card with the date, manuscript state, event progress, continuity and
   consequence notes, approval states, unresolved threads, the recommended next one or two
   event directions, and any Trello changes it made. **Then verify it against the newest
   manuscript and Joshua's edits.** It is planning and coordination, not canon and not
   approval: follow its event direction, but the manuscript, Joshua's newest edits and
   approved canon always win, and it never sets how many chapters an event takes. Flag any
   conflict in the report. If the card was not updated since the last Tuesday run, carry on
   from Trello and the latest pacing note, and say so in the report.
5. Read the Trello board **"TRADDOMIUM: Micro Battle! - Typescript"**, lists
   🧭 STORY EVENTS — Upcoming, ✍️ STORY EVENTS — Writing, ✅ STORY EVENTS — Complete
   (= WRITING complete, not approved). Trello is the event plan; the Master Event Roadmap
   is the background. Neither is canon until written and approved.

## 2. How much to write

- **Target: one or two story events, which normally comes to 3 to 6 chapters.**
- Events decide pacing. Never compress an event to finish it, never pad one to fill a
  quota. If an event naturally needs more than six chapters, stop at six on a natural
  break and continue next week.
- **Minimum three chapters, maximum six.**
- **If nine or more chapters are already waiting for Joshua's review, write only three
  this week,** and say so in the report. The point of the weekly gap is that reviews keep
  up with writing.
- Respect the current pacing note in the latest movement overview (as of 2026-10-06:
  finish B2, then B3 the Water Clock; let Phase Two simmer; advance existing threads
  rather than adding new ones).

## 3. Writing rules (all in `story-rules/TMB_STORY_RULES.md`; the essentials)

- Audiobook-first, close third person, past tense, natural US English, dialogue-heavy,
  about 1,200 to 1,800 words a chapter, spoken numbers written as they are said.
- **DIALOGUE ATTRIBUTION RULE (8a):** no tags whose only job is naming the speaker. Keep
  every action, emotion, meaningful tone, pause, location and environmental detail. A
  line's beat comes BEFORE it, and one speaker's line stays one unbroken quote. Never
  invent actions just to break up dialogue.
- Continuity first: each chapter resumes the previous one's exact momentum. Hooks grow
  out of the story; no fake cliffhangers.
- Track consequences: injuries, water, power, equipment, creatures, relationships,
  Sarah's pregnancy, TOMBS clues.
- Creature relationships develop slowly (observation → non-hostile interaction →
  recognition → trust → … ). TRACKS Academy is far in the future; never introduce it early.
- Never reveal or hint at anything marked [HIDDEN] in `WORLD_RULES.md`, and never settle
  Phase One / Phase Two meaning unless Joshua has.

## 4. After writing, every chapter

1. `chapters/movement-NN/chapter-NNNN.md`, frontmatter per `chapters/CHAPTER_TEMPLATE.md`,
   `review_status: in-review`, `audio_status: not-started`.
2. `python3 scripts/style-check.py` on each chapter.
3. **Speaker data:** run `python3 scripts/audio.py parse --chapters <new>` and then
   `validate --show-review`. Read the speaker of EVERY dialogue line against the scene;
   the parser's alternation guesses wrong in fast exchanges. Pin every wrong or unresolved
   line in `audio/speaker-overrides.json` (scoped to its chapter). A new speaking character
   goes in `story-rules/voice-registry.json` with `elevenLabsVoiceId: null`.
4. `python3 scripts/build-manifest.py` so the Story tab shows the new chapters, with the
   portrait-and-name speaker tags.
5. Run the audio tests: `python3 scripts/tests/test_audio.py` (install `audioop-lts` with
   pip if `audioop` is missing). They must pass.

## 5. Word documents

- At most **three chapters per Word document**. 4 to 6 chapters → two documents.
- Name them like Joshua's: `13-15 Chapters - TRADDOMIUM Micro Battle.docx`.
- Build them on Joshua's own template (the existing files in `manuscripts/`), title
  paragraph, `Chapters 13-15`, a status line `🟡 PENDING APPROVAL`, then `Heading 1`
  chapter titles and the prose.
- Save them in `manuscripts/` and send them to Joshua.

## 6. Approval and audio (decision 0031: three separate layers)

- **Only Joshua approves.** Writing, posting, Trello moves, ChatGPT reviews and Claude's
  own checks are never approval.
- Every new chapter is 🟡 pending. Never change any chapter's approval state.
- **Do NOT generate audio in the weekly writing run.** Audio is generated between runs
  when Joshua asks (it uses his ElevenLabs credits). Generated audio is pending Joshua's
  audio review until he says otherwise.
- The portrait + speaker-name presentation is approved as the standard; it approves no
  text or audio.

## 7. Trello

Move or create event cards: an event being written goes to ✍️ Writing; an event whose
writing is finished goes to ✅ Complete with "(WRITING COMPLETE · 🟡 pending approval)" in
its name. On each card record: chapters written, Word file, a short summary, canon
candidates, injuries, creature interactions, resource and infrastructure changes, TOMBS
clues, pregnancy developments, unresolved threads, the exact ending situation, and the
momentum for the next chapter.

## 8. Commit and report

1. Write `outline/movement-NN/overview.md` (or extend it) and a handoff in
   `reviews/movement-NN/`.
2. Commit to `main` with a clear message, then `git fetch origin main && git rebase
   origin/main` before `git push` (an audio workflow may have committed in between).
3. Report to Joshua in this shape:

```
DOCUMENTS: 13-15 Chapters - TRADDOMIUM Micro Battle.docx (+ second file if any)
CHAPTERS WRITTEN: 13, 14, 15
TMB-STORY: where posted · STORY TAB: updated
EVENTS: B2 — completed · B3 — started
APPROVAL STATUS: Chapters 13-15 — 🟡 PENDING APPROVAL
AUDIO STATUS: NOT GENERATED — ask when you want it for your listening review
SPEAKER DATA: N lines pinned; new speakers without voices: …
MAJOR DEVELOPMENTS / CANON CANDIDATES / UNRESOLVED THREADS
NEXT CHAPTER START: exactly where and how the next chapter picks up
NEEDS JOSHUA: anything that needs his decision (conflicts, new characters, voices)
```
