import { NextResponse } from "next/server";

const cryptoSymbols = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "AVAXUSDT",
  "LINKUSDT",
  "SUIUSDT",
];

const forexMap: Record<string, string> = {
  EURUSD: "OANDA:EUR_USD",
  GBPUSD: "OANDA:GBP_USD",
  USDJPY: "OANDA:USD_JPY",
};

const goldMap: Record<string, string> = {
  XAUUSD: "OANDA:XAU_USD",
  XAGUSD: "OANDA:XAG_USD",
};

const stockSymbols = [
  "AAPL",
  "TSLA",
  "NVDA",
  "MSFT",
  "GOOGL",
  "AMZN",
  "META",
  "AMD",
];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const symbol = (url.searchParams.get("symbol") || "BTCUSDT")
    .trim()
    .toUpperCase();

  const baseUrl = `${url.protocol}//${url.host}`;
  const finnhubKey = process.env.FINNHUB_API_KEY;

  try {
    if (cryptoSymbols.includes(symbol)) {
      const res = await fetch(`${baseUrl}/api/market/price?symbol=${symbol}`, {
        cache: "no-store",
      });

      const data = await res.json();

      return NextResponse.json({
        symbol,
        price: Number(data.price || 0),
        change: Number(data.change || 0),
        source: "Binance",
      });
    }

    const finnhubSymbol =
      forexMap[symbol] ||
      goldMap[symbol] ||
      (stockSymbols.includes(symbol) ? symbol : "");

    if (!finnhubSymbol) {
      return NextResponse.json({
        symbol,
        price: 0,
        change: 0,
        source: "Unsupported",
        message: "Symbol not supported",
      });
    }

    if (!finnhubKey) {
      return NextResponse.json({
        symbol,
        price: 0,
        change: 0,
        source: "Finnhub",
        message: "Missing FINNHUB_API_KEY",
      });
    }

    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(
        finnhubSymbol
      )}&token=${finnhubKey}`,
      { cache: "no-store" }
    );

    const data = await res.json();

    return NextResponse.json({
      symbol,
      price: Number(data.c || 0),
      change: Number(data.dp || 0),
      source: "Finnhub",
    });
  } catch (error: any) {
    return NextResponse.json({
      symbol,
      price: 0,
      change: 0,
      source: "Fallback",
      message: error.message || "Failed to fetch price",
    });
  }
}