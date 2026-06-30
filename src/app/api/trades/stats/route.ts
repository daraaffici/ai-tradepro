import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCambodiaPeriodFilter } from "@/lib/cambodiaTime";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const period = url.searchParams.get("period") || "all";
    const userId = Number(url.searchParams.get("userId"));

    if (!userId) {
      return NextResponse.json({
        success: true,
        period,
        totalTrades: 0,
        openTrades: 0,
        closedTrades: 0,
        buyTrades: 0,
        sellTrades: 0,
        winTrades: 0,
        lossTrades: 0,
        totalProfit: 0,
        totalLoss: 0,
        netProfit: 0,
        winRate: 0,
        bestTrade: null,
        worstTrade: null,
      });
    }

    const dateFilter = getCambodiaPeriodFilter(period);

    const where: any = {
      userId,
    };

    if (dateFilter) {
      where.createdAt = dateFilter;
    }

    const trades = await prisma.trade.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const totalTrades = trades.length;
    const openTrades = trades.filter((t) => t.status === "Open");
    const closedTrades = trades.filter((t) => t.status !== "Open");

    const buyTrades = trades.filter((t) => t.type === "BUY");
    const sellTrades = trades.filter((t) => t.type === "SELL");

    const winTrades = closedTrades.filter((t) => t.status === "Win");
    const lossTrades = closedTrades.filter((t) => t.status === "Loss");

    const totalProfit = winTrades.reduce(
      (sum, t) => sum + Number(t.profit || 0),
      0
    );

    const totalLoss = lossTrades.reduce(
      (sum, t) => sum + Math.abs(Number(t.profit || 0)),
      0
    );

    const netProfit = closedTrades.reduce(
      (sum, t) => sum + Number(t.profit || 0),
      0
    );

    const winRate =
      closedTrades.length > 0
        ? Number(((winTrades.length / closedTrades.length) * 100).toFixed(1))
        : 0;

    const bestTrade = [...closedTrades].sort(
      (a, b) => Number(b.profit || 0) - Number(a.profit || 0)
    )[0];

    const worstTrade = [...closedTrades].sort(
      (a, b) => Number(a.profit || 0) - Number(b.profit || 0)
    )[0];

    return NextResponse.json({
      success: true,
      period,
      totalTrades,
      openTrades: openTrades.length,
      closedTrades: closedTrades.length,
      buyTrades: buyTrades.length,
      sellTrades: sellTrades.length,
      winTrades: winTrades.length,
      lossTrades: lossTrades.length,
      totalProfit,
      totalLoss,
      netProfit,
      winRate,
      bestTrade: bestTrade
        ? {
            symbol: bestTrade.symbol,
            type: bestTrade.type,
            profit: Number(bestTrade.profit || 0),
            createdAt: bestTrade.createdAt,
          }
        : null,
      worstTrade: worstTrade
        ? {
            symbol: worstTrade.symbol,
            type: worstTrade.type,
            profit: Number(worstTrade.profit || 0),
            createdAt: worstTrade.createdAt,
          }
        : null,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to load trade stats",
      },
      { status: 500 }
    );
  }
}