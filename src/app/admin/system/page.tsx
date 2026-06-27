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

  useEffect(() => {
    loadSystem();
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

              <button
                onClick={loadSystem}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-white font-bold"
              >
                Refresh
              </button>
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
                  <StatusCard title="Telegram" service={data.services.telegram} />
                  <StatusCard title="OpenAI" service={data.services.openai} />
                  <StatusCard title="Market API" service={data.services.marketApi} />
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