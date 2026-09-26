# Visual story mode (prototype)

`visual/index.html` plays a chapter's real audio with a 2D scene over it. It is a proof
of concept: one scene, the first minute of Chapter 1 in the lab.

**The audio is the clock.** The scene is a pure function of `audio.currentTime`, so pause,
seek, skip and replay need no special handling — the renderer asks "what does the scene
look like at t?" and draws it. The master audio is the chapter's drama mix
(`audio/exports/chapter-NN-drama.mp3`), because the manifest indexes that file line by
line; the voice-only export is not indexable.

## Files

| file | what it does |
|---|---|
| `engine/clock.js` | the audio master clock, smoothed between coarse `currentTime` updates |
| `engine/timeline.js` | anchors + event list → tracks; `evaluate(t)` returns the whole scene state |
| `engine/camera.js` | fits a named shot into any viewport without stretching or letterboxing |
| `engine/stage.js` | draws a state: layers, characters, lights, screens (DOM + GPU transforms) |
| `engine/homography.js` | pins a flat screen overlay onto a monitor's four corners |
| `screens/console.js` | the lab console screen states (diagnostics, warning, intrusion) |
| `scenes/ch01-opening.js` | the scene: world, actors, shots and events — data only |
| `../scripts/split-sprites.py` | turns a character sheet into per-direction PNGs (`assets/characters/`) |

## Writing a scene

A scene is data. Anchor events to the audio, not to hand-typed seconds:

```js
{ at: { line: "What? Okay, I'm awake." }, action: "face", actor: "jack", direction: "northwest" }
{ at: { cue: "ch01-020-chair-startle" }, action: "move", actor: "jack", x: 630, y: 1264, duration: 0.8, ease: "out" }
{ at: { line: "Warning. Unauthorized", offset: 0.2 }, action: "camera", shot: "close", duration: 2.4 }
{ at: 61.3, action: "state", actor: "jack", state: "awake" }
```

`line` matches the start of a manuscript line in the chapter's manifest (`edge: "end"`
for its end, `nth` if it repeats). `cue` is a sound cue from the drama mix, placed by the
same rule the mixer uses. A regenerated clip moves every event anchored to it.

| action | fields |
|---|---|
| `camera` | `shot` (a name in `shots`) or `x y w h focus`, `duration`, `ease` |
| `shake` | `amount`, `duration` |
| `move` | `actor`, `x y` or `dx dy`, `duration`, `ease` |
| `face` | `actor`, `direction` (south, southwest, … southeast) |
| `sit` / `stand` / `pose` | `actor` (`pose` for any other pose) |
| `state` | `actor`, `state`: idle, asleep, awake, leaning — drives the idle sway and lean |
| `jolt` | `actor`, `amount`, `duration` — a startle or a shift |
| `show` / `hide` | `actor` |
| `screen` | `target`, `state`, `params`, `text: { line }` (shows the manuscript line), `flash` |
| `light` | `target`, `color`, `intensity`, `duration`, `pulse`, `throb` (Hz) |
| `fade` | `to` (0 clear, 1 black), `duration` |
| `scene` | `name` (the label in the debug panel) |

Reserved, not built yet: `sound`, `parallax`, `interaction`. `ease` is one of linear, in,
out, inOut, smooth, slow.

## World units

Coordinates are pixels of the background image. Sizes are not: the scene's
`perspective` gives pixels per metre at any floor position, and each sprite pose knows its
own pixels per metre (`sprite.json`), so a character is always its real height and grows
as it moves toward the camera. Zoom never changes the size relationship between objects.
An insect-scale world is the same system with a different `pxPerMeter`.

## Growing it later

Built so these can be added without rewriting the engine: more layers with `parallax`
(each layer already moves by its own factor), props and vegetation as objects sorted by
`y` with the characters, more screen templates, and more scenes registered in
`engine/app.js`.

The player is movie-style: the controls hide while it plays and a tap on the picture
brings them back. **CC** turns closed captions on and off (remembered per device); they
come from the manifest, so they are always the manuscript's words, with characters
named and the narrator not.

Debug: `?debug=1` shows the state panel (or press D), `?t=62.5` opens at a time,
`?silent=1` runs without audio. Space plays and pauses, the arrow keys step line by
line, C toggles captions.
