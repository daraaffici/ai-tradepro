"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type Portfolio = {
  id: number;
  symbol: string;
  quantity: number;
  buyPrice: number;
};

function getUserId() {
  try {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return null;

    const user = JSON.parse(savedUser);
    return user?.id || null;
  } catch {
    return null;
  }
}

export default function PortfolioAllocation() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    const userId = getUserId();

    if (!userId) {
      setData([]);
      return;
    }

    const res = await fetch(`/api/portfolio?userId=${userId}`, {
      cache: "no-store",
    });

    const items: Portfolio[] = await res.json();
    const safeItems = Array.isArray(items) ? items : [];

    const chartData = safeItems.map((item) => ({
      name: item.symbol,
      value: item.quantity * item.buyPrice,
    }));

    setData(chartData);
  }

  const COLORS = ["#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6"];

  return (
    <div className="bg-[var(--card)] mt-8 p-5 rounded-2xl border border-[var(--border)]">
      <h2 className="text-xl font-bold mb-4">Portfolio Allocation</h2>

      {data.length === 0 ? (
        <p className="text-[var(--muted)]">No portfolio allocation yet.</p>
      ) : (
        <div style={{ width: "100%", height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" outerRadius={120} label>
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}