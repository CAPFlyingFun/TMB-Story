// CHAPTER 1, "The Alarm", staged in the procedural lab (metres: +X east, +Z south), timed to
// the v4 dialogue file through its line index. Every time below is a LINE of the chapter
// (L("...")), so a re-rendered file moves the staging with it. Working proposal, not canon.
// Agreed rules (outline/LISTEN_VISUALS_IDEAS.md): Sarah is seen only from behind until she
// takes Jack's chair (5:07); security cuts for dialogue, overhead for where people are,
// cinematic shots for the emotional beats; the 7:04 warning stays on Jack's console.
import DATA from './lines.js';
import { evalActor, evalChair, evalDiscrete, yawTo, smooth, lerp } from './timeline.js';

export const LINES = DATA.lines, DURATION = DATA.seconds;
const PI = Math.PI;
// L(text, {nth, offset, edge:'end', phrase}) -> seconds
export function L(text, o = {}) {
  let n = o.nth || 0;
  for (const ln of LINES) if (ln.text.includes(text) && n-- === 0) {
    let s = o.edge === 'end' ? ln.e : ln.s;
    if (o.phrase) { const i = ln.text.indexOf(o.phrase); if (i >= 0) s = ln.s + (ln.e - ln.s) * (i / ln.text.length); }
    return s + (o.offset || 0);
  }
  throw new Error('Chapter 1 has no line: ' + text);
}

// ---- places -----------------------------------------------------------------------------
// Measured on the lab as built (tombs-lab furniture.ts + dressing.ts): each desk's monitors
// stand 0.26 m in from its back edge with their middles 1.10 m up; its keyboard's keys are at
// 0.767 m, 0.23 m in from the front edge; Jack's intercom stands at the front right of his
// desk, its button on top at 0.88 m; Sarah's tablet starts on her desk.
const P = {
  jackMon: [-13.0, 1.1, -12.64], jackMonR: [-12.7, 1.1, -12.62], secMon: [-15.3, 1.1, -12.64], sarahMon: [16.62, 1.1, -10.4],
  intercom: [-12.25, 0.885, -12.3], jackKeys: [-13.05, 0.772, -12.33], secKeys: [-15.35, 0.772, -12.33], sarahKeys: [16.31, 0.772, -10.45],
  tabletDesk: [16.3, 0.74, -9.75],
  // "Sarah placed her tablet beside the keyboard": to the right of his keyboard and mouse, in
  // front of his right monitor, clear of the intercom
  tabletJack: [-12.47, 0.74, -12.47],
};
const EYE = { jack: { sit: 1.13, stand: 1.6 }, sarah: { sit: 1.22, stand: 1.58 } };
// the chair heights the cast's feet reach the floor at (stage.js CAST)
const SEAT = { jack: 0.42, sarah: 0.49 };
// the story's chairs are the lab's own (tombs-lab furniture.ts ids)
export const CHAIR_IDS = { jackChair: 'jack.chair.primary', secondChair: 'jack.chair.bench', sarahChair: 'sarah.chair' };
const N = PI, E = PI / 2, W = -PI / 2;

// ---- Jack -------------------------------------------------------------------------------
const J = [
  { t: 0, place: { at: [-13, -11.85], yaw: N, pose: 'doze' } },
  { t: 0, look: null, hands: null },
  // "Jack jerked awake so quickly that his chair rolled backward and nearly struck another workstation."
  { t: L('Jack jerked awake'), pose: 'sit', blend: 0.35 },
  { t: L('Jack jerked awake', { offset: 0.1 }), move: { to: [-13.85, -11.3], dur: 0.7 } },
  { t: L('Jack jerked awake', { offset: 0.1 }), face: N + 0.45, turn: 0.6 },
  { t: L('Jack jerked awake', { offset: 0.9 }), look: 'jackMon' },
  // "...leaned toward the monitor."
  { t: L('The warning repeated'), move: { to: [-13, -11.95], dur: 1.6 } },
  { t: L('The warning repeated'), face: N, turn: 1.2 },
  { t: L('Several windows were opening'), hands: 'type' },
  { t: L('An unfamiliar connection'), hands: null },
  { t: L('He refreshed the display'), hands: 'type' },
  { t: L('He refreshed the display', { offset: 3 }), hands: null },
  { t: L('Jack entered a command'), hands: 'type' },
  { t: L('The system beeped', { phrase: 'Jack stopped typing' }), hands: null },
  { t: L('He immediately locked the terminal'), hands: 'type' },
  { t: L('He immediately locked the terminal', { offset: 1.6 }), hands: null },
  // the intercom: the chair rolls in toward it, the right hand holds the button
  { t: L('He reached for the intercom.'), move: { to: [-12.7, -12.0], dur: 0.9 } },
  { t: L('He reached for the intercom.'), face: N - 0.3 },
  { t: L('He reached for the intercom.', { offset: 0.4 }), hands: 'intercom', look: 'intercom' },
  { t: L('Jack reopened the network monitor.'), look: 'jackMon' },
  { t: L('Jack scanned the empty connection list.', { edge: 'end' }), look: 'intercom' },
  { t: L('Jack released the intercom'), hands: null, look: 'jackMon' },
  { t: L('Jack released the intercom'), move: { to: [-13, -11.95], dur: 0.8 } },
  { t: L('Jack released the intercom'), face: N },
  { t: L('He reached for the keyboard'), hands: 'type' },
  // Sarah walks in behind him; he turns in his chair
  { t: L('Sarah Bennett walked straight in', { offset: 0.8 }), hands: null, look: 'sarah' },
  { t: L('Sarah Bennett walked straight in', { offset: 1.2 }), face: N - 0.7, turn: 0.8 },
  { t: L('Jack gestured toward the console.'), look: 'jackMon', hands: 'point' },
  { t: L('No. That was my defense.'), look: 'sarah', hands: null },
  { t: L('Jack pointed toward the monitor.'), look: 'jackMon', hands: 'point' },
  { t: L('Whatever this is.'), look: 'sarah', hands: null },
  { t: L('She leaned over his shoulder'), face: N, look: 'jackMon' },
  { t: L('Jack straightened in his chair'), hands: 'type' },
  { t: L('Right. Problem.', { offset: 2.5 }), hands: null, look: 'sarah' },
  { t: L('Jack pointed to the open directory.'), look: 'jackMon', hands: 'point' },
  { t: L('It opened the TOMBS directory.'), look: 'sarah', hands: null },
  { t: L('Jack leaned back.'), move: { to: [-13, -11.65], dur: 0.6 } },
  { t: L('Jack leaned back.'), face: N - 0.35 },
  { t: L('Sarah stared at him', { phrase: 'Jack pointed at the screen' }), look: 'jackMon', hands: 'point' },
  { t: L('I know.'), look: 'sarah', hands: null },
  { t: L('Sarah started powering up'), face: N + 0.35 },
  { t: L('Jack kept one hand on the keyboard.'), move: { to: [-13, -11.9], dur: 0.5 } },
  { t: L('Jack kept one hand on the keyboard.'), hands: 'typeL', face: N + 0.15 },
  // "Jack gave Sarah his chair right away." He stands, steps back out of her way...
  { t: L('Jack gave Sarah his chair', { offset: 0.2 }), pose: 'stand', at: [-12.7, -11.3], yaw: N + 0.6, blend: 0.7 },
  { t: L('Jack gave Sarah his chair', { offset: 0.2 }), hands: null, look: 'sarah' },
  { t: L('Jack gave Sarah his chair', { offset: 0.9 }), walk: { points: [[-12.25, -10.75]], keys: [[0, L('Jack gave Sarah his chair', { offset: 0.9 })], [1, L('Jack gave Sarah his chair', { offset: 1.7 })]], endYaw: W, keepYaw: true } },
  // ...crosses to the next workstation (the prototype bench on the south wall), drags its
  // chair back, sits, and rolls it to his own screen. (Sarah's console had no chair: she
  // asked for his, and took it there.)
  { t: L('He crossed to the next workstation'), walk: { points: [[-13.3, -10.0], [-14.0, -9.65]], keys: [[0, L('He crossed to the next workstation')], [2, L('He crossed to the next workstation', { offset: 1.8 })]], endYaw: 0 } },
  { t: L('He crossed to the next workstation', { offset: 0.3 }), look: null },
  { t: L('He crossed to the next workstation', { offset: 2.0 }), hands: 'chairBack' },
  { t: L('He crossed to the next workstation', { offset: 2.0 }), walk: { points: [[-14.0, -10.1]], keys: [[0, L('He crossed to the next workstation', { offset: 2.0 })], [1, L('He crossed to the next workstation', { offset: 2.8 })]], endYaw: 0, keepYaw: true } },
  { t: L('He crossed to the next workstation', { offset: 2.9 }), hands: null },
  { t: L('He crossed to the next workstation', { offset: 2.9 }), face: N, turn: 0.6 },
  { t: L('He crossed to the next workstation', { offset: 3.5 }), pose: 'sit', at: [-14.0, -9.6], yaw: N, blend: 0.7 },
  { t: L('He crossed to the next workstation', { offset: 4.3 }), move: { to: [-13.0, -10.9], dur: 2.3 } },
  { t: L('He crossed to the next workstation', { offset: 6.6 }), move: { to: [-13.0, -11.95], dur: 1.0 } },
  { t: L('He crossed to the next workstation', { offset: 6.0 }), look: 'jackMon' },
  { t: L('Jack watched his own log scroll.'), look: 'jackMon' },
  { t: L('He pulled up the TOMBS directory again'), hands: 'type' },
  { t: L('Sarah kept scanning her own feed.'), hands: null },
  { t: L('Jack pointed at his own screen.'), hands: 'point' },
  { t: L('Mine too.', { offset: 1.2 }), hands: null },
  { t: L('He glanced at the time', { phrase: 'and then at her' }), look: 'sarah' },
  { t: L('He glanced at the time', { phrase: 'and then at her' }), face: N + 0.5 },
  { t: L('Jack glanced at her stomach.'), look: 'sarahBelly' },
  { t: L("I'm not the pregnant one."), look: 'sarah' },
  { t: L('Jack considered it.'), look: 'jackMon' },
  { t: L("I wasn't uncomfortable?"), look: 'sarah' },
  { t: L('Sarah rested a hand briefly'), look: 'sarahBelly' },
  { t: L('Lately the baby seems', { offset: 1 }), look: 'sarah' },
  { t: L('Jack smiled at the movement'), look: 'sarahBelly' },
  { t: L('Already takes after me.'), look: 'sarah' },
  { t: L('A new warning tone interrupted them.'), face: N, look: 'jackMon' },
  { t: L('Jack reached for the console.'), hands: 'type' },
  { t: L('Your credentials?'), look: 'sarah' },
  { t: L('Jack stared at the warning.'), look: 'jackMon' },
  { t: L('Jack stopped typing.'), hands: null },
  { t: L('Sarah slowly turned toward him.'), look: 'sarah' },
  { t: L('Jack met her eyes.'), face: N + 0.4, look: 'sarah' },
];

// ---- Sarah ------------------------------------------------------------------------------
// Her walk to Jack (about 33 m, through the control room). On camera she walks at about
// 1.3 m/s; while the camera is on Jack she covers the rest.
const tW = L("I'm on my way.", { offset: 1.1 });
const SARAH_WALK = {
  points: [[14.0, -9.5], [10.5, -9.45], [8.6, -9.45], [6.8, -9.5], [5.2, -9.5], [4.0, -11.0], [1.0, -11.0], [-4.0, -11.0], [-5.2, -9.5], [-6.8, -9.5], [-7.6, -9.47], [-10.5, -9.45], [-11.3, -9.6], [-11.85, -10.45]],
  keys: [[0, tW], [2, L("I'm on my way.", { offset: 5.3 })], [3, L('Who are you?', { offset: -0.1 })], [6, L('The cursor moved', { edge: 'end', offset: -0.1 })], [7, L('Jack froze as a file opened.', { offset: 1.1 })],
    [11, L('He reached for the keyboard')], [12, L('He reached for the keyboard', { offset: 2.3 })], [14, L('He reached for the keyboard', { offset: 4.2 })]],
  endYaw: yawTo(-1.15, -1.5),
};
const tSit = L('Jack gave Sarah his chair', { offset: 2.1 });
const S = [
  { t: 0, place: { at: [15.85, -10.4], yaw: E, pose: 'sit' } },
  { t: 0, look: 'sarahMon', hands: 'typeS' },
  { t: L("Sarah's voice came through the speaker."), hands: null },
  // she reacts while Jack is still asking, and walks only after "I'm on my way."
  { t: L('Can you come take a look?', { offset: 0.1 }), pose: 'stand', at: [15.7, -9.9], yaw: E - 0.2, blend: 0.8 },
  { t: L('Can you come take a look?', { offset: 0.6 }), hands: 'tabletPick', look: 'tablet' },
  { t: L("I'm on my way.", { offset: 0.5 }), hands: null, look: null },
  { t: 0, walk: null },
  { t: L("I'm on my way.", { offset: 1.1 }), walk: SARAH_WALK },
  { t: L('Sarah Bennett walked straight in', { offset: 0.2 }), look: 'jack' },
  { t: L('Sarah Bennett walked straight in', { phrase: 'She glanced from Jack' }), look: 'jackMon' },
  { t: L('Please tell me you didn'), look: 'jack' },
  // "Sarah closed the distance between them."
  { t: L('Sarah closed the distance'), walk: { points: [[-12.3, -11.2]], keys: [[0, L('Sarah closed the distance', { offset: 0.1 })], [1, L('Sarah closed the distance', { offset: 1.1 })]], endYaw: yawTo(-0.7, -0.75) } },
  // "She leaned over his shoulder and studied the screen."
  { t: L('She leaned over his shoulder'), walk: { points: [[-12.45, -11.45]], keys: [[0, L('She leaned over his shoulder', { offset: 0.1 })], [1, L('She leaned over his shoulder', { offset: 0.8 })]], endYaw: yawTo(-0.45, -1) } },
  { t: L('She leaned over his shoulder'), look: 'jackMon' },
  { t: L('Jack.', { nth: 0 }), look: 'jack' },
  { t: L('Sarah placed her tablet', { phrase: 'Sarah placed' }), hands: 'tabletPlace', look: 'tabletJack' },
  { t: L('Sarah placed her tablet', { edge: 'end' }), hands: null, look: 'jack' },
  { t: L('Sarah tapped the edge of the keyboard.'), hands: 'keyEdge', look: 'jackMon' },
  { t: L('And then?'), hands: null, look: 'jack' },
  { t: L("Sarah's attention sharpened."), look: 'jackMon' },
  { t: L('By itself?'), look: 'jack' },
  { t: L('Sarah looked at the terminal lock indicator.'), look: 'jackMon' },
  { t: L('You locked the terminal?'), look: 'jack' },
  { t: L('Sarah stared at him', { phrase: 'before looking back' }), look: 'jackMon' },
  // "Sarah started powering up the other console next to Jack."
  { t: L('Sarah started powering up'), walk: { points: [[-12.6, -10.95], [-13.4, -10.75], [-14.6, -11.0], [-15.2, -11.75]], keys: [[0, L('Sarah started powering up', { offset: 0.1 })], [4, L('Sarah started powering up', { offset: 2.6 })]], endYaw: N } },
  { t: L('Sarah started powering up', { offset: 0.2 }), look: 'secMon' },
  { t: L('Sarah started powering up', { offset: 2.4 }), hands: 'powerUp' },
  { t: L('Can I take your chair?'), hands: null, look: 'jack' },
  { t: L('Can I take your chair?'), face: E - 0.15 },
  // "Sarah nudged the arm of his chair..."
  { t: L('Sarah nudged the arm'), walk: { points: [[-13.72, -11.6]], keys: [[0, L('Sarah nudged the arm', { offset: 0.1 })], [1, L('Sarah nudged the arm', { offset: 1.0 })]], endYaw: E } },
  { t: L('Sarah nudged the arm', { offset: 1.1 }), hands: 'chairArm' },
  { t: L('Sarah nudged the arm', { offset: 2.4 }), hands: null },
  { t: L('Let me have your chair'), walk: { points: [[-14.2, -11.15]], keys: [[0, L('Let me have your chair', { offset: 0.2 })], [1, L('Let me have your chair', { offset: 1.0 })]], endYaw: E - 0.3, keepYaw: true } },
  // she takes his chair: Jack has turned it toward her; she sits (the reveal), then swivels
  // to the other console and rolls over to it
  { t: L('Jack gave Sarah his chair', { offset: 0.9 }), walk: { points: [[-13.55, -11.3]], keys: [[0, L('Jack gave Sarah his chair', { offset: 1.0 })], [1, L('Jack gave Sarah his chair', { offset: 1.7 })]], endYaw: W } },
  { t: tSit, pose: 'sit', at: [-13.0, -11.45], yaw: W, blend: 0.9 },
  { t: tSit, look: 'jack' },
  { t: L('He crossed to the next workstation', { offset: 1.0 }), face: N, turn: 1.2 },
  { t: L('He crossed to the next workstation', { offset: 1.0 }), move: { to: [-15.3, -11.95], dur: 3.0 } },
  { t: L('He crossed to the next workstation', { offset: 1.2 }), look: 'secMon' },
  { t: L('Sarah was already typing.', { offset: -1.0 }), hands: 'typeS' },
  { t: L('Sarah looked sideways at him.'), look: 'jack', face: N - 0.3 },
  { t: L('No, you were sleeping.', { edge: 'end' }), look: 'secMon', face: N },
  { t: L('Sarah looked over at him.'), look: 'jack', face: N - 0.45 },
  { t: L('Sarah stopped typing long enough'), hands: null },
  { t: L('Sarah rested a hand briefly'), hands: 'belly', look: 'sarahBelly' },
  { t: L('Lately the baby seems'), look: 'jack' },
  { t: L('Then she returned to typing.'), hands: 'typeS', look: 'secMon', face: N },
  { t: L("Sarah's hands went still."), look: 'secMon' },
  { t: L("That's what I'm afraid of."), look: 'jack' },
  { t: L('A new warning tone interrupted them.'), face: N - 0.5, look: 'jackMon', hands: null },
  { t: L('Sarah pointed at the request.'), hands: 'point' },
  { t: L('Cancel it.', { edge: 'end' }), hands: null },
  { t: L('Sarah looked from the message to him.', { offset: 1 }), look: 'jack' },
  { t: L('Jack stared at the warning.'), look: 'jackMon' },
  { t: L('Sarah turned toward him.'), face: N - 0.75, look: 'jack' },
  { t: L('Sarah leaned toward the screen.'), look: 'jackMon' },
  { t: L('Sarah slowly turned toward him.'), face: N - 0.95, turn: 1.6, look: 'jack' },
].filter(e => !('walk' in e && e.walk === null));

// ---- chairs, tablet, doors, alarm ----------------------------------------------------------
const CHAIRS = {
  jackChair: [{ t: 0, occupant: 'jack' },
    { t: L('Jack gave Sarah his chair', { offset: 0.2 }), occupant: null, place: { at: [-13, -11.9], yaw: N } },
    { t: L('Jack gave Sarah his chair', { offset: 0.4 }), move: { to: [-13.0, -11.45], yaw: W, dur: 0.8 } },
    { t: tSit, occupant: 'sarah' }],
  // the bench chair on the south wall, facing the bench, until Jack drags it back
  secondChair: [{ t: 0, place: { at: [-14.0, -8.85], yaw: 0 } },
    { t: L('He crossed to the next workstation', { offset: 2.0 }), move: { to: [-14.0, -9.55], dur: 0.8 } },
    { t: L('He crossed to the next workstation', { offset: 2.9 }), move: { to: [-14.0, -9.6], yaw: N, dur: 0.6 } },
    { t: L('He crossed to the next workstation', { offset: 3.5 }), occupant: 'jack' }],
  sarahChair: [{ t: 0, occupant: 'sarah' },
    { t: L('Can you come take a look?', { offset: 0.1 }), occupant: null, place: { at: [15.85, -10.4], yaw: E } },
    { t: L('Can you come take a look?', { offset: 0.3 }), move: { to: [16.0, -10.75], yaw: E + 0.5, dur: 0.6 } }],
};
const TABLET = [{ t: 0, set: { on: 'desk', at: P.tabletDesk, yaw: 0 } },
  { t: L("I'm on my way.", { offset: 0.3 }), set: { on: 'arm', who: 'sarah' } },
  { t: L('Sarah placed her tablet', { edge: 'end', offset: -0.6 }), set: { on: 'desk', at: P.tabletJack, yaw: 0.25 } }];
// ---- screens ----------------------------------------------------------------------------
// What each of the room's screens shows, from the manuscript's own system lines. Jack's left
// monitor ('...:0') is where he works (the network monitor, the logs, the directory); his right
// ('...:1') carries the warnings. The other console stays dark until Sarah powers it up.
const JL = 'jack.desk.primary:0', JR = 'jack.desk.primary:1', SL = 'jack.desk.secondary:0', SR = 'jack.desk.secondary:1';
const SCREEN_EVENTS = [
  { t: 0, set: { [JL]: 'diag', [JR]: 'diag', 'sarah.desk:0': 'feed', 'sarah.desk:1': 'diag', 'sarah.tablet': 'tablet' } },
  { t: L('A warning tone chirped', { phrase: 'and the diagnostic display flashed amber' }), set: { [JR]: 'amber' } },
  { t: L('Several windows were opening'), set: { [JL]: 'windows', [JR]: 'windows' } },
  { t: L('Several windows were opening', { phrase: 'Jack grabbed the keyboard' }), set: { [JL]: 'netmon' } },
  { t: L('An unfamiliar connection'), set: { [JL]: { kind: 'netmon', flash: true } } },
  { t: L('He refreshed the display'), set: { [JL]: 'netmon' } },
  { t: L('Security protocol violation.'), set: { [JR]: 'red' } },
  { t: L('Jack entered a command', { phrase: 'pulled up the laboratory access logs' }), set: { [JL]: 'logs' } },
  { t: L('The system beeped'), set: { [JL]: 'directory', [JR]: 'diag' } },
  // "The screen went black for three seconds, then came back on and reopened the same directory."
  { t: L('He immediately locked the terminal', { phrase: 'The screen went black' }), set: { [JL]: 'black', [JR]: 'black' } },
  { t: L('He immediately locked the terminal', { phrase: 'The screen went black', offset: 3 }), set: { [JL]: 'directory', [JR]: 'diag' } },
  { t: L('Jack reopened the network monitor.'), set: { [JR]: 'netmon' } },
  { t: L('Boundary control.'), set: { [JL]: 'boundary' } },
  // "Sarah started powering up the other console next to Jack."
  { t: L('Sarah started powering up', { offset: 2.4 }), set: { [SL]: 'boot', [SR]: 'boot' } },
  { t: L('Sarah started powering up', { offset: 6.5 }), set: { [SL]: 'diag', [SR]: 'diag' } },
  { t: L('Sarah opened the connection history'), set: { [SR]: 'feed' } },
  { t: L('He pulled up the TOMBS directory again'), set: { [JL]: 'directory' } },
  { t: L('Tombs array remote initialization request.'), set: { [JR]: 'request' } },
  { t: L('Request denied.'), set: { [JR]: 'denied' } },
  { t: L('Request denied.', { nth: 1 }), set: { [JR]: 'denied' } },
  { t: L('Access revoked.'), set: { [JR]: 'revoked' } },
].sort((a, b) => a.t - b.t);
function screensAt(t) {
  const out = {};
  for (const e of SCREEN_EVENTS) { if (e.t > t) break; for (const [k, v] of Object.entries(e.set)) out[k] = typeof v === 'string' ? { kind: v, t0: e.t } : { ...v, t0: e.t }; }
  return out;
}
const ALARMS = [[L('Warning. Unauthorized system access.'), L('Jack entered a command', { edge: 'end' })], [L('A new warning tone interrupted them.'), DURATION + 5]];
const DOORS = { 'jack-door': [-10.5, -9.45], 'sarah-door': [10.5, -9.45], 'control-east': [6, -9.5], 'control-west': [-6, -9.5] };

// ---- cameras ----------------------------------------------------------------------------
// Security cameras are fixed (Joshua approved the layout as provisional). Because Sarah walks
// AWAY from each camera she is seen on, three moved or were added for the back-only rule:
// S-2 and the new SC and C-2 look the way she walks.
const CAM = {
  J1: { sec: "CAM J-1 · JACK'S LABORATORY", pos: [-14.3, 2.4, -12.98], look: [-13.0, 1.0, -11.8], hfov: 74 },
  J2: { sec: "CAM J-2 · JACK'S LABORATORY", pos: [-16.7, 2.9, -7.9], look: [-12.6, 1.0, -10.9], hfov: 92, slot: { hfov: 84 } },
  J3: { sec: "CAM J-3 · JACK'S LABORATORY", pos: [-10.8, 2.9, -7.85], look: [-12.6, 1.05, -11.2], hfov: 72 },
  J4: { sec: "CAM J-4 · JACK'S LABORATORY", pos: [-16.6, 2.4, -12.95], look: [-15.0, 1.05, -11.9], hfov: 72 },
  S1: { sec: "CAM S-1 · SARAH'S OFFICE", pos: [10.8, 2.75, -7.9], look: [15.7, 0.9, -10.3], hfov: 50 },
  S2: { sec: "CAM S-2 · SARAH'S OFFICE", pos: [16.75, 2.8, -7.85], look: [11.6, 1.0, -9.6], hfov: 74 },
  SC: { sec: 'CAM SC · EAST CONNECTION', pos: [10.2, 3.0, -10.95], look: [6.0, 1.0, -9.5], hfov: 76 },
  C2: { sec: 'CAM C-2 · MAIN CONTROL ROOM', pos: [5.7, 3.6, -12.8], look: [-1.5, 0.9, -10.3], hfov: 78 },
  JC: { sec: 'CAM JC · WEST CONNECTION', pos: [-6.25, 3.0, -7.85], look: [-10.4, 1.0, -9.9], hfov: 64 },
  jackSide: { pos: [-11.3, 1.3, -10.9], look: [-13.1, 1.0, -11.6], hfov: 56 },
  jackScreen: { pos: [-13.7, 1.75, -10.95], look: [-12.9, 1.0, -12.7], hfov: 52 },
  intercom: { pos: [-11.35, 1.25, -11.5], look: [-12.45, 0.95, -12.55], hfov: 56 },
  overSarah: { pos: [-12.1, 1.85, -9.9], look: [-13.05, 1.12, -11.95], hfov: 56 },
  overSarahW: { pos: [-16.3, 1.65, -11.0], look: [-13.0, 1.15, -11.75], hfov: 58 },
  reveal: { pos: [-13.45, 1.3, -9.3], look: [-13.05, 0.95, -11.5], hfov: 56 },
  pairFront: { pos: [-10.8, 2.0, -12.9], look: [-14.2, 1.0, -11.7], hfov: 70 },
};
const FRAMES = { facility: [-18.5, 18.5, -14.5, 14.5], jackLab: [-17.4, -10.1, -13.5, -7.2], northWing: [-17.5, 17.5, -13.6, -6.8] };
const SHOTS = [];
const cut = (t, shot, extra = {}) => SHOTS.push({ t, shot, ...extra });
cut(0, 'overhead', { from: 'facility', to: 'jackLab', t0: L('Deep inside one of those laboratories'), dur: L('A warning tone chirped') - L('Deep inside one of those laboratories') - 4 });
cut(L('A warning tone chirped'), 'J1');
cut(L('Warning. Unauthorized system access.'), 'J2');
cut(L('Jack jerked awake'), 'jackSide');
cut(L('What? Okay'), 'J1');
cut(L('Several windows were opening'), 'jackScreen');
cut(L('Come on. What are you doing?'), 'J1');
cut(L('An unfamiliar connection'), 'jackScreen');
cut(L('Jack frowned.'), 'J1');
cut(L('He refreshed the display'), 'jackScreen');
cut(L('Security protocol violation.'), 'J2');
cut(L('Okay. Definitely awake now.'), 'J1');
cut(L('Jack entered a command'), 'jackScreen');
cut(L("That's impossible."), 'J1');
cut(L('The system beeped'), 'jackScreen');
cut(L("Oh, no you don't."), 'J1');
cut(L('He immediately locked the terminal'), 'J2');
cut(L('Jack stared at it.'), 'J1');
cut(L('He reached for the intercom.'), 'intercom');
cut(L('Static answered him.'), 'overhead', { from: 'jackLab', to: 'northWing', t0: L('Static answered him.'), dur: 6 });
// the call: cut by who is speaking
for (const ln of LINES) {
  if (ln.s < L("I'm here. What's wrong?") - 0.01 || ln.s >= L('Can you come take a look?')) continue;
  const who = ln.who.startsWith('sarah') || /Sarah/.test(ln.text) ? 'S1' : 'J1';
  cut(ln.s, who);
}
cut(L('Can you come take a look?'), 'overhead', { from: 'northWing', to: 'northWing', t0: 0, dur: 1 });
cut(L("I'm on my way."), 'S1');
cut(L("I'm on my way.", { offset: 1.3 }), 'S2');
cut(L("I'm on my way.", { offset: 4.0 }), 'SC');
cut(L('Who are you?'), 'J1');
cut(L('The cursor moved'), 'jackScreen');
cut(L('The cursor moved', { edge: 'end', offset: -0.2 }), 'C2');
cut(L('Jack froze as a file opened.'), 'jackScreen');
cut(L('No, no, no.'), 'J1');
cut(L('He reached for the keyboard'), 'JC');
cut(L('He reached for the keyboard', { offset: 4.1 }), 'J3');
// Sarah in Jack's lab, still only from behind
for (const ln of LINES) {
  if (ln.s < L('Please tell me you didn') || ln.s >= L('Sarah started powering up')) continue;
  if (ln.who.startsWith('jack')) cut(ln.s, 'overSarah');
  else if (ln.who.startsWith('sarah')) cut(ln.s, 'J3');
}
cut(L('Sarah started powering up'), 'J3');
cut(L('Can I take your chair?'), 'overSarahW');
cut(L("I'm sitting here."), 'overSarahW');
cut(L('Sarah nudged the arm'), 'J2');
cut(L('Let me have your chair'), 'overSarahW');
// the reveal, plainly, as she takes his chair
cut(L('Jack gave Sarah his chair'), 'reveal');
cut(L('He crossed to the next workstation'), 'J2');
cut(L('Sarah was already typing.'), 'pairFront');
for (const ln of LINES) {
  if (ln.s < L('You said the connection disappeared?') || ln.s >= L('A new warning tone interrupted them.')) continue;
  if (ln.who.startsWith('jack')) cut(ln.s, 'J1');
  else if (ln.who.startsWith('sarah')) cut(ln.s, 'J4');
  else { const j = /\bJack\b|\bHe\b/.test(ln.text), sa = /Sarah|\bShe\b|\bher\b/.test(ln.text); cut(ln.s, (j && sa) || /Both/.test(ln.text) ? 'pairFront' : sa ? 'J4' : 'J1'); }
}
// the new warning: Jack's console and his reaction (the Array is not shown as its cause)
cut(L('A new warning tone interrupted them.'), 'jackScreen');
cut(L('Sarah sat upright.'), 'pairFront');
cut(L('Did you do that?'), 'J4');
cut(L('Jack reached for the console.'), 'J1');
cut(L('Sarah pointed at the request.'), 'J4');
cut(L('Jack reached across the console'), 'jackScreen');
cut(L("Jack's expression hardened."), 'J1');
cut(L('He entered his administrator credentials'), 'jackScreen');
cut(L('Sarah looked from the message to him.'), 'pairFront');
cut(L('Your credentials?'), 'J4');
cut(L('Jack stared at the warning.'), 'J1');
cut(L('Sarah turned toward him.'), 'J4');
cut(L('Jack tried his credentials again.'), 'jackScreen');
cut(L('Sarah leaned toward the screen.'), 'pairFront');
cut(L('Jack stopped typing.'), 'J1');
cut(L('Sarah slowly turned toward him.'), 'J4');
cut(L('Jack met her eyes.'), 'pairFront');
SHOTS.sort((a, b) => a.t - b.t);
// a cut never comes less than 1.2 s after the last one
const SHOTLIST = []; for (const s of SHOTS) { const last = SHOTLIST[SHOTLIST.length - 1]; if (last && s.t - last.t < 1.0 && s.shot !== 'overhead' && last.shot !== 'overhead') { SHOTLIST[SHOTLIST.length - 1] = { ...s, t: last.t }; continue; } SHOTLIST.push(s); }
export { SHOTLIST, CAM };

// ---- evaluate ---------------------------------------------------------------------------
const sorted = a => a.slice().sort((x, y) => x.t - y.t);
const JS = sorted(J), SS = sorted(S);
const CH = Object.fromEntries(Object.entries(CHAIRS).map(([k, v]) => [k, sorted(v)]));

function headOf(id, a) { const sit = a.pose === 'sit' || a.pose === 'doze'; return [a.at[0], sit ? EYE[id].sit : EYE[id].stand, a.at[1]]; }
function lookPoint(name, A) {
  if (!name) return null;
  if (name === 'jack' || name === 'sarah') return headOf(name, A[name]);
  if (name === 'sarahBelly') { const a = A.sarah, f = [Math.sin(a.yaw), Math.cos(a.yaw)]; return [a.at[0] + f[0] * 0.25, 0.85, a.at[1] + f[1] * 0.25]; }
  if (name === 'tablet') return P.tabletDesk; if (name === 'tabletJack') return P.tabletJack;
  return P[name] || null;
}
function handTargets(id, a, A, chairs) {
  const f = [Math.sin(a.yaw), Math.cos(a.yaw)], left = [f[1], -f[0]];
  const keysAt = (k, side) => [k[0] + left[0] * 0.13 * side, k[1], k[2] + left[1] * 0.13 * side];
  const near = () => { let best = P.jackKeys, d = 1e9; for (const k of [P.jackKeys, P.secKeys, P.sarahKeys]) { const dd = Math.hypot(k[0] - a.at[0], k[2] - a.at[1]); if (dd < d) { d = dd; best = k; } } return best; };
  switch (a.hands) {
    case 'type': case 'typeS': { const k = near(); return [{ side: 'L', at: keysAt(k, 1) }, { side: 'R', at: keysAt(k, -1) }]; }
    case 'typeL': return [{ side: 'L', at: keysAt(P.jackKeys, 1) }];
    case 'intercom': return [{ side: 'R', at: P.intercom }];
    case 'tabletPick': return [{ side: 'R', at: P.tabletDesk }];
    case 'tabletPlace': return [{ side: 'R', at: P.tabletJack }];
    case 'keyEdge': return [{ side: 'R', at: [-12.78, 0.775, -12.18] }];
    case 'powerUp': return [{ side: 'R', at: [-15.05, 0.775, -12.25] }];
    case 'chairBack': { const c = chairs.secondChair; return [{ side: 'L', at: [c.at[0] + 0.2, 0.9, c.at[1] - 0.27] }, { side: 'R', at: [c.at[0] - 0.2, 0.9, c.at[1] - 0.27] }]; }
    case 'chairArm': { const c = chairs.jackChair; return [{ side: 'R', at: [c.at[0] - 0.3, 0.66, c.at[1] + 0.05] }]; }
    case 'belly': { const p = lookPoint('sarahBelly', A); return [{ side: 'R', at: [p[0], 0.82, p[2]], kind: 'hold', palm: { x: -f[0], y: 0, z: -f[1] } }]; }
    case 'point': { const tgt = id === 'sarah' ? P.jackMon : P.jackMon; const d = [tgt[0] - a.at[0], tgt[2] - a.at[1]], n = Math.hypot(...d) || 1, sit = a.pose === 'sit'; return [{ side: 'R', at: [a.at[0] + d[0] / n * 0.62 + left[0] * -0.12, sit ? 1.12 : 1.35, a.at[1] + d[1] / n * 0.62 + left[1] * -0.12], kind: 'hold' }]; }
    default: return [];
  }
}
const lineAt = t => { for (let i = LINES.length - 1; i >= 0; i--) if (LINES[i].s <= t) return LINES[i]; return null; };

export function frame(t, aspect, fmt) {
  const A = { jack: evalActor(JS, t), sarah: evalActor(SS, t) };
  const chairs = {};
  for (const [id, ev] of Object.entries(CH)) {
    const c = evalChair(ev, t), who = c.occupant && A[c.occupant];
    if (who && (who.pose === 'sit' || who.pose === 'doze') && !(who.prevPose && who.prevPose !== who.pose && who.k < 0.5)) chairs[id] = { at: who.at, yaw: who.yaw, seat: SEAT[c.occupant] };
    else chairs[id] = { at: c.at, yaw: c.yaw, seat: c.occupant ? SEAT[c.occupant] : 0.45 };
  }
  const ln = lineAt(t), speaking = ln && t <= ln.e ? ln.who : '';
  const actors = {};
  for (const id of ['jack', 'sarah']) {
    const a = A[id];
    actors[id] = { ...a, visible: a.visible, look: lookPoint(a.look, A), hands: handTargets(id, a, A, chairs), typing: /^type/.test(a.hands || ''), talking: speaking.startsWith(id), seat: SEAT[id] };
  }
  const tablet = evalDiscrete(TABLET, t, {});
  const chairsOut = {}; for (const [id, c] of Object.entries(chairs)) chairsOut[CHAIR_IDS[id]] = c;
  const doors = {}; for (const [id, p] of Object.entries(DOORS)) doors[id] = ['jack', 'sarah'].some(k => Math.hypot(A[k].at[0] - p[0], A[k].at[1] - p[1]) < 1.7);
  // (Joshua's approved stills keep the room's own light through the warnings: the amber and red
  // are the screens', thrown on Jack by their desk's glow. The lab's alarm mode is kept for a
  // chapter whose manuscript sounds a real alarm.)
  const inAlarm = false;
  // camera
  let shot = SHOTLIST[0]; for (const s of SHOTLIST) { if (s.t <= t) shot = s; else break; }
  let camera;
  if (shot.shot === 'overhead') {
    const k = smooth((t - shot.t0) / shot.dur), f0 = FRAMES[shot.from], f1 = FRAMES[shot.to];
    const b = f0.map((v, i) => lerp(v, f1[i], k));
    const cx = (b[0] + b[1]) / 2, cz = (b[2] + b[3]) / 2, Wd = b[1] - b[0], Dp = b[3] - b[2], vf = 42 * PI / 180;
    const h = Math.max(Dp / 2 / Math.tan(vf / 2), Wd / 2 / (Math.tan(vf / 2) * aspect)) * 1.04;
    camera = { pos: [cx, h, cz + h * 0.22], look: [cx, 0, cz], vfov: 42, overhead: true, label: 'OVERHEAD' };
  } else {
    const c = CAM[shot.shot], o = fmt === 'slot' ? (c.slot || {}) : {};
    const hf = o.hfov || (fmt === 'slot' ? c.hfov * 0.9 : c.hfov);
    camera = { pos: o.pos || c.pos, look: o.look || c.look, vfov: 2 * Math.atan(Math.tan(hf * PI / 360) / aspect) * 180 / PI, sec: c.sec || null, label: c.sec || shot.shot };
  }
  // footprint trails (overhead only): where each has been over the last 8 s
  const markers = {};
  if (camera.overhead) for (const id of ['jack', 'sarah']) {
    const ev = id === 'jack' ? JS : SS, trail = [];
    for (let i = 1; i <= 28; i++) { const tt = t - i * 0.3; if (tt < 0) break; const p = evalActor(ev, tt).at; if (Math.hypot(p[0] - A[id].at[0], p[1] - A[id].at[1]) > 0.25) trail[i - 1] = [p[0], p[1], 1 - i / 29]; }
    markers[id] = { trail };
  }
  return { t, actors, chairs: chairsOut, tablet, screens: screensAt(t), lamp: true, doors, mode: inAlarm ? 'alarm' : 'night', alarm: inAlarm ? 3 + 3 * Math.sin(t * 2 * PI * 0.8) : 0, camera, markers, line: ln, shot: shot.shot };
}
