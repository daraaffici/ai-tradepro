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

function getImpact(title: string, description: string): "High" | "Medium" | "Low" {
  const text = `${title} ${description}`.toLowerCase();

  const high = [
    "war",
    "missile",
    "attack",
    "conflict",
    "israel",
    "iran",
    "russia",
    "ukraine",
    "sanction",
    "tariff",
    "federal reserve",
    "fed",
    "fomc",
    "interest rate",
    "rate cut",
    "rate hike",
    "cpi",
    "ppi",
    "inflation",
    "nfp",
    "non-farm",
    "gdp",
    "recession",
    "market crash",
    "bank crisis",
    "oil prices surge",
    "gold surges",
    "bitcoin etf",
    "sec approval",
    "liquidation",
  ];

  const medium = [
    "bitcoin",
    "ethereum",
    "crypto",
    "gold",
    "oil",
    "stocks",
    "nasdaq",
    "s&p 500",
    "dollar",
    "treasury",
    "earnings",
    "nvidia",
    "tesla",
    "apple",
  ];

  if (high.some((word) => text.includes(word))) return "High";
  if (medium.some((word) => text.includes(word))) return "Medium";

  return "Low";
}

function getCategory(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();

  if (
    text.includes("war") ||
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
    text.includes("fed") ||
    text.includes("fomc") ||
    text.includes("cpi") ||
    text.includes("inflation") ||
    text.includes("interest rate") ||
    text.includes("nfp") ||
    text.includes("gdp")
  ) {
    return "Macro";
  }

  if (
    text.includes("bitcoin") ||
    text.includes("ethereum") ||
    text.includes("crypto") ||
    text.includes("sec") ||
    text.includes("etf")
  ) {
    return "Crypto";
  }

  if (text.includes("gold") || text.includes("xauusd")) return "Gold";
  if (text.includes("oil") || text.includes("opec") || text.includes("crude")) return "Oil";
  if (text.includes("stock") || text.includes("nasdaq") || text.includes("s&p")) return "Stocks";

  return "Market";
}

function isFresh(publishedAt: string) {
  const published = new Date(publishedAt).getTime();
  const hours = (Date.now() - published) / (1000 * 60 * 60);

  return hours >= 0 && hours <= 48;
}

export async function GET(req: Request) {
  try {
    const apiKey = process.env.GNEWS_API_KEY;
    const url = new URL(req.url);
    const category = url.searchParams.get("category") || "All";

    if (!apiKey) {
      return NextResponse.json([]);
    }

    const queries =
      category === "Crypto"
        ? ["bitcoin ETF SEC crypto market ethereum liquidation"]
        : category === "Forex"
        ? ["Federal Reserve dollar forex interest rate CPI inflation"]
        : category === "Gold"
        ? ["gold price XAUUSD Federal Reserve inflation war"]
        : category === "Stocks"
        ? ["stock market Nasdaq S&P 500 Nvidia Tesla Apple earnings"]
        : [
            "Federal Reserve CPI inflation FOMC interest rate market",
            "war missile attack sanctions oil gold market",
            "bitcoin ETF SEC crypto liquidation ethereum",
            "gold price oil price OPEC market",
            "stock market Nasdaq S&P 500 Nvidia Tesla Apple",
            "recession GDP NFP bank crisis market crash",
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

        if (!res.ok || data.errors) return [];

        return (data.articles || []).map((article: any) => {
          const title = article.title || "Untitled";
          const description = article.description || "";
          const publishedAt = article.publishedAt || new Date().toISOString();

          return {
            title,
            description,
            url: article.url || "#",
            source: article.source?.name || "Unknown",
            publishedAt,
            category: getCategory(title, description),
            impact: getImpact(title, description),
          } as NewsItem;
        });
      })
    );

    const allNews = results.flatMap((result) =>
      result.status === "fulfilled" ? result.value : []
    ) as NewsItem[];

    const filteredNews = allNews
      .filter((item) => item.url !== "#")
      .filter((item) => isFresh(item.publishedAt))
      .filter((item) => item.impact === "High" || item.impact === "Medium")
      .filter(
        (item, index, self) =>
          index === self.findIndex((n) => n.url === item.url)
      )
      .sort((a, b) => {
        const impactScore = { High: 2, Medium: 1, Low: 0 };
        const impactDiff = impactScore[b.impact] - impactScore[a.impact];

        if (impactDiff !== 0) return impactDiff;

        return (
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
        );
      })
      .slice(0, 20);

    return NextResponse.json(filteredNews);
  } catch (error) {
    console.error("News API failed:", error);
    return NextResponse.json([]);
  }
}