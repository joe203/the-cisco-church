import Link from "next/link";
import { mapLabel, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-[1.6rem] font-extrabold tracking-[-0.01em]">
            The Cisco Church of Christ
          </p>
          <p className="mt-3 max-w-[36ch] text-[0.95rem] leading-relaxed text-white/70">
            Good things are happening here. Come worship, connect, and
            experience what God is doing. You&rsquo;re welcome here — this
            Sunday, any Sunday.
          </p>
        </div>

        <div>
          <p className="eyebrow text-marigold">Visit</p>
          <ul className="mt-4 space-y-2 text-[0.95rem]">
            {site.services.map((s) => (
              <li key={s.label} className="flex justify-between gap-4 border-b border-white/12 pb-2">
                <span className="text-white/70">{s.label}</span>
                <span>{s.time}</span>
              </li>
            ))}
            <li className="pt-1">
              <a
                href={site.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-under text-marigold"
              >
                {mapLabel()} — map
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-marigold">Sermons</p>
          <ul className="mt-4 space-y-2 text-[0.95rem]">
            <li>
              <Link href="/sermons" className="link-under">
                All sermons
              </Link>
            </li>
            <li>
              <Link href="/#sermons" className="link-under">
                Recent lessons
              </Link>
            </li>
          </ul>
          {(site.phone || site.email) && (
            <div className="mt-8">
              <p className="eyebrow text-marigold">Contact</p>
              <ul className="mt-4 space-y-2 text-[0.95rem]">
                {site.phone && (
                  <li>
                    <a href={`tel:${site.phone}`} className="link-under">
                      {site.phone}
                    </a>
                  </li>
                )}
                {site.email && (
                  <li>
                    <a href={`mailto:${site.email}`} className="link-under">
                      {site.email}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-white/12">
        <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-2 px-5 py-5 sm:px-8">
          <p className="text-[0.8rem] text-white/55">
            © {new Date().getFullYear()} {site.shortName}
          </p>
          <p className="text-[0.8rem] text-white/55">{site.domain}</p>
        </div>
      </div>
    </footer>
  );
}
