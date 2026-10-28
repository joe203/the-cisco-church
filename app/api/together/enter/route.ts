import { NextResponse } from "next/server";
import { readJson } from "@/lib/staff-api";
import { getServiceClient } from "@/lib/supabase/server";
import { COOKIE, cookieOptions, findMember, makeToken, tooMany } from "@/lib/together/access";

/** POST { who } — an email or cell number on the member list opens /together. */
export async function POST(request: Request) {
  if (tooMany(request, "enter", 12, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many tries. Please wait a few minutes." }, { status: 429 });
  }
  const body = await readJson<{ who?: unknown }>(request);
  const who = typeof body?.who === "string" ? body.who.slice(0, 200) : "";
  const member = who ? await findMember(who) : null;
  if (!member) return NextResponse.json({ found: false }, { status: 404 });

  const token = makeToken(member.id);
  if (!token) return NextResponse.json({ error: "Unavailable right now." }, { status: 503 });

  await getServiceClient()
    ?.from("cisco_together_members")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", member.id);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token, cookieOptions());
  return res;
}
