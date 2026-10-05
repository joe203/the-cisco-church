import Link from "next/link";
import { SermonArtwork } from "@/components/sermons/SermonArtwork";
import type { SermonSpotlight as Spotlight } from "@/lib/data";
import { pieceMeta, type Piece } from "@/lib/downloads";
import { formatDate } from "@/lib/format";

/** "This Sunday" only when the lesson really is within the next week. */
function eyebrowFor({ sermon, upcoming }: Spotlight): string {
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
 * visitor's first two questions are "when?" and "what's the lesson?".
 */
export function SermonSpotlight({
  spotlight,
  pieces,
}: {
  spotlight: Spotlight;
  pieces: Piece[];
}) {
  const { sermon } = spotlight;
  const speaker = sermon.speaker;

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
            <p className="eyebrow text-teal">{eyebrowFor(spotlight)}</p>
            <h2 className="font-display mt-4 text-display font-extrabold tracking-[-0.03em] text-ink">
              {sermon.title}
            </h2>
            {sermon.scripture_ref && (
              <p className="font-serif mt-3 text-[1.35rem] text-deepsea italic">{sermon.scripture_ref}</p>
            )}
            {sermon.thesis && (
              <p className="mt-4 max-w-[40ch] text-[1.1rem] leading-[1.6] text-ink/80">{sermon.thesis}</p>
            )}
            {sermon.teaser && (
              <div className="mt-4 max-w-[48ch] space-y-3 text-[1rem] leading-[1.7] text-ink/75">
                {sermon.teaser.split("\n\n").map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
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

      </div>
    </section>
  );
}
