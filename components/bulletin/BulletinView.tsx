import Link from "next/link";
import { messageTitle } from "@/lib/bulletin/data";
import type { Announcement, Bulletin } from "@/lib/bulletin/types";
import { mapLabel, site } from "@/lib/site";
import { PrintButton } from "./PrintButton";
import { paragraphs, RichLines } from "./RichText";

const ymd = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const month = (iso: string, style: "long" | "short" = "long") =>
  ymd(iso).toLocaleDateString("en-US", { month: style });

/** "October 10, 9:30 am–3pm" → ["October 10", "9:30 am–3pm"] */
function splitWhen(when: string): [string, string] {
  const i = when.indexOf(", ");
  return i === -1 ? [when, ""] : [when.slice(0, i), when.slice(i + 2)];
}

function readingMinutes(body: string): number {
  return Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200));
}

const hasArticle = (b: Bulletin) => Boolean(b.article.title || b.article.body);
const hasPrayer = (b: Bulletin) => b.prayer_groups.some((g) => g.names.length > 0);
const hasOrder = (b: Bulletin) => b.order_of_service.items.length > 0;

/**
 * The bulletin — one page, one Sunday. Reading order follows what people reach
 * for: the order of service first (Sunday morning), then the week's news, the
 * prayer list, and the minister's article for the slower read.
 */
export function BulletinView({
  bulletin,
  previewNote,
}: {
  bulletin: Bulletin;
  previewNote?: string;
}) {
  const { bulletin_date: date } = bulletin;
  const message = messageTitle(bulletin);
  const sermonItem = bulletin.order_of_service.items.find((i) => /sermon|message|lesson/i.test(i.label));
  const day = ymd(date).getDate();
  const weekday = ymd(date).toLocaleDateString("en-US", { weekday: "long" });
  const year = ymd(date).getFullYear();

  const jumps = [
    hasOrder(bulletin) && { id: "order", label: "Order of service" },
    bulletin.announcements.length > 0 && { id: "news", label: "This week" },
    hasPrayer(bulletin) && { id: "prayer", label: "Prayer list" },
    hasArticle(bulletin) && { id: "message", label: "From the minister" },
    { id: "info", label: "Times & contact" },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <div className="bg-cloud print:bg-white">
      {previewNote && (
        <p className="bg-marigold px-5 py-2.5 text-center text-[0.9rem] font-semibold text-ink print:hidden">
          {previewNote}
        </p>
      )}

      {/* ------------------------------------------------ masthead */}
      <header className="bg-sand print:bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 pt-12 pb-10 sm:px-8 md:grid-cols-[auto_1fr] md:items-end md:gap-14 lg:pt-16">
          <div className="hero-enter -rotate-2 select-none" style={{ "--enter-delay": "0.05s" } as React.CSSProperties}>
            <p className="eyebrow text-coral">{weekday}</p>
            <p
              aria-hidden
              className="font-display -ml-1 text-[clamp(6rem,22vw,11rem)] leading-[0.78] font-extrabold tracking-[-0.06em] text-ink"
            >
              {day}
            </p>
            <p className="font-display mt-1 text-[1.5rem] font-bold tracking-[-0.01em] text-teal">
              {month(date)} {year}
            </p>
          </div>

          <div className="hero-enter" style={{ "--enter-delay": "0.18s" } as React.CSSProperties}>
            <p className="eyebrow text-teal">The Cisco Church · Bulletin</p>
            <h1 className="sr-only">
              Bulletin for {weekday}, {month(date)} {day}, {year}
            </h1>
            {message ? (
              <>
                <p className="mt-4 text-[0.95rem] font-semibold text-ink/72">This Sunday’s message</p>
                <p className="font-serif mt-1 max-w-[20ch] text-passage font-medium text-ink italic">
                  “{message}”
                </p>
                {sermonItem?.who && (
                  <p className="mt-3 text-[0.95rem] text-ink/70">{sermonItem.who}</p>
                )}
              </>
            ) : (
              <p className="font-display mt-4 max-w-[18ch] text-display font-extrabold tracking-[-0.03em] text-ink">
                Welcome to worship.
              </p>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">
          <div className="rounded-2xl bg-white p-5 shadow-panel-light sm:p-6 md:flex md:items-start md:gap-6">
            <p className="eyebrow shrink-0 pt-1 text-coral md:w-28">Visiting?</p>
            <p className="max-w-[68ch] text-[1rem] leading-relaxed text-ink/80">
              <strong className="font-bold text-ink">We’re so glad you’re here.</strong> Thank you for
              worshiping with us. If you’re visiting, please take a moment to fill out a Visitor Card
              and leave it with us before you go — we’d love the chance to get to know you better.
              We hope you feel welcome and will worship with us again soon.
            </p>
          </div>
        </div>

        <nav
          aria-label="On this page"
          className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 pb-6 sm:px-8 print:hidden"
        >
          {jumps.map((j) => (
            <a
              key={j.id}
              href={`#${j.id}`}
              className="eyebrow shrink-0 rounded-full bg-white/70 px-4 py-2 text-teal shadow-card transition-transform duration-300 ease-[var(--ease-spring)] hover:-translate-y-0.5 active:translate-y-0"
            >
              {j.label}
            </a>
          ))}
        </nav>
      </header>

      {/* ------------------------------------------------ body */}
      <div className="mx-auto grid max-w-6xl gap-14 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:gap-16 lg:py-20 print:block">
        <aside className="space-y-10 lg:sticky lg:top-6 lg:self-start print:mb-8">
          {hasOrder(bulletin) && <RunSheet bulletin={bulletin} />}
          {bulletin.series.weeks.length > 0 && <SeriesCard bulletin={bulletin} />}
        </aside>

        <div className="min-w-0 space-y-16">
          {bulletin.announcements.length > 0 && (
            <section id="news" className="scroll-mt-6">
              <h2 className="font-display text-[2rem] font-extrabold tracking-[-0.03em] text-ink">
                This week
              </h2>
              <ul className="mt-6 divide-y rule-tint">
                {bulletin.announcements.map((a) => (
                  <AnnouncementRow key={a.id} item={a} />
                ))}
              </ul>
            </section>
          )}

          {hasArticle(bulletin) && (
            <section id="message" className="scroll-mt-6">
              <p className="eyebrow text-coral">
                {bulletin.article.kicker || "From the minister"}
                {bulletin.article.body && ` · ${readingMinutes(bulletin.article.body)} min read`}
              </p>
              {bulletin.article.title && (
                <h2 className="font-display mt-3 text-display font-extrabold tracking-[-0.03em] text-ink">
                  {bulletin.article.title}
                </h2>
              )}
              {bulletin.article.subtitle && (
                <p className="font-serif mt-4 text-passage text-teal italic">{bulletin.article.subtitle}</p>
              )}
              <div className="mt-8 max-w-[62ch] space-y-5 text-[1.08rem] leading-[1.8] text-ink/85">
                {paragraphs(bulletin.article.body).map((p, i) => (
                  <p key={i} className={i === 0 ? "text-[1.28rem] leading-[1.6] text-ink" : undefined}>
                    <RichLines text={p} keyBase={`p${i}`} />
                  </p>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* ------------------------------------------------ prayer */}
      {hasPrayer(bulletin) && (
        <section id="prayer" className="scroll-mt-6 bg-deepsea text-white print:bg-white print:text-ink">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <h2 className="font-display text-[2rem] font-extrabold tracking-[-0.03em]">Prayer list</h2>
              <p className="eyebrow text-marigold print:text-teal">Keep them in your prayers this week</p>
            </div>
            <div className="mt-8 space-y-9">
              {bulletin.prayer_groups
                .filter((g) => g.names.length > 0)
                .map((g, gi) => (
                  <div key={gi}>
                    {g.label && <p className="eyebrow mb-3 text-marigold print:text-teal">{g.label}</p>}
                    <ul className="flex max-w-[60rem] flex-wrap gap-x-2 gap-y-2 text-[1.15rem] leading-snug sm:text-[1.3rem]">
                      {g.names.map((name, ni) => (
                        <li key={ni} className="flex items-center gap-2">
                          <span>{name}</span>
                          {ni < g.names.length - 1 && (
                            <span aria-hidden className="size-1.5 rounded-full bg-marigold print:bg-teal" />
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------ times + contact */}
      <section id="info" className="scroll-mt-6">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:py-20">
          <div>
            <h2 className="font-display text-[1.6rem] font-extrabold tracking-[-0.02em] text-ink">
              Every week
            </h2>
            <dl className="mt-6 space-y-6">
              {site.weeklyMeetings.map((d) => (
                <div key={d.day} className="grid grid-cols-[6.5rem_1fr] gap-4">
                  <dt className="eyebrow pt-1.5 text-teal">{d.day}</dt>
                  <dd className="space-y-1.5">
                    {d.items.map((it) => (
                      <p key={it.label} className="flex items-baseline gap-3">
                        <span className="text-ink/80">{it.label}</span>
                        <span aria-hidden className="mb-1 flex-1 border-b-2 border-dotted border-ink/20" />
                        <span className="font-semibold text-ink">{it.time}</span>
                      </p>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="font-display text-[1.6rem] font-extrabold tracking-[-0.02em] text-ink">
              Reach us
            </h2>
            <ul className="mt-6 space-y-3 text-[1.02rem]">
              {site.phone && (
                <li>
                  <a href={`tel:${site.phone}`} className="link-under font-semibold text-ink">
                    {site.phone}
                  </a>
                </li>
              )}
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`} className="link-under break-all text-ink">
                    {site.email}
                  </a>
                </li>
              )}
              <li>
                <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="link-under text-ink">
                  {mapLabel()}
                </a>
              </li>
            </ul>
            <dl className="mt-8 grid grid-cols-[6.5rem_1fr] gap-x-4 gap-y-2 text-[0.98rem]">
              <dt className="eyebrow pt-1 text-teal">Preacher</dt>
              <dd>{site.people.preacher}</dd>
              <dt className="eyebrow pt-1 text-teal">Elders</dt>
              <dd>{site.people.elders.join(" · ")}</dd>
              <dt className="eyebrow pt-1 text-teal">Secretary</dt>
              <dd>{site.people.secretary}</dd>
            </dl>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-5 pb-14 sm:px-8">
          <Link href="/bulletin/archive" className="eyebrow link-under text-teal hover:text-deepsea print:hidden">
            Past bulletins
          </Link>
          <PrintButton />
        </div>
      </section>
    </div>
  );
}

function RunSheet({ bulletin }: { bulletin: Bulletin }) {
  const { song_leader, items } = bulletin.order_of_service;
  return (
    <section id="order" className="scroll-mt-6 rounded-3xl bg-white p-6 shadow-panel-light sm:p-8 print:shadow-none">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-[1.6rem] font-extrabold tracking-[-0.02em] text-ink">
          Order of service
        </h2>
        <p className="eyebrow text-coral">10:30 AM</p>
      </div>
      {song_leader && (
        <p className="mt-2 text-[0.95rem] text-ink/72">
          Song leader · <span className="font-semibold text-ink">{song_leader}</span>
        </p>
      )}
      <ol className="relative mt-7 space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[0.4rem] before:w-px before:bg-teal/25">
        {items.map((item, i) => {
          const isSermon = item === items.find((x) => /sermon|message|lesson/i.test(x.label));
          return (
            <li key={i} className="relative pl-8">
              <span
                aria-hidden
                className={`absolute top-[0.55rem] left-0 rounded-full ring-4 ring-white ${
                  isSermon ? "top-[0.45rem] size-[1.05rem] bg-coral" : "size-[0.85rem] bg-teal/55"
                }`}
              />
              <p className="flex items-baseline gap-3">
                <span className={isSermon ? "font-display text-[1.15rem] font-extrabold text-ink" : "font-semibold text-ink"}>
                  {item.label}
                </span>
                {item.who && (
                  <>
                    <span aria-hidden className="mb-1 min-w-4 flex-1 border-b-2 border-dotted border-ink/20" />
                    <span className="text-[0.95rem] text-teal">{item.who}</span>
                  </>
                )}
              </p>
              {item.note && <p className="font-serif mt-0.5 text-[1.05rem] text-ink/70 italic">{item.note}</p>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function SeriesCard({ bulletin }: { bulletin: Bulletin }) {
  const { series, bulletin_date: date } = bulletin;
  return (
    <section
      aria-label={`Sermon series: ${series.title}`}
      className="rounded-3xl bg-deepsea p-6 text-white shadow-card sm:p-8 print:bg-white print:text-ink print:shadow-none"
    >
      <p className="eyebrow text-marigold print:text-teal">Sermon series</p>
      <h2 className="font-display mt-2 text-[1.7rem] leading-[1.1] font-extrabold tracking-[-0.03em]">
        {series.title}
      </h2>
      {series.tagline && <p className="font-serif mt-2 text-[1.1rem] text-white/80 italic print:text-ink/70">{series.tagline}</p>}
      <ol className="mt-6 divide-y divide-white/15 print:divide-ink/15">
        {series.weeks.map((w) => {
          const now = w.date === date;
          const past = w.date < date;
          return (
            <li
              key={w.date}
              aria-current={now ? "date" : undefined}
              className={`flex items-center gap-4 py-3 ${past ? "opacity-55" : ""}`}
            >
              <span className="eyebrow w-14 shrink-0 text-marigold print:text-teal">
                {month(w.date, "short")} {ymd(w.date).getDate()}
              </span>
              <span className={`flex-1 ${now ? "font-display text-[1.1rem] font-extrabold" : ""}`}>{w.title}</span>
              {now && (
                <span className="eyebrow rounded-full bg-coral px-3 py-1 text-white print:border print:border-ink print:bg-white print:text-ink">
                  This week
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {series.verse && <p className="mt-5 text-[0.85rem] leading-relaxed text-white/65 print:text-ink/70">{series.verse}</p>}
    </section>
  );
}

function AnnouncementRow({ item }: { item: Announcement }) {
  const [dateText, timeText] = splitWhen(item.when);
  return (
    <li className="grid gap-2 py-7 first:pt-0 md:grid-cols-[9.5rem_1fr] md:gap-8 print:break-inside-avoid">
      <div>
        <p className="eyebrow text-teal">{dateText || "This week"}</p>
        {timeText && <p className="mt-0.5 text-[0.9rem] font-semibold text-ink/72">{timeText}</p>}
      </div>
      <div>
        <h3 className="font-display text-[1.35rem] leading-snug font-bold tracking-[-0.01em] text-ink">
          {item.title}
        </h3>
        {item.body && <p className="mt-2 max-w-[60ch] text-ink/80">{item.body}</p>}
        {item.note && (
          <p className="mt-3 inline-block rounded-full bg-marigold/25 px-3.5 py-1 text-[0.9rem] font-bold text-ink">
            {item.note}
          </p>
        )}
      </div>
    </li>
  );
}
