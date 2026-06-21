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

  const accountGrowth = [
    { name: "Start", value: 10000 },
    { name: "Now", value: 10000 + stats.netProfit },
  ];

  const profitLoss = [
    { name: "Profit", value: stats.totalProfit },
    { name: "Loss", value: Math.abs(stats.totalLoss) },
    { name: "Net", value: stats.netProfit },
  ];

  const winLoss = [
    { name: "Wins", value: stats.winTrades },
    { name: "Losses", value: stats.lossTrades },
  ];

  return (
    <div className="grid xl:grid-cols-3 gap-6 mt-8">
      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
        <h2 className="text-xl font-bold mb-4">📈 Account Growth</h2>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={accountGrowth}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
        <h2 className="text-xl font-bold mb-4">💰 Profit / Loss</h2>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={profitLoss}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
        <h2 className="text-xl font-bold mb-4">🏆 Win / Loss</h2>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={winLoss} dataKey="value" nameKey="name" outerRadius={90} label>
                {winLoss.map((_, index) => (
                  <Cell key={index} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <p className="text-center text-yellow-400 font-bold">
          Win Rate: {stats.winRate.toFixed(1)}%
        </p>
      </div>
    </div>
  );
}