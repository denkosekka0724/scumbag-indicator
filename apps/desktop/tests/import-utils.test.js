const assert = require("node:assert/strict");
const detector = require("../src/detector");
const imports = require("../src/import-utils");

const raw = [
  "2026-06-10 甲方 你为什么失联？",
  "2026-06-10 乙方 她只是普通朋友，你就是太敏感了。",
  "2026-06-10 乙方 你能不能大度一点？别老逼我。",
  "2026-06-10 乙方 等我工作稳定了肯定娶你，再给我一次机会。",
  "2026-06-10 朋友 今晚吃饭吗？",
  "今晚吃饭吗？"
].join("\n");
const parsed = imports.parseImportedFile("sample-chat.txt", raw);
const filtered = imports.filterByKeyword(parsed, "乙方", 0);
const detail = imports.parseImportedFileDetailed("sample-chat.txt", raw);
const filteredDetail = imports.filterImportDetailByKeyword(detail, "乙方", 0);

assert.ok(parsed.includes("她只是普通朋友"));
assert.ok(filtered.includes("乙方"));
assert.ok(filtered.includes("她只是普通朋友"));
assert.ok(!filtered.includes("今晚吃饭吗？"));
assert.equal(detail.stats.messages, 5);
assert.equal(detail.participants[0].name, "乙方");
assert.equal(filteredDetail.stats.messages, 3);
assert.ok(filteredDetail.text.includes("等我工作稳定了肯定娶你"));

const html = imports.parseImportedFile(
  "chat.html",
  "<html><body><p>小雨：你为什么失联？</p><p>他：你就是太敏感了</p><script>bad()</script></body></html>"
);
assert.ok(html.includes("你就是太敏感了"));
assert.ok(!html.includes("bad()"));

const multiline = imports.parseImportedFileDetailed(
  "wechat.txt",
  [
    "2026-06-12 21:08:17 甲方",
    "你今天又不回消息。",
    "2026-06-12 21:09:02 乙方",
    "刚在忙，宝贝，别多想。",
    "你现在连这个都要管了吗？"
  ].join("\n")
);
assert.equal(multiline.stats.messages, 2);
assert.ok(multiline.text.includes("刚在忙，宝贝，别多想。 你现在连这个都要管了吗？"));

const json = imports.parseImportedFile(
  "chat.json",
  JSON.stringify([
    { time: "2026-06-10", sender: "他", content: "等我工作稳定了肯定娶你" },
    { time: "2026-06-10", sender: "甲方", content: "你别再骗我了" }
  ])
);
assert.ok(json.includes("等我工作稳定了肯定娶你"));

const csv = imports.parseImportedFileDetailed(
  "chat.csv",
  [
    "time,sender,content",
    '2026-06-10 21:00,乙方,"她只是普通朋友，你就是太敏感了"',
    '2026-06-10 21:01,甲方,"你昨天说加班，其实在酒吧"'
  ].join("\n")
);
assert.equal(csv.format, "csv");
assert.equal(csv.stats.messages, 2);
assert.equal(csv.participants.length, 2);

const result = detector.analyze(filtered, { repeatPattern: true, boundaryIgnored: true });
assert.ok(result.score >= 25, `expected imported filtered chat score >= 25, got ${result.score}`);

console.log("desktop import utils tests passed");
