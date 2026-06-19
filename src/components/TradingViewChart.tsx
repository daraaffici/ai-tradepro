"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  symbol?: string;
};

export default function TradingViewChart({
  symbol = "BINANCE:BTCUSDT",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";

    const script = document.createElement("script");

    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

    script.async = true;
    script.type = "text/javascript";

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: "60",
      timezone: "Asia/Bangkok",
      theme: "dark",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
    });

    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [ready, symbol]);

  if (!ready) {
    return (
      <div className="h-[500px] flex items-center justify-center text-[var(--muted)]">
        Loading chart...
      </div>
    );
  }

  return (
    <div className="h-[500px] w-full">
      <div
        ref={containerRef}
        className="tradingview-widget-container h-full w-full"
      />
    </div>
  );
}