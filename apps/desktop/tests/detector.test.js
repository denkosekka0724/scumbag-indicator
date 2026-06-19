const assert = require("node:assert/strict");
const detector = require("../src/detector");

const totalWeight = detector.CATEGORIES.reduce((sum, item) => sum + item.max, 0);
assert.equal(totalWeight, 100);

const sample =
  "她只是普通朋友，你能不能大度一点？等我工作稳定了肯定娶你，现在别老逼我。你就是太敏感了，我心里只有你，再给我一次机会。";

const result = detector.analyze(sample, {
  relationshipDuration: "testing",
  repeatPattern: true,
  boundaryIgnored: true
});

assert.ok(result.score >= 40, `expected score >= 40, got ${result.score}`);
assert.ok(result.category_scores.find((item) => item.category === "暧昧分散").hit);
assert.ok(result.category_scores.find((item) => item.category === "拖延承诺").hit);
assert.ok(result.category_scores.find((item) => item.category === "煤气灯效应").hit);
assert.ok(result.strongest_evidence.length >= 3);
assert.ok(result.background_notes.some((item) => item.type === "repeat_pattern"));
assert.ok(result.background_notes.some((item) => item.type === "boundary_ignored"));
assert.equal(result.modifiers.some((item) => item.includes("反复发生") || item.includes("不舒服后仍继续")), false);
assert.ok(result.strongest_evidence.every((item) => item.why_it_matches && item.needed_context));
assert.ok(result.knowledge_sources.length >= 4);

const short = detector.analyze("他说最近工作忙，回消息少。");
assert.ok(short.score <= 19, `ordinary busy case should stay low, got ${short.score}`);

const safety = detector.analyze("你敢分手我就曝光你的裸照，我会跟踪你。");
assert.equal(safety.safety_override, true);
assert.ok(safety.score >= 80);

const verbalViolence = detector.analyze("他说：你再这样，信不信我揍你？");
assert.equal(verbalViolence.safety_override, true);
assert.ok(verbalViolence.score >= 80);
assert.ok(verbalViolence.safety_alerts.some((item) => item.label === "暴力威胁"));

const doxxingThreat = detector.analyze("你敢分手我就开盒你，把你手机号和住址发网上。");
assert.equal(doxxingThreat.safety_override, true);
assert.ok(doxxingThreat.safety_alerts.some((item) => item.label === "隐私曝光威胁"));

const locationThreat = detector.analyze("把实时位置一直开着，不准关，我要随时查你在哪。");
assert.equal(locationThreat.safety_override, true);
assert.ok(locationThreat.safety_alerts.some((item) => item.label === "监控/限制自由"));

const normalTechText = detector.analyze("今晚打游戏别等我，定位这个 bug 我明天再看。");
assert.equal(normalTechText.safety_override, false);
assert.ok(normalTechText.score <= 10);

const report = detector.generateMarkdownReport(result);
assert.ok(report.includes("渣男指数"));
assert.ok(report.includes("命中的话术"));
assert.ok(report.includes("为什么命中"));
assert.ok(report.includes("依据与边界"));

const timelineResult = detector.analyze(
  [
    "2026-06-12 21:08:17 甲方 你今天又不回消息。",
    "2026-06-12 21:09:02 乙方 刚在忙，宝贝，别多想。",
    "2026-06-12 21:10:42 甲方 你朋友圈五分钟前点赞了别人照片。",
    "2026-06-12 21:13:20 乙方 你最近真的变得很敏感，你能不能懂事一点？",
    "2026-06-12 21:15:16 甲方 你昨天说加班到十二点，可是别人发的合照里你十点半在酒吧。",
    "2026-06-12 21:18:33 乙方 那是客户局。她只是普通朋友，你别多想。",
    "2026-06-12 21:26:06 乙方 行，那你想怎样？分手？",
    "2026-06-12 22:16:42 乙方 我刚才语气不好。我最近压力大，你别闹了。"
  ].join("\n"),
  {
    importMeta: {
      messages: [
        { time: "2026-06-12 21:08:17", sender: "甲方", content: "你今天又不回消息。" },
        { time: "2026-06-12 21:09:02", sender: "乙方", content: "刚在忙，宝贝，别多想。" },
        { time: "2026-06-12 21:10:42", sender: "甲方", content: "你朋友圈五分钟前点赞了别人照片。" },
        { time: "2026-06-12 21:13:20", sender: "乙方", content: "你最近真的变得很敏感，你能不能懂事一点？" },
        {
          time: "2026-06-12 21:15:16",
          sender: "甲方",
          content: "你昨天说加班到十二点，可是别人发的合照里你十点半在酒吧。"
        },
        { time: "2026-06-12 21:18:33", sender: "乙方", content: "那是客户局。她只是普通朋友，你别多想。" },
        { time: "2026-06-12 21:26:06", sender: "乙方", content: "行，那你想怎样？分手？" },
        { time: "2026-06-12 22:16:42", sender: "乙方", content: "我刚才语气不好。我最近压力大，你别闹了。" }
      ]
    }
  }
);
assert.equal(timelineResult.timeline_analysis.message_count, 8);
assert.ok(timelineResult.timeline_analysis.top_participants.some((item) => item.name === "乙方"));
assert.ok(timelineResult.timeline_analysis.contradiction_signals.length >= 1);
assert.ok(detector.generateMarkdownReport(timelineResult).includes("时间线概览"));

console.log("desktop detector tests passed");
