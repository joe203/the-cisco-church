import { NextResponse } from "next/server";
import { listMail } from "@/lib/inbox/data";
import { INBOX_FILTERS, type InboxFilter } from "@/lib/inbox/logic";
import { requireStaff } from "@/lib/staff-api";

export const dynamic = "force-dynamic";

/** GET ?filter= — the message list plus the unread count. */
export async function GET(request: Request) {
  const guard = await requireStaff({ mail: true });
  if ("error" in guard) return guard.error;

  const requested = new URL(request.url).searchParams.get("filter") as InboxFilter | null;
  const filter = requested && INBOX_FILTERS.includes(requested) ? requested : "all";
  return NextResponse.json(await listMail(filter));
}
