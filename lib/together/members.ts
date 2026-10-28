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

export type AddResult = { added: number; already: number; unreadable: string[] };

export async function addMembers(text: string): Promise<AddResult | null> {
  const db = getServiceClient();
  if (!db) return null;
  const result: AddResult = { added: 0, already: 0, unreadable: [] };
  for (const p of parseLines(text)) {
    if (!p.email && !p.phone) {
      result.unreadable.push(p.line);
      continue;
    }
    const { error } = await db
      .from("cisco_together_members")
      .insert({ name: p.name, email: p.email, phone: p.phone });
    if (!error) result.added += 1;
    else if (error.code === "23505") result.already += 1;
    else result.unreadable.push(p.line);
  }
  return result;
}
