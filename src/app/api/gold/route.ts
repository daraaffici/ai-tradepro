import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.TWELVE_DATA_API_KEY;

    const res = await fetch(
      `https://api.twelvedata.com/price?symbol=XAU/USD&apikey=${apiKey}`,
      { cache: "no-store" }
    );

    const data = await res.json();

    return NextResponse.json({
      symbol: "XAUUSD",
      price: Number(data.price),
      change: 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch gold data" },
      { status: 500 }
    );
  }
}