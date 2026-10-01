// Chapter 4, "The First Calls", the whole chapter over its real audio (11 min): the main
// control room, straight on from Chapter 3. Lena by call from the utility station, the
// station's exterior camera (the wall of earth behind the east fence), Mark on the security
// channel, the town asleep and a porch light at a time, the infrastructure schematic, the
// intake cut clean at the boundary, the vibrations, the shadow across the lit soil, the
// pebble, and around midnight the water estimate.
//
// Every `at` is a line or a phrase in audio/manifests/chapter-04.json (`nth` counts from 0).
// Lena and Mark are only voices here, as the manuscript has them: nobody arrives until
// Chapter 5. THE SCALE FACTOR IS NEVER SHOWN: on "Jack pulled the scale factor back onto
// the console" the camera is on Jack, and the screen carries it smeared (screens/control.js).

import { L, plus } from "./metric.js";
import { controlSet, SPOT, CM, CS, MAP, DIAG_BLUE, walkM, placeM } from "./controlSet.js";

const control = controlSet({
  jack: SPOT.primary,
  sarah: SPOT.beside,
  screens: { [CM]: { state: "eventlog", params: { text: "Boundary event complete." } }, [MAP]: { state: "map", params: { overlay: true } } },
});
const NEAR = [-0.75, -4.3]; // Sarah at Jack's shoulder

export default {
  id: "ch04-calls",
  title: "Chapter 4 · The First Calls",
  audio: "../audio/exports/chapter-04-drama.mp3",
  manifest: "../audio/manifests/chapter-04.json",
  range: { start: { seg: 0 }, end: { line: "For a moment, it almost sounded", edge: "end" } },
  fadeFromBlack: true,
  initialSet: "control",
  sets: { control },

  events: [
    { at: { seg: 0 }, action: "scene", name: "The first call" },
    { at: { seg: 0 }, action: "fade", to: 0, duration: 1.4, ease: "out" },
    { at: { seg: 0 }, action: "face", actor: "sarah", direction: "west" },
    { at: { seg: 0 }, action: "face", actor: "jack", direction: "east" },
    // "His wrist terminal vibrated once against his skin ... One incoming call from island
    //  utility control."
    { at: L("His wrist terminal vibrated"), action: "gesture", actor: "jack", animation: "look-down", duration: 1.4 },
    { at: L("His wrist terminal vibrated", { phrase: "One incoming call" }), action: "screen", target: CM, state: "call", params: { who: "ISLAND UTILITY CONTROL", sub: "L. ORTIZ · NIGHT SHIFT" }, flash: 0.4 },
    { at: L("For several seconds, the impossible forest"), action: "camera", shot: "window2", duration: 3.0, ease: "slow" },
    // "Sarah looked past Jack toward the darkened homes outside." / "They don't know."
    { at: L("Sarah looked past Jack"), action: "face", actor: "sarah", direction: "east" },
    { at: L("Sarah looked past Jack"), action: "camera", shot: "street", duration: 2.6, ease: "inOut" },
    { at: L("They don't know."), action: "camera", shot: "twoShot", duration: 1.4, ease: "inOut" },
    { at: L("He answered the call."), action: "gesture", actor: "jack", animation: "look-down", duration: 1.6 },
    { at: L("He answered the call."), action: "camera", shot: "onJack", duration: 1.4, ease: "inOut" },
    // "He turned toward the window. A blade of grass swayed beyond the streetlights"
    { at: L("He turned toward the window."), action: "face", actor: "jack", direction: "east" },
    { at: L("He turned toward the window."), action: "camera", shot: "blade", duration: 6, ease: "slow" },
    { at: L("TOMBS activated."), action: "camera", shot: "toWindow", duration: 2.0, ease: "inOut" },
    { at: L("Jack looked at the event record."), action: "face", actor: "jack", direction: "north" },
    { at: L("Jack looked at the event record."), action: "screen", target: CM, state: "eventlog", params: { text: "Boundary event complete." } },
    // the scale factor, back on the console -- on Jack, never on the number
    { at: L("Jack pulled the scale factor back"), action: "screen", target: CM, state: "scale", params: { lines: ["Boundary event complete."], locked: true } },
    { at: L("Jack pulled the scale factor back"), action: "gesture", actor: "jack", animation: "type", duration: 2.0 },
    { at: L("Jack pulled the scale factor back"), action: "camera", shot: "onJack", duration: 1.2, ease: "inOut" },
    { at: L("Silence filled the call."), action: "camera", shot: "faces", duration: 2.0, ease: "inOut" },
    // "Sarah stepped beside him." / "Lena, go to a window. Don't go outside."
    ...walkM("sarah", L("Sarah stepped beside him."), SPOT.beside, NEAR, 1.2, "west", "north", 3),
    { at: L("Then Lena stopped moving."), action: "camera", shot: "twoShot", duration: 1.6, ease: "inOut" },
    // "Jack brought up the utility station's exterior cameras."
    { at: L("Jack brought up the utility station"), action: "scene", name: "The utility station" },
    { at: L("Jack brought up the utility station"), action: "screen", target: CM, state: "utilcam", params: {}, flash: 0.4 },
    { at: L("Jack brought up the utility station"), action: "gesture", actor: "jack", animation: "type", duration: 2.0 },
    { at: L("Jack brought up the utility station"), action: "light", target: "monitor", color: "rgba(255,210,150,0.5)", intensity: 0.4, duration: 0.5 },
    { at: L("Sarah leaned toward Jack's screen"), action: "gesture", actor: "sarah", animation: "lean-forward", duration: 4 },
    { at: L("Sarah leaned toward Jack's screen"), action: "camera", shot: "screenMain", duration: 2.0, ease: "inOut" },
    { at: L("Jack enlarged the feed."), action: "screen", target: CM, state: "utilcam", params: { zoom: true } },
    { at: L("Jack enlarged the feed."), action: "gesture", actor: "jack", animation: "type", duration: 1.0 },
    { at: L("That's the ground."), action: "camera", shot: "faces", duration: 1.4, ease: "inOut" },
    { at: L("Stay inside. Keep the night crew"), action: "camera", shot: "onJack", duration: 1.6, ease: "inOut" },
    { at: L("Most of the developed zone still has power."), action: "camera", shot: "twoShot", duration: 2.0, ease: "inOut" },
    // "Jack stared at the dark residential blocks on the map."
    { at: L("Jack stared at the dark residential blocks"), action: "screen", target: MAP, state: "homes", params: { lit: 0 } },
    { at: L("Jack stared at the dark residential blocks"), action: "face", actor: "jack", direction: "west" },
    { at: L("Jack stared at the dark residential blocks"), action: "camera", shot: "map", duration: 1.8, ease: "inOut" },
    // "A message appeared from settlement security." on Sarah's console
    { at: L("A message appeared from settlement security."), action: "scene", name: "Unit Twelve" },
    { at: L("A message appeared from settlement security."), action: "screen", target: CS, state: "message", params: { text: "SOUTH PATROL: ROAD ENDS AT PERIMETER. REQUEST INSTRUCTIONS.", unit: "UNIT 12" }, flash: 0.6 },
    { at: L("A message appeared from settlement security."), action: "light", target: "second", color: "rgba(255,200,90,0.5)", intensity: 0.45, duration: 0.4 },
    { at: L("A message appeared from settlement security."), action: "face", actor: "jack", direction: "east" },
    { at: L("A message appeared from settlement security."), action: "camera", shot: "screenSecond", duration: 1.6, ease: "inOut" },
    { at: L("Jack opened the channel."), action: "camera", shot: "consoles", duration: 1.8, ease: "inOut" },
    { at: L("Unit Twelve, this is Bennett."), action: "gesture", actor: "jack", animation: "small-hand-gesture", duration: 2.0 },
    { at: L("Mark hesitated."), action: "camera", shot: "twoShot", duration: 1.6, ease: "inOut" },
    { at: L("Sarah leaned closer to the speaker."), action: "gesture", actor: "sarah", animation: "lean-forward", duration: 2.6 },
    { at: L("Jack almost smiled"), action: "camera", shot: "onJack", duration: 1.4, ease: "inOut" },
    { at: L("The channel closed."), action: "screen", target: CS, state: "status", params: {} },
    { at: L("The channel closed."), action: "light", target: "second", color: DIAG_BLUE, intensity: 0.3, duration: 0.6 },
    // "For the next several minutes, the settlement remained mostly asleep ... Porch lights
    //  appeared one at a time" -- outside, and on the map
    { at: L("For the next several minutes"), action: "scene", name: "The town asleep" },
    { at: L("For the next several minutes"), action: "camera", shot: "street", duration: 4, ease: "slow" },
    { at: L("No sirens. No crowds."), action: "screen", target: MAP, state: "homes", params: { lit: 0.15 } },
    { at: L("No sirens. No crowds.", { phrase: "Porch lights appeared" }), action: "screen", target: MAP, state: "homes", params: { lit: 0.3 } },
    { at: L("No sirens. No crowds.", { phrase: "Porch lights appeared" }), action: "camera", shot: "mapClose", duration: 2.2, ease: "inOut" },
    { at: L("No sirens. No crowds.", { phrase: "a dog began barking" }), action: "screen", target: MAP, state: "homes", params: { lit: 0.45 } },
    { at: L("Sarah watched the scattered lights appear."), action: "face", actor: "sarah", direction: "west" },
    { at: L("Sarah watched the scattered lights appear."), action: "camera", shot: "map", duration: 1.6, ease: "inOut" },
    { at: L("We can't keep this quiet"), action: "face", actor: "sarah", direction: "west" },
    { at: L("Jack looked toward the impossible grass"), action: "face", actor: "jack", direction: "east" },
    { at: L("Jack looked toward the impossible grass"), action: "camera", shot: "window2", duration: 2.4, ease: "inOut" },
    { at: L("Then we tell the people who need to know first."), action: "camera", shot: "twoShot", duration: 1.8, ease: "inOut" },
    { at: L("Sarah nodded slowly."), action: "gesture", actor: "sarah", animation: "nod", duration: 1.0 },
    // "They turned back to the consoles. They divided the screens between them."
    { at: L("They turned back to the consoles."), action: "scene", name: "The screens divided" },
    { at: L("They turned back to the consoles."), action: "face", actor: "jack", direction: "north" },
    ...walkM("sarah", L("They turned back to the consoles."), NEAR, SPOT.second, 2.6, "east", "north", 4),
    { at: L("They divided the screens"), action: "screen", target: CS, state: "reports", params: {} },
    { at: L("They divided the screens"), action: "gesture", actor: "sarah", animation: "type", duration: 6 },
    { at: L("They divided the screens", { phrase: "Jack opened the settlement's infrastructure" }), action: "screen", target: CM, state: "infra", params: {}, flash: 0.3 },
    { at: L("They divided the screens", { phrase: "Jack opened the settlement's infrastructure" }), action: "light", target: "monitor", color: DIAG_BLUE, intensity: 0.4, duration: 0.6 },
    { at: L("They divided the screens"), action: "camera", shot: "consoles", duration: 2.6, ease: "inOut" },
    { at: L("Power lines crossed the developed zone"), action: "camera", shot: "screenMain", duration: 2.2, ease: "inOut" },
    { at: L("Jack leaned closer."), action: "gesture", actor: "jack", animation: "lean-forward", duration: 3 },
    { at: L("Sarah noticed his expression."), action: "face", actor: "sarah", direction: "west" },
    { at: L("Sarah noticed his expression."), action: "camera", shot: "faces", duration: 1.4, ease: "inOut" },
    ...walkM("sarah", L("She moved to his side."), SPOT.second, NEAR, 2.4, "west", "north", 4),
    { at: L("The settlement's main freshwater intake"), action: "screen", target: CM, state: "infra", params: { trace: true } },
    { at: L("The settlement's main freshwater intake"), action: "camera", shot: "screenMain", duration: 2.0, ease: "inOut" },
    { at: L("Sarah traced the route with one finger."), action: "gesture", actor: "sarah", animation: "point", duration: 2.4 },
    // "Jack selected a maintenance camera near the eastern service corridor."
    { at: L("Jack selected a maintenance camera"), action: "screen", target: CM, state: "pipecam", params: { angle: 1 }, flash: 0.3 },
    { at: L("Jack selected a maintenance camera"), action: "gesture", actor: "jack", animation: "type", duration: 1.6 },
    { at: L("Instead, it ended."), action: "camera", shot: "screenMain", duration: 1.6, ease: "inOut" },
    { at: L("Sarah leaned closer.", { nth: 1 }), action: "gesture", actor: "sarah", animation: "lean-forward", duration: 2.4 },
    { at: L("Jack switched camera angles."), action: "screen", target: CM, state: "pipecam", params: { angle: 2 } },
    { at: L("Jack switched camera angles."), action: "gesture", actor: "jack", animation: "type", duration: 1.2 },
    // "Lena's call returned through Sarah's tablet." -- on Sarah's console
    { at: L("Lena's call returned through Sarah's tablet."), action: "screen", target: CS, state: "call", params: { who: "LENA ORTIZ", sub: "UTILITY · ON SARAH'S TABLET", channel: "TABLET" } },
    { at: L("Lena's call returned through Sarah's tablet."), action: "gesture", actor: "sarah", animation: "look-down", duration: 2.2 },
    { at: L("Lena's call returned through Sarah's tablet."), action: "camera", shot: "twoShot", duration: 1.8, ease: "inOut" },
    { at: L("Jack opened the utility inventory."), action: "screen", target: CM, state: "water", params: {} },
    { at: L("Jack opened the utility inventory."), action: "gesture", actor: "jack", animation: "type", duration: 1.6 },
    { at: L("Sarah opened the population estimate."), action: "screen", target: CS, state: "reports", params: { rows: 5 } },
    { at: L("Jack stared at the clean end of the pipe."), action: "screen", target: CM, state: "pipecam", params: { angle: 2 } },
    { at: L("Jack stared at the clean end of the pipe."), action: "camera", shot: "onJack", duration: 2.0, ease: "inOut" },
    { at: L("It had decided what belonged inside it."), action: "camera", shot: "faces", duration: 2.4, ease: "slow" },
    // the vibrations
    { at: L("A low vibration passed through the floor."), action: "scene", name: "A vibration" },
    { at: L("A low vibration passed through the floor."), action: "shake", amount: 2.2, duration: 1.8 },
    { at: L("Jack's head lifted."), action: "gesture", actor: "jack", animation: "look-up", duration: 1.6 },
    { at: L("Sarah stopped typing."), action: "camera", shot: "twoShot", duration: 1.2, ease: "inOut" },
    { at: L("The vibration faded, then returned"), action: "shake", amount: 4, duration: 2.4 },
    { at: L("Sarah rested one palm against her stomach."), action: "gesture", actor: "sarah", animation: "hand-on-belly", arm: "left", duration: 7 },
    { at: L("Jack turned immediately."), action: "face", actor: "jack", direction: "east" },
    { at: L("Jack turned immediately."), action: "camera", shot: "faces", duration: 1.2, ease: "inOut" },
    { at: L("She waited, then gave him a small nod."), action: "gesture", actor: "sarah", animation: "nod", duration: 1.0 },
    { at: L("Jack let out the breath"), action: "face", actor: "jack", direction: "north" },
    { at: L("Jack checked the structural sensors."), action: "screen", target: CM, state: "structural" },
    { at: L("Jack checked the structural sensors."), action: "camera", shot: "screenMain", duration: 1.6, ease: "inOut" },
    { at: L("He reopened the utility camera."), action: "screen", target: CM, state: "utilcam", params: { zoom: true } },
    { at: L("Dust trickled down"), action: "screen", target: CM, state: "utilcam", params: { zoom: true, dust: true } },
    { at: L("Another vibration rolled through the settlement."), action: "shake", amount: 3.5, duration: 2.0 },
    // "something moved outside the camera light" -- then frame by frame
    { at: L("This time, something moved outside the camera light."), action: "screen", target: CM, state: "utilcam", params: { zoom: true, dust: true, shadow: 0.55 } },
    { at: L("Jack froze the feed"), action: "screen", target: CM, state: "utilcam", params: { zoom: true, shadow: 0.25, frame: 3112 } },
    { at: L("Jack froze the feed", { phrase: "stepped through the frames" }), action: "screen", target: CM, state: "utilcam", params: { zoom: true, shadow: 0.4, frame: 3113 } },
    { at: L("Jack froze the feed", { phrase: "There was no clear shape" }), action: "screen", target: CM, state: "utilcam", params: { zoom: true, shadow: 0.55, frame: 3114 } },
    { at: L("Jack froze the feed", { phrase: "only a shadow" }), action: "screen", target: CM, state: "utilcam", params: { zoom: true, shadow: 0.7, frame: 3115 } },
    { at: L("It was gone in less than a second."), action: "screen", target: CM, state: "utilcam", params: { zoom: true, frame: 3116 } },
    { at: L("Jack froze the feed"), action: "gesture", actor: "jack", animation: "type", duration: 6 },
    { at: L("Jack froze the feed"), action: "camera", shot: "screenMain", duration: 1.4, ease: "inOut" },
    { at: L("Sarah stared at the screen."), action: "camera", shot: "faces", duration: 1.4, ease: "inOut" },
    // "The ground trembled again. On the camera, a pebble shifted and rolled down the dirt wall."
    { at: L("The ground trembled again."), action: "shake", amount: 4, duration: 2.0 },
    { at: L("On the camera, a pebble shifted"), action: "screen", target: CM, state: "utilcam", params: { zoom: true, dust: true, pebble: true } },
    { at: L("On the camera, a pebble shifted"), action: "camera", shot: "screenMain", duration: 1.2, ease: "inOut" },
    { at: L("He kept his eyes on the dark edge"), action: "camera", shot: "onJack", duration: 1.6, ease: "inOut" },
    { at: L("Sarah looked toward the impossible forest"), action: "face", actor: "sarah", direction: "east" },
    { at: L("Sarah looked toward the impossible forest"), action: "camera", shot: "window2", duration: 3.0, ease: "inOut" },
    // "Around midnight" -- a cut in time: Jack at the main console with a forgotten coffee,
    // Sarah sitting at the next one with her feet on an equipment case
    { at: L("Around midnight"), action: "scene", name: "Around midnight" },
    { at: L("Around midnight"), action: "fade", to: 1, duration: 0.8, ease: "in" },
    { at: L("Around midnight", { offset: 0.8 }), action: "prop", target: "cups", to: 1, duration: 0 },
    { at: L("Around midnight", { offset: 0.8 }), action: "prop", target: "case", to: 1, duration: 0 },
    { at: L("Around midnight", { offset: 0.8 }), action: "screen", target: MAP, state: "homes", params: { lit: 0.6 } },
    { at: L("Around midnight", { offset: 0.8 }), action: "screen", target: CM, state: "status", params: {} },
    { at: L("Around midnight", { offset: 0.8 }), action: "screen", target: CS, state: "reports", params: { rows: 5 } },
    placeM("jack", L("Around midnight", { offset: 0.8 }), ...SPOT.primary),
    { at: L("Around midnight", { offset: 0.8 }), action: "face", actor: "jack", direction: "north" },
    placeM("sarah", L("Around midnight", { offset: 0.8 }), ...SPOT.secondSeat),
    { at: L("Around midnight", { offset: 0.8 }), action: "sit", actor: "sarah" },
    { at: L("Around midnight", { offset: 0.8 }), action: "face", actor: "sarah", direction: "north" },
    { at: L("Around midnight", { offset: 0.8 }), action: "camera", shot: "roomWide", duration: 0 },
    { at: L("Around midnight", { offset: 1.0 }), action: "fade", to: 0, duration: 1.6, ease: "out" },
    { at: L("Jack stood at the main console with a cup"), action: "camera", shot: "street", duration: 5, ease: "slow" },
    { at: L("Only a few people knew otherwise."), action: "camera", shot: "consoles", duration: 4, ease: "slow" },
    { at: L("Sarah sat at the neighboring console"), action: "camera", shot: "second", duration: 2.4, ease: "inOut" },
    { at: L("He glanced at her."), action: "face", actor: "jack", direction: "east" },
    { at: L("Sarah caught him looking."), action: "camera", shot: "faces", duration: 1.4, ease: "inOut" },
    { at: L("Jack returned to his screen."), action: "face", actor: "jack", direction: "north" },
    { at: L("Sarah's mouth twitched"), action: "gesture", actor: "sarah", animation: "look-down", duration: 2.4 },
    // "A call came through on the console. Lena's name." / the water estimate
    { at: L("A call came through on the console."), action: "screen", target: CM, state: "call", params: { who: "LENA ORTIZ", sub: "UTILITY CONTROL" }, flash: 0.4 },
    { at: L("A call came through on the console."), action: "camera", shot: "screenMain", duration: 1.4, ease: "inOut" },
    { at: L("Jack straightened."), action: "camera", shot: "twoShot", duration: 1.6, ease: "inOut" },
    { at: L("At current normal consumption"), action: "screen", target: CM, state: "water", params: {} },
    { at: L("Sarah lowered her tablet."), action: "face", actor: "sarah", direction: "west" },
    { at: L("Several days before we have to start"), action: "camera", shot: "screenMain", duration: 2.0, ease: "inOut" },
    { at: L("Jack nodded."), action: "gesture", actor: "jack", animation: "nod", duration: 0.9 },
    { at: L("Already started."), action: "screen", target: CM, state: "water", params: { started: true } },
    { at: L("Sarah glanced at him."), action: "camera", shot: "faces", duration: 1.4, ease: "inOut" },
    { at: L("Jack muted the channel."), action: "screen", target: CM, state: "status", params: {} },
    { at: L("Jack muted the channel."), action: "gesture", actor: "jack", animation: "type", duration: 0.8 },
    { at: L("Sarah laughed quietly."), action: "camera", shot: "roomWide", duration: 4, ease: "slow" },
    { at: L("For a moment, it almost sounded", { edge: "end", offset: -0.6 }), action: "fade", color: "#000", to: 1, duration: 1.4, ease: "in", label: "fade out" },
  ],
};
