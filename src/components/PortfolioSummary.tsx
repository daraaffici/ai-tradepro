"use client";

import { useEffect, useState } from "react";

type Portfolio = {
  id: number;
  symbol: string;
  quantity: number;
  buyPrice: number;
};

function getUserId() {
  try {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return null;

    const user = JSON.parse(savedUser);
    return user?.id || null;
  } catch {
    return null;
  }
}

export default function PortfolioSummary() {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});

  async function loadData() {
    const userId = getUserId();

    if (!userId) {
      setItems([]);
      setPrices({});
      return;
    }

    const portfolioRes = await fetch(`/api/portfolio?userId=${userId}`, {
      cache: "no-store",
    });

    const portfolioData: Portfolio[] = await portfolioRes.json();
    const safeData = Array.isArray(portfolioData) ? portfolioData : [];

    setItems(safeData);

    const uniqueSymbols = Array.from(
      new Set(safeData.map((item) => item.symbol))
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

  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const investedValue = items.reduce(
    (sum, item) => sum + item.quantity * item.buyPrice,
    0
  );

  const currentValue = items.reduce((sum, item) => {
    const currentPrice = prices[item.symbol] || item.buyPrice;
    return sum + item.quantity * currentPrice;
  }, 0);

  const profit = currentValue - investedValue;
  const profitPercent =
    investedValue > 0 ? (profit / investedValue) * 100 : 0;

  return (
    <div className="grid md:grid-cols-3 gap-4 mt-8">
      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
        <p className="text-[var(--muted)]">Portfolio Value</p>
        <h2 className="text-3xl font-bold mt-2">
          ${currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </h2>
      </div>

      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
        <p className="text-[var(--muted)]">Open Positions</p>
        <h2 className="text-3xl font-bold mt-2">{items.length}</h2>
      </div>

      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
        <p className="text-[var(--muted)]">Profit / Loss</p>
        <h2
          className={`text-3xl font-bold mt-2 ${
            profit >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          ${profit.toFixed(2)}
        </h2>

        <p className={profit >= 0 ? "text-green-400 mt-2" : "text-red-400 mt-2"}>
          {profitPercent.toFixed(2)}%
        </p>
      </div>
    </div>
  );
}