# Movement 3 (Chapters 7 to 9) — import handoff, 2026-10-01

Joshua's manuscript, not a draft: imported verbatim from
`ba62e566-07-09_Chapters - TRADDOMIUM Micro Battle.docx` ("Here is Chapter's 7-9 to add
to story"). One report for the three, because nothing here was written by us; the
per-chapter convention in `reviews/README.md` is for drafts.

## What was changed

Only the audio tags, as with his two earlier documents (Decision 0024): twenty-one
paragraphs of the exact shape `"...," Name said.` lose the tag — eight in Chapter 7,
nine in Chapter 8, four in Chapter 9. Every tag that carries anything else stays:
"Lena said, not looking up from the checkout names", "Mark said, following the beam",
"he said quietly". No quote was split by a beat, so nothing was joined. Each chapter's
`source:` line records the count.

`review_status: in-review` until his audio pass (`outline/WORKFLOW.md` step 7); the
`CHAPTER_INDEX.md` rows and the story-rules updates wait for his approval.

## Audio readiness

- Parsed and validated, 305 segments. With the bare tags gone the parser fell back on
  alternation and read 39 lines as the wrong person — Lena's "So do horses" as Sarah,
  Mark's "Somebody want to catch me up?" as Jack, Aiden's "That's not an answer!" as
  Sarah. Each is pinned in `audio/speaker-overrides.json` and was checked against the
  manuscript WITH its tags. All three chapters validate.
- **Aiden is new** (Chapter 9, the greenhouse, "a man's voice, breathless") and is in
  `story-rules/voice-registry.json` with no voice. His three lines wait for Joshua to
  choose one; the rest of Chapter 9 is ready.
- Two judgement calls with no tag in the manuscript, for Joshua's ear: Chapter 7's
  "That's not comforting." is read as Jack (Sarah's reply, "I didn't say it to comfort
  you", sounds aimed at him), and Chapter 8's "Understood." after Sarah's
  ten-minutes-and-check-in-every-two is read as Mark.

## For Joshua — noticed, not changed

1. **Chapter 7's head count.** Sarah: "We can't keep running this with four people and
   one extremely patient doctor." Mark: "Five. You're forgetting me." The room holds
   Jack, Sarah, Lena and Mark — four with him — so his correction implies Sarah's four
   did not include him. Possibly intended as Sarah counting someone else (Doctor
   Mercer's staff?); worth a listen.
2. **"Beyond the true boundary of the island"** (Chapter 8, the bird). The island's own
   scale is HIDDEN in `WORLD_RULES.md`. Read as "past the shoreline" it is harmless; read
   as a hint that the island has a boundary of its own, it leans toward a hidden item.
   Left as written.
3. **The community center** (Chapter 8) agrees with Chapter 6, where Lena says "You were
   both at the community center" of the planning meeting. Consistent.
4. `scripts/style-check.py` flags "cross-referenced" (cross, angry), "properly" and
   "half past three" as British. All three are natural US English here; no change.

## Specialist review

Not run. The five agents in `.claude/agents/` review OUR drafts; Chapters 4 to 6 came in
the same way as these and were not put through them either.
