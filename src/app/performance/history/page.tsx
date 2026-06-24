"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import TradeHistory from "@/components/TradeHistory";
import AuthGuard from "@/components/AuthGuard";

export default function TradeHistoryPage() {
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

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">
              Trade History
            </h1>

            <div className="flex gap-3">
              <a
                href="/api/trades/export"
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
        </main>
      </div>
    </AuthGuard>
  );
}