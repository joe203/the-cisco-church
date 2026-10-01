import type { Metadata } from "next";
import Link from "next/link";
import { listPublished } from "@/lib/bulletin/data";
import { formatDate } from "@/lib/format";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Past bulletins",
  description: "Every weekly bulletin from the Cisco Church, newest first.",
};

export default async function BulletinArchivePage() {
  const entries = await listPublished();

  return (
    <div className="bg-cloud">
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:py-20">
        <p className="eyebrow text-teal">The archive</p>
        <h1 className="font-display mt-4 text-display font-extrabold tracking-[-0.03em] text-ink">
          Past bulletins
        </h1>
        <ul className="mt-12 divide-y rule-tint border-y rule-tint">
          {entries.map((e) => (
            <li key={e.date}>
              <Link
                href={`/bulletin/${e.date}`}
                className="group flex items-baseline justify-between gap-6 py-5 transition-transform duration-300 ease-[var(--ease-spring)] hover:translate-x-1"
              >
                <span className="font-display text-[1.35rem] font-bold tracking-[-0.01em] text-ink">
                  {formatDate(e.date)}
                </span>
                {e.message && (
                  <span className="font-serif text-[1.1rem] text-teal italic">“{e.message}”</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10">
          <Link href="/bulletin" className="btn-ghost">
            ← This week’s bulletin
          </Link>
        </p>
      </div>
    </div>
  );
}
