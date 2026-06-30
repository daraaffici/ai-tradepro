"use client";

import { useEffect, useState } from "react";

type Portfolio = {
  id: number;
  symbol: string;
  quantity: number;
  buyPrice: number;
};

type PerformanceItem = {
  symbol: string;
  profitPercent: number;
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

export default function PortfolioAnalytics() {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

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

  const totalValue = items.reduce((sum, item) => {
    const apiPrice = prices[item.symbol];
    const currentPrice = apiPrice && apiPrice > 0 ? apiPrice : item.buyPrice;

    return sum + item.quantity * currentPrice;
  }, 0);

  const performances: PerformanceItem[] = items.map((item) => {
    const apiPrice = prices[item.symbol];
    const currentPrice = apiPrice && apiPrice > 0 ? apiPrice : item.buyPrice;

    const profitPercent =
      item.buyPrice > 0
        ? ((currentPrice - item.buyPrice) / item.buyPrice) * 100
        : 0;

    return {
      symbol: item.symbol,
      profitPercent,
    };
  });

  const best =
    performances.length > 0
      ? performances.reduce((a, b) =>
          a.profitPercent > b.profitPercent ? a : b
        )
      : null;

  const worst =
    performances.length > 0
      ? performances.reduce((a, b) =>
          a.profitPercent < b.profitPercent ? a : b
        )
      : null;

  return (
    <div className="grid md:grid-cols-3 gap-4 mt-8">
      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
        <p className="text-[var(--muted)]">Total Portfolio Value</p>

        <h2 className="text-3xl font-bold mt-2">
          ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </h2>
      </div>

      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
        <p className="text-[var(--muted)]">Best Performer</p>

        <h2 className="text-2xl font-bold text-green-400 mt-2">
          {best?.symbol || "N/A"}
        </h2>

        <p className="text-green-400 mt-2">
          {best ? `${best.profitPercent.toFixed(2)}%` : "-"}
        </p>
      </div>

      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
        <p className="text-[var(--muted)]">Worst Performer</p>

        <h2 className="text-2xl font-bold text-red-400 mt-2">
          {worst?.symbol || "N/A"}
        </h2>

        <p className="text-red-400 mt-2">
          {worst ? `${worst.profitPercent.toFixed(2)}%` : "-"}
        </p>
      </div>
    </div>
  );
}