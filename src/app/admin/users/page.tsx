"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";
import AdminGuard from "@/components/AdminGuard";
import AdminSidebar from "@/components/AdminSidebar";

type User = {
  id: number;
  name: string | null;
  email: string;
  role: string;
  status: string;
  phone?: string | null;
  country?: string | null;
  lastLogin?: string | null;
  createdAt: string;
};

type UserDetails = User & {
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  winRate: number;
  totalProfit: number;
  portfolios: number;
  watchlists: number;
};

function money(value: number) {
  const sign = value >= 0 ? "" : "-";
  return `${sign}$${Math.abs(value).toFixed(2)}`;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await res.json();

      setUsers(data.success ? data.users : []);
    } catch (error) {
      console.error(error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  async function viewUser(id: number) {
    const res = await fetch(`/api/admin/users/${id}`, { cache: "no-store" });
    const data = await res.json();

    if (data.success) {
      setSelectedUser(data.user);
    } else {
      alert(data.error || "Failed to load user");
    }
  }

  async function updateUser(user: User) {
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await res.json();

    if (data.success) {
      alert("User updated ✅");
      setEditingUser(null);
      loadUsers();
    } else {
      alert(data.error || "Failed to update user");
    }
  }

  async function toggleStatus(user: User) {
    const nextStatus = user.status === "Active" ? "Disabled" : "Active";

    if (!confirm(`Change ${user.email} to ${nextStatus}?`)) return;

    await updateUser({
      ...user,
      status: nextStatus,
    });
  }

  async function toggleRole(user: User) {
    const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";

    if (!confirm(`Change ${user.email} role to ${nextRole}?`)) return;

    await updateUser({
      ...user,
      role: nextRole,
    });
  }

  async function deleteUser(user: User) {
    if (
      !confirm(
        `Delete user ${user.email}?\n\nThis will also delete their trades, portfolio, and watchlist.`
      )
    ) {
      return;
    }

    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("User deleted ✅");
      loadUsers();
    } else {
      alert(data.error || "Failed to delete user");
    }
  }

  function formatDate(date?: string | null) {
    if (!date) return "-";

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
    } ${user.role} ${user.status}`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <AuthGuard>
      <AdminGuard>
        <div
          className="flex min-h-screen"
          style={{
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
          }}
        >
          <AdminSidebar />

          <main className="flex-1 w-full p-4 lg:p-6 overflow-x-hidden">
            <Header />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold">Admin Users</h1>
                <p className="text-[var(--muted)] mt-2">
                  Manage users, roles, status, and account details.
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
                  placeholder="Search name, email, phone, country, role..."
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
                        <th className="p-3">Role</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Last Login</th>
                        <th className="p-3">Created</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-[var(--border)]"
                        >
                          <td className="p-3">{user.id}</td>
                          <td className="p-3 font-bold">{user.name || "-"}</td>
                          <td className="p-3">{user.email}</td>

                          <td
                            className={
                              user.role === "ADMIN"
                                ? "p-3 text-purple-400 font-bold"
                                : "p-3 text-[var(--muted)]"
                            }
                          >
                            {user.role}
                          </td>

                          <td
                            className={
                              user.status === "Active"
                                ? "p-3 text-green-400 font-bold"
                                : "p-3 text-red-400 font-bold"
                            }
                          >
                            {user.status}
                          </td>

                          <td className="p-3">{formatDate(user.lastLogin)}</td>
                          <td className="p-3">{formatDate(user.createdAt)}</td>

                          <td className="p-3">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => viewUser(user.id)}
                                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-white text-sm"
                              >
                                View
                              </button>

                              <button
                                onClick={() => setEditingUser(user)}
                                className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded-lg text-white text-sm"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => toggleRole(user)}
                                className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-lg text-white text-sm"
                              >
                                Role
                              </button>

                              <button
                                onClick={() => toggleStatus(user)}
                                className="bg-zinc-600 hover:bg-zinc-700 px-3 py-1 rounded-lg text-white text-sm"
                              >
                                {user.status === "Active"
                                  ? "Disable"
                                  : "Enable"}
                              </button>

                              <button
                                onClick={() => deleteUser(user)}
                                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-white text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {selectedUser && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-lg">
                  <h2 className="text-2xl font-bold mb-4">User Details</h2>

                  <div className="space-y-2 text-sm">
                    <p><b>ID:</b> {selectedUser.id}</p>
                    <p><b>Name:</b> {selectedUser.name || "-"}</p>
                    <p><b>Email:</b> {selectedUser.email}</p>
                    <p><b>Role:</b> {selectedUser.role}</p>
                    <p><b>Status:</b> {selectedUser.status}</p>
                    <p><b>Phone:</b> {selectedUser.phone || "-"}</p>
                    <p><b>Country:</b> {selectedUser.country || "-"}</p>
                    <p><b>Last Login:</b> {formatDate(selectedUser.lastLogin)}</p>
                    <p><b>Created:</b> {formatDate(selectedUser.createdAt)}</p>

                    <hr className="border-[var(--border)] my-3" />

                    <p><b>Total Trades:</b> {selectedUser.totalTrades}</p>
                    <p><b>Open Trades:</b> {selectedUser.openTrades}</p>
                    <p><b>Closed Trades:</b> {selectedUser.closedTrades}</p>
                    <p><b>Win Rate:</b> {selectedUser.winRate}%</p>
                    <p><b>Total Profit:</b> {money(selectedUser.totalProfit)}</p>
                    <p><b>Portfolio Assets:</b> {selectedUser.portfolios}</p>
                    <p><b>Watchlist Symbols:</b> {selectedUser.watchlists}</p>
                  </div>

                  <button
                    onClick={() => setSelectedUser(null)}
                    className="mt-5 bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-xl text-white font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {editingUser && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-lg">
                  <h2 className="text-2xl font-bold mb-4">Edit User</h2>

                  <div className="space-y-3">
                    <input
                      value={editingUser.name || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          name: e.target.value,
                        })
                      }
                      placeholder="Name"
                      className="w-full bg-[var(--input)] border border-[var(--border)] p-3 rounded-xl"
                    />

                    <input
                      value={editingUser.email}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          email: e.target.value,
                        })
                      }
                      placeholder="Email"
                      className="w-full bg-[var(--input)] border border-[var(--border)] p-3 rounded-xl"
                    />

                    <input
                      value={editingUser.phone || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          phone: e.target.value,
                        })
                      }
                      placeholder="Phone"
                      className="w-full bg-[var(--input)] border border-[var(--border)] p-3 rounded-xl"
                    />

                    <input
                      value={editingUser.country || ""}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          country: e.target.value,
                        })
                      }
                      placeholder="Country"
                      className="w-full bg-[var(--input)] border border-[var(--border)] p-3 rounded-xl"
                    />

                    <select
                      value={editingUser.role}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          role: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-800 text-white border border-zinc-700 p-3 rounded-xl"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>

                    <select
                      value={editingUser.status}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          status: e.target.value,
                        })
                      }
                      className="w-full bg-zinc-800 text-white border border-zinc-700 p-3 rounded-xl"
                    >
                      <option value="Active">Active</option>
                      <option value="Disabled">Disabled</option>
                    </select>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => updateUser(editingUser)}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl text-white font-bold"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingUser(null)}
                      className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-xl text-white font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </AdminGuard>
    </AuthGuard>
  );
}