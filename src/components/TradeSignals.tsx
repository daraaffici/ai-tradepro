"use client";

import { useEffect, useState } from "react";

type SignalItem = {
  symbol: string;
  signal: "BUY" | "HOLD" | "SELL";
  confidence: number;
  entry: number;
  takeProfit: number;
  stopLoss: number;
  risk: string;
};

const signalSymbols = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "XAUUSD",
  "AAPL",
  "TSLA",
  "NVDA",
  "MSFT",
];

export default function TradeSignals() {
  const [signals, setSignals] = useState<SignalItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSignals();

    const interval = setInterval(() => {
      loadSignals();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  async function loadSignals() {
    try {
      const results: SignalItem[] = [];

      for (const symbol of signalSymbols) {
        const res = await fetch(`/api/ai-analysis?symbol=${symbol}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!data.error && data.price > 0) {
          results.push({
            symbol: data.symbol,
            signal: data.recommendation,
            confidence: data.confidence,
            risk: data.risk,
            entry: data.entry,
            takeProfit: data.takeProfit,
            stopLoss: data.stopLoss,
          });
        }
      }

      setSignals(results);
    } catch (error) {
      console.error("Failed to load signals:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[var(--card)] mt-8 p-5 rounded-2xl border border-[var(--border)]">
      <h2 className="text-xl font-bold mb-4">
        Dynamic Trade Signals
      </h2>

      {loading ? (
        <p className="text-[var(--muted)]">Scanning market signals...</p>
      ) : signals.length === 0 ? (
        <p className="text-yellow-400">
          No valid signals available right now.
        </p>
      ) : (
        <div className="space-y-4">
          {signals.map((item) => (
            <div
              key={item.symbol}
              className="bg-[var(--input)] p-4 rounded-xl border border-[var(--border)]"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">{item.symbol}</h3>

                <span
                  className={
                    item.signal === "BUY"
                      ? "text-green-400 font-bold"
                      : item.signal === "SELL"
                      ? "text-red-400 font-bold"
                      : "text-yellow-400 font-bold"
                  }
                >
                  {item.signal}
                </span>
              </div>

              <p className="text-[var(--muted)] text-sm mt-1">
                Confidence: {item.confidence}%
              </p>

              <div className="grid md:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className="text-[var(--muted)] text-sm">Entry</p>
                  <p>${item.entry.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-[var(--muted)] text-sm">Take Profit</p>
                  <p className="text-green-400">
                    ${item.takeProfit.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-[var(--muted)] text-sm">Stop Loss</p>
                  <p className="text-red-400">
                    ${item.stopLoss.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-[var(--muted)] text-sm">Risk</p>
                  <p>{item.risk}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}