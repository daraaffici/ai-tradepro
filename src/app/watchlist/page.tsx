"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Watchlist from "@/components/Watchlist";
import AuthGuard from "@/components/AuthGuard";

export default function WatchlistPage() {
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
            Watchlist
          </h1>

          <Watchlist />
        </main>
      </div>
    </AuthGuard>
  );
}