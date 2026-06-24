import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const period = url.searchParams.get("period") || "all";

    const now = new Date();

    const where: any = {
      NOT: {
        status: "Open",
      },
    };

    if (period === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      where.createdAt = {
        gte: start,
      };
    }

    if (period === "week") {
      const start = new Date();
      start.setDate(now.getDate() - 7);

      where.createdAt = {
        gte: start,
      };
    }

    if (period === "month") {
      const start = new Date();
      start.setMonth(now.getMonth() - 1);

      where.createdAt = {
        gte: start,
      };
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