"use client";

import { useEffect, useState } from "react";

export default function TradeHistory() {
  const [trades, setTrades] = useState<any[]>([]);

  useEffect(() => {
    loadTrades();
  }, []);

  async function loadTrades() {
    const res = await fetch("/api/trades/history", {
      cache: "no-store",
    });

    const data = await res.json();
    setTrades(data);
  }

  function formatDate(date: string) {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
      <h2 className="text-2xl font-bold mb-5">Closed Trades History</h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left p-3">Date / Time</th>
              <th className="text-left p-3">Symbol</th>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">Entry</th>
              <th className="text-left p-3">Close</th>
              <th className="text-left p-3">Profit</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="border-b border-[var(--border)]">
                <td className="p-3">
                  {formatDate(trade.updatedAt || trade.createdAt)}
                </td>

                <td className="p-3 font-bold">{trade.symbol}</td>

                <td
                  className={
                    trade.type === "BUY"
                      ? "p-3 text-green-400"
                      : "p-3 text-red-400"
                  }
                >
                  {trade.type}
                </td>

                <td className="p-3">${Number(trade.entry || 0).toLocaleString()}</td>

                <td className="p-3">
                  ${Number(trade.closePrice || 0).toLocaleString()}
                </td>

                <td
                  className={
                    Number(trade.profit || 0) >= 0
                      ? "p-3 font-bold text-green-400"
                      : "p-3 font-bold text-red-400"
                  }
                >
                  ${Number(trade.profit || 0).toFixed(2)}
                </td>

                <td
                  className={
                    trade.status === "Win"
                      ? "p-3 font-bold text-green-400"
                      : "p-3 font-bold text-red-400"
                  }
                >
                  {trade.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}