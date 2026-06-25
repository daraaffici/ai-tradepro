"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";
import AdminCard from "@/components/AdminCard";
import Link from "next/link";

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
};

function money(value: number) {
  const sign = value >= 0 ? "" : "-";
  return `${sign}$${Math.abs(value).toFixed(2)}`;
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
        setStats(data);
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
            <div>
              <h1 className="text-3xl font-bold">
                AI TradePro Admin
              </h1>
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
            </div>
          </div>

          {loading ? (
            <p className="text-[var(--muted)]">
              Loading admin dashboard...
            </p>
          ) : !stats ? (
            <p className="text-red-400">
              Failed to load admin statistics.
            </p>
          ) : (
            <div className="grid md:grid-cols-4 gap-4">
              <AdminCard
                title="Total Users"
                value={stats.totalUsers}
                subtitle="Registered accounts"
              />

              <AdminCard
                title="Total Trades"
                value={stats.totalTrades}
                subtitle="All trades in platform"
              />

              <AdminCard
                title="Open Trades"
                value={stats.openTrades}
                subtitle="Currently active trades"
              />

              <AdminCard
                title="Closed Trades"
                value={stats.closedTrades}
                subtitle="Win and loss trades"
              />

              <AdminCard
                title="Wins"
                value={stats.wins}
                subtitle="Profitable trades"
              />

              <AdminCard
                title="Losses"
                value={stats.losses}
                subtitle="Losing trades"
              />

              <AdminCard
                title="Win Rate"
                value={`${stats.winRate}%`}
                subtitle="Closed trades only"
              />

              <AdminCard
                title="Total Profit"
                value={money(stats.totalProfit)}
                subtitle="Net profit / loss"
              />

              <AdminCard
                title="Database"
                value={`🟢 ${stats.databaseStatus}`}
                subtitle="Prisma connection"
              />

              <AdminCard
                title="Server"
                value={`🟢 ${stats.serverStatus}`}
                subtitle="API status"
              />

              <AdminCard
                title="Telegram"
                value="🟢 Connected"
                subtitle="Bot configured"
              />

              <AdminCard
                title="Version"
                value="1.0"
                subtitle="AI TradePro Admin"
              />
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}