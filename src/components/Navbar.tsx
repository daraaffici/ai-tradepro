export default function Navbar() {
  return (
    <div className="flex justify-between items-center">

      <div>
        <h2 className="text-3xl font-bold">
          Dashboard
        </h2>

        <p className="text-[var(--muted)]">
          AI Trading Intelligence
        </p>
      </div>

      <input
        className="bg-zinc-800 rounded-lg px-4 py-2"
        placeholder="Search market..."
      />

    </div>
  );
}