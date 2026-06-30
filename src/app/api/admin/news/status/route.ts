import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalNews = await prisma.marketNews.count();

    const critical = await prisma.marketNews.count({
      where: { impact: "Critical" },
    });

    const high = await prisma.marketNews.count({
      where: { impact: "High" },
    });

    const medium = await prisma.marketNews.count({
      where: { impact: "Medium" },
    });

    const telegramSent = await prisma.marketNews.count({
      where: {
        sentTelegram: true,
      },
    });

    const latest = await prisma.marketNews.findFirst({
      orderBy: {
        publishedAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,

      totalNews,

      critical,

      high,

      medium,

      telegramSent,

      latest,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}