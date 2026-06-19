"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  async function handleLogin() {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));
    alert("Login success!");
    router.push("/");
  }

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex items-center justify-center">
      <div className="bg-[var(--card)] p-8 rounded-xl border border-[var(--border)] w-96">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        <input
          className="w-full bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)] rounded-lg p-3 mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)] rounded-lg p-3 mb-4"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-bold text-white"
        >
          Login
        </button>
      </div>
    </div>
  );
}