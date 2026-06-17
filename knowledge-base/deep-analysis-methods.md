---
title: AI渣男识别器深度分析方法
version: 0.1
created: 2026-06-12
---

# AI渣男识别器深度分析方法

本文件把“聊天话术识别”升级成“亲密关系操控模式分析”。它不是临床诊断、法律定性或危险性专业评估，而是给 App/Agent 一套更深、更稳、更少误伤的分析流程。

## 方法总览

深度分析不应该只做“关键词命中”。推荐采用 8 层流水线：

1. 安全优先：先看暴力、跟踪、性胁迫、隐私曝光、自伤威胁、财务控制。
2. 文本取证：保留原句、说话人、时间、上下文窗口和是否重复。
3. 时间线分析：把单句放回关系阶段、冲突循环和反复模式。
4. 话术分类：映射到 8 类话术和已验证量表构念。
5. 强制控制分析：看是否夺取自主性、现实感、社交、身体、金钱、数字空间。
6. 心理机制分析：解释煤气灯、羞耻/内疚、创伤联结、物化、间歇性强化。
7. 反事实检查：主动寻找正常解释，避免把普通冲突误伤成操控。
8. 输出建议：不替用户做决定，只给边界、观察、止损条件和安全建议。

## 第1层：安全优先

安全风险不进入普通权重，而是触发 `safety_override`。

优先识别：

- 暴力威胁、恐吓、跟踪、限制自由。
- 性胁迫、突破身体边界、酒精/药物相关风险。
- 私密照/聊天记录曝光威胁。
- 自伤/自杀威胁迫使用户留下。
- 监控手机、定位、密码、社交账号。
- 借钱、贷款、转账、经济控制。

来源：

- CDC IPV 定义覆盖 physical violence、sexual violence、stalking、psychological aggression。https://www.cdc.gov/intimate-partner-violence/about/index.html
- DOJ 将 domestic violence 定义为用来获得或维持 power and control 的行为模式。https://www.justice.gov/ovw/domestic-violence
- WHO 将 IPV 中的 controlling behaviours、emotional abuse、sexual violence 纳入 violence against women 框架。https://www.who.int/news-room/fact-sheets/detail/violence-against-women
- Danger Assessment 用于亲密伴侣杀伤风险评估，适合作为安全升级参考，不适合作为聊天工具直接诊断。https://www.dangerassessment.org/

### 专业风险评估工具参考

这些工具用于专业人员或经训练人员的风险识别/管理，本项目只能借鉴“风险因素思维”，不能在 App 里伪装成专业风险评估：

| 工具 | 用途 | 本项目可借鉴点 |
|---|---|---|
| DASH | 英国 domestic abuse / stalking / honour-based violence 风险识别 | 把跟踪、恐惧、升级、分离期风险作为安全提示 |
| Danger Assessment | 亲密伴侣杀伤风险 | 暴力、威胁、武器、分离、控制升级要直接安全优先 |
| SARA | Spousal Assault Risk Assessment | 结构化专业判断，不只看单句，要看历史、升级、态度和风险管理 |
| B-SAFER | Brief Spousal Assault Form for Evaluation of Risk | 用于刑事司法/警务场景的简化风险管理思路 |
| ODARA | Ontario Domestic Assault Risk Assessment | 精算式再犯/袭击风险，强调历史暴力和可验证事实 |

来源：

- DASH Risk Checklist. https://www.dashriskchecklist.com/
- DASH risk assessment overview, DV RISC. https://dvrisc.org/resource/dash-risk-assessment/
- SARA guide overview, EMERGE. https://emerge.ucsd.edu/r_1plrabytih9j494/
- SARA psychometric review. https://pmc.ncbi.nlm.nih.gov/articles/PMC11545129/
- B-SAFER development, Department of Justice Canada. https://www.justice.gc.ca/eng/rp-pr/fl-lf/famil/rr05_fv1-rr05_vf1/b1.html
- B-SAFER overview, DV RISC. https://dvrisc.org/risk_assessment/b-safer/
- ODARA training program. https://odara.waypointcentre.ca/
- ODARA instrument overview. https://saarna.org/instrument/odara/
- Justice Canada IPV risk assessment tools review. https://www.justice.gc.ca/eng/rp-pr/cj-jp/fv-vf/rr12_8/a.html

关键限制：风险工具不是“分高就一定危险，分低就安全”。近年的 DASH 讨论也提醒我们：风险评分不能替代后续保护系统、专业判断和用户自身安全感。因此 App 只能输出“建议寻求专业支持/保存证据/联系可信任的人”，不能输出“官方风险等级”。

## 第2层：文本取证

每条证据必须保留：

- 原句 quote。
- 说话人。
- 时间戳。
- 前后 1-4 行上下文。
- 证据等级：A 原文直接命中，B 需要上下文，C 用户概述，D 推测。

不要只输出“他在煤气灯你”。要输出“哪句话 + 为什么 + 可能误判点”。

## 第3层：时间线分析

重点不是“某句话有多坏”，而是“它是否反复、升级、循环”。

推荐建立四条时间线：

1. 联系投入：热情、失联、补偿、再次失联。
2. 承诺兑现：承诺、延期、转移、遗忘。
3. 第三方边界：隐藏、否认、最小化、反指责。
4. 自我感受：怀疑、解释、道歉、降低边界、止损。

可借鉴强制控制和高风险关系研究中的 pattern-based 思路：看行为模式、控制升级、恐惧和自主性损失，而不是孤立事件。

来源：

- Coercive control review. https://pmc.ncbi.nlm.nih.gov/articles/PMC6291212/
- Trauma and mental health impacts of coercive control. https://pmc.ncbi.nlm.nih.gov/articles/PMC10666508/
- Coercive control literature review, AIFS. https://aifs.gov.au/all-research/research-reports/coercive-control-literature-review
- Monckton Smith homicide timeline research，用于高风险升级模式参考，不能直接套到普通关系评分。https://researchportal.glos.ac.uk/en/publications/intimate-partner-femicide-using-foucauldian-analysis-to-track-an-

## 第4层：量表映射

把 8 类中文话术映射到已验证构念，有助于少一点玄学。

| 本项目类别 | 对应构念 |
|---|---|
| PUA打压 | MMEA Denigration；PMWI emotional-verbal abuse |
| 煤气灯效应 | PMWI “feelings irrational/crazy”；coercive control |
| 间歇性温柔 | traumatic bonding；hostile withdrawal/reward cycle |
| 暧昧分散 | relationship alternatives；boundary ambiguity；coercive minimization |
| 道德绑架 | guilt induction；shame-to-guilt；emotional blackmail；dominance |
| 物化女性 | objectification；sexual coercion；dehumanization |
| 拖延承诺 | commitment uncertainty；ambiguity weaponization |
| 钓鱼撒网 | back-burner relationships；breadcrumbing；relationship alternatives |

来源：

- PMWI. https://emerge.ucsd.edu/r_8p5utwnp39qfmif/
- CTS2 / CTS2S. https://emerge.ucsd.edu/r_1pzr12hywnkog9o/
- CAS / CASR-SF. https://www.saferfamilies.org.au/resources/composite-abuse-scale
- MMEA. https://pubmed.ncbi.nlm.nih.gov/10397625/
- CASR-SF paper. https://pmc.ncbi.nlm.nih.gov/articles/PMC5168640/

## 第5层：强制控制分析

对每段文本问 6 个问题：

1. 他是否在控制你能知道什么？
2. 他是否在控制你能和谁接触？
3. 他是否在控制你如何解释现实？
4. 他是否在控制你表达不满的资格？
5. 他是否在控制你的身体、性、钱、账号、位置？
6. 他是否让你因为害怕后果而自我审查？

若答案集中为“是”，分数应从“话术冲突”升级为“控制模式”。

来源：

- Evan Stark / coercive control update and review. https://files.santaclaracounty.gov/migrated/Coercive-Control-Article-Update-Review-Evan-Stark-Marianne-Hester.pdf
- What research evidence tells us about coercive control, AIFS. https://aifs.gov.au/resources/policy-and-practice-papers/what-research-evidence-tells-us-about-coercive-control
- Technology-facilitated abuse systematic review. https://pmc.ncbi.nlm.nih.gov/articles/PMC10486147/

## 第6层：心理机制分析

每个命中类别要解释“它怎么起作用”：

- 煤气灯：夺取现实解释权，让用户怀疑自己。
- PUA打压：夺取评价权，让用户追求认可。
- 道德绑架：把边界转化为愧疚，让用户自证好人。
- 间歇性温柔：用稀缺奖励维持希望。
- 暧昧分散：把责任转给第三方或用户的“大度”。
- 物化女性：把主体降成身体/性/服务资源。
- 拖延承诺：用未来支票替代当下责任。
- 钓鱼撒网：低成本维持多个选项。

来源：

- The Sociology of Gaslighting. https://journals.sagepub.com/doi/abs/10.1177/0003122419874843
- Dutton & Painter traumatic bonding. https://pubmed.ncbi.nlm.nih.gov/8193053/
- Objectification Theory. https://journals.sagepub.com/doi/10.1111/j.1471-6402.1997.tb00108.x
- Breadcrumbing psychological correlates. https://pmc.ncbi.nlm.nih.gov/articles/PMC7037474/

## 第7层：反事实检查

每个判断都必须问：

- 是否可能只是一次误会？
- 是否有真实工作/家庭/健康压力？
- 是否存在双方沟通升级？
- 是否用户也越界，例如无授权查看隐私？
- 对方被指出后有没有具体修复？
- 是否只有单句，没有上下文？

这一步决定是否降分。比如“忙”单独出现不能判定；“长期失联 + 证据矛盾 + 反转指责 + 第三方隐藏”才是模式。

## 第8层：输出结构

深度报告建议固定包含：

1. 总分和置信度。
2. 安全风险提示。
3. 时间线摘要。
4. 8 类命中表。
5. 最强证据 Top 5。
6. 机制解释。
7. 可能误判点。
8. 观察/沟通/边界/止损建议。
9. 非诊断免责声明。

## 可落地到 App 的深度模式

当前 MVP 可新增一个“深度模式”：

- 先按普通规则跑分。
- 再生成时间线、反事实检查和强制控制矩阵。
- 若用户导入长聊天，按日期和说话人分组。
- 给每个证据添加“重复次数”和“首次/最近出现时间”。
- 输出“模式强度”，而不只输出关键词命中。

## 仍需人工校准

深度分析方法可以提高可解释性，但不能替代真实标注集。最终最可靠的验证路径仍然是：

1. 收集匿名中文聊天片段。
2. 让多名标注者标注 8 类、严重度、止损建议。
3. 计算一致性。
4. 用统计模型校准权重。
5. 专门测试误伤：普通忙碌、正常异性友谊、健康边界、真实压力。
