import { NextResponse } from "next/server";
import { economicEvents } from "@/lib/economicEvents";
import { sendTelegramMessage } from "@/lib/telegram";

function eventDateTimeCambodia(date: string, time: string) {
  return new Date(`${date}T${time}:00+07:00`);
}

export async function GET() {
  try {
    const now = new Date();
    const upcoming = [];

    for (const item of economicEvents) {
      if (item.impact !== "High") continue;

      const eventTime = eventDateTimeCambodia(item.date, item.time);
      const diffMinutes =
        (eventTime.getTime() - now.getTime()) / 1000 / 60;

      if (diffMinutes > 0 && diffMinutes <= 30) {
        upcoming.push(item);

        await sendTelegramMessage(
          `📅 <b>Economic Event Alert</b>\n\n` +
            `<b>Event:</b> ${item.event}\n` +
            `<b>Currency:</b> ${item.currency}\n` +
            `<b>Impact:</b> ${item.impact}\n` +
            `<b>Time:</b> ${item.date} ${item.time} Cambodia Time\n\n` +
            `<b>Previous:</b> ${item.previous}\n` +
            `<b>Forecast:</b> ${item.forecast}\n\n` +
            `⚠️ Starts within 30 minutes. Prepare for volatility.`
        );
      }
    }

    return NextResponse.json({
      success: true,
      checked: economicEvents.length,
      alertsSent: upcoming.length,
      events: upcoming,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Calendar check failed",
      },
      { status: 500 }
    );
  }
}