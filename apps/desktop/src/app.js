const inputText = document.querySelector("#inputText");
const fileInput = document.querySelector("#fileInput");
const dropZone = document.querySelector("#dropZone");
const targetKeyword = document.querySelector("#targetKeyword");
const applyFilterBtn = document.querySelector("#applyFilterBtn");
const importStatus = document.querySelector("#importStatus");
const relationshipDuration = document.querySelector("#relationshipDuration");
const repeatPattern = document.querySelector("#repeatPattern");
const boundaryIgnored = document.querySelector("#boundaryIgnored");
const analyzeBtn = document.querySelector("#analyzeBtn");
const sampleBtn = document.querySelector("#sampleBtn");
const clearBtn = document.querySelector("#clearBtn");
const llmTopBtn = document.querySelector("#llmTopBtn");
const runtimeStatus = document.querySelector("#runtimeStatus");
const scoreValue = document.querySelector("#scoreValue");
const scoreCircle = document.querySelector("#scoreCircle");
const riskLevel = document.querySelector("#riskLevel");
const summaryText = document.querySelector("#summaryText");
const confidenceText = document.querySelector("#confidenceText");
const safetyAlert = document.querySelector("#safetyAlert");
const toast = document.querySelector("#toast");
const categoryGrid = document.querySelector("#categoryGrid");
const evidenceList = document.querySelector("#evidenceList");
const timelineList = document.querySelector("#timelineList");
const exportMarkdownBtn = document.querySelector("#exportMarkdownBtn");
const exportJsonBtn = document.querySelector("#exportJsonBtn");
const exportMode = document.querySelector("#exportMode");
const maskNames = document.querySelector("#maskNames");
const llmApiDialog = document.querySelector("#llmApiDialog");
const llmCloseBtn = document.querySelector("#llmCloseBtn");
const llmProviderPreset = document.querySelector("#llmProviderPreset");
const llmBaseUrl = document.querySelector("#llmBaseUrl");
const llmModelPreset = document.querySelector("#llmModelPreset");
const llmCustomModelField = document.querySelector("#llmCustomModelField");
const llmModel = document.querySelector("#llmModel");
const llmApiKey = document.querySelector("#llmApiKey");
const llmUseRedacted = document.querySelector("#llmUseRedacted");
const llmSaveBtn = document.querySelector("#llmSaveBtn");
const llmReviewBtn = document.querySelector("#llmReviewBtn");
const llmStatus = document.querySelector("#llmStatus");
const llmOutput = document.querySelector("#llmOutput");

let lastResult = ZhamanDetector.analyze("");
let importedText = "";
let importedFileName = "";
let importedDetail = null;
let currentImportDetail = null;
let toastTimer = 0;
const CUSTOM_PROVIDER_ID = "custom";
const CUSTOM_MODEL_ID = "__custom__";
const LLM_PROVIDER_PRESETS = [
  {
    id: "openai",
    label: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    models: ["gpt-4.1-mini", "gpt-4.1", "gpt-4o-mini"]
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    baseUrl: "https://api.deepseek.com/v1",
    models: ["deepseek-chat", "deepseek-reasoner"]
  },
  {
    id: "kimi",
    label: "Kimi / Moonshot",
    baseUrl: "https://api.moonshot.ai/v1",
    models: ["moonshot-v1-8k", "moonshot-v1-32k", "moonshot-v1-128k"]
  },
  {
    id: "dashscope",
    label: "通义千问 DashScope",
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    models: ["qwen-plus", "qwen-turbo", "qwen-max"]
  },
  {
    id: "siliconflow",
    label: "硅基流动 SiliconFlow",
    baseUrl: "https://api.siliconflow.cn/v1",
    models: ["deepseek-ai/DeepSeek-R1", "deepseek-ai/DeepSeek-V3.1"]
  },
  {
    id: "openrouter",
    label: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    models: ["openai/gpt-4.1-mini", "deepseek/deepseek-chat-v3.1", "anthropic/claude-sonnet-4.5"]
  }
];
let llmConfig = {
  provider: "openai",
  baseUrl: "",
  model: "",
  apiKey: "",
  useRedacted: true
};

const sample = `他说：“她只是普通朋友，你能不能大度一点？你老这样查我真的很窒息。
等我工作稳定了肯定娶你，现在别老逼我。
我心里只有你，最后一次，再给我一次机会。
你要是这么想我也没办法，你就是太敏感了。”`;

function isTauriRuntime() {
  return Boolean(globalThis.__TAURI__?.core?.invoke);
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.remove("hidden");
  toastTimer = window.setTimeout(() => toast.classList.add("hidden"), 2200);
}

function getOptions() {
  return {
    relationshipDuration: relationshipDuration.value,
    repeatPattern: repeatPattern.checked,
    boundaryIgnored: boundaryIgnored.checked,
    importMeta: currentImportDetail
  };
}

function getPrivacyOptions() {
  return {
    maskNames: maskNames?.checked !== false,
    importMeta: currentImportDetail || importedDetail,
    aliases: [targetKeyword.value],
    senderSource: inputText.value
  };
}

function getExportMode() {
  return exportMode?.value || "redacted";
}

function getExportModeLabel(mode = getExportMode()) {
  const labels = {
    redacted: "脱敏报告",
    summary: "仅结论摘要",
    raw: "原文报告"
  };
  return labels[mode] || labels.redacted;
}

function scoreColor(score, safetyOverride) {
  if (safetyOverride || score >= 80) return "#c84f45";
  if (score >= 60) return "#b97516";
  if (score >= 40) return "#325da8";
  return "#127f76";
}

function updateGauge(score, safetyOverride) {
  const circumference = 302;
  const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;
  scoreCircle.style.strokeDashoffset = String(offset);
  scoreCircle.style.stroke = scoreColor(score, safetyOverride);
  scoreValue.textContent = String(score);
}

function renderCategories(result) {
  categoryGrid.innerHTML = "";
  result.category_scores.forEach((item) => {
    const card = document.createElement("article");
    card.className = "category-card";
    const percent = Math.round((item.score / item.max_score) * 100);
    card.innerHTML = `
      <div class="category-head">
        <strong>${item.category}</strong>
        <span class="category-score">${item.score}/${item.max_score}</span>
      </div>
      <div class="meter"><span style="width:${percent}%; background:${scoreColor(percent, false)}"></span></div>
      <p>${item.hit ? item.mechanism : "未找到明确证据。"}</p>
    `;
    categoryGrid.appendChild(card);
  });
}

function renderEvidence(result) {
  evidenceList.innerHTML = "";
  const evidence = result.strongest_evidence;
  if (!evidence.length) {
    evidenceList.innerHTML = `<article class="evidence-item"><p>暂无明确命中。可以补充更多上下文，尤其是前后文、是否反复发生、对方被指出后是否改变。</p></article>`;
    return;
  }
  evidence.forEach((item) => {
    const node = document.createElement("article");
    node.className = "evidence-item";
    node.innerHTML = `
      <div class="evidence-meta">
        <span class="chip">${item.category}</span>
        <span class="chip">证据 ${item.evidence_level}</span>
        <span class="chip">${item.label}</span>
      </div>
      <blockquote>${item.quote}</blockquote>
      <dl class="evidence-explain">
        <div>
          <dt>为什么命中</dt>
          <dd>${item.why_it_matches}</dd>
        </div>
        <div>
          <dt>也可能是</dt>
          <dd>${item.possible_benign_explanation}</dd>
        </div>
        <div>
          <dt>还需要看</dt>
          <dd>${item.needed_context}</dd>
        </div>
      </dl>
    `;
    evidenceList.appendChild(node);
  });
}

function renderAdvice(result) {
  const adviceList = document.querySelector("#adviceList");
  if (!adviceList) return;
  const blocks = [
    ["观察", result.advice.observe],
    ["沟通边界", result.advice.communicate],
    ["保护自己", result.advice.protect_boundaries],
    ["止损条件", result.advice.consider_stop_loss_if]
  ];
  adviceList.innerHTML = blocks
    .map(
      ([title, items]) => `
      <article class="advice-block">
        <h3>${title}</h3>
        <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>
      </article>
    `
    )
    .join("");
  if (result.background_notes?.length) {
    const node = document.createElement("article");
    node.className = "advice-block";
    node.innerHTML = `
      <h3>背景提示</h3>
      <ul>${result.background_notes.map((item) => `<li><strong>${item.label}</strong>：${item.text}</li>`).join("")}</ul>
    `;
    adviceList.appendChild(node);
  }
  if (result.knowledge_sources?.length) {
    const node = document.createElement("article");
    node.className = "advice-block";
    node.innerHTML = `
      <h3>依据与边界</h3>
      <ul>${result.knowledge_sources.map((item) => `<li><strong>${item.name}</strong>：${item.scope}</li>`).join("")}</ul>
    `;
    adviceList.appendChild(node);
  }
  if (result.advice.safety_resources_note) {
    const node = document.createElement("article");
    node.className = "advice-block";
    node.innerHTML = `<h3>安全优先</h3><p>${result.advice.safety_resources_note}</p>`;
    adviceList.prepend(node);
  }
}

function renderTimeline(result) {
  const timeline = result.timeline_analysis;
  if (!timeline?.message_count) {
    timelineList.innerHTML = `<article class="timeline-block"><h3>暂无结构化时间线</h3><p>导入带时间和发送者的聊天记录后，会显示消息范围、参与者、重复模式和事实矛盾信号。</p></article>`;
    return;
  }

  const dateRange = timeline.date_range ? `${timeline.date_range.from} 至 ${timeline.date_range.to}` : "未识别到完整时间范围";
  const participants = timeline.top_participants.length
    ? timeline.top_participants.map((item) => `${item.name}(${item.count})`).join("、")
    : "未识别";
  const repeated = timeline.repeated_category_hits.length
    ? timeline.repeated_category_hits.map((item) => `${item.category} ${item.score}分`).join("、")
    : "暂无多次命中类别";
  const contradictions = timeline.contradiction_signals.length
    ? timeline.contradiction_signals
        .map((item) => `<li><strong>${item.label}</strong><span>${item.quote}</span></li>`)
        .join("")
    : "<li><span>暂无明确事实矛盾信号。</span></li>";
  const gaps = timeline.long_response_gaps.length
    ? timeline.long_response_gaps.map((item) => `<li><span>${item.from} → ${item.to}，间隔 ${item.hours} 小时</span></li>`).join("")
    : "<li><span>暂无 6 小时以上消息间隔。</span></li>";

  timelineList.innerHTML = `
    <article class="timeline-block">
      <h3>导入概览</h3>
      <p>消息 ${timeline.message_count} 条，时间范围：${dateRange}</p>
      <p>主要参与者：${participants}</p>
    </article>
    <article class="timeline-block">
      <h3>重复模式</h3>
      <p>${repeated}</p>
    </article>
    <article class="timeline-block">
      <h3>事实矛盾信号</h3>
      <ul>${contradictions}</ul>
    </article>
    <article class="timeline-block">
      <h3>长间隔</h3>
      <ul>${gaps}</ul>
    </article>
  `;
}

function render(result) {
  lastResult = result;
  updateGauge(result.score, result.safety_override);
  riskLevel.textContent = result.risk_level;
  riskLevel.style.background = result.safety_override ? "#fff1ef" : "";
  riskLevel.style.color = result.safety_override ? "#7e241d" : "";
  summaryText.textContent = result.one_sentence_summary;
  confidenceText.textContent = `置信度：${result.confidence}`;
  safetyAlert.classList.toggle("hidden", !result.safety_override);
  safetyAlert.textContent = result.safety_override
    ? `安全覆盖：${result.safety_alerts.map((item) => item.label).join("、")}。${result.advice.safety_resources_note}`
    : "";
  renderCategories(result);
  renderEvidence(result);
  renderTimeline(result);
  renderAdvice(result);
}

function analyzeCurrent() {
  render(ZhamanDetector.analyze(inputText.value, getOptions()));
}

function updateImportStatus(extra = "") {
  if (!importedText) {
    importStatus.textContent = "尚未选择文件。";
    return;
  }
  const currentLines = inputText.value ? inputText.value.split("\n").filter(Boolean).length : 0;
  const totalLines = importedText.split("\n").filter(Boolean).length;
  const chars = inputText.value.length;
  const detail = currentImportDetail || importedDetail;
  const messagePart = detail?.stats?.messages ? `，消息 ${detail.stats.messages} 条` : "";
  const participantPart = detail?.participants?.length
    ? `，参与者 ${detail.participants.slice(0, 3).map((item) => `${item.name}(${item.count})`).join("、")}`
    : "";
  importStatus.textContent = `${importedFileName}：原始 ${totalLines} 行，当前 ${currentLines} 行 / ${chars} 字${messagePart}${participantPart}。${extra}`;
}

function applyImportFilter() {
  if (!importedText) {
    updateImportStatus("请先选择文件。");
    return;
  }
  currentImportDetail = importedDetail;
  inputText.value = importedText;
  const keyword = targetKeyword.value.trim();
  updateImportStatus(keyword ? `已标记分析对象“${keyword}”，保留完整导入内容。` : "未填写分析对象，已保留完整导入内容。");
  analyzeCurrent();
}

async function handleFileImport(file) {
  const raw = await file.text();
  importedFileName = file.name;
  importedDetail = ZhamanImportUtils.parseImportedFileDetailed(file.name, raw);
  currentImportDetail = importedDetail;
  importedText = importedDetail.text;
  inputText.value = importedText;
  updateImportStatus("已导入全文。");
  analyzeCurrent();
}

function clearSession() {
  inputText.value = "";
  importedText = "";
  importedFileName = "";
  importedDetail = null;
  currentImportDetail = null;
  fileInput.value = "";
  targetKeyword.value = "";
  updateImportStatus();
  repeatPattern.checked = false;
  boundaryIgnored.checked = false;
  relationshipDuration.value = "";
  exportMode.value = "redacted";
  maskNames.checked = true;
  llmOutput.textContent = "模型复核结果会显示在这里。";
  render(ZhamanDetector.analyze(""));
  showToast("当前会话已清空，页面和内存状态已归零。");
}

function activateTab(name) {
  const tab = document.querySelector(`.tab[data-tab="${name}"]`);
  if (!tab) return;
  document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
  document.querySelectorAll(".tab-view").forEach((item) => item.classList.remove("active"));
  tab.classList.add("active");
  document.querySelector(`#${tab.dataset.tab}View`).classList.add("active");
}

async function copyToClipboard(value, button, idleText) {
  await navigator.clipboard.writeText(value);
  button.querySelector("span:last-child").textContent = "已复制";
  window.setTimeout(() => (button.querySelector("span:last-child").textContent = idleText), 1200);
}

function getProviderPreset(id) {
  return LLM_PROVIDER_PRESETS.find((item) => item.id === id) || null;
}

function findProviderByBaseUrl(baseUrl) {
  const normalized = baseUrl.trim().replace(/\/$/, "");
  const preset = LLM_PROVIDER_PRESETS.find((item) => item.baseUrl.replace(/\/$/, "") === normalized);
  return preset?.id || CUSTOM_PROVIDER_ID;
}

function populateModelPresetOptions(providerId, selectedModel = "") {
  const preset = getProviderPreset(providerId);
  const models = preset?.models || [];
  llmModelPreset.innerHTML = "";
  models.forEach((model) => {
    const option = document.createElement("option");
    option.value = model;
    option.textContent = model;
    llmModelPreset.appendChild(option);
  });
  const customOption = document.createElement("option");
  customOption.value = CUSTOM_MODEL_ID;
  customOption.textContent = "自定义模型...";
  llmModelPreset.appendChild(customOption);

  if (selectedModel && models.includes(selectedModel)) {
    llmModelPreset.value = selectedModel;
    llmModel.value = selectedModel;
    llmCustomModelField.classList.add("hidden");
    return;
  }
  if (selectedModel) {
    llmModelPreset.value = CUSTOM_MODEL_ID;
    llmModel.value = selectedModel;
    llmCustomModelField.classList.remove("hidden");
    return;
  }
  if (models.length) {
    llmModelPreset.value = models[0];
    llmModel.value = models[0];
    llmCustomModelField.classList.add("hidden");
    return;
  }
  llmModelPreset.value = CUSTOM_MODEL_ID;
  llmModel.value = "";
  llmCustomModelField.classList.remove("hidden");
}

function applyLlmProviderPreset(providerId, selectedModel = "") {
  const preset = getProviderPreset(providerId);
  llmProviderPreset.value = preset ? preset.id : CUSTOM_PROVIDER_ID;
  if (preset) {
    llmBaseUrl.value = preset.baseUrl;
    populateModelPresetOptions(preset.id, selectedModel);
    return;
  }
  populateModelPresetOptions(CUSTOM_PROVIDER_ID, selectedModel);
  llmCustomModelField.classList.remove("hidden");
}

function applyLlmModelPreset(modelValue) {
  if (modelValue === CUSTOM_MODEL_ID) {
    llmCustomModelField.classList.remove("hidden");
    llmModel.focus();
    return;
  }
  llmModel.value = modelValue;
  llmCustomModelField.classList.add("hidden");
}

function syncLlmDialogFromConfig() {
  const provider = llmConfig.baseUrl ? findProviderByBaseUrl(llmConfig.baseUrl) : llmConfig.provider;
  applyLlmProviderPreset(provider, llmConfig.model);
  llmBaseUrl.value = llmConfig.baseUrl || getProviderPreset(provider)?.baseUrl || "";
  llmApiKey.value = llmConfig.apiKey;
  llmUseRedacted.checked = llmConfig.useRedacted;
}

function openLlmDialog() {
  syncLlmDialogFromConfig();
  llmApiDialog.classList.remove("hidden");
  llmProviderPreset.focus();
}

function closeLlmDialog() {
  llmApiDialog.classList.add("hidden");
}

function readLlmConfigFromForm() {
  const selectedModel = llmModelPreset.value === CUSTOM_MODEL_ID
    ? llmModel.value.trim()
    : llmModelPreset.value.trim();
  return {
    provider: llmProviderPreset.value,
    baseUrl: llmBaseUrl.value.trim(),
    model: selectedModel,
    apiKey: llmApiKey.value.trim(),
    useRedacted: llmUseRedacted.checked
  };
}

function saveLlmConfig() {
  llmConfig = readLlmConfigFromForm();
  const keyText = llmConfig.apiKey ? "已填写 Key" : "未填写 Key";
  llmStatus.textContent = llmConfig.baseUrl && llmConfig.model
    ? `当前会话已配置：${llmConfig.model}，${keyText}。`
    : "请至少填写接口地址和模型名称。";
  showToast("大模型 API 配置已保存在当前窗口内存。");
}

function buildLlmReviewReport() {
  const rawReport = ZhamanDetector.generateMarkdownReport(lastResult);
  if (!llmConfig.useRedacted) return rawReport;
  return ZhamanPrivacyUtils.redactText(rawReport, getPrivacyOptions()).text;
}

async function reviewWithLlm() {
  saveLlmConfig();
  if (!llmConfig.baseUrl || !llmConfig.model) {
    showToast("请先填写接口地址和模型名称。");
    return;
  }
  llmStatus.textContent = "正在联网请求模型复核...";
  llmOutput.textContent = "请求中...";
  try {
    const result = await ZhamanLLMApi.reviewReport({
      ...llmConfig,
      reportText: buildLlmReviewReport()
    });
    llmStatus.textContent = `复核完成：${result.endpoint}`;
    llmOutput.textContent = result.content;
  } catch (error) {
    console.error(error);
    llmStatus.textContent = "模型复核失败。";
    llmOutput.textContent = error.message || String(error);
  }
}

function buildSummaryPayload(result) {
  return {
    score: result.score,
    risk_level: result.risk_level,
    confidence: result.confidence,
    one_sentence_summary: result.one_sentence_summary,
    safety_override: result.safety_override,
    safety_alerts: result.safety_alerts.map((item) => item.label),
    hit_categories: result.category_scores
      .filter((item) => item.hit)
      .map((item) => ({
        category: item.category,
        score: item.score,
        max_score: item.max_score,
        mechanism: item.mechanism
      })),
    background_notes: result.background_notes,
    knowledge_sources: result.knowledge_sources,
    advice: {
      observe: result.advice.observe,
      communicate: result.advice.communicate,
      protect_boundaries: result.advice.protect_boundaries,
      consider_stop_loss_if: result.advice.consider_stop_loss_if
    },
    non_diagnostic_disclaimer: result.non_diagnostic_disclaimer
  };
}

function buildSummaryMarkdown(result) {
  const payload = buildSummaryPayload(result);
  const lines = [];
  lines.push("## 结论摘要");
  lines.push("");
  lines.push(`渣男指数：${payload.score}/100（${payload.risk_level}，置信度 ${payload.confidence}）`);
  lines.push("");
  lines.push(payload.one_sentence_summary);
  lines.push("");
  if (payload.safety_override) {
    lines.push(`安全提示：${result.advice.safety_resources_note}`);
    lines.push("");
  }
  if (payload.background_notes?.length) {
    lines.push("## 背景说明");
    lines.push("");
    payload.background_notes.forEach((item) => {
      lines.push(`- ${item.label}：${item.text}`);
    });
    lines.push("");
  }
  lines.push("## 主要命中类别");
  lines.push("");
  if (payload.hit_categories.length) {
    payload.hit_categories.forEach((item) => {
      lines.push(`- ${item.category}：${item.score}/${item.max_score}。${item.mechanism}`);
    });
  } else {
    lines.push("- 暂无明确命中。");
  }
  lines.push("");
  lines.push("## 建议");
  lines.push("");
  payload.advice.consider_stop_loss_if.forEach((item) => {
    lines.push(`- ${item}`);
  });
  lines.push("");
  lines.push("## 依据与边界");
  lines.push("");
  payload.knowledge_sources.forEach((item) => {
    lines.push(`- ${item.name}：${item.scope}`);
  });
  lines.push("");
  lines.push(payload.non_diagnostic_disclaimer);
  return lines.join("\n");
}

function buildRawExportContent(format, result) {
  if (getExportMode() === "summary") {
    return format === "json"
      ? JSON.stringify(buildSummaryPayload(result), null, 2)
      : buildSummaryMarkdown(result);
  }
  return format === "json" ? ZhamanDesktopUtils.makeJsonReport(result) : ZhamanDetector.generateMarkdownReport(result);
}

function buildExportContent(format) {
  const mode = getExportMode();
  const rawContents = buildRawExportContent(format, lastResult);
  if (mode === "raw") {
    return {
      mode,
      contents: rawContents,
      privacy: ZhamanPrivacyUtils.detectSensitiveInfo(rawContents, getPrivacyOptions())
    };
  }

  const redacted = ZhamanPrivacyUtils.redactText(rawContents, getPrivacyOptions());
  return {
    mode,
    contents: redacted.text,
    privacy: redacted
  };
}

function makeExportFileName(format, mode) {
  const extension = format === "json" ? "json" : "md";
  return `zhaman-report-${mode}-${ZhamanDesktopUtils.reportTimestamp()}.${extension}`;
}

async function exportReport(format) {
  const isJson = format === "json";
  const exportContent = buildExportContent(isJson ? "json" : "markdown");
  const fileName = makeExportFileName(isJson ? "json" : "markdown", exportContent.mode);
  const mimeType = isJson ? "application/json" : "text/markdown";
  const privacyText =
    exportContent.mode === "raw"
      ? "原文报告会保留敏感信息，请只保存到可信位置。"
      : `${getExportModeLabel(exportContent.mode)}已处理 ${exportContent.privacy.summary.total} 处敏感项。`;
  showToast(privacyText);
  try {
    const saved = await ZhamanDesktopUtils.saveTextFile(fileName, exportContent.contents, mimeType);
    if (saved.mode === "cancelled") {
      showToast("已取消导出。");
      return;
    }
    showToast(saved.mode === "tauri" ? `已保存：${saved.path}` : `已生成下载：${fileName}`);
  } catch (error) {
    console.error(error);
    showToast("导出失败，请先复制报告文本。");
  }
}

runtimeStatus.textContent = isTauriRuntime()
  ? "Tauri desktop · API optional"
  : "Browser preview · API optional";

analyzeBtn.addEventListener("click", analyzeCurrent);
fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  await handleFileImport(file);
});
dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropZone.classList.add("dragging");
});
dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragging"));
dropZone.addEventListener("drop", async (event) => {
  event.preventDefault();
  dropZone.classList.remove("dragging");
  const file = event.dataTransfer?.files?.[0];
  if (file) await handleFileImport(file);
});
applyFilterBtn.addEventListener("click", applyImportFilter);
sampleBtn.addEventListener("click", () => {
  inputText.value = sample;
  relationshipDuration.value = "testing";
  repeatPattern.checked = true;
  boundaryIgnored.checked = true;
  analyzeCurrent();
});
clearBtn.addEventListener("click", clearSession);
llmTopBtn.addEventListener("click", openLlmDialog);
llmCloseBtn.addEventListener("click", closeLlmDialog);
llmApiDialog.addEventListener("click", (event) => {
  if (event.target === llmApiDialog) closeLlmDialog();
});
llmProviderPreset.addEventListener("change", () => applyLlmProviderPreset(llmProviderPreset.value));
llmModelPreset.addEventListener("change", () => applyLlmModelPreset(llmModelPreset.value));
llmBaseUrl.addEventListener("input", () => {
  const preset = getProviderPreset(llmProviderPreset.value);
  if (preset && llmBaseUrl.value.trim().replace(/\/$/, "") !== preset.baseUrl.replace(/\/$/, "")) {
    llmProviderPreset.value = CUSTOM_PROVIDER_ID;
    populateModelPresetOptions(CUSTOM_PROVIDER_ID, llmModel.value.trim());
  }
});
llmSaveBtn.addEventListener("click", saveLlmConfig);
llmReviewBtn.addEventListener("click", reviewWithLlm);
exportMarkdownBtn.addEventListener("click", () => exportReport("markdown"));
exportJsonBtn.addEventListener("click", () => exportReport("json"));

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => activateTab(tab.dataset.tab));
});

applyLlmProviderPreset(llmConfig.provider);
render(lastResult);
