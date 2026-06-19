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
  recommendation: string;
  confidence: number;
  risk: string;
  support: number;
  resistance: number;
  entry: number;
  takeProfit: number;
  stopLoss: number;
  riskReward: number;
  summary: string;
};

const marketSymbols = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "AVAXUSDT",
  "LINKUSDT",
  "SUIUSDT",

  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "AUDUSD",
  "USDCAD",
  "USDCHF",
  "NZDUSD",
  "EURJPY",
  "GBPJPY",
  "EURGBP",

  "XAUUSD",
  "XAGUSD",

  "AAPL",
  "TSLA",
  "NVDA",
  "MSFT",
  "GOOGL",
  "AMZN",
  "META",
  "AMD",
];

function getTradingViewSymbol(symbol: string) {
  const crypto = [
    "BTCUSDT",
    "ETHUSDT",
    "SOLUSDT",
    "BNBUSDT",
    "XRPUSDT",
    "ADAUSDT",
    "DOGEUSDT",
    "AVAXUSDT",
    "LINKUSDT",
    "SUIUSDT",
  ];

  const forex = [
    "EURUSD",
    "GBPUSD",
    "USDJPY",
    "AUDUSD",
    "USDCAD",
    "USDCHF",
    "NZDUSD",
    "EURJPY",
    "GBPJPY",
    "EURGBP",
  ];

  if (crypto.includes(symbol)) return `BINANCE:${symbol}`;
  if (forex.includes(symbol)) return `FX:${symbol}`;
  if (symbol === "XAUUSD") return "OANDA:XAUUSD";
  if (symbol === "XAGUSD") return "OANDA:XAGUSD";

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

      setAnalysis(data);
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

    const res = await fetch("/api/trades/add-from-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...analysis,
        userId: user.id,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Trade saved to Journal!");
    }
  }

  const rr = analysis
    ? calculateRiskReward(
        analysis.entry,
        analysis.takeProfit,
        analysis.stopLoss
      )
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
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{analysis.symbol}</h2>
                    <p className="text-[var(--muted)]">
                      ${analysis.price.toLocaleString()} •{" "}
                      {analysis.change.toFixed(2)}%
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

                <div className="grid md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-[var(--input)] p-4 rounded-xl">
                    <p className="text-[var(--muted)] text-sm">Entry</p>
                    <p className="font-bold text-blue-400">
                      ${analysis.entry.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-[var(--input)] p-4 rounded-xl">
                    <p className="text-[var(--muted)] text-sm">Take Profit</p>
                    <p className="font-bold text-green-400">
                      ${analysis.takeProfit.toLocaleString()}
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

                <p className="text-[var(--muted)] mt-6">
                  {analysis.summary}
                </p>

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
                    : "Save to Trade Journal"}
                </button>
              </div>

              <div className="bg-[var(--card)] mt-6 p-5 rounded-2xl border border-[var(--border)]">
                <h2 className="text-xl font-bold mb-4">
                  {analysis.symbol} Market Chart
                </h2>

                <TradingViewChart
                  symbol={getTradingViewSymbol(analysis.symbol)}
                />

              </div>
            </>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}