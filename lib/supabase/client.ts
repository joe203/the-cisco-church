"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser client — anon key only. The anon key can only read (RLS enforces
 * public SELECT, no writes). Returns null when env vars are absent so the
 * app can fall back to seed data / self-paced mode.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- untyped shared instance, schema pinned to "cisco"
type Db = SupabaseClient<any, any, any, any, any>;

let cached: Db | null | undefined;

export function getBrowserClient(): Db | null {
  if (cached !== undefined) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  cached = url && anonKey ? createClient(url, anonKey, { db: { schema: "cisco" } }) : null;
  return cached;
}
