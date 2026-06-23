import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET() {
  try {
    const trades = await prisma.trade.findMany();

    const totalTrades = trades.length;

    const openTrades = trades.filter(
      (t) => t.status === "Open"
    ).length;

    const wins = trades.filter(
      (t) => t.status === "Win"
    );

    const losses = trades.filter(
      (t) => t.status === "Loss"
    );

    const totalProfit = trades.reduce(
      (sum, trade) => sum + (trade.profit || 0),
      0
    );

    const winRate =
      totalTrades > 0
        ? ((wins.length / totalTrades) * 100).toFixed(2)
        : "0";

    const bestTrade = [...trades].sort(
      (a, b) => (b.profit || 0) - (a.profit || 0)
    )[0];

    const worstTrade = [...trades].sort(
      (a, b) => (a.profit || 0) - (b.profit || 0)
    )[0];

    const message =
      `📊 <b>AI TradePro Daily Report</b>\n\n` +
      `📅 ${new Date().toLocaleDateString("en-GB")}\n\n` +
      `📈 Total Trades: ${totalTrades}\n` +
      `📂 Open Trades: ${openTrades}\n` +
      `🏆 Wins: ${wins.length}\n` +
      `❌ Losses: ${losses.length}\n\n` +
      `🎯 Win Rate: ${winRate}%\n\n` +
      `💰 Total Profit: $${totalProfit.toFixed(2)}\n\n` +
      `🥇 Best Trade:\n` +
      `${bestTrade?.symbol || "-"} ($${(bestTrade?.profit || 0).toFixed(2)})\n\n` +
      `📉 Worst Trade:\n` +
      `${worstTrade?.symbol || "-"} ($${(worstTrade?.profit || 0).toFixed(2)})`;

    await sendTelegramMessage(message);

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}