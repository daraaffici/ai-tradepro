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

function detectImpact(title: string, description: string): "High" | "Medium" | "Low" {
  const text = `${title} ${description}`.toLowerCase();

  const highKeywords = [
    "federal reserve",
    "fed",
    "interest rate",
    "rate cut",
    "rate hike",
    "inflation",
    "cpi",
    "ppi",
    "nfp",
    "non-farm",
    "fomc",
    "gdp",
    "recession",
    "war",
    "crash",
    "bank crisis",
    "tariff",
    "sanction",
  ];

  const mediumKeywords = [
    "bitcoin",
    "ethereum",
    "crypto",
    "gold",
    "oil",
    "earnings",
    "tesla",
    "apple",
    "nvidia",
    "microsoft",
    "stocks",
    "forex",
    "dollar",
    "xauusd",
  ];

  if (highKeywords.some((word) => text.includes(word))) {
    return "High";
  }

  if (mediumKeywords.some((word) => text.includes(word))) {
    return "Medium";
  }

  return "Low";
}

function detectCategory(title: string, description: string, fallback: string) {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes("bitcoin") || text.includes("ethereum") || text.includes("crypto")) {
    return "Crypto";
  }

  if (text.includes("gold") || text.includes("xauusd")) {
    return "Gold";
  }

  if (text.includes("forex") || text.includes("dollar") || text.includes("eurusd")) {
    return "Forex";
  }

  if (
    text.includes("stock") ||
    text.includes("tesla") ||
    text.includes("apple") ||
    text.includes("nvidia") ||
    text.includes("microsoft")
  ) {
    return "Stocks";
  }

  return fallback;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category") || "All";

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
          impact: "Low",
        },
      ]);
    }

    const topics =
      category === "Crypto"
        ? [{ query: "bitcoin OR ethereum OR crypto market", category: "Crypto" }]
        : category === "Forex"
        ? [{ query: "forex market OR Federal Reserve OR dollar", category: "Forex" }]
        : category === "Gold"
        ? [{ query: "gold price OR XAUUSD OR precious metals", category: "Gold" }]
        : category === "Stocks"
        ? [{ query: "stock market OR Apple OR Tesla OR Nvidia", category: "Stocks" }]
        : [
            { query: "Federal Reserve inflation CPI stock market", category: "Macro" },
            { query: "bitcoin ethereum crypto market", category: "Crypto" },
            { query: "gold price XAUUSD", category: "Gold" },
            { query: "forex market dollar Federal Reserve", category: "Forex" },
            { query: "stock market Apple Tesla Nvidia Microsoft", category: "Stocks" },
          ];

    const results = await Promise.allSettled(
      topics.map(async (topic) => {
        const res = await fetch(
          `https://gnews.io/api/v4/search?q=${encodeURIComponent(
            topic.query
          )}&lang=en&max=10&sortby=publishedAt&apikey=${apiKey}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (!res.ok || data.errors) {
          return [];
        }

        return (data.articles || []).map((article: any) => {
          const title = article.title || "Untitled";
          const description = article.description || "";

          return {
            title,
            description,
            url: article.url || "#",
            source: article.source?.name || "Unknown",
            publishedAt: article.publishedAt || new Date().toISOString(),
            category: detectCategory(title, description, topic.category),
            impact: detectImpact(title, description),
          } as NewsItem;
        });
      })
    );

    const news = results.flatMap((result) =>
      result.status === "fulfilled" ? result.value : []
    );

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
      .slice(0, 30);

    return NextResponse.json(
      uniqueNews.length
        ? uniqueNews
        : [
            {
              title: "No latest market news found",
              description:
                "Try refreshing again later or check your GNews API limit.",
              url: "#",
              source: "AI TradePro",
              publishedAt: new Date().toISOString(),
              category: "System",
              impact: "Low",
            },
          ]
    );
  } catch (error: any) {
    return NextResponse.json(
      [
        {
          title: "Failed to fetch market news",
          description: error.message || "Unknown news API error.",
          url: "#",
          source: "AI TradePro",
          publishedAt: new Date().toISOString(),
          category: "System",
          impact: "Low",
        },
      ],
      { status: 200 }
    );
  }
}