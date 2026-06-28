"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";

type NewsImpact = "Critical" | "High" | "Medium";

type NewsItem = {
  id?: number;
  title: string;
  description: string | null;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
  impact: NewsImpact;
};

const categories = ["All", "Crypto", "Forex", "Gold", "Stocks", "Oil", "Macro", "Geopolitical"];

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-GB", {
    timeZone: "Asia/Phnom_Penh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function impactClass(impact: string) {
  if (impact === "Critical") return "text-red-500 font-bold";
  if (impact === "High") return "text-orange-400 font-bold";
  return "text-yellow-400 font-bold";
}

function impactLabel(impact: string) {
  if (impact === "Critical") return "🔴 Critical";
  if (impact === "High") return "🟠 High";
  return "🟡 Medium";
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();

    const interval = setInterval(loadNews, 60000);
    return () => clearInterval(interval);
  }, [category]);

  async function loadNews() {
    try {
      setLoading(true);

      const res = await fetch(`/api/news?category=${category}`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setNews(
          data.sort(
            (a: NewsItem, b: NewsItem) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime()
          )
        );
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error("Failed to load news:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredNews = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return news;

    return news.filter((item) => {
      const text = `${item.title} ${item.description || ""} ${item.source} ${
        item.category
      } ${item.impact}`.toLowerCase();

      return text.includes(keyword);
    });
  }, [news, search]);

  return (
    <AuthGuard>
      <div
        className="flex min-h-screen"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <Sidebar />

        <main className="flex-1 w-full p-4 lg:p-6 overflow-x-hidden">
          <Header />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">News & Impact</h1>
              <p className="text-[var(--muted)] mt-2">
                Critical, high, and medium impact market news for traders.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search news..."
                className="bg-zinc-800 text-white px-4 py-2 rounded-xl border border-zinc-700"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-zinc-800 text-white px-4 py-2 rounded-xl border border-zinc-700"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <button
                onClick={loadNews}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 px-4 py-2 rounded-xl text-white font-bold"
              >
                {loading ? "Loading..." : "Refresh News"}
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-[var(--muted)]">Loading latest news...</p>
          ) : filteredNews.length === 0 ? (
            <p className="text-yellow-400">
              No Critical, High, or Medium impact news found.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredNews.map((item, index) => (
                <div
                  key={item.id || `${item.url}-${index}`}
                  className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h2 className="font-bold text-lg">{item.title}</h2>

                      <p className="text-[var(--muted)] mt-2">
                        {item.description || "No description available."}
                      </p>

                      <p className="text-[var(--muted)] text-sm mt-3">
                        {item.source} • {item.category}
                      </p>

                      <p className="text-zinc-500 text-xs mt-1">
                        {formatDate(item.publishedAt)}
                      </p>
                    </div>

                    <span className={impactClass(item.impact)}>
                      {impactLabel(item.impact)}
                    </span>
                  </div>

                  {item.url !== "#" && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-purple-400 hover:text-purple-300"
                    >
                      Read more →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}