import Link from "next/link";
import { formatDateShort } from "@/lib/format";
import { isAnnounced } from "@/lib/series";
import type { Sermon, SeriesRef } from "@/lib/types";

/**
 * A series at a glance: every lesson in order, the current one lifted off the
 * page. Lessons that haven't been announced yet show their title and date but
 * don't link anywhere. Numbering is earned — the lessons really are a sequence.
 */
export function SeriesStrip({
  series,
  lessons,
  currentSlug,
}: {
  series: SeriesRef;
  lessons: Sermon[];
  currentSlug: string;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="eyebrow text-teal">The series</p>
        <p className="font-serif text-[1.05rem] text-deepsea italic">
          {series.title}
          {series.scripture_ref && <span className="text-ink/72"> &middot; {series.scripture_ref}</span>}
        </p>
      </div>

      <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {lessons.map((lesson) => {
          const current = lesson.slug === currentSlug;
          const linked = !current && isAnnounced(lesson);
          const body = (
            <>
              <span className={`eyebrow ${current ? "text-coral" : "text-teal"}`}>
                Lesson {lesson.lesson_number}
                {current && <> &middot; You&rsquo;re here</>}
              </span>
              <span className="font-display mt-2 block text-[1.15rem] leading-tight font-bold text-ink">
                {lesson.title}
              </span>
              <span className="mt-1.5 block text-[0.85rem] text-ink/72">{formatDateShort(lesson.sermon_date)}</span>
            </>
          );
          const base = "block rounded-xl p-4 transition-transform duration-300 ease-(--ease-spring)";
          const tone = current
            ? "bg-white shadow-(--shadow-card) border-t-4 border-coral"
            : "border rule-tint";

          return (
            <li key={lesson.slug}>
              {linked ? (
                <Link href={`/sermons/${lesson.slug}`} className={`${base} ${tone} hover:-translate-y-0.5 active:translate-y-0`}>
                  {body}
                </Link>
              ) : (
                <div className={`${base} ${tone}`} aria-current={current ? "page" : undefined}>
                  {body}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
