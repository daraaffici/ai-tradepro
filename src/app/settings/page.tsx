"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";

export default function SettingsPage() {
  const [language, setLanguage] = useState("English");
  const [theme, setTheme] = useState("Dark");

  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "English";
    const savedTheme = localStorage.getItem("theme") || "Dark";
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    setLanguage(savedLanguage);
    setTheme(savedTheme);
    setProfileName(user.name || "");
    setProfileEmail(user.email || "");
  }, []);

  function saveLanguage(value: string) {
    setLanguage(value);
    localStorage.setItem("language", value);
  }

  function saveTheme(value: string) {
    setTheme(value);
    localStorage.setItem("theme", value);

    if (value === "Light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  }

  async function saveProfile() {
    if (!profileName || !profileEmail) {
      alert("Please fill name and email");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const res = await fetch("/api/profile/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        name: profileName,
        email: profileEmail,
      }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Profile updated successfully");
      window.location.reload();
    } else {
      alert(data.error || "Failed to update profile");
    }
  }

  async function changePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const res = await fetch("/api/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        currentPassword,
        newPassword,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Password changed successfully. Please login again.");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } else {
      alert(data.message || "Failed to change password");
    }
  }

  function logout() {
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  return (
    <AuthGuard>
      <div
        className="flex min-h-screen"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <Sidebar />

        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          <Header />

          <h1 className="text-3xl font-bold mb-6">Settings</h1>

          <div className="grid gap-6">
            <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

              <div className="space-y-3">
                <input
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Name"
                  className="w-full bg-[var(--input)] p-3 rounded-lg"
                />

                <input
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-[var(--input)] p-3 rounded-lg"
                />

                <button
                  onClick={saveProfile}
                  className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-lg font-bold text-white"
                >
                  Save Profile
                </button>
              </div>
            </div>

            <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
              <h2 className="text-xl font-bold mb-4">Language</h2>

              <select
                value={language}
                onChange={(e) => saveLanguage(e.target.value)}
                className="bg-[var(--input)] p-3 rounded-lg w-full"
              >
                <option>English</option>
                <option>Khmer</option>
              </select>
            </div>

            <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
              <h2 className="text-xl font-bold mb-4">Theme</h2>

              <select
                value={theme}
                onChange={(e) => saveTheme(e.target.value)}
                className="bg-[var(--input)] p-3 rounded-lg w-full"
              >
                <option>Dark</option>
                <option>Light</option>
              </select>
            </div>

            <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
              <h2 className="text-xl font-bold mb-4">Change Password</h2>

              <div className="space-y-3">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current Password"
                  className="w-full bg-[var(--input)] p-3 rounded-lg"
                />

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full bg-[var(--input)] p-3 rounded-lg"
                />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className="w-full bg-[var(--input)] p-3 rounded-lg"
                />

                <button
                  onClick={changePassword}
                  className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-lg font-bold text-white"
                >
                  Change Password
                </button>
              </div>
            </div>

            <div className="bg-[var(--card)] p-5 rounded-2xl border border-[var(--border)]">
              <h2 className="text-xl font-bold mb-4">Account</h2>

              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg font-bold text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}