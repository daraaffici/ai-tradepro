"use client";

import { useState } from "react";
import Link from "next/link";

const countries = [
  { name: "Cambodia", code: "+855" },
  { name: "Thailand", code: "+66" },
  { name: "Vietnam", code: "+84" },
  { name: "Singapore", code: "+65" },
  { name: "South Korea", code: "+82" },
  { name: "Japan", code: "+81" },
  { name: "United States", code: "+1" },
];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+855");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function register() {
    if (
      !name ||
      !phone ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone: `${countryCode}${phone}`,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Register successful");
        window.location.href = "/login";
      } else {
        alert(data.error || "Register failed");
      }
    } catch (error) {
      console.error(error);
      alert("Register failed");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cover bg-center p-4"
      style={{
        backgroundImage: "url('/images/market-bg.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/20 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full animate-pulse" />

      {/* Floating Symbols */}
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

      {/* Title */}
      <div className="absolute top-10 text-center w-full z-10">
        <h1 className="text-white text-4xl font-bold drop-shadow-lg">
          AI TradePro
        </h1>

        <p className="text-zinc-300 mt-2">
          Trade Smarter. Trade Faster.
        </p>
      </div>

      {/* Register Card */}
      <div className="relative z-20 w-full max-w-md bg-black/75 backdrop-blur-md border border-zinc-700 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-white text-3xl font-bold">
          Create Account
        </h2>

        <p className="text-zinc-300 mt-2 mb-6">
          Join AI TradePro
        </p>

        <div className="space-y-4">
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700"
          />

          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="bg-zinc-800 text-white p-3 rounded-lg border border-zinc-700"
            >
              {countries.map((country) => (
                <option
                  key={country.code}
                  value={country.code}
                >
                  {country.name} ({country.code})
                </option>
              ))}
            </select>

            <input
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700"
            />
          </div>

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

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-zinc-700"
          />

          <button
            onClick={register}
            className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg text-white font-bold"
          >
            Create Account
          </button>
        </div>

        <p className="text-center text-zinc-300 mt-5">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-purple-400 font-bold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}