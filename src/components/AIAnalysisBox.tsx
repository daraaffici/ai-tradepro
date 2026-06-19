export default function AIAnalysisBox() {
  return (
    <div className="bg-[var(--input)] mt-8 rounded-xl p-5 border border-[var(--border)]">
      <h2 className="text-xl font-bold mb-4">AI Market Analysis</h2>

      <div className="space-y-3 text-sm">
        <p><span className="text-[var(--muted)]">Trend:</span> <span className="text-green-400">Bullish</span></p>
        <p><span className="text-[var(--muted)]">Support:</span> $66,000</p>
        <p><span className="text-[var(--muted)]">Resistance:</span> $68,500</p>
        <p><span className="text-[var(--muted)]">Risk Level:</span> Medium</p>
        <p><span className="text-[var(--muted)]">Signal:</span> Buy on Pullback</p>
      </div>
    </div>
  );
}