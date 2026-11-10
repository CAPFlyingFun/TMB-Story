// The chapter's lines on the CURRENT audio file's timeline. The Listen player puts them in
// globalThis.__TMB_STORY3D before it loads this bundle: each line's text and its start and
// end in seconds, taken from the manifest and the audio file's own line index. So when a
// line is re-recorded and the file is rebuilt, every action anchored to a line moves with it.
const g = (typeof globalThis !== 'undefined' && globalThis.__TMB_STORY3D) || {};
export default { lines: g.lines || [], seconds: g.seconds || 0 };
