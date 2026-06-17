# scumbag-indicator

AI 渣男识别器：本地优先的聊天 / 恋爱经历分析工具。

当前版本是纯 Beta 测试阶段的玩具项目，分析结果不带有任何参考价值，不应作为关系判断、心理判断、法律判断或现实行动依据。

它会对用户主动粘贴或导入的文本进行规则分析，输出 0-100 风险分、8 类典型话术命中、逐条证据、心理操控机制解释、时间线和止损建议。项目默认离线运行；只有用户在桌面端手动配置并点击“大模型 API -> 模型复核”时才会联网。

## 目录

- `apps/desktop/`：Tauri 桌面版，包含静态前端、Rust 原生保存 / 联网桥接、测试和打包脚本。
- `knowledge-base/`：评分 taxonomy、文献地图、案例集、深度分析方法和提示词输出契约。
- 桌面端重点覆盖聊天导入、规则评分、API 模型复核、报告导出和匿名案例沉淀。

## 快速运行

静态预览：

```bash
cd apps/desktop/src
python3 -m http.server 8791 --bind 127.0.0.1
```

桌面开发：

```bash
cd apps/desktop/src-tauri
cargo tauri dev
```

测试：

```bash
cd apps/desktop
npm test
cargo check --manifest-path src-tauri/Cargo.toml
```

打包：

```bash
cd apps/desktop
bash scripts/build-release.sh
```

## 边界

- 不做心理疾病诊断、法律结论或治疗建议。
- 不绕过微信 / QQ 加密机制，不读取未由用户主动选择的聊天数据。
- 模型复核默认发送脱敏报告；关闭脱敏可能发送姓名、账号、地址等敏感信息。
- 输出用于帮助看清证据链，不替用户做关系决定。
- 本项目是纯 Beta 测试阶段的玩具项目，结果不带有任何参考价值。
