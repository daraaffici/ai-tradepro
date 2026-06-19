"use client";

import { useEffect, useState } from "react";

export default function DashboardSummary() {
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [tradeCount, setTradeCount] = useState(0);

  useEffect(() => {
    async function load() {
      const portfolio = await fetch("/api/portfolio").then((r) => r.json());
      const watchlist = await fetch("/api/watchlist").then((r) => r.json());
      const trades = await fetch("/api/trades/stats").then((r) => r.json());

      setPortfolioCount(portfolio.length);
      setWatchlistCount(watchlist.length);
      setTradeCount(trades.openTrades);
    }

    load();
  }, []);

  const cardStyle = {
    backgroundColor: "var(--card)",
    borderColor: "var(--border)",
    color: "var(--foreground)",
  };

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-8">
      <div className="p-5 rounded-2xl border" style={cardStyle}>
        <p style={{ color: "var(--muted)" }}>Portfolio Items</p>
        <h2 className="text-3xl font-bold mt-2">{portfolioCount}</h2>
      </div>

      <div className="p-5 rounded-2xl border" style={cardStyle}>
        <p style={{ color: "var(--muted)" }}>Watchlist Items</p>
        <h2 className="text-3xl font-bold mt-2">{watchlistCount}</h2>
      </div>

      <div className="p-5 rounded-2xl border" style={cardStyle}>
        <p style={{ color: "var(--muted)" }}>Open Trades</p>
        <h2 className="text-3xl font-bold mt-2">{tradeCount}</h2>
      </div>
    </div>
  );
}