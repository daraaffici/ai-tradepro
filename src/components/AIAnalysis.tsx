"use client";

import { useState } from "react";

type AnalysisResult = {
  symbol: string;
  price: number;
  change: number;
  trend: string;
  recommendation: "BUY" | "SELL" | "HOLD";
  confidence: number;
  risk: string;
  entry: number;
  tp1: number;
  tp2: number;
  tp3: number;
  stopLoss: number;
  riskReward: number;
  summary: string;
  createdAt: string;
};

const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "AAPL", "TSLA", "NVDA", "MSFT", "AMD"];

export default function AIAnalysis() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  function formatDate(date: string) {
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  async function analyze() {
    setLoading(true);

    try {
      const res = await fetch(`/api/ai-analysis?symbol=${symbol}`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.error) {
        alert(data.message || "AI Analysis failed");
        return;
      }

      setResult({
        ...data,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error(error);
      alert("AI Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  async function saveToJournal() {
    if (!result) return;

    if (result.recommendation === "HOLD") {
      alert("HOLD signal cannot be saved");
      return;
    }

    const user = localStorage.getItem("user");

    if (!user) {
      alert("Please login first");
      return;
    }

    const currentUser = JSON.parse(user);
    const userId = currentUser.id || currentUser.userId;

    if (!userId) {
      alert("User ID not found. Please login again.");
      return;
    }

    try {
      const res = await fetch("/api/trades/add-from-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          symbol: result.symbol,
          type: result.recommendation,
          entry: result.entry,
          takeProfit: result.tp3,
          stopLoss: result.stopLoss,
          lotSize: 1,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.error || "Failed to save trade");
        return;
      }

      await fetch("/api/signals/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: result.symbol,
          signal: result.recommendation,
          entry: result.entry,
          tp1: result.tp1,
          tp2: result.tp2,
          tp3: result.tp3,
          stopLoss: result.stopLoss,
          confidence: result.confidence,
          risk: result.risk,
          riskReward: result.riskReward,
          createdAt: result.createdAt,
        }),
      });

      alert(`${result.symbol} saved to Trade Journal and sent to Telegram ✅`);
      window.location.href = "/trades";
    } catch (error) {
      console.error(error);
      alert("Failed to save trade");
    }
  }

  return (
    <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--border)]">
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold">AI Analysis Signal</h2>
          <p className="text-sm text-[var(--muted)]">
            Date / Time, Entry, TP1, TP2, TP3, SL and Telegram.
          </p>
        </div>

        <div className="flex gap-2">
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="bg-[var(--input)] border border-[var(--border)] p-3 rounded-lg"
          >
            {symbols.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <button
            onClick={analyze}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-bold"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </div>

      {!result ? (
        <p className="text-[var(--muted)]">Select market and click Analyze.</p>
      ) : (
        <div className="bg-[var(--input)] rounded-xl p-4 border border-[var(--border)]">
          <div className="flex justify-between gap-4">
            <div>
              <h3 className="font-bold text-xl">{result.symbol}</h3>
              <p className="text-sm text-[var(--muted)]">
                Date / Time: {formatDate(result.createdAt)}
              </p>
              <p className="text-sm text-[var(--muted)]">
                ${result.price.toLocaleString()} • {result.change.toFixed(2)}%
              </p>
            </div>

            <p
              className={
                result.recommendation === "BUY"
                  ? "text-green-400 font-bold text-xl"
                  : result.recommendation === "SELL"
                  ? "text-red-400 font-bold text-xl"
                  : "text-yellow-400 font-bold text-xl"
              }
            >
              {result.recommendation}
            </p>
          </div>

          <div className="grid md:grid-cols-6 gap-4 mt-5">
            <div>
              <p className="text-[var(--muted)] text-sm">Entry</p>
              <p>${result.entry.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-[var(--muted)] text-sm">TP1</p>
              <p className="text-green-400">${result.tp1.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-[var(--muted)] text-sm">TP2</p>
              <p className="text-green-400">${result.tp2.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-[var(--muted)] text-sm">TP3</p>
              <p className="text-green-400">${result.tp3.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-[var(--muted)] text-sm">Stop Loss</p>
              <p className="text-red-400">${result.stopLoss.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-[var(--muted)] text-sm">Confidence</p>
              <p className="text-yellow-400">{result.confidence}%</p>
            </div>
          </div>

          <p className="text-sm text-[var(--muted)] mt-5">{result.summary}</p>

          <div className="mt-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <p className="text-sm text-[var(--muted)]">
              Risk: <b>{result.risk}</b> • R/R:{" "}
              <b className="text-purple-400">1:{result.riskReward}</b>
            </p>

            <button
              onClick={saveToJournal}
              disabled={result.recommendation === "HOLD"}
              className={
                result.recommendation === "HOLD"
                  ? "bg-zinc-600 cursor-not-allowed px-4 py-2 rounded-lg text-white font-bold"
                  : "bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-bold"
              }
            >
              💾 Save To Trade Journal + Send Telegram
            </button>
          </div>
        </div>
      )}
    </div>
  );
}