#!/usr/bin/env bash
# Copia i modelli di Diego dal repo rilievo-teloni e li decomprime (meshopt) per l'import in Blender.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
SRC="${RILIEVO_MODELS:-$HERE/../../../rilievo-teloni/public/models}"
mkdir -p "$HERE/work"
for f in trattore semirimorchio; do
  cp "$SRC/$f.glb" "$HERE/work/$f.glb"
  npx -y @gltf-transform/cli copy "$HERE/work/$f.glb" "$HERE/work/${f}_raw.glb"
done
