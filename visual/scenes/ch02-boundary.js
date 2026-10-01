// Chapter 2, "The Boundary", the whole chapter over its real audio (7 min 29 s): the lab,
// where Chapter 1 left Jack and Sarah; the corridor to the main control room, Lena on Jack's
// wrist terminal; then the control room -- the TOMBS Array through its reinforced window, the
// emitters that will not stop, the shutdown lever, the dark, the rings starting again, the
// emergency lights, and "They're running it."
//
// The events follow the manuscript and add nothing to it. Every `at` is a line, a phrase or
// a sound cue in audio/manifests/chapter-02.json, so a regenerated clip moves the visuals.
// The corridor and the control room are built rooms (engine/controlRoom.js) staged in metres
// (scenes/metric.js); the lab is Chapter 1's own set.
//
// Lena is only ever a voice on Jack's wrist terminal here, as the manuscript has her: she is
// not on screen, and the captions name her.

import ch1 from "./ch01-opening.js";
import { controlTemplates, mapTemplates } from "../screens/control.js";
import { L, plus, P, walkM, placeM, shot3, builtWorld } from "./metric.js";

const DIAG_BLUE = "rgba(80,160,255,0.55)";
const AMBER = "rgba(255,160,50,0.62)";
const RED = "rgba(255,60,40,0.7)";
const CM = "control-main", CS = "control-second", MAP = "control-map";

// Where Chapter 1 left them (scenes/ch01-opening.js): side by side, seated.
const JACK_SEAT = [890, 1184], SARAH_SEAT = [1210, 1184];

// The lab set is Chapter 1's, with the two of them where that chapter ended.
const lab = ch1.sets.lab;
// THE CAST IS ONE ACROSS THE CHAPTER'S PLACES: an actor is the same actor in every set (the
// timeline keys them by name), so every set lists the same starting marks -- the lab's --
// and a cut puts them where the next place needs them (`arrive`).
const CAST = {
  jack: { ...lab.actors.jack, pose: "sitting", facing: "north", state: "awake", x: JACK_SEAT[0], y: JACK_SEAT[1], visible: true, opacity: 1 },
  sarah: { ...lab.actors.sarah, pose: "sitting", facing: "north", state: "awake", x: SARAH_SEAT[0], y: SARAH_SEAT[1], visible: true, opacity: 1 },
};
const labSet = {
  ...lab,
  actors: CAST,
  screens: {
    "jack-monitor": { ...lab.screens["jack-monitor"], state: "request", params: { revoked: true, denied: 1 } },
    "sarah-monitor": { ...lab.screens["sarah-monitor"], state: "history", params: { clean: true } },
  },
  lights: {
    ...lab.lights,
    alarm: { ...lab.lights.alarm, color: AMBER, intensity: 0.3, throb: 1.2 },
  },
  camera: { initial: { shot: "pair" }, name: "Lab" },
};

// ------------------------------------------------------------------------- the corridor
// Down -z: the laboratory's door at the far end (z -26), the control room behind the camera.
// They come toward it. Two legs, because the dialogue outlasts any one corridor: a cut at
// "Jack's wrist terminal chirped again" picks them up further back.
const corridor = {
  world: builtWorld("corridor"),
  props: { lighting: 0, alarm: 0 },
  actors: {
    ...CAST,
  },
  shots: {
    hall: shot3([0.3, 1.65, 1.6], [0, 1.25, -20], 46),
    hallClose: shot3([0.45, 1.6, -4.5], [0, 1.35, -16], 44),
    stop: shot3([1.0, 1.55, -5.2], [-0.15, 1.45, -9.6], 50),
    pairWalk: shot3([0.9, 1.6, -1.5], [0, 1.4, -8], 48),
    onJack: shot3([0.75, 1.6, -4.0], [-0.2, 1.55, -7.0], 40),
  },
  camera: { initial: { shot: "hall" }, name: "Corridor" },
};

// ------------------------------------------------------------------- the control room
// The window into the chamber is the north wall (z -7); the primary console in front of its
// left half, the secondary in front of its right; the emergency panel on the west wall at
// z -2.5; the mapping display on the west wall at z -4.2; the door behind the camera.
const PRIMARY_SPOT = [-1.15, -4.45], SECOND_SPOT = [1.9, -4.45], BESIDE = [-0.35, -4.4], LEVER_SPOT = [-2.85, -2.5];
const control = {
  world: builtWorld("control", { lookAtLights: ["chamber", "map"] }),
  props: { rings: 1, chamber: 0.7, panel: 0, lever: 0, lighting: 0, white: 0, outside: 0 },
  actors: {
    ...CAST,
  },
  screens: {
    [CM]: { corners: [[0, 0], [10, 0], [0, 6], [10, 6]], width: 640, height: 348, templates: controlTemplates, state: "array", params: { mw: 15 } },
    [CS]: { corners: [[0, 0], [10, 0], [0, 6], [10, 6]], width: 580, height: 348, templates: controlTemplates, state: "status" },
    [MAP]: { corners: [[0, 0], [10, 0], [0, 6], [10, 6]], width: 600, height: 352, templates: mapTemplates, state: "map", params: {} },
  },
  lights: {
    monitor: { x: 0, y: 0, radius: 0, color: DIAG_BLUE, intensity: 0.35 },
    second: { x: 0, y: 0, radius: 0, color: DIAG_BLUE, intensity: 0.25 },
    map: { x: 0, y: 0, radius: 0, color: DIAG_BLUE, intensity: 0 },
    chamber: { x: 0, y: 0, radius: 0, color: "rgba(90,230,240,0.8)", intensity: 0.6 },
    alarm: { x: 0, y: 0, radius: 0, color: AMBER, intensity: 0 },
  },
  shots: {
    // in through the door, the window and the rings ahead
    entry: shot3([-1.6, 1.62, 0.9], [-0.2, 1.6, -10], 58),
    window: shot3([0.2, 1.6, -2.4], [0, 1.9, -16], 54),
    rings: shot3([0.25, 1.8, -3.6], [0, 2.1, -16.5], 54),
    pairWindow: shot3([1.6, 1.55, -5.3], [-0.6, 1.5, -6.4], 56),
    consoles: shot3([0.4, 1.7, -1.6], [0.1, 1.15, -5.6], 58),
    primary: shot3([0.3, 1.55, -3.2], [-1.15, 1.25, -5.4], 50),
    second: shot3([0.6, 1.55, -3.3], [1.9, 1.25, -5.4], 50),
    lever: shot3([-1.2, 1.6, -1.0], [-3.2, 1.35, -2.6], 56),
    leverClose: shot3([-2.0, 1.55, -1.75], [-3.3, 1.4, -2.65], 50),
    darkRoom: shot3([0.9, 1.7, -1.2], [-0.6, 1.4, -6.5], 64),
    screenMain: shot3([-0.75, 1.5, -4.15], [-1.1, 1.3, -5.55], 50),
    map: shot3([-1.0, 1.6, -3.0], [-3.4, 1.65, -4.25], 54),
    twoShot: shot3([0.9, 1.6, -2.4], [-0.75, 1.45, -4.6], 50),
    faces: shot3([-0.8, 1.55, -5.55], [-0.7, 1.55, -4.4], 52),
  },
  camera: { initial: { shot: "entry" }, name: "Main control room" },
};

const cue = (c, o = {}) => ({ cue: c, ...o });

export default {
  id: "ch02-boundary",
  title: "Chapter 2 · The Boundary",
  audio: "../audio/exports/chapter-02-drama.mp3",
  manifest: "../audio/manifests/chapter-02.json",
  range: { start: { seg: 0 }, end: { line: "They're running it.", edge: "end" } },
  fadeFromBlack: true,
  initialSet: "lab",
  sets: { lab: labSet, corridor, control },

  events: [
    // ------------------------------------------------------------------------ the lab
    // "The lights flickered as a low hum passed through the floor. Sarah turned toward the
    //  far end of the laboratory."
    { at: { seg: 0 }, action: "scene", name: "The lab · a hum" },
    { at: { seg: 0 }, action: "fade", to: 0, duration: 1.6, ease: "out" },
    { at: { seg: 0, offset: 0.6 }, action: "light", target: "monitor", pulse: 0.6, pulseDuration: 0.25 },
    { at: { seg: 0, offset: 1.0 }, action: "light", target: "monitor", pulse: 0.5, pulseDuration: 0.2 },
    { at: { seg: 0, offset: 0.8 }, action: "shake", amount: 1.5, duration: 1.2 },
    { at: L("The lights flickered", { phrase: "Sarah turned" }), action: "face", actor: "sarah", direction: "northeast" },
    // "Jack was already out of his chair." / "Stay here."
    { at: L("Jack was already out of his chair."), action: "stand", actor: "jack" },
    { at: L("Jack was already out of his chair."), action: "camera", shot: "twoshot", duration: 2.5, ease: "inOut" },
    { at: L("Stay here."), action: "face", actor: "jack", direction: "east" },
    // "Sarah stood and picked up her tablet." / "Absolutely not."
    { at: L("Sarah stood and picked up her tablet."), action: "stand", actor: "sarah" },
    { at: L("Sarah stood and picked up her tablet.", { offset: 0.6 }), action: "face", actor: "sarah", direction: "west" },
    { at: L("She folded her arms."), action: "gesture", actor: "sarah", animation: "hand-on-belly", arm: "left", duration: 3.2 },
    { at: L("Jack lowered his voice."), action: "camera", shot: "pair", duration: 2, ease: "inOut" },
    { at: L("Jack glanced at her stomach"), action: "gesture", actor: "jack", animation: "look-down", duration: 1.2 },
    { at: L("It means you're carrying"), action: "gesture", actor: "jack", animation: "small-hand-gesture", duration: 2.6 },
    { at: L("Her expression softened."), action: "gesture", actor: "sarah", animation: "nod", duration: 1.0 },
    // "Jack opened his mouth, but Sarah pointed down the corridor."
    { at: L("Jack opened his mouth"), action: "gesture", actor: "sarah", animation: "point", arm: "right", duration: 1.8 },
    { at: L("Jack opened his mouth", { offset: 0.4 }), action: "face", actor: "sarah", direction: "south" },
    // "Jack gave in and opened the door wider." The door is behind the camera: they go past it.
    { at: L("Jack gave in"), action: "camera", shot: "doorway", duration: 2.2, ease: "inOut" },
    ...walkM2d("jack", L("Jack gave in", { offset: 0.4 }), [890, 2050], 3.0, "south"),
    { at: L("Fine. But stay with me.", { offset: 0.6 }), action: "opacity", target: "jack", to: 0, duration: 0.7, ease: "in" },
    // "Sarah fell into step beside him." / "That I can do."
    ...walkM2d("sarah", L("Sarah fell into step"), [1150, 2050], 2.6, "south"),
    { at: L("That I can do."), action: "opacity", target: "sarah", to: 0, duration: 0.8, ease: "in" },

    // ------------------------------------------------------------------- the corridor
    // "They hurried toward the main control room while another alarm sounded overhead."
    { at: L("They hurried toward"), action: "set", set: "corridor", label: "cut to the corridor" },
    { at: L("They hurried toward"), action: "scene", name: "Corridor" },
    ...arrive("jack", L("They hurried toward"), -0.3, -24, "south"),
    ...arrive("sarah", L("They hurried toward"), 0.35, -24.6, "south"),
    ...walkM("jack", L("They hurried toward"), [-0.3, -24], [-0.3, -13.5], 9.0, "south"),
    ...walkM("sarah", L("They hurried toward"), [0.35, -24.6], [0.35, -14.1], 9.0, "south"),
    { at: cue("ch02-030-overhead-alarm"), action: "prop", target: "alarm", to: 1, duration: 0.3 },
    // "Warning. array power above standby threshold." / "Jack tapped his wrist terminal and
    //  called the island utility station."
    { at: L("Jack tapped his wrist terminal"), action: "gesture", actor: "jack", animation: "look-down", duration: 1.2 },
    ...walkM("jack", L("Jack tapped his wrist terminal", { offset: 0.5 }), [-0.3, -13.5], [-0.3, -10.8], 4.5, "south", null, 3),
    ...walkM("sarah", L("Jack tapped his wrist terminal", { offset: 0.5 }), [0.35, -14.1], [0.35, -11.4], 4.5, "south", null, 3),
    { at: L("Lena Ortiz, the night-shift"), action: "camera", shot: "hallClose", duration: 4, ease: "inOut" },
    // "Jack quickened his pace." / "Jack stopped so abruptly that Sarah nearly walked into him."
    ...walkM("jack", L("Jack quickened his pace."), [-0.3, -10.8], [-0.3, -9.0], 2.6, "south", null, 3),
    ...walkM("sarah", L("Jack quickened his pace."), [0.35, -11.4], [0.2, -9.75], 2.8, "south", null, 3),
    { at: L("Jack stopped so abruptly"), action: "camera", shot: "stop", duration: 0.6, ease: "out" },
    { at: L("Jack stopped so abruptly", { offset: 0.2 }), action: "jolt", actor: "sarah", amount: 0.8, duration: 0.5 },
    { at: L("Fourteen?"), action: "face", actor: "jack", direction: "southwest" },
    // "Sarah checked the figures on her tablet."
    { at: L("Sarah checked the figures"), action: "gesture", actor: "sarah", animation: "look-down", duration: 1.6 },
    // "Jack started moving again."
    ...walkM("jack", L("Jack started moving again."), [-0.3, -9.0], [-0.3, -5.6], 4.2, "south", null, 4),
    ...walkM("sarah", L("Jack started moving again.", { offset: 0.3 }), [0.2, -9.75], [0.35, -6.3], 4.2, "south", null, 4),
    { at: L("Jack started moving again."), action: "camera", shot: "pairWalk", duration: 3, ease: "inOut" },
    // "The corridor lights dimmed. For a moment, the building became almost silent, but the
    //  lights returned and the hum beneath their feet continued."
    { at: L("The corridor lights dimmed."), action: "scene", name: "Corridor · the lights dim" },
    { at: L("The corridor lights dimmed."), action: "prop", target: "lighting", to: 0.9, duration: 0.5, ease: "in" },
    { at: L("The corridor lights dimmed."), action: "prop", target: "alarm", to: 0, duration: 0.3 },
    { at: L("The corridor lights dimmed.", { phrase: "but the lights returned" }), action: "prop", target: "lighting", to: 0, duration: 0.6, ease: "out" },
    { at: L("The corridor lights dimmed.", { phrase: "but the lights returned" }), action: "prop", target: "alarm", to: 1, duration: 0.3 },
    // "Jack's wrist terminal chirped again." -- the second leg, further back
    { at: L("Jack's wrist terminal chirped again."), action: "camera", shot: "hall", duration: 0 },
    placeM("jack", L("Jack's wrist terminal chirped again."), -0.3, -15.5),
    placeM("sarah", L("Jack's wrist terminal chirped again."), 0.35, -16.1),
    { at: L("Jack looked toward the array chamber."), action: "face", actor: "jack", direction: "south" },
    ...walkM("jack", L("Jack headed toward the array chamber."), [-0.3, -15.5], [-0.3, -10.5], 4.8, "south"),
    ...walkM("sarah", L("Sarah caught Jack's arm"), [0.35, -16.1], [0.3, -11.0], 4.0, "south"),
    { at: L("Sarah caught Jack's arm"), action: "camera", shot: "hallClose", duration: 3.5, ease: "inOut" },
    ...walkM("jack", L("Jack shook his head.", { nth: 0 }), [-0.3, -10.5], [-0.3, -6.0], 8, "south"),
    ...walkM("sarah", L("Sarah checked another possibility."), [0.3, -11.0], [0.35, -6.7], 7, "south"),
    { at: L("Jack tapped the reactor status"), action: "gesture", actor: "jack", animation: "look-down", duration: 1.6 },
    { at: L("Sarah looked toward the humming chamber."), action: "camera", shot: "onJack", duration: 2.5, ease: "inOut" },

    // -------------------------------------------------------------- the control room
    // "They reached the main control room, where a reinforced window looked into the
    //  chamber beyond. At its center stood the TOMBS Array ... Several articulated rings
    //  surrounded a central platform."
    { at: L("They reached the main control room"), action: "set", set: "control", label: "cut to the control room" },
    { at: L("They reached the main control room"), action: "scene", name: "Control room · the Array" },
    ...arrive("jack", L("They reached the main control room"), -1.5, -0.4, "north"),
    ...arrive("sarah", L("They reached the main control room"), -0.9, -0.2, "north"),
    ...walkM("jack", L("They reached the main control room"), [-1.5, -0.4], [-0.75, -5.7], 5.5, "north"),
    ...walkM("sarah", L("They reached the main control room", { offset: 0.4 }), [-0.9, -0.2], [0.1, -5.75], 5.5, "north"),
    { at: L("They reached the main control room", { offset: 1.5 }), action: "camera", shot: "window", duration: 9, ease: "inOut", label: "toward the window" },
    { at: L("They reached the main control room", { phrase: "At its center" }), action: "camera", shot: "rings", duration: 7, ease: "inOut", label: "the Array" },
    // "Tonight, every ring was moving."
    { at: L("Tonight, every ring was moving."), action: "prop", target: "rings", to: 1.15, duration: 2 },
    // "Jack." / "Sarah's voice dropped as she stared through the reinforced window."
    { at: L("Sarah's voice dropped"), action: "camera", shot: "pairWindow", duration: 2.2, ease: "inOut" },
    { at: L("Sarah turned from the rings to him."), action: "face", actor: "sarah", direction: "west" },
    // "Jack moved toward the primary console." / "No."
    ...walkM("jack", L("Jack moved toward the primary console."), [-0.75, -5.7], PRIMARY_SPOT, 1.8, "north", null, 3),
    // "The largest ring rotated into position while another slid sideways. Sarah moved to the
    //  console."
    { at: L("The largest ring rotated"), action: "prop", target: "rings", to: 1.5, duration: 2.5 },
    { at: L("The largest ring rotated"), action: "camera", shot: "rings", duration: 2.0, ease: "inOut" },
    ...walkM("sarah", L("The largest ring rotated", { phrase: "Sarah moved" }), [0.1, -5.75], SECOND_SPOT, 2.2, "north", null, 3),
    { at: L("Boundary emitters are active."), action: "screen", target: CS, state: "emitters", params: {}, flash: 0.7 },
    { at: L("Boundary emitters are active."), action: "camera", shot: "consoles", duration: 1.8, ease: "inOut" },
    // "Jack pointed to the emitter controls." / "Kill them."
    { at: L("Jack pointed to the emitter controls."), action: "gesture", actor: "jack", animation: "point", duration: 1.6 },
    // "Sarah worked the controls and shook her head." / "They're not responding."
    { at: L("Sarah worked the controls"), action: "gesture", actor: "sarah", animation: "type", duration: 2.4 },
    { at: L("Sarah worked the controls", { offset: 1.4 }), action: "gesture", actor: "sarah", animation: "shake-head", duration: 1.0 },
    { at: L("They're not responding."), action: "screen", target: CS, state: "emitters", params: { refusedAt: 0 }, flash: 0.6 },
    // "Jack opened the emergency panel." / "Then we'll do it the old-fashioned way."
    { at: L("Jack opened the emergency panel."), action: "scene", name: "The shutdown lever" },
    ...walkM("jack", L("Jack opened the emergency panel."), PRIMARY_SPOT, LEVER_SPOT, 2.0, "west", null, 3),
    { at: L("Jack opened the emergency panel."), action: "camera", shot: "lever", duration: 1.8, ease: "inOut" },
    { at: L("Jack opened the emergency panel.", { offset: 1.8 }), action: "prop", target: "panel", to: 1, duration: 0.6, ease: "out" },
    // "He pulled the physical shutdown lever, and the room went dark."
    { at: L("He pulled the physical shutdown lever"), action: "gesture", actor: "jack", animation: "tap", target: "lever", arm: "right", duration: 6.5 },
    { at: L("He pulled the physical shutdown lever"), action: "camera", shot: "leverClose", duration: 0.8, ease: "inOut" },
    { at: L("He pulled the physical shutdown lever", { offset: 0.9 }), action: "prop", target: "lever", to: 1, duration: 0.45, ease: "in" },
    { at: L("He pulled the physical shutdown lever", { phrase: "and the room went dark" }), action: "prop", target: "lighting", to: 1, duration: 0.15, ease: "in" },
    { at: L("He pulled the physical shutdown lever", { phrase: "and the room went dark" }), action: "screen", target: CM, state: "dead" },
    { at: L("He pulled the physical shutdown lever", { phrase: "and the room went dark" }), action: "screen", target: CS, state: "dead" },
    { at: L("He pulled the physical shutdown lever", { phrase: "and the room went dark" }), action: "light", target: "monitor", intensity: 0, duration: 0.1 },
    { at: L("He pulled the physical shutdown lever", { phrase: "and the room went dark" }), action: "light", target: "second", intensity: 0, duration: 0.1 },
    // "The rings stopped."
    { at: L("The rings stopped."), action: "prop", target: "rings", to: 0, duration: 1.6, ease: "out" },
    { at: L("The rings stopped."), action: "prop", target: "chamber", to: 0.04, duration: 1.2 },
    { at: L("The rings stopped."), action: "camera", shot: "darkRoom", duration: 1.5, ease: "inOut" },
    // "Sarah exhaled and loosened her grip on the console." / "Okay." / "Jack kept his hand on
    //  the shutdown lever." / "That worked."
    { at: L("Sarah exhaled"), action: "gesture", actor: "sarah", animation: "lean-back", duration: 2.0 },
    // "A light blinked inside the chamber, then another. The rings began moving again."
    { at: L("A light blinked inside the chamber"), action: "scene", name: "The rings start again" },
    { at: L("A light blinked inside the chamber"), action: "camera", shot: "rings", duration: 1.2, ease: "inOut" },
    { at: L("A light blinked inside the chamber", { offset: 0.3 }), action: "prop", target: "chamber", to: 0.5, duration: 0.12 },
    { at: L("A light blinked inside the chamber", { offset: 0.5 }), action: "prop", target: "chamber", to: 0.05, duration: 0.3 },
    { at: L("A light blinked inside the chamber", { phrase: "then another" }), action: "prop", target: "chamber", to: 0.6, duration: 0.12 },
    { at: L("A light blinked inside the chamber", { phrase: "then another", offset: 0.2 }), action: "prop", target: "chamber", to: 0.35, duration: 0.4 },
    { at: L("A light blinked inside the chamber", { phrase: "The rings began" }), action: "prop", target: "rings", to: 0.8, duration: 2.0, ease: "in" },
    // "Sarah took a step backward." / "Jack."
    ...walkM("sarah", L("Sarah took a step backward."), SECOND_SPOT, [1.9, -3.9], 0.8, "north", null, 2),
    { at: L("Jack checked the lever and its indicator."), action: "camera", shot: "leverClose", duration: 1.0, ease: "inOut" },
    // "Sarah watched the rings accelerate." / "Apparently TOMBS disagrees."
    { at: L("Sarah watched the rings accelerate."), action: "prop", target: "rings", to: 2.0, duration: 4.5, ease: "in" },
    { at: L("Sarah watched the rings accelerate."), action: "prop", target: "chamber", to: 1.0, duration: 4.5 },
    { at: L("Sarah watched the rings accelerate."), action: "camera", shot: "window", duration: 2.0, ease: "inOut" },
    // "Jack moved back toward the console." / "Sarah followed him."
    ...walkM("jack", L("Jack moved back toward the console."), LEVER_SPOT, PRIMARY_SPOT, 2.3, "north", null, 3),
    ...walkM("sarah", L("Sarah followed him."), [1.9, -3.9], BESIDE, 2.0, "north", null, 3),
    // "The emergency lights switched on. Jack rushed back to the console, which should have
    //  been dead. Instead, the screen was filling with data."
    { at: L("The emergency lights switched on."), action: "scene", name: "Emergency lights" },
    { at: L("The emergency lights switched on."), action: "prop", target: "lighting", to: 2, duration: 0.3, ease: "out" },
    { at: L("The emergency lights switched on.", { phrase: "Instead, the screen" }), action: "screen", target: CM, state: "data", flash: 0.6 },
    { at: L("The emergency lights switched on.", { phrase: "Instead, the screen" }), action: "light", target: "monitor", color: RED, intensity: 0.45, duration: 0.3 },
    { at: L("The emergency lights switched on.", { phrase: "Jack rushed" }), action: "camera", shot: "primary", duration: 1.6, ease: "inOut" },
    // "Boundary acquisition in progress." / "What boundary?"
    { at: L("Boundary acquisition in progress.", { nth: 0 }), action: "screen", target: CM, state: "acquire", text: L("Boundary acquisition in progress.", { nth: 0 }), flash: 1 },
    { at: L("Sarah leaned closer to the new warning."), action: "camera", shot: "screenMain", duration: 2.4, ease: "inOut" },
    // "Jack opened the target parameters." ... "The values flickered, vanished, and returned
    //  as unreadable placeholders."
    { at: L("Jack opened the target parameters."), action: "screen", target: CM, state: "acquire", text: L("Boundary acquisition in progress.", { nth: 0 }), params: { paramsAt: 0.4 } },
    { at: L("Jack opened the target parameters."), action: "gesture", actor: "jack", animation: "type", duration: 1.4 },
    { at: L("Jack highlighted the figures."), action: "screen", target: CM, state: "acquire", text: L("Boundary acquisition in progress.", { nth: 0 }), params: { paramsAt: 0, highlight: true } },
    { at: L("Sarah leaned closer. The values"), action: "screen", target: CM, state: "acquire", text: L("Boundary acquisition in progress.", { nth: 0 }), params: { paramsAt: 0, highlight: true, hiddenAt: 2.6 } },
    { at: L("Sarah leaned closer. The values"), action: "gesture", actor: "sarah", animation: "lean-forward", duration: 3.0 },
    // "Sarah pulled up the mapping controls. A red outline appeared for less than a second,
    //  too fast to resolve, then the map cleared itself."
    { at: L("Sarah pulled up the mapping controls."), action: "scene", name: "The map" },
    { at: L("Sarah pulled up the mapping controls."), action: "face", actor: "sarah", direction: "west" },
    { at: L("Sarah pulled up the mapping controls."), action: "camera", shot: "map", duration: 1.8, ease: "inOut" },
    { at: L("Sarah pulled up the mapping controls."), action: "light", target: "map", intensity: 0.4, duration: 0.6 },
    { at: L("Sarah pulled up the mapping controls.", { phrase: "A red outline" }), action: "screen", target: MAP, state: "map", params: { flashAt: 0.1 } },
    { at: L("Jack stared at the empty display."), action: "face", actor: "jack", direction: "west" },
    { at: L("Sarah tried the command anyway."), action: "gesture", actor: "sarah", animation: "type", duration: 1.6 },
    { at: L("Mapping access denied."), action: "screen", target: MAP, state: "map", params: { denied: true } },
    // "Jack opened a second diagnostic path. The system returned only one line."
    { at: L("Jack opened a second diagnostic path."), action: "face", actor: "jack", direction: "north" },
    { at: L("Jack opened a second diagnostic path."), action: "face", actor: "sarah", direction: "north" },
    { at: L("Jack opened a second diagnostic path."), action: "camera", shot: "primary", duration: 1.6, ease: "inOut" },
    { at: L("Boundary acquisition in progress.", { nth: 1 }), action: "screen", target: CM, state: "acquire", text: L("Boundary acquisition in progress.", { nth: 1 }), flash: 0.8 },
    // "Sarah looked toward the array chamber." / "Boundary around what?"
    { at: L("Sarah looked toward the array chamber."), action: "camera", shot: "pairWindow", duration: 2.0, ease: "inOut" },
    // "Jack keyed his wrist terminal." -- Lena, by call
    { at: L("Jack keyed his wrist terminal."), action: "gesture", actor: "jack", animation: "look-down", duration: 1.2 },
    { at: L("Lena, keep the laboratory isolated."), action: "camera", shot: "twoShot", duration: 2.2, ease: "inOut" },
    { at: L("Sarah nodded."), action: "gesture", actor: "sarah", animation: "nod", duration: 1.0 },
    // "The laboratory remained quiet beyond the muted warning tones at their consoles.
    //  Somewhere outside, nearly five hundred people slept through an emergency they did not
    //  know existed."
    { at: L("The laboratory remained quiet"), action: "camera", shot: "darkRoom", duration: 6, ease: "slow" },
    // "Sarah opened the emitter controls." ... "Could we overload the emitters?"
    ...walkM("sarah", L("Sarah opened the emitter controls."), BESIDE, SECOND_SPOT, 2.4, "north", null, 3),
    { at: L("Sarah opened the emitter controls.", { offset: 2.0 }), action: "screen", target: CS, state: "emitters", params: { refusedAt: 0 } },
    { at: L("Jack searched through the manual overrides."), action: "gesture", actor: "jack", animation: "type", duration: 2.4 },
    { at: L("Sarah pulled up the emitter load."), action: "camera", shot: "second", duration: 1.8, ease: "inOut" },
    { at: L("Sarah glanced at him."), action: "face", actor: "sarah", direction: "west" },
    { at: L("Sarah closed the overload control."), action: "face", actor: "sarah", direction: "north" },
    { at: L("Sarah closed the overload control."), action: "gesture", actor: "sarah", animation: "type", duration: 1.0 },
    // "Jack opened another diagnostic window and searched for a route into the controls."
    { at: L("Jack opened another diagnostic window"), action: "camera", shot: "primary", duration: 2.0, ease: "inOut" },
    { at: L("Jack opened another diagnostic window"), action: "gesture", actor: "jack", animation: "type", duration: 5.0 },
    // "The display changed." / "Boundary acquired." / "Jack's hands stopped." / "No."
    { at: L("Boundary acquired."), action: "screen", target: CM, state: "scale", params: { lines: ["Boundary acquired."] }, flash: 1 },
    { at: L("Boundary acquired."), action: "camera", shot: "screenMain", duration: 1.4, ease: "inOut" },
    // "A second line appeared." / "Scale factor calculating."
    { at: L("Scale factor calculating."), action: "screen", target: CM, state: "scale", params: { lines: ["Boundary acquired.", "Scale factor calculating."] }, flash: 0.8 },
    { at: L("Sarah pointed to it."), action: "gesture", actor: "sarah", animation: "point", duration: 1.4 },
    ...walkM("sarah", L("Sarah pointed to it."), SECOND_SPOT, BESIDE, 2.2, "north", null, 3),
    // "Sarah studied the command sequence." / "Someone isn't just activating TOMBS." ...
    //  "Sarah looked at him." / "They're running it."
    { at: L("Sarah studied the command sequence."), action: "camera", shot: "twoShot", duration: 2.0, ease: "inOut" },
    { at: L("Sarah looked at him."), action: "face", actor: "sarah", direction: "west" },
    { at: L("Sarah looked at him."), action: "camera", shot: "faces", duration: 1.8, ease: "inOut" },
    { at: L("They're running it.", { edge: "end", offset: -0.3 }), action: "fade", to: 1, duration: 0.3, ease: "in", label: "cut to black" },
  ],
};

// Someone arriving in a new place at a cut: on their mark, standing, seen.
function arrive(actor, at, x, z, dir) {
  return [placeM(actor, at, x, z), { at, action: "stand", actor }, { at, action: "face", actor, direction: dir },
    { at, action: "opacity", target: actor, to: 1, duration: 0 }, { at, action: "state", actor, state: "idle" }];
}

// A walk in the lab's own picture pixels (Chapter 1's set is a painted picture, not metres).
function walkM2d(actor, at, to, dur, dir) {
  return [
    { at, action: "state", actor, state: "walking" },
    { at, action: "face", actor, direction: dir },
    { at, action: "move", actor, x: to[0], y: to[1], duration: dur, ease: "inOut" },
  ];
}
