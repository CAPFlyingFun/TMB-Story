// Chapter 5, "The Edge", the whole chapter over its real audio (11 min). The main control
// room just after midnight: the vibrations moving, the logs too clean, the knock -- Lena,
// "still in her orange utility jacket" -- and the second knock, Mark Jones of perimeter
// security, careful not to step past the threshold. Sarah says no, then yes. Then the
// southern perimeter road (engine/outdoors.js): the pavement ending in a straight line, the
// grass, the readings, the droplet, the clipping, the stems moving in a line, and "the
// outline of several thin legs" between two blades before it is gone behind the ridge.
//
// Every `at` is a line or a phrase in audio/manifests/chapter-05.json (`nth` from 0).
//
// THE SHAPE IN THE GRASS is Joshua's black widow (TRADDOMIUM release "Rigged Black Window -
// No issues", 2026-10-01; his call the same day: "the Black Widow for the legs in the
// shadows"). The chapter gives one instant and an outline, so that is all it gets: a dark
// body crossing between two blades high on the ridge, lit by nothing but the night, and gone.
// Its size is GAME TUNING from the animal's (a female's body about a centimetre, its legs
// reaching three or four), at the settlement's 1:180: some five and a half metres, legs and
// all.

import { L, plus, shot3 } from "./metric.js";
import { controlSet, SPOT, CM, CS, MAP, M, walkM, placeM } from "./controlSet.js";

const EDGE = -15; // where the pavement stops (engine/outdoors.js)
const control = controlSet({
  jack: SPOT.primary,
  sarah: SPOT.secondSeat,
  props: { cups: 1, case: 1 },
  screens: { [CM]: { state: "status", params: {} }, [CS]: { state: "reports", params: { rows: 5 } }, [MAP]: { state: "homes", params: { lit: 0.6 } } },
});
// Sarah starts the chapter sitting, as Chapter 4 left her
control.actors.sarah.pose = "sitting";

// THE ROAD. The same cast (one actor in every set); the cut puts them on their marks.
const south = {
  world: M.builtWorld("outdoors", {
    roomOptions: { variant: "south" },
    creatures: {
      widow: { model: "../assets/models/black-widow.glb", lengthM: 5.5, roughness: 0.32, prop: "widow", show: "widowShow", stride: 2.4,
        // along the ridge's crest between the blades, then down its far side
        path: [[-16, 10.6, -28], [-6, 11.2, -28], [3, 10.8, -28.4], [9, 6, -33]] },
    },
  }),
  props: { sky: 0, headlights: 0, torch: 0, rustle: 0, vehicle: 1, leaving: 0, widow: 0, widowShow: 0 },
  actors: control.actors,
  screens: {},
  lights: {},
  shots: {
    road: shot3([0.4, 2.4, 6], [0.3, 2.2, -16], 50),
    arrive: shot3([3.6, 1.8, -4], [0, 1.4, -14], 56),
    edgeWide: shot3([4.5, 1.7, -6.5], [-1, 3.5, -18], 66),
    tower: shot3([0.2, 1.0, -11.5], [2.4, 9, -16], 70),
    pair: shot3([-1.8, 1.6, -10.4], [0.8, 1.4, -14], 50),
    jackClose: shot3([0.6, 1.55, -12.2], [1.4, 1.45, -14.2], 44),
    edgeLow: shot3([-2.4, 0.35, -14.6], [4, 0.2, -15.1], 60),
    hand: shot3([0.4, 0.9, -13.8], [1.4, 0.3, -15.2], 50),
    droplet: shot3([-2.9, 1.25, -12.9], [-1.0, 0.6, -15.75], 44),
    pale: shot3([2.2, 1.6, -12.4], [5.6, 0.2, -16.0], 48),
    nail: shot3([4.2, 1.1, -13.9], [5.6, 0.1, -16.1], 40),
    nailTop: shot3([5.4, 2.6, -14.2], [5.6, 0, -16.2], 46),
    lookUp: shot3([3.6, 1.2, -12.6], [3.0, 14, -22], 72),
    rustle: shot3([2.2, 1.7, -8.5], [-12, 9, -40], 64),
    ridge: shot3([0.6, 1.5, -11], [-3, 10.5, -25], 62),
    away: shot3([1.0, 1.6, -13.4], [1.6, 1.2, 10], 60),
    behind: shot3([1.2, 2.0, 2], [-1, 6, -26], 60),
  },
  camera: { initial: { shot: "road" }, name: "The southern perimeter" },
};

// Mark at the door, Lena at the console behind Jack
const LENA_AT = SPOT.lena, MARK_DOOR = [-1.6, 1.75];
// on the road: beside the vehicle, at the edge, along it
const OUT = { jackCar: [0.9, -9.6], markCar: [2.7, -9.4], jackEdge: [1.3, -14.25], markEdge: [-0.4, -13.7], jackNail: [4.3, -14.3], markNail: [3.0, -13.6] };

export default {
  id: "ch05-edge",
  title: "Chapter 5 · The Edge",
  audio: "../audio/exports/chapter-05-drama.mp3",
  manifest: "../audio/manifests/chapter-05.json",
  range: { start: { seg: 0 }, end: { line: "Behind them, the grass kept moving.", edge: "end" } },
  fadeFromBlack: true,
  initialSet: "control",
  sets: { control, south },

  events: [
    // "Then the building vibrated again. The laughter disappeared."
    { at: { seg: 0 }, action: "scene", name: "The vibrations" },
    { at: { seg: 0 }, action: "fade", to: 0, duration: 1.0, ease: "out" },
    { at: { seg: 0 }, action: "shake", amount: 3.5, duration: 2.0 },
    { at: { seg: 0 }, action: "camera", shot: "roomWide", duration: 0 },
    { at: L("Jack unmuted the channel"), action: "screen", target: CS, state: "southcam", params: {} },
    { at: L("Jack unmuted the channel"), action: "gesture", actor: "jack", animation: "type", duration: 2 },
    { at: L("Jack unmuted the channel"), action: "camera", shot: "consoles", duration: 1.8, ease: "inOut" },
    { at: L("Sarah pulled up the times."), action: "gesture", actor: "sarah", animation: "type", duration: 2 },
    { at: L("She looked at him."), action: "face", actor: "sarah", direction: "west" },
    // "Jack overlaid the reports on the settlement map."
    { at: L("Jack overlaid the reports"), action: "screen", target: MAP, state: "vibmap", params: {} },
    { at: L("Jack overlaid the reports"), action: "light", target: "map", color: "rgba(255,160,80,0.5)", intensity: 0.45, duration: 0.5 },
    { at: L("Jack overlaid the reports"), action: "face", actor: "jack", direction: "west" },
    { at: L("Jack overlaid the reports"), action: "camera", shot: "mapClose", duration: 2.0, ease: "inOut" },
    { at: L("Or whatever is causing them is."), action: "camera", shot: "map", duration: 1.6, ease: "inOut" },
    { at: L("Lena spoke from the console."), action: "screen", target: CM, state: "call", params: { who: "LENA ORTIZ", sub: "UTILITY CONTROL" } },
    { at: L("Lena spoke from the console."), action: "face", actor: "jack", direction: "north" },
    { at: L("Lena spoke from the console."), action: "camera", shot: "twoShot", duration: 1.6, ease: "inOut" },
    // "Jack closed the vibration map and opened the TOMBS event record again."
    { at: L("Jack closed the vibration map"), action: "screen", target: MAP, state: "map", params: { overlay: true } },
    { at: L("Jack closed the vibration map"), action: "screen", target: CM, state: "complete", params: {} },
    { at: L("Jack closed the vibration map"), action: "camera", shot: "screenMain", duration: 2.0, ease: "inOut" },
    { at: L("Sarah noticed where he had gone."), action: "camera", shot: "faces", duration: 1.4, ease: "inOut" },
    { at: L("Jack nodded."), action: "gesture", actor: "jack", animation: "nod", duration: 0.9 },
    { at: L("He searched the event sequence"), action: "screen", target: CM, state: "source", params: {} },
    { at: L("He searched the event sequence"), action: "gesture", actor: "jack", animation: "type", duration: 5 },
    { at: L("He searched the event sequence"), action: "camera", shot: "screenMain", duration: 1.6, ease: "inOut" },
    // "Sarah rolled her chair closer."
    { at: L("Sarah rolled her chair closer."), action: "move", actor: "sarah", x: M.P(0.7, -4.15)[0], y: M.P(0.7, -4.15)[1], duration: 1.4, ease: "inOut" },
    { at: L("Sarah rolled her chair closer."), action: "face", actor: "sarah", direction: "west" },
    { at: L("Sarah rolled her chair closer."), action: "camera", shot: "twoShot", duration: 1.6, ease: "inOut" },
    { at: L("Sarah studied the screen."), action: "face", actor: "sarah", direction: "north" },
    { at: L("Jack opened the permissions table."), action: "screen", target: CM, state: "source", params: { perms: true } },
    { at: L("Jack opened the permissions table."), action: "camera", shot: "screenMain", duration: 1.4, ease: "inOut" },
    { at: L("He closed the window"), action: "screen", target: CM, state: "status", params: {} },
    { at: L("He closed the window"), action: "camera", shot: "onJack", duration: 1.6, ease: "inOut" },
    // THE KNOCK. "Lena stood outside, still in her orange utility jacket."
    { at: L("A knock sounded at the control-room door."), action: "scene", name: "Lena" },
    placeM("lena", L("A knock sounded"), ...SPOT.doorOut),
    { at: L("A knock sounded"), action: "show", actor: "lena" },
    { at: L("A knock sounded"), action: "face", actor: "lena", direction: "north" },
    { at: L("Both turned."), action: "face", actor: "jack", direction: "south" },
    { at: L("Both turned."), action: "face", actor: "sarah", direction: "south" },
    { at: L("Both turned."), action: "prop", target: "door", to: 1, duration: 1.0 },
    { at: L("Both turned."), action: "camera", shot: "door", duration: 1.2, ease: "inOut" },
    { at: L("Lena stood outside"), action: "gesture", actor: "lena", animation: "wave", duration: 2 },
    { at: L("Lena stood outside"), action: "camera", shot: "doorClose", duration: 2.0, ease: "inOut" },
    { at: L("Jack pointed at her."), action: "gesture", actor: "jack", animation: "point", duration: 1.4 },
    { at: L("Jack pointed at her."), action: "camera", shot: "door", duration: 1.4, ease: "inOut" },
    { at: L("Sarah looked at him."), action: "face", actor: "sarah", direction: "west" },
    // "Lena walked to the console and stared through the reinforced window at the dormant
    //  TOMBS Array."
    ...walkM("lena", L("Lena walked to the console"), SPOT.doorOut, LENA_AT, 4.0, "north", "north", 6),
    { at: L("Lena walked to the console"), action: "face", actor: "jack", direction: "north" },
    { at: L("Lena walked to the console"), action: "face", actor: "sarah", direction: "north" },
    { at: L("Lena walked to the console"), action: "camera", shot: "fromDoor", duration: 3.0, ease: "inOut" },
    { at: L("It looks disappointingly normal"), action: "camera", shot: "window", duration: 2.4, ease: "inOut" },
    { at: L("Give it time."), action: "camera", shot: "lenaShot", duration: 1.4, ease: "inOut" },
    // THE SECOND KNOCK: Mark Jones, "careful not to step past the threshold"
    { at: L("A second knock came"), action: "scene", name: "Mark Jones" },
    placeM("mark", L("A second knock came"), ...MARK_DOOR),
    { at: L("A second knock came"), action: "show", actor: "mark" },
    { at: L("A second knock came"), action: "face", actor: "mark", direction: "north" },
    { at: L("A second knock came"), action: "face", actor: "jack", direction: "south" },
    { at: L("A second knock came"), action: "face", actor: "sarah", direction: "south" },
    { at: L("A second knock came"), action: "face", actor: "lena", direction: "south" },
    { at: L("A second knock came"), action: "camera", shot: "door", duration: 1.4, ease: "inOut" },
    { at: L("A security officer stood just outside it"), action: "camera", shot: "doorClose", duration: 2.2, ease: "inOut" },
    { at: L("He nodded down the hallway behind him."), action: "face", actor: "mark", direction: "east" },
    { at: L("Mark Jones, perimeter security."), action: "face", actor: "mark", direction: "north" },
    { at: L("Mark said, and stepped back"), action: "face", actor: "mark", direction: "east" },
    ...walkM("mark", L("Mark said, and stepped back"), MARK_DOOR, SPOT.hallEast, 2.6, "east", null, 4),
    { at: L("Mark said, and stepped back", { offset: 2.7 }), action: "hide", actor: "mark" },
    // "Jack looked at the camera feeds again." / "I need to go outside." / "No."
    { at: L("Jack looked at the camera feeds again."), action: "face", actor: "jack", direction: "north" },
    { at: L("Jack looked at the camera feeds again."), action: "screen", target: CM, state: "southcam", params: {} },
    { at: L("Jack looked at the camera feeds again."), action: "camera", shot: "screenMain", duration: 1.8, ease: "inOut" },
    { at: L("He would learn more standing at that line"), action: "camera", shot: "onJack", duration: 2.0, ease: "inOut" },
    { at: L("No.", { nth: 2 }), action: "face", actor: "sarah", direction: "west" },
    { at: L("The answer came so fast"), action: "face", actor: "jack", direction: "east" },
    { at: L("The answer came so fast"), action: "camera", shot: "faces", duration: 1.0, ease: "inOut" },
    { at: L("I know. But the cameras aren't enough."), action: "gesture", actor: "jack", animation: "small-hand-gesture", duration: 3 },
    { at: L("Not into the wilderness."), action: "gesture", actor: "jack", animation: "small-hand-gesture", duration: 4 },
    { at: L("Not into the wilderness."), action: "camera", shot: "twoShot", duration: 2.0, ease: "inOut" },
    // "She looked past him at the boundary map, then at the frozen shape on the security feed"
    { at: L("She looked past him at the boundary map"), action: "face", actor: "sarah", direction: "north" },
    { at: L("She looked past him at the boundary map"), action: "screen", target: CS, state: "southcam", params: { frozen: true } },
    { at: L("She looked past him at the boundary map"), action: "camera", shot: "screenSecond", duration: 1.8, ease: "inOut" },
    { at: L("Okay. You can go."), action: "face", actor: "sarah", direction: "west" },
    { at: L("Okay. You can go."), action: "camera", shot: "faces", duration: 1.2, ease: "inOut" },
    // "Sarah stood and picked up her tablet."
    { at: L("Sarah stood and picked up her tablet."), action: "stand", actor: "sarah" },
    { at: L("Sarah stood and picked up her tablet."), action: "prop", target: "case", to: 0, duration: 0 },
    { at: L("Lena raised a hand."), action: "gesture", actor: "lena", animation: "wave", duration: 1.6 },
    { at: L("Lena raised a hand."), action: "face", actor: "lena", direction: "west" },
    { at: L("Lena raised a hand."), action: "camera", shot: "lenaShot", duration: 1.2, ease: "inOut" },
    // "Sarah crossed to him and handed him a small environmental sensor"
    ...walkM("sarah", L("Sarah crossed to him"), [0.7, -4.15], [-0.45, -4.0], 1.6, "west", "west", 3),
    { at: L("Sarah crossed to him"), action: "gesture", actor: "sarah", animation: "reach", duration: 2.2 },
    { at: L("Sarah crossed to him"), action: "camera", shot: "faces", duration: 1.6, ease: "inOut" },
    { at: L("She raised an eyebrow."), action: "camera", shot: "onSarah", duration: 1.0, ease: "inOut" },
    // "He tucked the sensor into his jacket and stopped at the door."
    ...walkM("jack", L("He tucked the sensor"), SPOT.primary, SPOT.doorIn, 3.4, "south", "north", 6),
    { at: L("He tucked the sensor"), action: "face", actor: "sarah", direction: "south" },
    { at: L("He tucked the sensor"), action: "camera", shot: "fromDoor", duration: 3.0, ease: "inOut" },
    { at: L("Keep safe."), action: "camera", shot: "door", duration: 1.4, ease: "inOut" },
    { at: L("Jack glanced at her stomach."), action: "gesture", actor: "jack", animation: "look-down", duration: 1.4 },
    { at: L("Sarah rested a hand against it."), action: "gesture", actor: "sarah", animation: "hand-on-belly", arm: "left", duration: 4 },
    { at: L("Love you too."), action: "camera", shot: "doorClose", duration: 1.6, ease: "inOut" },
    { at: L("she added, already turning back"), action: "face", actor: "sarah", direction: "north" },
    { at: L("Going."), action: "face", actor: "jack", direction: "south" },
    ...walkM("jack", L("Going."), SPOT.doorIn, SPOT.doorOut, 1.4, "south", null, 3),

    // ---------------------------------------------------------------- the road
    // "Jack found Mark waiting by the utility vehicle." The ride, the houses still dark.
    { at: L("Jack found Mark waiting"), action: "set", set: "south", label: "cut to the southern road" },
    { at: L("Jack found Mark waiting"), action: "scene", name: "The southern road" },
    { at: L("Jack found Mark waiting"), action: "hide", actor: "jack" },
    { at: L("Jack found Mark waiting"), action: "hide", actor: "sarah" },
    { at: L("Jack found Mark waiting"), action: "hide", actor: "lena" },
    { at: L("Jack found Mark waiting"), action: "hide", actor: "mark" },
    { at: L("Jack found Mark waiting"), action: "prop", target: "headlights", to: 1, duration: 0 },
    { at: L("Jack found Mark waiting"), action: "camera", shot: "road", duration: 0 },
    // the vehicle comes up the road to the end of it
    { at: L("Most of the houses along the route"), action: "prop", target: "vehicle", to: 0, until: L("The pavement ended in a perfectly straight line."), ease: "out" },
    { at: L("Mark glanced over."), action: "camera", shot: "arrive", duration: 6, ease: "slow" },
    // "The pavement ended in a perfectly straight line. Beyond it rose wilderness."
    { at: L("The pavement ended in a perfectly straight line."), action: "camera", shot: "edgeWide", duration: 3.0, ease: "inOut" },
    { at: L("Beyond it rose wilderness."), action: "camera", shot: "behind", duration: 2.4, ease: "inOut" },
    // "Jack stepped out of the vehicle."
    placeM("jack", L("Jack stepped out of the vehicle."), ...OUT.jackCar),
    placeM("mark", L("Jack stepped out of the vehicle."), ...OUT.markCar),
    { at: L("Jack stepped out of the vehicle."), action: "show", actor: "jack" },
    { at: L("Jack stepped out of the vehicle."), action: "show", actor: "mark" },
    { at: L("Jack stepped out of the vehicle."), action: "face", actor: "jack", direction: "north" },
    { at: L("Jack stepped out of the vehicle."), action: "face", actor: "mark", direction: "north" },
    { at: L("Jack stepped out of the vehicle."), action: "camera", shot: "arrive", duration: 1.2, ease: "inOut" },
    ...walkM("jack", L("The nearest blade of grass towered"), OUT.jackCar, OUT.jackEdge, 3.6, "north", "north", 6),
    ...walkM("mark", L("The nearest blade of grass towered", { offset: 0.8 }), OUT.markCar, OUT.markEdge, 3.6, "northwest", "north", 6),
    { at: L("The nearest blade of grass towered"), action: "camera", shot: "tower", duration: 7, ease: "slow" },
    { at: L("That's grass."), action: "camera", shot: "pair", duration: 1.6, ease: "inOut" },
    { at: L("Jack lifted the sensor."), action: "gesture", actor: "jack", animation: "reach", duration: 3 },
    { at: L("He held the device toward the boundary."), action: "gesture", actor: "jack", animation: "reach", duration: 5 },
    { at: L("He held the device toward the boundary."), action: "camera", shot: "jackClose", duration: 1.6, ease: "inOut" },
    // "Jack crouched near the end of the pavement. The boundary itself was invisible."
    { at: L("Jack crouched near the end of the pavement."), action: "gesture", actor: "jack", animation: "look-down", duration: 3 },
    { at: L("Jack crouched near the end of the pavement."), action: "gesture", actor: "jack", animation: "lean-forward", duration: 3 },
    { at: L("The boundary itself was invisible."), action: "camera", shot: "edgeLow", duration: 3.0, ease: "inOut" },
    { at: L("He reached toward the edge."), action: "gesture", actor: "jack", animation: "reach", duration: 4 },
    { at: L("He reached toward the edge."), action: "camera", shot: "hand", duration: 1.6, ease: "inOut" },
    { at: L("Jack let out a chuckle"), action: "camera", shot: "pair", duration: 1.8, ease: "inOut" },
    // "Mark shone his light across the soil. Something glittered near the base of the ridge."
    { at: L("Mark shone his light across the soil."), action: "prop", target: "torch", to: 1, duration: 0.3 },
    { at: L("Mark shone his light across the soil."), action: "gesture", actor: "mark", animation: "point", duration: 3 },
    { at: L("A droplet of water clung"), action: "camera", shot: "droplet", duration: 2.4, ease: "inOut" },
    { at: L("Mark took a step back."), action: "move", actor: "mark", x: M.P(-0.6, -13.1)[0], y: M.P(-0.6, -13.1)[1], duration: 0.8, ease: "out" },
    { at: L("Jack watched the surface of the droplet tremble."), action: "camera", shot: "droplet", duration: 3.0, ease: "slow" },
    { at: L("Don't touch it."), action: "camera", shot: "pair", duration: 1.4, ease: "inOut" },
    // "Something pale lay half buried in the soil." / "He moved several steps down the pavement"
    { at: L("Jack stood and swept his light"), action: "face", actor: "jack", direction: "east" },
    { at: L("Something pale lay half buried"), action: "camera", shot: "pale", duration: 2.4, ease: "inOut" },
    ...walkM("jack", L("He moved several steps down the pavement"), OUT.jackEdge, OUT.jackNail, 3.0, "east", "north", 5),
    ...walkM("mark", L("He moved several steps down the pavement", { offset: 0.6 }), [-0.6, -13.1], OUT.markNail, 3.2, "east", "northeast", 5),
    { at: L("Mark swept his light toward it."), action: "gesture", actor: "mark", animation: "point", duration: 2.4 },
    { at: L("Hey Jack, what's that look like"), action: "camera", shot: "pale", duration: 1.6, ease: "inOut" },
    // through the wrist camera
    { at: L("Jack studied the shape through his wrist camera."), action: "gesture", actor: "jack", animation: "look-down", duration: 6 },
    { at: L("Jack studied the shape through his wrist camera."), action: "camera", shot: "nail", duration: 2.0, ease: "inOut" },
    { at: L("It's not a UFO, Mark."), action: "camera", shot: "pair", duration: 1.2, ease: "inOut" },
    { at: L("Jack zoomed in further."), action: "camera", shot: "nailTop", duration: 4.0, ease: "slow" },
    { at: L("Jack increased the magnification."), action: "camera", shot: "nail", duration: 2.6, ease: "inOut" },
    { at: L("Mark squinted at the screen."), action: "camera", shot: "pair", duration: 1.4, ease: "inOut" },
    { at: L("Jack went still."), action: "camera", shot: "jackClose", duration: 1.4, ease: "inOut" },
    { at: L("He stared at the object."), action: "camera", shot: "nailTop", duration: 5, ease: "slow" },
    { at: L("Now it stretched longer than Jack was tall."), action: "camera", shot: "pale", duration: 2.6, ease: "inOut" },
    // "The grass above them shifted. Jack looked up. A vibration rolled through the ground."
    { at: L("The grass above them shifted."), action: "scene", name: "Something's coming" },
    { at: L("Jack looked up."), action: "gesture", actor: "jack", animation: "look-up", duration: 3 },
    { at: L("Jack looked up."), action: "camera", shot: "lookUp", duration: 2.0, ease: "inOut" },
    { at: L("A vibration rolled through the ground."), action: "shake", amount: 5, duration: 2.0 },
    { at: L("Something was moving through the wilderness."), action: "prop", target: "rustle", to: 0.35, duration: 4 },
    { at: L("Mark raised his light."), action: "gesture", actor: "mark", animation: "point", duration: 3 },
    { at: L("Jack backed toward the vehicle."), action: "face", actor: "jack", direction: "north" },
    { at: L("Jack backed toward the vehicle."), action: "move", actor: "jack", x: M.P(2.6, -11.6)[0], y: M.P(2.6, -11.6)[1], duration: 2.4, ease: "inOut" },
    { at: L("Jack backed toward the vehicle."), action: "move", actor: "mark", x: M.P(2.4, -10.2)[0], y: M.P(2.4, -10.2)[1], duration: 2.6, ease: "inOut" },
    // "The grass stems moved one after another in the darkness ... in a line approaching"
    { at: L("The grass stems moved one after another"), action: "prop", target: "rustle", to: 0.95, duration: 6.5, ease: "linear" },
    { at: L("The grass stems moved one after another"), action: "camera", shot: "rustle", duration: 2.4, ease: "inOut" },
    // "He climbed into the vehicle without taking his eyes off the boundary."
    { at: L("He climbed into the vehicle"), action: "hide", actor: "jack" },
    { at: L("He climbed into the vehicle", { offset: 0.6 }), action: "hide", actor: "mark" },
    { at: L("He climbed into the vehicle"), action: "camera", shot: "ridge", duration: 2.6, ease: "inOut" },
    // "A dark shape passed between two enormous blades of grass. For one instant, Jack caught
    //  the outline of several thin legs. Then it vanished behind the soil ridge."
    { at: L("A dark shape passed between"), action: "prop", target: "widowShow", to: 1, duration: 0 },
    { at: L("A dark shape passed between"), action: "prop", target: "widow", to: 0.78, until: L("Then it vanished behind the soil ridge."), ease: "linear" },
    { at: L("Then it vanished behind the soil ridge."), action: "prop", target: "widow", to: 1, duration: 1.6, ease: "in" },
    { at: L("He shut the door."), action: "prop", target: "widowShow", to: 0, duration: 0 },
    // "The vehicle accelerated away from the boundary. Behind them, the grass kept moving."
    { at: L("He shut the door."), action: "prop", target: "leaving", to: 1, duration: 0 },
    { at: L("He shut the door."), action: "camera", shot: "away", duration: 1.2, ease: "inOut" },
    { at: L("The vehicle accelerated away"), action: "prop", target: "vehicle", to: 1, duration: 4.0, ease: "in" },
    { at: L("Behind them, the grass kept moving."), action: "prop", target: "rustle", to: 1.3, duration: 4, ease: "linear" },
    { at: L("Behind them, the grass kept moving."), action: "camera", shot: "behind", duration: 3.0, ease: "inOut" },
    { at: L("Behind them, the grass kept moving.", { edge: "end", offset: -0.4 }), action: "fade", color: "#000", to: 1, duration: 1.6, ease: "in", label: "fade out" },
  ],
};
