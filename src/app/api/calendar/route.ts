import { NextResponse } from "next/server";

type CalendarEvent = {
  event: string;
  date: string;
  time: string;
  currency: string;
  impact: "High" | "Medium" | "Low";
  previous: string;
  forecast: string;
};

const fallbackEvents: CalendarEvent[] = [
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

export async function GET() {
  try {
    const apiKey = process.env.FMP_API_KEY;

    if (!apiKey) {
      return NextResponse.json(fallbackEvents);
    }

    const today = new Date();
    const from = today.toISOString().split("T")[0];

    const toDate = new Date();
    toDate.setDate(today.getDate() + 14);
    const to = toDate.toISOString().split("T")[0];

    const res = await fetch(
      `https://financialmodelingprep.com/api/v3/economic_calendar?from=${from}&to=${to}&apikey=${apiKey}`,
      { cache: "no-store" }
    );

    const data = await res.json();

    if (!res.ok || !Array.isArray(data)) {
      return NextResponse.json(fallbackEvents);
    }

    const events: CalendarEvent[] = data.slice(0, 20).map((item: any) => ({
      event: item.event || item.title || "Economic Event",
      date: item.date?.split(" ")[0] || from,
      time: item.date?.split(" ")[1] || "N/A",
      currency: item.country || item.currency || "USD",
      impact:
        item.impact === "High" || item.impact === "Medium"
          ? item.impact
          : "Low",
      previous: item.previous ? String(item.previous) : "-",
      forecast: item.estimate ? String(item.estimate) : "-",
    }));

    return NextResponse.json(events.length ? events : fallbackEvents);
  } catch {
    return NextResponse.json(fallbackEvents);
  }
}