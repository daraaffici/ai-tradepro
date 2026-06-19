"use client";

import { useState } from "react";

export default function AIAnalysis() {
  const [result, setResult] = useState("");

  async function analyze() {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symbol: "BTCUSDT",
      }),
    });

    const data = await res.json();

    setResult(data.analysis);
  }

  return (
    <div className="bg-[var(--input)] rounded-xl p-5 border border-[var(--border)] mt-8">
      <button
        onClick={analyze}
        className="bg-blue-600 px-4 py-2 rounded-lg"
      >
        Analyze BTC
      </button>

      <div className="mt-4 whitespace-pre-wrap">
        {result}
      </div>
    </div>
  );
}