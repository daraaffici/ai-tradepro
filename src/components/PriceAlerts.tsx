"use client";

import { useEffect, useState } from "react";

type AlertItem = {
  id: number;
  symbol: string;
  condition: "ABOVE" | "BELOW";
  targetPrice: number;
  triggered: boolean;
};

const symbols = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "AAPL",
  "TSLA",
  "NVDA",
  "MSFT",
  "AMD",
];

export default function PriceAlerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [condition, setCondition] = useState<"ABOVE" | "BELOW">("ABOVE");
  const [targetPrice, setTargetPrice] = useState("");

  useEffect(() => {
    loadAlerts();
    checkAlerts();

    const interval = setInterval(() => {
      loadAlerts();
      checkAlerts();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  async function loadAlerts() {
    const res = await fetch("/api/alerts", { cache: "no-store" });
    const data = await res.json();
    setAlerts(data);
  }

  async function addAlert() {
    if (!targetPrice) {
      alert("Please enter target price");
      return;
    }

    const res = await fetch("/api/alerts/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symbol,
        condition,
        targetPrice: Number(targetPrice),
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Price alert added!");
      setTargetPrice("");
      loadAlerts();
    }
  }

  async function checkAlerts() {
    const res = await fetch("/api/alerts/check", {
      cache: "no-store",
    });

    const data = await res.json();

    if (data.triggeredAlerts?.length > 0) {
      data.triggeredAlerts.forEach((item: any) => {
        alert(
          `🚨 Price Alert Triggered!\n${item.symbol} ${item.condition} $${item.targetPrice}\nCurrent: $${item.currentPrice}`
        );
      });

      loadAlerts();
    }
  }

  return (
    <div className="bg-[var(--card)] mt-8 p-5 rounded-2xl border border-[var(--border)]">
      <h2 className="text-xl font-bold mb-4">Create Price Alert</h2>

      <div className="grid md:grid-cols-4 gap-3 mb-6">
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="bg-[var(--input)] p-3 rounded-lg"
        >
          {symbols.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value as "ABOVE" | "BELOW")}
          className="bg-[var(--input)] p-3 rounded-lg"
        >
          <option value="ABOVE">Above</option>
          <option value="BELOW">Below</option>
        </select>

        <input
          type="number"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          placeholder="Target Price"
          className="bg-[var(--input)] p-3 rounded-lg"
        />

        <button
          onClick={addAlert}
          className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-lg text-white font-bold"
        >
          Add Alert
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Your Alerts</h2>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <p className="text-[var(--muted)]">No alerts yet</p>
        ) : (
          alerts.map((item) => (
            <div
              key={item.id}
              className="bg-[var(--input)] p-4 rounded-xl border border-[var(--border)] flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{item.symbol}</p>
                <p className="text-sm text-[var(--muted)]">
                  {item.condition} ${item.targetPrice.toLocaleString()}
                </p>
              </div>

              <span
                className={
                  item.triggered
                    ? "text-green-400 font-bold"
                    : "text-yellow-400 font-bold"
                }
              >
                {item.triggered ? "Triggered" : "Waiting"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}