#!/bin/sh
# Rebuild the Listen player's 3D picture (visual/story3d/dist/story3d.js) from visual/story3d/src.
set -e
cd "$(dirname "$0")/.."
[ -x tombs-lab/node_modules/.bin/vite ] || (cd tombs-lab && npm ci --silent)
tombs-lab/node_modules/.bin/vite build --config visual/story3d/vite.config.mjs
ls -la visual/story3d/dist/story3d.js
