import type { Metadata } from "next";
import Image from "next/image";
import { mapLabel, site } from "@/lib/site";

// Shared by email and text for the Nov 4, 2026 Wednesday night, so it stays out
// of search results. Retire or rewrite it once the new format settles in.
export const metadata: Metadata = {
  title: "Wednesday night at the church",
  description: "Games, supper, a fire, songs, and s’mores. This Wednesday, November 4.",
  robots: { index: false, follow: false },
};

const evening = [
  { time: "5:00", name: "Kids’ activities", note: "Games for the youth." },
  { time: "5:30", name: "Supper together", note: "The ladies have the meal covered." },
  {
    time: "6:00",
    name: "Fire, devotional, songs, s’mores",
    note: "The kids gather around the fire for a few songs and a short devotional made for them.",
  },
  { time: "6:40", name: "Dismiss", note: "" },
];

const help = [
  "Run the s’mores station",
  "Start the fire and keep it going (1 or 2 people)",
  "Sit with the smaller children and help them roast and build their s’mores safely",
  "Help keep everyone safe around the fire",
  "Help clean up afterward",
];

export default function WednesdayPage() {
  return (
    <div className="bg-sand">
      <div className="mx-auto max-w-6xl px-5 pt-14 pb-20 sm:px-8 lg:pt-20 lg:pb-28">
        <header className="max-w-[40rem]">
          <p className="inline-block rounded-full bg-marigold px-3.5 py-1 text-[0.85rem] font-bold text-ink">
            This Wednesday, November 4
          </p>
          <h1 className="font-display text-display mt-4 font-extrabold tracking-[-0.03em] text-ink">
            Fire, food, and
            <br />
            <span className="text-teal">our kids.</span>
          </h1>
          <p className="mt-5 max-w-[36ch] text-[1.15rem] leading-[1.6] text-ink/85">
            Wednesday night is changing, and we’d love you there to see it. We’ll be at the church,
            at the fire pit in the parking lot next to the fellowship building.
          </p>
          <p className="mt-5 max-w-[40ch] rounded-2xl bg-white px-5 py-4 text-[1.1rem] leading-[1.55] font-semibold text-ink shadow-[var(--shadow-card)]">
            There is no adult Bible study this Wednesday. Instead, we’re all pitching in to support
            this youth activity.
          </p>
        </header>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <section aria-labelledby="evening-h">
            <h2 id="evening-h" className="font-display text-[1.6rem] font-extrabold tracking-[-0.02em] text-ink">
              The evening
            </h2>
            <ol className="mt-5 border-y border-ink/15">
              {evening.map((s) => (
                <li
                  key={s.time}
                  className="grid grid-cols-[5.25rem_1fr] items-baseline gap-x-4 border-b border-ink/10 py-4 last:border-b-0"
                >
                  <p className="font-display text-[1.9rem] leading-none font-extrabold tracking-[-0.02em] text-coral">
                    {s.time}
                  </p>
                  <div>
                    <p className="font-display text-[1.3rem] leading-tight font-bold text-ink">{s.name}</p>
                    {s.note && <p className="mt-1 text-[1.02rem] leading-snug text-ink/75">{s.note}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-[var(--shadow-card)] lg:self-start">
            <Image
              src="/images/kids-outside.jpg"
              alt="Smiling kids from our church standing together outside"
              width={683}
              height={550}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="h-auto w-full rounded-xl"
              priority
            />
          </div>
        </div>

        <section
          aria-labelledby="help-h"
          className="mt-14 max-w-[44rem] rounded-3xl bg-deepsea p-7 text-white shadow-[var(--shadow-card)] sm:p-10"
        >
          <h2 id="help-h" className="font-display text-[1.8rem] leading-tight font-extrabold tracking-[-0.02em]">
            Could you lend a hand?
          </h2>
          <p className="mt-3 text-[1.05rem] leading-[1.6] text-white/85">
            Your help is welcome. There’s nothing to sign up for. Just come, pick whatever fits
            you, and jump in. If you’re not sure where you’re needed, ask any of us when you get
            there.
          </p>
          <ul className="mt-5 space-y-3 text-[1.05rem] leading-snug">
            {help.map((h) => (
              <li key={h} className="flex gap-3">
                <span aria-hidden className="mt-[0.55em] h-2 w-2 flex-none rounded-full bg-marigold" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[1.05rem] leading-[1.6] text-white/85">
            Prefer to just come and be near? That’s welcome too. Bring a lawn chair and sit back
            from the fire, or stay warm inside the fellowship building.
          </p>
        </section>

        <section aria-labelledby="kids-h" className="mt-14 max-w-[44rem]">
          <h2 id="kids-h" className="font-display text-[1.6rem] font-extrabold tracking-[-0.02em] text-ink">
            This night is for the kids
          </h2>
          <p className="mt-3 text-[1.1rem] leading-[1.6] text-ink/85">
            The songs and the devotional are made for the kids, at their level, so they can enjoy
            some time with God and learn a little more of the Bible. The adults are there to
            support them: to help, to keep things safe, and to make it more fun. Your being in the
            background is the best encouragement they could have.
          </p>
        </section>

        <section aria-labelledby="where-h" className="mt-14 max-w-[44rem]">
          <h2 id="where-h" className="font-display text-[1.6rem] font-extrabold tracking-[-0.02em] text-ink">
            Where
          </h2>
          <p className="mt-3 text-[1.1rem] leading-[1.6] text-ink/85">
            At the church, at the fire pit in the parking lot next to the fellowship building.
          </p>
          <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[1.1rem] font-semibold">
            <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="link-under text-teal">
              {mapLabel()}, map
            </a>
            {site.phone && (
              <a href={`tel:${site.phone.replace(/\D/g, "")}`} className="link-under text-teal">
                Church office {site.phone}
              </a>
            )}
          </p>
        </section>
      </div>
    </div>
  );
}
