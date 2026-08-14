import Link from "next/link";
import { mapLabel, site } from "@/lib/site";
import type { Sermon } from "@/lib/types";
import { PhotoSlot } from "./PhotoSlot";

export function Hero({ featured }: { featured: Sermon | null }) {
  return (
    <section className="overflow-hidden bg-pitch">
      <div className="px-5 sm:px-8 lg:pr-0 lg:pl-[max(2rem,calc((100vw-72rem)/2+2rem))]">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,42%)]">
          {/* Type stacked hard left */}
          <div className="relative z-10 pt-14 pb-14 lg:pt-24 lg:pb-28 lg:-mr-14">
            <p className="eyebrow hero-enter text-lamplight">
              A Church of Christ &middot; Cisco, Texas
            </p>
            <h1
              className="font-display hero-enter mt-6 text-hero tracking-[-0.02em] text-cream"
              style={{ "--enter-delay": "0.08s" } as React.CSSProperties}
            >
              Good morning,
              <br />
              <em>Cisco.</em>
            </h1>
            <p
              className="hero-enter mt-8 max-w-[52ch] text-[1.05rem] leading-[1.7] text-ash"
              style={{ "--enter-delay": "0.16s" } as React.CSSProperties}
            >
              We&rsquo;re a small congregation of neighbors — teachers, farmers,
              retirees, kids — who meet on Sundays to sing, pray, and share the
              Lord&rsquo;s Supper, the way churches in this corner of Texas have
              for generations. If you&rsquo;re new to town, or it&rsquo;s been a
              while since you&rsquo;ve been inside a church building,{" "}
              <strong className="font-semibold text-cream">
                there&rsquo;s a seat here for you.
              </strong>
            </p>
            <div
              className="hero-enter mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
              style={{ "--enter-delay": "0.24s" } as React.CSSProperties}
            >
              <a href="#visit" className="btn-gold">
                Plan your Sunday visit
              </a>
              {featured && (
                <Link href={`/sermons/${featured.slug}`} className="btn-ghost">
                  This week&rsquo;s sermon <span aria-hidden>&rarr;</span>
                </Link>
              )}
            </div>
            <p
              className="eyebrow hero-enter mt-10 text-ash"
              style={{ "--enter-delay": "0.3s" } as React.CSSProperties}
            >
              {site.serviceLine} &middot;{" "}
              <a
                href={site.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-gold text-lamplight"
              >
                {mapLabel()}
              </a>
            </p>
          </div>

          {/* Congregation photo bleeding off the right edge */}
          <div
            className="hero-enter pb-14 lg:pb-0"
            style={{ "--enter-delay": "0.2s" } as React.CSSProperties}
          >
            <PhotoSlot
              file="fellowship-ladies.jpg"
              alt="Two longtime members laughing together at a church fellowship meal"
              caption="A wide, warm photo of the congregation goes here — shot 1 in PHOTO_GUIDE.md."
              className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[480px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
