"use client";

import { useEffect, useState } from "react";

type WatchlistItem = {
  id: number;
  symbol: string;
};

type MarketPrice = {
  price: number;
  change: number;
  source?: string;
};

const marketOptions = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "AVAXUSDT",
  "LINKUSDT",
  "SUIUSDT",
  "AAPL",
  "TSLA",
  "NVDA",
  "MSFT",
  "AMD",
  "GOOGL",
  "AMZN",
  "META",
];

export default function Watchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [prices, setPrices] = useState<Record<string, MarketPrice>>({});
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user.id) {
        setItems([]);
        setPrices({});
        return;
      }

      const res = await fetch(`/api/watchlist?userId=${user.id}`, {
        cache: "no-store",
      });

      const data: WatchlistItem[] = await res.json();
      setItems(data);

      const priceResults = await Promise.all(
        data.map(async (item) => {
          const cleanSymbol = item.symbol.trim().toUpperCase();

          const marketRes = await fetch(
            `/api/market/all-price?symbol=${cleanSymbol}`,
            { cache: "no-store" }
          );

          const marketData = await marketRes.json();

          return {
            symbol: cleanSymbol,
            price: Number(marketData.price || 0),
            change: Number(marketData.change || 0),
            source: marketData.source,
          };
        })
      );

      const priceMap: Record<string, MarketPrice> = {};

      priceResults.forEach((item) => {
        priceMap[item.symbol] = {
          price: item.price,
          change: item.change,
          source: item.source,
        };
      });

      setPrices(priceMap);
    } catch (error) {
      console.error("Failed to load watchlist:", error);
    } finally {
      setLoading(false);
    }
  }

  async function addWatchlist() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.id) {
      alert("Please login again");
      return;
    }

    const cleanSymbol = symbol.trim().toUpperCase();

    const res = await fetch("/api/watchlist/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symbol: cleanSymbol,
        userId: user.id,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      alert(data.error || "Failed to add watchlist");
      return;
    }

    await loadData();
  }

  async function deleteWatchlist(id: number) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.id) {
      alert("Please login again");
      return;
    }

    await fetch("/api/watchlist/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        userId: user.id,
      }),
    });

    await loadData();
  }

  return (
    <div className="bg-[var(--card)] mt-8 p-5 rounded-2xl border border-[var(--border)]">
      <h2 className="text-xl font-bold mb-4">Watchlist</h2>

      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="bg-[var(--input)] p-3 rounded-lg border border-[var(--border)] flex-1"
        >
          {marketOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          onClick={addWatchlist}
          className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-lg font-bold text-white"
        >
          Add Watchlist
        </button>
      </div>

      {loading ? (
        <p className="text-[var(--muted)]">Loading watchlist...</p>
      ) : items.length === 0 ? (
        <p className="text-[var(--muted)]">No watchlist items yet</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const cleanSymbol = item.symbol.trim().toUpperCase();
            const market = prices[cleanSymbol];

            return (
              <div
                key={item.id}
                className="bg-[var(--input)] p-4 rounded-xl border border-[var(--border)] flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">⭐ {cleanSymbol}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {market?.source || "Market"}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p>
                      {market?.price && market.price > 0
                        ? `$${market.price.toLocaleString()}`
                        : "Unavailable"}
                    </p>

                    <p
                      className={
                        (market?.change ?? 0) >= 0
                          ? "text-green-400 text-sm"
                          : "text-red-400 text-sm"
                      }
                    >
                      {(market?.change ?? 0).toFixed(2)}%
                    </p>
                  </div>

                  <button
                    onClick={() => deleteWatchlist(item.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    ❌
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}