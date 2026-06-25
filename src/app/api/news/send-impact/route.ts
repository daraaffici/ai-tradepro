import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";
import { formatCambodiaDateTime } from "@/lib/cambodiaTime";

type NewsItem = {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
  impact: string;
};

export async function POST(req: Request) {
  try {
    const { news } = await req.json();

    if (!news || !Array.isArray(news) || news.length === 0) {
      return NextResponse.json(
        { success: false, error: "No news to send" },
        { status: 400 }
      );
    }

    const highImpactNews = news
      .filter((item: NewsItem) => item.impact === "High")
      .slice(0, 5);

    if (highImpactNews.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No high impact news found",
      });
    }

    const message =
      `📰 <b>AI TradePro News Impact</b>\n\n` +
      `📅 <b>Date / Time:</b> ${formatCambodiaDateTime(new Date())}\n\n` +
      highImpactNews
        .map(
          (item: NewsItem, index: number) =>
            `${index + 1}. 🔥 <b>${item.title}</b>\n` +
            `<b>Category:</b> ${item.category}\n` +
            `<b>Source:</b> ${item.source}\n` +
            `<b>Published:</b> ${formatCambodiaDateTime(item.publishedAt)}\n` +
            `<b>Impact:</b> ${item.impact}\n\n` +
            `${item.description || "-"}\n\n` +
            `${item.url !== "#" ? item.url : ""}`
        )
        .join("\n\n----------------------\n\n");

    await sendTelegramMessage(message);

    return NextResponse.json({
      success: true,
      sent: highImpactNews.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to send news impact",
      },
      { status: 500 }
    );
  }
}