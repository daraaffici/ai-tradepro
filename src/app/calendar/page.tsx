"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";
import { economicEvents } from "@/lib/economicEvents";

export default function CalendarPage() {
  return (
    <AuthGuard>
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

          <div className="mb-6">
            <h1 className="text-3xl font-bold">Economic Calendar</h1>
            <p className="text-[var(--muted)] mt-2">
              Track high-impact events and send Telegram alerts before major market news.
            </p>
          </div>

          <div className="space-y-4">
            {economicEvents.map((item) => (
              <div
                key={item.id}
                className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-lg">{item.event}</h2>
                    <p className="text-[var(--muted)] mt-2">
                      {item.date} • {item.time} Cambodia Time • {item.currency}
                    </p>
                  </div>

                  <span
                    className={
                      item.impact === "High"
                        ? "text-red-400 font-bold"
                        : item.impact === "Medium"
                        ? "text-yellow-400 font-bold"
                        : "text-green-400 font-bold"
                    }
                  >
                    {item.impact}
                  </span>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-[var(--input)] p-4 rounded-xl">
                    <p className="text-[var(--muted)] text-sm">Previous</p>
                    <p className="font-bold">{item.previous}</p>
                  </div>

                  <div className="bg-[var(--input)] p-4 rounded-xl">
                    <p className="text-[var(--muted)] text-sm">Forecast</p>
                    <p className="font-bold">{item.forecast}</p>
                  </div>

                  <div className="bg-[var(--input)] p-4 rounded-xl">
                    <p className="text-[var(--muted)] text-sm">Market Impact</p>
                    <p
                      className={
                        item.impact === "High"
                          ? "text-red-400 font-bold"
                          : item.impact === "Medium"
                          ? "text-yellow-400 font-bold"
                          : "text-green-400 font-bold"
                      }
                    >
                      {item.impact}
                    </p>
                  </div>

                  <div className="bg-[var(--input)] p-4 rounded-xl">
                    <p className="text-[var(--muted)] text-sm">Telegram Alert</p>
                    <p className="font-bold text-purple-400">30 minutes before</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}