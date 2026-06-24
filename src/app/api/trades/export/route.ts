import { prisma } from "@/lib/prisma";

export async function GET() {
  const trades = await prisma.trade.findMany({
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "Date",
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

  const rows = trades.map((t) => [
    new Date(t.createdAt).toLocaleString("en-GB"),
    t.symbol,
    t.type,
    t.entry,
    t.closePrice || "",
    t.takeProfit,
    t.stopLoss,
    t.lotSize,
    t.status,
    t.profit || 0,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) => row.map((v) => `"${v}"`).join(",")),
  ].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=trade-history.csv",
    },
  });
}