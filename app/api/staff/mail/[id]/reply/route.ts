import { NextResponse } from "next/server";
import { getForReply, recordReply } from "@/lib/inbox/data";
import { MAX_BODY, replySubject } from "@/lib/inbox/logic";
import { HELLO_ADDRESS, sendMailOne } from "@/lib/mail";
import { readJson, requireStaff } from "@/lib/staff-api";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** POST { body } — answer a message as hello@theciscochurch.org, threaded under the original. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireStaff({ mail: true });
  if ("error" in guard) return guard.error;
  const { id } = await params;
  const input = await readJson<{ body?: string }>(request);
  const text = typeof input?.body === "string" ? input.body.trim() : "";
  if (!UUID.test(id) || !text) return NextResponse.json({ error: "Write a reply first." }, { status: 400 });
  if (text.length > MAX_BODY) return NextResponse.json({ error: "That reply is too long." }, { status: 413 });

  const original = await getForReply(id);
  if (!original) return NextResponse.json({ error: "That message no longer exists." }, { status: 404 });

  const messageId = original.message_id as string | null;
  const threaded = messageId && messageId.startsWith("<");
  const subject = replySubject(String(original.subject ?? ""));
  const result = await sendMailOne({
    to: original.from_email as string,
    subject,
    text,
    from: `${guard.staff.name ?? "The Cisco Church"} · The Cisco Church <${HELLO_ADDRESS}>`,
    replyTo: HELLO_ADDRESS,
    headers: threaded ? { "In-Reply-To": messageId, References: messageId } : undefined,
  });
  if (!result.ok) {
    return NextResponse.json({ error: "The reply couldn't be sent. Try again in a minute." }, { status: 502 });
  }

  await recordReply(id, {
    sent_at: new Date().toISOString(),
    to: original.from_email as string,
    subject,
    body: text,
    mailgun_id: result.id,
  });
  return NextResponse.json({ ok: true });
}
