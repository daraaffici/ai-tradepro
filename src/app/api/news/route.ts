import { NextResponse } from "next/server";

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

function detectImpact(title: string, description: string): Impact {
  const text = `${title} ${description}`.toLowerCase();

  const highKeywords = [
    "war",
    "conflict",
    "missile",
    "attack",
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
    "inflation",
    "cpi",
    "ppi",
    "nfp",
    "non-farm",
    "gdp",
    "recession",
    "bank crisis",
    "market crash",
    "selloff",
    "oil price",
    "gold price",
    "bitcoin etf",
    "sec approval",
    "liquidation",
  ];

  const mediumKeywords = [
    "bitcoin",
    "ethereum",
    "crypto",
    "gold",
    "oil",
    "opec",
    "stocks",
    "nasdaq",
    "s&p 500",
    "dow jones",
    "dollar",
    "treasury",
    "forex",
    "earnings",
    "nvidia",
    "tesla",
    "apple",
    "microsoft",
  ];

  if (highKeywords.some((word) => text.includes(word))) return "High";
  if (mediumKeywords.some((word) => text.includes(word))) return "Medium";

  return "Low";
}

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
    text.includes("fomc") ||
    text.includes("interest rate") ||
    text.includes("cpi") ||
    text.includes("ppi") ||
    text.includes("inflation") ||
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
    text.includes("etf") ||
    text.includes("liquidation")
  ) {
    return "Crypto";
  }

  if (text.includes("gold") || text.includes("xauusd")) return "Gold";

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
    text.includes("tesla") ||
    text.includes("apple") ||
    text.includes("microsoft")
  ) {
    return "Stocks";
  }

  if (text.includes("forex") || text.includes("dollar")) return "Forex";

  return "Market";
}

function isFreshNews(publishedAt: string) {
  const published = new Date(publishedAt).getTime();

  if (Number.isNaN(published)) return false;

  const hours = (Date.now() - published) / (1000 * 60 * 60);

  return hours >= 0 && hours <= 72;
}

function impactScore(impact: Impact) {
  if (impact === "High") return 3;
  if (impact === "Medium") return 2;
  return 1;
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
        ? [
            "bitcoin crypto ETF SEC ethereum market",
            "crypto liquidation bitcoin ethereum",
          ]
        : category === "Forex"
        ? [
            "Federal Reserve dollar forex interest rate",
            "CPI inflation dollar forex market",
          ]
        : category === "Gold"
        ? [
            "gold price XAUUSD inflation Federal Reserve",
            "gold war safe haven market",
          ]
        : category === "Stocks"
        ? [
            "stock market Nasdaq S&P 500 Dow Jones",
            "Nvidia Tesla Apple Microsoft earnings stocks",
          ]
        : [
            "Federal Reserve CPI inflation FOMC interest rate",
            "war conflict missile attack sanctions market",
            "bitcoin crypto ETF SEC ethereum liquidation",
            "gold price oil price OPEC market",
            "stock market Nasdaq S&P 500 Dow Jones",
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

        if (!res.ok || data.errors || !Array.isArray(data.articles)) {
          return [];
        }

        return data.articles.map((article: any) => {
          const title = article.title || "Untitled";
          const description = article.description || "";
          const publishedAt = article.publishedAt || new Date().toISOString();

          const impact = detectImpact(title, description);

          return {
            title,
            description,
            url: article.url || "#",
            source: article.source?.name || "Unknown",
            publishedAt,
            category: detectCategory(title, description),
            impact,
          } as NewsItem;
        });
      })
    );

    const allNews = results.flatMap((result) =>
      result.status === "fulfilled" ? result.value : []
    ) as NewsItem[];

    const filteredNews = allNews
      .filter((item) => item.url !== "#")
      .filter((item) => isFreshNews(item.publishedAt))
      .filter((item) => item.impact === "High" || item.impact === "Medium")
      .filter(
        (item, index, self) =>
          index === self.findIndex((n) => n.url === item.url)
      )
      .sort((a, b) => {
        const byImpact = impactScore(b.impact) - impactScore(a.impact);

        if (byImpact !== 0) return byImpact;

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