#!/usr/bin/env bash
# Rebuild public/models/usv.glb from the Rhino source.
#
#   conda activate r3dm && ./scripts/build-model.sh
#
# Needs rhino3dm + trimesh + numpy in the active Python env; gltf-transform is
# fetched by npx. Intermediates land in build/ and are not served.
set -euo pipefail

SRC="${1:-../model/USV NCKU.3dm}"
OUT="public/models/usv.glb"
GT="npx --yes @gltf-transform/cli@latest"

mkdir -p build/models public/models

# 1. Harvest Rhino's cached render meshes (with crease normals) into a raw GLB.
python scripts/3dm_to_glb.py "$SRC" build/models/usv-raw.glb

# 2. Merge coincident vertices, then drop ~75% of the triangles. --lock-border
#    keeps part outlines crisp; the error bound stops the hull going faceted.
$GT weld     build/models/usv-raw.glb  build/models/usv-weld.glb
$GT simplify build/models/usv-weld.glb build/models/usv-simp.glb \
    --ratio 0.25 --error 0.0008 --lock-border true

# 3. Draco. Decoded by the wasm decoder self-hosted in public/draco/, which is
#    copied from three's examples — refresh it when three is upgraded:
#    cp node_modules/three/examples/jsm/libs/draco/gltf/draco_{wasm_wrapper.js,decoder.wasm} public/draco/
$GT draco build/models/usv-simp.glb "$OUT"

ls -lh "$OUT"
