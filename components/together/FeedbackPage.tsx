import { FeedbackForm } from "./FeedbackForm";

/** /together/feedback: the opening band, then the form. */
export function FeedbackPage({ name, preview = false }: { name: string; preview?: boolean }) {
  const firstName = name.trim().split(/\s+/)[0] || "friend";
  return (
    <div className="bg-cloud">
      <section className="bg-sand">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 pt-12 pb-14 sm:px-8 lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-14 lg:pt-20 lg:pb-20">
          <div>
            <p className="flex items-center gap-3 text-[0.95rem] font-semibold text-teal">
              <span aria-hidden className="h-0.5 w-8 bg-coral" />
              For our church family
            </p>
            <h1 className="font-display mt-5 text-display font-extrabold tracking-[-0.03em] text-ink">
              How’s it going, {firstName}?
            </h1>
            <p className="mt-6 max-w-[40ch] text-[1.15rem] leading-[1.7] text-ink/80">
              We’ve been changing how we do things. You’re in the room every week. Tell us what
              you’re seeing.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card)] lg:-rotate-[0.6deg]">
            <p className="font-display text-[1.25rem] font-bold text-ink">About 5 minutes</p>
            <p className="mt-2 text-[1rem] leading-[1.6] text-ink/75">
              Four short parts, mostly taps. Where we ask you to write, a specific moment helps us
              more than a rating.
            </p>
          </div>
        </div>
      </section>
      <FeedbackForm firstName={firstName} preview={preview} />
    </div>
  );
}
