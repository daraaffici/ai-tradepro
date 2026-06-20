import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const alert = await prisma.priceAlert.create({
      data: {
        symbol: String(body.symbol || "").toUpperCase(),
        condition: body.condition,
        targetPrice: Number(body.targetPrice),
      },
    });

    return NextResponse.json({
      success: true,
      alert,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to add alert",
      },
      { status: 500 }
    );
  }
}