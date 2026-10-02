"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

/**
 * On the homepage the header floats over the hero (transparent, white
 * type, full-bleed gutters) so the hero reads as one section from the top
 * edge down. Every other page keeps the light Cloud bar.
 */
export function SiteHeader() {
  const overlay = usePathname() === "/";

  const linkTone = overlay
    ? "text-white/90 hover:text-white"
    : "text-teal hover:text-deepsea";

  return (
    <header
      className={
        overlay
          ? "absolute inset-x-0 top-0 z-30 print:hidden"
          : "bg-cloud print:hidden"
      }
    >
      <div
        className={
          overlay
            ? "flex items-center justify-between gap-6 px-5 py-5 sm:px-8 lg:px-12 lg:py-7"
            : "mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-5 sm:px-8"
        }
      >
        <Link
          href="/"
          className={`font-display text-[1.15rem] leading-tight font-extrabold tracking-[-0.01em] transition-opacity duration-300 hover:opacity-75 active:opacity-60 sm:text-[1.3rem] ${overlay ? "text-white" : "text-ink"}`}
        >
          {site.shortName}
        </Link>
        <nav className="flex items-center gap-6 sm:gap-9" aria-label="Main">
          <Link href="/sermons" className={`eyebrow link-under ${linkTone}`}>
            Sermons
          </Link>
          <Link href="/bulletin" className={`eyebrow link-under ${linkTone}`}>
            Bulletin
          </Link>
          <Link href="/#visit" className={`eyebrow link-under ${linkTone}`}>
            Visit
          </Link>
        </nav>
      </div>
    </header>
  );
}
