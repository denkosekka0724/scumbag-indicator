const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const desktopUtils = require("../src/desktop-utils");
const privacyUtils = require("../src/privacy-utils");
const llmApi = require("../src/llm-api");

const root = path.join(__dirname, "..");
const indexHtml = fs.readFileSync(path.join(root, "src", "index.html"), "utf8");
const appJs = fs.readFileSync(path.join(root, "src", "app.js"), "utf8");
const desktopUtilsJs = fs.readFileSync(path.join(root, "src", "desktop-utils.js"), "utf8");
const privacyUtilsJs = fs.readFileSync(path.join(root, "src", "privacy-utils.js"), "utf8");
const llmApiJs = fs.readFileSync(path.join(root, "src", "llm-api.js"), "utf8");
const config = JSON.parse(fs.readFileSync(path.join(root, "src-tauri", "tauri.conf.json"), "utf8"));
const cargoToml = fs.readFileSync(path.join(root, "src-tauri", "Cargo.toml"), "utf8");
const rustLib = fs.readFileSync(path.join(root, "src-tauri", "src", "lib.rs"), "utf8");

assert.equal(desktopUtils.reportTimestamp(new Date("2026-06-12T21:08:00")), "20260612-2108");
assert.equal(desktopUtils.makeReportFileName("md", new Date("2026-06-12T21:08:00")), "zhaman-report-20260612-2108.md");
assert.ok(desktopUtils.makeJsonReport({ score: 80 }).includes('"score": 80'));
assert.ok(privacyUtils.redactText("手机号 13800000000").text.includes("[手机号1]"));
assert.equal(llmApi.makeChatCompletionsUrl("https://api.example.com/v1"), "https://api.example.com/v1/chat/completions");

assert.equal(config.build.frontendDist, "../src");
assert.equal(config.app.withGlobalTauri, true);
assert.equal(config.app.security.csp, null);
assert.equal(config.bundle.active, true);
assert.equal(config.bundle.targets, "all");
assert.ok(config.bundle.icon.includes("icons/icon.icns"));
assert.ok(config.bundle.icon.includes("icons/icon.ico"));
assert.ok(cargoToml.includes("tauri = { version = \"2\""));
assert.ok(cargoToml.includes("reqwest = { version = \"0.12\""));
assert.ok(cargoToml.includes("time = \"=0.3.47\""));
assert.ok(rustLib.includes("save_text_file"));
assert.ok(rustLib.includes("review_with_llm"));
assert.ok(rustLib.includes("FileDialog"));
assert.ok(fs.existsSync(path.join(root, "src-tauri", "icons", "icon.png")));
assert.ok(fs.existsSync(path.join(root, "src-tauri", "icons", "icon.icns")));
assert.ok(fs.existsSync(path.join(root, "src-tauri", "icons", "icon.ico")));
assert.ok(fs.existsSync(path.join(root, "src", "favicon.png")));
assert.ok(fs.existsSync(path.join(root, "scripts", "build-release.sh")));
assert.ok(fs.existsSync(path.join(root, "scripts", "verify-release.sh")));
assert.ok(fs.existsSync(path.join(root, "scripts", "generate-green-hat-icon.py")));

assert.ok(indexHtml.includes("时间线"));
assert.ok(indexHtml.includes("导出 Markdown"));
assert.ok(indexHtml.includes("导出 JSON"));
assert.ok(indexHtml.includes("privacy-utils.js"));
assert.ok(indexHtml.includes("llm-api.js"));
assert.ok(indexHtml.includes("llmTopBtn"));
assert.ok(indexHtml.includes("大模型 API 接入"));
assert.ok(indexHtml.includes("llmProviderPreset"));
assert.ok(indexHtml.includes("llmModelPreset"));
assert.ok(indexHtml.includes("DeepSeek"));
assert.ok(indexHtml.includes("硅基流动"));
assert.ok(indexHtml.includes("模型复核"));
assert.equal(indexHtml.includes("data-tab=\"advice\""), false);
assert.equal(indexHtml.includes("data-tab=\"privacy\""), false);
assert.equal(indexHtml.includes("data-tab=\"json\""), false);
assert.equal(indexHtml.includes("隐私边界"), false);
assert.ok(indexHtml.includes("exportMode"));
assert.ok(indexHtml.includes("maskNames"));
assert.ok(indexHtml.includes("context-card"));
assert.ok(indexHtml.includes("可选，不直接加分"));
assert.ok(indexHtml.includes("一键清空"));
assert.ok(indexHtml.includes("不读取微信/QQ底层数据库"));
assert.ok(indexHtml.includes("分析对象"));
assert.equal(indexHtml.includes("上下文行数"), false);
assert.equal(indexHtml.includes("contextLines"), false);
assert.equal(indexHtml.includes("全文导入"), false);
assert.ok(appJs.includes("clearSession"));
assert.ok(appJs.includes("renderTimeline"));
assert.ok(appJs.includes("evidence-explain"));
assert.equal(appJs.includes("contextLines"), false);
assert.equal(appJs.includes("useImportedBtn"), false);
assert.ok(appJs.includes("reviewWithLlm"));
assert.ok(appJs.includes("LLM_PROVIDER_PRESETS"));
assert.ok(appJs.includes("https://api.openai.com/v1"));
assert.ok(appJs.includes("https://dashscope.aliyuncs.com/compatible-mode/v1"));
assert.ok(appJs.includes("buildExportContent"));
assert.ok(fs.statSync(path.join(root, "src-tauri", "icons", "icon.png")).size > 10000);
assert.ok(fs.statSync(path.join(root, "src", "favicon.png")).size > 1000);
assert.ok(desktopUtilsJs.includes("save_text_file"));
assert.ok(privacyUtilsJs.includes("detectSensitiveInfo"));
assert.ok(llmApiJs.includes("reviewReport"));
assert.ok(llmApiJs.includes("review_with_llm"));
assert.ok(appJs.includes("Browser preview · API optional"));

for (const file of ["src/app.js", "src/desktop-utils.js", "src/privacy-utils.js", "src/index.html"]) {
  const content = fs.readFileSync(path.join(root, file), "utf8");
  assert.equal(/\bfetch\s*\(/.test(content), false, `${file} should not call fetch`);
  assert.equal(/XMLHttpRequest/.test(content), false, `${file} should not use XMLHttpRequest`);
  assert.equal(/localStorage|sessionStorage/.test(content), false, `${file} should not persist chat text`);
}

assert.ok(llmApiJs.includes("fetchImpl"), "llm-api.js should keep browser-preview network fallback");
assert.equal(/localStorage|sessionStorage/.test(llmApiJs), false, "llm-api.js should not persist chat text");

console.log("desktop smoke tests passed");
