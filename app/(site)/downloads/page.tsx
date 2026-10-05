import type { Metadata } from "next";
import { PaperSheet } from "@/components/downloads/PaperSheet";
import { getDownloads, kindMeta, kindOrder } from "@/lib/downloads";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Downloads",
  description:
    "Reflection guides, sermon notes, verses, and handouts from the Cisco Church — to print, mark up, and keep.",
};

export default async function DownloadsPage() {
  const items = await getDownloads();

  const shelves = kindOrder.map((kind) => ({
    kind,
    meta: kindMeta[kind],
    items: items.filter((d) => d.kind === kind),
  }));

  return (
    <>
      <div className="bg-cloud">
        <div className="mx-auto max-w-6xl px-5 pt-16 pb-12 sm:px-8 lg:pt-20 lg:pb-14">
          <p className="eyebrow text-teal">Take it home</p>
          <h1 className="font-display mt-4 text-display font-extrabold tracking-[-0.03em] text-ink">
            Downloads
          </h1>
          <p className="mt-5 max-w-[52ch] text-[1.02rem] leading-[1.7] text-ink/70">
            Guides, notes, and handouts from our lessons — made to print, write
            on, and hand to a friend. Looking for a recording? Those live with
            each sermon.
          </p>

          <nav aria-label="Kinds of download" className="mt-10">
            <ul className="flex flex-wrap gap-3">
              {shelves.map(({ kind, meta, items: list }) => (
                <li key={kind}>
                  {list.length > 0 ? (
                    <a
                      href={`#${kind}`}
                      className="group flex items-center gap-3 rounded-full border rule-tint bg-white py-2 pr-2 pl-5 text-[0.95rem] font-semibold text-ink shadow-(--shadow-card) transition-transform duration-300 ease-(--ease-spring) hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {meta.plural}
                      <span className="font-display grid h-7 min-w-7 place-items-center rounded-full bg-teal px-2 text-[0.85rem] font-bold text-white">
                        {list.length}
                      </span>
                    </a>
                  ) : (
                    <span className="flex items-center gap-3 rounded-full border border-dashed border-ink/20 py-2 pr-5 pl-5 text-[0.95rem] text-ink/45">
                      {meta.plural}
                      <span className="eyebrow">Soon</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="bg-sand">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-20">
          {items.length === 0 ? (
            <p className="max-w-[48ch] text-[1.05rem] text-ink/70">
              Nothing is posted yet. Guides and notes appear here after each
              Sunday&rsquo;s lesson.
            </p>
          ) : (
            <div className="space-y-16 lg:space-y-24">
              {shelves
                .filter((s) => s.items.length > 0)
                .map(({ kind, meta, items: list }) => (
                  <section
                    key={kind}
                    id={kind}
                    className="scroll-mt-8 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-12"
                  >
                    <div className="self-start lg:sticky lg:top-8">
                      <h2 className="font-display text-[1.9rem] leading-tight font-extrabold tracking-[-0.02em] text-ink">
                        {meta.plural}
                      </h2>
                      <p className="mt-3 max-w-[34ch] text-[0.95rem] leading-[1.65] text-ink/70">
                        {meta.blurb}
                      </p>
                    </div>
                    <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:mt-0">
                      {list.map((item) => (
                        <div key={item.id} className="reveal">
                          <PaperSheet item={item} />
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
