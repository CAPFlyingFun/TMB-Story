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
  const pending = [], animations = [];
  function element() { return { hidden: true, style: {}, decode: () => Promise.resolve(),
    animate() { let finish; const finished = new Promise(r => { finish = r; });
      const a = { finished, finish, cancel() {} }; animations.push(a); return a; }
  }; }
  const img = element(), next = element(), art = {};
  const nodes = { 'listen-shot': img, 'listen-shot-next': next, 'listen-artwork': art };
  const context = { window: { TMBStoryShots: api }, document: { getElementById: id => nodes[id] || null },
    Image: class { constructor() { pending.push(this); } }, console };
  // Observe the existing closure in the test VM without adding a test API to production.
  const source = fs.readFileSync(path.join(root, 'reader/player.js'), 'utf8')
    .replace(/\}\)\(\);\s*$/, 'window.testPlayer = { state, renderProgress, renderStoryImage };\n})();');
  vm.runInNewContext(fs.readFileSync(path.join(root, 'reader/shot-frames.js'), 'utf8'), context);
  vm.runInNewContext(source, context);
  const player = context.window.testPlayer, state = player.state;
  state.chapter = 1; state.manifest = structuredClone(manifest);
  state.mode = 'dialogue'; state.mixed = state.manifest.exports.dialogue;
  state.shotCues = api.compile(state.manifest, sheet);
  const src = './' + state.mixed.audio + '?v=' + state.mixed.hash;
  const audio = { currentTime: 0, duration: 525.69, src, getAttribute() { return this.src; } };
  state.audio = audio;
  async function settle() {
    pending.at(-1).onload();
    for (let i = 0; i < 20; i++) await Promise.resolve();
    if (animations.length) { animations.at(-1).finish(); for (let i = 0; i < 20; i++) await Promise.resolve(); }
  }
  return { player, state, audio, get img() { return [img, next].find(e => e.style.zIndex === '0') || img; },
    next, art, nodes, pending, settle };
}
test('an unloaded or old audio source cannot overwrite a paused pending seek', async () => {
  const f = fixture();
  f.state.index = 1; f.state.pendingSec = 17; f.audio.src = './old-reading.mp3';
  f.player.renderProgress();
  assert.equal(f.state.index, 1);
  await f.settle();
  assert.ok(f.img.src.endsWith('003-settlement-distant.webp'));
});
test('loaded export time crosses from island artwork into approved lab stills', async () => {
  const f = fixture();
  for (const [time, name] of [[5, '001-island-wide.webp'], [10, '002-island-approach.webp'], [17, '003-settlement-distant.webp'], [22, '004-settlement-close.webp'], [5, '001-island-wide.webp']]) {
    f.audio.currentTime = time; f.player.renderProgress(); await f.settle();
    assert.ok(f.img.src.endsWith(name), time + ': ' + f.img.src);
    assert.equal(f.img.hidden, false);
  }
  f.audio.currentTime = 32; f.player.renderProgress();
  await f.settle();
  assert.equal(f.img.hidden, false); assert.ok(f.img.src.endsWith('005-jack-lab.webp'));
});
test('the approved lab sequence follows the active reading and survives backward seeks', async () => {
  const f = fixture();
  const cues = api.compile(f.state.manifest, sheet).slice(4);
  assert.ok(cues.every(cue => cue.src), 'the lab sequence must use approved stills, not the old cover');
  for (const cue of [...cues, cues[0], cues[3], cues.at(-1)]) {
    const start = f.state.mixed.startMs[cue.index];
    const end = f.state.mixed.endMs[cue.index];
    f.audio.currentTime = (start + (end - start) * Math.min(0.99, cue.fraction + 0.001)) / 1000;
    f.player.renderProgress(); await f.settle();
    assert.ok(f.img.src.endsWith(cue.src.slice(2)), cue.id + ': ' + f.img.src);
    assert.equal(f.img.hidden, false);
  }
});
test('a late image callback cannot overwrite a newer cue, panel or chapter', async () => {
  const f = fixture();
  f.audio.currentTime = 22; f.player.renderProgress(); const late = f.pending.at(-1);
  f.audio.currentTime = 5; f.player.renderProgress(); await f.settle();
  late.onload(); await Promise.resolve(); assert.ok(f.img.src.endsWith('001-island-wide.webp'));
  f.audio.currentTime = 22; f.player.renderProgress(); const oldPanel = f.pending.at(-1);
  f.nodes['listen-artwork'] = {}; oldPanel.onload(); await Promise.resolve();
  assert.ok(f.img.src.endsWith('001-island-wide.webp'));
  f.nodes['listen-artwork'] = f.art; f.state.chapter = 2; oldPanel.onload(); await Promise.resolve();
  assert.ok(f.img.src.endsWith('001-island-wide.webp'));
});
test('an image failure retains the current story image and the next cue can recover', async () => {
  const f = fixture();
  f.audio.currentTime = 5; f.player.renderProgress(); await f.settle();
  f.audio.currentTime = 17; f.player.renderProgress(); f.pending.at(-1).onerror();
  assert.equal(f.img.hidden, false); assert.ok(f.img.src.endsWith('001-island-wide.webp'));
  const count = f.pending.length; f.player.renderProgress(); assert.equal(f.pending.length, count);
  f.audio.currentTime = 22; f.player.renderProgress(); await f.settle();
  assert.equal(f.img.hidden, false); assert.ok(f.img.src.endsWith('004-settlement-close.webp'));
});
test('clip mode follows the current clip duration instead of export seconds', async () => {
  const f = fixture();
  f.state.mode = 'clips'; f.state.mixed = null; f.state.index = 1;
  f.audio.src = './' + f.state.manifest.segments[1].audio; f.audio.duration = 25.234;
  for (const [time, name] of [[6, '002-island-approach.webp'], [12.5, '003-settlement-distant.webp'], [16, '004-settlement-close.webp']]) {
    f.audio.currentTime = time; f.player.renderProgress(); await f.settle();
    assert.ok(f.img.src.endsWith(name));
  }
});
