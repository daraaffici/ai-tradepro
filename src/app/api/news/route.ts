import { NextResponse } from "next/server";

type NewsItem = {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
  impact: "High";
};

function detectCategory(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();

  if (
    text.includes("war") ||
    text.includes("conflict") ||
    text.includes("missile") ||
    text.includes("attack") ||
    text.includes("israel") ||
    text.includes("iran") ||
    text.includes("russia") ||
    text.includes("ukraine")
  ) {
    return "Geopolitical";
  }

  if (
    text.includes("federal reserve") ||
    text.includes("fed") ||
    text.includes("cpi") ||
    text.includes("inflation") ||
    text.includes("interest rate") ||
    text.includes("fomc") ||
    text.includes("nfp") ||
    text.includes("gdp")
  ) {
    return "Macro";
  }

  if (
    text.includes("bitcoin") ||
    text.includes("ethereum") ||
    text.includes("crypto") ||
    text.includes("etf") ||
    text.includes("sec")
  ) {
    return "Crypto";
  }

  if (text.includes("gold") || text.includes("xauusd")) {
    return "Gold";
  }

  if (
    text.includes("oil") ||
    text.includes("opec") ||
    text.includes("crude")
  ) {
    return "Oil";
  }

  if (
    text.includes("stock") ||
    text.includes("nasdaq") ||
    text.includes("s&p") ||
    text.includes("dow") ||
    text.includes("nvidia") ||
    text.includes("tesla")
  ) {
    return "Stocks";
  }

  return "Market";
}

function isHighImpact(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();

  const keywords = [
    "war",
    "conflict",
    "missile",
    "attack",
    "geopolitical",
    "sanction",
    "tariff",

    "federal reserve",
    "fed",
    "interest rate",
    "rate cut",
    "rate hike",
    "fomc",
    "inflation",
    "cpi",
    "ppi",
    "nfp",
    "non-farm",
    "gdp",
    "recession",

    "bank crisis",
    "bank collapse",
    "market crash",
    "selloff",
    "liquidation",

    "bitcoin etf",
    "spot etf",
    "sec approval",
    "sec lawsuit",

    "gold price",
    "oil price",
    "opec",
    "crude oil",
  ];

  return keywords.some((word) => text.includes(word));
}

function isFreshNews(publishedAt: string) {
  const published = new Date(publishedAt).getTime();
  const hours = (Date.now() - published) / (1000 * 60 * 60);

  return hours >= 0 && hours <= 24;
}

export async function GET() {
  try {
    const apiKey = process.env.GNEWS_API_KEY;

    if (!apiKey) {
      return NextResponse.json([
        {
          title: "Missing GNEWS_API_KEY",
          description:
            "Please add GNEWS_API_KEY to .env.local and Vercel Environment Variables.",
          url: "#",
          source: "AI TradePro",
          publishedAt: new Date().toISOString(),
          category: "System",
          impact: "High",
        },
      ]);
    }

    const queries = [
      "war OR conflict OR missile OR attack OR sanctions market",
      "Federal Reserve OR interest rate OR CPI OR inflation OR FOMC OR NFP",
      "market crash OR recession OR bank crisis OR selloff",
      "Bitcoin ETF OR SEC crypto OR crypto liquidation",
      "gold price OR XAUUSD OR oil price OR OPEC",
      "stock market OR Nasdaq OR S&P 500 OR Nvidia OR Tesla",
    ];

    const results = await Promise.allSettled(
      queries.map(async (query) => {
        const res = await fetch(
          `https://gnews.io/api/v4/search?q=${encodeURIComponent(
            query
          )}&lang=en&max=10&sortby=publishedAt&apikey=${apiKey}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (!res.ok || data.errors) {
          return [];
        }

        return (data.articles || [])
          .map((article: any) => {
            const title = article.title || "Untitled";
            const description = article.description || "";
            const publishedAt =
              article.publishedAt || new Date().toISOString();

            if (!isFreshNews(publishedAt)) return null;
            if (!isHighImpact(title, description)) return null;

            return {
              title,
              description,
              url: article.url || "#",
              source: article.source?.name || "Unknown",
              publishedAt,
              category: detectCategory(title, description),
              impact: "High",
            } as NewsItem;
          })
          .filter(Boolean);
      })
    );

    const news = results.flatMap((result) =>
      result.status === "fulfilled" ? result.value : []
    ) as NewsItem[];

    const uniqueNews = news
      .filter(
        (item, index, self) =>
          index === self.findIndex((n) => n.url === item.url)
      )
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
      )
      .slice(0, 20);

    return NextResponse.json(
      uniqueNews.length
        ? uniqueNews
        : [
            {
              title: "No high-impact market news found in the last 24 hours",
              description:
                "AI TradePro is filtering only important market-moving news such as war, CPI, Fed, NFP, Bitcoin ETF, gold, oil, and stock market shocks.",
              url: "#",
              source: "AI TradePro",
              publishedAt: new Date().toISOString(),
              category: "System",
              impact: "High",
            },
          ]
    );
  } catch (error: any) {
    return NextResponse.json([
      {
        title: "Failed to fetch high-impact market news",
        description: error.message || "Unknown news API error.",
        url: "#",
        source: "AI TradePro",
        publishedAt: new Date().toISOString(),
        category: "System",
        impact: "High",
      },
    ]);
  }
}