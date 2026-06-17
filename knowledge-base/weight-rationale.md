---
title: AI渣男识别器权重来源与校准说明
version: 0.2
created: 2026-06-12
---

# AI渣男识别器权重来源与校准说明

## 结论先说

0.1 版权重是 MVP 启发式：煤气灯 16 分，其余多数 12 分，用来保证总分 100。它适合快速原型，但不够可追溯。

0.2 版改为 evidence-informed 权重：不声称文献里存在“渣男指数”标准答案，而是把 8 类中文话术映射到亲密伴侣暴力（IPV）、心理虐待、强制控制、物化、承诺不确定和 back-burner/breadcrumbing 研究，再按三轴评分归一化。

## 为什么不能直接照搬某个论文比例

目前没有权威论文给出“PUA打压/煤气灯/间歇性温柔/暧昧分散/道德绑架/物化女性/拖延承诺/钓鱼撒网”的现成权重。已有研究大多使用：

- 量表项目计分，例如 CTS2、PMWI、CAS、MMEA。
- 暴力/虐待类型分类，例如 physical、sexual、psychological、coercive、technological。
- 结果变量关联，例如 PTSD、抑郁、焦虑、自杀意念、恐惧、无力感。

所以权重只能做成透明的“证据映射模型”，以后再用真实标注样本做统计校准。

## 主要证据来源

### 权威定义

- CDC 将 IPV 定义为亲密伴侣实施的 physical violence、sexual violence、stalking 和 psychological aggression，并强调 psychological aggression 可包含 coercive tactics。https://www.cdc.gov/intimate-partner-violence/about/index.html
- U.S. DOJ 将家庭暴力定义为用于获得或维持 power and control 的行为模式，覆盖 physical、sexual、emotional、economic、psychological、technological actions/threats/coercive behavior。https://www.justice.gov/ovw/domestic-violence
- ACOG 指出 IPV 是 assaultive behavior 和 coercive behavior 的模式，可包括 physical injury、psychologic abuse、sexual assault。https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2012/02/intimate-partner-violence
- WHO 关于 violence against women/IPV 的材料将 controlling behaviours、emotional abuse、sexual violence 等作为重要维度。https://www.who.int/news-room/fact-sheets/detail/violence-against-women

### 已验证量表与构念

- PMWI：心理虐待量表，覆盖 dominance-isolation 与 emotional-verbal abuse；短版项目包括“treated me like an inferior”“told me my feelings were irrational or crazy”“blamed me for his problems”“tried to make me feel crazy”。https://emerge.ucsd.edu/r_8p5utwnp39qfmif/
- PMWI 原始开发论文：Tolman, 1989, The development of a measure of psychological maltreatment of women by their male partners. https://pubmed.ncbi.nlm.nih.gov/2487132/
- CTS2/CTS2S：亲密关系冲突策略量表，包含 psychological aggression、physical assault、sexual coercion、injury 等维度。https://emerge.ucsd.edu/r_1pzr12hywnkog9o/
- CAS/CASR-SF：Composite Abuse Scale，覆盖 severe combined abuse、emotional abuse、harassment 等；其 emotional abuse 因子包含 verbal、psychological、dominance、social isolation。https://www.saferfamilies.org.au/resources/composite-abuse-scale
- CASR-SF 开发论文：15-item brief measure，强调可靠性、效度和不同 IPV 经验的子维度。https://pmc.ncbi.nlm.nih.gov/articles/PMC5168640/
- MMEA：Multidimensional Measure of Emotional Abuse，覆盖 Restrictive Engulfment、Denigration、Hostile Withdrawal、Dominance/Intimidation。https://pubmed.ncbi.nlm.nih.gov/10397625/
- 心理 IPV 子类型研究：MMEA 维度与心理健康后果相关。https://pmc.ncbi.nlm.nih.gov/articles/PMC6688298/

### 机制和结果研究

- Sweet, 2019, The Sociology of Gaslighting：煤气灯作为社会关系中的权力化现实操控。https://journals.sagepub.com/doi/abs/10.1177/0003122419874843
- March et al., 2023, gaslighting tactics and Dark Tetrad traits in intimate relationships. https://link.springer.com/article/10.1007/s10896-023-00582-y
- Coercive control review：强制控制通过恐惧、无力感、控制丧失等机制造成伤害。https://pmc.ncbi.nlm.nih.gov/articles/PMC6291212/
- The Trauma and Mental Health Impacts of Coercive Control. https://pmc.ncbi.nlm.nih.gov/articles/PMC10666508/
- IPV severity measurement review：更多类型、更高严重度的 IPV 与更差心理健康后果相关。https://pmc.ncbi.nlm.nih.gov/articles/PMC11537860/
- Dutton & Painter, traumatic bonding：虐待关系中的情感依附/创伤联结。https://pubmed.ncbi.nlm.nih.gov/8193053/
- Objectification Theory：物化与女性心理健康风险。https://journals.sagepub.com/doi/10.1111/j.1471-6402.1997.tb00108.x
- Objectification and IPV perpetration. https://pmc.ncbi.nlm.nih.gov/articles/PMC11548787/
- Interpersonal sexual objectification and IPV. https://journals.sagepub.com/doi/abs/10.1177/0886260520922348
- Commitment uncertainty overview：承诺不确定本身不是虐待，但会影响关系稳定与安全感。https://fincham.info/papers/2014-commitment-uncertainty.pdf
- Back-burner relationships / relationship alternatives. https://www.tandfonline.com/doi/abs/10.1080/08824096.2018.1425985
- Breadcrumbing psychological correlates. https://pmc.ncbi.nlm.nih.gov/articles/PMC7037474/

## 三轴评分方法

每类先按 3 个维度给 0-5 分：

1. 伤害严重度：对安全、自主、现实感、自我价值、性/身体边界的伤害潜力。
2. 强制控制核心性：是否直接服务于控制、隔离、恐惧、羞耻、依赖循环或权力不对等。
3. 测量证据强度：是否在 PMWI、CAS、CTS2、MMEA、coercive control 等量表/综述中有清楚对应。

原始分相加后归一化到 100，并做整数调整：

| 类别 | 伤害严重度 | 强制控制核心性 | 测量证据强度 | 原始分 | 归一后上限 |
|---|---:|---:|---:|---:|---:|
| 煤气灯效应 | 5 | 5 | 5 | 15 | 16 |
| 道德绑架 | 5 | 5 | 4 | 14 | 15 |
| 物化女性 | 5 | 4 | 4 | 13 | 14 |
| 间歇性温柔 | 4 | 5 | 3 | 12 | 13 |
| PUA打压 | 4 | 4 | 4 | 12 | 12 |
| 暧昧分散 | 3 | 4 | 4 | 11 | 11 |
| 钓鱼撒网 | 3 | 3 | 4 | 10 | 10 |
| 拖延承诺 | 3 | 3 | 3 | 9 | 9 |

合计：100。

## 权重解释

### 为什么煤气灯最高：16

煤气灯同时命中 PMWI 的“feelings irrational/crazy”“make me feel crazy”，也属于 coercive control 中对现实感和判断权的夺取。它不只是“吵架说你敏感”，高强度煤气灯会让人失去对事实、记忆和自我感受的信任。

### 为什么道德绑架高：15

道德绑架对应羞耻、内疚、威胁、爱撤回、受害者反转，是强制控制里常见的 pressure/shame 机制。若出现自伤威胁、分手威胁、孤立或恐惧，应由安全覆盖规则处理。

### 为什么物化女性高：14

物化如果只停留在审美评价，风险不一定高；但在亲密关系中，它常与性边界、性胁迫、去人化和工具化联系在一起。CTS2/CAS 对 sexual coercion 的权重通常高于普通心理攻击，所以此类上限高于普通暧昧/拖延。

### 为什么间歇性温柔是 13

它本身不一定是虐待，但当它出现在“伤害-冷淡-挽回-复发”循环里，会支撑创伤联结和依赖循环。其危险性来自重复模式，而不只是单次道歉。

### 为什么 PUA打压是 12

PUA打压主要对应 MMEA 的 Denigration 和 PMWI 的 emotional-verbal abuse。它侵蚀自尊，但若没有控制、威胁、现实操控或性边界突破，通常低于煤气灯/强制控制/性物化风险。

### 为什么暧昧分散是 11

暧昧分散对应关系替代、边界模糊和三角关系稀释。它对关系伤害很强，但单独出现时不必然等同于心理虐待；一旦叠加煤气灯、撒谎、道德绑架，分数会通过组合修正上升。

### 为什么钓鱼撒网是 10

back-burner/breadcrumbing 研究显示它会造成不确定、被吊着和心理困扰，但相比强制控制、性胁迫和煤气灯，直接虐待证据稍弱。因此中等偏高。

### 为什么拖延承诺最低：9

承诺不确定不是天然操控；慢热、现实压力、经济条件都可能是真实原因。只有当“长期享受关系利益 + 不给可验证行动 + 被追问后反转指责”同时出现，才提高风险。

## 安全覆盖不参与普通权重

暴力威胁、性胁迫、跟踪、监控、隐私曝光、自伤胁迫、财务控制不应该被压缩进普通 0-100 类别权重里。它们触发 safety_override：最低按 80 分处理，并输出安全优先建议。

## 仍需后续验证

这套权重是 evidence-informed，不是统计训练结果。下一阶段最好的验证方式：

1. 建立至少 300-500 条中文聊天片段标注集。
2. 让 2-3 名标注者按 8 类、严重度、是否建议止损独立标注。
3. 计算一致性，例如 Cohen's kappa / Krippendorff's alpha。
4. 用逻辑回归、ordinal regression 或 calibrated additive model 学习权重。
5. 检查误伤：普通忙碌、正常异性友谊、真实压力、健康边界。
6. 检查漏报：煤气灯变体、软性威胁、隐性物化、慢性冷暴力。

在没有真实标注集前，当前版本应标注为“证据映射权重”，不能宣称临床诊断或法律风险评估。
