import Link from "next/link";
import { ALL_VALUES, type ValueKey } from "@/lib/together/values";
import {
  CONVERSATIONS,
  EVENT_BAR,
  FILTER,
  GROUND_RULES,
  MEETING,
  type Conversation,
} from "@/lib/together/meeting";
import { IdeasModal } from "./IdeasModal";
import { PrintButton } from "./PrintButton";

/**
 * Members-only prep page for the vision meeting. Built so a member can scan it
 * in a few minutes and leave knowing what we'll talk about and what to think
 * about first. Content lives in lib/together/meeting.ts.
 */

const h2 =
  "font-display text-[clamp(1.9rem,3.2vw+0.6rem,3rem)] leading-[1.08] font-extrabold tracking-[-0.03em] text-balance";

const valueName = (key: ValueKey) => ALL_VALUES.find((v) => v.key === key)?.name ?? key;

const chip =
  "inline-flex min-h-11 items-center rounded-full border-2 border-ink/15 bg-white px-4 text-[1rem] font-bold text-ink transition-transform duration-300 ease-[cubic-bezier(.2,.9,.3,1.2)] hover:-translate-y-0.5 hover:border-teal focus-visible:outline-teal active:translate-y-0 print:hidden";

export function MeetingContent() {
  return (
    <div className="bg-cloud">
      {/* ── Opening ─────────────────────────────────────────────────── */}
      <section className="bg-sand">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-12 pb-16 sm:px-8 lg:grid-cols-[7fr_5fr] lg:items-center lg:gap-14 lg:pt-20 lg:pb-24">
          <div>
            <p className="flex items-center gap-3 text-[0.95rem] font-semibold text-teal">
              <span aria-hidden className="h-0.5 w-8 bg-coral" />
              Members’ meeting, {MEETING.day}
              {MEETING.when ? `, ${MEETING.when}` : ""}
            </p>
            <h1 className="font-display mt-5 text-display font-extrabold tracking-[-0.03em] text-balance text-ink">
              Where we go from here.
            </h1>
            <p className="mt-6 max-w-[40ch] text-[1.15rem] leading-[1.7] text-ink/85">
              This meeting isn’t about details. <strong className="text-ink">It’s about direction.</strong>{" "}
              Here’s what we’ll talk about, so you can think and pray about it before Sunday.
            </p>
            {MEETING.draft ? (
              <p className="mt-7 max-w-[46ch] rounded-2xl border-l-4 border-marigold bg-white px-5 py-4 text-[1.04rem] leading-[1.6] text-ink/85 shadow-[var(--shadow-card)]">
                <strong className="text-ink">Still taking shape.</strong> This is where my thinking is
                today. I may add an idea or two over the next few days, so check back before we meet.
                <span className="mt-1 block font-semibold text-ink">Joe</span>
              </p>
            ) : null}
          </div>

          <aside
            aria-labelledby="before"
            className="rounded-3xl bg-ink p-7 text-white shadow-[var(--shadow-card-lift)] sm:p-9 lg:rotate-[0.6deg]"
          >
            <h2 id="before" className="font-display text-[1.5rem] leading-tight font-bold">
              Before Sunday
            </h2>
            <ul className="mt-5 space-y-4 text-[1.08rem] leading-[1.55]">
              {[
                "Read this page once. It takes about five minutes.",
                "Pick the one conversation you care about most.",
                "Bring one “what if” and one question.",
                "Pray for our church and for this meeting.",
              ].map((t) => (
                <li key={t} className="flex gap-3.5">
                  <span
                    aria-hidden
                    className="mt-[0.15em] size-5 shrink-0 rounded-md border-2 border-marigold"
                  />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-white/15 pt-5">
              <PrintButton />
            </div>
          </aside>
        </div>
      </section>

      {/* ── The seven questions ─────────────────────────────────────── */}
      <section aria-labelledby="questions" className="bg-deepsea text-cloud">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-6 lg:grid-cols-[5fr_7fr] lg:gap-14">
            <div>
              <h2 id="questions" className={`${h2} text-white`}>
                Every idea answers the same seven questions.
              </h2>
              <p className="mt-5 max-w-[40ch] text-[1.12rem] leading-[1.7] text-cloud/90">
                No more deciding out of habit or on a hunch. These questions come straight from our{" "}
                <Link
                  href="/together#values"
                  className="rounded-sm font-bold text-white underline decoration-marigold decoration-2 underline-offset-[6px] transition-opacity duration-300 hover:opacity-80 focus-visible:outline-marigold active:opacity-60"
                >
                  core values
                </Link>
                . We’ll use them on Sunday, and on every decision after.
              </p>
              <p className="mt-6 max-w-[40ch] font-serif text-[1.35rem] leading-[1.4] text-white italic">
                If an idea can’t answer them well, it waits. Even if we’ve always done it.
              </p>
            </div>

            <ol className="divide-y divide-white/15 border-y border-white/15">
              {FILTER.map((f) => (
                <li key={f.value} className="list-none py-5">
                  <p className="font-display text-[clamp(1.25rem,1.2vw+0.9rem,1.6rem)] leading-[1.25] font-bold tracking-[-0.015em] text-white">
                    {f.question}
                  </p>
                  <p className="mt-1.5 text-[0.98rem] font-semibold text-marigold">{valueName(f.value)}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── The four conversations ──────────────────────────────────── */}
      <section aria-labelledby="talk" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <h2 id="talk" className={`${h2} text-ink`}>
          What we’ll talk about
        </h2>
        <p className="mt-4 max-w-[52ch] text-[1.1rem] leading-[1.7] text-ink/80">
          Six big conversations. For each one: where we are, the big question, and a few ideas to
          get you thinking. <strong className="text-ink">The ideas are sparks, not decisions.</strong>
        </p>

        <nav aria-label="Jump to a conversation" className="mt-7 flex flex-wrap gap-2.5">
          {CONVERSATIONS.map((c) => (
            <a key={c.id} href={`#${c.id}`} className={chip}>
              {c.name}
            </a>
          ))}
        </nav>

        <div className="mt-12 space-y-8 lg:space-y-10">
          {CONVERSATIONS.map((c) => (
            <ConversationCard key={c.id} c={c} />
          ))}
        </div>
      </section>

      {/* ── How we'll talk ──────────────────────────────────────────── */}
      <section aria-labelledby="how" className="bg-sand">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <h2 id="how" className={`${h2} text-ink`}>
            How we’ll talk on Sunday
          </h2>
          <ul className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {GROUND_RULES.map((r) => (
              <li key={r.title} className="list-none border-l-4 border-coral pl-5">
                <h3 className="font-display text-[1.35rem] font-bold tracking-[-0.02em] text-ink">
                  {r.title}
                </h3>
                <p className="mt-1.5 max-w-[44ch] text-[1.06rem] leading-[1.7] text-ink/80">{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Closing ─────────────────────────────────────────────────── */}
      <section aria-labelledby="see-you" className="bg-teal text-white print:hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-16 lg:py-24">
          <div>
            <h2 id="see-you" className={`${h2} text-white`}>
              See you Sunday.
            </h2>
            <p className="mt-6 max-w-[48ch] text-[1.12rem] leading-[1.7] text-white">
              You don’t need answers. Come with your heart for this church and a willingness to
              dream a little. We’ll figure out the rest together.
            </p>
            <p className="mt-6 font-display text-[1.15rem] font-bold text-white">Joe Cabrera, Minister</p>
          </div>

          <div className="space-y-4 rounded-3xl bg-ink p-7 shadow-[var(--shadow-card-lift)] sm:p-9">
            <p className="font-display text-[1.4rem] leading-tight font-bold text-white">
              Can’t wait till Sunday?
            </p>
            <p className="text-[1.05rem] leading-[1.6] text-white/90">
              Send an idea or a question now, and we’ll bring it into the conversation.
            </p>
            <div className="pt-2">
              <IdeasModal />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ConversationCard({ c }: { c: Conversation }) {
  return (
    <article
      id={c.id}
      aria-labelledby={`${c.id}-name`}
      className="scroll-mt-24 rounded-3xl bg-white p-7 shadow-[var(--shadow-card)] break-inside-avoid sm:p-10"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h3
          id={`${c.id}-name`}
          className="font-display text-[clamp(1.6rem,2vw+0.8rem,2.3rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-ink"
        >
          {c.name}
        </h3>
        {c.flag ? (
          <span className="rounded-full bg-coral px-3.5 py-1 text-[0.85rem] font-bold text-white">
            {c.flag}
          </span>
        ) : null}
      </div>
      <p className="mt-3 max-w-[60ch] text-[1.06rem] leading-[1.7] text-ink/75">{c.now}</p>

      <p className="mt-7 max-w-[30ch] font-serif text-[clamp(1.55rem,2vw+0.9rem,2.35rem)] leading-[1.25] text-teal italic text-balance">
        {c.question}
      </p>

      <div className="mt-9 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <h4 className="font-display text-[1.2rem] font-bold text-ink">Think about</h4>
          <ul className="mt-4 space-y-3.5 text-[1.06rem] leading-[1.6] text-ink/85">
            {c.think.map((t) => (
              <li key={t} className="flex gap-3">
                <span aria-hidden className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-coral" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-[1.2rem] font-bold text-ink">What if…</h4>
          <ul className="mt-4 space-y-3">
            {c.whatIf.map((t) => (
              <li
                key={t}
                className="list-none rounded-2xl border-2 border-dashed border-teal/35 bg-teal/[0.04] px-5 py-3.5 text-[1.04rem] leading-[1.55] text-ink"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {c.id === "events" ? (
        <div className="mt-9 rounded-2xl bg-sand p-6 sm:p-8">
          <h4 className="font-display text-[1.2rem] font-bold text-ink">
            A starting point: an event goes on the calendar only if…
          </h4>
          <ul className="mt-4 grid gap-3 text-[1.05rem] leading-[1.6] text-ink/85 sm:grid-cols-2">
            {EVENT_BAR.map((t) => (
              <li key={t} className="flex gap-3">
                <span aria-hidden className="mt-[0.15em] size-5 shrink-0 rounded-md border-2 border-teal" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-8 border-t border-ink/10 pt-5 text-[0.98rem] text-ink/70">
        Leans on{" "}
        {c.values.map((v, i) => (
          <span key={v}>
            <strong className="font-semibold text-ink">{valueName(v)}</strong>
            {i < c.values.length - 2 ? ", " : i === c.values.length - 2 ? " and " : ""}
          </span>
        ))}
      </p>
    </article>
  );
}
