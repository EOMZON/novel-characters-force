#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <output-dir> [graph-data.js]"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
OUT_DIR="$1"
DATA_FILE="${2:-$SKILL_DIR/assets/examples/hongloumeng.graph-data.js}"

mkdir -p "$OUT_DIR"
cp "$SKILL_DIR/assets/viewer/index.html" "$OUT_DIR/index.html"
cp "$SKILL_DIR/assets/viewer/style.css" "$OUT_DIR/style.css"
cp "$SKILL_DIR/assets/viewer/graph.js" "$OUT_DIR/graph.js"
cp "$DATA_FILE" "$OUT_DIR/graph-data.js"

echo "Scaffolded demo into $OUT_DIR"

