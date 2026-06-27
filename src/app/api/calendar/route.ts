import { NextResponse } from "next/server";

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

const fallbackEvents: CalendarEvent[] = [
  {
    id: "us-cpi-2026-06-20",
    event: "US CPI",
    date: "2026-06-20",
    time: "20:30",
    currency: "USD",
    impact: "High",
    previous: "3.4%",
    forecast: "3.2%",
  },
  {
    id: "fomc-2026-06-22",
    event: "FOMC Meeting",
    date: "2026-06-22",
    time: "02:00",
    currency: "USD",
    impact: "High",
    previous: "5.50%",
    forecast: "5.50%",
  },
  {
    id: "us-gdp-2026-06-24",
    event: "US GDP",
    date: "2026-06-24",
    time: "20:30",
    currency: "USD",
    impact: "Medium",
    previous: "2.1%",
    forecast: "2.3%",
  },
  {
    id: "nfp-2026-06-27",
    event: "Non-Farm Payrolls",
    date: "2026-06-27",
    time: "20:30",
    currency: "USD",
    impact: "High",
    previous: "180K",
    forecast: "195K",
  },
];

function normalizeImpact(value: any): "High" | "Medium" | "Low" {
  const text = String(value || "").toLowerCase();

  if (text.includes("high")) return "High";
  if (text.includes("medium")) return "Medium";
  return "Low";
}

function toDateOnly(date: Date) {
  return date.toISOString().split("T")[0];
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const period = url.searchParams.get("period") || "week";

    const apiKey = process.env.FMP_API_KEY;

    const today = new Date();
    const from = toDateOnly(today);

    const toDate = new Date();
    toDate.setDate(today.getDate() + (period === "today" ? 1 : 7));
    const to = toDateOnly(toDate);

    if (!apiKey) {
      return NextResponse.json(fallbackEvents);
    }

    const res = await fetch(
      `https://financialmodelingprep.com/api/v3/economic_calendar?from=${from}&to=${to}&apikey=${apiKey}`,
      { cache: "no-store" }
    );

    const data = await res.json();

    if (!res.ok || !Array.isArray(data)) {
      return NextResponse.json(fallbackEvents);
    }

    const events: CalendarEvent[] = data
      .map((item: any, index: number) => {
        const rawDate = item.date || "";
        const [datePart, timePart] = rawDate.split(" ");

        return {
          id: `${datePart || from}-${index}`,
          event: item.event || item.title || "Economic Event",
          date: datePart || from,
          time: timePart?.slice(0, 5) || "N/A",
          currency: item.country || item.currency || "USD",
          impact: normalizeImpact(item.impact),
          previous: item.previous ? String(item.previous) : "-",
          forecast: item.estimate ? String(item.estimate) : "-",
        };
      })
      .filter((item) => item.date >= from && item.date <= to)
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
      .slice(0, 50);

    return NextResponse.json(events.length ? events : fallbackEvents);
  } catch {
    return NextResponse.json(fallbackEvents);
  }
}