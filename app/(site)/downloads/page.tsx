import type { Metadata } from "next";
import { ClassSheet } from "@/components/downloads/ClassSheet";
import { SermonSheet } from "@/components/downloads/SermonSheet";
import { getClassDownloads } from "@/lib/classes";
import { getSermonDownloads } from "@/lib/downloads";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Downloads",
  description:
    "Reflection guides, sermon recaps, sermon handouts, and quotes from each lesson at the Cisco Church — to print, mark up, and keep.",
};

export default async function DownloadsPage() {
  const [entries, classes] = await Promise.all([getSermonDownloads(), getClassDownloads()]);
  const [latest, ...earlier] = entries;

  return (
    <>
      <div className="bg-cloud">
        <div className="mx-auto max-w-6xl px-5 pt-16 pb-12 sm:px-8 lg:pt-20 lg:pb-14">
          <p className="eyebrow text-teal">Take it home</p>
          <h1 className="font-display mt-4 text-display font-extrabold tracking-[-0.03em] text-ink">
            Downloads
          </h1>
          <p className="mt-5 max-w-[54ch] text-[1.02rem] leading-[1.7] text-ink/70">
            Each lesson&rsquo;s guide, recap, sermon handout, and quotes &mdash;
            made to print, write on, and hand to a friend. Looking for a
            recording? Those live with the sermon.
          </p>
        </div>
      </div>

      <div className="bg-sand">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-20">
          {!latest ? (
            <p className="max-w-[48ch] text-[1.05rem] text-ink/70">
              Nothing is posted yet. Handouts appear here by Friday of each
              lesson week.
            </p>
          ) : (
            <>
              <p className="eyebrow mb-6 text-teal">The latest lesson</p>
              <SermonSheet entry={latest} featured />

              {earlier.length > 0 && (
                <section className="mt-16 lg:mt-24">
                  <div className="flex items-baseline gap-5">
                    <h2 className="font-display text-[1.9rem] font-extrabold tracking-[-0.02em] text-ink">
                      Earlier lessons
                    </h2>
                    <div className="h-px flex-1 border-t rule-tint" aria-hidden />
                  </div>
                  <div className="mt-8 space-y-6">
                    {earlier.map((entry) => (
                      <div key={entry.sermon.id} className="reveal">
                        <SermonSheet entry={entry} />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {classes.length > 0 && (
            <section className={latest ? "mt-16 lg:mt-24" : ""}>
              <div className="flex items-baseline gap-5">
                <h2 className="font-display text-[1.9rem] font-extrabold tracking-[-0.02em] text-ink">
                  Wednesday night class
                </h2>
                <div className="h-px flex-1 border-t rule-tint" aria-hidden />
              </div>
              <div className="mt-8 space-y-6">
                {classes.map((entry) => (
                  <div key={entry.guide.slug} className="reveal">
                    <ClassSheet entry={entry} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
