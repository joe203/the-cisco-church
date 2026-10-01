import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side READ client — anon key, `cisco` schema, no session. Everything
 * it can reach is public by RLS (published bulletins, sermons). Returns null
 * when Supabase is not configured so callers can fall back to seed data.
 */

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
          db: { schema: "cisco" },
          auth: { persistSession: false },
        })
      : null;
  return cached;
}
