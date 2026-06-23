import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const symbol = String(body.symbol || "").toUpperCase();
    const type = String(body.type || "");
    const entry = Number(body.entry);
    const takeProfit = Number(body.takeProfit);
    const stopLoss = Number(body.stopLoss);
    const lotSize = Number(body.lotSize || 1);
    const userId = Number(body.userId);

    if (!symbol || !type || !entry || !takeProfit || !stopLoss || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing trade data",
        },
        { status: 400 }
      );
    }

    if (type !== "BUY" && type !== "SELL") {
      return NextResponse.json(
        {
          success: false,
          error: "Only BUY or SELL signals can be added",
        },
        { status: 400 }
      );
    }

    const trade = await prisma.trade.create({
      data: {
        symbol,
        type,
        entry,
        takeProfit,
        stopLoss,
        lotSize,
        status: "Open",
        userId,
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
        error: error.message || "Failed to add AI trade",
      },
      { status: 500 }
    );
  }
}