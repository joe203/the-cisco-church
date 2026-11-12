import { NextResponse } from "next/server";
import { FEEDBACK_COOKIE, linkMember, makeSessionToken, memberById, sessionCookieOptions } from "@/lib/feedback/access";
import { siteOrigin } from "@/lib/staff-api";
import { getServiceClient } from "@/lib/supabase/server";
import { COOKIE, cookieOptions, makeToken } from "@/lib/together/access";

/**
 * GET ?t=… — the link from the sign-in email. Signs the member in to the
 * feedback page, and to /together too (so "Where we're headed" opens without a
 * second sign-in), then sends them to the form.
 */
export async function GET(request: Request) {
  const origin = siteOrigin(request);
  const id = linkMember(new URL(request.url).searchParams.get("t"));
  const member = id ? await memberById(id) : null;
  if (!member) return NextResponse.redirect(`${origin}/together/feedback?link=expired`, 303);

  const session = makeSessionToken(member.id);
  const together = makeToken(member.id);
  if (!session) return NextResponse.redirect(`${origin}/together/feedback?link=expired`, 303);

  await getServiceClient()
    ?.from("cisco_together_members")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", member.id);

  const res = NextResponse.redirect(`${origin}/together/feedback`, 303);
  res.cookies.set(FEEDBACK_COOKIE, session, sessionCookieOptions());
  if (together) res.cookies.set(COOKIE, together, cookieOptions());
  return res;
}
