"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";
import RiskManager from "@/components/RiskManager";

export default function RiskPage() {
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

        <main className="flex-1 w-full p-4 lg:p-6 overflow-x-hidden">
          <Header />

          <h1 className="text-3xl font-bold mb-6">AI Risk Manager</h1>

          <RiskManager />
        </main>
      </div>
    </AuthGuard>
  );
}