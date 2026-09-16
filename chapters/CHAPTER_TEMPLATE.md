---
chapter: 0                 # integer; matches the file name chapter-NNNN.md
title: ""
part: 1                    # integer Part number
mini_arc: 1                # integer; Part One uses 1–5, later Parts as outlined
pov: ""                    # exactly one name from bible/CHARACTERS.md
word_count: 0              # real count of the prose only, after final corrections
story_time:
  clock: outside           # outside | island  (which clock this chapter is lived on)
  date: ""                 # story-calendar date on that clock, e.g. "Day 3" or "2026-03-14"
  opens: ""                # time of day the chapter opens, e.g. "late afternoon"
  elapsed: ""              # time the chapter covers, e.g. "about two hours"
objective: ""              # what the POV character is trying to accomplish, one line
locations: []              # names as written in bible/LOCATIONS.md
characters: []             # everyone present on the page, POV first
creatures: []              # species (and individual name if bonded), as in bible/CREATURES.md
status_changes: []         # injuries, healing, equipment gained/lost, knowledge gained, e.g. "Nora: sprained left wrist"
mysteries:
  introduced: []           # ids from bible/MYSTERIES.md, e.g. [M29]
  advanced: []
  answered: []
new_canon: []              # facts established here that did not exist before, one line each
playable_beat_flow: []     # what the future player could DO here, in order, e.g. ["cross the bar", "carry gear", "investigate the ants"]
ending_type: ""            # one of the rotating types in CLAUDE.md; must differ from the previous chapter
review_status: draft       # draft | in-review | approved
audio_status: not-started  # not-started | recorded | published
approved_on: ""            # YYYY-MM-DD, set only when review_status becomes approved
---

# Chapter 0 — Title

(Prose begins here. No headings inside the chapter. No `***` scene breaks: time
passing is spoken in the prose, "An hour later, at the spit" (decision 0009). The
last lines hook the next chapter's plan without revealing early.)
