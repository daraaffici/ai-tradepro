"use client";

import { useMarket } from "@/hooks/useMarket";

export default function DashboardPage() {
  const markets = useMarket();

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">AI TradePro Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {markets.map((market) => (
          <div
            key={market.symbol}
            className="bg-[var(--input)] p-6 rounded-xl border border-[var(--border)]"
          >
            <h2 className="text-[var(--muted)]">{market.symbol}</h2>

            <p className="text-3xl font-bold mt-2">
              ${Number(market.price).toLocaleString()}
            </p>

            <p
              className={
                Number(market.change) >= 0
                  ? "text-green-400 mt-2"
                  : "text-red-400 mt-2"
              }
            >
              {Number(market.change).toFixed(2)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}