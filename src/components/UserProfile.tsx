"use client";

import { useEffect, useState } from "react";

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const savedAvatar = localStorage.getItem("avatar");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setAvatar(imageUrl);
      localStorage.setItem("avatar", imageUrl);
    };

    reader.readAsDataURL(file);
  }

  if (!user) return null;

  return (
    <div
      className="p-5 rounded-2xl border mb-6"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
        color: "var(--foreground)",
      }}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-[var(--input)] border border-[var(--border)] flex items-center justify-center">
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl">👤</span>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            Welcome {user.name || user.username || "Trader"} 👋
          </h2>

          <p className="mt-2" style={{ color: "var(--muted)" }}>
            Email: {user.email}
          </p>

          <label className="inline-block mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg cursor-pointer text-sm">
            Upload Avatar
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}