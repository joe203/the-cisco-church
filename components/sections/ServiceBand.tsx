import { mapLabel, site } from "@/lib/site";

export function ServiceBand() {
  return (
    <section id="visit" className="scroll-mt-8 bg-deepsea text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1.2fr_1fr] lg:grid-cols-[1.2fr_1fr_auto] lg:items-center">
        <div>
          <p className="eyebrow text-marigold">When we meet</p>
          <ul className="mt-4 max-w-[26rem] space-y-2.5">
            {site.services.map((s) => (
              <li
                key={s.label}
                className="flex items-baseline justify-between gap-6 border-b border-white/15 pb-2.5 text-[1rem]"
              >
                <span className="text-white/75">{s.label}</span>
                <span className="font-semibold">{s.time}</span>
              </li>
            ))}
          </ul>
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
