export type EconomicEvent = {
  id: string;
  event: string;
  date: string;
  time: string;
  currency: string;
  impact: "High" | "Medium" | "Low";
  previous: string;
  forecast: string;
};

export const economicEvents: EconomicEvent[] = [
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