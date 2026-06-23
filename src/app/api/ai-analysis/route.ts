import { NextResponse } from "next/server";

function roundPrice(value: number) {
  if (value >= 1000) return Number(value.toFixed(2));
  if (value >= 1) return Number(value.toFixed(4));
  return Number(value.toFixed(6));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const { searchParams } = url;
  const symbol = searchParams.get("symbol") || "BTCUSDT";

  const baseUrl = `${url.protocol}//${url.host}`;

  try {
    const res = await fetch(
      `${baseUrl}/api/market/all-price?symbol=${symbol}`,
      { cache: "no-store" }
    );

    const market = await res.json();

    const price = Number(market.price || 0);
    const change = Number(market.change || 0);

    if (!price) {
      return NextResponse.json(
        {
          error: "No market price",
          message: `No valid price found for ${symbol}`,
        },
        { status: 500 }
      );
    }

    let trend = "Sideways";
    let recommendation: "BUY" | "SELL" | "HOLD" = "HOLD";
    let confidence = 60;
    let risk = "Medium";

    if (change >= 3) {
      trend = "Strong Bullish";
      recommendation = "BUY";
      confidence = 88;
      risk = "Medium";
    } else if (change >= 1) {
      trend = "Bullish";
      recommendation = "BUY";
      confidence = 76;
      risk = "Medium";
    } else if (change <= -3) {
      trend = "Strong Bearish";
      recommendation = "SELL";
      confidence = 88;
      risk = "High";
    } else if (change <= -1) {
      trend = "Bearish";
      recommendation = "SELL";
      confidence = 76;
      risk = "Medium";
    }

    const entry = roundPrice(price);

    const support = roundPrice(price * 0.98);
    const resistance = roundPrice(price * 1.03);

    const riskDistance =
      recommendation === "HOLD"
        ? price * 0.01
        : Math.abs(price - (recommendation === "BUY" ? support : price * 1.02));

    let stopLoss = 0;
    let tp1 = 0;
    let tp2 = 0;
    let tp3 = 0;

    if (recommendation === "BUY") {
      stopLoss = roundPrice(price - riskDistance);
      tp1 = roundPrice(price + riskDistance);
      tp2 = roundPrice(price + riskDistance * 2);
      tp3 = roundPrice(price + riskDistance * 3);
    } else if (recommendation === "SELL") {
      stopLoss = roundPrice(price + riskDistance);
      tp1 = roundPrice(price - riskDistance);
      tp2 = roundPrice(price - riskDistance * 2);
      tp3 = roundPrice(price - riskDistance * 3);
    } else {
      stopLoss = roundPrice(price * 0.99);
      tp1 = roundPrice(price * 1.01);
      tp2 = roundPrice(price * 1.02);
      tp3 = roundPrice(price * 1.03);
    }

    const takeProfit = tp3;

    const riskReward =
      recommendation === "BUY"
        ? Number(((tp3 - entry) / (entry - stopLoss || 1)).toFixed(2))
        : recommendation === "SELL"
        ? Number(((entry - tp3) / (stopLoss - entry || 1)).toFixed(2))
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
      tp1,
      tp2,
      tp3,
      takeProfit,
      stopLoss,
      riskReward,
      summary: `${symbol} is showing a ${trend} market structure. AI recommends ${recommendation} with ${confidence}% confidence. Entry is near ${entry}, TP1 ${tp1}, TP2 ${tp2}, TP3 ${tp3}, and SL ${stopLoss}.`,
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