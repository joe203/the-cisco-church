import { NextResponse } from "next/server";
import { getStaff } from "@/lib/supabase/auth";
import type { StaffMember } from "@/lib/bulletin/types";

/** Route Handler guard: resolves the signed-in staff member or a ready 401/403. */
export async function requireStaff(
  options: { admin?: boolean } = {},
): Promise<{ staff: StaffMember } | { error: NextResponse }> {
  const staff = await getStaff();
  if (!staff) {
    return { error: NextResponse.json({ error: "Sign in to continue." }, { status: 401 }) };
  }
  if (options.admin && staff.role !== "admin") {
    return { error: NextResponse.json({ error: "Only an admin can do that." }, { status: 403 }) };
  }
  return { staff };
}

export async function readJson<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

const ALLOWED_HOSTS = new Set(["theciscochurch.org", "www.theciscochurch.org", "localhost:3000"]);

/**
 * The public origin of this request. Behind Caddy the request URL is the
 * container's own address, so read the forwarded host — but only trust it when
 * it is one of ours, since it ends up inside an emailed sign-in link.
 */
export function siteOrigin(request: Request): string {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  if (!ALLOWED_HOSTS.has(host)) return "https://theciscochurch.org";
  const local = host.startsWith("localhost");
  const proto = local ? "http" : "https";
  return `${proto}://${host}`;
}
