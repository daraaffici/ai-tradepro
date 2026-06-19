import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const trades = await prisma.trade.findMany();

  const totalTrades = trades.length;
  const openTrades = trades.filter((t) => t.status === "Open").length;
  const winTrades = trades.filter((t) => t.status === "Win").length;
  const lossTrades = trades.filter((t) => t.status === "Loss").length;

  const buyTrades = trades.filter((t) => t.type === "BUY").length;
  const sellTrades = trades.filter((t) => t.type === "SELL").length;
  const holdTrades = trades.filter((t) => t.type === "HOLD").length;

  const closedTrades = winTrades + lossTrades;
  const winRate = closedTrades > 0 ? (winTrades / closedTrades) * 100 : 0;

  const totalProfit = trades
    .filter((t) => (t.profit || 0) > 0)
    .reduce((sum, t) => sum + (t.profit || 0), 0);

  const totalLoss = trades
    .filter((t) => (t.profit || 0) < 0)
    .reduce((sum, t) => sum + (t.profit || 0), 0);

  const netProfit = totalProfit + totalLoss;

  return NextResponse.json({
    totalTrades,
    openTrades,
    buyTrades,
    sellTrades,
    holdTrades,
    winTrades,
    lossTrades,
    winRate,
    totalProfit,
    totalLoss,
    netProfit,
  });
}