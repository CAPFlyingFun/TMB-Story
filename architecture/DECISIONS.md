# Decisions Log

Creative and workflow decisions made AFTER Series Architecture Rev 3, one dated entry
each, append-only. **Decide once, never re-argue.** A new session reads this to inherit
calls already made. If a decision changes, add a new entry that supersedes it and
mark the old one superseded; never rewrite an entry. Format: Context → Decision →
Consequences → Status. Anything here outranks the bible file it changes until that
file is updated.

## Index

- 0001 — Chapter length 1,800–2,500 (target 2,100–2,300) supersedes Rev 1 §12's 1,600–1,800 — **Accepted (Joshua, 2026-09-16)**
- 0002 — Four-digit chapter numbering (`chapter-0001.md`) — **Accepted with the foundation build (2026-09-16)**
- 0003 — `main` is the only branch; protection via frontmatter + hook, not branching — **Accepted (Joshua, 2026-09-16)**
- 0004 — Future reader: GitHub Pages serves from `main`; visual theme follows Portrait-Lifesyle-Prompt-Studio — **Accepted (Joshua, 2026-09-16), not yet built**

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
