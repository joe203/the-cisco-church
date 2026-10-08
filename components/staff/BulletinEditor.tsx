"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { canEdit } from "@/lib/bulletin/schema";
import type {
  Announcement,
  Bulletin,
  OrderItem,
  SectionKey,
  SeriesWeek,
  StaffRole,
} from "@/lib/bulletin/types";
import { formatDate } from "@/lib/format";

type PrayerDraft = { label: string; text: string };

type Draft = {
  order_of_service: { song_leader: string; items: OrderItem[] };
  announcements: Announcement[];
  prayer: PrayerDraft[];
  article: Bulletin["article"];
  series: { title: string; tagline: string; verse: string; weeks: SeriesWeek[] };
};

const toDraft = (b: Bulletin): Draft => ({
  order_of_service: b.order_of_service,
  announcements: b.announcements,
  prayer: b.prayer_groups.map((g) => ({ label: g.label, text: g.names.join("\n") })),
  article: b.article,
  series: b.series,
});

/** One name per line, or separated by commas — either works when pasting. */
const parseNames = (text: string) =>
  text
    .split(/[\n,]+/)
    .map((n) => n.trim())
    .filter(Boolean);

const input =
  "mt-1.5 w-full rounded-xl border border-ink/20 bg-cloud px-3.5 py-2.5 text-[1rem] focus-visible:border-teal";
const smallBtn =
  "eyebrow cursor-pointer rounded-full px-3 py-1.5 text-teal transition-opacity duration-300 hover:bg-teal/10 active:opacity-70 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent";

function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function BulletinEditor({
  initial,
  role,
  imported = false,
}: {
  initial: Bulletin;
  role: StaffRole;
  imported?: boolean;
}) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(initial));
  const [baseVersion, setBaseVersion] = useState(initial.updated_at);
  const [status, setStatus] = useState(initial.status);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState<null | "save" | "publish">(null);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const idCounter = useRef(0);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const edit = (fn: (d: Draft) => Draft) => {
    setDraft(fn);
    setDirty(true);
    setMessage(null);
  };

  const mine = (key: SectionKey) => canEdit(role, key);

  function payload(): Partial<Record<SectionKey, unknown>> {
    const out: Partial<Record<SectionKey, unknown>> = {};
    if (mine("order_of_service")) out.order_of_service = draft.order_of_service;
    if (mine("announcements")) out.announcements = draft.announcements;
    if (mine("prayer_groups")) {
      out.prayer_groups = draft.prayer.map((g) => ({ label: g.label, names: parseNames(g.text) }));
    }
    if (mine("article")) out.article = draft.article;
    if (mine("series")) out.series = draft.series;
    return out;
  }

  async function save(): Promise<boolean> {
    setBusy("save");
    setMessage(null);
    try {
      const res = await fetch(`/api/staff/bulletins/${initial.bulletin_date}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base_updated_at: baseVersion, sections: payload() }),
      });
      const body = (await res.json().catch(() => null)) as { updated_at?: string; error?: string } | null;
      if (!res.ok) {
        setMessage({ kind: "error", text: body?.error ?? "The bulletin couldn't be saved. Try again." });
        return false;
      }
      setBaseVersion(body?.updated_at ?? baseVersion);
      setDirty(false);
      setMessage({
        kind: "ok",
        text: status === "published" ? "Saved — the change is live on the site." : "Draft saved.",
      });
      return true;
    } catch {
      setMessage({ kind: "error", text: "You appear to be offline. Your edits are still here — try again." });
      return false;
    } finally {
      setBusy(null);
    }
  }

  async function setPublished(published: boolean) {
    if (dirty && !(await save())) return;
    setBusy("publish");
    try {
      const res = await fetch(`/api/staff/bulletins/${initial.bulletin_date}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published }),
      });
      const body = (await res.json().catch(() => null)) as { status?: "draft" | "published"; error?: string } | null;
      if (!res.ok || !body?.status) {
        setMessage({ kind: "error", text: body?.error ?? "That didn't work. Try again." });
        return;
      }
      setStatus(body.status);
      setMessage({
        kind: "ok",
        text: published ? "Published — it’s on the site now." : "Moved back to a draft — visitors no longer see it.",
      });
    } catch {
      setMessage({ kind: "error", text: "You appear to be offline. Try again when you're connected." });
    } finally {
      setBusy(null);
    }
  }

  const newId = () => `n${Date.now().toString(36)}${idCounter.current++}`;

  return (
    <main className="mx-auto max-w-3xl px-5 pb-40 sm:px-8">
      <div className="pt-10">
        <p className="eyebrow text-teal">Bulletin</p>
        <h1 className="font-display mt-2 text-[2.2rem] leading-[1.05] font-extrabold tracking-[-0.03em]">
          {formatDate(initial.bulletin_date)}
        </h1>
        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.95rem] text-ink/70">
          <span
            className={`eyebrow rounded-full px-3 py-1 ${
              status === "published" ? "bg-teal text-white" : "bg-marigold/30 text-ink"
            }`}
          >
            {status === "published" ? "Published" : "Draft"}
          </span>
          <a
            href={`/staff/bulletin/${initial.bulletin_date}/preview`}
            target="_blank"
            rel="noopener noreferrer"
            className="link-under font-semibold text-teal"
          >
            Preview how it looks
          </a>
          <a href="/staff/help#check" className="link-under font-semibold text-teal">
            Need help?
          </a>
        </p>
      </div>

      {imported && (
        <div role="status" className="mt-6 rounded-2xl bg-marigold/25 p-5">
          <p className="font-display text-[1.15rem] font-bold">Read from your PDF — please check it over</p>
          <p className="mt-1 text-[0.92rem] text-ink/80">
            Compare it with the paper copy, especially names, dates and times. Fix anything that’s off,
            then publish. Use “Preview how it looks” to see it the way visitors will.
          </p>
        </div>
      )}

      <div className="mt-8 space-y-8">
        {/* ------------------------------------------------ order of service */}
        {mine("order_of_service") && (
          <Card title="Order of service" hint="In the order it happens on Sunday morning.">
            <Field label="Song leader">
              <input
                className={input}
                value={draft.order_of_service.song_leader}
                onChange={(e) =>
                  edit((d) => ({ ...d, order_of_service: { ...d.order_of_service, song_leader: e.target.value } }))
                }
              />
            </Field>
            <ol className="mt-6 space-y-4">
              {draft.order_of_service.items.map((item, i) => {
                const set = (patch: Partial<OrderItem>) =>
                  edit((d) => ({
                    ...d,
                    order_of_service: {
                      ...d.order_of_service,
                      items: d.order_of_service.items.map((x, j) => (j === i ? { ...x, ...patch } : x)),
                    },
                  }));
                return (
                  <li key={i} className="rounded-xl bg-cloud p-4">
                    <div className="grid gap-3 sm:grid-cols-[1.3fr_1fr_1.3fr]">
                      <Field label="What happens">
                        <input className={input} value={item.label} onChange={(e) => set({ label: e.target.value })} />
                      </Field>
                      <Field label="Who (optional)">
                        <input className={input} value={item.who} onChange={(e) => set({ who: e.target.value })} />
                      </Field>
                      <Field label="Note (optional)">
                        <input
                          className={input}
                          value={item.note}
                          placeholder="e.g. the sermon title"
                          onChange={(e) => set({ note: e.target.value })}
                        />
                      </Field>
                    </div>
                    <RowTools
                      index={i}
                      count={draft.order_of_service.items.length}
                      onMove={(to) =>
                        edit((d) => ({
                          ...d,
                          order_of_service: { ...d.order_of_service, items: move(d.order_of_service.items, i, to) },
                        }))
                      }
                      onRemove={() =>
                        edit((d) => ({
                          ...d,
                          order_of_service: {
                            ...d.order_of_service,
                            items: d.order_of_service.items.filter((_, j) => j !== i),
                          },
                        }))
                      }
                    />
                  </li>
                );
              })}
            </ol>
            <AddButton
              onClick={() =>
                edit((d) => ({
                  ...d,
                  order_of_service: {
                    ...d.order_of_service,
                    items: [...d.order_of_service.items, { label: "", who: "", note: "" }],
                  },
                }))
              }
            >
              Add an item
            </AddButton>
          </Card>
        )}

        {/* ------------------------------------------------ announcements */}
        {mine("announcements") && (
          <Card title="Announcements" hint="Remove the ones that are over; the rest carry over from last week.">
            <ul className="space-y-4">
              {draft.announcements.map((a, i) => {
                const set = (patch: Partial<Announcement>) =>
                  edit((d) => ({
                    ...d,
                    announcements: d.announcements.map((x, j) => (j === i ? { ...x, ...patch } : x)),
                  }));
                return (
                  <li key={a.id} className="rounded-xl bg-cloud p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Title">
                        <input className={input} value={a.title} onChange={(e) => set({ title: e.target.value })} />
                      </Field>
                      <Field label="When (optional)">
                        <input
                          className={input}
                          value={a.when}
                          placeholder="October 10, 9:30 am–3pm"
                          onChange={(e) => set({ when: e.target.value })}
                        />
                      </Field>
                    </div>
                    <Field label="Details" className="mt-3">
                      <textarea
                        className={`${input} min-h-24`}
                        value={a.body}
                        onChange={(e) => set({ body: e.target.value })}
                      />
                    </Field>
                    <Field label="Highlighted note (optional)" className="mt-3">
                      <input
                        className={input}
                        value={a.note}
                        placeholder="e.g. No evening service."
                        onChange={(e) => set({ note: e.target.value })}
                      />
                    </Field>
                    <RowTools
                      index={i}
                      count={draft.announcements.length}
                      onMove={(to) => edit((d) => ({ ...d, announcements: move(d.announcements, i, to) }))}
                      onRemove={() => edit((d) => ({ ...d, announcements: d.announcements.filter((_, j) => j !== i) }))}
                    />
                  </li>
                );
              })}
            </ul>
            <AddButton
              onClick={() =>
                edit((d) => ({
                  ...d,
                  announcements: [...d.announcements, { id: newId(), title: "", when: "", body: "", note: "" }],
                }))
              }
            >
              Add an announcement
            </AddButton>
          </Card>
        )}

        {/* ------------------------------------------------ prayer list */}
        {mine("prayer_groups") && (
          <Card title="Prayer list" hint="One name per line, or separated by commas — pasting a list works.">
            <div className="space-y-5">
              {draft.prayer.map((g, i) => (
                <div key={i} className="rounded-xl bg-cloud p-4">
                  <Field label={i === 0 ? "Heading (leave blank for the main list)" : "Heading"}>
                    <input
                      className={input}
                      value={g.label}
                      placeholder="e.g. Nursing home"
                      onChange={(e) =>
                        edit((d) => ({
                          ...d,
                          prayer: d.prayer.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)),
                        }))
                      }
                    />
                  </Field>
                  <Field label="Names" className="mt-3">
                    <textarea
                      className={`${input} min-h-40`}
                      value={g.text}
                      onChange={(e) =>
                        edit((d) => ({
                          ...d,
                          prayer: d.prayer.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)),
                        }))
                      }
                    />
                  </Field>
                  <p className="mt-2 text-[0.85rem] text-ink/72">{parseNames(g.text).length} names</p>
                  {draft.prayer.length > 1 && (
                    <button
                      type="button"
                      className={`${smallBtn} mt-1 text-clay`}
                      onClick={() => edit((d) => ({ ...d, prayer: d.prayer.filter((_, j) => j !== i) }))}
                    >
                      Remove this list
                    </button>
                  )}
                </div>
              ))}
            </div>
            <AddButton onClick={() => edit((d) => ({ ...d, prayer: [...d.prayer, { label: "", text: "" }] }))}>
              Add another list
            </AddButton>
          </Card>
        )}

        {/* ------------------------------------------------ article */}
        {mine("article") && (
          <Card
            title="From the minister’s desk"
            hint="Leave a blank line between paragraphs. **Bold** and *italic* work."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Label">
                <input
                  className={input}
                  value={draft.article.kicker}
                  onChange={(e) => edit((d) => ({ ...d, article: { ...d.article, kicker: e.target.value } }))}
                />
              </Field>
              <Field label="Title">
                <input
                  className={input}
                  value={draft.article.title}
                  onChange={(e) => edit((d) => ({ ...d, article: { ...d.article, title: e.target.value } }))}
                />
              </Field>
            </div>
            <Field label="Subtitle (optional)" className="mt-3">
              <input
                className={input}
                value={draft.article.subtitle}
                onChange={(e) => edit((d) => ({ ...d, article: { ...d.article, subtitle: e.target.value } }))}
              />
            </Field>
            <Field label="Article" className="mt-3">
              <textarea
                className={`${input} min-h-96 leading-relaxed`}
                value={draft.article.body}
                onChange={(e) => edit((d) => ({ ...d, article: { ...d.article, body: e.target.value } }))}
              />
            </Field>
          </Card>
        )}

        {/* ------------------------------------------------ series */}
        {mine("series") && (
          <Card title="Sermon series" hint="Shows beside the order of service, with the current week marked.">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Series title">
                <input
                  className={input}
                  value={draft.series.title}
                  onChange={(e) => edit((d) => ({ ...d, series: { ...d.series, title: e.target.value } }))}
                />
              </Field>
              <Field label="Tagline (optional)">
                <input
                  className={input}
                  value={draft.series.tagline}
                  onChange={(e) => edit((d) => ({ ...d, series: { ...d.series, tagline: e.target.value } }))}
                />
              </Field>
            </div>
            <Field label="Key verse (optional)" className="mt-3">
              <input
                className={input}
                value={draft.series.verse}
                onChange={(e) => edit((d) => ({ ...d, series: { ...d.series, verse: e.target.value } }))}
              />
            </Field>
            <ul className="mt-5 space-y-3">
              {draft.series.weeks.map((w, i) => (
                <li key={i} className="grid items-end gap-3 rounded-xl bg-cloud p-4 sm:grid-cols-[10rem_1fr_auto]">
                  <Field label="Sunday">
                    <input
                      type="date"
                      className={input}
                      value={w.date}
                      onChange={(e) =>
                        edit((d) => ({
                          ...d,
                          series: {
                            ...d.series,
                            weeks: d.series.weeks.map((x, j) => (j === i ? { ...x, date: e.target.value } : x)),
                          },
                        }))
                      }
                    />
                  </Field>
                  <Field label="Message title">
                    <input
                      className={input}
                      value={w.title}
                      onChange={(e) =>
                        edit((d) => ({
                          ...d,
                          series: {
                            ...d.series,
                            weeks: d.series.weeks.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)),
                          },
                        }))
                      }
                    />
                  </Field>
                  <button
                    type="button"
                    className={`${smallBtn} text-clay`}
                    onClick={() =>
                      edit((d) => ({ ...d, series: { ...d.series, weeks: d.series.weeks.filter((_, j) => j !== i) } }))
                    }
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <AddButton
              onClick={() =>
                edit((d) => ({ ...d, series: { ...d.series, weeks: [...d.series.weeks, { date: "", title: "" }] } }))
              }
            >
              Add a week
            </AddButton>
          </Card>
        )}

        {role !== "admin" && (
          <p className="rounded-xl bg-white/70 p-4 text-[0.92rem] text-ink/70">
            The minister’s article and the sermon series are edited by Joe.
          </p>
        )}
      </div>

      {/* ------------------------------------------------ action bar */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t rule-tint bg-cloud/95 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5 sm:px-8">
          <p
            role="status"
            className={`min-w-0 flex-1 text-[0.9rem] font-semibold ${
              message?.kind === "error" ? "text-clay" : "text-teal"
            }`}
          >
            {message?.text ?? (dirty ? "You have unsaved changes." : "All changes saved.")}
          </p>
          <button
            type="button"
            onClick={save}
            disabled={busy !== null || !dirty}
            className="btn-teal cursor-pointer !py-2.5 disabled:cursor-default disabled:opacity-45"
          >
            {busy === "save" ? "Saving…" : "Save draft"}
          </button>
          {status === "published" ? (
            <button
              type="button"
              onClick={() => setPublished(false)}
              disabled={busy !== null}
              className="eyebrow cursor-pointer rounded-full border border-ink/25 px-4 py-3 transition-opacity duration-300 hover:opacity-70 disabled:opacity-45"
            >
              Unpublish
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPublished(true)}
              disabled={busy !== null}
              className="btn-coral cursor-pointer !py-2.5 disabled:opacity-60"
            >
              {busy === "publish" ? "Publishing…" : "Publish"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

function Card({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-panel-light sm:p-7">
      <h2 className="font-display text-[1.4rem] font-extrabold tracking-[-0.02em]">{title}</h2>
      {hint && <p className="mt-1 mb-5 text-[0.9rem] text-ink/72">{hint}</p>}
      {children}
    </section>
  );
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="eyebrow text-teal">{label}</span>
      {children}
    </label>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="btn-ghost mt-5 cursor-pointer">
      + {children}
    </button>
  );
}

function RowTools({
  index,
  count,
  onMove,
  onRemove,
}: {
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-1 border-t rule-tint pt-2">
      <button type="button" className={smallBtn} disabled={index === 0} onClick={() => onMove(index - 1)}>
        Move up
      </button>
      <button type="button" className={smallBtn} disabled={index === count - 1} onClick={() => onMove(index + 1)}>
        Move down
      </button>
      <button type="button" className={`${smallBtn} ml-auto text-clay`} onClick={onRemove}>
        Remove
      </button>
    </div>
  );
}
