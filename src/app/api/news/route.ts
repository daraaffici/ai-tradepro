import { NextResponse } from "next/server";
import Parser from "rss-parser";

type Impact = "High" | "Medium" | "Low";

type NewsItem = {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
  impact: Impact;
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
  {
    source: "Investing",
    category: "Market",
    url: "https://www.investing.com/rss/news.rss",
  },
];

function detectImpact(title: string, description: string): Impact {
  const text = `${title} ${description}`.toLowerCase();

  const high = [
    "war",
    "conflict",
    "missile",
    "attack",
    "federal reserve",
    "fed",
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
    "sanction",
    "tariff",
    "bitcoin etf",
    "sec approval",
    "liquidation",
    "oil price",
    "gold price",
  ];

  const medium = [
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
    "treasury",
    "forex",
    "earnings",
    "nvidia",
    "tesla",
    "apple",
    "microsoft",
  ];

  if (high.some((word) => text.includes(word))) return "High";
  if (medium.some((word) => text.includes(word))) return "Medium";

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

function isFresh(date: string) {
  const time = new Date(date).getTime();
  if (Number.isNaN(time)) return true;

  const hours = (Date.now() - time) / (1000 * 60 * 60);
  return hours <= 168;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category") || "All";

    const results = await Promise.allSettled(
      feeds.map(async (feed) => {
        const data = await parser.parseURL(feed.url);

        return data.items.map((item) => {
          const title = item.title || "Untitled";
          const description =
            item.contentSnippet || item.content || item.summary || "";
          const publishedAt =
            item.isoDate || item.pubDate || new Date().toISOString();

          return {
            title,
            description,
            url: item.link || "#",
            source: feed.source,
            publishedAt,
            category: detectCategory(title, description, feed.category),
            impact: detectImpact(title, description),
          } as NewsItem;
        });
      })
    );

    const allNews = results.flatMap((result) =>
      result.status === "fulfilled" ? result.value : []
    ) as NewsItem[];

    const filtered = allNews
      .filter((item) => item.url !== "#")
      .filter((item) => isFresh(item.publishedAt))
      .filter((item) => item.impact !== "Low")
      .filter((item) => category === "All" || item.category === category)
      .filter(
        (item, index, self) =>
          index === self.findIndex((n) => n.url === item.url)
      )
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
      )
      .slice(0, 30);

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("RSS News API failed:", error);
    return NextResponse.json([]);
  }
}