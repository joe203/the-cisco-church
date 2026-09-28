import Image from "next/image";
import Link from "next/link";
import { mapLabel, site } from "@/lib/site";
import type { Sermon } from "@/lib/types";
import { PhotoSlot } from "./PhotoSlot";

/**
 * Hero v3 — sunlit and energy-forward: a diagonal teal field with
 * oversized white italic caps over a real photo of our kids out on the
 * trail. The last line renders in outline as it crosses onto the photo.
 * A floating snapshot of Joe preaching sits over the seam between the
 * teal field and the photo — the congregation stays the lead image, the
 * preaching shot is the accent that says "this is real, come see it."
 */
export function Hero({ featured }: { featured: Sermon | null }) {
  return (
    <section className="relative overflow-hidden bg-deepsea">
      {/* Photo field — right side on desktop */}
      <div aria-hidden className="absolute inset-y-0 right-0 hidden w-[58%] lg:block">
        <Image
          src="/images/trail-rock.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover object-[30%_35%]"
        />
        {/* Soft scrim so outlined type stays readable where it crosses the photo */}
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgb(11_84_93/0.5)_0%,transparent_45%,rgb(11_84_93/0.25)_100%)]" />
      </div>

      {/* Snapshot inset — Joe preaching, floating over the photo */}
      <div className="absolute right-10 bottom-12 z-10 hidden w-[12rem] -rotate-3 lg:block xl:right-16 xl:w-[13.5rem]">
        <PhotoSlot
          file="preaching-podium.jpg"
          alt="Joe preaching from the pulpit at The Cisco Church"
          caption="A photo of Joe preaching goes here."
          className="snapshot aspect-[4/5] ring-4 ring-cloud/90"
        />
      </div>

      {/* Diagonal teal field */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(130deg,#1a99a3_0%,var(--color-teal)_45%,var(--color-deepsea)_115%)] lg:w-[64%] lg:[clip-path:polygon(0_0,100%_0,72%_100%,0_100%)]"
      />

      <div className="relative z-20 mx-auto max-w-6xl px-5 pt-14 pb-14 sm:px-8 lg:pt-20 lg:pb-24">
        <h1 className="hero-enter font-sans text-[clamp(3rem,9.5vw,7.25rem)] leading-[0.95] font-black tracking-[-0.02em] text-white uppercase italic">
          <span className="block">Something</span>
          <span className="block">new is</span>
          <span className="block">happening</span>
          <span className="block lg:ml-[22%] lg:text-transparent lg:[-webkit-text-stroke:2.5px_#fff]">
            in Cisco.
          </span>
        </h1>

        <div className="mt-10 max-w-xl lg:mt-12">
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
                className="link-under text-[0.95rem] font-bold text-white"
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
              className="link-under text-white"
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
        {/* Snapshot inset — Joe preaching */}
        <div className="absolute bottom-4 left-4 w-24 rotate-[-4deg] sm:w-28">
          <PhotoSlot
            file="preaching-podium.jpg"
            alt="Joe preaching from the pulpit at The Cisco Church"
            caption="A photo of Joe preaching goes here."
            className="snapshot aspect-[4/5] ring-2 ring-cloud/90"
          />
        </div>
      </div>
    </section>
  );
}
