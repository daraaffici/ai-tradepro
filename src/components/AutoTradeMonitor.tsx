"use client";

import { useEffect } from "react";

export default function AutoTradeMonitor() {
  useEffect(() => {
    async function monitorTrades() {
      await fetch("/api/trades/monitor");
    }

    monitorTrades();

    const interval = setInterval(() => {
      monitorTrades();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return null;
}