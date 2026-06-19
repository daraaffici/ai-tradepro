"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", href: "/", icon: "🏠" },
  { name: "Live Market", href: "/market", icon: "📈" },
  { name: "AI Analysis", href: "/analysis", icon: "🤖" },
  { name: "Trading Signals", href: "/signals", icon: "⚡" },
  { name: "Portfolio", href: "/portfolio", icon: "💼" },
  { name: "Watchlist", href: "/watchlist", icon: "⭐" },
  { name: "Trade Journal", href: "/trades", icon: "📝" },
  { name: "Performance", href: "/performance", icon: "🏆" },
  { name: "News", href: "/news", icon: "📰" },
  { name: "Calendar", href: "/calendar", icon: "📅" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [avatar, setAvatar] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const savedAvatar = localStorage.getItem("avatar");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  function closeMenu() {
    setOpen(false);
  }

  const SidebarContent = (
    <aside
      className="w-64 min-h-screen border-r p-4 overflow-y-auto"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
        color: "var(--foreground)",
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">AI TradePro</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            AI Market Analysis
          </p>
        </div>

        <button
          onClick={closeMenu}
          className="lg:hidden bg-[var(--input)] px-3 py-2 rounded-lg"
        >
          ✕
        </button>
      </div>

      <div
        className="mb-6 p-4 rounded-2xl border"
        style={{
          backgroundColor: "var(--input)",
          borderColor: "var(--border)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-[var(--border)] flex items-center justify-center">
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl">👤</span>
            )}
          </div>

          <div className="min-w-0">
            <p className="font-bold truncate">
              {user?.name || user?.username || "Trader"}
            </p>
            <p className="text-xs truncate" style={{ color: "var(--muted)" }}>
              {user?.email || "No email"}
            </p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={closeMenu}
              className={
                active
                  ? "flex items-center gap-3 bg-purple-700 text-white px-4 py-3 rounded-xl font-semibold"
                  : "flex items-center gap-3 px-4 py-3 rounded-xl transition hover:bg-zinc-700/20"
              }
              style={{
                color: active ? "#ffffff" : "var(--foreground)",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 bg-gradient-to-r from-purple-700 to-pink-600 p-4 rounded-xl text-white">
        <p className="font-bold">Pro Dashboard</p>
        <p className="text-sm mt-2">
          Live markets, AI signals, and trading journal.
        </p>
      </div>
    </aside>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-[99999] bg-purple-600 text-white px-4 py-2 rounded-xl font-bold shadow-2xl"
      >
        ☰ Menu
      </button>

      <div className="hidden lg:block">{SidebarContent}</div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div>{SidebarContent}</div>

          <button
            aria-label="Close menu"
            onClick={closeMenu}
            className="flex-1 bg-black/60"
          />
        </div>
      )}
    </>
  );
}