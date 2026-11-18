import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeriesLessons, getSermonDetail } from "@/lib/data";
import { formatDate, formatDateShort } from "@/lib/format";
import { isAnnounced, seriesLabel } from "@/lib/series";
import { embedUrl, hostedVideoId, watchLink } from "@/lib/video";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const sermon = await getSermonDetail(slug);
  if (!sermon || !hostedVideoId(sermon.youtube_url)) return {};
  const title = `Watch: ${sermon.title}`;
  const description = sermon.thesis ?? sermon.summary ?? undefined;
  return {
    title,
    description,
    openGraph: {
      type: "video.other",
      siteName: "The Cisco Church",
      title,
      description,
      url: `/sermons/${sermon.slug}/watch`,
      ...(sermon.artwork_url ? { images: [{ url: sermon.artwork_url, alt: `Artwork for “${sermon.title}”` }] } : {}),
    },
    ...(sermon.artwork_url ? { twitter: { card: "summary_large_image" as const, images: [sermon.artwork_url] } } : {}),
  };
}

/**
 * A lesson's video, played right here. The player sits on a dark "screen"
 * band so the picture is the brightest thing on the page; below it, the
 * lesson's points to follow along with, then the rest of the series.
 */
export default async function WatchPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const sermon = await getSermonDetail(slug);
  const videoId = hostedVideoId(sermon?.youtube_url);
  if (!sermon || !videoId || !isAnnounced(sermon)) notFound();

  const lessons = sermon.series ? await getSeriesLessons(sermon.series.slug) : [];
  const series = seriesLabel(sermon, lessons.length || undefined);
  const lessonHref = `/sermons/${sermon.slug}`;

  return (
    <article>
      {/* The screen */}
      <section className="bg-ink text-cloud">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-12 sm:px-8 sm:pt-8 lg:pb-16">
          <Link
            href={lessonHref}
            className="inline-flex items-center gap-2 py-2 text-[0.95rem] font-semibold text-cloud/75 transition-opacity duration-300 ease-(--ease-spring) hover:text-cloud focus-visible:outline-marigold active:opacity-70"
          >
            <span aria-hidden>&larr;</span> The lesson page
          </Link>

          <div className="mt-3 overflow-hidden rounded-2xl bg-black shadow-[0_2px_6px_rgb(0_0_0/0.3),0_30px_70px_-24px_rgb(14_118_128/0.45)]">
            <div className="relative aspect-video">
              <iframe
                src={embedUrl(videoId)}
                title={`Video: ${sermon.title}`}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 size-full border-0"
              />
            </div>
          </div>

          <div className="mt-9 grid gap-8 lg:mt-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="eyebrow text-marigold">
                {series ?? "A sermon"} &middot; {formatDate(sermon.sermon_date)}
              </p>
              <h1 className="font-display mt-4 text-[clamp(2.1rem,5vw,3.6rem)] leading-[1.02] font-extrabold tracking-[-0.03em] text-balance">
                {sermon.title}
              </h1>
              {sermon.thesis && (
                <p className="font-serif mt-4 text-[1.35rem] text-cloud/80 italic sm:text-[1.5rem]">{sermon.thesis}</p>
              )}
              {sermon.speaker && (
                <p className="mt-5 text-[0.98rem] text-cloud/65">Preached by {sermon.speaker.name}</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href={lessonHref} className="btn-coral">
                Read the lesson
              </Link>
              <Link
                href="/downloads"
                className="border-b-2 border-marigold/60 py-2 font-bold text-cloud transition-transform duration-300 ease-(--ease-spring) hover:-translate-y-px focus-visible:outline-marigold active:opacity-75"
              >
                Handouts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Follow along — the points really are in order, so they're numbered */}
      {sermon.points.length > 0 && (
        <section className="bg-cloud text-ink">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-20">
            <h2 className="font-display text-[1.6rem] font-extrabold tracking-[-0.02em]">Follow along</h2>
            <ol className="mt-7 grid gap-x-12 md:grid-cols-2">
              {sermon.points.map((point) => (
                <li key={point.position} className="flex gap-5 border-t rule-tint py-5">
                  <span className="font-display w-7 shrink-0 text-[1.6rem] leading-none font-bold text-teal">
                    {point.position}
                  </span>
                  <div>
                    <p className="text-[1.1rem] leading-snug font-semibold">{point.title}</p>
                    {point.label && <p className="mt-1 text-[0.92rem] text-ink/65">{point.label}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* The rest of the series: watch here when there's a video, otherwise read */}
      {sermon.series && lessons.length > 1 && (
        <section className="bg-sand text-ink">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-16">
            <h2 className="font-display text-[1.6rem] font-extrabold tracking-[-0.02em]">
              More from {sermon.series.title}
            </h2>
            <ol className="mt-7 divide-y divide-ink/10 rounded-2xl bg-white shadow-(--shadow-card)">
              {lessons.map((lesson) => {
                const current = lesson.slug === sermon.slug;
                const watch = watchLink(lesson);
                const announced = isAnnounced(lesson);
                return (
                  <li
                    key={lesson.slug}
                    aria-current={current ? "page" : undefined}
                    className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-4 sm:px-7"
                  >
                    <span className="font-display w-6 text-[1.25rem] font-bold text-teal">{lesson.lesson_number}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[1.12rem] leading-tight font-bold">{lesson.title}</p>
                      <p className="mt-0.5 text-[0.88rem] text-ink/65">{formatDateShort(lesson.sermon_date)}</p>
                    </div>
                    {current ? (
                      <span className="text-[0.92rem] font-semibold text-coral">Playing now</span>
                    ) : watch ? (
                      <Link
                        href={watch.href}
                        {...(watch.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="link-under font-semibold text-teal"
                      >
                        Watch
                      </Link>
                    ) : announced ? (
                      <Link href={`/sermons/${lesson.slug}`} className="link-under font-semibold text-teal">
                        Read
                      </Link>
                    ) : (
                      <span className="text-[0.92rem] text-ink/55">Coming up</span>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      )}
    </article>
  );
}
