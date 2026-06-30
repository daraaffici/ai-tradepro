"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
};

export default function DashboardSummary() {
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [tradeCount, setTradeCount] = useState(0);

  useEffect(() => {
    async function load() {
      const savedUser = localStorage.getItem("user");

      if (!savedUser) {
        setPortfolioCount(0);
        setWatchlistCount(0);
        setTradeCount(0);
        return;
      }

      const user: User = JSON.parse(savedUser);

      const portfolio = await fetch(`/api/portfolio?userId=${user.id}`).then(
        (r) => r.json()
      );

      const watchlist = await fetch(`/api/watchlist?userId=${user.id}`).then(
        (r) => r.json()
      );

      const trades = await fetch(`/api/trades/stats?userId=${user.id}`).then(
        (r) => r.json()
      );

      setPortfolioCount(Array.isArray(portfolio) ? portfolio.length : 0);
      setWatchlistCount(Array.isArray(watchlist) ? watchlist.length : 0);
      setTradeCount(trades.openTrades || 0);
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