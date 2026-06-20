"use client";

import { useEffect, useState } from "react";

type ClosedTrade = {
  id: number;
  symbol: string;
  type: string;
  status: "Win" | "Loss";
  entry: number;
  closePrice: number;
  profit: number;
};

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<ClosedTrade[]>([]);

  useEffect(() => {
    checkTrades();

    const interval = setInterval(() => {
      checkTrades();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  async function checkTrades() {
    try {
      const res = await fetch("/api/trades/monitor", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success && data.closedTrades?.length > 0) {
        setNotifications((prev) => [
          ...data.closedTrades,
          ...prev,
        ]);
      }
    } catch (error) {
      console.error("Notification monitor failed:", error);
    }
  }

  function removeNotification(id: number) {
    setNotifications((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-[99999] space-y-3 w-80">
      {notifications.slice(0, 5).map((item) => (
        <div
          key={`${item.id}-${item.closePrice}`}
          className={
            item.status === "Win"
              ? "bg-green-600 text-white p-4 rounded-2xl shadow-2xl"
              : "bg-red-600 text-white p-4 rounded-2xl shadow-2xl"
          }
        >
          <div className="flex justify-between gap-3">
            <div>
              <p className="font-bold">
                {item.status === "Win"
                  ? "🎉 Take Profit Hit"
                  : "❌ Stop Loss Hit"}
              </p>

              <p className="text-sm mt-1">
                {item.symbol} {item.type}
              </p>

              <p className="text-sm mt-1">
                Close: ${item.closePrice.toLocaleString()}
              </p>

              <p className="font-bold mt-2">
                Profit: ${item.profit.toFixed(2)}
              </p>
            </div>

            <button
              onClick={() => removeNotification(item.id)}
              className="font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}