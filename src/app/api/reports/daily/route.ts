import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";

function checkCronSecret(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");

  return secret === process.env.CRON_SECRET;
}

export async function GET(req: Request) {
  try {
    if (!checkCronSecret(req)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const trades = await prisma.trade.findMany();

    const totalTrades = trades.length;
    const openTrades = trades.filter((t) => t.status === "Open").length;
    const wins = trades.filter((t) => t.status === "Win");
    const losses = trades.filter((t) => t.status === "Loss");

    const totalProfit = trades.reduce(
      (sum, trade) => sum + (trade.profit || 0),
      0
    );

    const closedTrades = wins.length + losses.length;

    const winRate =
      closedTrades > 0
        ? ((wins.length / closedTrades) * 100).toFixed(2)
        : "0.00";

    const bestTrade = [...trades].sort(
      (a, b) => (b.profit || 0) - (a.profit || 0)
    )[0];

    const worstTrade = [...trades].sort(
      (a, b) => (a.profit || 0) - (b.profit || 0)
    )[0];

    const message =
      `📊 <b>AI TradePro Daily Report</b>\n\n` +
      `📅 ${new Date().toLocaleDateString("en-GB")}\n\n` +
      `📈 <b>Total Trades:</b> ${totalTrades}\n` +
      `📂 <b>Open Trades:</b> ${openTrades}\n` +
      `🏆 <b>Wins:</b> ${wins.length}\n` +
      `❌ <b>Losses:</b> ${losses.length}\n\n` +
      `🎯 <b>Win Rate:</b> ${winRate}%\n\n` +
      `💰 <b>Total Profit:</b> $${totalProfit.toFixed(2)}\n\n` +
      `🥇 <b>Best Trade:</b>\n` +
      `${bestTrade?.symbol || "-"} ($${(bestTrade?.profit || 0).toFixed(2)})\n\n` +
      `📉 <b>Worst Trade:</b>\n` +
      `${worstTrade?.symbol || "-"} ($${(worstTrade?.profit || 0).toFixed(2)})`;

    await sendTelegramMessage(message);

    return NextResponse.json({
      success: true,
      totalTrades,
      openTrades,
      wins: wins.length,
      losses: losses.length,
      winRate,
      totalProfit,
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