#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TAURI_DIR="$ROOT_DIR/src-tauri"
APP_PATH="$TAURI_DIR/target/release/bundle/macos/AI渣男识别器.app"
DMG_DIR="$TAURI_DIR/target/release/bundle/dmg"
DMG_PATH="$DMG_DIR/AI渣男识别器_0.1.0_aarch64.dmg"

cd "$TAURI_DIR"
cargo tauri build --bundles app

mkdir -p "$DMG_DIR"
rm -f "$DMG_PATH"
hdiutil create \
  -volname "AI渣男识别器" \
  -srcfolder "$APP_PATH" \
  -ov \
  -format UDZO \
  "$DMG_PATH"

"$ROOT_DIR/scripts/verify-release.sh"
