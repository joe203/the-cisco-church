import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getServiceClient } from "@/lib/supabase/server";
import { type Member } from "@/lib/together/access";

/**
 * Sign-in for /together/feedback: a member types their email, we email them a
 * link, the link signs them in. Unlike /together (type your email or cell and
 * you're in), this proves the person owns the address, because every response
 * carries their name.
 *
 * Both the link and the cookie are signed, not stored: a mail scanner opening
 * the link early can't "use it up", and removing someone from the member list
 * locks them out at once (getFeedbackMember re-reads the list every time).
 */

export const FEEDBACK_COOKIE = "cisco_feedback";
const LINK_HOURS = 24;
const SESSION_DAYS = 180;

function key(purpose: "link" | "session"): string | null {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return secret ? createHmac("sha256", secret).update(`cisco-feedback-${purpose}`).digest("hex") : null;
}

function sign(purpose: "link" | "session", memberId: string, seconds: number): string | null {
  const k = key(purpose);
  if (!k) return null;
  const payload = `${memberId}.${Math.floor(Date.now() / 1000) + seconds}`;
  return `${payload}.${createHmac("sha256", k).update(payload).digest("hex")}`;
}

/** The member id inside a valid, unexpired token, or null. */
function verify(purpose: "link" | "session", token: string | undefined | null): string | null {
  const k = key(purpose);
  if (!k || !token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [id, exp, sig] = parts;
  const a = Buffer.from(sig);
  const b = Buffer.from(createHmac("sha256", k).update(`${id}.${exp}`).digest("hex"));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (!(Number(exp) > Date.now() / 1000)) return null;
  return id;
}

export const makeLinkToken = (memberId: string) => sign("link", memberId, LINK_HOURS * 3600);
export const makeSessionToken = (memberId: string) => sign("session", memberId, SESSION_DAYS * 86400);
export const linkMember = (token: string | null) => verify("link", token);
export const LINK_LIFE = `${LINK_HOURS} hours`;

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  };
}

export async function memberById(id: string): Promise<Member | null> {
  const db = getServiceClient();
  if (!db) return null;
  const { data } = await db.from("cisco_together_members").select("id, name, email, phone").eq("id", id).maybeSingle();
  return (data as Member | null) ?? null;
}

/** The member signed in to the feedback page, or null. */
export async function getFeedbackMember(): Promise<Member | null> {
  const id = verify("session", (await cookies()).get(FEEDBACK_COOKIE)?.value);
  return id ? memberById(id) : null;
}
