import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Stub } from "@/components/events/Stub";
import {
  buildTimeline,
  parseIso,
  pickPhoto,
  saveTheDate,
  soonLabel,
  todayInCisco,
  windowEnd,
  type Occurrence,
  type StandingEvent,
} from "@/lib/events";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Events",
  description:
    "What's coming up at the Cisco Church, in the order it happens: Ladies Bible study, Wednesday evenings, the First Sunday potluck, and more.",
};

const TONE = { once: "deepsea", monthly: "coral", weekly: "teal" } as const;

const h3 =
  "font-display text-[1.6rem] leading-tight font-extrabold tracking-[-0.02em] text-ink sm:text-[1.9rem]";

function Card({ o, today, big = false }: { o: Occurrence; today: string; big?: boolean }) {
  const d = parseIso(o.date);
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
  const e = o.event;
  const standing = "rhythm" in e ? (e as StandingEvent) : null;
  const where = e.where;
  const time = e.time ? ` · ${e.time}` : "";
  const soon = soonLabel(o.date, today);
  const photo = pickPhoto(e, o.date);

  return (
    <div className="flex flex-col rounded-2xl bg-white shadow-[var(--shadow-card)] sm:flex-row">
      <Stub
        tone={TONE[o.kind]}
        lead={d.toLocaleDateString("en-US", { month: "short" })}
        big={String(d.getDate())}
        small={`${weekday}${time}`}
      />
      <div className="flex-1 rounded-b-2xl border-t-2 border-dashed border-ink/20 p-6 sm:rounded-r-2xl sm:rounded-bl-none sm:border-t-0 sm:border-l-2 sm:p-8">
        <div
          className={
            photo ? "grid gap-6 md:grid-cols-[1fr_18rem] md:items-center md:gap-8" : ""
          }
        >
          <div>
            <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-teal">
              {standing && <span>{standing.rhythm}</span>}
              {big && <span className="text-coral">Save the date</span>}
              {soon && (
                <span className="rounded-full bg-coral px-3 py-1 text-white">{soon}</span>
              )}
            </p>
            <h3 className={`${h3} mt-2`}>{e.title}</h3>
            <p className="mt-3 max-w-[52ch] text-[1.1rem] text-ink/85">{e.body}</p>
            {where && <p className="eyebrow mt-4 text-teal">{where}</p>}
          </div>
          {photo && (
            <Image
              src={`/images/${photo.file}`}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 768px) 288px, 100vw"
              className="h-auto w-full rounded-xl object-cover shadow-[var(--shadow-photo)] md:rotate-1"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  const today = todayInCisco();
  const timeline = buildTimeline(today);
  const ahead = saveTheDate(today);
  const through = parseIso(windowEnd(today)).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Month headings land on the rail whenever the month changes.
  let lastMonth = "";
  const rows: React.ReactNode[] = [];
  timeline.forEach((o) => {
    const month = parseIso(o.date).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (month !== lastMonth) {
      rows.push(
        <li key={`m-${month}`} className="relative list-none pt-2 pl-8 sm:pl-12">
          <span
            aria-hidden
            className="absolute top-[0.9rem] left-0 size-3.5 -translate-x-1/2 rounded-full bg-coral ring-4 ring-cloud"
          />
          <h2 className="eyebrow text-coral">{month}</h2>
        </li>,
      );
      lastMonth = month;
    }
    rows.push(
      <li key={`${o.date}-${o.event.id}`} id={`${o.date}-${o.event.id}`} className="relative list-none pl-8 sm:pl-12">
        <span
          aria-hidden
          className="absolute top-8 left-0 size-2.5 -translate-x-1/2 rounded-full bg-teal ring-4 ring-cloud"
        />
        <Card o={o} today={today} />
      </li>,
    );
  });

  return (
    <div className="bg-cloud">
      <div className="mx-auto max-w-5xl px-5 pt-14 pb-20 sm:px-8 lg:pt-20">
        <p className="eyebrow text-teal">This week at the Cisco Church</p>
        <h1 className="font-display mt-4 text-display font-extrabold tracking-[-0.03em] text-ink">
          New things are happening here.
          <br />
          <span className="text-teal">Come get in on it.</span>
        </h1>
        <p className="mt-5 max-w-xl text-[1.1rem] text-ink/75">
          Here’s what’s on, in the order it happens, now through{" "}
          <span className="whitespace-nowrap">{through}</span>. Looking for Sunday’s slides and prayer list?{" "}
          <Link href="/announcements" className="font-bold text-teal link-under">
            See the announcements
          </Link>
          .
        </p>

        <ol className="relative mt-14 ml-1.5 space-y-6 border-l-2 border-teal/25 sm:ml-2">
          {rows}
        </ol>

        {ahead.length > 0 && (
          <section className="mt-16" aria-labelledby="save-the-date">
            <h2 id="save-the-date" className="eyebrow text-coral">
              Mark your calendar
            </h2>
            <ul className="mt-5 space-y-6">
              {ahead.map((o) => (
                <li key={o.event.id} className="list-none">
                  <Card o={o} today={today} big />
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-10 text-[1.05rem] text-ink/75">
          Sunday Bible class and worship times are on the{" "}
          <Link href="/#visit" className="font-bold text-teal link-under">
            home page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
