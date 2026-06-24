import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";
import { formatCambodiaDateTime } from "@/lib/cambodiaTime";

async function getPrice(baseUrl: string, symbol: string) {
  const res = await fetch(`${baseUrl}/api/market/all-price?symbol=${symbol}`, {
    cache: "no-store",
  });

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

function formatMoney(value: number) {
  return Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;

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

      const currentPrice = await getPrice(baseUrl, trade.symbol);

      if (!currentPrice || currentPrice <= 0) {
        skipped++;
        continue;
      }

      let hitType: "TP" | "SL" | null = null;

      if (trade.type === "BUY") {
        if (currentPrice >= trade.takeProfit) hitType = "TP";
        if (currentPrice <= trade.stopLoss) hitType = "SL";
      }

      if (trade.type === "SELL") {
        if (currentPrice <= trade.takeProfit) hitType = "TP";
        if (currentPrice >= trade.stopLoss) hitType = "SL";
      }

      if (!hitType) continue;

      const profit = calculateProfit(
        trade.type,
        trade.entry,
        currentPrice,
        trade.lotSize
      );

      const newStatus: "Win" | "Loss" = profit >= 0 ? "Win" : "Loss";

      await prisma.trade.update({
        where: { id: trade.id },
        data: {
          status: newStatus,
          closePrice: currentPrice,
          profit,
        },
      });

      updated++;

      const closedTrade = {
        id: trade.id,
        symbol: trade.symbol,
        type: trade.type,
        status: newStatus,
        hitType,
        entry: trade.entry,
        takeProfit: trade.takeProfit,
        stopLoss: trade.stopLoss,
        closePrice: currentPrice,
        lotSize: trade.lotSize,
        profit,
      };

      closedTrades.push(closedTrade);

      await sendTelegramMessage(
        `${hitType === "TP" ? "🎯 <b>TAKE PROFIT HIT</b>" : "🛑 <b>STOP LOSS HIT</b>"}\n\n` +
          `<b>Symbol:</b> ${trade.symbol}\n` +
          `<b>Type:</b> ${trade.type}\n` +
          `<b>Status:</b> ${newStatus}\n\n` +
          `<b>Entry:</b> $${formatMoney(trade.entry)}\n` +
          `<b>Close:</b> $${formatMoney(currentPrice)}\n` +
          `<b>TP:</b> $${formatMoney(trade.takeProfit)}\n` +
          `<b>SL:</b> $${formatMoney(trade.stopLoss)}\n` +
          `<b>Lot:</b> ${trade.lotSize}\n\n` +
          `<b>Profit:</b> ${profit >= 0 ? "+" : "-"}$${formatMoney(
            Math.abs(profit)
          )}\n` +
          `<b>Closed:</b> ${formatCambodiaDateTime(new Date())}`
      );
    }

    return NextResponse.json({
      success: true,
      checked: openTrades.length,
      updated,
      skipped,
      closedTrades,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Trade monitor failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}