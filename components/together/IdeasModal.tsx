"use client";

import { useRef, useState } from "react";

const field =
  "mt-1.5 w-full rounded-xl border-2 border-ink/20 bg-white px-4 py-3 text-[1.05rem] leading-[1.6] text-ink placeholder:text-ink/45 focus-visible:border-teal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/20";

type State = "idle" | "sending" | "done";

export function IdeasModal() {
  const dialog = useRef<HTMLDialogElement>(null);
  const concerns = useRef<HTMLTextAreaElement>(null);
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  const open = (focusConcerns = false) => {
    setState("idle");
    setError("");
    dialog.current?.showModal();
    if (focusConcerns) concerns.current?.focus();
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/together/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      if (res.ok) {
        setState("done");
        return;
      }
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "That didn’t send. Please try again.");
    } catch {
      setError("That didn’t send. Check your connection and try again.");
    }
    setState("idle");
  }

  return (
    <>
      <div className="flex flex-col items-start gap-4">
        <button type="button" onClick={() => open()} className="btn-coral focus-visible:outline-marigold">
          Share your story and ideas
        </button>
        <button
          type="button"
          onClick={() => open(true)}
          className="min-h-11 rounded-sm text-left text-[1.05rem] font-bold text-white underline decoration-marigold decoration-2 underline-offset-[6px] transition-opacity duration-300 hover:opacity-80 focus-visible:outline-marigold active:opacity-60"
        >
          Have a concern or some feedback? Tell us.
        </button>
      </div>

      <dialog
        ref={dialog}
        aria-labelledby="ideas-title"
        className="m-auto max-h-[92dvh] w-[min(38rem,calc(100vw-2rem))] overflow-y-auto rounded-3xl bg-cloud p-0 text-ink shadow-[var(--shadow-card-lift)] backdrop:bg-ink/60"
      >
        {state === "done" ? (
          <div className="p-7 sm:p-10">
            <h2 className="font-display text-[1.9rem] leading-tight font-extrabold tracking-[-0.02em]">
              Thank you.
            </h2>
            <p className="mt-3 text-[1.1rem] leading-[1.65] text-ink/80">
              Your note is on its way to Joe and the church office. We read every one.
            </p>
            <button type="button" onClick={() => dialog.current?.close()} className="btn-coral mt-7">
              Back to the page
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-7 sm:p-10">
            <h2
              id="ideas-title"
              className="font-display text-[1.9rem] leading-tight font-extrabold tracking-[-0.02em]"
            >
              We’d love to hear from you.
            </h2>
            <p className="mt-3 text-[1.05rem] leading-[1.65] text-ink/80">
              Share a story, an idea, or what’s on your heart. Fill in one box or all three, and
              write as much or as little as you like.
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <label htmlFor="i-story" className="text-[1.02rem] leading-snug font-bold">
                  Tell us a story from our past that means a lot to you.
                </label>
                <textarea
                  id="i-story"
                  name="story"
                  rows={5}
                  maxLength={4000}
                  placeholder="A moment, a person, a Sunday you won’t forget…"
                  className={field}
                />
              </div>

              <div>
                <label htmlFor="i-dream" className="text-[1.02rem] leading-snug font-bold">
                  What could we do better than a thousand other churches? What could be us?
                </label>
                <p className="mt-1 text-[0.95rem] text-ink/70">
                  Something we already do well counts. But we’re really asking what we could become.
                </p>
                <textarea
                  id="i-dream"
                  name="dream"
                  rows={5}
                  maxLength={4000}
                  placeholder="What would you love to see here in five years?"
                  className={field}
                />
              </div>

              <div>
                <label htmlFor="i-concerns" className="text-[1.02rem] leading-snug font-bold">
                  What’s on your heart or mind?
                </label>
                <p className="mt-1 text-[0.95rem] text-ink/70">
                  Concerns, questions, worries, frustrations. If you need to vent, go ahead. We’ll
                  listen, and nobody will think less of you for it.
                </p>
                <textarea
                  id="i-concerns"
                  name="concerns"
                  ref={concerns}
                  rows={5}
                  maxLength={4000}
                  placeholder="Tell us honestly. We want to hear it."
                  className={field}
                />
              </div>

              <div>
                <label htmlFor="i-name" className="text-[1.02rem] font-bold">
                  Your name <span className="font-normal text-ink/65">(optional)</span>
                </label>
                <p className="mt-1 text-[0.95rem] text-ink/70">
                  Leave it blank if you’d rather stay anonymous.
                </p>
                <input id="i-name" name="name" autoComplete="name" maxLength={120} className={field} />
              </div>

              {/* Bots fill every field; people never see this one. */}
              <div aria-hidden className="absolute -left-[9999px]">
                <label htmlFor="i-site">Website</label>
                <input id="i-site" name="website" tabIndex={-1} autoComplete="off" />
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-5 rounded-xl bg-coral/10 px-4 py-3 text-[1rem] font-semibold text-clay">
                {error}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
              <button type="submit" disabled={state === "sending"} className="btn-coral disabled:opacity-60">
                {state === "sending" ? "Sending…" : "Send"}
              </button>
              <button type="button" onClick={() => dialog.current?.close()} className="btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}
