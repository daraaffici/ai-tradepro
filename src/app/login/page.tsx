"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/";
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cover bg-center p-4"
      style={{
        backgroundImage: "url('/images/market-bg.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/70" />

      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/20 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full animate-pulse" />

      <div className="absolute top-24 left-12 text-green-400 text-5xl font-bold animate-bounce">
        ₿
      </div>

      <div className="absolute top-40 right-16 text-blue-400 text-4xl font-bold animate-pulse">
        Ξ
      </div>

      <div className="absolute bottom-28 left-16 text-yellow-400 text-4xl animate-bounce">
        📈
      </div>

      <div className="absolute bottom-40 right-12 text-green-400 text-4xl animate-pulse">
        🚀
      </div>

      <div className="absolute top-10 text-center w-full z-10">
        <h1 className="text-white text-4xl font-bold drop-shadow-lg">
          AI TradePro
        </h1>

        <p className="text-zinc-300 mt-2">
          Trade Smarter. Trade Faster.
        </p>
      </div>

      <div className="relative z-20 w-full max-w-md bg-black/75 backdrop-blur-md border border-zinc-700 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-white text-3xl font-bold">Welcome Back</h2>

        <p className="text-zinc-300 mt-2 mb-6">Login to your account</p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700"
          />

          <button
            onClick={login}
            className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg text-white font-bold"
          >
            Login
          </button>
        </div>

        <p className="text-center text-zinc-300 mt-5">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-purple-400 font-bold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}