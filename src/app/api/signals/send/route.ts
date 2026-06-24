import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";
import { formatCambodiaDateTime } from "@/lib/cambodiaTime";

function money(value: number) {
  return Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export async function POST(req: Request) {
  try {
    const signal = await req.json();

    const createdAt = signal.createdAt || new Date();

    const message =
      `🚀 <b>AI TRADEPRO SIGNAL SAVED</b>\n\n` +
      `<b>Symbol:</b> ${signal.symbol}\n` +
      `<b>Action:</b> ${signal.signal}\n` +
      `<b>Date / Time:</b> ${formatCambodiaDateTime(createdAt)}\n\n` +
      `<b>Trend:</b> ${signal.trend || "-"}\n` +
      `<b>Confidence:</b> ${signal.confidence}%\n` +
      `<b>Risk:</b> ${signal.risk}\n\n` +
      `<b>Entry:</b> $${money(signal.entry)}\n` +
      `<b>TP1:</b> $${money(signal.tp1)}\n` +
      `<b>TP2:</b> $${money(signal.tp2)}\n` +
      `<b>TP3:</b> $${money(signal.tp3)}\n` +
      `<b>Stop Loss:</b> $${money(signal.stopLoss)}\n\n` +
      `<b>Support:</b> $${money(signal.support)}\n` +
      `<b>Resistance:</b> $${money(signal.resistance)}\n` +
      `<b>Risk / Reward:</b> 1:${signal.riskReward}\n\n` +
      `<b>Summary:</b>\n${signal.summary || "-"}`;

    await sendTelegramMessage(message);

    return NextResponse.json({
      success: true,
      sentAt: formatCambodiaDateTime(new Date()),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to send signal",
      },
      { status: 500 }
    );
  }
}