import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const symbol =
      searchParams.get("symbol") || "BTCUSDT";

    const res = await fetch(
      `https://data-api.binance.vision/api/v3/ticker/24hr?symbol=${symbol}`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    return NextResponse.json({
      symbol: data.symbol,
      price: Number(data.lastPrice),
      change: Number(data.priceChangePercent),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch market data",
        message: error.message,
      },
      { status: 500 }
    );
  }
}