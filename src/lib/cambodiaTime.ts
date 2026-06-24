const CAMBODIA_OFFSET_MS = 7 * 60 * 60 * 1000;

export function formatCambodiaDateTime(date: string | Date) {
  return new Date(date).toLocaleString("en-GB", {
    timeZone: "Asia/Phnom_Penh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function getCambodiaPeriodFilter(period: string) {
  const now = new Date();
  const khNow = new Date(now.getTime() + CAMBODIA_OFFSET_MS);

  const y = khNow.getUTCFullYear();
  const m = khNow.getUTCMonth();
  const d = khNow.getUTCDate();

  const todayStartUTC = new Date(
    Date.UTC(y, m, d, 0, 0, 0) - CAMBODIA_OFFSET_MS
  );

  const tomorrowStartUTC = new Date(
    Date.UTC(y, m, d + 1, 0, 0, 0) - CAMBODIA_OFFSET_MS
  );

  if (period === "today") {
    return {
      gte: todayStartUTC,
      lt: tomorrowStartUTC,
    };
  }

  if (period === "week") {
    const weekStartUTC = new Date(todayStartUTC);
    weekStartUTC.setUTCDate(weekStartUTC.getUTCDate() - 6);

    return {
      gte: weekStartUTC,
      lt: tomorrowStartUTC,
    };
  }

  if (period === "month") {
    const monthStartUTC = new Date(
      Date.UTC(y, m, 1, 0, 0, 0) - CAMBODIA_OFFSET_MS
    );

    return {
      gte: monthStartUTC,
      lt: tomorrowStartUTC,
    };
  }

  return null;
}