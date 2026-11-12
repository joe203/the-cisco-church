"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  AGE,
  AREA_CHOICES,
  AREA_PROMPT,
  AREAS,
  ATTENDANCE,
  GROWTH,
  MIN_NOTICED,
  READ,
  SHARE,
  STANCE,
  TENURE,
  TRADITION,
  TRADITION_LEFT,
  TRADITION_RIGHT,
  TRIES,
  TRY_CHOICES,
  VALUE_CHOICES,
  type AreaChoice,
  type Opt,
} from "@/lib/feedback/schema";
import { ALL_VALUES } from "@/lib/together/values";

const field =
  "mt-2 w-full rounded-xl border-2 border-ink/20 bg-white px-4 py-3 text-[1.05rem] leading-[1.6] text-ink placeholder:text-ink/45 focus-visible:border-teal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/20";
const question =
  "font-display text-[clamp(1.3rem,1.1vw+1rem,1.6rem)] leading-[1.2] font-bold tracking-[-0.02em] text-ink";
const help = "mt-1.5 max-w-[60ch] text-[1rem] leading-[1.6] text-ink/72";
const listCard = "mt-5 divide-y divide-ink/12 rounded-2xl bg-white shadow-[var(--shadow-card)]";
const row = "list-none px-5 py-4 sm:px-6";

const PARTS = ["A little about you", "What you’re seeing", "Things we might try", "Anything else"];

/**
 * The questions in each part that must be answered in order. Every one is on the
 * page, but only the next unanswered one can be tapped; the rest wait, dimmed.
 */
const SEQUENCE: string[][] = [
  [
    "p.read",
    ...ALL_VALUES.map((v) => `v.${v.key}`),
    "p.stance",
    "p.tradition",
    "p.growth",
    "p.age",
    "p.tenure",
    "p.attendance",
  ],
  AREAS.map((a) => `area.${a.key}`),
  TRIES.map((t) => `try.${t.key}`),
  [],
];

type State = "idle" | "sending" | "done";

/** One answer from a short list, as tappable pills. Real radio inputs underneath. */
function Pills({
  name,
  options,
  label,
  cols = "grid-cols-3",
}: {
  name: string;
  options: readonly Opt[];
  label: string;
  cols?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={`grid gap-2 ${cols}`}>
      {options.map((o) => (
        <label
          key={o.key}
          className="flex min-h-11 cursor-pointer items-center justify-center rounded-full border-2 border-ink/18 bg-white px-2 text-center text-[0.95rem] leading-tight font-semibold text-ink/80 transition-transform duration-300 ease-[var(--ease-spring)] hover:-translate-y-px hover:border-teal hover:text-ink active:scale-95 has-[:checked]:border-teal has-[:checked]:bg-teal has-[:checked]:text-white has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-teal/30"
        >
          <input type="radio" name={name} value={o.key} required className="sr-only" />
          {o.label}
        </label>
      ))}
    </div>
  );
}

/** One answer from longer statements, as full-width cards. */
function Cards({ name, options, cols = "" }: { name: string; options: readonly Opt[]; cols?: string }) {
  return (
    <div className={`mt-4 grid gap-2.5 ${cols}`}>
      {options.map((o) => (
        <label
          key={o.key}
          className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border-2 border-ink/18 bg-white px-4 py-3 text-[1.02rem] leading-snug font-semibold text-ink transition-transform duration-300 ease-[var(--ease-spring)] hover:-translate-y-px hover:border-teal active:scale-[0.99] has-[:checked]:border-teal has-[:checked]:bg-teal/[0.07] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-teal/25"
        >
          <input type="radio" name={name} value={o.key} required className="size-5 shrink-0 accent-teal focus-visible:outline-none" />
          {o.label}
        </label>
      ))}
    </div>
  );
}

/** "How's it going?" — the member feedback form. `preview` = design preview, never posts. */
export function FeedbackForm({ firstName, preview = false }: { firstName: string; preview?: boolean }) {
  const form = useRef<HTMLFormElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [concern, setConcern] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  /** Index of the first unanswered question in a part (its length when all are answered). */
  const openAt = (part: number, answers = picked) => {
    const i = SEQUENCE[part].findIndex((name) => !answers[name]);
    return i === -1 ? SEQUENCE[part].length : i;
  };

  const dim = (locked: boolean) => `transition-opacity duration-300 ${locked ? "opacity-35" : ""}`;

  /** A question in the sequence stays dimmed and untouchable until it's its turn. */
  const gate = (name: string) => {
    const part = SEQUENCE.findIndex((names) => names.includes(name));
    const locked = SEQUENCE[part].indexOf(name) > openAt(part);
    return { attrs: { "data-seq": name, inert: locked }, cls: dim(locked) };
  };

  /** Whatever follows a part's sequence (the open-ended boxes) waits until the sequence is done. */
  const rest = (part: number) => {
    const locked = openAt(part) < SEQUENCE[part].length;
    return { attrs: { "data-seq-rest": part, inert: locked }, cls: dim(locked) };
  };

  /** After answering the current question, bring the next one into view if it's off screen. */
  function reveal(part: number, answers: Record<string, string>) {
    const i = openAt(part, answers);
    const target =
      i < SEQUENCE[part].length
        ? document.querySelector<HTMLElement>(`[data-seq="${SEQUENCE[part][i]}"]`)
        : document.querySelector<HTMLElement>(`[data-seq-rest="${part}"]`);
    if (!target) return;
    const rect = target.getBoundingClientRect();
    if (rect.top > 80 && rect.bottom < window.innerHeight - 60) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ block: "center", behavior: smooth ? "smooth" : "auto" });
  }

  const sections = () => Array.from(form.current?.querySelectorAll<HTMLElement>("[data-part]") ?? []);

  /** The first unanswered required question in a part, or null when the part is complete. */
  function missing(part: HTMLElement): { el: HTMLElement; message: string } | null {
    for (const el of Array.from(part.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea"))) {
      if (el.checkValidity()) continue;
      const what = el.closest<HTMLElement>("[data-q]")?.dataset.q ?? "this question";
      const message =
        el instanceof HTMLTextAreaElement && el.value.trim()
          ? `Add a little more here, a sentence or two: ${what}`
          : `One more to answer: ${what}`;
      return { el, message };
    }
    return null;
  }

  function goTo(i: number) {
    setStep(i);
    setError("");
    requestAnimationFrame(() => {
      top.current?.scrollIntoView({ block: "start" });
      top.current?.focus({ preventScroll: true });
    });
  }

  function flag(gap: { el: HTMLElement; message: string }) {
    setError(gap.message);
    const q = gap.el.closest<HTMLElement>("[data-q]") ?? gap.el;
    q.scrollIntoView({ block: "center" });
    gap.el.focus({ preventScroll: true });
  }

  function next() {
    const gap = missing(sections()[step]);
    if (gap) return flag(gap);
    goTo(step + 1);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parts = sections();
    for (let i = 0; i < parts.length; i++) {
      const gap = missing(parts[i]);
      if (!gap) continue;
      if (i !== step) {
        setStep(i);
        requestAnimationFrame(() => flag(gap));
      } else flag(gap);
      return;
    }

    const fd = new FormData(e.currentTarget);
    const get = (k: string) => (fd.get(k) as string | null) ?? "";
    const collect = (keys: readonly { key: string }[], prefix: string) =>
      Object.fromEntries(keys.map((k) => [k.key, get(`${prefix}.${k.key}`)]).filter(([, v]) => v));
    const payload = {
      profile: {
        read: get("p.read"),
        values: collect(ALL_VALUES, "v"),
        stance: get("p.stance"),
        tradition: Number(get("p.tradition")),
        growth: get("p.growth"),
        age: get("p.age"),
        tenure: get("p.tenure"),
        attendance: get("p.attendance"),
        note: get("p.note"),
      },
      areas: collect(AREAS, "area"),
      area_notes: collect(AREAS, "areanote"),
      noticed: get("noticed"),
      keep_doing: get("keep_doing"),
      tries: collect(TRIES, "try"),
      try_notes: collect(TRIES, "trynote"),
      idea: get("idea"),
      concern: get("concern"),
      suggestion: get("suggestion"),
      wants_talk: fd.get("wants_talk") === "on",
      share: get("share"),
    };

    setState("sending");
    setError("");
    if (preview) {
      setState("done");
      return;
    }
    try {
      const res = await fetch("/api/together/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setState("done");
        window.scrollTo({ top: 0 });
        return;
      }
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "That didn’t send. Please try again.");
    } catch {
      setError("That didn’t send. Check your connection and try again.");
    }
    setState("idle");
  }

  if (state === "done") {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="rounded-3xl bg-white p-8 shadow-[var(--shadow-card-lift)] sm:p-11">
          <h2 className="font-display text-[clamp(1.9rem,3vw+0.6rem,2.7rem)] leading-[1.08] font-extrabold tracking-[-0.03em] text-ink">
            Thank you, {firstName}.
          </h2>
          <p className="mt-4 max-w-[52ch] text-[1.1rem] leading-[1.7] text-ink/80">
            Joe and the elders read every response. What you’ve seen helps us know what to keep
            building on.
          </p>
          <Link href="/together" className="btn-coral mt-7">
            Back to where we’re headed
          </Link>
        </div>
      </div>
    );
  }

  const last = step === PARTS.length - 1;
  const g = (name: string) => gate(name);

  return (
    <form
      ref={form}
      noValidate
      onSubmit={submit}
      onChange={(e) => {
        const t = e.target as EventTarget;
        if (t instanceof HTMLInputElement && t.type === "radio") {
          const answers = { ...picked, [t.name]: t.value };
          setPicked(answers);
          const part = SEQUENCE.findIndex((names) => names.includes(t.name));
          if (part !== -1 && !picked[t.name]) requestAnimationFrame(() => reveal(part, answers));
        }
        if (error) setError("");
      }}
      className="mx-auto max-w-[52rem] px-5 pt-10 pb-20 sm:px-8 lg:pt-14 lg:pb-28"
    >
      {/* ── Where you are in the form ─────────────────────────────── */}
      <div ref={top} tabIndex={-1} className="scroll-mt-24 outline-none">
        <p className="text-[0.98rem] font-semibold text-teal">
          Part {step + 1} of {PARTS.length}
        </p>
        <ol className="mt-2.5 grid grid-cols-4 gap-1.5" aria-label="Progress">
          {PARTS.map((p, i) => (
            <li key={p} className="list-none">
              <span aria-hidden className={`block h-1.5 rounded-full ${i <= step ? "bg-teal" : "bg-ink/12"}`} />
              <span className={`mt-2 hidden text-[0.88rem] sm:block ${i === step ? "font-bold text-ink" : "text-ink/60"}`}>
                {p}
              </span>
              <span className="sr-only">{i < step ? " (done)" : i === step ? " (current)" : ""}</span>
            </li>
          ))}
        </ol>
        <h2 className="font-display mt-8 text-[clamp(1.9rem,2.6vw+0.8rem,2.6rem)] leading-[1.08] font-extrabold tracking-[-0.03em] text-ink">
          {PARTS[step]}
        </h2>
      </div>

      {/* ── Part 1: a little about you ────────────────────────────── */}
      <section data-part hidden={step !== 0}>
        <p className="mt-3 max-w-[58ch] text-[1.1rem] leading-[1.7] text-ink/80">
          Your feedback means more when we understand where you are: in the life of our church,
          and in your own walk with God. <strong className="text-ink">There are no wrong answers.</strong>{" "}
          We simply want to understand each other better, and find ways to help.
        </p>
        <p className="mt-3 text-[1rem] text-ink/65">Answer each question to open the next one.</p>

        <fieldset data-q="Have you looked over “Where we’re headed”?" {...g("p.read").attrs} className={`mt-10 ${g("p.read").cls}`}>
          <legend className={question}>Have you looked over “Where we’re headed”?</legend>
          <p className={help}>Joe’s video, our values, and what’s changing. It takes about 5 minutes.</p>
          <a
            href="/together"
            target="_blank"
            rel="noopener"
            className="mt-4 inline-flex min-h-12 flex-wrap items-center gap-x-2.5 rounded-full border-2 border-teal bg-white px-5 py-2 text-[1rem] font-bold text-teal transition-transform duration-300 ease-[var(--ease-spring)] hover:-translate-y-px hover:bg-teal hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal/30 active:scale-95"
          >
            Open “Where we’re headed”
            <span className="text-[0.88rem] font-semibold opacity-80">(opens in a new tab)</span>
          </a>
          <div className="mt-5 sm:max-w-[30rem]">
            <Pills name="p.read" options={READ} label="Have you looked over Where we’re headed?" />
          </div>
          {picked["p.read"] === "not_yet" && (
            <p className="mt-4 max-w-[56ch] rounded-xl bg-sand px-4 py-3 text-[1rem] leading-[1.6] text-ink/85">
              That’s okay. Tap the button above, take a few minutes with it, then come back to this
              tab. Your answers here will wait for you.
            </p>
          )}
        </fieldset>

        <fieldset className="mt-12">
          <legend className={question}>These guide every decision we make. How do they sit with you?</legend>
          <p className={help}>
            Read each one, then answer honestly. If you’re not with us on one, “Not really” is a
            fine answer.
          </p>
          <ul className={listCard}>
            {ALL_VALUES.map((v) => {
              const q = g(`v.${v.key}`);
              return (
                <li
                  key={v.key}
                  data-q={v.name}
                  {...q.attrs}
                  className={`${row} ${q.cls} first:rounded-t-2xl last:rounded-b-2xl lg:flex lg:items-center lg:justify-between lg:gap-6`}
                >
                  <div className="lg:min-w-0">
                    <p className="text-[1.08rem] font-bold text-ink">{v.name}</p>
                    <p className="text-[0.98rem] leading-snug text-ink/70">{v.short}</p>
                  </div>
                  <div className="mt-3 lg:mt-0 lg:w-[28rem] lg:shrink-0">
                    <Pills
                      name={`v.${v.key}`}
                      options={VALUE_CHOICES}
                      label={v.name}
                      cols="grid-cols-2 sm:grid-cols-[0.9fr_1fr_1.35fr_1.15fr]"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <fieldset data-q="How do you feel about the changes?" {...g("p.stance").attrs} className={`mt-12 ${g("p.stance").cls}`}>
          <legend className={question}>Which is closest to how you feel about the changes?</legend>
          <Cards name="p.stance" options={STANCE} />
        </fieldset>

        <fieldset
          data-q="Where you land between the two views"
          {...g("p.tradition").attrs}
          className={`mt-12 ${g("p.tradition").cls}`}
        >
          <legend className={question}>
            Churches of Christ have a long tradition. Where do you land between these two views?
          </legend>
          <p className={help}>
            Faithful people hold each of these. There’s no wrong answer; we’re trying to understand
            where each of us is.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-sand p-4 sm:p-5">
              <p className="font-display text-[1.4rem] leading-none font-extrabold text-ink">1</p>
              <p className="mt-2 text-[1rem] leading-[1.55] text-ink/85">{TRADITION_LEFT}</p>
            </div>
            <div className="rounded-xl bg-sand p-4 sm:p-5 sm:text-right">
              <p className="font-display text-[1.4rem] leading-none font-extrabold text-ink">10</p>
              <p className="mt-2 text-[1rem] leading-[1.55] text-ink/85">{TRADITION_RIGHT}</p>
            </div>
          </div>
          <div className="mt-4">
            <Pills
              name="p.tradition"
              options={TRADITION}
              label="From 1, keep to our traditional ways, to 10, try new ideas"
              cols="grid-cols-5 sm:grid-cols-10"
            />
          </div>
          <p className="mt-2 flex justify-between text-[0.9rem] text-ink/60" aria-hidden>
            <span>Traditional ways</span>
            <span>New ideas</span>
          </p>
        </fieldset>

        <fieldset data-q="If our Sunday crowd doubled" {...g("p.growth").attrs} className={`mt-12 ${g("p.growth").cls}`}>
          <legend className={question}>
            Picture our Sunday crowd doubling in the next few years, mostly with people new to
            church. How does that sit with you?
          </legend>
          <Cards name="p.growth" options={GROWTH} cols="sm:grid-cols-2" />
        </fieldset>

        <fieldset data-q="Which age group are you in?" {...g("p.age").attrs} className={`mt-12 ${g("p.age").cls}`}>
          <legend className={question}>Which age group are you in?</legend>
          <p className={help}>So we can hear from every generation, not just one.</p>
          <div className="mt-4">
            <Pills name="p.age" options={AGE} label="Your age group" cols="grid-cols-3 sm:grid-cols-5" />
          </div>
        </fieldset>

        <div className="mt-12 grid gap-10 lg:grid-cols-[4fr_3fr] lg:gap-8">
          <fieldset data-q="How long have you been part of the Cisco Church?" {...g("p.tenure").attrs} className={g("p.tenure").cls}>
            <legend className={question}>How long have you been part of the Cisco Church?</legend>
            <div className="mt-4">
              <Pills name="p.tenure" options={TENURE} label="How long" cols="grid-cols-2" />
            </div>
          </fieldset>
          <fieldset data-q="How often are you with us on Sunday morning?" {...g("p.attendance").attrs} className={g("p.attendance").cls}>
            <legend className={question}>How often are you with us on Sunday morning?</legend>
            <div className="mt-4">
              <Pills name="p.attendance" options={ATTENDANCE} label="How often" cols="grid-cols-1" />
            </div>
          </fieldset>
        </div>

        <div {...rest(0).attrs} className={`mt-12 ${rest(0).cls}`}>
          <label htmlFor="f-pnote" className={question}>
            Anything else you’d like us to know about you?
          </label>
          <p className={help}>Optional.</p>
          <textarea id="f-pnote" name="p.note" maxLength={1500} rows={3} className={field} />
        </div>
      </section>

      {/* ── Part 2: what you're seeing ────────────────────────────── */}
      <section data-part hidden={step !== 1}>
        <p className="mt-3 max-w-[56ch] text-[1.1rem] leading-[1.7] text-ink/80">
          These are changes we’ve already made. Answer each one. If you haven’t been around enough
          to say, “Too soon” is the right answer.
        </p>

        <fieldset className="mt-8">
          <legend className={question}>Better, the same, or too soon to tell?</legend>
          <ul className={listCard}>
            {AREAS.map((a) => {
              const choice = picked[`area.${a.key}`] as AreaChoice | undefined;
              const q = g(`area.${a.key}`);
              return (
                <li
                  key={a.key}
                  data-q={a.label}
                  {...q.attrs}
                  className={`${row} ${q.cls} ${choice === "better" ? "bg-teal/[0.06]" : ""} first:rounded-t-2xl last:rounded-b-2xl`}
                >
                  <div className="sm:flex sm:items-center sm:justify-between sm:gap-6">
                    <div className="sm:min-w-0">
                      <p className="text-[1.08rem] font-bold text-ink">{a.label}</p>
                      <p className="text-[0.95rem] text-ink/65">{a.hint}</p>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:w-[19rem] sm:shrink-0">
                      <Pills name={`area.${a.key}`} options={AREA_CHOICES} label={a.label} />
                    </div>
                  </div>
                  {choice && (
                    <div className="mt-3">
                      <label htmlFor={`an-${a.key}`} className="text-[0.98rem] font-semibold text-ink/85">
                        {AREA_PROMPT[choice]} <span className="font-normal text-ink/60">(optional)</span>
                      </label>
                      <textarea id={`an-${a.key}`} name={`areanote.${a.key}`} maxLength={1500} rows={2} className={field} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </fieldset>

        <div {...rest(1).attrs} className={`mt-12 ${rest(1).cls}`}>
          <div data-q="What tells you we’re moving forward?">
            <label htmlFor="f-noticed" className={question}>
              What have you seen that tells you we’re moving forward?
            </label>
            <p className={help}>
              Be specific: a Sunday, a song, a conversation, a person.{" "}
              <strong className="text-ink">“Three families stayed after to talk”</strong> tells us
              more than “it’s better.”
            </p>
            <textarea
              id="f-noticed"
              name="noticed"
              required
              minLength={MIN_NOTICED}
              maxLength={4000}
              rows={5}
              placeholder="Last Sunday I noticed…"
              className={field}
            />
          </div>

          <div className="mt-12">
            <label htmlFor="f-keep" className={question}>
              What should we keep doing, or do more of?
            </label>
            <textarea id="f-keep" name="keep_doing" maxLength={4000} rows={3} className={field} />
          </div>
        </div>
      </section>

      {/* ── Part 3: things we might try ───────────────────────────── */}
      <section data-part hidden={step !== 2}>
        <p className="mt-3 max-w-[56ch] text-[1.1rem] leading-[1.7] text-ink/80">
          None of these have started. Before we decide, we want to know how you’d feel about giving
          them a try.
        </p>

        <fieldset className="mt-8">
          <legend className={question}>How do you feel about trying these?</legend>
          <ul className={listCard}>
            {TRIES.map((t) => {
              const choice = picked[`try.${t.key}`];
              const q = g(`try.${t.key}`);
              return (
                <li key={t.key} data-q={t.label} {...q.attrs} className={`${row} ${q.cls}`}>
                  <p className="text-[1.1rem] font-bold text-ink">{t.label}</p>
                  <p className="text-[0.98rem] leading-snug text-ink/70">{t.hint}</p>
                  <div className="mt-3 sm:max-w-[34rem]">
                    <Pills name={`try.${t.key}`} options={TRY_CHOICES} label={t.label} cols="grid-cols-2 sm:grid-cols-4" />
                  </div>
                  {choice && (
                    <div className="mt-3">
                      <label htmlFor={`tn-${t.key}`} className="text-[0.98rem] font-semibold text-ink/85">
                        Any thoughts? <span className="font-normal text-ink/60">(optional)</span>
                      </label>
                      <textarea id={`tn-${t.key}`} name={`trynote.${t.key}`} maxLength={1500} rows={2} className={field} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </fieldset>

        <div {...rest(2).attrs} className={`mt-12 ${rest(2).cls}`}>
          <label htmlFor="f-idea" className={question}>
            Got an idea of your own that would take us further?
          </label>
          <p className={help}>
            Optional. The best ideas point people to Jesus and build relationships.{" "}
            <a
              href="/together#values"
              target="_blank"
              rel="noopener"
              className="font-bold text-teal underline underline-offset-4 hover:text-deepsea focus-visible:rounded-sm"
            >
              See what guides our decisions
            </a>
            .
          </p>
          <textarea id="f-idea" name="idea" maxLength={4000} rows={4} className={field} />
        </div>
      </section>

      {/* ── Part 4: anything else ─────────────────────────────────── */}
      <section data-part hidden={step !== 3}>
        <section aria-labelledby="f-concern-h" className="mt-8 rounded-3xl border-2 border-ink/12 bg-sand p-6 sm:p-9">
          <h3 id="f-concern-h" className={question}>
            Something you’d like us to look at?
          </h3>
          <p className={help}>
            Optional. Concerns are welcome here. This part goes to Joe and the elders only and is
            never shared. Help us act on it: tell us what you’ve seen, and what you’d suggest.
          </p>

          <label htmlFor="f-concern" className="mt-6 block text-[1.02rem] font-bold text-ink">
            What have you noticed?
          </label>
          <textarea
            id="f-concern"
            name="concern"
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            maxLength={4000}
            rows={4}
            className={field}
          />

          <div data-q="What would you suggest we do?">
            <label htmlFor="f-suggestion" className="mt-5 block text-[1.02rem] font-bold text-ink">
              What would you suggest we do?{" "}
              {concern.trim() ? <span className="font-normal text-ink/65">(needed with a concern)</span> : null}
            </label>
            <textarea
              id="f-suggestion"
              name="suggestion"
              required={Boolean(concern.trim())}
              maxLength={4000}
              rows={3}
              className={field}
            />
          </div>

          <label className="mt-5 flex min-h-11 cursor-pointer items-start gap-3 text-[1.02rem] text-ink">
            <input type="checkbox" name="wants_talk" className="mt-1 size-5 shrink-0 accent-teal" />
            I’d rather talk about this in person. Please reach out to me.
          </label>
        </section>

        <fieldset data-q="May we share what you’ve seen?" className="mt-12">
          <legend className={question}>May we share what you’ve seen?</legend>
          <p className={help}>
            Hearing it from each other is encouraging. We might quote what you told us you’ve seen
            in the bulletin or on a Sunday slide. Concerns are never shared.
          </p>
          <Cards name="share" options={SHARE} cols="sm:grid-cols-3" />
        </fieldset>
      </section>

      {error && (
        <p role="alert" className="mt-8 rounded-xl bg-coral/10 px-4 py-3 text-[1rem] font-semibold text-clay">
          {error}
        </p>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
        {last ? (
          <button type="submit" disabled={state === "sending"} className="btn-coral disabled:opacity-60">
            {state === "sending" ? "Sending…" : "Send my feedback"}
          </button>
        ) : (
          <button type="button" onClick={next} className="btn-coral">
            Next: {PARTS[step + 1]}
          </button>
        )}
        {step > 0 && (
          <button type="button" onClick={() => goTo(step - 1)} className="btn-ghost">
            Back
          </button>
        )}
        {last && <p className="text-[0.98rem] text-ink/65">Your name goes with it, so we can follow up.</p>}
      </div>
    </form>
  );
}
