import { NextResponse } from "next/server";
import { readJson, siteOrigin } from "@/lib/staff-api";
import { createAuthClient } from "@/lib/supabase/auth";
import { getServiceClient } from "@/lib/supabase/server";

/**
 * POST { email } — emails a one-time sign-in link, but only to people already
 * in cisco_staff. The auth users table is shared with the other apps on the
 * instance, so an address that merely has an account somewhere else never
 * receives a Cisco link. The answer is the same either way: this endpoint
 * must not reveal who is on staff.
 */
export async function POST(request: Request) {
  const body = await readJson<{ email?: string }>(request);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const service = getServiceClient();
  const auth = await createAuthClient();
  if (!service || !auth) {
    return NextResponse.json({ error: "Sign-in isn't available right now." }, { status: 503 });
  }

  const { data: member } = await service
    .from("cisco_staff")
    .select("user_id")
    .ilike("email", email)
    .maybeSingle();

  if (member) {
    const { error } = await auth.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${siteOrigin(request)}/auth/confirm?next=/staff`,
      },
    });
    if (error) {
      return NextResponse.json(
        { error: "The sign-in email couldn't be sent. Wait a minute and try again." },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
