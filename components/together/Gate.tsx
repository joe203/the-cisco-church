"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const field =
  "mt-1.5 w-full rounded-xl border-2 border-ink/20 bg-white px-4 py-3 text-[1.05rem] text-ink placeholder:text-ink/45 focus-visible:border-teal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/20";

/** Sign-in for the members-only page: an email or cell number on the list opens it. */
export function Gate() {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [asking, setAsking] = useState<"form" | "sending" | "done">("form");
  const [askError, setAskError] = useState("");

  const isEmail = value.includes("@");

  const openRequest = () => {
    setAsking("form");
    setAskError("");
    dialog.current?.showModal();
  };

  async function enter(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/together/enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ who: value }),
      });
      if (res.ok) {
        router.refresh();
        return;
      }
      if (res.status === 404) {
        openRequest();
      } else {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "That didn’t work. Please try again.");
      }
    } catch {
      setError("That didn’t work. Check your connection and try again.");
    }
    setBusy(false);
  }

  async function ask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setAsking("sending");
    setAskError("");
    try {
      const res = await fetch("/api/together/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      if (res.ok) {
        setAsking("done");
        return;
      }
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setAskError(body?.error ?? "That didn’t send. Please try again.");
    } catch {
      setAskError("That didn’t send. Check your connection and try again.");
    }
    setAsking("form");
  }

  return (
    <div className="flex flex-1 items-center bg-sand">
      <div className="mx-auto w-full max-w-xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="rounded-3xl bg-white p-8 shadow-[var(--shadow-card-lift)] sm:p-11">
          <h1 className="font-display text-[clamp(1.9rem,3vw+0.6rem,2.7rem)] leading-[1.08] font-extrabold tracking-[-0.03em] text-ink">
            Come see where we’re headed.
          </h1>
          <p className="mt-4 text-[1.1rem] leading-[1.7] text-ink/80">
            God is doing something new at the Cisco Church, and we’re building a legacy for the
            next generation. This page is for church members who want to be part of it. Sign in to
            see our new direction and the ideas we’re excited about.
          </p>

          <form className="mt-7" onSubmit={enter}>
            <label htmlFor="who" className="text-[0.98rem] font-bold text-ink">
              Your email or cell number
            </label>
            <input
              id="who"
              name="who"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="username"
              inputMode={isEmail ? "email" : "text"}
              required
              placeholder="you@email.com or 254-555-0123"
              className={field}
            />
            {error && (
              <p role="alert" className="mt-3 text-[1rem] font-semibold text-clay">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="btn-coral mt-5 w-full justify-center disabled:opacity-60 sm:w-auto"
            >
              {busy ? "One moment…" : "Come in"}
            </button>
          </form>

          <p className="mt-6 text-[1rem] text-ink/70">
            Not sure which one we have?{" "}
            <button
              type="button"
              onClick={openRequest}
              className="font-bold text-teal underline underline-offset-4 hover:text-deepsea focus-visible:rounded-sm"
            >
              Ask to be added
            </button>
          </p>
        </div>
      </div>

      <dialog
        ref={dialog}
        aria-labelledby="req-title"
        className="m-auto max-h-[92dvh] w-[min(32rem,calc(100vw-2rem))] overflow-y-auto rounded-3xl bg-cloud p-0 text-ink shadow-[var(--shadow-card-lift)] backdrop:bg-ink/60"
      >
        {asking === "done" ? (
          <div className="p-7 sm:p-9">
            <h2 className="font-display text-[1.7rem] leading-tight font-extrabold tracking-[-0.02em]">
              Request sent.
            </h2>
            <p className="mt-3 text-[1.05rem] leading-[1.65] text-ink/80">
              Thank you. We’ll add you at the church office, usually within a day, and you can come
              back and sign in.
            </p>
            <button type="button" onClick={() => dialog.current?.close()} className="btn-coral mt-6">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={ask} className="p-7 sm:p-9">
            <h2
              id="req-title"
              className="font-display text-[1.7rem] leading-tight font-extrabold tracking-[-0.02em]"
            >
              We couldn’t find you yet.
            </h2>
            <p className="mt-3 text-[1.05rem] leading-[1.65] text-ink/80">
              That’s okay. Tell us who you are and we’ll add you at the church office, usually
              within a day.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="r-name" className="text-[0.98rem] font-bold">
                  Your name
                </label>
                <input id="r-name" name="name" required autoComplete="name" maxLength={120} className={field} />
              </div>
              <div>
                <label htmlFor="r-phone" className="text-[0.98rem] font-bold">
                  Cell number
                </label>
                <input
                  id="r-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  defaultValue={isEmail ? "" : value}
                  maxLength={40}
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="r-email" className="text-[0.98rem] font-bold">
                  Email
                </label>
                <input
                  id="r-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={isEmail ? value : ""}
                  maxLength={160}
                  className={field}
                />
              </div>
              {/* Bots fill every field; people never see this one. */}
              <div aria-hidden className="absolute -left-[9999px]">
                <label htmlFor="r-site">Website</label>
                <input id="r-site" name="website" tabIndex={-1} autoComplete="off" />
              </div>
            </div>

            {askError && (
              <p role="alert" className="mt-5 rounded-xl bg-coral/10 px-4 py-3 text-[1rem] font-semibold text-clay">
                {askError}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
              <button type="submit" disabled={asking === "sending"} className="btn-coral disabled:opacity-60">
                {asking === "sending" ? "Sending…" : "Send my request"}
              </button>
              <button type="button" onClick={() => dialog.current?.close()} className="btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        )}
      </dialog>
    </div>
  );
}
