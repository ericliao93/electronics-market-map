#!/usr/bin/env python3
from __future__ import annotations

import json
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).parent
OUTPUT = ROOT / "data" / "market-trends.js"
LOOKBACK_DAYS = 190

MARKETS = {
    "taiwan": {
        "title": "台灣股市趨勢",
        "subtitle": "加權指數與台灣 50 ETF",
        "currency": "TWD",
        "series": [
            {"id": "twii", "symbol": "^TWII", "name": "台灣加權指數", "shortName": "TAIEX"},
            {"id": "tw0050", "symbol": "0050.TW", "name": "元大台灣 50", "shortName": "0050"},
        ],
        "notes": [
            "台股頁面用加權指數觀察大盤方向，用 0050 觀察大型權值股交易趨勢。",
            "若 AI 供應鏈題材偏強，通常會先反映在大型電子權值與半導體鏈。"
        ],
    },
    "us": {
        "title": "美國股市趨勢",
        "subtitle": "S&P 500、Nasdaq、Dow Jones",
        "currency": "USD",
        "series": [
            {"id": "spx", "symbol": "^GSPC", "name": "S&P 500", "shortName": "SPX"},
            {"id": "ixic", "symbol": "^IXIC", "name": "Nasdaq Composite", "shortName": "NASDAQ"},
            {"id": "dji", "symbol": "^DJI", "name": "Dow Jones Industrial Average", "shortName": "DOW"},
        ],
        "notes": [
            "美股頁面用三大指數比較大型股、科技股與傳產藍籌的趨勢差異。",
            "本週 CPI、PPI、FOMC 與 Oracle / Adobe 財報都可能影響成長股估值。"
        ],
    },
}


def fetch_chart(symbol: str) -> list[dict[str, Any]]:
    period2 = int(time.time())
    period1 = period2 - LOOKBACK_DAYS * 24 * 60 * 60
    encoded = urllib.parse.quote(symbol, safe="")
    params = urllib.parse.urlencode(
        {
            "period1": period1,
            "period2": period2,
            "interval": "1d",
            "events": "history",
            "includeAdjustedClose": "true",
        }
    )
    url = f"https://query2.finance.yahoo.com/v8/finance/chart/{encoded}?{params}"
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/json",
        },
    )
    with urllib.request.urlopen(request, timeout=25) as response:
        payload = json.loads(response.read().decode("utf-8"))

    error = payload.get("chart", {}).get("error")
    if error:
        raise RuntimeError(f"Yahoo Finance returned an error for {symbol}: {error}")

    result = payload["chart"]["result"][0]
    timestamps = result.get("timestamp") or []
    quote = result["indicators"]["quote"][0]
    closes = quote.get("close") or []
    volumes = quote.get("volume") or []

    points: list[dict[str, Any]] = []
    for timestamp, close, volume in zip(timestamps, closes, volumes):
        if close is None:
            continue
        points.append(
            {
                "date": datetime.fromtimestamp(timestamp, timezone.utc).strftime("%Y-%m-%d"),
                "close": round(float(close), 4),
                "volume": int(volume or 0),
            }
        )
    return points


def enrich_series(item: dict[str, str]) -> dict[str, Any]:
    points = fetch_chart(item["symbol"])
    if len(points) < 2:
        raise RuntimeError(f"Not enough data for {item['symbol']}")

    latest = points[-1]["close"]
    previous = points[-2]["close"]
    first = points[0]["close"]
    change = latest - previous
    change_pct = change / previous * 100 if previous else 0
    range_change_pct = (latest / first - 1) * 100 if first else 0
    high = max(point["close"] for point in points)
    low = min(point["close"] for point in points)

    return {
        **item,
        "latest": round(latest, 4),
        "previous": round(previous, 4),
        "change": round(change, 4),
        "changePct": round(change_pct, 4),
        "rangeChangePct": round(range_change_pct, 4),
        "high": round(high, 4),
        "low": round(low, 4),
        "points": points,
    }


def build_payload() -> dict[str, Any]:
    markets: dict[str, Any] = {}
    for market_id, market in MARKETS.items():
        series = []
        for item in market["series"]:
            print(f"Fetching {item['symbol']}...")
            series.append(enrich_series(item))
            time.sleep(0.3)
        markets[market_id] = {**market, "series": series}

    return {
        "generatedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "source": "Yahoo Finance chart API",
        "lookbackDays": LOOKBACK_DAYS,
        "markets": markets,
    }


def main() -> int:
    payload = build_payload()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    text = "window.MARKET_TRENDS_DATA = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n"
    OUTPUT.write_text(text, encoding="utf-8")
    print(f"Wrote {OUTPUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
