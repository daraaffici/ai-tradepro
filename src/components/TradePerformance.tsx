"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalTrades: number;
  openTrades: number;
  buyTrades: number;
  sellTrades: number;
  holdTrades: number;
  winTrades: number;
  lossTrades: number;
  winRate: number;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
};

export default function TradePerformance() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const res = await fetch("/api/trades/stats");
    const data = await res.json();
    setStats(data);
  }

  if (!stats) return null;

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
        <p className="text-[var(--muted)]">Total Trades</p>
        <h2 className="text-3xl font-bold mt-2">{stats.totalTrades}</h2>
      </div>

      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
        <p className="text-[var(--muted)]">Open Trades</p>
        <h2 className="text-3xl font-bold mt-2">{stats.openTrades}</h2>
      </div>

      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
        <p className="text-[var(--muted)]">BUY Trades</p>
        <h2 className="text-3xl font-bold mt-2 text-green-400">
          {stats.buyTrades}
        </h2>
      </div>

      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
        <p className="text-[var(--muted)]">SELL Trades</p>
        <h2 className="text-3xl font-bold mt-2 text-red-400">
          {stats.sellTrades}
        </h2>
      </div>

      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
        <p className="text-[var(--muted)]">HOLD Trades</p>
        <h2 className="text-3xl font-bold mt-2 text-yellow-400">
          {stats.holdTrades}
        </h2>
      </div>

      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
        <p className="text-[var(--muted)]">Win Trades</p>
        <h2 className="text-3xl font-bold mt-2 text-green-400">
          {stats.winTrades}
        </h2>
      </div>

      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
        <p className="text-[var(--muted)]">Loss Trades</p>
        <h2 className="text-3xl font-bold mt-2 text-red-400">
          {stats.lossTrades}
        </h2>
      </div>

      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
        <p className="text-[var(--muted)]">Win Rate</p>
        <h2 className="text-3xl font-bold mt-2 text-yellow-400">
          {stats.winRate.toFixed(1)}%
        </h2>
      </div>

      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
        <p className="text-[var(--muted)]">Total Profit</p>
        <h2 className="text-3xl font-bold mt-2 text-green-400">
          ${stats.totalProfit.toFixed(2)}
        </h2>
      </div>

      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
        <p className="text-[var(--muted)]">Total Loss</p>
        <h2 className="text-3xl font-bold mt-2 text-red-400">
          ${Math.abs(stats.totalLoss).toFixed(2)}
        </h2>
      </div>

      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
        <p className="text-[var(--muted)]">Net Profit</p>
        <h2
          className={
            stats.netProfit >= 0
              ? "text-3xl font-bold mt-2 text-green-400"
              : "text-3xl font-bold mt-2 text-red-400"
          }
        >
          ${stats.netProfit.toFixed(2)}
        </h2>
      </div>
    </div>
  );
}