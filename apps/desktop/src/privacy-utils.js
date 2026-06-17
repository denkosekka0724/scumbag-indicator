(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ZhamanPrivacyUtils = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  const TYPE_LABELS = {
    phone: "手机号",
    landline: "座机号",
    id_card: "身份证号",
    email: "邮箱",
    wechat: "微信号",
    qq: "QQ号",
    address: "地址",
    organization: "机构",
    participant: "参与者"
  };

  const REJECTED_ALIASES = new Set([
    "系统",
    "系统消息",
    "未知",
    "对方",
    "自己",
    "别人",
    "朋友",
    "客户",
    "同事",
    "我",
    "你",
    "他",
    "她",
    "它"
  ]);

  const RULES = [
    {
      type: "phone",
      label: TYPE_LABELS.phone,
      pattern: /(^|[^\dA-Za-z])((?:\+?86[-\s]?)?1[3-9]\d{9})(?![\dA-Za-z])/g,
      prefixIndex: 1,
      valueIndex: 2
    },
    {
      type: "landline",
      label: TYPE_LABELS.landline,
      pattern: /(^|[^\d])((?:0\d{2,3}[-\s]?\d{7,8}))(?!\d)/g,
      prefixIndex: 1,
      valueIndex: 2
    },
    {
      type: "id_card",
      label: TYPE_LABELS.id_card,
      pattern:
        /(^|[^\d])(\d{6}(?:18|19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dXx])(?!\d)/g,
      prefixIndex: 1,
      valueIndex: 2
    },
    {
      type: "email",
      label: TYPE_LABELS.email,
      pattern: /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g,
      valueIndex: 1
    },
    {
      type: "wechat",
      label: TYPE_LABELS.wechat,
      pattern: /((?:微信号?|wechat|WeChat|wx|WX)[:：\s]*)([A-Za-z][-_A-Za-z0-9]{5,19})/g,
      prefixIndex: 1,
      valueIndex: 2
    },
    {
      type: "qq",
      label: TYPE_LABELS.qq,
      pattern: /((?:QQ|qq|Q号|企鹅号)[:：\s]*)([1-9]\d{4,11})(?!\d)/g,
      prefixIndex: 1,
      valueIndex: 2
    },
    {
      type: "address",
      label: TYPE_LABELS.address,
      pattern:
        /((?:地址|住址|家庭住址|公司地址|学校地址|住在)[:：\s]*)([\u4e00-\u9fa5]{2,}(?:省|市|区|县)[\u4e00-\u9fa50-9A-Za-z\-弄号楼栋单元室路街巷小区花园公寓广场大厦写字楼]{4,})/g,
      prefixIndex: 1,
      valueIndex: 2
    },
    {
      type: "address",
      label: TYPE_LABELS.address,
      pattern:
        /(^|[^\u4e00-\u9fa5A-Za-z0-9])((?:[\u4e00-\u9fa5]{2,}(?:省|市|区|县)){1,2}[\u4e00-\u9fa50-9A-Za-z\-弄号楼栋单元室路街巷小区花园公寓广场大厦写字楼]{4,}(?:号|室|栋|楼|小区|公寓|大厦|广场))(?![\u4e00-\u9fa5A-Za-z0-9])/g,
      prefixIndex: 1,
      valueIndex: 2
    },
    {
      type: "organization",
      label: TYPE_LABELS.organization,
      pattern: /((?:公司|单位|学校|医院)[:：\s]*)([\u4e00-\u9fa5A-Za-z0-9]{2,}(?:公司|集团|大学|学院|学校|医院|中心|研究院))/g,
      prefixIndex: 1,
      valueIndex: 2
    },
    {
      type: "organization",
      label: TYPE_LABELS.organization,
      pattern:
        /(^|[^\u4e00-\u9fa5A-Za-z0-9])([\u4e00-\u9fa5A-Za-z0-9]{2,}(?:有限公司|集团|大学|学院|学校|医院|研究院))(?![\u4e00-\u9fa5A-Za-z0-9])/g,
      prefixIndex: 1,
      valueIndex: 2
    }
  ];

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function normalizeText(value) {
    return String(value || "");
  }

  function createState() {
    return {
      keyToReplacement: new Map(),
      groups: new Map(),
      typeCounters: Object.create(null)
    };
  }

  function getReplacement(type, label, value, state) {
    const key = `${type}\u0000${value}`;
    if (!state.keyToReplacement.has(key)) {
      const nextIndex = (state.typeCounters[type] || 0) + 1;
      state.typeCounters[type] = nextIndex;
      state.keyToReplacement.set(key, `[${label}${nextIndex}]`);
    }

    const replacement = state.keyToReplacement.get(key);
    if (!state.groups.has(type)) {
      state.groups.set(type, {
        type,
        label,
        count: 0,
        replacements: new Set()
      });
    }

    const group = state.groups.get(type);
    group.count += 1;
    group.replacements.add(replacement);
    return replacement;
  }

  function applyRule(text, rule, state) {
    return text.replace(rule.pattern, (...args) => {
      const match = args[0];
      const value = args[rule.valueIndex ?? 0];
      if (!value) return match;
      const replacement = getReplacement(rule.type, rule.label, value, state);
      if (rule.prefixIndex) {
        return `${args[rule.prefixIndex] || ""}${replacement}`;
      }
      return replacement;
    });
  }

  function isUsefulAlias(value) {
    const alias = normalizeText(value).trim();
    if (alias.length < 2 || alias.length > 24) return false;
    if (REJECTED_ALIASES.has(alias)) return false;
    if (/^\d+$/.test(alias)) return false;
    if (/^[\s"'“”‘’.,，。!?！？:：;；()[\]{}<>《》]+$/.test(alias)) return false;
    return true;
  }

  function addAlias(target, value) {
    const alias = normalizeText(value).trim();
    if (isUsefulAlias(alias)) target.add(alias);
  }

  function buildAliases(options = {}) {
    const aliases = new Set();
    const meta = options.importMeta || {};
    const providedAliases = Array.isArray(options.aliases) ? options.aliases : [];

    providedAliases.forEach((item) => addAlias(aliases, item));

    if (Array.isArray(meta.participants)) {
      meta.participants.forEach((item) => addAlias(aliases, typeof item === "string" ? item : item?.name));
    }

    if (Array.isArray(meta.messages)) {
      meta.messages.forEach((item) => addAlias(aliases, item?.sender));
    }

    extractStructuredAliases(options.senderSource).forEach((item) => addAlias(aliases, item));

    return Array.from(aliases).sort((left, right) => right.length - left.length);
  }

  function extractStructuredAliases(source) {
    const aliases = new Set();
    normalizeText(source)
      .split(/\r?\n/)
      .slice(0, 1200)
      .forEach((line) => {
        const value = line.trim();
        const timestampMatch = value.match(
          /^(?:\d{4}[-/]\d{1,2}[-/]\d{1,2})(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?\s+([^\s:：]{2,16})(?:\s+|$)/
        );
        if (timestampMatch) {
          addAlias(aliases, timestampMatch[1]);
          return;
        }

        const colonMatch = value.match(/^([\u4e00-\u9fa5A-Za-z][\u4e00-\u9fa5A-Za-z0-9_\- ]{1,15})[:：]\s+/);
        if (colonMatch) addAlias(aliases, colonMatch[1].trim());
      });
    return Array.from(aliases);
  }

  function applyAliases(text, aliases, state) {
    let redacted = text;
    aliases.forEach((alias) => {
      const pattern = new RegExp(escapeRegExp(alias), "g");
      redacted = redacted.replace(pattern, () => getReplacement("participant", TYPE_LABELS.participant, alias, state));
    });
    return redacted;
  }

  function makeSummary(state) {
    const findings = Array.from(state.groups.values()).map((group) => ({
      type: group.type,
      label: group.label,
      count: group.count,
      replacements: Array.from(group.replacements)
    }));
    const byType = findings.reduce((acc, item) => {
      acc[item.type] = item.count;
      return acc;
    }, {});
    const total = findings.reduce((sum, item) => sum + item.count, 0);
    return {
      findings,
      summary: {
        total,
        byType
      }
    };
  }

  function redactText(value, options = {}) {
    const state = createState();
    let text = normalizeText(value);

    RULES.forEach((rule) => {
      text = applyRule(text, rule, state);
    });

    if (options.maskNames !== false) {
      text = applyAliases(text, buildAliases(options), state);
    }

    const report = makeSummary(state);
    return {
      text,
      findings: report.findings,
      summary: report.summary
    };
  }

  function detectSensitiveInfo(value, options = {}) {
    const result = redactText(value, options);
    return {
      findings: result.findings,
      summary: result.summary
    };
  }

  function redactJsonString(value, options = {}) {
    return redactText(value, options);
  }

  return {
    buildAliases,
    detectSensitiveInfo,
    extractStructuredAliases,
    redactJsonString,
    redactText
  };
});
