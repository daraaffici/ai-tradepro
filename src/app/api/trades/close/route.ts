import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function getPrice(symbol: string) {
  const res = await fetch(
    `http://localhost:3000/api/market/all-price?symbol=${symbol}`,
    { cache: "no-store" }
  );

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
    return Number(
      ((closePrice - entry) * lotSize).toFixed(2)
    );
  }

  if (type === "SELL") {
    return Number(
      ((entry - closePrice) * lotSize).toFixed(2)
    );
  }

  return 0;
}

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const trade = await prisma.trade.findUnique({
      where: { id: Number(id) },
    });

    if (!trade) {
      return NextResponse.json(
        {
          success: false,
          error: "Trade not found",
        },
        { status: 404 }
      );
    }

    const currentPrice = await getPrice(
      trade.symbol
    );

    const profit = calculateProfit(
      trade.type,
      trade.entry,
      currentPrice,
      trade.lotSize
    );

    await prisma.trade.update({
      where: { id: Number(id) },
      data: {
        status: "Closed",
        closePrice: currentPrice,
        profit,
      },
    });

    return NextResponse.json({
      success: true,
      closePrice: currentPrice,
      profit,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to close position",
      },
      { status: 500 }
    );
  }
}