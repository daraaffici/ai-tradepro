import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCambodiaPeriodFilter } from "@/lib/cambodiaTime";

function sumProfit(trades: any[]) {
  return trades.reduce((sum, trade) => sum + Number(trade.profit || 0), 0);
}

function getWinRate(trades: any[]) {
  const closed = trades.filter((trade) => trade.status !== "Open");
  const wins = closed.filter((trade) => trade.status === "Win");

  return closed.length > 0
    ? Number(((wins.length / closed.length) * 100).toFixed(2))
    : 0;
}

function countBySymbol(trades: any[]) {
  const map: Record<string, number> = {};

  for (const trade of trades) {
    map[trade.symbol] = (map[trade.symbol] || 0) + 1;
  }

  return Object.entries(map)
    .map(([symbol, count]) => ({ symbol, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function profitBySymbol(trades: any[]) {
  const map: Record<string, number> = {};

  for (const trade of trades) {
    map[trade.symbol] =
      (map[trade.symbol] || 0) + Number(trade.profit || 0);
  }

  return Object.entries(map)
    .map(([symbol, profit]) => ({ symbol, profit }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 10);
}

function activeUsers(trades: any[]) {
  const map: Record<
    string,
    { name: string; email: string; count: number }
  > = {};

  for (const trade of trades) {
    const key = trade.user?.email || "unknown";

    if (!map[key]) {
      map[key] = {
        name: trade.user?.name || "Unknown",
        email: trade.user?.email || "unknown",
        count: 0,
      };
    }

    map[key].count += 1;
  }

  return Object.values(map)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const period = url.searchParams.get("period") || "today";

    const dateFilter = getCambodiaPeriodFilter(period);

    const tradeWhere: any = {};
    const userWhere: any = {};

    if (dateFilter) {
      tradeWhere.createdAt = dateFilter;
      userWhere.createdAt = dateFilter;
    }

    const trades = await prisma.trade.findMany({
      where: tradeWhere,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    const users = await prisma.user.findMany({
      where: userWhere,
      orderBy: { createdAt: "desc" },
    });

    const closedTrades = trades.filter((trade) => trade.status !== "Open");
    const openTrades = trades.filter((trade) => trade.status === "Open");
    const wins = closedTrades.filter((trade) => trade.status === "Win");
    const losses = closedTrades.filter((trade) => trade.status === "Loss");

    return NextResponse.json({
      success: true,
      period,
      totalUsers: users.length,
      totalTrades: trades.length,
      openTrades: openTrades.length,
      closedTrades: closedTrades.length,
      wins: wins.length,
      losses: losses.length,
      winRate: getWinRate(trades),
      totalProfit: sumProfit(closedTrades),
      topSymbols: countBySymbol(trades),
      profitRanking: profitBySymbol(closedTrades),
      mostActiveUsers: activeUsers(trades),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to load admin analytics",
      },
      { status: 500 }
    );
  }
}