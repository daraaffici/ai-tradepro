import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.TWELVE_DATA_API_KEY;

    const symbols = ["AAPL", "TSLA", "NVDA"];

    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const res = await fetch(
          `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${apiKey}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        return {
          symbol,
          price: Number(data.price || 0),
          change: 0,
        };
      })
    );

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stocks" },
      { status: 500 }
    );
  }
}