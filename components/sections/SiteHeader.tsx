import Link from "next/link";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="bg-pitch">
      <div className="mx-auto flex max-w-6xl items-baseline justify-between gap-6 px-5 py-6 sm:px-8">
        <Link
          href="/"
          className="font-display text-[1.15rem] leading-tight text-cream transition-opacity duration-300 hover:opacity-80 sm:text-[1.3rem]"
        >
          {site.name}
        </Link>
        <nav className="flex items-baseline gap-6 sm:gap-9" aria-label="Main">
          <Link href="/sermons" className="eyebrow link-gold text-ash hover:text-cream">
            Sermons
          </Link>
          <Link href="/#visit" className="eyebrow link-gold text-ash hover:text-cream">
            Visit
          </Link>
        </nav>
      </div>
    </header>
  );
}
