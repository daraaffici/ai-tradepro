import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const symbol = String(body.symbol || "").toUpperCase();
    const userId = Number(body.userId);

    if (!symbol || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing symbol or userId" },
        { status: 400 }
      );
    }

    const exists = await prisma.watchlist.findFirst({
      where: { symbol, userId },
    });

    if (exists) {
      return NextResponse.json({
        success: true,
        item: exists,
        message: "Already in watchlist",
      });
    }

    const item = await prisma.watchlist.create({
      data: { symbol, userId },
    });

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}