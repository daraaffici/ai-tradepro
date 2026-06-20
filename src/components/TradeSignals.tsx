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
  price: number;
  change: number;
};

const signalSymbols = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "AAPL",
  "TSLA",
  "NVDA",
  "MSFT",
  "AMD",
];

export default function TradeSignals() {
  const [signals, setSignals] = useState<SignalItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSignals();

    const interval = setInterval(loadSignals, 60000);
    return () => clearInterval(interval);
  }, []);

  async function loadSignals() {
    try {
      setLoading(true);

      const results = await Promise.all(
        signalSymbols.map(async (symbol) => {
          try {
            const res = await fetch(`/api/ai-analysis?symbol=${symbol}`, {
              cache: "no-store",
            });

            const data = await res.json();

            if (data.error || !data.price || data.price <= 0) {
              return null;
            }

            return {
              symbol: data.symbol,
              signal: data.recommendation,
              confidence: data.confidence,
              risk: data.risk,
              entry: data.entry,
              takeProfit: data.takeProfit,
              stopLoss: data.stopLoss,
              price: data.price,
              change: data.change,
            } as SignalItem;
          } catch {
            return null;
          }
        })
      );

      setSignals(results.filter(Boolean) as SignalItem[]);
    } catch (error) {
      console.error("Failed to load signals:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[var(--card)] mt-8 p-5 rounded-2xl border border-[var(--border)]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold">Dynamic Trade Signals</h2>
          <p className="text-sm text-[var(--muted)]">
            Crypto and stock signals based on live market change.
          </p>
        </div>

        <button
          onClick={loadSignals}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white font-bold"
        >
          Refresh
        </button>
      </div>

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
                <div>
                  <h3 className="font-bold text-lg">{item.symbol}</h3>
                  <p className="text-sm text-[var(--muted)]">
                    ${item.price.toLocaleString()} • {item.change.toFixed(2)}%
                  </p>
                </div>

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