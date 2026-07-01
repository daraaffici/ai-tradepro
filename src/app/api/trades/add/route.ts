import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ORDER_TYPES = [
  "BUY",
  "SELL",
  "BUY LIMIT",
  "SELL LIMIT",
  "BUY STOP",
  "SELL STOP",
];

function isPendingOrder(type: string) {
  return (
    type === "BUY LIMIT" ||
    type === "SELL LIMIT" ||
    type === "BUY STOP" ||
    type === "SELL STOP"
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const symbol = String(body.symbol || "").trim().toUpperCase();
    const type = String(body.type || "").trim().toUpperCase();
    const entry = Number(body.entry);
    const takeProfit = Number(body.takeProfit);
    const stopLoss = Number(body.stopLoss);
    const lotSize = Number(body.lotSize || 1);
    const userId = Number(body.userId);

    if (!userId || !symbol || !ORDER_TYPES.includes(type)) {
      return NextResponse.json(
        { success: false, error: "Invalid order information" },
        { status: 400 }
      );
    }

    if (!entry || !takeProfit || !stopLoss || !lotSize) {
      return NextResponse.json(
        { success: false, error: "Entry, TP, SL, and Lot Size are required" },
        { status: 400 }
      );
    }

    const pending = isPendingOrder(type);

    const trade = await prisma.trade.create({
      data: {
        symbol,
        type,
        entry,
        takeProfit,
        stopLoss,
        lotSize,
        userId,
        status: pending ? "Pending" : "Open",
        activatedAt: pending ? null : new Date(),
        orderNote: pending
          ? `${type} waiting for entry price ${entry}`
          : `${type} market order opened`,
      },
    });

    return NextResponse.json({
      success: true,
      trade,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to add trade",
      },
      { status: 500 }
    );
  }
}