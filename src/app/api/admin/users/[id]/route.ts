import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(req: Request, context: RouteContext) {
  try {
    const { id: idParam } = await context.params;
    const id = Number(idParam);

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        trades: true,
        portfolios: true,
        watchlists: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const closedTrades = user.trades.filter((t) => t.status !== "Open");
    const wins = closedTrades.filter((t) => t.status === "Win");

    const totalProfit = closedTrades.reduce(
      (sum, trade) => sum + Number(trade.profit || 0),
      0
    );

    const winRate =
      closedTrades.length > 0
        ? Number(((wins.length / closedTrades.length) * 100).toFixed(2))
        : 0;

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        country: user.country,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        totalTrades: user.trades.length,
        openTrades: user.trades.filter((t) => t.status === "Open").length,
        closedTrades: closedTrades.length,
        winRate,
        totalProfit,
        portfolios: user.portfolios.length,
        watchlists: user.watchlists.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load user" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { id: idParam } = await context.params;
    const id = Number(idParam);
    const body = await req.json();

    const user = await prisma.user.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        country: body.country || null,
        role: body.role,
        status: body.status,
      },
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    const { id: idParam } = await context.params;
    const id = Number(idParam);

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "User deleted",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}