"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AuthGuard from "@/components/AuthGuard";
import PriceAlerts from "@/components/PriceAlerts";

export default function AlertsPage() {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 p-6">
          <Header />

          <h1 className="text-3xl font-bold mb-6">
            Price Alerts
          </h1>

          <PriceAlerts />
        </main>
      </div>
    </AuthGuard>
  );
}