# Visual story mode (prototype)

`visual/index.html` plays a chapter's real audio with a 2D scene over it. It is a proof
of concept: one scene, the first ninety seconds of Chapter 1: the date over black, the
island at night from high above, the settlement near its centre, then the lab.

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
| `paint/island.js` | procedural paint: the settlement's lights, drawn once into a canvas |
| `scenes/ch01-opening.js` | the scene: sets, actors, objects, shots and events — data only |
| `../scripts/split-sprites.py` | turns a character sheet into per-direction PNGs (`assets/characters/`) |
| `../scripts/make-island-art.py` | grades the Beyond Extinction island to moonlight, caps its volcano with cloud, and makes the cloud wisps |

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
same rule the mixer uses. `seg` is a line by its order. Inside one long narrated line,
`{ line: "...", phrase: "Near its center" }` lands on that phrase, estimated from its
share of the line's characters (narration runs at a nearly even pace). A regenerated clip
moves every event anchored to it.

A scene is one or more **sets**, each with its own `world`, `shots`, `camera`, actors,
objects, screens and lights. `initialSet` opens it and `{ action: "set", set: "lab" }`
cuts; each set keeps its own camera, so cutting back returns to where it was. A scene
written with a single top-level `world` is one set.

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
| `set` | `set` — cut to another set |
| `opacity` | `target` (an object), `to`, `duration` |
| `title` | `text`, `sub`, `duration`, `fadeIn`, `fadeOut` — a title card over the picture |
| `scene` | `name` (the label in the debug panel) |

Reserved, not built yet: `sound`, `parallax`, `interaction`. `ease` is one of linear, in,
out, inOut, smooth, slow.

## World units

Coordinates are pixels of the background image. Sizes are not: the scene's
`perspective` gives pixels per metre at any floor position, and each sprite pose knows its
own pixels per metre (`sprite.json`), so a character is always its real height and grows
as it moves toward the camera. Zoom never changes the size relationship between objects.
An insect-scale world is the same system with a different `pxPerMeter`.

## Depth

A world's `layers` each move by their own `parallax` (1 is the ground; clouds above it
are more) and can also zoom faster than the ground as the camera pushes in
(`zoomDepth`), the way something nearer the lens does. At the widest framing every layer
lines up, and they separate as the camera comes down. `objects` place an image (`src`)
or a painted canvas (`paint`, a function in the scene's `painters`) on a layer in world
coordinates, with an `opacity` and an optional `drift` in pixels per second. A world's
`color` fills everything past the layers: the island's open sea is a colour, not a
9000-pixel picture.

## Growing it later

Built so these can be added without rewriting the engine: props and vegetation as
objects sorted by `y` with the characters, more sets per scene, more screen templates,
and more scenes registered in `engine/app.js`.

The player is movie-style: the controls hide while it plays and a tap on the picture
brings them back. **CC** turns closed captions on and off (remembered per device); they
come from the manifest, so they are always the manuscript's words, with characters
named and the narrator not.

Debug: `?debug=1` shows the state panel (or press D), `?t=62.5` opens at a time,
`?silent=1` runs without audio, `?nogate` skips the play card. Space plays and pauses, the arrow keys step line by
line, C toggles captions.
