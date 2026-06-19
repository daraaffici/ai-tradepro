"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const supportedSymbols = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "AVAXUSDT",
  "LINKUSDT",
  "SUIUSDT",
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "AUDUSD",
  "USDCAD",
  "USDCHF",
  "NZDUSD",
  "EURJPY",
  "GBPJPY",
  "EURGBP",
  "XAUUSD",
  "XAGUSD",
  "AAPL",
  "TSLA",
  "NVDA",
  "MSFT",
  "GOOGL",
  "AMZN",
  "META",
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
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
      <div>
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--foreground)" }}
        >
          Welcome Back 👋
        </h1>

        <p style={{ color: "var(--muted)" }}>AI Trading Dashboard</p>

        <p className="text-green-400 text-sm">
          ● Live Data (Auto Refresh 30s)
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          placeholder="Search Markets..."
          className="bg-[var(--input)] border border-[var(--border)] px-4 py-2 rounded-lg w-full lg:w-72"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        />

        <button
          onClick={handleSearch}
          className="bg-purple-600 px-4 py-2 rounded-lg text-white"
        >
          Search
        </button>
      </div>
    </div>
  );
}