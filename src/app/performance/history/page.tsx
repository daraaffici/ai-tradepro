"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import TradeHistory from "@/components/TradeHistory";

export default function TradeHistoryPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6">
        <Header />

        <h1 className="text-3xl font-bold mb-6">
          Trade History
        </h1>

        <TradeHistory />
      </main>
    </div>
  );
}