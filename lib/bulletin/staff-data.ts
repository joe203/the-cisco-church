import { getServiceClient } from "@/lib/supabase/server";
import { BULLETIN_COLUMNS, rowToBulletin } from "./data";
import { addDays, canEdit, cleanSection, emptyBulletin, SECTION_KEYS } from "./schema";
import type { Bulletin, SectionKey, StaffMember } from "./types";

/**
 * Staff-side bulletin access — service role, including drafts. Every caller
 * must have already verified the user with getStaff(); these helpers enforce
 * the per-role section rules a second time on write.
 */

export type BulletinSummary = {
  bulletin_date: string;
  status: "draft" | "published";
  updated_at: string | null;
};

export type SaveResult =
  | { ok: true; bulletin: Bulletin }
  | { ok: false; reason: "no-database" | "not-found" | "conflict" | "forbidden" | "failed" };

export async function listBulletins(): Promise<BulletinSummary[]> {
  const db = getServiceClient();
  if (!db) return [];
  const { data } = await db
    .from("cisco_bulletins")
    .select("bulletin_date, status, updated_at")
    .order("bulletin_date", { ascending: false })
    .limit(60);
  return (data as BulletinSummary[] | null) ?? [];
}

export async function getBulletinForStaff(date: string): Promise<Bulletin | null> {
  const db = getServiceClient();
  if (!db) return null;
  const { data } = await db
    .from("cisco_bulletins")
    .select(BULLETIN_COLUMNS)
    .eq("bulletin_date", date)
    .maybeSingle();
  return data ? rowToBulletin(data) : null;
}

/**
 * Start a bulletin. When an earlier one exists it is the starting point —
 * the order of service, prayer list, announcements and series carry over
 * (they change a little each week), and the article starts blank.
 */
export async function createBulletin(date: string, staff: StaffMember): Promise<SaveResult> {
  const db = getServiceClient();
  if (!db) return { ok: false, reason: "no-database" };

  const { data: previous } = await db
    .from("cisco_bulletins")
    .select(BULLETIN_COLUMNS)
    .lt("bulletin_date", date)
    .order("bulletin_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  const base = emptyBulletin(date);
  const start: Bulletin = previous
    ? { ...rowToBulletin(previous), bulletin_date: date, article: base.article }
    : base;

  const { data, error } = await db
    .from("cisco_bulletins")
    .insert({
      bulletin_date: date,
      status: "draft",
      order_of_service: start.order_of_service,
      announcements: start.announcements,
      prayer_groups: start.prayer_groups,
      article: start.article,
      series: start.series,
      updated_by: staff.user_id,
    })
    .select(BULLETIN_COLUMNS)
    .single();
  if (error || !data) return { ok: false, reason: error?.code === "23505" ? "conflict" : "failed" };
  return { ok: true, bulletin: rowToBulletin(data) };
}

/**
 * Save the sections this person is allowed to edit; anything else in the
 * payload is dropped. `baseUpdatedAt` is the version the editor loaded — a
 * mismatch means someone else saved in between, and we refuse to overwrite.
 */
export async function saveSections(
  date: string,
  payload: Partial<Record<SectionKey, unknown>>,
  baseUpdatedAt: string | null,
  staff: StaffMember,
): Promise<SaveResult> {
  const db = getServiceClient();
  if (!db) return { ok: false, reason: "no-database" };

  const current = await getBulletinForStaff(date);
  if (!current) return { ok: false, reason: "not-found" };
  if (baseUpdatedAt && current.updated_at && current.updated_at !== baseUpdatedAt) {
    return { ok: false, reason: "conflict" };
  }

  const update: Record<string, unknown> = { updated_by: staff.user_id };
  for (const key of SECTION_KEYS) {
    if (!(key in payload)) continue;
    if (!canEdit(staff.role, key)) return { ok: false, reason: "forbidden" };
    update[key] = cleanSection(key, payload[key]);
  }

  const { data, error } = await db
    .from("cisco_bulletins")
    .update(update)
    .eq("bulletin_date", date)
    .select(BULLETIN_COLUMNS)
    .single();
  if (error || !data) return { ok: false, reason: "failed" };
  return { ok: true, bulletin: rowToBulletin(data) };
}

export async function setPublished(
  date: string,
  published: boolean,
  staff: StaffMember,
): Promise<SaveResult> {
  const db = getServiceClient();
  if (!db) return { ok: false, reason: "no-database" };
  const { data, error } = await db
    .from("cisco_bulletins")
    .update({
      status: published ? "published" : "draft",
      published_at: published ? new Date().toISOString() : null,
      updated_by: staff.user_id,
    })
    .eq("bulletin_date", date)
    .select(BULLETIN_COLUMNS)
    .maybeSingle();
  if (error) return { ok: false, reason: "failed" };
  if (!data) return { ok: false, reason: "not-found" };
  return { ok: true, bulletin: rowToBulletin(data) };
}

/** The Sunday after the newest bulletin, or the coming Sunday when there is none. */
export function suggestNextDate(existing: BulletinSummary[], fallback: string): string {
  const newest = existing[0]?.bulletin_date;
  return newest && newest >= fallback ? addDays(newest, 7) : fallback;
}

export async function listStaff(): Promise<StaffMember[]> {
  const db = getServiceClient();
  if (!db) return [];
  const { data } = await db
    .from("cisco_staff")
    .select("user_id, email, name, role")
    .order("created_at", { ascending: true });
  return (data as StaffMember[] | null) ?? [];
}
