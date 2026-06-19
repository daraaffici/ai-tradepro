"use client";

import { useEffect, useState } from "react";

type Trade = {
  id: number;
  symbol: string;
  type: string;
  entry: number;
  takeProfit: number;
  stopLoss: number;
  lotSize: number;
  closePrice?: number | null;
  profit?: number | null;
  status: string;
};

const marketSymbols = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "XAUUSD",
  "AAPL",
  "TSLA",
  "NVDA",
];

const lotSizes = ["0.01", "0.05", "0.10", "0.25", "0.50", "1", "2", "5", "10"];

export default function TradeJournal() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});

  const [symbol, setSymbol] = useState("BTCUSDT");
  const [type, setType] = useState("BUY");
  const [entry, setEntry] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [lotSize, setLotSize] = useState("1");

  useEffect(() => {
    loadTrades();
  }, []);

  useEffect(() => {
    loadPrice(symbol);

    const interval = setInterval(() => {
      loadPrice(symbol);
      loadTrades();
    }, 10000);

    return () => clearInterval(interval);
  }, [symbol]);

  async function loadTrades() {
    const res = await fetch("/api/trades", { cache: "no-store" });
    const data: Trade[] = await res.json();

    setTrades(data);

    for (const trade of data) {
      loadPrice(trade.symbol);
    }
  }

  async function loadPrice(selectedSymbol: string) {
    try {
      const res = await fetch(
        `/api/market/all-price?symbol=${selectedSymbol}`,
        { cache: "no-store" }
      );

      const data = await res.json();

      if (data.price) {
        const price = Number(data.price);

        setPrices((prev) => ({
          ...prev,
          [selectedSymbol]: price,
        }));

        if (selectedSymbol === symbol && !entry) {
          setEntry(price.toString());
        }
      }
    } catch (error) {
      console.error("Failed to load price:", error);
    }
  }

  function calcProfit(
    tradeType: string,
    entryPrice: number,
    currentPrice: number,
    lot: number
  ) {
    if (!entryPrice || !currentPrice || !lot) return 0;

    if (tradeType === "BUY") {
      return (currentPrice - entryPrice) * lot;
    }

    return (entryPrice - currentPrice) * lot;
  }

  async function addTrade() {
    if (!entry || !takeProfit || !stopLoss || !lotSize) {
      alert("Please fill Entry, Take Profit, Stop Loss, and Lot Size");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const res = await fetch("/api/trades/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symbol,
        type,
        entry: Number(entry),
        takeProfit: Number(takeProfit),
        stopLoss: Number(stopLoss),
        lotSize: Number(lotSize),
        userId: user.id,
      }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Trade Added!");
      setEntry("");
      setTakeProfit("");
      setStopLoss("");
      setLotSize("1");
      loadTrades();
    }
  }

  async function deleteTrade(id: number) {
    await fetch("/api/trades/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    setTrades((prev) => prev.filter((x) => x.id !== id));
  }

  async function closePosition(id: number) {
    await fetch("/api/trades/close", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    loadTrades();
  }

  const selectedCurrentPrice = prices[symbol] || 0;

  const formLiveProfit = calcProfit(
    type,
    Number(entry),
    selectedCurrentPrice,
    Number(lotSize)
  );

  return (
    <div className="bg-[var(--card)] mt-8 p-5 rounded-2xl border border-[var(--border)]">
      <h2 className="text-xl font-bold mb-4">Trade Journal</h2>

      <div className="grid md:grid-cols-6 gap-3 mb-4">
        <select
          value={symbol}
          onChange={(e) => {
            setSymbol(e.target.value);
            setEntry("");
          }}
          className="bg-[var(--input)] p-3 rounded-lg"
        >
          {marketSymbols.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="bg-[var(--input)] p-3 rounded-lg"
        >
          <option>BUY</option>
          <option>SELL</option>
        </select>

        <input
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Entry"
          className="bg-[var(--input)] p-3 rounded-lg"
        />

        <input
          value={takeProfit}
          onChange={(e) => setTakeProfit(e.target.value)}
          placeholder="Take Profit"
          className="bg-[var(--input)] p-3 rounded-lg"
        />

        <input
          value={stopLoss}
          onChange={(e) => setStopLoss(e.target.value)}
          placeholder="Stop Loss"
          className="bg-[var(--input)] p-3 rounded-lg"
        />

        <div className="flex gap-2">
          <select
            value={lotSize}
            onChange={(e) => setLotSize(e.target.value)}
            className="bg-[var(--input)] p-3 rounded-lg flex-1"
          >
            {lotSizes.map((lot) => (
              <option key={lot} value={lot}>
                Lot {lot}
              </option>
            ))}
          </select>

          <input
            type="number"
            step="0.01"
            value={lotSize}
            onChange={(e) => setLotSize(e.target.value)}
            placeholder="Custom"
            className="bg-[var(--input)] p-3 rounded-lg w-28"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[var(--input)] p-4 rounded-xl">
          <p className="text-[var(--muted)] text-sm">Current Price</p>
          <p className="text-xl font-bold">
            ${selectedCurrentPrice.toLocaleString()}
          </p>
        </div>

        <div className="bg-[var(--input)] p-4 rounded-xl">
          <p className="text-[var(--muted)] text-sm">Live P/L</p>
          <p
            className={
              formLiveProfit >= 0
                ? "text-green-400 text-xl font-bold"
                : "text-red-400 text-xl font-bold"
            }
          >
            ${formLiveProfit.toFixed(2)}
          </p>
        </div>

        <div className="bg-[var(--input)] p-4 rounded-xl">
          <p className="text-[var(--muted)] text-sm">Selected Market</p>
          <p className="text-xl font-bold">{symbol}</p>
        </div>
      </div>

      <button
        onClick={addTrade}
        className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg mb-6"
      >
        Add Trade
      </button>

      <div className="space-y-3">
        {trades.map((trade) => {
          const tradeCurrentPrice = prices[trade.symbol] || 0;

          const liveProfit = calcProfit(
            trade.type,
            trade.entry,
            tradeCurrentPrice,
            trade.lotSize
          );

          const displayProfit =
            trade.status === "Open" ? liveProfit : trade.profit;

          return (
            <div
              key={trade.id}
              className="bg-[var(--input)] p-4 rounded-xl border border-[var(--border)]"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">{trade.symbol}</p>

                  <p
                    className={
                      trade.type === "BUY"
                        ? "text-green-400 text-sm"
                        : "text-red-400 text-sm"
                    }
                  >
                    {trade.type}
                  </p>

                  <p className="text-[var(--muted)] text-sm">
                    Lot: {trade.lotSize}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={
                      trade.status === "Win"
                        ? "text-green-400"
                        : trade.status === "Loss"
                        ? "text-red-400"
                        : trade.status === "Closed"
                        ? "text-[var(--muted)]"
                        : "text-yellow-400"
                    }
                  >
                    {trade.status}
                  </span>

                  <button
                    onClick={() => deleteTrade(trade.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    ❌
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-6 gap-4 mt-4">
                <div>
                  <p className="text-[var(--muted)] text-sm">Entry</p>
                  <p>${trade.entry.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-[var(--muted)] text-sm">Current Price</p>
                  <p>
                    {tradeCurrentPrice
                      ? `$${tradeCurrentPrice.toLocaleString()}`
                      : "..."}
                  </p>
                </div>

                <div>
                  <p className="text-[var(--muted)] text-sm">Take Profit</p>
                  <p className="text-green-400">
                    ${trade.takeProfit.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-[var(--muted)] text-sm">Stop Loss</p>
                  <p className="text-red-400">
                    ${trade.stopLoss.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-[var(--muted)] text-sm">Close Price</p>
                  <p>
                    {trade.closePrice
                      ? `$${trade.closePrice.toLocaleString()}`
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-[var(--muted)] text-sm">
                    {trade.status === "Open" ? "Live P/L" : "Profit"}
                  </p>
                  <p
                    className={
                      (displayProfit || 0) >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {displayProfit !== null && displayProfit !== undefined
                      ? `$${displayProfit.toFixed(2)}`
                      : "-"}
                  </p>
                </div>
              </div>

              {trade.status === "Open" && (
                <div className="mt-4">
                  <button
                    onClick={() => closePosition(trade.id)}
                    className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg text-sm"
                  >
                    🔒 Close Position
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}