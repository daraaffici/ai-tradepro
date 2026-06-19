"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";

type CalendarEvent = {
  event: string;
  date: string;
  time: string;
  currency: string;
  impact: "High" | "Medium" | "Low";
  previous: string;
  forecast: string;
};

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCalendar();

    const interval = setInterval(() => {
      loadCalendar();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  async function loadCalendar() {
    try {
      setLoading(true);

      const res = await fetch("/api/calendar", {
        cache: "no-store",
      });

      const data: CalendarEvent[] = await res.json();

      setEvents(data);
    } catch (error) {
      console.error("Failed to load calendar:", error);
    } finally {
      setLoading(false);
    }
  }

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

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Economic Calendar</h1>
              <p className="text-[var(--muted)] mt-2">
                Track high-impact market events for Forex, Gold, Stocks and Crypto.
              </p>
            </div>

            <button
              onClick={loadCalendar}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-xl font-bold text-white"
            >
              Refresh Calendar
            </button>
          </div>

          {loading ? (
            <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
              <p className="text-[var(--muted)]">Loading calendar events...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((item, index) => (
                <div
                  key={`${item.event}-${item.date}-${index}`}
                  className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]"
                >
                  <div className="flex justify-between items-center gap-4">
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
                          : item.impact === "Medium"
                          ? "text-yellow-400 font-bold"
                          : "text-green-400 font-bold"
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
                      <p className="text-[var(--muted)] text-sm">
                        Market Impact
                      </p>
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
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}