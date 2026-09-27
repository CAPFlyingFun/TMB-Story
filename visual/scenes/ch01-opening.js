// Chapter 1, "The Alarm", the whole chapter over its real audio (8 min 33 s): the date over
// black, the island at night from high above, the settlement near its centre, then the lab
// -- Jack asleep, the intrusion, the intercom, Sarah, the chair, the TOMBS request, and
// "I didn't."
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

import { templates, sarahTemplates } from "../screens/console.js";
import { settlementLights } from "../paint/island.js";

const DIAG_BLUE = "rgba(80,160,255,0.55)";
const AMBER = "rgba(255,160,50,0.62)";

// ---------------------------------------------------------------------------------------
// The rest of the chapter in the lab, after the network monitor opens (1:27 to the end).
// Helpers keep the list readable: L() anchors to a line, plus() shifts an anchor, and
// walk() is a storybook walk: face the way you go, step there, settle.
const L = (line, o = {}) => ({ line, ...o });
const plus = (a, s) => ({ ...a, offset: (a.offset || 0) + s });
function walk(actor, from, to, dur, dir, then) {
  const ev = [
    { at: from, action: "state", actor, state: "walking" },
    { at: from, action: "face", actor, direction: dir },
    { at: from, action: "move", actor, x: to[0], y: to[1], duration: dur, ease: "inOut" },
    { at: plus(from, dur), action: "state", actor, state: "idle" },
  ];
  if (then) ev.push({ at: plus(from, dur), action: "face", actor, direction: then });
  return ev;
}
const says = (line, o) => ({ at: L(line, o), action: "light", target: "intercom", pulse: 0.5, pulseDuration: 0.6 });
const J = "jack-monitor", S = "sarah-monitor";

// Where the two end up: Jack at his own screen, Sarah at the console to his right.
// Side by side, each nearly in front of their own monitor (Joshua, 2026-09-27), at the same
// depth so the chairs are the same size. Jack's first chair, the one he gives Sarah, sits
// where the floor lets it: against the left cabinets at 836.
const JACK_SEAT = [890, 1184], SARAH_SEAT = [1210, 1184], JACKS_OLD_CHAIR = [836, 1196];

const REST = [
  // "Come on. What are you doing?" / "An unfamiliar connection appeared for half a second
  //  and vanished."
  { at: L("An unfamiliar connection"), action: "screen", target: J, state: "netmon", params: { blipAt: 1.2, blipFor: 0.5 }, label: "a connection appears and vanishes" },
  { at: L("Jack frowned."), action: "jolt", actor: "jack", amount: 0.2, duration: 0.6 },
  // "He refreshed the display, but the connection was gone. Another warning tone sounded
  //  from the console and a red message filled the center of his screen."
  { at: L("He refreshed the display"), action: "screen", target: J, state: "netmon", params: { refreshAt: 0 }, flash: 0.4 },
  { at: { cue: "ch01-040-second-alarm" }, action: "screen", target: J, state: "warning", text: L("Security protocol violation."), params: { tone: "red" }, flash: 1, label: "red: security protocol violation" },
  { at: { cue: "ch01-040-second-alarm" }, action: "light", target: "alarm", color: "rgba(255,50,40,0.6)", pulse: 0.6 },
  { at: { cue: "ch01-040-second-alarm" }, action: "jolt", actor: "jack", amount: 0.5, duration: 0.5 },
  { at: { cue: "ch01-040-second-alarm" }, action: "camera", shot: "close", duration: 1.6, ease: "out" },
  // "Jack entered a command and pulled up the laboratory access logs. Nothing looked unusual.
  //  He tried another search and got the same result."
  { at: L("Jack entered a command"), action: "scene", name: "Access logs" },
  { at: L("Jack entered a command", { offset: 1.2 }), action: "screen", target: J, state: "logs", params: { pass: 1 } },
  { at: L("Jack entered a command", { phrase: "He tried another search" }), action: "screen", target: J, state: "logs", params: { pass: 2 }, flash: 0.3 },
  { at: L("Jack entered a command"), action: "camera", shot: "medium", duration: 4, ease: "inOut" },
  { at: L("Jack entered a command", { edge: "end" }), action: "light", target: "alarm", intensity: 0, throb: 0, duration: 2.5, label: "the alarm settles" },
  { at: L("Jack entered a command", { edge: "end" }), action: "light", target: "monitor", color: DIAG_BLUE, intensity: 0.32, duration: 1 },
  { at: L("That's impossible."), action: "jolt", actor: "jack", amount: 0.25, duration: 0.6 },

  // "The system beeped, and a directory opened by itself. Jack stopped typing when he
  //  recognized the folder." / "Tombs project."
  { at: { cue: "ch01-050-directory-opens" }, action: "scene", name: "The TOMBS directory" },
  { at: { cue: "ch01-050-directory-opens" }, action: "screen", target: J, state: "directory", text: L("Tombs project."), flash: 0.5, label: "a directory opens by itself" },
  { at: { cue: "ch01-050-directory-opens" }, action: "camera", shot: "screen", duration: 3, ease: "inOut" },
  { at: L("The system beeped", { phrase: "Jack stopped typing" }), action: "state", actor: "jack", state: "still" },
  { at: L("Tombs project."), action: "screen", target: J, flash: 0.5 },
  // "He immediately locked the terminal. The screen went black for three seconds, then came
  //  back on and reopened the same directory."
  { at: { cue: "ch01-060-terminal-lock" }, action: "screen", target: J, state: "locked", label: "terminal locked" },
  { at: { cue: "ch01-060-terminal-lock" }, action: "light", target: "monitor", intensity: 0.04, duration: 0.3 },
  { at: { cue: "ch01-060-terminal-lock" }, action: "jolt", actor: "jack", amount: 0.4, duration: 0.4 },
  { at: { cue: "ch01-061-terminal-returns" }, action: "screen", target: J, state: "directory", text: L("Tombs project."), flash: 0.6, label: "…and it comes back" },
  { at: { cue: "ch01-061-terminal-returns" }, action: "light", target: "monitor", intensity: 0.32, duration: 0.3 },
  { at: L("Jack stared at it."), action: "camera", shot: "medium", duration: 2.5, ease: "inOut" },

  // The intercom. "He reached for the intercom." / "Sarah?" / "Static answered him."
  { at: L("He reached for the intercom."), action: "scene", name: "The intercom" },
  { at: L("He reached for the intercom."), action: "state", actor: "jack", state: "leaning" },
  { at: L("He reached for the intercom."), action: "face", actor: "jack", direction: "north" },
  { at: L("He reached for the intercom."), action: "camera", shot: "intercom", duration: 2.5, ease: "inOut" },
  { at: { cue: "ch01-070-intercom-open" }, action: "light", target: "intercom", intensity: 0.55, duration: 0.2, label: "intercom open" },
  { at: { cue: "ch01-072-static-answers" }, action: "light", target: "intercom", throb: 6 },
  { at: L("Jack tapped the button again."), action: "light", target: "intercom", throb: 0, pulse: 0.4 },
  says("I'm here. What's wrong?"),
  says("Define weird."),
  // "Jack reopened the network monitor." / "Jack scanned the empty connection list."
  { at: L("Jack reopened the network monitor."), action: "screen", target: J, state: "netmon", params: {}, label: "the empty connection list" },
  { at: L("Jack reopened the network monitor."), action: "face", actor: "jack", direction: "northeast" },
  says("Are you sure?"),
  says("Good answer."),
  { at: L("Jack smiled despite himself."), action: "state", actor: "jack", state: "awake" },
  says("I'm on my way,"),
  // "Jack released the intercom and looked back at the monitor. The TOMBS directory was
  //  still open." / "Who are you?"
  { at: { cue: "ch01-080-intercom-close" }, action: "light", target: "intercom", intensity: 0, duration: 0.3, label: "intercom closed" },
  { at: L("Jack released the intercom"), action: "screen", target: J, state: "directory", text: L("Tombs project.") },
  { at: L("Jack released the intercom"), action: "camera", shot: "screen", duration: 5, ease: "inOut" },
  { at: L("Jack released the intercom"), action: "state", actor: "jack", state: "leaning" },
  // "The cursor moved without him touching anything." / "Jack froze as a file opened."
  { at: L("The cursor moved"), action: "scene", name: "The cursor moves" },
  { at: L("The cursor moved", { offset: 0.4 }), action: "screen", target: J, state: "directory", text: L("Tombs project."), params: { cursorAt: 0, openAt: 99 }, label: "the cursor moves by itself" },
  { at: L("Jack froze as a file opened."), action: "state", actor: "jack", state: "still" },
  { at: { cue: "ch01-090-file-opens" }, action: "screen", target: J, state: "directory", text: L("Tombs project."), params: { cursorAt: -5, openAt: 0, fileTitle: "BOUNDARY CONTROL" }, flash: 0.8, label: "BOUNDARY CONTROL opens" },
  { at: { cue: "ch01-090-file-opens" }, action: "light", target: "monitor", color: AMBER, intensity: 0.4, duration: 0.4 },
  // "He reached for the keyboard just as the laboratory door slid open behind him."
  { at: L("He reached for the keyboard"), action: "move", actor: "jack", x: 745, y: 1178, duration: 0.5, ease: "out" },
  { at: { cue: "ch01-100-door-slides" }, action: "camera", shot: "doorway", duration: 2.6, ease: "inOut", label: "the door, behind him" },
  { at: { cue: "ch01-100-door-slides" }, action: "jolt", actor: "jack", amount: 0.5, duration: 0.5 },

  // "Sarah Bennett walked straight in, tablet tucked beneath one arm, already crossing
  //  toward him. She glanced from Jack to the computer." (revised 2026-09-26)
  { at: L("Sarah Bennett"), action: "scene", name: "Sarah" },
  { at: { cue: "ch01-101-sarah-enters", offset: -0.4 }, action: "show", actor: "sarah" },
  { at: { cue: "ch01-101-sarah-enters", offset: -0.4 }, action: "opacity", target: "sarah", to: 1, duration: 0.4, ease: "out" },
  // Straight up the aisle from the bottom of the frame -- heading 272 degrees in GameMaker's
  // terms, inside Joshua's 265-275 -- to the corner of the desks he marked, large at the
  // bottom and her normal size where she stops.
  ...walk("sarah", { cue: "ch01-101-sarah-enters", offset: -0.4 }, [1270, 1290], 3.2, "north", "west"),
  { at: L("Please tell me you didn't break"), action: "face", actor: "jack", direction: "east", label: "Jack turns to her" },
  { at: L("Please tell me you didn't break"), action: "state", actor: "jack", state: "awake" },
  { at: L("Jack gestured toward the console."), action: "face", actor: "jack", direction: "northeast" },
  { at: L("Jack gestured toward the console."), action: "jolt", actor: "jack", amount: 0.3, duration: 0.5 },
  // "Sarah closed the distance between them." (segment 59: anchored by order, because the
  // line replaced "Sarah stopped just inside the doorway" on 2026-09-26 and both texts must
  // work while the audio catches up.)
  ...walk("sarah", { seg: 59 }, [1115, 1236], 2.6, "west", "northwest"),
  { at: { seg: 59 }, action: "camera", shot: "twoshot", duration: 4, ease: "inOut" },
  // "Jack pointed toward the monitor. 'Whatever this is.'"
  { at: L("Jack pointed toward the monitor"), action: "jolt", actor: "jack", amount: 0.25, duration: 0.5 },
  { at: L("Whatever this is."), action: "face", actor: "jack", direction: "east" },
  { at: L("Jack sat a little straighter."), action: "move", actor: "jack", x: 745, y: 1188, duration: 0.5, ease: "out" },
  { at: L("Jack nodded solemnly."), action: "jolt", actor: "jack", amount: 0.3, duration: 0.7 },
  // "She leaned over his shoulder and studied the screen." / "Jack."
  { at: L("She leaned over his shoulder"), action: "state", actor: "sarah", state: "leaning" },
  { at: L("She leaned over his shoulder"), action: "move", actor: "sarah", x: 1085, y: 1230, duration: 1, ease: "inOut" },
  { at: L("She leaned over his shoulder"), action: "camera", shot: "leanover", duration: 3, ease: "inOut" },
  { at: L("Jack straightened in his chair"), action: "face", actor: "jack", direction: "northeast" },
  { at: L("Jack straightened in his chair"), action: "jolt", actor: "jack", amount: 0.3, duration: 0.5 },
  { at: L("Sarah tapped the edge of the keyboard."), action: "jolt", actor: "sarah", amount: 0.2, duration: 0.4 },
  { at: L("Sarah's attention sharpened."), action: "state", actor: "sarah", state: "awake" },
  { at: L("Jack nodded.", { nth: 0 }), action: "jolt", actor: "jack", amount: 0.25, duration: 0.5 },
  { at: L("Jack leaned back."), action: "move", actor: "jack", x: JACKS_OLD_CHAIR[0], y: JACKS_OLD_CHAIR[1], duration: 0.8, ease: "out" },
  { at: L("Jack leaned back."), action: "state", actor: "jack", state: "idle" },
  { at: L("Sarah stared at him"), action: "face", actor: "sarah", direction: "west" },
  { at: L("Sarah stared at him", { phrase: "before looking back" }), action: "face", actor: "sarah", direction: "northwest" },
  { at: L("Sarah stared at him"), action: "camera", shot: "twoshot", duration: 4, ease: "inOut" },

  // "Sarah started powering up the other console next to Jack."
  { at: L("Sarah started powering up"), action: "scene", name: "The other console" },
  ...walk("sarah", L("Sarah started powering up"), [1170, 1232], 1.6, "east", "north"),
  { at: L("Sarah started powering up", { offset: 1.6 }), action: "screen", target: S, state: "boot", label: "Sarah's console starts" },
  { at: L("Sarah started powering up", { offset: 1.6 }), action: "light", target: "sarahScreen", intensity: 0.3, duration: 1.2 },
  { at: L("Can I take your chair?"), action: "face", actor: "sarah", direction: "west" },
  // "Sarah nudged the arm of his chair, looking slightly annoyed, but sympathetic."
  // 1) She comes in close to nudge his chair...
  ...walk("sarah", L("Sarah nudged the arm of his chair"), [950, 1234], 1.1, "west"),
  { at: L("Sarah nudged the arm of his chair", { offset: 1.2 }), action: "jolt", actor: "jack", amount: 0.35, duration: 0.5 },
  { at: L("Sarah nudged the arm of his chair", { offset: 1.2 }), action: "jolt", actor: "sarah", amount: 0.2, duration: 0.4 },
  { at: L("Let me have your chair"), action: "camera", shot: "room", duration: 2.6, ease: "inOut", label: "wide for the chair swap" },
  // ...and backs off to the side, still facing him, so he has room to stand. She stays at
  // his depth (y 1196), so when he is on his feet beside her their feet are on one line;
  // backing toward the camera put hers lower and made him look as if he floated.
  { at: L("Let me have your chair", { offset: 0.2 }), action: "move", actor: "sarah", x: 1150, y: JACKS_OLD_CHAIR[1], duration: 1.2, ease: "inOut", label: "Sarah backs off" },

  // "Jack gave Sarah his chair, crossed to the next workstation, and dragged its chair back,
  //  wheels squeaking against the floor, before pulling himself up to his own screen."
  // The seated sprites carry their chair, so the swap is staged: Jack stands and walks out
  // past the camera on the left, Sarah sits in his place and rolls to her console, and Jack
  // comes back from past the camera already seated, rolling the other chair to his screen.
  { at: L("Jack gave Sarah his chair"), action: "scene", name: "The chair" },
  // 2) Jack stands...
  { at: L("Jack gave Sarah his chair", { offset: 0.2 }), action: "stand", actor: "jack" },
  // 3) ...and walks straight down the aisle toward the lens (heading 270), growing, and
  // fades as he passes the camera to "the next workstation", which is behind it.
  ...walk("jack", L("Jack gave Sarah his chair", { offset: 0.4 }), [836, 2050], 2.4, "south"),
  { at: L("Jack gave Sarah his chair", { offset: 2.0 }), action: "opacity", target: "jack", to: 0, duration: 0.8, ease: "in" },
  // 3a) Once he is out of her way, Sarah takes his chair -- exactly where it stood -- and
  // rolls it to her own screen while he is still on his way out.
  ...walk("sarah", L("Jack gave Sarah his chair", { offset: 1.6 }), JACKS_OLD_CHAIR, 0.9, "west"),
  { at: L("Jack gave Sarah his chair", { offset: 2.5 }), action: "sit", actor: "sarah" },
  { at: L("Jack gave Sarah his chair", { offset: 2.5 }), action: "face", actor: "sarah", direction: "north" },
  { at: L("Jack gave Sarah his chair", { offset: 2.8 }), action: "move", actor: "sarah", x: SARAH_SEAT[0], y: SARAH_SEAT[1], duration: 2.2, ease: "inOut", label: "Sarah rolls to her console" },
  { at: L("Jack gave Sarah his chair", { phrase: "and dragged its chair back" }), action: "sit", actor: "jack" },
  { at: L("Jack gave Sarah his chair", { phrase: "and dragged its chair back" }), action: "move", actor: "jack", x: 860, y: 2050, label: "(out of sight, with the other chair)" },
  { at: L("Jack gave Sarah his chair", { phrase: "and dragged its chair back" }), action: "face", actor: "jack", direction: "north" },
  // ...and comes back seated, rolling straight up the aisle from past the lens (within 2
  // degrees of straight up) and shrinking to his screen.
  { at: L("Jack gave Sarah his chair", { phrase: "wheels squeaking" }), action: "opacity", target: "jack", to: 1, duration: 0.5, ease: "out" },
  { at: L("Jack gave Sarah his chair", { phrase: "wheels squeaking" }), action: "move", actor: "jack", x: JACK_SEAT[0], y: JACK_SEAT[1], duration: 3.2, ease: "inOut", label: "Jack rolls the other chair back" },
  { at: L("Jack gave Sarah his chair", { edge: "end", offset: -0.4 }), action: "face", actor: "jack", direction: "northeast" },
  { at: L("Jack gave Sarah his chair", { edge: "end", offset: -0.4 }), action: "state", actor: "jack", state: "leaning" },

  // Side by side. "Sarah was already typing."
  { at: L("Sarah was already typing."), action: "scene", name: "Side by side" },
  { at: L("Sarah was already typing."), action: "camera", shot: "pair", duration: 3, ease: "inOut" },
  { at: L("Sarah was already typing."), action: "state", actor: "sarah", state: "leaning" },
  { at: L("Sarah was already typing."), action: "screen", target: S, state: "history", params: {} },
  { at: L("Jack watched his own log scroll."), action: "screen", target: J, state: "logs", params: { pass: 1, scroll: true } },
  { at: L("Jack watched his own log scroll."), action: "light", target: "monitor", color: DIAG_BLUE, intensity: 0.32, duration: 0.8 },
  { at: L("Sarah opened the connection history"), action: "camera", shot: "sarahScreen", duration: 2.2, ease: "inOut" },
  { at: L("Sarah opened the connection history"), action: "screen", target: S, state: "history", params: {}, flash: 0.3 },
  { at: L("Jack shook his head."), action: "camera", shot: "pair", duration: 2.2, ease: "inOut" },
  { at: L("Jack shook his head."), action: "jolt", actor: "jack", amount: 0.2, duration: 0.8 },
  // "Jack pulled up the TOMBS directory again, tracing back through what had changed."
  { at: L("Jack pulled up the TOMBS directory again"), action: "screen", target: J, state: "directory", text: L("Tombs project.") },
  { at: L("Jack pulled up the TOMBS directory again"), action: "camera", shot: "screen", duration: 2.4, ease: "inOut" },
  { at: L("These are clean,"), action: "screen", target: S, state: "history", params: { clean: true } },
  { at: L("These are clean,"), action: "camera", shot: "pair", duration: 2.4, ease: "inOut" },
  { at: L("Jack pointed at his own screen."), action: "jolt", actor: "jack", amount: 0.25, duration: 0.5 },
  { at: L("Jack nodded.", { nth: 1 }), action: "jolt", actor: "jack", amount: 0.25, duration: 0.5 },
  { at: L("Sarah looked sideways at him."), action: "face", actor: "sarah", direction: "northwest" },
  { at: L("Sarah shook her head"), action: "face", actor: "sarah", direction: "north" },
  { at: L("Sarah shook her head"), action: "camera", shot: "pairClose", duration: 8, ease: "inOut" },
  { at: L("Sarah shook her head", { phrase: "He glanced at the time" }), action: "face", actor: "jack", direction: "east" },
  { at: L("Sarah shook her head", { phrase: "He glanced at the time" }), action: "state", actor: "jack", state: "awake" },
  { at: L("Sarah looked over at him."), action: "face", actor: "sarah", direction: "west" },
  { at: L("Sarah looked over at him."), action: "state", actor: "sarah", state: "awake" },
  { at: L("Jack spread his hands."), action: "jolt", actor: "jack", amount: 0.35, duration: 0.6 },
  { at: L("Jack considered it."), action: "face", actor: "jack", direction: "north" },
  { at: L("I wasn't uncomfortable?"), action: "face", actor: "jack", direction: "east" },
  { at: L("Jack surrendered with a small nod."), action: "jolt", actor: "jack", amount: 0.3, duration: 0.6 },
  // "Lately the baby seems to think eleven at night is morning." / "Sarah rested a hand
  //  briefly against her stomach, then returned to typing."
  { at: L("Lately the baby"), action: "camera", shot: "onSarah", duration: 3.5, ease: "inOut" },
  { at: L("Sarah rested a hand briefly"), action: "state", actor: "sarah", state: "still" },
  { at: L("Sarah rested a hand briefly", { phrase: "then returned to typing" }), action: "face", actor: "sarah", direction: "north" },
  { at: L("Sarah rested a hand briefly", { phrase: "then returned to typing" }), action: "state", actor: "sarah", state: "leaning" },
  { at: L("Jack smiled at the movement"), action: "camera", shot: "pairClose", duration: 3, ease: "inOut" },
  { at: L("Sarah's hands went still."), action: "state", actor: "sarah", state: "still" },
  { at: L("That's what I'm afraid of."), action: "face", actor: "sarah", direction: "west" },

  // "A new warning tone interrupted them. Both turned toward the main console as another
  //  message appeared." / "Tombs array remote initialization request."
  { at: { cue: "ch01-150-interrupting-tone" }, action: "scene", name: "The request" },
  { at: { cue: "ch01-150-interrupting-tone" }, action: "light", target: "alarm", color: AMBER, pulse: 0.6 },
  { at: L("A new warning tone", { offset: 1.2 }), action: "face", actor: "sarah", direction: "northwest" },
  { at: L("A new warning tone", { offset: 1.2 }), action: "face", actor: "jack", direction: "northeast" },
  { at: L("A new warning tone", { offset: 1.2 }), action: "state", actor: "jack", state: "leaning" },
  { at: L("A new warning tone", { offset: 1.2 }), action: "camera", shot: "twoshot", duration: 2.5, ease: "inOut" },
  { at: L("Tombs array remote initialization request."), action: "screen", target: J, state: "request", text: L("Tombs array remote initialization request."), flash: 1, label: "TOMBS ARRAY: REMOTE INITIALIZATION REQUEST" },
  { at: L("Tombs array remote initialization request."), action: "light", target: "monitor", color: AMBER, intensity: 0.45, duration: 0.4 },
  { at: L("Tombs array remote initialization request."), action: "light", target: "alarm", intensity: 0.25, throb: 1.2, duration: 0.4 },
  { at: L("Tombs array remote initialization request."), action: "camera", shot: "screen", duration: 2.2, ease: "inOut" },
  { at: L("Sarah sat upright."), action: "jolt", actor: "sarah", amount: 0.4, duration: 0.5 },
  { at: L("Sarah sat upright."), action: "state", actor: "sarah", state: "awake" },
  { at: L("Sarah sat upright."), action: "camera", shot: "pair", duration: 2, ease: "inOut" },
  { at: L("Jack reached for the console."), action: "move", actor: "jack", x: 750, y: 1176, duration: 0.6, ease: "out" },
  { at: L("Sarah pointed at the request."), action: "jolt", actor: "sarah", amount: 0.25, duration: 0.5 },
  // "Jack reached across the console and rejected the request." / "Request denied." x2
  { at: L("Jack reached across the console"), action: "camera", shot: "screen", duration: 2, ease: "inOut" },
  { at: { cue: "ch01-160-denied-first" }, action: "screen", target: J, state: "request", text: L("Tombs array remote initialization request."), params: { denied: 1 }, flash: 0.8, label: "request denied" },
  { at: { cue: "ch01-160-denied-first" }, action: "light", target: "alarm", pulse: 0.4 },
  { at: { cue: "ch01-161-denied-second" }, action: "screen", target: J, state: "request", text: L("Tombs array remote initialization request."), params: { denied: 2 }, flash: 0.8, label: "denied again" },
  { at: { cue: "ch01-161-denied-second" }, action: "light", target: "alarm", pulse: 0.5 },
  { at: L("Jack's expression hardened."), action: "camera", shot: "pairClose", duration: 2.2, ease: "inOut" },
  { at: L("Jack's expression hardened."), action: "state", actor: "jack", state: "still" },
  // "He entered his administrator credentials, but a new message appeared..." / "Access revoked."
  { at: L("He entered his administrator credentials"), action: "screen", target: J, state: "request", text: L("Tombs array remote initialization request."), params: { denied: 2, creds: true } },
  { at: L("He entered his administrator credentials"), action: "camera", shot: "screen", duration: 3, ease: "inOut" },
  { at: { cue: "ch01-170-revoked" }, action: "screen", target: J, state: "request", text: L("Tombs array remote initialization request."), params: { denied: 2, revoked: true }, flash: 1, label: "ACCESS REVOKED" },
  { at: { cue: "ch01-170-revoked" }, action: "light", target: "monitor", color: "rgba(255,50,40,0.6)", intensity: 0.5, duration: 0.3 },
  { at: { cue: "ch01-170-revoked" }, action: "light", target: "alarm", color: "rgba(255,50,40,0.6)", pulse: 0.7 },
  { at: L("Sarah looked from the message to him."), action: "face", actor: "sarah", direction: "west" },
  { at: L("Sarah looked from the message to him."), action: "camera", shot: "pair", duration: 2.4, ease: "inOut" },
  { at: L("Jack stared at the warning."), action: "face", actor: "jack", direction: "northeast" },
  { at: L("Sarah turned toward him."), action: "face", actor: "sarah", direction: "west" },
  { at: L("Jack tried his credentials again."), action: "jolt", actor: "jack", amount: 0.3, duration: 0.5 },
  { at: { cue: "ch01-172-jack-retries" }, action: "screen", target: J, flash: 0.9 },
  { at: L("Sarah leaned toward the screen."), action: "face", actor: "sarah", direction: "northwest" },
  { at: L("Sarah leaned toward the screen."), action: "state", actor: "sarah", state: "leaning" },
  { at: L("Jack stopped typing."), action: "state", actor: "jack", state: "still" },
  { at: L("Jack stopped typing."), action: "camera", shot: "pairClose", duration: 7, ease: "inOut" },
  // "Sarah slowly turned toward him." / "Jack." / "Jack met her eyes." / "I didn't."
  { at: L("Sarah slowly turned toward him."), action: "face", actor: "sarah", direction: "west" },
  { at: L("Sarah slowly turned toward him."), action: "state", actor: "sarah", state: "still" },
  { at: L("Jack met her eyes."), action: "face", actor: "jack", direction: "east" },
  { at: L("I didn't.", { edge: "end", offset: -0.35 }), action: "fade", to: 1, duration: 0.3, ease: "in", label: "cut to black" },
  // Cutout-rig gestures, each on the line that describes it. Drawn only with ?rig=1 (an
  // experiment: engine/rig.js, visual/rig.html); without it the plain sprites are unchanged.
  { at: L("Jack entered a command"), action: "gesture", actor: "jack", animation: "type", duration: 3.0 },
  { at: L("He reached for the intercom."), action: "gesture", actor: "jack", animation: "lean-forward", duration: 1.4 },
  { at: L("Jack smiled despite himself."), action: "gesture", actor: "jack", animation: "look-down", duration: 1.0 },
  { at: L("Sarah raised an eyebrow."), action: "gesture", actor: "sarah", animation: "look-left", duration: 0.9 },
  { at: L("Jack pointed toward the monitor"), action: "gesture", actor: "jack", animation: "point", duration: 1.2 },
  { at: L("Jack nodded solemnly."), action: "gesture", actor: "jack", animation: "nod", duration: 1.2 },
  { at: L("Jack nodded.", { nth: 0 }), action: "gesture", actor: "jack", animation: "nod", duration: 0.9 },
  { at: L("Sarah was already typing."), action: "gesture", actor: "sarah", animation: "type", duration: 2.4 },
  { at: L("Jack shook his head."), action: "gesture", actor: "jack", animation: "shake-head", duration: 1.0 },
  { at: L("Jack nodded.", { nth: 1 }), action: "gesture", actor: "jack", animation: "nod", duration: 0.9 },
  { at: L("Sarah looked sideways at him."), action: "gesture", actor: "sarah", animation: "look-left", duration: 1.4 },
  { at: L("Sarah shook her head"), action: "gesture", actor: "sarah", animation: "shake-head", duration: 1.0 },
  { at: L("Sarah kept typing."), action: "gesture", actor: "sarah", animation: "type", duration: 1.8 },
  { at: L("Jack spread his hands."), action: "gesture", actor: "jack", animation: "small-hand-gesture", duration: 1.2 },
  { at: L("Jack considered it."), action: "gesture", actor: "jack", animation: "look-up", duration: 1.3 },
  { at: L("Jack surrendered with a small nod."), action: "gesture", actor: "jack", animation: "nod", duration: 0.9 },
  { at: L("Sarah rested a hand briefly"), action: "gesture", actor: "sarah", animation: "small-hand-gesture", duration: 2.0 },
  { at: L("Sarah sat upright."), action: "gesture", actor: "sarah", animation: "lean-back", duration: 0.8 },
  { at: L("He entered his administrator credentials"), action: "gesture", actor: "jack", animation: "type", duration: 2.0 },
  { at: L("Jack tried his credentials again."), action: "gesture", actor: "jack", animation: "type", duration: 1.4 },
  { at: L("Sarah leaned toward the screen."), action: "gesture", actor: "sarah", animation: "lean-forward", duration: 1.6 },
];

export default {
  id: "ch01-opening",
  title: "Chapter 1 · The Alarm (prototype)",
  audio: "../audio/exports/chapter-01-drama.mp3",
  manifest: "../audio/manifests/chapter-01.json",
  range: {
    start: { seg: 0 },
    end: { line: "I didn't.", edge: "end" },
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
        bounded: false, // the sea runs on past the edge, so the camera may start wider than the world
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
        high: { x: 2200, y: 2200, w: 4600, h: 4600, focus: [4500, 4500] },
        settlement: { x: 4396, y: 4441, w: 520, h: 390, focus: [4656, 4636] },
      },
      camera: { initial: { shot: "high" }, name: "Island · night" },
    },

    lab: {
      world: {
        width: 2048,
        height: 1152,
        // The wide lab (scripts/make-lab-wide.py): Joshua's expansion of the lab picture, with
        // the original set back in its middle. Coordinates are still pixels of the ORIGINAL
        // (2048 x 1152); the expansion adds room to the sides and floor nearer the camera, so
        // the world runs from (-790, -182) to (2838, 1859).
        background: "../assets/backgrounds/lab-wide.jpg",
        bounds: { x: -790, y: -182, w: 3628, h: 2041 },
        backgroundRect: { x: -790, y: -182, w: 3628, h: 2041 },
        // The walkable floor: the aisle between the two runs of cabinets, traced on the wide
        // picture where the cabinets meet the floor (Joshua, 2026-09-27: "Jack's chair's foot
        // is in the cabinet"). The back edge is the front of the centre desk; the sides run
        // out toward the camera and on past the bottom of the picture. The stage keeps every
        // footprint inside it: the chair's base seated, the feet standing.
        floor: [[690, 1100], [1400, 1100], [1420, 1213], [1513, 1320], [1740, 1587], [1920, 1780], [3240, 3200],
          [-708, 3200], [300, 1760], [620, 1300], [690, 1290]],
        // Floor perspective, measured on the image: the centre desk's legs meet the floor at
        // y = 1135, where the 1.7 m desk spans 660 px; its edges converge near y = 580. A point
        // on the floor at y is (y - 580) * 388 / 555 pixels per metre.
        // lockHeadsAt: heads keep the height they have at the seats' depth; walking toward or
        // away from the camera changes a figure's size from the head down, not the head.
        perspective: { horizonY: 580, ref: { y: 1135, pxPerMeter: 388 }, lockHeadsAt: 1184 },
        layers: [{ id: "room", parallax: 1 }],
        grade: "rgba(7,11,24,0.30)", // late at night: the room dims, the monitor does not
      },

      actors: {
        jack: { sprite: "../assets/characters/jack/", pose: "sitting", facing: "northeast", state: "asleep", x: 720, y: 1200, layer: "room" },
        // The door is behind the camera. Sarah comes in past the lens at the bottom of the
        // frame, large, and shrinks to her normal size as she walks up into the room
        // (perspective does it; nothing is scaled by hand).
        sarah: { sprite: "../assets/characters/sarah/", pose: "standing", facing: "north", state: "idle", x: 1255, y: 1700, layer: "room", visible: false, opacity: 0 },
      },

      screens: {
        "jack-monitor": {
          corners: [[890, 614], [1071, 614], [890, 730], [1071, 730]],
          width: 543, height: 348, // drawn at 3x the world size so text stays sharp when the camera pushes in
          templates,
          state: "diagnostics",
        },
        // "the other console next to Jack", Sarah's once she takes it.
        "sarah-monitor": {
          corners: [[1124, 614], [1230, 613], [1122, 698], [1228, 700]],
          width: 424, height: 340,
          templates: sarahTemplates,
          state: "off",
        },
      },

      lights: {
        monitor: { x: 980, y: 690, radius: 560, color: DIAG_BLUE, intensity: 0.32 },
        alarm: { x: 980, y: 690, radius: 760, color: AMBER, intensity: 0 },
        intercom: { x: 830, y: 750, radius: 90, color: "rgba(90,255,150,0.8)", intensity: 0 },
        sarahScreen: { x: 1176, y: 656, radius: 300, color: DIAG_BLUE, intensity: 0 },
      },

      // Named framings: the world rectangle to show, and the point to keep in view when a
      // narrow screen cannot show all of it.
      shots: {
        establishing: { x: -790, y: -182, w: 3628, h: 2041, focus: [920, 820] }, // the whole wide room
        room: { x: 170, y: 170, w: 1700, h: 960, focus: [860, 780] },
        asleep: { x: 420, y: 430, w: 900, h: 700, focus: [820, 800] },
        chirp: { x: 500, y: 470, w: 760, h: 600, focus: [880, 760] },
        close: { x: 560, y: 510, w: 640, h: 520, focus: [900, 740] },
        rollback: { x: 340, y: 400, w: 1000, h: 752, focus: [760, 820] },
        medium: { x: 520, y: 470, w: 760, h: 640, focus: [860, 760] },
        screen: { x: 700, y: 540, w: 560, h: 420, focus: [960, 690] },
        intercom: { x: 560, y: 560, w: 560, h: 440, focus: [800, 780] },
        doorway: { x: 400, y: 250, w: 1648, h: 902, focus: [1660, 820] }, // a phone held upright keeps the door side
        twoshot: { x: 420, y: 380, w: 1180, h: 772, focus: [930, 820] },
        leanover: { x: 540, y: 440, w: 760, h: 660, focus: [880, 820] },
        sarahScreen: { x: 1010, y: 560, w: 340, h: 256, focus: [1176, 656] },
        pair: { x: 600, y: 450, w: 900, h: 660, focus: [1050, 830] },
        pairClose: { x: 700, y: 520, w: 700, h: 560, focus: [1050, 840] },
        onSarah: { x: 940, y: 520, w: 560, h: 480, focus: [1210, 840] },
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
    // One unbroken descent from high above to over the town, at a constant rate of zoom,
    // from the first sight of the island until the picture is fully black.
    { at: { seg: 1, offset: -0.3 }, action: "camera", shot: "settlement", path: "zoom", until: { line: "It was almost eleven", edge: "end" }, ease: "linear", label: "one slow descent to the town" },

    // "Near its center sat a research settlement of laboratories, homes, workshops..."
    { at: { line: "It was almost eleven", phrase: "Near its center" }, action: "scene", name: "The settlement" },
    { at: { line: "It was almost eleven", phrase: "Near its center", offset: -0.4 }, action: "opacity", target: "settlement", to: 1, duration: 2.6, ease: "inOut", label: "the settlement's lights come up" },
    ...["high-a", "high-b", "high-c", "high-d"].map((id) => ({ at: { line: "It was almost eleven", phrase: "Near its center", offset: 1 }, action: "opacity", target: id, to: 0, duration: 4, ease: "inOut" })),
    // "... medical facilities, and other buildings supporting the nearly five hundred
    //  people who lived there."
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

    ...REST,
  ],
};
