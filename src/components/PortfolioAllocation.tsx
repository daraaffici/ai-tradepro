"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type Portfolio = {
  id: number;
  symbol: string;
  quantity: number;
  buyPrice: number;
};

export default function PortfolioAllocation() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const res = await fetch("/api/portfolio");
      const items: Portfolio[] = await res.json();

      const chartData = items.map((item) => ({
        name: item.symbol,
        value: item.quantity * item.buyPrice,
      }));

      setData(chartData);
    }

    loadData();
  }, []);

  const COLORS = [
    "#8b5cf6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#3b82f6",
  ];

  return (
    <div className="bg-[var(--card)] mt-8 p-5 rounded-2xl border border-[var(--border)]">
      <h2 className="text-xl font-bold mb-4">
        Portfolio Allocation
      </h2>

      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}