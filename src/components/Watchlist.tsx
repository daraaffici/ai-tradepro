"use client";

import { useEffect, useState } from "react";

type WatchlistItem = {
  id: number;
  symbol: string;
};

type MarketPrice = {
  price: number;
  change: number;
};

export default function Watchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [prices, setPrices] = useState<Record<string, MarketPrice>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    try {
      const res = await fetch("/api/watchlist", { cache: "no-store" });
      const data: WatchlistItem[] = await res.json();

      setItems(data);

      const priceMap: Record<string, MarketPrice> = {};

      for (const item of data) {
        const marketRes = await fetch(
          `/api/market/all-price?symbol=${item.symbol}`,
          { cache: "no-store" }
        );

        const marketData = await marketRes.json();

        priceMap[item.symbol] = {
          price: Number(marketData.price || 0),
          change: Number(marketData.change || 0),
        };
      }

      setPrices(priceMap);
    } catch (error) {
      console.error("Failed to load watchlist:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteWatchlist(id: number) {
    await fetch("/api/watchlist/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="bg-[var(--card)] mt-8 p-5 rounded-2xl border border-[var(--border)]">
      <h2 className="text-xl font-bold mb-4">Watchlist</h2>

      {loading ? (
        <p className="text-[var(--muted)]">Loading watchlist...</p>
      ) : items.length === 0 ? (
        <p className="text-[var(--muted)]">No watchlist items yet</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const market = prices[item.symbol];

            return (
              <div
                key={item.id}
                className="bg-[var(--input)] p-4 rounded-xl border border-[var(--border)] flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">⭐ {item.symbol}</p>
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