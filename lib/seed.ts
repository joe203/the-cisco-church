import type { Deck, DeckState, Sermon, SermonDetail, SlideWithNotes, Speaker } from "./types";

/**
 * Bundled fallback data, mirroring supabase/migrations/002_seed.sql.
 * Used whenever Supabase env vars are absent or a query fails — the site
 * must never render empty because the database is unreachable.
 *
 * Both sermons are REAL (assets supplied by Joe in past_sermons/, served
 * from public/sermons/[slug]/). Dates confirmed by Joe 2026-08-15.
 */

const joe: Speaker = {
  id: "seed-speaker-joe",
  slug: "joe-cabrera",
  name: "Joe Cabrera",
  photo_url: null,
  tags: ["Minister", "Educator", "Consultant"],
  // TODO(Joe): replace with your preferred bio when sermon assets arrive.
  bio: "Joe serves the Cisco congregation in an interim ministry role, bringing years of teaching and preaching alongside his work as an educator and consultant.",
};

const hardTruth: SermonDetail = {
  id: "seed-sermon-1",
  slug: "the-hard-truth-about-the-kingdom",
  title: "The Hard Truth About the Kingdom",
  thesis: "God celebrates faithfulness.",
  scripture_ref: "Matthew 25:14–30",
  scripture_text:
    "“Well done, good and faithful servant. You have been faithful over a little; I will set you over much. Enter into the joy of your master.”",
  sermon_date: "2026-07-19",
  artwork_url: "/sermons/the-hard-truth-about-the-kingdom/artwork.jpg",
  summary:
    "Jesus told a story about a master, three servants, and a long absence — and it does not end the way we would write it. The parable of the talents is warm to the workers and unsparing to the fearful, and it asks a question most of us would rather not sit with: what did you do with what you were given? This lesson walks through each servant and lands on five hard truths about how the Kingdom actually works.",
  youtube_url: "https://youtu.be/BrBm6-QasUo",
  podcast_url: null,
  guide_url: "/sermons/the-hard-truth-about-the-kingdom/reflection-guide.pdf",
  pdf_url: null,
  is_featured: false,
  deck_slug: "the-hard-truth",
  speaker: joe,
  // Points drawn from Joe's sermon outline (past_sermons/the_hard_truth/).
  points: [
    {
      position: 1,
      title: "The Kingdom Comes First",
      label: "Matthew 6:33",
      body: "If you don't get the Kingdom right, you don't get Jesus right. The Kingdom wasn't a side topic for Jesus — it was His central message, the thread that tied all of His teaching together. That's why He said it must come first: \"Seek first the Kingdom of God.\"",
    },
    {
      position: 2,
      title: "The Five-Talented Servant",
      label: "Five Talents",
      body: "When he received the five talents, he knew the expectation — a huge problem to solve, no experience, new things to learn. However he learned, the knowledge became a process, the process became a habit, and when it came time to take action, he did. God celebrates trust.",
    },
    {
      position: 3,
      title: "The Two-Talented Servant",
      label: "Two Talents",
      body: "He could have complained — \"Why did he get five and I only got two?\" Instead, he put his talents to work. The Kingdom is not built on comparison. It is built on faithfulness with what you have been uniquely given.",
    },
    {
      position: 4,
      title: "The One-Talented Servant",
      label: "One Talent",
      body: "The Bible tells us exactly what he was thinking: he was afraid. He buried the talent, protected it, and completely failed to use it. Fear stops the flow of faith — and it kept him from ever discovering what faith could have accomplished.",
    },
    {
      position: 5,
      title: "Five Hard Truths",
      label: "The Reckoning",
      body: "Everyone has talent. Time is an opportunity — you're on the clock. Talent is meant to be used, not admired. Results matter, because accountability is real. And talents increase only when you use them.",
    },
  ],
};

const bagOfSeeds: SermonDetail = {
  id: "seed-sermon-2",
  slug: "the-bag-of-seeds",
  title: "The Bag of Seeds",
  thesis: "What are you carrying — and what will you plant?",
  scripture_ref: "Matthew 13:1–23",
  scripture_text: "“A sower went out to sow… He who has ears, let him hear.”",
  sermon_date: "2026-07-26",
  artwork_url: "/sermons/the-bag-of-seeds/artwork.jpg",
  summary:
    "Jesus sat down by the sea and told a story about a sower who scattered seed everywhere he went — on the path, in the rocks, among the thorns, and into good soil. The seed is God's Word. The soil is our heart. The harvest is changed lives. And the question the parable keeps asking is the one this lesson sits with: what's still in your bag, what keeps it closed, and who is ready for what you're carrying? Growing the seed is God's work. Emptying the bag is ours.",
  youtube_url: "https://youtu.be/q1ILOtr_yAM",
  podcast_url: null,
  guide_url: "/sermons/the-bag-of-seeds/reflection-guide.pdf",
  pdf_url: null,
  is_featured: true,
  deck_slug: "the-bag-of-seeds",
  speaker: joe,
  // Points drawn from Joe's sermon outline (past_sermons/the_bag_of_seeds/).
  points: [
    {
      position: 1,
      title: "Every Believer Carries a Bag",
      label: "On Purpose",
      body: "The farmer in Jesus' parable scatters his seed everywhere — he never sends soil samples to the lab. God has been filling your bag your whole life. He doesn't consult your past to determine your future; He gives your past a new purpose. God doesn't measure the bag. He watches what leaves it.",
    },
    {
      position: 2,
      title: "The Bag Was Never Meant to Stay Full",
      label: "Empty the Bag",
      body: "Seed has one purpose: to leave the bag and be planted. A farmer is measured by what he plants, not by what he owns — and sowing is intentional; no field was ever planted by accident. The rich fool built a bigger barn. Barnabas kept emptying his hands.",
    },
    {
      position: 3,
      title: "Every Generation Has a Bag",
      label: "One Courageous Yes",
      body: "\"I don't know enough.\" \"I'm too busy.\" \"My time has passed.\" Every generation has its own excuse — and every excuse keeps the seed in the bag. Every Kingdom conversation begins with one courageous yes.",
    },
    {
      position: 4,
      title: "Emptying Is Our Job. Growing Is God's.",
      label: "We Plant. God Grows.",
      body: "The sower never makes a single seed grow — that was never his job. Paul plants, Apollos waters, God gives the increase. Our assignment isn't to change hearts. Our job is to scatter the seed. We have the easy job.",
    },
    {
      position: 5,
      title: "Some Seeds Won't Grow Until After You're Gone",
      label: "Sow Today. Change Tomorrow.",
      body: "That's not failure — that's seed growing when it's ready. Who sowed into you? Someone whose seed is still growing, who may never have seen the harvest. The most powerful seeds you sow will yield their harvest in your absence. Your legacy is in the seed you sow.",
    },
  ],
};

export const seedSermons: SermonDetail[] = [hardTruth, bagOfSeeds];

/**
 * Slide decks — Joe's real image slides, served from
 * public/sermons/[slug]/slides/NN.jpg. Each deck's HTML is a single
 * full-bleed <img> per slide (styled by app/slides/slides.css).
 */

function imageSlide(dir: string, n: number, alt: string): string {
  const file = String(n).padStart(2, "0");
  return `<img class="slide-image" src="/sermons/${dir}/slides/${file}.jpg" alt="${alt}">`;
}

/** Authoring shape — outline_html and bg default to null in buildDeck. */
type SeedSlideInput = {
  position: number;
  html: string;
  notes: string | null;
  outline_html?: string;
  bg?: string;
};

const hardTruthSlides: SeedSlideInput[] = [
  {
    position: 1,
    html: imageSlide("the-hard-truth-about-the-kingdom", 1, "The Hard Truth About the Kingdom — Matthew 25:14–30"),
    notes: "Welcome everyone. Read Matthew 25:14–30 in full. It sounds like a story about money — it isn't.",
  },
  {
    position: 2,
    html: imageSlide("the-hard-truth-about-the-kingdom", 2, "Introduction — The Kingdom Comes First. Seek first the Kingdom of God, Matthew 6:33"),
    notes: "If you don't get the Kingdom right, you don't get Jesus right. The Kingdom was Jesus' central message — Matthew 6:33.",
  },
  {
    position: 3,
    html: imageSlide("the-hard-truth-about-the-kingdom", 3, "The Five-Talented Servant — Prepared. Faithful. Fruitful. God celebrates trust."),
    notes: "He knew the expectation. He learned, built a process, made it a habit — and when it came time to act, he did. God celebrates trust.",
  },
  {
    position: 4,
    html: imageSlide("the-hard-truth-about-the-kingdom", 4, "Faithfulness, Not Comparison — be faithful with what you have"),
    notes: "He could have complained — 'Why did he get five and I only got two?' Instead he put his talents to work. Faithfulness, not comparison.",
  },
  {
    position: 5,
    html: imageSlide("the-hard-truth-about-the-kingdom", 5, "Fear Buries Potential — don't bury what God has entrusted to you"),
    notes: "He was afraid. He protected the talent and completely failed to use it. Fear stops the flow of faith — slow down here.",
  },
  {
    position: 6,
    html: imageSlide("the-hard-truth-about-the-kingdom", 6, "Five Hard Truths About the Kingdom — wake up, step up, get to work"),
    notes: "Everyone has talent. You're on the clock. Talent is meant to be used, not admired. Accountability is real. Talents increase only when you use them.",
  },
  {
    position: 7,
    html: imageSlide("the-hard-truth-about-the-kingdom", 7, "Faithful Today. Impact Tomorrow. The Kingdom Forever. — Well done, good and faithful servant, Matthew 25:21"),
    notes: "Final challenges: What talent have you buried? What step of faith have you been afraid to take? Land Matthew 25:21 — 'Well done.'",
  },
];

const bagOfSeedsSlides: SeedSlideInput[] = [
  {
    position: 1,
    html: imageSlide("the-bag-of-seeds", 1, "The Bag of Seeds — Full Bags vs Empty Bags, Matthew 13:1–23"),
    notes: "Welcome. Read Matthew 13:1–23. This time, you're not the soil — you're the sower.",
  },
  {
    position: 2,
    html: imageSlide("the-bag-of-seeds", 2, "Point one — Every believer carries a bag. Your bag is not random; it's on purpose."),
    notes: "The farmer scatters everywhere — he never sends soil samples to the lab. God doesn't consult your past to determine your future.",
  },
  {
    position: 3,
    html: imageSlide("the-bag-of-seeds", 3, "Point two — The bag was never meant to stay full. Empty the bag, multiply the seed."),
    notes: "Seed has one purpose: to leave the bag. Rich fool vs Barnabas — one built a bigger barn, the other kept emptying his hands.",
  },
  {
    position: 4,
    html: imageSlide("the-bag-of-seeds", 4, "Point three — Every generation has a bag. Don't let fear or 'not yet' keep your bag full."),
    notes: "Young: 'I don't know enough.' Busy: 'I'm too busy.' Seasoned: 'My time has passed.' Every Kingdom conversation begins with one courageous yes.",
  },
  {
    position: 5,
    html: imageSlide("the-bag-of-seeds", 5, "Point four — Emptying is our job. Growing is God's. We plant, we water, God gives the increase."),
    notes: "The sower never makes a single seed grow. Jonah vs Ananias. Our job is to scatter the seed — we have the easy job.",
  },
  {
    position: 6,
    html: imageSlide("the-bag-of-seeds", 6, "Point five — Some seeds won't grow until after you're gone. Sow today, change tomorrow."),
    notes: "That's not failure — that's seed growing when it's ready. Joseph's bones. The most powerful seeds yield their harvest in your absence.",
  },
  {
    position: 7,
    html: imageSlide("the-bag-of-seeds", 7, "Closing — God never asked us to become the harvest. He simply asked us to empty the bag."),
    notes: "Empty the bag. Trust God with the harvest. Jesus sowed every seed He had — He poured it all out on the cross. Invitation.",
  },
];

/**
 * Open Water Faith — converted from Joe's hand-built presentation module.
 * Video-loop backgrounds: "shore" (beached boat) until "Cut the Rope",
 * then "open" (open water) to the end. Split quotes are single slides
 * with staged reveals — one click, the second line lands on its own.
 * Empty html = background only (story beats live in the outline).
 */
const openWaterFaithSlides: SeedSlideInput[] = [
  {
    position: 1,
    bg: "shore",
    html: `<p class="kicker">The Cisco Church</p><div class="rule-line"></div><h1>Open Water Faith</h1><p class="sub">Don't miss the adventure because you never left the shore.</p>`,
    outline_html: `<p><strong>Open Water Faith</strong> — title up. Hold through the welcome.</p>`,
    notes: "Hold through the welcome.",
  },
  {
    position: 2,
    bg: "shore",
    html: "",
    outline_html: `<p><strong>Noah and the ark.</strong> We can do a lot of things with boats. In Genesis, God had Noah build an ark — built on dry ground, but it wasn't designed for dry ground. Its purpose could only be realized when the water came.</p>`,
    notes: "Background only.",
  },
  {
    position: 3,
    bg: "shore",
    html: `<h2 class="stage" data-stage="1">It's easy to be satisfied with what a boat can do&hellip;</h2><h2 class="stage" data-stage="2">&hellip;without ever experiencing what it was designed to do.</h2>`,
    outline_html: `<p>It's easy to be satisfied with what a boat can do&hellip; &hellip;without ever experiencing what it was designed to do.</p>`,
    notes: "One click — the second line lands by itself after a beat.",
  },
  {
    position: 4,
    bg: "shore",
    html: `<blockquote>What if we spend our lives trying to keep the boat where it feels safest instead of discovering what it was built for?</blockquote>`,
    outline_html: `<p>What if we spend our lives trying to keep the boat where it feels safest instead of discovering what it was built for?</p>`,
    notes: "Ask the room. Let it sit.",
  },
  {
    position: 5,
    bg: "shore",
    html: "",
    outline_html: `<p><strong>Story — the glass-bottom boat.</strong> Grade school field trip: Aquarena Springs, San Marcos. We could see straight through — the fish, the ground of the river. As the boat moved into deeper water the bottom drifted further away, but you began to see different fish, different things swimming around.</p>`,
    notes: "Background only.",
  },
  {
    position: 6,
    bg: "shore",
    html: `<h2 class="sm">And I wonder sometimes if we settle for seeing only what can be seen from shallow water.</h2>`,
    outline_html: `<p>And I wonder sometimes if we settle for seeing only what can be seen from shallow water.</p>`,
    notes: null,
  },
  {
    position: 7,
    bg: "shore",
    html: "",
    outline_html: `<p><strong>Story — our family boat.</strong> There is a lot you can do with a boat. My wife loves to fish — we used to go out on the lake.</p>`,
    notes: "Background only.",
  },
  {
    position: 8,
    bg: "shore",
    html: `<h2>Luke 5:4</h2><p class="sub">We could have used Jesus</p>`,
    outline_html: `<p><strong>Read Luke 5:4.</strong> Jesus instructs to go deeper — cast your nets again. Peter didn't want to, but he did. Net full — almost sank his boat and the boat that came to help him.</p>`,
    notes: "Read the passage before advancing.",
  },
  {
    position: 9,
    bg: "shore",
    html: `<h2 class="stage" data-stage="1">There may be more to our faith than what we have experienced so far&hellip;</h2><h2 class="stage" data-stage="2">&hellip;but experiencing it requires us to move beyond where we are.</h2>`,
    outline_html: `<p>There may be more to our faith than what we have experienced so far&hellip; &hellip;but experiencing it requires us to move beyond where we are.</p>`,
    notes: "One click — second line lands on its own.",
  },
  {
    position: 10,
    bg: "shore",
    html: "",
    outline_html: `<p><strong>Callback — glass-bottom boat.</strong> The boat ride taught me something I didn't understand until much later: the farther we moved from the shoreline, the more there was to see. Maybe that's true of many things. And on the other hand — it's possible to spend years around the water and never discover what's farther out.</p>`,
    notes: "Background only.",
  },
  {
    position: 11,
    bg: "shore",
    html: `<h2>Matthew 4:19</h2><p class="sub">A new meaning of fishing</p>`,
    outline_html: `<p><strong>Matthew 4:19.</strong> They left their fishing careers to become fishers of people. Maybe they weren't great fishermen — Jesus gave them a promotion. He elevated the concept of fishing: no longer fishers of fish, but fishers of men.</p>`,
    notes: null,
  },
  {
    position: 12,
    bg: "shore",
    html: `<h2>Jesus didn't just change their occupation. He changed their purpose.</h2>`,
    outline_html: `<p>Jesus didn't just change their occupation. He changed their purpose. Fishing became more than making a living — it became changing the world.</p>`,
    notes: null,
  },
  {
    position: 13,
    bg: "shore",
    html: `<h2>So &mdash; how do you catch a boatload of fish?</h2><p class="sub">Three answers</p>`,
    outline_html: `<p><strong>The question: how do you catch a boatload of fish?</strong> Three answers follow — cut the rope &middot; stop talking trash &middot; experience open water.</p>`,
    notes: null,
  },
  {
    position: 14,
    bg: "open",
    html: `<p class="kicker">Answer 1 of 3</p><div class="rule-line"></div><h2>Cut the Rope</h2><p class="sub">Stop fishing at the shore</p>`,
    outline_html: `<p><strong>Answer 1 — Cut the Rope.</strong> Stop fishing at the shore. You can't discover open water while tied to the dock.</p>`,
    notes: "THE BACKGROUND LAUNCHES HERE — beached boat becomes open water. Give it a beat before you speak.",
  },
  {
    position: 15,
    bg: "open",
    html: `<h2>Comfort has never launched a mission.</h2>`,
    outline_html: `<p>Comfort has never launched a mission. If comfort launched something, it would stop being comfortable. There has never been a great step of faith that didn't create some conflict. If there's no tension — you're probably still standing on the shore.</p>`,
    notes: null,
  },
  {
    position: 16,
    bg: "open",
    html: `<h2 class="sm">Most people don't fail because they don't care. They fail because they've never left the shoreline.</h2>`,
    outline_html: `<p>Most people don't fail because they don't care. They fail because they've never left the shoreline.</p><p>Then ask: what does someone's faith look like that has never left shallow water?</p>`,
    notes: null,
  },
  {
    position: 17,
    bg: "open",
    html: "",
    outline_html: `<p><strong>Story — my first fish.</strong> A perch, about the size of a crunchy taco. I wanted to grill it and invite all my friends over. First-fish excitement can be over-lived.</p>`,
    notes: "Background only.",
  },
  {
    position: 18,
    bg: "open",
    html: "",
    outline_html: `<p><strong>The fish were in deeper water.</strong> The miracle wasn't at the shore — it was waiting where Peter didn't want to go. Obedience often feels unreasonable until you see the catch. Peter wasn't lacking skill; he was lacking expectation. He'd proven he knew how to fish. Jesus wanted to teach him how to trust.</p>`,
    notes: "Background only.",
  },
  {
    position: 19,
    bg: "open",
    html: `<h2 class="sm">Faith goes deeper when we have something to learn instead of something to prove.</h2>`,
    outline_html: `<p>Faith goes deeper when we have something to learn instead of something to prove.</p>`,
    notes: null,
  },
  {
    position: 20,
    bg: "open",
    html: `<p class="kicker">Answer 2 of 3</p><div class="rule-line"></div><h2 class="sm">Stop Talking Trash About Deep Water Fishermen</h2><p class="sub">Learn from the people whose nets are already full</p>`,
    outline_html: `<p><strong>Answer 2 — Stop talking trash about deep water fishermen.</strong> Learn from the people whose nets are already full.</p>`,
    notes: null,
  },
  {
    position: 21,
    bg: "open",
    html: `<h2 class="sm">Criticism is often the language of people who never left the shore.</h2>`,
    outline_html: `<p>Criticism is often the language of people who never left the shore. Don't mock what you haven't experienced. God's calling is usually much clearer than our excuses — and clarity demands a decision.</p>`,
    notes: null,
  },
  {
    position: 22,
    bg: "open",
    html: `<h2 class="sm">The people that have been there are the ones that can take you there.</h2>`,
    outline_html: `<p>The people that have been there are the ones that can take you there. You can't take others to a place you've never been.</p><p>Learn from experienced fishermen: people want immediate results, the spotlight without the sacrifices, the miracle without leaving the shoreline, the catch without rowing into deep water.</p>`,
    notes: null,
  },
  {
    position: 23,
    bg: "open",
    html: `<h2 class="sm">The things no one sees bring about the results everyone wants.</h2>`,
    outline_html: `<p>The things no one sees bring about the results everyone wants.</p>`,
    notes: null,
  },
  {
    position: 24,
    bg: "open",
    html: `<div class="pairs"><div><div class="lab">Nobody sees</div><ul><li>the rowing</li><li>the preparation</li><li>the bait</li><li>the repairing of nets</li><li>the courage</li></ul></div><div class="arw">&rarr;</div><div class="out">They only see the fish.</div></div>`,
    outline_html: `<p><strong>Nobody sees</strong> the rowing, the preparation, the bait, the repairing of nets, the courage &rarr; they only see the fish.</p>`,
    notes: null,
  },
  {
    position: 25,
    bg: "open",
    html: `<div class="pairs"><div><div class="lab">Nobody sees</div><ul><li>prayers</li><li>Bible study</li><li>mentoring</li><li>inviting</li><li>teaching</li><li>serving</li></ul></div><div class="arw">&rarr;</div><div class="out">They only see the baptisms.</div></div>`,
    outline_html: `<p><strong>Nobody sees</strong> prayers, Bible study, mentoring, inviting, teaching, serving &rarr; they only see the baptisms.</p><p>Everybody wants the catch. Few people want the deep water.</p>`,
    notes: null,
  },
  {
    position: 26,
    bg: "open",
    html: `<h2>Everybody celebrates the fish. Nobody celebrates the rowing.</h2>`,
    outline_html: `<p>Everybody celebrates the fish. Nobody celebrates the rowing.</p>`,
    notes: null,
  },
  {
    position: 27,
    bg: "open",
    html: `<p class="kicker">Answer 3 of 3</p><div class="rule-line"></div><h2>Experience Open Water Fishing</h2><p class="sub">Learn the deep things</p>`,
    outline_html: `<p><strong>Answer 3 — Experience open water fishing.</strong> Learn the deep things.</p>`,
    notes: null,
  },
  {
    position: 28,
    bg: "open",
    html: "",
    outline_html: `<p><strong>Story — the pet lobster.</strong></p>`,
    notes: "Background only.",
  },
  {
    position: 29,
    bg: "open",
    html: `<h2 class="sm">Going out into the deep doesn't make you stronger. It reveals whether you trust the Captain.</h2>`,
    outline_html: `<p>Going out into the deep doesn't make you stronger. It reveals whether you trust the Captain. Faith grows where the shore disappears. An anchored boat by the shore is a very different experience than the open ocean.</p>`,
    notes: null,
  },
  {
    position: 30,
    bg: "open",
    html: `<h2>Boats tied to the same dock eventually bump into each other.</h2>`,
    outline_html: `<p>Boats tied to the same dock eventually bump into each other. Boats on a mission in open water have the space to grow and experience greater things.</p>`,
    notes: null,
  },
  {
    position: 31,
    bg: "open",
    html: `<p class="kicker">Closing</p><div class="rule-line"></div><ul><li>Dust off your tacklebox &mdash; Matt. 25:29</li><li>Use what God has made available &mdash; Deut. 6:4&ndash;9</li><li>Try new things &mdash; John 21:6</li></ul>`,
    outline_html: `<p><strong>Closing.</strong> Dust off your tacklebox (Matt. 25:29) &middot; use what God has made available (Deut. 6:4&ndash;9) &middot; try new things (John 21:6).</p>`,
    notes: null,
  },
  {
    position: 32,
    bg: "open",
    html: "",
    outline_html: `<p><strong>Callback — the ark.</strong> A boat can look perfectly safe sitting on dry ground — but that's not what it was built for.</p>`,
    notes: "Background only.",
  },
  {
    position: 33,
    bg: "open",
    html: `<h2>The tragedy is not ignorance. The tragedy is unused knowledge.</h2>`,
    outline_html: `<p>The tragedy is not ignorance. The tragedy is unused knowledge.</p>`,
    notes: null,
  },
  {
    position: 34,
    bg: "open",
    html: `<h2 class="stage" data-stage="1">The goal isn't simply to get people into the boat.</h2><h2 class="stage" data-stage="2">The goal is to get the boat into the water.</h2>`,
    outline_html: `<p>The goal isn't simply to get people into the boat. The goal is to get the boat into the water.</p><p>That's where you trust God.</p>`,
    notes: "One click — the punch line lands on its own. Then: that's where you trust God.",
  },
  {
    position: 35,
    bg: "open",
    html: `<h2>The church was never built to be a marina.</h2>`,
    outline_html: `<p>The church was never built to be a marina. A church can have a boat, maintain it, repair it, admire it, sit together in it — and still never launch.</p>`,
    notes: null,
  },
  {
    position: 36,
    bg: "open",
    html: "",
    outline_html: `<p><strong>Callback — glass-bottom boat, bring it home.</strong> When I got on that boat as a kid, I didn't know what was waiting farther out. I was already impressed by what I could see when we first got on. But the boat didn't stay there. It moved. And the farther we went, the more there was to see. Maybe that's the invitation Jesus is giving us.</p><p>Peter had already been fishing. Already worked. Already used his nets. But Jesus was about to show him something he had never experienced. The difference: Peter had to be willing to go where Jesus told him. Further. Deeper.</p>`,
    notes: "Background only.",
  },
  {
    position: 37,
    bg: "open",
    html: `<blockquote>What is Jesus waiting to show you that you will never experience from the shoreline?</blockquote>`,
    outline_html: `<p>What is Jesus waiting to show you that you will never experience from the shoreline?</p>`,
    notes: "Ask the room. Then: God didn't call us to admire the water. He called us to launch into it.",
  },
  {
    position: 38,
    bg: "open",
    html: `<h2>Deep water isn't a place. It's a decision.</h2>`,
    outline_html: `<p>Deep water isn't a place. It's a decision.</p>`,
    notes: null,
  },
  {
    position: 39,
    bg: "open",
    html: `<h2 class="sm">And maybe the greatest thing God still wants to do through your life is something you can't see from the shoreline.</h2>`,
    outline_html: `<p>And maybe the greatest thing God still wants to do through your life is something you can't see from the shoreline.</p>`,
    notes: "Final slide. Leave it up.",
  },
  {
    position: 40,
    bg: "open",
    html: "",
    outline_html: `<p><strong>Background only</strong> — invitation / closing prayer.</p>`,
    notes: null,
  },
];

/**
 * The Obvious — Deuteronomy 6:4–9, 20.
 *
 * DESIGN SYSTEM (agreed with Joe 2026-08-15):
 *  · Slide 1 is Joe's title artwork; it sets colors + type for everything.
 *  · Every other slide sits on the SAME vintage-parchment ground — no
 *    background changes mid-sermon, nothing for the room to wonder about.
 *  · Two type families only, both from the title art: Archivo (heavy caps
 *    display + spaced labels) and Newsreader (statements + questions).
 *  · Slides are ANCHORS, not captions: one per movement-beat, holding for
 *    minutes while the preacher talks. Nothing below ~44px at 1080p.
 *  · The FULL outline lives in outline_html — it is Joe's pulpit manuscript
 *    on the controller, kept in his own wording.
 */
const OBVIOUS_TITLE = `<img class="slide-image" src="/sermons/the-obvious/title.jpg" alt="The Obvious — the key to transformation is right under our nose. Deuteronomy 6:4–9, 20">`;

/** Every content slide: one ground, one panel, one breathing hairline. */
function ob(panelHtml: string): string {
  return `<div class="fill parchment"></div><div class="panel wide">${panelHtml}</div><div class="ambient-rule"></div>`;
}

const theObviousSlides: SeedSlideInput[] = [
  /* ---------------- opening ---------------- */
  {
    position: 1,
    html: OBVIOUS_TITLE,
    outline_html: `<p><strong>THE OBVIOUS</strong> — <em>The key to transformation is right under our nose.</em></p><p>It's strange how easily we can overlook the events of transformation simply because we stare at them every day.</p>`,
    notes: "Title up. Let it breathe through the welcome.",
  },
  {
    position: 2,
    html: ob(
      `<div class="statement">Sometimes the most difficult things to see are not the things that are hidden.</div>`,
    ),
    outline_html: `<p>Sometimes the <strong>most difficult things to see</strong> are not the things that are hidden.</p><p>&ndash; They're the things that <strong>become all too familiar.</strong></p><p>We can spend a lot of time thinking about <strong>what we need but don't have.</strong></p><p>&ndash; The hidden belief is that transformation is expensive, requires a lot of trouble.<br>&ndash; More money. More people. More talent. More opportunities. More resources.</p>`,
    notes: "The screen holds the setup. YOU land 'all too familiar.'",
  },
  {
    position: 3,
    html: ob(
      `<p class="kicker">What if&hellip;</p><div class="question">&hellip;we're overlooking what God has already put <strong>right in front of us?</strong></div>`,
    ),
    outline_html: `<p><strong>What if</strong> one of our biggest problems <strong>isn't what we don't have?</strong></p><p><strong>What if</strong> we're overlooking what God has already <strong>put right in front of us?</strong></p><p>How can something be right in front of us every day — but yet we never see what it could become?</p><p><strong>How do we miss what's right in front of us?</strong> We buy technology and immediately learn how it can entertain us. We discover a new restaurant and think about eating there. We get a new vehicle and think about where we can go. We meet somebody new and we start looking for what we have in common.</p><p>Nothing wrong with any of that.</p>`,
    notes: "Both 'what if' questions live here — deliver the first one before the slide's line.",
  },
  {
    position: 4,
    html: ob(
      `<p class="kicker">The question we rarely ask</p><div class="question">&ldquo;How could God use this for His purpose?&rdquo;</div>`,
    ),
    outline_html: `<p><strong>But what if</strong> there is another question we rarely ask?</p><p><strong>How could God use this for His purpose?</strong></p><p><strong>Is it possible</strong> that the place to start is by just using what we already have?</p>`,
    notes: "The anchor question of the whole sermon. It comes back at the end. Let it sit.",
  },

  /* ---------------- Moses: look around ---------------- */
  {
    position: 5,
    html: ob(
      `<p class="kicker">Deuteronomy 6:4&ndash;9</p><div class="scripture">Hear, O Israel: The LORD our God, the LORD is one. Love the LORD your God with all your heart and with all your soul and with all your strength. <em>These commandments that I give you today are to be on your hearts.</em> Impress them on your children. Talk about them when you sit at home and when you walk along the road, when you lie down and when you get up. Tie them as symbols on your hands and bind them on your foreheads. Write them on the doorframes of your houses and on your gates.</div>`,
    ),
    outline_html: `<p><strong>Moses told the Israelites, &ldquo;Look around, people.&rdquo;</strong></p><p>Background to Deut. — <strong>read Deut. 6:4&ndash;9.</strong></p><p><strong>Moses wasn't merely giving them information. He's teaching them to build a new perspective.</strong></p><p><strong>Don't confine</strong> God's Word to one religious moment. Surround yourself with reminders of it. Build it into your day. Build it into your house. Build it into your relationships. Build it into the raising of your children.</p>`,
    notes: "The verse is on the screen (your outline's instruction). Read it, then teach from it.",
  },
  {
    position: 6,
    html: ob(`<div class="mega">&ldquo;Look around, people.&rdquo;</div>`),
    outline_html: `<p>&ldquo;These commandments that I give you today are to be on your hearts.&rdquo; — <strong>Destination:</strong> the heart. <strong>The means:</strong> doorpost, hand, forehead, conversations, morning, evening, and roadway.</p><p>Your house? <strong>Use it.</strong> Your doorway? <strong>Use it.</strong> Your hands? <strong>Use them.</strong> Your forehead? <strong>Use it.</strong> Your conversations with your children? <strong>Use them.</strong> Walking down the road? <strong>Use that.</strong> Sitting around the house? <strong>Use that.</strong> Getting up in the morning? <strong>Use that.</strong> Going to bed? <strong>Use that.</strong></p><p>Moses isn't pointing them toward <strong>some extraordinary resource.</strong> He's saying: <strong>Look around.</strong> There's a door — write it there. You have children — talk to them. You're going somewhere — talk about it while you're walking. You're sitting around the house — talk about it there. You're getting ready for bed — there's another opportunity. You're waking up — there's another one.</p><p><strong>Moses is calling on us to turn ordinary events into a DELIVERY SYSTEM for the Word of God.</strong></p>`,
    notes: "This one anchor holds the entire 'use it' litany. The screen stays put; you deliver.",
  },
  {
    position: 7,
    html: ob(
      `<p class="kicker">Make the Word of God part of the</p><div class="mega">Architecture</div><div class="question">of your life.</div>`,
    ),
    outline_html: `<p>This wasn't: &ldquo;Remember to have a Bible lesson occasionally.&rdquo; It was much bigger.</p><p><strong>Make the Word of God part of the architecture of your life.</strong></p><p>Israel now possessed God's revealed instruction in a form that could be remembered, taught, repeated, written, displayed, and deliberately passed from one generation to another.</p>`,
    notes: "The landing of the Moses movement.",
  },

  /* ---------------- the question nobody is asking ---------------- */
  {
    position: 8,
    html: ob(
      `<p class="kicker">None of those events were new</p><div class="statement">What Moses changed was <strong>the purpose attached to them.</strong></div>`,
    ),
    outline_html: `<p><strong>There's a question nobody is asking: why would Moses have to tell them this?</strong></p><p><strong>Moses is commanding something that apparently wasn't happening automatically.</strong></p><p>They had doors before Moses mentioned doorposts. They had homes. They had children. They had conversations. They walked the roads. They woke up. They went to sleep.</p><p>None of those events were new. What Moses changed was <strong>the purpose attached to them.</strong></p>`,
    notes: null,
  },
  {
    position: 9,
    html: ob(
      `<div class="statement">Maybe we just haven't learned how to see the <strong>Kingdom possibilities</strong> in the resources we <strong>already have.</strong></div>`,
    ),
    outline_html: `<p><strong>Maybe our greatest Kingdom problem isn't that we don't have enough resources.</strong></p><p><strong>Maybe we just haven't learned how to see the Kingdom possibilities in the resources we already have.</strong></p>`,
    notes: "The thesis of the sermon, restated. Slow down.",
  },
  {
    position: 10,
    html: ob(
      `<p class="kicker">Obvious questions</p><div class="rows"><div><span class="q">What do I <strong>already</strong> have?</span></div><div><span class="q">Who do I <strong>already</strong> know?</span></div><div><span class="q">Where do I <strong>already</strong> go?</span></div><div><span class="q">What am I <strong>already</strong> good at?</span></div><div><span class="q">What conversations am I <strong>already</strong> having?</span></div></div>`,
    ),
    outline_html: `<p><strong>Obvious questions:</strong> What do I already have? Who do I already know? Where do I already go? What am I already good at? What technology am I already using? What conversations am I already having? At what places am I already hanging out?</p><p>Moses wanted the Israelites to build habits that would keep them seeing it over and over — because whatever isn't <strong>deliberately built</strong> into our lives eventually gets crowded out by everything that is.</p><p><strong>God didn't give Israel new things to do. He gave them new reasons (perspectives).</strong></p>`,
    notes: "Read a couple, let the room fill in the rest.",
  },
  {
    position: 11,
    html: ob(
      `<p class="kicker">The danger wasn't scarcity</p><div class="mega">Walking into abundance and going blind.</div>`,
    ),
    outline_html: `<p>The danger wasn't scarcity. The danger wasn't the enemy. The danger wasn't the wilderness.</p><p><strong>The danger was walking into abundance and going blind.</strong></p><p>The solution was, <strong>create new habits.</strong></p>`,
    notes: null,
  },

  /* ---------------- our habits reveal what gets our best ---------------- */
  {
    position: 12,
    html: ob(
      `<div class="question">Has the Kingdom become something we <strong>believe in</strong> without becoming something we <strong>build our lives around?</strong></div>`,
    ),
    outline_html: `<p><strong>Our habits reveal what gets our best.</strong> Habits also explain <strong>why we overlook the obvious.</strong> We naturally build habits around what matters to us.</p><p>&ndash; We don't have to remind ourselves constantly to <strong>check our phones.</strong><br>&ndash; We don't need a <strong>discipleship class to teach</strong> us to open Facebook.<br>&ndash; Nobody needs to call me on Thursday afternoon and say: <em>&ldquo;Joe, remember, you're supposed to eat supper tonight.&rdquo;</em></p><p>Here's what we do: we buy technology and immediately learn how it can entertain us. We find a new restaurant and start planning our next dinner. We get a new vehicle and we plan a road trip.</p><p>Our lives naturally organize themselves around things we have decided matter. And that's where the uncomfortable question creeps in:</p><p><strong>Has the Kingdom become something we believe in without it becoming something we build our lives around? It's present in belief but absent in life.</strong></p>`,
    notes: "The supper line is the laugh — let it land before the uncomfortable question.",
  },
  {
    position: 13,
    html: ob(
      `<div class="statement">Attach the things of God to things <strong>you're already doing.</strong></div>`,
    ),
    outline_html: `<p>Moses is saying: <strong>Build habits that keep God from becoming peripheral.</strong></p><p>There's an idea in leadership called a <em>keystone habit</em> — one small &ldquo;key&rdquo; habit that begins influencing other areas of your life. (Floss &gt; &ldquo;I'm disciplined, feel great&rdquo; &gt; kiss the wife &gt; wake up ready to face the next day&hellip;)</p><p>And when I read Deuteronomy 6, it's clear that <strong>Moses understood that principle</strong> a long time ago. He doesn't tell them, &ldquo;Once a year, have a really big spiritual event and remind yourselves of God.&rdquo; He says when you get up — talk about it. When you sit around the house — talk about it. When you're traveling — talk about it. When you go to bed — talk about it.</p><p><strong>Attach the things of God to things you're already doing.</strong></p><p>Because sometimes one small, repeated habit can begin changing the environment of an entire life — hence, <strong>TRANSFORMATION!</strong></p>`,
    notes: null,
  },
  {
    position: 14,
    html: ob(
      `<p class="kicker">Romans 12:2</p><div class="scripture">Don't live the way this world lives. <em>Let your way of thinking be completely changed.</em> Then you will be able to test what God wants for you. And you will agree that what he wants is right. His plan is good and pleasing and perfect.</div>`,
    ),
    outline_html: `<p>The Apostle Paul taught that <strong>true transformation comes from God by changing how you think.</strong></p><p>Romans 12:2 (NIrV) — on the screen.</p>`,
    notes: null,
  },

  /* ---------------- one question ---------------- */
  {
    position: 15,
    html: ob(
      `<p class="kicker">Imagine if we started asking one question</p><div class="question">&ldquo;How can I use this moment for the Kingdom?&rdquo;</div>`,
    ),
    outline_html: `<p>What if for the next week you developed one new &ldquo;keystone&rdquo; habit? Every time you pick up something, walk into some place, meet somebody — you see it as an opportunity and then ask:</p><p><strong>&ldquo;How can I use this moment for the Kingdom?&rdquo;</strong></p><p>The whole passage from Deut. is teaching Israel to <strong>train themselves to notice God in everyday, mundane events.</strong></p><p>Bought a car? How could I use this for the Kingdom? New computer? How could I use it for the Kingdom? Love drinking coffee somewhere every morning? How could God use that place? Good at woodworking? How could God use that? Have a home? How could this home bless someone? Know how to make videos (reels)? How could that communicate the Kingdom? Are you an awesome cook? Who could sit around your table?</p><p><strong>Maybe that's the event that can make a difference for God's Kingdom.</strong></p>`,
    notes: "Your repeated question, now as the practical challenge.",
  },
  {
    position: 16,
    html: ob(
      `<div class="statement">Don't miss what God can do through something <strong>you've stopped noticing.</strong></div>`,
    ),
    outline_html: `<p><strong>Don't miss what God can do through something you've stopped noticing.</strong></p><p>Some of our greatest Kingdom opportunities may be hiding in plain sight.</p><p>One last thought&hellip;</p>`,
    notes: null,
  },

  /* ---------------- don't miss the handoff ---------------- */
  {
    position: 17,
    html: ob(`<p class="kicker">Deuteronomy 6:20</p><div class="mega">Don't miss the handoff.</div>`),
    outline_html: `<p><strong>Don't miss the handoff.</strong> Immediately after the instructions about teaching, Moses starts talking about <strong>children and future generations.</strong></p><p>And later in the chapter comes the beautiful question: &ldquo;In the future, when your son asks you, &lsquo;What is the meaning of the stipulations, decrees and laws&hellip;?&rsquo;&rdquo; (Deut. 6:20) — <em>You tell them what God did in Egypt.</em></p><p>Moses isn't only worried about whether <strong>this generation knows.</strong> He's thinking about what happens with <strong>the next generation:</strong></p><p><strong>Every generation inherits something from the generation before it. Every generation is teaching the generation behind it — even when it doesn't realize it's teaching.</strong></p><p>Question: <strong>How are we helping the next generation know, discover, and appreciate who God is?</strong></p>`,
    notes: null,
  },
  {
    position: 18,
    html: ob(
      `<div class="statement">We may have <strong>more ways to communicate</strong> than any generation in history &mdash; and still fail to communicate <strong>the thing that matters most.</strong></div>`,
    ),
    outline_html: `<p>In 2026 we have: phones, tablets, televisions, computers, websites, social media, text messaging, email, video, podcasts, coffee shops, restaurants, vehicles, homes, workplaces, friendships, hobbies, community events&hellip;</p><p>The problem certainly isn't that we don't have enough opportunities to influence others.</p><p><strong>We may have more ways to communicate than any generation in history — and still fail to communicate the thing that matters most.</strong></p>`,
    notes: null,
  },
  {
    position: 19,
    html: ob(
      `<div class="statement stage" data-stage="1">The last time God told Israel to put something on a doorframe&hellip;</div><div class="mega stage" data-stage="2">It was blood.</div>`,
    ),
    outline_html: `<p>Imagine where the Israelites stood&hellip;</p><p><strong>The last time God told Israel to put something on a doorframe, it was blood.</strong> (Egypt)</p><p>And it was the difference between life and death.</p>`,
    notes: "One click. The second line lands by itself — give it room. Slow down here.",
  },
  {
    position: 20,
    html: ob(
      `<p class="kicker">God has always done His most important work on</p><div class="mega">Ordinary doorways.</div><div class="question">Claim your doorway for the Kingdom.</div>`,
    ),
    outline_html: `<p><strong>God has always done His most important work on ordinary doorways.</strong></p><p><strong>Claim your doorway for the Kingdom.</strong></p>`,
    notes: null,
  },
  {
    position: 21,
    html: ob(
      `<p class="kicker">Joshua 24:15</p><div class="scripture">&ldquo;<em>As for me and my house, we will serve the Lord.</em>&rdquo;</div>`,
    ),
    outline_html: `<p>Near the end of his life, Joshua gathers the people of Israel at Shechem. He challenges them to give up foreign idols and choose whom they will follow.</p><p>Joshua said, <strong>&ldquo;As for me and my house, we will serve the Lord.&rdquo;</strong> (Joshua 24:15)</p><p><strong>Are you ready to reclaim your doorpost for the Kingdom?</strong> Walks, restaurants, cars, mornings, nights, etc.</p>`,
    notes: null,
  },
  {
    position: 22,
    html: ob(
      `<p class="kicker">The challenge</p><div class="nums"><div><span class="n">1</span><span class="t">Start taking notice of the daily events where transformation is hidden.</span></div><div><span class="n">2</span><span class="t">Build one &ldquo;keystone&rdquo; habit for the Kingdom and start seeing God appear in your life.</span></div></div>`,
    ),
    outline_html: `<p><strong>Final challenge:</strong></p><p>1. Start taking notice of the daily events where transformation is hidden.</p><p>2. Build one &ldquo;keystone&rdquo; habit for the Kingdom and start seeing God appear in your life.</p>`,
    notes: "Leave this up through the close.",
  },
  {
    position: 23,
    html: OBVIOUS_TITLE,
    outline_html: `<p><strong>Title screen</strong> — invitation / closing prayer.</p>`,
    notes: "Back to the title for the invitation.",
  },
];

/**
 * Knowledge — Joe supplied eight finished slide images; they ARE the deck.
 * Nothing is composed here. Each slide's outline_html is the text read off
 * that image, so the controller carries the lesson while the screen shows
 * the artwork exactly as designed.
 */
const theKnowledgeSlides: SeedSlideInput[] = [
  {
    position: 1,
    html: imageSlide("knowledge", 1, "Knowledge Begins with Simple Truths — Hebrews 6:1"),
    outline_html: `<p><strong>Knowledge Begins with Simple Truths</strong></p><p>Hebrews 6:1</p>`,
    notes: "Title. Let it hold through the introduction.",
  },
  {
    position: 2,
    html: imageSlide("knowledge", 2, "Knowledge Deepens Through Experience — James 1:2-4, I Corinthians 2:9-10"),
    outline_html: `<p><strong>Knowledge Deepens Through Experience</strong></p><p>James 1:2&ndash;4</p><p>I Corinthians 2:9&ndash;10</p>`,
    notes: "Read both passages before advancing.",
  },
  {
    position: 3,
    html: imageSlide("knowledge", 3, "Wisdom Keys For Bible Knowledge — Lesson 1: Knowledge Is Timeless. Lesson 2: Knowledge Is Transferrable."),
    outline_html: `<p><strong>Wisdom Keys For Bible Knowledge</strong></p><p><strong>Lesson 1 — Knowledge Is Timeless.</strong> Everything we learn is foundational. It has tremendous value for today. However, if we build on it, its value for the future is priceless. Bible knowledge is not static by design; what God teaches us is meant to keep unfolding.</p><p><strong>Lesson 2 — Knowledge Is Transferrable.</strong> Jesus taught us truths that invariably carry countless principles. While Jesus' teachings may each focus on a specific point, the wisdom in His teachings have many applications.</p>`,
    notes: "Two lessons on one slide — take them one at a time.",
  },
  {
    position: 4,
    html: imageSlide("knowledge", 4, "Bible Truths Do Not Stand Alone"),
    outline_html: `<p><strong>Bible Truths Do Not Stand Alone</strong></p><p>&middot; It's not about being right.</p><p>&middot; Bible knowledge is intended to be broad in application.</p><p>&middot; If you miss the principle, then you'll miss the truth.</p>`,
    notes: null,
  },
  {
    position: 5,
    html: imageSlide("knowledge", 5, "Five tips for knowledge and principles."),
    outline_html: `<p><strong>Five tips for knowledge and principles.</strong></p><p>1. Bible knowledge is not meant to stay private.</p><p>2. Principles outlast specific situations.</p><p>3. Application multiplies understanding.</p><p>4. Strength comes through shared knowledge.</p><p>5. Knowledge always points to the Greater Teacher.</p>`,
    notes: "Five tips — this slide holds through all of them.",
  },
  {
    position: 6,
    html: imageSlide("knowledge", 6, "Learning where and how to apply principles is the key to peace."),
    outline_html: `<p><strong>Learning where and how to apply principles is the key to peace.</strong></p>`,
    notes: null,
  },
  {
    position: 7,
    html: imageSlide("knowledge", 7, "Learning Principles Is Like Learning A Thousand Lessons"),
    outline_html: `<p><strong>Learning Principles Is Like Learning A Thousand Lessons</strong></p>`,
    notes: null,
  },
  {
    position: 8,
    html: imageSlide("knowledge", 8, "Reflections"),
    outline_html: `<p><strong>Reflections:</strong></p><p>&middot; What God teaches you is not just for you.</p><p>&middot; Principles are stronger than particulars.</p><p>&middot; Shared knowledge multiplies its impact.</p><p>&middot; Christ is the ultimate model for transferrable knowledge.</p>`,
    notes: "Closing reflections. Leave it up through the invitation.",
  },
];

type SeedDeckWithNotes = Deck & { slidesWithNotes: SlideWithNotes[] };

function buildDeck(
  id: string,
  slug: string,
  title: string,
  sermonSlug: string | null,
  slides: SeedSlideInput[],
  backgrounds: Deck["backgrounds"] = {},
): SeedDeckWithNotes {
  const normalized: SlideWithNotes[] = slides.map((s) => ({
    position: s.position,
    html: s.html,
    outline_html: s.outline_html ?? null,
    bg: s.bg ?? null,
    notes: s.notes,
  }));
  return {
    id,
    slug,
    title,
    sermon_slug: sermonSlug,
    backgrounds,
    slides: normalized.map(({ notes: _n, ...slide }) => slide),
    slidesWithNotes: normalized,
  };
}

export const seedDecks: SeedDeckWithNotes[] = [
  buildDeck("seed-deck-1", "the-hard-truth", "The Hard Truth About the Kingdom", "the-hard-truth-about-the-kingdom", hardTruthSlides),
  buildDeck("seed-deck-2", "the-bag-of-seeds", "The Bag of Seeds", "the-bag-of-seeds", bagOfSeedsSlides),
  buildDeck("seed-deck-3", "open-water-faith", "Open Water Faith", null, openWaterFaithSlides, {
    shore: { video: "/sermons/open-water-faith/bg/shore.mp4" },
    open: { video: "/sermons/open-water-faith/bg/open.mp4" },
  }),
  buildDeck("seed-deck-4", "the-obvious", "The Obvious", null, theObviousSlides),
  buildDeck("seed-deck-5", "knowledge", "Knowledge", null, theKnowledgeSlides),
];

export function findSeedDeck(slug: string): Deck | null {
  const found = seedDecks.find((d) => d.slug === slug);
  if (!found) return null;
  const { slidesWithNotes: _n, ...deck } = found;
  return deck;
}

export function seedDeckNotes(slug: string): { position: number; notes: string | null }[] | null {
  const found = seedDecks.find((d) => d.slug === slug);
  if (!found) return null;
  return found.slidesWithNotes.map((s) => ({ position: s.position, notes: s.notes }));
}

export const seedDeckState: DeckState = {
  current_slide: 1,
  is_live: false,
  is_blank: false,
};

export function seedSermonList(): Sermon[] {
  return seedSermons.map(({ points: _p, speaker: _s, deck_slug: _d, ...sermon }) => sermon);
}
