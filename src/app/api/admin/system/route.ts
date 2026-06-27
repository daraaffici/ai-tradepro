import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function checkDatabase() {
  try {
    await prisma.user.count();
    return { status: "Online", healthy: true };
  } catch {
    return { status: "Offline", healthy: false };
  }
}

async function checkMarketApi() {
  try {
    const res = await fetch(
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT",
      { cache: "no-store" }
    );

    if (!res.ok) {
      return { status: "Offline", healthy: false };
    }

    return { status: "Online", healthy: true };
  } catch {
    return { status: "Offline", healthy: false };
  }
}

export async function GET() {
  const database = await checkDatabase();
  const marketApi = await checkMarketApi();

  const telegramConfigured =
    !!process.env.TELEGRAM_BOT_TOKEN && !!process.env.TELEGRAM_CHAT_ID;

  const openaiConfigured = !!process.env.OPENAI_API_KEY;

  return NextResponse.json({
    success: true,
    checkedAt: new Date().toISOString(),
    services: {
      database,
      server: {
        status: "Online",
        healthy: true,
      },
      telegram: {
        status: telegramConfigured ? "Configured" : "Not Configured",
        healthy: telegramConfigured,
      },
      openai: {
        status: openaiConfigured ? "Configured" : "Not Configured",
        healthy: openaiConfigured,
      },
      marketApi,
    },
  });
}