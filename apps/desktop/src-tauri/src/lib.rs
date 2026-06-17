use std::fs;
use std::time::Duration;

use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

#[tauri::command]
fn save_text_file(default_file_name: String, contents: String) -> Result<Option<String>, String> {
    let path = rfd::FileDialog::new()
        .set_title("保存分析报告")
        .set_file_name(&default_file_name)
        .add_filter("Markdown", &["md"])
        .add_filter("JSON", &["json"])
        .add_filter("Text", &["txt"])
        .save_file();

    match path {
        Some(path) => {
            fs::write(&path, contents).map_err(|error| error.to_string())?;
            Ok(Some(path.display().to_string()))
        }
        None => Ok(None),
    }
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct LlmReviewRequest {
    endpoint: String,
    model: String,
    api_key: Option<String>,
    report_text: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct LlmReviewResponse {
    endpoint: String,
    body: Value,
}

#[tauri::command]
async fn review_with_llm(request: LlmReviewRequest) -> Result<LlmReviewResponse, String> {
    if request.endpoint.trim().is_empty() {
        return Err("请填写接口地址。".to_string());
    }
    if request.model.trim().is_empty() {
        return Err("请填写模型名称。".to_string());
    }
    if request.report_text.trim().is_empty() {
        return Err("请先生成可复核的报告。".to_string());
    }

    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(45))
        .build()
        .map_err(|error| error.to_string())?;

    let user_content = [
        "请复核下面这份本地规则报告。",
        "输出结构：",
        "1. 你同意的判断",
        "2. 可能误判或证据不足的地方",
        "3. 还需要补充的上下文",
        "4. 更克制、可执行的建议",
        "",
        request.report_text.as_str(),
    ]
    .join("\n");

    let payload = json!({
        "model": request.model,
        "temperature": 0.2,
        "messages": [
            {
                "role": "system",
                "content": "你是亲密关系话术风险复核助手。只做模式识别和证据复核，不做人格诊断、法律结论或替用户做决定。请用中文输出。"
            },
            {
                "role": "user",
                "content": user_content
            }
        ]
    });

    let mut builder = client
        .post(&request.endpoint)
        .header("Content-Type", "application/json");
    if let Some(api_key) = request.api_key.as_ref().filter(|value| !value.trim().is_empty()) {
        builder = builder.bearer_auth(api_key);
    }

    let response = builder
        .json(&payload)
        .send()
        .await
        .map_err(|error| error.to_string())?;
    let status = response.status();
    let text = response.text().await.map_err(|error| error.to_string())?;
    let body: Value = serde_json::from_str(&text).unwrap_or_else(|_| json!({ "raw": text }));

    if !status.is_success() {
        let message = body
            .pointer("/error/message")
            .and_then(Value::as_str)
            .or_else(|| body.get("message").and_then(Value::as_str))
            .unwrap_or("模型接口返回错误");
        return Err(format!("{}：{}", status.as_u16(), message));
    }

    Ok(LlmReviewResponse {
        endpoint: request.endpoint,
        body,
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_text_file, review_with_llm])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
