"use client";

import { useState } from "react";

const marketSymbols = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "XAUUSD",
  "AAPL",
  "TSLA",
  "NVDA",
];

export default function AddPortfolioForm() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  async function addPortfolio() {
    if (!quantity || !buyPrice) {
      alert("Please fill Quantity and Buy Price");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const res = await fetch("/api/portfolio/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symbol,
        quantity: Number(quantity),
        buyPrice: Number(buyPrice),
        userId: user.id,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Portfolio added!");
      setQuantity("");
      setBuyPrice("");
    }
  }

  return (
    <div className="bg-[var(--card)] mt-8 rounded-2xl p-5 border border-[var(--border)]">
      <h2 className="text-xl font-bold mb-4">Add Portfolio</h2>

      <select
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        className="w-full bg-[var(--input)] p-3 rounded-lg mb-3"
      >
        {marketSymbols.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <input
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Quantity"
        className="w-full bg-[var(--input)] p-3 rounded-lg mb-3"
      />

      <input
        value={buyPrice}
        onChange={(e) => setBuyPrice(e.target.value)}
        placeholder="Buy Price"
        className="w-full bg-[var(--input)] p-3 rounded-lg mb-3"
      />

      <button
        onClick={addPortfolio}
        className="w-full bg-purple-600 p-3 rounded-lg font-bold"
      >
        Add Portfolio
      </button>
    </div>
  );
}