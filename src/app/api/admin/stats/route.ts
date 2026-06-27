import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function startOfCambodiaDay() {
  const now = new Date();
  const cambodiaDate = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" })
  );

  cambodiaDate.setHours(0, 0, 0, 0);

  return new Date(cambodiaDate.getTime() - 7 * 60 * 60 * 1000);
}

export async function GET() {
  try {
    const todayStart = startOfCambodiaDay();

    const users = await prisma.user.findMany();
    const trades = await prisma.trade.findMany();
    const todayUsers = users.filter((u) => new Date(u.createdAt) >= todayStart);
    const todayTrades = trades.filter(
      (t) => new Date(t.createdAt) >= todayStart
    );

    const openTrades = trades.filter((t) => t.status === "Open");
    const closedTrades = trades.filter((t) => t.status !== "Open");
    const wins = closedTrades.filter((t) => t.status === "Win");
    const losses = closedTrades.filter((t) => t.status === "Loss");

    const totalProfit = closedTrades.reduce(
      (sum, trade) => sum + Number(trade.profit || 0),
      0
    );

    const todayProfit = todayTrades
      .filter((t) => t.status !== "Open")
      .reduce((sum, trade) => sum + Number(trade.profit || 0), 0);

    const winRate =
      closedTrades.length > 0
        ? Number(((wins.length / closedTrades.length) * 100).toFixed(2))
        : 0;

    const recentLogs = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      totalUsers: users.length,
      totalTrades: trades.length,
      openTrades: openTrades.length,
      closedTrades: closedTrades.length,
      wins: wins.length,
      losses: losses.length,
      totalProfit,
      winRate,

      todayUsers: todayUsers.length,
      todayTrades: todayTrades.length,
      todayProfit,

      recentLogs,

      databaseStatus: "Online",
      serverStatus: "Online",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to load admin stats",
      },
      { status: 500 }
    );
  }
}