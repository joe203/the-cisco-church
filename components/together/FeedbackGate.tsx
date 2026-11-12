"use client";

import { useState } from "react";

const field =
  "mt-1.5 w-full rounded-xl border-2 border-ink/20 bg-white px-4 py-3 text-[1.05rem] text-ink placeholder:text-ink/45 focus-visible:border-teal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/20";
const link =
  "font-bold text-teal underline underline-offset-4 hover:text-deepsea focus-visible:rounded-sm active:opacity-70";

type Stage = "ask" | "sending" | "sent" | "unknown" | "requesting" | "requested";

/** Sign-in for /together/feedback: type your email, we email you a link. */
export function FeedbackGate({ expired = false }: { expired?: boolean }) {
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<Stage>("ask");
  const [error, setError] = useState(expired ? "That link has expired or was already replaced. Enter your email for a fresh one." : "");

  async function sendLink(e?: React.FormEvent) {
    e?.preventDefault();
    setStage("sending");
    setError("");
    try {
      const res = await fetch("/api/together/feedback/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) return setStage("sent");
      if (res.status === 404) return setStage("unknown");
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "That didn’t work. Please try again.");
    } catch {
      setError("That didn’t work. Check your connection and try again.");
    }
    setStage("ask");
  }

  async function askToBeAdded(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setStage("requesting");
    setError("");
    try {
      const res = await fetch("/api/together/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, email }),
      });
      if (res.ok) return setStage("requested");
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "That didn’t send. Please try again.");
    } catch {
      setError("That didn’t send. Check your connection and try again.");
    }
    setStage("unknown");
  }

  const heading =
    "font-display text-[clamp(1.9rem,3vw+0.6rem,2.7rem)] leading-[1.08] font-extrabold tracking-[-0.03em] text-ink";
  const body = "mt-4 text-[1.1rem] leading-[1.7] text-ink/80";

  return (
    <div className="flex flex-1 items-center bg-sand">
      <div className="mx-auto w-full max-w-xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="rounded-3xl bg-white p-8 shadow-[var(--shadow-card-lift)] sm:p-11">
          {stage === "sent" ? (
            <div role="status">
              <h1 className={heading}>Check your email.</h1>
              <p className={body}>
                We sent a link to <strong className="text-ink">{email}</strong>. Tap it and you’ll come
                right back here, signed in.
              </p>
              <ul className="mt-5 space-y-2 text-[1rem] leading-[1.6] text-ink/75">
                <li className="list-none">It comes from no-reply@theciscochurch.org.</li>
                <li className="list-none">Don’t see it in a minute or two? Check your spam or junk folder.</li>
              </ul>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                <button type="button" onClick={() => sendLink()} className="btn-ghost">
                  Send it again
                </button>
                <button type="button" onClick={() => setStage("ask")} className={link}>
                  Use a different email
                </button>
              </div>
            </div>
          ) : stage === "requested" ? (
            <div role="status">
              <h1 className={heading}>Thank you.</h1>
              <p className={body}>
                The church office will add your email, usually within a day. Then come back to this
                page and we’ll send you a link.
              </p>
            </div>
          ) : stage === "unknown" || stage === "requesting" ? (
            <form key="request" onSubmit={askToBeAdded}>
              <h1 className={heading}>We don’t have that email yet.</h1>
              <p className={body}>
                We couldn’t find <strong className="text-ink">{email}</strong> on our member list.
                Tell us who you are and the office will add it, usually within a day.
              </p>
              <label htmlFor="fg-name" className="mt-6 block text-[0.98rem] font-bold text-ink">
                Your name
              </label>
              <input id="fg-name" name="name" required autoComplete="name" maxLength={120} className={field} />
              <label htmlFor="fg-phone" className="mt-4 block text-[0.98rem] font-bold text-ink">
                Cell number <span className="font-normal text-ink/65">(optional)</span>
              </label>
              <input id="fg-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} className={field} />
              {/* Bots fill every field; people never see this one. */}
              <div aria-hidden className="absolute -left-[9999px]">
                <label htmlFor="fg-site">Website</label>
                <input id="fg-site" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              {error && (
                <p role="alert" className="mt-4 text-[1rem] font-semibold text-clay">
                  {error}
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <button type="submit" disabled={stage === "requesting"} className="btn-coral disabled:opacity-60">
                  {stage === "requesting" ? "Sending…" : "Ask to be added"}
                </button>
                <button type="button" onClick={() => setStage("ask")} className={link}>
                  Try a different email
                </button>
              </div>
            </form>
          ) : (
            <form key="email" onSubmit={sendLink}>
              <h1 className={heading}>How’s it going?</h1>
              <p className={body}>
                We’ve been changing how we do things, and we want to hear what you’re seeing. Enter
                your email and we’ll send you a link to sign in. No password needed.
              </p>
              <label htmlFor="fg-email" className="mt-7 block text-[0.98rem] font-bold text-ink">
                Your email
              </label>
              <input
                id="fg-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className={field}
              />
              {error && (
                <p role="alert" className="mt-3 text-[1rem] font-semibold text-clay">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={stage === "sending"}
                className="btn-coral mt-5 w-full justify-center disabled:opacity-60 sm:w-auto"
              >
                {stage === "sending" ? "Sending…" : "Email me a link"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
