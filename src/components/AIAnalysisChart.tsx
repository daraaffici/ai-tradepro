"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from "recharts";

type Props = {
  symbol: string;
  price: number;
  entry: number;
  takeProfit: number;
  stopLoss: number;
  support: number;
  resistance: number;
  recommendation: string;
};

export default function AIAnalysisChart({
  symbol,
  price,
  entry,
  takeProfit,
  stopLoss,
  support,
  resistance,
  recommendation,
}: Props) {
  const data = [
    { time: "T-5", price: support },
    { time: "T-4", price: entry * 0.99 },
    { time: "T-3", price: entry },
    { time: "T-2", price: price },
    { time: "Now", price: price },
    { time: "Target", price: takeProfit },
  ];

  return (
    <div className="bg-[var(--card)] mt-6 p-5 rounded-2xl border border-[var(--border)]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">
            {symbol} AI Chart Analysis
          </h2>

          <p className="text-[var(--muted)] text-sm">
            Visual support, resistance, entry, TP and SL levels.
          </p>
        </div>

        <span
          className={
            recommendation === "BUY"
              ? "text-green-400 font-bold"
              : recommendation === "SELL"
              ? "text-red-400 font-bold"
              : "text-yellow-400 font-bold"
          }
        >
          {recommendation}
        </span>
      </div>

      <div className="h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

            <XAxis dataKey="time" />

            <YAxis domain={["auto", "auto"]} />

            <Tooltip />

            <ReferenceLine
              y={entry}
              label="Entry"
              stroke="#3b82f6"
              strokeDasharray="4 4"
            />

            <ReferenceLine
              y={takeProfit}
              label="Take Profit"
              stroke="#22c55e"
              strokeDasharray="4 4"
            />

            <ReferenceLine
              y={stopLoss}
              label="Stop Loss"
              stroke="#ef4444"
              strokeDasharray="4 4"
            />

            <ReferenceLine
              y={support}
              label="Support"
              stroke="#eab308"
              strokeDasharray="4 4"
            />

            <ReferenceLine
              y={resistance}
              label="Resistance"
              stroke="#a855f7"
              strokeDasharray="4 4"
            />

            <Line
              type="monotone"
              dataKey="price"
              stroke="#38bdf8"
              strokeWidth={3}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}