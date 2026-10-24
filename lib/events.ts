import { site } from "./site";

/**
 * What's on at the church. The events page is ONE timeline in date order for
 * the coming week: weekly and monthly gatherings repeat on every date they
 * fall on, and `datedEvents` are one-offs.
 *
 * The window runs from today through the Sunday after the coming Sunday, and
 * rolls forward every Thursday (when the secretary's announcements arrive):
 * Fri to Wed it ends the next Sunday; from Thursday it ends the Sunday after.
 *
 * A one-off marked `big: true` is shown as "Mark your calendar" up to ten
 * weeks ahead, even beyond the window. Photos: drop files in public/images/
 * and list them in an event's `photos`; they rotate week by week.
 */

export const BIG_EVENT_LEAD_DAYS = 70;

export type Photo = { file: string; alt: string; width: number; height: number };

export type StandingEvent = {
  id: string;
  title: string;
  body: string;
  where?: string;
  time?: string;
  /** Label above the title, e.g. "Every Monday". */
  rhythm: string;
  /** Rotates by week so the page doesn't always show the same picture. */
  photos?: Photo[];
};

export type DatedEvent = {
  /** yyyy-mm-dd */
  date: string;
  id: string;
  title: string;
  body: string;
  time?: string;
  where?: string;
  /** Show under "Mark your calendar" ahead of time, beyond the weekly window. */
  big?: boolean;
  photos?: Photo[];
};

function timeOf(day: string, label: string): string {
  const item = site.weeklyMeetings
    .find((d) => d.day === day)
    ?.items.find((i) => i.label === label);
  return item?.time ?? "";
}

export const ladiesBibleStudy: StandingEvent = {
  id: "ladies-bible-study",
  title: "Ladies Bible study",
  body: "Ladies, join us each Monday afternoon to study the Bible together.",
  where: "Fellowship Hall",
  time: timeOf("Monday", "Ladies Bible Study"),
  rhythm: "Every Monday",
};

export const wednesdayEvening: StandingEvent = {
  id: "wednesday-evening",
  title: "Wednesday evening",
  body: `Youth activities at ${timeOf("Wednesday", "Youth Activity")}, a fellowship meal at ${timeOf("Wednesday", "Fellowship Meal")}, then Bible class at ${timeOf("Wednesday", "Bible Class")}.`,
  time: timeOf("Wednesday", "Youth Activity"),
  rhythm: "Every Wednesday",
  photos: [
    {
      file: "youth.jpg",
      alt: "Joe with a group of smiling kids at a church gathering",
      width: 1201,
      height: 805,
    },
  ],
};

export const firstSunday: StandingEvent = {
  id: "first-sunday-fellowship",
  title: "First Sunday fellowship",
  body: "After morning worship we gather in the fellowship hall for a potluck meal, then congregational singing and a short devotional. Bring a favorite dish to share, and plan to stay. There is no evening service.",
  where: "Fellowship Hall",
  rhythm: "First Sunday of every month",
  photos: [
    {
      file: "congregation.jpg",
      alt: "Church family sharing a meal at long tables in the fellowship hall",
      width: 1211,
      height: 563,
    },
    {
      file: "fellowship-ladies.jpg",
      alt: "Church members laughing together at a fellowship meal",
      width: 789,
      height: 555,
    },
  ],
};

export const datedEvents: DatedEvent[] = [
  {
    date: "2026-11-01",
    id: "daylight-saving",
    title: "Daylight saving time ends",
    body: "Set your clocks back one hour.",
  },
  {
    date: "2026-11-08",
    id: "directory-forms",
    title: "Church directory forms due",
    body: "Pick up a form on the foyer table by the water fountain, fill out a new one or update yours, and give it to Cyndi or drop it in the manila envelope on the table.",
  },
];

export type Occurrence = {
  /** yyyy-mm-dd */
  date: string;
  /** Stub color: one-off, monthly, or weekly. */
  kind: "once" | "monthly" | "weekly";
  event: StandingEvent | DatedEvent;
};

/** Today's calendar date in Cisco, as yyyy-mm-dd (the server runs in UTC). */
export function todayInCisco(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function iso(dt: Date): string {
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

export function parseIso(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function addDays(dateIso: string, n: number): string {
  const d = parseIso(dateIso);
  return iso(new Date(d.getFullYear(), d.getMonth(), d.getDate() + n));
}

/** Last day shown: the Sunday ten days after the most recent Thursday. */
export function windowEnd(todayIso: string): string {
  const sinceThursday = (parseIso(todayIso).getDay() - 4 + 7) % 7;
  return addDays(todayIso, -sinceThursday + 10);
}

const KIND_ORDER = { once: 0, monthly: 1, weekly: 2 } as const;

/** Every event from today through `windowEnd`, oldest first. */
export function buildTimeline(todayIso: string): Occurrence[] {
  const end = windowEnd(todayIso);
  const out: Occurrence[] = [];
  for (let date = todayIso; date <= end; date = addDays(date, 1)) {
    const day = parseIso(date);
    for (const e of datedEvents) if (e.date === date) out.push({ date, kind: "once", event: e });
    if (day.getDay() === 0 && day.getDate() <= 7) out.push({ date, kind: "monthly", event: firstSunday });
    if (day.getDay() === 1) out.push({ date, kind: "weekly", event: ladiesBibleStudy });
    if (day.getDay() === 3) out.push({ date, kind: "weekly", event: wednesdayEvening });
  }
  // Within a day: one-offs, then monthly, then weekly.
  return out.sort((a, b) => a.date.localeCompare(b.date) || KIND_ORDER[a.kind] - KIND_ORDER[b.kind]);
}

/** Big one-offs past the window but within BIG_EVENT_LEAD_DAYS. */
export function saveTheDate(todayIso: string): Occurrence[] {
  const end = windowEnd(todayIso);
  const limit = addDays(todayIso, BIG_EVENT_LEAD_DAYS);
  return datedEvents
    .filter((e) => e.big && e.date > end && e.date <= limit)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((event) => ({ date: event.date, kind: "once" as const, event }));
}

/** The photo for this appearance; rotates week by week. */
export function pickPhoto(event: StandingEvent | DatedEvent, date: string): Photo | undefined {
  const photos = event.photos;
  if (!photos?.length) return undefined;
  const week = Math.floor(parseIso(date).getTime() / (7 * 86_400_000));
  return photos[week % photos.length];
}

/** "Today", "Tomorrow", or "": a nudge for the next two days. */
export function soonLabel(date: string, todayIso: string): string {
  const diff = Math.round((parseIso(date).getTime() - parseIso(todayIso).getTime()) / 86_400_000);
  return diff === 0 ? "Today" : diff === 1 ? "Tomorrow" : "";
}
