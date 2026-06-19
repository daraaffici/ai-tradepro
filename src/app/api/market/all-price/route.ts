import { NextResponse } from "next/server";

const forexMap: Record<string, string> = {
  EURUSD: "EUR/USD",
  GBPUSD: "GBP/USD",
  USDJPY: "USD/JPY",
  AUDUSD: "AUD/USD",
  USDCAD: "USD/CAD",
  USDCHF: "USD/CHF",
  NZDUSD: "NZD/USD",
  EURJPY: "EUR/JPY",
  GBPJPY: "GBP/JPY",
  EURGBP: "EUR/GBP",
};

const goldMap: Record<string, string> = {
  XAUUSD: "XAU/USD",
  XAGUSD: "XAG/USD",
};

const stockSymbols = ["AAPL", "TSLA", "NVDA", "MSFT", "GOOGL", "AMZN", "META", "AMD"];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const symbol = url.searchParams.get("symbol") || "BTCUSDT";
  const baseUrl = `${url.protocol}//${url.host}`;
  const apiKey = process.env.TWELVE_DATA_API_KEY;

  try {
    if (["BTCUSDT", "ETHUSDT", "SOLUSDT"].includes(symbol)) {
      const res = await fetch(`${baseUrl}/api/market/price?symbol=${symbol}`, {
        cache: "no-store",
      });

      const data = await res.json();

      return NextResponse.json({
        symbol,
        price: Number(data.price || 0),
        change: Number(data.change || 0),
      });
    }

    if (!apiKey) {
      return NextResponse.json({
        symbol,
        price: 0,
        change: 0,
        error: "Missing TWELVE_DATA_API_KEY",
      });
    }

    const tdSymbol =
      forexMap[symbol] ||
      goldMap[symbol] ||
      (stockSymbols.includes(symbol) ? symbol : "");

    if (!tdSymbol) {
      return NextResponse.json(
        { error: "Symbol not supported", symbol },
        { status: 400 }
      );
    }

    const res = await fetch(
      `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(
        tdSymbol
      )}&apikey=${apiKey}`,
      { cache: "no-store" }
    );

    const data = await res.json();

    if (data.status === "error") {
      return NextResponse.json({
        symbol,
        price: 0,
        change: 0,
        error: data.message || "Twelve Data error",
        raw: data,
      });
    }

    return NextResponse.json({
      symbol,
      price: Number(data.close || data.price || 0),
      change: Number(data.percent_change || 0),
      raw: data,
    });
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