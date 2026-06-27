"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NotificationBell from "@/components/admin/NotificationBell";

const supportedSymbols = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "AAPL",
  "TSLA",
  "NVDA",
  "MSFT",
  "AMD",
];

export default function Header() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function handleSearch() {
    const value = search.trim().toUpperCase();

    if (!value) {
      alert("Please enter a market symbol");
      return;
    }

    if (!supportedSymbols.includes(value)) {
      alert("Symbol not supported yet");
      return;
    }

    router.push(`/analysis?symbol=${value}`);
  }

  return (
    <div className="pt-12 lg:pt-0 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
          Welcome Back 👋
        </h1>

        <p style={{ color: "var(--muted)" }}>AI Trading Dashboard</p>

        <p className="text-green-400 text-sm">
          ● Live Data (Auto Refresh 30s)
        </p>
      </div>
      <div className="flex items-center gap-4">
        <NotificationBell />
      </div>

      <div className="flex w-full lg:w-auto">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          placeholder="Search Markets..."
          className="bg-[var(--input)] border border-[var(--border)] px-4 py-3 rounded-l-lg w-full lg:w-72"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        />

        <button
          onClick={handleSearch}
          className="bg-purple-600 px-4 py-3 rounded-r-lg text-white font-bold"
        >
          Search
        </button>
      </div>
    </div>
  );
}