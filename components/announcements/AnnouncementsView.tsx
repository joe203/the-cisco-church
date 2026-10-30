import Image from "next/image";
import Link from "next/link";
import {
  slideSrc,
  weekSlides,
  type AnnouncementWeek,
} from "@/lib/announcements";
import { formatDate } from "@/lib/format";

function sundayLong(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function AnnouncementsView({
  week,
  isCurrent,
  earlierWeeks = [],
}: {
  week: AnnouncementWeek;
  isCurrent: boolean;
  earlierWeeks?: AnnouncementWeek[];
}) {
  const slides = weekSlides(week, isCurrent);

  return (
    <div className="bg-cloud">
      <div className="mx-auto max-w-6xl px-5 pt-14 pb-20 sm:px-8 lg:pt-20">
        <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-teal">
              {isCurrent ? "From the screen on Sunday" : "An earlier week"}
            </p>
            <h1 className="font-display mt-4 text-display font-extrabold tracking-[-0.03em] text-ink">
              Announcements
            </h1>
            <p className="mt-4 max-w-xl text-[1.1rem] text-ink/75">
              {isCurrent ? (
                <>
                  Take your time. Tap a topic to jump to it.{" "}
                  <span className="whitespace-nowrap">For {sundayLong(week.date)}.</span>
                </>
              ) : (
                <>
                  From <span className="whitespace-nowrap">{sundayLong(week.date)}</span>. Dates
                  may have passed.{" "}
                  <Link href="/announcements" className="font-bold text-teal link-under">
                    See this week’s announcements
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
          {isCurrent && (
            <aside className="rounded-2xl border-l-4 border-coral bg-sand px-6 py-5 shadow-[var(--shadow-card)] lg:col-span-5">
              <p className="font-display text-[1.6rem] leading-tight font-extrabold tracking-[-0.02em] text-ink">
                We’re glad you’re here.
              </p>
              <p className="mt-2 text-[1.05rem] text-ink/85">
                Your presence is a blessing to us. We hope you feel at home as we worship God
                together.
              </p>
              <p className="eyebrow mt-3 text-teal">Worship · Fellowship · Growing in Christ</p>
            </aside>
          )}
        </div>

        <nav
          aria-label="Announcements"
          className="sticky top-0 z-20 -mx-5 mt-8 border-y rule-tint bg-cloud/95 px-5 backdrop-blur sm:-mx-8 sm:px-8 print:hidden"
        >
          <ul className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
            {slides.map((s) => (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  className="inline-flex min-h-11 items-center rounded-full bg-sand px-4 text-[0.95rem] font-bold text-ink transition-[transform,opacity] duration-300 ease-[var(--ease-spring)] hover:-translate-y-0.5 hover:opacity-85 active:translate-y-0 active:opacity-70"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="mt-12 space-y-16 lg:space-y-24">
          {slides.map((s, i) => (
            <li
              key={s.id}
              id={s.id}
              className="grid scroll-mt-24 items-center gap-6 lg:grid-cols-12 lg:gap-12"
            >
              <a
                href={slideSrc(week, s)}
                target="_blank"
                rel="noopener"
                aria-label={`Open “${s.title}” full size`}
                className={`block overflow-hidden rounded-2xl shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-spring)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-lift)] active:translate-y-0 lg:col-span-7 ${i % 2 ? "lg:order-2" : ""}`}
              >
                <Image
                  src={slideSrc(week, s)}
                  alt={s.alt}
                  width={1920}
                  height={1080}
                  sizes="(min-width: 1152px) 640px, 100vw"
                  priority={i === 0}
                  unoptimized
                  className="h-auto w-full"
                />
              </a>
              <div className={`lg:col-span-5 ${i % 2 ? "lg:order-1" : ""}`}>
                <h2 className="font-display text-[1.75rem] leading-tight font-extrabold tracking-[-0.02em] text-ink sm:text-[2rem]">
                  {s.title}
                </h2>
                <ul className="mt-4 space-y-2 text-[1.1rem] text-ink/85">
                  {s.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <p className="mt-5 print:hidden">
                  <a href={slideSrc(week, s)} target="_blank" rel="noopener" className="btn-ghost">
                    View the slide larger →
                  </a>
                </p>
              </div>
            </li>
          ))}
        </ul>

        {isCurrent && earlierWeeks.length > 0 && (
          <section className="mt-20 border-t rule-tint pt-8 print:hidden" aria-labelledby="earlier">
            <h2 id="earlier" className="eyebrow text-coral">
              Earlier weeks
            </h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {earlierWeeks.map((w) => (
                <li key={w.date}>
                  <Link
                    href={`/announcements/${w.date}`}
                    className="inline-flex min-h-11 items-center rounded-full bg-sand px-5 text-[1rem] font-bold text-ink transition-[transform,opacity] duration-300 ease-[var(--ease-spring)] hover:-translate-y-0.5 hover:opacity-85 active:translate-y-0 active:opacity-70"
                  >
                    {formatDate(w.date).replace(/, \d{4}$/, "")}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {!isCurrent && (
          <p className="mt-16 print:hidden">
            <Link href="/announcements" className="btn-ghost">
              ← This week’s announcements
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
