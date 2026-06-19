export default function Header() {
  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
      <div>
        <h1
          className="text-3xl font-bold"
          style={{ color: "var(--foreground)" }}
        >
          Welcome Back 👋
        </h1>

        <p style={{ color: "var(--muted)" }}>
          AI Trading Dashboard
        </p>

        <p className="text-green-400 text-sm">
          ● Live Data (Auto Refresh 30s)
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
        <input
          placeholder="Search Markets..."
          className="bg-[var(--input)] border border-[var(--border)] px-4 py-2 rounded-lg w-full lg:w-72"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        />

        <button className="bg-purple-600 px-4 py-2 rounded-lg text-[var(--foreground)]">
          Upgrade Pro
        </button>
      </div>
    </div>
  );
}