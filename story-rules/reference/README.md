# Scale reference

Two files Joshua supplied on 2026-09-18, made with ChatGPT: a comparison chart and the
spreadsheet behind it. They are **worldbuilding reference**, not manuscript, and they
are the first place the series' scale is written down as a number.

| file | what it is |
|---|---|
| `TMB_scale_comparison.png` | the chart: humans, insects, plants, objects, terrain and landscape at 1:180 |
| `TMB_Scale_Comparison.xlsx` | the working sheet — 45 rows with normal size, TMB-relative size in mm / m / ft, a plain-language impression, and a source id. Sheet 2 lists the sources. Cell B4 is the scale multiplier, so another scale can be tested by changing one cell |

## The number

**1:180. A TMB human is 10 mm; that stands in for about 6 ft (1.8 m).**
Normal size × 180 = how large it feels. TMB size = normal size ÷ 180.

## How this sits with the manuscript

**It does not close `OPEN_QUESTIONS.md` Q05.** That question is whether the scale
factor's value is ever SPOKEN in the story, and it still is not: Chapter 2 has "Scale
factor calculating", Chapter 3 has "Scale factor locked" and then "Below it was the
scale factor" — the number is on the screen and deliberately never read out. Q05 stays
open as a story question. What is settled is the value the world is built on.

The two agree where the manuscript can be checked. Chapter 3 has Jack looking at a
grass blade that "wasn't inches high or even feet high from where they stood. It
towered above buildings." At 1:180 a mowed blade of St. Augustinegrass is about 17 m
relative — five storeys. The prose and the sheet describe the same world.

## What the numbers are and are not

The insect, spider and plant rows cite UF/IFAS and NC State Extension publications and
are real measured biology; the sheet's own "Design ref" rows are worldbuilding values
chosen for the game rather than measured. That distinction is in the sheet's Source
column and is worth keeping — it is the same rule `CLAUDE.md` applies to research
generally.

Ranges use representative midpoints, which the sheet names where it does so.

## Using it

A chapter that needs to know how big something feels reads this rather than inventing
a comparison, and a comparison that contradicts it is a continuity error. If a story
need ever requires a different scale, change it here and in `STORY_OVERVIEW.md`
first — do not let a chapter imply a second scale in passing.

**There IS a second scale, and it is hidden.** 1:180 is the settlement against the
island, and it is the only scale that belongs on the page. The island is itself about
1:180 against Earth, which puts the people at about 1:32,400 against Earth. No
character knows this. See `../WORLD_RULES.md` section 2.
