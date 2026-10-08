import { SheetFooter, typo } from "@/components/downloads/Handouts";
import type { ClassGuide } from "@/lib/classes";
import { site } from "@/lib/site";

/** A Wednesday-night class discussion guide, drawn on letter paper like the sermon sheets. */
export function ClassGuideSheet({ guide }: { guide: ClassGuide }) {
  let n = 0;

  return (
    <section className="handout">
      <header className="flex items-baseline justify-between gap-4 border-b-2 border-teal pb-2">
        <p className="eyebrow text-teal">
          {site.shortName} &middot; Discussion guide
        </p>
        <p className="eyebrow text-ink/72">Wednesday night class</p>
      </header>

      <div className="mt-5">
        <p className="eyebrow mb-2 text-coral">{guide.series}</p>
        <h1 className="font-display text-[2.1rem] leading-[1.05] font-extrabold tracking-[-0.03em]">
          {typo(guide.title)}
        </h1>
        <p className="mt-2 text-[0.9rem] font-semibold text-ink/70">{site.people.preacher}, Minister</p>
      </div>

      <p className="mt-4 text-[0.9rem] leading-[1.6] text-ink/70">{guide.intro}</p>

      {guide.groups.map((group) => (
        <div key={group.heading} className="mt-7">
          <h2 className="font-serif break-after-avoid text-[1.45rem] leading-tight text-deepsea italic">
            {group.heading}
          </h2>
          <ol className="mt-2 space-y-4">
            {group.questions.map((question) => {
              n += 1;
              return (
                <li key={question} className="break-inside-avoid border-t border-ink/20 pt-3">
                  <div className="flex gap-3">
                    <span className="font-display w-[1.4rem] shrink-0 text-[1.4rem] leading-none font-extrabold text-teal">
                      {n}
                    </span>
                    <p className="text-[0.98rem] leading-[1.55] font-medium">{typo(question)}</p>
                  </div>
                  <div className="ruled mt-1 ml-[2.15rem] h-[0.6in]" aria-hidden />
                </li>
              );
            })}
          </ol>
        </div>
      ))}

      <div className="mt-8 break-inside-avoid rounded-2xl bg-deepsea px-7 py-6 text-white shadow-[0_1px_2px_rgb(11_84_93/0.3),0_12px_24px_-12px_rgb(11_84_93/0.5)]">
        <p className="eyebrow text-marigold">One question to sit with</p>
        <p className="font-serif mt-3 text-[1.4rem] leading-snug italic">{typo(guide.closing)}</p>
      </div>

      <SheetFooter />
    </section>
  );
}
