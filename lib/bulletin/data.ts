import { getAnonClient } from "@/lib/supabase/anon";
import { cleanSection, emptyBulletin, isIsoDate, SECTION_KEYS } from "./schema";
import { seedBulletin } from "./seed";
import type { Bulletin } from "./types";

/**
 * Public bulletin reads — anon key, published rows only (RLS). Falls back to
 * the bundled seed bulletin when Supabase is unconfigured, unreachable, or
 * has nothing published yet, so /bulletin never renders empty.
 */

export const BULLETIN_COLUMNS =
  "bulletin_date, status, order_of_service, announcements, prayer_groups, article, series, published_at, updated_at";

/** Normalize a database row through the same validators the editor uses. */
export function rowToBulletin(row: Record<string, unknown>): Bulletin {
  const base = emptyBulletin(String(row.bulletin_date));
  const out: Bulletin = {
    ...base,
    status: row.status === "published" ? "published" : "draft",
    published_at: (row.published_at as string | null) ?? null,
    updated_at: (row.updated_at as string | null) ?? null,
  };
  for (const key of SECTION_KEYS) {
    (out[key] as Bulletin[typeof key]) = cleanSection(key, row[key]);
  }
  if (out.prayer_groups.length === 0) out.prayer_groups = base.prayer_groups;
  return out;
}

export async function getPublishedBulletin(date: string): Promise<Bulletin | null> {
  if (!isIsoDate(date)) return null;
  const client = getAnonClient();
  if (client) {
    const { data, error } = await client
      .from("cisco_bulletins")
      .select(BULLETIN_COLUMNS)
      .eq("bulletin_date", date)
      .eq("status", "published")
      .maybeSingle();
    if (!error && data) return rowToBulletin(data);
    if (!error && (await hasAnyPublished(client))) return null;
  }
  return date === seedBulletin.bulletin_date ? seedBulletin : null;
}

/** The newest published bulletin that is not dated in the future. */
export async function getCurrentBulletin(): Promise<Bulletin> {
  const client = getAnonClient();
  if (client) {
    const { data, error } = await client
      .from("cisco_bulletins")
      .select(BULLETIN_COLUMNS)
      .eq("status", "published")
      .order("bulletin_date", { ascending: false })
      .limit(8);
    if (!error && data && data.length > 0) {
      const today = new Date().toISOString().slice(0, 10);
      const rows = data as Record<string, unknown>[];
      // A bulletin published early (Friday) is current on its Sunday; until
      // then the previous Sunday's stays up.
      const live = rows.find((r) => String(r.bulletin_date) <= today) ?? rows[rows.length - 1];
      return rowToBulletin(live);
    }
  }
  return seedBulletin;
}

export type PublishedEntry = { date: string; message: string };

/** The sermon title for a Sunday, read from its order of service. */
export function messageTitle(bulletin: Pick<Bulletin, "order_of_service">): string {
  const sermon = bulletin.order_of_service.items.find((i) => /sermon|message|lesson/i.test(i.label));
  return sermon?.note.replace(/^[“"]|[”"]$/g, "") ?? "";
}

export async function listPublished(): Promise<PublishedEntry[]> {
  const client = getAnonClient();
  if (client) {
    const { data, error } = await client
      .from("cisco_bulletins")
      .select("bulletin_date, order_of_service")
      .eq("status", "published")
      .order("bulletin_date", { ascending: false });
    if (!error && data && data.length > 0) {
      return data.map((r) => ({
        date: String(r.bulletin_date),
        message: messageTitle({ order_of_service: cleanSection("order_of_service", r.order_of_service) }),
      }));
    }
  }
  return [{ date: seedBulletin.bulletin_date, message: messageTitle(seedBulletin) }];
}

async function hasAnyPublished(client: NonNullable<ReturnType<typeof getAnonClient>>) {
  const { count } = await client
    .from("cisco_bulletins")
    .select("bulletin_date", { count: "exact", head: true })
    .eq("status", "published");
  return (count ?? 0) > 0;
}
