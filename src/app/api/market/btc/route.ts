import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://data-api.binance.vision/api/v3/ticker/24hr?symbol=BTCUSDT",
      { cache: "no-store" }
    );

    const data = await res.json();

    return NextResponse.json({
      symbol: data.symbol,
      price: Number(data.lastPrice),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch BTC price",
        message: error.message,
      },
      { status: 500 }
    );
  }
}