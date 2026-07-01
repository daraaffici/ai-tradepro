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

function baseType(type: string) {
  if (type.startsWith("BUY")) return "BUY";
  if (type.startsWith("SELL")) return "SELL";
  return type;
}

function isPendingType(type: string) {
  return (
    type === "BUY LIMIT" ||
    type === "SELL LIMIT" ||
    type === "BUY STOP" ||
    type === "SELL STOP"
  );
}

function shouldActivatePending(type: string, entry: number, price: number) {
  if (type === "BUY LIMIT") return price <= entry;
  if (type === "SELL LIMIT") return price >= entry;
  if (type === "BUY STOP") return price >= entry;
  if (type === "SELL STOP") return price <= entry;
  return false;
}

function calculateProfit(type: string, entry: number, closePrice: number, lotSize: number) {
  const side = baseType(type);

  if (side === "BUY") {
    return Number(((closePrice - entry) * lotSize).toFixed(2));
  }

  if (side === "SELL") {
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
    const userId = Number(url.searchParams.get("userId"));

    if (!userId) {
      return NextResponse.json({
        success: true,
        checked: 0,
        activated: 0,
        updated: 0,
        skipped: 0,
        activatedTrades: [],
        closedTrades: [],
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, name: true, email: true },
    });

    const activeTrades = await prisma.trade.findMany({
      where: {
        userId,
        status: {
          in: ["Pending", "Open"],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let activated = 0;
    let updated = 0;
    let skipped = 0;

    const activatedTrades = [];
    const closedTrades = [];

    for (const trade of activeTrades) {
      const currentPrice = await getPrice(baseUrl, trade.symbol);

      if (!currentPrice || currentPrice <= 0) {
        skipped++;
        continue;
      }

      if (trade.status === "Pending") {
        if (!isPendingType(trade.type)) {
          skipped++;
          continue;
        }

        const activate = shouldActivatePending(
          trade.type,
          trade.entry,
          currentPrice
        );

        if (!activate) continue;

        const openedType = baseType(trade.type);

        const openedTrade = await prisma.trade.update({
          where: { id: trade.id },
          data: {
            type: openedType,
            status: "Open",
            activatedAt: new Date(),
            orderNote: `${trade.type} activated at ${currentPrice}`,
          },
        });

        activated++;

        activatedTrades.push({
          id: openedTrade.id,
          symbol: openedTrade.symbol,
          type: openedTrade.type,
          previousType: trade.type,
          entry: openedTrade.entry,
          activatedPrice: currentPrice,
          lotSize: openedTrade.lotSize,
        });

        if (user?.role === "ADMIN") {
          await sendTelegramMessage(
            `✅ <b>ADMIN PENDING ORDER ACTIVATED</b>\n\n` +
              `<b>Admin:</b> ${user.name || user.email}\n\n` +
              `<b>Symbol:</b> ${trade.symbol}\n` +
              `<b>Order:</b> ${trade.type}\n` +
              `<b>Opened As:</b> ${openedType}\n\n` +
              `<b>Entry:</b> $${formatMoney(trade.entry)}\n` +
              `<b>Activated Price:</b> $${formatMoney(currentPrice)}\n` +
              `<b>TP:</b> $${formatMoney(trade.takeProfit)}\n` +
              `<b>SL:</b> $${formatMoney(trade.stopLoss)}\n` +
              `<b>Lot:</b> ${trade.lotSize}\n\n` +
              `<b>Activated:</b> ${formatCambodiaDateTime(new Date())}`
          );
        }

        continue;
      }

      if (trade.status !== "Open") continue;

      const side = baseType(trade.type);

      if (side !== "BUY" && side !== "SELL") {
        skipped++;
        continue;
      }

      let hitType: "TP" | "SL" | null = null;

      if (side === "BUY") {
        if (currentPrice >= trade.takeProfit) hitType = "TP";
        if (currentPrice <= trade.stopLoss) hitType = "SL";
      }

      if (side === "SELL") {
        if (currentPrice <= trade.takeProfit) hitType = "TP";
        if (currentPrice >= trade.stopLoss) hitType = "SL";
      }

      if (!hitType) continue;

      const profit = calculateProfit(
        side,
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
        type: side,
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

      if (user?.role === "ADMIN") {
        await sendTelegramMessage(
          `${hitType === "TP" ? "🎯 <b>ADMIN TAKE PROFIT HIT</b>" : "🛑 <b>ADMIN STOP LOSS HIT</b>"}\n\n` +
            `<b>Admin:</b> ${user.name || user.email}\n\n` +
            `<b>Symbol:</b> ${trade.symbol}\n` +
            `<b>Type:</b> ${side}\n` +
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
    }

    return NextResponse.json({
      success: true,
      checked: activeTrades.length,
      activated,
      updated,
      skipped,
      activatedTrades,
      closedTrades,
      telegramSent: user?.role === "ADMIN" && (activated > 0 || updated > 0),
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