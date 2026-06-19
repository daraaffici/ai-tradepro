"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import TradePerformance from "@/components/TradePerformance";
import AuthGuard from "@/components/AuthGuard";

export default function PerformancePage() {
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

          <h1 className="text-3xl font-bold mb-6">
            Trade Performance
          </h1>

          <TradePerformance />
        </main>
      </div>
    </AuthGuard>
  );
}