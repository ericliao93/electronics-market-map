(function () {
  const data = window.MARKET_MAP_DATA || {};
  const section = document.getElementById("company-radar");
  const toolbar = section && section.querySelector(".company-toolbar");
  let rail = document.getElementById("companyRail");
  let detail = document.getElementById("companyDetail");
  let refreshButton = document.getElementById("quoteRefresh");
  const status = document.getElementById("quoteStatus");
  if (!section || !toolbar || !rail || !detail || !refreshButton || !status || !Array.isArray(data.companies)) return;

  const marketLabels = { all: "全部", tw: "台股", us: "美股", jp: "日股", kr: "韓股", other: "其他" };
  const symbolOverrides = { sony: "6758.T" };
  let activeMarket = "all";
  let activeCompanyId = "";
  let quotes = new Map();
  let batch = null;
  let loading = false;

  const timeFormatter = new Intl.DateTimeFormat("zh-TW", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Taipei"
  });

  function quoteSymbol(company) {
    return symbolOverrides[company.id] || company.quoteSymbol || "";
  }

  function marketForSymbol(symbol) {
    const upper = String(symbol || "").toUpperCase();
    if (upper.endsWith(".TW") || upper.endsWith(".TWO")) return "tw";
    if (upper.endsWith(".T")) return "jp";
    if (upper.endsWith(".KS") || upper.endsWith(".KQ")) return "kr";
    if (upper.endsWith(".HK")) return "other";
    return symbol ? "us" : "other";
  }

  function companyMarket(company) {
    return company.quoteMarket || marketForSymbol(quoteSymbol(company));
  }

  function companiesForMarket() {
    return data.companies
      .filter((company) => quoteSymbol(company))
      .filter((company) => activeMarket === "all" || companyMarket(company) === activeMarket);
  }

  function sortedCompanies() {
    return companiesForMarket().slice().sort((a, b) => {
      const qa = quotes.get(quoteSymbol(a));
      const qb = quotes.get(quoteSymbol(b));
      const pa = qa && typeof qa.changePercent === "number" ? qa.changePercent : -Infinity;
      const pb = qb && typeof qb.changePercent === "number" ? qb.changePercent : -Infinity;
      if (pb !== pa) return pb - pa;
      return String(a.name || "").localeCompare(String(b.name || ""), "zh-Hant");
    });
  }

  function fmtNumber(value) {
    if (typeof value !== "number" || Number.isNaN(value)) return "-";
    return value >= 1000 ? value.toLocaleString("zh-TW", { maximumFractionDigits: 0 }) : value.toLocaleString("zh-TW", { maximumFractionDigits: 2 });
  }

  function fmtPercent(value) {
    if (typeof value !== "number" || Number.isNaN(value)) return "-";
    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
  }

  function fmtTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "-" : timeFormatter.format(date);
  }

  function consensusText(quote) {
    if (!quote) return "等待報價";
    if (quote.consensus === "verified") return "雙來源一致";
    if (quote.consensus === "diverged") return `來源差異 ${fmtPercent(quote.consensusDiffPercent)}`;
    if (quote.consensus === "single") return "單一來源";
    if (quote.consensus === "failed") return "報價失敗";
    return quote.providerCount ? `${quote.providerCount} 個來源` : "報價已更新";
  }

  function providersText(quote) {
    const providers = quote && (quote.providerNames || (quote.providers || []).filter((item) => item.ok).map((item) => item.provider));
    return providers && providers.length ? providers.join(" / ") : "Yahoo Finance";
  }

  function ensureTabs() {
    let tabs = document.getElementById("quoteMarketTabs");
    if (!tabs) {
      tabs = document.createElement("div");
      tabs.id = "quoteMarketTabs";
      tabs.className = "quote-market-tabs";
      tabs.setAttribute("role", "group");
      tabs.setAttribute("aria-label", "選擇股市");
      toolbar.insertAdjacentElement("afterend", tabs);
    }
    tabs.innerHTML = Object.entries(marketLabels).map(([id, label]) => {
      const count = id === "all" ? data.companies.filter((company) => quoteSymbol(company)).length : data.companies.filter((company) => quoteSymbol(company) && companyMarket(company) === id).length;
      return `<button class="${id === activeMarket ? "active" : ""}" type="button" data-quote-market="${id}">${label} <span>${count}</span></button>`;
    }).join("");
    tabs.onclick = (event) => {
      const button = event.target.closest("[data-quote-market]");
      if (!button || button.dataset.quoteMarket === activeMarket) return;
      activeMarket = button.dataset.quoteMarket;
      activeCompanyId = "";
      quotes.clear();
      batch = null;
      render();
      refreshQuotes(true);
    };
  }

  function render() {
    ensureTabs();
    const companies = sortedCompanies();
    if (!companies.length) {
      rail.innerHTML = `<p class="quote-empty">這個市場目前沒有可追蹤的公司。</p>`;
      detail.innerHTML = "";
      updateStatus();
      return;
    }
    if (!activeCompanyId || !companies.some((company) => company.id === activeCompanyId)) activeCompanyId = companies[0].id;
    rail.innerHTML = companies.map((company) => {
      const symbol = quoteSymbol(company);
      const quote = quotes.get(symbol);
      const change = quote && typeof quote.changePercent === "number" ? quote.changePercent : null;
      const direction = change == null ? "flat" : change >= 0 ? "up" : "down";
      return `
        <button class="company-card ${company.id === activeCompanyId ? "active" : ""}" type="button" data-company-id="${company.id}">
          <span class="company-card-top"><b>${company.name || symbol}</b><small>${marketLabels[companyMarket(company)] || "其他"} · ${symbol}</small></span>
          <span class="quote-line ${direction}">
            <strong>${quote ? fmtNumber(quote.price) : "更新中"}</strong>
            <span>${quote ? fmtPercent(quote.changePercent) : "-"}</span>
          </span>
          <span class="quote-meta">前收 ${quote ? fmtNumber(quote.previousClose) : "-"} · ${consensusText(quote)}</span>
          <span class="company-intro">${company.description || company.intro || ""}</span>
        </button>`;
    }).join("");
    renderDetail(companies.find((company) => company.id === activeCompanyId) || companies[0]);
    updateStatus();
  }

  function listText(items) {
    return Array.isArray(items) && items.length ? items.join("、") : "-";
  }

  function renderDetail(company) {
    if (!company) return;
    const symbol = quoteSymbol(company);
    const quote = quotes.get(symbol);
    const direction = quote && quote.changePercent >= 0 ? "up" : "down";
    detail.innerHTML = `
      <div class="detail-head">
        <span>${marketLabels[companyMarket(company)] || "其他"} · ${symbol}</span>
        <h3>${company.name || symbol}</h3>
        <p>${company.description || company.intro || ""}</p>
      </div>
      <div class="quote-detail-box ${quote ? direction : "flat"}">
        <div><span>今日股價</span><strong>${quote ? fmtNumber(quote.price) : "-"}</strong></div>
        <div><span>漲跌幅</span><strong>${quote ? fmtPercent(quote.changePercent) : "-"}</strong></div>
        <div><span>交易時間</span><strong>${quote ? fmtTime(quote.marketTime) : "-"}</strong></div>
        <div><span>資料批次</span><strong>${fmtTime((quote && (quote.batchUpdatedAt || quote.fetchedAt)) || (batch && batch.updatedAt))}</strong></div>
      </div>
      <dl class="company-facts">
        <div><dt>報價檢查</dt><dd>${consensusText(quote)}，來源：${providersText(quote)}</dd></div>
        <div><dt>產業位置</dt><dd>${company.layerLabel || company.layer || "-"}</dd></div>
        <div><dt>上游供應商</dt><dd>${listText(company.upstream)}</dd></div>
        <div><dt>下游客戶</dt><dd>${listText(company.downstream)}</dd></div>
        <div><dt>相關題材</dt><dd>${listText(company.related)}</dd></div>
      </dl>`;
  }

  function updateStatus(message) {
    if (message) {
      status.textContent = message;
      return;
    }
    const scoped = companiesForMarket();
    const ok = scoped.filter((company) => quotes.has(quoteSymbol(company))).length;
    if (loading) {
      status.textContent = `${marketLabels[activeMarket]}報價更新中...`;
    } else if (batch) {
      status.textContent = `${marketLabels[activeMarket]}已更新 ${fmtTime(batch.updatedAt)}，同批次 ${ok}/${scoped.length} 檔，Yahoo 分線 / Yahoo 日線交叉比對`;
    } else {
      status.textContent = "報價準備中";
    }
  }

  async function refreshQuotes(force) {
    const symbols = Array.from(new Set(companiesForMarket().map(quoteSymbol).filter(Boolean)));
    if (!symbols.length || loading) return;
    loading = true;
    updateStatus();
    try {
      const params = new URLSearchParams({ symbols: symbols.join(",") });
      if (force) params.set("force", "1");
      params.set("_", Date.now().toString());
      const response = await fetch(`/api/quotes?${params.toString()}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      quotes = new Map();
      (payload.results || []).forEach((quote) => {
        if (quote && quote.ok && quote.symbol) quotes.set(quote.symbol, quote);
      });
      batch = payload;
    } catch (error) {
      updateStatus(`報價暫時失敗：${error.message || error}`);
    } finally {
      loading = false;
      render();
    }
  }

  const cleanRail = rail.cloneNode(false);
  rail.replaceWith(cleanRail);
  rail = cleanRail;
  const cleanDetail = detail.cloneNode(false);
  detail.replaceWith(cleanDetail);
  detail = cleanDetail;
  const cleanButton = refreshButton.cloneNode(true);
  refreshButton.replaceWith(cleanButton);
  refreshButton = cleanButton;

  cleanRail.addEventListener("click", (event) => {
    const card = event.target.closest("[data-company-id]");
    if (!card) return;
    activeCompanyId = card.dataset.companyId || activeCompanyId;
    render();
  });
  cleanButton.addEventListener("click", () => refreshQuotes(true));

  render();
  refreshQuotes(true);
})();

;(()=>{const d=window.MARKET_MAP_DATA;if(!d||!Array.isArray(d.companies))return;const m=new Map(d.companies.map(c=>[c.id,c]));const sym=c=>c.quoteSymbol||c.ticker||"";function apply(){document.querySelectorAll("#companyRail .company-card").forEach(card=>{const c=m.get(card.dataset.companyId);if(!c)return;const sm=card.querySelector(".company-card-top small");if(sm&&!sm.querySelector(".company-code")){sm.textContent="";const code=document.createElement("span");code.className="company-code";code.textContent=sym(c);const ind=document.createElement("span");ind.className="company-industry";ind.textContent=c.layerLabel||c.layer||"\u96fb\u5b50\u7522\u696d";sm.append(code,ind)}const intro=card.querySelector(".company-intro");if(intro)intro.textContent=c.description||c.intro||""})}const r=document.getElementById("companyRail");if(r)new MutationObserver(apply).observe(r,{childList:true,subtree:true});apply()})();
