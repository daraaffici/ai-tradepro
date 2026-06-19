"use client";

import { useEffect, useState } from "react";

type MarketData = {
  symbol: string;
  price: string;
  change: string;
};

export function useMarket() {
  const [data, setData] = useState<MarketData[]>([]);

  useEffect(() => {
    function loadMarket() {
      fetch("/api/market")
        .then((res) => res.json())
        .then(setData);
    }

    loadMarket();

    const interval = setInterval(loadMarket, 10000);

    return () => clearInterval(interval);
  }, []);

  return data;
}