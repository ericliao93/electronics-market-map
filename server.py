from __future__ import annotations

import json
import os
import re
import time
from html import unescape
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import URLError
from urllib.parse import parse_qs, quote, urlparse
from urllib.request import Request, urlopen


BASE_DIR = Path(__file__).resolve().parent
PORT = int(os.environ.get("PORT", "58110"))
HOST = os.environ.get("HOST", "0.0.0.0" if "PORT" in os.environ else "127.0.0.1")
QUOTE_CACHE_SECONDS = 60
METRIC_CACHE_SECONDS = 300
SYMBOL_RE = re.compile(r"^[A-Za-z0-9.^=_-]{1,24}$")
METRIC_ID_RE = re.compile(r"^[a-z0-9_-]{1,32}$")
QUOTE_CACHE: dict[str, tuple[float, dict]] = {}
METRIC_CACHE: dict[str, tuple[float, dict]] = {}


def json_response(handler: SimpleHTTPRequestHandler, status: int, payload: dict) -> None:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Cache-Control", "no-store")
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Content-Length", str(len(body)))
    handler.end_headers()
    handler.wfile.write(body)


def number_or_none(value):
    return value if isinstance(value, (int, float)) and not isinstance(value, bool) else None


def fetch_quote(symbol: str) -> dict:
    now = time.time()
    cached = QUOTE_CACHE.get(symbol)
    if cached and now - cached[0] < QUOTE_CACHE_SECONDS:
        return cached[1]

    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{quote(symbol)}?range=1d&interval=1d"
    request = Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/json",
        },
    )

    try:
        with urlopen(request, timeout=8) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except (URLError, TimeoutError, json.JSONDecodeError, OSError) as error:
        result = {"ok": False, "symbol": symbol, "error": str(error)}
        QUOTE_CACHE[symbol] = (now, result)
        return result

    chart = payload.get("chart") or {}
    results = chart.get("result") or []
    if not results:
        result = {"ok": False, "symbol": symbol, "error": "no quote result"}
        QUOTE_CACHE[symbol] = (now, result)
        return result

    item = results[0]
    meta = item.get("meta") or {}
    price = number_or_none(meta.get("regularMarketPrice"))
    previous_close = number_or_none(meta.get("previousClose")) or number_or_none(meta.get("chartPreviousClose"))

    if price is None:
        closes = (((item.get("indicators") or {}).get("quote") or [{}])[0].get("close") or [])
        numeric_closes = [value for value in closes if isinstance(value, (int, float))]
        if numeric_closes:
            price = numeric_closes[-1]

    if previous_close is None:
        closes = (((item.get("indicators") or {}).get("quote") or [{}])[0].get("close") or [])
        numeric_closes = [value for value in closes if isinstance(value, (int, float))]
        if len(numeric_closes) >= 2:
            previous_close = numeric_closes[-2]

    if price is None or previous_close in (None, 0):
        result = {"ok": False, "symbol": symbol, "error": "missing price data"}
        QUOTE_CACHE[symbol] = (now, result)
        return result

    change = price - previous_close
    market_time = number_or_none(meta.get("regularMarketTime"))
    result = {
        "ok": True,
        "symbol": meta.get("symbol") or symbol,
        "price": price,
        "previousClose": previous_close,
        "change": change,
        "changePercent": change / previous_close * 100,
        "currency": meta.get("currency") or "",
        "exchangeName": meta.get("fullExchangeName") or meta.get("exchangeName") or "",
        "marketTime": datetime.fromtimestamp(market_time, timezone.utc).isoformat() if market_time else "",
        "shortName": meta.get("shortName") or meta.get("longName") or "",
    }
    QUOTE_CACHE[symbol] = (now, result)
    return result


def fetch_text(url: str, referer: str = "") -> str:
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "text/html,application/json,text/plain,*/*",
    }
    if referer:
        headers["Referer"] = referer
    request = Request(url, headers=headers)
    with urlopen(request, timeout=8) as response:
        return response.read().decode("utf-8", "replace")


def parse_metric_date(value: str) -> str:
    if not value:
        return ""
    for pattern in ("%B %d, %Y", "%Y-%m-%d"):
        try:
            date = datetime.strptime(value.strip(), pattern).replace(tzinfo=timezone.utc)
            return date.isoformat()
        except ValueError:
            continue
    return ""


def metric_payload(metric_id: str, price, previous_close, change, change_percent, market_time: str, source: str, short_name: str) -> dict:
    if price is None or previous_close in (None, 0):
        return {"ok": False, "id": metric_id, "error": "missing metric data"}
    if change is None:
        change = price - previous_close
    if change_percent is None:
        change_percent = change / previous_close * 100
    return {
        "ok": True,
        "id": metric_id,
        "symbol": metric_id,
        "price": price,
        "previousClose": previous_close,
        "change": change,
        "changePercent": change_percent,
        "currency": "",
        "exchangeName": source,
        "marketTime": market_time,
        "shortName": short_name,
    }


def extract_meta_description(html_text: str) -> str:
    match = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']', html_text, re.I)
    if not match:
        match = re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']description["\']', html_text, re.I)
    return unescape(match.group(1)) if match else ""


def fetch_us2y() -> dict:
    html_text = fetch_text("https://tradingeconomics.com/united-states/2-year-note-yield")
    description = extract_meta_description(html_text)
    match = re.search(
        r"yield on US 2 Year.*?(rose|fell) to ([0-9.]+)% on ([A-Za-z]+ \d{1,2}, \d{4}), marking a ([0-9.]+) percentage points (increase|decrease)",
        description,
        re.I,
    )
    if not match:
        return {"ok": False, "id": "us2y", "error": "unable to parse US 2Y yield"}

    price = float(match.group(2))
    move = float(match.group(4))
    direction = match.group(5).lower()
    change = move if direction == "increase" else -move
    previous_close = price - change
    return metric_payload(
        "us2y",
        price,
        previous_close,
        change,
        None,
        parse_metric_date(match.group(3)),
        "Trading Economics",
        "US 2 Year Treasury Yield",
    )


def fetch_bdi() -> dict:
    html_text = fetch_text("https://tradingeconomics.com/commodity/baltic")
    description = extract_meta_description(html_text)
    match = re.search(
        r"Baltic Dry (?:fell|rose) to ([0-9,.]+) Index Points on ([A-Za-z]+ \d{1,2}, \d{4}), (up|down) ([0-9.]+)%",
        description,
        re.I,
    )
    if not match:
        return {"ok": False, "id": "bdi", "error": "unable to parse BDI"}

    price = float(match.group(1).replace(",", ""))
    direction = match.group(3).lower()
    change_percent = float(match.group(4))
    if direction == "down":
        change_percent = -change_percent
    previous_close = price / (1 + change_percent / 100)
    change = price - previous_close
    return metric_payload(
        "bdi",
        price,
        previous_close,
        change,
        change_percent,
        parse_metric_date(match.group(2)),
        "Trading Economics",
        "Baltic Dry Index",
    )


def fetch_scfi() -> dict:
    text = fetch_text(
        "https://en.sse.net.cn/currentIndex?indexName=scfi",
        referer="https://en.sse.net.cn/indices/scfinew.jsp",
    )
    payload = json.loads(text)
    lines = (((payload.get("data") or {}).get("lineDataList")) or [])
    if not lines:
        return {"ok": False, "id": "scfi", "error": "missing SCFI lines"}
    item = lines[0]
    price = number_or_none(item.get("currentContent"))
    previous_close = number_or_none(item.get("lastContent"))
    change = number_or_none(item.get("absolute"))
    change_percent = number_or_none(item.get("percentage"))
    market_time = parse_metric_date((payload.get("data") or {}).get("currentDate") or "")
    return metric_payload(
        "scfi",
        price,
        previous_close,
        change,
        change_percent,
        market_time,
        "Shanghai Shipping Exchange",
        "Shanghai Containerized Freight Index",
    )


def fetch_external_metric(metric_id: str) -> dict:
    now = time.time()
    cached = METRIC_CACHE.get(metric_id)
    if cached and now - cached[0] < METRIC_CACHE_SECONDS:
        return cached[1]

    fetchers = {
        "us2y": fetch_us2y,
        "bdi": fetch_bdi,
        "scfi": fetch_scfi,
    }
    fetcher = fetchers.get(metric_id)
    if not fetcher:
        result = {"ok": False, "id": metric_id, "error": "unsupported metric"}
        METRIC_CACHE[metric_id] = (now, result)
        return result

    try:
        result = fetcher()
    except (URLError, TimeoutError, json.JSONDecodeError, OSError, ValueError) as error:
        result = {"ok": False, "id": metric_id, "error": str(error)}
    METRIC_CACHE[metric_id] = (now, result)
    return result


class DashboardHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/quotes":
            query = parse_qs(parsed.query)
            raw_symbols = query.get("symbols", [""])[0].split(",")
            symbols = []
            for symbol in raw_symbols:
                normalized = symbol.strip()
                if normalized and SYMBOL_RE.match(normalized) and normalized not in symbols:
                    symbols.append(normalized)

            if not symbols:
                json_response(self, 400, {"updatedAt": datetime.now(timezone.utc).isoformat(), "results": []})
                return

            symbols = symbols[:80]
            workers = min(10, len(symbols))
            with ThreadPoolExecutor(max_workers=workers) as pool:
                results = list(pool.map(fetch_quote, symbols))

            json_response(
                self,
                200,
                {
                    "updatedAt": datetime.now(timezone.utc).isoformat(),
                    "source": "Yahoo Finance chart",
                    "results": results,
                },
            )
            return

        if parsed.path == "/api/market-metrics":
            query = parse_qs(parsed.query)
            raw_ids = query.get("ids", [""])[0].split(",")
            metric_ids = []
            for metric_id in raw_ids:
                normalized = metric_id.strip().lower()
                if normalized and METRIC_ID_RE.match(normalized) and normalized not in metric_ids:
                    metric_ids.append(normalized)

            if not metric_ids:
                json_response(self, 400, {"updatedAt": datetime.now(timezone.utc).isoformat(), "results": []})
                return

            metric_ids = metric_ids[:20]
            workers = min(5, len(metric_ids))
            with ThreadPoolExecutor(max_workers=workers) as pool:
                results = list(pool.map(fetch_external_metric, metric_ids))

            json_response(
                self,
                200,
                {
                    "updatedAt": datetime.now(timezone.utc).isoformat(),
                    "source": "Trading Economics and Shanghai Shipping Exchange",
                    "results": results,
                },
            )
            return

        super().do_GET()

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()


try:
    import quote_api_patch
    quote_api_patch.install(globals())
except Exception as patch_error:
    print(f'quote api patch disabled: {patch_error}')

def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), DashboardHandler)
    print(f"Serving AI stock map at http://{HOST}:{PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()

