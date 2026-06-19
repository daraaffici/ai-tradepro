type MarketItem = {
  symbol: string;
  price: string;
  change: string;
};

export default function MarketSection({
  title,
  items,
}: {
  title: string;
  items: MarketItem[];
}) {
  return (
    <div className="bg-[var(--input)] p-5 rounded-xl border border-[var(--border)]">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.symbol}
            className="flex justify-between"
          >
            <span>{item.symbol}</span>
            <span>{item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}