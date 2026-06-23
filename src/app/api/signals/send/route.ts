import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";

function formatDate(date?: string) {
  return date
    ? new Date(date).toLocaleString("en-GB")
    : new Date().toLocaleString("en-GB");
}

export async function POST(req: Request) {
  try {
    const signal = await req.json();

    const message =
      `🚀 <b>NEW AI SIGNAL SAVED</b>\n\n` +
      `<b>Symbol:</b> ${signal.symbol}\n` +
      `<b>Action:</b> ${signal.signal}\n\n` +
      `<b>Entry:</b> $${signal.entry}\n` +
      `<b>TP1:</b> $${signal.tp1}\n` +
      `<b>TP2:</b> $${signal.tp2}\n` +
      `<b>TP3:</b> $${signal.tp3}\n` +
      `<b>SL:</b> $${signal.stopLoss}\n\n` +
      `<b>Confidence:</b> ${signal.confidence}%\n` +
      `<b>Risk:</b> ${signal.risk}\n` +
      `<b>R/R:</b> 1:${signal.riskReward}\n` +
      `<b>Date / Time:</b> ${formatDate(signal.createdAt)}`;

    await sendTelegramMessage(message);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send signal" },
      { status: 500 }
    );
  }
}