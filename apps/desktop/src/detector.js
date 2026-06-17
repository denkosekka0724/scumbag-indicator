(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ZhamanDetector = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  const CATEGORIES = [
    {
      id: "pua_devaluation",
      name: "PUA打压",
      max: 12,
      mechanism:
        "通过贬低、比较和羞辱削弱自我评价，让你为了重新获得认可而降低边界。",
      boundary:
        "如果对方不能停止贬低，并把你的不舒服说成开不起玩笑，就按模式处理。",
      patterns: [
        ["除了我.*(没人|谁).*(要|喜欢|受得了)", 5, "孤立式贬低"],
        ["你(这种|这样的).*(女生|女人|人).*(不值|没人要|配不上)", 5, "价值羞辱"],
        ["(太胖|太丑|老了|不值钱|身材不行|脸不行)", 4, "外貌/年龄羞辱"],
        ["(你能不能成熟|成熟一点|别这么幼稚|你太幼稚)", 3, "成熟度打压"],
        ["(太尖锐|以前那个温柔的你|以前你很可爱|现在天天查岗)", 4, "温柔人设打压"],
        ["(你别这么低级|你真的没救了|你现在说话真的很难听|戏剧化)", 4, "人格/表达贬低"],
        ["(装什么|别装|太把自己当回事|谁给你的自信)", 4, "自尊打压"],
        ["(我这是为你好|我是帮你认清自己)", 3, "打压包装成关心"]
      ]
    },
    {
      id: "gaslighting",
      name: "煤气灯效应",
      max: 16,
      mechanism:
        "通过否认事实、重写记忆和标签化你的反应，让你怀疑自己的感受与判断。",
      boundary:
        "保留原始记录，讨论事实而不是证明自己正常；反复否认事实时停止争辩。",
      patterns: [
        ["(我没说过|我什么时候说过|你记错了|你自己脑补|我还能骗你吗)", 5, "否认/改写事实"],
        ["(你想多了|别多想|你.{0,4}太敏感|你太多疑|你疑心病|非要脑补)", 4, "否定感受"],
        ["(你是不是有病|你疯了|你精神.*问题|神经病)", 6, "精神标签"],
        ["(无理取闹|矫情|小题大做|至于吗|上纲上线|阴阳怪气)", 4, "合理质疑病理化"],
        ["(你要.{0,6}这么想.{0,10}没办法|你非要.{0,8}没办法|随便你怎么想|你爱信不信)", 4, "对话封闭"],
        ["(都是你的问题|问题在你|你自己不正常)", 5, "责任反转"]
      ]
    },
    {
      id: "intermittent_affection",
      name: "间歇性温柔",
      max: 13,
      mechanism:
        "在冷淡、伤害或失联后突然高强度示好，用短期甜头重启希望和依赖。",
      boundary:
        "只看可验证行动和持续时间，不用甜言蜜语抵消已经发生的伤害。",
      patterns: [
        ["(再给我一次机会|最后一次.{0,8}(机会|原谅|好不好)|我以后会好好对你)", 4, "复发后的新承诺"],
        ["(我不能没有你|我离不开你|我心里只有你|最爱的还是你)", 4, "高密度安抚"],
        ["(下次一定|以后一定改|我会改)", 3, "无计划修复"],
        ["(你冷静点|冷静几天|你真要这样|你别闹了|我刚才语气不好|我最近压力大)", 4, "离开后的降温挽回"],
        ["(突然.*热情|突然.*温柔|又来找我|消失.*回来)", 4, "冷热循环"],
        ["(冷暴力|失联|不回消息|消失).*(道歉|送礼|哄我)", 5, "伤害后补偿"]
      ]
    },
    {
      id: "ambiguity_distraction",
      name: "暧昧分散",
      max: 11,
      mechanism:
        "用第三方关系定义稀释责任，把焦点从是否越界转成你是否大度。",
      boundary:
        "不要争定义，回到行为边界：频率、内容、隐瞒、是否愿意透明。",
      patterns: [
        ["(她只是|那只是|只是)(普通朋友|朋友|同事|同学|发小|妹妹|网友|前任)", 5, "关系降级"],
        ["(你别多想|别想太多).*(她|人家)", 3, "提前封口"],
        ["(她主动找我|我不好拒绝|工作需要|只是礼貌|客户局|不去不合适)", 4, "被动化叙事"],
        ["(普通朋友).*(每天|深夜|暧昧|单独|约)", 5, "定义与行为冲突"],
        ["(你太小心眼|你不大度|查岗|控制欲|控制我的社交|谈恋爱不是坐牢)", 4, "边界反转"],
        ["(朋友之间开玩笑|游戏里的称呼|她那人就那样|懒得解释|圈子里的人都知道)", 4, "暧昧解释最小化"]
      ]
    },
    {
      id: "moral_coercion",
      name: "道德绑架",
      max: 15,
      mechanism:
        "把边界问题改造成爱不爱、懂不懂事、有没有良心，让你用退让证明自己。",
      boundary:
        "把讨论从道德评价拉回具体行为：我能接受什么，不能接受什么。",
      patterns: [
        ["你要是真(爱|喜欢)我.*(就|不会)", 5, "以爱为条件"],
        ["(你怎么这么不懂事|懂事一点|能不能体谅我)", 4, "义务诱导"],
        ["(我都这样了你还|你还要我怎样|你非要逼我|你一直逼我|我真的受不了)", 5, "受害者反转"],
        ["(别老逼我|不要逼我|别逼我|大度一点|你不大度|喘不过气|压迫感)", 4, "边界要求污名化"],
        ["(你太自私|没良心|忘恩负义|让我失望|别后悔|你会后悔)", 4, "羞耻/内疚诱导"],
        ["(我死给你看|我活不下去|你逼死我)", 7, "自伤威胁"],
        ["(为了你好|都是为你好)", 3, "控制包装成善意"]
      ]
    },
    {
      id: "objectification",
      name: "物化女性",
      max: 14,
      mechanism:
        "把人降成身体、性、服务或面子资源，弱化意愿、人格和边界。",
      boundary:
        "涉及身体、性或服从的羞辱和强迫，不需要用迎合来证明亲密。",
      patterns: [
        ["(女人|女生)就(该|应该|必须)", 4, "性别角色规定"],
        ["(过了.*岁.*不值钱|年龄.*不值钱|没人要的老女人)", 5, "年龄价值羞辱"],
        ["(胸|腿|身材|脸).*(不行|太差|拿不出手|带不出去)", 4, "身体工具化"],
        ["(陪我睡|让我碰|不给碰|性需求|解决需求)", 5, "性资源化"],
        ["(装纯|骚|婊|浪|欲擒故纵)", 5, "性羞辱"],
        ["(女朋友就该照顾|你就该伺候|做饭洗衣是你)", 4, "服务工具化"]
      ]
    },
    {
      id: "commitment_delay",
      name: "拖延承诺",
      max: 9,
      mechanism:
        "用未来条件替代当下行动，享受关系利益但持续推迟责任、定义和计划。",
      boundary:
        "把承诺转成日期、行动和责任；没有行动的未来话术不计入信用。",
      patterns: [
        ["等我.{0,16}(忙完|有钱|稳定|换工作|攒够|买房|我妈同意).{0,16}(就|肯定|一定|再)", 6, "条件式承诺"],
        ["(现在还不是时候|以后再说|再等等|顺其自然)", 4, "时间模糊"],
        ["(我给不了你|我不想负责|我不想被束缚)", 4, "责任回避"],
        ["(别逼我|你越逼我越不想|你老催)", 4, "追问污名化"],
        ["(先这样|保持现状|别定义关系)", 4, "关系悬置"],
        ["(肯定娶你|一定结婚|会给你未来).*(但|等|现在)", 5, "未来支票"]
      ]
    },
    {
      id: "fishing_many",
      name: "钓鱼撒网",
      max: 10,
      mechanism:
        "通过低成本暧昧维持多个选项，让你竞争一个并不明确的位置。",
      boundary:
        "看排他边界和实际投入，而不是看他对每个人都能说的漂亮话。",
      patterns: [
        ["(很多女生|好多女生|同时聊|多线|海王|备胎|另一个女生)", 5, "多对象线索"],
        ["(只是聊天|无聊聊聊|普通网友).*(暧昧|深夜|宝贝|亲爱的)", 5, "低成本暧昧"],
        ["(探探|陌陌|Soul|Tinder|Bumble|约炮)", 4, "外部选项池"],
        ["(改天约|有空找你|下次吧).*(每次|总是|一直)", 4, "面包屑式投喂"],
        ["(忽冷忽热|一会热情一会冷|吊着我|养鱼)", 5, "不稳定控场"],
        ["(你是特别的|只对你这样).*(别人|她们|同时)", 4, "唯一话术冲突"],
        ["(叫你.{0,4}哥哥|叫你.{0,4}阿澈|陪别人打游戏到凌晨|不带女朋友)", 4, "暧昧池线索"]
      ]
    }
  ];

  const SAFETY_PATTERNS = [
    ["(打你|弄死你|杀了你|让你消失)", "暴力威胁"],
    ["(跟踪|定位|监控|查你手机|要你密码|不准出门)", "监控/限制自由"],
    ["(裸照|私密照|偷拍视频).*(发出去|曝光|威胁)", "隐私曝光威胁"],
    ["(发出去|曝光|威胁).{0,16}(裸照|私密照|偷拍视频)", "隐私曝光威胁"],
    ["(强迫|不愿意也|不同意也|硬来|灌醉)", "性胁迫风险"],
    ["(转账|借钱|不给钱就|花呗|贷款).*(证明|爱我|帮我)", "财务控制/胁迫"],
    ["(我死给你看|自杀|活不下去).*(你|分手|离开)", "自伤胁迫"]
  ];

  const RISK_LEVELS = [
    [80, "极高"],
    [60, "高"],
    [40, "中高"],
    [20, "轻中"],
    [0, "低"]
  ];

  const KNOWLEDGE_SOURCES = [
    {
      name: "403条中文亲密关系话术语料",
      kind: "本地语料",
      scope: "用于抽取中文语境下的高频表达模板、8类话术和边界测试。"
    },
    {
      name: "Gaslighting / coercive control 研究",
      kind: "心理与社会学研究",
      scope: "用于解释否认事实、责任反转、让对方怀疑自身判断等机制。"
    },
    {
      name: "成人依恋理论",
      kind: "亲密关系研究",
      scope: "用于理解焦虑、回避、亲密距离和边界需求，不用于给个人贴依恋类型标签。"
    },
    {
      name: "暗黑三角人格研究",
      kind: "人格心理学",
      scope: "用于理解操控、低共情、短期关系倾向等风险线索，不用于人格障碍诊断。"
    }
  ];

  const EXPLANATION_COPY = {
    pua_devaluation: {
      default:
        "这句话把对方的价值、表达或外貌变成评价对象，容易让讨论从具体问题滑向“你不够好”。",
      byLabel: {
        孤立式贬低: "“除了我没人……”把认可来源收窄到说话者身上，是典型的孤立式贬低。",
        价值羞辱: "这类说法直接攻击人的价值，而不是讨论某个具体行为。",
        "外貌/年龄羞辱": "把身体或年龄当成筹码，会削弱自尊和边界感。",
        成熟度打压: "用“成熟/幼稚”给对方贴标签，容易把合理诉求变成性格缺陷。",
        温柔人设打压: "用“以前的你”压制当下不满，本质是在要求对方回到更顺从的位置。",
        "人格/表达贬低": "评价对方“低级、没救、难听”会让事实讨论变成人格攻击。",
        自尊打压: "这类话把自我表达说成自大，容易制造羞耻感。",
        打压包装成关心: "“为你好”如果伴随羞辱，就不是支持，而是控制表达方式。"
      },
      benign: "也可能是情绪化、笨拙或冲突中的失言；关键看是否道歉、停止、修复。",
      missing: "需要看这类评价是否反复出现，以及你表达不舒服后对方是否停止。",
      advice: "不要急着证明自己“没问题”，先把话题拉回具体行为和可接受边界。"
    },
    gaslighting: {
      default:
        "这句话在削弱你的感受、记忆或事实陈述，让焦点从原始问题转向你是否正常。",
      byLabel: {
        "否认/改写事实": "它直接否认或改写已经发生的事，会让讨论变成你要证明自己没记错。",
        否定感受: "“别多想/太敏感”没有回应事实，只是在压低你的感受可信度。",
        精神标签: "把质疑说成精神问题，是高风险的羞辱和控制信号。",
        合理质疑病理化: "它没有解释事实，而是把追问本身说成小题大做。",
        对话封闭: "“随你怎么想/没办法”会切断核对事实的空间。",
        责任反转: "把问题直接归到你身上，回避了原始行为是否合理。"
      },
      benign: "也可能是双方记忆不一致或误会；但健康回应通常会愿意核对事实。",
      missing: "需要原始记录、时间线、第三方证据，尤其是对方是否持续否认可核对事实。",
      advice: "保留原始记录，讨论具体事实；如果对方持续让你自证正常，可以暂停争辩。"
    },
    intermittent_affection: {
      default:
        "这句话在冲突、冷淡或离开信号后提供安抚，但暂时没有看到可验证的修复动作。",
      byLabel: {
        复发后的新承诺: "“再给一次机会/以后好好对你”如果没有具体计划，容易重启旧循环。",
        高密度安抚: "高强度表白能缓解焦虑，但不能自动抵消之前的伤害。",
        无计划修复: "“会改/一定改”缺少时间、动作和责任人，执行性弱。",
        离开后的降温挽回: "在你要离开时突然放软，可能是在阻止后果发生。",
        冷热循环: "冷热切换会让人更想抓住偶尔的温柔。",
        伤害后补偿: "补偿本身不是问题，关键是伤害模式是否停止。"
      },
      benign: "真诚修复也会表达歉意和爱意；区别在于是否有持续行动。",
      missing: "需要看此前是否有冷淡/失联/伤害，以及之后有没有稳定改变。",
      advice: "把安抚转成可验证计划：做什么、从什么时候开始、如何确认。"
    },
    ambiguity_distraction: {
      default:
        "这句话在重新定义第三方关系，重点要看定义是否和实际行为一致。",
      byLabel: {
        关系降级: "“只是普通朋友”是定义，不是证据；还要看聊天频率、内容和是否隐瞒。",
        提前封口: "“别多想”会提前把你的疑问放进错误位置。",
        被动化叙事: "“不好拒绝/工作需要”把主动选择包装成外部压力。",
        定义与行为冲突: "当普通朋友定义和深夜、暧昧、单独等行为冲突时，风险升高。",
        边界反转: "把边界要求说成控制，会让你不敢再谈可接受范围。",
        暧昧解释最小化: "用玩笑、性格、懒得解释来降低问题严重性。"
      },
      benign: "确实可能存在正常异性友谊或工作关系；关键不是身份定义，而是行为边界。",
      missing: "需要补充联系频率、聊天内容、是否隐瞒、你提出边界后的回应。",
      advice: "不要争“她算什么”，只谈行为：频率、内容、透明度和双方边界。"
    },
    moral_coercion: {
      default:
        "这句话把具体边界问题改写成爱、懂事、体谅或亏欠，容易诱导你用退让证明自己。",
      byLabel: {
        以爱为条件: "“真爱就……”把爱变成服从测试。",
        义务诱导: "“懂事/体谅”可能把对方的责任转移成你的义务。",
        受害者反转: "把被质疑者变成受害者，会让原始问题失焦。",
        边界要求污名化: "把边界说成逼迫或压迫，会让你不敢继续表达不舒服。",
        "羞耻/内疚诱导": "用后悔、没良心、失望制造内疚，推动你让步。",
        自伤威胁: "用自伤威胁绑定关系属于安全风险，应优先求助和保存证据。",
        控制包装成善意: "“为你好”如果取消了你的选择权，就需要警惕。"
      },
      benign: "真实压力和脆弱可以表达，但不应要求你牺牲边界来证明爱。",
      missing: "需要看对方是否愿意回到具体问题，还是持续用内疚和道德评价压你。",
      advice: "把话题从“我够不够好”拉回“这个行为我能否接受”。"
    },
    objectification: {
      default:
        "这句话把人简化为身体、性、服务或面子资源，忽略了意愿和人格。",
      byLabel: {
        性别角色规定: "用“女人/女生就该”规定角色，会压缩个人选择。",
        年龄价值羞辱: "把年龄和价值绑定，是身体价值化的表达。",
        身体工具化: "用外貌是否“拿得出手”评价伴侣，是面子资源化。",
        性资源化: "把亲密关系等同于性可得性，会侵蚀同意边界。",
        性羞辱: "性羞辱会制造羞耻和控制。",
        服务工具化: "把照顾、家务、服从当成默认义务，是服务工具化。"
      },
      benign: "健康的偏好表达应尊重对方意愿，不应羞辱、强迫或默认义务。",
      missing: "需要看是否有强迫、羞辱、报复、金钱或隐私胁迫。",
      advice: "涉及身体、性和服从时，优先确认同意、边界和安全。"
    },
    commitment_delay: {
      default:
        "这句话把承诺推到未来条件上，但当前缺少可验证行动。",
      byLabel: {
        条件式承诺: "“等我……就……”把责任放在不确定条件之后。",
        时间模糊: "没有明确时间表时，关系容易长期悬置。",
        责任回避: "直接表达给不了或不想负责，需要按现实而非期待判断。",
        追问污名化: "把追问说成催或逼，会让承诺无法被检验。",
        关系悬置: "保持现状可能让一方享受关系利益，另一方承担不确定性。",
        未来支票: "“一定结婚/给未来”如果接着“但是/等/现在”，执行性很弱。"
      },
      benign: "现实条件确实会影响承诺；区别在于是否能给出具体计划和当前行动。",
      missing: "需要补充时间表、已完成行动、责任分工，以及拖延持续多久。",
      advice: "把未来话术翻译成日期、动作和责任；没有行动就不要按承诺计入信用。"
    },
    fishing_many: {
      default:
        "这句话或情节显示低成本暧昧、多对象线索或不稳定投喂。",
      byLabel: {
        多对象线索: "多线或备胎线索会削弱排他性和稳定投入。",
        低成本暧昧: "深夜、亲昵称呼和“只是聊天”组合时，关系边界容易模糊。",
        外部选项池: "持续使用约会/暧昧平台会保留外部选项。",
        面包屑式投喂: "总说改天但不兑现，是低成本维持期待。",
        不稳定控场: "忽冷忽热会让人追逐少量回应。",
        唯一话术冲突: "“只对你这样”如果和多对象行为冲突，要看行为而不是话。",
        暧昧池线索: "亲昵称呼、深夜游戏、不公开伴侣等线索需要结合频率判断。"
      },
      benign: "单条线索不能证明多线关系；需要看持续性、排他边界和透明度。",
      missing: "需要补充是否公开关系、是否同时暧昧、是否愿意停止越界行为。",
      advice: "看排他边界和实际投入，不看任何人都能收到的漂亮话。"
    }
  };

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function normalizeText(text) {
    return String(text || "")
      .replace(/\r/g, "")
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .trim();
  }

  function findSnippet(text, index, matchText) {
    const start = Math.max(0, index - 28);
    const end = Math.min(text.length, index + matchText.length + 28);
    let snippet = text.slice(start, end).replace(/\s+/g, " ").trim();
    if (start > 0) snippet = "..." + snippet;
    if (end < text.length) snippet = snippet + "...";
    return snippet;
  }

  function createRegex(source) {
    return new RegExp(source, "gi");
  }

  function uniqueEvidence(evidence) {
    const seen = new Set();
    return evidence.filter((item) => {
      const key = `${item.category}:${item.quote}:${item.label}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function explainEvidence(category, label) {
    const copy = EXPLANATION_COPY[category.id] || {};
    return {
      why_it_matches: copy.byLabel?.[label] || copy.default || category.mechanism,
      possible_benign_explanation:
        copy.benign ||
        "单句可能来自误会、情绪表达或上下文缺失；需要看频率、是否被指出后仍持续、是否有行动修复。",
      needed_context:
        copy.missing || "需要补充前后文、重复性、对方被指出后的回应，以及是否存在可验证行动。",
      next_step: copy.advice || category.boundary
    };
  }

  function scoreCategory(category, text) {
    const evidence = [];
    let rawScore = 0;

    category.patterns.forEach(([source, weight, label]) => {
      const regex = createRegex(source);
      let match;
      let localHits = 0;
      while ((match = regex.exec(text)) !== null) {
        localHits += 1;
        rawScore += weight;
        const explanation = explainEvidence(category, label);
        evidence.push({
          category: category.name,
          categoryId: category.id,
          quote: findSnippet(text, match.index, match[0]),
          matched: match[0],
          label,
          evidence_level: match[0].length >= 4 ? "A" : "B",
          why_it_matches: explanation.why_it_matches,
          mechanism: category.mechanism,
          boundary_test: category.boundary,
          possible_benign_explanation: explanation.possible_benign_explanation,
          needed_context: explanation.needed_context,
          next_step: explanation.next_step
        });
        if (localHits >= 4) break;
      }
    });

    const deduped = uniqueEvidence(evidence);
    const repeatBonus = deduped.length >= 3 ? 2 : 0;
    const score = Math.min(category.max, rawScore + repeatBonus);

    return {
      category: category.name,
      categoryId: category.id,
      score,
      max_score: category.max,
      hit: score > 0,
      mechanism: category.mechanism,
      boundary_test: category.boundary,
      evidence: deduped.slice(0, 5)
    };
  }

  function detectSafety(text) {
    const alerts = [];
    SAFETY_PATTERNS.forEach(([source, label]) => {
      const regex = createRegex(source);
      let match;
      while ((match = regex.exec(text)) !== null) {
        alerts.push({
          label,
          quote: findSnippet(text, match.index, match[0]),
          matched: match[0]
        });
      }
    });
    return uniqueEvidence(
      alerts.map((item) => ({
        category: "安全风险",
        quote: item.quote,
        label: item.label
      }))
    ).map((item) => ({ label: item.label, quote: item.quote }));
  }

  function getRiskLevel(score, safetyOverride) {
    if (safetyOverride) return "安全优先";
    return RISK_LEVELS.find(([threshold]) => score >= threshold)[1];
  }

  function parseMessageTimestamp(value) {
    const normalized = String(value || "")
      .replace(/[年月]/g, "-")
      .replace(/[日]/g, "")
      .replace(/\./g, "-")
      .trim();
    const timestamp = Date.parse(normalized);
    return Number.isNaN(timestamp) ? null : timestamp;
  }

  function normalizeMessages(options) {
    const messages = options.messages || options.importMeta?.messages || [];
    return Array.isArray(messages)
      ? messages
          .map((message) => ({
            time: String(message.time || "").trim(),
            sender: String(message.sender || "").trim(),
            content: String(message.content || "").trim(),
            timestamp: parseMessageTimestamp(message.time)
          }))
          .filter((message) => message.content)
      : [];
  }

  function summarizeParticipants(messages) {
    const counts = new Map();
    messages.forEach((message) => {
      const name = message.sender || "未知";
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh-Hans-CN"))
      .slice(0, 6);
  }

  function detectContradictionSignals(text) {
    const signals = [
      {
        label: "忙/加班叙事与可见社交行为冲突",
        pattern: "(说|他说|她说)?.{0,8}(忙|加班|客户局|没空).{0,40}(朋友圈|点赞|酒吧|游戏|合照|别人照片)"
      },
      {
        label: "承诺公开与隐藏/屏蔽冲突",
        pattern: "(公开|女朋友|见朋友|带我).{0,40}(藏|屏蔽|不叫我|不带我|别人朋友圈)"
      },
      {
        label: "关系定义与暧昧称呼/行为冲突",
        pattern: "(只是朋友|普通朋友|朋友之间).{0,50}(哥哥|宝贝|亲爱的|阿澈|凌晨|单独|下次别带女朋友)"
      },
      {
        label: "隐私规则前后变化",
        pattern: "(以前|之前).{0,25}(没什么不能看|能看|透明).{0,50}(改密码|隐私|空间|不能看)"
      },
      {
        label: "分手威胁与挽回降温切换",
        pattern: "(分手|随便你|以后别来找我).{0,60}(别闹|冷静|压力大|语气不好|真要这样)"
      }
    ];

    return signals
      .map((signal) => {
        const regex = createRegex(signal.pattern);
        const match = regex.exec(text);
        if (!match) return null;
        return {
          label: signal.label,
          quote: findSnippet(text, match.index, match[0])
        };
      })
      .filter(Boolean);
  }

  function detectMessageGaps(messages) {
    const dated = messages
      .filter((message) => message.timestamp !== null)
      .sort((a, b) => a.timestamp - b.timestamp);
    const gaps = [];
    for (let index = 1; index < dated.length; index += 1) {
      const gapHours = (dated[index].timestamp - dated[index - 1].timestamp) / 3600000;
      if (gapHours >= 6) {
        gaps.push({
          hours: Number(gapHours.toFixed(1)),
          from: [dated[index - 1].time, dated[index - 1].sender].filter(Boolean).join(" "),
          to: [dated[index].time, dated[index].sender].filter(Boolean).join(" ")
        });
      }
    }
    return gaps.slice(0, 5);
  }

  function buildTimelineAnalysis(text, messages, categoryScores, allEvidence) {
    const dated = messages.filter((message) => message.timestamp !== null).sort((a, b) => a.timestamp - b.timestamp);
    const repeatedCategoryHits = categoryScores
      .filter((item) => item.evidence.length >= 2 || item.score >= Math.ceil(item.max_score * 0.5))
      .map((item) => ({
        category: item.category,
        evidence_count: item.evidence.length,
        score: item.score
      }));
    const strongestByCategory = {};
    allEvidence.forEach((evidence) => {
      if (!strongestByCategory[evidence.category]) {
        strongestByCategory[evidence.category] = evidence.quote;
      }
    });

    return {
      message_count: messages.length,
      participant_count: summarizeParticipants(messages).length,
      top_participants: summarizeParticipants(messages),
      date_range:
        dated.length >= 2
          ? {
              from: dated[0].time,
              to: dated[dated.length - 1].time
            }
          : null,
      repeated_category_hits: repeatedCategoryHits,
      contradiction_signals: detectContradictionSignals(text),
      long_response_gaps: detectMessageGaps(messages),
      strongest_evidence_by_category: strongestByCategory
    };
  }

  function applyModifiers(baseScore, categoryScores, options, safetyAlerts, text, timelineAnalysis) {
    let score = baseScore;
    const modifiers = [];

    const combo = ["煤气灯效应", "道德绑架", "间歇性温柔"].every((name) =>
      categoryScores.some((item) => item.category === name && item.score > 0)
    );
    if (combo) {
      score += 5;
      modifiers.push("煤气灯 + 道德绑架 + 间歇性温柔组合：+5");
    }

    const shortText = text.replace(/\s+/g, "").length < 35;
    if (shortText && !safetyAlerts.length && score > 39) {
      score = 39;
      modifiers.push("文本很短且无安全风险，风险等级封顶为轻中");
    }

    if (safetyAlerts.length) {
      score = Math.max(score, 80);
      modifiers.push("命中安全覆盖规则，最低按极高风险处理");
    }

    if (timelineAnalysis?.contradiction_signals?.length >= 2) {
      score += 4;
      modifiers.push("时间线中出现多处事实矛盾信号：+4");
    }

    if (timelineAnalysis?.repeated_category_hits?.length >= 3) {
      score += 3;
      modifiers.push("多类话术在导入消息中重复出现：+3");
    }

    if (timelineAnalysis?.message_count >= 30 && categoryScores.filter((item) => item.hit).length >= 5) {
      score += 2;
      modifiers.push("长聊天记录中跨多类稳定命中：+2");
    }

    return {
      score: Math.max(0, Math.min(100, Math.round(score))),
      modifiers
    };
  }

  function buildBackgroundNotes(options, timelineAnalysis) {
    const notes = [];
    if (options.relationshipDuration) {
      notes.push({
        type: "relationship_duration",
        label: "关系时长",
        text: "仅用于阶段提示，不直接加分；目前不是临床量表或验证权重。"
      });
    }
    if (options.repeatPattern) {
      notes.push({
        type: "repeat_pattern",
        label: "反复发生",
        text: "作为背景增强可信度，不单独当作操控证据；需要聊天时间线或多次案例支持。"
      });
    }
    if (options.boundaryIgnored) {
      notes.push({
        type: "boundary_ignored",
        label: "边界被忽视",
        text: "作为背景增强可信度，不直接加分；关键仍是对方是否回应具体边界。"
      });
    }
    if (timelineAnalysis?.contradiction_signals?.length) {
      notes.push({
        type: "timeline_contradiction",
        label: "时间线矛盾",
        text: "由导入文本自动识别，比手动勾选更接近证据。"
      });
    }
    return notes;
  }

  function computeConfidence(text, evidenceCount, categoryHitCount, safetyAlerts, backgroundNotes = []) {
    const lengthFactor = Math.min(0.25, text.replace(/\s+/g, "").length / 1200);
    const evidenceFactor = Math.min(0.45, evidenceCount * 0.045);
    const spreadFactor = Math.min(0.2, categoryHitCount * 0.035);
    const safetyFactor = safetyAlerts.length ? 0.08 : 0;
    const contextFactor = Math.min(0.06, backgroundNotes.length * 0.02);
    return Math.min(
      0.95,
      Number((0.18 + lengthFactor + evidenceFactor + spreadFactor + safetyFactor + contextFactor).toFixed(2))
    );
  }

  function makeAdvice(result) {
    const hitItems = result.category_scores.filter((item) => item.hit).sort((a, b) => b.score - a.score);
    const hitNames = hitItems.map((item) => item.category);
    const firstEvidenceByCategory = new Map();
    result.strongest_evidence.forEach((item) => {
      if (!firstEvidenceByCategory.has(item.category)) firstEvidenceByCategory.set(item.category, item);
    });

    const advice = {
      observe: [],
      communicate: [],
      protect_boundaries: [],
      consider_stop_loss_if: [],
      safety_resources_note: ""
    };

    hitItems.slice(0, 4).forEach((item) => {
      const evidence = firstEvidenceByCategory.get(item.category);
      if (evidence) {
        advice.observe.push(`${item.category}：复核“${evidence.matched}”前后的两三句，确认这是不是稳定模式。`);
        advice.communicate.push(evidence.next_step);
      } else {
        advice.observe.push(`${item.category}：继续补充前后文，避免只凭单句下判断。`);
      }
    });

    if (!hitNames.length) {
      advice.observe.push("目前没有明确话术命中；可以补充更长对话、时间线和你认为不舒服的具体句子。");
      advice.communicate.push("先描述具体感受和需求，不急着给对方贴标签。");
    }

    if (result.background_notes.some((item) => item.type === "repeat_pattern")) {
      advice.observe.push("你标注了反复发生，建议把每次发生的日期、触发点和后续修复单独列出来。");
    }
    if (result.background_notes.some((item) => item.type === "boundary_ignored")) {
      advice.consider_stop_loss_if.push("你明确表达不舒服后，对方仍重复同一行为并拒绝讨论具体边界。");
    }
    if (result.timeline_analysis?.contradiction_signals?.length) {
      advice.protect_boundaries.push("时间线里已有事实矛盾信号，优先保存原始记录，不在争吵中反复自证。");
    }

    if (hitNames.includes("煤气灯效应")) {
      advice.protect_boundaries.push("遇到“你太敏感/你记错了”时，先核对事实记录，再决定是否继续沟通。");
    }
    if (hitNames.includes("间歇性温柔")) {
      advice.consider_stop_loss_if.push("每次冲突后都有安抚，但没有持续行动或复盘机制。");
    }
    if (hitNames.includes("拖延承诺")) {
      advice.consider_stop_loss_if.push("承诺长期停留在“以后/等我”，没有日期、行动和责任分工。");
    }
    if (hitNames.includes("暧昧分散") || hitNames.includes("钓鱼撒网")) {
      advice.consider_stop_loss_if.push("第三方或多对象边界无法说清，且对方把你的边界要求说成控制。");
    }
    if (hitNames.includes("物化女性")) {
      advice.protect_boundaries.push("涉及身体、性、金钱、隐私和定位权限时，默认需要明确同意。");
    }

    if (!advice.protect_boundaries.length) {
      advice.protect_boundaries.push("保留关键聊天记录，避免在情绪高点做重大承诺、转账或共享敏感权限。");
    }
    if (!advice.consider_stop_loss_if.length) {
      advice.consider_stop_loss_if.push("同一问题被清楚指出后仍持续出现，且没有可验证修复。");
    }

    if (result.safety_override) {
      advice.safety_resources_note =
        "文本出现安全风险信号。优先联系可信任的人，保存证据；如果有人身危险，请使用本地紧急服务或专业反家暴支持。";
    }

    Object.keys(advice).forEach((key) => {
      if (Array.isArray(advice[key])) {
        advice[key] = [...new Set(advice[key])].slice(0, 5);
      }
    });

    return advice;
  }

  function summarize(score, riskLevel, hitNames) {
    if (!hitNames.length) {
      return "目前没有足够证据支持操控性话术判断。";
    }
    if (riskLevel === "安全优先") {
      return "文本中出现安全风险信号，分数之外更重要的是保护人身、隐私和证据。";
    }
    const top = hitNames.slice(0, 3).join("、");
    return `主要风险集中在${top}；建议先看重复性和边界回应。`;
  }

  function analyze(input, options = {}) {
    const text = normalizeText(input);
    const messages = normalizeMessages(options);
    const category_scores = CATEGORIES.map((category) => scoreCategory(category, text));
    const allEvidence = category_scores.flatMap((item) => item.evidence);
    const safetyAlerts = detectSafety(text);
    const baseScore = category_scores.reduce((sum, item) => sum + item.score, 0);
    const timelineAnalysis = buildTimelineAnalysis(text, messages, category_scores, allEvidence);
    const modified = applyModifiers(baseScore, category_scores, options, safetyAlerts, text, timelineAnalysis);
    const hitNames = category_scores.filter((item) => item.hit).map((item) => item.category);
    const riskLevel = getRiskLevel(modified.score, safetyAlerts.length > 0);
    const backgroundNotes = buildBackgroundNotes(options, timelineAnalysis);
    const confidence = computeConfidence(text, allEvidence.length, hitNames.length, safetyAlerts, backgroundNotes);

    const result = {
      score: modified.score,
      risk_level: riskLevel,
      confidence,
      safety_override: safetyAlerts.length > 0,
      safety_alerts: safetyAlerts,
      one_sentence_summary: summarize(modified.score, riskLevel, hitNames),
      category_scores,
      strongest_evidence: allEvidence
        .slice()
        .sort((a, b) => b.matched.length - a.matched.length)
        .slice(0, 8),
      missing_context: buildMissingContext(text, allEvidence.length),
      modifiers: modified.modifiers,
      background_notes: backgroundNotes,
      knowledge_sources: KNOWLEDGE_SOURCES,
      pattern_reading: {
        relationship_stage_if_inferable: inferStage(options.relationshipDuration, category_scores),
        main_mechanisms: hitNames,
        repeat_or_single_incident: options.repeatPattern
          ? "用户标注为反复模式；该项只影响背景解释和置信度，不直接加分。"
          : "未标注重复性，需要继续观察。"
      },
      timeline_analysis: timelineAnalysis,
      advice: null,
      non_diagnostic_disclaimer:
        "当前版本是纯 Beta 测试阶段的玩具项目，分析结果不带有任何参考价值；它不是人格障碍诊断、法律结论、心理治疗建议，也不应作为现实行动依据。"
    };
    result.advice = makeAdvice(result);
    return result;
  }

  function buildMissingContext(text, evidenceCount) {
    const missing = [];
    if (!text) missing.push("缺少聊天记录或经历文本。");
    if (text && text.length < 80) missing.push("文本较短，最好补充前后文和是否反复发生。");
    if (evidenceCount > 0) {
      missing.push("需要结合行为是否兑现、是否被指出后仍继续、是否存在安全风险。");
    }
    return missing;
  }

  function inferStage(duration, categoryScores) {
    if (duration === "early") return "早期/热恋期，需要区分真诚投入与过快推进。";
    if (duration === "cooling") return "冷却期，重点看失联、借口和承诺是否开始增多。";
    if (duration === "testing") return "试探期，重点看第三方、撒谎和边界反转。";
    if (duration === "long") return "长期关系，若煤气灯和道德绑架反复出现，风险显著升高。";
    const hit = categoryScores.filter((item) => item.hit).map((item) => item.category);
    if (hit.includes("暧昧分散")) return "可能处在试探/三角关系稀释阶段。";
    if (hit.includes("拖延承诺")) return "可能处在关系悬置或承诺拖延期。";
    return "上下文不足，暂不推断阶段。";
  }

  function generateMarkdownReport(result) {
    const lines = [];
    lines.push(`## 结论`);
    lines.push("");
    lines.push(`渣男指数：${result.score}/100（${result.risk_level}，置信度 ${result.confidence}）`);
    lines.push("");
    lines.push(result.one_sentence_summary);
    lines.push("");
    if (result.safety_override) {
      lines.push(`安全提示：${result.advice.safety_resources_note}`);
      lines.push("");
    }
    if (result.background_notes?.length) {
      lines.push("## 背景说明");
      lines.push("");
      result.background_notes.forEach((item) => {
        lines.push(`- ${item.label}：${item.text}`);
      });
      lines.push("");
    }
    if (result.timeline_analysis?.message_count) {
      lines.push("## 时间线概览");
      lines.push("");
      lines.push(`导入消息：${result.timeline_analysis.message_count} 条`);
      if (result.timeline_analysis.date_range) {
        lines.push(`时间范围：${result.timeline_analysis.date_range.from} 至 ${result.timeline_analysis.date_range.to}`);
      }
      if (result.timeline_analysis.top_participants.length) {
        lines.push(
          `主要参与者：${result.timeline_analysis.top_participants
            .map((item) => `${item.name}(${item.count})`)
            .join("、")}`
        );
      }
      result.timeline_analysis.contradiction_signals.forEach((signal) => {
        lines.push(`- ${signal.label}：“${signal.quote}”`);
      });
      lines.push("");
    }
    lines.push("## 命中的话术");
    lines.push("");
    result.category_scores
      .filter((item) => item.hit)
      .forEach((item) => {
        lines.push(`### ${item.category}：${item.score}/${item.max_score}`);
        lines.push("");
        lines.push(item.mechanism);
        lines.push("");
        item.evidence.forEach((evidence) => {
          lines.push(`- “${evidence.quote}”`);
          lines.push(`  - 为什么命中：${evidence.why_it_matches}`);
          lines.push(`  - 也可能是：${evidence.possible_benign_explanation}`);
          lines.push(`  - 还需要看：${evidence.needed_context}`);
        });
        lines.push("");
      });
    if (!result.category_scores.some((item) => item.hit)) {
      lines.push("暂无明确命中。");
      lines.push("");
    }
    lines.push("## 建议");
    lines.push("");
    [
      ["观察", result.advice.observe],
      ["沟通边界", result.advice.communicate],
      ["保护自己", result.advice.protect_boundaries],
      ["止损条件", result.advice.consider_stop_loss_if]
    ].forEach(([title, items]) => {
      lines.push(`### ${title}`);
      items.forEach((item) => {
        lines.push(`- ${item}`);
      });
      lines.push("");
    });
    lines.push("## 依据与边界");
    lines.push("");
    result.knowledge_sources.forEach((item) => {
      lines.push(`- ${item.name}（${item.kind}）：${item.scope}`);
    });
    lines.push("");
    lines.push(result.non_diagnostic_disclaimer);
    return lines.join("\n");
  }

  return {
    CATEGORIES,
    analyze,
    generateMarkdownReport
  };
});
