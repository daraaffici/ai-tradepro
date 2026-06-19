"use client";

import { useEffect, useState } from "react";

export default function LiveBTCCard() {
  const [price, setPrice] = useState("Loading...");

  useEffect(() => {
    fetch("/api/market")
      .then((res) => res.json())
      .then((data) => {
        setPrice(`$${Number(data.price).toLocaleString()}`);
      });
  }, []);

  return (
    <div className="bg-[var(--input)] p-5 rounded-xl border border-[var(--border)]">
      <h3 className="text-[var(--muted)]">BTC Live Price</h3>

      <p className="text-3xl font-bold mt-2">
        {price}
      </p>
    </div>
  );
}