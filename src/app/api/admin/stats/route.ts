import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    const trades = await prisma.trade.findMany();

    const totalUsers = users.length;
    const totalTrades = trades.length;

    const openTrades = trades.filter(
      (trade) => trade.status === "Open"
    );

    const closedTrades = trades.filter(
      (trade) => trade.status !== "Open"
    );

    const wins = closedTrades.filter(
      (trade) => trade.status === "Win"
    );

    const losses = closedTrades.filter(
      (trade) => trade.status === "Loss"
    );

    const totalProfit = closedTrades.reduce(
      (sum, trade) => sum + Number(trade.profit || 0),
      0
    );

    const winRate =
      closedTrades.length > 0
        ? Number(((wins.length / closedTrades.length) * 100).toFixed(2))
        : 0;

    return NextResponse.json({
      success: true,
      totalUsers,
      totalTrades,
      openTrades: openTrades.length,
      closedTrades: closedTrades.length,
      wins: wins.length,
      losses: losses.length,
      totalProfit,
      winRate,
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