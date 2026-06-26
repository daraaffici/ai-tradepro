"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";
import AdminGuard from "@/components/AdminGuard";
import AdminSidebar from "@/components/AdminSidebar";
import AdminCard from "@/components/AdminCard";

type Analytics = {
  totalUsers: number;
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  wins: number;
  losses: number;
  winRate: number;
  totalProfit: number;
  topSymbols: {
    symbol: string;
    count: number;
  }[];
  profitRanking: {
    symbol: string;
    profit: number;
  }[];
  mostActiveUsers: {
    name: string;
    email: string;
    count: number;
  }[];
};

function money(value: number) {
  const sign = value >= 0 ? "" : "-";
  return `${sign}$${Math.abs(value).toFixed(2)}`;
}

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState("today");
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  async function loadAnalytics() {
    try {
      setLoading(true);

      const res = await fetch(`/api/admin/analytics?period=${period}`, {
        cache: "no-store",
      });

      const result = await res.json();

      if (result.success) {
        setData(result);
      } else {
        setData(null);
      }
    } catch (error) {
      console.error(error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGuard>
      <AdminGuard>
        <div
          className="flex min-h-screen"
          style={{
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
          }}
        >
          <AdminSidebar />

          <main className="flex-1 w-full p-4 lg:p-6 overflow-x-hidden">
            <Header />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold">Admin Analytics</h1>
                <p className="text-[var(--muted)] mt-2">
                  Platform-wide users, trades, profit, and activity insights.
                </p>
              </div>

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

                <button
                  onClick={loadAnalytics}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-white font-bold"
                >
                  Refresh
                </button>

                <Link
                  href="/admin"
                  className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-xl text-white font-bold"
                >
                  ← Back
                </Link>
              </div>
            </div>

            {loading ? (
              <p className="text-[var(--muted)]">Loading analytics...</p>
            ) : !data ? (
              <p className="text-red-400">Failed to load analytics.</p>
            ) : (
              <>
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <AdminCard
                    title="New Users"
                    value={data.totalUsers}
                    subtitle={`Period: ${period}`}
                  />

                  <AdminCard
                    title="Trades"
                    value={data.totalTrades}
                    subtitle="Trades in selected period"
                  />

                  <AdminCard
                    title="Closed Trades"
                    value={data.closedTrades}
                    subtitle={`${data.openTrades} open trades`}
                  />

                  <AdminCard
                    title="Win Rate"
                    value={`${data.winRate}%`}
                    subtitle={`${data.wins} wins / ${data.losses} losses`}
                  />

                  <AdminCard
                    title="Total Profit"
                    value={money(data.totalProfit)}
                    subtitle="Selected period"
                  />

                  <AdminCard
                    title="Open Trades"
                    value={data.openTrades}
                    subtitle="Still active"
                  />

                  <AdminCard
                    title="Wins"
                    value={data.wins}
                    subtitle="Profitable trades"
                  />

                  <AdminCard
                    title="Losses"
                    value={data.losses}
                    subtitle="Losing trades"
                  />
                </div>

                <div className="grid lg:grid-cols-3 gap-4">
                  <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
                    <h2 className="text-xl font-bold mb-4">Top Symbols</h2>

                    {data.topSymbols.length === 0 ? (
                      <p className="text-[var(--muted)]">No symbols found.</p>
                    ) : (
                      <div className="space-y-3">
                        {data.topSymbols.map((item, index) => (
                          <div
                            key={item.symbol}
                            className="flex justify-between border-b border-[var(--border)] pb-2"
                          >
                            <span>
                              {index + 1}.{" "}
                              <b>{item.symbol}</b>
                            </span>
                            <span className="text-[var(--muted)]">
                              {item.count} trades
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
                    <h2 className="text-xl font-bold mb-4">Profit Ranking</h2>

                    {data.profitRanking.length === 0 ? (
                      <p className="text-[var(--muted)]">No profit data.</p>
                    ) : (
                      <div className="space-y-3">
                        {data.profitRanking.map((item, index) => (
                          <div
                            key={item.symbol}
                            className="flex justify-between border-b border-[var(--border)] pb-2"
                          >
                            <span>
                              {index + 1}.{" "}
                              <b>{item.symbol}</b>
                            </span>
                            <span
                              className={
                                item.profit >= 0
                                  ? "text-green-400 font-bold"
                                  : "text-red-400 font-bold"
                              }
                            >
                              {money(item.profit)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
                    <h2 className="text-xl font-bold mb-4">
                      Most Active Users
                    </h2>

                    {data.mostActiveUsers.length === 0 ? (
                      <p className="text-[var(--muted)]">No user activity.</p>
                    ) : (
                      <div className="space-y-3">
                        {data.mostActiveUsers.map((user, index) => (
                          <div
                            key={user.email}
                            className="border-b border-[var(--border)] pb-2"
                          >
                            <div className="flex justify-between">
                              <span>
                                {index + 1}. <b>{user.name}</b>
                              </span>
                              <span className="text-[var(--muted)]">
                                {user.count} trades
                              </span>
                            </div>

                            <p className="text-xs text-[var(--muted)] mt-1">
                              {user.email}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </AdminGuard>
    </AuthGuard>
  );
}