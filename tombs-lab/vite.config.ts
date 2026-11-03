import { defineConfig } from 'vite';

// TMB-Story serves this folder from GitHub Pages as plain files, so the preview is built
// into tombs-lab/preview/ with relative paths and committed. `npm run build` rebuilds it.
export default defineConfig({ base: './', build: { outDir: 'preview', emptyOutDir: true } });
