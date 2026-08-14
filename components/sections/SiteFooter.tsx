import Link from "next/link";
import { mapLabel, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t rule-gold bg-pitch">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-[1.6rem] text-cream">{site.name}</p>
          <p className="mt-3 max-w-[36ch] text-[0.95rem] leading-relaxed text-ash">
            A congregation of the churches of Christ, meeting in {site.town}.
            You are welcome here — this Sunday, any Sunday.
          </p>
        </div>

        <div>
          <p className="eyebrow text-lamplight">Visit</p>
          <ul className="mt-4 space-y-2 text-[0.95rem] text-cream">
            {site.services.map((s) => (
              <li key={s.label} className="flex justify-between gap-4 border-b border-cream/10 pb-2">
                <span className="text-ash">{s.label}</span>
                <span>{s.time}</span>
              </li>
            ))}
            <li className="pt-1">
              <a
                href={site.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-gold text-lamplight"
              >
                {mapLabel()} — map
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-lamplight">Sermons</p>
          <ul className="mt-4 space-y-2 text-[0.95rem]">
            <li>
              <Link href="/sermons" className="link-gold text-cream">
                All sermons
              </Link>
            </li>
            <li>
              <Link href="/#sermons" className="link-gold text-cream">
                Recent lessons
              </Link>
            </li>
          </ul>
          {(site.phone || site.email) && (
            <div className="mt-8">
              <p className="eyebrow text-lamplight">Contact</p>
              <ul className="mt-4 space-y-2 text-[0.95rem] text-cream">
                {site.phone && (
                  <li>
                    <a href={`tel:${site.phone}`} className="link-gold">
                      {site.phone}
                    </a>
                  </li>
                )}
                {site.email && (
                  <li>
                    <a href={`mailto:${site.email}`} className="link-gold">
                      {site.email}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-2 px-5 py-5 sm:px-8">
          <p className="text-[0.8rem] text-ash">
            © {new Date().getFullYear()} {site.name}
          </p>
          <p className="text-[0.8rem] text-ash">{site.domain}</p>
        </div>
      </div>
    </footer>
  );
}
