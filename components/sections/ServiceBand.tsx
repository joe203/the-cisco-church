import Link from "next/link";
import { mapLabel, site } from "@/lib/site";

export function ServiceBand() {
  return (
    <section id="visit" className="scroll-mt-8 bg-deepsea text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1.2fr_1fr] lg:grid-cols-[1.2fr_1fr_auto] lg:items-center">
        <div>
          <p className="eyebrow text-marigold">When we meet</p>
          <ul className="mt-4 max-w-[34rem] divide-y divide-white/15 border-y border-white/15">
            {site.services.map((s) => (
              <li
                key={s.label}
                className="grid grid-cols-[6.25rem_1fr] items-baseline gap-x-5 py-4"
              >
                <p className="text-[1.05rem] font-bold text-marigold">
                  {s.day}
                  <span className="block text-[0.95rem] font-semibold text-white">{s.time}</span>
                </p>
                <div>
                  <p className="font-display text-[1.35rem] leading-tight font-bold tracking-[-0.01em]">
                    {s.label}
                  </p>
                  <p className="mt-1 text-[0.98rem] leading-snug text-white/75">{s.note}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/events"
            className="link-under mt-5 inline-block text-[0.95rem] font-bold text-marigold"
          >
            What’s happening this week →
          </Link>
        </div>

        <div>
          <p className="eyebrow text-marigold">Where to find us</p>
          <p className="mt-4 text-[1.05rem] leading-relaxed">{mapLabel()}</p>
          <p className="mt-1 max-w-[34ch] text-[0.9rem] text-white/70">
            Look for the church sign — and if you get turned around, the map
            knows the way.
          </p>
        </div>

        <div>
          <a
            href={site.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-coral"
          >
            Get directions
          </a>
        </div>
      </div>
    </section>
  );
}
