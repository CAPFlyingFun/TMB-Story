// Chapter 9, "Three Weeks", the whole chapter over its real audio (7 min). The buried record
// opens: a maintenance tablet, six minutes on the network three weeks ago, at the equipment
// shed by the north pumping station; the checkout log that will not give a name; Sarah's
// badge-tracking overlay; a second impact on the eastern array, twelve minutes before the
// first. Then Jack and Mark walk out to the eastern sensor marker in the last of the dark
// (engine/outdoors.js, "east"): grass "like a colonnade with no ceiling", dew "large enough
// to swallow a person whole", no crater -- only a blade of grass pressed flat into the dirt
// -- a bird far off, and Sarah on the radio: "I found the badge."
//
// Every `at` is a line or a phrase in audio/manifests/chapter-09.json (`nth` from 0).
// The checkout log and the badge are drawn unreadable: the chapter names nobody on them.

import { L, plus, shot3 } from "./metric.js";
import { controlSet, SPOT, CM, CS, MAP, M, walkM, placeM } from "./controlSet.js";

const JACK_SEAT = [-1.1, -4.1];
const control = controlSet({
  jack: JACK_SEAT,
  sarah: [-0.2, -3.85],
  lena: [-0.75, -3.5],
  mark: SPOT.mark,
  lenaShown: true,
  markShown: true,
  props: { cups: 4 },
  screens: { [CM]: { state: "loading", params: { from: 0 } }, [CS]: { state: "phase", params: { clock: "03:41" } }, [MAP]: { state: "selection", params: { survey: true, step: 4 } } },
});
control.actors.jack.pose = "sitting";
control.actors.mark.facing = "west";

// THE WALK EAST. The path runs north (-z) from near the building to the marker at z = -46.
const east = {
  world: M.builtWorld("outdoors", { roomOptions: { variant: "east" } }),
  props: { sky: 0.35, torch: 1, torchZ: -6 },
  actors: control.actors,
  screens: {},
  lights: {},
  shots: {
    start: shot3([1.6, 1.7, 0.5], [0, 1.6, -14], 54),
    colonnade: shot3([0.4, 1.0, -6], [0, 9, -40], 70),
    follow1: shot3([1.4, 1.65, -10], [0, 1.5, -22], 50),
    follow2: shot3([-1.2, 1.7, -24], [0.2, 1.5, -36], 50),
    dew: shot3([0.6, 1.4, -20], [6, 14, -30], 60),
    marker: shot3([-1.6, 1.6, -40.5], [1.8, 0.8, -46], 54),
    flat: shot3([1.2, 1.5, -43.2], [3.6, 0.1, -47.5], 50),
    pair: shot3([2.6, 1.4, -42.4], [1.2, 0.9, -45], 50),
    sky: shot3([0.6, 1.6, -42], [-4, 14, -70], 64),
    radio: shot3([0.0, 1.6, -42.6], [1.2, 1.5, -45.2], 44),
  },
  camera: { initial: { shot: "start" }, name: "The eastern marker" },
};

const PATH = { start: [0.4, -4.5], mid: [0.2, -24], jackMarker: [1.1, -44.6], markMarker: [-0.2, -44.0] };

export default {
  id: "ch09-three-weeks",
  title: "Chapter 9 · Three Weeks",
  audio: "../audio/exports/chapter-09-drama.mp3",
  manifest: "../audio/manifests/chapter-09.json",
  range: { start: { seg: 0 }, end: { line: "I need you back here first.", edge: "end" } },
  fadeFromBlack: true,
  initialSet: "control",
  sets: { control, east },

  events: [
    // "The file opened onto a short list of coordinates and a single line of metadata"
    { at: { seg: 0 }, action: "scene", name: "The record" },
    { at: { seg: 0 }, action: "fade", to: 0, duration: 1.0, ease: "out" },
    { at: { seg: 0 }, action: "camera", shot: "screenMain", duration: 0 },
    { at: L("Sarah read over his shoulder."), action: "camera", shot: "consoles", duration: 1.6, ease: "inOut" },
    { at: L("Jack expanded the record."), action: "screen", target: CM, state: "tablet", params: {}, flash: 0.3 },
    { at: L("Jack expanded the record."), action: "gesture", actor: "jack", animation: "type", duration: 2 },
    { at: L("Jack expanded the record."), action: "camera", shot: "screenMain", duration: 1.4, ease: "inOut" },
    { at: L("Lena crossed her arms."), action: "camera", shot: "lenaShot", duration: 1.4, ease: "inOut" },
    { at: L("Sarah frowned at the coordinates."), action: "camera", shot: "faces", duration: 1.4, ease: "inOut" },
    // "Jack cross-referenced the device ID against the facilities map. A red marker appeared"
    { at: L("Jack cross-referenced the device ID"), action: "screen", target: MAP, state: "facility", params: { shed: true, title: "FACILITIES MAP · DEVICE LOCATION" } },
    { at: L("Jack cross-referenced the device ID"), action: "light", target: "map", color: "rgba(255,80,60,0.45)", intensity: 0.45, duration: 0.5 },
    { at: L("Jack cross-referenced the device ID"), action: "face", actor: "jack", direction: "west" },
    { at: L("Jack cross-referenced the device ID"), action: "camera", shot: "map", duration: 1.8, ease: "inOut" },
    { at: L("Mark straightened."), action: "camera", shot: "roomWide", duration: 1.4, ease: "inOut" },
    { at: L("Nobody said anything for a moment."), action: "camera", shot: "consoles", duration: 2.0, ease: "inOut" },
    { at: L("Sarah's voice stayed steady"), action: "camera", shot: "onSarah", duration: 1.4, ease: "inOut" },
    // the checkout log
    { at: L("Jack pulled the tablet's checkout log."), action: "face", actor: "jack", direction: "north" },
    { at: L("Jack pulled the tablet's checkout log."), action: "screen", target: CM, state: "checkout", params: {} },
    { at: L("Jack pulled the tablet's checkout log."), action: "gesture", actor: "jack", animation: "type", duration: 2 },
    { at: L("Jack pulled the tablet's checkout log."), action: "camera", shot: "screenMain", duration: 1.6, ease: "inOut" },
    { at: L("Lena scrolled through the list herself"), action: "gesture", actor: "lena", animation: "lean-forward", duration: 5 },
    { at: L("Lena scrolled through the list herself"), action: "camera", shot: "lenaShot", duration: 1.4, ease: "inOut" },
    // "Sarah moved to the second console and pulled up the personnel access system."
    ...walkM("sarah", L("Sarah moved to the second console"), [-0.2, -3.85], SPOT.second, 2.4, "east", "north", 4),
    { at: L("Sarah moved to the second console"), action: "camera", shot: "consoles", duration: 2.0, ease: "inOut" },
    { at: L("Sarah pulled up a badge-tracking overlay"), action: "screen", target: CS, state: "facility", params: { badges: true, title: "BADGE TRACKING · DOOR LOGS" } },
    { at: L("Sarah pulled up a badge-tracking overlay"), action: "gesture", actor: "sarah", animation: "type", duration: 3 },
    { at: L("Sarah pulled up a badge-tracking overlay"), action: "camera", shot: "screenSecond", duration: 1.6, ease: "inOut" },
    { at: L("Sarah looked up at him."), action: "face", actor: "sarah", direction: "west" },
    { at: L("Sarah looked up at him."), action: "camera", shot: "faces", duration: 1.4, ease: "inOut" },
    { at: L("Mark cleared his throat."), action: "camera", shot: "roomWide", duration: 1.4, ease: "inOut" },
    { at: L("It might. Add it to the list."), action: "face", actor: "sarah", direction: "north" },
    { at: L("Jack watched her work for a moment"), action: "camera", shot: "window2", duration: 5, ease: "slow" },
    { at: L("Unless it hadn't walked there at all."), action: "camera", shot: "onJack", duration: 1.6, ease: "inOut" },
    // "He turned to Lena." -- the perimeter sensors; Lena works at the mapping display
    { at: L("He turned to Lena."), action: "face", actor: "jack", direction: "east" },
    ...walkM("lena", L("Looking for what?"), [-0.75, -3.5], SPOT.map, 2.0, "west", "west", 3),
    { at: L("She worked in silence"), action: "screen", target: MAP, state: "perimeter", params: {} },
    { at: L("She worked in silence"), action: "gesture", actor: "lena", animation: "point", duration: 2 },
    { at: L("She worked in silence"), action: "camera", shot: "map", duration: 1.8, ease: "inOut" },
    // "Jack crossed to her console. A second impact had registered on the eastern sensor array"
    { at: L("Jack crossed to her console."), action: "stand", actor: "jack" },
    ...walkM("jack", L("Jack crossed to her console.", { offset: 0.3 }), JACK_SEAT, [-1.8, -3.3], 1.8, "west", "west", 3),
    { at: L("Jack crossed to her console."), action: "screen", target: MAP, state: "perimeter", params: { east: true } },
    { at: L("Jack crossed to her console.", { phrase: "twelve" }), action: "screen", target: MAP, state: "facility", params: { impacts: 2, title: "PERIMETER · IMPACTS" } },
    { at: L("Jack crossed to her console."), action: "camera", shot: "mapClose", duration: 2.0, ease: "inOut" },
    { at: L("Two impacts. Different locations."), action: "camera", shot: "map", duration: 1.4, ease: "inOut" },
    { at: L("Jack did the math out loud"), action: "camera", shot: "onJack", duration: 1.4, ease: "inOut" },
    { at: L("The room absorbed that in silence."), action: "camera", shot: "roomWide", duration: 2.4, ease: "inOut" },
    { at: L("Jack looked at Sarah."), action: "face", actor: "jack", direction: "east" },
    { at: L("Jack looked at Sarah."), action: "face", actor: "sarah", direction: "west" },
    { at: L("Jack looked at Sarah."), action: "camera", shot: "faces", duration: 1.4, ease: "inOut" },
    // "Jack grabbed a handheld light from the equipment rack and followed Mark toward the door."
    ...walkM("mark", L("Jack grabbed a handheld light"), SPOT.mark, SPOT.doorIn, 2.8, "south", "south", 5),
    ...walkM("jack", L("Jack grabbed a handheld light", { offset: 0.8 }), [-1.8, -3.3], [-1.3, 0.2], 3.4, "south", "north", 6),
    { at: L("Jack grabbed a handheld light"), action: "prop", target: "door", to: 1, duration: 1.0 },
    { at: L("Jack grabbed a handheld light"), action: "camera", shot: "fromDoor", duration: 2.4, ease: "inOut" },
    { at: L("Find that badge ping."), action: "camera", shot: "door", duration: 1.2, ease: "inOut" },
    { at: L("The door sealed behind them"), action: "prop", target: "door", to: 0, duration: 1.0 },
    { at: L("The door sealed behind them"), action: "hide", actor: "jack" },
    { at: L("The door sealed behind them"), action: "hide", actor: "mark" },
    { at: L("The door sealed behind them"), action: "camera", shot: "roomWide", duration: 2.0, ease: "inOut" },

    // ---------------------------------------------------------------- outside
    { at: L("Outside, the air had shifted."), action: "set", set: "east", label: "cut to the walk east" },
    { at: L("Outside, the air had shifted."), action: "scene", name: "The walk east" },
    { at: L("Outside, the air had shifted."), action: "hide", actor: "sarah" },
    { at: L("Outside, the air had shifted."), action: "hide", actor: "lena" },
    placeM("jack", L("Outside, the air had shifted."), ...PATH.start),
    placeM("mark", L("Outside, the air had shifted."), PATH.start[0] - 1.1, PATH.start[1] - 0.6),
    { at: L("Outside, the air had shifted."), action: "show", actor: "jack" },
    { at: L("Outside, the air had shifted."), action: "show", actor: "mark" },
    { at: L("Outside, the air had shifted."), action: "camera", shot: "start", duration: 0 },
    // the sky softening "at its edges" through the walk
    { at: L("Outside, the air had shifted."), action: "prop", target: "sky", to: 0.7, until: L("I need you back here first.", { edge: "end" }), ease: "linear" },
    ...walkM("jack", L("Outside, the air had shifted.", { offset: 1.5 }), PATH.start, PATH.mid, 34, "north", null, 14),
    ...walkM("mark", L("Outside, the air had shifted.", { offset: 1.8 }), [PATH.start[0] - 1.1, PATH.start[1] - 0.6], [PATH.mid[0] - 1.1, PATH.mid[1] - 0.6], 34, "north", null, 14),
    { at: L("Outside, the air had shifted.", { offset: 1.5 }), action: "prop", target: "torchZ", to: -24, duration: 34, ease: "linear" },
    { at: L("Mark followed the beam"), action: "camera", shot: "follow1", duration: 6, ease: "slow" },
    { at: L("Mark didn't respond right away."), action: "camera", shot: "colonnade", duration: 4, ease: "slow" },
    // "They walked in silence for a while ... blades of grass rising on either side of them
    //  like a colonnade with no ceiling. Dew hung from the tips"
    ...walkM("jack", L("They walked in silence for a while"), PATH.mid, PATH.jackMarker, 26, "north", "north", 12),
    ...walkM("mark", L("They walked in silence for a while", { offset: 0.3 }), [PATH.mid[0] - 1.1, PATH.mid[1] - 0.6], PATH.markMarker, 26, "north", "north", 12),
    { at: L("They walked in silence for a while"), action: "prop", target: "torchZ", to: -44, duration: 26, ease: "linear" },
    { at: L("They walked in silence for a while"), action: "camera", shot: "follow2", duration: 6, ease: "slow" },
    { at: L("They walked in silence for a while", { phrase: "Dew hung from the tips" }), action: "camera", shot: "dew", duration: 6, ease: "slow" },
    // "They reached the eastern sensor marker without incident."
    { at: L("They reached the eastern sensor marker"), action: "scene", name: "The eastern marker" },
    { at: L("They reached the eastern sensor marker"), action: "camera", shot: "marker", duration: 3, ease: "inOut" },
    { at: L("Jack knelt and examined the soil anyway."), action: "face", actor: "jack", direction: "east" },
    { at: L("Jack knelt and examined the soil anyway."), action: "gesture", actor: "jack", animation: "look-down", duration: 9 },
    { at: L("Jack knelt and examined the soil anyway."), action: "gesture", actor: "jack", animation: "lean-forward", duration: 9 },
    { at: L("Jack knelt and examined the soil anyway.", { phrase: "a single blade of grass" }), action: "camera", shot: "flat", duration: 2.6, ease: "inOut" },
    { at: L("Mark crouched beside him."), action: "face", actor: "mark", direction: "east" },
    { at: L("Mark crouched beside him."), action: "camera", shot: "pair", duration: 1.6, ease: "inOut" },
    { at: L("He photographed the mark from three angles"), action: "gesture", actor: "jack", animation: "reach", duration: 5 },
    { at: L("He photographed the mark from three angles"), action: "camera", shot: "flat", duration: 3, ease: "inOut" },
    { at: L("He photographed the mark from three angles", { phrase: "Somewhere close by" }), action: "face", actor: "jack", direction: "north" },
    { at: L("He photographed the mark from three angles", { phrase: "Somewhere close by" }), action: "face", actor: "mark", direction: "north" },
    { at: L("He photographed the mark from three angles", { phrase: "Somewhere close by" }), action: "camera", shot: "pair", duration: 1.6, ease: "inOut" },
    // "Overhead, a bird called ... Jack looked up at the lightening sky"
    { at: L("Overhead, a bird called"), action: "gesture", actor: "jack", animation: "look-up", duration: 6 },
    { at: L("Overhead, a bird called"), action: "camera", shot: "sky", duration: 5, ease: "slow" },
    // "His radio crackled. Sarah's voice"
    { at: L("His radio crackled."), action: "gesture", actor: "jack", animation: "look-down", duration: 2 },
    { at: L("His radio crackled."), action: "camera", shot: "radio", duration: 1.6, ease: "inOut" },
    { at: L("A pause, longer than he liked."), action: "camera", shot: "pair", duration: 2.0, ease: "inOut" },
    { at: L("I need you back here first.", { edge: "end", offset: -0.3 }), action: "fade", color: "#000", to: 1, duration: 1.6, ease: "in", label: "fade out" },
  ],
};
