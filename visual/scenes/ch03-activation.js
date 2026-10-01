// Chapter 3, "The Activation", the whole chapter over its real audio (10 min): the main
// control room, straight on from Chapter 2 -- access denied, the building shaking, the scale
// factor locked, every light turning white, the floor going, the snap back; TOMBS offline
// "because it finished"; Lena on the wrist terminal, communications down; then Sarah at the
// window, the street as it was and, beyond the research district, grass taller than the
// buildings; the perimeter cameras; the drop of water; the event log; the boundary on the
// map; "Their town had shrunk. / And the island had not."
//
// Every `at` is a line, a phrase or a cue in audio/manifests/chapter-03.json. The room is
// built (engine/controlRoom.js) and staged in metres (scenes/metric.js).
//
// TWO THINGS THIS SCENE MUST NOT DO. It never shows the scale factor: the manuscript has
// them stare at it and never says it, and the settlement's scale is HIDDEN in
// story-rules/WORLD_RULES.md -- the screens draw it unreadable, and on "Jack stared at the
// number" the camera is on Jack. And it shows no more of the outside than the chapter says:
// the street, the building across, streetlights, the utility vehicle, and grass where the
// hills were.

import { controlTemplates, mapTemplates } from "../screens/control.js";
import { L, plus, P, walkM, placeM, shot3, builtWorld } from "./metric.js";

const DIAG_BLUE = "rgba(80,160,255,0.55)";
const RED = "rgba(255,60,40,0.7)";
const CM = "control-main", CS = "control-second", MAP = "control-map";
const PRIMARY_SPOT = [-1.15, -4.45], SECOND_SPOT = [1.9, -4.45], BESIDE = [-0.35, -4.4];
const NEAR_SARAH = [1.15, -4.2], WINDOW_SARAH = [3.0, -2.75], WINDOW_JACK = [2.95, -1.95];
// where they land: on the floor between the consoles
const FLOOR_JACK = [0.15, -3.6], FLOOR_SARAH = [1.05, -3.9];

const at = (x, z) => P(x, z);
const cue = (c, o = {}) => ({ cue: c, ...o });

const control = {
  world: builtWorld("control", { lookAtLights: ["chamber", "map"] }),
  props: { rings: 2, chamber: 1, panel: 1, lever: 1, lighting: 2, white: 0, outside: 0 },
  actors: {
    jack: { sprite: "../assets/characters/jack/", pose: "standing", facing: "north", state: "awake", x: at(...PRIMARY_SPOT)[0], y: at(...PRIMARY_SPOT)[1], layer: "room" },
    sarah: { sprite: "../assets/characters/sarah/", pose: "standing", facing: "north", state: "awake", x: at(...BESIDE)[0], y: at(...BESIDE)[1], layer: "room" },
  },
  screens: {
    [CM]: { corners: [[0, 0], [10, 0], [0, 6], [10, 6]], width: 640, height: 348, templates: controlTemplates, state: "scale", params: { lines: ["Boundary acquired.", "Scale factor calculating."] } },
    [CS]: { corners: [[0, 0], [10, 0], [0, 6], [10, 6]], width: 580, height: 348, templates: controlTemplates, state: "emitters", params: { refusedAt: 0 } },
    [MAP]: { corners: [[0, 0], [10, 0], [0, 6], [10, 6]], width: 600, height: 352, templates: mapTemplates, state: "map", params: { denied: true } },
  },
  lights: {
    monitor: { x: 0, y: 0, radius: 0, color: RED, intensity: 0.45 },
    second: { x: 0, y: 0, radius: 0, color: RED, intensity: 0.3 },
    map: { x: 0, y: 0, radius: 0, color: DIAG_BLUE, intensity: 0.2 },
    chamber: { x: 0, y: 0, radius: 0, color: "rgba(90,230,240,0.8)", intensity: 0.8 },
  },
  shots: {
    consoles: shot3([0.4, 1.7, -1.6], [0.1, 1.15, -5.6], 58),
    primary: shot3([0.3, 1.55, -3.2], [-1.15, 1.25, -5.4], 50),
    second: shot3([0.6, 1.55, -3.3], [1.9, 1.25, -5.4], 50),
    screenMain: shot3([-0.75, 1.5, -4.15], [-1.1, 1.3, -5.55], 50),
    twoShot: shot3([0.9, 1.6, -2.4], [-0.75, 1.45, -4.6], 50),
    shake: shot3([-0.2, 1.6, -1.8], [1.2, 1.35, -4.6], 56),
    faces: shot3([-0.8, 1.55, -5.55], [-0.7, 1.55, -4.4], 52),
    // the white: a stretch, then a crush (the room "impossibly far away ... then impossibly close")
    white: shot3([0.6, 1.5, -1.9], [0.4, 1.4, -4.4], 60),
    whiteFar: shot3([0.6, 1.5, -1.9], [0.4, 1.4, -4.4], 105),
    whiteNear: shot3([0.6, 1.5, -1.9], [0.4, 1.4, -4.4], 22),
    floor: shot3([1.6, 0.85, -2.2], [0.5, 0.65, -3.9], 58),
    floorClose: shot3([0.9, 0.9, -2.6], [0.6, 0.7, -3.9], 48),
    room: shot3([2.6, 1.9, 0.6], [-0.6, 1.2, -5.2], 62),
    rings: shot3([0.25, 1.8, -3.6], [0, 2.1, -16.5], 54),
    window: shot3([0.2, 1.6, -2.4], [0, 1.9, -16], 54),
    // the east window: from inside, over their shoulders, then out
    toWindow: shot3([0.4, 1.6, -0.8], [3.4, 1.5, -2.6], 56),
    atWindow: shot3([1.9, 1.6, -0.9], [3.2, 1.55, -2.4], 50),
    street: shot3([3.3, 1.65, -2.45], [20, 2.0, -9], 66),
    beyond: shot3([3.3, 1.6, -2.45], [80, 22, 2], 66),
    blade: shot3([3.3, 1.55, -2.45], [110, 55, 6], 48),
    window2: shot3([1.4, 1.65, -1.1], [6, 4, -4], 70),
    final: shot3([3.3, 1.6, -2.45], [120, 34, 2], 62),
    map: shot3([-1.0, 1.6, -3.0], [-3.4, 1.65, -4.25], 54),
    onJack: shot3([-0.2, 1.55, -5.2], [-1.0, 1.5, -4.4], 44),
  },
  camera: { initial: { shot: "primary" }, name: "Main control room" },
};

// Someone landing on the floor at a cut (`fallen` is sitting without a chair; people3d.js).
function fallTo(actor, a, x, z, dir) {
  return [placeM(actor, a, x, z), { at: a, action: "sit", actor }, { at: a, action: "state", actor, state: "fallen" }, { at: a, action: "face", actor, direction: dir }];
}
function getUp(actor, a) {
  return [{ at: a, action: "stand", actor }, { at: a, action: "state", actor, state: "awake" }];
}

export default {
  id: "ch03-activation",
  title: "Chapter 3 · The Activation",
  audio: "../audio/exports/chapter-03-drama.mp3",
  manifest: "../audio/manifests/chapter-03.json",
  range: { start: { seg: 0 }, end: { line: "And the island had not.", edge: "end" } },
  fadeFromBlack: true,
  initialSet: "control",
  sets: { control },

  events: [
    // "Jack's fingers raced over the keyboard." / "Give me manual control." / "Access denied."
    { at: { seg: 0 }, action: "scene", name: "Manual control" },
    { at: { seg: 0 }, action: "fade", to: 0, duration: 1.2, ease: "out" },
    { at: { seg: 0 }, action: "gesture", actor: "jack", animation: "type", duration: 9 },
    { at: L("Access denied.", { nth: 0 }), action: "screen", target: CM, state: "denied", params: { count: 1 }, flash: 0.8 },
    { at: L("Access denied.", { nth: 0 }), action: "camera", shot: "screenMain", duration: 1.4, ease: "inOut" },
    { at: L("Access denied.", { nth: 1 }), action: "screen", target: CM, state: "denied", params: { count: 2 }, flash: 0.9 },
    // "Sarah moved to the secondary console." / "I'll try to interrupt the calculation."
    ...walkM("sarah", L("Sarah moved to the secondary console."), BESIDE, SECOND_SPOT, 2.4, "north", null, 3),
    { at: L("Sarah moved to the secondary console."), action: "camera", shot: "consoles", duration: 2.0, ease: "inOut" },
    { at: L("Jack nodded toward her console."), action: "gesture", actor: "jack", animation: "nod", duration: 0.9 },
    { at: L("Her fingers moved quickly"), action: "gesture", actor: "sarah", animation: "type", duration: 3.2 },
    { at: L("Nothing.", { nth: 0 }), action: "screen", target: CS, state: "denied", params: { count: 1 }, flash: 0.6 },
    { at: L("Jack opened another diagnostic path."), action: "gesture", actor: "jack", animation: "type", duration: 3 },
    { at: L("Sarah tried the command a second time."), action: "gesture", actor: "sarah", animation: "type", duration: 2.6 },
    // "The building shook hard enough that Sarah caught herself against the console. Jack
    //  immediately grabbed her arm."
    { at: L("The building shook"), action: "scene", name: "The building shakes" },
    { at: cue("ch03-030-building-shake"), action: "shake", amount: 9, duration: 1.6 },
    { at: L("The building shook"), action: "jolt", actor: "sarah", amount: 1.4, duration: 0.8 },
    { at: L("The building shook"), action: "jolt", actor: "jack", amount: 1.0, duration: 0.8 },
    { at: L("The building shook"), action: "camera", shot: "shake", duration: 0.8, ease: "out" },
    ...walkM("jack", L("The building shook", { phrase: "Jack immediately" }), PRIMARY_SPOT, NEAR_SARAH, 1.4, "east", "east", 3),
    { at: L("You okay?"), action: "face", actor: "sarah", direction: "west" },
    { at: L("She met his eyes."), action: "camera", shot: "twoShot", duration: 1.2, ease: "inOut" },
    // "Another vibration rolled through the floor. The muted warning tones at the consoles cut
    //  off one by one. Jack's screen flashed."
    { at: L("Another vibration rolled"), action: "shake", amount: 5, duration: 1.4 },
    { at: L("Another vibration rolled", { phrase: "Jack's screen flashed" }), action: "screen", target: CM, flash: 1 },
    ...walkM("jack", L("Another vibration rolled", { phrase: "Jack's screen flashed" }), NEAR_SARAH, PRIMARY_SPOT, 1.4, "north", null, 3),
    // "Scale factor locked." -- unreadable (see the header)
    { at: L("Scale factor locked."), action: "scene", name: "Scale factor locked" },
    { at: L("Scale factor locked."), action: "screen", target: CM, state: "scale", params: { lines: ["Boundary acquired.", "Scale factor locked."], locked: true }, flash: 1 },
    { at: L("Scale factor locked."), action: "camera", shot: "screenMain", duration: 1.2, ease: "inOut" },
    ...walkM("sarah", L("Sarah stared at the value."), SECOND_SPOT, BESIDE, 2.0, "north", null, 3),
    { at: L("Jack didn't answer."), action: "camera", shot: "faces", duration: 1.6, ease: "inOut" },
    { at: L("Jack finally looked away from the screen."), action: "face", actor: "jack", direction: "east" },
    { at: L("Sarah pointed at the locked value."), action: "gesture", actor: "sarah", animation: "point", duration: 1.4 },
    // "Before he could respond, every light in the laboratory turned white."
    { at: L("Before he could respond"), action: "scene", name: "White" },
    { at: L("Before he could respond", { phrase: "every light" }), action: "prop", target: "white", to: 1, duration: 0.5, ease: "in" },
    { at: L("Before he could respond", { phrase: "every light" }), action: "screen", target: CM, state: "white" },
    { at: L("Before he could respond", { phrase: "every light" }), action: "screen", target: CS, state: "white" },
    { at: L("Before he could respond", { phrase: "every light" }), action: "screen", target: MAP, state: "white" },
    { at: L("Before he could respond", { phrase: "every light" }), action: "fade", color: "#fff", to: 0.55, duration: 0.6, ease: "in" },
    { at: L("Before he could respond"), action: "camera", shot: "white", duration: 1.2, ease: "inOut" },
    // "Sarah grabbed his hand." / "Jack!"
    { at: L("Sarah grabbed his hand."), action: "face", actor: "sarah", direction: "west" },
    // "The sound vanished..." / "The laboratory seemed to stretch around them, the walls
    //  impossibly far away for a fraction of a second and then impossibly close."
    { at: L("Jack could see Sarah shouting", { phrase: "The laboratory seemed to stretch" }), action: "camera", shot: "whiteFar", duration: 1.6, ease: "in" },
    { at: L("Jack could see Sarah shouting", { phrase: "and then impossibly close" }), action: "camera", shot: "whiteNear", duration: 0.7, ease: "inOut" },
    { at: L("Jack could see Sarah shouting", { phrase: "His stomach dropped" }), action: "camera", shot: "white", duration: 2.5, ease: "inOut" },
    { at: L("Jack tightened his grip"), action: "fade", to: 0.8, duration: 2.0, ease: "inOut" },
    // "The floor seemed to disappear beneath his feet."
    { at: L("The floor seemed to disappear"), action: "fade", to: 1, duration: 1.0, ease: "in" },
    // "Then everything snapped back." -- and they are on the floor
    { at: L("Then everything snapped back."), action: "scene", name: "The snap back" },
    { at: L("Then everything snapped back."), action: "prop", target: "white", to: 0, duration: 0 },
    { at: L("Then everything snapped back."), action: "prop", target: "rings", to: 0, duration: 0 },
    { at: L("Then everything snapped back."), action: "prop", target: "chamber", to: 0.03, duration: 0 },
    { at: L("Then everything snapped back."), action: "prop", target: "lighting", to: 0, duration: 0 },
    { at: L("Then everything snapped back."), action: "prop", target: "outside", to: 1, duration: 0 },
    { at: L("Then everything snapped back."), action: "screen", target: CM, state: "offline", params: {} },
    { at: L("Then everything snapped back."), action: "screen", target: CS, state: "dead" },
    { at: L("Then everything snapped back."), action: "screen", target: MAP, state: "dead" },
    { at: L("Then everything snapped back."), action: "light", target: "monitor", color: DIAG_BLUE, intensity: 0.05, duration: 0 },
    { at: L("Then everything snapped back."), action: "light", target: "second", intensity: 0, duration: 0 },
    { at: L("Then everything snapped back."), action: "light", target: "chamber", intensity: 0.05, duration: 0 },
    ...fallTo("jack", L("Then everything snapped back."), ...FLOOR_JACK, "east"),
    ...fallTo("sarah", L("Then everything snapped back."), ...FLOOR_SARAH, "west"),
    { at: L("Then everything snapped back."), action: "camera", shot: "floor", duration: 0 },
    { at: L("Then everything snapped back.", { offset: 0.1 }), action: "fade", color: "#fff", to: 0, duration: 0.25, ease: "out" },
    { at: L("Sound returned all at once"), action: "shake", amount: 6, duration: 0.5 },
    { at: L("Sound returned all at once"), action: "jolt", actor: "jack", amount: 1.6, duration: 0.6 },
    { at: L("Sound returned all at once", { offset: 0.3 }), action: "jolt", actor: "sarah", amount: 1.4, duration: 0.6 },
    // "Jack crawled toward her." / "Sarah! Are you hurt?"
    { at: L("Jack crawled toward her."), action: "move", actor: "jack", x: at(0.55, -3.75)[0], y: at(0.55, -3.75)[1], duration: 1.6, ease: "inOut" },
    { at: L("Jack crawled toward her."), action: "camera", shot: "floorClose", duration: 2.0, ease: "inOut" },
    { at: L("Sarah pushed herself upright."), action: "jolt", actor: "sarah", amount: 0.6, duration: 0.8 },
    { at: L("Jack looked at her stomach."), action: "gesture", actor: "jack", animation: "look-down", duration: 1.2 },
    { at: L("Sarah pressed a hand against her stomach."), action: "gesture", actor: "sarah", animation: "hand-on-belly", arm: "left", duration: 9 },
    { at: L("She closed her eyes"), action: "gesture", actor: "sarah", animation: "look-down", duration: 1.8 },
    // "The laboratory settled into an unsettling silence. Jack slowly stood and looked around.
    //  Nothing appeared different. The consoles were intact, the TOMBS Array had stopped, and
    //  even the emergency lighting had returned to normal."
    { at: L("The laboratory settled"), action: "scene", name: "After" },
    ...getUp("jack", L("The laboratory settled", { phrase: "Jack slowly stood" })),
    { at: L("The laboratory settled", { phrase: "Jack slowly stood" }), action: "camera", shot: "room", duration: 3.0, ease: "inOut" },
    { at: L("The laboratory settled", { phrase: "looked around" }), action: "face", actor: "jack", direction: "north" },
    { at: L("The laboratory settled", { phrase: "the TOMBS Array had stopped" }), action: "camera", shot: "window", duration: 3.0, ease: "inOut" },
    ...getUp("sarah", L("Sarah got to her feet")),
    { at: L("Sarah got to her feet"), action: "face", actor: "sarah", direction: "north" },
    { at: L("Sarah got to her feet"), action: "camera", shot: "twoShot", duration: 2.0, ease: "inOut" },
    // "Jack glanced back at the main console. The display had gone dark except for a single
    //  status light. He crossed the room and touched the controls." / "TOMBS is offline."
    ...walkM("jack", L("Jack glanced back at the main console.", { phrase: "He crossed the room" }), [0.55, -3.75], PRIMARY_SPOT, 2.4, "north", null, 3),
    { at: L("TOMBS is offline."), action: "screen", target: CM, state: "offline", params: { label: true } },
    { at: L("TOMBS is offline."), action: "camera", shot: "primary", duration: 1.6, ease: "inOut" },
    // "Sarah followed more carefully, one hand resting beneath her stomach."
    ...walkM("sarah", L("Sarah followed more carefully"), FLOOR_SARAH, BESIDE, 3.0, "north", null, 3),
    { at: L("Sarah followed more carefully"), action: "gesture", actor: "sarah", animation: "hand-on-belly", arm: "left", duration: 4 },
    { at: L("Jack tried the controls again."), action: "gesture", actor: "jack", animation: "type", duration: 2.0 },
    { at: L("Sarah looked toward the chamber window."), action: "camera", shot: "rings", duration: 2.0, ease: "inOut" },
    // "Jack pulled up the local sensor grid."
    { at: L("Jack pulled up the local sensor grid."), action: "screen", target: CM, state: "sensors", flash: 0.4 },
    { at: L("Jack pulled up the local sensor grid."), action: "light", target: "monitor", color: DIAG_BLUE, intensity: 0.35, duration: 0.4 },
    { at: L("Jack pulled up the local sensor grid."), action: "camera", shot: "screenMain", duration: 2.0, ease: "inOut" },
    { at: L("Sarah watched him move through the readings."), action: "camera", shot: "twoShot", duration: 2.0, ease: "inOut" },
    { at: L("Jack looked through the chamber window."), action: "camera", shot: "window", duration: 2.0, ease: "inOut" },
    // Lena, on the wrist terminal
    { at: L("His wrist terminal chirped"), action: "scene", name: "Lena · communications" },
    { at: L("Jack raised his wrist."), action: "gesture", actor: "jack", animation: "look-down", duration: 1.2 },
    { at: L("Jack raised his wrist."), action: "camera", shot: "faces", duration: 1.8, ease: "inOut" },
    { at: L("Jack brought up the building status."), action: "screen", target: CM, state: "status" },
    { at: L("Jack opened the communications panel."), action: "screen", target: CM, state: "comms", params: { rows: 1 } },
    { at: L("Jack opened the communications panel."), action: "camera", shot: "screenMain", duration: 1.6, ease: "inOut" },
    { at: L("External. We can't reach anything"), action: "screen", target: CM, state: "comms", params: { rows: 2 } },
    // (the first "Nothing." is Sarah's, at the secondary console; these two are Lena's)
    { at: L("Nothing.", { nth: 1 }), action: "screen", target: CM, state: "comms", params: { rows: 3 } },
    { at: L("Nothing.", { nth: 2 }), action: "screen", target: CM, state: "comms", params: { rows: 4 } },
    { at: L("Try the emergency frequencies."), action: "screen", target: CM, state: "comms", params: { rows: 5 } },
    // "Behind him, Sarah had walked toward a window." -- the east wall
    { at: L("Behind him, Sarah had walked toward a window."), action: "scene", name: "The window" },
    ...walkM("sarah", L("Behind him, Sarah had walked", { offset: -0.6 }), BESIDE, WINDOW_SARAH, 3.4, "east", "east"),
    { at: L("Behind him, Sarah had walked toward a window."), action: "camera", shot: "toWindow", duration: 2.4, ease: "inOut" },
    { at: L("Jack kept his attention on the terminal."), action: "camera", shot: "primary", duration: 1.6, ease: "inOut" },
    { at: L("Sarah called again from the window."), action: "camera", shot: "toWindow", duration: 1.4, ease: "inOut" },
    { at: L("Jack cycled through another channel."), action: "gesture", actor: "jack", animation: "type", duration: 1.4 },
    // "Something in her voice made him lower his wrist." / "Jack walked over and stopped beside her."
    { at: L("Something in her voice"), action: "face", actor: "jack", direction: "east" },
    ...walkM("jack", L("Jack walked over and stopped beside her."), PRIMARY_SPOT, WINDOW_JACK, 3.0, "east", "east"),
    { at: L("Jack walked over"), action: "camera", shot: "atWindow", duration: 3.0, ease: "inOut" },
    // "He looked outside." / "The street was there. The building across from them was there.
    //  Streetlights still glowed, and a parked utility vehicle sat exactly where it had been."
    { at: L("He looked outside."), action: "camera", shot: "street", duration: 2.4, ease: "inOut" },
    // "Beyond it, the world was wrong." / "The hills beyond the research district were gone.
    //  In their place stood enormous shapes reaching into the darkness."
    { at: L("Beyond it, the world was wrong."), action: "scene", name: "Beyond the town" },
    { at: L("Beyond it, the world was wrong."), action: "camera", shot: "beyond", duration: 6.0, ease: "slow" },
    { at: L("Jack stepped closer to the glass."), action: "move", actor: "jack", x: at(3.1, -2.05)[0], y: at(3.1, -2.05)[1], duration: 0.8, ease: "inOut" },
    { at: L("Sarah pointed toward the edge of the settlement."), action: "gesture", actor: "sarah", animation: "point", duration: 2.0 },
    { at: L("Sarah pointed toward the edge of the settlement."), action: "camera", shot: "window2", duration: 2.2, ease: "inOut" },
    // "Jack stared at a blade rising beyond the developed area ... It towered above buildings."
    { at: L("Jack stared at a blade"), action: "camera", shot: "blade", duration: 8.0, ease: "slow" },
    // "Jack backed away from the window." / "No."
    { at: L("Jack backed away from the window."), action: "camera", shot: "atWindow", duration: 1.0, ease: "out" },
    { at: L("Jack backed away from the window."), action: "move", actor: "jack", x: at(2.3, -1.9)[0], y: at(2.3, -1.9)[1], duration: 1.2, ease: "out" },
    { at: L("Sarah turned toward him."), action: "face", actor: "sarah", direction: "west" },
    // "He rushed to the console and opened the camera controls." / the perimeter feeds
    ...walkM("jack", L("He rushed to the console"), [2.3, -1.9], PRIMARY_SPOT, 2.0, "west", "north", 3),
    { at: L("External cameras."), action: "screen", target: CM, state: "cam", params: { cam: 1 }, flash: 0.4 },
    { at: L("External cameras."), action: "camera", shot: "screenMain", duration: 1.6, ease: "inOut" },
    { at: L("Jack opened the settlement's perimeter feeds.", { phrase: "Camera Two" }), action: "screen", target: CM, state: "cam", params: { cam: 2 } },
    { at: L("Jack opened the settlement's perimeter feeds.", { phrase: "Camera Three" }), action: "screen", target: CM, state: "cam", params: { cam: 3 } },
    ...walkM("sarah", L("Jack opened the settlement's perimeter feeds."), WINDOW_SARAH, BESIDE, 3.6, "west", "north"),
    { at: L("Jack switched the feed to a camera mounted higher"), action: "screen", target: CM, state: "cam", params: { cam: 4 } },
    { at: L("Sarah leaned closer to the screen."), action: "gesture", actor: "sarah", animation: "lean-forward", duration: 2.4 },
    { at: L("It is zoomed out."), action: "screen", target: CM, state: "cam", params: { cam: 4, zoom: true } },
    { at: L("She looked at him, then back at the image."), action: "camera", shot: "faces", duration: 1.4, ease: "inOut" },
    // "Jack changed cameras again. A security light near the southern boundary illuminated
    //  what looked like a curved glass wall ... a bead of water slid down the surface"
    { at: L("Jack changed cameras again."), action: "screen", target: CM, state: "cam", params: { cam: 5 } },
    { at: L("Jack changed cameras again."), action: "camera", shot: "screenMain", duration: 1.6, ease: "inOut" },
    // "A faint vibration passed through the building." / "No seismic event." / again
    { at: L("A faint vibration passed"), action: "shake", amount: 2.5, duration: 1.8 },
    { at: L("A faint vibration passed"), action: "camera", shot: "twoShot", duration: 1.6, ease: "inOut" },
    { at: L("Jack checked the structural monitor."), action: "screen", target: CM, state: "structural" },
    { at: L("The vibration came again"), action: "shake", amount: 2.0, duration: 1.6 },
    { at: L("Sarah looked toward the window."), action: "face", actor: "sarah", direction: "east" },
    { at: L("Sarah came up beside him"), action: "face", actor: "sarah", direction: "north" },
    // "Jack opened the TOMBS event log. One final record remained." / "Boundary event complete."
    { at: L("Jack opened the TOMBS event log."), action: "screen", target: CM, state: "eventlog", text: L("Boundary event complete.") },
    { at: L("Jack opened the TOMBS event log."), action: "camera", shot: "screenMain", duration: 1.6, ease: "inOut" },
    // "Below it was the scale factor." / "Jack stared at the number." -- on Jack, not the number
    { at: L("Jack stared at the number."), action: "camera", shot: "onJack", duration: 1.0, ease: "inOut" },
    { at: L("Sarah covered her mouth."), action: "gesture", actor: "sarah", animation: "look-down", duration: 1.6 },
    { at: L("The computer calmly displayed"), action: "camera", shot: "twoShot", duration: 3.0, ease: "slow" },
    // "Jack opened the boundary record and overlaid it on the settlement map."
    { at: L("Jack opened the boundary record"), action: "scene", name: "The boundary" },
    { at: L("Jack opened the boundary record"), action: "screen", target: MAP, state: "map", params: { overlay: true } },
    { at: L("Jack opened the boundary record"), action: "light", target: "map", intensity: 0.45, duration: 0.6 },
    { at: L("Jack opened the boundary record"), action: "camera", shot: "map", duration: 2.2, ease: "inOut" },
    { at: L("Jack opened the boundary record"), action: "face", actor: "jack", direction: "west" },
    { at: L("Jack opened the boundary record"), action: "face", actor: "sarah", direction: "west" },
    { at: L("Sarah stared at the outline."), action: "camera", shot: "faces", duration: 2.0, ease: "inOut" },
    { at: L("Sarah looked down at her stomach"), action: "gesture", actor: "sarah", animation: "hand-on-belly", arm: "left", duration: 4 },
    { at: L("Sarah looked down at her stomach", { phrase: "toward the darkened town" }), action: "face", actor: "sarah", direction: "east" },
    { at: L("Jack nodded once."), action: "gesture", actor: "jack", animation: "nod", duration: 0.9 },
    // "Jack looked through the window again at the impossible forest beyond the streetlights."
    { at: L("Jack looked through the window again"), action: "face", actor: "jack", direction: "east" },
    { at: L("Jack looked through the window again"), action: "camera", shot: "window2", duration: 3.0, ease: "inOut" },
    // "Sarah reached for his hand." / "Jack..." / "He squeezed her fingers."
    { at: L("Sarah reached for his hand."), action: "camera", shot: "twoShot", duration: 2.0, ease: "inOut" },
    // "Their town had shrunk." / "And the island had not."
    { at: L("Their town had shrunk."), action: "scene", name: "And the island had not" },
    { at: L("Their town had shrunk."), action: "camera", shot: "final", duration: 5.5, ease: "slow" },
    { at: L("And the island had not.", { edge: "end", offset: -0.8 }), action: "fade", color: "#000", to: 1, duration: 1.4, ease: "in", label: "fade out" },
  ],
};
