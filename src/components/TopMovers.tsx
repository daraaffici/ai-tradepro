"use client";

import { useEffect, useState } from "react";

type MarketItem = {
  symbol: string;
  price: number;
  change: number;
};

const symbols = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
];

export default function TopMovers() {
  const [markets, setMarkets] = useState<MarketItem[]>([]);

  useEffect(() => {
    loadMarkets();

    const interval = setInterval(loadMarkets, 30000);

    return () => clearInterval(interval);
  }, []);

  async function loadMarkets() {
    try {
      const results = await Promise.all(
        symbols.map(async (symbol) => {
          const res = await fetch(
            `/api/market/all-price?symbol=${symbol}`,
            { cache: "no-store" }
          );

          const data = await res.json();

          return {
            symbol,
            price: Number(data.price || 0),
            change: Number(data.change || 0),
          };
        })
      );

      setMarkets(results);
    } catch (error) {
      console.error(error);
    }
  }

  const gainers = [...markets]
    .sort((a, b) => b.change - a.change)
    .slice(0, 5);

  const losers = [...markets]
    .sort((a, b) => a.change - b.change)
    .slice(0, 5);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Top Gainers */}
      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
        <h2 className="text-xl font-bold mb-4 text-green-400">
          📈 Top Gainers
        </h2>

        <div className="space-y-3">
          {gainers.map((item) => (
            <div
              key={item.symbol}
              className="flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{item.symbol}</p>
                <p className="text-sm text-[var(--muted)]">
                  ${item.price.toLocaleString()}
                </p>
              </div>

              <p className="text-green-400 font-bold">
                +{item.change.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Losers */}
      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
        <h2 className="text-xl font-bold mb-4 text-red-400">
          📉 Top Losers
        </h2>

        <div className="space-y-3">
          {losers.map((item) => (
            <div
              key={item.symbol}
              className="flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{item.symbol}</p>
                <p className="text-sm text-[var(--muted)]">
                  ${item.price.toLocaleString()}
                </p>
              </div>

              <p className="text-red-400 font-bold">
                {item.change.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}