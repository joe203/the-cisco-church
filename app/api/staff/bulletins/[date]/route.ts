import { NextResponse } from "next/server";
import { isIsoDate } from "@/lib/bulletin/schema";
import { saveSections } from "@/lib/bulletin/staff-data";
import type { SectionKey } from "@/lib/bulletin/types";
import { readJson, requireStaff } from "@/lib/staff-api";
import { revalidateBulletin } from "@/lib/bulletin/revalidate";

type Params = { date: string };

/** PUT { base_updated_at, sections } — save draft edits to the sections this role may edit. */
export async function PUT(request: Request, { params }: { params: Promise<Params> }) {
  const guard = await requireStaff();
  if ("error" in guard) return guard.error;

  const { date } = await params;
  const body = await readJson<{
    base_updated_at?: string | null;
    sections?: Partial<Record<SectionKey, unknown>>;
  }>(request);
  if (!isIsoDate(date) || !body?.sections || typeof body.sections !== "object") {
    return NextResponse.json({ error: "Nothing to save." }, { status: 400 });
  }

  const result = await saveSections(date, body.sections, body.base_updated_at ?? null, guard.staff);
  if (!result.ok) {
    const failures = {
      conflict: [409, "Someone else saved this bulletin while you were editing. Reload to see their changes."],
      forbidden: [403, "Your account can't edit one of those sections."],
      "not-found": [404, "That bulletin doesn't exist."],
      "no-database": [503, "Saving isn't available right now."],
      failed: [500, "The bulletin couldn't be saved. Try again."],
    } as const;
    const [status, error] = failures[result.reason];
    return NextResponse.json({ error }, { status });
  }

  if (result.bulletin.status === "published") revalidateBulletin(date);
  return NextResponse.json({ updated_at: result.bulletin.updated_at });
}
