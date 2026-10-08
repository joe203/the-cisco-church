"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { StaffMember, StaffRole } from "@/lib/bulletin/types";

const input =
  "mt-1.5 w-full rounded-xl border border-ink/20 bg-cloud px-3.5 py-2.5 text-[1rem] focus-visible:border-teal";

export function PeopleManager({ people, selfId }: { people: StaffMember[]; selfId: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<StaffRole>("secretary");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  async function call(method: "POST" | "DELETE", body: unknown): Promise<boolean> {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/staff/people", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) return true;
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setMessage({ kind: "error", text: data?.error ?? "That didn't work. Try again." });
    } catch {
      setMessage({ kind: "error", text: "You appear to be offline. Try again when you're connected." });
    } finally {
      setBusy(false);
    }
    return false;
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (await call("POST", { email, name, role })) {
      setMessage({ kind: "ok", text: `${email} can now sign in at /staff/login.` });
      setEmail("");
      setName("");
      router.refresh();
    }
  }

  async function remove(person: StaffMember) {
    if (!window.confirm(`Remove staff access for ${person.name || person.email}?`)) return;
    if (await call("DELETE", { user_id: person.user_id })) router.refresh();
  }

  return (
    <div className="space-y-8">
      <ul className="divide-y rule-tint rounded-2xl bg-white shadow-panel-light">
        {people.map((p) => (
          <li key={p.user_id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
            <div className="min-w-0">
              <p className="font-display text-[1.1rem] font-bold">{p.name || p.email}</p>
              {p.name && <p className="text-[0.88rem] break-all text-ink/72">{p.email}</p>}
            </div>
            <div className="flex items-center gap-4">
              <span className="eyebrow rounded-full bg-teal/10 px-3 py-1 text-teal">
                {p.role === "admin" ? "Admin" : "Secretary"}
              </span>
              {p.user_id !== selfId && (
                <button
                  type="button"
                  onClick={() => remove(p)}
                  disabled={busy}
                  className="eyebrow cursor-pointer text-clay transition-opacity duration-300 hover:opacity-70 disabled:opacity-40"
                >
                  Remove
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={add} className="rounded-2xl bg-white p-6 shadow-panel-light">
        <h2 className="font-display text-[1.3rem] font-bold">Give someone access</h2>
        <p className="mt-1 text-[0.92rem] text-ink/72">
          They sign in with an emailed link at /staff/login — nothing to set up on their end. Secretaries
          edit the order of service, announcements and prayer list. Admins edit everything.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="eyebrow text-teal">Email address</span>
            <input
              type="email"
              required
              className={input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="eyebrow text-teal">Name</span>
            <input className={input} value={name} onChange={(e) => setName(e.target.value)} />
          </label>
        </div>
        <fieldset className="mt-5">
          <legend className="eyebrow text-teal">Role</legend>
          <div className="mt-2 flex gap-6">
            {(["secretary", "admin"] as const).map((r) => (
              <label key={r} className="flex cursor-pointer items-center gap-2">
                <input type="radio" name="role" checked={role === r} onChange={() => setRole(r)} />
                <span className="capitalize">{r}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <button type="submit" disabled={busy} className="btn-teal mt-6 cursor-pointer disabled:opacity-60">
          {busy ? "Adding…" : "Add to staff"}
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
    </div>
  );
}
