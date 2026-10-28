"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { MemberRow } from "@/lib/together/members";

const input =
  "mt-1.5 w-full rounded-xl border border-ink/20 bg-cloud px-3.5 py-2.5 text-[1rem] focus-visible:border-teal";

function prettyPhone(p: string) {
  return `(${p.slice(0, 3)}) ${p.slice(3, 6)}-${p.slice(6)}`;
}

export function TogetherManager({ members }: { members: MemberRow[] }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  async function call(method: "POST" | "DELETE", body: unknown) {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/staff/together", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => null)) as
        | { error?: string; added?: number; already?: number; unreadable?: string[] }
        | null;
      if (res.ok) return data ?? {};
      setMessage({ kind: "error", text: data?.error ?? "That didn't work. Try again." });
    } catch {
      setMessage({ kind: "error", text: "You appear to be offline. Try again when you're connected." });
    } finally {
      setBusy(false);
    }
    return null;
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const data = await call("POST", { text });
    if (!data) return;
    const bits = [`${data.added ?? 0} added`];
    if (data.already) bits.push(`${data.already} already on the list`);
    if (data.unreadable?.length) bits.push(`couldn't read: ${data.unreadable.join(" | ")}`);
    setMessage({ kind: data.unreadable?.length ? "error" : "ok", text: bits.join(" · ") });
    if (!data.unreadable?.length) setText("");
    router.refresh();
  }

  async function remove(m: MemberRow) {
    if (!window.confirm(`Remove ${m.name || m.email || m.phone} from the list?`)) return;
    if (await call("DELETE", { id: m.id })) router.refresh();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={add} className="rounded-2xl bg-white p-6 shadow-panel-light">
        <h2 className="font-display text-[1.3rem] font-bold">Add people</h2>
        <p className="mt-1 text-[0.92rem] text-ink/72">
          One person per line: a name, then a cell number, an email, or both. Paste as many as you like.
        </p>
        <label className="mt-5 block">
          <span className="eyebrow text-teal">Who to add</span>
          <textarea
            required
            rows={6}
            className={input}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"Jane Smith, 254-555-0123\nJohn Smith, john@example.com, 254-555-0188"}
          />
        </label>
        <button type="submit" disabled={busy} className="btn-teal mt-5 cursor-pointer disabled:opacity-60">
          {busy ? "Adding…" : "Add to the list"}
        </button>
        {message && (
          <p
            role="status"
            className={`mt-4 text-[0.92rem] font-semibold ${message.kind === "error" ? "text-clay" : "text-teal"}`}
          >
            {message.text}
          </p>
        )}
      </form>

      <section>
        <h2 className="font-display text-[1.3rem] font-bold">On the list ({members.length})</h2>
        {members.length === 0 ? (
          <p className="mt-3 text-ink/72">Nobody yet.</p>
        ) : (
          <ul className="mt-4 divide-y rule-tint rounded-2xl bg-white shadow-panel-light">
            {members.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                <div className="min-w-0">
                  <p className="font-display text-[1.1rem] font-bold">{m.name || "(no name)"}</p>
                  <p className="text-[0.88rem] break-all text-ink/72">
                    {[m.phone ? prettyPhone(m.phone) : null, m.email].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[0.85rem] text-ink/72">
                    {m.last_seen_at
                      ? `Last in ${new Date(m.last_seen_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                      : "Hasn't visited"}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(m)}
                    disabled={busy}
                    className="eyebrow cursor-pointer text-clay transition-opacity duration-300 hover:opacity-70 disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
