"use client";

import { useState } from "react";
import Link from "next/link";
import AnimatedMarketBackground from "@/components/AnimatedMarketBackground";

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
    <div className="min-h-screen relative flex items-center justify-center text-white p-4 overflow-hidden bg-black">
      <AnimatedMarketBackground />

      <div className="relative z-10 w-full max-w-md bg-zinc-900/90 backdrop-blur-md p-8 rounded-2xl border border-zinc-700 shadow-2xl">
        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
        <p className="text-zinc-400 mb-6">Join AI TradePro</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button onClick={() => alert("Google OAuth will be added later.")} className="bg-white text-black p-3 rounded-lg font-bold">
            Google
          </button>

          <button onClick={() => alert("Facebook OAuth will be added later.")} className="bg-blue-600 p-3 rounded-lg font-bold">
            Facebook
          </button>
        </div>

        <div className="space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full bg-zinc-800 p-3 rounded-lg outline-none" />

          <div className="flex gap-2">
            <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="bg-zinc-800 p-3 rounded-lg w-32 outline-none">
              {countries.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name} {item.code}
                </option>
              ))}
            </select>

            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="w-full bg-zinc-800 p-3 rounded-lg outline-none" />
          </div>

          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full bg-zinc-800 p-3 rounded-lg outline-none" />

          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full bg-zinc-800 p-3 rounded-lg outline-none" />

          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="w-full bg-zinc-800 p-3 rounded-lg outline-none" />

          <button onClick={register} className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg font-bold">
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