// Chapter 6, "Several Millimeters", the whole chapter over its real audio (8 min), all of it in
// the main control room before dawn: Jack back from the road and Sarah at the door; the wrist-
// camera footage frame by frame (the leg, the curved shape that catches the security
// lights); the scale -- "several millimeters", said aloud, never shown; and Doctor Mercer on
// the wrist terminal. The chapter ends as her call does: "Nobody spoke for a moment."
//
// This is the first half of the original Chapter 6, split 2026-10-07 (decision 0033); the
// second half is scenes/ch07-someone-knew.js, which starts from exactly where this one stops.
//
// Every `at` is a line or a phrase in audio/manifests/chapter-06.json (`nth` from 0).
// Doctor Mercer is a voice on Jack's wrist, as the manuscript has her.
//
// THE SCALE FACTOR IS NEVER SHOWN (story-rules/WORLD_RULES.md): the calculator's answer is a
// smear with "mm" after it (screens/aftermath.js, calibration), and on "Jack looked at his own
// hands" the camera is on Jack.

import { L, plus } from "./metric.js";
import { controlSet, SPOT, CM, CS, MAP, DIAG_BLUE, M, walkM, placeM } from "./controlSet.js";

const control = controlSet({
  jack: SPOT.doorOut,
  sarah: SPOT.second,
  lena: SPOT.lena,
  mark: SPOT.hallEast,
  lenaShown: true,
  props: { cups: 2, door: 0 },
  screens: { [CM]: { state: "status", params: {} }, [CS]: { state: "southcam", params: { frozen: true } }, [MAP]: { state: "map", params: { overlay: true } } },
});
control.actors.jack.visible = false;

const JACK_SEAT = [-1.1, -4.1], SARAH_SEAT = [-0.25, -4.05], LENA_SEAT = [0.55, -3.75];
const MEET = [-1.0, -0.6];

export default {
  id: "ch06-several-millimeters",
  title: "Chapter 6 · Several Millimeters",
  audio: "../audio/exports/chapter-06-drama.mp3",
  manifest: "../audio/manifests/chapter-06.json",
  range: { start: { seg: 0 }, end: { line: "Nobody spoke for a moment.", edge: "end" } },
  fadeFromBlack: true,
  initialSet: "control",
  sets: { control },

  events: [
    // "Jack watched the southern camera feed all the way back to the laboratory."
    { at: { seg: 0 }, action: "scene", name: "Back from the edge" },
    { at: { seg: 0 }, action: "fade", to: 0, duration: 1.2, ease: "out" },
    { at: { seg: 0 }, action: "camera", shot: "screenSecond", duration: 0 },
    { at: { seg: 0 }, action: "face", actor: "sarah", direction: "north" },
    { at: { seg: 0 }, action: "face", actor: "lena", direction: "east" },
    { at: L("The shape had disappeared"), action: "camera", shot: "consoles", duration: 4, ease: "slow" },
    // "Sarah was waiting in the control room when Jack returned. She crossed the room before
    //  the door had fully opened and stopped directly in front of him."
    { at: L("Sarah was waiting in the control room"), action: "show", actor: "jack" },
    { at: L("Sarah was waiting in the control room"), action: "face", actor: "jack", direction: "north" },
    { at: L("Sarah was waiting in the control room"), action: "face", actor: "sarah", direction: "south" },
    { at: L("Sarah was waiting in the control room"), action: "prop", target: "door", to: 1, duration: 1.6, ease: "inOut" },
    { at: L("Sarah was waiting in the control room"), action: "camera", shot: "door", duration: 1.6, ease: "inOut" },
    ...walkM("sarah", L("She crossed the room before the door"), SPOT.second, MEET, 3.2, "south", "south", 6),
    ...walkM("jack", L("She crossed the room before the door", { offset: 0.6 }), SPOT.doorOut, [-1.1, 0.1], 1.8, "north", "north", 3),
    { at: L("She crossed the room before the door"), action: "camera", shot: "fromDoor", duration: 2.4, ease: "inOut" },
    { at: L("Jack held out both hands."), action: "gesture", actor: "jack", animation: "small-hand-gesture", duration: 2 },
    { at: L("Jack held out both hands."), action: "camera", shot: "doorClose", duration: 1.6, ease: "inOut" },
    { at: L("Sarah touched his chest anyway."), action: "gesture", actor: "sarah", animation: "reach", duration: 2.4 },
    { at: L("Jack lowered his voice."), action: "camera", shot: "doorClose", duration: 1.2, ease: "inOut" },
    // "Lena remained at the console with the southern camera enlarged."
    { at: L("Lena remained at the console"), action: "screen", target: CS, state: "southcam", params: { frozen: true } },
    { at: L("Lena remained at the console"), action: "camera", shot: "lenaShot", duration: 1.8, ease: "inOut" },
    { at: L("Lena remained at the console"), action: "face", actor: "lena", direction: "south" },
    ...walkM("jack", L("Jack walked over."), [-1.1, 0.1], [-0.4, -3.2], 3.0, "north", "east", 5),
    ...walkM("sarah", L("Jack walked over.", { offset: 0.5 }), MEET, [-0.9, -3.5], 3.0, "north", "east", 5),
    // "Mark stepped in behind him." / "We ran." / "Lena pointed at Mark."
    placeM("mark", L("Mark stepped in behind him."), ...SPOT.doorOut),
    { at: L("Mark stepped in behind him."), action: "show", actor: "mark" },
    ...walkM("mark", L("Mark stepped in behind him."), SPOT.doorOut, [-0.9, -0.4], 1.6, "north", "north", 3),
    { at: L("Mark stepped in behind him."), action: "camera", shot: "fromDoor", duration: 1.4, ease: "inOut" },
    { at: L("Lena pointed at Mark."), action: "gesture", actor: "lena", animation: "point", duration: 1.6 },
    { at: L("Lena pointed at Mark."), action: "camera", shot: "roomWide", duration: 1.4, ease: "inOut" },
    { at: L("Lena pointed at Mark."), action: "prop", target: "door", to: 0, duration: 1.4 },
    // "Jack ignored both of them and connected the environmental sensor to the console."
    ...walkM("jack", L("Jack ignored both of them"), [-0.4, -3.2], SPOT.primary, 1.6, "north", "north", 3),
    { at: L("Jack ignored both of them"), action: "gesture", actor: "jack", animation: "reach", duration: 2.0 },
    { at: L("Jack ignored both of them"), action: "screen", target: CM, state: "sensors", params: {}, flash: 0.3 },
    ...walkM("sarah", L("Sarah moved beside him."), [-0.9, -3.5], SPOT.beside, 1.4, "north", "north", 3),
    { at: L("Sarah moved beside him."), action: "camera", shot: "twoShot", duration: 1.6, ease: "inOut" },
    { at: L("Jack shook his head."), action: "gesture", actor: "jack", animation: "shake-head", duration: 1.2 },
    { at: L("Lena frowned."), action: "camera", shot: "lenaShot", duration: 1.2, ease: "inOut" },
    // the recording: the clipping, the grass moving, frame by frame, the leg, the curve
    { at: L("Jack uploaded the wrist-camera recording"), action: "scene", name: "The recording" },
    { at: L("Jack uploaded the wrist-camera recording"), action: "screen", target: CM, state: "footage", params: { stage: "nail" }, flash: 0.4 },
    { at: L("Jack uploaded the wrist-camera recording"), action: "gesture", actor: "jack", animation: "type", duration: 2 },
    { at: L("Jack uploaded the wrist-camera recording"), action: "camera", shot: "screenMain", duration: 2.0, ease: "inOut" },
    { at: L("Lena stared at it."), action: "camera", shot: "consoles", duration: 1.4, ease: "inOut" },
    { at: L("Jack advanced the recording"), action: "screen", target: CM, state: "footage", params: { stage: "grass" } },
    { at: L("Jack advanced the recording"), action: "camera", shot: "screenMain", duration: 1.4, ease: "inOut" },
    { at: L("He slowed the footage."), action: "screen", target: CM, state: "footage", params: { stage: "grass", frame: 1412 } },
    { at: L("Frame by frame"), action: "screen", target: CM, state: "footage", params: { stage: "grass", frame: 1413 } },
    { at: L("Frame by frame", { offset: 1.3 }), action: "screen", target: CM, state: "footage", params: { stage: "grass", frame: 1414 } },
    { at: L("Then a shape appeared."), action: "screen", target: CM, state: "footage", params: { stage: "leg", frame: 1415 } },
    { at: L("Sarah leaned closer.", { nth: 0 }), action: "gesture", actor: "sarah", animation: "lean-forward", duration: 3 },
    { at: L("The image was blurred"), action: "screen", target: CM, state: "footage", params: { stage: "leg", frame: 1416 } },
    { at: L("Lena tilted her head."), action: "camera", shot: "lenaShot", duration: 1.2, ease: "inOut" },
    { at: L("Sarah pointed to the upper portion"), action: "gesture", actor: "sarah", animation: "point", duration: 2 },
    { at: L("Sarah pointed to the upper portion"), action: "camera", shot: "screenMain", duration: 1.2, ease: "inOut" },
    { at: L("Jack reversed several frames."), action: "screen", target: CM, state: "footage", params: { stage: "leg", frame: 1411 } },
    { at: L("He froze the image."), action: "screen", target: CM, state: "footage", params: { stage: "curve", frame: 1409 } },
    { at: L("Jack enlarged it until the pixels"), action: "screen", target: CM, state: "footage", params: { stage: "pixels", frame: 1409 } },
    { at: L("Sarah's eyes stayed on the screen."), action: "camera", shot: "faces", duration: 1.6, ease: "inOut" },
    { at: L("Hearing Sarah say it made the room colder."), action: "camera", shot: "roomWide", duration: 3, ease: "slow" },
    { at: L("Lena looked toward the window."), action: "face", actor: "lena", direction: "east" },
    { at: L("Jack closed the recording."), action: "screen", target: CM, state: "status", params: {} },
    // the scale (never shown)
    { at: L("Sarah pulled up the scale factor"), action: "scene", name: "The scale target" },
    { at: L("Sarah pulled up the scale factor"), action: "screen", target: CM, state: "eventlog", params: { text: "Boundary event complete." } },
    { at: L("Jack looked at the number again."), action: "camera", shot: "onJack", duration: 1.6, ease: "inOut" },
    { at: L("He opened the original TOMBS calibration"), action: "screen", target: CM, state: "calibration", params: {} },
    { at: L("He opened the original TOMBS calibration"), action: "gesture", actor: "jack", animation: "type", duration: 3 },
    { at: L("Jack searched through archived test"), action: "camera", shot: "screenMain", duration: 2.4, ease: "inOut" },
    { at: L("Jack opened the unauthorized command sequence."), action: "gesture", actor: "jack", animation: "type", duration: 2 },
    ...walkM("lena", L("Lena stepped closer."), SPOT.lena, [0.35, -4.1], 1.2, "west", "north", 3),
    { at: L("Jack highlighted a surviving parameter block."), action: "camera", shot: "screenMain", duration: 1.4, ease: "inOut" },
    { at: L("Jack nodded.", { nth: 0 }), action: "gesture", actor: "jack", animation: "nod", duration: 0.9 },
    { at: L("Lena looked between them."), action: "camera", shot: "consoles", duration: 1.4, ease: "inOut" },
    { at: L("Jack compared the command"), action: "gesture", actor: "jack", animation: "type", duration: 3 },
    { at: L("He stared at it."), action: "camera", shot: "onJack", duration: 1.2, ease: "inOut" },
    { at: L("He entered an average adult height"), action: "screen", target: CM, state: "calibration", params: { calc: true } },
    { at: L("He entered an average adult height"), action: "gesture", actor: "jack", animation: "type", duration: 3 },
    { at: L("Sarah watched the answer appear."), action: "camera", shot: "faces", duration: 1.4, ease: "inOut" },
    { at: L("Jack looked at his own hands."), action: "gesture", actor: "jack", animation: "look-down", duration: 2.6 },
    { at: L("Jack looked at his own hands."), action: "camera", shot: "onJack", duration: 1.0, ease: "inOut" },
    { at: L("Sarah placed a hand against her stomach."), action: "gesture", actor: "sarah", animation: "hand-on-belly", arm: "left", duration: 5 },
    { at: L("The fingernail clipping made sense."), action: "camera", shot: "window2", duration: 6, ease: "slow" },
    { at: L("Jack wished fewer things made sense."), action: "camera", shot: "twoShot", duration: 2, ease: "inOut" },
    // Doctor Mercer, on the wrist terminal
    { at: L("Jack's wrist terminal chirped"), action: "scene", name: "Medical center" },
    { at: L("Jack's wrist terminal chirped"), action: "gesture", actor: "jack", animation: "look-down", duration: 1.4 },
    { at: L("MEDICAL CENTER."), action: "screen", target: CS, state: "call", params: { who: "MEDICAL CENTER", sub: "DR. MERCER" } },
    { at: L("Jack glanced at Sarah before answering."), action: "face", actor: "jack", direction: "east" },
    { at: L("Jack pulled up the medical center's status panel."), action: "screen", target: CM, state: "medical", params: {} },
    { at: L("Jack pulled up the medical center's status panel."), action: "face", actor: "jack", direction: "north" },
    { at: L("Jack pulled up the medical center's status panel."), action: "camera", shot: "screenMain", duration: 1.4, ease: "inOut" },
    { at: L("Jack checked the structural grid."), action: "screen", target: CM, state: "structural" },
    { at: L("Jack closed his eyes briefly."), action: "camera", shot: "onJack", duration: 1.2, ease: "inOut" },
    { at: L("Sarah leaned toward the microphone."), action: "gesture", actor: "sarah", animation: "lean-forward", duration: 2 },
    { at: L("Jack gave Sarah a look"), action: "face", actor: "jack", direction: "east" },
    { at: L("We had a TOMBS boundary event."), action: "face", actor: "jack", direction: "north" },
    { at: L("We had a TOMBS boundary event."), action: "camera", shot: "twoShot", duration: 1.6, ease: "inOut" },
    { at: L("For now, keep your overnight staff inside."), action: "screen", target: CM, state: "medical", params: { awake: 1 } },
    { at: L("Jack looked toward the dark residential map."), action: "face", actor: "jack", direction: "west" },
    { at: L("Jack looked toward the dark residential map."), action: "screen", target: MAP, state: "homes", params: { lit: 0.7 } },
    { at: L("The call ended."), action: "screen", target: CS, state: "southcam", params: { frozen: true } },
    { at: L("Nobody spoke for a moment."), action: "camera", shot: "roomWide", duration: 2.0, ease: "inOut" },
    { at: L("Nobody spoke for a moment.", { edge: "end", offset: -0.2 }), action: "fade", color: "#000", to: 1, duration: 1.6, ease: "in", label: "fade out" },
  ],
};
