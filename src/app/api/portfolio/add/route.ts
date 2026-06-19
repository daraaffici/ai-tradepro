import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const item = await prisma.portfolio.create({
    data: {
      symbol: body.symbol,
      quantity: Number(body.quantity),
      buyPrice: Number(body.buyPrice),
      userId: Number(body.userId),
    },
  });

  return NextResponse.json({
    success: true,
    item,
  });
}