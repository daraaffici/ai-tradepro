type Props = {
  symbol: string;
  price: string;
  change: string;
};

export default function MarketCard({
  symbol,
  price,
  change,
}: Props) {
  return (
    <div className="bg-[var(--input)] p-5 rounded-xl border border-[var(--border)]">
      <h3 className="text-[var(--muted)]">{symbol}</h3>

      <p className="text-2xl font-bold mt-2">
        {price}
      </p>

      <p className="text-green-400 mt-2">
        {change}
      </p>
    </div>
  );
}