type AdminCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export default function AdminCard({
  title,
  value,
  subtitle,
}: AdminCardProps) {
  return (
    <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
      <p className="text-[var(--muted)] text-sm">{title}</p>

      <h2 className="text-3xl font-bold mt-3">{value}</h2>

      {subtitle && (
        <p className="text-[var(--muted)] text-sm mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}