from __future__ import annotations

import json
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from urllib.error import URLError
from urllib.parse import parse_qs, quote, urlparse
from urllib.request import Request, urlopen


QUOTE_CONSENSUS_TOLERANCE = 0.35


def install(ns: dict) -> None:
    number_or_none = ns["number_or_none"]
    quote_cache = ns["QUOTE_CACHE"]
    cache_seconds = ns["QUOTE_CACHE_SECONDS"]
    symbol_re = ns["SYMBOL_RE"]
    json_response = ns["json_response"]
    old_do_get = ns["DashboardHandler"].do_GET

    def iso_from_timestamp(value) -> str:
        timestamp = number_or_none(value)
        return datetime.fromtimestamp(timestamp, timezone.utc).isoformat() if timestamp else ""

    def market_for_symbol(symbol: str) -> tuple[str, str]:
        upper = symbol.upper()
        if upper.endswith(".TW") or upper.endswith(".TWO"):
            return "tw", "\u53f0\u80a1"
        if upper.endswith(".T"):
            return "jp", "\u65e5\u80a1"
        if upper.endswith(".KS") or upper.endswith(".KQ"):
            return "kr", "\u97d3\u80a1"
        if upper.endswith(".HK"):
            return "other", "\u5176\u4ed6"
        return "us", "\u7f8e\u80a1"

    def fetch_yahoo_chart_payload(symbol: str, range_value: str, interval: str) -> dict:
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{quote(symbol)}?range={range_value}&interval={interval}"
        request = Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json",
            },
        )
        with urlopen(request, timeout=8) as response:
            return json.loads(response.read().decode("utf-8"))

    def provider_from_yahoo_chart(symbol: str, range_value: str, interval: str, provider_name: str) -> dict:
        try:
            payload = fetch_yahoo_chart_payload(symbol, range_value, interval)
        except (URLError, TimeoutError, json.JSONDecodeError, OSError) as error:
            return {"ok": False, "provider": provider_name, "symbol": symbol, "error": str(error)}

        chart = payload.get("chart") or {}
        chart_error = chart.get("error")
        if chart_error:
            return {"ok": False, "provider": provider_name, "symbol": symbol, "error": str(chart_error)}

        results = chart.get("result") or []
        if not results:
            return {"ok": False, "provider": provider_name, "symbol": symbol, "error": "no quote result"}

        item = results[0]
        meta = item.get("meta") or {}
        price = number_or_none(meta.get("regularMarketPrice"))
        previous_close = number_or_none(meta.get("previousClose")) or number_or_none(meta.get("chartPreviousClose"))
        quote_block = ((item.get("indicators") or {}).get("quote") or [{}])[0]
        closes = quote_block.get("close") or []
        numeric_closes = [value for value in closes if isinstance(value, (int, float))]

        if price is None and numeric_closes:
            price = numeric_closes[-1]
        if previous_close is None and len(numeric_closes) >= 2:
            previous_close = numeric_closes[-2]
        if price is None or previous_close in (None, 0):
            return {"ok": False, "provider": provider_name, "symbol": symbol, "error": "missing price data"}

        change = price - previous_close
        market_time = number_or_none(meta.get("regularMarketTime"))
        return {
            "ok": True,
            "provider": provider_name,
            "symbol": meta.get("symbol") or symbol,
            "price": price,
            "previousClose": previous_close,
            "change": change,
            "changePercent": change / previous_close * 100,
            "currency": meta.get("currency") or "",
            "exchangeName": meta.get("fullExchangeName") or meta.get("exchangeName") or "",
            "marketTime": iso_from_timestamp(market_time),
            "marketTimestamp": market_time or 0,
            "shortName": meta.get("shortName") or meta.get("longName") or "",
        }

    def quote_consensus(valid_providers: list[dict]) -> tuple[str, float]:
        if len(valid_providers) < 2:
            return "single", 0
        prices = [provider["price"] for provider in valid_providers if number_or_none(provider.get("price"))]
        if len(prices) < 2:
            return "single", 0
        highest = max(prices)
        lowest = min(prices)
        diff_percent = (highest - lowest) / highest * 100 if highest else 0
        return ("verified" if diff_percent <= QUOTE_CONSENSUS_TOLERANCE else "diverged", diff_percent)

    def merge_quote(symbol: str, providers: list[dict], fetched_at: str) -> dict:
        valid = [provider for provider in providers if provider.get("ok")]
        market_id, market_label = market_for_symbol(symbol)
        if not valid:
            return {
                "ok": False,
                "symbol": symbol,
                "market": market_id,
                "marketLabel": market_label,
                "fetchedAt": fetched_at,
                "error": "; ".join(provider.get("error", "unknown error") for provider in providers) or "missing price data",
                "providers": providers,
                "providerCount": 0,
                "consensus": "failed",
            }

        primary = sorted(valid, key=lambda provider: provider.get("marketTimestamp") or 0, reverse=True)[0]
        consensus, diff_percent = quote_consensus(valid)
        return {
            **{key: value for key, value in primary.items() if key != "marketTimestamp"},
            "symbol": primary.get("symbol") or symbol,
            "market": market_id,
            "marketLabel": market_label,
            "fetchedAt": fetched_at,
            "providerCount": len(valid),
            "providers": [
                {key: value for key, value in provider.items() if key != "marketTimestamp"}
                for provider in providers
            ],
            "providerNames": [provider["provider"] for provider in valid],
            "consensus": consensus,
            "consensusDiffPercent": diff_percent,
        }

    def fetch_quote(symbol: str, bypass_cache: bool = False, fetched_at: str | None = None) -> dict:
        now = time.time()
        cache_key = symbol.upper()
        cached = quote_cache.get(cache_key)
        if not bypass_cache and cached and now - cached[0] < cache_seconds:
            return cached[1]

        fetched_at = fetched_at or datetime.now(timezone.utc).isoformat()
        providers = [
            provider_from_yahoo_chart(symbol, "1d", "1m", "Yahoo \u5206\u7dda"),
            provider_from_yahoo_chart(symbol, "5d", "1d", "Yahoo \u65e5\u7dda"),
        ]
        result = merge_quote(symbol, providers, fetched_at)
        quote_cache[cache_key] = (now, result)
        return result

    def patched_do_get(self):
        parsed = urlparse(self.path)
        if parsed.path != "/api/quotes":
            return old_do_get(self)

        query = parse_qs(parsed.query)
        raw_symbols = query.get("symbols", [""])[0].split(",")
        symbols = []
        for symbol in raw_symbols:
            normalized = symbol.strip()
            if normalized and symbol_re.match(normalized) and normalized not in symbols:
                symbols.append(normalized)

        if not symbols:
            json_response(self, 400, {"updatedAt": datetime.now(timezone.utc).isoformat(), "results": []})
            return

        symbols = symbols[:80]
        fetched_at = datetime.now(timezone.utc).isoformat()
        force_value = (query.get("force", [""])[0] or "").lower()
        bypass_cache = force_value in {"1", "true", "yes", "y"} or "_" in query
        workers = min(12, len(symbols))
        with ThreadPoolExecutor(max_workers=workers) as pool:
            results = list(pool.map(lambda item: fetch_quote(item, bypass_cache, fetched_at), symbols))

        normalized_results = []
        for result in results:
            item = dict(result)
            item["batchUpdatedAt"] = fetched_at
            normalized_results.append(item)

        json_response(
            self,
            200,
            {
                "updatedAt": fetched_at,
                "source": "Yahoo Finance chart cross-check",
                "providers": ["Yahoo \u5206\u7dda", "Yahoo \u65e5\u7dda"],
                "requested": len(symbols),
                "ok": sum(1 for result in normalized_results if result.get("ok")),
                "failed": sum(1 for result in normalized_results if not result.get("ok")),
                "results": normalized_results,
            },
        )

    ns["fetch_quote"] = fetch_quote
    ns["DashboardHandler"].do_GET = patched_do_get
    print("quote api patch enabled")
