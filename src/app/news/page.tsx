"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";

type NewsItem = {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
  impact: "High" | "Medium" | "Low";
};

const categories = ["All", "Crypto", "Forex", "Gold", "Stocks"];

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
  if (impact === "High") return "text-red-400 font-bold";
  if (impact === "Medium") return "text-yellow-400 font-bold";
  return "text-green-400 font-bold";
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

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

      const data: NewsItem[] = await res.json();

      setNews(
        [...data].sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        )
      );
    } catch (error) {
      console.error("Failed to load news:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  }

  async function sendNewsToTelegram() {
    try {
      if (news.length === 0) {
        alert("No news to send");
        return;
      }

      setSending(true);

      const res = await fetch("/api/news/send-impact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          news,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert(`News Impact sent to Telegram ✅ (${data.sent} news)`);
      } else {
        alert(data.error || "No high impact news to send");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to send news to Telegram");
    } finally {
      setSending(false);
    }
  }

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
                Latest high-impact market news for traders.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
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

              <button
                onClick={sendNewsToTelegram}
                disabled={sending || news.length === 0}
                className="bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 px-4 py-2 rounded-xl text-white font-bold"
              >
                {sending ? "Sending..." : "Send Impact to Telegram"}
              </button>
            </div>
          </div>

          {loading ? (
            <p className="text-[var(--muted)]">Loading latest news...</p>
          ) : news.length === 0 ? (
            <p className="text-yellow-400">No high-impact news found.</p>
          ) : (
            <div className="space-y-4">
              {news.map((item, index) => (
                <div
                  key={`${item.url}-${index}`}
                  className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h2 className="font-bold text-lg">{item.title}</h2>

                      <p className="text-[var(--muted)] mt-2">
                        {item.description}
                      </p>

                      <p className="text-[var(--muted)] text-sm mt-3">
                        {item.source} • {item.category}
                      </p>

                      <p className="text-zinc-500 text-xs mt-1">
                        {formatDate(item.publishedAt)}
                      </p>
                    </div>

                    <span className={impactClass(item.impact)}>
                      {item.impact}
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