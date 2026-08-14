import type { Metadata } from "next";
import { SermonCard } from "@/components/sermons/SermonCard";
import { getSermonList } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Sermons",
  description:
    "Every lesson preached at the Cisco Church of Christ — slides, guides, and recordings.",
};

export default async function SermonsPage() {
  const sermons = await getSermonList();

  const byYear = new Map<number, typeof sermons>();
  for (const sermon of sermons) {
    const year = Number(sermon.sermon_date.slice(0, 4));
    byYear.set(year, [...(byYear.get(year) ?? []), sermon]);
  }
  const years = [...byYear.keys()].sort((a, b) => b - a);

  return (
    <div className="bg-espresso">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <p className="eyebrow text-lamplight">The archive</p>
        <h1 className="font-display mt-4 text-display tracking-[-0.02em] text-cream">
          Sermons
        </h1>
        <p className="mt-5 max-w-[52ch] text-[1.02rem] text-ash">
          Every lesson preached here, newest first — with the slides, guide,
          and recording wherever they exist. Missed a Sunday? Catch up here.
        </p>

        {years.map((year) => (
          <section key={year} className="mt-14">
            <div className="flex items-baseline gap-5">
              <h2 className="font-display text-[1.9rem] text-lamplight">{year}</h2>
              <div className="h-px flex-1 rule-gold border-t" aria-hidden />
            </div>
            <div className="mt-7 grid gap-6 md:grid-cols-2">
              {byYear.get(year)!.map((sermon) => (
                <div key={sermon.id} className="reveal">
                  <SermonCard sermon={sermon} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
