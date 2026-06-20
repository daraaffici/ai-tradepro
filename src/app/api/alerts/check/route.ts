import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function getPrice(baseUrl: string, symbol: string) {
  const res = await fetch(`${baseUrl}/api/market/all-price?symbol=${symbol}`, {
    cache: "no-store",
  });

  const data = await res.json();
  return Number(data.price || 0);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  const alerts = await prisma.priceAlert.findMany({
    where: {
      triggered: false,
    },
  });

  const triggeredAlerts = [];

  for (const alert of alerts) {
    const currentPrice = await getPrice(baseUrl, alert.symbol);

    if (!currentPrice) continue;

    const triggered =
      alert.condition === "ABOVE"
        ? currentPrice >= alert.targetPrice
        : currentPrice <= alert.targetPrice;

    if (triggered) {
      await prisma.priceAlert.update({
        where: { id: alert.id },
        data: { triggered: true },
      });

      triggeredAlerts.push({
        id: alert.id,
        symbol: alert.symbol,
        condition: alert.condition,
        targetPrice: alert.targetPrice,
        currentPrice,
      });
    }
  }

  return NextResponse.json({
    success: true,
    checked: alerts.length,
    triggeredAlerts,
  });
}