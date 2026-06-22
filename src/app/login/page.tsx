"use client";

import { useState } from "react";
import Link from "next/link";

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

  function socialLogin(provider: string) {
    alert(`${provider} login will be added later with OAuth.`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-white p-4 relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,197,94,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,197,94,0.22)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.35),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.25),transparent_35%)]" />

      <div className="absolute inset-0 opacity-40">
        <div className="market-line market-line-1" />
        <div className="market-line market-line-2" />
        <div className="market-line market-line-3" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-zinc-900/90 backdrop-blur p-8 rounded-2xl border border-zinc-700 shadow-2xl">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-zinc-400 mb-6">Login to AI TradePro</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button onClick={() => socialLogin("Google")} className="bg-white text-black p-3 rounded-lg font-bold">
            Google
          </button>
          <button onClick={() => socialLogin("Facebook")} className="bg-blue-600 p-3 rounded-lg font-bold">
            Facebook
          </button>
        </div>

        <div className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full bg-zinc-800 p-3 rounded-lg"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-zinc-800 p-3 rounded-lg"
          />

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

      <style jsx>{`
        .market-line {
          position: absolute;
          left: -10%;
          width: 120%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #22c55e, #a855f7, transparent);
          animation: moveMarket 5s linear infinite;
        }

        .market-line-1 {
          top: 30%;
          transform: rotate(-8deg);
        }

        .market-line-2 {
          top: 55%;
          transform: rotate(6deg);
          animation-delay: 1s;
        }

        .market-line-3 {
          top: 75%;
          transform: rotate(-4deg);
          animation-delay: 2s;
        }

        @keyframes moveMarket {
          0% {
            transform: translateX(-20%) scaleX(0.8);
            opacity: 0.2;
          }
          50% {
            opacity: 0.9;
          }
          100% {
            transform: translateX(20%) scaleX(1.2);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}