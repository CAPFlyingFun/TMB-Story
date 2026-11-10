// Builds the Listen player's 3D picture into one file: visual/story3d/dist/story3d.js.
// Run scripts/build-story3d.sh (it uses tombs-lab's vite). `three` is the Watch tab's bundle
// (three.js r185 + TRADDOMIUM's human rig), so the rig code is the same one Watch uses.
import { fileURLToPath } from 'node:url';
const here = fileURLToPath(new URL('.', import.meta.url));
export default {
  root: here, publicDir: false, logLevel: 'warn',
  resolve: { alias: [{ find: /^three$/, replacement: fileURLToPath(new URL('../vendor/three-human.js', import.meta.url)) }] },
  build: {
    outDir: here + 'dist', emptyOutDir: true, target: 'es2020', minify: true, sourcemap: false,
    lib: { entry: here + 'src/mount.js', formats: ['es'], fileName: () => 'story3d.js' },
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
};
