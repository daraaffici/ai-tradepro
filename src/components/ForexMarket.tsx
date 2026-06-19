"use client";

import { useEffect, useState } from "react";

type ForexPair = {
  symbol: string;
  price: number | null;
  change: number;
};

export default function ForexMarket() {
  const [pairs, setPairs] = useState<ForexPair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForex();

    const interval = setInterval(loadForex, 60000);
    return () => clearInterval(interval);
  }, []);

  async function loadForex() {
    try {
      const res = await fetch("/api/forex", { cache: "no-store" });
      const data = await res.json();

      if (Array.isArray(data)) {
        setPairs(data);
      } else {
        setPairs([]);
      }
    } catch {
      setPairs([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)] mt-6">
      <h2 className="text-xl font-bold mb-4">Forex Market</h2>

      {loading ? (
        <p className="text-[var(--muted)]">Loading forex...</p>
      ) : pairs.length === 0 ? (
        <p className="text-yellow-400">
          Forex temporarily unavailable. Twelve Data API credits are used up.
        </p>
      ) : (
        <div className="space-y-3">
          {pairs.map((pair) => (
            <div
              key={pair.symbol}
              className="bg-[var(--input)] p-4 rounded-xl border border-[var(--border)] flex justify-between"
            >
              <p className="font-bold">{pair.symbol}</p>

              <div className="text-right">
                <p>
                  {pair.price && pair.price > 0
                    ? pair.price.toLocaleString()
                    : "Unavailable"}
                </p>

                <p className="text-green-400 text-sm">
                  {Number(pair.change || 0).toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}