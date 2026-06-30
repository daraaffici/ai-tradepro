import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCambodiaPeriodFilter } from "@/lib/cambodiaTime";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const period = url.searchParams.get("period") || "all";
    const userId = Number(url.searchParams.get("userId"));

    if (!userId) {
      return NextResponse.json([]);
    }

    const where: any = {
      userId,
      NOT: {
        status: "Open",
      },
    };

    const dateFilter = getCambodiaPeriodFilter(period);

    if (dateFilter) {
      where.createdAt = dateFilter;
    }

    const trades = await prisma.trade.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(trades);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to load trade history",
      },
      { status: 500 }
    );
  }
}