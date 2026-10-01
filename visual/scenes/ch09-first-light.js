// Chapter 9, "First Light", the whole chapter over its real audio (7 min): the main control
// room as the sky goes from black to grey. The badge -- a retired groundskeeper's, reported
// lost eight days before; the ticket; "They planned for us finding the trail." Then the
// window: the first light reaching the tops of the blades, "slow and gold from the top down",
// dew "the size of boulders, each one glowing faintly as the light passed through it", and
// below the grass line something moving through the gold-lit stems and gone. Aiden at the
// greenhouse, on the facilities channel. The waiting over. Morning.
//
// Every `at` is a line or a phrase in audio/manifests/chapter-09.json (`nth` from 0).
//
// THE THING IN THE STEMS is Joshua's jumping spider (TRADDOMIUM release "Jumping Spider Model
// + Image", 2026-10-01; his call the same day: the black widow "for the legs in the shadows,
// but Jumping spider later"). The chapter gives it no clean look and neither does this: it
// crosses low in the stems, far out, in the gold light, and is gone. (Held back for a few
// minutes the same day while Joshua considered remaking it; put back on seeing it.) Its size
// is the reference chart's regal jumping spider (story-rules/reference, UF/IFAS: a female's
// body ~15 mm, 2.7 m at 1:180). The model's body is 81% of its whole length -- its legs
// reach little past it front and back -- so the whole animal is 3.35 m long.
// Aiden's spider, at the greenhouse, is a voice on a call and is not shown.

import { L, plus } from "./metric.js";
import { controlSet, SPOT, CM, CS, MAP, M, walkM, placeM } from "./controlSet.js";

const control = controlSet({
  jack: SPOT.doorOut,
  sarah: [0.2, -3.9],
  lena: [-1.35, -3.55],
  mark: SPOT.doorOut,
  lenaShown: true,
  props: { cups: 4, dawn: 1, jumper: 0, jumperShow: 0 },
  screens: { [CM]: { state: "badge", params: {} }, [CS]: { state: "phase", params: { clock: "05:52" } }, [MAP]: { state: "facility", params: { badges: true, found: true, title: "BADGE TRACKING · DOOR LOGS" } } },
  creatures: {
    jumper: { model: "../assets/models/jumping-spider.glb", lengthM: 3.35, roughness: 0.6, prop: "jumper", show: "jumperShow", stride: 1.5,
      // low through the stems beyond the perimeter lights, then a hop and gone
      path: [[81, 0, 19], [76, 0, 12], [72, 0, 6], [68, 2.6, 1], [65, 0, -3], [62, 0, -6]] },
  },
});
control.actors.jack.visible = false;
control.actors.mark.visible = false;
control.actors.lena.facing = "west";

const W = { jack: SPOT.windowJack, lena: SPOT.windowLena, sarah: [2.85, -1.25] };

export default {
  id: "ch09-first-light",
  title: "Chapter 9 · First Light",
  audio: "../audio/exports/chapter-09-drama.mp3",
  manifest: "../audio/manifests/chapter-09.json",
  range: { start: { seg: 0 }, end: { line: "Outside, the sun cleared the horizon", edge: "end" } },
  fadeFromBlack: true,
  initialSet: "control",
  sets: { control },

  events: [
    // "Jack and Mark made it back to the control room just as the sky outside had gone from
    //  black to a deep, uncertain gray. Sarah was waiting, arms folded"
    { at: { seg: 0 }, action: "scene", name: "Grey" },
    { at: { seg: 0 }, action: "fade", to: 0, duration: 1.2, ease: "out" },
    { at: { seg: 0 }, action: "camera", shot: "window2", duration: 0 },
    { at: { seg: 0 }, action: "face", actor: "sarah", direction: "south" },
    { at: { seg: 0 }, action: "prop", target: "door", to: 1, duration: 1.2 },
    { at: { seg: 0, offset: 0.4 }, action: "show", actor: "jack" },
    ...walkM("jack", { seg: 0, offset: 0.6 }, SPOT.doorOut, [-0.6, -2.7], 4.4, "north", "north", 7),
    { at: { seg: 0, offset: 1.6 }, action: "show", actor: "mark" },
    ...walkM("mark", { seg: 0, offset: 1.8 }, SPOT.doorOut, SPOT.markDoor, 1.6, "north", "north", 3),
    { at: { seg: 0, offset: 2.0 }, action: "camera", shot: "fromDoor", duration: 3.0, ease: "inOut" },
    { at: L("Sarah was waiting, arms folded"), action: "camera", shot: "onSarah", duration: 1.6, ease: "inOut" },
    { at: L("Jack frowned."), action: "camera", shot: "faces", duration: 1.2, ease: "inOut" },
    // "Jack pulled the ticket up himself"
    ...walkM("jack", L("Jack pulled the ticket up himself"), [-0.6, -2.7], SPOT.primary, 1.8, "north", "north", 3),
    { at: L("Jack pulled the ticket up himself", { offset: 1.6 }), action: "screen", target: CM, state: "badge", params: { ticket: true }, flash: 0.3 },
    { at: L("Jack pulled the ticket up himself", { offset: 1.6 }), action: "gesture", actor: "jack", animation: "type", duration: 3 },
    { at: L("Jack pulled the ticket up himself", { offset: 2 }), action: "camera", shot: "screenMain", duration: 1.8, ease: "inOut" },
    { at: L("Lena groaned from her console."), action: "camera", shot: "lenaShot", duration: 1.4, ease: "inOut" },
    { at: L("Sarah shook her head slowly."), action: "gesture", actor: "sarah", animation: "shake-head", duration: 1.4 },
    { at: L("Lena pulled up the retired groundskeeper's file"), action: "screen", target: CS, state: "checkout", params: {} },
    { at: L("Lena pulled up the retired groundskeeper's file"), action: "gesture", actor: "lena", animation: "point", duration: 2.0 },
    { at: L("Lena pulled up the retired groundskeeper's file"), action: "camera", shot: "consoles", duration: 3, ease: "slow" },
    // "Mark leaned against the doorframe, arms crossed."
    { at: L("Mark leaned against the doorframe"), action: "camera", shot: "door", duration: 1.6, ease: "inOut" },
    { at: L("Nobody argued with him either."), action: "prop", target: "door", to: 0.5, duration: 0 },
    // "Jack looked at the frozen badge record, then at the still-glowing message on the other
    //  screen"
    { at: L("Jack looked at the frozen badge record"), action: "screen", target: CS, state: "phase", params: { clock: "05:58" } },
    { at: L("Jack looked at the frozen badge record"), action: "camera", shot: "consoles", duration: 2.0, ease: "inOut" },
    { at: L("Jack looked at the frozen badge record", { phrase: "still-glowing message" }), action: "camera", shot: "screenSecond", duration: 1.6, ease: "inOut" },
    { at: L("They didn't just plan the boundary."), action: "camera", shot: "onJack", duration: 1.4, ease: "inOut" },
    { at: L("Jack realized, distantly"), action: "camera", shot: "roomWide", duration: 6, ease: "slow" },
    // "Sarah touched his arm."
    ...walkM("sarah", L("Sarah touched his arm."), [0.2, -3.9], SPOT.beside, 1.2, "west", "west", 3),
    { at: L("Sarah touched his arm."), action: "gesture", actor: "sarah", animation: "reach", duration: 2 },
    { at: L("Sarah touched his arm."), action: "face", actor: "jack", direction: "east" },
    { at: L("Sarah touched his arm."), action: "camera", shot: "faces", duration: 1.4, ease: "inOut" },
    // FIRST LIGHT. "Outside, the gray had started pulling apart into color. Jack crossed to the
    //  window without deciding to and watched the first true light of morning reach the tops
    //  of the grass blades"
    { at: L("Outside, the gray had started pulling apart"), action: "scene", name: "First light" },
    { at: L("Outside, the gray had started pulling apart"), action: "prop", target: "dawn", to: 2, until: L("Even the light seemed slower here"), ease: "inOut" },
    ...walkM("jack", L("Outside, the gray had started pulling apart", { phrase: "Jack crossed to the window" }), SPOT.primary, W.jack, 4.4, "east", "east", 7),
    { at: L("Outside, the gray had started pulling apart"), action: "camera", shot: "toWindow", duration: 3.0, ease: "inOut" },
    { at: L("Outside, the gray had started pulling apart", { phrase: "watched the first true light" }), action: "camera", shot: "blade", duration: 0, ease: "inOut" },
    { at: L("Dew clung to individual blades"), action: "camera", shot: "beyond", duration: 0, ease: "inOut" },
    // "That's..." Lena trailed off, standing beside him.
    ...walkM("lena", L("Dew clung to individual blades", { offset: 8 }), [-1.35, -3.55], W.lena, 5.0, "east", "east", 7),
    { at: L("Lena trailed off"), action: "camera", shot: "atWindow", duration: 1.6, ease: "inOut" },
    { at: L("Mark stood in the doorway"), action: "camera", shot: "door", duration: 1.6, ease: "inOut" },
    { at: L("Even the light seemed slower here"), action: "camera", shot: "final", duration: 0, ease: "inOut" },
    { at: L("For a moment, nobody spoke."), action: "camera", shot: "windowGroup", duration: 3, ease: "inOut" },
    // "Sarah joined them at the window ... slid her hand into Jack's and held on."
    ...walkM("sarah", L("Sarah joined them at the window."), SPOT.beside, W.sarah, 4.2, "east", "east", 7),
    { at: L("Sarah joined them at the window.", { offset: 4.4 }), action: "face", actor: "sarah", direction: "northeast" },
    // "Somewhere below the grass line, out past the reach of the perimeter lights, something
    //  moved through the gold-lit stems and vanished again"
    { at: L("Somewhere below the grass line"), action: "camera", shot: "grassLine", duration: 0, ease: "inOut" },
    { at: L("Somewhere below the grass line", { phrase: "something moved" }), action: "prop", target: "jumperShow", to: 1, duration: 0 },
    { at: L("Somewhere below the grass line", { phrase: "something moved" }), action: "prop", target: "jumper", to: 1, duration: 3.6, ease: "linear" },
    { at: L("Somewhere below the grass line", { phrase: "something moved", offset: 3.7 }), action: "prop", target: "jumperShow", to: 0, duration: 0 },
    { at: L("Somewhere below the grass line", { phrase: "Nobody mentioned it" }), action: "camera", shot: "windowGroup", duration: 2.4, ease: "inOut" },
    // Aiden, on the facilities channel
    { at: L("The stillness broke"), action: "scene", name: "The greenhouse" },
    { at: L("The stillness broke"), action: "gesture", actor: "jack", animation: "look-down", duration: 1.6 },
    { at: L("The stillness broke"), action: "screen", target: CS, state: "call", params: { who: "FACILITIES CHANNEL", sub: "GREENHOUSE", channel: "FACILITIES" }, flash: 0.4 },
    { at: L("He answered without looking away from the window."), action: "camera", shot: "atWindow", duration: 1.6, ease: "inOut" },
    { at: L("Sarah's hand tightened around Jack's."), action: "camera", shot: "windowGroup", duration: 1.2, ease: "inOut" },
    { at: L("Lena's hands froze over the keyboard."), action: "face", actor: "lena", direction: "west" },
    // "Mark finally moved, pushing off the doorframe"
    ...walkM("mark", L("Mark finally moved"), SPOT.markDoor, SPOT.mark, 2.2, "north", "east", 4),
    { at: L("Mark finally moved"), action: "camera", shot: "roomWide", duration: 1.4, ease: "inOut" },
    { at: L("Jack keyed the channel"), action: "camera", shot: "atWindow", duration: 1.4, ease: "inOut" },
    { at: L("He ended the call and looked at Sarah."), action: "face", actor: "jack", direction: "south" },
    { at: L("He ended the call and looked at Sarah."), action: "face", actor: "sarah", direction: "north" },
    { at: L("He ended the call and looked at Sarah."), action: "screen", target: CS, state: "phase", params: { clock: "06:04" } },
    { at: L("He ended the call and looked at Sarah."), action: "camera", shot: "faces", duration: 1.4, ease: "inOut" },
    // "watching the light climb higher over the transformed settlement, gold fading into full
    //  morning blue"
    { at: L("Jack nodded slowly, watching the light climb"), action: "prop", target: "dawn", to: 3, duration: 14, ease: "inOut" },
    { at: L("Jack nodded slowly, watching the light climb"), action: "face", actor: "jack", direction: "east" },
    { at: L("Jack nodded slowly, watching the light climb"), action: "camera", shot: "street", duration: 0, ease: "inOut" },
    { at: L("Then we stop trying to control"), action: "camera", shot: "windowGroup", duration: 1.6, ease: "inOut" },
    { at: L("Mark reached for his radio."), action: "gesture", actor: "mark", animation: "look-down", duration: 2 },
    { at: L("Mark reached for his radio."), action: "camera", shot: "roomWide", duration: 1.6, ease: "inOut" },
    // "Lena was already typing." -- every camera they have
    ...walkM("lena", L("Lena was already typing."), W.lena, SPOT.second, 2.4, "west", "north", 4),
    { at: L("Lena was already typing.", { offset: 2.4 }), action: "gesture", actor: "lena", animation: "type", duration: 8 },
    { at: L("Lena was already typing.", { offset: 2.4 }), action: "screen", target: CS, state: "cameras", params: {} },
    { at: L("I'll pull every camera we've got."), action: "camera", shot: "screenSecond", duration: 2.0, ease: "inOut" },
    { at: L("Then twenty minutes. Maybe less."), action: "camera", shot: "consoles", duration: 2.0, ease: "inOut" },
    // "Jack looked around the control room, at the cold coffee and the frozen frame of the
    //  shape in the grass and the three words still glowing at the edge of the display"
    { at: L("Jack looked around the control room"), action: "face", actor: "jack", direction: "west" },
    { at: L("Jack looked around the control room"), action: "screen", target: CM, state: "phase", params: { clock: "06:09" } },
    { at: L("Jack looked around the control room"), action: "camera", shot: "room", duration: 6, ease: "slow" },
    { at: L("Sarah looked at Jack."), action: "face", actor: "sarah", direction: "west" },
    { at: L("Sarah looked at Jack."), action: "face", actor: "jack", direction: "east" },
    { at: L("Sarah looked at Jack."), action: "camera", shot: "atWindow", duration: 1.4, ease: "inOut" },
    // "Outside, the sun cleared the horizon, and the first full day of the smallest version of
    //  their world began."
    { at: L("Outside, the sun cleared the horizon"), action: "camera", shot: "final", duration: 0, ease: "inOut" },
    { at: L("Outside, the sun cleared the horizon", { edge: "end", offset: -0.8 }), action: "fade", color: "#000", to: 1, duration: 2.0, ease: "in", label: "fade out" },
  ],
};
