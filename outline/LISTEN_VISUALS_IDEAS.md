# Listen tab visuals: ideas being planned (Joshua, 2026-11-07)

Not built yet; recorded so the planning carries over. The PocketFM-style player is built.
Its picture area, today a chapter cover, is where these go.

## The lab, live
- **Stage.** The procedural TOMBS lab (`tombs-lab/`), built from the approved Draft C blueprint in metres. Roof off, North up.
- **Tracker layer.** For each character:
  - a coloured ring;
  - a wedge for which way they're facing;
  - a glow while they speak;
  - a fading footprint trail.
- **Room labels** fade in.
- **Overhead story camera.** Moves are tied to lines, so the v4 audio index times them. Chapter 1:
  - tight on Jack's lab;
  - widen to the north wing when he calls Sarah on the intercom;
  - follow Sarah along the corridor;
  - settle on both in Jack's lab.
- **Security cameras ("spy movie").** Fixed cameras around the lab, cut between in step with the audio. For example:
  - Jack's lab cam 1 and cam 2;
  - Sarah's office cam during the intercom call;
  - the hallway cam once she says she's on her way and gets up.
- **Hybrid.** Security-cam cuts, overhead tracker shots and orbit / cinematic moves, chosen per beat.
- **Free look.** Pan or zoom while it plays, with a Re-centre button back to the story camera.

## Agreed so far (Joshua, 2026-11-07, after the camera stills and model renders)

Planning only; nothing is implemented. The storyboard stays a working proposal.

- **Camera grammar.** Security-camera cuts for dialogue, the overhead view for where people are, cinematic shots for emotional moments. Save the corridor fly-through for a later chapter.
- **Chapter 1 cameras** (metres in the lab's frame: +X east, +Z south). Positions are provisional; tune them once the actors are animated.

  | Cam | Where | Sees |
  |---|---|---|
  | J-1 | Jack's lab, high on the north wall over the gap between Jack's two monitors, about (-14.3, 2.4, -13.0) | Jack's face as he works |
  | J-2 | Jack's lab, SW corner (-16.7, 2.9, -7.9) | Main wide shot: workstations and the door |
  | J-3 | Jack's lab, SE corner by the door (-10.8, 2.9, -7.85) | Sarah from behind as she walks in, Jack's face as he turns |
  | S-1 | Sarah's office, by the door (10.8, 2.75, -7.9), tighter lens | Sarah's back at her desk |
  | SC | East connecting hall, south corner (6.25, 3.0, -7.85) | Sarah leaving her office |
  | C-1 | Control room, NW corner (-5.7, 3.6, -12.8) | Along the consoles and the Array glass (useful for Chapters 2 and 3) |
  | JC | West connecting hall, south corner (-6.25, 3.0, -7.85) | Sarah arriving at Jack's door |

- **Sarah's pregnancy.** She is seen only from behind until she takes Jack's chair. The reveal comes at 5:07, "Jack gave Sarah his chair right away": a plain side-on medium shot as she settles into it, with no push-in and no lingering. After that she can be framed freely, so the lines at 6:15 to 6:46 read as the explanation. J-2 is not used for her entrance, because it looks at the door.
- **Sarah's walk.** She reacts during "Can you come take a look?" (2:59): turns, sets things down, reaches for her tablet. She walks only after "I'm on my way." (3:00). The route runs through the control room, about 26 m. Test it for natural staging rather than forcing an arrival time; a cutaway to Jack may cover the gap.
- **Overhead.** Pull back to frame both rooms when Jack calls Sarah, then cut to S-1 when she answers.
- **7:04, the new warning tone.** Stay on Jack's console and his reaction. The Array is not shown as the cause.
- **Clock.** Events are rebuilt from the audio time, so seeking, pausing and speed changes work.
  - Positions, rotations, camera poses and animation are worked out from the audio time.
  - Doors, lights, screens and who holds the tablet are rebuilt from the events up to that time.
  - Seeking backward must never leave anyone in the wrong room, two tablets, or a door stuck open.
- **Timing.** Line start times come from ElevenLabs' own character timings, and in Chapter 1 they match the audible starts to within about 50 ms for 9 lines in 10, with a typical gap of about 23 ms. Phrase-level cues inside a line still need the same check.
- **Characters.** The approved Jack and Sarah models, posed by the Watch tab's posing code, worked in the lab in a test that changed no files.
  - Sarah's target look is Joshua's reference: red top, dark leggings, sneakers. Her shoes and outfit are still in progress.
  - Keep the stand-ins as a lightweight option for the overhead tracker.
  - The lab chairs are 0.52 m high and about 0.4 m back from the desks. Jack needs about a 0.40 m seat and Sarah about 0.49 m to keep their feet on the floor, so chairs should adjust to whoever sits in them.
- **Listen picture slot.** It is nearly square on phones (1 : 0.92) in both orientations, with shading over the top fifth. Each shot gets its own camera setup for this slot and for widescreen, not a crop.

## Constraints to keep
- Positions only where the manuscript supports them; otherwise hold or fade, never invent canon.
- Nothing may show what the characters do not know (WORLD_RULES hidden facts; the scale is never shown).
- Chapter 1's Watch staging is in picture pixels on the older rooms, so it must be re-plotted in lab metres.
- The lab layout itself is still awaiting Joshua's review (`tombs-lab/README.md`).

## Later
- Outdoor maps (edge, settlement, grate, underground), blueprint style or not: to be decided.
- Per-scene images as an alternative picture.
