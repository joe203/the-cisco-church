import { NextResponse } from "next/server";
import { isIsoDate } from "@/lib/bulletin/schema";
import { createBulletin } from "@/lib/bulletin/staff-data";
import { readJson, requireStaff } from "@/lib/staff-api";

/** POST { date } — start a bulletin for a Sunday, carrying over from the last one. */
export async function POST(request: Request) {
  const guard = await requireStaff();
  if ("error" in guard) return guard.error;

  const body = await readJson<{ date?: string }>(request);
  if (!isIsoDate(body?.date)) {
    return NextResponse.json({ error: "Pick a valid date." }, { status: 400 });
  }

  const result = await createBulletin(body.date, guard.staff);
  if (!result.ok) {
    const message =
      result.reason === "conflict"
        ? "There is already a bulletin for that Sunday."
        : "The bulletin couldn't be created. Try again.";
    return NextResponse.json({ error: message }, { status: result.reason === "conflict" ? 409 : 500 });
  }
  return NextResponse.json({ date: result.bulletin.bulletin_date });
}
