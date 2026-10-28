import { IdeasModal } from "./IdeasModal";
import { VideoCard } from "./VideoCard";

/**
 * Members-only "where we're headed" page. Copy is Joe's own direction from the
 * Oct 25 leadership handout; wording here is a first draft for him to edit.
 * TODO(Joe): the three voices below are placeholders until the clips are recorded.
 */

const voices = [
  {
    topic: "Why change now",
    who: "Church member",
    poster: "/images/fellowship-men.jpg",
    alt: "Men of the church talking together",
  },
  {
    topic: "What I hope Sundays feel like",
    who: "Church member",
    poster: "/images/fellowship-ladies.jpg",
    alt: "Ladies of the church laughing together",
  },
  {
    topic: "Wednesday nights for families",
    who: "Church member",
    poster: "/images/kids-outside.jpg",
    alt: "Children playing outside at church",
  },
];

const lead = {
  name: "Jesus at the center",
  text: "Everything we do starts and ends with Jesus. We are God’s sons and daughters, and every ministry here exists to help people know Him: His love, His salvation, His way. Every program, schedule, and decision gets one question: does this lead people to Jesus?",
};

// Order matters: this is the order of priority Joe set.
const values = [
  {
    name: "Relationships over programs",
    text: "Programs and activities serve a greater purpose: relationships that connect people with God and with one another. We measure success not by what we do, but by the lives we touch.",
  },
  {
    name: "Prayer before pursuit",
    text: "Seek God’s wisdom before committing our time, energy, and resources.",
  },
  {
    name: "God ideas drive ministry",
    text: "We don’t chase every good idea. We look for big, kingdom-sized ideas with real Jesus impact: ideas that serve others, love others, and encourage others. That’s where we invest our time.",
  },
  {
    name: "Vision driven",
    text: "We keep the big picture in front of us by asking: What is God calling this congregation to be and do in His kingdom? Hence, we align ourselves to what God is doing. This helps us be decisive about what we say yes to and what we say no to.",
  },
  {
    name: "Grace received, grace shared",
    text: "We are saved by grace through faith, not by works (Ephesians 2:8–9). The more deeply we understand the grace God has shown us, the more freely we show it to the people around us. We celebrate God’s goodness. We encourage the presence of grace more and more in our fellowship, our ministries, and everything we do, and we count that as a godly step forward.",
  },
  {
    name: "Mission over tradition",
    text: "We honor our heritage, and we let our mission, not long-standing practices, set our direction.",
  },
];

const h2 =
  "font-display text-[clamp(1.9rem,3.2vw+0.6rem,3rem)] leading-[1.08] font-extrabold tracking-[-0.03em] text-ink";

export function TogetherContent() {
  return (
    <div className="bg-cloud">
      {/* ── Opening: the headline and Joe's video ───────────────────── */}
      <section className="bg-sand">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-12 pb-16 sm:px-8 lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-14 lg:pt-20 lg:pb-24">
          <div>
            <p className="flex items-center gap-3 text-[0.95rem] font-semibold text-teal">
              <span aria-hidden className="h-0.5 w-8 bg-coral" />
              A note for our church family
            </p>
            <h1 className="font-display mt-5 text-display font-extrabold tracking-[-0.03em] text-ink">
              We love this church.
              <br />
              <span className="text-teal">So we’re changing how we do things.</span>
            </h1>
            <p className="mt-6 max-w-[34ch] text-[1.15rem] leading-[1.7] text-ink/80">
              Watch this first. It’s short, and it’s the heart of everything below.
            </p>
          </div>

          <figure>
            <div className="rotate-0 rounded-[1.1rem] bg-white p-2 shadow-[var(--shadow-card-lift)] lg:-rotate-[0.8deg]">
              <VideoCard
                shape="wide"
                src={null}
                poster="/images/preaching-podium.jpg"
                alt="Joe Cabrera preaching"
                label="Play Joe’s message about where we’re headed"
                sizes="(min-width: 1024px) 700px, 100vw"
                priority
              />
            </div>
            <figcaption className="mt-4 text-[0.98rem] text-ink/75">
              <span className="font-bold text-ink">Joe Cabrera</span>, Minister · about 3 minutes
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── The honest reason ───────────────────────────────────────── */}
      <section className="bg-deepsea text-cloud">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:py-24">
          <p className="font-serif text-[clamp(1.6rem,2.6vw+0.8rem,2.75rem)] leading-[1.3] italic">
            There was a time this building was full. If we keep doing everything the same way, we
            won’t be here in a few years. We don’t want that for our children, our grandchildren,
            or this town.
          </p>
          <div className="mt-10 flex items-start gap-5">
            <span aria-hidden className="mt-2 h-0.5 w-14 shrink-0 bg-marigold" />
            <p className="max-w-[48ch] text-[1.15rem] leading-[1.7] text-cloud/90">
              That’s the honest reason. Here’s the hopeful one:{" "}
              <strong className="text-white">God isn’t finished with the Cisco Church.</strong> We
              are not trying to become a busier church. We are trying to become a more purposeful,
              relational, and spiritually vibrant one.
            </p>
          </div>
        </div>
      </section>

      {/* ── Voices ──────────────────────────────────────────────────── */}
      <section aria-labelledby="voices" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <h2 id="voices" className={h2}>
          Hear it from your church family
        </h2>
        <p className="mt-4 max-w-[52ch] text-[1.1rem] leading-[1.7] text-ink/80">
          Joe isn’t the only one with something to say. Here are a few of us, in our own words.
        </p>

        <ul className="-mx-5 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0">
          {voices.map((v, i) => (
            <li
              key={v.topic}
              className={`w-[72%] shrink-0 snap-center list-none sm:w-auto ${
                i === 1 ? "sm:mt-8" : ""
              }`}
            >
              <div className="rounded-[1.1rem] bg-white p-2 shadow-[var(--shadow-card)]">
                <VideoCard
                  shape="tall"
                  src={null}
                  poster={v.poster}
                  alt={v.alt}
                  label={`Play: ${v.topic}`}
                  sizes="(min-width: 640px) 360px, 72vw"
                />
              </div>
              <p className="font-display mt-4 text-[1.2rem] leading-snug font-bold tracking-[-0.01em] text-ink">
                {v.topic}
              </p>
              <p className="mt-1 text-[0.98rem] text-ink/70">{v.who}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── What guides us ──────────────────────────────────────────── */}
      <section aria-labelledby="values" className="bg-sand">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <h2 id="values" className={h2}>
            What guides every decision
          </h2>
          <p className="mt-4 max-w-[52ch] text-[1.1rem] leading-[1.7] text-ink/80">
            Before we change any program or schedule, we agreed on what matters most. These come
            first.
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-14">
            <div className="rounded-3xl bg-teal p-8 text-white shadow-[var(--shadow-card-lift)] sm:p-10 lg:self-start">
              <h3 className="font-display text-[clamp(1.9rem,2.6vw+0.8rem,2.7rem)] leading-[1.05] font-extrabold tracking-[-0.03em]">
                {lead.name}
              </h3>
              <p className="mt-5 text-[1.12rem] leading-[1.7] text-white/95">{lead.text}</p>
            </div>

            <ul className="divide-y divide-ink/15">
              {values.map((v) => (
                <li key={v.name} className="list-none py-5 first:pt-0 last:pb-0">
                  <h3 className="font-display text-[1.35rem] font-bold tracking-[-0.02em] text-ink">
                    {v.name}
                  </h3>
                  <p className="mt-1.5 max-w-[56ch] text-[1.05rem] leading-[1.7] text-ink/80">
                    {v.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── What's changing ─────────────────────────────────────────── */}
      <section aria-labelledby="changing" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <h2 id="changing" className={h2}>
          What’s changing
        </h2>
        <p className="mt-4 max-w-[52ch] text-[1.1rem] leading-[1.7] text-ink/80">
          Fewer things, done well. Here’s where each part of our week is headed.
        </p>

        <div className="mt-10 space-y-6">
          {/* Sunday morning — the center of everything */}
          <article className="grid gap-6 rounded-3xl bg-white p-7 shadow-[var(--shadow-card)] sm:p-10 lg:grid-cols-[1fr_1.3fr] lg:gap-12">
            <div>
              <p className="inline-block rounded-full bg-coral px-3.5 py-1 text-[0.85rem] font-bold text-white">
                Happening now
              </p>
              <h3 className="font-display mt-4 text-[clamp(1.8rem,2.4vw+0.8rem,2.6rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-ink">
                Sunday morning is our main gathering
              </h3>
            </div>
            <div className="text-[1.08rem] leading-[1.7] text-ink/85">
              <p>
                We’re putting our best preparation, energy, and resources into one hour a week so
                it’s something you look forward to and are excited to invite someone to.
              </p>
              <ul className="mt-4 space-y-2.5">
                {[
                  "A relaxed, welcoming atmosphere that celebrates who we are in Christ",
                  "More life in our singing, with a worship team",
                  "Time to pray together in small groups during the Lord’s Supper",
                  "Training and support for our teachers and volunteers",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-coral" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          {/* Wednesday nights — still being shaped */}
          <article className="grid gap-6 rounded-3xl bg-white p-7 shadow-[var(--shadow-card)] sm:p-10 lg:grid-cols-[1fr_1.3fr] lg:gap-12">
            <div>
              <p className="inline-block rounded-full bg-teal px-3.5 py-1 text-[0.85rem] font-bold text-white">
                We’re shaping this together
              </p>
              <h3 className="font-display mt-4 text-[clamp(1.8rem,2.4vw+0.8rem,2.6rem)] leading-[1.05] font-extrabold tracking-[-0.03em] text-ink">
                Wednesday nights, rethought
              </h3>
            </div>
            <div className="text-[1.08rem] leading-[1.7] text-ink/85">
              <p>
                We want Wednesday evenings to be a place where children and their parents feel at
                home. Think family meals, coffee nights, ice cream socials, and Bible studies where
                everyone gets to talk. It will change with the seasons, built around who we’re
                trying to reach.
              </p>
              <p className="mt-4 font-semibold text-ink">
                The details aren’t set. We want your ideas.
              </p>
            </div>
          </article>

          {/* Sunday evenings — said once, plainly */}
          <article className="grid gap-6 rounded-3xl bg-sand p-7 sm:p-10 lg:grid-cols-[1fr_1.3fr] lg:gap-12">
            <div>
              <p className="inline-block rounded-full bg-ink px-3.5 py-1 text-[0.85rem] font-bold text-white">
                Starting November 2026
              </p>
              <h3 className="font-display mt-4 text-[clamp(1.5rem,1.8vw+0.8rem,2.1rem)] leading-[1.1] font-extrabold tracking-[-0.03em] text-ink">
                Sunday evenings become time for family and friends
              </h3>
            </div>
            <p className="text-[1.08rem] leading-[1.7] text-ink/85">
              We will no longer hold a regular Sunday evening service. Each service takes the same
              preparation and the same people as everything else, and fewer of us were able to be
              there, especially when the weather turns cold. We’d rather invest that energy where it
              reaches more people. And we’d love to see Sunday evenings go to rest, hospitality, and
              time with the people you love. Ending one service doesn’t mean we care any less about
              each other. It’s how we get to do a few things really well.
            </p>
          </article>
        </div>
      </section>

      {/* ── Your part ───────────────────────────────────────────────── */}
      <section aria-labelledby="part" className="bg-teal text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-16 lg:py-24">
          <div>
            <h2
              id="part"
              className="font-display text-[clamp(1.9rem,3.2vw+0.6rem,3rem)] leading-[1.08] font-extrabold tracking-[-0.03em] text-white"
            >
              We’re asking for your help.
            </h2>
            <p className="mt-6 max-w-[44ch] font-serif text-[clamp(1.4rem,1.8vw+0.8rem,2.1rem)] leading-[1.35] text-white italic">
              What could the Cisco Church do better than a thousand other churches?
            </p>
            <p className="mt-6 max-w-[52ch] text-[1.1rem] leading-[1.7] text-white">
              Start with a story from our past that you treasure. Then help us picture what we
              could become: what could be uniquely us. That’s what we want to build on. If you
              have questions or concerns, I’d like to hear them in person.
            </p>
            <p className="mt-6 font-display text-[1.15rem] font-bold text-white">
              Joe Cabrera, Minister
            </p>
          </div>

          <div className="space-y-4 rounded-3xl bg-ink p-7 shadow-[var(--shadow-card-lift)] sm:p-9">
            <p className="font-display text-[1.4rem] leading-tight font-bold text-white">
              Add your voice
            </p>
            <p className="text-[1.05rem] leading-[1.6] text-white/90">
              Two short questions, and you stay right here on the page.
            </p>
            <div className="pt-2">
              <IdeasModal />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
