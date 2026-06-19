const assert = require("node:assert/strict");
const privacy = require("../src/privacy-utils");

const sensitiveText = [
  "2026-06-12 21:08 甲方 他的手机号是 13800000000，邮箱 test.person@example.test。",
  "身份证 11010519900307891X，微信号 wxTest000，QQ: 123456789。",
  "住址: 测试市测试区测试路1号，单位: 测试单位有限公司。",
  "乙方 说她只是普通朋友，你别多想。"
].join("\n");

const result = privacy.redactText(sensitiveText, {
  importMeta: {
    participants: [
      { name: "甲方", count: 2 },
      { name: "乙方", count: 3 }
    ]
  }
});

assert.ok(result.summary.total >= 8, `expected at least 8 redactions, got ${result.summary.total}`);
assert.ok(result.findings.some((item) => item.type === "phone"));
assert.ok(result.findings.some((item) => item.type === "email"));
assert.ok(result.findings.some((item) => item.type === "id_card"));
assert.ok(result.findings.some((item) => item.type === "wechat"));
assert.ok(result.findings.some((item) => item.type === "qq"));
assert.ok(result.findings.some((item) => item.type === "address"));
assert.ok(result.findings.some((item) => item.type === "organization"));
assert.ok(result.findings.some((item) => item.type === "participant"));

for (const value of [
  "13800000000",
  "test.person@example.test",
  "11010519900307891X",
  "wxTest000",
  "123456789",
  "测试市测试区测试路1号",
  "测试单位有限公司",
  "甲方",
  "乙方"
]) {
  assert.equal(result.text.includes(value), false, `redacted text should not contain ${value}`);
}

assert.ok(result.text.includes("[手机号1]"));
assert.ok(result.text.includes("[邮箱1]"));
assert.ok(result.text.includes("[身份证号1]"));
assert.ok(result.text.includes("[参与者1]") || result.text.includes("[参与者2]"));

const ordinaryNumbers = privacy.redactText("2026-06-12 得分 80/100，连续 3 次，消息 42 条。QQ音乐不是QQ号。");
assert.equal(ordinaryNumbers.summary.total, 0);
assert.equal(ordinaryNumbers.text.includes("2026-06-12"), true);
assert.equal(ordinaryNumbers.text.includes("80/100"), true);

const noNameMask = privacy.redactText("乙方 手机号 13800000000", {
  maskNames: false,
  importMeta: { participants: [{ name: "乙方", count: 1 }] }
});
assert.equal(noNameMask.text.includes("乙方"), true);
assert.equal(noNameMask.text.includes("13800000000"), false);

const scan = privacy.detectSensitiveInfo("微信号 wxAbcdef，QQ: 543210", {});
assert.equal(scan.findings.some((item) => item.type === "wechat"), true);
assert.equal(scan.findings.some((item) => item.type === "qq"), true);

const structured = privacy.redactText("2026-06-12 21:08:17 甲方 你今天又不回消息。\n2026-06-12 21:09:02 乙方 别多想。", {
  senderSource: "2026-06-12 21:08:17 甲方 你今天又不回消息。\n2026-06-12 21:09:02 乙方 别多想。"
});
assert.equal(structured.text.includes("甲方"), false);
assert.equal(structured.text.includes("乙方"), false);
assert.ok(privacy.extractStructuredAliases("2026-06-12 21:08:17 甲方 你今天又不回消息。").includes("甲方"));

console.log("desktop privacy utils tests passed");
