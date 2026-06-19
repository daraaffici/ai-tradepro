import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const trades = await prisma.trade.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(trades);
}