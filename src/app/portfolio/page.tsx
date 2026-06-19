"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

import PortfolioSummary from "@/components/PortfolioSummary";
import PortfolioAnalytics from "@/components/PortfolioAnalytics";
import PortfolioAllocation from "@/components/PortfolioAllocation";
import PortfolioList from "@/components/PortfolioList";
import AddPortfolioForm from "@/components/AddPortfolioForm";
import AuthGuard from "@/components/AuthGuard";

export default function PortfolioPage() {
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

          <h1 className="text-3xl font-bold mb-6">
            Portfolio Management
          </h1>

          <PortfolioSummary />

          <PortfolioAnalytics />

          <PortfolioAllocation />

          <PortfolioList />

          <AddPortfolioForm />
        </main>
      </div>
    </AuthGuard>
  );
}