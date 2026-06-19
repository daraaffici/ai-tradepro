"use client";

import { useEffect, useState } from "react";

type ScanResult = {
  symbol: string;
  price: number;
  change: number;
  signal: "BUY" | "HOLD" | "SELL";
  confidence: number;
};

export default function AIScanner() {
  const [results, setResults] = useState<ScanResult[]>([]);

    useEffect(() => {
        async function scanMarkets() {
        const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];
        const scanned: ScanResult[] = [];

        for (const symbol of symbols) {
            const res = await fetch(`/api/market/price?symbol=${symbol}`);
            const data = await res.json();

            let signal: "BUY" | "HOLD" | "SELL" = "HOLD";
            let confidence = 60;

            if (data.change > 5) {
            signal = "BUY";
            confidence = 82;
            } else if (data.change < -3) {
            signal = "SELL";
            confidence = 78;
            }

            scanned.push({
            symbol,
            price: data.price,
            change: data.change,
            signal,
            confidence,
            });
        }

        setResults(scanned);
        }

        scanMarkets();

        const interval = setInterval(() => {
            scanMarkets();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

  return (
    <div className="bg-[var(--card)] mt-8 rounded-2xl p-5 border border-[var(--border)]">
      <h2 className="text-xl font-bold mb-4">AI Market Scanner</h2>

      <div className="space-y-3">
        {results.map((item) => (
          <div
            key={item.symbol}
            className="bg-[var(--input)] p-4 rounded-xl border border-[var(--border)] flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{item.symbol}</p>
              <p className="text-sm text-[var(--muted)]">
                ${item.price.toLocaleString()} • {item.change.toFixed(2)}%
              </p>
            </div>

            <div className="text-right">
              <p
                className={
                  item.signal === "BUY"
                    ? "text-green-400 font-bold"
                    : item.signal === "SELL"
                    ? "text-red-400 font-bold"
                    : "text-yellow-400 font-bold"
                }
              >
                {item.signal}
              </p>

              <p className="text-sm text-[var(--muted)]">
                {item.confidence}% confidence
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
