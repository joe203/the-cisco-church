import { NextResponse } from "next/server";
import { adminEmails } from "@/lib/bulletin/inbound";
import { backAt, recordAttempt } from "@/lib/directory/guard";
import { cleanSubmission, submissionText } from "@/lib/directory/schema";
import { mailConfigured, sendMailOne } from "@/lib/mail";
import { site } from "@/lib/site";
import { readJson } from "@/lib/staff-api";
import { getServiceClient } from "@/lib/supabase/server";
import { tooMany } from "@/lib/together/access";

const pausedReply = (until: Date) =>
  NextResponse.json(
    { error: `This form is paused and will be back around ${backAt(until)}. Please try again then.`, paused: true },
    { status: 503 },
  );

/**
 * A household's directory update from /directory. Saved to cisco_directory_submissions
 * and emailed to the church office (with Joe), replies going to the family.
 */
export async function POST(request: Request) {
  const paused = await recordAttempt();
  if (paused) return pausedReply(paused);

  if (tooMany(request, "directory", 6, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "That’s a lot of tries from one place. Please wait a bit and try again." }, { status: 429 });
  }

  const body = await readJson<Record<string, unknown>>(request);
  if (!body) return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 400 });

  // Hidden field only a bot fills in: pretend it worked.
  if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ ok: true });

  const cleaned = cleanSubmission(body);
  if (!cleaned.ok) return NextResponse.json({ error: cleaned.error }, { status: 400 });
  const form = cleaned.value;

  const db = getServiceClient();
  const canMail = mailConfigured();
  if (!db && !canMail) {
    return NextResponse.json({ error: "Sending isn’t available right now. Please give your information to the church office." }, { status: 503 });
  }

  let saved = false;
  let id: string | null = null;
  if (db) {
    const { data, error } = await db
      .from("cisco_directory_submissions")
      .insert({ ...form, metadata: { source: "web" } })
      .select("id")
      .single();
    saved = !error;
    id = (data as { id?: string } | null)?.id ?? null;
  }

  let emailed = false;
  if (canMail) {
    const to = [...new Set([...(site.email ? [site.email.toLowerCase()] : []), ...(await adminEmails())])];
    const replyTo = form.adults.find((a) => a.email)?.email;
    const status = form.status === "changed" ? "update" : "no changes";
    const sent = await sendMailOne({
      to: to.join(","),
      subject: `Directory ${status}: ${form.household_name}`,
      text: submissionText(form),
      replyTo,
    });
    emailed = sent.ok;
  }

  if (saved && id && db && !emailed) {
    await db.from("cisco_directory_submissions").update({ metadata: { source: "web", emailed: false } }).eq("id", id);
  }
  if (!saved && !emailed) {
    return NextResponse.json({ error: "That didn’t send. Please try again in a minute." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
