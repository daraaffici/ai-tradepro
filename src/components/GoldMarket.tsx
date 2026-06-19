"use client";

import { useEffect, useState } from "react";

type GoldData = {
  symbol: string;
  price: number | null;
  change: number;
};

export default function GoldMarket() {
  const [gold, setGold] = useState<GoldData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGold();

    const interval = setInterval(() => {
      loadGold();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  async function loadGold() {
    try {
      const res = await fetch("/api/gold", {
        cache: "no-store",
      });

      const data: GoldData = await res.json();

      setGold(data);
    } catch (error) {
      console.error("Failed to load gold:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)] mt-6">
      <h2 className="text-xl font-bold mb-4">Gold Market</h2>

      {loading || !gold ? (
        <p className="text-[var(--muted)]">Loading gold data...</p>
      ) : (
        <div className="bg-[var(--input)] p-4 rounded-xl border border-[var(--border)] flex justify-between">
          <p className="font-bold">{gold.symbol}</p>

          <div className="text-right">
            <p>
              {gold.price !== null
                ? `$${gold.price.toLocaleString()}`
                : "Unavailable"}
            </p>

            <p
              className={
                gold.change >= 0
                  ? "text-green-400 text-sm"
                  : "text-red-400 text-sm"
              }
            >
              {gold.change.toFixed(2)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}