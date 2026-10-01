import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { StaffMember, StaffRole } from "@/lib/bulletin/types";
import { getServiceClient } from "./server";

/**
 * Staff sign-in, server side. The session lives in httpOnly cookies managed
 * by @supabase/ssr; `proxy.ts` refreshes it on /staff and /api/staff.
 *
 * Being signed in proves nothing on its own — the auth users table is shared
 * with every other app on the instance. Access means a row in cisco_staff.
 */

export function authConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export async function createAuthClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  const store = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(toSet) {
        try {
          for (const { name, value, options } of toSet) store.set(name, value, options);
        } catch {
          // Called from a Server Component, where cookies are read-only —
          // proxy.ts has already refreshed the session for this request.
        }
      },
    },
  });
}

/** The signed-in staff member, or null. Verifies the token with the auth server. */
export async function getStaff(): Promise<StaffMember | null> {
  const auth = await createAuthClient();
  const service = getServiceClient();
  if (!auth || !service) return null;

  const { data } = await auth.auth.getUser();
  const user = data.user;
  if (!user) return null;

  const { data: row } = await service
    .from("cisco_staff")
    .select("user_id, email, name, role")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!row) return null;

  return {
    user_id: row.user_id as string,
    email: row.email as string,
    name: (row.name as string | null) ?? null,
    role: row.role as StaffRole,
  };
}
