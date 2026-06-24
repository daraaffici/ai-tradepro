"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import TradeHistory from "@/components/TradeHistory";
import AuthGuard from "@/components/AuthGuard";

export default function TradeHistoryPage() {
  const [period, setPeriod] = useState("today");

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
            <h1 className="text-3xl font-bold">Trade History</h1>

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

              <a
                href={`/api/trades/export?period=${period}`}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl text-white font-bold"
              >
                Download CSV
              </a>

              <Link
                href="/performance"
                className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-xl text-white font-bold"
              >
                ← Back
              </Link>
            </div>
          </div>

          <TradeHistory />
        </main>
      </div>
    </AuthGuard>
  );
}