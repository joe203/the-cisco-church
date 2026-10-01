import { NextResponse, after } from "next/server";
import {
  addressOf,
  findStaffByEmail,
  MAX_PDF_BYTES,
  processInbound,
  senderVerified,
  verifyMailgunSignature,
} from "@/lib/bulletin/inbound";
import { getServiceClient } from "@/lib/supabase/server";

export const maxDuration = 300;

/**
 * Mailgun forwards mail sent to bulletin@theciscochurch.org here. Answered
 * straight away (Mailgun retries slow webhooks); the reading happens after the
 * response. Accepts only: a genuine Mailgun signature, a sender who is on
 * cisco_staff, and a passing DKIM check. Everything else is logged and ignored.
 */
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

  const messageId = field("Message-Id") || field("message-id") || `token:${field("token")}`;
  const senderAddress = addressOf(field("from") || field("sender"));
  const subject = field("subject").slice(0, 200);

  // One row per message: a retry of the same email finds this and stops.
  const { error: dupe } = await db
    .from("cisco_inbound_log")
    .insert({ message_id: messageId, sender: senderAddress, subject });
  if (dupe) return NextResponse.json({ ok: true, duplicate: true });

  const finish = (status: string, detail: string) =>
    db
      .from("cisco_inbound_log")
      .update({ status, detail, processed_at: new Date().toISOString() })
      .eq("message_id", messageId);

  const staff = await findStaffByEmail(senderAddress);
  if (!staff) {
    await finish("ignored", "sender is not staff");
    return NextResponse.json({ ok: true });
  }

  const fields: Record<string, string> = {};
  for (const [name, value] of form.entries()) if (typeof value === "string") fields[name] = value;
  if (!senderVerified(fields)) {
    await finish("ignored", "sender failed DKIM verification");
    return NextResponse.json({ ok: true });
  }

  // First PDF attachment.
  let pdf: Buffer | null = null;
  for (const [name, value] of form.entries()) {
    if (!/^attachment-\d+$/.test(name) || typeof value === "string") continue;
    if (value.size === 0 || value.size > MAX_PDF_BYTES) continue;
    const bytes = Buffer.from(await value.arrayBuffer());
    if (bytes.subarray(0, 5).toString("latin1") === "%PDF-") {
      pdf = bytes;
      break;
    }
  }

  after(() => processInbound({ messageId, staff, subject, pdf }));
  return NextResponse.json({ ok: true });
}
