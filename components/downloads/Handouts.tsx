import { formatDate } from "@/lib/format";
import { site } from "@/lib/site";
import { seriesLabel } from "@/lib/series";
import type { SermonDetail } from "@/lib/types";

/**
 * The three printable sheets, drawn on letter paper. The same markup is the
 * on-screen preview and the source of the saved PDFs, so what you see at
 * /downloads/[slug]/[piece] is exactly what prints.
 */

/** Straight apostrophes inside words become typographic ones. */
export function typo(text: string): string {
  return text.replace(/(\w)'(\w)/g, "$1’$2");
}

function SheetHeader({ label, sermon }: { label: string; sermon: SermonDetail }) {
  return (
    <header className="flex items-baseline justify-between gap-4 border-b-2 border-teal pb-2">
      <p className="eyebrow text-teal">
        {site.shortName} &middot; {label}
      </p>
      <p className="eyebrow text-ink/55">{formatDate(sermon.sermon_date)}</p>
    </header>
  );
}

export function SheetFooter() {
  return (
    <footer className="mt-6 flex flex-wrap justify-between gap-x-6 gap-y-1 border-t border-ink/15 pt-3 text-[0.7rem] text-ink/60">
      <span>
        {site.serviceLine}
        {site.address ? ` · ${site.address}` : ""}
      </span>
      <span>{site.domain}</span>
    </footer>
  );
}

/** Who presented the lesson. Joe is credited with his role; a guest speaker by name only. */
function byline(sermon: SermonDetail): string {
  const name = sermon.speaker?.name;
  if (name && name !== site.people.preacher) return name;
  return `${site.people.preacher}, Minister`;
}

function Title({ sermon }: { sermon: SermonDetail }) {
  return (
    <div className="mt-5">
      {sermon.series && (
        <p className="eyebrow mb-2 text-coral">{seriesLabel(sermon)}</p>
      )}
      <h1 className="font-display text-[2.1rem] leading-[1.05] font-extrabold tracking-[-0.03em]">
        {sermon.title}
      </h1>
      {sermon.scripture_ref && (
        <p className="font-serif mt-2 text-[1.25rem] text-deepsea italic">{sermon.scripture_ref}</p>
      )}
      <p className="mt-2 text-[0.9rem] font-semibold text-ink/70">{byline(sermon)}</p>
    </div>
  );
}

/** Skeletal outline with lined space under every point. */
export function OutlineSheet({ sermon }: { sermon: SermonDetail }) {
  return (
    <section className="handout handout-page flex flex-col">
      <SheetHeader label="Sermon handout" sermon={sermon} />
      <Title sermon={sermon} />

      <ol className="mt-5 flex min-h-0 flex-1 flex-col">
        {sermon.points.map((point) => (
          <li key={point.position} className="flex min-h-0 flex-1 flex-col border-t border-ink/20 pt-2">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-[1.4rem] leading-none font-extrabold text-teal">
                {point.position}
              </span>
              <h2 className="font-display text-[1.05rem] leading-tight font-bold">{typo(point.title)}</h2>
              {point.label && <span className="eyebrow ml-auto shrink-0 text-coral">{point.label}</span>}
            </div>
            <div className="ruled mt-1 min-h-[0.6in] flex-1" aria-hidden />
          </li>
        ))}
      </ol>

      <div className="mt-3 rounded-xl border-2 border-teal/60 px-4 pt-2 pb-3">
        <p className="eyebrow text-teal">What I&rsquo;m thinking &amp; feeling</p>
        <div className="ruled mt-1 h-[0.9in]" aria-hidden />
      </div>

      <SheetFooter />
    </section>
  );
}

/** The lesson in a page or two. */
export function RecapSheet({ sermon }: { sermon: SermonDetail }) {
  const nuggets = sermon.nuggets ?? [];

  return (
    <section className="handout">
      <SheetHeader label="Sermon recap" sermon={sermon} />
      <Title sermon={sermon} />

      {(sermon.thesis ?? sermon.series?.tagline) && (
        <p className="font-serif mt-4 text-[1.35rem] leading-snug text-ink/85 italic">
          {typo(sermon.thesis ?? sermon.series?.tagline ?? "")}
        </p>
      )}

      {sermon.scripture_text && (
        <blockquote className="font-serif mt-5 border-l-4 border-marigold bg-sand/70 px-5 py-4 text-[1.1rem] leading-relaxed italic">
          {sermon.scripture_text}
          {sermon.scripture_ref && (
            <footer className="eyebrow mt-2 text-deepsea not-italic">{sermon.scripture_ref}</footer>
          )}
        </blockquote>
      )}

      {sermon.summary && (
        <p className="mt-5 text-[0.95rem] leading-[1.65]">{sermon.summary}</p>
      )}

      <ol className="mt-6 space-y-4">
        {sermon.points.map((point) => (
          <li key={point.position} className="break-inside-avoid border-t border-ink/20 pt-3">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-[1.5rem] leading-none font-extrabold text-teal">
                {point.position}
              </span>
              <h2 className="font-display text-[1.15rem] leading-tight font-bold">{typo(point.title)}</h2>
              {point.label && <span className="eyebrow ml-auto shrink-0 text-coral">{point.label}</span>}
            </div>
            {point.body && (
              <p className="mt-1.5 pl-[1.9rem] text-[0.92rem] leading-[1.6] text-ink/85">{typo(point.body)}</p>
            )}
          </li>
        ))}
      </ol>

      {nuggets.length > 0 && (
        <div className="mt-6 break-inside-avoid rounded-xl bg-marigold px-5 py-4">
          <p className="eyebrow text-ink/75">Quotes</p>
          <ul className="mt-2 space-y-1.5">
            {nuggets.map((n) => (
              <li key={n} className="font-display text-[1.02rem] leading-snug font-extrabold">
                {typo(n)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <SheetFooter />
    </section>
  );
}

/** Bold standouts — type size follows how many there are. */
function nuggetSize(count: number): string {
  if (count <= 1) return "3.2rem";
  if (count === 2) return "2.8rem";
  if (count === 3) return "2.4rem";
  if (count === 4) return "2rem";
  return "1.7rem";
}

export function NuggetsSheet({ sermon }: { sermon: SermonDetail }) {
  const nuggets = sermon.nuggets ?? [];
  const size = nuggetSize(nuggets.length);

  return (
    <section className="handout handout-page flex flex-col">
      <SheetHeader label="Quotes" sermon={sermon} />
      <Title sermon={sermon} />

      <ul className="mt-6 flex min-h-0 flex-1 flex-col gap-4">
        {nuggets.map((nugget) => (
          <li
            key={nugget}
            className="relative flex min-h-0 flex-1 items-center overflow-hidden rounded-2xl bg-marigold px-8 py-6 shadow-[0_1px_2px_rgb(138_106_50/0.3),0_10px_20px_-10px_rgb(138_106_50/0.45)]"
          >
            <span
              aria-hidden
              className="font-serif absolute top-0 left-3 text-[6rem] leading-none text-ink/20 select-none"
            >
              &ldquo;
            </span>
            <p
              className="font-display relative leading-[1.08] font-extrabold tracking-[-0.025em] text-ink"
              style={{ fontSize: size }}
            >
              {typo(nugget)}
            </p>
          </li>
        ))}
      </ul>

      <SheetFooter />
    </section>
  );
}

/** Reflection questions with room to write. Used when there's no hand-made guide PDF. */
export function GuideSheet({ sermon }: { sermon: SermonDetail }) {
  const questions = sermon.guide_questions ?? [];

  return (
    <section className="handout">
      <SheetHeader label="Reflection guide" sermon={sermon} />
      <Title sermon={sermon} />

      {(sermon.thesis ?? sermon.series?.tagline) && (
        <p className="font-serif mt-4 text-[1.3rem] leading-snug text-ink/85 italic">
          {typo(sermon.thesis ?? sermon.series?.tagline ?? "")}
        </p>
      )}
      {sermon.scripture_text && (
        <blockquote className="font-serif mt-4 border-l-4 border-marigold bg-sand/70 px-5 py-3 text-[1.05rem] leading-relaxed italic">
          {typo(sermon.scripture_text)}
        </blockquote>
      )}
      <p className="mt-4 text-[0.9rem] leading-[1.6] text-ink/70">
        Use these on your own or with a group. Read the passages, think it through, and write down what stands out.
      </p>

      <ol className="mt-5 space-y-5">
        {questions.map((question, i) => (
          <li key={question} className="break-inside-avoid border-t border-ink/20 pt-3">
            <div className="flex gap-3">
              <span className="font-display text-[1.4rem] leading-none font-extrabold text-teal">{i + 1}</span>
              <p className="text-[0.98rem] leading-[1.55] font-medium">{typo(question)}</p>
            </div>
            <div className="ruled mt-1 ml-[1.9rem] h-[0.9in]" aria-hidden />
          </li>
        ))}
      </ol>

      <SheetFooter />
    </section>
  );
}
