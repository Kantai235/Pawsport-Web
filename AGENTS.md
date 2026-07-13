# Pawsport Web 開發規範

本儲存庫是 Pawsport 的公開介紹網站、隱私權政策與支援頁面。修改前請先閱讀本文件，並尊重 iOS 專案 `Pawsport-iOS/AGENTS.md` 的既有規範。

## 技術與部署

- 網站為純靜態 HTML / CSS；除非使用者明確要求，請勿加入框架、套件管理或建置步驟。
- GitHub Pages 部署工作流程位於 `.github/workflows/deploy-pages.yml`；每次推送至 `main` 都會自動部署。
- 正式網址為 `https://pawsport.init.engineer/`，必須維持 HTTPS、canonical、Open Graph、`robots.txt` 與 `sitemap.xml` 的網址一致。
- 部署來源為本儲存庫根目錄。請勿新增會改變 GitHub Pages 輸出根目錄的建置設定。

## 內容邊界

- 所有中文內容與 Git commit message 使用繁體中文（台灣用語）。英文隱私權政策為正式英文內容，不必強行翻成中文。
- `privacy.html` 與 `privacy-en.html` 是同一份政策的繁中與英文版本。任何資料蒐集、儲存、第三方服務、刪除或聯絡方式的改動，必須同步更新兩頁，並維持事實等義。
- App Store URL：
  - Privacy Policy：`https://pawsport.init.engineer/privacy.html`
  - Support：`https://pawsport.init.engineer/support.html`
  - Marketing：`https://pawsport.init.engineer/`
- 使用現有 Pawsport 品牌色、圖示與真實 App 截圖。若要更新資產，優先從 `Pawsport-iOS/AppStoreResources/` 或 `Pawsport-iOS/Resources/Logo/` 取得已授權的來源。
- 介紹內容不得宣稱 Pawsport 提供官方身分驗證，或蒐集／上傳使用者媒體；除非 iOS App 的實際資料處理方式已變更。

## 驗證與交付

- HTML 變更後執行：
  ```bash
  npx --yes html-validate@10.7.0 index.html privacy.html privacy-en.html support.html 404.html
  ```
- `sitemap.xml` 變更後，以 Python `xml.etree.ElementTree` 驗證 XML 格式。
- 網頁視覺變更需要以內建 Browser 進行桌面與手機版檢查；若 Browser 無法使用，才以 Playwright Chromium 作為備援。
- 推送後使用 `gh run list --repo Kantai235/Pawsport-Web` 確認「部署 GitHub Pages」成功，再檢查正式網址的 HTTPS 與主要頁面。
- 文件與設定變更至少執行 `git diff --check`。
- Web 與 iOS 是獨立 Git 儲存庫。未經使用者明確要求，不要在另一個儲存庫混入無關變更。
