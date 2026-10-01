import type {
  Announcement,
  Article,
  Bulletin,
  OrderOfService,
  PrayerGroup,
  SectionKey,
  Series,
  StaffRole,
} from "./types";

/**
 * What each role may edit. This is the one place to change who can touch what:
 * the Route Handlers enforce it, and the editor reads it to lock sections.
 */
export const ROLE_SECTIONS: Record<StaffRole, readonly SectionKey[]> = {
  admin: ["order_of_service", "announcements", "prayer_groups", "article", "series"],
  secretary: ["order_of_service", "announcements", "prayer_groups"],
};

export const SECTION_KEYS: readonly SectionKey[] = ROLE_SECTIONS.admin;

export function canEdit(role: StaffRole, section: SectionKey): boolean {
  return ROLE_SECTIONS[role].includes(section);
}

/**
 * Who may open the theciscochurch.org inbox. Feedback and survey replies can be
 * personal, so it starts admin-only; add "secretary" here to let the office in.
 */
export const MAIL_ACCESS: readonly StaffRole[] = ["admin"];

export function canUseMail(role: StaffRole): boolean {
  return MAIL_ACCESS.includes(role);
}

export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !ISO_DATE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

const text = (value: unknown, max: number): string =>
  typeof value === "string" ? value.replace(/\r\n/g, "\n").trim().slice(0, max) : "";

const list = (value: unknown, max: number): unknown[] =>
  Array.isArray(value) ? value.slice(0, max) : [];

const obj = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

function cleanOrder(value: unknown): OrderOfService {
  const o = obj(value);
  return {
    song_leader: text(o.song_leader, 80),
    items: list(o.items, 30)
      .map((raw) => {
        const r = obj(raw);
        return { label: text(r.label, 100), who: text(r.who, 80), note: text(r.note, 160) };
      })
      .filter((i) => i.label),
  };
}

function cleanAnnouncements(value: unknown): Announcement[] {
  return list(value, 40)
    .map((raw, index) => {
      const r = obj(raw);
      return {
        id: text(r.id, 40) || `a${index + 1}`,
        title: text(r.title, 120),
        when: text(r.when, 120),
        body: text(r.body, 1200),
        note: text(r.note, 160),
      };
    })
    .filter((a) => a.title);
}

function cleanPrayer(value: unknown): PrayerGroup[] {
  return list(value, 8).map((raw) => {
    const r = obj(raw);
    return {
      label: text(r.label, 60),
      names: list(r.names, 300)
        .map((n) => text(n, 80))
        .filter(Boolean),
    };
  });
}

function cleanArticle(value: unknown): Article {
  const a = obj(value);
  return {
    kicker: text(a.kicker, 80),
    title: text(a.title, 120),
    subtitle: text(a.subtitle, 160),
    body: text(a.body, 12000),
  };
}

function cleanSeries(value: unknown): Series {
  const s = obj(value);
  return {
    title: text(s.title, 100),
    tagline: text(s.tagline, 160),
    verse: text(s.verse, 240),
    weeks: list(s.weeks, 12)
      .map((raw) => {
        const w = obj(raw);
        return { date: text(w.date, 10), title: text(w.title, 100) };
      })
      .filter((w) => isIsoDate(w.date) && w.title),
  };
}

/** Validate + normalize one section's payload. Never trusts the browser. */
export function cleanSection<K extends SectionKey>(key: K, value: unknown): Bulletin[K] {
  switch (key) {
    case "order_of_service":
      return cleanOrder(value) as Bulletin[K];
    case "announcements":
      return cleanAnnouncements(value) as Bulletin[K];
    case "prayer_groups":
      return cleanPrayer(value) as Bulletin[K];
    case "article":
      return cleanArticle(value) as Bulletin[K];
    case "series":
      return cleanSeries(value) as Bulletin[K];
    default:
      throw new Error("Unknown section");
  }
}

export const emptyBulletin = (date: string): Bulletin => ({
  bulletin_date: date,
  status: "draft",
  order_of_service: { song_leader: "", items: [] },
  announcements: [],
  prayer_groups: [{ label: "", names: [] }],
  article: { kicker: "From the Minister's Desk", title: "", subtitle: "", body: "" },
  series: { title: "", tagline: "", verse: "", weeks: [] },
  published_at: null,
  updated_at: null,
});

/** The Sunday on or after `from` (ISO date) — the next bulletin to write. */
export function nextSunday(from: Date = new Date()): string {
  const d = new Date(Date.UTC(from.getFullYear(), from.getMonth(), from.getDate()));
  d.setUTCDate(d.getUTCDate() + ((7 - d.getUTCDay()) % 7));
  return d.toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
