import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const userId = Number(body.userId);

    if (!userId || !body.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request",
        },
        {
          status: 400,
        }
      );
    }

    const item = await prisma.portfolio.findFirst({
      where: {
        id: body.id,
        userId,
      },
    });

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: "Portfolio not found",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.portfolio.delete({
      where: {
        id: item.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Delete failed",
      },
      {
        status: 500,
      }
    );
  }
}