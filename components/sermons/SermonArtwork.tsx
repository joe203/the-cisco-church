import { site } from "@/lib/site";
import type { Sermon } from "@/lib/types";

/** Split "Matthew 25:14–30" into ["Matthew", "25:14–30"]. */
function splitRef(ref: string | null): [string, string | null] {
  if (!ref) return ["Scripture", null];
  const i = ref.lastIndexOf(" ");
  if (i === -1) return [ref, null];
  return [ref.slice(0, i), ref.slice(i + 1)];
}

type SermonArtworkProps = {
  sermon: Pick<Sermon, "slug" | "title" | "scripture_ref" | "artwork_url" | "sermon_date">;
  className?: string;
  /** Wire the shared-element view transition (card → sermon page hero). */
  transition?: boolean;
};

/**
 * Sermon artwork with a typographic fallback: when no artwork has been
 * uploaded, the cover is set in type — the passage as the image.
 */
export function SermonArtwork({ sermon, className = "", transition = true }: SermonArtworkProps) {
  const [book, verses] = splitRef(sermon.scripture_ref);
  const style = transition
    ? ({ viewTransitionName: `sermon-art-${sermon.slug}` } as React.CSSProperties)
    : undefined;

  if (sermon.artwork_url) {
    return (
      <div className={`relative overflow-hidden bg-deepsea ${className}`} style={style}>
        {/* eslint-disable-next-line @next/next/no-img-element -- remote artwork host unknown until real assets arrive */}
        <img
          src={sermon.artwork_url}
          alt={`Artwork for “${sermon.title}”`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-[linear-gradient(135deg,var(--color-teal),var(--color-deepsea))] ${className}`}
      style={style}
      aria-hidden
    >
      <div className="absolute inset-3 flex flex-col justify-between rounded-lg border border-white/30 p-5 @sm:p-6">
        <p className="eyebrow text-[0.6rem] text-white/65">{site.shortName}</p>
        <div>
          <p className="font-display text-[clamp(1.7rem,11cqw,2.9rem)] leading-[1.05] font-bold text-white">
            {book}
          </p>
          {verses && <p className="eyebrow mt-2.5 text-marigold">{verses}</p>}
        </div>
        <p className="eyebrow text-[0.6rem] text-white/65">
          {new Date(sermon.sermon_date).getFullYear()}
        </p>
      </div>
    </div>
  );
}
