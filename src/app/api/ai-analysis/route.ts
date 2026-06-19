import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol") || "BTCUSDT";

  try {
    const res = await fetch(
      `http://localhost:3000/api/market/all-price?symbol=${symbol}`,
      { cache: "no-store" }
    );

    const market = await res.json();

    const price = Number(market.price || 0);
    const change = Number(market.change || 0);

    let trend = "Sideways";
    let recommendation = "HOLD";
    let confidence = 60;
    let risk = "Medium";

    if (change >= 3) {
      trend = "Bullish";
      recommendation = "BUY";
      confidence = 85;
      risk = "Low";
    } else if (change >= 1) {
      trend = "Bullish";
      recommendation = "BUY";
      confidence = 75;
      risk = "Medium";
    } else if (change <= -3) {
      trend = "Bearish";
      recommendation = "SELL";
      confidence = 85;
      risk = "High";
    } else if (change <= -1) {
      trend = "Bearish";
      recommendation = "SELL";
      confidence = 75;
      risk = "Medium";
    }

    const support = Number((price * 0.98).toFixed(2));
    const resistance = Number((price * 1.03).toFixed(2));

    const entry = price;

    const takeProfit =
      recommendation === "SELL"
        ? Number((price * 0.97).toFixed(2))
        : resistance;

    const stopLoss =
      recommendation === "SELL"
        ? Number((price * 1.02).toFixed(2))
        : support;

    const riskReward =
      recommendation === "BUY"
        ? Number(((takeProfit - entry) / (entry - stopLoss || 1)).toFixed(2))
        : recommendation === "SELL"
        ? Number(((entry - takeProfit) / (stopLoss - entry || 1)).toFixed(2))
        : 0;

    return NextResponse.json({
      symbol,
      price,
      change,
      trend,
      recommendation,
      confidence,
      risk,
      support,
      resistance,
      entry,
      takeProfit,
      stopLoss,
      riskReward,
      summary: `${symbol} is showing a ${trend} market structure. AI recommends ${recommendation} with ${confidence}% confidence. Entry is near ${entry}, take profit is near ${takeProfit}, and stop loss is near ${stopLoss}.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "AI Analysis failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}