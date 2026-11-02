import { getServiceClient } from "@/lib/supabase/server";
import { normalizeEmail, normalizePhone } from "./access";

export type MemberRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  last_seen_at: string | null;
};

const EMAIL = /[^\s,;<>()]+@[^\s,;<>()]+\.[^\s,;<>()]+/;
const PHONE = /\+?1?[\s.-]*\(?\d{3}\)?[\s.-]*\d{3}[\s.-]*\d{4}/;

export type ParsedLine = { line: string; name: string; email: string | null; phone: string | null };

/** One person per line: any mix of a name, an email and a phone number, in any order. */
export function parseLines(text: string): ParsedLine[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const emailMatch = line.match(EMAIL);
      const rest = emailMatch ? line.replace(emailMatch[0], " ") : line;
      const phoneMatch = rest.match(PHONE);
      const name = (phoneMatch ? rest.replace(phoneMatch[0], " ") : rest)
        .replace(/[,;|:–—-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return {
        line,
        name: name.slice(0, 120),
        email: emailMatch ? normalizeEmail(emailMatch[0]) : null,
        phone: phoneMatch ? normalizePhone(phoneMatch[0]) : null,
      };
    });
}

export async function listMembers(): Promise<MemberRow[]> {
  const db = getServiceClient();
  if (!db) return [];
  const { data } = await db
    .from("cisco_together_members")
    .select("id, name, email, phone, last_seen_at")
    .order("name", { ascending: true });
  return (data as MemberRow[] | null) ?? [];
}

export type AddResult = {
  added: number;
  updated: number;
  already: number;
  unreadable: string[];
  /** Lines whose email or cell differs from what that person already has; left unchanged. */
  conflicts: string[];
};

type StoredRow = MemberRow & { created_at: string };
type Db = NonNullable<ReturnType<typeof getServiceClient>>;

const COLUMNS = "id, name, email, phone, last_seen_at, created_at";

/** Keep the entry the person has actually used (their sign-in stays valid), else the oldest. */
function byKeeper(a: StoredRow, b: StoredRow) {
  return (b.last_seen_at ?? "").localeCompare(a.last_seen_at ?? "") || a.created_at.localeCompare(b.created_at);
}

/**
 * Fold several entries for one person into one, filling in each missing email/cell/name
 * from the others and then from `extra`. Returns false if the database refused.
 */
async function mergeRows(
  db: Db,
  rows: StoredRow[],
  extra: { name?: string; email?: string | null; phone?: string | null } = {},
): Promise<boolean> {
  const [keep, ...others] = [...rows].sort(byKeeper);
  const email = keep.email ?? others.find((o) => o.email)?.email ?? extra.email ?? null;
  const phone = keep.phone ?? others.find((o) => o.phone)?.phone ?? extra.phone ?? null;
  const name = keep.name || others.find((o) => o.name)?.name || extra.name || "";
  const lastSeen = rows.map((r) => r.last_seen_at).filter(Boolean).sort().pop() ?? null;

  // The merged-away entries go first so their email/cell is free for the one we keep.
  if (others.length) {
    const { error } = await db
      .from("cisco_together_members")
      .delete()
      .in("id", others.map((o) => o.id));
    if (error) return false;
  }
  const { error } = await db
    .from("cisco_together_members")
    .update({ name, email, phone, last_seen_at: lastSeen })
    .eq("id", keep.id);
  return !error;
}

/**
 * A person is the same person whether they're matched by email or by cell. A line that
 * matches someone on the list fills in whatever that entry is missing; a line whose email
 * and cell match two separate entries merges them into one.
 */
export async function addMembers(text: string): Promise<AddResult | null> {
  const db = getServiceClient();
  if (!db) return null;
  const result: AddResult = { added: 0, updated: 0, already: 0, unreadable: [], conflicts: [] };
  for (const p of parseLines(text)) {
    if (!p.email && !p.phone) {
      result.unreadable.push(p.line);
      continue;
    }

    const lookups = await Promise.all(
      (
        [
          ["email", p.email],
          ["phone", p.phone],
        ] as const
      )
        .filter(([, value]) => value)
        .map(([column, value]) =>
          db
            .from("cisco_together_members")
            .select(COLUMNS)
            .eq(column, value as string),
        ),
    );
    if (lookups.some((l) => l.error)) {
      result.unreadable.push(p.line);
      continue;
    }
    const matches = [
      ...new Map(
        lookups.flatMap((l) => (l.data as StoredRow[] | null) ?? []).map((r) => [r.id, r] as const),
      ).values(),
    ];

    if (matches.length === 0) {
      const { error } = await db
        .from("cisco_together_members")
        .insert({ name: p.name, email: p.email, phone: p.phone });
      if (error) result.unreadable.push(p.line);
      else result.added += 1;
      continue;
    }

    const [keep, ...others] = [...matches].sort(byKeeper);
    const email = keep.email ?? others.find((o) => o.email)?.email ?? p.email;
    const phone = keep.phone ?? others.find((o) => o.phone)?.phone ?? p.phone;
    const conflict = Boolean((p.email && email !== p.email) || (p.phone && phone !== p.phone));
    if (conflict) result.conflicts.push(p.line);

    if (others.length === 0 && email === keep.email && phone === keep.phone && (keep.name || !p.name)) {
      if (!conflict) result.already += 1;
      continue;
    }

    if (await mergeRows(db, matches, p)) result.updated += 1;
    else result.unreadable.push(p.line);
  }
  await mergeSameNames();
  return result;
}

function nameKey(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/**
 * Entries with the same name are the same person, added once by email and once by cell.
 * Merge them, unless they carry two different emails or two different cells — then they
 * may really be two people, so they're left alone and returned for a person to look at.
 */
export async function mergeSameNames(): Promise<string[]> {
  const db = getServiceClient();
  if (!db) return [];
  const { data } = await db.from("cisco_together_members").select(COLUMNS);
  const groups = new Map<string, StoredRow[]>();
  for (const row of (data as StoredRow[] | null) ?? []) {
    const key = nameKey(row.name);
    if (!key) continue;
    groups.set(key, [...(groups.get(key) ?? []), row]);
  }

  const needsLook: string[] = [];
  for (const rows of groups.values()) {
    if (rows.length < 2) continue;
    const emails = new Set(rows.map((r) => r.email).filter(Boolean));
    const phones = new Set(rows.map((r) => r.phone).filter(Boolean));
    if (emails.size > 1 || phones.size > 1) needsLook.push(rows[0].name);
    else await mergeRows(db, rows);
  }
  return needsLook;
}
