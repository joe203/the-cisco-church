import { NextResponse } from "next/server";
import { siteOrigin } from "@/lib/staff-api";
import { createAuthClient } from "@/lib/supabase/auth";

export async function POST(request: Request) {
  const auth = await createAuthClient();
  await auth?.auth.signOut();
  return NextResponse.redirect(`${siteOrigin(request)}/staff/login`, { status: 303 });
}
