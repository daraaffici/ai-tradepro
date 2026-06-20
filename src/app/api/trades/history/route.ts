import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const trades = await prisma.trade.findMany({
    where: {
      status: {
        in: ["Win", "Loss"],
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  return NextResponse.json(trades);
}