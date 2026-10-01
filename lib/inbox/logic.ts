/**
 * Inbox rules that need no database or mail server — kept separate so they
 * are easy to read and to test.
 */

export type InboxFilter = "all" | "new" | "read" | "replied" | "sent" | "archived";

export const INBOX_FILTERS: readonly InboxFilter[] = ["all", "new", "read", "replied", "sent", "archived"];

export const INBOX_FILTER_LABELS: Record<InboxFilter, string> = {
  all: "All",
  new: "New",
  read: "Read",
  replied: "Replied",
  sent: "Sent",
  archived: "Archived",
};

/** One send addresses at most this many people — a mailing list is a different tool. */
export const MAX_COMPOSE_RECIPIENTS = 25;
export const MAX_BODY = 20_000;

export type InboxReply = { sent_at: string; to: string; subject: string; body: string; mailgun_id: string | null };
export type RecipientResult = { to: string; ok: boolean; mailgun_id: string | null };

/** What the list shows — no bodies. */
export type MailSummary = {
  id: string;
  folder: "inbox" | "sent";
  status: "received" | "read" | "replied" | "archived" | "sent";
  from_email: string;
  from_name: string | null;
  to_email: string | null;
  subject: string;
  snippet: string;
  received_at: string;
  spam: boolean;
  attachments: number;
};

export type MailDetail = MailSummary & {
  text_body: string | null;
  html_body: string | null;
  replies: InboxReply[];
  recipients: RecipientResult[];
  attachment_names: string[];
};

const ADDRESS = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/;

/**
 * Accepts commas, semicolons, newlines, and `Name <addr>` pasted from a
 * contacts app. De-duplicates case-insensitively so nobody is mailed twice.
 */
export function parseRecipients(raw: string): { valid: string[]; invalid: string[]; tooMany: boolean } {
  const seen = new Set<string>();
  const valid: string[] = [];
  const invalid: string[] = [];
  for (const piece of raw.split(/[,;\n]+/)) {
    const part = piece.trim();
    if (!part) continue;
    const angle = part.match(/<([^>]+)>/);
    const address = (angle ? angle[1] : part).trim().toLowerCase();
    if (!ADDRESS.test(address)) {
      invalid.push(part);
      continue;
    }
    if (seen.has(address)) continue;
    seen.add(address);
    valid.push(address);
  }
  return { valid, invalid, tooMany: valid.length > MAX_COMPOSE_RECIPIENTS };
}

export function replySubject(subject: string): string {
  return /^re:\s/i.test(subject) ? subject : `Re: ${subject || "(no subject)"}`;
}

/** SpamAssassin-style score from Mailgun: 5 and up is what most filters call spam. */
export function isSpamScore(score: unknown): boolean {
  const n = typeof score === "string" || typeof score === "number" ? Number(score) : NaN;
  return Number.isFinite(n) && n >= 5;
}

export function snippetOf(text: string | null, html: string | null): string {
  const source = text?.trim() || (html ?? "").replace(/<style[\s\S]*?<\/style>|<[^>]+>/g, " ");
  return source.replace(/\s+/g, " ").trim().slice(0, 140);
}
