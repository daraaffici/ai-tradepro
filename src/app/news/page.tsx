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
  impact: string;
};

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    loadNews();

    const interval = setInterval(() => {
      loadNews();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  async function loadNews() {
    try {
      const res = await fetch("/api/news");
      const data: NewsItem[] = await res.json();

      setNews((prev) => {
        const allNews = [...data, ...prev];

        return allNews.filter(
          (item, index, self) =>
            index === self.findIndex((n) => n.url === item.url)
        );
      });
    } catch (error) {
      console.error("Failed to load news:", error);
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

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">News & Impact</h1>

            <button
              onClick={loadNews}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
            >
              Refresh News
            </button>
          </div>

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

                    <p className="text-zinc-600 text-xs mt-1">
                      {new Date(item.publishedAt).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={
                      item.impact === "High"
                        ? "text-red-400 font-bold"
                        : "text-yellow-400 font-bold"
                    }
                  >
                    {item.impact}
                  </span>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-purple-400 hover:text-purple-300"
                >
                  Read more →
                </a>
              </div>
            ))}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}