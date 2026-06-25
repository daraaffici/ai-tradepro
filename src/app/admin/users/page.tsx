"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";

type User = {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/users", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setUsers(data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error(error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString("en-GB", {
      timeZone: "Asia/Phnom_Penh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const filteredUsers = users.filter((user) => {
    const text = `${user.name || ""} ${user.email} ${user.phone || ""} ${
      user.country || ""
    }`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <AuthGuard>
      <div
        className="flex min-h-screen"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <Sidebar />

        <main className="flex-1 w-full p-4 lg:p-6 overflow-x-hidden">
          <Header />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Admin Users</h1>
              <p className="text-[var(--muted)] mt-2">
                View registered users in AI TradePro.
              </p>
            </div>

            <Link
              href="/admin"
              className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-xl text-white font-bold"
            >
              ← Back Admin
            </Link>
          </div>

          <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)] mb-6">
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, phone, country..."
                className="w-full md:max-w-md bg-[var(--input)] border border-[var(--border)] p-3 rounded-xl"
              />

              <button
                onClick={loadUsers}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl text-white font-bold"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
            <h2 className="text-2xl font-bold mb-5">
              Users ({filteredUsers.length})
            </h2>

            {loading ? (
              <p className="text-[var(--muted)]">Loading users...</p>
            ) : filteredUsers.length === 0 ? (
              <p className="text-[var(--muted)]">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="p-3">ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Country</th>
                      <th className="p-3">Created</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-[var(--border)]"
                      >
                        <td className="p-3">{user.id}</td>
                        <td className="p-3 font-bold">
                          {user.name || "-"}
                        </td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">{user.phone || "-"}</td>
                        <td className="p-3">{user.country || "-"}</td>
                        <td className="p-3">{formatDate(user.createdAt)}</td>
                        <td className="p-3 text-green-400 font-bold">
                          Active
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}