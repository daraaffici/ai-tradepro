const signals = [
  { symbol: "BTCUSDT", type: "BUY", entry: "$67,000", tp: "$69,500", sl: "$65,800", status: "Active" },
  { symbol: "ETHUSDT", type: "BUY", entry: "$1,820", tp: "$1,950", sl: "$1,760", status: "Active" },
  { symbol: "EURUSD", type: "SELL", entry: "1.0850", tp: "1.0780", sl: "1.0910", status: "Pending" },
  { symbol: "XAUUSD", type: "WAIT", entry: "-", tp: "-", sl: "-", status: "Watching" },
];

export default function SignalBox() {
  return (
    <div className="bg-[var(--card)] mt-8 rounded-2xl p-5 border border-[var(--border)]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Trading Signals</h2>
        <button className="bg-purple-600 px-4 py-2 rounded-lg text-sm">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-[var(--muted)] border-b border-[var(--border)]">
            <tr>
              <th className="text-left py-3">Symbol</th>
              <th className="text-left py-3">Signal</th>
              <th className="text-left py-3">Entry</th>
              <th className="text-left py-3">Take Profit</th>
              <th className="text-left py-3">Stop Loss</th>
              <th className="text-left py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {signals.map((signal) => (
              <tr key={signal.symbol} className="border-b border-[var(--border)]">
                <td className="py-4 font-bold">{signal.symbol}</td>

                <td
                  className={
                    signal.type === "BUY"
                      ? "text-green-400 font-bold"
                      : signal.type === "SELL"
                      ? "text-red-400 font-bold"
                      : "text-yellow-400 font-bold"
                  }
                >
                  {signal.type}
                </td>

                <td>{signal.entry}</td>
                <td className="text-green-400">{signal.tp}</td>
                <td className="text-red-400">{signal.sl}</td>
                <td className="text-[var(--muted)]">{signal.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}