import { NextResponse, type NextRequest } from "next/server";
import { siteOrigin } from "@/lib/staff-api";
import { createAuthClient } from "@/lib/supabase/auth";

/**
 * The target of the emailed sign-in link:
 *   /auth/confirm?token_hash=…&type=magiclink&next=/staff
 * Exchanges the one-time token for a session cookie, then lands on `next`.
 */
export async function GET(request: NextRequest) {
  const origin = siteOrigin(request);
  const params = request.nextUrl.searchParams;
  const tokenHash = params.get("token_hash");
  const type = params.get("type");
  const next = params.get("next") ?? "/staff";
  // Same-site paths only — never an open redirect.
  const target = next.startsWith("/") && !next.startsWith("//") ? next : "/staff";

  const auth = await createAuthClient();
  if (auth && tokenHash && (type === "magiclink" || type === "email")) {
    const { error } = await auth.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) return NextResponse.redirect(`${origin}${target}`);
  }
  return NextResponse.redirect(`${origin}/staff/login?expired=1`);
}
