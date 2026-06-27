import { NextResponse } from "next/server";

type NewsItem = {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
  impact: "High" | "Medium" | "Low";
};

async function sendTelegramMessage(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Telegram not configured");
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
      disable_web_page_preview: false,
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.ok) {
    throw new Error(data.description || "Failed to send Telegram");
  }

  return data;
}

function formatNewsMessage(news: NewsItem[]) {
  const items = news
    .slice(0, 5)
    .map((item, index) => {
      const time = new Date(item.publishedAt).toLocaleString("en-GB", {
        timeZone: "Asia/Phnom_Penh",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      return `
${index + 1}. 🔥 <b>${item.title}</b>
Source: ${item.source}
Category: ${item.category}
Impact: ${item.impact}
Time: ${time}
${item.url}
`;
    })
    .join("\n");

  return `
🚨 <b>AI TradePro News Alert</b>

High-impact market news detected.

${items}

AI TradePro
`;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");

    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || url.origin;

    const res = await fetch(`${baseUrl}/api/news?category=All`, {
      cache: "no-store",
    });

    const news: NewsItem[] = await res.json();

    const highImpactNews = news.filter((item) => item.impact === "High");

    if (highImpactNews.length === 0) {
      return NextResponse.json({
        success: true,
        sent: 0,
        message: "No high-impact news found",
      });
    }

    await sendTelegramMessage(formatNewsMessage(highImpactNews));

    return NextResponse.json({
      success: true,
      sent: Math.min(highImpactNews.length, 5),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Auto news alert failed",
      },
      { status: 500 }
    );
  }
}