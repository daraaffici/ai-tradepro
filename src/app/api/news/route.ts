import { NextResponse } from "next/server";

type Impact = "High" | "Medium" | "Low";

function detectImpact(text: string): Impact {
  const t = text.toLowerCase();

  if (
    t.includes("war") ||
    t.includes("attack") ||
    t.includes("iran") ||
    t.includes("israel") ||
    t.includes("ukraine") ||
    t.includes("russia") ||
    t.includes("federal reserve") ||
    t.includes("inflation") ||
    t.includes("cpi") ||
    t.includes("fomc") ||
    t.includes("interest rate") ||
    t.includes("nfp") ||
    t.includes("recession") ||
    t.includes("market crash") ||
    t.includes("bitcoin etf") ||
    t.includes("oil") ||
    t.includes("gold")
  ) {
    return "High";
  }

  if (
    t.includes("bitcoin") ||
    t.includes("crypto") ||
    t.includes("stock") ||
    t.includes("nasdaq") ||
    t.includes("dollar") ||
    t.includes("forex") ||
    t.includes("tesla") ||
    t.includes("nvidia")
  ) {
    return "Medium";
  }

  return "Low";
}

function detectCategory(text: string) {
  const t = text.toLowerCase();

  if (t.includes("war") || t.includes("iran") || t.includes("israel")) {
    return "Geopolitical";
  }

  if (
    t.includes("fed") ||
    t.includes("cpi") ||
    t.includes("inflation") ||
    t.includes("fomc") ||
    t.includes("interest rate")
  ) {
    return "Macro";
  }

  if (t.includes("bitcoin") || t.includes("crypto") || t.includes("ethereum")) {
    return "Crypto";
  }

  if (t.includes("gold")) return "Gold";
  if (t.includes("oil") || t.includes("opec")) return "Oil";
  if (t.includes("stock") || t.includes("nasdaq")) return "Stocks";
  if (t.includes("forex") || t.includes("dollar")) return "Forex";

  return "Market";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const debug = url.searchParams.get("debug") === "1";
  const category = url.searchParams.get("category") || "All";

  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      debug
        ? { error: "Missing GNEWS_API_KEY" }
        : []
    );
  }

  const queries =
    category === "Crypto"
      ? ["bitcoin crypto market"]
      : category === "Forex"
      ? ["forex dollar Federal Reserve"]
      : category === "Gold"
      ? ["gold price market"]
      : category === "Stocks"
      ? ["stock market Nasdaq"]
      : [
          "Federal Reserve market",
          "inflation CPI market",
          "war market oil gold",
          "bitcoin crypto market",
          "stock market Nasdaq",
          "gold oil market",
        ];

  const debugLogs: any[] = [];
  const allNews: any[] = [];

  for (const query of queries) {
    try {
      const apiUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
        query
      )}&lang=en&max=10&apikey=${apiKey}`;

      const res = await fetch(apiUrl, { cache: "no-store" });
      const data = await res.json();

      debugLogs.push({
        query,
        status: res.status,
        ok: res.ok,
        errors: data.errors || null,
        articleCount: Array.isArray(data.articles) ? data.articles.length : 0,
      });

      if (!res.ok || !Array.isArray(data.articles)) continue;

      for (const article of data.articles) {
        const title = article.title || "";
        const description = article.description || "";
        const text = `${title} ${description}`;

        const impact = detectImpact(text);

        if (impact === "Low") continue;

        allNews.push({
          title: title || "Untitled",
          description,
          url: article.url || "#",
          source: article.source?.name || "Unknown",
          publishedAt: article.publishedAt || new Date().toISOString(),
          category: detectCategory(text),
          impact,
        });
      }
    } catch (error: any) {
      debugLogs.push({
        query,
        error: error.message,
      });
    }
  }

  const uniqueNews = allNews
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

  if (debug) {
    return NextResponse.json({
      newsCount: uniqueNews.length,
      debugLogs,
      news: uniqueNews,
    });
  }

  return NextResponse.json(uniqueNews);
}