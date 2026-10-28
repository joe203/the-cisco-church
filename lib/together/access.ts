import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getServiceClient } from "@/lib/supabase/server";

export const COOKIE = "cisco_together";
const MAX_AGE = 60 * 60 * 24 * 180;

export type Member = { id: string; name: string; email: string | null; phone: string | null };

/** 10 digits, ignoring dashes, spaces, parentheses and a leading 1. */
export function normalizePhone(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  return digits.length === 10 ? digits : null;
}

export function normalizeEmail(input: string): string | null {
  const email = input.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

/** Someone typed an email or a number; find the member it belongs to. */
export async function findMember(input: string): Promise<Member | null> {
  const db = getServiceClient();
  if (!db) return null;
  const value = input.trim();
  const isEmail = value.includes("@");
  const match = isEmail ? normalizeEmail(value) : normalizePhone(value);
  if (!match) return null;
  const { data } = await db
    .from("cisco_together_members")
    .select("id, name, email, phone")
    .eq(isEmail ? "email" : "phone", match)
    .maybeSingle();
  return (data as Member | null) ?? null;
}

function key(): string | null {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return secret ? createHmac("sha256", secret).update("cisco-together-cookie").digest("hex") : null;
}

function sign(payload: string, k: string): string {
  return createHmac("sha256", k).update(payload).digest("hex");
}

export function makeToken(memberId: string): string | null {
  const k = key();
  if (!k) return null;
  const payload = `${memberId}.${Math.floor(Date.now() / 1000) + MAX_AGE}`;
  return `${payload}.${sign(payload, k)}`;
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE,
  };
}

/** The member behind this request's cookie, or null. Removing someone from the list locks them out. */
export async function getMember(): Promise<Member | null> {
  const k = key();
  const token = (await cookies()).get(COOKIE)?.value;
  if (!k || !token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [id, exp, sig] = parts;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(`${id}.${exp}`, k));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(exp) < Date.now() / 1000) return null;
  const db = getServiceClient();
  if (!db) return null;
  const { data } = await db
    .from("cisco_together_members")
    .select("id, name, email, phone")
    .eq("id", id)
    .maybeSingle();
  return (data as Member | null) ?? null;
}

const hits = new Map<string, number[]>();

/** Small per-address limiter for the public endpoints. */
export function tooMany(request: Request, bucket: string, limit: number, windowMs: number): boolean {
  const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const id = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(id) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(id, recent);
  return recent.length > limit;
}
