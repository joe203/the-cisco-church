import { NextResponse } from "next/server";
import { recordSent } from "@/lib/inbox/data";
import { MAX_BODY, MAX_COMPOSE_RECIPIENTS, parseRecipients, type RecipientResult } from "@/lib/inbox/logic";
import { HELLO_ADDRESS, sendMailOne } from "@/lib/mail";
import { readJson, requireStaff } from "@/lib/staff-api";

/**
 * POST { to, subject, body } — start a conversation as hello@theciscochurch.org.
 * Every recipient gets their OWN message (addresses are never shown to each
 * other — a disclosure that can't be undone), duplicates are dropped first,
 * and the record is kept even if every send fails.
 */
export async function POST(request: Request) {
  const guard = await requireStaff({ mail: true });
  if ("error" in guard) return guard.error;

  const input = await readJson<{ to?: string; subject?: string; body?: string }>(request);
  const subject = typeof input?.subject === "string" ? input.subject.trim().slice(0, 200) : "";
  const body = typeof input?.body === "string" ? input.body.trim() : "";
  const { valid, invalid, tooMany } = parseRecipients(typeof input?.to === "string" ? input.to : "");

  if (valid.length === 0) {
    return NextResponse.json({ error: "Add at least one email address." }, { status: 400 });
  }
  if (invalid.length > 0) {
    return NextResponse.json({ error: `These don't look like email addresses: ${invalid.join(", ")}` }, { status: 400 });
  }
  if (tooMany) {
    return NextResponse.json(
      { error: `One message can go to at most ${MAX_COMPOSE_RECIPIENTS} people.` },
      { status: 400 },
    );
  }
  if (!subject || !body) {
    return NextResponse.json({ error: "Add a subject and a message." }, { status: 400 });
  }
  if (body.length > MAX_BODY) return NextResponse.json({ error: "That message is too long." }, { status: 413 });

  const from = `${guard.staff.name ?? "The Cisco Church"} · The Cisco Church <${HELLO_ADDRESS}>`;
  const recipients: RecipientResult[] = [];
  for (const to of valid) {
    const sent = await sendMailOne({ to, subject, text: body, from, replyTo: HELLO_ADDRESS });
    recipients.push({ to, ok: sent.ok, mailgun_id: sent.id });
  }
  await recordSent({ from: HELLO_ADDRESS, subject, body, recipients });

  const failed = recipients.filter((r) => !r.ok).length;
  if (failed === recipients.length) {
    return NextResponse.json({ error: "Nothing could be sent. Try again in a minute." }, { status: 502 });
  }
  return NextResponse.json({ sent: recipients.length - failed, failed });
}
