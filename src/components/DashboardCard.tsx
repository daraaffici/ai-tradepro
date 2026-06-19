type Props = {
  title: string;
  value: string;
};

export default function DashboardCard({
  title,
  value,
}: Props) {
  return (
    <div className="bg-[var(--input)] rounded-xl p-5 border border-[var(--border)]">

      <h3 className="text-[var(--muted)]">
        {title}
      </h3>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>

    </div>
  );
}