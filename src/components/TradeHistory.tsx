"use client";

import { useEffect, useState } from "react";

type Trade = {
  id: number;
  symbol: string;
  type: string;
  entry: number;
  closePrice: number | null;
  profit: number | null;
  status: string;
  createdAt: string;
};

type Props = {
  period?: string;
};

function getUserId() {
  try {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return null;
    const user = JSON.parse(savedUser);
    return user?.id || null;
  } catch {
    return null;
  }
}

export default function TradeHistory({ period = "all" }: Props) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrades();
  }, [period]);

  async function loadTrades() {
    try {
      setLoading(true);

      const userId = getUserId();

      if (!userId) {
        setTrades([]);
        return;
      }

      const res = await fetch(
        `/api/trades/history?period=${period}&userId=${userId}`,
        { cache: "no-store" }
      );

      const data = await res.json();
      setTrades(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setTrades([]);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString("en-GB", {
      timeZone: "Asia/Phnom_Penh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
      <h2 className="text-2xl font-bold mb-6">Closed Trades History</h2>

      {loading ? (
        <p className="text-[var(--muted)]">Loading trade history...</p>
      ) : trades.length === 0 ? (
        <p className="text-[var(--muted)]">No closed trades found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="p-3">Date / Time</th>
                <th className="p-3">Symbol</th>
                <th className="p-3">Type</th>
                <th className="p-3">Entry</th>
                <th className="p-3">Close</th>
                <th className="p-3">Profit</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="border-b border-[var(--border)]">
                  <td className="p-3">{formatDate(trade.createdAt)}</td>
                  <td className="p-3 font-bold">{trade.symbol}</td>
                  <td className={trade.type === "BUY" ? "p-3 text-green-400" : "p-3 text-red-400"}>
                    {trade.type}
                  </td>
                  <td className="p-3">${Number(trade.entry).toLocaleString()}</td>
                  <td className="p-3">
                    {trade.closePrice ? `$${Number(trade.closePrice).toLocaleString()}` : "-"}
                  </td>
                  <td className={Number(trade.profit || 0) >= 0 ? "p-3 text-green-400 font-bold" : "p-3 text-red-400 font-bold"}>
                    ${Number(trade.profit || 0).toFixed(2)}
                  </td>
                  <td className={trade.status === "Win" ? "p-3 text-green-400 font-bold" : "p-3 text-red-400 font-bold"}>
                    {trade.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}