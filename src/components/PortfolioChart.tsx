"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", value: 1000 },
  { day: "Tue", value: 1120 },
  { day: "Wed", value: 1080 },
  { day: "Thu", value: 1250 },
  { day: "Fri", value: 1390 },
];

export default function PortfolioChart() {
  return (
    <div className="bg-[var(--card)] mt-8 rounded-2xl p-5 border border-[var(--border)]">
      <h2 className="text-xl font-bold mb-4">Portfolio Performance</h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}