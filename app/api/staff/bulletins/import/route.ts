import { NextResponse } from "next/server";
import { extractBulletin } from "@/lib/bulletin/import";
import { saveImported } from "@/lib/bulletin/staff-data";
import { requireStaff } from "@/lib/staff-api";

export const maxDuration = 300;

const MAX_BYTES = 10 * 1024 * 1024;

/**
 * POST multipart { file: PDF, replace?: "1" } — read a finished paper bulletin
 * and save it as a draft for that Sunday. The uploaded file is processed in
 * memory and not kept.
 */
export async function POST(request: Request) {
  const guard = await requireStaff();
  if ("error" in guard) return guard.error;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Choose a PDF to upload." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose a PDF to upload." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "That file is too large. The limit is 10 MB." }, { status: 413 });
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.subarray(0, 5).toString("latin1") !== "%PDF-") {
    return NextResponse.json(
      { error: "That isn't a PDF. In Word or Publisher, choose Save as → PDF and upload that." },
      { status: 400 },
    );
  }

  const result = await extractBulletin(bytes);
  if (!result.ok) {
    const failures = {
      "not-configured": [503, "Reading uploaded bulletins isn't set up yet. You can still type it in below."],
      unreadable: [422, "That PDF couldn't be read. Try saving it as a PDF again, or type it in below."],
      "no-date": [422, "The Sunday's date couldn't be found on the bulletin. Start a bulletin below and type it in."],
      refused: [422, "That file couldn't be processed. Type the bulletin in below instead."],
      unavailable: [502, "Reading the bulletin failed. Wait a minute and try again."],
    } as const;
    const [status, error] = failures[result.reason];
    return NextResponse.json({ error }, { status });
  }

  const saved = await saveImported(result.date, result.sections, form.get("replace") === "1", guard.staff);
  if (!saved.ok) {
    if (saved.reason === "exists-published") {
      return NextResponse.json(
        { error: "That Sunday's bulletin is already published. Open it from the list to edit it.", date: result.date },
        { status: 409 },
      );
    }
    if (saved.reason === "exists-draft") {
      return NextResponse.json(
        { error: "There's already a draft for that Sunday.", date: result.date, canReplace: true },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "The bulletin couldn't be saved. Try again." }, { status: 500 });
  }
  return NextResponse.json({ date: result.date });
}
