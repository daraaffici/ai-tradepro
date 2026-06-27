import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const notifications = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        action: true,
        entity: true,
        description: true,
        level: true,
        isRead: true,
        createdAt: true,
      },
    });

    const unreadCount = await prisma.activityLog.count({
      where: { isRead: false },
    });

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH() {
  try {
    await prisma.activityLog.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update notifications" },
      { status: 500 }
    );
  }
}