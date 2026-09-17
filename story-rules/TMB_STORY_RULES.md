# TMB Story Rules

The writing, canon and style reference for TRADDOMIUM: Micro Battle!

This file was called the "story bible" until 2026-09-17. Joshua renamed it because
people unfamiliar with the publishing term reasonably wondered what the story had to
do with the Bible. Nothing. The name is now plain (decision 0019).

## Where the truth lives

1. **Joshua's newest explicit instruction.**
2. **The approved audiobook manuscript in `chapters/`.** It is the canonical story.
   Chapters 1 to 3 were imported verbatim from Joshua's approved Word document on
   2026-09-17 and are not edited without his instruction for that chapter.
3. **This file and the rest of `story-rules/`** — canon as the manuscript establishes
   it, plus the craft rules below.
4. **`architecture/DECISIONS.md`** — dated decisions, append-only. A decision
   outranks the file it changes until that file is updated to match.
5. **Post-reboot planning documents.**
6. **`archive/pre-reboot/`** — HISTORICAL AND NON-CANON. See its README before
   reading a single line of it.

If two sources disagree, do not invent a compromise. Name the conflict, follow the
newer source, and flag it.

## The story, as of the reboot

The catastrophe happens immediately. It is not fifty chapters away.

- **Chapters 1 to 3** cover the TOMBS catastrophe, on one night. The Alarm, The
  Boundary, The Activation. By the end of Chapter 3 the story is already in the
  miniature setting.
- **Chapters 4 to 6** will cover the immediate aftermath: survival, community
  response, adaptation, consequences. Not yet written. Do not draft them unasked.
- **Later,** after the aftermath is established, the story makes a jump of about
  eighteen years.
- **After the jump,** Jack and Sarah's son is about eighteen and becomes the primary
  protagonist. He was born after the catastrophe and has never experienced normal
  human scale. The academy and survival-training material belongs here, after the
  jump, and nowhere earlier.

## Audiobook-first writing

The prose is heard, not seen. The listener has no quotation marks, no paragraph
breaks, no character portraits, no subtitles and no game screen.

1. **Audiobook-first.** The manuscript is written to be narrated. Clarity to the ear
   outranks anything that only works on the page.
2. **Close third person, past tense, natural US English.** Spelling and idiom both.
3. **Dialogue-heavy, with physical action mixed into the narration.** Avoid long
   descriptive passages.
4. **Speaker identity must be understandable by ear.** The listener has to know who
   is speaking without seeing the text.
5. **The two-turn anchor guideline.** After roughly two unanchored dialogue turns,
   identify a speaker again, using an action beat, a reaction, a name, or a natural
   dialogue tag. Do not let a two-person conversation run long enough for the
   listener to lose the thread.
6. **Prefer a meaningful physical action over a repeated tag** when an action
   naturally exists. A plain tag is perfectly acceptable when it is needed for
   clarity. Do not invent gestures to avoid the word "said".
7. **With three or more speakers, identify speakers more often.**
8. **No ambiguous standalone name exchanges.** "Sarah." / "Jack." on their own is out
   unless the surrounding narration makes the speaker unmistakable by ear alone.
9. **System and computer readouts are story content, not headings.** A line such as
   "Warning. unauthorized system access." is spoken in the audiobook. It flows into
   the prose in the same paragraph as the reaction it causes:

   > "Warning. unauthorized system access." Jack jerked awake so quickly that his
   > chair rolled backward and nearly struck another workstation. "What? Okay, I'm
   > awake."

   Never set one as a heading, a section title or a mini-title.
10. **Spoken numbers are written the way they are pronounced.** "March fifth, in the
    year twenty-one ten." "Fourteen megawatts." "Thirty-two weeks." "Nearly five
    hundred people." "Fifty-six kilometers across, about thirty-five miles." Arabic
    numerals may still appear later in non-spoken game interface and technical
    displays; they do not appear in narrated prose.

### The observed system-message style

The approved manuscript renders machine output in sentence case, and it renders the
system's own label for the project as "Tombs" rather than "TOMBS" inside a readout,
while the prose says "TOMBS" and "the TOMBS Array". Both instances of "Warning."
are followed by a lower-case word. This is consistent across all sixteen readouts in
Chapters 1 to 3, so it is treated as the manuscript's deliberate machine voice and
was preserved on import. If Joshua wants it normalized, that is a decision.

## Length

- Normal chapter target: about 1,200 to 1,400 words.
- Normal minimum: about 1,000 words.
- An important chapter may reach about 1,600 to 1,800 words when the story needs the
  space.
- Never add filler to reach a count, and never cut useful material to stay under one.
- Record the real count in the frontmatter.

Chapters 1 to 3 as approved run 1,160, 1,083 and 1,384 words.

## How we work now

We develop the story about three connected chapters at a time, as one movement.

1. Write roughly three connected chapters as one story movement.
2. Find the natural chapter endings and cliffhangers within it.
3. Test the result through ElevenLabs as audio.
4. Revise anything that is confusing when heard.
5. Only then continue to the next three-chapter group.

There is no chapter-by-chapter outline running fifty chapters ahead any more, and one
should not be invented. The old one is archived and non-canon.

## Game adaptation

The audiobook is the canonical master story. The game adapts it; the story never
bends to the game.

- About ninety percent of spoken dialogue should be reusable later as game voice
  lines. Write dialogue that a character could say in the game as written.
- Physical narration should favor actions that could naturally become player
  interactions, animations, environmental actions or cutscene directions.
- Example of the relationship:

  > **Audiobook:** Jack pulled up the power diagnostic. "The array shouldn't even
  > have power."
  >
  > **Game:** `[PLAYER: Open Power Diagnostic]` then JACK: "The array shouldn't even
  > have power."

- Chapters are NOT written in game-script format. Each chapter's frontmatter carries
  a compact `playable_beat_flow` recording what a player could do during that part of
  the canonical story.
- Never manufacture an action because there will be a game.

## Voice production

The audiobook manuscript is canonical, and dialogue is written with later game reuse in
mind. The pipeline that turns the manuscript into audio is documented in
`docs/AUDIO_PIPELINE.md`. The rules that matter to writing:

- **The manuscript comes first and is never rewritten to suit the tooling.** If the
  parser cannot tell who is speaking, it flags the line for review. It does not guess,
  and nothing edits the prose to make parsing easier.
- **Character voice assignments live in `story-rules/voice-registry.json`,** beside the
  prose canon in `CHARACTERS.md` rather than duplicating it. Currently assigned:
  Jack Bennett `mkT7KpSQR9btjx2rHpQY`, Sarah Bennett `MClEFoImJXBTgLwdLI5n`. The
  Narrator, the TOMBS system voice and Lena Ortiz are **unassigned**; generation refuses
  to run for an unassigned speaker rather than substituting a voice.
- **ElevenLabs voice IDs are not secrets** and belong in the repository. **The ElevenLabs
  API key IS a secret**: environment only, never committed, never in the player, never
  in a manifest. The browser player never calls ElevenLabs.
- **Generated audio is cached and reused.** Unchanged audio is never regenerated. Editing
  one line regenerates that line only.
- **The audiobook and the game share the same character dialogue assets.** One generated
  Jack line exists once and is referenced by both.
- **Narration is audiobook-only.** It is excluded from the game dialogue export.
- **System and computer lines may be reused in the game,** because TOMBS speaks in both.
- **Audio manifests identify speakers explicitly.** Narration and dialogue are separate
  segments even inside one paragraph, so a character's line stands alone as an asset.
- **Ambiguous attribution is reviewed before generation,** not after. Validation reports
  it and blocks the run.

This is also why the craft rules below matter mechanically and not just aesthetically: a
line that a listener can attribute is a line the parser can attribute, and a line the
parser can attribute becomes a reusable game asset.

## Craft invariants carried through the reboot

These survived the reboot because they are about the ear, not the plot.

- **Voice follows the mood.** Light and plain where the story is light, fuller and
  slower where it is serious. Humor comes from the relationships.
- **Complete sentences,** except where a fragment is the joke, an interruption, or a
  trailing off. A beat fragment of a few words that is a whole image is fine; a
  clause fragment with the verb missing is not.
- **No accidental verse.** Prose should not rhyme, chime or fall into a sing-song
  cadence unless the moment needs it.
- **Time passing is spoken,** not marked with asterisks or a blank gap.
- **Chapter endings hook the next chapter** without revealing it early, and the
  ending types rotate.
