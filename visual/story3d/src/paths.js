// WHERE THE SITE'S FILES ARE, from wherever this bundle is loaded. The bundle is built to
// visual/story3d/dist/story3d.js, three folders below the repository root, so the reader
// (index.html at the root) and the probe (visual/story3d/probe.html) find the same files.
export const ROOT = new URL(/* @vite-ignore */ '../../../', import.meta.url);
export const asset = (path) => new URL(path.replace(/^\.?\//, ''), ROOT).href;
