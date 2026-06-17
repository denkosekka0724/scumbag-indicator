(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ZhamanImportUtils = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  const DATE_SOURCE =
    "(?:\\d{4}[-/.年]\\d{1,2}[-/.月]\\d{1,2}日?\\s+\\d{1,2}:\\d{2}(?::\\d{2})?|\\d{4}[-/.年]\\d{1,2}[-/.月]\\d{1,2}日?)";

  function decodeQuotedPrintable(value) {
    return String(value || "")
      .replace(/=\r?\n/g, "")
      .replace(/=([A-Fa-f0-9]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  }

  function stripHtml(value) {
    const decoded = decodeQuotedPrintable(value);
    if (typeof DOMParser !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(decoded, "text/html");
      doc.querySelectorAll("script,style,noscript,svg").forEach((node) => node.remove());
      return (doc.body?.innerText || decoded.replace(/<[^>]+>/g, "\n")).replace(/\n{3,}/g, "\n\n");
    }
    return decoded
      .replace(/<script[\s\S]*?<\/script>/gi, "\n")
      .replace(/<style[\s\S]*?<\/style>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|tr|h[1-6])>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/\n{3,}/g, "\n\n");
  }

  function normalizeImportedText(value) {
    return String(value || "")
      .replace(/\r/g, "")
      .replace(/\u00a0/g, " ")
      .split("\n")
      .map((line) => line.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .join("\n");
  }

  function normalizeTime(value) {
    if (value === null || value === undefined || value === "") return "";
    if (typeof value === "number") {
      const millis = value > 100000000000 ? value : value * 1000;
      const date = new Date(millis);
      return Number.isNaN(date.getTime()) ? String(value) : date.toISOString().slice(0, 19).replace("T", " ");
    }
    return String(value).trim();
  }

  function normalizeMessage(message) {
    const content = String(message.content || "").replace(/\s+/g, " ").trim();
    if (!content) return null;
    return {
      time: normalizeTime(message.time),
      sender: String(message.sender || "").replace(/\s+/g, " ").trim(),
      content,
      source: message.source || "import"
    };
  }

  function messageToLine(message) {
    return [message.time, message.sender, message.content].filter(Boolean).join("  ");
  }

  function messagesToText(messages) {
    return (messages || []).map(messageToLine).join("\n");
  }

  function summarizeParticipants(messages) {
    const counts = new Map();
    (messages || []).forEach((message) => {
      const name = message.sender || "未知";
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh-Hans-CN"));
  }

  function collectJsonMessages(value, messages = []) {
    if (value === null || value === undefined) return messages;
    if (Array.isArray(value)) {
      value.forEach((item) => collectJsonMessages(item, messages));
      return messages;
    }
    if (typeof value !== "object") return messages;

    const sender = value.sender || value.from || value.nickname || value.remark || value.talker || value.name || "";
    const time = value.time || value.timestamp || value.createTime || value.CreateTime || value.date || "";
    const content = value.content || value.text || value.message || value.msg || value.StrContent || value.Message || "";
    const normalized = normalizeMessage({ time, sender, content, source: "json" });
    if (normalized) {
      messages.push(normalized);
      return messages;
    }

    Object.values(value).forEach((child) => collectJsonMessages(child, messages));
    return messages;
  }

  function collectJsonText(value, lines = []) {
    collectJsonMessages(value).forEach((message) => lines.push(messageToLine(message)));
    if (lines.length) return lines;
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed.length > 1) lines.push(trimmed);
    } else if (Array.isArray(value)) {
      value.forEach((item) => collectJsonText(item, lines));
    } else if (value && typeof value === "object") {
      Object.values(value).forEach((child) => collectJsonText(child, lines));
    }
    return lines;
  }

  function parseCsvRows(raw) {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;
    const text = String(raw || "").replace(/\r/g, "");
    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];
      if (char === '"' && quoted && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === "," && !quoted) {
        row.push(cell.trim());
        cell = "";
      } else if (char === "\n" && !quoted) {
        row.push(cell.trim());
        if (row.some(Boolean)) rows.push(row);
        row = [];
        cell = "";
      } else {
        cell += char;
      }
    }
    row.push(cell.trim());
    if (row.some(Boolean)) rows.push(row);
    return rows;
  }

  function findHeaderIndex(headers, candidates) {
    const normalized = headers.map((item) => String(item || "").trim().toLowerCase());
    return normalized.findIndex((header) => candidates.some((candidate) => header === candidate || header.includes(candidate)));
  }

  function parseCsvMessages(raw) {
    const rows = parseCsvRows(raw);
    if (rows.length < 2) return [];
    const headers = rows[0];
    const senderIndex = findHeaderIndex(headers, ["sender", "from", "nickname", "name", "发送人", "发送者", "昵称", "备注"]);
    const timeIndex = findHeaderIndex(headers, ["time", "timestamp", "date", "createtime", "时间", "日期"]);
    const contentIndex = findHeaderIndex(headers, ["content", "text", "message", "msg", "strcontent", "内容", "消息"]);
    if (contentIndex < 0) return [];
    return rows
      .slice(1)
      .map((row) =>
        normalizeMessage({
          time: timeIndex >= 0 ? row[timeIndex] : "",
          sender: senderIndex >= 0 ? row[senderIndex] : "",
          content: row[contentIndex],
          source: "csv"
        })
      )
      .filter(Boolean);
  }

  function parseMessagesFromText(text) {
    const lines = normalizeImportedText(text).split("\n").filter(Boolean);
    const headerOnly = new RegExp(`^\\[?(${DATE_SOURCE})\\]?\\s+([^\\s:：]{1,40})\\s*$`);
    const headerWithContent = new RegExp(`^\\[?(${DATE_SOURCE})\\]?\\s+([^\\s:：]{1,40})(?:\\s+|[:：])(.+)$`);
    const colonMessage = /^([^:：]{1,40})[:：]\s*(.+)$/;
    const messages = [];
    let pending = null;

    function pushPending() {
      if (!pending) return;
      const normalized = normalizeMessage(pending);
      if (normalized) messages.push(normalized);
      pending = null;
    }

    lines.forEach((line) => {
      const only = line.match(headerOnly);
      if (only) {
        pushPending();
        pending = {
          time: only[1],
          sender: only[2],
          content: "",
          source: "text"
        };
        return;
      }

      const withContent = line.match(headerWithContent);
      if (withContent) {
        pushPending();
        messages.push(
          normalizeMessage({
            time: withContent[1],
            sender: withContent[2],
            content: withContent[3],
            source: "text"
          })
        );
        return;
      }

      const colon = line.match(colonMessage);
      if (colon && !pending) {
        messages.push(
          normalizeMessage({
            time: "",
            sender: colon[1],
            content: colon[2],
            source: "text"
          })
        );
        return;
      }

      if (pending) {
        pending.content = [pending.content, line].filter(Boolean).join("\n");
      }
    });

    pushPending();
    return messages.filter(Boolean);
  }

  function extractImportedText(fileName, raw) {
    const lowerName = String(fileName || "").toLowerCase();
    if (lowerName.endsWith(".json")) {
      try {
        return collectJsonText(JSON.parse(raw)).join("\n");
      } catch {
        return raw;
      }
    }
    if (
      lowerName.endsWith(".html") ||
      lowerName.endsWith(".htm") ||
      lowerName.endsWith(".mht") ||
      lowerName.endsWith(".mhtml")
    ) {
      return stripHtml(raw);
    }
    return raw;
  }

  function buildImportDetail(fileName, text, messages, format) {
    const cleanMessages = (messages || []).filter(Boolean);
    const cleanText = cleanMessages.length ? messagesToText(cleanMessages) : normalizeImportedText(text);
    const lines = cleanText ? cleanText.split("\n").filter(Boolean) : [];
    return {
      fileName: fileName || "",
      format,
      text: cleanText,
      messages: cleanMessages,
      participants: summarizeParticipants(cleanMessages),
      stats: {
        lines: lines.length,
        chars: cleanText.length,
        messages: cleanMessages.length,
        participants: summarizeParticipants(cleanMessages).length
      }
    };
  }

  function parseImportedFileDetailed(fileName, raw) {
    const lowerName = String(fileName || "").toLowerCase();

    if (lowerName.endsWith(".json")) {
      try {
        const messages = collectJsonMessages(JSON.parse(raw));
        if (messages.length) return buildImportDetail(fileName, "", messages, "json");
      } catch {
        // Fall through to text parsing.
      }
    }

    if (lowerName.endsWith(".csv")) {
      const messages = parseCsvMessages(raw);
      if (messages.length) return buildImportDetail(fileName, "", messages, "csv");
    }

    const text = normalizeImportedText(extractImportedText(fileName, raw));
    const messages = parseMessagesFromText(text);
    return buildImportDetail(fileName, text, messages, messages.length ? "chat-text" : "plain-text");
  }

  function filterMessagesByKeyword(messages, keyword, radius) {
    const cleanKeyword = String(keyword || "").trim().toLowerCase();
    if (!cleanKeyword) return messages || [];
    const keep = new Set();
    (messages || []).forEach((message, index) => {
      const haystack = `${message.sender || ""}\n${message.content || ""}`.toLowerCase();
      if (haystack.includes(cleanKeyword)) {
        for (let offset = -radius; offset <= radius; offset += 1) {
          const target = index + offset;
          if (target >= 0 && target < messages.length) keep.add(target);
        }
      }
    });
    return [...keep]
      .sort((a, b) => a - b)
      .map((index) => messages[index]);
  }

  function filterImportDetailByKeyword(detail, keyword, radius) {
    if (!detail) return buildImportDetail("", "", [], "plain-text");
    if (detail.messages && detail.messages.length) {
      const filteredMessages = filterMessagesByKeyword(detail.messages, keyword, radius);
      return buildImportDetail(detail.fileName, "", filteredMessages.length ? filteredMessages : detail.messages, detail.format);
    }
    const filteredText = filterByKeyword(detail.text, keyword, radius);
    return buildImportDetail(detail.fileName, filteredText || detail.text, [], detail.format);
  }

  function filterByKeyword(text, keyword, radius) {
    const cleanKeyword = String(keyword || "").trim().toLowerCase();
    if (!cleanKeyword) return text;
    const messages = parseMessagesFromText(text);
    if (messages.length) {
      const filteredMessages = filterMessagesByKeyword(messages, cleanKeyword, Number(radius) || 0);
      return messagesToText(filteredMessages);
    }
    const lines = String(text || "").split("\n");
    const keep = new Set();
    lines.forEach((line, index) => {
      if (line.toLowerCase().includes(cleanKeyword)) {
        for (let offset = -(Number(radius) || 0); offset <= (Number(radius) || 0); offset += 1) {
          const target = index + offset;
          if (target >= 0 && target < lines.length) keep.add(target);
        }
      }
    });
    return [...keep]
      .sort((a, b) => a - b)
      .map((index) => lines[index])
      .join("\n");
  }

  function parseImportedFile(fileName, raw) {
    return parseImportedFileDetailed(fileName, raw).text;
  }

  return {
    collectJsonMessages,
    collectJsonText,
    decodeQuotedPrintable,
    extractImportedText,
    filterByKeyword,
    filterImportDetailByKeyword,
    filterMessagesByKeyword,
    messagesToText,
    normalizeImportedText,
    parseCsvMessages,
    parseImportedFile,
    parseImportedFileDetailed,
    parseMessagesFromText,
    stripHtml,
    summarizeParticipants
  };
});
