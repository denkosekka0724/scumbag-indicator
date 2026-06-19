# 评测案例库

第一批 seed cases 用于守住“可信度闭环”，不是产品宣传案例，也不冒充真实用户经历。

## 分布

- 8 类话术各 3 条：24 条。
- 反误判案例：12 条。
- 安全风险案例：8 条。
- 混合复杂案例：4 条。

## 每条案例包含

- `expected_score_range`：允许的分数区间，避免改规则后分数漂移过大。
- `expected_categories`：必须命中的话术类别。
- `forbidden_categories`：不应误命中的类别。
- `safety_override`：是否必须触发安全优先。
- `annotation`：标注理由、证据、善意解释和风险说明。

## 运行

```bash
cd apps/desktop
node scripts/evaluate-cases.js
```

这个集合故意包含单句弱证据和正常沟通反例。目标是降低误判，不是把所有不舒服的表达都打高分。
