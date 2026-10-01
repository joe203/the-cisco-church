"use client";

import { useState } from "react";

export function LoginForm({ expired }: { expired: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setState("sent");
        return;
      }
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "That didn't work. Try again.");
    } catch {
      setError("You appear to be offline. Check your connection and try again.");
    }
    setState("idle");
  }

  if (state === "sent") {
    return (
      <div role="status" className="rounded-2xl bg-white p-6 shadow-panel-light">
        <p className="font-display text-[1.3rem] font-bold">Check your email</p>
        <p className="mt-2 text-ink/75">
          If <strong className="text-ink">{email}</strong> has staff access, a sign-in link is on its way.
          It works once and expires in about an hour. Nothing after a few minutes? Check spam, or ask
          Joe to confirm your address.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl bg-white p-6 shadow-panel-light sm:p-8">
      {expired && (
        <p role="alert" className="mb-5 rounded-xl bg-marigold/25 px-4 py-3 text-[0.92rem] font-semibold">
          That sign-in link has expired or was already used. Request a new one below.
        </p>
      )}
      <label htmlFor="email" className="eyebrow text-teal">
        Email address
      </label>
      <input
        id="email"
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-2 w-full rounded-xl border border-ink/20 bg-cloud px-4 py-3 text-[1.05rem] focus-visible:border-teal"
      />
      {error && (
        <p role="alert" className="mt-3 text-[0.92rem] font-semibold text-clay">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="btn-coral mt-6 w-full cursor-pointer justify-center disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Email me a sign-in link"}
      </button>
    </form>
  );
}
