"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";

const events = [
  {
    event: "US CPI",
    date: "2026-06-20",
    time: "20:30",
    currency: "USD",
    impact: "High",
    previous: "3.4%",
    forecast: "3.2%",
  },
  {
    event: "FOMC Meeting",
    date: "2026-06-22",
    time: "02:00",
    currency: "USD",
    impact: "High",
    previous: "5.50%",
    forecast: "5.50%",
  },
  {
    event: "US GDP",
    date: "2026-06-24",
    time: "20:30",
    currency: "USD",
    impact: "Medium",
    previous: "2.1%",
    forecast: "2.3%",
  },
  {
    event: "Non-Farm Payrolls",
    date: "2026-06-27",
    time: "20:30",
    currency: "USD",
    impact: "High",
    previous: "180K",
    forecast: "195K",
  },
];

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
              Track high-impact events that can move crypto and stock markets.
            </p>
          </div>

          <div className="space-y-4">
            {events.map((item, index) => (
              <div
                key={index}
                className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-lg">{item.event}</h2>
                    <p className="text-[var(--muted)] mt-2">
                      {item.date} • {item.time} • {item.currency}
                    </p>
                  </div>

                  <span
                    className={
                      item.impact === "High"
                        ? "text-red-400 font-bold"
                        : "text-yellow-400 font-bold"
                    }
                  >
                    {item.impact}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-4">
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
                          : "text-yellow-400 font-bold"
                      }
                    >
                      {item.impact}
                    </p>
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