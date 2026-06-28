import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category") || "All";

    const news = await prisma.marketNews.findMany({
      where: {
        ...(category !== "All" ? { category } : {}),
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 50,
    });

    return NextResponse.json(news);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to load news",
      },
      { status: 500 }
    );
  }
}