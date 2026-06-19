import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const item = await prisma.watchlist.create({
    data: {
      symbol: body.symbol,
      userId: body.userId,
    },
  });

  return NextResponse.json({
    success: true,
    item,
  });
}