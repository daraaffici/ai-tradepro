"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Stats = {
  winRate: number;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  winTrades: number;
  lossTrades: number;
};

const COLORS = ["#22c55e", "#ef4444"];

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const res = await fetch("/api/trades/stats", {
      cache: "no-store",
    });

    const data = await res.json();
    setStats(data);
  }

  if (!stats) return null;

  const startBalance = 10000;
  const currentBalance = startBalance + stats.netProfit;

  const accountGrowth = [
    { name: "Start", value: startBalance },
    { name: "Now", value: currentBalance },
  ];

  const profitLoss = [
    { name: "Profit", value: Number(stats.totalProfit.toFixed(2)) },
    { name: "Loss", value: Number(Math.abs(stats.totalLoss).toFixed(2)) },
    { name: "Net", value: Number(stats.netProfit.toFixed(2)) },
  ];

  const winLoss = [
    { name: "Wins", value: stats.winTrades },
    { name: "Losses", value: stats.lossTrades },
  ];

  return (
    <div className="grid xl:grid-cols-3 gap-6 mt-8">
      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)] min-h-[360px] overflow-hidden">
        <h2 className="text-xl font-bold mb-4">📈 Account Growth</h2>

        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={accountGrowth} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <XAxis dataKey="name" />
              <YAxis width={50} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)] min-h-[360px] overflow-hidden">
        <h2 className="text-xl font-bold mb-4">💰 Profit / Loss</h2>

        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={profitLoss} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <XAxis dataKey="name" />
              <YAxis width={50} />
              <Tooltip />
              <Bar dataKey="value" fill="#a855f7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)] min-h-[360px] overflow-hidden">
        <h2 className="text-xl font-bold mb-4">🏆 Win / Loss</h2>

        <div className="h-[230px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={winLoss}
                dataKey="value"
                nameKey="name"
                outerRadius={85}
                label
              >
                {winLoss.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <p className="text-center text-yellow-400 font-bold mt-2">
          Win Rate: {stats.winRate.toFixed(1)}%
        </p>
      </div>
    </div>
  );
}