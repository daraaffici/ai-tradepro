import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";
import {
  formatCambodiaDateTime,
  getCambodiaPeriodFilter,
} from "@/lib/cambodiaTime";

function checkCronSecret(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");

  return secret === process.env.CRON_SECRET;
}

function money(value: number) {
  const sign = value >= 0 ? "+" : "-";

  return `${sign}$${Math.abs(value).toFixed(2)}`;
}

export async function GET(req: Request) {
  try {
    if (!checkCronSecret(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const todayFilter = getCambodiaPeriodFilter("today");

    const todayClosedTrades = await prisma.trade.findMany({
      where: {
        status: {
          in: ["Win", "Loss"],
        },
        createdAt: todayFilter || undefined,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const openTrades = await prisma.trade.findMany({
      where: {
        status: "Open",
      },
    });

    const wins = todayClosedTrades.filter((t) => t.status === "Win");
    const losses = todayClosedTrades.filter((t) => t.status === "Loss");

    const totalTrades = todayClosedTrades.length;

    const totalProfit = todayClosedTrades.reduce(
      (sum, trade) => sum + Number(trade.profit || 0),
      0
    );

    const winRate =
      totalTrades > 0
        ? ((wins.length / totalTrades) * 100).toFixed(2)
        : "0.00";

    const bestTrade = [...todayClosedTrades].sort(
      (a, b) => Number(b.profit || 0) - Number(a.profit || 0)
    )[0];

    const worstTrade = [...todayClosedTrades].sort(
      (a, b) => Number(a.profit || 0) - Number(b.profit || 0)
    )[0];

    const message =
      `📊 <b>AI TradePro Daily Report</b>\n\n` +
      `📅 ${formatCambodiaDateTime(new Date())}\n\n` +
      `📈 <b>Closed Trades Today:</b> ${totalTrades}\n` +
      `📂 <b>Open Trades:</b> ${openTrades.length}\n` +
      `🏆 <b>Wins:</b> ${wins.length}\n` +
      `❌ <b>Losses:</b> ${losses.length}\n\n` +
      `🎯 <b>Win Rate:</b> ${winRate}%\n\n` +
      `💰 <b>Today Profit:</b> ${money(totalProfit)}\n\n` +
      `🥇 <b>Best Trade:</b>\n` +
      `${bestTrade ? `${bestTrade.symbol} (${money(Number(bestTrade.profit || 0))})` : "-"}\n\n` +
      `📉 <b>Worst Trade:</b>\n` +
      `${worstTrade ? `${worstTrade.symbol} (${money(Number(worstTrade.profit || 0))})` : "-"}`;

    await sendTelegramMessage(message);

    return NextResponse.json({
      success: true,
      date: formatCambodiaDateTime(new Date()),
      closedTradesToday: totalTrades,
      openTrades: openTrades.length,
      wins: wins.length,
      losses: losses.length,
      winRate,
      todayProfit: totalProfit,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Daily report failed",
      },
      { status: 500 }
    );
  }
}