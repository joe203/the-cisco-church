/**
 * Outbound mail for the site itself (bulletin "draft ready" replies, and the
 * staff inbox's replies and composed messages).
 *
 * Sends through Mailgun with a key scoped to theciscochurch.org ONLY — it
 * cannot send as any other church's domain. Sign-in emails are separate: those
 * go through the shared auth-mailer hook.
 */

const DOMAIN = "theciscochurch.org";
export const NO_REPLY_FROM = `The Cisco Church <no-reply@${DOMAIN}>`;
/** The public address people write to and that staff replies come from. */
export const HELLO_ADDRESS = `hello@${DOMAIN}`;

export function mailConfigured(): boolean {
  return Boolean(process.env.MAILGUN_SENDING_KEY);
}

export type MailMessage = {
  to: string;
  subject: string;
  text: string;
  from?: string;
  replyTo?: string;
  /** Extra RFC headers, e.g. In-Reply-To / References for a threaded reply. */
  headers?: Record<string, string>;
};

/** One message to one recipient. Returns Mailgun's message id on success. */
export async function sendMailOne(message: MailMessage): Promise<{ ok: boolean; id: string | null }> {
  const key = process.env.MAILGUN_SENDING_KEY;
  if (!key) return { ok: false, id: null };
  const form = new URLSearchParams({
    from: message.from ?? NO_REPLY_FROM,
    to: message.to,
    subject: message.subject,
    text: message.text,
  });
  if (message.replyTo) form.set("h:Reply-To", message.replyTo);
  for (const [name, value] of Object.entries(message.headers ?? {})) form.set(`h:${name}`, value);
  try {
    const res = await fetch(`https://api.mailgun.net/v3/${DOMAIN}/messages`, {
      method: "POST",
      headers: { Authorization: `Basic ${Buffer.from(`api:${key}`).toString("base64")}` },
      body: form,
    });
    if (!res.ok) return { ok: false, id: null };
    const body = (await res.json().catch(() => null)) as { id?: string } | null;
    return { ok: true, id: body?.id ?? null };
  } catch {
    return { ok: false, id: null };
  }
}

/** One message to several people, who see each other (a staff notice). */
export async function sendMail(message: { to: string[]; subject: string; text: string }): Promise<boolean> {
  if (message.to.length === 0) return false;
  return (await sendMailOne({ ...message, to: message.to.join(",") })).ok;
}
