"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Register failed");
        return;
      }

      alert("Register success!");
    } catch (error) {
      console.error(error);
      alert("Network or server error");
    }
  }

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)] min-h-screen flex items-center justify-center">
      <div className="bg-[var(--card)] p-8 rounded-xl border border-[var(--border)] w-96">
        <h1 className="text-2xl font-bold mb-6">Create Account</h1>

        <input
          className="w-full bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)] rounded-lg p-3 mb-4"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          onClick={handleRegister}
          className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-bold text-white"
        >
          Register
        </button>
      </div>
    </div>
  );
}