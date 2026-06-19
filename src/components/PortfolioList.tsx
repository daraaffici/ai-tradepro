"use client";

import { useEffect, useState } from "react";

type Portfolio = {
  id: number;
  symbol: string;
  quantity: number;
  buyPrice: number;
};

export default function PortfolioList() {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    loadData();

    const interval = setInterval(() => {
      loadData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    const portfolioRes = await fetch("/api/portfolio", {
      cache: "no-store",
    });

    const portfolioData: Portfolio[] = await portfolioRes.json();
    setItems(portfolioData);

    const uniqueSymbols = Array.from(
      new Set(portfolioData.map((item) => item.symbol))
    );

    const priceMap: Record<string, number> = {};

    for (const symbol of uniqueSymbols) {
      const res = await fetch(`/api/market/all-price?symbol=${symbol}`, {
        cache: "no-store",
      });

      const data = await res.json();
      priceMap[symbol] = Number(data.price || 0);
    }

    setPrices(priceMap);
  }

  async function deletePortfolio(id: number) {
    await fetch("/api/portfolio/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div className="bg-[var(--card)] mt-8 rounded-2xl p-5 border border-[var(--border)]">
      <h2 className="text-xl font-bold mb-4">My Portfolio</h2>

      <div className="space-y-4">
        {items.map((item) => {
          const apiPrice = prices[item.symbol];
          const currentPrice =
            apiPrice && apiPrice > 0 ? apiPrice : item.buyPrice;

          const profit = (currentPrice - item.buyPrice) * item.quantity;

          const profitPercent =
            item.buyPrice > 0
              ? ((currentPrice - item.buyPrice) / item.buyPrice) * 100
              : 0;

          return (
            <div
              key={item.id}
              className="bg-[var(--input)] p-4 rounded-xl border border-[var(--border)]"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">{item.symbol}</p>
                  <p className="text-[var(--muted)] text-sm">
                    Qty: {item.quantity}
                  </p>
                </div>

                <button
                  onClick={() => deletePortfolio(item.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  ❌
                </button>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-[var(--muted)] text-sm">Buy Price</p>
                  <p>${item.buyPrice.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-[var(--muted)] text-sm">Current Price</p>
                  <p>
                    {apiPrice && apiPrice > 0
                      ? `$${currentPrice.toLocaleString()}`
                      : "Unavailable"}
                  </p>
                </div>

                <div>
                  <p className="text-[var(--muted)] text-sm">Position Value</p>
                  <p>
                    ${(currentPrice * item.quantity).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-[var(--muted)] text-sm">P&L</p>
                  <p
                    className={
                      profit >= 0 ? "text-green-400" : "text-red-400"
                    }
                  >
                    ${profit.toFixed(2)} ({profitPercent.toFixed(2)}%)
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}