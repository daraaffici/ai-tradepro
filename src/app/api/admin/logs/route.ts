import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "All";
    const search = url.searchParams.get("search") || "";

    const logs = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const filteredLogs = logs.filter((log) => {
      const matchType = type === "All" || log.entity === type;

      const text = `${log.action} ${log.entity} ${log.description} ${
        log.adminName || ""
      } ${log.user?.name || ""} ${log.user?.email || ""}`.toLowerCase();

      const matchSearch = text.includes(search.toLowerCase());

      return matchType && matchSearch;
    });

    return NextResponse.json({
      success: true,
      logs: filteredLogs,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to load activity logs",
      },
      { status: 500 }
    );
  }
}