"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";
import AdminGuard from "@/components/AdminGuard";
import AdminSidebar from "@/components/AdminSidebar";

type Notification = {
  id: number;
  action: string;
  entity: string;
  description: string;
  level: string;
  isRead: boolean;
  createdAt: string;
};

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

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/notifications", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setNotifications(data.notifications);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGuard>
      <AdminGuard>
        <div className="flex min-h-screen" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
          <AdminSidebar />

          <main className="flex-1 w-full p-4 lg:p-6 overflow-x-hidden">
            <Header />

            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="text-[var(--muted)] mt-2">
                  Latest platform notifications from activity logs.
                </p>
              </div>

              <button
                onClick={loadNotifications}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-white font-bold"
              >
                Refresh
              </button>
            </div>

            <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
              {loading ? (
                <p className="text-[var(--muted)]">Loading notifications...</p>
              ) : notifications.length === 0 ? (
                <p className="text-[var(--muted)]">No notifications found.</p>
              ) : (
                <div className="space-y-4">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[var(--input)] p-4 rounded-xl border border-[var(--border)]"
                    >
                      <div className="flex justify-between gap-4">
                        <div>
                          <h2 className="font-bold">
                            {item.action} · {item.entity}
                          </h2>

                          <p className="text-[var(--muted)] mt-2">
                            {item.description}
                          </p>
                        </div>

                        <span className="text-xs text-[var(--muted)]">
                          {formatDate(item.createdAt)}
                        </span>
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