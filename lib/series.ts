import type { Sermon } from "./types";

/** Today as yyyy-mm-dd in the church's timezone (the server runs in UTC). */
export function todayInCisco(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
}

/**
 * A lesson is "announced" once it has happened or has a teaser/summary.
 * Before that it is only a placeholder (title + date) so a series can show
 * its whole run — it appears in the series strip but nowhere else.
 */
export function isAnnounced(
  sermon: Pick<Sermon, "sermon_date" | "teaser" | "summary">,
  today: string = todayInCisco(),
): boolean {
  return sermon.sermon_date <= today || Boolean(sermon.teaser) || Boolean(sermon.summary);
}

/** "Hold On to What Is Good · Lesson 2 of 4", or null for a standalone sermon. */
export function seriesLabel(sermon: Pick<Sermon, "series" | "lesson_number">, total?: number): string | null {
  if (!sermon.series) return null;
  const lesson = sermon.lesson_number ? ` · Lesson ${sermon.lesson_number}${total ? ` of ${total}` : ""}` : "";
  return `${sermon.series.title}${lesson}`;
}
