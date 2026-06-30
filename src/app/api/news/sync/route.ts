import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { prisma } from "@/lib/prisma";
import { createActivityLog } from "@/lib/activityLog";
import {
  detectNewsPriority,
  detectNewsCategory,
  type NewsPriority,
} from "@/lib/newsPriority";

type NewsItem = {
  title: string;
  description: string;
  url: string;
  source: string;
  category: string;
  impact: NewsPriority;
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

  const icon = news.impact === "Critical" ? "🔴" : "🟠";

  const message = `
🚨 <b>AI TradePro News Alert</b>

${icon} <b>${news.impact.toUpperCase()} NEWS</b>

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

async function fetchFeedNews(feed: {
  source: string;
  category: string;
  url: string;
}) {
  const syncState = await prisma.newsSyncState.findUnique({
    where: {
      source: feed.source,
    },
  });

  const data = await parser.parseURL(feed.url);

  const items = data.items
    .map((item) => {
      const title = item.title || "Untitled";
      const description =
        item.contentSnippet || item.content || item.summary || "";
      const publishedAt = item.isoDate || item.pubDate || new Date().toISOString();

      return {
        title,
        description,
        url: item.link || "#",
        source: feed.source,
        category: detectNewsCategory(title, description, feed.category),
        impact: detectNewsPriority(title, description),
        publishedAt: new Date(publishedAt),
      } as NewsItem;
    })
    .filter((item) => item.url !== "#")
    .filter((item) => {
      if (!syncState) return true;

      return item.publishedAt > syncState.lastSyncAt;
    });

  const newestItem = data.items[0];

  await prisma.newsSyncState.upsert({
    where: {
      source: feed.source,
    },
    update: {
      lastSyncAt: new Date(),
      lastNewsUrl: newestItem?.link || syncState?.lastNewsUrl || null,
    },
    create: {
      source: feed.source,
      lastSyncAt: new Date(),
      lastNewsUrl: newestItem?.link || null,
    },
  });

  return items;
}

async function fetchRSSNews() {
  const results = await Promise.allSettled(
    feeds.map((feed) => fetchFeedNews(feed))
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
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const rssNews = await fetchRSSNews();

    const importantNews = rssNews
      .filter(
        (item) =>
          item.impact === "Critical" ||
          item.impact === "High" ||
          item.impact === "Medium"
      )
      .filter((item) => {
        const hours =
          (Date.now() - item.publishedAt.getTime()) / (1000 * 60 * 60);

        return hours >= 0 && hours <= 168;
      });

    let checked = importantNews.length;
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

      if (item.impact === "Critical" || item.impact === "High") {
        try {
          await sendTelegramMessage(item);

          await prisma.marketNews.update({
            where: {
              id: saved.id,
            },
            data: {
              sentTelegram: true,
            },
          });

          sent++;

          await createActivityLog({
            action: "NEWS_ALERT_SENT",
            entity: "News",
            entityId: saved.id,
            description: `${item.impact} news sent to Telegram: ${item.title}`,
            adminName: "System",
          });
        } catch (error) {
          console.error("TELEGRAM_NEWS_SEND_ERROR:", error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      checked,
      added,
      skipped,
      sent,
      note: "Critical/High sent to Telegram. Medium saved to News page only.",
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