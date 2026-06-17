const assert = require("node:assert/strict");
const llmApi = require("../src/llm-api");

(async () => {
  assert.equal(
    llmApi.makeChatCompletionsUrl("https://api.example.com/v1"),
    "https://api.example.com/v1/chat/completions"
  );
  assert.equal(
    llmApi.makeChatCompletionsUrl("https://api.example.com/v1/chat/completions"),
    "https://api.example.com/v1/chat/completions"
  );

  let captured = null;
  const result = await llmApi.reviewReport({
    baseUrl: "https://api.example.com/v1",
    model: "demo-model",
    apiKey: "test-key",
    reportText: "脱敏报告内容",
    fetchImpl: async (url, options) => {
      captured = { url, options };
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ choices: [{ message: { content: "复核完成" } }] })
      };
    }
  });

  assert.equal(captured.url, "https://api.example.com/v1/chat/completions");
  assert.equal(captured.options.method, "POST");
  assert.equal(captured.options.headers.Authorization, "Bearer test-key");
  assert.equal(JSON.parse(captured.options.body).model, "demo-model");
  assert.equal(result.content, "复核完成");

  let invoked = null;
  const invokeResult = await llmApi.reviewReport({
    baseUrl: "https://api.example.com/v1",
    model: "desktop-model",
    apiKey: "desktop-key",
    reportText: "桌面报告",
    invokeImpl: async (command, payload) => {
      invoked = { command, payload };
      return {
        endpoint: payload.request.endpoint,
        body: { choices: [{ message: { content: "桌面复核" } }] }
      };
    }
  });
  assert.equal(invoked.command, "review_with_llm");
  assert.equal(invoked.payload.request.endpoint, "https://api.example.com/v1/chat/completions");
  assert.equal(invoked.payload.request.apiKey, "desktop-key");
  assert.equal(invokeResult.content, "桌面复核");

  const noKeyResult = await llmApi.reviewReport({
    baseUrl: "https://local-gateway/v1",
    model: "local-model",
    apiKey: "",
    reportText: "report",
    fetchImpl: async (url, options) => {
      assert.equal(options.headers.Authorization, undefined);
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ choices: [{ message: { content: "本地复核" } }] })
      };
    }
  });
  assert.equal(noKeyResult.content, "本地复核");

  await assert.rejects(
    () =>
      llmApi.reviewReport({
        baseUrl: "https://api.example.com/v1",
        model: "demo-model",
        reportText: "report",
        fetchImpl: async () => ({
          ok: false,
          status: 401,
          text: async () => JSON.stringify({ error: { message: "bad key" } })
        })
      }),
    /bad key/
  );

  console.log("desktop llm api tests passed");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
