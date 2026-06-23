"use client";

import { useEffect, useState } from "react";

type SignalItem = {
  symbol: string;
  signal: "BUY" | "HOLD" | "SELL";
  confidence: number;
  entry: number;
  tp1: number;
  tp2: number;
  tp3: number;
  stopLoss: number;
  risk: string;
  price: number;
  change: number;
  riskReward: number;
};

const signalSymbols = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
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
              confidence: Number(data.confidence || 0),
              risk: data.risk || "Medium",
              entry: Number(data.entry || 0),
              tp1: Number(data.tp1 || 0),
              tp2: Number(data.tp2 || 0),
              tp3: Number(data.tp3 || data.takeProfit || 0),
              stopLoss: Number(data.stopLoss || 0),
              price: Number(data.price || 0),
              change: Number(data.change || 0),
              riskReward: Number(data.riskReward || 0),
            } as SignalItem;
          } catch (error) {
            console.error(`Failed to load signal for ${symbol}:`, error);
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

  async function addToJournal(item: SignalItem) {
    try {
      if (item.signal === "HOLD") {
        alert("HOLD signal cannot be added to Trade Journal");
        return;
      }

      const user = localStorage.getItem("user");

      if (!user) {
        alert("Please login first");
        return;
      }

      const currentUser = JSON.parse(user);

      if (!currentUser?.id) {
        alert("User ID not found. Please login again.");
        return;
      }

      const res = await fetch("/api/trades/add-from-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          symbol: item.symbol,
          type: item.signal,
          entry: item.entry,
          takeProfit: item.tp3,
          stopLoss: item.stopLoss,
          lotSize: 1,
        }),
      });

      const data = await res.json();

      if (data.success) {
        await fetch("/api/signals/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        });

        alert(`${item.symbol} added to Trade Journal ✅`);
      } else {
        alert(data.error || "Failed to add trade");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to add trade");
    }
  }

  return (
    <div className="bg-[var(--card)] mt-8 p-5 rounded-2xl border border-[var(--border)]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold">Dynamic Trade Signals</h2>
          <p className="text-sm text-[var(--muted)]">
            Signals with Entry, TP1, TP2, TP3 and Stop Loss.
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
        <p className="text-yellow-400">No valid signals available right now.</p>
      ) : (
        <div className="space-y-4">
          {signals.map((item) => (
            <div
              key={item.symbol}
              className="bg-[var(--input)] p-4 rounded-xl border border-[var(--border)]"
            >
              <div className="flex justify-between items-center gap-4">
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

              <div className="flex flex-wrap gap-3 mt-3 text-sm">
                <span className="text-[var(--muted)]">
                  Confidence:{" "}
                  <b className="text-yellow-400">{item.confidence}%</b>
                </span>

                <span className="text-[var(--muted)]">
                  Risk: <b>{item.risk}</b>
                </span>

                <span className="text-[var(--muted)]">
                  R/R: <b className="text-purple-400">1:{item.riskReward}</b>
                </span>
              </div>

              <div className="grid md:grid-cols-5 gap-4 mt-4">
                <div>
                  <p className="text-[var(--muted)] text-sm">Entry</p>
                  <p>${item.entry.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-[var(--muted)] text-sm">TP1</p>
                  <p className="text-green-400">${item.tp1.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-[var(--muted)] text-sm">TP2</p>
                  <p className="text-green-400">${item.tp2.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-[var(--muted)] text-sm">TP3</p>
                  <p className="text-green-400">${item.tp3.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-[var(--muted)] text-sm">Stop Loss</p>
                  <p className="text-red-400">
                    ${item.stopLoss.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <div>
                  <p className="text-[var(--muted)] text-sm">Action</p>
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
                </div>

                <button
                  onClick={() => addToJournal(item)}
                  disabled={item.signal === "HOLD"}
                  className={
                    item.signal === "HOLD"
                      ? "bg-zinc-600 cursor-not-allowed px-4 py-2 rounded-lg text-white font-bold"
                      : "bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-bold"
                  }
                >
                  ➕ Add To Journal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}