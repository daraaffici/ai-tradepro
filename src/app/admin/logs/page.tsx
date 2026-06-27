"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";
import AdminGuard from "@/components/AdminGuard";
import AdminSidebar from "@/components/AdminSidebar";

type ActivityLog = {
  id: number;
  action: string;
  entity: string;
  entityId: number | null;
  description: string;
  adminName: string | null;
  ipAddress: string | null;
  createdAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  } | null;
};

const logTypes = ["All", "User", "Trade", "AI", "Telegram", "System"];

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

function getIcon(entity: string) {
  if (entity === "User") return "👤";
  if (entity === "Trade") return "📈";
  if (entity === "AI") return "🤖";
  if (entity === "Telegram") return "📨";
  if (entity === "System") return "⚙️";
  return "📝";
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [type, setType] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, [type]);

  async function loadLogs() {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/admin/logs?type=${type}&search=${encodeURIComponent(search)}`,
        { cache: "no-store" }
      );

      const data = await res.json();
      setLogs(data.success ? data.logs : []);
    } catch (error) {
      console.error(error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }

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
          <AdminSidebar />

          <main className="flex-1 w-full p-4 lg:p-6 overflow-x-hidden">
            <Header />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold">Activity Logs</h1>
                <p className="text-[var(--muted)] mt-2">
                  Track important admin, user, trade, AI, and system actions.
                </p>
              </div>

              <button
                onClick={loadLogs}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-white font-bold"
              >
                Refresh
              </button>
            </div>

            <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)] mb-6">
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") loadLogs();
                  }}
                  placeholder="Search logs..."
                  className="w-full bg-[var(--input)] border border-[var(--border)] p-3 rounded-xl"
                />

                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="bg-zinc-800 text-white border border-zinc-700 p-3 rounded-xl"
                >
                  {logTypes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <button
                  onClick={loadLogs}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl text-white font-bold"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
              <h2 className="text-2xl font-bold mb-5">
                Logs ({logs.length})
              </h2>

              {loading ? (
                <p className="text-[var(--muted)]">Loading logs...</p>
              ) : logs.length === 0 ? (
                <p className="text-[var(--muted)]">No activity logs found.</p>
              ) : (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-[var(--input)] p-4 rounded-xl border border-[var(--border)]"
                    >
                      <div className="flex gap-4">
                        <div className="text-2xl">{getIcon(log.entity)}</div>

                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3 className="font-bold">
                              {log.action} · {log.entity}
                            </h3>

                            <span className="text-xs text-[var(--muted)]">
                              {formatDate(log.createdAt)}
                            </span>
                          </div>

                          <p className="text-[var(--muted)] mt-2">
                            {log.description}
                          </p>

                          <div className="flex flex-wrap gap-3 mt-3 text-xs text-[var(--muted)]">
                            {log.adminName && (
                              <span>Admin: {log.adminName}</span>
                            )}

                            {log.user && (
                              <span>
                                User: {log.user.name} ({log.user.email})
                              </span>
                            )}

                            {log.entityId && (
                              <span>Entity ID: {log.entityId}</span>
                            )}

                            {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </AdminGuard>
    </AuthGuard>
  );
}