# TMB-Story

The writing repository for **TMB**, a serialized, audiobook-first sci-fi/fantasy
adventure series: two siblings searching for their missing father across an island
where humans live at insect scale.

- `CLAUDE.md` — how work happens here (read first)
- `architecture/SERIES_ARCHITECTURE.md` — the approved creative authority (Rev 3, working Markdown copy; `SERIES_ARCHITECTURE.docx` beside it is Joshua's original, same text); earlier revisions in `architecture/history/`
- `architecture/DECISIONS.md` — decisions made since Rev 3
- `bible/` — living canon; `bible/STORY_OVERVIEW.md` is the fast reference and `bible/CHAPTER_INDEX.md` the fast lookup
- `outline/` — workflow and Part outlines
- `chapters/` — the chapters, one Markdown file each with YAML frontmatter
- `reviews/` — per-chapter handoff reports
- `docs/` — background reasoning, not canon
- `index.html` + `reader/` — the reader page, served by GitHub Pages from `main`; after adding chapters or outline files run `python3 scripts/build-manifest.py` to refresh `reader/manifest.json`
