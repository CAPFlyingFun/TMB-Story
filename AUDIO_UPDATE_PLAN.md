# Audio Update Plan: Chapters 4–6 Revision

**Date:** 2026-09-21  
**Status:** Ready for audio regeneration  
**Updated chapters:** 4, 5, 6

## Summary of Changes

The three chapters have been revised to improve pacing and refocus story structure. All character voices and voice assignments remain unchanged.

| Chapter | Change Type | Impact | Reusable Content |
|---------|------------|--------|-----------------|
| **4: The First Calls** | Major restructure | Doctor Mercer hospital call removed; ~296 fewer words | ~65% |
| **5: The Edge** | Rewrite opening + dialogue | Starts "Around midnight..." instead of "two in the morning"; Jack-Sarah cooperative planning | ~61% |
| **6: Someone Knew** | Significant expansion | Mercer call moved here; scale analysis expanded; ~385 more words | ~99% |

---

## Chapter-by-Chapter Audio Strategy

### Chapter 4: The First Calls (1,214 words)

**Key Changes:**
- ✗ Doctor Mercer hospital call removed entirely (was paragraphs 32–60 of original)
- ✓ Utility control call (Lena) fully preserved
- ✓ Security channel report preserved
- ✓ Infrastructure boundary analysis preserved
- ✓ Ending on shadow/vibrations preserved

**Audio Regeneration Needed:**
- Regenerate full chapter with the Mercer material removed
- Characters: Jack (narrator POV), Sarah, Lena (remote), Security Officer Unit Twelve (remote)
- Estimated time: 8–10 minutes of audio

**Clips That Can Be Reused:**
- Utility station call (Lena's responses about grid status, water estimate)
- Security officer's boundary report
- Jack-Sarah dialogue about the settlement asleep
- Closing line about the shadow

**New Clips Needed:**
- None for new content; only removal, so re-record without the Mercer section

---

### Chapter 5: The Edge (1,856 words)

**Key Changes:**
- ✓ Opening completely rewritten: "Around midnight, most of the settlement was still asleep" (was "Two in the morning...")
- ✗ Removed: widespread settlement waking, families calling, public announcement
- ✓ New: Jack-Sarah cooperative dialogue ("Jack blinked. 'Really?'")
- ✓ New: "Keep safe" / "Both of us" exchange
- ✓ Preserved: Outdoor journey, boundary sequence (pavement end, grass, water droplet, fingernail, creature appearance)

**Audio Regeneration Needed:**
- Regenerate full chapter with new opening and restructured pacing
- Characters: Jack (narrator POV), Sarah, Lena (remote via terminal), Security Officer (optional presence)
- Estimated time: 14–16 minutes of audio

**Clips That Can Be Reused:**
- Boundary sequence descriptions (grass, soil, water droplet, fingernail, thin legs moving)
- Environmental descriptions of the outdoor landscape
- Jack's internal observations about what he's seeing

**New Clips Needed:**
- Jack-Sarah dialogue: "I need to go outside" / "No"
- Sarah: "Okay. You can go" / Jack: "Really?"
- "Keep safe" exchange and follow-up
- Opening scene: "Around midnight..." + settlement observation
- Lena's banter about water estimates

---

### Chapter 6: Someone Knew (2,106 words)

**Key Changes:**
- ✓ Opening preserved: Jack returns to lab, Sarah checks him
- ✓ New: Lena's arrival and her response to the outer findings
- ✓ New: Doctor Mercer call moved here (from Chapter 4)
- ✓ Preserved: Scale calculation, boundary analysis, three-week-old file discovery
- ✓ Preserved: Ending on "It had gone exactly the way someone planned"

**Audio Regeneration Needed:**
- Regenerate full chapter incorporating the Mercer call and expanded analysis
- Characters: Jack (narrator POV), Sarah, Lena, Doctor Mercer (remote call)
- Estimated time: 16–18 minutes of audio

**Clips That Can Be Reused:**
- Jack-Sarah opening reunion dialogue ("Still attached" / Sarah checks him)
- Lena's arrival and systems monitoring
- Scale calculation discussion
- Boundary analysis and infrastructure review
- File discovery and "PHASE ONE READY" revelation
- Closing line: "It had gone exactly the way someone planned"

**New Clips Needed:**
- Doctor Mercer call (complete dialogue from Chapter 4 Mercer section)
  - Mercer: "Did your lab cause that vibration?"
  - Mercer: "Then why am I looking at grass taller than the medical center?"
  - Jack: "The town got smaller."
  - Mercer: "That was not better."
  - Mercer's instructions to medical staff

---

## Audio File Organization

### Current Audio Status

**Existing Exports:**
- `/audio/exports/chapter-04.mp3` — current version (includes Mercer call)
- `/audio/exports/chapter-04-drama.mp3` — current version
- `/audio/exports/chapter-05.mp3` — current version (old opening/pacing)
- `/audio/exports/chapter-05-drama.mp3` — current version
- `/audio/exports/chapter-06.mp3` — current version (without Mercer call)
- `/audio/exports/chapter-06-drama.mp3` — current version

**Individual Clips:**
- Narrator: 100+ clips across all chapters
- Jack: 25+ clips
- Sarah: 20+ clips
- Lena: 6+ clips
- Doctor Mercer: Need to verify if existing clips can be reused
- Security Officer: 1 clip
- System: 1 clip

### Orphaned Clips

Files in `/audio/clips/_orphaned/narrator/` and `/audio/clips/_orphaned/sarah/` may contain discarded audio from earlier edits. Do not delete yet—keep for potential rollback.

---

## Regeneration Strategy

### Phase 1: Identify Reusable Clips
- Match each reusable paragraph/dialogue sequence against existing clips
- Verify voice consistency (Jack Bennett, Sarah Bennett, Lena Ortiz, Doctor Mercer remain unchanged)
- Document which clips can be reused in cue sheets

### Phase 2: Generate New Audio
- Use ElevenLabs API with existing voice IDs (NOT committed to repo)
- Generate missing clips for:
  - Chapter 4: Complete regeneration without Mercer section
  - Chapter 5: New opening, Jack-Sarah cooperative dialogue, new scenes
  - Chapter 6: Mercer call dialogue, expanded analysis sections
- Maintain consistent narrator voice across all three chapters

### Phase 3: Assemble Chapters
- Update cue sheets (`CHAPTER_04_CUE_SHEET.md`, etc.) to map new clips to paragraphs
- Assemble master audio files for each chapter
- Update manifests (`audio/manifests/chapter-0X.json`) with clip listings
- Export both standard and "drama" versions (music + SFX variants)

### Phase 4: Testing
- Listen to each chapter in sequence (Chapters 3→4→5→6)
- Verify pacing, speaker clarity, and continuity
- Check for audio level consistency
- Confirm no API keys are exposed in any committed files

---

## Important Constraints

⚠️ **Security:**
- ElevenLabs API key must NEVER be committed to git
- Key is for API calls only—never hardcode in browser-facing code
- Store in environment variables or secure config

⚠️ **Content:**
- Do NOT regenerate Chapters 1–3 (already approved and locked)
- Do NOT modify existing character voice IDs
- Do NOT delete audio files until testing confirms revision is solid
- Keep orphaned clips for rollback

⚠️ **Process:**
- Audio generation cannot be automated here—requires secure ElevenLabs access
- This plan maps what needs to happen; implementation requires separate credentials
- Do not commit audio files to git (they belong in `/audio/exports/` with .gitignore rules)

---

## Next Steps

1. ✓ Chapter markdown files updated with new content
2. ✓ Word counts and source notes updated
3. ✓ Audio status set to "pending"
4. → **Awaiting:** Audio regeneration via ElevenLabs (requires secure API access)
5. → **Then:** Cue sheet updates, manifest regeneration, final assembly

