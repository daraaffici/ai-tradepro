"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";
import AdminGuard from "@/components/AdminGuard";
import AdminCard from "@/components/AdminCard";

type AdminStats = {
  totalUsers: number;
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  wins: number;
  losses: number;
  totalProfit: number;
  winRate: number;
  databaseStatus: string;
  serverStatus: string;
  todayUsers: number;
  todayTrades: number;
  todayProfit: number;
  recentLogs: {
    id: number;
    action: string;
    entity: string;
    description: string;
    createdAt: string;
  }[];
};

function money(value: number) {
  const sign = value >= 0 ? "" : "-";
  return `${sign}$${Math.abs(value).toFixed(2)}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-GB", {
    timeZone: "Asia/Phnom_Penh",
  });
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminStats();
  }, []);

  async function loadAdminStats() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/stats", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setStats({
          ...data,
          recentLogs: data.recentLogs || [],
        });
      } else {
        setStats(null);
      }
    } catch (error) {
      console.error("Failed to load admin stats:", error);
      setStats(null);
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
                <h1 className="text-3xl font-bold">AI TradePro Admin</h1>
                <p className="text-[var(--muted)] mt-2">
                  Platform overview, users, trades, and system status.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/admin/users"
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl text-white font-bold"
                >
                  Users
                </Link>

                <Link
                  href="/admin/trades"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-white font-bold"
                >
                  Trades
                </Link>

                <button
                  onClick={loadAdminStats}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-white font-bold"
                >
                  Refresh
                </button>

                <a
                  href="/api/admin/export/users"
                  className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl text-white font-bold"
                >
                  Export Users
                </a>

                <a
                  href="/api/admin/export/trades"
                  className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-xl text-white font-bold"
                >
                  Export Trades
                </a>

              </div>
            </div>

            {loading ? (
              <p className="text-[var(--muted)]">Loading admin dashboard...</p>
            ) : !stats ? (
              <p className="text-red-400">Failed to load admin statistics.</p>
            ) : (
              <>
                <div className="grid md:grid-cols-4 gap-4">
                  <AdminCard title="Total Users" value={stats.totalUsers} subtitle="Registered accounts" />
                  <AdminCard title="Total Trades" value={stats.totalTrades} subtitle="All trades in platform" />
                  <AdminCard title="Open Trades" value={stats.openTrades} subtitle="Currently active trades" />
                  <AdminCard title="Closed Trades" value={stats.closedTrades} subtitle="Win and loss trades" />
                  <AdminCard title="Wins" value={stats.wins} subtitle="Profitable trades" />
                  <AdminCard title="Losses" value={stats.losses} subtitle="Losing trades" />
                  <AdminCard title="Win Rate" value={`${stats.winRate}%`} subtitle="Closed trades only" />
                  <AdminCard title="Total Profit" value={money(stats.totalProfit)} subtitle="Net profit / loss" />
                  <AdminCard title="Database" value={`🟢 ${stats.databaseStatus}`} subtitle="Prisma connection" />
                  <AdminCard title="Server" value={`🟢 ${stats.serverStatus}`} subtitle="API status" />
                  <AdminCard title="Telegram" value="🟢 Connected" subtitle="Bot configured" />
                  <AdminCard title="Version" value="1.0" subtitle="AI TradePro Admin" />
                  <AdminCard title="Today Users" value={stats.todayUsers} subtitle="New users today" />
                  <AdminCard title="Today Trades" value={stats.todayTrades} subtitle="Trades created today" />
                  <AdminCard title="Today Profit" value={money(stats.todayProfit)} subtitle="Closed trades today" />
                </div>

                <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)] mt-6">
                  <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>

                  {stats.recentLogs.length === 0 ? (
                    <p className="text-[var(--muted)]">
                      No recent activity yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {stats.recentLogs.map((log) => (
                        <div
                          key={log.id}
                          className="bg-[var(--input)] p-4 rounded-xl border border-[var(--border)]"
                        >
                          <div className="flex justify-between gap-4">
                            <div>
                              <p className="font-bold">
                                {log.action} · {log.entity}
                              </p>
                              <p className="text-[var(--muted)] text-sm mt-1">
                                {log.description}
                              </p>
                            </div>

                            <span className="text-xs text-[var(--muted)]">
                              {formatDate(log.createdAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </AdminGuard>
    </AuthGuard>
  );
}