import Link from "next/link";
import { mapLabel, site } from "@/lib/site";
import type { Sermon } from "@/lib/types";

/**
 * Hero v2 — energy-forward: a diagonal gold field with oversized italic
 * caps, the last line rendered in outline as it crosses onto the dark
 * field. Photo slot intentionally omitted for now; the dark right field
 * is where a worship photo lands later.
 */
export function Hero({ featured }: { featured: Sermon | null }) {
  return (
    <section className="relative overflow-hidden bg-pitch">
      {/* Diagonal gold field */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(130deg,#dbb87c_0%,var(--color-lamplight)_45%,var(--color-burnish)_115%)] [clip-path:polygon(0_0,100%_0,100%_88%,0_100%)] lg:w-[64%] lg:[clip-path:polygon(0_0,100%_0,72%_100%,0_100%)]"
      />

      <div className="relative mx-auto max-w-6xl px-5 pt-14 pb-16 sm:px-8 lg:pt-20 lg:pb-24">
        <h1 className="hero-enter font-sans text-[clamp(3rem,9.5vw,7.25rem)] leading-[0.95] font-black tracking-[-0.02em] uppercase italic">
          <span className="block text-pitch">Something</span>
          <span className="block text-pitch">new is</span>
          <span className="block text-pitch">happening</span>
          <span className="block text-pitch lg:ml-[22%] lg:text-transparent lg:[-webkit-text-stroke:2.5px_var(--color-cream)]">
            in Cisco.
          </span>
        </h1>

        <div className="mt-10 max-w-xl lg:mt-12">
          <p
            className="hero-enter text-[1.08rem] leading-[1.65] font-medium text-pitch/85 lg:max-w-[44ch]"
            style={{ "--enter-delay": "0.12s" } as React.CSSProperties}
          >
            Worship that lifts, teaching that meets your week, and a church
            family that&rsquo;s genuinely glad you walked in.{" "}
            <strong className="font-bold text-pitch">Come see for yourself.</strong>
          </p>

          <div
            className="hero-enter mt-8 flex flex-wrap items-center gap-x-7 gap-y-4"
            style={{ "--enter-delay": "0.22s" } as React.CSSProperties}
          >
            <a
              href="#visit"
              className="inline-flex items-center gap-2.5 bg-pitch px-7 py-3.5 text-[0.95rem] font-bold text-cream transition-transform duration-300 ease-(--ease-spring) hover:-translate-y-0.5 active:translate-y-0"
            >
              Plan your visit
            </a>
            {featured && (
              <Link
                href={`/sermons/${featured.slug}`}
                className="link-gold text-[0.95rem] font-bold text-pitch"
              >
                This week&rsquo;s sermon <span aria-hidden>&rarr;</span>
              </Link>
            )}
          </div>

          <p
            className="eyebrow hero-enter mt-10 text-pitch/70"
            style={{ "--enter-delay": "0.3s" } as React.CSSProperties}
          >
            {site.serviceLine} &middot;{" "}
            <a
              href={site.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-gold text-pitch"
            >
              {mapLabel()}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
