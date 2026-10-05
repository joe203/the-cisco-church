import Link from "next/link";
import { formatDateShort } from "@/lib/format";
import { kindMeta, type DownloadItem } from "@/lib/downloads";

/** One handout, drawn as a sheet of paper with a folded corner. */
export function PaperSheet({ item }: { item: DownloadItem }) {
  const meta = kindMeta[item.kind];

  return (
    <article className="paper-wrap">
      <div className="paper flex h-full min-h-[22rem] flex-col">
        <div className={`${meta.band} flex items-baseline justify-between gap-3 py-3 pr-12 pl-6`}>
          <p className="eyebrow">{meta.label}</p>
        </div>

        <div className="flex flex-1 flex-col px-6 pt-6 pb-6">
          <p className="eyebrow text-ink/55">{formatDateShort(item.date)}</p>
          <h3 className="font-display mt-2 text-[1.5rem] leading-[1.15] font-extrabold tracking-[-0.02em] text-ink">
            {item.title}
          </h3>
          {item.scripture_ref && (
            <p className="font-serif mt-2 text-[1.05rem] text-deepsea italic">
              {item.scripture_ref}
            </p>
          )}
          {item.blurb && (
            <p className="mt-3 text-[0.95rem] leading-[1.65] text-ink/75">{item.blurb}</p>
          )}

          <div className="mt-auto pt-7">
            {item.sermon_slug && (
              <Link
                href={`/sermons/${item.sermon_slug}`}
                className="link-under mb-4 inline-block text-[0.9rem] font-semibold text-teal"
              >
                From the sermon &rarr;
              </Link>
            )}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href={item.url}
                download={item.filename ?? ""}
                className="btn-coral !px-5 !py-3 !text-[0.9rem]"
              >
                <span aria-hidden>&darr;</span> Download
              </a>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-under text-[0.9rem] font-semibold text-ink/70 hover:text-ink"
              >
                Open
                <span className="sr-only"> {item.title} in a new tab</span>
              </a>
              <span className="eyebrow ml-auto text-ink/50">
                PDF{item.sizeLabel ? ` · ${item.sizeLabel}` : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
