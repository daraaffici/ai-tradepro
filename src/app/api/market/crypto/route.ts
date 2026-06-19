import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT"
    );

    const data = await res.json();

    return NextResponse.json({
      symbol: data.symbol,
      price: data.lastPrice,
      change: data.priceChangePercent,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}