"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";
import AdminGuard from "@/components/AdminGuard";
import AdminSidebar from "@/components/AdminSidebar";

type ServiceStatus = {
  status: string;
  healthy: boolean;
};

type SystemData = {
  checkedAt: string;
  services: {
    database: ServiceStatus;
    server: ServiceStatus;
    telegram: ServiceStatus;
    openai: ServiceStatus;
    marketApi: ServiceStatus;
  };
};

function StatusCard({
  title,
  service,
}: {
  title: string;
  service: ServiceStatus;
}) {
  return (
    <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
      <p className="text-[var(--muted)] text-sm">{title}</p>

      <h2
        className={
          service.healthy
            ? "text-2xl font-bold mt-3 text-green-400"
            : "text-2xl font-bold mt-3 text-red-400"
        }
      >
        {service.healthy ? "🟢" : "🔴"} {service.status}
      </h2>
    </div>
  );
}

export default function AdminSystemPage() {
  const [data, setData] = useState<SystemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [telegramStatus, setTelegramStatus] = useState("Checking...");
  const [telegramBot, setTelegramBot] = useState("");
  const [sendingTest, setSendingTest] = useState(false);

  useEffect(() => {
    loadSystem();
    loadTelegramStatus();
  }, []);

  async function loadSystem() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/system", {
        cache: "no-store",
      });

      const result = await res.json();

      if (result.success) {
        setData(result);
      } else {
        setData(null);
      }
    } catch (error) {
      console.error(error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  async function loadTelegramStatus() {
    try {
      const res = await fetch("/api/admin/system/telegram", {
        cache: "no-store",
      });

      const result = await res.json();

      setTelegramStatus(result.status || "Offline");
      setTelegramBot(result.bot || "");
    } catch (error) {
      console.error(error);
      setTelegramStatus("Offline");
      setTelegramBot("");
    }
  }

  async function refreshAll() {
    await Promise.all([loadSystem(), loadTelegramStatus()]);
  }

  async function sendTelegramTest() {
    try {
      setSendingTest(true);

      const res = await fetch("/api/admin/system/telegram/test", {
        method: "POST",
      });

      const result = await res.json();

      if (result.success) {
        alert("Telegram Test Success ✅");
      } else {
        alert(result.error || "Telegram Test Failed");
      }
    } catch (error) {
      console.error(error);
      alert("Telegram Test Failed");
    } finally {
      setSendingTest(false);
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
                <h1 className="text-3xl font-bold">System Monitor</h1>
                <p className="text-[var(--muted)] mt-2">
                  Basic health check for AI TradePro services.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={sendTelegramTest}
                  disabled={sendingTest}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 px-4 py-2 rounded-xl text-white font-bold"
                >
                  {sendingTest ? "Sending..." : "Send Test Telegram"}
                </button>

                <button
                  onClick={refreshAll}
                  className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-white font-bold"
                >
                  Refresh
                </button>
              </div>
            </div>

            {loading ? (
              <p className="text-[var(--muted)]">Checking system status...</p>
            ) : !data ? (
              <p className="text-red-400">Failed to load system status.</p>
            ) : (
              <>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <StatusCard title="Database" service={data.services.database} />
                  <StatusCard title="Server" service={data.services.server} />
                  <StatusCard title="OpenAI" service={data.services.openai} />
                  <StatusCard title="Market API" service={data.services.marketApi} />

                  <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
                    <p className="text-[var(--muted)] text-sm">Telegram Bot</p>

                    <h2
                      className={
                        telegramStatus === "Online"
                          ? "text-2xl font-bold mt-3 text-green-400"
                          : telegramStatus === "Not Configured"
                          ? "text-2xl font-bold mt-3 text-zinc-400"
                          : "text-2xl font-bold mt-3 text-red-400"
                      }
                    >
                      {telegramStatus === "Online"
                        ? "🟢 Online"
                        : telegramStatus === "Not Configured"
                        ? "⚪ Not Configured"
                        : "🔴 Offline"}
                    </h2>

                    {telegramBot && (
                      <p className="text-sm mt-2 text-[var(--muted)]">
                        @{telegramBot}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-sm text-[var(--muted)]">
                  Last checked:{" "}
                  {new Date(data.checkedAt).toLocaleString("en-GB", {
                    timeZone: "Asia/Phnom_Penh",
                  })}
                </p>
              </>
            )}
          </main>
        </div>
      </AdminGuard>
    </AuthGuard>
  );
}