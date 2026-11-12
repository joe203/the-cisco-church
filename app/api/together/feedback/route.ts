import { NextResponse } from "next/server";
import { adminEmails } from "@/lib/bulletin/inbound";
import { cleanFeedback, feedbackText } from "@/lib/feedback/schema";
import { mailConfigured, sendMail } from "@/lib/mail";
import { readJson } from "@/lib/staff-api";
import { getServiceClient } from "@/lib/supabase/server";
import { getFeedbackMember } from "@/lib/feedback/access";
import { tooMany } from "@/lib/together/access";

/**
 * A member's "How's it going?" response. Saved to cisco_feedback and emailed to
 * the admins only (concerns stay with Joe and the elders). Members signed in
 * through an emailed link only, so every response has a name on it.
 */
export async function POST(request: Request) {
  const member = await getFeedbackMember();
  if (!member) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  if (tooMany(request, "feedback", 8, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many tries. Please wait a bit." }, { status: 429 });
  }

  const body = await readJson<Record<string, unknown>>(request);
  if (!body) return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 400 });

  const cleaned = cleanFeedback(body);
  if (!cleaned.ok) return NextResponse.json({ error: cleaned.error }, { status: 400 });
  const f = cleaned.value;
  const name = member.name || member.email || member.phone || "A member";

  const db = getServiceClient();
  let saved = false;
  if (db) {
    const { error } = await db.from("cisco_feedback").insert({
      member_id: member.id,
      member_name: name,
      age_range: f.profile.age,
      tradition: f.profile.tradition,
      stance: f.profile.stance,
      growth: f.profile.growth,
      tenure: f.profile.tenure,
      attendance: f.profile.attendance,
      read_direction: f.profile.read,
      value_ratings: f.profile.values,
      about_note: f.profile.note || null,
      areas: f.areas,
      area_notes: f.area_notes,
      noticed: f.noticed,
      keep_doing: f.keep_doing || null,
      tries: f.tries,
      try_notes: f.try_notes,
      idea: f.idea || null,
      concern: f.concern || null,
      suggestion: f.suggestion || null,
      wants_talk: Boolean(f.concern) && f.wants_talk,
      share: f.share,
      metadata: { source: "web" },
    });
    saved = !error;
  }

  let emailed = false;
  if (mailConfigured()) {
    const subject = f.concern
      ? `How's it going: ${name} (includes a concern${f.wants_talk ? ", wants to talk" : ""})`
      : `How's it going: ${name}`;
    emailed = await sendMail({ to: await adminEmails(), subject, text: feedbackText(name, f) });
  }

  if (!saved && !emailed) {
    return NextResponse.json({ error: "That didn’t send. Please try again in a minute." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
