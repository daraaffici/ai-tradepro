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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const savedAvatar = localStorage.getItem("avatar");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  return (
    <aside
      className="hidden lg:block w-64 min-h-screen border-r p-4"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
        color: "var(--foreground)",
      }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold">AI TradePro</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          AI Market Analysis
        </p>
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
            <p
              className="text-xs truncate"
              style={{ color: "var(--muted)" }}
            >
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
}