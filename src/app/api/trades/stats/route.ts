import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const trades = await prisma.trade.findMany();

  const validTrades = trades.filter(
    (t) => t.type === "BUY" || t.type === "SELL"
  );

  const closedTrades = validTrades.filter(
    (t) => t.status === "Win" || t.status === "Loss"
  );

  const openTrades = validTrades.filter(
    (t) => t.status === "Open"
  );

  const winTrades = closedTrades.filter(
    (t) => t.status === "Win"
  );

  const lossTrades = closedTrades.filter(
    (t) => t.status === "Loss"
  );

  const buyTrades = validTrades.filter(
    (t) => t.type === "BUY"
  );

  const sellTrades = validTrades.filter(
    (t) => t.type === "SELL"
  );

  const totalProfit = closedTrades
    .filter((t) => (t.profit || 0) > 0)
    .reduce((sum, t) => sum + (t.profit || 0), 0);

  const totalLoss = closedTrades
    .filter((t) => (t.profit || 0) < 0)
    .reduce((sum, t) => sum + (t.profit || 0), 0);

  const netProfit = totalProfit + totalLoss;

  const winRate =
    closedTrades.length > 0
      ? (winTrades.length / closedTrades.length) * 100
      : 0;

  const bestTrade =
    closedTrades.length > 0
      ? closedTrades.reduce((best, trade) =>
          (trade.profit || 0) > (best.profit || 0) ? trade : best
        )
      : null;

  const worstTrade =
    closedTrades.length > 0
      ? closedTrades.reduce((worst, trade) =>
          (trade.profit || 0) < (worst.profit || 0) ? trade : worst
        )
      : null;

  return NextResponse.json({
    totalTrades: validTrades.length,
    openTrades: openTrades.length,
    closedTrades: closedTrades.length,

    buyTrades: buyTrades.length,
    sellTrades: sellTrades.length,
    holdTrades: 0,

    winTrades: winTrades.length,
    lossTrades: lossTrades.length,
    winRate,

    totalProfit,
    totalLoss,
    netProfit,

    bestTrade: bestTrade
      ? {
          symbol: bestTrade.symbol,
          profit: bestTrade.profit || 0,
        }
      : null,

    worstTrade: worstTrade
      ? {
          symbol: worstTrade.symbol,
          profit: worstTrade.profit || 0,
        }
      : null,
  });
}