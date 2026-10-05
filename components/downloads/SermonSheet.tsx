import Link from "next/link";
import { SermonArtwork } from "@/components/sermons/SermonArtwork";
import { formatDate } from "@/lib/format";
import { seriesLabel } from "@/lib/series";
import { pieceMeta, type SermonDownloads } from "@/lib/downloads";

/**
 * One lesson and every handout that exists for it, drawn as a sheet of
 * paper. `featured` lays it out wide with the sermon artwork — used for the
 * newest lesson.
 */
export function SermonSheet({ entry, featured = false }: { entry: SermonDownloads; featured?: boolean }) {
  const { sermon, pieces } = entry;

  const heading = (
    <div>
      <h3
        className={`font-display leading-[1.1] font-extrabold tracking-[-0.025em] text-ink ${
          featured ? "text-[clamp(1.8rem,3vw,2.5rem)]" : "text-[1.55rem]"
        }`}
      >
        {sermon.title}
      </h3>
      {sermon.scripture_ref && (
        <p className="font-serif mt-2 text-[1.1rem] text-deepsea italic">{sermon.scripture_ref}</p>
      )}
      {(sermon.thesis ?? sermon.series?.tagline) && (
        <p className="mt-3 max-w-[46ch] text-[0.97rem] leading-[1.65] text-ink/75">
          {sermon.thesis ?? sermon.series?.tagline}
        </p>
      )}
      <Link
        href={`/sermons/${sermon.slug}`}
        className="link-under mt-4 inline-block text-[0.9rem] font-semibold text-teal"
      >
        Go to the sermon &rarr;
      </Link>
    </div>
  );

  const list = (
    <ul className="divide-y divide-ink/12 border-t border-ink/12">
      {pieces.map((piece) => {
        const meta = pieceMeta[piece.kind];
        const onSite = piece.viewUrl.startsWith("/downloads/") && !piece.viewUrl.endsWith(".pdf");
        return (
          <li key={piece.kind} className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 py-4">
            <div className="min-w-[12rem] flex-1">
              <p className="font-display text-[1.1rem] font-bold text-ink">{meta.label}</p>
              <p className="mt-0.5 text-[0.88rem] leading-snug text-ink/65">{meta.blurb}</p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={piece.viewUrl}
                {...(onSite ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                className="link-under text-[0.9rem] font-semibold text-ink/70 hover:text-ink"
              >
                View
                <span className="sr-only">
                  {" "}
                  {meta.label} for {sermon.title}
                </span>
              </a>
              <a
                href={piece.url}
                download={piece.filename}
                className="btn-coral !px-5 !py-2.5 !text-[0.88rem]"
              >
                <span aria-hidden>&darr;</span> Download
                <span className="sr-only">
                  {" "}
                  {meta.label} for {sermon.title}
                </span>
              </a>
              {piece.sizeLabel && (
                <span className="eyebrow hidden text-ink/45 sm:inline">PDF · {piece.sizeLabel}</span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );

  return (
    <article className="paper-wrap w-full">
      <div className="paper flex flex-col">
        <div className="flex items-baseline justify-between gap-3 bg-teal py-3 pr-12 pl-6 text-white">
          <p className="eyebrow">{formatDate(sermon.sermon_date)}</p>
          {sermon.series && <p className="eyebrow text-right text-white/85">{seriesLabel(sermon)}</p>}
        </div>

        {featured ? (
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-10">
            <div className="space-y-6">
              <SermonArtwork
                sermon={sermon}
                transition={false}
                className="aspect-video rounded-xl shadow-(--shadow-photo)"
              />
              {heading}
            </div>
            <div className="lg:self-center">{list}</div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-6 p-6">
            <SermonArtwork
              sermon={sermon}
              transition={false}
              className="aspect-video rounded-xl shadow-(--shadow-photo)"
            />
            {heading}
            <div className="mt-auto">{list}</div>
          </div>
        )}
      </div>
    </article>
  );
}
