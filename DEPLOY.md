# 永久網站部署說明

這個網站不是純靜態頁面，因為首頁會透過 `server.py` 抓 Yahoo Finance、Trading Economics 與 SCFI 資料。因此要做成關機後別人也能看的永久網站，建議部署到 Render、Railway、Fly.io 或 VPS 這類可以跑 Python Web Service 的平台。

## 建議方案：Render

Render 官方文件建議 Web Service 綁定平台提供的 `PORT`，Blueprint 則可以用 `render.yaml` 定義服務。本專案已加入 `render.yaml`、`Procfile`、`requirements.txt`，可以直接部署。

### 步驟

1. 把 `C:\Users\ericliao\Desktop\AI AGENT\ai-stockmap-dashboard` 這個資料夾上傳到 GitHub。
2. 到 Render 建立新的 Web Service，連接該 GitHub repository。
3. 設定：
   - Runtime: Python
   - Build Command: `python -m compileall .`
   - Start Command: `python server.py`
   - Environment Variable: `HOST=0.0.0.0`
4. 部署完成後會得到固定網址，例如 `https://electronics-market-map.onrender.com`。
5. 如果你有自己的網域，可以在 Render 的 Custom Domain 綁定，例如 `market.yourdomain.com`。

## 部署後的效果

- 你的電腦關機後，其他使用者仍然能開網站。
- 使用者點「更新市場指標」或「更新報價」時，會由雲端主機去抓資料。
- 網址會固定，不會像 `trycloudflare.com` 臨時網址那樣失效。

## 注意

- 免費雲端服務可能會休眠，第一次開啟可能要等幾十秒。
- 若要穩定快速，建議使用付費方案或 VPS。
- Cloudflare Tunnel 也能做固定網址，但如果 tunnel 連回你的電腦，你的電腦仍然要開著；這不是真正的雲端永久網站。
