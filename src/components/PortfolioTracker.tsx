export default function PortfolioTracker() {
  const portfolio = [
    {
      symbol: "BTCUSDT",
      entry: 65000,
      current: 67216,
      quantity: 0.1,
    },
    {
      symbol: "ETHUSDT",
      entry: 1750,
      current: 1844,
      quantity: 1,
    },
  ];

  return (
    <div className="bg-[var(--input)] mt-8 rounded-xl p-5 border border-[var(--border)]">
      <h2 className="text-xl font-bold mb-4">
        Portfolio Tracker
      </h2>

      <div className="space-y-3">
        {portfolio.map((item) => {
          const pnl =
            (item.current - item.entry) * item.quantity;

          return (
            <div
              key={item.symbol}
              className="bg-zinc-950 p-4 rounded-lg flex justify-between"
            >
              <div>
                <p className="font-bold">{item.symbol}</p>
                <p className="text-sm text-[var(--muted)]">
                  Entry: ${item.entry}
                </p>
              </div>

              <div className="text-right">
                <p>${item.current}</p>

                <p
                  className={
                    pnl >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  P/L: ${pnl.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}