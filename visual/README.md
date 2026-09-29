# Visual story mode (prototype)

`visual/index.html` plays a chapter's real audio with a 2D scene over it. It is a proof
of concept: one scene, the whole of Chapter 1 (8 min 33 s): the date over black, the
island at night from high above, the settlement near its centre, then the lab with Jack
and Sarah through to "I didn't."

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
| `screens/console.js` | the lab console screen states: diagnostics, warning, intrusion, network monitor, access logs, the TOMBS directory, locked, the initialization request; Sarah's console |
| `paint/island.js` | procedural paint: the settlement's lights, drawn once into a canvas |
| `scenes/ch01-opening.js` | the scene: sets, actors, objects, shots and events — data only |
| `../scripts/split-sprites.py` | turns a character sheet into per-direction PNGs (`assets/characters/`) |
| `../scripts/make-lab-wide.py` | sets the original lab back into Joshua's expanded lab picture, for the wide shot and people passing the camera |
| `../scripts/split-props.py` | cuts the props sheet into one PNG per object with a real height (`assets/props/props.json`), ready to place as `objects` |
| `../scripts/make-island-art.py` | grades the Beyond Extinction island to moonlight, caps its volcano with cloud, and makes the cloud wisps |
| `engine/people3d.js` | Jack and Sarah as rigged 3D models, drawn into the painted lab through the picture's own camera, and the baked 3D room for shots that move the camera |
| `vendor/three-human.js` | three.js r185, its glTF loader and meshopt decoder, and TRADDOMIUM's human rig and poses (`src/actor/human*.ts`, `src/view/HumanRig.ts`), bundled into one module |
| `../assets/models/` | `jack.glb` and `sarah.glb` (TRADDOMIUM: Micro Battle's rigged pair, the ones the sprites were drawn from) and `lab-3d.glb`, the lab picture baked onto its own shapes |
| `../scripts/bake-lab-3d.py` | rebuilds `lab-3d.glb` from `lab-wide.jpg` (needs numpy and OpenCV) |
| `engine/rig.js` | the optional cutout rig: cuts a sprite into body parts along polygons and turns them about pivots |
| `engine/gestures.js` | the animation presets (nod, look-left, point, wave, type, lean-forward, walk…) as small eased joint angles |
| `rig.html` + `engine/rig-editor.js` | dev-only rig editor; not linked from the story |
| `../assets/characters/<name>/rig.json` | each character's rig: parts, pivots and limits, normalized to the sprite, per pose and direction |
| `../scripts/trace-arms.py` | traces the arm parts in rig.json to each arm's own outline, from the skeletons in `<name>/arms.json` |
| `../scripts/trace-legs.py` | traces the standing legs in rig.json from the silhouette (run after trace-arms.py) |

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
| `camera` | `shot` (a name in `shots`) or `x y w h focus`, `duration` (or `until`: an anchor), `ease`; `path: "zoom"` zooms at a constant rate toward one fixed point (use `ease: "linear"`) |
| `shake` | `amount`, `duration` |
| `move` | `actor`, `x y` or `dx dy`, `duration`, `ease` |
| `face` | `actor`, `direction` (south, southwest, … southeast) |
| `sit` / `stand` / `pose` | `actor` (`pose` for any other pose) |
| `state` | `actor`, `state`: idle, asleep, awake, leaning, still, walking — drives the idle sway, lean and step |
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
An insect-scale world is the same system with a different `pxPerMeter`. With `perspective.lockHeadsAt` (a floor depth), each person keeps the head height they
have at that depth wherever they walk, and nearer or farther only grows or shrinks the
figure from the head down, in proportion; at that depth the two rules agree exactly.

## Depth

A world's `layers` each move by their own `parallax` (1 is the ground; clouds above it
are more) and can also zoom faster than the ground as the camera pushes in
(`zoomDepth`), the way something nearer the lens does. At the widest framing every layer
lines up, and they separate as the camera comes down. `objects` place an image (`src`)
or a painted canvas (`paint`, a function in the scene's `painters`) on a layer in world
coordinates, with an `opacity` and an optional `drift` in pixels per second. A world's `floor` (a polygon) is where
people can be: the stage keeps each footprint inside it every frame, the chair's base
seated and the feet standing. Characters fade with `opacity` like objects (for passing
the camera). A world's `bounds`
can run past its measured picture (the lab's goes to negative x and y), and a world's
`color` fills everything past the layers, and `bounded: false` lets the camera frame
wider than the world (the sea runs on), so a long zoom never parks at the widest framing: the island's open sea is a colour, not a
9000-pixel picture.

## Growing it later

Built so these can be added without rewriting the engine: props and vegetation as
objects sorted by `y` with the characters, more sets per scene, more screen templates,
and more scenes registered in `engine/app.js`.

Watch is landscape only, as Beyond Extinction is. A phone or tablet held upright gets the
menu instead of the film ("Story paused in portrait view", with Start over, Captions and
Main menu); it is pure CSS and `pointer: coarse` only, so a laptop is never blocked.
Turning upright pauses the film and turning back resumes it where it was. In landscape
the gear button opens the same menu with Resume. The position is saved on the device
every second, so if the phone reloads the page the card offers "Resume at 0:12" and
"Start over".

The player is movie-style: the controls hide while it plays and a tap on the picture
brings them back. **CC** turns closed captions on and off (remembered per device); they
come from the manifest, so they are always the manuscript's words, with characters
named and the narrator not.

Debug: `?debug=1` shows the state panel (or press D), `?t=62.5` opens at a time,
`?silent=1` runs without audio, `?nogate` skips the play card. Space plays and pauses, the arrow keys step line by
line, C toggles captions.

Staging notes. The seated sprites carry their chair, so anything that moves a chair is
staged with poses: in Chapter 1 Jack stands and steps away, Sarah sits in his place and
rolls to her console, and Jack sits at the next workstation and rolls that chair back.
Screens draw behind the people, and a screen in its `off` state shows the painted
monitor from the background image.

## People in 3D (on by default)

Jack and Sarah are TRADDOMIUM: Micro Battle's rigged models, not the drawn sprites
(Joshua, 2026-09-29: "replace the 2D storyboard with the 3D models... Both, switchable").
They are posed by that game's own rig code, bundled into `vendor/three-human.js`: seated
(`doze` while Jack is asleep, `sit` otherwise), standing, and walking, with the scene's
states (leaning, still, a jolt) and gestures (nod, look, point, reach, type…) added as
small joint turns. A change of pose or state blends over about half a second, and a
change of direction turns rather than cuts. Heads look at whatever lies the way the body
faces, the other person's face or a monitor, and move between them as the body turns.
Hands have places to be: on the keys when someone types (the set's `keyboards`, each
painted end followed into the room), on the thighs when seated, on Sarah's stomach
(`hand-on-belly`), and up in front of the chest while that person's own line is heard.
The rig's `head` joint is the crown, so turns go to its parent, the base of the skull,
and a lowered arm shares its drop with the collarbone so the shoulder does not square off. A seated person has a chair; a person who
stands leaves it where it was, and the next person to sit down there takes it.

Two ways to see the room, chosen per shot:

- **The painting** (every shot unless it says otherwise). The picture is untouched and
  the camera crops it as before. The people are drawn over it through the camera the
  picture was painted from: 1300 px focal length on the original frame, level, 1.43 m
  up, turned 5.2 degrees off the room's axis (recovered from the picture's lines; see
  `scripts/bake-lab-3d.py`). So a floor point in stage coordinates IS a floor point in
  metres, and the room's shapes, drawn invisibly into the depth buffer, hide whatever is
  behind a cabinet. They sit under the night grade and the glows, and the monitor, alarm
  and intercom glows light them in their current colour.
- **The room** (a shot with `cam3`). The camera really moves. The room is the picture
  baked back onto its shapes, so from the picture's camera it IS the picture and the
  change from painting to room cannot be seen; away from it the parallax is real. The
  screens and glows follow to where the moving camera sees them. Chapter 1 uses it for
  the opening push-in: up the aisle to Jack asleep, closer at the second chirp, over his
  shoulder to the warning, then back out as his chair rolls.

      asleep: { x: 420, y: 430, w: 900, h: 700, focus: [820, 800],
                cam3: { at: [0.3, 1.45, -1.55], look: [-0.05, 1.1, -3.1], hfov: 50 } },

  Metres in the room frame: x right, y up, z toward the picture's camera, the floor at
  y = 0. The flat `x/y/w/h` stays the framing when the people are drawn.

**Switchable.** The menu's "People: 3D / Drawn" button (remembered on the device) or
`?people=2d` puts the sprites back; `?people=3d` forces 3D. The sprites also stand in if
the models cannot load. The set's `people3d` block names the models, the room, the
picture's camera and the aisle between the cabinets.

## Cutout rig (optional, off by default)

The sprites stay the canonical art. `?rig=1` lets a character move a little between
directions: the rig cuts the current sprite into head, torso, upper and lower arms,
hands and legs along the polygons in `assets/characters/<name>/rig.json` (coordinates are
0..1 of the sprite canvas, so a re-exported sheet at another size still fits), fills
what a moved part uncovers from the pixels around it, and turns each part about its
pivot. Turning the body is still a swap to another of the eight directions; the rig
never fakes 3D. Without `?rig=1` nothing changes, and a character with no gesture and
no step is drawn from the plain sprite even with it.

A scene asks for a gesture on a line:

    { at: L("Jack entered a command"), action: "gesture", actor: "jack",
      animation: "type", duration: 3.0 }

`arm: "left" | "right"` picks an arm and `amount` scales it. The presets keep the ranges
small (head 5 to 10 degrees, torso 3 to 6, arms 10 to 30) and ease in and out; the
limits in each rig.json cap them again per character. Sarah's torso is limited to 3
degrees and her torso is one rigid piece, so her pregnancy is never bent or stretched.

The rigs started automatic, cut from each sprite's silhouette as boxes. A box cannot
see a hand lying on a thigh: the pixels between the fingers are trousers, and they went
with the hand. So Jack's and Sarah's arms are now traced to the arm's own outline in
every view (`scripts/trace-arms.py`, from the arm skeletons in each character's
`arms.json`), with a cap at the elbow and wrist so a bend does not open a notch. What a
moved arm uncovers is filled from the colours around it: trousers under a hand, shirt
beside an elbow, the armrest under a wrist. Arms hidden behind the body or the chair are
not parts. Standing legs are traced too (`scripts/trace-legs.py`, run after the arms):
every pixel of the figure below the hips that is not an arm belongs to a leg, split
between the two legs down the gap that shows between them, so a whole leg and its shoe
move together. Sarah's skirt stays with her body and her legs move under it. In a side
view the legs overlap into one shape and are left as drawn. Heads and torsos are still
boxes. Mark's and Lena's rigs are still fully automatic, with side and seated arms capped
at 4 degrees until they are traced the same way.

At rest the rig is the sprite, pixel for pixel: parts are cut with hard edges, each
half-transparent edge pixel belongs to one part only, and what a part uncovers is
painted in only under solid pixels and only as the part in front actually moves. Under a
traced limb, only what the tracer found inside the body is painted in; above a forearm
lying on a lap is the room, and the room shows.

With `?rig=1` the characters are never quite still: they breathe, and their heads drift
a little, each at their own pace. Jack dozes at the start of the lab scene, head tipped
toward one shoulder, stirs at the first tone, and snaps up when he jerks awake. After
that, each line of Chapter 1 that describes a movement has its gesture (leaning in,
glancing across, pointing, reaching for the console, typing).

`visual/rig.html` is the editor: pick character, pose and direction, drag pivots, tick
"Edit shapes" and drag corners, double-click an edge to add a corner, right-click or
Alt-click one to remove it, preview presets, then download rig.json. Edits are kept in
that browser until exported, against the rig.json revision they were made on, so a newer
rig.json is never hidden by old edits; "Revert this view to rig.json" drops them.
