"use client";

import { useEffect, useState } from "react";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      window.location.href = "/login";
      return;
    }

    const user = JSON.parse(userData);

    if (user.role !== "ADMIN") {
      alert("Admin access only");
      window.location.href = "/";
      return;
    }

    setAllowed(true);
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Checking admin access...
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}