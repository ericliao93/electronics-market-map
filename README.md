# AI Market Map 財經產業地圖

這是一個靜態網站，風格參考 `aistockmap.com` 的「AI 產業地圖」概念，但內容改成市場追蹤用：

- AI 供應鏈產業地圖
- 台灣股市與美國股市趨勢圖
- 題材總覽
- 公司雷達
- 首頁一週財經重要事項時間表

## 打開網站

直接雙擊：

```text
open_site.bat
```

或手動打開：

```text
index.html
```

## 永久網站部署

如果要讓別人用固定網址開網站，而且你的電腦關機後網站仍然可用，請部署到雲端 Web Service。

本專案已加入：

- `render.yaml`：Render Blueprint 設定
- `Procfile`：通用 Python Web Service 啟動設定
- `requirements.txt`：Python 依賴檔
- `DEPLOY.md`：部署步驟

建議先看 `DEPLOY.md`，把此資料夾上傳到 GitHub 後，再用 Render 建立 Web Service。

## 資料區間

首頁時間表目前整理 2026-06-10 起未來一週左右的重要事件，包含：

- 美國 CPI / 核心 CPI
- 美國 PPI / 初領失業金
- 密大消費者信心
- 美國零售銷售
- FOMC 利率決議
- Oracle、Adobe 財報
- ADP 與 Apple 的非本週觀察提示

## 趨勢圖頁面

網站另外用目錄區分台股與美股：

```text
markets/taiwan/index.html
markets/us/index.html
```

目前包含：

- 台股：台灣加權指數、0050
- 美股：S&P 500、Nasdaq Composite、Dow Jones Industrial Average

重新抓取市場資料：

```powershell
python update_market_data.py
```

## 檔案

- `index.html`：網站首頁
- `styles.css`：視覺樣式
- `app.js`：篩選與互動
- `data.js`：事件、產業地圖、題材與公司資料
- `data/market-trends.js`：台股與美股趨勢資料
- `markets/`：台股與美股獨立趨勢頁
- `update_market_data.py`：更新趨勢圖資料
- `open_site.bat`：快速開啟網站
- `server.py`：本機與雲端網站伺服器，提供市場報價 API
- `render.yaml`：Render 永久網站部署設定
- `DEPLOY.md`：永久網址部署說明

## 聲明

本網站是資料整理與展示範例，不構成投資建議。財經日曆與財報時間可能變動，交易前請以官方公告與交易所資訊為準。
