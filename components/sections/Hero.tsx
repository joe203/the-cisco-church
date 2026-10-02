import Image from "next/image";
import Link from "next/link";
import { mapLabel, site } from "@/lib/site";
import type { Sermon } from "@/lib/types";
import { HeroReel } from "./HeroReel";

/**
 * Hero v5 — "glass diagonal". One continuous section from the top edge:
 * the site header floats over it (see SiteHeader), the reel runs
 * full-bleed behind everything, and the diagonal teal field is a
 * translucent pane over the footage with a thin marigold edge. The clear
 * window right of the diagonal is where the edit's subjects should sit;
 * the rest of the frame still shows, dimmed, through the teal.
 *
 * The reel (lib/heroMedia.ts) is desktop-only; on mobile and for
 * reduced-motion visitors the pane is solid teal and the trail photo
 * slants in underneath.
 */
export function Hero({ featured }: { featured: Sermon | null }) {
  return (
    <section className="relative overflow-hidden bg-deepsea lg:flex lg:min-h-[100dvh] lg:items-center">
      {/* Footage — full-bleed on desktop */}
      <div aria-hidden className="absolute inset-0 hidden lg:block">
        <Image
          src="/images/trail-rock.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[30%_35%]"
        />
        <HeroReel />
      </div>

      {/* Keeps the white header legible where it crosses footage */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-[linear-gradient(180deg,rgb(20_51_60/0.55)_0%,transparent_100%)]"
      />

      {/* The teal pane: solid on mobile, translucent glass over the reel on desktop */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(130deg,#1a99a3_0%,var(--color-teal)_45%,var(--color-deepsea)_115%)] lg:w-[54%] lg:opacity-[0.9] lg:[clip-path:polygon(0_0,100%_0,66.67%_100%,0_100%)]"
      />
      {/* Thin marigold edge where the pane meets the footage */}
      <div
        aria-hidden
        className="absolute inset-0 hidden bg-marigold lg:block lg:[clip-path:polygon(54%_0,calc(54%_+_5px)_0,calc(36%_+_5px)_100%,36%_100%)]"
      />

      <div className="relative z-20 w-full px-5 pt-28 pb-14 sm:px-8 lg:px-12 lg:pt-32 lg:pb-20">
        <h1 className="hero-enter font-sans text-[clamp(3rem,min(8.4vw,12vh),7.4rem)] leading-[0.93] font-black tracking-[-0.025em] text-white uppercase italic [text-wrap:balance]">
          <span className="block">Something</span>
          <span className="block">new is</span>
          <span className="block">happening</span>
          <span className="block lg:ml-[14%] lg:text-transparent lg:[-webkit-text-stroke:2.5px_#fff]">
            in Cisco.
          </span>
        </h1>

        <div className="mt-9 max-w-xl lg:mt-11">
          <p
            className="hero-enter text-[1.08rem] leading-[1.65] font-medium text-white/90 lg:max-w-[40ch]"
            style={{ "--enter-delay": "0.12s" } as React.CSSProperties}
          >
            We&rsquo;re building a new worship experience that lifts &mdash;
            teaching that meets your week, and a church family that&rsquo;s
            genuinely glad you walked in.{" "}
            <strong className="font-bold text-white">Come grow with us.</strong>
          </p>

          <div
            className="hero-enter mt-8 flex flex-wrap items-center gap-x-7 gap-y-4"
            style={{ "--enter-delay": "0.22s" } as React.CSSProperties}
          >
            <a href="#visit" className="btn-coral">
              Plan your visit
            </a>
            {featured && (
              <Link
                href={`/sermons/${featured.slug}`}
                className="link-under text-[0.95rem] font-bold text-white active:opacity-75"
              >
                This week&rsquo;s sermon <span aria-hidden>&rarr;</span>
              </Link>
            )}
          </div>

          <p
            className="eyebrow hero-enter mt-10 text-marigold"
            style={{ "--enter-delay": "0.3s" } as React.CSSProperties}
          >
            {site.serviceLine} &middot;{" "}
            <a
              href={site.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-under text-white active:opacity-75"
            >
              {mapLabel()}
            </a>
          </p>
        </div>
      </div>

      {/* Mobile photo — slants in under the teal field */}
      <div className="relative aspect-[16/10] lg:hidden" aria-hidden>
        <Image
          src="/images/trail-rock.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_35%] [clip-path:polygon(0_9%,100%_0,100%_100%,0_100%)]"
        />
      </div>
    </section>
  );
}
