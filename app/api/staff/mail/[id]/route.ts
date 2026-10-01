import { NextResponse } from "next/server";
import { applyAction, openMail, type MailAction } from "@/lib/inbox/data";
import { readJson, requireStaff } from "@/lib/staff-api";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** GET — one message in full. Opening an unread message marks it read. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireStaff({ mail: true });
  if ("error" in guard) return guard.error;
  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const message = await openMail(id);
  if (!message) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(message);
}

/** PATCH { action: "unread" | "archive" | "unarchive" } */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireStaff({ mail: true });
  if ("error" in guard) return guard.error;
  const { id } = await params;
  const body = await readJson<{ action?: string }>(request);
  const action = body?.action as MailAction | undefined;
  if (!UUID.test(id) || !action || !["unread", "archive", "unarchive"].includes(action)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!(await applyAction(id, action))) {
    return NextResponse.json({ error: "That didn't work. Try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
