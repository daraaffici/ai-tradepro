"use client";

import { useEffect, useState } from "react";

export default function TradeHistory() {
  const [trades, setTrades] = useState<any[]>([]);

  useEffect(() => {
    loadTrades();
  }, []);

  async function loadTrades() {
    const res = await fetch("/api/trades/history");
    const data = await res.json();
    setTrades(data);
  }

  return (
    <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
      <h2 className="text-2xl font-bold mb-5">
        Closed Trades History
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
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
              <tr
                key={trade.id}
                className="border-b border-[var(--border)]"
              >
                <td className="p-3">{trade.symbol}</td>

                <td className="p-3">
                  {trade.type}
                </td>

                <td className="p-3">
                  ${trade.entry}
                </td>

                <td className="p-3">
                  ${trade.closePrice}
                </td>

                <td
                  className={`p-3 font-bold ${
                    trade.profit >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  ${trade.profit}
                </td>

                <td
                  className={`p-3 font-bold ${
                    trade.status === "Win"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
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