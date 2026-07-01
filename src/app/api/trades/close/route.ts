import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function getPrice(baseUrl: string, symbol: string) {
  const res = await fetch(`${baseUrl}/api/market/all-price?symbol=${symbol}`, {
    cache: "no-store",
  });

  const data = await res.json();
  return Number(data.price || 0);
}

function calculateProfit(
  type: string,
  entry: number,
  closePrice: number,
  lotSize: number
) {
  if (type === "BUY") {
    return Number(((closePrice - entry) * lotSize).toFixed(2));
  }

  if (type === "SELL") {
    return Number(((entry - closePrice) * lotSize).toFixed(2));
  }

  return 0;
}

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    const body = await req.json();

    const id = Number(body.id);
    const userId = Number(body.userId);

    if (!id || !userId) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    const trade = await prisma.trade.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!trade) {
      return NextResponse.json(
        { success: false, error: "Trade not found" },
        { status: 404 }
      );
    }

    if (trade.status !== "Open") {
      return NextResponse.json(
        { success: false, error: "Trade is already closed" },
        { status: 400 }
      );
    }

    const currentPrice = await getPrice(baseUrl, trade.symbol);

    if (!currentPrice || currentPrice <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid market price" },
        { status: 400 }
      );
    }

    const profit = calculateProfit(
      trade.type,
      trade.entry,
      currentPrice,
      trade.lotSize
    );

    const status = profit >= 0 ? "Win" : "Loss";

    const updatedTrade = await prisma.trade.update({
      where: {
        id: trade.id,
      },
      data: {
        status,
        closePrice: currentPrice,
        profit,
      },
    });

    return NextResponse.json({
      success: true,
      trade: updatedTrade,
      closePrice: currentPrice,
      profit,
      status,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to close position",
      },
      { status: 500 }
    );
  }
}