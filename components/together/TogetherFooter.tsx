import { mapLabel, site } from "@/lib/site";

/**
 * TODO(Joe): the names below are proposals. Sunday evening is gone from the
 * schedule; Wednesday keeps its time while the format is redesigned.
 */
const schedule = [
  {
    day: "Sunday",
    time: "9:30 AM",
    name: "Coffee and conversation",
    note: "Bible study over a cup, and time to just be together.",
    status: "Already happening. We’re still fine-tuning it.",
  },
  {
    day: "Sunday",
    time: "10:30 AM",
    name: "Praise and worship",
    note: "The heart of our week.",
    status: "Already happening. We’re still shaping what it looks like.",
  },
  {
    day: "Wednesday",
    time: "5:30 PM",
    name: "Wednesday night",
    note: "Being redesigned. Watch for what’s next.",
    status: "Same time, new format on the way.",
  },
];

export function TogetherFooter() {
  return (
    <footer className="bg-ink text-white print:hidden">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[4fr_8fr] lg:gap-16">
          <div>
            <p className="inline-block rounded-full bg-marigold px-3.5 py-1 text-[0.85rem] font-bold text-ink">
              New, starting in November
            </p>
            <h2 className="font-display mt-4 text-[clamp(1.9rem,2.6vw+0.8rem,2.7rem)] leading-[1.05] font-extrabold tracking-[-0.03em]">
              Our new weekly schedule
            </h2>
            <p className="mt-4 max-w-[34ch] text-[1.05rem] leading-[1.65] text-white/80">
              Fewer gatherings, each one worth showing up for. Some of this is already happening. All of it is still being shaped, and you’re helping.
            </p>
          </div>

          <ul className="divide-y divide-white/15 border-y border-white/15">
            {schedule.map((s) => (
              <li
                key={s.name}
                className="grid grid-cols-[6.5rem_1fr] items-baseline gap-x-5 gap-y-1 py-5 sm:grid-cols-[9rem_1fr_auto]"
              >
                <p className="text-[1.05rem] font-bold text-marigold">
                  {s.day}
                  <span className="block text-[0.95rem] font-semibold text-white">{s.time}</span>
                </p>
                <div>
                  <p className="font-display text-[1.35rem] leading-tight font-bold tracking-[-0.01em]">
                    {s.name}
                  </p>
                  <p className="mt-1 text-[1rem] text-white/75">{s.note}</p>
                  <p className="mt-2 inline-block rounded-full bg-white/12 px-3 py-1 text-[0.85rem] font-semibold text-marigold">
                    {s.status}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 text-[0.95rem]">
          <a
            href={site.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-under text-marigold"
          >
            {mapLabel()} — map
          </a>
          <p className="flex flex-wrap gap-x-6 gap-y-1">
            {site.phone && (
              <a href={`tel:${site.phone.replace(/\D/g, "")}`} className="link-under">
                {site.phone}
              </a>
            )}
            {site.email && (
              <a href={`mailto:${site.email}`} className="link-under">
                {site.email}
              </a>
            )}
          </p>
        </div>
      </div>
      <div className="border-t border-white/12">
        <div className="mx-auto max-w-6xl px-5 py-5 sm:px-8">
          <p className="text-[0.8rem] text-white/55">
            © {new Date().getFullYear()} {site.shortName}
          </p>
        </div>
      </div>
    </footer>
  );
}
