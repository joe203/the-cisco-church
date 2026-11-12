import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { StaffHeader } from "@/components/staff/StaffHeader";
import {
  applyFilters,
  compare,
  count,
  DIMENSIONS,
  latestPerPerson,
  listFeedback,
  type DimensionKey,
  type FeedbackRow,
  type Filters,
} from "@/lib/feedback/data";
import {
  AGE,
  AREA_CHOICES,
  AREAS,
  ATTENDANCE,
  GROWTH,
  labelOf,
  READ,
  SHARE,
  STANCE,
  TENURE,
  TRIES,
  TRY_CHOICES,
  VALUE_CHOICES,
} from "@/lib/feedback/schema";
import { getStaff } from "@/lib/supabase/auth";
import { ALL_VALUES } from "@/lib/together/values";

export const metadata: Metadata = { title: "Feedback" };
export const dynamic = "force-dynamic";

const when = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/Chicago" });

/** Bar colors run from eager (teal) to reluctant (coral); the middle is neutral. */
const colorsFor = (n: number) =>
  n === 3
    ? ["bg-teal", "bg-ink/35", "bg-marigold"]
    : n === 4
      ? ["bg-teal", "bg-teal/55", "bg-marigold", "bg-coral"]
      : ["bg-teal", "bg-teal/55", "bg-ink/35", "bg-marigold", "bg-coral"];

const panel = "rounded-2xl bg-white p-6 shadow-panel-light sm:p-8";
const h2 = "font-display text-[1.4rem] font-bold";
const chip =
  "inline-flex min-h-9 items-center rounded-full px-3.5 text-[0.9rem] font-semibold transition-transform duration-300 ease-[var(--ease-spring)] hover:-translate-y-px active:scale-95";

type Params = Filters & { by?: string };

/** A link to this page with some parameters changed (undefined removes one). */
function href(current: Params, change: Params): string {
  const next = { ...current, ...change };
  const q = new URLSearchParams(
    Object.entries(next).filter((e): e is [string, string] => typeof e[1] === "string" && e[1] !== ""),
  ).toString();
  return q ? `/staff/feedback?${q}` : "/staff/feedback";
}

function Bar({ label, counts }: { label: string; counts: { key: string; label: string; n: number }[] }) {
  const total = counts.reduce((s, c) => s + c.n, 0);
  const colors = colorsFor(counts.length);
  return (
    <li className="list-none">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <span className="font-bold">{label}</span>
        <span className="text-[0.9rem] text-ink/70">
          {total ? counts.filter((c) => c.n).map((c) => `${c.n} ${c.label.toLowerCase()}`).join(", ") : "no answers yet"}
        </span>
      </div>
      <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-ink/8" aria-hidden>
        {counts.map((c, i) => (
          <span key={c.key} className={colors[i]} style={{ width: total ? `${(c.n / total) * 100}%` : "0%" }} />
        ))}
      </div>
    </li>
  );
}

function Legend({ options }: { options: readonly { key: string; label: string }[] }) {
  const colors = colorsFor(options.length);
  return (
    <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[0.88rem] text-ink/70">
      {options.map((o, i) => (
        <span key={o.key}>
          <span aria-hidden className={`mr-1.5 inline-block size-2.5 rounded-full ${colors[i]}`} />
          {o.label}
        </span>
      ))}
    </p>
  );
}

/** How many people chose each point on the 1–10 tradition scale. */
function Scale({ rows }: { rows: FeedbackRow[] }) {
  const counts = Array.from({ length: 10 }, (_, i) => rows.filter((r) => r.profile.tradition === i + 1).length);
  const max = Math.max(1, ...counts);
  const average = rows.length ? (rows.reduce((s, r) => s + r.profile.tradition, 0) / rows.length).toFixed(1) : null;
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <span className="font-bold">Tradition scale</span>
        <span className="text-[0.9rem] text-ink/70">{average ? `Average ${average} of 10` : "no answers yet"}</span>
      </div>
      <div className="mt-3 grid h-24 grid-cols-10 items-end gap-1.5">
        {counts.map((n, i) => (
          <div key={i} className="flex h-full flex-col justify-end text-center">
            <span className="text-[0.8rem] text-ink/70">{n || ""}</span>
            <span className="mt-1 block rounded-t-md bg-teal" style={{ height: `${(n / max) * 70}%`, minHeight: n ? 4 : 0 }} />
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-10 gap-1.5 border-t border-ink/15 pt-1 text-center text-[0.8rem] text-ink/60">
        {counts.map((_, i) => (
          <span key={i}>{i + 1}</span>
        ))}
      </div>
      <p className="mt-1 flex justify-between text-[0.85rem] text-ink/60">
        <span>Keep to traditional ways</span>
        <span>Try new ideas</span>
      </p>
    </div>
  );
}

function Block({ label, text }: { label: string; text: string | null | undefined }) {
  if (!text) return null;
  return (
    <div className="mt-4">
      <p className="text-[0.85rem] font-bold text-ink/60">{label}</p>
      <p className="mt-1 whitespace-pre-line text-[1rem] leading-[1.65]">{text}</p>
    </div>
  );
}

function Response({ r }: { r: FeedbackRow }) {
  const p = r.profile;
  const doubts = ALL_VALUES.filter((v) => p.values?.[v.key] === "thinking" || p.values?.[v.key] === "not_really");
  return (
    <li className="list-none rounded-2xl bg-white p-6 shadow-panel-light sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="font-display text-[1.25rem] font-bold">{r.member_name}</p>
        <p className="flex flex-wrap items-center gap-2 text-[0.9rem] text-ink/70">
          {when(r.created_at)}
          {r.is_test && <span className="rounded-full bg-marigold/40 px-2.5 py-0.5 font-semibold text-ink">Test, not counted</span>}
          <span className={`rounded-full px-2.5 py-0.5 font-semibold ${r.share === "private" ? "bg-ink/8 text-ink/75" : "bg-teal text-white"}`}>
            {r.share === "private" ? "Private" : labelOf(SHARE, r.share)}
          </span>
        </p>
      </div>

      <div className="mt-4 rounded-xl bg-cloud p-4 text-[0.95rem] leading-[1.6] sm:p-5">
        <p className="font-semibold">“{labelOf(STANCE, p.stance)}”</p>
        <p className="mt-1 text-ink/75">
          Age {labelOf(AGE, p.age).toLowerCase()}. {labelOf(TENURE, p.tenure)} here, {labelOf(ATTENDANCE, p.attendance).toLowerCase()}.
          Tradition scale <strong className="text-ink">{p.tradition} of 10</strong>. If Sundays doubled:{" "}
          {labelOf(GROWTH, p.growth).toLowerCase()}. Read “Where we’re headed”: {labelOf(READ, p.read).toLowerCase()}.
        </p>
        <p className="mt-1 text-ink/75">
          {doubts.length
            ? `Values they’re unsure of: ${doubts.map((v) => `${v.name} (${labelOf(VALUE_CHOICES, p.values?.[v.key]).toLowerCase()})`).join(", ")}.`
            : "All in or mostly on every value."}
        </p>
        {p.note ? <p className="mt-2 whitespace-pre-line">“{p.note}”</p> : null}
      </div>

      <ul className="mt-4 space-y-1.5 text-[0.95rem]">
        {AREAS.filter((a) => r.areas?.[a.key]).map((a) => (
          <li key={a.key} className="list-none">
            <span className="font-semibold">{a.label}:</span> {labelOf(AREA_CHOICES, r.areas[a.key]).toLowerCase()}
            {r.area_notes?.[a.key] ? <span className="text-ink/75">. “{r.area_notes[a.key]}”</span> : null}
          </li>
        ))}
      </ul>
      <Block label="What tells them we’re moving forward" text={r.noticed} />
      <Block label="Keep doing / do more of" text={r.keep_doing} />

      <div className="mt-4">
        <p className="text-[0.85rem] font-bold text-ink/60">Things we might try</p>
        <ul className="mt-1 space-y-1.5 text-[0.95rem]">
          {TRIES.filter((t) => r.tries?.[t.key]).map((t) => (
            <li key={t.key} className="list-none">
              <span className="font-semibold">{t.label}:</span> {labelOf(TRY_CHOICES, r.tries[t.key]).toLowerCase()}
              {r.try_notes?.[t.key] ? <span className="text-ink/75">. “{r.try_notes[t.key]}”</span> : null}
            </li>
          ))}
        </ul>
      </div>
      <Block label="Their own idea" text={r.idea} />

      {r.concern && (
        <div className="mt-5 rounded-xl bg-sand p-4 sm:p-5">
          <p className="text-[0.85rem] font-bold text-clay">
            Concern (private){r.wants_talk ? ", wants to talk in person" : ""}
          </p>
          <p className="mt-1 whitespace-pre-line text-[1rem] leading-[1.65]">{r.concern}</p>
          <Block label="What they’d suggest" text={r.suggestion} />
        </div>
      )}
    </li>
  );
}

const show = (n: number | null, suffix = "%") => (n == null ? "—" : `${n}${suffix}`);

/** Admins only: every "How's it going?" response, filtered and compared by who's answering. */
export default async function FeedbackStaffPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const staff = await getStaff();
  if (!staff) redirect("/staff/login");
  if (staff.role !== "admin") redirect("/staff");

  const raw = await searchParams;
  const filters: Filters = {};
  for (const d of DIMENSIONS) {
    const v = raw[d.key];
    if (v && d.options.some((o) => o.key === v)) filters[d.key] = v;
  }
  const by: DimensionKey = DIMENSIONS.some((d) => d.key === raw.by) ? (raw.by as DimensionKey) : "age";
  const params: Params = { ...filters, by: raw.by && by !== "age" ? by : undefined };

  const rows = await listFeedback();
  const everyone = latestPerPerson(rows ?? []);
  const people = applyFilters(everyone, filters);
  const shown = applyFilters(rows ?? [], filters);
  const filtered = Object.keys(filters).length > 0;
  const groups = compare(people, by);

  return (
    <>
      <StaffHeader staff={staff} />
      <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[2.4rem] leading-[1.05] font-extrabold tracking-[-0.03em]">How’s it going?</h1>
            <p className="mt-2 max-w-[60ch] text-ink/72">
              Responses from <span className="font-semibold">theciscochurch.org/together/feedback</span>. Totals count
              each person once (their latest response). Test responses are listed but not counted.
            </p>
          </div>
          {rows && rows.length > 0 && (
            <a href="/api/staff/feedback/export" className="btn-ghost">
              Download as a spreadsheet
            </a>
          )}
        </div>

        {rows === null ? (
          <p className={`mt-8 ${panel}`}>
            The feedback table isn’t set up in the database yet (migration 034). Responses are still emailed to the admins.
          </p>
        ) : rows.length === 0 ? (
          <p className={`mt-8 ${panel}`}>No responses yet. Share the link with members: theciscochurch.org/together/feedback</p>
        ) : (
          <>
            {/* ── Who to look at ───────────────────────────────── */}
            <section aria-labelledby="who" className={`mt-8 ${panel}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h2 id="who" className={h2}>
                  Who to look at
                </h2>
                <p className="text-[0.95rem] text-ink/70">
                  Showing <strong className="text-ink">{people.length}</strong> of {everyone.length}{" "}
                  {everyone.length === 1 ? "person" : "people"}
                  {filtered && (
                    <>
                      {" "}
                      <Link href={href(params, Object.fromEntries(DIMENSIONS.map((d) => [d.key, undefined])))} className="link-under font-semibold text-teal">
                        Show everyone
                      </Link>
                    </>
                  )}
                </p>
              </div>
              <div className="mt-5 space-y-4">
                {DIMENSIONS.map((d) => (
                  <div key={d.key}>
                    <p className="text-[0.88rem] font-bold text-ink/65">{d.label}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {[{ key: "", label: "All" }, ...d.options].map((o) => {
                        const on = (filters[d.key] ?? "") === o.key;
                        return (
                          <Link
                            key={o.key || "all"}
                            href={href(params, { [d.key]: o.key || undefined })}
                            aria-current={on ? "true" : undefined}
                            className={`${chip} ${on ? "bg-ink text-white" : "bg-cloud text-ink hover:bg-teal/10"}`}
                          >
                            {o.label}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Compare groups ───────────────────────────────── */}
            <section aria-labelledby="compare" className={`mt-8 ${panel}`}>
              <h2 id="compare" className={h2}>
                Compare groups
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-[0.9rem] text-ink/65">Compare by</span>
                {DIMENSIONS.map((d) => (
                  <Link
                    key={d.key}
                    href={href(params, { by: d.key === "age" ? undefined : d.key })}
                    aria-current={by === d.key ? "true" : undefined}
                    className={`${chip} ${by === d.key ? "bg-teal text-white" : "bg-cloud text-ink hover:bg-teal/10"}`}
                  >
                    {d.label}
                  </Link>
                ))}
              </div>
              <div className="-mx-2 mt-5 overflow-x-auto px-2">
                <table className="w-full min-w-[40rem] text-left text-[0.95rem]">
                  <thead>
                    <tr className="border-b border-ink/15 text-[0.82rem] text-ink/65">
                      <th className="py-2 pr-3 font-semibold">Group</th>
                      <th className="px-3 py-2 text-right font-semibold">People</th>
                      <th className="px-3 py-2 text-right font-semibold">Tradition (avg)</th>
                      <th className="px-3 py-2 text-right font-semibold">Welcome the changes</th>
                      <th className="px-3 py-2 text-right font-semibold">Seeing “Better”</th>
                      <th className="px-3 py-2 text-right font-semibold">Ready to try</th>
                      <th className="py-2 pl-3 text-right font-semibold">All in on values</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((g) => (
                      <tr key={g.key} className={`border-b border-ink/8 ${g.key === "all" ? "font-bold" : ""} ${g.people ? "" : "text-ink/40"}`}>
                        <td className="py-2.5 pr-3">{g.label}</td>
                        <td className="px-3 py-2.5 text-right">{g.people}</td>
                        <td className="px-3 py-2.5 text-right">{show(g.tradition, "")}</td>
                        <td className="px-3 py-2.5 text-right">{show(g.welcomeChange)}</td>
                        <td className="px-3 py-2.5 text-right">{show(g.seeingBetter)}</td>
                        <td className="px-3 py-2.5 text-right">{show(g.readyToTry)}</td>
                        <td className="py-2.5 pl-3 text-right">{show(g.valuesAllIn)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="mt-4 space-y-1 text-[0.86rem] leading-[1.5] text-ink/65">
                <li className="list-none"><strong>Welcome the changes:</strong> chose “hoping for changes like these” or “on board.”</li>
                <li className="list-none"><strong>Seeing “Better”:</strong> share of their answers about changes already made.</li>
                <li className="list-none"><strong>Ready to try:</strong> “Let’s try it” or “Open to it” on the new ideas.</li>
              </ul>
            </section>

            <section aria-label="Tradition scale" className={`mt-8 ${panel}`}>
              <Scale rows={people} />
              <ul className="mt-7 space-y-4">
                <Bar label="Feelings about the changes" counts={count(people, STANCE, (r) => r.profile.stance)} />
                <Bar label="If Sundays doubled" counts={count(people, GROWTH, (r) => r.profile.growth)} />
                <Bar label="Read “Where we’re headed”" counts={count(people, READ, (r) => r.profile.read)} />
              </ul>
            </section>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <section aria-labelledby="values" className={panel}>
                <h2 id="values" className={h2}>
                  Our values
                </h2>
                <ul className="mt-5 space-y-4">
                  {ALL_VALUES.map((v) => (
                    <Bar key={v.key} label={v.name} counts={count(people, VALUE_CHOICES, (r) => r.profile.values?.[v.key])} />
                  ))}
                </ul>
                <Legend options={VALUE_CHOICES} />
              </section>

              <div className="space-y-8">
                <section aria-labelledby="seeing" className={panel}>
                  <h2 id="seeing" className={h2}>
                    What they’re seeing
                  </h2>
                  <ul className="mt-5 space-y-4">
                    {AREAS.map((a) => (
                      <Bar key={a.key} label={a.label} counts={count(people, AREA_CHOICES, (r) => r.areas?.[a.key])} />
                    ))}
                  </ul>
                  <Legend options={AREA_CHOICES} />
                </section>

                <section aria-labelledby="try" className={panel}>
                  <h2 id="try" className={h2}>
                    Things we might try
                  </h2>
                  <ul className="mt-5 space-y-4">
                    {TRIES.map((t) => (
                      <Bar key={t.key} label={t.label} counts={count(people, TRY_CHOICES, (r) => r.tries?.[t.key])} />
                    ))}
                  </ul>
                  <Legend options={TRY_CHOICES} />
                </section>
              </div>
            </div>

            <h2 className={`${h2} mt-12`}>
              {shown.length} {shown.length === 1 ? "response" : "responses"}
              {shown.filter((r) => r.concern).length ? `, ${shown.filter((r) => r.concern).length} with a concern` : ""}
            </h2>
            <ul className="mt-5 space-y-5">
              {shown.map((r) => (
                <Response key={r.id} r={r} />
              ))}
            </ul>
          </>
        )}
      </main>
    </>
  );
}
