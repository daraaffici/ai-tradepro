"use client";

import { useMemo, useState } from "react";

export default function RiskManager() {
  const [balance, setBalance] = useState("10000");
  const [riskPercent, setRiskPercent] = useState("2");
  const [entry, setEntry] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");

  const result = useMemo(() => {
    const bal = Number(balance);
    const risk = Number(riskPercent);
    const en = Number(entry);
    const sl = Number(stopLoss);
    const tp = Number(takeProfit);

    const riskAmount = bal * (risk / 100);
    const priceRisk = Math.abs(en - sl);
    const positionSize = priceRisk > 0 ? riskAmount / priceRisk : 0;
    const reward = Math.abs(tp - en);
    const riskReward = priceRisk > 0 ? reward / priceRisk : 0;

    return {
      riskAmount,
      priceRisk,
      positionSize,
      riskReward,
      maxLoss: riskAmount,
    };
  }, [balance, riskPercent, entry, stopLoss, takeProfit]);

  return (
    <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
      <h2 className="text-xl font-bold mb-4">Position Risk Calculator</h2>

      <div className="grid md:grid-cols-5 gap-3 mb-6">
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

        <input
          type="number"
          value={takeProfit}
          onChange={(e) => setTakeProfit(e.target.value)}
          placeholder="Take Profit"
          className="bg-[var(--input)] p-3 rounded-lg"
        />
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-[var(--input)] p-4 rounded-xl">
          <p className="text-[var(--muted)] text-sm">Max Risk</p>
          <p className="text-2xl font-bold text-red-400">
            ${result.maxLoss.toFixed(2)}
          </p>
        </div>

        <div className="bg-[var(--input)] p-4 rounded-xl">
          <p className="text-[var(--muted)] text-sm">Price Risk</p>
          <p className="text-2xl font-bold">
            ${result.priceRisk.toFixed(2)}
          </p>
        </div>

        <div className="bg-[var(--input)] p-4 rounded-xl">
          <p className="text-[var(--muted)] text-sm">Recommended Size</p>
          <p className="text-2xl font-bold text-green-400">
            {result.positionSize.toFixed(4)}
          </p>
        </div>

        <div className="bg-[var(--input)] p-4 rounded-xl">
          <p className="text-[var(--muted)] text-sm">Risk / Reward</p>
          <p className="text-2xl font-bold text-yellow-400">
            1 : {result.riskReward.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}