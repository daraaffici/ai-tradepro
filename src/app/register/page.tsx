"use client";

import { useState } from "react";
import Link from "next/link";

const countries = [
  { name: "Cambodia", code: "+855" },
  { name: "United States", code: "+1" },
  { name: "Thailand", code: "+66" },
  { name: "Vietnam", code: "+84" },
  { name: "China", code: "+86" },
  { name: "Japan", code: "+81" },
  { name: "South Korea", code: "+82" },
  { name: "Singapore", code: "+65" },
];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+855");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function register() {
    if (!name || !phone || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone: `${countryCode}${phone}`,
        email,
        password,
      }),
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
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,197,94,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,197,94,0.18)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.45),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.35),transparent_35%)]" />

      <div className="absolute inset-0 opacity-70">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className="absolute bottom-20 w-2 rounded-full animate-pulse"
            style={{
              left: `${i * 3.3}%`,
              height: `${40 + ((i * 37) % 180)}px`,
              backgroundColor: i % 2 === 0 ? "#22c55e" : "#ef4444",
              animationDelay: `${(i % 8) * 0.2}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute left-0 right-0 top-1/2 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse opacity-80" />

      <div className="relative z-10 w-full max-w-md bg-zinc-900/90 backdrop-blur p-8 rounded-2xl border border-zinc-700 shadow-2xl">
        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
        <p className="text-zinc-400 mb-6">Join AI TradePro</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => alert("Google OAuth will be added later.")}
            className="bg-white text-black p-3 rounded-lg font-bold"
          >
            Google
          </button>

          <button
            onClick={() => alert("Facebook OAuth will be added later.")}
            className="bg-blue-600 p-3 rounded-lg font-bold"
          >
            Facebook
          </button>
        </div>

        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full bg-zinc-800 p-3 rounded-lg"
          />

          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="bg-zinc-800 p-3 rounded-lg w-32"
            >
              {countries.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name} {item.code}
                </option>
              ))}
            </select>

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="w-full bg-zinc-800 p-3 rounded-lg"
            />
          </div>

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

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full bg-zinc-800 p-3 rounded-lg"
          />

          <button
            onClick={register}
            className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg font-bold"
          >
            Create Account
          </button>
        </div>

        <p className="text-center mt-5 text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-400 font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}