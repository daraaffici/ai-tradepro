"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";

type CalendarEvent = {
  id: string;
  event: string;
  date: string;
  time: string;
  currency: string;
  impact: "High" | "Medium" | "Low";
  previous: string;
  forecast: string;
};

const periods = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
];

const impacts = ["All", "High", "Medium", "Low"];

function impactClass(impact: string) {
  if (impact === "High") return "text-red-400 font-bold";
  if (impact === "Medium") return "text-yellow-400 font-bold";
  return "text-green-400 font-bold";
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [period, setPeriod] = useState("week");
  const [impact, setImpact] = useState("All");
  const [currency, setCurrency] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, [period]);

  async function loadEvents() {
    try {
      setLoading(true);

      const res = await fetch(`/api/calendar?period=${period}`, {
        cache: "no-store",
      });

      const data: CalendarEvent[] = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Failed to load calendar:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  const currencies = useMemo(() => {
    return ["All", ...Array.from(new Set(events.map((item) => item.currency)))];
  }, [events]);

  const filteredEvents = events.filter((item) => {
    const matchImpact = impact === "All" || item.impact === impact;
    const matchCurrency = currency === "All" || item.currency === currency;

    return matchImpact && matchCurrency;
  });

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
                Track high-impact events and prepare before major market news.
              </p>
            </div>

            <button
              onClick={loadEvents}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-white font-bold"
            >
              Refresh
            </button>
          </div>

          <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)] mb-6">
            <div className="grid md:grid-cols-3 gap-3">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="bg-zinc-800 text-white border border-zinc-700 p-3 rounded-xl"
              >
                {periods.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <select
                value={impact}
                onChange={(e) => setImpact(e.target.value)}
                className="bg-zinc-800 text-white border border-zinc-700 p-3 rounded-xl"
              >
                {impacts.map((item) => (
                  <option key={item} value={item}>
                    {item} Impact
                  </option>
                ))}
              </select>

              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-zinc-800 text-white border border-zinc-700 p-3 rounded-xl"
              >
                {currencies.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All Currencies" : item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <p className="text-[var(--muted)]">Loading economic events...</p>
          ) : filteredEvents.length === 0 ? (
            <p className="text-yellow-400">No economic events found.</p>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((item) => (
                <div
                  key={item.id}
                  className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h2 className="font-bold text-lg">{item.event}</h2>

                      <p className="text-[var(--muted)] mt-2">
                        {item.date} • {item.time} Cambodia Time •{" "}
                        {item.currency}
                      </p>
                    </div>

                    <span className={impactClass(item.impact)}>
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
                      <p className="text-[var(--muted)] text-sm">
                        Market Impact
                      </p>
                      <p className={impactClass(item.impact)}>
                        {item.impact}
                      </p>
                    </div>

                    <div className="bg-[var(--input)] p-4 rounded-xl">
                      <p className="text-[var(--muted)] text-sm">
                        Telegram Alert
                      </p>
                      <p className="font-bold text-purple-400">
                        30 minutes before
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