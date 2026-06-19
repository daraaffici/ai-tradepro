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
    return Number(((closePrice - entry) * lotSize).toFixed(2));
  }

  if (type === "SELL") {
    return Number(((entry - closePrice) * lotSize).toFixed(2));
  }

  return 0;
}

export async function GET() {
  const openTrades = await prisma.trade.findMany({
    where: { status: "Open" },
  });

  let updated = 0;
  let skipped = 0;
  const closedTrades = [];

  for (const trade of openTrades) {
    if (trade.type !== "BUY" && trade.type !== "SELL") {
      skipped++;
      continue;
    }

    const currentPrice = await getPrice(trade.symbol);

    if (!currentPrice || currentPrice <= 0) {
      skipped++;
      continue;
    }

    let newStatus: "Win" | "Loss" | null = null;

    if (trade.type === "BUY") {
      if (currentPrice >= trade.takeProfit) {
        newStatus = "Win";
      } else if (currentPrice <= trade.stopLoss) {
        newStatus = "Loss";
      }
    }

    if (trade.type === "SELL") {
      if (currentPrice <= trade.takeProfit) {
        newStatus = "Win";
      } else if (currentPrice >= trade.stopLoss) {
        newStatus = "Loss";
      }
    }

    if (!newStatus) continue;

    const profit = calculateProfit(
      trade.type,
      trade.entry,
      currentPrice,
      trade.lotSize
    );

    await prisma.trade.update({
      where: { id: trade.id },
      data: {
        status: newStatus,
        closePrice: currentPrice,
        profit,
      },
    });

    updated++;

    closedTrades.push({
      id: trade.id,
      symbol: trade.symbol,
      type: trade.type,
      status: newStatus,
      entry: trade.entry,
      closePrice: currentPrice,
      profit,
    });
  }

  return NextResponse.json({
    success: true,
    checked: openTrades.length,
    updated,
    skipped,
    closedTrades,
  });
}