"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";
import TradingViewChart from "@/components/TradingViewChart";
import { calculateRiskReward } from "@/lib/riskReward";

type Analysis = {
  symbol: string;
  price: number;
  change: number;
  trend: string;
  recommendation: "BUY" | "SELL" | "HOLD";
  confidence: number;
  risk: string;
  support: number;
  resistance: number;
  entry: number;
  tp1: number;
  tp2: number;
  tp3: number;
  takeProfit: number;
  stopLoss: number;
  riskReward: number;
  summary: string;
  createdAt?: string;
};

const marketSymbols = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "AAPL",
  "TSLA",
  "NVDA",
  "MSFT",
  "AMD",
];

function getTradingViewSymbol(symbol: string) {
  if (["BTCUSDT", "ETHUSDT", "SOLUSDT"].includes(symbol)) {
    return `BINANCE:${symbol}`;
  }

  return `NASDAQ:${symbol}`;
}

export default function AnalysisPage() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);

  async function runAnalysis() {
    try {
      setLoading(true);
      setAnalysis(null);

      const res = await fetch(`/api/ai-analysis?symbol=${symbol}`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.error) {
        alert(data.message || "AI Analysis failed");
        return;
      }

      setAnalysis({
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

  async function saveToTradeJournal() {
    if (!analysis) return;

    if (analysis.recommendation === "HOLD") {
      alert("HOLD signal is not saved as a trade.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user?.id) {
      alert("Please login again. User ID not found.");
      return;
    }

    const res = await fetch("/api/trades/add-from-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        
        userId: user.id,
        symbol: analysis.symbol,
        type: analysis.recommendation,
        entry: analysis.entry,
        takeProfit: analysis.tp3,
        stopLoss: analysis.stopLoss,
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symbol: analysis.symbol,
        signal: analysis.recommendation,
        trend: analysis.trend,
        entry: analysis.entry,
        tp1: analysis.tp1,
        tp2: analysis.tp2,
        tp3: analysis.tp3,
        stopLoss: analysis.stopLoss,
        support: analysis.support,
        resistance: analysis.resistance,
        confidence: analysis.confidence,
        risk: analysis.risk,
        riskReward: analysis.riskReward,
        summary: analysis.summary,
        createdAt: new Date().toISOString(),
      }),
    });

    alert("Trade saved to Journal + Telegram sent ✅");
    window.location.href = "/trades";
  }

  function formatDate(date?: string) {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  const rr = analysis
    ? calculateRiskReward(analysis.entry, analysis.tp3, analysis.stopLoss)
    : null;

  return (
    <AuthGuard>
      <div
        className="flex min-h-screen"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <Sidebar />

        <main className="flex-1 w-full p-4 lg:p-6 overflow-x-hidden">
          <Header />

          <h1 className="text-3xl font-bold mb-6">AI Analysis</h1>

          <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)] mb-6">
            <div className="grid md:grid-cols-3 gap-4">
              <select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="bg-[var(--input)] p-3 rounded-lg"
              >
                {marketSymbols.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <button
                onClick={runAnalysis}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 px-4 py-3 rounded-lg font-bold text-white"
              >
                {loading ? "Analyzing..." : "Run AI Analysis"}
              </button>
            </div>
          </div>

          {analysis && (
            <>
              <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{analysis.symbol}</h2>

                    <p className="text-[var(--muted)]">
                      ${analysis.price.toLocaleString()} •{" "}
                      {analysis.change.toFixed(2)}%
                    </p>

                    <p className="text-sm text-[var(--muted)] mt-1">
                      Date / Time: {formatDate(analysis.createdAt)}
                    </p>
                  </div>

                  <span
                    className={
                      analysis.recommendation === "BUY"
                        ? "text-green-400 text-2xl font-bold"
                        : analysis.recommendation === "SELL"
                        ? "text-red-400 text-2xl font-bold"
                        : "text-yellow-400 text-2xl font-bold"
                    }
                  >
                    {analysis.recommendation}
                  </span>
                </div>

                <div className="grid md:grid-cols-5 gap-4">
                  <div className="bg-[var(--input)] p-4 rounded-xl">
                    <p className="text-[var(--muted)] text-sm">Trend</p>
                    <p className="font-bold">{analysis.trend}</p>
                  </div>

                  <div className="bg-[var(--input)] p-4 rounded-xl">
                    <p className="text-[var(--muted)] text-sm">Confidence</p>
                    <p className="font-bold">{analysis.confidence}%</p>
                  </div>

                  <div className="bg-[var(--input)] p-4 rounded-xl">
                    <p className="text-[var(--muted)] text-sm">Risk</p>
                    <p className="font-bold">{analysis.risk}</p>
                  </div>

                  <div className="bg-[var(--input)] p-4 rounded-xl">
                    <p className="text-[var(--muted)] text-sm">Support</p>
                    <p className="font-bold">
                      ${analysis.support.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-[var(--input)] p-4 rounded-xl">
                    <p className="text-[var(--muted)] text-sm">Resistance</p>
                    <p className="font-bold">
                      ${analysis.resistance.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-6 gap-4 mt-4">
                  <div className="bg-[var(--input)] p-4 rounded-xl">
                    <p className="text-[var(--muted)] text-sm">Entry</p>
                    <p className="font-bold text-blue-400">
                      ${analysis.entry.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-[var(--input)] p-4 rounded-xl">
                    <p className="text-[var(--muted)] text-sm">TP1</p>
                    <p className="font-bold text-green-400">
                      ${analysis.tp1.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-[var(--input)] p-4 rounded-xl">
                    <p className="text-[var(--muted)] text-sm">TP2</p>
                    <p className="font-bold text-green-400">
                      ${analysis.tp2.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-[var(--input)] p-4 rounded-xl">
                    <p className="text-[var(--muted)] text-sm">TP3</p>
                    <p className="font-bold text-green-400">
                      ${analysis.tp3.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-[var(--input)] p-4 rounded-xl">
                    <p className="text-[var(--muted)] text-sm">Stop Loss</p>
                    <p className="font-bold text-red-400">
                      ${analysis.stopLoss.toLocaleString()}
                    </p>
                  </div>

                  {rr && (
                    <div className="bg-[var(--input)] p-4 rounded-xl border border-[var(--border)]">
                      <p className="text-sm text-[var(--muted)]">
                        Risk / Reward
                      </p>

                      <p
                        className={
                          rr.ratio >= 2
                            ? "text-green-500 font-bold text-xl"
                            : rr.ratio >= 1
                            ? "text-yellow-500 font-bold text-xl"
                            : "text-red-500 font-bold text-xl"
                        }
                      >
                        1 : {rr.ratio}
                      </p>

                      <p className="text-sm mt-2">
                        Risk: ${rr.risk.toFixed(2)}
                      </p>

                      <p className="text-sm">
                        Reward: ${rr.reward.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>

                <p className="text-[var(--muted)] mt-6">{analysis.summary}</p>

                <button
                  onClick={saveToTradeJournal}
                  disabled={analysis.recommendation === "HOLD"}
                  className={
                    analysis.recommendation === "HOLD"
                      ? "mt-6 bg-zinc-700 px-5 py-3 rounded-xl font-bold cursor-not-allowed text-white"
                      : "mt-6 bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl font-bold text-white"
                  }
                >
                  {analysis.recommendation === "HOLD"
                    ? "HOLD Signal - Not Tradable"
                    : "Save to Trade Journal"
                  }
                </button>
              </div>

              <div className="bg-[var(--card)] mt-6 p-5 rounded-2xl border border-[var(--border)]">
                <h2 className="text-xl font-bold mb-4">
                  {analysis.symbol} Market Chart
                </h2>

                <TradingViewChart symbol={getTradingViewSymbol(analysis.symbol)} />
              </div>
            </>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}