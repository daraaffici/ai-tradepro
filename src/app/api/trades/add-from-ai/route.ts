import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await prisma.trade.create({
      data: {
        symbol: body.symbol,
        type: body.recommendation,
        entry: body.price,
        takeProfit: body.resistance,
        stopLoss: body.support,
        status: "Open",
        userId: body.userId,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save trade" },
      { status: 500 }
    );
  }
}