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
        className="card-lift grid h-full overflow-hidden rounded-2xl bg-white shadow-(--shadow-card) @2xl:grid-cols-[1.5fr_1fr]"
      >
        <SermonArtwork
          sermon={sermon}
          className="aspect-video @2xl:aspect-auto @2xl:h-full @2xl:min-h-[15rem]"
        />
        <div className="flex flex-col justify-between gap-6 p-6 @2xl:p-8">
          <div>
            <p className="eyebrow text-ink/55">
              {formatDate(sermon.sermon_date)}
              {sermon.scripture_ref && (
                <>
                  {" "}
                  &middot; <span className="text-teal">{sermon.scripture_ref}</span>
                </>
              )}
            </p>
            <h3
              className={`font-display mt-3 font-bold text-ink ${
                featured ? "text-[1.45rem] leading-snug @2xl:text-[1.85rem]" : "text-[1.2rem] leading-snug"
              }`}
            >
              {sermon.title}
            </h3>
            {sermon.thesis && (
              <p className="mt-2.5 text-[0.95rem] italic text-ink/65">{sermon.thesis}</p>
            )}
          </div>
          <p className="eyebrow text-coral">
            Read the lesson <span aria-hidden>&rarr;</span>
          </p>
        </div>
      </Link>
    </div>
  );
}
