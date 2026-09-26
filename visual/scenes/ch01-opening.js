// Chapter 1, the opening: the date over black, the island at night from high above, the
// settlement near its centre, then inside the lab from "Deep inside one of those
// laboratories" to Jack opening the network monitor. About ninety seconds of the real
// chapter audio, from 0:00.
//
// The events follow the manuscript; they add nothing to it. Every `at` is anchored to a
// line, a phrase inside a line, or a sound cue in audio/manifests/chapter-01.json, so a
// regenerated clip moves the visuals with it.
//
// Two sets. ISLAND: a 9000 px square of night ocean with the graded island image
// (2048 px, assets/backgrounds/island-night.jpg) in the middle; image pixel (x, y) is
// world (x + 3476, y + 3476). The ocean is so large because the camera never shows past
// the world's edge: at the widest framing a phone sees the whole world across its
// longer side, so the island can only start small if the sea around it is big. Clouds sit on two depth layers that pan and zoom faster
// than the ground, so the camera seems to come down through them. The volcano in the
// source art is under a standing cloud painted into the image by
// scripts/make-island-art.py: the island is man-made, and nothing on screen should say
// otherwise. LAB: coordinates are pixels of the lab image (2048 x 1152); sizes come
// from metres through `perspective`.

import { templates } from "../screens/console.js";
import { settlementLights } from "../paint/island.js";

const DIAG_BLUE = "rgba(80,160,255,0.55)";
const AMBER = "rgba(255,160,50,0.62)";

export default {
  id: "ch01-opening",
  title: "Chapter 1 · The Alarm — opening (prototype)",
  audio: "../audio/exports/chapter-01-drama.mp3",
  manifest: "../audio/manifests/chapter-01.json",
  range: {
    start: { seg: 0 },
    end: { line: "Several windows were opening", edge: "end", offset: 0.6 },
  },
  fadeFromBlack: true,
  painters: { settlementLights },
  initialSet: "island",

  sets: {
    island: {
      world: {
        width: 9000,
        height: 9000,
        color: "#040812", // the open sea, the colour the island image is feathered into
        background: "../assets/backgrounds/island-night.jpg",
        backgroundRect: { x: 3476, y: 3476, w: 2048, h: 2048 },
        layers: [
          { id: "ground", parallax: 1, z: 0 },
          { id: "clouds-low", parallax: 1.1, zoomDepth: 0.3, z: 1 },
          { id: "clouds-high", parallax: 1.3, zoomDepth: 0.6, z: 2 },
        ],
      },
      objects: [
        // The research settlement, in the clearing south-east of the island's middle.
        { id: "settlement", layer: "ground", paint: "settlementLights", x: 4656, y: 4636, w: 560, h: 400, canvas: [1120, 800], opacity: 0.4, seed: 7, z: 12 },
        // Cloud the camera comes down through: two depth layers, drifting east.
        { id: "low-w", layer: "clouds-low", src: "../assets/backgrounds/clouds/wisp-1.png", x: 3800, y: 4950, w: 1300, h: 480, opacity: 0.85, drift: [5, 1] },
        { id: "low-e", layer: "clouds-low", src: "../assets/backgrounds/clouds/wisp-2.png", x: 5450, y: 4350, w: 1200, h: 450, opacity: 0.8, drift: [4, 1] },
        { id: "low-s", layer: "clouds-low", src: "../assets/backgrounds/clouds/wisp-3.png", x: 4900, y: 5500, w: 1200, h: 560, opacity: 0.8, drift: [4, 1] },
        { id: "high-a", layer: "clouds-high", src: "../assets/backgrounds/clouds/wisp-4.png", x: 3950, y: 4250, w: 1700, h: 520, opacity: 0.75, drift: [9, 2] },
        { id: "high-b", layer: "clouds-high", src: "../assets/backgrounds/clouds/wisp-1.png", x: 5350, y: 5150, w: 1600, h: 590, opacity: 0.7, drift: [8, 2] },
        { id: "high-c", layer: "clouds-high", src: "../assets/backgrounds/clouds/wisp-3.png", x: 5250, y: 3600, w: 1300, h: 600, opacity: 0.7, drift: [8, 2] },
        { id: "high-d", layer: "clouds-high", src: "../assets/backgrounds/clouds/wisp-2.png", x: 3550, y: 5350, w: 1300, h: 490, opacity: 0.7, drift: [9, 2] },
      ],
      shots: {
        high: { x: 0, y: 0, w: 9000, h: 9000, focus: [4550, 4550] },
        island: { x: 3380, y: 3380, w: 2300, h: 2300, focus: [4600, 4600] },
        approach: { x: 4006, y: 4136, w: 1300, h: 1000, focus: [4656, 4636] },
        settlement: { x: 4346, y: 4406, w: 620, h: 460, focus: [4656, 4636] },
      },
      camera: { initial: { shot: "high" }, name: "Island · night" },
    },

    lab: {
      world: {
        width: 2048,
        height: 1152,
        background: "../assets/backgrounds/lab-main.jpg",
        // Floor perspective, measured on the image: the centre desk's legs meet the floor at
        // y = 1135, where the 1.7 m desk spans 660 px; its edges converge near y = 580. A point
        // on the floor at y is (y - 580) * 388 / 555 pixels per metre.
        perspective: { horizonY: 580, ref: { y: 1135, pxPerMeter: 388 } },
        layers: [{ id: "room", parallax: 1 }],
        grade: "rgba(7,11,24,0.30)", // late at night: the room dims, the monitor does not
      },

      actors: {
        jack: { sprite: "../assets/characters/jack/", pose: "sitting", facing: "northeast", state: "asleep", x: 720, y: 1200, layer: "room" },
      },

      screens: {
        "jack-monitor": {
          corners: [[890, 614], [1071, 614], [890, 730], [1071, 730]],
          width: 543, height: 348, // drawn at 3x the world size so text stays sharp when the camera pushes in
          templates,
          state: "diagnostics",
        },
      },

      lights: {
        monitor: { x: 980, y: 690, radius: 560, color: DIAG_BLUE, intensity: 0.32 },
        alarm: { x: 980, y: 690, radius: 760, color: AMBER, intensity: 0 },
      },

      // Named framings: the world rectangle to show, and the point to keep in view when a
      // narrow screen cannot show all of it.
      shots: {
        establishing: { x: 0, y: 0, w: 2048, h: 1152, focus: [900, 780] },
        room: { x: 170, y: 170, w: 1700, h: 960, focus: [860, 780] },
        asleep: { x: 420, y: 430, w: 900, h: 700, focus: [820, 800] },
        chirp: { x: 500, y: 470, w: 760, h: 600, focus: [880, 760] },
        close: { x: 560, y: 510, w: 640, h: 520, focus: [900, 740] },
        rollback: { x: 340, y: 400, w: 1000, h: 752, focus: [760, 820] },
        medium: { x: 520, y: 470, w: 760, h: 640, focus: [860, 760] },
        screen: { x: 700, y: 540, w: 560, h: 420, focus: [960, 690] },
      },
      camera: { initial: { shot: "establishing" }, name: "Lab" },
    },
  },

  events: [
    // "It was March fifth, in the year twenty-one ten."
    { at: { seg: 0 }, action: "scene", name: "Date" },
    { at: { seg: 0, offset: 0.25 }, action: "title", text: "March 5, 2110", duration: 4.6, fadeIn: 1.0, fadeOut: 1.3 },

    // "It was almost eleven at night on a remote island somewhere in the Atlantic Ocean.
    //  The island stretched roughly fifty-six kilometers across ... most of it remained
    //  undeveloped wilderness."
    { at: { seg: 1, offset: -0.3 }, action: "scene", name: "The island from high above" },
    { at: { seg: 1, offset: -0.3 }, action: "fade", to: 0, duration: 3.5, ease: "out" },
    { at: { seg: 1 }, action: "camera", shot: "island", duration: 13, ease: "inOut", label: "slow descent toward the island" },

    // "Near its center sat a research settlement of laboratories, homes, workshops..."
    { at: { line: "It was almost eleven", phrase: "Near its center" }, action: "scene", name: "The settlement" },
    { at: { line: "It was almost eleven", phrase: "Near its center", offset: -0.4 }, action: "opacity", target: "settlement", to: 1, duration: 2.6, ease: "inOut", label: "the settlement's lights come up" },
    { at: { line: "It was almost eleven", phrase: "Near its center" }, action: "camera", shot: "approach", duration: 4.5, ease: "inOut", label: "push toward the settlement" },
    ...["high-a", "high-b", "high-c", "high-d"].map((id) => ({ at: { line: "It was almost eleven", phrase: "Near its center", offset: 1 }, action: "opacity", target: id, to: 0, duration: 4, ease: "inOut" })),
    // "... medical facilities, and other buildings supporting the nearly five hundred
    //  people who lived there."
    { at: { line: "It was almost eleven", phrase: "medical facilities" }, action: "camera", shot: "settlement", duration: 4.6, ease: "inOut", label: "closer over the town" },
    ...["low-w", "low-e", "low-s"].map((id) => ({ at: { line: "It was almost eleven", phrase: "medical facilities" }, action: "opacity", target: id, to: 0, duration: 3, ease: "inOut" })),
    { at: { line: "It was almost eleven", edge: "end", offset: -1.0 }, action: "fade", to: 1, duration: 1.0, ease: "in", label: "dip to black" },
    { at: { cue: "ch01-005-lab-bed", offset: -0.05 }, action: "set", set: "lab", label: "cut to the lab" },

    // "Deep inside one of those laboratories, Dr. Jack Bennett was hard at work. Technically."
    { at: { cue: "ch01-005-lab-bed" }, action: "scene", name: "Lab · establishing" },
    { at: { cue: "ch01-005-lab-bed" }, action: "fade", to: 0, duration: 2.2, ease: "out" },
    { at: { cue: "ch01-005-lab-bed", offset: 0.3 }, action: "camera", shot: "room", duration: 11, ease: "slow", label: "slow push into the room" },

    // "Jack sat slumped in his chair ... several pages of diagnostic data glowing on the monitor"
    { at: { line: "Jack sat slumped" }, action: "scene", name: "Jack asleep" },
    { at: { line: "Jack sat slumped" }, action: "camera", shot: "asleep", duration: 10, ease: "inOut", label: "drift toward Jack asleep" },

    // "A warning tone chirped from Jack's console."
    { at: { cue: "ch01-010-first-chirp" }, action: "scene", name: "First warning" },
    { at: { cue: "ch01-010-first-chirp" }, action: "screen", target: "jack-monitor", flash: 0.55, label: "first chirp: amber pulse" },
    { at: { cue: "ch01-010-first-chirp" }, action: "light", target: "alarm", pulse: 0.3 },
    // "He shifted but did not wake."
    { at: { line: "A warning tone chirped", offset: 2.4 }, action: "jolt", actor: "jack", amount: 0.3, duration: 1.1, label: "Jack shifts, still asleep" },

    // "A second tone followed, louder than the first,"
    { at: { cue: "ch01-011-second-chirp" }, action: "scene", name: "Second warning" },
    { at: { cue: "ch01-011-second-chirp" }, action: "screen", target: "jack-monitor", flash: 0.9, label: "second chirp: louder pulse" },
    { at: { cue: "ch01-011-second-chirp" }, action: "light", target: "alarm", pulse: 0.5 },
    { at: { cue: "ch01-011-second-chirp" }, action: "camera", shot: "chirp", duration: 6, ease: "inOut" },
    // "... and the diagnostic display flashed amber."
    { at: { line: "A warning tone chirped", edge: "end", offset: -1.5 }, action: "screen", target: "jack-monitor", state: "diagnostics", params: { tint: "amber" }, flash: 1, label: "display flashes amber" },
    { at: { line: "A warning tone chirped", edge: "end", offset: -1.5 }, action: "light", target: "monitor", color: AMBER, intensity: 0.42, duration: 0.4 },
    { at: { line: "A warning tone chirped", edge: "end", offset: -1.5 }, action: "light", target: "alarm", pulse: 0.6 },

    // "Warning. Unauthorized system access."
    { at: { line: "Warning. Unauthorized system access." }, action: "scene", name: "Unauthorized access" },
    { at: { line: "Warning. Unauthorized system access." }, action: "screen", target: "jack-monitor", state: "warning", text: { line: "Warning. Unauthorized system access." }, flash: 1, label: "WARNING on screen" },
    { at: { line: "Warning. Unauthorized system access." }, action: "light", target: "alarm", intensity: 0.34, throb: 1.4, duration: 0.3 },
    { at: { line: "Warning. Unauthorized system access." }, action: "camera", shot: "close", duration: 2.4, ease: "inOut" },

    // "Jack jerked awake so quickly that his chair rolled backward and nearly struck another workstation."
    { at: { line: "Jack jerked awake", offset: 0.35 }, action: "scene", name: "Jack wakes" },
    { at: { line: "Jack jerked awake", offset: 0.35 }, action: "state", actor: "jack", state: "awake" },
    { at: { line: "Jack jerked awake", offset: 0.35 }, action: "jolt", actor: "jack", amount: 1.3, duration: 0.5, label: "Jack jerks awake" },
    { at: { line: "Jack jerked awake", offset: 0.35 }, action: "face", actor: "jack", direction: "north" },
    { at: { cue: "ch01-020-chair-startle" }, action: "move", actor: "jack", x: 630, y: 1264, duration: 0.8, ease: "out", label: "chair rolls backward" },
    { at: { cue: "ch01-020-chair-startle" }, action: "shake", amount: 3, duration: 0.35 },
    { at: { cue: "ch01-020-chair-startle" }, action: "camera", shot: "rollback", duration: 1.5, ease: "out" },

    // Jack: "What? Okay, I'm awake."
    { at: { line: "What? Okay, I'm awake." }, action: "face", actor: "jack", direction: "northwest", label: "“What?” — looks around" },
    { at: { line: "What? Okay, I'm awake.", offset: 0.8 }, action: "face", actor: "jack", direction: "northeast", label: "“Okay, I'm awake.”" },

    // "The warning repeated while Jack rubbed his eyes and leaned toward the monitor."
    { at: { line: "The warning repeated" }, action: "scene", name: "Investigating" },
    { at: { line: "The warning repeated" }, action: "screen", target: "jack-monitor", flash: 0.8, label: "the warning repeats" },
    { at: { line: "The warning repeated" }, action: "light", target: "alarm", pulse: 0.4 },
    { at: { line: "The warning repeated", offset: 2.0 }, action: "state", actor: "jack", state: "leaning" },
    { at: { line: "The warning repeated", offset: 2.0 }, action: "move", actor: "jack", x: 745, y: 1196, duration: 2.0, ease: "inOut", label: "leans toward the monitor" },
    { at: { line: "The warning repeated", offset: 1.4 }, action: "camera", shot: "medium", duration: 3.2, ease: "inOut" },

    // Jack: "That's not good."
    { at: { line: "That's not good." }, action: "move", actor: "jack", dy: -6, duration: 0.6, ease: "out" },

    // "Several windows were opening and closing on their own. Lines of commands streamed across
    //  one side of the display faster than he could read them. Jack grabbed the keyboard and
    //  opened the network monitor."
    { at: { line: "Several windows were opening" }, action: "scene", name: "Intrusion" },
    { at: { line: "Several windows were opening" }, action: "screen", target: "jack-monitor", state: "intrusion", params: { networkMonitorAt: 10.2 }, label: "windows open and close on their own" },
    { at: { line: "Several windows were opening", offset: 0.6 }, action: "camera", shot: "screen", duration: 7, ease: "inOut", label: "push in over Jack's shoulder" },
    { at: { line: "Several windows were opening", offset: 8.4 }, action: "move", actor: "jack", dy: -8, duration: 0.5, ease: "out", label: "grabs the keyboard" },
    { at: { line: "Several windows were opening", offset: 10.2 }, action: "scene", name: "Network monitor" },
    { at: { line: "Several windows were opening", edge: "end", offset: -0.3 }, action: "fade", to: 1, duration: 0.9, ease: "in" },
  ],
};
