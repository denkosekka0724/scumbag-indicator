(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ZhamanDesktopUtils = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function reportTimestamp(date = new Date()) {
    return [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate()),
      "-",
      pad(date.getHours()),
      pad(date.getMinutes())
    ].join("");
  }

  function makeReportFileName(extension, date = new Date()) {
    const cleanExtension = String(extension || "md").replace(/^\./, "");
    return `zhaman-report-${reportTimestamp(date)}.${cleanExtension}`;
  }

  function makeJsonReport(result) {
    return JSON.stringify(result || {}, null, 2);
  }

  function downloadTextFile(fileName, contents, mimeType) {
    const blob = new Blob([contents], { type: `${mimeType || "text/plain"};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function getTauriInvoke() {
    return globalThis.__TAURI__?.core?.invoke || null;
  }

  async function saveTextFile(fileName, contents, mimeType) {
    const invoke = getTauriInvoke();
    if (invoke) {
      const savedPath = await invoke("save_text_file", {
        defaultFileName: fileName,
        contents
      });
      return {
        mode: savedPath ? "tauri" : "cancelled",
        path: savedPath || ""
      };
    }

    downloadTextFile(fileName, contents, mimeType);
    return {
      mode: "browser-download",
      path: fileName
    };
  }

  return {
    downloadTextFile,
    makeJsonReport,
    makeReportFileName,
    reportTimestamp,
    saveTextFile
  };
});
