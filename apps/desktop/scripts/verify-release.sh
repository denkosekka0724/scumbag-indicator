#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TAURI_DIR="$ROOT_DIR/src-tauri"
APP_PATH="$TAURI_DIR/target/release/bundle/macos/AI渣男识别器.app"
DMG_PATH="$TAURI_DIR/target/release/bundle/dmg/AI渣男识别器_0.1.0_aarch64.dmg"

test -d "$APP_PATH"
test -f "$DMG_PATH"
test -s "$DMG_PATH"
test -f "$APP_PATH/Contents/Info.plist"
test -f "$APP_PATH/Contents/MacOS/ai-zhaman-detector"

/usr/libexec/PlistBuddy -c "Print :CFBundleName" "$APP_PATH/Contents/Info.plist" | grep -q "AI渣男识别器"
/usr/libexec/PlistBuddy -c "Print :CFBundleIdentifier" "$APP_PATH/Contents/Info.plist" | grep -q "com.local.ai-zhaman-detector"

echo "release artifacts verified"
