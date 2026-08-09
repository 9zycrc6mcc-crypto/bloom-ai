# Bloom AI 部署說明

這個資料夾可部署成含 AI 餐點辨識的 Bloom 測試版。

## 1. 上傳到 GitHub

建立一個空白 GitHub repository，例如 `bloom-ai`。把這個資料夾內的三個項目上傳到 repository 根目錄：

- `public`
- `netlify`
- `netlify.toml`

請不要只把 ZIP 檔上傳到 Netlify Drop；Netlify Drop 不會部署 AI 的 serverless function。

## 2. 在 Netlify 連結 GitHub

Netlify → Add new project → Import an existing project → GitHub → 選擇 `bloom-ai`。

部署設定應為：

- Publish directory: `public`
- Functions directory: `netlify/functions`
- Build command: 留空

## 3. 設定 AI 金鑰

在 Netlify 專案的 Environment variables 新增：

- Key: `OPENAI_API_KEY`
- Value: 你的 OpenAI API key
- Scope: Functions（或 All scopes）

不要把金鑰寫入網頁或上傳到 GitHub。

## 4. 測試

完成部署後，手機開啟 Netlify 網址：掃描餐點 → 開啟相機 → 允許相機權限 → 拍照。

AI 會先給熱量和蛋白質估算，你可以在加入前自行修正。結果屬於估算，不能取代營養或醫療建議。
