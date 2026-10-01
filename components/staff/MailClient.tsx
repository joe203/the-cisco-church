"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  INBOX_FILTERS,
  INBOX_FILTER_LABELS,
  MAX_COMPOSE_RECIPIENTS,
  type InboxFilter,
  type MailDetail,
  type MailSummary,
} from "@/lib/inbox/logic";

const field =
  "mt-1.5 w-full rounded-xl border border-ink/20 bg-cloud px-3.5 py-2.5 text-[1rem] focus-visible:border-teal";

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

const who = (m: Pick<MailSummary, "from_name" | "from_email" | "folder" | "to_email">) =>
  m.folder === "sent" ? `To ${m.to_email ?? ""}` : m.from_name || m.from_email;

type Note = { kind: "ok" | "error"; text: string } | null;

export function MailClient({
  initialMessages,
  initialUnread,
}: {
  initialMessages: MailSummary[];
  initialUnread: number;
}) {
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [messages, setMessages] = useState(initialMessages);
  const [unread, setUnread] = useState(initialUnread);
  const [detail, setDetail] = useState<MailDetail | null>(null);
  const [composing, setComposing] = useState(false);
  const [showHtml, setShowHtml] = useState(false);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<Note>(null);
  const [compose, setCompose] = useState({ to: "", subject: "", body: "" });
  const filterRef = useRef(filter);

  const refresh = useCallback(async (f: InboxFilter) => {
    try {
      const res = await fetch(`/api/staff/mail?filter=${f}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { messages: MailSummary[]; unread: number };
      if (filterRef.current === f) {
        setMessages(data.messages);
        setUnread(data.unread);
      }
    } catch {
      // offline: keep what's on screen
    }
  }, []);

  function changeFilter(f: InboxFilter) {
    filterRef.current = f;
    setFilter(f);
    void refresh(f);
  }

  // New mail shows up without a manual refresh.
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") void refresh(filterRef.current);
    }, 30_000);
    return () => clearInterval(timer);
  }, [refresh]);

  async function open(id: string) {
    setComposing(false);
    setNote(null);
    setReply("");
    setShowHtml(false);
    try {
      const res = await fetch(`/api/staff/mail/${id}`, { cache: "no-store" });
      if (!res.ok) {
        setNote({ kind: "error", text: "That message couldn't be opened." });
        return;
      }
      setDetail((await res.json()) as MailDetail);
      void refresh(filterRef.current);
    } catch {
      setNote({ kind: "error", text: "You appear to be offline." });
    }
  }

  async function act(action: "unread" | "archive" | "unarchive") {
    if (!detail) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/staff/mail/${detail.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        setDetail(null);
        await refresh(filterRef.current);
      } else {
        setNote({ kind: "error", text: "That didn't work. Try again." });
      }
    } catch {
      setNote({ kind: "error", text: "You appear to be offline." });
    }
    setBusy(false);
  }

  async function send(url: string, body: unknown, done: (data: Record<string, number>) => void) {
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => null)) as (Record<string, number> & { error?: string }) | null;
      if (res.ok && data) done(data);
      else setNote({ kind: "error", text: (data as { error?: string } | null)?.error ?? "That didn't work. Try again." });
    } catch {
      setNote({ kind: "error", text: "You appear to be offline. Your message is still here." });
    }
    setBusy(false);
  }

  const sendReply = () =>
    detail &&
    send(`/api/staff/mail/${detail.id}/reply`, { body: reply }, () => {
      setReply("");
      setNote({ kind: "ok", text: "Reply sent." });
      void open(detail.id);
    });

  const sendCompose = () =>
    send("/api/staff/mail/compose", compose, (data) => {
      setCompose({ to: "", subject: "", body: "" });
      setComposing(false);
      setNote({
        kind: "ok",
        text: data.failed ? `Sent to ${data.sent}; ${data.failed} couldn't be sent.` : `Sent to ${data.sent}.`,
      });
      changeFilter("sent");
    });

  const showingPane = detail !== null || composing;

  return (
    <div className="grid gap-6 lg:grid-cols-[24rem_1fr]">
      {/* ------------------------------------------------ list */}
      <section className={`${showingPane ? "hidden lg:block" : ""} min-w-0`} aria-label="Messages">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setDetail(null);
              setComposing(true);
              setNote(null);
            }}
            className="btn-coral cursor-pointer !py-2.5"
          >
            New message
          </button>
          <p className="text-[0.9rem] font-semibold text-ink/65">{unread > 0 ? `${unread} unread` : "All read"}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5" role="tablist" aria-label="Filter">
          {INBOX_FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              type="button"
              onClick={() => changeFilter(f)}
              className={`eyebrow cursor-pointer rounded-full px-3.5 py-2 transition-opacity duration-300 hover:opacity-70 ${
                filter === f ? "bg-teal text-white" : "bg-white text-teal"
              }`}
            >
              {INBOX_FILTER_LABELS[f]}
            </button>
          ))}
        </div>

        <ul className="mt-4 divide-y rule-tint overflow-hidden rounded-2xl bg-white shadow-panel-light">
          {messages.length === 0 && <li className="p-6 text-ink/65">Nothing here.</li>}
          {messages.map((m) => {
            const isNew = m.folder === "inbox" && m.status === "received";
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => void open(m.id)}
                  aria-current={detail?.id === m.id}
                  className={`block w-full cursor-pointer px-5 py-4 text-left transition-opacity duration-300 hover:opacity-75 ${
                    detail?.id === m.id ? "bg-teal/10" : ""
                  }`}
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className={`truncate ${isNew ? "font-extrabold" : "font-semibold"}`}>{who(m)}</span>
                    <span className="shrink-0 text-[0.78rem] text-ink/55">{when(m.received_at)}</span>
                  </span>
                  <span className={`mt-0.5 block truncate text-[0.95rem] ${isNew ? "font-bold" : ""}`}>
                    {isNew && <span aria-label="Unread" className="mr-2 inline-block size-2 rounded-full bg-coral" />}
                    {m.subject || "(no subject)"}
                  </span>
                  <span className="mt-0.5 block truncate text-[0.85rem] text-ink/60">{m.snippet}</span>
                  {(m.spam || m.attachments > 0) && (
                    <span className="mt-1.5 flex gap-2">
                      {m.spam && <span className="eyebrow rounded-full bg-marigold/30 px-2.5 py-0.5">Possible spam</span>}
                      {m.attachments > 0 && (
                        <span className="eyebrow rounded-full bg-sand px-2.5 py-0.5">
                          {m.attachments} attachment{m.attachments > 1 ? "s" : ""}
                        </span>
                      )}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ------------------------------------------------ reader / composer */}
      <section className={`${showingPane ? "" : "hidden lg:block"} min-w-0`} aria-label="Message">
        {note && (
          <p role="status" className={`mb-4 text-[0.92rem] font-semibold ${note.kind === "error" ? "text-clay" : "text-teal"}`}>
            {note.text}
          </p>
        )}

        {composing && (
          <div className="rounded-2xl bg-white p-6 shadow-panel-light">
            <button
              type="button"
              onClick={() => setComposing(false)}
              className="eyebrow link-under mb-4 cursor-pointer text-teal lg:hidden"
            >
              ← Back to the list
            </button>
            <h2 className="font-display text-[1.4rem] font-extrabold tracking-[-0.02em]">New message</h2>
            <p className="mt-1 text-[0.9rem] text-ink/65">
              Sent from hello@theciscochurch.org. Everyone gets their <strong>own</strong> copy — addresses
              are never shown to each other. Up to {MAX_COMPOSE_RECIPIENTS} people.
            </p>
            <label className="mt-5 block">
              <span className="eyebrow text-teal">To (separate with commas or new lines)</span>
              <textarea
                className={`${field} min-h-20`}
                value={compose.to}
                onChange={(e) => setCompose({ ...compose, to: e.target.value })}
              />
            </label>
            <label className="mt-4 block">
              <span className="eyebrow text-teal">Subject</span>
              <input className={field} value={compose.subject} onChange={(e) => setCompose({ ...compose, subject: e.target.value })} />
            </label>
            <label className="mt-4 block">
              <span className="eyebrow text-teal">Message</span>
              <textarea className={`${field} min-h-56`} value={compose.body} onChange={(e) => setCompose({ ...compose, body: e.target.value })} />
            </label>
            <button type="button" disabled={busy} onClick={() => void sendCompose()} className="btn-teal mt-5 cursor-pointer disabled:opacity-60">
              {busy ? "Sending…" : "Send"}
            </button>
          </div>
        )}

        {!composing && detail && (
          <article className="rounded-2xl bg-white p-6 shadow-panel-light sm:p-8">
            <button
              type="button"
              onClick={() => setDetail(null)}
              className="eyebrow link-under mb-4 cursor-pointer text-teal lg:hidden"
            >
              ← Back to the list
            </button>
            <h2 className="font-display text-[1.5rem] leading-tight font-extrabold tracking-[-0.02em] break-words">
              {detail.subject || "(no subject)"}
            </h2>
            <p className="mt-2 text-[0.92rem] break-words text-ink/70">
              <strong className="text-ink">{detail.folder === "sent" ? "To" : "From"}</strong>{" "}
              {detail.folder === "sent" ? detail.to_email : `${detail.from_name ? `${detail.from_name} ` : ""}<${detail.from_email}>`}
              <br />
              {when(detail.received_at)}
            </p>
            {detail.spam && (
              <p className="mt-3 rounded-xl bg-marigold/25 px-4 py-2.5 text-[0.9rem] font-semibold">
                This looks like spam. Be careful with links and attachments.
              </p>
            )}
            {detail.attachment_names.length > 0 && (
              <p className="mt-3 text-[0.9rem] text-ink/70">
                This email had {detail.attachment_names.length} attachment{detail.attachment_names.length > 1 ? "s" : ""} that
                aren’t saved here: {detail.attachment_names.join(", ")}.
              </p>
            )}

            <div className="mt-6 border-t rule-tint pt-6">
              {showHtml && detail.html_body ? (
                <iframe
                  title="Formatted message"
                  sandbox=""
                  srcDoc={`<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:">${detail.html_body}`}
                  className="h-[30rem] w-full rounded-xl border border-ink/15 bg-white"
                />
              ) : (
                <p className="text-[1rem] leading-relaxed break-words whitespace-pre-wrap">
                  {detail.text_body ?? (detail.html_body ? "This message only has a formatted version." : "(empty message)")}
                </p>
              )}
              {detail.html_body && (
                <button type="button" onClick={() => setShowHtml(!showHtml)} className="eyebrow link-under mt-4 cursor-pointer text-teal">
                  {showHtml ? "Show plain text" : "Show formatted version"}
                </button>
              )}
            </div>

            {detail.recipients.length > 0 && (
              <ul className="mt-6 space-y-1 text-[0.9rem]">
                {detail.recipients.map((r) => (
                  <li key={r.to} className={r.ok ? "text-ink/70" : "font-semibold text-clay"}>
                    {r.ok ? "Delivered to Mailgun:" : "Couldn’t send to"} {r.to}
                  </li>
                ))}
              </ul>
            )}

            {detail.replies.map((r) => (
              <div key={r.sent_at} className="mt-6 rounded-xl bg-cloud p-4">
                <p className="eyebrow text-teal">You replied · {when(r.sent_at)}</p>
                <p className="mt-2 text-[0.97rem] break-words whitespace-pre-wrap">{r.body}</p>
              </div>
            ))}

            {detail.folder === "inbox" && (
              <div className="mt-8 border-t rule-tint pt-6">
                <label className="block">
                  <span className="eyebrow text-teal">Reply (sent as hello@theciscochurch.org)</span>
                  <textarea className={`${field} min-h-36`} value={reply} onChange={(e) => setReply(e.target.value)} />
                </label>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <button type="button" disabled={busy || !reply.trim()} onClick={() => void sendReply()} className="btn-teal cursor-pointer !py-2.5 disabled:cursor-default disabled:opacity-45">
                    {busy ? "Sending…" : "Send reply"}
                  </button>
                  <button type="button" disabled={busy} onClick={() => void act("unread")} className="eyebrow link-under cursor-pointer text-teal">
                    Mark unread
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void act(detail.status === "archived" ? "unarchive" : "archive")}
                    className="eyebrow link-under cursor-pointer text-coral"
                  >
                    {detail.status === "archived" ? "Move back to inbox" : "Archive"}
                  </button>
                </div>
              </div>
            )}
          </article>
        )}

        {!composing && !detail && (
          <p className="hidden rounded-2xl bg-white/60 p-10 text-center text-ink/55 lg:block">Choose a message to read it.</p>
        )}
      </section>
    </div>
  );
}
