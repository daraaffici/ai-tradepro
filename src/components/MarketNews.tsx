const news = [
  {
    title: "Bitcoin breaks above $67K as ETF inflows increase",
    impact: "High",
  },
  {
    title: "Federal Reserve signals possible rate cuts",
    impact: "Medium",
  },
  {
    title: "Gold prices surge amid market uncertainty",
    impact: "High",
  },
  {
    title: "NVIDIA stock hits new all-time high",
    impact: "Low",
  },
];

export default function MarketNews() {
  return (
    <div className="bg-[var(--card)] mt-8 rounded-2xl p-5 border border-[var(--border)]">
      <h2 className="text-xl font-bold mb-4">
        News & Market Impact
      </h2>

      <div className="space-y-4">
        {news.map((item, index) => (
          <div
            key={index}
            className="border-b border-[var(--border)] pb-4"
          >
            <div className="flex justify-between items-center">
              <p className="font-medium">{item.title}</p>

              <span
                className={
                  item.impact === "High"
                    ? "text-red-400"
                    : item.impact === "Medium"
                    ? "text-yellow-400"
                    : "text-green-400"
                }
              >
                {item.impact}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}