import { PhotoSlot } from "./PhotoSlot";

const expectations = [
  {
    term: "Come as you are",
    detail: "Boots, jeans, Sunday best — you'll see all three in the same pew.",
  },
  {
    term: "Kids are welcome",
    detail: "In the service, wiggles and all. Nobody minds.",
  },
  {
    term: "About an hour",
    detail: "Singing, prayer, the Lord's Supper, and a lesson from Scripture.",
  },
  {
    term: "No spotlight",
    detail: "Nobody will single you out, ask you to stand, or chase you down.",
  },
];

export function Welcome() {
  return (
    <section className="bg-cloud text-ink">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="lg:grid lg:grid-cols-[1fr_1.35fr] lg:gap-16">
          <div className="reveal">
            <p className="eyebrow text-teal">What to expect</p>
            <h2 className="font-display mt-5 text-display font-extrabold tracking-[-0.02em] text-ink">
              Come
              <br />
              expecting.
            </h2>
            <p className="mt-7 max-w-[46ch] text-[1.05rem] leading-[1.7] text-ink/85">
              We open our Bibles, we sing together, and we share the
              Lord&rsquo;s Supper every week. Worship here is alive — voices
              filling the room, prayers that mean something, teaching that
              meets your Monday. And it doesn&rsquo;t stop at Sunday: Bible
              studies, church events, tables full of food and laughter.{" "}
              <strong className="font-bold text-ink">
                This is the place to be part of it.
              </strong>
            </p>
            <PhotoSlot
              file="fellowship-ladies.jpg"
              alt="Two friends laughing together over dinner in the fellowship hall"
              caption="A photo of fellowship joy goes here."
              className="snapshot mt-10 aspect-[4/3] -rotate-1"
            />
          </div>

          <div className="mt-12 lg:mt-2">
            <dl className="reveal divide-y divide-ink/10 border-y border-ink/10">
              {expectations.map((item) => (
                <div
                  key={item.term}
                  className="grid gap-1 py-5 sm:grid-cols-[minmax(11rem,0.6fr)_1fr] sm:gap-6"
                >
                  <dt className="font-semibold text-ink">{item.term}</dt>
                  <dd className="text-[0.98rem] leading-relaxed text-ink/75">
                    {item.detail}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="reveal mt-10 grid grid-cols-2 gap-4">
              <PhotoSlot
                file="congregation.jpg"
                alt="The whole church family sharing a meal in the fellowship hall"
                caption="The fellowship candid goes here."
                className="snapshot col-span-2 aspect-[16/8] rotate-1"
              />
              <PhotoSlot
                file="kids-outside.jpg"
                alt="A bunch of kids grinning outside on a summer morning"
                caption="Kids outside"
                className="snapshot aspect-[4/3] -rotate-1"
              />
              <PhotoSlot
                file="youth.jpg"
                alt="A young member and kids of the congregation grinning for a selfie"
                caption="Fellowship photo"
                className="snapshot aspect-[4/3] rotate-2"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
