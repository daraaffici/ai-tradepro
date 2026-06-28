import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { priorityRank } from "@/lib/newsPriority";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category") || "All";

    const news = await prisma.marketNews.findMany({
      where: {
        impact: {
          in: ["Critical", "High", "Medium"],
        },
        ...(category !== "All" ? { category } : {}),
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: 80,
    });

    const sorted = news.sort((a, b) => {
      const byPriority = priorityRank(b.impact) - priorityRank(a.impact);
      if (byPriority !== 0) return byPriority;

      return (
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
      );
    });

    return NextResponse.json(sorted);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load news" },
      { status: 500 }
    );
  }
}