import { NextResponse } from "next/server";

export async function GET() {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json({
        success: false,
        status: "Not Configured",
      });
    }

    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/getMe`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!data.ok) {
      return NextResponse.json({
        success: false,
        status: "Offline",
      });
    }

    return NextResponse.json({
      success: true,
      status: "Online",
      bot: data.result.username,
    });
  } catch {
    return NextResponse.json({
      success: false,
      status: "Offline",
    });
  }
}