"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    hour: "2-digit",
    minute: "2-digit",
  });
}

function levelColor(level: string) {
  if (level === "ERROR") return "text-red-400";
  if (level === "WARNING") return "text-yellow-400";
  if (level === "SUCCESS") return "text-green-400";
  return "text-blue-400";
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const res = await fetch("/api/admin/notifications", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function markAllRead() {
    await fetch("/api/admin/notifications", {
      method: "PATCH",
    });

    setUnreadCount(0);
    loadNotifications();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative bg-[var(--card)] border border-[var(--border)] px-4 py-2 rounded-xl"
      >
        🔔

        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-96 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xl z-50">
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            <h3 className="font-bold">Notifications</h3>

            <button
              onClick={markAllRead}
              className="text-xs text-purple-400 hover:text-purple-300"
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-[var(--muted)]">No notifications.</p>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border-b border-[var(--border)] hover:bg-[var(--input)]"
                >
                  <div className="flex justify-between gap-3">
                    <p className="font-bold">
                      <span className={levelColor(item.level)}>●</span>{" "}
                      {item.action}
                    </p>

                    <span className="text-xs text-[var(--muted)]">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <p className="text-sm text-[var(--muted)] mt-1">
                    {item.description}
                  </p>

                  <p className="text-xs text-[var(--muted)] mt-2">
                    {item.entity}
                  </p>
                </div>
              ))
            )}
          </div>

          <Link
            href="/admin/notifications"
            className="block p-4 text-center text-purple-400 hover:text-purple-300"
          >
            View All Notifications →
          </Link>
        </div>
      )}
    </div>
  );
}