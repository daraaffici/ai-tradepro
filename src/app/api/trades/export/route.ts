import { prisma } from "@/lib/prisma";
import {
  formatCambodiaDateTime,
  getCambodiaPeriodFilter,
} from "@/lib/cambodiaTime";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const period = url.searchParams.get("period") || "all";

  const where: any = {};

  const dateFilter = getCambodiaPeriodFilter(period);

  if (dateFilter) {
    where.createdAt = dateFilter;
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
    formatCambodiaDateTime(trade.createdAt),
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

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=trade-history-${period}.csv`,
    },
  });
}