(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ZhamanLLMApi = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  const DEFAULT_TIMEOUT_MS = 45000;

  function normalizeBaseUrl(value) {
    return String(value || "").trim().replace(/\/+$/, "");
  }

  function makeChatCompletionsUrl(baseUrl) {
    const clean = normalizeBaseUrl(baseUrl);
    if (!clean) return "";
    if (/\/chat\/completions$/i.test(clean)) return clean;
    return `${clean}/chat/completions`;
  }

  function buildReviewMessages(reportText) {
    return [
      {
        role: "system",
        content:
          "你是亲密关系话术风险复核助手。只做模式识别和证据复核，不做人格诊断、法律结论或替用户做决定。请用中文输出。"
      },
      {
        role: "user",
        content: [
          "请复核下面这份本地规则报告。",
          "输出结构：",
          "1. 你同意的判断",
          "2. 可能误判或证据不足的地方",
          "3. 还需要补充的上下文",
          "4. 更克制、可执行的建议",
          "",
          reportText
        ].join("\n")
      }
    ];
  }

  function extractModelContent(data) {
    return data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || data?.output_text || data?.raw;
  }

  function getTauriInvoke() {
    return globalThis.__TAURI__?.core?.invoke || null;
  }

  async function reviewReport(options) {
    const endpoint = makeChatCompletionsUrl(options.baseUrl);
    if (!endpoint) throw new Error("请填写接口地址。");
    if (!options.model) throw new Error("请填写模型名称。");
    if (!options.reportText) throw new Error("请先生成可复核的报告。");

    const invoke = options.invokeImpl || (!options.fetchImpl ? getTauriInvoke() : null);
    if (invoke) {
      const response = await invoke("review_with_llm", {
        request: {
          endpoint,
          model: options.model,
          apiKey: options.apiKey || "",
          reportText: options.reportText
        }
      });
      const content = extractModelContent(response.body);
      return {
        endpoint: response.endpoint || endpoint,
        content: content || "模型返回为空。",
        raw: response.body
      };
    }

    const fetchImpl = options.fetchImpl || globalThis.fetch;
    if (typeof fetchImpl !== "function") {
      throw new Error("当前运行环境不支持 fetch，无法联网调用模型。");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs || DEFAULT_TIMEOUT_MS);
    const headers = {
      "Content-Type": "application/json"
    };
    if (options.apiKey) headers.Authorization = `Bearer ${options.apiKey}`;

    try {
      const response = await fetchImpl(endpoint, {
        method: "POST",
        headers,
        signal: controller.signal,
        body: JSON.stringify({
          model: options.model,
          temperature: 0.2,
          messages: buildReviewMessages(options.reportText)
        })
      });

      const bodyText = await response.text();
      let data = {};
      try {
        data = bodyText ? JSON.parse(bodyText) : {};
      } catch (error) {
        data = { raw: bodyText };
      }

      if (!response.ok) {
        const message = data.error?.message || data.message || bodyText || `HTTP ${response.status}`;
        throw new Error(`模型接口返回错误：${message}`);
      }

      const content = extractModelContent(data);
      return {
        endpoint,
        content: content || "模型返回为空。",
        raw: data
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    buildReviewMessages,
    makeChatCompletionsUrl,
    reviewReport
  };
});
