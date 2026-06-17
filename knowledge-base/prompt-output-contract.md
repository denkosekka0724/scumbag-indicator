---
title: AI渣男识别器 Prompt 与输出契约
version: 0.1
created: 2026-06-12
---

# AI渣男识别器 Prompt 与输出契约

## 系统提示词草案

```text
你是“亲密关系话术分析师”，任务是识别聊天记录或恋爱经历中的操控性话术模式。

你必须遵守：
1. 只基于用户提供的文本和明确上下文分析，不脑补事实。
2. 输出渣男指数 0-100，但说明这不是人格诊断、法律判断或治疗建议。
3. 必须识别 8 类：PUA打压、煤气灯效应、间歇性温柔、暧昧分散、道德绑架、物化女性、拖延承诺、钓鱼撒网。
4. 每个命中类别必须给出原文证据、证据等级、操控机制、可能误判点。
5. 如果证据不足，要明确说“不足以判断”，不要为了迎合用户而下结论。
6. 如果出现暴力、威胁、性胁迫、跟踪、监控、财务控制、自伤威胁等安全风险，优先输出安全建议。
7. 不替用户做决定，但要帮助用户看清模式，给出边界、观察和止损建议。

分析依据：
- 中文话术模型：情感成本最小化、责任外化/反转归因、模糊性武器化、阶段性投入调控、三角关系稀释。
- 学术机制：煤气灯、强制控制、创伤联结、间歇性强化、物化理论、承诺不确定、back-burner relationships、暗黑三角/四角人格相关操控倾向。
```

## JSON 输出契约

```json
{
  "score": 0,
  "risk_level": "低",
  "confidence": 0.0,
  "safety_override": false,
  "one_sentence_summary": "",
  "category_scores": [
    {
      "category": "煤气灯效应",
      "score": 0,
      "max_score": 16,
      "hit": false,
      "evidence": [
        {
          "quote": "",
          "evidence_level": "A",
          "why_it_matches": "",
          "possible_benign_explanation": ""
        }
      ],
      "mechanism": "",
      "user_impact": "",
      "boundary_test": ""
    }
  ],
  "strongest_evidence": [],
  "missing_context": [],
  "pattern_reading": {
    "relationship_stage_if_inferable": "",
    "main_mechanisms": [],
    "repeat_or_single_incident": ""
  },
  "advice": {
    "observe": [],
    "communicate": [],
    "protect_boundaries": [],
    "consider_stop_loss_if": [],
    "safety_resources_note": ""
  },
  "non_diagnostic_disclaimer": ""
}
```

## 用户可读输出模板

```markdown
## 结论

渣男指数：{score}/100（{risk_level}，置信度 {confidence}）

一句话：{one_sentence_summary}

## 命中的话术

### {category}：{category_score}/{max_score}

证据：
- “{quote}”

为什么算：
{why_it_matches}

心理机制：
{mechanism}

可能误判点：
{possible_benign_explanation}

## 最关键的3个信号

1. ...
2. ...
3. ...

## 建议

观察：
- ...

沟通边界：
- ...

止损条件：
- 如果 ... 继续发生，就说明这不是误会，而是模式。

说明：这不是人格诊断，也不替你做决定；它只是帮你把文本里的模式和风险看清楚。
```

## 分类器伪代码

```text
input_text = user chat or story
segments = split into speaker turns / events

for each segment:
  extract direct quotes
  detect lexical markers:
    - 只是/而已/别多想
    - 你太敏感/不成熟/无理取闹
    - 等我...就...
    - 她只是...
    - 你要是真爱我...
    - 女人就该...
  detect behavior markers:
    - disappearing
    - apology without repair
    - third-party ambiguity
    - boundary violation
    - hot-cold cycle
    - multiple alternatives

for each of 8 categories:
  assign evidence level A/B/C/D
  assign category score

apply modifiers:
  repetition, cross-category combo, boundary violation, safety override, information insufficiency

return structured JSON + user-readable explanation
```

## 深度模式追加字段

当用户导入长聊天或选择“深度分析”时，建议在 JSON 中追加：

```json
{
  "timeline": [
    {
      "time": "2026-06-12 21:13",
      "event": "用户提出事实矛盾，对方转为敏感/懂事标签",
      "categories": ["煤气灯效应", "道德绑架"]
    }
  ],
  "coercive_control_matrix": {
    "reality_control": [],
    "social_control": [],
    "body_or_sexual_boundary": [],
    "financial_control": [],
    "digital_control": [],
    "relationship_definition_control": []
  },
  "counterfactual_checks": [
    {
      "question": "是否可能只是一次真实忙碌？",
      "answer": "单次可以，但多日重复、证据矛盾和反转指责使风险升高。"
    }
  ],
  "pattern_strength": "single_incident | repeated | escalating | safety_critical"
}
```

## MVP 接口建议

请求：

```json
{
  "input_type": "chat_or_story",
  "text": "用户粘贴文本",
  "context": {
    "relationship_duration": "",
    "known_repetition": "",
    "user_goal": "想判断/想复盘/想设边界"
  },
  "output_language": "zh-CN"
}
```

响应：使用上面的 JSON 输出契约。

## 测试样例

### 样例1：关系最小化 + 反转指责

输入：

```text
他说：“她只是普通朋友，你能不能大度一点？你老这样查我真的很窒息。”
```

期望命中：

- 暧昧分散：关系降级，“只是普通朋友”。
- 煤气灯/反转指责：把边界质疑转成“你不大度/你让我窒息”。
- 道德绑架：用“大度”建立道德高低差。

### 样例2：拖延承诺

输入：

```text
他说：“等我工作稳定了肯定娶你，现在你别老逼我。”
```

期望命中：

- 拖延承诺：不可验证条件。
- 道德绑架：把要求明确未来说成“逼他”。

### 样例3：信息不足

输入：

```text
他说最近工作忙，回消息少。
```

期望输出：

- 不能直接判定。
- 需要追问频率、是否长期失联、是否有可验证行动、是否在其他场景投入正常。
