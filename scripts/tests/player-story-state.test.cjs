const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'audio/manifests/chapter-01.json')));
const api = require(path.join(root, 'reader/story-shots.js'));
const sheet = JSON.parse(fs.readFileSync(path.join(root, 'reader/shots/chapter-01.json')));
function fixture() {
  const pending = [], classes = new Set();
  const img = { hidden: true, removeAttribute(name) { delete this[name]; } };
  const host = { classList: { add: n => classes.add(n), remove: n => classes.delete(n) } };
  const nodes = { 'listen-shot': img, 'listen-visual': host };
  const context = { window: { TMBStoryShots: api }, document: { getElementById: id => nodes[id] || null },
    Image: class { constructor() { pending.push(this); } }, console };
  // Observe the existing closure in the test VM without adding a test API to production.
  const source = fs.readFileSync(path.join(root, 'reader/player.js'), 'utf8')
    .replace(/\}\)\(\);\s*$/, 'window.testPlayer = { state, renderProgress, renderStoryImage };\n})();');
  vm.runInNewContext(source, context);
  const player = context.window.testPlayer, state = player.state;
  state.chapter = 1; state.manifest = structuredClone(manifest);
  state.mode = 'dialogue'; state.mixed = state.manifest.exports.dialogue;
  state.shotCues = api.compile(state.manifest, sheet);
  const src = './' + state.mixed.audio + '?v=' + state.mixed.hash;
  const audio = { currentTime: 0, duration: 525.69, src, getAttribute() { return this.src; } };
  state.audio = audio;
  return { player, state, audio, img, host, nodes, pending, classes };
}
test('an unloaded or old audio source cannot overwrite a paused pending seek', () => {
  const f = fixture();
  f.state.index = 1; f.state.pendingSec = 17; f.audio.src = './old-reading.mp3';
  f.player.renderProgress();
  assert.equal(f.state.index, 1);
  f.pending.at(-1).onload();
  assert.ok(f.img.src.endsWith('003-settlement-distant.webp'));
});
test('loaded export time selects each shot and restores the lab cover', () => {
  const f = fixture();
  for (const [time, name] of [[5, '001-island-wide.webp'], [10, '002-island-approach.webp'], [17, '003-settlement-distant.webp'], [22, '004-settlement-close.webp'], [5, '001-island-wide.webp']]) {
    f.audio.currentTime = time; f.player.renderProgress(); f.pending.at(-1).onload();
    assert.ok(f.img.src.endsWith(name), time + ': ' + f.img.src);
    assert.equal(f.img.hidden, false);
  }
  f.audio.currentTime = 32; f.player.renderProgress();
  assert.equal(f.img.hidden, true); assert.equal(f.classes.has('has-shot'), false);
});
test('a late image callback cannot overwrite a newer cue, panel or chapter', () => {
  const f = fixture();
  f.audio.currentTime = 22; f.player.renderProgress(); const late = f.pending.at(-1);
  f.audio.currentTime = 5; f.player.renderProgress(); f.pending.at(-1).onload();
  late.onload(); assert.ok(f.img.src.endsWith('001-island-wide.webp'));
  f.audio.currentTime = 22; f.player.renderProgress(); const oldPanel = f.pending.at(-1);
  f.nodes['listen-shot'] = { hidden: true }; oldPanel.onload();
  assert.ok(f.img.src.endsWith('001-island-wide.webp'));
  f.nodes['listen-shot'] = f.img; f.state.chapter = 2; oldPanel.onload();
  assert.ok(f.img.src.endsWith('001-island-wide.webp'));
});
test('an image failure retains the cover and the next cue can recover', () => {
  const f = fixture();
  f.audio.currentTime = 17; f.player.renderProgress(); f.pending.at(-1).onerror();
  assert.equal(f.img.hidden, true); assert.equal(f.classes.has('has-shot'), false);
  const count = f.pending.length; f.player.renderProgress(); assert.equal(f.pending.length, count);
  f.audio.currentTime = 22; f.player.renderProgress(); f.pending.at(-1).onload();
  assert.equal(f.img.hidden, false); assert.ok(f.img.src.endsWith('004-settlement-close.webp'));
});
test('clip mode follows the current clip duration instead of export seconds', () => {
  const f = fixture();
  f.state.mode = 'clips'; f.state.mixed = null; f.state.index = 1;
  f.audio.src = './' + f.state.manifest.segments[1].audio; f.audio.duration = 25.234;
  for (const [time, name] of [[6, '002-island-approach.webp'], [12.5, '003-settlement-distant.webp'], [16, '004-settlement-close.webp']]) {
    f.audio.currentTime = time; f.player.renderProgress(); f.pending.at(-1).onload();
    assert.ok(f.img.src.endsWith(name));
  }
});
