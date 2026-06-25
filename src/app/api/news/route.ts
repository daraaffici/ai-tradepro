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

  const highWords = [
    "war", "attack", "missile", "conflict", "iran", "israel", "russia", "ukraine",
    "fed", "federal reserve", "fomc", "interest rate", "rate cut", "rate hike",
    "inflation", "cpi", "ppi", "nfp", "non-farm", "gdp", "recession",
    "market crash", "selloff", "bank crisis", "sanction", "tariff",
    "bitcoin etf", "sec approval", "oil surge", "gold surges"
  ];

  const mediumWords = [
    "bitcoin", "ethereum", "crypto", "gold", "oil", "opec",
    "stocks", "nasdaq", "s&p", "dow", "dollar", "treasury",
    "nvidia", "tesla", "apple", "microsoft", "earnings"
  ];

  if (highWords.some((w) => text.includes(w))) return "High";
  if (mediumWords.some((w) => text.includes(w))) return "Medium";
  return "Low";
}

function getCategory(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes("war") || text.includes("attack") || text.includes("iran") || text.includes("israel") || text.includes("russia") || text.includes("ukraine")) return "Geopolitical";
  if (text.includes("fed") || text.includes("cpi") || text.includes("inflation") || text.includes("interest rate") || text.includes("nfp") || text.includes("gdp")) return "Macro";
  if (text.includes("bitcoin") || text.includes("ethereum") || text.includes("crypto") || text.includes("sec") || text.includes("etf")) return "Crypto";
  if (text.includes("gold")) return "Gold";
  if (text.includes("oil") || text.includes("opec")) return "Oil";
  if (text.includes("stock") || text.includes("nasdaq") || text.includes("s&p") || text.includes("nvidia") || text.includes("tesla") || text.includes("apple")) return "Stocks";

  return "Market";
}

function isFresh(publishedAt: string) {
  const published = new Date(publishedAt).getTime();
  const hours = (Date.now() - published) / (1000 * 60 * 60);
  return hours >= 0 && hours <= 72;
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
        ? ["bitcoin crypto ethereum ETF SEC"]
        : category === "Forex"
        ? ["Federal Reserve dollar forex inflation interest rate"]
        : category === "Gold"
        ? ["gold price inflation Federal Reserve war"]
        : category === "Stocks"
        ? ["stock market Nasdaq S&P 500 Nvidia Tesla Apple"]
        : [
            "Federal Reserve inflation interest rate markets",
            "war conflict sanctions oil gold markets",
            "bitcoin crypto ETF SEC markets",
            "gold oil OPEC markets",
            "stock market Nasdaq S&P 500 Nvidia Tesla",
            "recession GDP NFP bank crisis markets"
          ];

    const results = await Promise.allSettled(
      queries.map(async (query) => {
        const res = await fetch(
          `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&sortby=publishedAt&apikey=${apiKey}`,
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

    const allNews = results.flatMap((r) =>
      r.status === "fulfilled" ? r.value : []
    ) as NewsItem[];

    const news = allNews
      .filter((item) => item.url !== "#")
      .filter((item) => isFresh(item.publishedAt))
      .filter((item) => item.impact !== "Low")
      .filter(
        (item, index, self) =>
          index === self.findIndex((n) => n.url === item.url)
      )
      .sort((a, b) => {
        const score = { High: 2, Medium: 1, Low: 0 };
        const impactDiff = score[b.impact] - score[a.impact];
        if (impactDiff !== 0) return impactDiff;

        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      })
      .slice(0, 20);

    return NextResponse.json(news);
  } catch (error) {
    console.error("News API failed:", error);
    return NextResponse.json([]);
  }
}