(function () {
  const pageMarket = document.body.dataset.market;
  const payload = window.MARKET_TRENDS_DATA;
  const market = payload.markets[pageMarket];
  const colors = ["#0f766e", "#315f9f", "#b7791f", "#b04444", "#387b4b"];
  const state = {
    range: "3m",
    activeSeries: market.series[0].id,
  };

  const rangeDays = {
    "1m": 31,
    "3m": 93,
    "6m": 186,
    all: Infinity,
  };

  function formatNumber(value) {
    return new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 2 }).format(value);
  }

  function formatPct(value) {
    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
  }

  function classFor(value) {
    return value >= 0 ? "positive" : "negative";
  }

  function pointsFor(series) {
    const days = rangeDays[state.range];
    if (!Number.isFinite(days)) return series.points;
    return series.points.slice(-days);
  }

  function activeSeries() {
    return market.series.find((series) => series.id === state.activeSeries) || market.series[0];
  }

  function seriesChangeForRange(series) {
    const points = pointsFor(series);
    if (points.length < 2) return 0;
    return (points[points.length - 1].close / points[0].close - 1) * 100;
  }

  function renderHero() {
    document.getElementById("marketTitle").textContent = market.title;
    document.getElementById("marketSubtitle").textContent = market.subtitle;
    document.getElementById("generatedAt").textContent = new Date(payload.generatedAt).toLocaleString("zh-TW", {
      timeZone: "Asia/Taipei",
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function renderSummary() {
    const main = activeSeries();
    const points = pointsFor(main);
    const latest = points[points.length - 1];
    const first = points[0];
    const rangeChange = first ? (latest.close / first.close - 1) * 100 : 0;
    const high = Math.max(...points.map((point) => point.close));
    const low = Math.min(...points.map((point) => point.close));

    const cards = [
      ["最新收盤", formatNumber(latest.close), main.shortName],
      ["區間漲跌", formatPct(rangeChange), state.range.toUpperCase()],
      ["區間高點", formatNumber(high), "收盤價"],
      ["區間低點", formatNumber(low), "收盤價"],
    ];

    document.getElementById("marketSummary").innerHTML = cards.map((card, index) => `
      <article class="metric-card">
        <span>${card[0]}</span>
        <strong class="${index === 1 ? classFor(rangeChange) : ""}">${card[1]}</strong>
        <small>${card[2]}</small>
      </article>
    `).join("");
  }

  function renderControls() {
    document.querySelectorAll("[data-range]").forEach((button) => {
      button.classList.toggle("active", button.dataset.range === state.range);
    });

    document.getElementById("seriesControls").innerHTML = market.series.map((series) => `
      <button type="button" data-series="${series.id}" class="${series.id === state.activeSeries ? "active" : ""}">
        ${series.shortName}
      </button>
    `).join("");
  }

  function createPath(points, xFor, yFor) {
    return points.map((point, index) => {
      const x = xFor(index);
      const y = yFor(point.close);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(" ");
  }

  function renderChart() {
    const width = 860;
    const height = 430;
    const pad = { top: 22, right: 28, bottom: 42, left: 58 };
    const series = activeSeries();
    const points = pointsFor(series);
    const values = points.map((point) => point.close);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const innerW = width - pad.left - pad.right;
    const innerH = height - pad.top - pad.bottom;
    const xFor = (index) => pad.left + (index / Math.max(points.length - 1, 1)) * innerW;
    const yFor = (value) => pad.top + (1 - (value - min) / span) * innerH;
    const linePath = createPath(points, xFor, yFor);
    const areaPath = `${linePath} L ${xFor(points.length - 1).toFixed(2)} ${height - pad.bottom} L ${pad.left} ${height - pad.bottom} Z`;
    const color = colors[market.series.findIndex((item) => item.id === series.id) % colors.length];
    const grid = [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
      const y = pad.top + ratio * innerH;
      const value = max - ratio * span;
      return `
        <line class="grid-line" x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}"></line>
        <text class="axis-label" x="${pad.left - 10}" y="${y + 4}" text-anchor="end">${formatNumber(value)}</text>
      `;
    }).join("");
    const labelIndexes = [0, Math.floor(points.length / 2), points.length - 1];
    const xLabels = labelIndexes.map((index) => {
      const point = points[index];
      return `<text class="axis-label" x="${xFor(index)}" y="${height - 14}" text-anchor="middle">${point.date.slice(5)}</text>`;
    }).join("");

    document.getElementById("trendChart").innerHTML = `
      <svg class="trend-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${series.name} 趨勢圖">
        ${grid}
        ${xLabels}
        <path class="trend-area" d="${areaPath}" fill="${color}"></path>
        <path class="trend-line" d="${linePath}" stroke="${color}"></path>
        <circle cx="${xFor(points.length - 1)}" cy="${yFor(points[points.length - 1].close)}" r="5" fill="${color}"></circle>
        <text class="chart-label" x="${width - pad.right}" y="${pad.top + 14}" text-anchor="end">${series.name}</text>
      </svg>
    `;
  }

  function renderNotes() {
    document.getElementById("marketNotes").innerHTML = market.notes
      .map((note) => `<li>${note}</li>`)
      .join("");
  }

  function renderTable() {
    const rows = market.series.map((series) => {
      const change = seriesChangeForRange(series);
      return `
        <tr>
          <td><strong>${series.shortName}</strong><br><small>${series.name}</small></td>
          <td>${formatNumber(series.latest)}</td>
          <td class="${classFor(series.changePct)}">${formatPct(series.changePct)}</td>
          <td class="${classFor(change)}">${formatPct(change)}</td>
          <td>${formatNumber(series.high)}</td>
          <td>${formatNumber(series.low)}</td>
        </tr>
      `;
    }).join("");

    document.getElementById("marketTableBody").innerHTML = rows;
  }

  function renderAll() {
    renderHero();
    renderSummary();
    renderControls();
    renderChart();
    renderNotes();
    renderTable();
  }

  document.querySelectorAll("[data-range]").forEach((button) => {
    button.addEventListener("click", () => {
      state.range = button.dataset.range;
      renderAll();
    });
  });

  document.getElementById("seriesControls").addEventListener("click", (event) => {
    const button = event.target.closest("[data-series]");
    if (!button) return;
    state.activeSeries = button.dataset.series;
    renderAll();
  });

  renderAll();
})();
