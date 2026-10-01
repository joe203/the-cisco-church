import { NextResponse } from "next/server";
import type { StaffRole } from "@/lib/bulletin/types";
import { readJson, requireStaff } from "@/lib/staff-api";
import { getServiceClient } from "@/lib/supabase/server";

/** POST { email, name, role } — give someone staff access. Admin only. */
export async function POST(request: Request) {
  const guard = await requireStaff({ admin: true });
  if ("error" in guard) return guard.error;

  const body = await readJson<{ email?: string; name?: string; role?: string }>(request);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 80) : "";
  const role: StaffRole | null =
    body?.role === "admin" || body?.role === "secretary" ? body.role : null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !role) {
    return NextResponse.json({ error: "Enter an email address and choose a role." }, { status: 400 });
  }

  const db = getServiceClient();
  if (!db) return NextResponse.json({ error: "Unavailable right now." }, { status: 503 });

  // The auth users table is shared across apps: reuse the account if this
  // person already has one elsewhere, otherwise create it (no password — they
  // sign in by emailed link).
  let userId: string | null = null;
  const created = await db.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { app: "cisco" },
  });
  if (created.data.user) {
    userId = created.data.user.id;
  } else {
    const { data: all } = await db.auth.admin.listUsers({ perPage: 1000 });
    userId = all?.users.find((u) => u.email?.toLowerCase() === email)?.id ?? null;
  }
  if (!userId) {
    return NextResponse.json({ error: "That account couldn't be created." }, { status: 500 });
  }

  const { error } = await db
    .from("cisco_staff")
    .upsert({ user_id: userId, email, name: name || null, role }, { onConflict: "user_id" });
  if (error) return NextResponse.json({ error: "That didn't save. Try again." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/** DELETE { user_id } — remove staff access (the login itself is left alone). Admin only. */
export async function DELETE(request: Request) {
  const guard = await requireStaff({ admin: true });
  if ("error" in guard) return guard.error;

  const body = await readJson<{ user_id?: string }>(request);
  if (typeof body?.user_id !== "string") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (body.user_id === guard.staff.user_id) {
    return NextResponse.json({ error: "You can't remove your own access." }, { status: 400 });
  }

  const db = getServiceClient();
  if (!db) return NextResponse.json({ error: "Unavailable right now." }, { status: 503 });
  const { error } = await db.from("cisco_staff").delete().eq("user_id", body.user_id);
  if (error) return NextResponse.json({ error: "That didn't work. Try again." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
