window.MARKET_MAP_DATA = {
  updatedAt: "2026-06-10T03:30:00+08:00",
  todayFocus: [
    {
      label: "今日最重要事件",
      title: "先看美國通膨與 Fed 訊號",
      body: "CPI、PPI 和 FOMC 會影響市場對降息的期待，也會牽動科技股評價。",
      impact: "high"
    },
    {
      label: "熱門題材",
      title: "AI 伺服器、HBM、電源散熱",
      body: "雲端大廠買 AI 設備，會一路帶動晶片、記憶體、PCB、散熱和組裝廠。",
      impact: "high"
    },
    {
      label: "台股觀察重點",
      title: "看電子權值股和 AI 供應鏈",
      body: "台積電、台達電、廣達、緯創等公司，是台股資金方向的重要線索。",
      impact: "medium"
    },
    {
      label: "美股觀察重點",
      title: "看 Nvidia 與雲端大廠資本支出",
      body: "如果 Azure、AWS、Google Cloud、Meta 持續加碼 AI，供應鏈通常會被市場重看。",
      impact: "medium"
    },
    {
      label: "風險提醒",
      title: "利率、匯率和財報展望不如預期",
      body: "題材熱不等於股價一定漲，短線要注意消息落空、估值過高和匯率變動。",
      impact: "low"
    }
  ],
  events: [
    {
      date: "2026-06-10",
      time: "20:30",
      title: "美國 CPI / 核心 CPI（5 月）",
      region: "美國",
      type: "macro",
      impact: "high",
      tags: ["通膨", "利率", "美元", "美股"],
      note: "CPI 是市場最在意的通膨數字。高於預期，降息期待可能降溫；低於預期，科技股壓力通常較小。"
    },
    {
      date: "2026-06-11",
      time: "05:00",
      title: "Oracle Q4 FY2026 財報與法說",
      region: "美股",
      type: "earnings",
      impact: "medium",
      tags: ["ORCL", "雲端", "AI 基礎建設", "資料中心"],
      note: "Oracle 和雲端 AI 需求有關。市場會看它的雲端收入和 AI 伺服器需求是不是還強。"
    },
    {
      date: "2026-06-11",
      time: "20:15",
      title: "歐洲央行 ECB 利率決議",
      region: "歐元區",
      type: "policy",
      impact: "medium",
      tags: ["央行", "歐元", "利率"],
      note: "會影響歐元和歐洲股市，也可能間接影響美元走勢。"
    },
    {
      date: "2026-06-11",
      time: "20:30",
      title: "美國 PPI / 核心 PPI + 初領失業金",
      region: "美國",
      type: "macro",
      impact: "high",
      tags: ["通膨", "就業", "債券", "美元"],
      note: "PPI 看企業端成本，初領失業金看就業是否降溫。兩者都會影響利率預期。"
    },
    {
      date: "2026-06-12",
      time: "05:00",
      title: "Adobe Q2 FY2026 財報與法說",
      region: "美股",
      type: "earnings",
      impact: "medium",
      tags: ["ADBE", "生成式 AI", "軟體訂閱", "創意工具"],
      note: "Adobe 要證明 AI 功能能帶來更多訂閱收入，而不是只增加競爭壓力。"
    },
    {
      date: "2026-06-12",
      time: "22:00",
      title: "美國密大消費者信心指數初值（6 月）",
      region: "美國",
      type: "macro",
      impact: "medium",
      tags: ["消費者信心", "通膨預期", "零售"],
      note: "看一般民眾對物價和景氣的感覺，會影響市場對消費股和通膨的判斷。"
    },
    {
      date: "2026-06-15",
      time: "20:30",
      title: "美國進出口價格 / 新屋開工與建築許可",
      region: "美國",
      type: "macro",
      impact: "low",
      tags: ["房市", "進出口價格", "通膨"],
      note: "屬於一般資料更新，主要用來補充景氣和通膨的細節。"
    },
    {
      date: "2026-06-17",
      time: "14:00",
      title: "英國 CPI（5 月）",
      region: "英國",
      type: "macro",
      impact: "medium",
      tags: ["通膨", "英鎊", "央行"],
      note: "影響英國央行政策預期，也會牽動歐洲利率交易。"
    },
    {
      date: "2026-06-17",
      time: "17:00",
      title: "歐元區 CPI 終值（5 月）",
      region: "歐元區",
      type: "macro",
      impact: "medium",
      tags: ["通膨", "歐元", "ECB"],
      note: "如果數字修正，可能改變市場對 ECB 下一步的想法。"
    },
    {
      date: "2026-06-17",
      time: "20:30",
      title: "美國零售銷售（5 月）",
      region: "美國",
      type: "macro",
      impact: "high",
      tags: ["消費", "零售", "美元", "美股"],
      note: "直接看美國消費力道。消費太弱，景氣疑慮會上升；太強，降息期待可能下降。"
    },
    {
      date: "2026-06-18",
      time: "02:00",
      title: "FOMC 利率決議（美東 6/17）",
      region: "美國",
      type: "policy",
      impact: "high",
      tags: ["Fed", "利率", "美元", "科技股"],
      note: "Fed 怎麼說利率，會影響美元、債券和科技股估值。"
    }
  ],
  watchItems: [
    {
      title: "非農就業",
      status: "高影響",
      note: "每月一次的重要就業數字。就業太熱，降息可能變慢；就業太冷，景氣風險會升高。"
    },
    {
      title: "台積電法說",
      status: "高影響",
      note: "市場會看 AI 晶片需求、先進製程產能和全年展望。"
    },
    {
      title: "Oracle / Adobe",
      status: "中影響",
      note: "兩家公司都和 AI 基礎建設或 AI 軟體有關，是本週科技財報觀察點。"
    }
  ],
  industryStages: [
    {
      stage: "上游",
      summary: "負責做出 AI 運算需要的關鍵零件。",
      items: [
        "晶片：像 AI 的大腦，負責高速運算。",
        "記憶體：讓 AI 快速讀寫大量資料。",
        "IC 設計：設計 GPU、CPU 和加速器。"
      ]
    },
    {
      stage: "中游",
      summary: "把零件組成能運作的 AI 伺服器和資料中心設備。",
      items: [
        "伺服器：把 GPU、記憶體、電源組成主機。",
        "PCB / 載板：讓晶片和零件穩定傳輸訊號。",
        "散熱 / 電源：讓高功率設備能穩定運轉。"
      ]
    },
    {
      stage: "下游",
      summary: "把 AI 算力做成雲端服務、軟體和應用。",
      items: [
        "雲端服務：把 AI 算力租給企業使用。",
        "軟體：把 AI 變成可用的產品。",
        "AI 應用：搜尋、辦公、客服、廣告和資料分析。"
      ]
    }
  ],
  themes: [
    {
      title: "AI 伺服器",
      impact: "高",
      explanation: "雲端大廠需要更多 AI 算力，帶動伺服器、電源、散熱、PCB 和組裝。",
      industries: ["伺服器", "電源散熱", "PCB / 載板", "封測"],
      companies: [
        "台達電：AI 伺服器電源與散熱",
        "廣達：AI 伺服器組裝",
        "緯創：AI 伺服器組裝",
        "欣興：PCB / 載板"
      ],
      tags: ["AI", "資料中心", "電源散熱"],
      focus: ["台達電", "廣達", "緯創", "欣興"]
    },
    {
      title: "AI 晶片",
      impact: "高",
      explanation: "AI 模型需要高階 GPU 和先進製程，晶片需求是整條供應鏈的起點。",
      industries: ["IC 設計", "晶圓代工", "HBM 記憶體"],
      companies: [
        "Nvidia：AI GPU 設計",
        "AMD：AI GPU / CPU 設計",
        "台積電：先進製程與 AI 晶片代工",
        "SK Hynix：HBM 記憶體"
      ],
      tags: ["GPU", "先進製程", "HBM"],
      focus: ["Nvidia", "AMD", "台積電", "SK Hynix"]
    },
    {
      title: "記憶體循環",
      impact: "中",
      explanation: "AI 伺服器需要大量高速記憶體，景氣好時報價和獲利容易被市場重看。",
      industries: ["DRAM", "HBM", "記憶體模組"],
      companies: [
        "SK Hynix：HBM 記憶體",
        "南亞科：DRAM 記憶體循環相關"
      ],
      tags: ["DRAM", "HBM", "報價"],
      focus: ["SK Hynix", "南亞科"]
    },
    {
      title: "利率與通膨",
      impact: "高",
      explanation: "利率會影響資金成本。市場預期降息時，成長股常比較受關注。",
      industries: ["金融", "科技股", "高成長股"],
      companies: [
        "大型科技股：受資金成本影響",
        "銀行股：受利差和景氣影響"
      ],
      tags: ["CPI", "PPI", "Fed"],
      focus: ["QQQ", "TLT", "DXY", "銀行股"]
    },
    {
      title: "AI 軟體變現",
      impact: "中",
      explanation: "市場想知道 AI 功能能不能真的變成收入，而不是只有話題。",
      industries: ["SaaS", "創意工具", "企業軟體"],
      companies: [
        "Adobe：創意工具與生成式 AI",
        "Microsoft：Copilot 與雲端 AI",
        "Salesforce：企業軟體 AI 助理"
      ],
      tags: ["SaaS", "生成式 AI", "訂閱"],
      focus: ["ADBE", "MSFT", "CRM"]
    },
    {
      title: "雲端資本支出",
      impact: "高",
      explanation: "雲端大廠如果繼續花錢蓋資料中心，上游晶片和中游伺服器都會受惠。",
      industries: ["雲端服務", "資料中心", "AI 伺服器"],
      companies: [
        "Microsoft Azure：雲端 AI 服務",
        "Amazon AWS：雲端 AI 服務",
        "Google Cloud：雲端 AI 服務",
        "Meta：AI 資料中心需求"
      ],
      tags: ["Azure", "AWS", "Google Cloud", "Meta"],
      focus: ["MSFT", "AMZN", "GOOGL", "META"]
    }
  ],
  companies: [
    { ticker: "NVDA", name: "Nvidia", group: "AI GPU 設計", signal: "AI 晶片需求核心", description: "設計 AI GPU，是 AI 伺服器最關鍵的運算來源。" },
    { ticker: "AMD", name: "AMD", group: "AI GPU / CPU", signal: "AI 晶片競爭者", description: "提供 AI GPU 和伺服器 CPU，和 Nvidia 競爭高階運算市場。" },
    { ticker: "TSM", name: "台積電", group: "先進製程", signal: "AI 晶片製造", description: "先進製程與 AI 晶片代工，幫 Nvidia、AMD、Apple 等客戶生產晶片。" },
    { ticker: "SK Hynix", name: "SK Hynix", group: "HBM 記憶體", signal: "AI 記憶體", description: "提供 AI GPU 需要的高速 HBM 記憶體。" },
    { ticker: "ASE", name: "日月光", group: "封測", signal: "先進封裝", description: "負責晶片封裝與測試，讓晶片能穩定放進設備。" },
    { ticker: "2308", name: "台達電", group: "電源與散熱", signal: "AI 電力鏈", description: "AI 伺服器電源與散熱，受資料中心建置需求影響。" },
    { ticker: "2382", name: "廣達", group: "AI 伺服器組裝", signal: "雲端訂單", description: "AI 伺服器組裝，把 GPU、電源、PCB 等零件組成整機。" },
    { ticker: "3231", name: "緯創", group: "AI 伺服器組裝", signal: "代工組裝", description: "協助品牌和雲端客戶生產 AI 伺服器。" },
    { ticker: "3037", name: "欣興", group: "PCB / 載板", signal: "高階板材", description: "提供 PCB 和載板，讓晶片與伺服器零件穩定傳輸訊號。" },
    { ticker: "2408", name: "南亞科", group: "DRAM", signal: "記憶體循環", description: "DRAM 記憶體循環相關，受報價和景氣影響。" },
    { ticker: "MSFT", name: "Microsoft Azure", group: "雲端 AI 服務", signal: "AI 應用變現", description: "把 AI 算力做成雲端服務，提供企業租用。" },
    { ticker: "AMZN", name: "Amazon AWS", group: "雲端 AI 服務", signal: "資料中心投資", description: "提供企業訓練和部署 AI 的雲端平台。" },
    { ticker: "GOOGL", name: "Google Cloud", group: "雲端 AI 服務", signal: "AI 平台", description: "提供 AI 模型、資料分析和雲端算力服務。" },
    { ticker: "META", name: "Meta", group: "AI 資料中心需求", signal: "資本支出", description: "用大量 AI 伺服器支撐推薦、廣告和生成式 AI。" }
  ],
  supplyChain: {
    stages: [
      { id: "upstream", label: "上游" },
      { id: "midstream", label: "中游" },
      { id: "downstream", label: "下游" }
    ],
    nodes: [
      {
        id: "nvidia",
        name: "Nvidia",
        stage: "upstream",
        summary: "AI GPU 設計",
        role: "設計高階 AI GPU，是許多 AI 伺服器的核心零件。",
        affectedBy: ["雲端大廠採購", "HBM 記憶體供給", "晶圓代工產能"],
        affects: ["台積電", "SK Hynix", "廣達", "Microsoft Azure"],
        upstream: ["台積電", "SK Hynix"],
        downstream: ["日月光", "廣達", "Microsoft Azure", "Amazon AWS"],
        themes: ["AI 晶片", "AI 伺服器"]
      },
      {
        id: "amd",
        name: "AMD",
        stage: "upstream",
        summary: "AI GPU / CPU 設計",
        role: "提供 AI GPU 和伺服器 CPU，和 Nvidia 一起帶動高階運算需求。",
        affectedBy: ["AI 晶片需求", "產品競爭力", "雲端客戶採購"],
        affects: ["台積電", "伺服器品牌廠", "雲端服務"],
        upstream: ["台積電", "SK Hynix"],
        downstream: ["廣達", "緯創", "雲端服務"],
        themes: ["AI 晶片", "伺服器 CPU"]
      },
      {
        id: "tsmc",
        name: "台積電",
        stage: "upstream",
        summary: "先進製程代工",
        role: "幫 Nvidia、AMD、Apple 等公司代工高階晶片。",
        affectedBy: ["AI 晶片需求", "先進製程產能", "匯率"],
        affects: ["伺服器", "AI PC", "手機", "資料中心"],
        upstream: ["半導體設備", "材料供應商"],
        downstream: ["Nvidia", "AMD", "日月光", "雲端資料中心"],
        themes: ["AI 晶片", "先進製程"]
      },
      {
        id: "sk-hynix",
        name: "SK Hynix",
        stage: "upstream",
        summary: "HBM 記憶體",
        role: "提供 AI GPU 需要的高速記憶體，讓資料能快速進出晶片。",
        affectedBy: ["HBM 報價", "AI GPU 出貨", "產能擴充速度"],
        affects: ["Nvidia", "AMD", "AI 伺服器"],
        upstream: ["半導體材料", "記憶體設備"],
        downstream: ["Nvidia", "AMD", "廣達"],
        themes: ["HBM", "記憶體循環"]
      },
      {
        id: "ase",
        name: "日月光",
        stage: "midstream",
        summary: "封測",
        role: "把晶片封裝和測試好，讓它可以穩定裝進伺服器。",
        affectedBy: ["AI 晶片出貨", "先進封裝需求", "客戶投片量"],
        affects: ["伺服器組裝", "終端品牌"],
        upstream: ["台積電", "Nvidia", "AMD"],
        downstream: ["廣達", "緯創", "品牌廠"],
        themes: ["先進封裝", "AI 晶片"]
      },
      {
        id: "delta",
        name: "台達電",
        stage: "midstream",
        summary: "電源與散熱",
        role: "提供 AI 伺服器需要的電源和散熱方案。",
        affectedBy: ["AI 伺服器瓦數提高", "資料中心建置", "能源效率要求"],
        affects: ["廣達", "緯創", "雲端資料中心"],
        upstream: ["電子零件", "電源材料"],
        downstream: ["AI 伺服器", "資料中心"],
        themes: ["AI 伺服器", "電源散熱"]
      },
      {
        id: "quanta",
        name: "廣達",
        stage: "midstream",
        summary: "AI 伺服器組裝",
        role: "把 GPU、電源、散熱、PCB 等零件組成 AI 伺服器。",
        affectedBy: ["雲端大廠訂單", "GPU 供貨", "出貨節奏"],
        affects: ["Microsoft Azure", "Amazon AWS", "Google Cloud"],
        upstream: ["Nvidia", "台達電", "欣興", "SK Hynix"],
        downstream: ["雲端服務", "企業資料中心"],
        themes: ["AI 伺服器", "雲端資本支出"]
      },
      {
        id: "wistron",
        name: "緯創",
        stage: "midstream",
        summary: "AI 伺服器組裝",
        role: "協助品牌和雲端客戶生產 AI 伺服器。",
        affectedBy: ["AI 伺服器需求", "客戶拉貨", "零件供應"],
        affects: ["雲端服務", "企業 AI 應用"],
        upstream: ["Nvidia", "台達電", "欣興"],
        downstream: ["雲端客戶", "企業客戶"],
        themes: ["AI 伺服器", "代工組裝"]
      },
      {
        id: "unimicron",
        name: "欣興",
        stage: "midstream",
        summary: "PCB / 載板",
        role: "提供高階晶片和伺服器用的板材，讓訊號能穩定傳輸。",
        affectedBy: ["AI 晶片規格升級", "伺服器出貨", "載板報價"],
        affects: ["晶片封裝", "AI 伺服器"],
        upstream: ["材料供應商"],
        downstream: ["日月光", "廣達", "緯創"],
        themes: ["PCB", "載板", "AI 伺服器"]
      },
      {
        id: "azure",
        name: "Microsoft Azure",
        stage: "downstream",
        summary: "雲端 AI 服務",
        role: "把 AI 算力做成雲端服務，讓企業租用。",
        affectedBy: ["企業 AI 需求", "資料中心成本", "GPU 供給"],
        affects: ["廣達", "緯創", "台達電", "Nvidia"],
        upstream: ["廣達", "緯創", "Nvidia", "台達電"],
        downstream: ["企業 AI 應用", "軟體服務"],
        themes: ["雲端 AI", "AI 應用"]
      },
      {
        id: "aws",
        name: "Amazon AWS",
        stage: "downstream",
        summary: "雲端 AI 服務",
        role: "提供企業訓練和部署 AI 的雲端平台。",
        affectedBy: ["企業雲端需求", "資料中心投資", "晶片供給"],
        affects: ["AI 伺服器供應鏈", "Nvidia", "AMD"],
        upstream: ["廣達", "緯創", "Nvidia", "AMD"],
        downstream: ["電商", "企業軟體", "AI 應用"],
        themes: ["雲端 AI", "資料中心"]
      },
      {
        id: "google-cloud",
        name: "Google Cloud",
        stage: "downstream",
        summary: "雲端 AI 服務",
        role: "提供 AI 模型、資料分析和雲端算力服務。",
        affectedBy: ["AI 產品需求", "雲端競爭", "資料中心投資"],
        affects: ["AI 伺服器", "電源散熱", "晶片需求"],
        upstream: ["Nvidia", "伺服器組裝廠", "台達電"],
        downstream: ["企業客戶", "AI 軟體"],
        themes: ["雲端 AI", "AI 應用"]
      },
      {
        id: "meta",
        name: "Meta",
        stage: "downstream",
        summary: "AI 資料中心需求",
        role: "用大量 AI 伺服器支撐推薦、廣告、生成式 AI 和模型訓練。",
        affectedBy: ["廣告收入", "AI 投資計畫", "資料中心成本"],
        affects: ["Nvidia", "廣達", "緯創", "台達電"],
        upstream: ["Nvidia", "廣達", "台達電", "SK Hynix"],
        downstream: ["社群平台", "廣告服務", "AI 應用"],
        themes: ["AI 資料中心", "雲端資本支出"]
      }
    ]
  }
};
