export default function FearGreedIndex() {
  const value = 74;

  return (
    <div className="bg-[var(--card)] mt-8 rounded-2xl p-5 border border-[var(--border)]">
      <h2 className="text-xl font-bold mb-4">Fear & Greed Index</h2>

      <div className="flex items-center gap-6">
        <div className="w-32 h-32 rounded-full border-8 border-green-500 flex items-center justify-center">
          <span className="text-3xl font-bold">{value}</span>
        </div>

        <div>
          <p className="text-green-400 text-xl font-bold">Greed</p>
          <p className="text-[var(--muted)] text-sm mt-2">
            Market sentiment is currently positive.
          </p>
        </div>
      </div>
    </div>
  );
}