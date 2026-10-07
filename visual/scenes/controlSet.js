// The main control room as Chapters 4 to 9 use it: the room after the activation (the Array
// stopped, normal lighting, the grass outside the east window), its three screens, its
// cameras, and everyone who comes and goes through its door. One definition, so the six
// chapters stand people on the same marks and look from the same places.
//
// The picture's camera stands 4 m behind the room's origin (scenes/metric.js), past the
// door: from Chapter 5 Lena and Mark arrive in the hallway outside it.
//
// Lena and Mark have no model yet; they stand in the room as their drawings on cards that
// turn to the camera (engine/people3d.js, addBoards).

import { controlTemplates, mapTemplates } from "../screens/control.js";
import { aftermathTemplates } from "../screens/aftermath.js";
import { makeMetric, shot3 } from "./metric.js";

export const M = makeMetric(4);
export const { P, walkM, placeM, builtWorld } = M;

export const CM = "control-main", CS = "control-second", MAP = "control-map";
export const DIAG_BLUE = "rgba(80,160,255,0.55)";

// Marks, in metres (x right, z toward the door; the consoles along z = -5, the door at 1.2).
export const SPOT = {
  primary: [-1.15, -4.45], // at the main console
  beside: [-0.35, -4.4], // beside him, between the consoles
  second: [1.9, -4.45], // at the secondary console
  secondSeat: [1.9, -4.15], // sitting at it (Chapter 4's midnight)
  window: [3.0, -2.75], // at the east window
  windowJack: [2.95, -1.75],
  windowLena: [2.9, -3.45],
  map: [-2.4, -3.6], // in front of the mapping display
  doorIn: [-1.6, 0.55], // just inside the door
  doorOut: [-1.6, 2.1], // outside it, in the hallway
  hallEast: [2.2, 2.1], // along the hallway, out of sight
  lena: [0.6, -3.7], // Lena at the console, behind Jack's shoulder
  lenaChair: [-0.45, -4.05], // "Lena pulled over a chair" (Chapter 7)
  markDoor: [-1.15, 0.55], // "Mark leaned against the doorframe" (Chapter 10)
  mark: [0.9, -2.9], // Mark in the room
};

const T = { ...controlTemplates, ...aftermathTemplates };
const Tmap = { ...mapTemplates, ...aftermathTemplates };

export function controlSet({ jack = SPOT.primary, sarah = SPOT.beside, lena = SPOT.doorOut, mark = SPOT.hallEast, lenaShown = false, markShown = false, props = {}, screens = {}, creatures } = {}) {
  const at = (p) => M.P(...p);
  return {
    world: builtWorld("control", { lookAtLights: ["chamber", "map"], creatures }),
    props: { rings: 0, chamber: 0.03, panel: 0, lever: 0, lighting: 0, white: 0, outside: 1, door: 0, dawn: 0, cups: 0, case: 0, ...props },
    actors: {
      jack: { sprite: "../assets/characters/jack/", pose: "standing", facing: "north", state: "awake", x: at(jack)[0], y: at(jack)[1], layer: "room" },
      sarah: { sprite: "../assets/characters/sarah/", pose: "standing", facing: "north", state: "awake", x: at(sarah)[0], y: at(sarah)[1], layer: "room" },
      lena: { sprite: "../assets/characters/lena/", pose: "standing", facing: "north", state: "awake", x: at(lena)[0], y: at(lena)[1], layer: "room", visible: lenaShown },
      mark: { sprite: "../assets/characters/mark/", pose: "standing", facing: "north", state: "awake", x: at(mark)[0], y: at(mark)[1], layer: "room", visible: markShown },
    },
    screens: {
      [CM]: { corners: [[0, 0], [10, 0], [0, 6], [10, 6]], width: 640, height: 348, templates: T, state: "offline", params: { label: true }, ...screens[CM] },
      [CS]: { corners: [[0, 0], [10, 0], [0, 6], [10, 6]], width: 580, height: 348, templates: T, state: "status", params: {}, ...screens[CS] },
      [MAP]: { corners: [[0, 0], [10, 0], [0, 6], [10, 6]], width: 600, height: 352, templates: Tmap, state: "map", params: { overlay: true }, ...screens[MAP] },
    },
    lights: {
      monitor: { x: 0, y: 0, radius: 0, color: DIAG_BLUE, intensity: 0.35 },
      second: { x: 0, y: 0, radius: 0, color: DIAG_BLUE, intensity: 0.3 },
      map: { x: 0, y: 0, radius: 0, color: DIAG_BLUE, intensity: 0.35 },
      chamber: { x: 0, y: 0, radius: 0, color: "rgba(90,230,240,0.8)", intensity: 0.05 },
    },
    shots: {
      consoles: shot3([0.4, 1.7, -1.6], [0.1, 1.15, -5.6], 58),
      primary: shot3([0.3, 1.55, -3.2], [-1.15, 1.25, -5.4], 50),
      second: shot3([0.6, 1.55, -3.3], [1.9, 1.25, -5.4], 50),
      screenMain: shot3([-0.75, 1.5, -4.15], [-1.1, 1.3, -5.55], 50),
      screenSecond: shot3([1.65, 1.45, -4.2], [1.9, 1.25, -5.5], 50),
      twoShot: shot3([0.9, 1.6, -2.4], [-0.75, 1.45, -4.6], 50),
      faces: shot3([-0.8, 1.55, -5.55], [-0.7, 1.55, -4.4], 52),
      onJack: shot3([-0.2, 1.55, -5.2], [-1.0, 1.5, -4.4], 44),
      onSarah: shot3([0.6, 1.5, -5.3], [-0.2, 1.45, -4.3], 44),
      room: shot3([2.6, 1.9, 0.6], [-0.6, 1.2, -5.2], 62),
      roomWide: shot3([2.9, 2.2, 0.9], [-0.8, 1.0, -4.6], 72),
      window: shot3([0.2, 1.6, -2.4], [0, 1.9, -16], 54),
      toWindow: shot3([0.4, 1.6, -0.8], [3.4, 1.5, -2.6], 56),
      atWindow: shot3([1.9, 1.6, -0.9], [3.2, 1.55, -2.4], 50),
      windowGroup: shot3([1.2, 1.65, -0.4], [3.3, 1.5, -2.9], 60),
      street: shot3([3.36, 1.7, -2.75], [20, 2.0, -9], 66),
      beyond: shot3([3.36, 1.7, -2.75], [80, 22, 2], 66),
      blade: shot3([3.36, 1.7, -2.75], [110, 55, 6], 48),
      window2: shot3([1.4, 1.65, -1.1], [6, 4, -4], 70),
      grassLine: shot3([3.36, 1.7, -2.75], [62, 2, 4], 34), // south of the building across
      final: shot3([3.36, 1.7, -2.75], [120, 34, 2], 62),
      map: shot3([-1.0, 1.6, -3.0], [-3.4, 1.65, -4.25], 54),
      mapClose: shot3([-2.3, 1.7, -3.7], [-3.4, 1.7, -4.2], 52),
      door: shot3([0.6, 1.6, -3.4], [-1.6, 1.3, 1.2], 58),
      doorClose: shot3([-0.2, 1.6, -1.6], [-1.6, 1.45, 1.6], 50),
      fromDoor: shot3([-1.5, 1.7, 0.7], [0.2, 1.2, -4.6], 64),
      lenaShot: shot3([-0.4, 1.55, -2.6], [0.6, 1.5, -3.8], 50),
    },
    camera: { initial: { shot: "twoShot" }, name: "Main control room" },
  };
}
