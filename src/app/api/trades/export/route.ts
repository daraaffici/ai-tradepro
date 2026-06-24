import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const period = url.searchParams.get("period") || "all";

  const now = new Date();
  const where: any = {};

  if (period === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    where.createdAt = {
      gte: start,
    };
  }

  if (period === "week") {
    const start = new Date();
    start.setDate(now.getDate() - 7);

    where.createdAt = {
      gte: start,
    };
  }

  if (period === "month") {
    const start = new Date();
    start.setMonth(now.getMonth() - 1);

    where.createdAt = {
      gte: start,
    };
  }

  const trades = await prisma.trade.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  });

  const headers = [
    "Date / Time",
    "Symbol",
    "Type",
    "Entry",
    "Close Price",
    "Take Profit",
    "Stop Loss",
    "Lot Size",
    "Status",
    "Profit",
  ];

  const rows = trades.map((trade) => [
    new Date(trade.createdAt).toLocaleString("en-GB"),
    trade.symbol,
    trade.type,
    trade.entry,
    trade.closePrice || "",
    trade.takeProfit,
    trade.stopLoss,
    trade.lotSize,
    trade.status,
    trade.profit || 0,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const filename = `trade-history-${period}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=${filename}`,
    },
  });
}