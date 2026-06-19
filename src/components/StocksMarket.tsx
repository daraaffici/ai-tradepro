"use client";

import { useEffect, useState } from "react";

type Stock = {
  symbol: string;
  price: number;
  change: number;
};

export default function StocksMarket() {
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    loadStocks();

    const interval = setInterval(() => {
      loadStocks();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  async function loadStocks() {
    const res = await fetch("/api/stocks");
    const data = await res.json();

    setStocks(data);
  }

  return (
    <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)] mt-6">
      <h2 className="text-xl font-bold mb-4">
        Stocks Market
      </h2>

      <div className="space-y-3">
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            className="bg-[var(--input)] p-4 rounded-xl border border-[var(--border)] flex justify-between"
          >
            <div>
              <p className="font-bold">{stock.symbol}</p>
            </div>

            <div className="text-right">
              <p>${stock.price}</p>

              <p
                className={
                  stock.change >= 0
                    ? "text-green-400 text-sm"
                    : "text-red-400 text-sm"
                }
              >
                {stock.change}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}