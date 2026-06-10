(function () {
  const base = window.MARKET_MAP_DATA || {};

  const layerOrder = [
    { id: "terminal-sales", label: "終端銷售", note: "把電子產品賣到消費者、企業或通路端。" },
    { id: "brands-devices", label: "品牌與終端產品", note: "決定產品規格、需求方向與供應鏈拉貨。" },
    { id: "ems-odm", label: "代工與系統組裝", note: "把零組件組成手機、PC、伺服器與各式電子產品。" },
    { id: "modules-components", label: "模組與關鍵零組件", note: "包含散熱、電源、被動元件、鏡頭、連接器與機構件。" },
    { id: "boards-connectors", label: "PCB / 載板 / 連接", note: "讓晶片、模組與整機能穩定傳輸訊號。" },
    { id: "semiconductors", label: "半導體與 IC", note: "提供運算、記憶體、通訊、類比與電源管理晶片。" },
    { id: "manufacturing-packaging", label: "晶圓製造與封測", note: "把晶片設計製造出來，並完成封裝與測試。" },
    { id: "equipment-materials", label: "設備與材料", note: "提供晶圓廠、封測廠與電子製造需要的設備和材料。" }
  ];

  const categories = [
    {
      id: "terminal-retail",
      title: "終端銷售與通路",
      layer: "terminal-sales",
      role: "最靠近消費者與企業採購端，能反映電子產品需求強弱。",
      description: "通路銷售好，品牌和代工廠才會補庫存；銷售轉弱時，上游拉貨也會變慢。",
      upstream: ["品牌商", "電商平台", "零售通路", "物流"],
      downstream: ["消費者", "企業採購", "教育與政府客戶"],
      related: ["消費電子", "通路庫存", "終端需求", "電商"],
      companies: [
        { id: "amazon-retail", name: "Amazon Retail", intro: "全球電商與雲端巨頭，電子產品銷售與 AWS 都會牽動供應鏈。" },
        { id: "best-buy", name: "Best Buy", intro: "美國消費電子零售商，可觀察 PC、手機、家電與遊戲機需求。" },
        { id: "costco", name: "Costco", intro: "大型會員制零售商，銷售家電、電腦和消費電子產品。" },
        { id: "walmart", name: "Walmart", intro: "美國大型零售商，電子產品銷售可反映大眾消費力。" },
        { id: "momo", name: "momo富邦媒", intro: "台灣電商平台，銷售手機、電腦、家電與生活電子產品。" }
      ]
    },
    {
      id: "brands-devices",
      title: "品牌與終端產品",
      layer: "brands-devices",
      role: "定義手機、PC、遊戲機、穿戴裝置與家電規格，影響上游零件需求。",
      description: "品牌新品週期、庫存水位和銷售預期，會一路影響代工、零組件和半導體。",
      upstream: ["代工廠", "半導體", "面板", "鏡頭", "電池與機構件"],
      downstream: ["通路商", "電信商", "企業客戶", "消費者"],
      related: ["手機", "PC", "遊戲機", "家電", "穿戴裝置"],
      companies: [
        { id: "apple", name: "Apple", intro: "iPhone、Mac、iPad 與穿戴裝置品牌，供應鏈影響力很大。" },
        { id: "samsung-electronics", name: "Samsung Electronics", intro: "手機、電視、家電、記憶體與面板相關龍頭。" },
        { id: "sony", name: "Sony", intro: "遊戲機、影像感測器、影音娛樂與消費電子品牌。" },
        { id: "dell", name: "Dell", intro: "PC、伺服器與企業 IT 設備品牌。" },
        { id: "hp", name: "HP", intro: "PC 與印表機品牌，反映商用與消費 PC 需求。" },
        { id: "lenovo", name: "Lenovo", intro: "全球 PC 品牌，也布局伺服器與企業設備。" },
        { id: "asus", name: "華碩", intro: "台灣 PC、主機板、電競與伺服器品牌。" },
        { id: "acer", name: "宏碁", intro: "台灣 PC、顯示器與商用電腦品牌。" }
      ]
    },
    {
      id: "ems-odm",
      title: "電子代工 / ODM",
      layer: "ems-odm",
      role: "替品牌客戶設計、製造與組裝電子產品，是上游零件需求的集中入口。",
      description: "代工廠訂單能反映手機、PC、伺服器與消費電子景氣。",
      upstream: ["半導體", "PCB", "被動元件", "鏡頭", "機構件"],
      downstream: ["Apple", "Dell", "HP", "雲端客戶", "品牌商"],
      related: ["EMS", "ODM", "組裝", "庫存循環"],
      companies: [
        { id: "hon-hai", name: "鴻海", intro: "全球電子代工龍頭，服務手機、伺服器、電動車與消費電子客戶。" },
        { id: "pegatron", name: "和碩", intro: "電子代工廠，參與手機、PC、通訊與消費電子組裝。" },
        { id: "quanta", name: "廣達", intro: "筆電與伺服器 ODM 大廠，AI 伺服器和雲端訂單是市場焦點。" },
        { id: "compal", name: "仁寶", intro: "筆電與智慧裝置代工廠，受 PC 與終端需求影響。" },
        { id: "wistron", name: "緯創", intro: "PC、伺服器與電子產品代工，參與 AI 伺服器供應鏈。" },
        { id: "inventec", name: "英業達", intro: "伺服器與 PC 代工廠，受企業設備與資料中心需求影響。" },
        { id: "jabil", name: "Jabil", intro: "全球 EMS 廠，服務工業、醫療、消費電子與通訊客戶。" },
        { id: "flex", name: "Flex", intro: "全球電子製造服務公司，產品橫跨通訊、工業與消費電子。" }
      ]
    },
    {
      id: "server-network",
      title: "伺服器、網通與資料中心",
      layer: "ems-odm",
      role: "把晶片、記憶體、電源、散熱、網路設備組成企業與資料中心設備。",
      description: "雲端與企業 IT 投資會帶動伺服器、交換器、路由器與資料中心設備。",
      upstream: ["GPU", "CPU", "記憶體", "電源", "散熱", "PCB"],
      downstream: ["雲端資料中心", "企業客戶", "電信商"],
      related: ["伺服器", "交換器", "資料中心", "網通設備"],
      companies: [
        { id: "wiwynn", name: "緯穎", intro: "雲端資料中心伺服器供應商，受大型雲端客戶投資影響。" },
        { id: "supermicro", name: "Supermicro", intro: "伺服器與資料中心設備供應商，受 AI 與企業伺服器需求帶動。" },
        { id: "cisco", name: "Cisco", intro: "網通設備龍頭，提供企業與資料中心網路設備。" },
        { id: "arista", name: "Arista", intro: "資料中心交換器供應商，受大型雲端資料中心需求帶動。" },
        { id: "accton", name: "智邦", intro: "交換器與網通設備供應商，受資料中心網路升級影響。" },
        { id: "wistron-neweb", name: "啟碁", intro: "網通設備與通訊模組供應商，參與雲端與企業網路鏈。" },
        { id: "ubiquiti", name: "Ubiquiti", intro: "網路設備品牌，產品涵蓋企業、家庭與無線網路設備。" }
      ]
    },
    {
      id: "passive-optics-connectors",
      title: "被動元件、鏡頭與連接器",
      layer: "modules-components",
      role: "提供電子產品穩定運作需要的基礎零件與感測模組。",
      description: "被動元件、鏡頭、連接器和模組通常跟手機、PC、車用與伺服器需求一起循環。",
      upstream: ["陶瓷粉末", "金屬材料", "玻璃與光學材料", "塑膠與端子"],
      downstream: ["品牌商", "代工廠", "汽車電子", "工業設備"],
      related: ["MLCC", "電感", "鏡頭", "連接器", "感測器"],
      companies: [
        { id: "yageo", name: "國巨", intro: "被動元件大廠，產品包含 MLCC、電阻與電感。" },
        { id: "walsin-tech", name: "華新科", intro: "被動元件供應商，受消費電子、車用與工業需求影響。" },
        { id: "murata", name: "Murata", intro: "日本被動元件龍頭，供應 MLCC、濾波器與模組。" },
        { id: "tdk", name: "TDK", intro: "被動元件、磁性材料、電池與感測元件供應商。" },
        { id: "largan", name: "大立光", intro: "高階手機鏡頭供應商，受旗艦手機規格升級影響。" },
        { id: "genius", name: "玉晶光", intro: "光學鏡頭供應商，應用於手機與消費電子。" },
        { id: "sunny-optical", name: "舜宇光學", intro: "光學鏡頭與相機模組供應商，服務手機與車用客戶。" },
        { id: "lotes", name: "嘉澤", intro: "連接器供應商，受伺服器、PC 與高速傳輸需求影響。" }
      ]
    },
    {
      id: "thermal-power-mechanical",
      title: "散熱、電源與機構件",
      layer: "modules-components",
      role: "讓電子產品穩定供電、散熱與承載，尤其在高功耗設備中更重要。",
      description: "伺服器、PC、遊戲機與高階手機規格升級，常帶動散熱、電源和機構件。",
      upstream: ["功率元件", "金屬材料", "風扇零件", "電源管理 IC"],
      downstream: ["伺服器 ODM", "品牌商", "資料中心", "PC 與工業設備"],
      related: ["電源供應器", "液冷", "風扇", "機殼", "機構件"],
      companies: [
        { id: "delta", name: "台達電", intro: "電源與散熱重點廠，資料中心、工業與電動車都是重要應用。" },
        { id: "liteon", name: "光寶科", intro: "電源供應器與電子零組件供應商，參與伺服器與消費電子供應鏈。" },
        { id: "avc", name: "奇鋐", intro: "散熱模組供應商，受伺服器高功耗與液冷趨勢帶動。" },
        { id: "auras", name: "雙鴻", intro: "散熱解決方案公司，關注伺服器、PC 與高階電子散熱需求。" },
        { id: "sunon", name: "建準", intro: "風扇與散熱零件供應商，應用於資料中心、工業與電子設備。" },
        { id: "chenbro", name: "勤誠", intro: "伺服器機殼與機櫃供應商，受資料中心建置影響。" },
        { id: "chicony-power", name: "群電", intro: "電源供應器供應商，應用於 PC、伺服器與消費電子。" }
      ]
    },
    {
      id: "pcb-substrate",
      title: "PCB、載板與高頻材料",
      layer: "boards-connectors",
      role: "讓晶片、零件與系統能高速傳輸訊號，是電子產品的骨架。",
      description: "伺服器、網通、手機和車用電子升級，會提高 PCB 層數、材料和載板需求。",
      upstream: ["銅箔", "玻纖布", "樹脂", "ABF 材料"],
      downstream: ["代工廠", "封測廠", "伺服器", "手機與車用電子"],
      related: ["PCB", "ABF載板", "IC載板", "高頻材料"],
      companies: [
        { id: "unimicron-abf", name: "欣興", intro: "ABF 載板與 PCB 供應商，受高階晶片封裝需求帶動。" },
        { id: "kinsus", name: "景碩", intro: "IC 載板供應商，受高階晶片與封裝需求影響。" },
        { id: "nan-ya-pcb", name: "南電", intro: "載板供應商，受伺服器與高階晶片需求影響。" },
        { id: "gce", name: "金像電", intro: "伺服器 PCB 供應商，受 AI 伺服器與網通設備出貨帶動。" },
        { id: "tripod", name: "健鼎", intro: "PCB 大廠，應用涵蓋伺服器、車用與電子產品。" },
        { id: "compeq", name: "華通", intro: "PCB 供應商，受電子產品和通訊設備需求影響。" },
        { id: "zhen-ding", name: "臻鼎-KY", intro: "PCB 與軟板大廠，服務手機、穿戴裝置與伺服器客戶。" },
        { id: "ibiden", name: "Ibiden", intro: "日本 IC 載板供應商，受高階 CPU、GPU 與封裝需求影響。" }
      ]
    },
    {
      id: "ic-design",
      title: "IC 設計與晶片",
      layer: "semiconductors",
      role: "提供電子產品的大腦，包含運算、通訊、類比、電源管理與顯示晶片。",
      description: "IC 設計需求會受手機、PC、車用、資料中心與工業景氣影響。",
      upstream: ["晶圓代工", "封測", "EDA", "IP"],
      downstream: ["品牌商", "代工廠", "資料中心", "車用與工業客戶"],
      related: ["GPU", "CPU", "手機晶片", "網通晶片", "類比 IC"],
      companies: [
        { id: "nvidia", name: "NVIDIA", intro: "GPU 與加速運算晶片龍頭，資料中心與 AI 是主要需求來源。" },
        { id: "amd", name: "AMD", intro: "CPU、GPU 與資料中心晶片供應商。" },
        { id: "intel", name: "Intel", intro: "CPU、資料中心平台與晶圓代工布局公司。" },
        { id: "broadcom", name: "Broadcom", intro: "網通晶片、客製化晶片與基礎架構軟體公司。" },
        { id: "marvell", name: "Marvell", intro: "資料中心、網通與儲存相關晶片供應商。" },
        { id: "qualcomm", name: "Qualcomm", intro: "手機處理器、通訊晶片與車用平台供應商。" },
        { id: "mediatek", name: "聯發科", intro: "手機、電視、Wi-Fi 與多媒體晶片設計公司。" },
        { id: "realtek", name: "瑞昱", intro: "網路、音訊、PC 周邊與通訊晶片供應商。" },
        { id: "novatek", name: "聯詠", intro: "顯示驅動與影像處理 IC 供應商。" },
        { id: "mps", name: "MPS", intro: "電源管理與類比晶片公司，應用於資料中心、車用與工業。" }
      ]
    },
    {
      id: "memory-storage",
      title: "記憶體與儲存",
      layer: "semiconductors",
      role: "提供資料暫存與儲存能力，是手機、PC、伺服器和工業設備的必要零件。",
      description: "記憶體價格與庫存循環，常會影響整個電子族群景氣判斷。",
      upstream: ["半導體設備", "材料", "晶圓製造", "封測"],
      downstream: ["伺服器", "PC", "手機", "消費電子", "工業設備"],
      related: ["DRAM", "NAND", "HBM", "NOR Flash", "記憶體報價"],
      companies: [
        { id: "sk-hynix", name: "SK Hynix", intro: "記憶體大廠，HBM、DRAM 與 NAND 是主要產品。" },
        { id: "micron-memory", name: "Micron", intro: "美國記憶體大廠，受 DRAM、NAND 和 HBM 需求影響。" },
        { id: "nanya-memory", name: "南亞科", intro: "DRAM 記憶體供應商，受報價和景氣循環影響。" },
        { id: "winbond", name: "華邦電", intro: "利基型記憶體供應商，應用於工控、車用和消費電子。" },
        { id: "macronix", name: "旺宏", intro: "NOR Flash 與記憶體產品供應商，受終端需求影響。" }
      ]
    },
    {
      id: "foundry-packaging",
      title: "晶圓代工與封測",
      layer: "manufacturing-packaging",
      role: "把 IC 設計製造成晶片，再完成封裝、測試和出貨。",
      description: "晶圓代工與封測是半導體供應鏈的製造核心，產能與價格會影響整條電子鏈。",
      upstream: ["設備", "材料", "化學品", "矽晶圓"],
      downstream: ["IC 設計", "品牌商", "代工廠", "汽車與工業客戶"],
      related: ["晶圓代工", "封測", "先進封裝", "成熟製程"],
      companies: [
        { id: "tsmc-foundry", name: "台積電", intro: "全球先進製程代工龍頭，服務 AI、手機、PC 與車用晶片客戶。" },
        { id: "umc", name: "聯電", intro: "成熟製程晶圓代工廠，應用於多種電子與工業晶片。" },
        { id: "globalfoundries", name: "GlobalFoundries", intro: "成熟與特殊製程晶圓代工廠，服務車用、通訊和工業晶片。" },
        { id: "ase", name: "日月光", intro: "封測龍頭，參與先進封裝與晶片測試需求。" },
        { id: "powertech", name: "力成", intro: "封測服務供應商，受記憶體與高階封裝需求影響。" },
        { id: "amkor", name: "Amkor", intro: "全球封測服務公司，提供封裝、測試與先進封裝服務。" }
      ]
    },
    {
      id: "equipment-materials",
      title: "半導體設備與材料",
      layer: "equipment-materials",
      role: "提供晶圓廠與封測廠擴產需要的機台、材料和耗材。",
      description: "當半導體廠擴產或製程升級時，設備與材料通常最先受關注。",
      upstream: ["精密零件", "光學元件", "化學品", "材料供應"],
      downstream: ["晶圓代工", "記憶體廠", "封測廠"],
      related: ["EUV", "蝕刻", "沉積", "量測", "矽晶圓"],
      companies: [
        { id: "asml", name: "ASML", intro: "EUV 微影設備供應商，先進製程不可或缺。" },
        { id: "amat", name: "Applied Materials", intro: "半導體製程設備大廠，服務晶圓製造多個步驟。" },
        { id: "lam", name: "Lam Research", intro: "蝕刻與沉積設備供應商，受製程投資影響。" },
        { id: "tel", name: "Tokyo Electron", intro: "半導體設備供應商，參與晶圓製造與封裝設備鏈。" },
        { id: "kla", name: "KLA", intro: "半導體檢測與量測設備公司，協助提高晶片良率。" },
        { id: "advantest", name: "Advantest", intro: "半導體測試設備公司，受高階晶片測試需求影響。" },
        { id: "shin-etsu", name: "信越化學", intro: "半導體矽晶圓與材料供應商。" }
      ]
    }
  ];

  base.todayFocus = [
    { label: "今日最重要事件", title: "先看利率、匯率與大型科技股", body: "電子股常受美元利率、台幣匯率和大型科技股表現影響。", impact: "high" },
    { label: "熱門題材", title: "半導體、PCB、散熱、電源輪動", body: "留意漲幅是否從晶片擴散到零組件、代工和通路。", impact: "medium" },
    { label: "台股觀察重點", title: "權值半導體與電子零組件", body: "台積電、代工、PCB、被動元件、散熱和電源是電子族群核心。", impact: "high" },
    { label: "美股觀察重點", title: "科技品牌、半導體與零售端需求", body: "Apple、NVIDIA、Amazon、Best Buy 等能反映終端需求與供應鏈信心。", impact: "medium" },
    { label: "風險提醒", title: "庫存、匯率、關稅與終端需求", body: "如果通路庫存升高或品牌砍單，上游零件可能比股價更早感受到壓力。", impact: "medium" }
  ];

  base.industryStages = [
    {
      stage: "上游",
      summary: "設備、材料、晶圓製造、IC 設計與基礎零件。",
      items: [
        "半導體設備與材料決定晶圓廠能不能擴產。",
        "IC 設計、晶圓代工、封測和記憶體是電子產品的核心。",
        "PCB、載板、被動元件、鏡頭、連接器是整機不可缺的基礎零件。"
      ]
    },
    {
      stage: "中游",
      summary: "把零件組成模組、主板、整機和資料中心設備。",
      items: [
        "代工與 ODM 負責手機、PC、伺服器和各式電子產品組裝。",
        "散熱、電源、機構件和網通設備讓系統穩定運作。",
        "中游訂單通常能反映品牌商拉貨與庫存變化。"
      ]
    },
    {
      stage: "下游",
      summary: "品牌、通路和終端消費需求。",
      items: [
        "品牌商決定新品規格，也影響上游零件採購。",
        "通路銷售與庫存能判斷終端需求是否健康。",
        "企業採購、電商促銷和消費信心會影響整條電子供應鏈。"
      ]
    }
  ];

  base.themes = [
    {
      title: "半導體製造升級",
      impact: "高",
      explanation: "製程升級與擴產會帶動設備、材料、晶圓代工與封測。",
      industries: ["半導體設備與材料", "晶圓代工與封測", "IC 設計與晶片"],
      companies: ["ASML：EUV 設備", "台積電：晶圓代工", "日月光：封測", "Applied Materials：製程設備"],
      tags: ["半導體設備", "晶圓代工", "封測", "材料"],
      focus: ["ASML", "台積電", "日月光", "Applied Materials", "Lam Research"]
    },
    {
      title: "電子零組件復甦",
      impact: "中",
      explanation: "手機、PC 和伺服器需求回溫時，被動元件、鏡頭、連接器和 PCB 會一起受惠。",
      industries: ["被動元件、鏡頭與連接器", "PCB、載板與高頻材料"],
      companies: ["國巨：被動元件", "大立光：手機鏡頭", "嘉澤：連接器", "欣興：載板"],
      tags: ["被動元件", "鏡頭", "PCB", "連接器"],
      focus: ["國巨", "華新科", "大立光", "嘉澤", "欣興"]
    },
    {
      title: "伺服器與資料中心",
      impact: "高",
      explanation: "企業和雲端資本支出會帶動伺服器、散熱、電源、網通和 PCB。",
      industries: ["伺服器、網通與資料中心", "散熱、電源與機構件", "PCB、載板與高頻材料"],
      companies: ["緯穎：資料中心伺服器", "Supermicro：伺服器", "台達電：電源", "Arista：交換器"],
      tags: ["伺服器", "資料中心", "散熱", "電源"],
      focus: ["緯穎", "Supermicro", "台達電", "Arista", "智邦"]
    },
    {
      title: "PC 與手機換機週期",
      impact: "中",
      explanation: "新品週期與促銷季會影響品牌、代工、鏡頭、IC 和通路銷售。",
      industries: ["品牌與終端產品", "電子代工 / ODM", "終端銷售與通路"],
      companies: ["Apple：手機與電腦", "華碩：PC 品牌", "鴻海：代工", "Best Buy：電子通路"],
      tags: ["手機", "PC", "換機潮", "消費電子"],
      focus: ["Apple", "華碩", "鴻海", "Best Buy", "momo富邦媒"]
    },
    {
      title: "記憶體與儲存循環",
      impact: "中",
      explanation: "DRAM、NAND、HBM 報價變化會影響記憶體股和伺服器成本。",
      industries: ["記憶體與儲存", "半導體設備與材料"],
      companies: ["Micron：DRAM / NAND", "SK Hynix：記憶體", "南亞科：DRAM", "華邦電：利基型記憶體"],
      tags: ["DRAM", "NAND", "HBM", "記憶體報價"],
      focus: ["Micron", "SK Hynix", "南亞科", "華邦電", "旺宏"]
    },
    {
      title: "終端銷售與庫存",
      impact: "中",
      explanation: "通路銷售、電商促銷和庫存水位，會回頭影響品牌與上游拉貨。",
      industries: ["終端銷售與通路", "品牌與終端產品"],
      companies: ["Amazon Retail：電商", "Best Buy：電子零售", "Costco：通路", "momo富邦媒：台灣電商"],
      tags: ["電商", "通路庫存", "消費電子", "終端需求"],
      focus: ["Amazon Retail", "Best Buy", "Costco", "momo富邦媒"]
    }
  ];

  const quoteSymbolById = {
    "amazon-retail": "AMZN",
    "best-buy": "BBY",
    costco: "COST",
    walmart: "WMT",
    momo: "8454.TW",
    apple: "AAPL",
    "samsung-electronics": "005930.KS",
    sony: "SONY",
    dell: "DELL",
    hp: "HPQ",
    lenovo: "0992.HK",
    asus: "2357.TW",
    acer: "2353.TW",
    "hon-hai": "2317.TW",
    pegatron: "4938.TW",
    quanta: "2382.TW",
    compal: "2324.TW",
    wistron: "3231.TW",
    inventec: "2356.TW",
    jabil: "JBL",
    flex: "FLEX",
    wiwynn: "6669.TW",
    supermicro: "SMCI",
    cisco: "CSCO",
    arista: "ANET",
    accton: "2345.TW",
    "wistron-neweb": "6285.TW",
    ubiquiti: "UI",
    yageo: "2327.TW",
    "walsin-tech": "2492.TW",
    murata: "6981.T",
    tdk: "6762.T",
    largan: "3008.TW",
    genius: "3406.TW",
    "sunny-optical": "2382.HK",
    lotes: "3533.TW",
    delta: "2308.TW",
    liteon: "2301.TW",
    avc: "3017.TW",
    auras: "3324.TWO",
    sunon: "2421.TW",
    chenbro: "8210.TW",
    "chicony-power": "6412.TW",
    "unimicron-abf": "3037.TW",
    kinsus: "3189.TW",
    "nan-ya-pcb": "8046.TW",
    gce: "2368.TW",
    tripod: "3044.TW",
    compeq: "2313.TW",
    "zhen-ding": "4958.TW",
    ibiden: "4062.T",
    nvidia: "NVDA",
    amd: "AMD",
    intel: "INTC",
    broadcom: "AVGO",
    marvell: "MRVL",
    qualcomm: "QCOM",
    mediatek: "2454.TW",
    realtek: "2379.TW",
    novatek: "3034.TW",
    mps: "MPWR",
    "sk-hynix": "000660.KS",
    "micron-memory": "MU",
    "nanya-memory": "2408.TW",
    winbond: "2344.TW",
    macronix: "2337.TW",
    "tsmc-foundry": "2330.TW",
    umc: "2303.TW",
    globalfoundries: "GFS",
    ase: "3711.TW",
    powertech: "6239.TW",
    amkor: "AMKR",
    asml: "ASML",
    amat: "AMAT",
    lam: "LRCX",
    tel: "8035.T",
    kla: "KLAC",
    advantest: "6857.T",
    "shin-etsu": "4063.T"
  };

  base.searchAliases = {
    ...(base.searchAliases || {}),
    電商: ["Amazon Retail", "momo富邦媒", "Best Buy", "終端銷售"],
    通路: ["終端銷售", "Best Buy", "Costco", "Walmart", "momo富邦媒"],
    富邦媒: ["momo富邦媒", "8454.TW"],
    亞馬遜: ["Amazon Retail", "AWS", "AMZN"],
    百思買: ["Best Buy", "BBY"],
    好市多: ["Costco", "COST"],
    蘋果: ["Apple", "AAPL"],
    三星: ["Samsung Electronics", "005930.KS"],
    索尼: ["Sony", "SONY"],
    聯想: ["Lenovo", "0992.HK"],
    華碩: ["ASUS", "2357.TW"],
    宏碁: ["Acer", "2353.TW"],
    鴻海: ["Hon Hai", "Foxconn", "2317.TW"],
    富士康: ["鴻海", "Hon Hai", "Foxconn"],
    和碩: ["Pegatron", "4938.TW"],
    廣達: ["Quanta", "2382.TW"],
    仁寶: ["Compal", "2324.TW"],
    緯創: ["Wistron", "3231.TW"],
    英業達: ["Inventec", "2356.TW"],
    緯穎: ["Wiwynn", "6669.TW"],
    美超微: ["Supermicro", "SMCI"],
    思科: ["Cisco", "CSCO"],
    智邦: ["Accton", "2345.TW"],
    啟碁: ["Wistron NeWeb", "WNC", "6285.TW"],
    國巨: ["Yageo", "2327.TW", "被動元件"],
    華新科: ["Walsin Tech", "2492.TW", "被動元件"],
    村田: ["Murata", "6981.T", "被動元件"],
    大立光: ["Largan", "3008.TW", "鏡頭"],
    玉晶光: ["Genius", "3406.TW", "鏡頭"],
    舜宇: ["Sunny Optical", "2382.HK", "鏡頭"],
    嘉澤: ["Lotes", "3533.TW", "連接器"],
    台達電: ["Delta", "Delta Electronics", "2308.TW"],
    光寶科: ["Lite-On", "Liteon", "2301.TW"],
    奇鋐: ["AVC", "3017.TW"],
    雙鴻: ["Auras", "3324.TWO"],
    建準: ["Sunon", "2421.TW"],
    勤誠: ["Chenbro", "8210.TW"],
    群電: ["Chicony Power", "6412.TW"],
    欣興: ["Unimicron", "3037.TW"],
    景碩: ["Kinsus", "3189.TW"],
    南電: ["Nan Ya PCB", "8046.TW"],
    金像電: ["GCE", "2368.TW"],
    健鼎: ["Tripod", "3044.TW"],
    華通: ["Compeq", "2313.TW"],
    臻鼎: ["Zhen Ding", "4958.TW"],
    輝達: ["NVIDIA", "NVDA", "英偉達"],
    英偉達: ["NVIDIA", "NVDA", "輝達"],
    超微: ["AMD", "Advanced Micro Devices"],
    英特爾: ["Intel", "INTC"],
    博通: ["Broadcom", "AVGO"],
    高通: ["Qualcomm", "QCOM"],
    聯發科: ["MediaTek", "2454.TW"],
    瑞昱: ["Realtek", "2379.TW"],
    聯詠: ["Novatek", "3034.TW"],
    美光: ["Micron", "MU", "micron-memory"],
    海力士: ["SK Hynix", "SK海力士", "000660.KS"],
    南亞科: ["Nanya", "Nanya Technology", "2408.TW"],
    華邦電: ["Winbond", "2344.TW"],
    旺宏: ["Macronix", "2337.TW"],
    台積: ["台積電", "TSMC", "2330.TW"],
    台積電: ["TSMC", "Taiwan Semiconductor", "2330.TW"],
    聯電: ["UMC", "2303.TW"],
    格芯: ["GlobalFoundries", "GFS"],
    日月光: ["ASE", "3711.TW"],
    力成: ["Powertech", "6239.TW"],
    艾司摩爾: ["ASML", "阿斯麥"],
    阿斯麥: ["ASML", "艾司摩爾"],
    應材: ["Applied Materials", "AMAT", "應用材料"],
    應用材料: ["Applied Materials", "AMAT", "應材"],
    泛林: ["Lam Research", "LRCX"],
    東京威力: ["Tokyo Electron", "8035.T"],
    科磊: ["KLA", "KLAC"],
    愛德萬: ["Advantest", "6857.T"],
    信越: ["信越化學", "Shin-Etsu", "4063.T"]
  };

  base.marketDashboard = {
    groups: [
      {
        id: "sentiment",
        title: "市場情緒",
        note: "先看大盤、半導體和 VIX，判斷資金是想進攻還是先防守。",
        indicators: [
          {
            id: "twii",
            name: "台股加權指數",
            symbol: "^TWII",
            unit: "點",
            plain: "台股大盤溫度計，電子權值股影響很大。",
            up: { read: "台股買盤偏強，電子與權值股較有支撐。", benefit: ["台股電子", "半導體", "ETF"], hurt: ["防禦型族群"] },
            down: { read: "台股承壓，短線資金偏保守。", benefit: ["現金部位", "防禦型族群"], hurt: ["台股電子", "中小型股"] }
          },
          {
            id: "sox",
            name: "費城半導體指數 SOX",
            symbol: "^SOX",
            unit: "點",
            plain: "全球半導體股的情緒指標。",
            up: { read: "半導體風向偏熱，晶片、設備、封測較容易被關注。", benefit: ["IC 設計", "晶圓代工", "半導體設備"], hurt: ["低成長防禦股"] },
            down: { read: "半導體資金降溫，電子供應鏈容易跟著震盪。", benefit: ["避險資產"], hurt: ["晶片股", "封測", "PCB 載板"] }
          },
          {
            id: "nasdaq",
            name: "NASDAQ",
            symbol: "^IXIC",
            unit: "點",
            plain: "美國科技股和成長股的代表指標。",
            up: { read: "科技股風險胃納較好，成長題材較容易有買盤。", benefit: ["科技股", "AI", "軟體"], hurt: ["傳產防禦股"] },
            down: { read: "科技股承壓，市場可能先降低高估值部位。", benefit: ["現金", "公債"], hurt: ["成長股", "AI 概念股"] }
          },
          {
            id: "sp500",
            name: "S&P500",
            symbol: "^GSPC",
            unit: "點",
            plain: "美股大盤代表，觀察整體風險偏好。",
            up: { read: "美股大盤偏穩，市場情緒較不緊張。", benefit: ["大型股", "全球 ETF"], hurt: ["避險部位"] },
            down: { read: "美股大盤轉弱，資金可能先降風險。", benefit: ["防禦股", "現金"], hurt: ["景氣循環股", "科技股"] }
          },
          {
            id: "vix",
            name: "VIX 恐慌指數",
            symbol: "^VIX",
            unit: "點",
            inverse: true,
            plain: "VIX 越高，市場越緊張。",
            up: { read: "恐慌升溫，投資人偏向避險。", benefit: ["現金", "黃金", "防禦股"], hurt: ["科技股", "中小型股", "高波動題材"] },
            down: { read: "恐慌降溫，資金比較願意承擔風險。", benefit: ["科技股", "成長股", "半導體"], hurt: ["避險部位"] }
          }
        ]
      },
      {
        id: "rates",
        title: "利率與匯率",
        note: "利率看資金成本，匯率看出口、進口與外資動向。",
        indicators: [
          {
            id: "us10y",
            name: "美國10年公債殖利率",
            symbol: "^TNX",
            unit: "%",
            display: "yield",
            plain: "長天期利率，常影響科技股估值。",
            up: { read: "長天期利率上升，市場對科技股估值較挑剔。", benefit: ["金融股", "美元資產"], hurt: ["科技股", "成長股", "REITs"] },
            down: { read: "利率壓力下降，成長股估值壓力減輕。", benefit: ["科技股", "成長股", "公債"], hurt: ["金融股"] }
          },
          {
            id: "us2y",
            name: "美國2年公債殖利率",
            externalId: "us2y",
            unit: "%",
            display: "yield",
            plain: "短天期利率，反映市場對聯準會政策的想像。",
            up: { read: "短利率上升，市場可能擔心降息變慢。", benefit: ["美元", "短債收益"], hurt: ["科技股", "高負債公司"] },
            down: { read: "短利率下降，市場覺得政策壓力可能變小。", benefit: ["科技股", "成長股"], hurt: ["金融股"] }
          },
          {
            id: "dxy",
            name: "美元指數 DXY",
            symbol: "DX-Y.NYB",
            unit: "點",
            plain: "美元強弱會影響資金流、原物料與新興市場。",
            up: { read: "美元轉強，資金偏向美元資產。", benefit: ["美元資產", "出口收美元公司"], hurt: ["原物料", "新興市場"] },
            down: { read: "美元轉弱，資金比較有機會流向非美市場。", benefit: ["新興市場", "原物料", "台股外資"], hurt: ["美元資產"] }
          },
          {
            id: "usdtwd",
            name: "美元兌台幣",
            symbol: "TWD=X",
            unit: "元",
            plain: "數字上升代表台幣偏弱，出口商通常較有匯兌支撐。",
            up: { read: "台幣偏弱，出口報價與匯兌較有支撐。", benefit: ["電子出口", "半導體", "ODM"], hurt: ["進口成本", "航空"] },
            down: { read: "台幣偏強，進口成本壓力較低。", benefit: ["進口商", "航空", "內需"], hurt: ["出口商匯兌"] }
          }
        ]
      },
      {
        id: "commodities",
        title: "原物料",
        note: "原油、黃金、銅和天然氣會影響通膨、成本與景氣預期。",
        indicators: [
          {
            id: "wti",
            name: "WTI 原油",
            symbol: "CL=F",
            plain: "油價影響通膨、運輸成本與能源股。",
            up: { read: "油價上漲，能源與塑化題材較有感。", benefit: ["能源股", "塑化股"], hurt: ["航空股", "運輸股", "消費"] },
            down: { read: "油價下跌，通膨與運輸成本壓力下降。", benefit: ["航空股", "運輸股", "消費"], hurt: ["能源股"] }
          },
          {
            id: "gold",
            name: "黃金",
            symbol: "GC=F",
            plain: "黃金常被視為避險與抗通膨資產。",
            up: { read: "黃金上漲，避險需求或降息想像升溫。", benefit: ["黃金", "貴金屬"], hurt: ["風險資產情緒"] },
            down: { read: "黃金下跌，避險需求可能降溫。", benefit: ["風險資產"], hurt: ["黃金相關"] }
          },
          {
            id: "copper",
            name: "銅價",
            symbol: "HG=F",
            plain: "銅常被拿來觀察製造業與基建需求。",
            up: { read: "銅價上漲，市場可能看好製造業或基建需求。", benefit: ["電線電纜", "材料", "工業股"], hurt: ["用銅成本高的製造商"] },
            down: { read: "銅價走弱，景氣需求可能偏冷。", benefit: ["成本下降產業"], hurt: ["材料股", "景氣循環股"] }
          },
          {
            id: "gas",
            name: "天然氣",
            symbol: "NG=F",
            plain: "天然氣影響能源成本，也會牽動化工與電力成本。",
            up: { read: "天然氣上漲，能源成本壓力增加。", benefit: ["能源供應商"], hurt: ["化工", "高耗能產業"] },
            down: { read: "天然氣下跌，能源成本壓力下降。", benefit: ["化工", "高耗能產業"], hurt: ["能源供應商"] }
          }
        ]
      },
      {
        id: "ai-semi",
        title: "AI 與半導體",
        note: "用幾家核心公司看 AI 晶片、代工、記憶體與 ASIC 風向。",
        indicators: [
          {
            id: "nvda",
            name: "Nvidia",
            symbol: "NVDA",
            plain: "AI GPU 需求的代表公司。",
            up: { read: "AI 晶片情緒偏強，伺服器供應鏈容易被帶動。", benefit: ["AI 伺服器", "散熱", "PCB"], hurt: ["非 AI 題材資金"] },
            down: { read: "AI 晶片降溫，相關供應鏈短線可能承壓。", benefit: ["防禦型科技"], hurt: ["AI 概念股", "高估值半導體"] }
          },
          {
            id: "amd",
            name: "AMD",
            symbol: "AMD",
            plain: "AI GPU、CPU 與資料中心晶片公司。",
            up: { read: "市場看好 AI 加速器與伺服器 CPU 需求。", benefit: ["AI 晶片", "伺服器", "先進封裝"], hurt: ["競爭壓力較大的同業"] },
            down: { read: "資料中心晶片情緒降溫。", benefit: ["防禦型科技"], hurt: ["AI 晶片鏈"] }
          },
          {
            id: "tsm",
            name: "TSMC ADR",
            symbol: "TSM",
            plain: "台積電 ADR，反映先進製程與晶圓代工情緒。",
            up: { read: "晶圓代工情緒偏強，先進製程需求被看好。", benefit: ["晶圓代工", "設備", "材料"], hurt: ["成熟製程壓力較大公司"] },
            down: { read: "晶圓代工轉弱，台股半導體可能受壓。", benefit: ["防禦型族群"], hurt: ["半導體設備", "封測", "台股電子"] }
          },
          {
            id: "mu",
            name: "Micron",
            symbol: "MU",
            plain: "記憶體循環與 HBM 題材代表。",
            up: { read: "記憶體報價與 HBM 題材可能偏熱。", benefit: ["記憶體", "HBM", "DRAM"], hurt: ["用料成本上升產業"] },
            down: { read: "記憶體情緒轉弱，循環股容易震盪。", benefit: ["下游採購成本"], hurt: ["記憶體股"] }
          },
          {
            id: "avgo",
            name: "Broadcom",
            symbol: "AVGO",
            plain: "ASIC、網通晶片與 AI 客製化晶片代表。",
            up: { read: "AI ASIC 與網通晶片情緒偏強。", benefit: ["ASIC", "交換器", "高速傳輸"], hurt: ["非 AI 半導體"] },
            down: { read: "ASIC 與網通晶片短線降溫。", benefit: ["防禦型科技"], hurt: ["網通晶片", "高速傳輸"] }
          }
        ]
      },
      {
        id: "shipping-cycle",
        title: "航運與景氣",
        note: "BDI 看乾散貨，SCFI 看貨櫃運價，兩者能輔助判斷全球貿易熱度。",
        indicators: [
          {
            id: "bdi",
            name: "BDI 波羅的海指數",
            externalId: "bdi",
            unit: "點",
            plain: "乾散貨運價，常用來觀察原物料與全球貿易需求。",
            up: { read: "乾散貨運價上升，原物料運輸需求偏強。", benefit: ["散裝航運", "原物料景氣"], hurt: ["運輸成本敏感產業"] },
            down: { read: "乾散貨運價下跌，全球貨運需求可能放慢。", benefit: ["進口成本"], hurt: ["散裝航運", "景氣循環股"] }
          },
          {
            id: "scfi",
            name: "SCFI 上海集裝箱運價指數",
            externalId: "scfi",
            unit: "點",
            plain: "上海出口貨櫃運價，觀察貨櫃航運與出口需求。",
            up: { read: "貨櫃運價上漲，航運報價與旺季期待升溫。", benefit: ["貨櫃航運", "港口物流"], hurt: ["出口商運費成本"] },
            down: { read: "貨櫃運價下跌，航運報價壓力增加。", benefit: ["出口商成本"], hurt: ["貨櫃航運"] }
          }
        ]
      }
    ],
    flows: [
      { id: "ai", name: "AI", symbols: ["NVDA", "AMD", "AVGO", "TSM", "2330.TW"], theme: "AI 伺服器、GPU、ASIC、先進製程" },
      { id: "memory", name: "記憶體", symbols: ["MU", "2408.TW", "2344.TW", "2337.TW", "000660.KS"], theme: "DRAM、NAND、HBM 報價循環" },
      { id: "pcb", name: "PCB", symbols: ["2368.TW", "3037.TW", "3189.TW", "8046.TW", "2313.TW"], theme: "PCB、ABF 載板、高頻材料" },
      { id: "financial", name: "金融", symbols: ["XLF", "2881.TW", "2882.TW", "2891.TW"], theme: "利率、殖利率曲線與金融股" },
      { id: "shipping", name: "航運", symbols: ["2603.TW", "2609.TW", "2615.TW", "BDRY"], theme: "貨櫃、散裝與全球貿易需求" }
    ]
  };

  const layerLabelById = Object.fromEntries(layerOrder.map((layer) => [layer.id, layer.label]));

  base.supplyChain = { layerOrder, categories };
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
