import Link from "next/link";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="bg-cloud">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-5 sm:px-8">
        <Link
          href="/"
          className="font-display text-[1.15rem] leading-tight font-extrabold tracking-[-0.01em] text-ink transition-opacity duration-300 hover:opacity-75 sm:text-[1.3rem]"
        >
          {site.shortName}
        </Link>
        <nav className="flex items-center gap-6 sm:gap-9" aria-label="Main">
          <Link href="/sermons" className="eyebrow link-under text-teal hover:text-deepsea">
            Sermons
          </Link>
          <Link href="/#visit" className="eyebrow link-under text-teal hover:text-deepsea">
            Visit
          </Link>
        </nav>
      </div>
    </header>
  );
}
