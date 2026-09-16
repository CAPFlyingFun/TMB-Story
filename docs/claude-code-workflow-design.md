# TMB — Claude Code Writing Workflow & Repository Design

---

## 1. Reviewing Your Proposed Workflow

A few things worth sharpening, based on how Claude Code subagents actually behave:

- **Subagents start with a completely fresh, empty context every time.** They don't see your conversation history automatically. So "read the complete previous chapter" has to be something the master session does directly, or something it explicitly hands to each specialist in its delegation message — it doesn't happen just because you asked once earlier. That's built into the pipeline below.
- **Drop the idea of a separate set of review agents.** The same five specialists, invoked a second time against the finished draft, cover your whole review checklist except one thing: audiobook readability / prose craft. That's less a domain specialty and more "did the master follow its own style guide" — better as a self-check by the master against CLAUDE.md than a sixth agent (more in §2).
- **One structural addition worth making explicit:** only the master ever gets Write/Edit access to chapter files. Every specialist and reviewer is read-only. This isn't just discipline — it's how "agents shouldn't create conflicting canon" gets satisfied *by construction* rather than by hoping everyone behaves (§5).
- **The concurrent-subagent ceiling is 20 by default** — five parallel specialists isn't close to a real limit, not worth designing around.

---

## 2. Recommended Agent Roles

Five, matching your instinct, reused for both the pre-draft advisory pass and the post-draft review pass:

1. **scene-agent** — the chapter's primary investigation/adventure/survival event: what happens, in what order, what's physically at stake.
2. **character-agent** — interaction, emotional beats, dialogue opportunities, relationship movement, growth.
3. **world-creature-agent** — creature behavior against the bible, scale-state implications, survival logic, settlement texture, chances to make the environment feel alive.
4. **mystery-agent** — tracks the mystery ladder: which questions this chapter can advance, which clues to plant, whether a reveal is due on the question→answer rhythm.
5. **continuity-agent** — compares the proposed chapter against the previous finalized chapter and the chapter index: positions, time, injuries, equipment, knowledge, unresolved actions, active mysteries. This is the one agent I'd give **persistent memory** (`memory: project` in its frontmatter) — Claude Code subagents support a real cross-session memory feature built for exactly this ("builds up knowledge over time... across conversations"), and continuity is the one job here that gets more valuable the longer it accumulates institutional knowledge.

I'd deliberately **not** add a sixth "prose/audio craft" agent, a separate "outline agent," or a "world-building agent" distinct from world-creature-agent. Each would either duplicate something the master already owns (following its own style rules) or duplicate one of the five above. Every agent added costs real context budget and real dispatch latency — five specialists plus one master is already a complete writers' room. Add a sixth only if actual drafting reveals a genuine gap none of the five cover.

---

## 3. TMB-Story Repository Structure

```
TMB-Story/
  CLAUDE.md
  architecture/
    SERIES_ARCHITECTURE.md          (Rev 3, the creative source of truth)
  bible/
    CHARACTERS.md
    CREATURES.md
    LOCATIONS.md
    TECHNOLOGY.md
    MYSTERIES.md                    (the living mystery ladder)
    TIMELINE.md
    CONTINUITY_LOG.md                (heavier audits, every ~10 chapters)
    CHAPTER_INDEX.md                 (single fast-lookup table, see §6)
  outline/
    WORKFLOW.md
    part-01/
      overview.md
      mini-arc-01.md ... mini-arc-05.md
  chapters/
    part-01/
      chapter-001.md
      chapter-002.md
      ...
  reviews/
    chapter-001-review.md
  .claude/
    agents/
      scene-agent.md
      character-agent.md
      world-creature-agent.md
      mystery-agent.md
      continuity-agent.md
    hooks/
      protect-main-chapters.sh
    settings.json
```

Two things worth flagging: no `voices/`, `audio/`, or `reader/` yet — you said don't let production complicate the writing system, and this takes that literally (§9). And `CHAPTER_INDEX.md` is the single most important file for scaling past a few hundred chapters (§6).

---

## 4. Chapter Drafting/Review/Approval Pipeline

1. Master reads the current chapter's outline, the **complete** previous finalized chapter, the next chapter's intended direction (outline-level only), and targeted bible excerpts — pulled via `CHAPTER_INDEX.md`, not a full re-read of prior chapters.
2. Master dispatches all five specialists **in parallel** in one message (this is Claude Code's own documented "run parallel research" pattern), each read-only, each given exactly the context it needs in its delegation prompt.
3. Master synthesizes their input and writes the one canonical draft itself — the only Write call in the whole pipeline so far.
4. Master dispatches the same five specialists again, now reviewing the **completed draft** against their specialty, still read-only.
5. Master makes justified corrections and self-checks the draft against CLAUDE.md's audio-craft rules (word count, POV discipline, ending variety, exposition limits).
6. Master writes a short handoff report (`reviews/chapter-NNN-review.md`): what changed from the outline and why, open questions for you, anything a specialist flagged that wasn't acted on.
7. **Stop. Wait for your approval.** Nothing is canonical yet.
8. On approval: chapter's frontmatter `review_status` flips to `approved`, `CHAPTER_INDEX.md` gets a new row, the chapter's branch merges to `main` (§7).
9. Next chapter begins from that finalized state.

---

## 5. How Agents Avoid Conflicting Canon

Structurally, not socially: specialist and review agents get `tools: Read, Grep, Glob, Bash` with Bash restricted to read-only git commands — no Write, no Edit. There is exactly one place in the entire pipeline with Write access to `chapters/**`: the master session. Nothing can create a second version of canon because nothing but the master can create canon at all. Disagreement between specialists doesn't need a conflict-resolution protocol either — they're not writing anything to reconcile, they're handing opinions to the one entity that decides.

---

## 6. Living Story Bible & Metadata at Scale

**At ~100 chapters:** single bible files are still small enough to read in full each session. Chapter metadata lives as YAML frontmatter at the top of each `chapter-NNN.md` (GitHub renders this as a clean table natively), and `CHAPTER_INDEX.md` is one compact append-only table pulling the key fields from every chapter's frontmatter — this is what lets Claude Code answer "what happened around chapter 60" without opening 60 files.

**At ~500 chapters:** split any bible file that's grown unwieldy — `bible/CHARACTERS.md` becomes `bible/characters/caleb.md`, `nora.md`, etc. once the cast is large enough that one file is a scroll rather than a reference. The `CONTINUITY_LOG.md` heavy audit (every ~10 chapters) is the natural moment to do this kind of housekeeping, the same way it's the natural moment to catch a chapter-72-vs-chapter-614 contradiction.

**At 1,000+ chapters:** roll resolved material into compact summaries rather than letting every file grow forever — a mystery that got fully answered 400 chapters ago doesn't need to stay in the "active" section of `MYSTERIES.md`, it needs one line in a "resolved" archive. Same principle for closed character arcs, retired locations, deprecated tech. The goal at every scale is the same: the files an agent reads *every* chapter should only ever contain what's currently active, with older material compressed into short historical notes rather than deleted or endlessly re-read in full.

---

## 7. Git Branching / Worktree Strategy

**`main` holds only approved chapters and bible updates.** Each chapter drafts on a short-lived branch (`draft/chapter-047`), merged to `main` only after your explicit approval — never automatically. This alone satisfies most of the protection you're asking for.

**Worktrees** are a real, separate Claude Code feature (an isolated checkout for running a session in parallel without it colliding with your main one) — genuinely useful later if you ever want to run a continuity audit in one Claude Code session while actively drafting in another, but not something the core sequential pipeline needs. I'd leave it as an available option rather than part of the initial setup.

---

## 8. Protecting Approved Chapters

Branch protection (§7) is the primary mechanism. As a backstop, I'd add one small `PreToolUse` hook — a real, documented Claude Code feature for exactly this — that blocks any Edit or Write call targeting a `chapters/**/*.md` file whose frontmatter says `review_status: approved` while the session is checked out on `main`. Belt and suspenders: the workflow shouldn't put an agent in that position in the first place, and the hook catches it if something goes wrong anyway.

---

## 9. Audiobook / ElevenLabs & Reader — Light Touch

Reserve the ideas, don't build them: a `voices/VOICE_CAST.md` and `audio/part-01/chapter-001.mp3` pattern is a fine future shape and costs nothing to plan for now, but actually creating those directories and any generation tooling should wait until you're really producing audio. Same for the reader — when it exists, it should consume approved chapters and bible material from `main`, never become a second place the story gets written or rewritten.

---

## 10. Feeding the Future Game

This repository structure already sets the game up cleanly without being designed around it: `bible/CREATURES.md`, `bible/LOCATIONS.md`, `bible/TECHNOLOGY.md`, and character files are exactly the extraction points a future game needs, and they're being maintained as living canon regardless of the game's existence. Nothing here needs to change when serious game development starts after Chapter 50 — it just starts reading from files that already exist.

---

## 11. The Complete Master Prompt

Copy everything in the block below into Claude Code once you've created the `TMB-Story` repository and placed the approved architecture document at `architecture/SERIES_ARCHITECTURE.md`.

```text
You are initializing a new long-term creative writing project repository
called TMB-Story.

CONTEXT
TMB is a serialized, audiobook-first sci-fi/fantasy adventure series about
two siblings searching for their missing father across an island where
humans live at insect scale. The approved creative authority for this
project is architecture/SERIES_ARCHITECTURE.md (TMB Series Architecture,
Revision 3). Read it in full before doing anything else. Nothing you
design should contradict it. If something in this prompt seems to
conflict with it, flag the conflict instead of silently picking one.

YOUR TASK RIGHT NOW
Do NOT write Chapter 1. Do NOT write a Chapters 1-50 outline. Your only
job in this session is to propose, and then (on my go-ahead) build, the
REPOSITORY FOUNDATION: folder structure, CLAUDE.md, the specialist
subagent definitions, the story-bible skeleton, and the chapter metadata
format. When you're done, show me everything and STOP. Wait for my
explicit approval before any further work, including outlining.

STEP 1 - Read and understand
- Read architecture/SERIES_ARCHITECTURE.md in full.
- If a Beyond Extinction repository is accessible to you (a sibling
  directory, or a remote you have access to), inspect ONLY its
  organizational structure - folder layout, file naming, bible format,
  metadata conventions. Do NOT read or reuse its plot, characters,
  world, or content. Report anything genuinely worth borrowing. If it's
  not accessible, skip this and say so.

STEP 2 - Propose the repository foundation
Propose (don't create yet) a structure along these lines, adjusting
anything that doesn't fit what you learn in Step 1:

TMB-Story/
  CLAUDE.md
  architecture/
    SERIES_ARCHITECTURE.md
  bible/
    CHARACTERS.md
    CREATURES.md
    LOCATIONS.md
    TECHNOLOGY.md
    MYSTERIES.md
    TIMELINE.md
    CONTINUITY_LOG.md
    CHAPTER_INDEX.md
  outline/
    WORKFLOW.md
    part-01/
      overview.md
  chapters/
    part-01/
  reviews/
  .claude/
    agents/
    hooks/
    settings.json

Do not create voices/, audio/, or reader/ directories yet - those come
later, once audio production and a reader tool are actually being built.

STEP 3 - Write CLAUDE.md
Create CLAUDE.md at the repo root containing:
- A short project description and a pointer to
  architecture/SERIES_ARCHITECTURE.md as the creative source of truth
- Audiobook writing rules: 1,800-3,000 word chapters, about 2,200 on average (decision 0010; was 1,800-2,500 with target
  2,100-2,300; never pad or cut a good chapter to hit a number), past
  tense, close third person, one POV per chapter, one to three scenes,
  dialogue/action-forward prose, distinct character voices without
  relying on repetitive dialogue tags, minimal profanity, real but
  restrained violence (no graphic anatomical description), understated
  romance, controlled exposition (roughly 150-200 words is the ceiling
  for unbroken exposition before returning to scene), and rotating
  chapter-ending styles (never two of the same type back to back)
- The mystery rhythm: question -> clue -> investigation -> answer ->
  bigger question, roughly every 5-15 chapters
- A summary of the chapter workflow, pointing to outline/WORKFLOW.md
  for the full version
- The canon protection rule: a chapter file whose frontmatter says
  review_status: approved must never be silently rewritten. Any change
  to an approved chapter requires an explicit instruction from me and
  should be flagged, not made quietly
- A pointer to CHAPTER_INDEX.md as the fast-lookup mechanism, so you
  never need to re-read every prior chapter to get oriented

STEP 4 - Create the specialist subagents
Create these five subagents in .claude/agents/, each read-only (tools:
Read, Grep, Glob, Bash, with Bash restricted to read-only git commands
via a PreToolUse hook or disallowedTools), each with a tightly scoped
description and system prompt:

1. scene-agent - develops the chapter's primary investigation, adventure,
   or survival event: what happens, in what order, what's physically
   at stake.
2. character-agent - develops character interaction, emotional beats,
   dialogue opportunities, relationship movement, and growth.
3. world-creature-agent - checks creature behavior against
   bible/CREATURES.md, scale-state implications, survival logic, and
   settlement/world texture; looks for chances to make the environment
   feel alive.
4. mystery-agent - tracks bible/MYSTERIES.md: which questions this
   chapter can advance, which clues to plant, whether a reveal is due
   on the question-to-answer rhythm.
5. continuity-agent - compares the proposed chapter against the previous
   finalized chapter and CHAPTER_INDEX.md: positions, time, injuries,
   equipment, knowledge, unresolved actions, active mysteries. Give this
   one memory: project in its frontmatter so it accumulates continuity
   knowledge across the whole series instead of re-deriving it every
   chapter.

These same five agents are reused for the post-draft review pass - do
not create a second set of review-specific agents.

STEP 5 - Establish the chapter metadata format
Design a YAML frontmatter block for chapter files (embedded at the top
of each chapter-NNN.md) covering: chapter number, title, part, POV,
word count, story date/time, locations, characters present, creatures
present, injuries/status changes, mysteries introduced/advanced/
answered, important new canon, review status (draft / in-review /
approved), and audio status (not-started / recorded / published).
Propose the exact schema and show me an example with placeholder values.

Also design CHAPTER_INDEX.md as a single compact, append-only table
(one row per chapter, drawn from the frontmatter fields above) so that
finding "what happened around chapter 340" never requires opening 340
files.

STEP 6 - Propose the chapter workflow document
Write outline/WORKFLOW.md describing, step by step, how a chapter gets
drafted: read outline + previous full chapter + next chapter's
direction + targeted bible excerpts -> dispatch the five specialist
agents in parallel for advisory input -> you (the main session) write
the one canonical draft yourself -> dispatch the same five agents again
to review the completed draft -> you make justified corrections and
self-check against CLAUDE.md's audio-craft rules -> you write a short
handoff report -> STOP and wait for my approval -> only on approval does
the chapter's review_status become approved and CHAPTER_INDEX.md get
updated.

STEP 7 - Propose the Git approach
Recommend: main holds only approved chapters and bible updates. Each
chapter drafts on a short-lived branch (e.g. draft/chapter-047), merged
to main only after I approve it. Add a small PreToolUse hook
(.claude/hooks/protect-main-chapters.sh) that blocks Edit/Write on any
chapters/**/*.md file whose frontmatter says review_status: approved
while checked out on main, as a backstop against accidental rewrites.
Mention, but don't set up yet, that git worktrees are available later
if I want to run a side Claude Code session (e.g. a continuity audit)
at the same time as active chapter drafting.

STEP 8 - Show me everything
Before creating a single file, show me: the full proposed folder tree,
the full text of CLAUDE.md, all five subagent files, the metadata YAML
schema with an example, and the WORKFLOW.md draft. Wait for my explicit
approval. Only after I approve should you actually create these files
in the repository.

Do not draft Chapter 1. Do not build the Chapters 1-50 outline. Stop
after Step 8 and wait for me.
```
