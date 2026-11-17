import Link from "next/link";
import { SermonArtwork } from "@/components/sermons/SermonArtwork";
import { SeriesTrack } from "@/components/sermons/SeriesTrack";
import type { SermonSpotlight as Spotlight } from "@/lib/data";
import { pieceMeta, type Piece } from "@/lib/downloads";
import { formatDate, formatDateShort } from "@/lib/format";
import { site } from "@/lib/site";
import type { Sermon } from "@/lib/types";

/** "This Sunday" only when the lesson really is within the next week. */
function whenLabel({ sermon, upcoming }: Spotlight): string {
  if (!upcoming) return `The latest lesson, ${formatDateShort(sermon.sermon_date)}`;
  const [y, m, d] = sermon.sermon_date.split("-").map(Number);
  const days = Math.round((new Date(y, m - 1, d).getTime() - Date.now()) / 86_400_000);
  return days <= 7
    ? `This Sunday, ${formatDateShort(sermon.sermon_date)}`
    : `Coming up ${formatDate(sermon.sermon_date)}`;
}

const worship = site.services.find((s) => s.day === "Sunday" && s.label.toLowerCase().includes("worship"));
const street = site.address?.split(",")[0] ?? null;

/**
 * The homepage's one sermon. It leads with the question the lesson answers
 * (`hook`, falling back to the title) so a visitor scanning the page meets
 * the idea first; the title slide is a small snapshot beside it. Below, a
 * deep-teal card carries the title, who's preaching, the actions, and the key
 * verse; when the lesson belongs to a series, the whole run follows as a track.
 */
export function SermonSpotlight({
  spotlight,
  pieces,
  lessons,
}: {
  spotlight: Spotlight;
  pieces: Piece[];
  /** Every lesson in this sermon's series (empty for a standalone sermon). */
  lessons: Sermon[];
}) {
  const { sermon, upcoming } = spotlight;
  const speaker = sermon.speaker;
  const series = sermon.series;
  const headline = sermon.hook ?? sermon.title;
  // The italic line under the headline: the teaser when it's short (older
  // lessons have long ones), else the thesis.
  const teaser = sermon.teaser?.split("\n\n")[0] ?? null;
  const line = (teaser && teaser.length <= 180 ? teaser : null) ?? sermon.thesis ?? series?.tagline ?? null;
  const href = `/sermons/${sermon.slug}`;

  return (
    <section id="sermons" aria-labelledby="spotlight-headline" className="scroll-mt-8 overflow-hidden bg-sand">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <p className="flex flex-wrap items-center gap-x-3.5 gap-y-2 font-bold text-teal">
          <span className="rounded-full bg-ink px-3.5 py-1 text-[0.9rem] text-cloud">{whenLabel(spotlight)}</span>
          {upcoming && worship && (
            <span>
              {worship.time}
              {street && <> at {street}</>}
            </span>
          )}
        </p>

        <div className="mt-6 grid items-center gap-9 lg:grid-cols-[1fr_360px] lg:gap-12">
          <div className="reveal min-w-0">
            <h2
              id="spotlight-headline"
              className="font-display max-w-[13ch] text-[clamp(2.4rem,6.4vw,5.2rem)] leading-[0.98] font-extrabold tracking-[-0.035em] text-balance text-ink"
            >
              {headline}
            </h2>
            {line && (
              <p className="font-serif mt-5 max-w-[30ch] text-[clamp(1.25rem,2.2vw,1.65rem)] leading-[1.45] text-pretty text-deepsea italic">
                {line}
              </p>
            )}
          </div>

          <Link
            href={href}
            aria-label={`Open the lesson: ${sermon.title}`}
            className="reveal group block w-[calc(100%-14px)] max-w-[380px] rotate-[1.2deg] rounded-md bg-white p-2.5 pb-3 shadow-(--shadow-card-lift) transition-transform duration-[450ms] ease-(--ease-spring) hover:-translate-y-1 hover:rotate-0 active:translate-y-0 lg:w-full lg:rotate-[2.2deg] lg:justify-self-end"
          >
            <SermonArtwork sermon={sermon} className="aspect-video rounded-sm" sizes="380px" />
            <span className="mt-2.5 block px-1 text-[0.8rem] leading-none text-ink/60">
              {upcoming ? "On the screen Sunday" : "The title slide"}
            </span>
          </Link>
        </div>

        <div className="reveal mt-10 grid items-center gap-7 rounded-[22px] bg-deepsea p-[clamp(26px,4vw,48px)] text-cloud shadow-(--shadow-card-lift) lg:mt-14 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
          <div className="min-w-0">
            {series && (
              <p className="text-[0.95rem] font-semibold text-marigold">
                {series.title}
                {sermon.lesson_number && (
                  <>
                    , lesson {sermon.lesson_number}
                    {lessons.length > 1 && <> of {lessons.length}</>}
                  </>
                )}
              </p>
            )}
            {/* Without a hook the headline above already is the title. */}
            {sermon.hook && (
              <h3 className="font-display mt-2 text-[clamp(2rem,4vw,3.1rem)] leading-[1.02] font-extrabold tracking-[-0.03em] text-balance">
                {sermon.title}
              </h3>
            )}
            {speaker && (
              <p className="mt-2.5 text-cloud/78">
                Preaching: <span className="font-semibold text-cloud">{speaker.name}</span>
                {speaker.tags[0] && <>, {speaker.tags[0].toLowerCase()}</>}
              </p>
            )}
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href={href} className="btn-coral">
                {upcoming ? "Read about this lesson" : "Read the lesson"}
              </Link>
              {sermon.youtube_url && (
                <a
                  href={sermon.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b-2 border-marigold/60 py-2 font-bold text-cloud transition-transform duration-300 ease-(--ease-spring) hover:-translate-y-px focus-visible:outline-marigold active:opacity-75"
                >
                  Watch it
                </a>
              )}
              <Link
                href="/sermons"
                className="border-b-2 border-marigold/60 py-2 font-bold text-cloud transition-transform duration-300 ease-(--ease-spring) hover:-translate-y-px focus-visible:outline-marigold active:opacity-75"
              >
                All sermons
              </Link>
            </div>
          </div>

          {sermon.scripture_text && (
            <blockquote className="min-w-0 border-t border-cloud/18 pt-6 lg:border-t-0 lg:border-l lg:py-1.5 lg:pt-1.5 lg:pl-10">
              <p className="font-serif text-[clamp(1.35rem,2.4vw,1.8rem)] leading-[1.4] text-balance text-cream italic">
                {sermon.scripture_text}
              </p>
              {sermon.scripture_ref && (
                <cite className="mt-3 block text-[0.95rem] font-bold text-marigold not-italic">
                  {sermon.scripture_ref}
                </cite>
              )}
            </blockquote>
          )}
        </div>

        {series && lessons.length > 1 && (
          <div className="reveal mt-12 lg:mt-14">
            <h3 className="font-display mb-5 text-[1.1rem] font-semibold text-ink">The whole series</h3>
            <SeriesTrack lessons={lessons} currentSlug={sermon.slug} upcoming={upcoming} />
          </div>
        )}

        {pieces.length > 0 && (
          <p className="mt-8 text-[0.92rem] text-ink/72">
            Ready to print: {pieces.map((p) => pieceMeta[p.kind].label).join(", ")}.{" "}
            <Link href="/downloads" className="link-under font-semibold text-teal">
              Get them
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
