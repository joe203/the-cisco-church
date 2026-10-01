import { NextResponse, after } from "next/server";
import { addressOf, verifyMailgunSignature } from "@/lib/bulletin/inbound";
import { alertNewMail } from "@/lib/inbox/alert";
import { isSpamScore, snippetOf } from "@/lib/inbox/logic";
import { getServiceClient } from "@/lib/supabase/server";

/**
 * Mailgun forwards mail sent to any @theciscochurch.org address EXCEPT
 * bulletin@ (that one feeds the bulletin importer) here. Stored first, in
 * full, before anything else happens — a dead SMS service must never lose a
 * message. Anyone may write to the church, so unlike the bulletin intake this
 * does not require a staff sender; the only gate is Mailgun's signature.
 * Attachments are NOT kept: their names and sizes are recorded, nothing more.
 */

const MAX_TEXT = 200_000;
const MAX_HTML = 400_000;

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const field = (name: string) => (typeof form.get(name) === "string" ? (form.get(name) as string) : "");
  if (!verifyMailgunSignature(field("timestamp"), field("token"), field("signature"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 406 });
  }

  const db = getServiceClient();
  if (!db) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const fromHeader = field("from") || field("sender");
  const nameMatch = fromHeader.match(/^\s*"?([^"<]+?)"?\s*</);
  const text = field("body-plain").slice(0, MAX_TEXT) || null;
  const html = field("body-html").slice(0, MAX_HTML) || null;

  // Spam score arrives as a field or inside the raw header list, depending on the route.
  let score: string = field("X-Mailgun-Sscore");
  if (!score) {
    try {
      const headers = JSON.parse(field("message-headers") || "[]") as [string, string][];
      score = headers.find(([name]) => /^x-mailgun-sscore$/i.test(name))?.[1] ?? "";
    } catch {
      score = "";
    }
  }

  const attachments: { name: string; size: number }[] = [];
  for (const [name, value] of form.entries()) {
    if (/^attachment-\d+$/.test(name) && typeof value !== "string") {
      attachments.push({ name: value.name.slice(0, 120), size: value.size });
    }
  }

  const { data, error } = await db
    .from("cisco_mail")
    .insert({
      message_id: field("Message-Id") || field("message-id") || `token:${field("token")}`,
      folder: "inbox",
      status: "received",
      from_email: addressOf(fromHeader),
      from_name: nameMatch ? nameMatch[1].trim().slice(0, 120) : null,
      to_email: (field("recipient") || field("To")).slice(0, 300) || null,
      subject: field("subject").slice(0, 300),
      text_body: text,
      html_body: html,
      metadata: {
        snippet: snippetOf(text, html),
        spam: isSpamScore(score),
        spam_score: score || null,
        attachments,
      },
    })
    .select("id, metadata")
    .single();

  // A retry of the same message hits the unique message_id: already stored.
  if (error) return NextResponse.json({ ok: true, duplicate: true });

  if (!(data.metadata as { spam?: boolean }).spam) after(() => alertNewMail(data.id as string));
  return NextResponse.json({ ok: true });
}
