"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function register() {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Register success. Please login.");
      window.location.href = "/login";
    } else {
      alert(data.error || "Register failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-white p-4 relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.35),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.25),transparent_35%)]" />
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#22c55e_1px,transparent_1px),linear-gradient(to_bottom,#22c55e_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute bottom-10 left-0 right-0 h-40 opacity-30">
        <div className="h-full bg-gradient-to-r from-green-500 via-purple-500 to-red-500 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-zinc-900/90 backdrop-blur p-8 rounded-2xl border border-zinc-700 shadow-2xl">
        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
        <p className="text-zinc-400 mb-6">Join AI TradePro</p>

        <div className="space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full bg-zinc-800 p-3 rounded-lg" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-zinc-800 p-3 rounded-lg" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-zinc-800 p-3 rounded-lg" />

          <button onClick={register} className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg font-bold">
            Create Account
          </button>
        </div>

        <p className="text-center mt-5 text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-400 font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}