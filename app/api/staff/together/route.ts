import { NextResponse } from "next/server";
import { readJson, requireStaff } from "@/lib/staff-api";
import { getServiceClient } from "@/lib/supabase/server";
import { addMembers } from "@/lib/together/members";

/** POST { text } — add members, one per line (name, phone and/or email). Any staff role. */
export async function POST(request: Request) {
  const guard = await requireStaff();
  if ("error" in guard) return guard.error;

  const body = await readJson<{ text?: unknown }>(request);
  const text = typeof body?.text === "string" ? body.text.slice(0, 20000) : "";
  if (!text.trim()) return NextResponse.json({ error: "Add at least one person." }, { status: 400 });

  const result = await addMembers(text);
  if (!result) return NextResponse.json({ error: "Unavailable right now." }, { status: 503 });
  return NextResponse.json({ ok: true, ...result });
}

/** DELETE { id } — take someone off the list; their next visit asks them to sign in again. */
export async function DELETE(request: Request) {
  const guard = await requireStaff();
  if ("error" in guard) return guard.error;

  const body = await readJson<{ id?: unknown }>(request);
  if (typeof body?.id !== "string") return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const db = getServiceClient();
  if (!db) return NextResponse.json({ error: "Unavailable right now." }, { status: 503 });
  const { error } = await db.from("cisco_together_members").delete().eq("id", body.id);
  if (error) return NextResponse.json({ error: "That didn’t work. Try again." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
