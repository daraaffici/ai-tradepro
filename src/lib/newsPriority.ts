export type NewsPriority = "Critical" | "High" | "Medium" | "Low";

type ScoreRule = {
  words: string[];
  score: number;
};

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function calculateNewsScore(title: string, description: string) {
  const text = `${title} ${description}`.toLowerCase();

  let score = 0;

  const criticalRules: ScoreRule[] = [
    {
      score: 120,
      words: [
        "fomc",
        "federal reserve",
        "fed decision",
        "interest rate decision",
        "rate hike",
        "rate cut",
        "cpi",
        "core cpi",
        "ppi",
        "nfp",
        "non-farm",
        "nonfarm",
        "gdp",
        "recession",
        "bank crisis",
        "bank failure",
        "market crash",
        "financial crisis",
      ],
    },
    {
      score: 120,
      words: [
        "war",
        "missile",
        "attack",
        "invasion",
        "explosion",
        "israel",
        "iran",
        "russia",
        "ukraine",
        "china taiwan",
        "sanction",
        "tariff",
      ],
    },
    {
      score: 110,
      words: [
        "sec approval",
        "bitcoin etf approval",
        "spot bitcoin etf",
        "exchange hack",
        "major hack",
        "binance emergency",
        "stablecoin collapse",
        "liquidation cascade",
      ],
    },
  ];

  const highRules: ScoreRule[] = [
    {
      score: 70,
      words: [
        "bitcoin etf",
        "ethereum etf",
        "etf approval",
        "oil price",
        "gold price",
        "opec",
        "treasury yield",
        "us dollar",
        "dollar index",
        "inflation data",
      ],
    },
    {
      score: 60,
      words: [
        "nvidia earnings",
        "tesla earnings",
        "apple earnings",
        "microsoft earnings",
        "nasdaq",
        "s&p 500",
        "dow jones",
      ],
    },
  ];

  const mediumRules: ScoreRule[] = [
    {
      score: 30,
      words: [
        "bitcoin",
        "ethereum",
        "crypto",
        "gold",
        "oil",
        "forex",
        "stocks",
        "treasury",
        "earnings",
        "nvidia",
        "tesla",
        "apple",
        "microsoft",
        "market",
        "trading",
      ],
    },
    {
      score: 20,
      words: [
        "etf",
        "exchange",
        "commodity",
        "analysis",
        "investors",
        "wall street",
      ],
    },
  ];

  for (const rule of criticalRules) {
    if (includesAny(text, rule.words)) score += rule.score;
  }

  for (const rule of highRules) {
    if (includesAny(text, rule.words)) score += rule.score;
  }

  for (const rule of mediumRules) {
    if (includesAny(text, rule.words)) score += rule.score;
  }

  if (
    includesAny(text, ["price rises", "price gains", "up 1%", "up 2%", "small gain"])
  ) {
    score -= 20;
  }

  return score;
}

export function detectNewsPriority(
  title: string,
  description: string
): NewsPriority {
  const score = calculateNewsScore(title, description);

  if (score >= 100) return "Critical";
  if (score >= 60) return "High";
  if (score >= 20) return "Medium";

  return "Low";
}

export function detectNewsCategory(
  title: string,
  description: string,
  fallback = "Market"
) {
  const text = `${title} ${description}`.toLowerCase();

  if (
    includesAny(text, [
      "war",
      "missile",
      "attack",
      "invasion",
      "israel",
      "iran",
      "russia",
      "ukraine",
      "china taiwan",
      "sanction",
      "tariff",
    ])
  ) {
    return "Geopolitical";
  }

  if (
    includesAny(text, [
      "fomc",
      "federal reserve",
      "fed",
      "interest rate",
      "rate hike",
      "rate cut",
      "cpi",
      "ppi",
      "nfp",
      "non-farm",
      "gdp",
      "inflation",
      "recession",
    ])
  ) {
    return "Macro";
  }

  if (
    includesAny(text, [
      "bitcoin",
      "ethereum",
      "crypto",
      "blockchain",
      "sec",
      "etf",
      "stablecoin",
      "binance",
    ])
  ) {
    return "Crypto";
  }

  if (includesAny(text, ["gold", "xauusd"])) return "Gold";

  if (includesAny(text, ["oil", "opec", "crude", "wti", "brent"])) {
    return "Oil";
  }

  if (
    includesAny(text, [
      "stock",
      "stocks",
      "nasdaq",
      "s&p",
      "dow",
      "nvidia",
      "tesla",
      "apple",
      "microsoft",
      "earnings",
    ])
  ) {
    return "Stocks";
  }

  if (
    includesAny(text, [
      "forex",
      "dollar",
      "euro",
      "yen",
      "gbp",
      "usd",
      "eur",
      "jpy",
    ])
  ) {
    return "Forex";
  }

  return fallback;
}

export function priorityRank(priority: string) {
  if (priority === "Critical") return 3;
  if (priority === "High") return 2;
  if (priority === "Medium") return 1;
  return 0;
}