# AI渣男识别器 Desktop

本目录是静态本地版的 Tauri 桌面壳。前端仍是纯 HTML/CSS/JS，规则引擎和导入解析都在本机运行；Tauri 只负责桌面窗口和原生报告保存。

## 当前能力

- 离线粘贴分析。
- 导入 `.txt` `.log` `.csv` `.json` `.html` `.mht` `.mhtml`。
- 结构化解析常见聊天导出：时间、发送者、内容、参与者统计。
- 分析对象标记：导入后默认保留完整聊天上下文，不再按前后几行裁剪关系时间线。
- 8 类话术分数、逐条证据解释、善意解释和上下文缺口提示。
- 可选补充背景：关系时长、反复发生、边界被忽视只影响解释和置信度提示，不直接加分。
- 时间线分析：消息范围、主要参与者、重复类别、事实矛盾信号和长间隔。
- Markdown / JSON 报告导出，默认使用脱敏报告。
- 导出前隐私预览：检测手机号、邮箱、身份证号、微信号、QQ号、地址、机构和参与者姓名。
- 报告模式：脱敏报告、仅结论摘要、原文报告。
- 可选大模型 API 复核：支持兼容 OpenAI Chat Completions 的 `/chat/completions` 接口；内置 OpenAI、DeepSeek、Kimi、DashScope、SiliconFlow、OpenRouter 预设，也允许自定义接口和模型；桌面端使用原生联网请求，API Key 只保存在当前窗口内存。
- 一键清空当前页面文本、导入缓存、筛选条件和分析结果。
- 40 条 seed cases 自动评测，覆盖话术命中、反误判、安全覆盖和混合案例。

## 开发运行

当前机器需要先安装 Rust 工具链：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --profile minimal
source "$HOME/.cargo/env"
cargo install tauri-cli --version '^2' --locked
```

然后运行：

```bash
cd apps/desktop/src-tauri
cargo tauri dev
```

## 打包发布

生成可双击 `.app` 和 `.dmg`：

```bash
cd apps/desktop
bash scripts/build-release.sh
```

验证产物：

```bash
cd apps/desktop
bash scripts/verify-release.sh
```

产物路径：

- `.app`：`apps/desktop/src-tauri/target/release/bundle/macos/AI渣男识别器.app`
- `.dmg`：`apps/desktop/src-tauri/target/release/bundle/dmg/AI渣男识别器_0.1.0_aarch64.dmg`

没有 Rust 时，也可以直接预览静态前端：

```bash
open apps/desktop/src/index.html
```

## 测试

```bash
cd apps/desktop
npm test
```

## 边界

- 不做心理疾病诊断、法律结论或治疗建议。
- 关系时长和手动背景项不是临床量表，也不是硬性评分依据。
- 不绕过微信/QQ加密机制，不读取未由用户主动选择的聊天数据。
- 默认不联网；只有点击“大模型 API → 模型复核”才会请求外部接口。
- 模型复核默认发送脱敏报告；关闭脱敏时，原文报告可能包含姓名、账号、地址等敏感信息。
- 本项目是纯娱乐项目，输出仅供自我观察和关系复盘参考。
