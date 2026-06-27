"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminMenus = [
  { name: "Dashboard", href: "/admin", icon: "📊" },
  { name: "Users", href: "/admin/users", icon: "👥" },
  { name: "Trades", href: "/admin/trades", icon: "📈" },
  { name: "Analytics", href: "/admin/analytics", icon: "📉" },
  { name: "Activity Logs", href: "/admin/logs", icon: "📝" },
  { name: "System", href: "/admin/system", icon: "⚙️" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-black border-r border-zinc-800 p-5 hidden lg:block">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">AI TradePro</h1>
        <p className="text-sm text-zinc-400 mt-1">Admin Panel</p>
      </div>

      <nav className="space-y-2">
        {adminMenus.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-600 text-white font-bold"
                  : "flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:bg-zinc-800"
              }
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-6 border-t border-zinc-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:bg-zinc-800"
        >
          🏠 Back to App
        </Link>
      </div>
    </aside>
  );
}