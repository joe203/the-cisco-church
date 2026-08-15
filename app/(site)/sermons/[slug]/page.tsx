import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeckViewer } from "@/components/sermons/DeckViewer";
import { SermonArtwork } from "@/components/sermons/SermonArtwork";
import { getDeck, getSermonDetail } from "@/lib/data";
import { formatDate } from "@/lib/format";
import type { SermonDetail } from "@/lib/types";

export const revalidate = 300;

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sermon = await getSermonDetail(slug);
  if (!sermon) return {};
  return {
    title: sermon.title,
    description: sermon.thesis ?? sermon.summary ?? undefined,
  };
}

function buildResources(sermon: SermonDetail) {
  return [
    { url: sermon.podcast_url, action: "Listen", detail: "Audio of this lesson" },
    { url: sermon.guide_url, action: "Preview", detail: "Reflection guide" },
    { url: sermon.pdf_url, action: "Download", detail: "Slides as PDF" },
    { url: sermon.youtube_url, action: "Watch", detail: "On YouTube" },
  ].filter((r): r is { url: string; action: string; detail: string } => Boolean(r.url));
}

export default async function SermonPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const sermon = await getSermonDetail(slug);
  if (!sermon) notFound();

  const deck = sermon.deck_slug ? await getDeck(sermon.deck_slug) : null;
  const resources = buildResources(sermon);
  const speaker = sermon.speaker;

  return (
    <article>
      {/* 1 — Slides (or artwork when no deck exists yet) */}
      {deck && deck.slides.length > 0 ? (
        <DeckViewer slides={deck.slides} deckSlug={deck.slug} />
      ) : (
        <section className="bg-cloud">
          <div className="mx-auto max-w-5xl px-5 pt-10 pb-2 sm:px-8">
            <SermonArtwork sermon={sermon} className="aspect-video rounded-2xl" />
          </div>
        </section>
      )}

      {/* 2 — Title band */}
      <header className="bg-cloud text-ink">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:py-20">
          <p className="eyebrow text-teal">
            A sermon
            {sermon.scripture_ref && <> on {sermon.scripture_ref}</>} &middot;{" "}
            {formatDate(sermon.sermon_date)}
          </p>
          <h1 className="font-display mt-5 text-display font-extrabold tracking-[-0.02em] text-ink">
            {sermon.title}
          </h1>
          {sermon.thesis && (
            <p className="font-serif mt-6 text-[1.5rem] italic text-deepsea sm:text-[1.75rem]">
              {sermon.thesis}
            </p>
          )}
        </div>
      </header>

      {/* 3 — Key scripture */}
      {sermon.scripture_text && (
        <section className="bg-deepsea text-white">
          <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:py-24">
            <blockquote className="font-serif text-passage italic">
              {sermon.scripture_text}
            </blockquote>
            {sermon.scripture_ref && (
              <p className="eyebrow mt-7 text-marigold">{sermon.scripture_ref}</p>
            )}
          </div>
        </section>
      )}

      {/* 4 — The points (a sermon actually has an order — numbering earned) */}
      {sermon.points.length > 0 && (
        <section className="bg-sand text-ink">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
            <p className="eyebrow reveal text-teal">The movements of this lesson</p>
            <ol className="mt-10 grid gap-6 md:grid-cols-2">
              {sermon.points.map((point) => (
                <li
                  key={point.position}
                  className="reveal rounded-2xl bg-white p-7 shadow-(--shadow-panel-light) sm:p-9"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-display text-[2.6rem] leading-none font-bold text-teal">
                      {point.position}
                    </span>
                    {point.label && <span className="eyebrow text-coral">{point.label}</span>}
                  </div>
                  <h2 className="mt-5 text-[1.3rem] font-semibold text-ink">
                    {point.title}
                  </h2>
                  {point.body && (
                    <p className="mt-3 text-[0.98rem] leading-[1.7] text-ink/75">
                      {point.body}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* 5 — About this lesson */}
      {sermon.summary && (
        <section className="bg-sand text-ink">
          <div className="mx-auto max-w-4xl border-t border-ink/10 px-5 py-14 sm:px-8 lg:py-16">
            <p className="eyebrow reveal text-teal">About this lesson</p>
            <p className="reveal mt-6 text-[1.08rem] leading-[1.8]">{sermon.summary}</p>
          </div>
        </section>
      )}

      {/* 6 — Resources (dead buttons are never rendered) */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <p className="eyebrow reveal text-marigold">Take it with you</p>
          {resources.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {resources.map((r) => (
                <a
                  key={r.action}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-lift flex min-h-[8.5rem] flex-col justify-between rounded-xl border border-white/25 p-6"
                >
                  <p className="font-display text-[1.5rem] font-bold">{r.action}</p>
                  <p className="eyebrow mt-6 text-white/60">{r.detail}</p>
                </a>
              ))}
            </div>
          ) : (
            <p className="reveal mt-6 max-w-[50ch] text-[1rem] text-white/65">
              The guide, audio, and video for this lesson are being prepared —
              check back after Sunday.
            </p>
          )}
        </div>
      </section>

      {/* 7 — Meet the speaker (photo column appears only when a photo exists) */}
      {speaker && (
        <section className="bg-cloud text-ink">
          <div
            className={`mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:py-20 ${
              speaker.photo_url ? "grid gap-10 md:grid-cols-[minmax(10rem,14rem)_1fr]" : ""
            }`}
          >
            {speaker.photo_url && (
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand">
                {/* eslint-disable-next-line @next/next/no-img-element -- photo host unknown until real assets arrive */}
                <img
                  src={speaker.photo_url}
                  alt={speaker.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            )}
            <div>
              <p className="eyebrow reveal text-teal">Meet the speaker</p>
              <h2 className="font-display mt-4 text-[2.5rem] font-extrabold tracking-[-0.02em] text-ink">
                {speaker.name}
              </h2>
              {speaker.tags.length > 0 && (
                <p className="eyebrow mt-3 text-coral">{speaker.tags.join(" · ")}</p>
              )}
              {speaker.bio && (
                <p className="mt-5 max-w-[58ch] text-[1rem] leading-[1.75]">{speaker.bio}</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 8 — Back */}
      <div className="border-t rule-tint bg-cloud">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          <Link href="/sermons" className="btn-ghost">
            <span aria-hidden>&larr;</span> All sermons
          </Link>
        </div>
      </div>
    </article>
  );
}
