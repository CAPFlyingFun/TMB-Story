// Chapter 7, "Phase Two", the whole chapter over its real audio (7 min): the main control room
// at half past three, straight on from Chapter 6. The southern feed showing nothing, Mark out
// of the door to check the perimeter, the search for "phase" that finds nothing else, Sarah's
// question -- could it target a person -- Mark by radio (a mark the size of a dinner plate,
// pressed straight down), Doctor Mercer again, and a narrower search that takes too long and
// finds one buried record, loading line by line.
//
// Every `at` is a line or a phrase in audio/manifests/chapter-07.json (`nth` from 0).
// PHASE ONE READY stays on the main console all chapter; the clock on it reads half past
// three because the chapter says so.

import { L, plus } from "./metric.js";
import { controlSet, SPOT, CM, CS, MAP, M, walkM, placeM } from "./controlSet.js";

const JACK_SEAT = [-1.1, -4.1], SARAH_SEAT = [-0.5, -4.05], LENA_SEAT = [0.55, -3.75];
const control = controlSet({
  jack: JACK_SEAT,
  sarah: SARAH_SEAT,
  lena: LENA_SEAT,
  mark: SPOT.mark,
  lenaShown: true,
  markShown: true,
  props: { cups: 4 },
  screens: { [CM]: { state: "phase", params: { clock: "03:30" } }, [CS]: { state: "southcam", params: {} }, [MAP]: { state: "selection", params: { survey: true, step: 4 } } },
});
for (const id of ["jack", "sarah", "lena"]) control.actors[id].pose = "sitting";
control.actors.lena.facing = "northwest";
control.actors.mark.facing = "west";

export default {
  id: "ch07-phase-two",
  title: "Chapter 7 · Phase Two",
  audio: "../audio/exports/chapter-07-drama.mp3",
  manifest: "../audio/manifests/chapter-07.json",
  range: { start: { seg: 0 }, end: { line: "On the screen, a new record began to load", edge: "end" } },
  fadeFromBlack: true,
  initialSet: "control",
  sets: { control },

  events: [
    { at: { seg: 0 }, action: "scene", name: "Half past three" },
    { at: { seg: 0 }, action: "fade", to: 0, duration: 1.2, ease: "out" },
    { at: { seg: 0 }, action: "camera", shot: "roomWide", duration: 0 },
    // "The clock in the corner of the display read half past three."
    { at: L("The clock in the corner of the display"), action: "camera", shot: "screenMain", duration: 2.4, ease: "inOut" },
    // "Four cold cups of coffee sat forgotten along the edge of the console."
    { at: L("Four cold cups of coffee"), action: "camera", shot: "consoles", duration: 3, ease: "slow" },
    { at: L("Lena was the first to find her voice."), action: "camera", shot: "lenaShot", duration: 1.6, ease: "inOut" },
    // "Jack's hands were already moving across the console, pulling the southern camera feed
    //  onto the main display"
    { at: L("Jack's hands were already moving"), action: "gesture", actor: "jack", animation: "type", duration: 4 },
    { at: L("Jack's hands were already moving"), action: "screen", target: CS, state: "southcam", params: {} },
    { at: L("Jack's hands were already moving", { phrase: "Grass swayed" }), action: "camera", shot: "screenSecond", duration: 1.6, ease: "inOut" },
    // "Sarah stepped closer to the glass, scanning the dark tree line"
    { at: L("Sarah stepped closer to the glass"), action: "stand", actor: "sarah" },
    ...walkM("sarah", L("Sarah stepped closer to the glass", { offset: 0.4 }), SARAH_SEAT, SPOT.window, 3.0, "east", "east", 5),
    { at: L("Sarah stepped closer to the glass"), action: "camera", shot: "toWindow", duration: 2.4, ease: "inOut" },
    { at: L("Then what hit the ground?"), action: "camera", shot: "street", duration: 2.4, ease: "inOut" },
    // "Mark was already moving toward the door."
    { at: L("Mark was already moving toward the door."), action: "face", actor: "mark", direction: "south" },
    ...walkM("mark", L("Mark was already moving toward the door."), SPOT.mark, SPOT.doorIn, 2.8, "south", "south", 5),
    { at: L("Mark was already moving toward the door."), action: "camera", shot: "roomWide", duration: 1.6, ease: "inOut" },
    { at: L("Sarah's head snapped toward him."), action: "face", actor: "sarah", direction: "southwest" },
    { at: L("Mark didn't slow down."), action: "prop", target: "door", to: 1, duration: 0.9 },
    ...walkM("mark", L("Mark didn't slow down."), SPOT.doorIn, SPOT.doorOut, 1.6, "south", "east", 3),
    { at: L("Mark didn't slow down."), action: "camera", shot: "door", duration: 1.4, ease: "inOut" },
    { at: L("The door slid shut behind him"), action: "hide", actor: "mark" },
    { at: L("The door slid shut behind him"), action: "prop", target: "door", to: 0, duration: 1.0 },
    // "Jack stared at the space where Mark had been standing, then back at the three words"
    { at: L("Jack stared at the space where Mark"), action: "face", actor: "jack", direction: "south" },
    { at: L("Jack stared at the space where Mark", { phrase: "then back at the three words" }), action: "face", actor: "jack", direction: "north" },
    { at: L("PHASE ONE READY."), action: "camera", shot: "screenMain", duration: 1.6, ease: "inOut" },
    // the search for "phase": nothing
    { at: L("He typed a search for the word phase"), action: "gesture", actor: "jack", animation: "type", duration: 3 },
    { at: L("He typed a search for the word phase", { phrase: "The system returned nothing" }), action: "screen", target: CM, state: "phase", params: { clock: "03:31", search: "0 RESULTS" } },
    { at: L("Lena asked, leaning over his shoulder."), action: "stand", actor: "lena" },
    ...walkM("lena", L("Lena asked, leaning over his shoulder."), LENA_SEAT, [-0.6, -3.55], 1.4, "west", "north", 3),
    { at: L("Lena asked, leaning over his shoulder."), action: "gesture", actor: "lena", animation: "lean-forward", duration: 4 },
    { at: L("Lena asked, leaning over his shoulder."), action: "camera", shot: "consoles", duration: 1.6, ease: "inOut" },
    // "Sarah crossed her arms, eyes fixed on the message."
    ...walkM("sarah", L("Sarah crossed her arms"), SPOT.window, [0.3, -3.9], 2.6, "west", "north", 4),
    { at: L("Jack rubbed the back of his neck."), action: "gesture", actor: "jack", animation: "look-down", duration: 1.8 },
    { at: L("Jack rubbed the back of his neck."), action: "camera", shot: "onJack", duration: 1.4, ease: "inOut" },
    { at: L("Nobody answered right away."), action: "camera", shot: "roomWide", duration: 2.0, ease: "inOut" },
    { at: L("Sarah spoke carefully"), action: "camera", shot: "onSarah", duration: 1.6, ease: "inOut" },
    { at: L("The room went quiet long enough"), action: "camera", shot: "consoles", duration: 4, ease: "slow" },
    { at: L("A trigger needs two things."), action: "camera", shot: "twoShot", duration: 1.6, ease: "inOut" },
    { at: L("Lena rubbed her eyes"), action: "gesture", actor: "lena", animation: "look-down", duration: 2 },
    { at: L("Lena rubbed her eyes"), action: "camera", shot: "lenaShot", duration: 1.4, ease: "inOut" },
    // "Sarah's hand drifted to her stomach ... Could it target a person?"
    { at: L("Sarah's hand drifted to her stomach"), action: "gesture", actor: "sarah", animation: "hand-on-belly", arm: "left", duration: 4.5 },
    { at: L("Sarah's hand drifted to her stomach"), action: "camera", shot: "onSarah", duration: 1.6, ease: "inOut" },
    { at: L("Jack looked up."), action: "face", actor: "jack", direction: "east" },
    { at: L("Jack looked up."), action: "camera", shot: "faces", duration: 1.2, ease: "inOut" },
    { at: L("Nobody had a response to that either."), action: "camera", shot: "roomWide", duration: 3, ease: "slow" },
    // "Jack's radio crackled. Mark's voice, low." -- the dinner-plate mark
    { at: L("Jack's radio crackled."), action: "scene", name: "A mark the size of a dinner plate" },
    { at: L("Jack's radio crackled."), action: "gesture", actor: "jack", animation: "look-down", duration: 2 },
    { at: L("Jack's radio crackled."), action: "screen", target: CS, state: "message", params: { text: "MARK OUT HERE · SIZE OF A DINNER PLATE · PRESSED STRAIGHT DOWN · NO TRAIL", unit: "M. JONES · RADIO" } },
    { at: L("Sarah's eyebrows lifted."), action: "camera", shot: "faces", duration: 1.2, ease: "inOut" },
    { at: L("Lena groaned."), action: "camera", shot: "lenaShot", duration: 1.2, ease: "inOut" },
    // "Mark returned a few minutes later ... Cold air followed him through the door"
    { at: L("Mark returned a few minutes later"), action: "prop", target: "door", to: 1, duration: 0.8 },
    placeM("mark", L("Mark returned a few minutes later"), ...SPOT.doorOut),
    { at: L("Mark returned a few minutes later"), action: "show", actor: "mark" },
    ...walkM("mark", L("Mark returned a few minutes later", { offset: 0.4 }), SPOT.doorOut, SPOT.mark, 4.2, "north", "west", 6),
    { at: L("Mark returned a few minutes later", { offset: 3 }), action: "prop", target: "door", to: 0, duration: 1.0 },
    { at: L("Mark returned a few minutes later"), action: "camera", shot: "fromDoor", duration: 2.4, ease: "inOut" },
    { at: L("Jack gestured toward the screen"), action: "gesture", actor: "jack", animation: "point", duration: 2 },
    { at: L("Mark read it once."), action: "camera", shot: "screenMain", duration: 1.4, ease: "inOut" },
    { at: L("Phase one. As in, there's a two."), action: "camera", shot: "roomWide", duration: 1.4, ease: "inOut" },
    // Doctor Mercer again
    { at: L("Jack's wrist terminal chirped."), action: "scene", name: "Medical center" },
    { at: L("Jack's wrist terminal chirped."), action: "gesture", actor: "jack", animation: "look-down", duration: 1.6 },
    { at: L("Jack's wrist terminal chirped."), action: "screen", target: CS, state: "call", params: { who: "MEDICAL CENTER", sub: "DR. MERCER" } },
    { at: L("Jack. Two more patients are awake."), action: "screen", target: MAP, state: "homes", params: { lit: 0.75 } },
    { at: L("Jack looked at Sarah."), action: "face", actor: "jack", direction: "east" },
    { at: L("Jack looked at Sarah."), action: "camera", shot: "faces", duration: 1.6, ease: "inOut" },
    { at: L("The call ended."), action: "screen", target: CS, state: "medical", params: { awake: 3 } },
    { at: L("Lena exhaled slowly."), action: "camera", shot: "lenaShot", duration: 1.4, ease: "inOut" },
    { at: L("Sarah set both hands flat"), action: "gesture", actor: "sarah", animation: "lean-forward", duration: 3 },
    { at: L("Sarah set both hands flat"), action: "camera", shot: "onSarah", duration: 1.4, ease: "inOut" },
    { at: L("Five. You're forgetting me."), action: "camera", shot: "roomWide", duration: 1.6, ease: "inOut" },
    { at: L("It had legs."), action: "gesture", actor: "mark", animation: "small-hand-gesture", duration: 1.6 },
    { at: L("That got the first real laugh"), action: "camera", shot: "consoles", duration: 3, ease: "slow" },
    // the narrower search
    { at: L("Jack didn't answer immediately."), action: "scene", name: "One result" },
    { at: L("Jack didn't answer immediately."), action: "face", actor: "jack", direction: "north" },
    { at: L("Jack didn't answer immediately."), action: "screen", target: CM, state: "trace", params: {} },
    { at: L("Jack didn't answer immediately."), action: "gesture", actor: "jack", animation: "type", duration: 9 },
    { at: L("Jack didn't answer immediately."), action: "camera", shot: "screenMain", duration: 2.0, ease: "inOut" },
    { at: L("Lena leaned over his shoulder again."), action: "gesture", actor: "lena", animation: "lean-forward", duration: 4 },
    { at: L("He typed a new search"), action: "gesture", actor: "jack", animation: "type", duration: 3 },
    { at: L("The system took longer than it should have"), action: "screen", target: CM, state: "loading", params: { from: 8 } },
    { at: L("The system took longer than it should have"), action: "camera", shot: "screenMain", duration: 2.0, ease: "inOut" },
    { at: L("Jack went still."), action: "camera", shot: "onJack", duration: 1.0, ease: "inOut" },
    { at: L("Sarah noticed immediately."), action: "camera", shot: "faces", duration: 1.0, ease: "inOut" },
    { at: L("On the screen, a new record began to load"), action: "camera", shot: "screenMain", duration: 3.0, ease: "slow" },
    { at: L("On the screen, a new record began to load", { edge: "end", offset: -0.4 }), action: "fade", color: "#000", to: 1, duration: 1.6, ease: "in", label: "fade out" },
  ],
};
