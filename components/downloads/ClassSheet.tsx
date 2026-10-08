import { ViewModal } from "@/components/downloads/ViewModal";
import type { ClassDownload } from "@/lib/classes";

/** A class discussion guide on /downloads, in the same paper-card form as a lesson. */
export function ClassSheet({ entry }: { entry: ClassDownload }) {
  const { guide } = entry;

  return (
    <article className="paper-wrap w-full">
      <div className="paper flex flex-col">
        <div className="flex items-baseline justify-between gap-3 bg-teal py-3 pr-12 pl-6 text-white">
          <p className="eyebrow">Wednesday night class</p>
          <p className="eyebrow text-right text-white/85">{guide.series}</p>
        </div>

        <div className="grid gap-6 p-5 sm:p-6 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-10">
          <h3 className="font-display text-[1.35rem] leading-[1.15] font-extrabold tracking-[-0.025em] text-ink">
            {guide.title}
          </h3>
          <ul className="divide-y divide-ink/12 border-t border-ink/12 md:self-center">
            <li className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 py-4">
              <div className="min-w-[12rem] flex-1">
                <p className="font-display text-[1.1rem] font-bold text-ink">Discussion guide</p>
                <p className="mt-0.5 text-[0.88rem] leading-snug text-ink/72">
                  Questions to work through alone or with the class.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <ViewModal
                  label="Discussion guide"
                  sermonTitle={guide.series}
                  src={`/embed/class/${guide.slug}`}
                  openUrl={entry.viewUrl}
                  downloadUrl={entry.url}
                  filename={entry.filename}
                />
                <a href={entry.url} download={entry.filename} className="btn-coral !px-5 !py-2.5 !text-[0.88rem]">
                  <span aria-hidden>&darr;</span> Download
                  <span className="sr-only"> discussion guide for {guide.series}</span>
                </a>
                {entry.sizeLabel && (
                  <span className="eyebrow hidden text-ink/72 sm:inline">PDF · {entry.sizeLabel}</span>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
}
