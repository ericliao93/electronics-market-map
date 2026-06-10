(function () {
  const data = window.MARKET_MAP_DATA;
  const todayFocusGrid = document.getElementById("todayFocusGrid");
  const eventTimeline = document.getElementById("eventTimeline");
  const industryMap = document.getElementById("industryMap");
  const themeGrid = document.getElementById("themeGrid");
  const companyRail = document.getElementById("companyRail");
  const companyDetail = document.getElementById("companyDetail");
  const quoteRefresh = document.getElementById("quoteRefresh");
  const quoteStatus = document.getElementById("quoteStatus");
  const marketRefresh = document.getElementById("marketRefresh");
  const marketStatus = document.getElementById("marketStatus");
  const marketSummary = document.getElementById("marketSummary");
  const flowDashboard = document.getElementById("flowDashboard");
  const marketIndicatorGroups = document.getElementById("marketIndicatorGroups");
  const watchList = document.getElementById("watchList");
  const themeSearch = document.getElementById("themeSearch");
  const supplySearch = document.getElementById("supplySearch");
  const supplySearchResult = document.getElementById("supplySearchResult");
  const supplyColumns = document.getElementById("supplyColumns");
  const supplyDetail = document.getElementById("supplyDetail");
  const dataUpdatedAt = document.getElementById("dataUpdatedAt");

  let eventFilter = "all";
  let activeSupplyId = "nvidia";
  let activeSupplyKind = "company";
  let supplyQuery = "";
  let activeCompanyId = (data.companies.find((company) => company.quoteSymbol) || data.companies[0] || {}).id || "";
  let quoteLoading = false;
  let quoteUpdatedAt = "";
  let quoteError = "";
  let userSelectedCompany = false;
  let marketLoading = false;
  let marketUpdatedAt = "";
  let marketError = "";
  const companyQuotes = new Map();
  const marketQuotes = new Map();
  const externalMetrics = new Map();
  const marketDashboard = data.marketDashboard || { groups: [], flows: [] };

  const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
    weekday: "short",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Taipei"
  });

  const quoteTimeFormatter = new Intl.DateTimeFormat("zh-TW", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Taipei"
  });

  const dataTimeFormatter = new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Taipei"
  });

  function text(value) {
    return value == null ? "" : String(value);
  }

  function normalizedText(value) {
    return text(value).normalize("NFKC").toLowerCase();
  }

  function uniqueValues(items) {
    return Array.from(new Set(items.filter(Boolean)));
  }

  function queryAlternatives(term) {
    const aliases = data.searchAliases || {};
    const normalizedTerm = normalizedText(term);
    const direct = aliases[term] || aliases[normalizedTerm] || [];
    const reverse = Object.entries(aliases)
      .filter(([key, values]) => {
        const normalizedKey = normalizedText(key);
        const normalizedValues = values.map(normalizedText);
        return normalizedKey === normalizedTerm || normalizedValues.includes(normalizedTerm);
      })
      .flatMap(([key, values]) => [key, ...values]);

    return uniqueValues([normalizedTerm, ...direct, ...reverse].map(normalizedText));
  }

  function queryTerms(query) {
    return normalizedText(query).trim().split(/\s+/).filter(Boolean);
  }

  function matchesSearchQuery(haystack, query) {
    const normalizedHaystack = normalizedText(haystack);
    const terms = queryTerms(query);
    if (!terms.length) return true;
    return terms.every((term) => queryAlternatives(term).some((candidate) => normalizedHaystack.includes(candidate)));
  }

  function formatDataTime(value = new Date()) {
    let date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) date = new Date();
    const parts = Object.fromEntries(dataTimeFormatter.formatToParts(date).map((part) => [part.type, part.value]));
    return `${parts.year}/${parts.month}/${parts.day} ${parts.hour}:${parts.minute}`;
  }

  function updateDataTimestamp(value = new Date()) {
    if (!dataUpdatedAt) return;
    dataUpdatedAt.textContent = formatDataTime(value);
  }

  function impactText(impact) {
    if (impact === "high" || impact === "高") return "高";
    if (impact === "medium" || impact === "中") return "中";
    return "低";
  }

  function impactClass(impact) {
    if (impact === "high" || impact === "高") return "high";
    if (impact === "medium" || impact === "中") return "medium";
    return "low";
  }

  function typeText(type) {
    const map = {
      macro: "總經",
      earnings: "財報",
      policy: "央行"
    };
    return map[type] || type;
  }

  function layerLabel(layerId) {
    const layer = data.supplyChain.layerOrder.find((item) => item.id === layerId);
    return layer ? layer.label : layerId;
  }

  function createImpactBadge(impact) {
    const badge = document.createElement("span");
    badge.className = `impact-badge impact-${impactClass(impact)}`;
    badge.textContent = `${impactText(impact)}影響`;
    return badge;
  }

  function createChipList(items, className) {
    const list = document.createElement("div");
    list.className = className;
    items.forEach((item) => {
      const chip = document.createElement("span");
      chip.textContent = item;
      list.appendChild(chip);
    });
    return list;
  }

  function createList(items) {
    const list = document.createElement("ul");
    items.forEach((item) => {
      const row = document.createElement("li");
      row.textContent = item;
      list.appendChild(row);
    });
    return list;
  }

  function renderStats() {
    document.getElementById("highImpactCount").textContent = data.events
      .filter((event) => event.impact === "high")
      .length;
    document.getElementById("sectorCount").textContent = data.supplyChain.categories.length;
    document.getElementById("companyCount").textContent = data.companies.length;
    updateDataTimestamp();
  }

  function renderTodayFocus() {
    todayFocusGrid.replaceChildren();
    const fragment = document.createDocumentFragment();
    data.todayFocus.forEach((item) => {
      const card = document.createElement("article");
      card.className = `today-card today-${impactClass(item.impact)}`;

      const label = document.createElement("span");
      label.className = "today-label";
      label.textContent = item.label;

      const title = document.createElement("h3");
      title.textContent = item.title;

      const body = document.createElement("p");
      body.textContent = item.body;

      card.append(label, title, body);
      fragment.appendChild(card);
    });
    todayFocusGrid.appendChild(fragment);
  }

  function eventMatches(event) {
    if (eventFilter === "all") return true;
    if (eventFilter === "high") return event.impact === "high";
    return event.type === eventFilter;
  }

  function renderEvents() {
    eventTimeline.replaceChildren();
    const fragment = document.createDocumentFragment();
    data.events.filter(eventMatches).forEach((event) => {
      const article = document.createElement("article");
      article.className = `event-card ${event.impact}`;

      const date = new Date(`${event.date}T${event.time}:00+08:00`);
      const time = document.createElement("div");
      time.className = "event-time";
      const day = document.createElement("strong");
      day.textContent = dateFormatter.format(date);
      const clock = document.createElement("span");
      clock.textContent = event.time;
      time.append(day, clock);

      const body = document.createElement("div");
      body.className = "event-body";

      const meta = document.createElement("div");
      meta.className = "event-meta";
      [event.region, typeText(event.type)].forEach((value) => {
        const item = document.createElement("span");
        item.textContent = value;
        meta.appendChild(item);
      });
      meta.appendChild(createImpactBadge(event.impact));

      const title = document.createElement("h3");
      title.textContent = event.title;
      const note = document.createElement("p");
      note.textContent = event.note;

      body.append(meta, title, note, createChipList(event.tags, "chips"));
      article.append(time, body);
      fragment.appendChild(article);
    });
    eventTimeline.appendChild(fragment);
  }

  function renderWatchList() {
    watchList.replaceChildren();
    data.watchItems.forEach((item) => {
      const node = document.createElement("article");
      node.className = "watch-item";

      const status = document.createElement("span");
      status.textContent = item.status;
      const title = document.createElement("h4");
      title.textContent = item.title;
      const note = document.createElement("p");
      note.textContent = item.note;

      node.append(status, title, note);
      watchList.appendChild(node);
    });
  }

  function renderIndustryMap() {
    industryMap.replaceChildren();
    const fragment = document.createDocumentFragment();
    data.industryStages.forEach((stage) => {
      const card = document.createElement("article");
      card.className = "industry-stage-card";

      const title = document.createElement("h3");
      title.textContent = stage.stage;
      const summary = document.createElement("p");
      summary.textContent = stage.summary;

      card.append(title, summary, createList(stage.items));
      fragment.appendChild(card);
    });
    industryMap.appendChild(fragment);
  }

  function themeMatches(theme) {
    return matchesSearchQuery([
      theme.title,
      theme.explanation,
      theme.impact,
      ...theme.tags,
      ...theme.focus,
      ...theme.industries,
      ...theme.companies
    ].join(" "), themeSearch.value);
  }

  function renderThemes() {
    themeGrid.replaceChildren();
    const fragment = document.createDocumentFragment();
    data.themes.filter(themeMatches).forEach((theme) => {
      const card = document.createElement("article");
      card.className = "theme-card";

      const head = document.createElement("div");
      head.className = "theme-head";
      const title = document.createElement("strong");
      title.textContent = theme.title;
      head.append(title, createImpactBadge(theme.impact));

      const summary = document.createElement("p");
      summary.textContent = theme.explanation;

      const industryBlock = document.createElement("div");
      industryBlock.className = "theme-block";
      const industryTitle = document.createElement("b");
      industryTitle.textContent = "相關產業";
      industryBlock.append(industryTitle, createChipList(theme.industries, "chips"));

      const companyBlock = document.createElement("div");
      companyBlock.className = "theme-block";
      const companyTitle = document.createElement("b");
      companyTitle.textContent = "相關公司";
      companyBlock.append(companyTitle, createList(theme.companies));

      card.append(head, summary, industryBlock, companyBlock);
      fragment.appendChild(card);
    });
    themeGrid.appendChild(fragment);
  }

  function renderCompanies() {
    companyRail.replaceChildren();
    const fragment = document.createDocumentFragment();
    rankedCompanies().forEach((company, index) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "company-card";
      card.dataset.companyId = company.id;
      card.classList.toggle("active", company.id === activeCompanyId);

      const head = document.createElement("div");
      head.className = "company-card-head";
      const ticker = document.createElement("strong");
      ticker.textContent = company.ticker;
      const signal = document.createElement("span");
      signal.textContent = getCompanyQuote(company) ? `漲幅 #${index + 1}` : (company.layerLabel || company.group);
      head.append(ticker, signal);

      const name = document.createElement("span");
      name.className = "company-name";
      name.textContent = company.name;
      const group = document.createElement("p");
      group.textContent = company.group;
      const description = document.createElement("small");
      description.textContent = company.description || company.signal;

      card.append(head, name, group, createCompanyQuoteNode(company), description);
      fragment.appendChild(card);
    });
    companyRail.appendChild(fragment);
    renderCompanyRadarDetail();
    updateQuoteStatus();
  }

  function getCompanyQuote(company) {
    if (!company.quoteSymbol) return null;
    return companyQuotes.get(company.quoteSymbol) || null;
  }

  function rankedCompanies() {
    return [...data.companies].sort((a, b) => {
      const quoteA = getCompanyQuote(a);
      const quoteB = getCompanyQuote(b);
      if (quoteA && quoteB) {
        return quoteB.changePercent - quoteA.changePercent;
      }
      if (quoteA) return -1;
      if (quoteB) return 1;
      return data.companies.indexOf(a) - data.companies.indexOf(b);
    });
  }

  function quoteDirection(value) {
    if (value > 0) return "up";
    if (value < 0) return "down";
    return "flat";
  }

  function formatPrice(value, currency) {
    if (typeof value !== "number" || Number.isNaN(value)) return "--";
    const maximumFractionDigits = value >= 1000 ? 0 : 2;
    return `${currency || ""} ${value.toLocaleString("zh-TW", { maximumFractionDigits })}`.trim();
  }

  function formatPercent(value) {
    if (typeof value !== "number" || Number.isNaN(value)) return "--";
    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
  }

  function formatChange(value) {
    if (typeof value !== "number" || Number.isNaN(value)) return "--";
    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}`;
  }

  function formatQuoteTime(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return quoteTimeFormatter.format(date);
  }

  function apiUrl(path, params) {
    const query = params ? `?${params.toString()}` : "";
    return location.protocol === "file:"
      ? `http://127.0.0.1:58110${path}${query}`
      : `.${path}${query}`;
  }

  function getIndicatorQuote(indicator) {
    if (indicator.externalId) return externalMetrics.get(indicator.externalId) || null;
    if (indicator.symbol) return marketQuotes.get(indicator.symbol) || null;
    return null;
  }

  function formatIndicatorValue(indicator, quote) {
    if (!quote || typeof quote.price !== "number") return "暫無資料";
    const value = quote.price;
    if (indicator.display === "yield") {
      return `${value.toLocaleString("zh-TW", { maximumFractionDigits: 3 })}%`;
    }
    if (indicator.unit) {
      return `${value.toLocaleString("zh-TW", { maximumFractionDigits: value >= 1000 ? 0 : 2 })} ${indicator.unit}`;
    }
    return formatPrice(value, quote.currency);
  }

  function formatIndicatorChange(indicator, quote) {
    if (!quote || typeof quote.changePercent !== "number") return "--";
    if (indicator.display === "yield" && typeof quote.change === "number") {
      return `${formatChange(quote.change)} 點 / ${formatPercent(quote.changePercent)}`;
    }
    return `${formatChange(quote.change)} / ${formatPercent(quote.changePercent)}`;
  }

  function indicatorScenario(indicator, quote) {
    if (!quote) {
      return {
        read: "目前資料來源沒有回傳即時數值，先保留觀察卡。",
        benefit: ["等待更新"],
        hurt: ["避免用舊資料判斷"]
      };
    }
    const direction = quoteDirection(quote.changePercent);
    if (direction === "up") return indicator.up;
    if (direction === "down") return indicator.down;
    return {
      read: "變動不大，市場訊號暫時偏中性。",
      benefit: ["區間整理"],
      hurt: ["方向不明"]
    };
  }

  function createTextPillList(items) {
    const list = document.createElement("div");
    list.className = "dashboard-pills";
    (items || []).forEach((item) => {
      const pill = document.createElement("span");
      pill.textContent = item;
      list.appendChild(pill);
    });
    return list;
  }

  function renderMarketDashboard() {
    renderMarketStatus();
    renderMarketSummary();
    renderFlowDashboard();
    renderMarketIndicatorGroups();
  }

  function renderMarketStatus() {
    if (!marketStatus) return;
    if (marketLoading) {
      marketStatus.textContent = "正在更新市場指標...";
    } else if (marketError) {
      marketStatus.textContent = `部分資料暫缺：${marketError}`;
    } else if (marketUpdatedAt) {
      marketStatus.textContent = `已更新 ${formatQuoteTime(marketUpdatedAt)}，含即時報價與外部航運/利率資料`;
    } else {
      marketStatus.textContent = "尚未更新市場指標";
    }

    if (marketRefresh) {
      marketRefresh.disabled = marketLoading;
      marketRefresh.textContent = marketLoading ? "更新中" : "更新市場指標";
    }
  }

  function allMarketIndicators() {
    return (marketDashboard.groups || []).flatMap((group) => group.indicators || []);
  }

  function marketTone() {
    const signals = [
      { id: "twii", weight: 1 },
      { id: "sox", weight: 1.2 },
      { id: "nasdaq", weight: 1 },
      { id: "sp500", weight: 0.8 },
      { id: "vix", weight: -1.1 },
      { id: "us10y", weight: -0.8 }
    ];
    let score = 0;
    let count = 0;
    signals.forEach((signal) => {
      const indicator = allMarketIndicators().find((item) => item.id === signal.id);
      const quote = indicator ? getIndicatorQuote(indicator) : null;
      if (!quote || typeof quote.changePercent !== "number") return;
      score += quote.changePercent * signal.weight;
      count += 1;
    });

    const average = count ? score / count : 0;
    if (average >= 0.35) {
      return { label: "偏進攻", body: "大盤或半導體相對有撐，資金較願意碰科技與成長題材。", className: "tone-up" };
    }
    if (average <= -0.35) {
      return { label: "偏防守", body: "市場壓力較明顯，先注意利率、VIX 與大型科技股是否續弱。", className: "tone-down" };
    }
    return { label: "偏觀望", body: "多空訊號分歧，適合先看強弱族群，不急著只押單一方向。", className: "tone-flat" };
  }

  function renderMarketSummary() {
    if (!marketSummary) return;
    marketSummary.replaceChildren();
    const tone = marketTone();
    const title = document.createElement("span");
    title.textContent = "目前市場風向";
    const label = document.createElement("strong");
    label.className = tone.className;
    label.textContent = tone.label;
    const body = document.createElement("p");
    body.textContent = tone.body;

    const hint = document.createElement("small");
    const available = allMarketIndicators().filter((indicator) => getIndicatorQuote(indicator)).length;
    hint.textContent = `已取得 ${available}/${allMarketIndicators().length} 個指標。`;
    marketSummary.append(title, label, body, hint);
  }

  function flowStars(score) {
    const stars = Math.max(1, Math.min(5, score));
    return "★".repeat(stars) + "☆".repeat(5 - stars);
  }

  function scoreFlow(avgChange) {
    if (avgChange >= 2) return 5;
    if (avgChange >= 0.8) return 4;
    if (avgChange >= -0.4) return 3;
    if (avgChange >= -1.5) return 2;
    return 1;
  }

  function flowAverage(flow) {
    const quotes = (flow.symbols || [])
      .map((symbol) => marketQuotes.get(symbol) || companyQuotes.get(symbol))
      .filter((quote) => quote && typeof quote.changePercent === "number");
    if (!quotes.length) return null;
    return quotes.reduce((sum, quote) => sum + quote.changePercent, 0) / quotes.length;
  }

  function renderFlowDashboard() {
    if (!flowDashboard) return;
    flowDashboard.replaceChildren();
    const fragment = document.createDocumentFragment();
    (marketDashboard.flows || []).forEach((flow) => {
      const avg = flowAverage(flow);
      const score = avg == null ? 1 : scoreFlow(avg);
      const row = document.createElement("article");
      row.className = `flow-row flow-score-${score}`;

      const name = document.createElement("strong");
      name.textContent = flow.name;
      const theme = document.createElement("span");
      theme.textContent = flow.theme;
      const stars = document.createElement("b");
      stars.setAttribute("aria-label", `${score} 顆星`);
      stars.textContent = flowStars(score);
      const change = document.createElement("em");
      change.textContent = avg == null ? "資料暫缺" : `平均 ${formatPercent(avg)}`;

      row.append(name, stars, change, theme);
      fragment.appendChild(row);
    });
    flowDashboard.appendChild(fragment);
  }

  function renderMarketIndicatorGroups() {
    if (!marketIndicatorGroups) return;
    marketIndicatorGroups.replaceChildren();
    const fragment = document.createDocumentFragment();
    (marketDashboard.groups || []).forEach((group) => {
      const section = document.createElement("section");
      section.className = "indicator-group";

      const head = document.createElement("div");
      head.className = "indicator-group-head";
      const title = document.createElement("h3");
      title.textContent = group.title;
      const note = document.createElement("p");
      note.textContent = group.note;
      head.append(title, note);

      const grid = document.createElement("div");
      grid.className = "indicator-grid";
      (group.indicators || []).forEach((indicator) => {
        grid.appendChild(createIndicatorCard(indicator));
      });

      section.append(head, grid);
      fragment.appendChild(section);
    });
    marketIndicatorGroups.appendChild(fragment);
  }

  function createIndicatorCard(indicator) {
    const quote = getIndicatorQuote(indicator);
    const direction = quote ? quoteDirection(quote.changePercent) : "flat";
    const scenario = indicatorScenario(indicator, quote);
    const card = document.createElement("article");
    card.className = `indicator-card indicator-${direction}`;

    const top = document.createElement("div");
    top.className = "indicator-top";
    const name = document.createElement("strong");
    name.textContent = indicator.name;
    const icon = document.createElement("span");
    icon.className = `indicator-icon quote-${direction}`;
    icon.textContent = direction === "up" ? "▲" : direction === "down" ? "▼" : "●";
    top.append(name, icon);

    const plain = document.createElement("p");
    plain.className = "indicator-plain";
    plain.textContent = indicator.plain;

    const quoteRow = document.createElement("div");
    quoteRow.className = "indicator-quote";
    const value = document.createElement("b");
    value.textContent = formatIndicatorValue(indicator, quote);
    const change = document.createElement("span");
    change.className = `quote-${direction}`;
    change.textContent = formatIndicatorChange(indicator, quote);
    quoteRow.append(value, change);

    const read = document.createElement("div");
    read.className = "indicator-read";
    const readTitle = document.createElement("span");
    readTitle.textContent = "市場解讀";
    const readBody = document.createElement("p");
    readBody.textContent = scenario.read;
    read.append(readTitle, readBody);

    const impact = document.createElement("div");
    impact.className = "indicator-impact";
    const benefit = document.createElement("div");
    const benefitTitle = document.createElement("span");
    benefitTitle.textContent = "可能受惠";
    benefit.append(benefitTitle, createTextPillList(scenario.benefit));
    const hurt = document.createElement("div");
    const hurtTitle = document.createElement("span");
    hurtTitle.textContent = "可能受影響";
    hurt.append(hurtTitle, createTextPillList(scenario.hurt));
    impact.append(benefit, hurt);

    const source = document.createElement("small");
    source.textContent = quote && quote.marketTime
      ? `更新 ${formatQuoteTime(quote.marketTime)}`
      : (indicator.externalId ? "外部資料暫未回傳" : indicator.symbol || "無代號");

    card.append(top, plain, quoteRow, read, impact, source);
    return card;
  }

  function dashboardSymbols() {
    const indicatorSymbols = allMarketIndicators().map((indicator) => indicator.symbol).filter(Boolean);
    const flowSymbols = (marketDashboard.flows || []).flatMap((flow) => flow.symbols || []);
    return Array.from(new Set([...indicatorSymbols, ...flowSymbols]));
  }

  function externalMetricIds() {
    return Array.from(new Set(allMarketIndicators().map((indicator) => indicator.externalId).filter(Boolean)));
  }

  async function refreshMarketDashboard(force = false) {
    const symbols = dashboardSymbols();
    const externalIds = externalMetricIds();
    if (!symbols.length && !externalIds.length) return;

    marketLoading = true;
    marketError = "";
    renderMarketDashboard();

    try {
      const requests = [];
      if (symbols.length) {
        const quoteParams = new URLSearchParams({ symbols: symbols.join(",") });
        if (force) quoteParams.set("_", Date.now().toString());
        requests.push(fetch(apiUrl("/api/quotes", quoteParams)).then((response) => {
          if (!response.ok) throw new Error(`市場報價 HTTP ${response.status}`);
          return response.json();
        }));
      } else {
        requests.push(Promise.resolve({ updatedAt: "", results: [] }));
      }

      if (externalIds.length) {
        const metricParams = new URLSearchParams({ ids: externalIds.join(",") });
        if (force) metricParams.set("_", Date.now().toString());
        requests.push(fetch(apiUrl("/api/market-metrics", metricParams)).then((response) => {
          if (!response.ok) throw new Error(`外部指標 HTTP ${response.status}`);
          return response.json();
        }));
      } else {
        requests.push(Promise.resolve({ updatedAt: "", results: [] }));
      }

      const [quotePayload, metricPayload] = await Promise.all(requests);
      marketQuotes.clear();
      (quotePayload.results || []).forEach((quote) => {
        if (quote && quote.ok && quote.symbol) {
          marketQuotes.set(quote.symbol, quote);
        }
      });

      externalMetrics.clear();
      (metricPayload.results || []).forEach((metric) => {
        if (metric && metric.ok && metric.id) {
          externalMetrics.set(metric.id, metric);
        }
      });

      marketUpdatedAt = quotePayload.updatedAt || metricPayload.updatedAt || new Date().toISOString();
      updateDataTimestamp(marketUpdatedAt);
      const failedQuotes = (quotePayload.results || []).filter((quote) => !quote.ok).length;
      const failedMetrics = (metricPayload.results || []).filter((metric) => !metric.ok).length;
      marketError = failedQuotes || failedMetrics ? `${failedQuotes + failedMetrics} 個指標暫無資料` : "";
    } catch (error) {
      marketError = error && error.message ? error.message : "無法取得市場指標";
    } finally {
      marketLoading = false;
      renderMarketDashboard();
    }
  }

  function createCompanyQuoteNode(company) {
    const box = document.createElement("div");
    box.className = "company-quote";

    const quote = getCompanyQuote(company);
    const price = document.createElement("b");
    const change = document.createElement("span");
    const previous = document.createElement("em");

    if (!company.quoteSymbol) {
      box.classList.add("quote-muted");
      price.textContent = "未上市";
      change.textContent = "暫無公開股價";
      previous.textContent = "仍可查看產業角色";
    } else if (quote) {
      const direction = quoteDirection(quote.changePercent);
      change.className = `quote-change quote-${direction}`;
      price.textContent = formatPrice(quote.price, quote.currency);
      change.textContent = `${formatChange(quote.change)} / ${formatPercent(quote.changePercent)}`;
      previous.textContent = `前日收盤 ${formatPrice(quote.previousClose, quote.currency)}`;
    } else if (quoteLoading) {
      price.textContent = "載入中";
      change.textContent = "正在更新報價";
      previous.textContent = company.quoteSymbol;
    } else {
      box.classList.add("quote-muted");
      price.textContent = "報價暫無";
      change.textContent = "可按更新報價重試";
      previous.textContent = company.quoteSymbol;
    }

    box.append(price, change, previous);
    return box;
  }

  function renderCompanyRadarDetail() {
    if (!companyDetail) return;
    companyDetail.replaceChildren();
    const company = data.companies.find((item) => item.id === activeCompanyId) || data.companies[0];
    if (!company) {
      const empty = document.createElement("p");
      empty.className = "empty-detail";
      empty.textContent = "目前沒有公司資料。";
      companyDetail.appendChild(empty);
      return;
    }

    const quote = getCompanyQuote(company);
    const title = document.createElement("h3");
    title.textContent = company.name;
    const layer = document.createElement("span");
    layer.className = "detail-stage";
    layer.textContent = `位置：${company.layerLabel || company.signal} / ${company.group}`;

    companyDetail.append(
      title,
      layer,
      createRadarQuoteBlock(company, quote),
      createDetailBlock("公司介紹", company.intro || company.description),
      createDetailBlock("所屬產業", company.group),
      createDetailList("上游供應商", company.upstream || []),
      createDetailList("下游客戶", company.downstream || []),
      createDetailBlock("電子產業鏈角色", company.role || company.description),
      createDetailList("相關概念股", company.related || [])
    );
  }

  function createRadarQuoteBlock(company, quote) {
    const block = document.createElement("div");
    block.className = "radar-quote-block";

    const label = document.createElement("span");
    label.textContent = company.quoteSymbol ? `股價 ${company.quoteSymbol}` : "股價";

    const price = document.createElement("strong");
    const meta = document.createElement("p");

    if (!company.quoteSymbol) {
      price.textContent = "未上市 / 暫無公開報價";
      meta.textContent = "這家公司仍保留在雷達中，方便追蹤它對電子產業鏈的影響。";
    } else if (quote) {
      const direction = quoteDirection(quote.changePercent);
      price.className = `quote-${direction}`;
      price.textContent = formatPrice(quote.price, quote.currency);
      meta.textContent = `相較前日 ${formatChange(quote.change)}，${formatPercent(quote.changePercent)}。前日收盤 ${formatPrice(quote.previousClose, quote.currency)}。${formatQuoteTime(quote.marketTime) ? `更新 ${formatQuoteTime(quote.marketTime)}` : ""}`;
    } else if (quoteLoading) {
      price.textContent = "報價載入中";
      meta.textContent = "正在向資料來源更新今日股價。";
    } else {
      price.textContent = "報價暫無";
      meta.textContent = "資料來源可能暫時限流，或該股票代號目前沒有回傳資料。";
    }

    block.append(label, price, meta);
    return block;
  }

  function updateQuoteStatus() {
    if (!quoteStatus) return;
    if (quoteLoading) {
      quoteStatus.textContent = "正在更新今日股價...";
    } else if (quoteError) {
      quoteStatus.textContent = `報價暫時失敗：${quoteError}`;
    } else if (quoteUpdatedAt) {
      quoteStatus.textContent = `已更新 ${formatQuoteTime(quoteUpdatedAt)}，依當日漲幅排序`;
    } else {
      quoteStatus.textContent = "尚未更新報價";
    }

    if (quoteRefresh) {
      quoteRefresh.disabled = quoteLoading;
      quoteRefresh.textContent = quoteLoading ? "更新中" : "更新報價";
    }
  }

  async function refreshCompanyQuotes(force = false) {
    const symbols = Array.from(new Set(data.companies.map((company) => company.quoteSymbol).filter(Boolean)));
    if (!symbols.length) return;

    quoteLoading = true;
    quoteError = "";
    renderCompanies();

    try {
      const params = new URLSearchParams({ symbols: symbols.join(",") });
      if (force) params.set("_", Date.now().toString());
      const response = await fetch(apiUrl("/api/quotes", params));
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      companyQuotes.clear();
      (payload.results || []).forEach((quote) => {
        if (quote && quote.ok && quote.symbol) {
          companyQuotes.set(quote.symbol, quote);
        }
      });
      quoteUpdatedAt = payload.updatedAt || new Date().toISOString();
      updateDataTimestamp(quoteUpdatedAt);
      const topGainer = rankedCompanies().find((company) => getCompanyQuote(company));
      if (topGainer && !userSelectedCompany) {
        activeCompanyId = topGainer.id;
      }
      const failedCount = (payload.results || []).filter((quote) => !quote.ok).length;
      quoteError = failedCount ? `${failedCount} 檔暫無資料` : "";
    } catch (error) {
      quoteError = error && error.message ? error.message : "無法取得報價";
    } finally {
      quoteLoading = false;
      renderCompanies();
    }
  }

  function supplyCategorySearchText(category) {
    return normalizedText([
      category.title,
      category.role,
      category.description,
      layerLabel(category.layer),
      ...category.upstream,
      ...category.downstream,
      ...category.related
    ].join(" "));
  }

  function supplyCompanySearchText(company, category) {
    return normalizedText([
      company.name,
      company.intro,
      company.role,
      company.upstream,
      company.downstream,
      company.related,
      category.title,
      category.role,
      category.description,
      layerLabel(category.layer),
      ...category.upstream,
      ...category.downstream,
      ...category.related
    ].join(" "));
  }

  function companyNameMatches(company, query) {
    return matchesSearchQuery(company.name, query);
  }

  function filteredSupplyCategories() {
    const query = supplySearch.value;
    if (!queryTerms(query).length) return data.supplyChain.categories;
    const hasCompanyNameMatch = data.supplyChain.categories.some((category) => (
      category.companies.some((company) => companyNameMatches(company, query))
    ));

    return data.supplyChain.categories
      .map((category) => {
        const categoryMatches = matchesSearchQuery(supplyCategorySearchText(category), query);
        const companies = hasCompanyNameMatch
          ? category.companies.filter((company) => companyNameMatches(company, query))
          : categoryMatches
          ? category.companies
          : category.companies.filter((company) => {
            const haystack = supplyCompanySearchText(company, category);
            return matchesSearchQuery(haystack, query);
          });

        if (hasCompanyNameMatch && companies.length === 0) return null;
        if (!categoryMatches && companies.length === 0) return null;
        return { ...category, companies };
      })
      .filter(Boolean);
  }

  function flattenSupplyCompanies(categories) {
    return categories.flatMap((category) => (
      category.companies.map((company) => ({ company, category }))
    ));
  }

  function findSupplyCompany(companyId, categories = data.supplyChain.categories) {
    for (const category of categories) {
      const company = category.companies.find((item) => item.id === companyId);
      if (company) return { company, category };
    }
    return null;
  }

  function findSupplyCategory(categoryId, categories = data.supplyChain.categories) {
    return categories.find((category) => category.id === categoryId) || null;
  }

  function renderSupplyChain() {
    const categories = filteredSupplyCategories();
    const visibleCompanies = flattenSupplyCompanies(categories);
    const visibleCompanyIds = new Set(visibleCompanies.map((item) => item.company.id));
    const visibleCategoryIds = new Set(categories.map((category) => category.id));
    const query = normalizedText(supplySearch.value).trim();

    if (query !== supplyQuery) {
      supplyQuery = query;
      const exactCompany = visibleCompanies.find(({ company }) => normalizedText(company.name).includes(query));
      if (exactCompany) {
        activeSupplyKind = "company";
        activeSupplyId = exactCompany.company.id;
      }
    }

    const activeVisible = activeSupplyKind === "company"
      ? visibleCompanyIds.has(activeSupplyId)
      : visibleCategoryIds.has(activeSupplyId);

    if (!activeVisible) {
      if (visibleCompanies[0]) {
        activeSupplyKind = "company";
        activeSupplyId = visibleCompanies[0].company.id;
      } else if (categories[0]) {
        activeSupplyKind = "category";
        activeSupplyId = categories[0].id;
      } else {
        activeSupplyId = "";
      }
    }

    supplyColumns.replaceChildren();
    const fragment = document.createDocumentFragment();
    data.supplyChain.layerOrder.forEach((layer, index) => {
      const layerCategories = categories.filter((category) => category.layer === layer.id);
      if (layerCategories.length === 0) return;

      if (fragment.childNodes.length > 0) {
        const arrow = document.createElement("div");
        arrow.className = "chain-layer-arrow";
        arrow.textContent = "↓";
        fragment.appendChild(arrow);
      }

      const section = document.createElement("section");
      section.className = "chain-layer";
      section.style.setProperty("--layer-index", index);

      const head = document.createElement("div");
      head.className = "chain-layer-head";
      const titleWrap = document.createElement("div");
      const eyebrow = document.createElement("span");
      eyebrow.textContent = `第 ${index + 1} 層`;
      const title = document.createElement("h3");
      title.textContent = layer.label;
      titleWrap.append(eyebrow, title);
      const note = document.createElement("p");
      note.textContent = layer.note;
      head.append(titleWrap, note);

      const group = document.createElement("div");
      group.className = "chain-category-grid";
      layerCategories.forEach((category) => {
        group.appendChild(createSupplyCategory(category));
      });

      section.append(head, group);
      fragment.appendChild(section);
    });
    supplyColumns.appendChild(fragment);

    supplySearchResult.textContent = query
      ? `找到 ${categories.length.toLocaleString("zh-TW")} 個產業群、${visibleCompanies.length.toLocaleString("zh-TW")} 個節點`
      : "完整電子產業鏈：從終端銷售一路追到設備與材料。";

    const detail = activeSupplyKind === "company"
      ? findSupplyCompany(activeSupplyId, categories)
      : findSupplyCategory(activeSupplyId, categories);
    renderSupplyDetail(detail);
  }

  function createSupplyCategory(category) {
    const card = document.createElement("article");
    card.className = "supply-category-card";
    card.classList.toggle("active", activeSupplyKind === "category" && activeSupplyId === category.id);
    card.dataset.supplyCategoryId = category.id;

    const head = document.createElement("button");
    head.type = "button";
    head.className = "supply-category-head";
    head.dataset.supplyCategoryId = category.id;

    const title = document.createElement("strong");
    title.textContent = category.title;
    const count = document.createElement("span");
    count.textContent = `${category.companies.length} 節點`;
    const summary = document.createElement("p");
    summary.textContent = category.description;
    head.append(title, count, summary);

    const nodes = document.createElement("div");
    nodes.className = "supply-node-list";
    category.companies.forEach((company) => {
      nodes.appendChild(createSupplyNode(company, category));
    });

    card.append(head, nodes);
    return card;
  }

  function createSupplyNode(company, category) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "supply-node-card";
    button.dataset.supplyId = company.id;
    button.classList.toggle("active", activeSupplyKind === "company" && company.id === activeSupplyId);

    const name = document.createElement("strong");
    name.textContent = company.name;
    const summary = document.createElement("span");
    summary.className = "node-stage";
    summary.textContent = company.type === "concept" ? "概念" : category.title;
    const intro = document.createElement("small");
    intro.textContent = company.intro || category.role;

    button.append(name, summary, intro);
    return button;
  }

  function renderSupplyDetail(detail) {
    supplyDetail.replaceChildren();
    if (!detail) {
      const empty = document.createElement("p");
      empty.className = "empty-detail";
      empty.textContent = "沒有符合搜尋條件的公司或產業。";
      supplyDetail.appendChild(empty);
      return;
    }

    if (detail.company) {
      renderCompanyDetail(detail.company, detail.category);
      return;
    }

    renderCategoryDetail(detail);
  }

  function renderCompanyDetail(company, category) {
    const title = document.createElement("h3");
    title.textContent = company.name;
    const layer = document.createElement("span");
    layer.className = "detail-stage";
    layer.textContent = `位置：${layerLabel(category.layer)} / ${category.title}`;

    supplyDetail.append(
      title,
      layer,
      createDetailBlock("公司介紹", company.intro || category.description),
      createDetailBlock("所屬產業", category.title),
      createDetailList("上游供應商", company.upstream || category.upstream),
      createDetailList("下游客戶", company.downstream || category.downstream),
      createDetailBlock("電子產業鏈角色", company.role || category.role),
      createDetailList("相關概念股", company.related || category.related)
    );
  }

  function renderCategoryDetail(category) {
    const title = document.createElement("h3");
    title.textContent = category.title;
    const layer = document.createElement("span");
    layer.className = "detail-stage";
    layer.textContent = `位置：${layerLabel(category.layer)}`;

    supplyDetail.append(
      title,
      layer,
      createDetailBlock("產業介紹", category.description),
      createDetailBlock("所屬產業", category.title),
      createDetailList("上游供應商", category.upstream),
      createDetailList("下游客戶", category.downstream),
      createDetailBlock("電子產業鏈角色", category.role),
      createDetailList("相關概念股", category.related)
    );
  }

  function createDetailBlock(label, value) {
    const block = document.createElement("div");
    block.className = "detail-block";
    const title = document.createElement("b");
    title.textContent = label;
    const body = document.createElement("p");
    body.textContent = value;
    block.append(title, body);
    return block;
  }

  function createDetailList(label, items) {
    const block = document.createElement("div");
    block.className = "detail-block";
    const title = document.createElement("b");
    title.textContent = label;
    block.append(title, createChipList(items, "detail-chips"));
    return block;
  }

  function setupCollapsibleSections() {
    const configs = [
      { selector: "#calendar", label: "一週時間表", collapsed: true },
      { selector: "#map", label: "產業地圖", collapsed: true },
      { selector: "#supply-chain", label: "供應鏈地圖", collapsed: true },
      { selector: "#themes", label: "題材總覽", collapsed: true },
      { selector: "#company-radar", label: "公司雷達", collapsed: true, onExpand: maybeRefreshQuotes }
    ];

    configs.forEach((config, index) => {
      const section = document.querySelector(config.selector);
      if (!section || section.dataset.collapsibleReady === "true") return;
      const head = section.querySelector(":scope > .section-head");
      if (!head) return;

      const body = document.createElement("div");
      body.className = "section-body";
      body.id = `${section.id || `section-${index}`}-content`;
      while (head.nextSibling) {
        body.appendChild(head.nextSibling);
      }
      section.appendChild(body);

      const copy = document.createElement("div");
      copy.className = "section-head-copy";
      while (head.firstChild) {
        copy.appendChild(head.firstChild);
      }

      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "section-toggle";
      toggle.setAttribute("aria-controls", body.id);
      toggle.addEventListener("click", () => {
        const expanded = section.classList.contains("section-collapsed");
        setSectionExpanded(section, expanded, config);
      });

      head.append(copy, toggle);
      section.classList.add("collapsible-section");
      section.dataset.collapsibleReady = "true";
      setSectionExpanded(section, !config.collapsed, config);
    });
  }

  function setSectionExpanded(section, expanded, config = {}) {
    const body = section.querySelector(":scope > .section-body");
    const toggle = section.querySelector(":scope > .section-head .section-toggle");
    section.classList.toggle("section-collapsed", !expanded);
    if (body) body.hidden = !expanded;
    if (toggle) {
      toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
      toggle.textContent = expanded ? "收合內容" : "展開查看更多";
    }
    if (expanded && typeof config.onExpand === "function") {
      config.onExpand();
    }
  }

  function maybeRefreshQuotes() {
    if (!quoteUpdatedAt && !quoteLoading) {
      refreshCompanyQuotes();
    }
  }

  function expandSectionFromHash() {
    if (!location.hash) return;
    const section = document.querySelector(location.hash);
    if (!section || !section.classList.contains("collapsible-section")) return;
    setSectionExpanded(section, true, {
      onExpand: section.id === "company-radar" ? maybeRefreshQuotes : null
    });
  }

  function applyInitialSearchParams() {
    const params = new URLSearchParams(location.search);
    const supplyQueryValue = params.get("supply") || params.get("q") || "";
    const themeQueryValue = params.get("theme") || "";
    if (supplyQueryValue) {
      supplySearch.value = supplyQueryValue;
    }
    if (themeQueryValue) {
      themeSearch.value = themeQueryValue;
    }
  }

  document.querySelectorAll("[data-event-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-event-filter]").forEach((item) => {
        item.classList.toggle("active", item === button);
      });
      eventFilter = button.dataset.eventFilter || "all";
      renderEvents();
    });
  });

  themeSearch.addEventListener("input", renderThemes);
  supplySearch.addEventListener("input", renderSupplyChain);
  marketRefresh.addEventListener("click", () => refreshMarketDashboard(true));
  quoteRefresh.addEventListener("click", () => refreshCompanyQuotes(true));

  companyRail.addEventListener("click", (event) => {
    const card = event.target.closest("[data-company-id]");
    if (!card) return;
    activeCompanyId = card.dataset.companyId || activeCompanyId;
    userSelectedCompany = true;
    renderCompanies();
  });

  supplyColumns.addEventListener("click", (event) => {
    const button = event.target.closest("[data-supply-id]");
    if (button) {
      activeSupplyKind = "company";
      activeSupplyId = button.dataset.supplyId || "";
      renderSupplyChain();
      return;
    }

    const categoryButton = event.target.closest("[data-supply-category-id]");
    if (!categoryButton) return;
    activeSupplyKind = "category";
    activeSupplyId = categoryButton.dataset.supplyCategoryId || "";
    renderSupplyChain();
  });

  window.addEventListener("hashchange", expandSectionFromHash);

  setupCollapsibleSections();
  applyInitialSearchParams();
  renderStats();
  renderTodayFocus();
  renderMarketDashboard();
  renderEvents();
  renderWatchList();
  renderIndustryMap();
  renderThemes();
  renderCompanies();
  renderSupplyChain();
  refreshMarketDashboard();
  expandSectionFromHash();
})();
