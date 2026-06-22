"use client";

import { useState } from "react";
import Link from "next/link";
import AnimatedMarketBackground from "@/components/AnimatedMarketBackground";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/";
    } else {
      alert(data.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center text-white p-4 overflow-hidden bg-black">
      <AnimatedMarketBackground />

      <div className="relative z-10 w-full max-w-md bg-zinc-900/90 backdrop-blur-md p-8 rounded-2xl border border-zinc-700 shadow-2xl">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-zinc-400 mb-6">Login to AI TradePro</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button onClick={() => alert("Google OAuth will be added later.")} className="bg-white text-black p-3 rounded-lg font-bold">
            Google
          </button>

          <button onClick={() => alert("Facebook OAuth will be added later.")} className="bg-blue-600 p-3 rounded-lg font-bold">
            Facebook
          </button>
        </div>

        <div className="space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-zinc-800 p-3 rounded-lg outline-none" />

          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-zinc-800 p-3 rounded-lg outline-none" />

          <button onClick={login} className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg font-bold">
            Login
          </button>
        </div>

        <p className="text-center mt-5 text-sm text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-purple-400 font-bold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}