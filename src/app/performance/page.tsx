"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";

type Stats = {
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  buyTrades: number;
  sellTrades: number;
  winTrades: number;
  lossTrades: number;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  winRate: number;
  bestTrade: {
    symbol: string;
    profit: number;
  } | null;
  worstTrade: {
    symbol: string;
    profit: number;
  } | null;
};

function money(value: number) {
  const sign = value >= 0 ? "" : "-";
  return `${sign}$${Math.abs(value).toFixed(2)}`;
}

export default function PerformancePage() {
  const [period, setPeriod] = useState("today");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [period]);

  async function loadStats() {
    try {
      setLoading(true);

      const res = await fetch(`/api/trades/stats?period=${period}`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setStats(data);
      } else {
        setStats(null);
      }
    } catch (error) {
      console.error(error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }

  const cardClass =
    "bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]";

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

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold">Trade Performance</h1>

            <div className="flex flex-wrap gap-3">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="bg-zinc-800 text-white px-4 py-2 rounded-xl border border-zinc-700"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>

              <Link
                href="/performance/history"
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-white font-bold"
              >
                View All Closed Trades
              </Link>
            </div>
          </div>

          {loading ? (
            <p className="text-[var(--muted)]">Loading performance...</p>
          ) : !stats ? (
            <p className="text-red-400">Failed to load performance.</p>
          ) : (
            <div className="grid md:grid-cols-4 gap-4">
              <div className={cardClass}>
                <p className="text-[var(--muted)]">Total BUY/SELL Trades</p>
                <h2 className="text-3xl font-bold mt-3">
                  {stats.totalTrades}
                </h2>
              </div>

              <div className={cardClass}>
                <p className="text-[var(--muted)]">Open Trades</p>
                <h2 className="text-3xl font-bold mt-3">
                  {stats.openTrades}
                </h2>
              </div>

              <div className={cardClass}>
                <p className="text-[var(--muted)]">Closed Trades</p>
                <h2 className="text-3xl font-bold mt-3">
                  {stats.closedTrades}
                </h2>
              </div>

              <div className={cardClass}>
                <p className="text-[var(--muted)]">Win Rate</p>
                <h2 className="text-3xl font-bold text-yellow-400 mt-3">
                  {stats.winRate}%
                </h2>
              </div>

              <div className={cardClass}>
                <p className="text-[var(--muted)]">BUY Trades</p>
                <h2 className="text-3xl font-bold text-green-400 mt-3">
                  {stats.buyTrades}
                </h2>
              </div>

              <div className={cardClass}>
                <p className="text-[var(--muted)]">SELL Trades</p>
                <h2 className="text-3xl font-bold text-red-400 mt-3">
                  {stats.sellTrades}
                </h2>
              </div>

              <div className={cardClass}>
                <p className="text-[var(--muted)]">Win Trades</p>
                <h2 className="text-3xl font-bold text-green-400 mt-3">
                  {stats.winTrades}
                </h2>
              </div>

              <div className={cardClass}>
                <p className="text-[var(--muted)]">Loss Trades</p>
                <h2 className="text-3xl font-bold text-red-400 mt-3">
                  {stats.lossTrades}
                </h2>
              </div>

              <div className={cardClass}>
                <p className="text-[var(--muted)]">Total Profit</p>
                <h2 className="text-3xl font-bold text-green-400 mt-3">
                  {money(stats.totalProfit)}
                </h2>
              </div>

              <div className={cardClass}>
                <p className="text-[var(--muted)]">Total Loss</p>
                <h2 className="text-3xl font-bold text-red-400 mt-3">
                  {money(-stats.totalLoss)}
                </h2>
              </div>

              <div className={cardClass}>
                <p className="text-[var(--muted)]">Net Profit</p>
                <h2
                  className={
                    stats.netProfit >= 0
                      ? "text-3xl font-bold text-green-400 mt-3"
                      : "text-3xl font-bold text-red-400 mt-3"
                  }
                >
                  {money(stats.netProfit)}
                </h2>
              </div>

              <div className={cardClass}>
                <p className="text-[var(--muted)]">Best Trade</p>
                <h2 className="text-xl font-bold text-green-400 mt-3">
                  {stats.bestTrade?.symbol || "-"}
                </h2>
                <p className="text-green-400 font-bold">
                  {stats.bestTrade ? money(stats.bestTrade.profit) : "$0.00"}
                </p>
              </div>

              <div className={cardClass}>
                <p className="text-[var(--muted)]">Worst Trade</p>
                <h2 className="text-xl font-bold text-red-400 mt-3">
                  {stats.worstTrade?.symbol || "-"}
                </h2>
                <p className="text-red-400 font-bold">
                  {stats.worstTrade ? money(stats.worstTrade.profit) : "$0.00"}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}