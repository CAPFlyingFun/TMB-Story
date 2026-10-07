// Chapter 7, "Someone Knew", the whole chapter over its real audio (7 min), straight on from
// Chapter 6 in the main control room before dawn, the moment Doctor Mercer's call ends: the
// boundary drawn round the town like a selection; the diagnostic trace the intruder did not
// erase; the file three weeks old, with Jack's name on it; and the label. PHASE ONE READY.
//
// The second half of the original Chapter 6, split 2026-10-07 (decision 0033). The opening
// state is where scenes/ch06-several-millimeters.js leaves everyone: Jack at the primary
// console turned toward the residential map, Sarah beside him, Lena close by, Mark inside the
// door, the medical panel up and the southern feed frozen.
//
// Every `at` is a line or a phrase in audio/manifests/chapter-07.json (`nth` from 0).
// THE SCALE FACTOR IS NEVER SHOWN (story-rules/WORLD_RULES.md).

import { L, plus } from "./metric.js";
import { controlSet, SPOT, CM, CS, MAP, DIAG_BLUE, M, walkM, placeM } from "./controlSet.js";

const control = controlSet({
  jack: SPOT.primary,
  sarah: SPOT.beside,
  lena: [0.35, -4.1],
  mark: [-0.9, -0.4],
  lenaShown: true,
  markShown: true,
  props: { cups: 2, door: 0 },
  screens: { [CM]: { state: "medical", params: { awake: 1 } }, [CS]: { state: "southcam", params: { frozen: true } }, [MAP]: { state: "homes", params: { lit: 0.7 } } },
});
control.actors.jack.facing = "west";

const JACK_SEAT = [-1.1, -4.1], SARAH_SEAT = [-0.25, -4.05], LENA_SEAT = [0.55, -3.75];

export default {
  id: "ch07-someone-knew",
  title: "Chapter 7 · Someone Knew",
  audio: "../audio/exports/chapter-07-drama.mp3",
  manifest: "../audio/manifests/chapter-07.json",
  range: { start: { seg: 0 }, end: { line: "It had gone exactly the way someone planned.", edge: "end" } },
  fadeFromBlack: true,
  initialSet: "control",
  sets: { control },

  events: [
    // "Sarah broke the silence. 'Dawn's coming.'"
    { at: { seg: 0 }, action: "scene", name: "Before dawn" },
    { at: { seg: 0 }, action: "fade", to: 0, duration: 1.2, ease: "out" },
    { at: { seg: 0 }, action: "camera", shot: "roomWide", duration: 0 },
    { at: { seg: 0 }, action: "face", actor: "jack", direction: "east" },
    { at: L("Jack rubbed his eyes."), action: "gesture", actor: "jack", animation: "look-down", duration: 1.6 },
    { at: L("Lena, still watching the frozen frame"), action: "face", actor: "lena", direction: "east" },
    { at: L("Lena, still watching the frozen frame"), action: "camera", shot: "lenaShot", duration: 1.6, ease: "inOut" },
    // the boundary, drawn like a selection
    { at: L("Jack opened the boundary definition."), action: "scene", name: "A selection" },
    { at: L("Jack opened the boundary definition."), action: "screen", target: MAP, state: "selection", params: {} },
    { at: L("Jack opened the boundary definition."), action: "light", target: "map", color: "rgba(255,90,60,0.45)", intensity: 0.45, duration: 0.6 },
    { at: L("Jack opened the boundary definition."), action: "face", actor: "jack", direction: "west" },
    { at: L("Jack opened the boundary definition."), action: "face", actor: "sarah", direction: "west" },
    { at: L("Jack opened the boundary definition."), action: "face", actor: "lena", direction: "west" },
    { at: L("Jack opened the boundary definition."), action: "camera", shot: "map", duration: 2.0, ease: "inOut" },
    { at: L("Research buildings."), action: "camera", shot: "mapClose", duration: 6, ease: "slow" },
    { at: L("He overlaid the island development survey"), action: "screen", target: MAP, state: "selection", params: { survey: true } },
    { at: L("Sarah folded her arms."), action: "camera", shot: "map", duration: 1.6, ease: "inOut" },
    { at: L("The boundary curved around a maintenance yard"), action: "screen", target: MAP, state: "selection", params: { survey: true, step: 1 } },
    { at: L("The boundary curved around a maintenance yard", { phrase: "pumping station" }), action: "screen", target: MAP, state: "selection", params: { survey: true, step: 2 } },
    { at: L("The boundary curved around a maintenance yard"), action: "camera", shot: "mapClose", duration: 2.0, ease: "inOut" },
    { at: L("Sarah pointed toward the pumping station."), action: "gesture", actor: "sarah", animation: "point", duration: 2 },
    { at: L("Lena pointed to another narrow extension."), action: "gesture", actor: "lena", animation: "point", duration: 2 },
    { at: L("Backup substation."), action: "screen", target: MAP, state: "selection", params: { survey: true, step: 3 } },
    { at: L("Jack zoomed out."), action: "screen", target: MAP, state: "selection", params: { survey: true, step: 4 } },
    { at: L("Jack felt a knot form"), action: "camera", shot: "faces", duration: 2.0, ease: "inOut" },
    { at: L("Sarah shook her head slowly."), action: "gesture", actor: "sarah", animation: "shake-head", duration: 1.4 },
    // the raw archive, the maintenance partition, the trace
    { at: L("He returned to the access records"), action: "face", actor: "jack", direction: "north" },
    { at: L("He returned to the access records"), action: "face", actor: "sarah", direction: "north" },
    { at: L("He returned to the access records"), action: "face", actor: "lena", direction: "north" },
    { at: L("He returned to the access records"), action: "screen", target: CM, state: "source", params: {} },
    { at: L("He returned to the access records"), action: "camera", shot: "screenMain", duration: 2.0, ease: "inOut" },
    { at: L("Jack opened the raw command archive."), action: "screen", target: CM, state: "data", params: {} },
    // he sits; Sarah moves closer; Lena pulls over a chair
    { at: L("Jack opened the raw command archive."), action: "sit", actor: "jack" },
    { at: L("Jack opened the raw command archive."), action: "move", actor: "jack", x: M.P(...JACK_SEAT)[0], y: M.P(...JACK_SEAT)[1], duration: 0.8, ease: "inOut" },
    { at: L("He pointed to a maintenance partition"), action: "gesture", actor: "jack", animation: "point", duration: 2 },
    { at: L("Jack opened the file."), action: "scene", name: "The trace" },
    { at: L("Jack opened the file."), action: "screen", target: CM, state: "trace", params: {} },
    { at: L("Lines of machine data filled the screen."), action: "camera", shot: "screenMain", duration: 1.6, ease: "inOut" },
    { at: L("Lena pulled over a chair."), action: "sit", actor: "lena" },
    { at: L("Lena pulled over a chair."), action: "move", actor: "lena", x: M.P(...LENA_SEAT)[0], y: M.P(...LENA_SEAT)[1], duration: 1.2, ease: "inOut" },
    { at: L("Lena pulled over a chair."), action: "face", actor: "lena", direction: "northwest" },
    { at: L("Lena pulled over a chair."), action: "camera", shot: "consoles", duration: 1.6, ease: "inOut" },
    { at: L("Sarah sat beside him."), action: "sit", actor: "sarah" },
    { at: L("Sarah sat beside him."), action: "move", actor: "sarah", x: M.P(...SARAH_SEAT)[0], y: M.P(...SARAH_SEAT)[1], duration: 1.0, ease: "inOut" },
    { at: L("Jack did."), action: "gesture", actor: "jack", animation: "type", duration: 2 },
    { at: L("The system found several matches."), action: "screen", target: CM, state: "trace", params: { found: 3 } },
    { at: L("A timestamp appeared."), action: "camera", shot: "screenMain", duration: 1.2, ease: "inOut" },
    { at: L("Jack stopped breathing."), action: "camera", shot: "onJack", duration: 1.0, ease: "inOut" },
    { at: L("It had been loaded."), action: "screen", target: CM, state: "trace", params: { found: 3, loaded: true }, flash: 0.4 },
    { at: L("Lena leaned over the back of Jack's chair."), action: "gesture", actor: "lena", animation: "lean-forward", duration: 3 },
    // the metadata, a field at a time
    { at: L("Jack opened the file metadata."), action: "screen", target: CM, state: "metadata", params: { show: 1 } },
    { at: L("Jack opened the file metadata."), action: "camera", shot: "screenMain", duration: 1.4, ease: "inOut" },
    { at: L("Nobody moved."), action: "camera", shot: "faces", duration: 2.0, ease: "inOut" },
    { at: L("Jack checked the timestamp against the island clock"), action: "screen", target: CM, state: "metadata", params: { show: 2 } },
    { at: L("Then he searched the archived maintenance snapshots."), action: "gesture", actor: "jack", animation: "type", duration: 3 },
    { at: L("The file existed for less than a minute"), action: "screen", target: CM, state: "metadata", params: { show: 3 } },
    { at: L("Jack opened the ownership field."), action: "screen", target: CM, state: "metadata", params: { show: 4 }, flash: 0.5 },
    { at: L("His name appeared."), action: "camera", shot: "screenMain", duration: 0.8, ease: "inOut" },
    { at: L("He stared at the screen."), action: "camera", shot: "onJack", duration: 1.4, ease: "inOut" },
    { at: L("Sarah immediately shook her head."), action: "gesture", actor: "sarah", animation: "shake-head", duration: 1.2 },
    { at: L("Jack opened the authentication signature."), action: "screen", target: CM, state: "metadata", params: { show: 5 } },
    { at: L("Sarah moved her chair closer to him."), action: "move", actor: "sarah", x: M.P(-0.5, -4.05)[0], y: M.P(-0.5, -4.05)[1], duration: 1.0, ease: "inOut" },
    { at: L("Sarah saw it in his face."), action: "camera", shot: "faces", duration: 1.2, ease: "inOut" },
    { at: L("The calendar appeared."), action: "screen", target: CM, state: "metadata", params: { show: 6 } },
    { at: L("The calendar appeared."), action: "camera", shot: "screenMain", duration: 1.2, ease: "inOut" },
    { at: L("He opened the access history from that day."), action: "screen", target: CM, state: "source", params: {} },
    { at: L("Sarah placed her hand on the edge of the console."), action: "camera", shot: "twoShot", duration: 1.6, ease: "inOut" },
    // the label
    { at: L("Jack searched the diagnostic snapshot for anything else"), action: "screen", target: CM, state: "trace", params: { found: 3 } },
    { at: L("Jack searched the diagnostic snapshot for anything else"), action: "gesture", actor: "jack", animation: "type", duration: 3 },
    { at: L("Jack opened it.", { nth: 1 }), action: "camera", shot: "screenMain", duration: 1.6, ease: "inOut" },
    { at: L("PHASE ONE READY."), action: "scene", name: "Phase one ready" },
    { at: L("PHASE ONE READY."), action: "screen", target: CM, state: "phase", params: {}, flash: 0.6 },
    { at: L("PHASE ONE READY."), action: "light", target: "monitor", color: "rgba(255,70,40,0.55)", intensity: 0.5, duration: 0.6 },
    { at: L("Lena went still."), action: "camera", shot: "consoles", duration: 2.0, ease: "inOut" },
    { at: L("Jack read it again."), action: "camera", shot: "screenMain", duration: 1.6, ease: "inOut" },
    // "Outside, something struck the distant ground. The control-room window trembled."
    { at: L("Outside, something struck the distant ground."), action: "shake", amount: 5, duration: 1.4 },
    { at: L("The control-room window trembled."), action: "shake", amount: 2.5, duration: 1.6 },
    { at: L("The control-room window trembled."), action: "camera", shot: "window2", duration: 1.6, ease: "inOut" },
    { at: L("Nobody looked away from the screen."), action: "camera", shot: "roomWide", duration: 4, ease: "slow" },
    { at: L("It had gone exactly the way someone planned.", { edge: "end", offset: -0.6 }), action: "fade", color: "#000", to: 1, duration: 1.6, ease: "in", label: "fade out" },
  ],
};
