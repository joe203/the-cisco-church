import { createHmac, timingSafeEqual } from "node:crypto";
import { formatDate } from "@/lib/format";
import { sendMail } from "@/lib/mail";
import { getServiceClient } from "@/lib/supabase/server";
import { extractBulletin, type ExtractResult } from "./import";
import { saveImported } from "./staff-data";
import type { StaffMember, StaffRole } from "./types";

/**
 * Bulletin-by-email. A staff member emails the finished PDF to
 * bulletin@theciscochurch.org; Mailgun forwards it to /api/inbound/bulletin;
 * this turns it into a DRAFT and replies with a link. Nothing is ever
 * published from here — a person still reads the draft and presses Publish.
 */

const SITE = "https://theciscochurch.org";
const MAX_AGE_SECONDS = 300;
export const MAX_PDF_BYTES = 15 * 1024 * 1024;

/** Mailgun signs every webhook: HMAC-SHA256(signing key, timestamp + token). */
export function verifyMailgunSignature(timestamp: string, token: string, signature: string): boolean {
  const key = process.env.MAILGUN_SIGNING_KEY;
  if (!key || !timestamp || !token || !signature) return false;
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > MAX_AGE_SECONDS) return false;
  const expected = createHmac("sha256", key).update(timestamp + token).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** "Cyndi K <cyndi@x.com>" → "cyndi@x.com" */
export function addressOf(from: string): string {
  const match = from.match(/<([^>]+)>/);
  return (match ? match[1] : from).trim().toLowerCase();
}

/**
 * Did the message's DKIM signature verify, according to Mailgun? DKIM is the
 * check that survives forwarding and ties the message to the sender's mail
 * provider (Outlook and Gmail both sign). SPF alone is not accepted — it only
 * covers the hidden envelope sender, not the "From" address a person sees.
 */
export function senderVerified(fields: Record<string, string>): boolean {
  const values: string[] = [];
  for (const [name, value] of Object.entries(fields)) {
    if (/^x-mailgun-dkim-check-result$/i.test(name)) values.push(value);
  }
  try {
    const headers = JSON.parse(fields["message-headers"] ?? "[]") as [string, string][];
    for (const [name, value] of headers) {
      if (/^x-mailgun-dkim-check-result$/i.test(name)) values.push(value);
    }
  } catch {
    // unparseable headers simply contribute nothing
  }
  return values.some((v) => v.trim().toLowerCase() === "pass");
}

export async function findStaffByEmail(email: string): Promise<StaffMember | null> {
  const db = getServiceClient();
  if (!db) return null;
  const { data } = await db
    .from("cisco_staff")
    .select("user_id, email, name, role")
    .ilike("email", email)
    .maybeSingle();
  return data
    ? {
        user_id: data.user_id as string,
        email: data.email as string,
        name: (data.name as string | null) ?? null,
        role: data.role as StaffRole,
      }
    : null;
}

async function adminEmails(): Promise<string[]> {
  const db = getServiceClient();
  if (!db) return [];
  const { data } = await db.from("cisco_staff").select("email").eq("role", "admin");
  return (data ?? []).map((r) => String(r.email).toLowerCase());
}

export type InboundMessage = {
  messageId: string;
  staff: StaffMember;
  subject: string;
  pdf: Buffer | null;
};

const FAILURES: Record<Exclude<ExtractResult, { ok: true }>["reason"], string> = {
  "not-configured": "Reading bulletins isn't switched on for the website right now.",
  unreadable: "The PDF couldn't be read. This sometimes happens when a Word file has only been renamed to .pdf.",
  "no-date": "The Sunday's date couldn't be found on the bulletin.",
  refused: "That file couldn't be processed.",
  unavailable: "The reading service had a problem. Waiting a few minutes and sending it again usually fixes this.",
};

async function reply(staff: StaffMember, subject: string, body: string) {
  const to = [...new Set([staff.email.toLowerCase(), ...(await adminEmails())])];
  const first = staff.name?.split(" ")[0] ?? "";
  await sendMail({
    to,
    subject,
    text: `${first ? `Hi ${first},` : "Hello,"}\n\n${body}\n\n— The Cisco Church website\n`,
  });
}

const UPLOAD_FALLBACK = `If you'd rather not wait, you can also upload the PDF yourself:\n${SITE}/staff`;

/** Runs after the webhook has already been answered. Always ends by logging the outcome. */
export async function processInbound(message: InboundMessage): Promise<void> {
  const db = getServiceClient();
  if (!db) return;
  const finish = async (status: string, detail: string, date?: string) => {
    await db
      .from("cisco_inbound_log")
      .update({
        status,
        detail: detail.slice(0, 500),
        bulletin_date: date ?? null,
        processed_at: new Date().toISOString(),
      })
      .eq("message_id", message.messageId);
  };

  try {
    if (!message.pdf) {
      await finish("failed", "no pdf attached");
      await reply(
        message.staff,
        "I couldn't find a bulletin PDF in your email",
        `Your email arrived, but there was no PDF attached. Please send it again with the finished bulletin attached as a PDF.\n\n${UPLOAD_FALLBACK}`,
      );
      return;
    }

    const result = await extractBulletin(message.pdf);
    if (!result.ok) {
      await finish("failed", `read failed: ${result.reason}`);
      await reply(
        message.staff,
        "I couldn't turn that bulletin into a draft",
        `${FAILURES[result.reason]}\n\nNothing was changed on the website. Please try again, or type it in from the Staff page:\n${SITE}/staff`,
      );
      return;
    }

    const { date } = result;
    const label = formatDate(date);

    // An earlier draft for this Sunday may be replaced only if nobody has
    // edited it since it was imported; a published bulletin is never touched.
    const { data: existing } = await db
      .from("cisco_bulletins")
      .select("status, updated_at")
      .eq("bulletin_date", date)
      .maybeSingle();
    let replace = false;
    if (existing?.status === "published") {
      await finish("failed", "already published", date);
      await reply(
        message.staff,
        `The ${label} bulletin is already published`,
        `Your PDF is for Sunday, ${label}, but that bulletin is already live on the website, so I left it alone.\n\nIf it needs a change, open it and edit it here:\n${SITE}/staff/bulletin/${date}`,
      );
      return;
    }
    if (existing) {
      const { data: last } = await db
        .from("cisco_inbound_log")
        .select("processed_at")
        .eq("bulletin_date", date)
        .eq("status", "draft_created")
        .order("processed_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      replace = Boolean(last?.processed_at && new Date(existing.updated_at as string) <= new Date(last.processed_at as string));
      if (!replace) {
        await finish("failed", "draft already exists and was edited", date);
        await reply(
          message.staff,
          `There's already a draft for ${label}`,
          `Your PDF is for Sunday, ${label}, but a draft for that Sunday already exists and has been edited, so I didn't replace it.\n\nOpen it here:\n${SITE}/staff/bulletin/${date}\n\nTo replace it with this PDF, upload the file from the Staff page and choose "Replace that draft":\n${SITE}/staff`,
        );
        return;
      }
    }

    const saved = await saveImported(date, result.sections, replace, message.staff);
    if (!saved.ok) {
      await finish("failed", `save failed: ${saved.reason}`, date);
      await reply(
        message.staff,
        "I couldn't save the draft",
        `The bulletin was read, but saving it failed. Please try again in a few minutes.\n\n${UPLOAD_FALLBACK}`,
      );
      return;
    }

    await finish("draft_created", replace ? "replaced an unedited earlier draft" : "new draft", date);
    await reply(
      message.staff,
      `Bulletin draft ready — Sunday, ${label}`,
      `The bulletin you sent is now a draft for Sunday, ${label}.${replace ? " It replaced the earlier draft you sent for that Sunday." : ""} Nothing is on the website yet.\n\n` +
        `1. Open the draft:\n   ${SITE}/staff/bulletin/${date}\n   (If it asks you to sign in, enter your email address and use the link we send.)\n` +
        `2. Compare it with the paper copy — especially the names in the prayer list and the dates and times.\n` +
        `3. Press Publish.`,
    );
  } catch {
    await finish("failed", "unexpected error");
    await reply(
      message.staff,
      "I couldn't turn that bulletin into a draft",
      `Something unexpected went wrong. Nothing was changed on the website.\n\n${UPLOAD_FALLBACK}`,
    );
  }
}
