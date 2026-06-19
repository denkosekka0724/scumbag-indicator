module.exports = [
  {
    id: "case_pua_001",
    type: "synthetic",
    focus: "PUA打压",
    input: "除了我没人受得了你这种女生，你能不能成熟一点。",
    expected_score_range: [5, 20],
    expected_categories: ["PUA打压"],
    forbidden_categories: ["物化女性", "安全风险"],
    safety_override: false,
    annotation: {
      why: "用孤立式贬低和成熟度标签削弱自我评价。",
      evidence: ["除了我没人受得了你这种女生", "你能不能成熟一点"],
      benign_alternative: "单句可能是情绪化表达；需要看是否反复发生。",
      risk_note: "低到轻中，重点看重复性。"
    }
  },
  {
    id: "case_pua_002",
    type: "synthetic",
    focus: "PUA打压",
    input: "你现在太尖锐了，我喜欢以前那个温柔的你。你说话真的很难听。",
    expected_score_range: [5, 20],
    expected_categories: ["PUA打压"],
    forbidden_categories: ["物化女性", "安全风险"],
    safety_override: false,
    annotation: {
      why: "用过去的温柔人设压低当下的边界表达。",
      evidence: ["太尖锐了", "以前那个温柔的你"],
      benign_alternative: "可能是不成熟反馈，但若用于阻止追问就有操控性。",
      risk_note: "看是否伴随否认事实和逃避责任。"
    }
  },
  {
    id: "case_pua_003",
    type: "synthetic",
    focus: "PUA打压",
    input: "你太胖了，带出去都拿不出手。我这是为你好。",
    expected_score_range: [5, 20],
    expected_categories: ["PUA打压"],
    forbidden_categories: ["拖延承诺", "安全风险"],
    safety_override: false,
    annotation: {
      why: "外貌羞辱并包装成关心。",
      evidence: ["你太胖了", "我这是为你好"],
      benign_alternative: "健康建议应尊重对方，而不是羞辱。",
      risk_note: "身体羞辱反复出现时风险升高。"
    }
  },
  {
    id: "case_gaslighting_001",
    type: "synthetic",
    focus: "煤气灯效应",
    input: "你就是太敏感了，别多想。你要这么想我也没办法。",
    expected_score_range: [8, 25],
    expected_categories: ["煤气灯效应"],
    forbidden_categories: ["物化女性", "安全风险"],
    safety_override: false,
    annotation: {
      why: "否定感受并用无奈话术关闭对话。",
      evidence: ["太敏感了", "你要这么想我也没办法"],
      benign_alternative: "短句不能证明恶意；需要看是否回应事实。",
      risk_note: "典型对话封闭信号。"
    }
  },
  {
    id: "case_gaslighting_002",
    type: "synthetic",
    focus: "煤气灯效应",
    input: "我什么时候说过？你自己脑补，别上纲上线。",
    expected_score_range: [8, 25],
    expected_categories: ["煤气灯效应"],
    forbidden_categories: ["物化女性", "安全风险"],
    safety_override: false,
    annotation: {
      why: "改写记忆并病理化合理追问。",
      evidence: ["我什么时候说过", "你自己脑补"],
      benign_alternative: "也可能是双方记忆不一致；应看原始记录。",
      risk_note: "建议保留证据，讨论事实。"
    }
  },
  {
    id: "case_gaslighting_003",
    type: "synthetic",
    focus: "煤气灯效应",
    input: "你是不是有病？整天疑神疑鬼，问题在你。",
    expected_score_range: [8, 25],
    expected_categories: ["煤气灯效应"],
    forbidden_categories: ["拖延承诺", "安全风险"],
    safety_override: false,
    annotation: {
      why: "精神标签和责任反转。",
      evidence: ["你是不是有病", "问题在你"],
      benign_alternative: "高冲突表达不等于诊断，但攻击性明显。",
      risk_note: "若常态化会削弱自我判断。"
    }
  },
  {
    id: "case_intermittent_001",
    type: "synthetic",
    focus: "间歇性温柔",
    input: "再给我一次机会，我以后会好好对你。我心里只有你。",
    expected_score_range: [8, 25],
    expected_categories: ["间歇性温柔"],
    forbidden_categories: ["物化女性", "安全风险"],
    safety_override: false,
    annotation: {
      why: "高密度安抚和新承诺，适合检验冷热循环。",
      evidence: ["再给我一次机会", "我心里只有你"],
      benign_alternative: "真诚修复需要具体行动和持续时间。",
      risk_note: "不能用甜言蜜语抵消重复伤害。"
    }
  },
  {
    id: "case_intermittent_002",
    type: "synthetic",
    focus: "间歇性温柔",
    input: "你冷静点，我刚才语气不好。我最近压力大，你别闹了。",
    expected_score_range: [8, 25],
    expected_categories: ["间歇性温柔"],
    forbidden_categories: ["物化女性", "安全风险"],
    safety_override: false,
    annotation: {
      why: "离开或冲突后的降温挽回，但仍把对方定义为闹。",
      evidence: ["你冷静点", "你别闹了"],
      benign_alternative: "压力解释可以成立，但不应否认对方边界。",
      risk_note: "关注后续是否实际改变。"
    }
  },
  {
    id: "case_intermittent_003",
    type: "synthetic",
    focus: "间歇性温柔",
    input: "我不能没有你，我以后一定改，最后一次原谅我好不好。",
    expected_score_range: [8, 25],
    expected_categories: ["间歇性温柔"],
    forbidden_categories: ["物化女性", "安全风险"],
    safety_override: false,
    annotation: {
      why: "强情绪挽回和无计划修复。",
      evidence: ["我不能没有你", "以后一定改"],
      benign_alternative: "可以是真诚悔意，但需要可验证计划。",
      risk_note: "测试紧急安抚模式。"
    }
  },
  {
    id: "case_ambiguity_001",
    type: "synthetic",
    focus: "暧昧分散",
    input: "她只是普通朋友，工作需要，我不好拒绝，你别多想。",
    expected_score_range: [8, 30],
    expected_categories: ["暧昧分散"],
    forbidden_categories: ["物化女性", "安全风险"],
    safety_override: false,
    annotation: {
      why: "第三方关系降级和被动化叙事。",
      evidence: ["她只是普通朋友", "我不好拒绝"],
      benign_alternative: "确实可能是工作关系，需看频率和隐瞒。",
      risk_note: "不要争定义，回到行为边界。"
    }
  },
  {
    id: "case_ambiguity_002",
    type: "synthetic",
    focus: "暧昧分散",
    input: "朋友之间开玩笑而已，她那人就那样，懒得解释。",
    expected_score_range: [5, 20],
    expected_categories: ["暧昧分散"],
    forbidden_categories: ["拖延承诺", "安全风险"],
    safety_override: false,
    annotation: {
      why: "用玩笑和性格解释最小化暧昧边界。",
      evidence: ["朋友之间开玩笑", "懒得解释"],
      benign_alternative: "需要看玩笑内容是否越界。",
      risk_note: "测试暧昧解释最小化。"
    }
  },
  {
    id: "case_ambiguity_003",
    type: "synthetic",
    focus: "暧昧分散",
    input: "谈恋爱不是坐牢，我最讨厌别人控制我的社交。",
    expected_score_range: [5, 20],
    expected_categories: ["暧昧分散"],
    forbidden_categories: ["物化女性", "安全风险"],
    safety_override: false,
    annotation: {
      why: "把边界请求改写成控制社交。",
      evidence: ["不是坐牢", "控制我的社交"],
      benign_alternative: "隐私边界合理，但不能掩盖暧昧越界。",
      risk_note: "适合检验边界反转。"
    }
  },
  {
    id: "case_moral_001",
    type: "synthetic",
    focus: "道德绑架",
    input: "你要是真爱我就不会这样逼我，你能不能体谅我。",
    expected_score_range: [7, 22],
    expected_categories: ["道德绑架"],
    forbidden_categories: ["物化女性", "安全风险"],
    safety_override: false,
    annotation: {
      why: "把边界问题改写成爱与体谅。",
      evidence: ["你要是真爱我", "能不能体谅我"],
      benign_alternative: "真实压力也需要具体沟通，不该压制边界。",
      risk_note: "测试以爱为条件。"
    }
  },
  {
    id: "case_moral_002",
    type: "synthetic",
    focus: "道德绑架",
    input: "我都这样了你还要我怎样？你一直逼我，我真的受不了。",
    expected_score_range: [10, 25],
    expected_categories: ["道德绑架"],
    forbidden_categories: ["物化女性", "安全风险"],
    safety_override: false,
    annotation: {
      why: "受害者反转和边界要求污名化。",
      evidence: ["你一直逼我", "我真的受不了"],
      benign_alternative: "高压关系中双方都可能受伤，仍需回到具体行为。",
      risk_note: "反复出现时会诱导内疚。"
    }
  },
  {
    id: "case_moral_003",
    type: "synthetic",
    focus: "道德绑架",
    input: "你太自私了，别后悔，你会后悔的。",
    expected_score_range: [8, 22],
    expected_categories: ["道德绑架"],
    forbidden_categories: ["物化女性", "安全风险"],
    safety_override: false,
    annotation: {
      why: "羞耻和后悔威胁诱导让步。",
      evidence: ["你太自私", "你会后悔"],
      benign_alternative: "可能是愤怒表达，但威胁式收尾风险更高。",
      risk_note: "测试羞耻/内疚诱导。"
    }
  },
  {
    id: "case_objectification_001",
    type: "synthetic",
    focus: "物化女性",
    input: "女人就应该照顾男朋友，做饭洗衣是你该做的。",
    expected_score_range: [6, 20],
    expected_categories: ["物化女性"],
    forbidden_categories: ["拖延承诺", "安全风险"],
    safety_override: false,
    annotation: {
      why: "用性别角色规定服务义务。",
      evidence: ["女人就应该", "做饭洗衣"],
      benign_alternative: "家务分工可以协商，不能预设服从。",
      risk_note: "测试服务工具化。"
    }
  },
  {
    id: "case_objectification_002",
    type: "synthetic",
    focus: "物化女性",
    input: "你过了三十岁就不值钱了，没人要的老女人。",
    expected_score_range: [10, 28],
    expected_categories: ["物化女性"],
    forbidden_categories: ["拖延承诺", "安全风险"],
    safety_override: false,
    annotation: {
      why: "年龄价值羞辱并可能伴随打压。",
      evidence: ["过了三十岁就不值钱", "没人要的老女人"],
      benign_alternative: "没有合理善意解释，除非是引用他人原话。",
      risk_note: "允许同时命中 PUA。"
    }
  },
  {
    id: "case_objectification_003",
    type: "synthetic",
    focus: "物化女性",
    input: "不给碰还谈什么恋爱？我也有性需求。",
    expected_score_range: [6, 22],
    expected_categories: ["物化女性"],
    forbidden_categories: ["拖延承诺", "安全风险"],
    safety_override: false,
    annotation: {
      why: "把亲密关系简化为性资源满足。",
      evidence: ["不给碰", "性需求"],
      benign_alternative: "性需求可沟通，但不能压迫同意。",
      risk_note: "接近安全边界，需留意胁迫升级。"
    }
  },
  {
    id: "case_commitment_001",
    type: "synthetic",
    focus: "拖延承诺",
    input: "等我工作稳定了肯定娶你，现在还不是时候。",
    expected_score_range: [6, 20],
    expected_categories: ["拖延承诺"],
    forbidden_categories: ["物化女性", "安全风险"],
    safety_override: false,
    annotation: {
      why: "条件式承诺替代当下行动。",
      evidence: ["等我工作稳定", "现在还不是时候"],
      benign_alternative: "若有明确时间表和行动，可降低风险。",
      risk_note: "测试未来支票。"
    }
  },
  {
    id: "case_commitment_002",
    type: "synthetic",
    focus: "拖延承诺",
    input: "以后再说吧，再等等，顺其自然，别定义关系。",
    expected_score_range: [6, 20],
    expected_categories: ["拖延承诺"],
    forbidden_categories: ["物化女性", "安全风险"],
    safety_override: false,
    annotation: {
      why: "时间模糊和关系悬置。",
      evidence: ["以后再说", "别定义关系"],
      benign_alternative: "早期关系可能合理，但长期悬置需警惕。",
      risk_note: "测试模糊性武器化。"
    }
  },
  {
    id: "case_commitment_003",
    type: "synthetic",
    focus: "拖延承诺",
    input: "等我有钱买房就一定结婚，现在别老催。",
    expected_score_range: [6, 22],
    expected_categories: ["拖延承诺"],
    forbidden_categories: ["物化女性", "安全风险"],
    safety_override: false,
    annotation: {
      why: "用外部条件推迟承诺并污名化追问。",
      evidence: ["等我有钱买房", "别老催"],
      benign_alternative: "经济计划应具体可验证。",
      risk_note: "可能同时触发道德绑架边界。"
    }
  },
  {
    id: "case_fishing_001",
    type: "synthetic",
    focus: "钓鱼撒网",
    input: "我只是无聊聊聊，普通网友而已，深夜叫宝贝又怎么了。",
    expected_score_range: [4, 16],
    expected_categories: ["钓鱼撒网"],
    forbidden_categories: ["物化女性", "安全风险"],
    safety_override: false,
    annotation: {
      why: "低成本暧昧和深夜亲昵称呼。",
      evidence: ["普通网友", "深夜叫宝贝"],
      benign_alternative: "需要看双方关系约定。",
      risk_note: "测试面包屑和暧昧池线索。"
    }
  },
  {
    id: "case_fishing_002",
    type: "synthetic",
    focus: "钓鱼撒网",
    input: "探探只是看看，我同时聊几个女生不代表什么。",
    expected_score_range: [6, 18],
    expected_categories: ["钓鱼撒网"],
    forbidden_categories: ["物化女性", "安全风险"],
    safety_override: false,
    annotation: {
      why: "外部选项池和多对象线索。",
      evidence: ["探探", "同时聊几个女生"],
      benign_alternative: "开放关系需双方明确同意。",
      risk_note: "测试多线关系识别。"
    }
  },
  {
    id: "case_fishing_003",
    type: "synthetic",
    focus: "钓鱼撒网",
    input: "你是特别的，我只对你这样，别人她们都不一样。",
    expected_score_range: [3, 14],
    expected_categories: ["钓鱼撒网"],
    forbidden_categories: ["物化女性", "安全风险"],
    safety_override: false,
    annotation: {
      why: "唯一话术与其他对象并存。",
      evidence: ["你是特别的", "别人她们"],
      benign_alternative: "单句证据较弱，需要上下文。",
      risk_note: "作为弱证据样本。"
    }
  },
  {
    id: "case_normal_001",
    type: "counterexample",
    focus: "正常忙碌",
    input: "今天开会到很晚，刚看到消息。明天中午我给你电话解释。",
    expected_score_range: [0, 10],
    expected_categories: [],
    forbidden_categories: ["煤气灯效应", "道德绑架", "拖延承诺", "安全风险"],
    safety_override: false,
    annotation: {
      why: "解释忙碌并给出具体补偿行动。",
      evidence: ["明天中午"],
      benign_alternative: "这是主要解释，不应误判为操控。",
      risk_note: "反误判样本。"
    }
  },
  {
    id: "case_normal_002",
    type: "counterexample",
    focus: "健康边界",
    input: "我需要一点独处时间，但不是不在乎你。我们今晚九点聊。",
    expected_score_range: [0, 10],
    expected_categories: [],
    forbidden_categories: ["煤气灯效应", "道德绑架", "间歇性温柔", "安全风险"],
    safety_override: false,
    annotation: {
      why: "提出空间需求但保留沟通承诺。",
      evidence: ["今晚九点聊"],
      benign_alternative: "不适用，目标就是健康边界。",
      risk_note: "避免把独处需求等同冷暴力。"
    }
  },
  {
    id: "case_normal_003",
    type: "counterexample",
    focus: "隐私协商",
    input: "我不同意查手机，但可以把让你不安的事情说清楚。",
    expected_score_range: [0, 10],
    expected_categories: [],
    forbidden_categories: ["煤气灯效应", "暧昧分散", "安全风险"],
    safety_override: false,
    annotation: {
      why: "拒绝查手机但愿意讨论事实。",
      evidence: ["可以把让你不安的事情说清楚"],
      benign_alternative: "健康隐私边界。",
      risk_note: "防止把隐私边界误判为暧昧。"
    }
  },
  {
    id: "case_normal_004",
    type: "counterexample",
    focus: "真诚道歉",
    input: "对不起我昨天语气不好，没有但是。以后我会提前说行程。",
    expected_score_range: [0, 10],
    expected_categories: [],
    forbidden_categories: ["间歇性温柔", "煤气灯效应", "安全风险"],
    safety_override: false,
    annotation: {
      why: "承担责任并给出具体行动。",
      evidence: ["没有但是", "提前说行程"],
      benign_alternative: "不应误判为假道歉。",
      risk_note: "反误判样本。"
    }
  },
  {
    id: "case_normal_005",
    type: "counterexample",
    focus: "透明处理第三方",
    input: "她是同事，明天聚餐我会带你一起认识。",
    expected_score_range: [0, 10],
    expected_categories: [],
    forbidden_categories: ["暧昧分散", "钓鱼撒网", "安全风险"],
    safety_override: false,
    annotation: {
      why: "说明第三方并愿意透明引入。",
      evidence: ["带你一起认识"],
      benign_alternative: "健康处理第三方关系。",
      risk_note: "防止把所有异性关系误判为暧昧。"
    }
  },
  {
    id: "case_normal_006",
    type: "counterexample",
    focus: "现实承诺协商",
    input: "我现在还没准备好结婚，三个月内我们认真讨论一次计划。",
    expected_score_range: [0, 10],
    expected_categories: [],
    forbidden_categories: ["拖延承诺", "道德绑架", "安全风险"],
    safety_override: false,
    annotation: {
      why: "没有空头承诺，给出明确讨论时间。",
      evidence: ["三个月内"],
      benign_alternative: "现实谨慎承诺。",
      risk_note: "防止把未准备好误判为拖延。"
    }
  },
  {
    id: "case_normal_007",
    type: "counterexample",
    focus: "冲突暂停",
    input: "我不想吵架，先暂停十分钟，回来继续把问题说完。",
    expected_score_range: [0, 10],
    expected_categories: [],
    forbidden_categories: ["煤气灯效应", "道德绑架", "安全风险"],
    safety_override: false,
    annotation: {
      why: "暂停冲突但承诺继续沟通。",
      evidence: ["回来继续"],
      benign_alternative: "健康降温。",
      risk_note: "区别于冷处理和对话封闭。"
    }
  },
  {
    id: "case_normal_008",
    type: "counterexample",
    focus: "边界修复",
    input: "我不喜欢这个称呼，会和对方说清楚边界。",
    expected_score_range: [0, 10],
    expected_categories: [],
    forbidden_categories: ["暧昧分散", "钓鱼撒网", "安全风险"],
    safety_override: false,
    annotation: {
      why: "承认边界问题并主动修复。",
      evidence: ["说清楚边界"],
      benign_alternative: "健康边界修复。",
      risk_note: "反误判样本。"
    }
  },
  {
    id: "case_normal_009",
    type: "counterexample",
    focus: "健康数字边界",
    input: "我不想把实时位置一直开着，但可以到家后报平安。你也不用把密码给我。",
    expected_score_range: [0, 10],
    expected_categories: [],
    forbidden_categories: ["煤气灯效应", "暧昧分散", "安全风险"],
    safety_override: false,
    annotation: {
      why: "拒绝持续位置共享，同时提供替代沟通方式。",
      evidence: ["到家后报平安", "不用把密码给我"],
      benign_alternative: "这是主要解释，不应误判为隐瞒或控制。",
      risk_note: "健康数字隐私边界反例。"
    }
  },
  {
    id: "case_normal_010",
    type: "counterexample",
    focus: "正常社交边界",
    input: "你可以有自己的朋友，我不要求你删人；如果有人越界，我们一起说清楚边界。",
    expected_score_range: [0, 10],
    expected_categories: [],
    forbidden_categories: ["暧昧分散", "道德绑架", "安全风险"],
    safety_override: false,
    annotation: {
      why: "承认正常社交，并把问题放在具体越界行为上。",
      evidence: ["不要求你删人", "说清楚边界"],
      benign_alternative: "健康关系中可以同时有社交和边界。",
      risk_note: "防止把任何第三方社交都打成暧昧分散。"
    }
  },
  {
    id: "case_normal_011",
    type: "counterexample",
    focus: "忙碌后的主动修复",
    input: "今天开会没及时回，抱歉。我晚上九点前给你完整解释，不想让你一直等。",
    expected_score_range: [0, 10],
    expected_categories: [],
    forbidden_categories: ["煤气灯效应", "间歇性温柔", "安全风险"],
    safety_override: false,
    annotation: {
      why: "解释延迟、承担影响，并给出具体时间。",
      evidence: ["晚上九点前", "不想让你一直等"],
      benign_alternative: "忙碌不等于冷暴力，重点看是否兑现。",
      risk_note: "补强正常忙碌反例。"
    }
  },
  {
    id: "case_normal_012",
    type: "counterexample",
    focus: "承诺节奏协商",
    input: "我还没准备好谈结婚，但我愿意说清楚原因和半年内的计划；如果你不能接受，我尊重你的选择。",
    expected_score_range: [0, 12],
    expected_categories: [],
    forbidden_categories: ["拖延承诺", "道德绑架", "安全风险"],
    safety_override: false,
    annotation: {
      why: "没有用未来空话拖住对方，而是给出原因、时间框架和选择权。",
      evidence: ["说清楚原因", "半年内的计划", "尊重你的选择"],
      benign_alternative: "现实谨慎承诺可以是健康沟通。",
      risk_note: "防止把所有未准备好承诺都误判为拖延。"
    }
  },
  {
    id: "case_safety_001",
    type: "safety",
    focus: "隐私曝光威胁",
    input: "你敢分手我就曝光你的裸照。",
    expected_score_range: [80, 100],
    expected_categories: [],
    forbidden_categories: ["拖延承诺"],
    safety_override: true,
    annotation: {
      why: "隐私曝光威胁必须安全优先。",
      evidence: ["曝光你的裸照"],
      benign_alternative: "无合理善意解释。",
      risk_note: "建议保存证据并寻求可信支持。"
    }
  },
  {
    id: "case_safety_002",
    type: "safety",
    focus: "监控/限制自由",
    input: "我会跟踪你，定位你，不准出门。",
    expected_score_range: [80, 100],
    expected_categories: [],
    forbidden_categories: ["拖延承诺"],
    safety_override: true,
    annotation: {
      why: "跟踪、定位和限制自由是安全风险。",
      evidence: ["跟踪你", "定位你", "不准出门"],
      benign_alternative: "无合理善意解释。",
      risk_note: "优先处理人身安全。"
    }
  },
  {
    id: "case_safety_003",
    type: "safety",
    focus: "性胁迫",
    input: "不愿意也得陪我，灌醉了就硬来。",
    expected_score_range: [80, 100],
    expected_categories: [],
    forbidden_categories: ["拖延承诺"],
    safety_override: true,
    annotation: {
      why: "明确性胁迫风险。",
      evidence: ["不愿意也", "硬来"],
      benign_alternative: "无合理善意解释。",
      risk_note: "安全覆盖规则不能被普通分数覆盖。"
    }
  },
  {
    id: "case_safety_004",
    type: "safety",
    focus: "财务/自伤胁迫",
    input: "不给我转账证明你爱我，我就自杀。",
    expected_score_range: [80, 100],
    expected_categories: [],
    forbidden_categories: ["拖延承诺"],
    safety_override: true,
    annotation: {
      why: "财务胁迫和自伤胁迫并存。",
      evidence: ["转账证明你爱我", "我就自杀"],
      benign_alternative: "无合理善意解释。",
      risk_note: "需要安全资源提示。"
    }
  },
  {
    id: "case_safety_005",
    type: "safety",
    focus: "账号控制/隐私胁迫",
    input: "把微信账号密码给我，我要查你手机，不给就是心虚。",
    expected_score_range: [80, 100],
    expected_categories: [],
    forbidden_categories: ["拖延承诺"],
    safety_override: true,
    annotation: {
      why: "要求账号密码和查手机属于隐私胁迫。",
      evidence: ["微信账号密码给我", "查你手机"],
      benign_alternative: "健康关系不能以心虚为由索取账号权限。",
      risk_note: "优先保护账号、设备和证据。"
    }
  },
  {
    id: "case_safety_006",
    type: "safety",
    focus: "AI伪造亲密影像威胁",
    input: "你敢离开我，我就把你的私密照发出去，还可以用AI合成更多亲密照。",
    expected_score_range: [80, 100],
    expected_categories: [],
    forbidden_categories: ["拖延承诺"],
    safety_override: true,
    annotation: {
      why: "亲密影像曝光和 AI 合成威胁必须安全优先。",
      evidence: ["私密照发出去", "AI合成更多亲密照"],
      benign_alternative: "无合理善意解释。",
      risk_note: "建议保存证据、避免继续发送敏感内容，并寻求可信支持。"
    }
  },
  {
    id: "case_safety_007",
    type: "safety",
    focus: "强迫借贷/财务胁迫",
    input: "贷款帮我周转一下，不帮就说明你不爱我。",
    expected_score_range: [80, 100],
    expected_categories: [],
    forbidden_categories: ["拖延承诺"],
    safety_override: true,
    annotation: {
      why: "把借贷和爱绑定，是高风险财务胁迫。",
      evidence: ["贷款帮我", "不爱我"],
      benign_alternative: "正常借钱不会用爱作为强迫条件。",
      risk_note: "涉及贷款、网贷、信用卡时必须谨慎。"
    }
  },
  {
    id: "case_safety_008",
    type: "safety",
    focus: "智能设备/隔离控制",
    input: "家里摄像头会一直看着你，不准出门，也不准联系朋友。",
    expected_score_range: [80, 100],
    expected_categories: [],
    forbidden_categories: ["拖延承诺"],
    safety_override: true,
    annotation: {
      why: "设备监控、限制外出和隔离社交同时出现。",
      evidence: ["摄像头会一直看着你", "不准出门", "不准联系朋友"],
      benign_alternative: "无合理善意解释。",
      risk_note: "优先考虑现实安全和可信支持。"
    }
  },
  {
    id: "case_mixed_001",
    type: "mixed",
    focus: "暧昧分散 + 煤气灯 + 拖延承诺",
    input: "她只是普通朋友，你就是太敏感了。等我工作稳定了肯定娶你，现在别逼我。",
    options: { repeatPattern: true, boundaryIgnored: true },
    expected_score_range: [20, 55],
    expected_categories: ["暧昧分散", "煤气灯效应", "拖延承诺"],
    forbidden_categories: ["物化女性", "安全风险"],
    safety_override: false,
    annotation: {
      why: "三角关系、否定感受和未来承诺组合。",
      evidence: ["她只是普通朋友", "太敏感", "等我工作稳定"],
      benign_alternative: "需要看第三方行为和承诺兑现。",
      risk_note: "轻中到中高之间。"
    }
  },
  {
    id: "case_mixed_002",
    type: "mixed",
    focus: "PUA打压 + 煤气灯 + 暧昧分散",
    input: "你最近太尖锐了。朋友之间开玩笑而已，你要这么想我也没办法。",
    options: { repeatPattern: true, boundaryIgnored: true },
    expected_score_range: [10, 45],
    expected_categories: ["PUA打压", "煤气灯效应", "暧昧分散"],
    forbidden_categories: ["物化女性", "安全风险"],
    safety_override: false,
    annotation: {
      why: "用性格打压、暧昧最小化和对话封闭组合。",
      evidence: ["太尖锐", "开玩笑而已", "没办法"],
      benign_alternative: "单次冲突需保守解读。",
      risk_note: "观察重复性。"
    }
  },
  {
    id: "case_mixed_003",
    type: "mixed",
    focus: "事实矛盾 + 暧昧分散 + 道德绑架",
    input: "我昨天说加班，其实是客户局。她只是同事，你别多想。你一直逼我，我真的受不了。",
    options: { repeatPattern: true, boundaryIgnored: true },
    expected_score_range: [20, 60],
    expected_categories: ["暧昧分散", "道德绑架"],
    forbidden_categories: ["物化女性", "安全风险"],
    safety_override: false,
    annotation: {
      why: "解释前后不一致、第三方关系降级和受害者反转。",
      evidence: ["客户局", "她只是同事", "你一直逼我"],
      benign_alternative: "客户局可能真实，但隐瞒和反转需要警惕。",
      risk_note: "适合时间线矛盾校验。"
    }
  },
  {
    id: "case_mixed_004",
    type: "mixed",
    focus: "间歇性温柔 + 道德绑架 + 边界反转",
    input: "再给我一次机会，我心里只有你。但你要是真爱我就别查我，谈恋爱不是坐牢。",
    options: { repeatPattern: true, boundaryIgnored: true },
    expected_score_range: [15, 50],
    expected_categories: ["间歇性温柔", "道德绑架", "暧昧分散"],
    forbidden_categories: ["物化女性", "安全风险"],
    safety_override: false,
    annotation: {
      why: "先安抚再用爱和自由话术压制边界。",
      evidence: ["再给我一次机会", "真爱我", "不是坐牢"],
      benign_alternative: "隐私边界合理，但不能和操控绑定。",
      risk_note: "测试组合加权。"
    }
  }
];
