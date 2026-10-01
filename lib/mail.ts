/**
 * Outbound mail for the site itself (the "your draft is ready" replies).
 *
 * Sends through Mailgun with a key scoped to theciscochurch.org ONLY — it
 * cannot send as any other church's domain. Sign-in emails are separate: those
 * go through the shared auth-mailer hook.
 */

const DOMAIN = "theciscochurch.org";
const FROM = `The Cisco Church <no-reply@${DOMAIN}>`;

export function mailConfigured(): boolean {
  return Boolean(process.env.MAILGUN_SENDING_KEY);
}

export async function sendMail(message: { to: string[]; subject: string; text: string }): Promise<boolean> {
  const key = process.env.MAILGUN_SENDING_KEY;
  if (!key || message.to.length === 0) return false;
  const form = new URLSearchParams({
    from: FROM,
    to: message.to.join(","),
    subject: message.subject,
    text: message.text,
  });
  try {
    const res = await fetch(`https://api.mailgun.net/v3/${DOMAIN}/messages`, {
      method: "POST",
      headers: { Authorization: `Basic ${Buffer.from(`api:${key}`).toString("base64")}` },
      body: form,
    });
    return res.ok;
  } catch {
    return false;
  }
}
