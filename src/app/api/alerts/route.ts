import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const alerts = await prisma.priceAlert.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(alerts);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to load alerts",
      },
      { status: 500 }
    );
  }
}