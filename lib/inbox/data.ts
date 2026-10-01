import { getServiceClient } from "@/lib/supabase/server";
import {
  type InboxFilter,
  type InboxReply,
  type MailDetail,
  type MailSummary,
  type RecipientResult,
} from "./logic";

/**
 * The inbox's database access — service role only (cisco_mail has RLS on and
 * no policies). Every caller must have passed requireStaff({ mail: true }).
 */

const COLUMNS =
  "id, folder, status, from_email, from_name, to_email, subject, received_at, read_at, replied_at, metadata";
const DETAIL_COLUMNS = `${COLUMNS}, text_body, html_body`;

type Row = Record<string, unknown>;
type Meta = {
  snippet?: string;
  spam?: boolean;
  attachments?: { name: string; size: number }[];
  replies?: InboxReply[];
  recipients?: RecipientResult[];
  alerted?: boolean;
};

const meta = (row: Row): Meta => (row.metadata as Meta | null) ?? {};

function summaryOf(row: Row): MailSummary {
  const m = meta(row);
  return {
    id: row.id as string,
    folder: row.folder as MailSummary["folder"],
    status: row.status as MailSummary["status"],
    from_email: row.from_email as string,
    from_name: (row.from_name as string | null) ?? null,
    to_email: (row.to_email as string | null) ?? null,
    subject: (row.subject as string) ?? "",
    snippet: m.snippet ?? "",
    received_at: row.received_at as string,
    spam: m.spam === true,
    attachments: m.attachments?.length ?? 0,
  };
}

function detailOf(row: Row): MailDetail {
  const m = meta(row);
  return {
    ...summaryOf(row),
    text_body: (row.text_body as string | null) ?? null,
    html_body: (row.html_body as string | null) ?? null,
    replies: m.replies ?? [],
    recipients: m.recipients ?? [],
    attachment_names: (m.attachments ?? []).map((a) => a.name),
  };
}

export async function listMail(filter: InboxFilter): Promise<{ messages: MailSummary[]; unread: number }> {
  const db = getServiceClient();
  if (!db) return { messages: [], unread: 0 };

  let query = db.from("cisco_mail").select(COLUMNS).order("received_at", { ascending: false }).limit(100);
  if (filter === "sent") query = query.eq("folder", "sent");
  else {
    query = query.eq("folder", "inbox");
    if (filter === "new") query = query.eq("status", "received");
    if (filter === "read") query = query.eq("status", "read");
    if (filter === "replied") query = query.eq("status", "replied");
    if (filter === "archived") query = query.eq("status", "archived");
  }
  const [{ data }, unread] = await Promise.all([query, unreadCount()]);
  return { messages: (data ?? []).map(summaryOf), unread };
}

export async function unreadCount(): Promise<number> {
  const db = getServiceClient();
  if (!db) return 0;
  const { count } = await db
    .from("cisco_mail")
    .select("id", { count: "exact", head: true })
    .eq("folder", "inbox")
    .eq("status", "received");
  return count ?? 0;
}

/** Opens a message; an unread inbox message becomes read. */
export async function openMail(id: string): Promise<MailDetail | null> {
  const db = getServiceClient();
  if (!db) return null;
  const { data } = await db.from("cisco_mail").select(DETAIL_COLUMNS).eq("id", id).maybeSingle();
  if (!data) return null;
  if (data.folder === "inbox" && data.status === "received") {
    await db.from("cisco_mail").update({ status: "read", read_at: new Date().toISOString() }).eq("id", id);
    data.status = "read";
  }
  return detailOf(data);
}

export type MailAction = "unread" | "archive" | "unarchive";

export async function applyAction(id: string, action: MailAction): Promise<boolean> {
  const db = getServiceClient();
  if (!db) return false;
  const { data: row } = await db
    .from("cisco_mail")
    .select("folder, read_at, replied_at")
    .eq("id", id)
    .maybeSingle();
  if (!row || row.folder !== "inbox") return false;

  const patch =
    action === "unread"
      ? { status: "received", read_at: null }
      : action === "archive"
        ? { status: "archived", archived_at: new Date().toISOString() }
        : { status: row.replied_at ? "replied" : row.read_at ? "read" : "received", archived_at: null };
  const { error } = await db.from("cisco_mail").update(patch).eq("id", id);
  return !error;
}

export async function getForReply(id: string) {
  const db = getServiceClient();
  if (!db) return null;
  const { data } = await db
    .from("cisco_mail")
    .select("id, folder, from_email, subject, message_id, metadata")
    .eq("id", id)
    .maybeSingle();
  return data && data.folder === "inbox" ? data : null;
}

export async function recordReply(id: string, reply: InboxReply): Promise<boolean> {
  const db = getServiceClient();
  if (!db) return false;
  const { data: row } = await db.from("cisco_mail").select("metadata").eq("id", id).maybeSingle();
  if (!row) return false;
  const m = meta(row);
  const { error } = await db
    .from("cisco_mail")
    .update({
      status: "replied",
      replied_at: reply.sent_at,
      metadata: { ...m, replies: [...(m.replies ?? []), reply] },
    })
    .eq("id", id);
  return !error;
}

/** Recorded even when every send failed — "I tried and Mailgun refused" is worth seeing later. */
export async function recordSent(input: {
  from: string;
  subject: string;
  body: string;
  recipients: RecipientResult[];
}): Promise<void> {
  const db = getServiceClient();
  if (!db) return;
  await db.from("cisco_mail").insert({
    message_id: null,
    folder: "sent",
    status: "sent",
    from_email: input.from,
    to_email: input.recipients.map((r) => r.to).join(", "),
    subject: input.subject,
    text_body: input.body,
    metadata: { snippet: input.body.replace(/\s+/g, " ").trim().slice(0, 140), recipients: input.recipients },
  });
}
