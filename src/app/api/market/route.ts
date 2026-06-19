import { NextResponse } from "next/server";

export async function GET() {
  const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];

  const results = await Promise.all(
    symbols.map(async (symbol) => {
      const res = await fetch(
        `https://data-api.binance.vision/api/v3/ticker/24hr?symbol=${symbol}`,
        { cache: "no-store" }
      );

      const data = await res.json();

      return {
        symbol: data.symbol,
        price: data.lastPrice,
        change: data.priceChangePercent,
      };
    })
  );

  return NextResponse.json(results);
}