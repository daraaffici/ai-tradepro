import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = Number(url.searchParams.get("userId"));

    if (!userId) {
      return NextResponse.json({
        debug: "TRADES_ROUTE_V2_NO_USER",
        userId,
        trades: [],
      });
    }

    const trades = await prisma.trade.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      debug: "TRADES_ROUTE_V2_SCOPED",
      userId,
      count: trades.length,
      trades,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        debug: "TRADES_ROUTE_V2_ERROR",
        success: false,
        error: error.message || "Failed to load trades",
      },
      { status: 500 }
    );
  }
}