import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const trade = await prisma.trade.create({
      data: {
        symbol: body.symbol,
        type: body.type,
        entry: Number(body.entry),
        takeProfit: Number(body.takeProfit),
        stopLoss: Number(body.stopLoss),
        lotSize: Number(body.lotSize || 1),
        userId: Number(body.userId),
      },
    });

    return NextResponse.json({
      success: true,
      trade,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to add trade",
      },
      { status: 500 }
    );
  }
}