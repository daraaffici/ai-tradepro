"use client";

import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AllMarkets from "@/components/AllMarkets";
import TradingViewChart from "@/components/TradingViewChart";
import ForexMarket from "@/components/ForexMarket";
import GoldMarket from "@/components/GoldMarket";
import StocksMarket from "@/components/StocksMarket";
import AuthGuard from "@/components/AuthGuard";

export default function MarketPage() {
  const [symbol, setSymbol] =
    useState("BINANCE:BTCUSDT");

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
            Live Market
          </h1>

          <div className="mb-6">
            <label className="block text-[var(--muted)] mb-2">
              Select Market
            </label>

            <select
              value={symbol}
              onChange={(e) =>
                setSymbol(e.target.value)
              }
              className="bg-[var(--input)] border border-zinc-700 px-4 py-2 rounded-lg w-full md:w-80"
            >
              <option value="BINANCE:BTCUSDT">
                BTCUSDT
              </option>

              <option value="BINANCE:ETHUSDT">
                ETHUSDT
              </option>

              <option value="BINANCE:SOLUSDT">
                SOLUSDT
              </option>

              <option value="FX:EURUSD">
                EURUSD
              </option>

              <option value="OANDA:XAUUSD">
                XAUUSD
              </option>

              <option value="NASDAQ:AAPL">
                AAPL
              </option>

              <option value="NASDAQ:TSLA">
                TSLA
              </option>

              <option value="NASDAQ:NVDA">
                NVDA
              </option>
            </select>
          </div>

          <AllMarkets />

          <div className="bg-[var(--card)] mt-8 rounded-2xl p-5 border border-[var(--border)]">
            <h2 className="text-xl font-bold mb-4">
              Global Market Chart
            </h2>

            <TradingViewChart symbol={symbol} />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}