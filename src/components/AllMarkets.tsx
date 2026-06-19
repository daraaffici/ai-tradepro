"use client";

import { useEffect, useState } from "react";

type MarketItem = {
  symbol: string;
  price: number;
};

export default function AllMarkets() {
  const [markets, setMarkets] = useState<MarketItem[]>([]);

  useEffect(() => {
    loadMarkets();

    const interval = setInterval(() => {
      loadMarkets();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  async function loadMarkets() {
    try {
      const symbols = [
        "BTCUSDT",
        "ETHUSDT",
        "SOLUSDT",
        "EURUSD",
        "GBPUSD",
        "USDJPY",
        "XAUUSD",
        "AAPL",
        "TSLA",
        "NVDA",
      ];

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
          };
        })
      );

      setMarkets(results);
    } catch (error) {
      console.error(error);
    }
  }

  const crypto = markets.filter((x) =>
    ["BTCUSDT", "ETHUSDT", "SOLUSDT"].includes(x.symbol)
  );

  const forex = markets.filter((x) =>
    ["EURUSD", "GBPUSD", "USDJPY"].includes(x.symbol)
  );

  const gold = markets.filter((x) =>
    ["XAUUSD"].includes(x.symbol)
  );

  const stocks = markets.filter((x) =>
    ["AAPL", "TSLA", "NVDA"].includes(x.symbol)
  );

  const groups = [
    { title: "Crypto", items: crypto },
    { title: "Forex", items: forex },
    { title: "Gold", items: gold },
    { title: "Stocks", items: stocks },
  ];

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mt-8">
      {groups.map((group) => (
        <div
          key={group.title}
          className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]"
        >
          <h2 className="text-xl font-bold mb-4">
            {group.title}
          </h2>

          <div className="space-y-3">
            {group.items.map((item) => (
              <div
                key={item.symbol}
                className="bg-[var(--input)] p-4 rounded-xl border border-[var(--border)]"
              >
                <p className="font-bold">
                  {item.symbol}
                </p>

                <p className="text-green-400">
                  ${item.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}