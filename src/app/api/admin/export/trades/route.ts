import { prisma } from "@/lib/prisma";

function escapeCSV(value: any) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export async function GET() {
  const trades = await prisma.trade.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const headers = [
    "ID",
    "User Name",
    "User Email",
    "Symbol",
    "Type",
    "Entry",
    "Take Profit",
    "Stop Loss",
    "Lot Size",
    "Close Price",
    "Profit",
    "Status",
    "Created At",
  ];

  const rows = trades.map((trade) => [
    trade.id,
    trade.user.name,
    trade.user.email,
    trade.symbol,
    trade.type,
    trade.entry,
    trade.takeProfit,
    trade.stopLoss,
    trade.lotSize,
    trade.closePrice || "",
    trade.profit || 0,
    trade.status,
    new Date(trade.createdAt).toLocaleString("en-GB"),
  ]);

  const csv = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=admin-trades.csv`,
    },
  });
}