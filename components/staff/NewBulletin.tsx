"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function NewBulletin({ suggestedDate }: { suggestedDate: string }) {
  const router = useRouter();
  const [date, setDate] = useState(suggestedDate);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/staff/bulletins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
      const body = (await res.json().catch(() => null)) as { date?: string; error?: string } | null;
      if (res.ok && body?.date) {
        router.push(`/staff/bulletin/${body.date}`);
        return;
      }
      setError(body?.error ?? "That didn't work. Try again.");
    } catch {
      setError("You appear to be offline. Check your connection and try again.");
    }
    setBusy(false);
  }

  return (
    <form onSubmit={create} className="rounded-2xl bg-white p-6 shadow-panel-light">
      <h2 className="font-display text-[1.3rem] font-bold">Start a new bulletin</h2>
      <p className="mt-1 text-[0.92rem] text-ink/65">
        It starts from the most recent one — the order of service, announcements, prayer list and series
        carry over, so you only change what’s different.
      </p>
      <div className="mt-5 flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="new-date" className="eyebrow text-teal">
            Sunday
          </label>
          <input
            id="new-date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 block rounded-xl border border-ink/20 bg-cloud px-4 py-2.5"
          />
        </div>
        <button type="submit" disabled={busy} className="btn-teal cursor-pointer disabled:opacity-60">
          {busy ? "Creating…" : "Create bulletin"}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-3 text-[0.92rem] font-semibold text-clay">
          {error}
        </p>
      )}
    </form>
  );
}
