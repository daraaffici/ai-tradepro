export type NewsPriority = "Critical" | "High" | "Medium" | "Low";

export function detectNewsPriority(title: string, description: string): NewsPriority {
  const text = `${title} ${description}`.toLowerCase();

  const criticalWords = [
    "war",
    "missile",
    "attack",
    "invasion",
    "israel",
    "iran",
    "russia",
    "ukraine",
    "federal reserve",
    "fomc",
    "interest rate",
    "rate cut",
    "rate hike",
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
    "binance emergency",
    "exchange hack",
    "liquidation",
    "sanction",
    "tariff",
  ];

  const highWords = [
    "bitcoin",
    "ethereum",
    "gold",
    "oil",
    "opec",
    "nasdaq",
    "s&p",
    "dow",
    "dollar",
    "forex",
    "treasury",
    "nvidia",
    "tesla",
    "apple",
    "microsoft",
    "earnings",
  ];

  const mediumWords = [
    "crypto",
    "stocks",
    "commodity",
    "market",
    "trading",
    "etf",
    "exchange",
    "analysis",
  ];

  if (criticalWords.some((word) => text.includes(word))) return "Critical";
  if (highWords.some((word) => text.includes(word))) return "High";
  if (mediumWords.some((word) => text.includes(word))) return "Medium";

  return "Low";
}

export function detectNewsCategory(title: string, description: string, fallback = "Market") {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes("bitcoin") || text.includes("ethereum") || text.includes("crypto")) return "Crypto";
  if (text.includes("gold") || text.includes("xauusd")) return "Gold";
  if (text.includes("forex") || text.includes("dollar") || text.includes("fed")) return "Forex";
  if (text.includes("stock") || text.includes("nasdaq") || text.includes("s&p")) return "Stocks";
  if (text.includes("oil") || text.includes("opec")) return "Oil";
  if (text.includes("war") || text.includes("iran") || text.includes("israel")) return "Geopolitical";
  if (text.includes("cpi") || text.includes("nfp") || text.includes("gdp") || text.includes("fomc")) return "Macro";

  return fallback;
}

export function priorityRank(priority: string) {
  if (priority === "Critical") return 3;
  if (priority === "High") return 2;
  if (priority === "Medium") return 1;
  return 0;
}