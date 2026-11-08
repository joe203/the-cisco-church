import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side READ client — anon key, `cisco` schema, no session. Everything
 * it can reach is public by RLS (published bulletins, sermons). Returns null
 * when Supabase is not configured so callers can fall back to seed data.
 *
 * Public pages are built on every visit, so a stalled database must not stall
 * the page: a read gives up after a few seconds and the caller falls back, and
 * for a short while after that reads don't wait on it at all (a page makes
 * several, which would otherwise add up).
 */

const READ_TIMEOUT_MS = 3000;
const SKIP_AFTER_TIMEOUT_MS = 30 * 1000;

let skipUntil = 0;

const readWithTimeout: typeof fetch = async (input, init) => {
  if (Date.now() < skipUntil) throw new Error("Database recently unreachable");
  try {
    return await fetch(input, { ...init, signal: AbortSignal.timeout(READ_TIMEOUT_MS) });
  } catch (error) {
    skipUntil = Date.now() + SKIP_AFTER_TIMEOUT_MS;
    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- untyped shared instance, schema pinned to "cisco"
type Db = SupabaseClient<any, any, any, any, any>;

let cached: Db | null | undefined;

export function getAnonClient(): Db | null {
  if (cached !== undefined) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  cached =
    url && anonKey
      ? createClient(url, anonKey, {
          db: { schema: "cisco", retry: false },
          auth: { persistSession: false },
          global: { fetch: readWithTimeout },
        })
      : null;
  return cached;
}
