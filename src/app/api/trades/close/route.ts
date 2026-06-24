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

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    const { id } = await req.json();

    const trade = await prisma.trade.findUnique({
      where: { id: Number(id) },
    });

    if (!trade) {
      return NextResponse.json(
        { success: false, error: "Trade not found" },
        { status: 404 }
      );
    }

    const currentPrice = await getPrice(baseUrl, trade.symbol);

    if (!currentPrice || currentPrice <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid market price" },
        { status: 400 }
      );
    }

    const profit = calculateProfit(
      trade.type,
      trade.entry,
      currentPrice,
      trade.lotSize
    );

    const status = profit >= 0 ? "Win" : "Loss";

    const updatedTrade = await prisma.trade.update({
      where: { id: Number(id) },
      data: {
        status,
        closePrice: currentPrice,
        profit,
      },
    });

    await sendTelegramMessage(
      `🔒 <b>POSITION CLOSED MANUALLY</b>\n\n` +
        `<b>Symbol:</b> ${trade.symbol}\n` +
        `<b>Type:</b> ${trade.type}\n` +
        `<b>Status:</b> ${status}\n\n` +
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

    return NextResponse.json({
      success: true,
      trade: updatedTrade,
      closePrice: currentPrice,
      profit,
      status,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to close position",
      },
      { status: 500 }
    );
  }
}