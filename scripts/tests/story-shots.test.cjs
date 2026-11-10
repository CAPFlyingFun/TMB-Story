const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const modulePath = path.join(root, 'reader/story-shots.js');
const api = fs.existsSync(modulePath) ? require(modulePath) : {};
const manifest = { segments: [
  { displayText: 'The date.' },
  { displayText: 'Ocean. Forest. Town.' },
  { displayText: 'Inside the lab.' }
] };
const sheet = { shots: [
  { id: 'wide', at: { line: 'Ocean.' }, src: './wide.webp' },
  { id: 'forest', at: { line: 'Ocean.', phrase: 'Forest.' }, src: './forest.webp' },
  { id: 'town', at: { line: 'Ocean.', phrase: 'Town.' }, src: './town.webp' },
  { id: 'lab', at: { line: 'Inside the lab.' }, src: null }
] };
function compile(m = manifest, s = sheet) {
  assert.equal(typeof api.compile, 'function', 'the player needs a script-cue resolver');
  return api.compile(m, s);
}
test('phrase boundaries select the next frame at its cue, not before', () => {
  const cues = compile();
  assert.equal(api.select(cues, 1, 0.349).id, 'wide');
  assert.equal(api.select(cues, 1, 0.35).id, 'forest');
  assert.equal(api.select(cues, 1, 0.749).id, 'forest');
  assert.equal(api.select(cues, 1, 0.75).id, 'town');
});
test('backward seeking and replay select earlier images without retained state', () => {
  const cues = compile();
  assert.equal(api.select(cues, 1, 0.9).id, 'town');
  assert.equal(api.select(cues, 1, 0.1).id, 'wide');
  assert.equal(api.select(cues, 0, 0), null);
});
test('the laboratory cue resets to the chapter cover', () => {
  assert.equal(api.select(compile(), 2, 0).src, null);
});
test('inserting a script segment moves the cues with the matching text', () => {
  const changed = { segments: [{ displayText: 'New lead-in.' }, ...manifest.segments] };
  const cues = compile(changed);
  assert.equal(api.select(cues, 1, 1), null);
  assert.equal(api.select(cues, 2, 0.5).id, 'forest');
});
test('missing or ambiguous anchors cannot silently select unrelated artwork', () => {
  assert.throws(() => compile(manifest, { shots: [{ at: { line: 'Missing line' } }] }), /anchor/i);
  assert.throws(() => compile({ segments: [manifest.segments[1], manifest.segments[1]] }), /ambiguous/i);
  assert.throws(() => compile(manifest, { shots: [{ at: { line: 'Ocean.', phrase: 'Missing' } }] }), /phrase/i);
});
test('normalization handles smart quotes and whitespace without changing a cue', () => {
  const cues = compile({ segments: [{ displayText: '  It’s   night. Forest.' }] }, {
    shots: [{ id: 'night', at: { line: "It's night." }, src: './night.webp' }]
  });
  assert.equal(api.select(cues, 0, 0).id, 'night');
});
test('the shipped opening cue list resolves against the real chapter manifest', () => {
  const cuePath = path.join(root, 'reader/shots/chapter-01.json');
  assert.ok(fs.existsSync(cuePath), 'chapter one needs an ordered cue list');
  const real = JSON.parse(fs.readFileSync(path.join(root, 'audio/manifests/chapter-01.json')));
  const cues = compile(real, JSON.parse(fs.readFileSync(cuePath)));
  assert.deepEqual(cues.map(c => c.id), ['island-wide', 'island-approach', 'settlement-distant', 'settlement-close', 'laboratory']);
  assert.equal(api.select(cues, 2, 0).src, null);
  for (const cue of cues) if (cue.src) {
    assert.ok(fs.existsSync(path.join(root, cue.src)));
    assert.ok(cue.portraitSrc && fs.existsSync(path.join(root, cue.portraitSrc)));
  }
});
