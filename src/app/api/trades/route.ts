import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = Number(url.searchParams.get("userId"));

    if (!userId) {
      return NextResponse.json([]);
    }

    const trades = await prisma.trade.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(trades);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load trades" },
      { status: 500 }
    );
  }
}