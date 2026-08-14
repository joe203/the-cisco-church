import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Sermon } from "@/lib/types";
import { SermonArtwork } from "./SermonArtwork";

type SermonCardProps = {
  sermon: Sermon;
  /** Marks the visually dominant card in an asymmetric grid. */
  featured?: boolean;
};

/**
 * A sermon card responsive to its slot, not the viewport (@container):
 * in a wide slot it lays out horizontally, in a narrow one it stacks.
 */
export function SermonCard({ sermon, featured = false }: SermonCardProps) {
  return (
    <div className="@container h-full">
      <Link
        href={`/sermons/${sermon.slug}`}
        className="card-lift grid h-full overflow-hidden bg-[color-mix(in_oklch,var(--color-espresso),white_4%)] shadow-(--shadow-card) @2xl:grid-cols-[1.1fr_1fr]"
      >
        <SermonArtwork
          sermon={sermon}
          className="aspect-[4/3] @2xl:aspect-auto @2xl:h-full @2xl:min-h-[15rem]"
        />
        <div className="flex flex-col justify-between gap-6 p-6 @2xl:p-8">
          <div>
            <p className="eyebrow text-ash">
              {formatDate(sermon.sermon_date)}
              {sermon.scripture_ref && (
                <>
                  {" "}
                  &middot; <span className="text-lamplight">{sermon.scripture_ref}</span>
                </>
              )}
            </p>
            <h3
              className={`mt-3 font-semibold text-cream ${
                featured ? "text-[1.45rem] leading-snug @2xl:text-[1.85rem]" : "text-[1.2rem] leading-snug"
              }`}
            >
              {sermon.title}
            </h3>
            {sermon.thesis && (
              <p className="mt-2.5 text-[0.95rem] italic text-ash">{sermon.thesis}</p>
            )}
          </div>
          <p className="eyebrow text-lamplight">
            Read the lesson <span aria-hidden>&rarr;</span>
          </p>
        </div>
      </Link>
    </div>
  );
}
