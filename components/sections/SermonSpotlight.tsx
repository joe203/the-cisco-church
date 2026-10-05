import Link from "next/link";
import { SermonArtwork } from "@/components/sermons/SermonArtwork";
import { SeriesStrip } from "@/components/sermons/SeriesStrip";
import type { SermonSpotlight as Spotlight } from "@/lib/data";
import { pieceMeta, type Piece } from "@/lib/downloads";
import { formatDate } from "@/lib/format";
import { seriesLabel } from "@/lib/series";
import type { Sermon } from "@/lib/types";

/** "This Sunday" only when the lesson really is within the next week. */
function whenLabel({ sermon, upcoming }: Spotlight): string {
  if (!upcoming) return `The latest lesson · ${formatDate(sermon.sermon_date)}`;
  const [y, m, d] = sermon.sermon_date.split("-").map(Number);
  const days = Math.round((new Date(y, m - 1, d).getTime() - Date.now()) / 86_400_000);
  return days <= 7
    ? `This Sunday · ${formatDate(sermon.sermon_date)}`
    : `Coming up · ${formatDate(sermon.sermon_date)}`;
}

/**
 * The homepage's one sermon: who's preaching and what the lesson is about,
 * with the artwork leading. Sits straight under the service times because a
 * visitor's first two questions are "when?" and "what's the lesson?". When the
 * lesson belongs to a series, the series and its whole run show beneath it.
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
  const { sermon } = spotlight;
  const speaker = sermon.speaker;
  const series = sermon.series;
  const tagline = sermon.thesis ?? series?.tagline ?? null;
  const teaser = sermon.teaser?.split("\n\n") ?? [];

  return (
    <section id="sermons" className="scroll-mt-8 bg-sand">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <Link
            href={`/sermons/${sermon.slug}`}
            className="reveal card-lift group block rounded-2xl"
            aria-label={`Open the lesson: ${sermon.title}`}
          >
            <SermonArtwork
              sermon={sermon}
              className="aspect-video rounded-2xl shadow-(--shadow-photo)"
            />
          </Link>

          <div className="reveal">
            <p className="eyebrow text-teal">{whenLabel(spotlight)}</p>
            {series && (
              <p className="eyebrow mt-2 text-coral">{seriesLabel(sermon, lessons.length || undefined)}</p>
            )}
            <h2 className="font-display mt-4 text-display font-extrabold tracking-[-0.03em] text-ink">
              {sermon.title}
            </h2>
            {sermon.scripture_ref && (
              <p className="font-serif mt-3 text-[1.35rem] text-deepsea italic">{sermon.scripture_ref}</p>
            )}
            {tagline && (
              <p className="mt-4 max-w-[40ch] text-[1.1rem] leading-[1.6] text-ink/80">{tagline}</p>
            )}
            {teaser.length > 0 && (
              <div className="mt-4 max-w-[48ch] space-y-3 text-[1rem] leading-[1.7] text-ink/75">
                {teaser.map((paragraph, i) => (
                  <p
                    key={paragraph}
                    className={i === teaser.length - 1 && teaser.length > 1 ? "font-semibold text-ink" : undefined}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
            {speaker && (
              <p className="mt-5 text-[0.95rem] text-ink/70">
                Preaching: <span className="font-semibold text-ink">{speaker.name}</span>
                {speaker.tags[0] && <>, {speaker.tags[0].toLowerCase()}</>}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
              <Link href={`/sermons/${sermon.slug}`} className="btn-coral">
                Read the lesson <span aria-hidden>&rarr;</span>
              </Link>
              {sermon.youtube_url && (
                <a
                  href={sermon.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  Watch it
                </a>
              )}
              <Link href="/sermons" className="btn-ghost">
                All sermons <span aria-hidden>&rarr;</span>
              </Link>
            </div>

            {pieces.length > 0 && (
              <p className="mt-7 border-t rule-tint pt-5 text-[0.92rem] text-ink/70">
                <span className="eyebrow mr-2 text-teal">To print</span>
                {pieces.map((p) => pieceMeta[p.kind].label).join(" · ")}{" "}
                <Link href="/downloads" className="link-under font-semibold text-teal">
                  Get them &rarr;
                </Link>
              </p>
            )}
          </div>
        </div>

        {series && lessons.length > 1 && (
          <div className="reveal mt-14 border-t rule-tint pt-8 lg:mt-20">
            <SeriesStrip series={series} lessons={lessons} currentSlug={sermon.slug} />
          </div>
        )}
      </div>
    </section>
  );
}
