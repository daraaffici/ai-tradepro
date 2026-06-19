"use client";

import { useState } from "react";

export default function PositionSizeCalculator() {
  const [balance, setBalance] = useState("1000");
  const [riskPercent, setRiskPercent] = useState("2");
  const [entry, setEntry] = useState("");
  const [stopLoss, setStopLoss] = useState("");

  const riskAmount =
    Number(balance) > 0 && Number(riskPercent) > 0
      ? (Number(balance) * Number(riskPercent)) / 100
      : 0;

  const stopDistance =
    Number(entry) > 0 && Number(stopLoss) > 0
      ? Math.abs(Number(entry) - Number(stopLoss))
      : 0;

  const recommendedLot =
    stopDistance > 0 ? riskAmount / stopDistance : 0;

  return (
    <div className="bg-[var(--card)] mt-8 p-5 rounded-2xl border border-[var(--border)]">
      <h2 className="text-xl font-bold mb-4">
        Position Size Calculator
      </h2>

      <div className="grid md:grid-cols-4 gap-4">
        <input
          type="number"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          placeholder="Account Balance"
          className="bg-[var(--input)] p-3 rounded-lg"
        />

        <input
          type="number"
          value={riskPercent}
          onChange={(e) => setRiskPercent(e.target.value)}
          placeholder="Risk %"
          className="bg-[var(--input)] p-3 rounded-lg"
        />

        <input
          type="number"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Entry Price"
          className="bg-[var(--input)] p-3 rounded-lg"
        />

        <input
          type="number"
          value={stopLoss}
          onChange={(e) => setStopLoss(e.target.value)}
          placeholder="Stop Loss"
          className="bg-[var(--input)] p-3 rounded-lg"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="bg-[var(--input)] p-4 rounded-xl">
          <p className="text-[var(--muted)] text-sm">Risk Amount</p>
          <h3 className="text-2xl font-bold text-red-400">
            ${riskAmount.toFixed(2)}
          </h3>
        </div>

        <div className="bg-[var(--input)] p-4 rounded-xl">
          <p className="text-[var(--muted)] text-sm">SL Distance</p>
          <h3 className="text-2xl font-bold">
            {stopDistance.toFixed(2)}
          </h3>
        </div>

        <div className="bg-[var(--input)] p-4 rounded-xl">
          <p className="text-[var(--muted)] text-sm">Recommended Lot</p>
          <h3 className="text-2xl font-bold text-green-400">
            {recommendedLot.toFixed(4)}
          </h3>
        </div>
      </div>
    </div>
  );
}