(function () {
  const base = window.MARKET_MAP_DATA || {};

  const layerOrder = [
    { id: "ai-application", label: "AI應用", note: "使用者真正接觸到的產品和場景。" },
    { id: "ai-model", label: "AI模型", note: "把資料訓練成可回答、可生成、可判斷的模型。" },
    { id: "data-center", label: "雲端資料中心", note: "提供 AI 模型訓練和推論需要的算力。" },
    { id: "ai-server", label: "AI伺服器", note: "把 GPU、記憶體、網路、散熱與電源組成整機。" },
    { id: "gpu", label: "GPU", note: "AI 運算核心，決定訓練和推論速度。" },
    { id: "advanced-packaging", label: "CoWoS封裝", note: "把 GPU、HBM 和載板整合，讓資料高速傳輸。" },
    { id: "foundry", label: "晶圓代工", note: "把晶片設計真正製造成晶圓。" },
    { id: "equipment-materials", label: "設備與材料", note: "提供半導體製造需要的機台、化學品和材料。" }
  ];

  const categories = [
    {
      id: "ai-applications",
      title: "AI應用",
      layer: "ai-application",
      role: "把 AI 模型包裝成使用者看得見、用得到的服務。",
      description: "AI 應用是需求端。應用越多，越需要模型、雲端資料中心和 AI 伺服器。",
      upstream: ["OpenAI", "Anthropic", "Google Gemini", "Meta AI", "雲端資料中心"],
      downstream: ["企業客戶", "消費者", "醫療院所", "金融機構", "學校"],
      related: ["AI Agent", "AI醫療", "AI金融", "AI教育", "機器人", "自駕車"],
      companies: [
        { id: "autonomous-driving", name: "自駕車", type: "concept", intro: "用 AI 感知路況、判斷路徑，帶動車用晶片與感測器需求。" },
        { id: "robotics", name: "機器人", type: "concept", intro: "把 AI 放進機器，讓工廠、倉儲和服務業能自動化。" },
        { id: "ai-agent", name: "AI Agent", type: "concept", intro: "能替使用者規劃、查資料、操作工具的 AI 助理。" },
        { id: "ai-healthcare", name: "AI醫療", type: "concept", intro: "用 AI 協助影像判讀、藥物研發和病患管理。" },
        { id: "ai-finance", name: "AI金融", type: "concept", intro: "用 AI 做風控、客服、投資研究和交易流程自動化。" },
        { id: "ai-education", name: "AI教育", type: "concept", intro: "用 AI 做個人化教學、題目生成和學習助理。" }
      ]
    },
    {
      id: "ai-software",
      title: "AI軟體",
      layer: "ai-model",
      role: "訓練與提供 AI 模型，讓應用層可以接上智慧能力。",
      description: "AI 軟體公司把底層算力變成模型和工具，是應用爆發的核心入口。",
      upstream: ["Amazon AWS", "Microsoft Azure", "Google Cloud", "Oracle Cloud", "NVIDIA"],
      downstream: ["AI Agent", "AI醫療", "AI金融", "AI教育", "企業軟體"],
      related: ["生成式 AI", "大型語言模型", "多模態 AI", "AI Agent"],
      companies: [
        { id: "openai", name: "OpenAI", intro: "生成式 AI 模型與應用代表，帶動企業導入 AI 服務。" },
        { id: "anthropic", name: "Anthropic", intro: "Claude 模型開發商，聚焦企業級 AI 助理與安全性。" },
        { id: "google-gemini", name: "Google Gemini", intro: "Google 的多模態 AI 模型，連結搜尋、雲端和 Android 生態。" },
        { id: "meta-ai", name: "Meta AI", intro: "Meta 的 AI 模型與應用，帶動社群、廣告和資料中心需求。" }
      ]
    },
    {
      id: "data-centers",
      title: "資料中心",
      layer: "data-center",
      role: "採購 AI 伺服器並提供雲端算力，是 AI 需求能否延續的關鍵客戶。",
      description: "雲端資料中心越積極擴建，上游晶片、伺服器、散熱、電源和網通需求就越強。",
      upstream: ["廣達", "緯創", "緯穎", "英業達", "NVIDIA", "台達電", "Arista"],
      downstream: ["OpenAI", "Anthropic", "Google Gemini", "Meta AI", "企業客戶"],
      related: ["雲端資本支出", "資料中心", "AI 推論", "AI 訓練"],
      companies: [
        { id: "aws", name: "Amazon AWS", intro: "全球大型雲端平台，提供企業 AI 訓練與部署算力。" },
        { id: "azure", name: "Microsoft Azure", intro: "Microsoft 雲端平台，支撐 Copilot、OpenAI 和企業 AI 服務。" },
        { id: "google-cloud", name: "Google Cloud", intro: "Google 雲端平台，提供 AI 模型、資料分析和算力服務。" },
        { id: "oracle-cloud", name: "Oracle Cloud", intro: "Oracle 雲端服務，市場關注其 AI 基礎建設成長速度。" }
      ]
    },
    {
      id: "server-odm",
      title: "伺服器ODM",
      layer: "ai-server",
      role: "把 GPU、記憶體、電源、散熱、PCB 組成 AI 伺服器。",
      description: "ODM 是 AI 伺服器整機組裝與出貨核心，會直接受雲端大廠訂單影響。",
      upstream: ["NVIDIA", "AMD", "台達電", "奇鋐", "金像電", "欣興"],
      downstream: ["Amazon AWS", "Microsoft Azure", "Google Cloud", "Oracle Cloud"],
      related: ["AI 伺服器", "雲端資本支出", "資料中心"],
      companies: [
        { id: "quanta", name: "廣達", intro: "AI 伺服器組裝大廠，承接雲端大廠伺服器訂單。" },
        { id: "wistron", name: "緯創", intro: "AI 伺服器代工與組裝，受 GPU 供貨和客戶拉貨影響。" },
        { id: "wiwynn", name: "緯穎", intro: "雲端資料中心伺服器供應商，受大型雲端客戶投資影響。" },
        { id: "inventec", name: "英業達", intro: "伺服器與企業電腦代工，參與 AI 伺服器供應鏈。" }
      ]
    },
    {
      id: "thermal",
      title: "散熱",
      layer: "ai-server",
      role: "把 AI 伺服器產生的大量熱能帶走，避免設備降速或當機。",
      description: "AI 伺服器功耗高，散熱從風冷走向液冷，題材常跟資料中心建置一起被關注。",
      upstream: ["金屬材料", "風扇零件", "液冷零件"],
      downstream: ["廣達", "緯創", "緯穎", "雲端資料中心"],
      related: ["液冷", "散熱模組", "AI 伺服器"],
      companies: [
        { id: "avc", name: "奇鋐", intro: "散熱模組供應商，受 AI 伺服器高功耗趨勢帶動。" },
        { id: "auras", name: "雙鴻", intro: "散熱解決方案公司，關注伺服器和高階電子散熱需求。" },
        { id: "sunon", name: "建準", intro: "風扇與散熱零件供應商，受資料中心散熱需求影響。" }
      ]
    },
    {
      id: "power",
      title: "電源",
      layer: "ai-server",
      role: "提供 AI 伺服器穩定供電，功耗提升會提高電源規格要求。",
      description: "AI 伺服器需要更高瓦數、更高效率的電源，資料中心擴建也會推升電力設備需求。",
      upstream: ["功率元件", "電源管理 IC", "被動元件"],
      downstream: ["廣達", "緯創", "緯穎", "雲端資料中心"],
      related: ["電源供應器", "資料中心電力", "AI 伺服器"],
      companies: [
        { id: "delta", name: "台達電", intro: "AI 伺服器電源與散熱重點廠，受資料中心建置需求影響。" },
        { id: "liteon", name: "光寶科", intro: "電源供應器與電子零組件供應商，參與伺服器電源鏈。" }
      ]
    },
    {
      id: "chassis",
      title: "機殼",
      layer: "ai-server",
      role: "提供伺服器機箱與機櫃結構，承載高功率 GPU 與散熱設計。",
      description: "AI 伺服器規格升級，會帶動機殼、機櫃和整機結構設計需求。",
      upstream: ["金屬材料", "機構件", "散熱設計"],
      downstream: ["廣達", "緯創", "緯穎", "資料中心"],
      related: ["AI 伺服器機殼", "機櫃", "資料中心建置"],
      companies: [
        { id: "chenbro", name: "勤誠", intro: "伺服器機殼與機櫃供應商，受 AI 伺服器規格升級影響。" },
        { id: "chenming", name: "晟銘電", intro: "機殼與機構件相關公司，受伺服器和資料中心需求影響。" }
      ]
    },
    {
      id: "switch-networking",
      title: "交換器與網通",
      layer: "ai-server",
      role: "讓大量 AI 伺服器高速互連，資料中心內部溝通更順。",
      description: "AI 訓練需要很多伺服器一起工作，高速網路交換器和網通設備很重要。",
      upstream: ["高速傳輸晶片", "光通訊模組", "PCB"],
      downstream: ["Amazon AWS", "Microsoft Azure", "Google Cloud", "Meta"],
      related: ["資料中心網路", "交換器", "AI Cluster"],
      companies: [
        { id: "cisco", name: "Cisco", intro: "網通設備龍頭，提供企業與資料中心網路設備。" },
        { id: "arista", name: "Arista", intro: "資料中心交換器供應商，受大型雲端資料中心需求帶動。" },
        { id: "accton", name: "智邦", intro: "交換器與網通設備供應商，受資料中心網路升級影響。" },
        { id: "wistron-neweb", name: "啟碁", intro: "網通設備與通訊模組供應商，參與雲端與企業網路鏈。" }
      ]
    },
    {
      id: "high-speed-io",
      title: "高速傳輸",
      layer: "ai-server",
      role: "加快晶片、伺服器與資料中心之間的資料傳輸速度。",
      description: "AI 訓練需要大量資料快速移動，高速傳輸晶片和互連技術是瓶頸之一。",
      upstream: ["半導體製造", "封裝", "高速介面 IP"],
      downstream: ["交換器", "AI 伺服器", "雲端資料中心"],
      related: ["高速互連", "CXL", "PCIe", "SerDes"],
      companies: [
        { id: "credo", name: "Credo", intro: "高速連接晶片公司，受 AI 資料中心高速互連需求帶動。" },
        { id: "astera-labs", name: "Astera Labs", intro: "高速連接與資料中心互連晶片公司，受 AI 伺服器升級影響。" },
        { id: "mps", name: "MPS", intro: "電源與類比晶片公司，供應高效能運算相關電源管理方案。" }
      ]
    },
    {
      id: "pcb",
      title: "PCB",
      layer: "ai-server",
      role: "讓伺服器內部訊號穩定傳輸，是高階伺服器的重要基板。",
      description: "AI 伺服器訊號速度快、層數高，對 PCB 材料和製程要求更高。",
      upstream: ["銅箔", "玻纖布", "樹脂", "高階材料"],
      downstream: ["廣達", "緯創", "緯穎", "交換器廠"],
      related: ["高階 PCB", "伺服器板", "網通板"],
      companies: [
        { id: "taiwan-union", name: "台燿", intro: "高頻高速材料供應商，受伺服器和網通 PCB 需求影響。" },
        { id: "gce", name: "金像電", intro: "伺服器 PCB 供應商，受 AI 伺服器出貨帶動。" },
        { id: "tripod", name: "健鼎", intro: "PCB 大廠，應用涵蓋伺服器、車用與電子產品。" },
        { id: "compeq", name: "華通", intro: "PCB 供應商，受電子產品和通訊設備需求影響。" }
      ]
    },
    {
      id: "ai-chips",
      title: "AI晶片",
      layer: "gpu",
      role: "設計 GPU、CPU、ASIC 和高速運算晶片，是 AI 算力的核心。",
      description: "AI 晶片決定模型訓練和推論速度，是 AI 供應鏈最受市場關注的環節。",
      upstream: ["台積電", "CoWoS 與先進封裝", "HBM 記憶體", "ABF 載板"],
      downstream: ["AI 伺服器", "雲端資料中心", "AI 模型公司"],
      related: ["GPU", "ASIC", "AI 加速器", "高速運算"],
      companies: [
        { id: "nvidia", name: "NVIDIA", intro: "AI GPU 龍頭，資料中心 AI 訓練和推論需求核心。" },
        { id: "amd", name: "AMD", intro: "提供 AI GPU 與伺服器 CPU，和 NVIDIA 競爭高階運算市場。" },
        { id: "intel", name: "Intel", intro: "CPU 與 AI 加速器供應商，也布局晶圓代工與資料中心平台。" },
        { id: "broadcom", name: "Broadcom", intro: "客製化 AI 晶片、網通晶片和高速連接相關公司。" },
        { id: "marvell", name: "Marvell", intro: "資料中心、網通與客製化晶片供應商，受 AI 互連需求帶動。" }
      ]
    },
    {
      id: "hbm",
      title: "HBM高頻寬記憶體",
      layer: "gpu",
      role: "提供 GPU 高速讀寫資料的能力，是 AI 晶片效能關鍵。",
      description: "AI GPU 需要大量資料快速進出，HBM 供給常影響 GPU 出貨節奏。",
      upstream: ["記憶體設備", "半導體材料", "先進封裝"],
      downstream: ["NVIDIA", "AMD", "AI 伺服器"],
      related: ["HBM", "DRAM", "記憶體報價", "AI GPU"],
      companies: [
        { id: "sk-hynix", name: "SK Hynix", intro: "HBM 主要供應商，受 AI GPU 出貨和 HBM 報價影響。" },
        { id: "samsung", name: "Samsung", intro: "記憶體與晶圓代工大廠，布局 HBM 與先進製程。" },
        { id: "micron-hbm", name: "Micron", intro: "美國記憶體大廠，受 HBM 和 DRAM 景氣循環影響。" },
        { id: "nanya-hbm", name: "南亞科", intro: "台灣 DRAM 公司，屬記憶體循環相關概念股。" }
      ]
    },
    {
      id: "memory",
      title: "一般記憶體",
      layer: "gpu",
      role: "提供伺服器與終端設備所需的 DRAM、Flash 等記憶體。",
      description: "一般記憶體不一定直接等於 HBM，但會受 AI 帶動伺服器需求與景氣循環影響。",
      upstream: ["半導體設備", "材料", "晶圓製造"],
      downstream: ["AI 伺服器", "PC", "手機", "工控設備"],
      related: ["DRAM", "NAND", "NOR Flash", "記憶體循環"],
      companies: [
        { id: "nanya-memory", name: "南亞科", intro: "DRAM 記憶體循環相關，受報價和景氣影響。" },
        { id: "winbond", name: "華邦電", intro: "利基型記憶體供應商，應用於工控、車用和消費電子。" },
        { id: "macronix", name: "旺宏", intro: "NOR Flash 與記憶體產品供應商，受終端需求影響。" },
        { id: "micron-memory", name: "Micron", intro: "全球記憶體大廠，受 DRAM、NAND 和 HBM 需求影響。" }
      ]
    },
    {
      id: "abf",
      title: "ABF載板",
      layer: "advanced-packaging",
      role: "連接高階晶片與主板，是 GPU、CPU 和高階封裝的重要載體。",
      description: "高階 AI 晶片需要更複雜的載板，ABF 載板需求會跟 AI 晶片規格升級有關。",
      upstream: ["ABF 材料", "銅箔", "玻纖布"],
      downstream: ["NVIDIA", "AMD", "台積電", "日月光"],
      related: ["ABF", "載板", "高階封裝", "AI 晶片"],
      companies: [
        { id: "unimicron-abf", name: "欣興", intro: "ABF 載板與 PCB 供應商，受高階晶片封裝需求帶動。" },
        { id: "kinsus", name: "景碩", intro: "IC 載板供應商，受高階晶片與封裝需求影響。" },
        { id: "nan-ya-pcb", name: "南電", intro: "載板供應商，受伺服器與高階晶片需求影響。" }
      ]
    },
    {
      id: "advanced-packaging",
      title: "CoWoS與先進封裝",
      layer: "advanced-packaging",
      role: "把 GPU、HBM 和載板整合，讓 AI 晶片能高速交換資料。",
      description: "CoWoS 是 AI 晶片供給的重要瓶頸之一，產能擴張會影響 GPU 出貨。",
      upstream: ["晶圓代工", "HBM", "ABF 載板", "封裝設備"],
      downstream: ["NVIDIA", "AMD", "AI 伺服器"],
      related: ["CoWoS", "先進封裝", "封測", "HBM"],
      companies: [
        { id: "tsmc-packaging", name: "台積電", intro: "CoWoS 和先進製程核心供應商，影響 AI 晶片供給。" },
        { id: "ase", name: "日月光", intro: "封測龍頭，參與先進封裝與晶片測試需求。" },
        { id: "powertech", name: "力成", intro: "封測服務供應商，受記憶體與高階封裝需求影響。" }
      ]
    },
    {
      id: "foundry",
      title: "晶圓代工",
      layer: "foundry",
      role: "把 AI 晶片設計真正製造成晶圓，是晶片落地的製造環節。",
      description: "先進製程產能會影響 AI GPU 供給，也會牽動整條 AI 伺服器供應鏈。",
      upstream: ["ASML", "Applied Materials", "Lam Research", "半導體材料"],
      downstream: ["NVIDIA", "AMD", "Broadcom", "Marvell", "CoWoS 封裝"],
      related: ["先進製程", "晶圓代工", "半導體設備"],
      companies: [
        { id: "tsmc-foundry", name: "台積電", intro: "全球先進製程代工龍頭，幫 AI 晶片客戶製造高階晶片。" },
        { id: "umc", name: "聯電", intro: "成熟製程晶圓代工廠，應用於多種電子與工業晶片。" },
        { id: "globalfoundries", name: "GlobalFoundries", intro: "成熟與特殊製程晶圓代工廠，服務車用、通訊和工業晶片。" }
      ]
    },
    {
      id: "equipment-materials",
      title: "設備與材料",
      layer: "equipment-materials",
      role: "提供製造晶片所需的設備、材料和化學品，是最底層供給來源。",
      description: "晶圓廠擴產需要設備與材料，AI 晶片需求若延續，這層也會受惠。",
      upstream: ["精密零件", "化學品", "光學元件", "材料供應"],
      downstream: ["台積電", "聯電", "GlobalFoundries", "Samsung"],
      related: ["半導體設備", "EUV", "材料", "晶圓廠擴產"],
      companies: [
        { id: "asml", name: "ASML", intro: "EUV 微影設備供應商，先進製程不可或缺。" },
        { id: "amat", name: "Applied Materials", intro: "半導體製程設備大廠，服務晶圓製造多個步驟。" },
        { id: "lam", name: "Lam Research", intro: "蝕刻與沉積設備供應商，受先進製程投資影響。" },
        { id: "tel", name: "Tokyo Electron", intro: "半導體設備供應商，參與晶圓製造與封裝設備鏈。" },
        { id: "shin-etsu", name: "信越化學", intro: "半導體矽晶圓與材料供應商。" },
        { id: "merck", name: "默克", intro: "半導體材料與化學品供應商。" }
      ]
    }
  ];

  base.industryStages = [
    {
      stage: "上游",
      summary: "做出 AI 算力的核心零件與製造能力。",
      items: [
        "AI晶片、HBM、一般記憶體，決定 AI 運算速度與資料吞吐量。",
        "CoWoS、ABF 載板、晶圓代工，決定高階晶片能不能大量出貨。",
        "設備與材料是最底層供給，晶圓廠擴產離不開這一層。"
      ]
    },
    {
      stage: "中游",
      summary: "把晶片、記憶體和零件組成 AI 伺服器。",
      items: [
        "伺服器 ODM 負責整機組裝與出貨。",
        "PCB、散熱、電源、機殼、網通與高速傳輸，讓 AI 伺服器穩定運作。",
        "這一層通常會跟雲端大廠資本支出一起被市場關注。"
      ]
    },
    {
      stage: "下游",
      summary: "把 AI 算力變成模型、雲端服務與實際應用。",
      items: [
        "雲端資料中心採購 AI 伺服器，出租算力給模型公司與企業。",
        "AI 軟體公司把算力變成模型和工具。",
        "AI 應用落地到自駕車、機器人、醫療、金融、教育和 AI Agent。"
      ]
    }
  ];

  base.themes = [
    {
      title: "AI 伺服器",
      impact: "高",
      explanation: "雲端大廠擴建資料中心，會帶動 ODM、散熱、電源、PCB、網通和機殼。",
      industries: ["伺服器ODM", "散熱", "電源", "PCB", "交換器與網通"],
      companies: ["廣達：AI 伺服器組裝", "緯穎：雲端資料中心伺服器", "台達電：電源與散熱", "金像電：伺服器 PCB"],
      tags: ["AI伺服器", "資料中心", "電源散熱"],
      focus: ["廣達", "緯創", "緯穎", "台達電", "奇鋐", "金像電"]
    },
    {
      title: "AI 晶片與 GPU",
      impact: "高",
      explanation: "AI 模型需要 GPU 和加速器，晶片需求會一路傳到代工、封裝、HBM 和載板。",
      industries: ["AI晶片", "晶圓代工", "CoWoS與先進封裝", "HBM高頻寬記憶體"],
      companies: ["NVIDIA：AI GPU 龍頭", "AMD：AI GPU / CPU", "台積電：先進製程代工", "SK Hynix：HBM 記憶體"],
      tags: ["GPU", "CoWoS", "HBM", "先進製程"],
      focus: ["NVIDIA", "AMD", "台積電", "SK Hynix"]
    },
    {
      title: "先進封裝瓶頸",
      impact: "高",
      explanation: "CoWoS 把 GPU 和 HBM 接在一起，產能如果吃緊，會影響 AI 晶片出貨。",
      industries: ["CoWoS與先進封裝", "ABF載板", "HBM高頻寬記憶體"],
      companies: ["台積電：CoWoS 核心", "日月光：封測", "欣興：ABF 載板", "景碩：IC 載板"],
      tags: ["CoWoS", "ABF", "封測"],
      focus: ["台積電", "日月光", "欣興", "景碩"]
    },
    {
      title: "記憶體循環",
      impact: "中",
      explanation: "AI 伺服器拉高 HBM 與 DRAM 需求，報價與庫存循環會影響記憶體股。",
      industries: ["HBM高頻寬記憶體", "一般記憶體"],
      companies: ["SK Hynix：HBM", "Samsung：記憶體與晶圓代工", "Micron：DRAM / HBM", "南亞科：DRAM"],
      tags: ["HBM", "DRAM", "記憶體報價"],
      focus: ["SK Hynix", "Samsung", "Micron", "南亞科", "華邦電", "旺宏"]
    },
    {
      title: "雲端資本支出",
      impact: "高",
      explanation: "AWS、Azure、Google Cloud、Oracle Cloud 若持續加碼 AI，整條供應鏈都會受關注。",
      industries: ["資料中心", "AI軟體", "伺服器ODM"],
      companies: ["Amazon AWS：雲端 AI 服務", "Microsoft Azure：AI 算力平台", "Google Cloud：AI 模型與資料平台", "Oracle Cloud：AI 基礎建設"],
      tags: ["Capex", "雲端", "資料中心"],
      focus: ["Amazon AWS", "Microsoft Azure", "Google Cloud", "Oracle Cloud"]
    },
    {
      title: "AI 應用落地",
      impact: "中",
      explanation: "當 AI 真正進入自駕、機器人、醫療、金融和教育，會回頭拉動模型和算力需求。",
      industries: ["AI應用", "AI軟體", "資料中心"],
      companies: ["OpenAI：生成式 AI", "Anthropic：Claude", "Google Gemini：多模態模型", "Meta AI：社群與廣告 AI"],
      tags: ["AI Agent", "AI醫療", "AI金融", "AI教育"],
      focus: ["OpenAI", "Anthropic", "Google Gemini", "Meta AI"]
    }
  ];

  base.supplyChain = {
    layerOrder,
    categories
  };

  const layerLabelById = Object.fromEntries(layerOrder.map((layer) => [layer.id, layer.label]));
  const quoteSymbolById = {
    openai: "",
    anthropic: "",
    "google-gemini": "GOOGL",
    "meta-ai": "META",
    aws: "AMZN",
    azure: "MSFT",
    "google-cloud": "GOOGL",
    "oracle-cloud": "ORCL",
    quanta: "2382.TW",
    wistron: "3231.TW",
    wiwynn: "6669.TW",
    inventec: "2356.TW",
    avc: "3017.TW",
    auras: "3324.TWO",
    sunon: "2421.TW",
    delta: "2308.TW",
    liteon: "2301.TW",
    chenbro: "8210.TW",
    chenming: "3013.TW",
    cisco: "CSCO",
    arista: "ANET",
    accton: "2345.TW",
    "wistron-neweb": "6285.TW",
    credo: "CRDO",
    "astera-labs": "ALAB",
    mps: "MPWR",
    "taiwan-union": "6274.TWO",
    gce: "2368.TW",
    tripod: "3044.TW",
    compeq: "2313.TW",
    nvidia: "NVDA",
    amd: "AMD",
    intel: "INTC",
    broadcom: "AVGO",
    marvell: "MRVL",
    "sk-hynix": "000660.KS",
    samsung: "005930.KS",
    "micron-hbm": "MU",
    "nanya-hbm": "2408.TW",
    "nanya-memory": "2408.TW",
    winbond: "2344.TW",
    macronix: "2337.TW",
    "micron-memory": "MU",
    "unimicron-abf": "3037.TW",
    kinsus: "3189.TW",
    "nan-ya-pcb": "8046.TW",
    "tsmc-packaging": "2330.TW",
    ase: "3711.TW",
    powertech: "6239.TW",
    "tsmc-foundry": "2330.TW",
    umc: "2303.TW",
    globalfoundries: "GFS",
    asml: "ASML",
    amat: "AMAT",
    lam: "LRCX",
    tel: "8035.T",
    "shin-etsu": "4063.T",
    merck: "MRK.DE"
  };

  base.searchAliases = {
    美光: ["Micron", "MU", "micron-hbm", "micron-memory"],
    輝達: ["NVIDIA", "NVDA", "英偉達"],
    英偉達: ["NVIDIA", "NVDA", "輝達"],
    超微: ["AMD", "Advanced Micro Devices"],
    英特爾: ["Intel", "INTC"],
    博通: ["Broadcom", "AVGO"],
    邁威爾: ["Marvell", "MRVL"],
    美滿: ["Marvell", "MRVL"],
    海力士: ["SK Hynix", "SK海力士", "000660.KS"],
    "SK海力士": ["SK Hynix", "海力士", "000660.KS"],
    三星: ["Samsung", "005930.KS"],
    微軟: ["Microsoft Azure", "Azure", "MSFT"],
    亞馬遜: ["Amazon AWS", "AWS", "AMZN"],
    谷歌: ["Google", "Google Cloud", "Google Gemini", "Alphabet", "GOOGL"],
    甲骨文: ["Oracle Cloud", "Oracle", "ORCL"],
    臉書: ["Meta", "Meta AI", "META", "Facebook"],
    思科: ["Cisco", "CSCO"],
    "安謀": ["Arm", "ARM"],
    "台積": ["台積電", "TSMC", "TSM", "2330.TW"],
    台積電: ["TSMC", "Taiwan Semiconductor", "2330.TW"],
    日月光投控: ["日月光", "ASE", "3711.TW"],
    聯電: ["UMC", "2303.TW"],
    格芯: ["GlobalFoundries", "GFS", "格羅方德"],
    格羅方德: ["GlobalFoundries", "GFS", "格芯"],
    艾司摩爾: ["ASML", "阿斯麥"],
    阿斯麥: ["ASML", "艾司摩爾"],
    應材: ["Applied Materials", "AMAT", "應用材料"],
    應用材料: ["Applied Materials", "AMAT", "應材"],
    科林研發: ["Lam Research", "LRCX", "泛林"],
    泛林: ["Lam Research", "LRCX", "科林研發"],
    東京威力: ["Tokyo Electron", "TEL", "8035.T"],
    信越: ["信越化學", "Shin-Etsu", "4063.T"],
    默克: ["Merck", "MRK.DE"],
    廣達: ["Quanta", "2382.TW"],
    緯創: ["Wistron", "3231.TW"],
    緯穎: ["Wiwynn", "6669.TW"],
    英業達: ["Inventec", "2356.TW"],
    奇鋐: ["AVC", "3017.TW"],
    雙鴻: ["Auras", "3324.TWO"],
    建準: ["Sunon", "2421.TW"],
    台達電: ["Delta", "Delta Electronics", "2308.TW"],
    光寶科: ["Lite-On", "Liteon", "2301.TW"],
    智邦: ["Accton", "2345.TW"],
    啟碁: ["Wistron NeWeb", "WNC", "6285.TW"],
    台燿: ["Taiwan Union", "TUC", "6274.TWO"],
    金像電: ["GCE", "2368.TW"],
    健鼎: ["Tripod", "3044.TW"],
    華通: ["Compeq", "2313.TW"],
    南亞科: ["Nanya", "Nanya Technology", "2408.TW"],
    華邦電: ["Winbond", "2344.TW"],
    旺宏: ["Macronix", "2337.TW"],
    欣興: ["Unimicron", "3037.TW"],
    景碩: ["Kinsus", "3189.TW"],
    南電: ["Nan Ya PCB", "8046.TW"],
    力成: ["Powertech", "PTI", "6239.TW"]
  };

  base.companies = categories
    .flatMap((category) => category.companies.map((company) => ({
      id: company.id,
      ticker: quoteSymbolById[company.id] || company.name,
      quoteSymbol: quoteSymbolById[company.id] || "",
      name: company.name,
      group: category.title,
      categoryId: category.id,
      categoryTitle: category.title,
      layer: category.layer,
      layerLabel: layerLabelById[category.layer] || category.layer,
      signal: category.layer,
      description: company.intro || category.description,
      intro: company.intro || category.description,
      role: company.role || category.role,
      upstream: company.upstream || category.upstream,
      downstream: company.downstream || category.downstream,
      related: company.related || category.related,
      type: company.type || "company"
    })))
    .filter((company) => company.type !== "concept");

  window.MARKET_MAP_DATA = base;
})();
