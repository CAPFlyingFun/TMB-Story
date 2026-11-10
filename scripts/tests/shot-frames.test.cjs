const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../..');
const sourcePath = path.join(root, 'reader/shot-frames.js');
async function flush() { for (let i = 0; i < 20; i++) await Promise.resolve(); }
function fixture() {
  const loads = [], animations = [];
  function element() { return { hidden: true, src: '', alt: '', style: {}, decode: () => Promise.resolve(),
    animate(keyframes, options) {
      let finish; const finished = new Promise(r => { finish = r; });
      const a = { keyframes, options, finished, finish, cancel() {} }; animations.push(a); return a;
    }
  }; }
  const front = element(), next = element(); let current = true;
  const context = { window: {}, Image: class { constructor() { loads.push(this); } }, console };
  if (fs.existsSync(sourcePath)) vm.runInNewContext(fs.readFileSync(sourcePath, 'utf8'), context);
  assert.ok(context.window.TMBShotFrames, 'a decoded two-layer image presenter is required');
  const controller = context.window.TMBShotFrames.create(front, next, () => current);
  async function load(src) { controller.request(src, src); loads.at(-1).onload(); await flush(); }
  async function finish() { animations.at(-1).finish(); await flush(); }
  return { get front() { return [front, next].find(e => e.style.zIndex === '0') || front; },
    get next() { return [front, next].find(e => e.style.zIndex === '1') || next; },
    loads, animations, controller, load, finish, detach: () => { current = false; } };
}
test('the old frame stays opaque during loading and the full 500ms crossfade', async () => {
  const f = fixture(); await f.load('island.webp');
  f.controller.request('town.webp', 'Town');
  assert.equal(f.front.src, 'island.webp'); assert.equal(f.front.hidden, false);
  assert.equal(f.next.hidden, true);
  f.loads.at(-1).onload(); await flush();
  assert.equal(f.front.src, 'island.webp'); assert.equal(f.front.hidden, false);
  assert.equal(f.next.src, 'town.webp'); assert.equal(f.next.hidden, false);
  assert.equal(f.animations[0].options.duration, 500);
  assert.equal(f.animations[0].keyframes[0].opacity, 0);
  assert.equal(f.animations[0].keyframes[1].opacity, 1);
  await f.finish();
  assert.equal(f.front.src, 'town.webp'); assert.equal(f.front.hidden, false);
  assert.equal(f.next.hidden, true);
});
test('failed and out-of-order loads retain the current story image', async () => {
  const f = fixture(); await f.load('island.webp');
  f.controller.request('old.webp', 'Old'); const late = f.loads.at(-1);
  f.controller.request('missing.webp', 'Missing'); f.loads.at(-1).onerror();
  late.onload(); await flush();
  assert.equal(f.front.src, 'island.webp'); assert.equal(f.front.hidden, false);
  assert.equal(f.animations.length, 0);
  await f.load('town.webp'); await f.finish(); assert.equal(f.front.src, 'town.webp');
});
test('a newer cue during a fade is queued without clearing either visible layer', async () => {
  const f = fixture(); await f.load('one.webp'); await f.load('two.webp');
  await f.load('three.webp');
  assert.equal(f.front.src, 'one.webp'); assert.equal(f.next.src, 'two.webp');
  await f.finish();
  assert.equal(f.front.src, 'two.webp'); assert.equal(f.next.src, 'three.webp');
  assert.equal(f.next.hidden, false);
  await f.finish(); assert.equal(f.front.src, 'three.webp');
});
test('a decoded image from a detached panel cannot start a fade', async () => {
  const f = fixture(); await f.load('one.webp');
  f.controller.request('two.webp', 'Two'); f.detach(); f.loads.at(-1).onload(); await flush();
  assert.equal(f.front.src, 'one.webp'); assert.equal(f.animations.length, 0);
});
test('the next layer waits for decoding while the old picture stays visible', async () => {
  const f = fixture(); await f.load('one.webp');
  let decoded; f.next.decode = () => new Promise(r => { decoded = r; });
  await f.load('two.webp');
  assert.equal(f.front.hidden, false); assert.equal(f.next.hidden, true);
  assert.equal(f.animations.length, 0);
  decoded(); await flush(); assert.equal(f.next.hidden, false);
  await f.finish(); assert.equal(f.front.src, 'two.webp');
});
test('a failed recycled layer cannot replace the last decoded frame while opaque', async () => {
  const f = fixture(); await f.load('one.webp'); await f.load('two.webp');
  const retired = f.front;
  retired.decode = () => Promise.reject(new Error('decode failed'));
  await f.finish();
  await f.load('three.webp');
  const visible = [f.front, f.next].filter(e => !e.hidden && e.style.opacity !== '0');
  assert.ok(visible.every(e => e.src === 'two.webp'), 'only the last decoded frame may be opaque');
  retired.decode = () => Promise.resolve();
  await f.load('four.webp'); await f.finish(); assert.equal(f.front.src, 'four.webp');
});
