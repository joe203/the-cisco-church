import Link from "next/link";
import { formatDateShort } from "@/lib/format";
import { isAnnounced } from "@/lib/series";
import type { Sermon } from "@/lib/types";

/**
 * The homepage's series run: one stop per lesson on a line (a column on
 * phones). Numbering is earned — the lessons really are a sequence. The
 * current lesson is the coral stop; announced lessons link; the rest wait,
 * drawn dashed.
 */
export function SeriesTrack({
  lessons,
  currentSlug,
  upcoming,
}: {
  lessons: Sermon[];
  currentSlug: string;
  /** The current lesson hasn't been preached yet ("This Sunday" vs its date). */
  upcoming: boolean;
}) {
  const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4", 5: "sm:grid-cols-5", 6: "sm:grid-cols-6" }[
    Math.min(Math.max(lessons.length, 2), 6)
  ];

  return (
    <ol className={`relative grid gap-4 sm:gap-0 ${cols}`}>
      {/* the line the stops sit on */}
      <span
        aria-hidden
        className="absolute top-3 bottom-3 left-[19px] w-[3px] rounded-full bg-teal/25 sm:top-[17px] sm:bottom-auto sm:left-[10%] sm:right-[10%] sm:h-[3px] sm:w-auto"
      />
      {lessons.map((lesson) => {
        const current = lesson.slug === currentSlug;
        const linked = !current && isAnnounced(lesson);
        const waiting = !current && !linked;
        const when = current && upcoming ? "This Sunday" : formatDateShort(lesson.sermon_date);

        const body = (
          <>
            <span
              className={`dot font-display row-span-2 grid place-items-center rounded-full font-extrabold transition-transform duration-300 ease-(--ease-spring) sm:mx-auto ${
                current
                  ? "size-11 bg-coral text-white shadow-[0_0_0_6px_rgb(201_65_40/0.16)] sm:-my-1"
                  : waiting
                    ? "size-10 border-[2.5px] border-dashed border-teal/50 bg-sand text-teal sm:size-9"
                    : "size-10 bg-teal text-cloud sm:size-9"
              }`}
            >
              {lesson.lesson_number}
            </span>
            <span
              className={`self-end text-[0.95rem] leading-snug font-semibold text-balance sm:mt-2.5 sm:block sm:text-[0.9rem] ${
                current ? "text-coral" : "text-ink"
              }`}
            >
              {lesson.title}
            </span>
            <span className="self-start text-[0.82rem] text-ink/65 sm:block">{when}</span>
          </>
        );
        const shape =
          "grid grid-cols-[44px_1fr] items-center gap-x-3 rounded-xl sm:block sm:px-1 sm:pb-1.5 sm:text-center";

        return (
          <li key={lesson.slug} className="relative min-w-0">
            {linked ? (
              <Link
                href={`/sermons/${lesson.slug}`}
                className={`${shape} group hover:[&_.dot]:scale-110 active:[&_.dot]:scale-95`}
              >
                {body}
              </Link>
            ) : (
              <div className={shape} aria-current={current ? "page" : undefined}>
                {body}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
