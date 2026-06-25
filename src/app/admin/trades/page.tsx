"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";
import AdminGuard from "@/components/AdminGuard";

type AdminTrade = {
  id: number;
  symbol: string;
  type: string;
  entry: number;
  takeProfit: number;
  stopLoss: number;
  lotSize: number;
  closePrice: number | null;
  profit: number | null;
  status: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export default function AdminTradesPage() {
  const [trades, setTrades] = useState<AdminTrade[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrades();
  }, []);

  async function loadTrades() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/trades", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setTrades(data.trades);
      } else {
        setTrades([]);
      }
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

  function money(value: number | null) {
    const amount = Number(value || 0);
    const sign = amount >= 0 ? "" : "-";
    return `${sign}$${Math.abs(amount).toFixed(2)}`;
  }

  const filteredTrades = trades.filter((trade) => {
    const text = `${trade.symbol} ${trade.type} ${trade.status} ${trade.user.name} ${trade.user.email}`.toLowerCase();

    const matchSearch = text.includes(search.toLowerCase());
    const matchStatus = status === "All" || trade.status === status;

    return matchSearch && matchStatus;
  });

  return (
    <AuthGuard>
      <AdminGuard>
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

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold">Admin Trades</h1>
                <p className="text-[var(--muted)] mt-2">
                  View all user trades across AI TradePro.
                </p>
              </div>

              <Link
                href="/admin"
                className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-xl text-white font-bold"
              >
                ← Back Admin
              </Link>
            </div>

            <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)] mb-6">
              <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search symbol, user, email..."
                  className="w-full md:max-w-md bg-[var(--input)] border border-[var(--border)] p-3 rounded-xl"
                />

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-zinc-800 text-white px-4 py-3 rounded-xl border border-zinc-700"
                >
                  <option value="All">All Status</option>
                  <option value="Open">Open</option>
                  <option value="Win">Win</option>
                  <option value="Loss">Loss</option>
                </select>

                <button
                  onClick={loadTrades}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-xl text-white font-bold"
                >
                  Refresh
                </button>
              </div>
            </div>

            <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
              <h2 className="text-2xl font-bold mb-5">
                Trades ({filteredTrades.length})
              </h2>

              {loading ? (
                <p className="text-[var(--muted)]">Loading trades...</p>
              ) : filteredTrades.length === 0 ? (
                <p className="text-[var(--muted)]">No trades found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="p-3">Date / Time</th>
                        <th className="p-3">User</th>
                        <th className="p-3">Symbol</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Entry</th>
                        <th className="p-3">Close</th>
                        <th className="p-3">TP</th>
                        <th className="p-3">SL</th>
                        <th className="p-3">Lot</th>
                        <th className="p-3">Profit</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredTrades.map((trade) => (
                        <tr key={trade.id} className="border-b border-[var(--border)]">
                          <td className="p-3">{formatDate(trade.createdAt)}</td>

                          <td className="p-3">
                            <p className="font-bold">{trade.user.name}</p>
                            <p className="text-xs text-[var(--muted)]">
                              {trade.user.email}
                            </p>
                          </td>

                          <td className="p-3 font-bold">{trade.symbol}</td>

                          <td
                            className={
                              trade.type === "BUY"
                                ? "p-3 text-green-400 font-bold"
                                : "p-3 text-red-400 font-bold"
                            }
                          >
                            {trade.type}
                          </td>

                          <td className="p-3">${Number(trade.entry).toLocaleString()}</td>

                          <td className="p-3">
                            {trade.closePrice
                              ? `$${Number(trade.closePrice).toLocaleString()}`
                              : "-"}
                          </td>

                          <td className="p-3">${Number(trade.takeProfit).toLocaleString()}</td>
                          <td className="p-3">${Number(trade.stopLoss).toLocaleString()}</td>
                          <td className="p-3">{trade.lotSize}</td>

                          <td
                            className={
                              Number(trade.profit || 0) >= 0
                                ? "p-3 text-green-400 font-bold"
                                : "p-3 text-red-400 font-bold"
                            }
                          >
                            {money(trade.profit)}
                          </td>

                          <td
                            className={
                              trade.status === "Win"
                                ? "p-3 text-green-400 font-bold"
                                : trade.status === "Loss"
                                ? "p-3 text-red-400 font-bold"
                                : "p-3 text-yellow-400 font-bold"
                            }
                          >
                            {trade.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </AdminGuard>
    </AuthGuard>
  );
}