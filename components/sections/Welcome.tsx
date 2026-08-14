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
    <section className="bg-parchment text-umber">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="lg:grid lg:grid-cols-[1fr_1.35fr] lg:gap-16">
          <div className="reveal">
            <p className="eyebrow text-burnish">What to expect</p>
            <h2 className="font-display mt-5 text-display tracking-[-0.02em] text-espresso">
              Sunday morning,
              <br />
              plainly.
            </h2>
            <p className="mt-7 max-w-[46ch] text-[1.05rem] leading-[1.7]">
              We open our Bibles, we sing together, and we take the Lord&rsquo;s
              Supper every week — simple worship, the way this congregation has
              done it for a long time. No stage lights, no production. Just a
              room full of people who are glad you came.
            </p>
            <PhotoSlot
              file="bible-class.jpg"
              alt="Children and teachers seated in the pews during Bible class"
              caption="A photo of teaching or Bible class goes here — shot 3 in PHOTO_GUIDE.md."
              className="mt-10 aspect-[4/3] shadow-(--shadow-panel-light)"
            />
          </div>

          <div className="mt-12 lg:mt-2">
            <dl className="reveal divide-y divide-umber/15 border-y border-umber/15">
              {expectations.map((item) => (
                <div
                  key={item.term}
                  className="grid gap-1 py-5 sm:grid-cols-[minmax(11rem,0.6fr)_1fr] sm:gap-6"
                >
                  <dt className="font-semibold text-espresso">{item.term}</dt>
                  <dd className="text-[0.98rem] leading-relaxed text-umber/90">
                    {item.detail}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="reveal mt-10 grid grid-cols-2 gap-3">
              <PhotoSlot
                file="congregation.jpg"
                alt="The whole church family sharing a meal in the fellowship hall"
                caption="The fellowship candid goes here — shot 2 in PHOTO_GUIDE.md."
                className="col-span-2 aspect-[16/8] shadow-(--shadow-panel-light)"
              />
              <PhotoSlot
                file="fellowship-men.jpg"
                alt="Three men visiting together in the fellowship hall"
                caption="Fellowship photo"
                className="aspect-[4/3] shadow-(--shadow-panel-light)"
              />
              <PhotoSlot
                file="youth.jpg"
                alt="A young member and kids of the congregation grinning for a selfie"
                caption="Fellowship photo"
                className="aspect-[4/3] shadow-(--shadow-panel-light)"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
