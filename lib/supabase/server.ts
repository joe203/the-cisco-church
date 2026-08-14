import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server client — SERVICE ROLE key. Bypasses RLS.
 * Import ONLY from Route Handlers. Never from a Client Component, never
 * from anything that could end up in the browser bundle.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- untyped shared instance, schema pinned to "cisco"
type Db = SupabaseClient<any, any, any, any, any>;

export function getServiceClient(): Db | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    db: { schema: "cisco" },
    auth: { persistSession: false },
  });
}
