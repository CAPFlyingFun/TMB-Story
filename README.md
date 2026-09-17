# TMB-Story

> **REBOOTED 2026-09-17.** The story now opens with the TOMBS catastrophe in Chapters
> 1 to 3: Jack and Sarah Bennett, March fifth in the year twenty-one ten, a research
> settlement reduced to insect scale while the island around it stays the same size.
> Everything under `archive/pre-reboot/` belongs to a different, superseded story and
> is **not canon**. See `archive/pre-reboot/README.md`.

The writing repository for **TRADDOMIUM: Micro Battle!**, a serialized,
audiobook-first science fiction story. A research settlement on a remote Atlantic
island is reduced to insect scale by its own experimental system, and the people
inside it have to live there.

- `CLAUDE.md` — how work happens here (read first)
- `chapters/` — the manuscript, one Markdown file per chapter with YAML frontmatter.
  Chapters 1 to 3 were imported verbatim from Joshua's approved Word document.
- `story-rules/` — the writing rules and living canon (formerly `bible/`, renamed
  2026-09-17). `story-rules/TMB_STORY_RULES.md` is the rules,
  `story-rules/STORY_OVERVIEW.md` the fast reference and
  `story-rules/CHAPTER_INDEX.md` the fast lookup.
- `architecture/DECISIONS.md` — dated decisions, append-only
- `outline/` — the workflow and one record per three-chapter movement
- `reviews/` — per-chapter handoff reports
- `scripts/` — `build-manifest.py` for the reader, `style-check.py` for the prose
- `docs/` — background reasoning, not canon, and superseded in places
- `archive/pre-reboot/` — the superseded story and its planning. **Not canon.**
- `index.html` + `reader/` — the reader page, served by GitHub Pages from `main`; after adding chapters or outline files run `python3 scripts/build-manifest.py` to refresh `reader/manifest.json`
