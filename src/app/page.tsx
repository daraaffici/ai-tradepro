"use client";

import Link from "next/link";

import TradingViewChart from "@/components/TradingViewChart";
import Watchlist from "@/components/Watchlist";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MarketNews from "@/components/MarketNews";
import AuthGuard from "@/components/AuthGuard";
import UserProfile from "@/components/UserProfile";
import DashboardSummary from "@/components/DashboardSummary";
import AutoTradeMonitor from "@/components/AutoTradeMonitor";
import TopMovers from "@/components/TopMovers";
import NotificationCenter from "@/components/NotificationCenter";

export default function Home() {
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
          <NotificationCenter />
          <AutoTradeMonitor />
          <UserProfile />

          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 mt-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-red-400 font-bold">
                  🔴 HIGH IMPACT EVENT
                </p>

                <h2 className="text-2xl font-bold mt-2">
                  US CPI Release
                </h2>

                <p className="text-[var(--muted)] mt-1">
                  Today • 20:30 • USD • Forecast: 3.2% • Previous: 3.4%
                </p>
              </div>

              <Link
                href="/calendar"
                className="bg-red-600 hover:bg-red-700 px-4 py-3 rounded-xl font-bold text-center"
              >
                View Calendar
              </Link>
            </div>
          </div>

          <DashboardSummary />
          <TopMovers />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
            <div
              className="xl:col-span-2 rounded-2xl p-5 border"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold">BTCUSDT Live Chart</h2>
                  <p className="text-[var(--muted)] text-sm">
                    Live TradingView market chart
                  </p>
                </div>

                <Link
                  href="/market"
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-bold"
                >
                  Open Market
                </Link>
              </div>

              <TradingViewChart symbol="BINANCE:BTCUSDT" />
            </div>

            <div
              className="rounded-2xl p-5 border"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <h2 className="text-xl font-bold mb-4">AI Analysis</h2>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
                <p className="text-yellow-400 font-bold">Ready to Analyze</p>
                <p className="text-sm text-[var(--muted)] mt-1">
                  Run AI analysis for BTC, ETH, SOL and save signals to Trade Journal.
                </p>
              </div>

              <Link
                href="/analysis"
                className="block text-center w-full bg-purple-600 hover:bg-purple-700 rounded-xl py-3 mt-6 font-bold"
              >
                Run AI Analysis
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
            <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--border)]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Watchlist</h2>

                <Link
                  href="/watchlist"
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  View all →
                </Link>
              </div>

              <Watchlist />
            </div>

            <div className="bg-[var(--card)] rounded-2xl p-5 border border-[var(--border)]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Latest Market News</h2>

                <Link
                  href="/news"
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  View all →
                </Link>
              </div>

              <MarketNews />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <Link
              href="/portfolio"
              className="p-5 rounded-2xl border hover:border-purple-500 transition"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              <p style={{ color: "var(--muted)" }}>Portfolio</p>
              <h2 className="text-2xl font-bold mt-2">Manage Assets</h2>
            </Link>

            <Link
              href="/signals"
              className="p-5 rounded-2xl border hover:border-purple-500 transition"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              <p style={{ color: "var(--muted)" }}>Signals</p>
              <h2 className="text-2xl font-bold mt-2">AI Signals</h2>
            </Link>

            <Link
              href="/trades"
              className="p-5 rounded-2xl border hover:border-purple-500 transition"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              <p style={{ color: "var(--muted)" }}>Trade Journal</p>
              <h2 className="text-2xl font-bold mt-2">Track Trades</h2>
            </Link>

            <Link
              href="/performance"
              className="p-5 rounded-2xl border hover:border-purple-500 transition"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              <p style={{ color: "var(--muted)" }}>Performance</p>
              <h2 className="text-2xl font-bold mt-2">Win Rate</h2>
            </Link>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}