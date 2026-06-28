import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { prisma } from "@/lib/prisma";
import { createActivityLog } from "@/lib/activityLog";

type Impact = "High" | "Medium" | "Low";

type NewsItem = {
  title: string;
  description: string;
  url: string;
  source: string;
  category: string;
  impact: Impact;
  publishedAt: Date;
};

const parser = new Parser();

const feeds = [
  {
    source: "CoinDesk",
    category: "Crypto",
    url: "https://www.coindesk.com/arc/outboundfeeds/rss/",
  },
  {
    source: "Cointelegraph",
    category: "Crypto",
    url: "https://cointelegraph.com/rss",
  },
  {
    source: "FXStreet",
    category: "Forex",
    url: "https://www.fxstreet.com/rss/news",
  },
  {
    source: "MarketWatch",
    category: "Stocks",
    url: "https://feeds.content.dowjones.io/public/rss/mw_topstories",
  },
];

function detectImpact(title: string, description: string): Impact {
  const text = `${title} ${description}`.toLowerCase();

  const highWords = [
    "war",
    "attack",
    "missile",
    "conflict",
    "federal reserve",
    "fomc",
    "interest rate",
    "rate cut",
    "rate hike",
    "inflation",
    "cpi",
    "ppi",
    "nfp",
    "non-farm",
    "gdp",
    "recession",
    "market crash",
    "bank crisis",
    "sec approval",
    "bitcoin etf",
    "liquidation",
    "sanction",
    "tariff",
  ];

  const mediumWords = [
    "bitcoin",
    "ethereum",
    "crypto",
    "gold",
    "oil",
    "opec",
    "stocks",
    "nasdaq",
    "s&p",
    "dow",
    "dollar",
    "forex",
    "earnings",
    "nvidia",
    "tesla",
    "apple",
  ];

  if (highWords.some((w) => text.includes(w))) return "High";
  if (mediumWords.some((w) => text.includes(w))) return "Medium";

  return "Low";
}

function detectCategory(title: string, description: string, fallback: string) {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes("bitcoin") || text.includes("ethereum") || text.includes("crypto")) {
    return "Crypto";
  }

  if (text.includes("gold") || text.includes("xauusd")) return "Gold";
  if (text.includes("forex") || text.includes("dollar") || text.includes("fed")) return "Forex";
  if (text.includes("stock") || text.includes("nasdaq") || text.includes("s&p")) return "Stocks";
  if (text.includes("oil") || text.includes("opec")) return "Oil";

  return fallback;
}

async function sendTelegramMessage(news: NewsItem) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Telegram not configured");
  }

  const time = news.publishedAt.toLocaleString("en-GB", {
    timeZone: "Asia/Phnom_Penh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const message = `
🚨 <b>AI TradePro News Alert</b>

<b>${news.impact} Impact News</b>

📰 <b>${news.title}</b>

Source: ${news.source}
Category: ${news.category}
Published: ${time}

${news.url}

AI TradePro
`;

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
}

async function fetchRSSNews() {
  const results = await Promise.allSettled(
    feeds.map(async (feed) => {
      const data = await parser.parseURL(feed.url);

      return data.items.map((item) => {
        const title = item.title || "Untitled";
        const description =
          item.contentSnippet || item.content || item.summary || "";

        const publishedAt = item.isoDate || item.pubDate || new Date().toISOString();

        const impact = detectImpact(title, description);

        return {
          title,
          description,
          url: item.link || "#",
          source: feed.source,
          category: detectCategory(title, description, feed.category),
          impact,
          publishedAt: new Date(publishedAt),
        } as NewsItem;
      });
    })
  );

  return results.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  );
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get("secret");

    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const rssNews = await fetchRSSNews();

    const importantNews = rssNews
      .filter((item) => item.url !== "#")
      .filter((item) => item.impact === "High" || item.impact === "Medium")
      .filter((item) => {
        const hours =
          (Date.now() - item.publishedAt.getTime()) / (1000 * 60 * 60);

        return hours >= 0 && hours <= 168;
      });

    let added = 0;
    let skipped = 0;
    let sent = 0;

    for (const item of importantNews) {
      const exists = await prisma.marketNews.findUnique({
        where: {
          url: item.url,
        },
      });

      if (exists) {
        skipped++;
        continue;
      }

      const saved = await prisma.marketNews.create({
        data: {
          title: item.title,
          description: item.description,
          url: item.url,
          source: item.source,
          category: item.category,
          impact: item.impact,
          publishedAt: item.publishedAt,
        },
      });

      added++;

      try {
        await sendTelegramMessage(item);

        await prisma.marketNews.update({
          where: { id: saved.id },
          data: { sentTelegram: true },
        });

        sent++;

        await createActivityLog({
          action: "NEWS_ALERT_SENT",
          entity: "News",
          entityId: saved.id,
          description: `${item.impact} impact news sent to Telegram: ${item.title}`,
          adminName: "System",
        });
      } catch (error) {
        console.error("TELEGRAM_NEWS_SEND_ERROR:", error);
      }
    }

    return NextResponse.json({
      success: true,
      checked: importantNews.length,
      added,
      skipped,
      sent,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "News sync failed",
      },
      { status: 500 }
    );
  }
}