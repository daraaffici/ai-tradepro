import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const { searchParams } = url;
  const symbol = searchParams.get("symbol") || "BTCUSDT";

  const baseUrl = `${url.protocol}//${url.host}`;
  const apiKey = process.env.TWELVE_DATA_API_KEY;

  try {
    if (["BTCUSDT", "ETHUSDT", "SOLUSDT"].includes(symbol)) {
      const res = await fetch(
        `${baseUrl}/api/market/price?symbol=${symbol}`,
        { cache: "no-store" }
      );

      const data = await res.json();

      return NextResponse.json({
        symbol,
        price: Number(data.price || 0),
        change: Number(data.change || 0),
      });
    }

    if (["EURUSD", "GBPUSD", "USDJPY"].includes(symbol)) {
      const res = await fetch(
        `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${apiKey}`,
        { cache: "no-store" }
      );

      const data = await res.json();

      return NextResponse.json({
        symbol,
        price: data.price ? Number(data.price) : 0,
        change: 0,
      });
    }

    if (symbol === "XAUUSD") {
      const res = await fetch(
        `https://api.twelvedata.com/price?symbol=XAU/USD&apikey=${apiKey}`,
        { cache: "no-store" }
      );

      const data = await res.json();

      return NextResponse.json({
        symbol,
        price: data.price ? Number(data.price) : 0,
        change: 0,
      });
    }

    if (["AAPL", "TSLA", "NVDA"].includes(symbol)) {
      const res = await fetch(
        `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${apiKey}`,
        { cache: "no-store" }
      );

      const data = await res.json();

      return NextResponse.json({
        symbol,
        price: data.price ? Number(data.price) : 0,
        change: 0,
      });
    }

    return NextResponse.json(
      { error: "Symbol not supported" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch price",
        message: error.message,
      },
      { status: 500 }
    );
  }
}