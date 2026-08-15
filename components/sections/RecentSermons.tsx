import Link from "next/link";
import { SermonCard } from "@/components/sermons/SermonCard";
import { getRecentSermons } from "@/lib/data";

export async function RecentSermons() {
  const sermons = await getRecentSermons(3);
  if (sermons.length === 0) return null;
  const [first, ...rest] = sermons;

  return (
    <section id="sermons" className="scroll-mt-8 bg-sand">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="reveal flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
          <div>
            <p className="eyebrow text-teal">From the pulpit</p>
            <h2 className="font-display mt-4 text-display font-extrabold tracking-[-0.02em] text-ink">
              Recent lessons
            </h2>
          </div>
          <Link href="/sermons" className="btn-ghost">
            All sermons <span aria-hidden>&rarr;</span>
          </Link>
        </div>

        {/* Asymmetric grid: this week's lesson dominates, the rest support. */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="reveal lg:col-span-2">
            <SermonCard sermon={first} featured />
          </div>
          {rest.map((sermon) => (
            <div key={sermon.id} className="reveal">
              <SermonCard sermon={sermon} />
            </div>
          ))}
          {rest.length === 2 && (
            <Link
              href="/sermons"
              className="card-lift reveal hidden min-h-[9rem] items-end justify-between gap-8 rounded-2xl bg-[linear-gradient(135deg,var(--color-teal),var(--color-deepsea))] p-7 text-white shadow-(--shadow-card) lg:col-span-2 lg:flex"
            >
              <div>
                <p className="eyebrow text-white/70">The archive</p>
                <p className="font-display mt-3 text-[1.8rem] leading-snug font-bold">
                  Every lesson, kept.
                </p>
              </div>
              <p className="eyebrow pb-1 text-marigold">
                Browse all sermons <span aria-hidden>&rarr;</span>
              </p>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
