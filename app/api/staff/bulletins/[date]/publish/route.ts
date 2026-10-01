import { NextResponse } from "next/server";
import { isIsoDate } from "@/lib/bulletin/schema";
import { revalidateBulletin } from "@/lib/bulletin/revalidate";
import { setPublished } from "@/lib/bulletin/staff-data";
import { readJson, requireStaff } from "@/lib/staff-api";

/** POST { published } — publish the bulletin, or pull it back to a draft. */
export async function POST(request: Request, { params }: { params: Promise<{ date: string }> }) {
  const guard = await requireStaff();
  if ("error" in guard) return guard.error;

  const { date } = await params;
  const body = await readJson<{ published?: boolean }>(request);
  if (!isIsoDate(date) || typeof body?.published !== "boolean") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = await setPublished(date, body.published, guard.staff);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.reason === "not-found" ? "That bulletin doesn't exist." : "That didn't work. Try again." },
      { status: result.reason === "not-found" ? 404 : 500 },
    );
  }

  revalidateBulletin(date);
  return NextResponse.json({ status: result.bulletin.status, published_at: result.bulletin.published_at });
}
