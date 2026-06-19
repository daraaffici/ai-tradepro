import { NextResponse } from "next/server";

type NewsItem = {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
  impact: string;
};

function detectImpact(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();

  if (
    text.includes("federal reserve") ||
    text.includes("interest rate") ||
    text.includes("inflation") ||
    text.includes("cpi") ||
    text.includes("nfp") ||
    text.includes("non-farm") ||
    text.includes("war") ||
    text.includes("recession") ||
    text.includes("crash")
  ) {
    return "High";
  }

  if (
    text.includes("bitcoin") ||
    text.includes("crypto") ||
    text.includes("gold") ||
    text.includes("earnings") ||
    text.includes("tesla") ||
    text.includes("apple") ||
    text.includes("nvidia")
  ) {
    return "Medium";
  }

  return "Low";
}

export async function GET() {
  try {
    const apiKey = process.env.GNEWS_API_KEY;

    if (!apiKey) {
      return NextResponse.json([
        {
          title: "Missing GNEWS_API_KEY",
          description:
            "Please add GNEWS_API_KEY to your .env file to enable live market news.",
          url: "#",
          source: "AI TradePro",
          publishedAt: new Date().toISOString(),
          category: "System",
          impact: "Low",
        },
      ]);
    }

    const topics = [
      { query: "Bitcoin crypto market", category: "Crypto" },
      { query: "forex market Federal Reserve", category: "Forex" },
      { query: "gold price XAUUSD", category: "Gold" },
      { query: "stock market Apple Tesla Nvidia", category: "Stocks" },
    ];

    const results = await Promise.allSettled(
      topics.map(async (topic) => {
        const res = await fetch(
          `https://gnews.io/api/v4/search?q=${encodeURIComponent(
            topic.query
          )}&lang=en&max=3&apikey=${apiKey}`,
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
            category: topic.category,
            impact: detectImpact(title, description),
          };
        });
      })
    );

    const news: NewsItem[] = results.flatMap((result) =>
      result.status === "fulfilled" ? result.value : []
    );

    const uniqueNews = news.filter(
      (item, index, self) =>
        index === self.findIndex((n) => n.url === item.url)
    );

    if (uniqueNews.length === 0) {
      return NextResponse.json([
        {
          title: "News service temporarily unavailable",
          description:
            "API limit may be reached or no market news articles were found right now.",
          url: "#",
          source: "AI TradePro",
          publishedAt: new Date().toISOString(),
          category: "System",
          impact: "Low",
        },
      ]);
    }

    return NextResponse.json(uniqueNews);
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