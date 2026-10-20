import type { Deck, DeckState, Sermon, SermonDetail, SeriesRef, SlideWithNotes, Speaker } from "./types";

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
  bio: "Joe is the minister of the Cisco congregation. He spent almost 30 years in education as a teacher and administrator, and has been involved in ministry for even longer.",
};

const hardTruth: SermonDetail = {
  id: "seed-sermon-1",
  slug: "the-hard-truth-about-the-kingdom",
  title: "The Hard Truth About the Kingdom",
  thesis: "God celebrates faithfulness.",
  teaser: null,
  scripture_ref: "Matthew 25:14–30",
  scripture_text:
    "“Well done, good and faithful servant. You have been faithful over a little; I will set you over much. Enter into the joy of your master.”",
  sermon_date: "2026-07-19",
  artwork_url: "/sermons/the-hard-truth-about-the-kingdom/artwork.jpg",
  summary:
    "Jesus told a story about a master, three servants, and a long absence — and it does not end the way we would write it. The parable of the talents is warm to the workers and unsparing to the fearful, and it asks a question most of us would rather not sit with: what did you do with what you were given? This lesson walks through each servant and lands on five hard truths about how the Kingdom actually works.",
  youtube_url: "https://youtu.be/BrBm6-QasUo",
  podcast_url: null,
  guide_url: "/downloads/the-hard-truth-about-the-kingdom/guide.pdf",
  pdf_url: null,
  // Drafted from lines already in Joe's outline — swap in his own picks.
  nuggets: [
    "God celebrates faithfulness.",
    "Talent is meant to be used, not admired.",
    "Fear stops the flow of faith.",
  ],
  guide_questions: [
    "What part of today's message challenged you the most?",
    "Where might God be inviting you to grow instead of simply staying comfortable?",
    "What opportunity may already be in front of you that you've overlooked because it seems too difficult, unfamiliar, or risky?",
    "When was the last time God asked you to learn something new, try something new, or trust Him in a new way?",
    "If following Christ only confirms what you've always believed and always done, is it possible God is inviting you to take a new step of faith? What might that step be?",
    "How can I connect to what God is already doing so that the talents He has entrusted to me can accomplish His purpose in His Kingdom?",
  ],
  series: null,
  lesson_number: null,
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
  teaser: null,
  scripture_ref: "Matthew 13:1–23",
  scripture_text: "“A sower went out to sow… He who has ears, let him hear.”",
  sermon_date: "2026-07-26",
  artwork_url: "/sermons/the-bag-of-seeds/artwork.jpg",
  summary:
    "Jesus sat down by the sea and told a story about a sower who scattered seed everywhere he went — on the path, in the rocks, among the thorns, and into good soil. The seed is God's Word. The soil is our heart. The harvest is changed lives. And the question the parable keeps asking is the one this lesson sits with: what's still in your bag, what keeps it closed, and who is ready for what you're carrying? Growing the seed is God's work. Emptying the bag is ours.",
  youtube_url: "https://youtu.be/q1ILOtr_yAM",
  podcast_url: null,
  guide_url: "/downloads/the-bag-of-seeds/guide.pdf",
  pdf_url: null,
  // Drafted from lines already in Joe's outline — swap in his own picks.
  nuggets: [
    "God doesn't measure the bag. He watches what leaves it.",
    "Emptying the bag is ours. Growing the seed is God's.",
    "Your legacy is in the seed you sow.",
  ],
  guide_questions: [
    "If you emptied your bag today, what would surprise you about what's inside?",
    "Is there a moment you can remember when you had the seed in your hand and chose not to plant it? What made you hold on?",
    "Who sowed into you — someone whose seed is still growing, who may never have seen the harvest?",
    "What keeps your bag closed: fear, comparison, “too busy,” or something quieter you haven't named?",
    "Who is one person, right now, whose heart may be ready for what you're carrying?",
    "What's one seed worth planting that you may never live to see grow?",
  ],
  series: null,
  lesson_number: null,
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


// October 2026 series on 1 Thessalonians 5:21–22. The series artwork is the
// slide Joe supplied for the series; each lesson can add its own.
const holdSeries: SeriesRef = {
  slug: "hold-on-to-what-is-good",
  title: "Hold On to What Is Good",
  scripture_ref: "1 Thessalonians 5:21–22",
  tagline: "Open to every good gift. Anchored in Christ.",
  artwork_url: "/series/hold-on-to-what-is-good/artwork.jpg",
};

// Lesson 1 — content drawn from Joe's manuscript (What_Is_Good_lsn_1_fnl.pdf);
// the reflection questions are drafts.
const theJesusTest: SermonDetail = {
  id: "seed-sermon-3",
  slug: "the-jesus-test",
  title: "The Jesus Test",
  thesis: null,
  teaser:
    "We live in a world filled with voices telling us what to believe, who to trust, and what is true. But that challenge isn’t new. God’s people have always lived among competing voices.\n\nIn The Jesus Test, we look at how Paul entered a world full of different beliefs without running from the conversation—and without accepting everything he heard. His example gives us a better way: keep Jesus at the center, test what we hear, and hold on to what is good.\n\nThe voices have changed. The challenge has not.",
  scripture_ref: "1 Thessalonians 5:21–22",
  scripture_text: "“…test them all; hold on to what is good, reject every kind of evil.”",
  sermon_date: "2026-10-04",
  artwork_url: null,
  summary:
    "The voices have changed; the challenge has not. From Abraham to Daniel to Paul in Athens, God’s people have always lived among competing voices — and ours now fit in a pocket. This first lesson in the series follows Paul into a city full of idols and ideas: he didn’t run, and he didn’t accept everything. He listened, recognized what was true, tested it, and brought the conversation to Jesus.",
  youtube_url: null,
  podcast_url: null,
  guide_url: null,
  pdf_url: null,
  nuggets: [
    "God doesn’t tell us to be afraid of everything we hear. He tells us to test it.",
    "Religion often begins with humanity reaching upward. The Gospel begins with God reaching downward.",
    "Paul didn’t run from the voices. He brought Jesus into the conversation.",
    "If Jesus is firmly at the center, we don’t have to be afraid of the noise around us.",
  ],
  guide_questions: [
    "Where do you hear the most competing voices about God and faith right now — screens, friends, family? Which ones get most of your attention?",
    "Every culture asks, “How do I reach God?” Where do you catch yourself acting as if the answer is something you have to earn? Read John 1:14 and Philippians 2:5–8: what does it mean to you that God came looking for you?",
    "Read Acts 17:16–34. Paul observed, listened, reasoned, and engaged. Which of those is hardest for you when you meet a belief you disagree with?",
    "Read 1 John 4:1–3 and 1 Corinthians 15:3–4. When you hear something new about faith, how could you use the three questions: What does it say about Jesus? Does it lead me toward following Jesus? Does it line up with what Jesus taught?",
    "Is there something good you’ve been slow to receive — a song, a book, a teacher, a conversation — because of who it came from? What would it look like to test it instead of dismissing it?",
    "“Embrace the greater. Talk through the lesser.” What belongs at the center of your life this week, and what has been crowding it?",
  ],
  series: holdSeries,
  lesson_number: 1,
  is_featured: false,
  deck_slug: "the-jesus-test",
  speaker: joe,
  points: [
    {
      position: 1,
      title: "Every Religion Asks: How Do I Reach God?",
      label: "The System",
      body: "Human beings have always been searching — Who is God? Why am I here? What happens when I die? How do I get to God? The answers have produced systems: meditation, discipline, ritual, pilgrimage, moral achievement, enlightenment. Not mocking any of them. People are searching. Three out of four people on earth identify with some religion — the search is as alive today as it was in ancient Athens, where Paul preached (Acts 17).",
    },
    {
      position: 2,
      title: "The Gospel Begins With God’s Love",
      label: "The Savior",
      body: "Before the Gospel tells us what we must do, it tells us what God has done. He came toward us because He loves us. The story of salvation begins not with humanity searching for God, but with a God whose love moves Him toward His creation — the Word became flesh and made His dwelling among us. At the center of Christianity is not a man climbing a throne. It is God stepping down from one.",
    },
    {
      position: 3,
      title: "Paul Didn’t Run From the Voices",
      label: "Acts 17:16–34",
      body: "God’s people have never lived in a world with only one voice — Abraham, Moses, Daniel, Jesus, Paul. Paul’s story is told in Acts 17:16–34. He walked into Athens, the great Greek city, full of idols and the latest ideas — and he observed, listened, reasoned, and engaged. He quoted their poets without accepting their whole worldview. He listened, recognized, tested, and redirected — and brought the conversation to Jesus.",
    },
    {
      position: 4,
      title: "Jesus Must Remain at the Center",
      label: "The Jesus Test",
      body: "Paul’s Athens was a city full of competing voices. Ours fits in our pocket — YouTube, Facebook, TikTok, podcasts, and more, all on one phone. We don’t suffer from a lack of information; we suffer from an abundance of voices. Tradition, culture, teachers, experience, and opinion can’t be the center. John doesn’t say believe every voice — and he doesn’t say be afraid of every voice. He says, “test the spirits” (1 John 4:1–3). And the test always comes back to Jesus: he must remain at the center.",
    },
    {
      position: 5,
      title: "Test It. Keep What Is Good. Leave What Isn’t.",
      label: "1 Thessalonians 5:21–22",
      body: "A critical spirit listens for what to reject. A discerning spirit listens carefully enough to recognize what is true. We don’t have to surrender our convictions in order to listen, and we don’t have to reject a person in order to disagree with them. Embrace the greater. Talk through the lesser. Jesus belongs at the center.",
    },
  ],
};

// Lesson 2 — announced (slide + teaser); content arrives with the manuscript.
const askBetterQuestions: SermonDetail = {
  id: "seed-sermon-4",
  slug: "ask-better-questions",
  title: "Ask Better Questions",
  thesis: null,
  teaser:
    "Sometimes the things we question most quickly are the things that are unfamiliar. But what about the things we’ve never thought to question at all?\n\nFaith doesn’t have to be afraid of honest questions. In fact, sometimes a better question can help us see Scripture—and even our own familiar ways of doing things—with fresh eyes.\n\nThis week, we’ll discover how a faith firmly anchored in Christ can be curious enough to listen, humble enough to examine, and courageous enough to ask:\n\nIs this what Scripture actually says—or simply what I’ve always assumed?",
  scripture_ref: "Proverbs 18:15",
  scripture_text: "“The heart of the discerning acquires knowledge, for the ears of the wise seek it out.”",
  sermon_date: "2026-10-11",
  artwork_url: "/sermons/ask-better-questions/artwork.jpg",
  summary:
    "Kids go through a phase of asking why, how, and what — and somewhere along the way many of us stop. But much of what we enjoy exists because someone before us dared to ask a better question: penicillin, gravity, relativity. Proverbs 18:15 says the heart of the discerning acquires knowledge, and the ears of the wise seek it out. The posture of wisdom is not “Let me find what is wrong with this,” but “Let me understand this better.” The Bereans of Acts 17:11 were open enough to listen and grounded enough to examine, and Scripture calls them noble for it. A faith that welcomes questions isn’t weaker. Ask better questions, ask deeper questions, seek to understand — because questions lead to conversations, to investigating, to sharing, and someone in the kingdom gets blessed.",
  youtube_url: null,
  podcast_url: null,
  guide_url: null,
  pdf_url: null,
  nuggets: [
    "Wisdom is curious before it is critical.",
    "The posture of wisdom is not, “Let me find what is wrong with this.” It is, “Let me understand this better.”",
    "They were open enough to listen and grounded enough to examine.",
    "A faith that welcomes questions isn’t weaker.",
  ],
  guide_questions: [
    "Think of a question someone once asked you — a child, a teacher, a friend — that changed how you saw something. What made it a better question than the ones you’d been asking?",
    "Read Proverbs 18:15. When you meet an idea or a teaching that is unfamiliar, which comes first for you: “Let me find what is wrong with this,” or “Let me understand this better”? What shapes that reaction?",
    "Read Matthew 6:33. Think of a time you wanted something so much that you kept looking until you found it. How strong is that wanting when it comes to seeking God’s kingdom first?",
    "Read Acts 17:10–12. The Bereans were open enough to listen and grounded enough to examine. Which of those two comes more naturally to you, and which takes more effort?",
    "Is there a question about your faith — or about something you’ve always simply assumed — that you have been hesitant to ask out loud? Who could you ask?",
    "Ask better questions. Ask deeper questions. Seek to understand. Which one will you practice this week, and with whom could that become a conversation?",
  ],
  series: holdSeries,
  lesson_number: 2,
  is_featured: false,
  deck_slug: "ask-better-questions",
  speaker: joe,
  points: [
    {
      position: 1,
      title: "Aren’t You Glad Someone Asked a Better Question?",
      label: "Curiosity",
      body: "Kids go through a phase of asking why, how, what. And much of what we enjoy exists because someone dared to ask a better question. Alexander Fleming noticed that mold had killed bacteria in one of his cultures and, instead of discarding it, investigated — penicillin. Isaac Newton wondered why an apple always fell straight toward the Earth — the start of gravity. Albert Einstein imagined traveling alongside a beam of light and questioned the assumptions about space and time.",
    },
    {
      position: 2,
      title: "Wisdom Is Curious Before It Is Critical",
      label: "Proverbs 18:15",
      body: "The posture of wisdom is not, “Let me find what is wrong with this.” It is, “Let me understand this better.” Wisdom begins by asking, “What can I learn?”",
    },
    {
      position: 3,
      title: "People Find What They Really Seek",
      label: "Matthew 6:33",
      body: "Jesus says to seek first the kingdom of God. The Spanish word is buscar — not a casual glance, but really going after something because you want to find it. When Dad sent me to the tool shed for the garden hoe, I wasn’t motivated. I didn’t want to pull weeds, so I wasn’t likely to find it. My sister was different with the Christmas presents. She wanted so badly to know what was inside that she kept looking until she found out. The difference wasn’t the searching — it was the wanting. Whoever really wants to find something seeks it out, and finds it. A person who wants to seek first the kingdom will find it. God will make sure of that.",
    },
    {
      position: 4,
      title: "The Bereans: Open Enough to Listen, Grounded Enough to Examine",
      label: "Acts 17:11",
      body: "They received the message with great eagerness and examined the Scriptures every day to see if what Paul said was true. Questioning the preacher was called noble, and nobody in that church got lectured for asking. These Jews stood out because other Jews were not like this. A faith that welcomes questions isn’t weaker — it’s Berean.",
    },
    {
      position: 5,
      title: "Questions Lead Somewhere",
      label: "Your Turn",
      body: "Ask better questions. Ask deeper questions. Seek to understand. Questions lead to conversations, to investigating, to sharing — and someone in the kingdom gets blessed.",
    },
  ],
};

/** Placeholder lessons: title + date only, so the series shows its whole run. */
function upcomingLesson(id: number, slug: string, title: string, date: string, lesson: number): SermonDetail {
  return {
    ...askBetterQuestions,
    id: `seed-sermon-${id}`,
    slug,
    title,
    teaser: null,
    sermon_date: date,
    artwork_url: null,
    lesson_number: lesson,
  };
}

// Lesson 3 — announced (slide + teaser); content arrives with the manuscript.
const withAllHisMight: SermonDetail = {
  ...upcomingLesson(5, "with-all-his-might", "With All His Might", "2026-10-18", 3),
  teaser:
    "When was the last time worship filled your heart so completely that you couldn’t help but express it?\n\nDavid worshiped before the Lord with all his might. His praise was joyful, expressive, and deeply personal. And in the New Testament, Paul encourages believers to be filled with the Spirit, singing and making melody in their hearts to the Lord.\n\nBut somewhere along the way, can worship become more about what we’re accustomed to than what we’re experiencing in our hearts?\n\nThis Sunday, we’ll explore what Scripture teaches about heartfelt worship, the joy of praising God, and learning to appreciate expressions of faith that may be different from our own.\n\nWhat if the question isn’t whether someone worships like we do, but whether their worship is drawing them closer to God?",
  scripture_ref: "2 Samuel 6:14 · Ephesians 5:18–20",
  scripture_text: null,
  artwork_url: "/sermons/with-all-his-might/artwork.jpg",
};
// Lesson 4 — announced (slide + teaser); content arrives with the manuscript.
const hopeForTheFamily: SermonDetail = {
  ...upcomingLesson(6, "hope-for-the-family", "Hope For The Family", "2026-10-25", 4),
  thesis: "Discovering What Matters. Building What Lasts.",
  teaser:
    "Every family wants to build something that lasts. But with so many challenges, changing expectations, and competing voices, how do we know what really matters?\n\nWhat values should guide our marriages, our parenting, and the decisions we make every day?\n\nMaybe building a stronger family isn’t about having all the answers. Maybe it’s about learning to ask better questions, discovering what matters most, and finding the wisdom to make good decisions.\n\nThis Sunday, October 25, join us as we explore how to build stronger families, seek wisdom, and hold on to what is good.",
  scripture_ref: null,
  scripture_text: null,
  artwork_url: "/sermons/hope-for-the-family/artwork.jpg",
};

export const seedSermons: SermonDetail[] = [
  hopeForTheFamily,
  withAllHisMight,
  askBetterQuestions,
  theJesusTest,
  hardTruth,
  bagOfSeeds,
];

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

/**
 * The Jesus Test (Lesson 1) — Joe's finished slide images, served from
 * public/sermons/the-jesus-test/slides/NN.jpg, where NN is Joe's slide number
 * from his manuscript.
 * 4:3 slides are fitted whole inside the 16:9 frame (soft blurred fill at the sides).
 */
const theJesusTestSlides: SeedSlideInput[] = [
  {
    position: 1,
    html: imageSlide("the-jesus-test", 1, "Hold On to What Is Good — Open to every good gift. Anchored in Christ."),
    outline_html: `<p><strong>Hold On to What Is Good</strong></p><p>Video: &ldquo;God Is Speaking&rdquo; by Joseph The Dreamer. God&rsquo;s voice is everywhere &mdash; the noise drowns it out.</p><p>God is still speaking. God is still reaching. God is still working in unexpected places and unexpected people.</p><p><strong>God&rsquo;s voice is not the only voice we hear.</strong></p><p>Series: Oct 11 Ask Better Questions &middot; Oct 18 With All His Might &middot; Oct 25 Hope For The Family.</p><p>This month is about learning to recognize what is good &mdash; another tradition, teacher, song, book, conversation, even someone we strongly disagree with. We don&rsquo;t have to endorse everything to recognize something true.</p><p>Two extremes: accept everything, reject everything. Neither requires discernment.</p>`,
    notes: "Title. Hold through the opening video and the series introduction. Weekly reminder: anything mentioned this month is offered to learn from and evaluate, not as a blanket endorsement.",
  },
  {
    position: 2,
    html: imageSlide("the-jesus-test", 2, "System — How can I reach God?"),
    outline_html: `<p><strong>System &mdash; &ldquo;How can I reach God?&rdquo;</strong></p><p>Every culture asks the same questions: Who is God? Why am I here? What is wrong with us? What happens when I die? How do I get to God?</p><p>The answers have produced systems: meditation, discipline, ritual, pilgrimage, prescribed prayers, moral achievement, enlightenment, self-improvement. Not mocking any of them. People are searching.</p><p>Three out of four people on earth identify with some religion. The search is as alive as it was in Athens.</p><p><strong>SYSTEM asks: What must I do to reach God? The Gospel asks: What has God done to reach me?</strong></p>`,
    notes: "Pew Research Center, June 2025 (world figures for 2020): Christians 2.3 billion (28.8%), Muslims 2.0 billion (25.6%), no religion 1.9 billion (24.2%), Hindus 1.2 billion (14.9%), Buddhists 324 million (4.1%), Jews 14.8 million (0.2%). Muslims grew fastest, mostly through births; the unaffiliated grew 270 million and this one is switching — for every adult who joined a religion, 3.2 left one. Christians grew 5.6%; share slipped from 30.6% to 28.8%. In 2020, 30.7% of Christians lived in sub-Saharan Africa. Say the year if you quote a number.",
  },
  {
    position: 3,
    html: imageSlide("the-jesus-test", 3, "Savior — God is coming to us. John 1:14"),
    outline_html: `<p><strong>Savior &mdash; &ldquo;God is coming to us.&rdquo;</strong></p><p>John 1:14 &mdash; The Word became flesh and made his dwelling among us.</p><p>Religion often begins with humanity reaching upward. The Gospel begins with God reaching downward.</p><p>Ephesians 2:8&ndash;9. Obedience still matters &mdash; but our response did not create God&rsquo;s grace.</p><p>Philippians 2:5&ndash;8. Jesus came down, became a servant, humbled himself, went to the cross.</p><p><strong>At the center of Christianity is not a man climbing a throne. It is God stepping down from one.</strong></p><p>Not merely: Do you admire Jesus? But: Who is Jesus? Hold that thought.</p><p>Jesus didn&rsquo;t enter a world where everybody believed the same thing. Neither did Abraham, Moses, Daniel, or Paul.</p>`,
    notes: null,
  },
  {
    position: 4,
    html: imageSlide("the-jesus-test", 4, "The voices have changed. The challenge has not."),
    outline_html: `<p><strong>The voices have changed. The challenge has not.</strong></p><p>Move quickly through Bible history:</p><p><strong>Abraham</strong> &mdash; called out of a world of other gods; had to decide which voice to trust.</p><p><strong>Moses / Israel</strong> &mdash; Egypt, Pharaoh, Egyptian gods; later Canaanite gods.</p><p><strong>Daniel</strong> &mdash; Babylon: new culture, new gods, new values, pressure to conform.</p><p><strong>Jesus</strong> &mdash; Pharisees, Sadducees, Roman culture, competing interpretations of faithfulness.</p><p><strong>Paul</strong> &mdash; walks into Athens.</p><p><strong>God&rsquo;s people have never lived without competing voices.</strong></p><p>Every generation has to decide which voice it will trust. The names change. The cultures change. The technology changes. The challenge doesn&rsquo;t.</p><p>Acts 17:16 &mdash; Athens was &ldquo;full of idols,&rdquo; full of philosophers, full of religious ideas. Acts 17:21 &mdash; they spent their time &ldquo;talking about and listening to the latest ideas.&rdquo; Sounds familiar.</p><p><strong>Athens had more gods than anyone could count and more ideas than anyone could absorb.</strong></p><p>What does Paul do?</p>`,
    notes: "Luke’s word for “full of idols” (kateidolos) appears nowhere else in classical Greek. Busts of Hermes stood “at every corner,” and the Acropolis was crowned with temples and a giant bronze Athena; by Paul’s day Athens lived on as a university town and a museum to its past. Two rival philosophies argued with Paul in the marketplace: Epicureans (pursue pleasure and peace of mind; the gods stay out of it) and Stoics (reason and fate govern everything). Different answers to the same big questions — slide 02 all over again.",
  },
  {
    position: 5,
    html: imageSlide("the-jesus-test", 5, "Paul didn’t run from the voices. He brought Jesus into the conversation."),
    outline_html: `<p><strong>Paul didn&rsquo;t run from the voices. He brought Jesus into the conversation.</strong></p><p>Acts 17 &mdash; very important to the whole series. Paul is greatly distressed by the idols (17:16): he has convictions. But he doesn&rsquo;t run &mdash; he reasons daily in the synagogue and the marketplace (17:17).</p><p>He observes. He listens. He reasons. He engages. &ldquo;I see that in every way you are very religious.&rdquo; He notices the altar: TO AN UNKNOWN GOD (17:22&ndash;23).</p><p>He quotes their poets: &ldquo;We are his offspring&rdquo; (17:28).</p><p><strong>Paul could recognize truth in their culture without accepting everything their culture believed.</strong></p><p>Paul&rsquo;s pattern: listened &middot; recognized &middot; tested &middot; redirected &mdash; and brought it to Jesus and the resurrection (17:30&ndash;31).</p><p>The results were mixed (17:32&ndash;34): some sneered, some wanted to hear more, a few believed &mdash; Dionysius and Damaris.</p><p>Athens had its voices. We have ours.</p>`,
    notes: "Scholars trace “We are his offspring” to the Greek poets Aratus or Cleanthes. Paul didn’t need everyone to agree to have done the right thing.",
  },
  {
    position: 6,
    html: imageSlide("the-jesus-test", 6, "The challenge isn’t finding a voice. It’s knowing which voices to trust."),
    outline_html: `<p><strong>The challenge isn&rsquo;t finding a voice. It&rsquo;s knowing which voices to trust.</strong></p><p>Our Athens fits in our pocket: YouTube, Facebook, TikTok, podcasts, television, politics, preachers, churches, teachers, influencers, algorithms.</p><p>We don&rsquo;t suffer from lack of information. We suffer from an abundance of voices &mdash; and they&rsquo;re at home, not only overseas.</p><p><strong>The problem isn&rsquo;t that the world has nothing to say about God. The problem may be that the world has so much to say about God.</strong></p><p>Wrong people sometimes say true things. Good people sometimes say wrong things. Deciding WHO we listen to isn&rsquo;t enough &mdash; we have to learn HOW to listen.</p><p>Sometimes we draw the circle very tightly: &ldquo;Church of Christ? One of us?&rdquo; The New Testament gives us a deeper center. Tradition, culture, my experience, my opinion, even a respected teacher can&rsquo;t be the center. Something has to stay fixed.</p>`,
    notes: "Pew Religious Landscape Study 2023–24: Christians 62% of U.S. adults, unaffiliated 29%; non-Christian faiths 4.7% (2007) to 7.1% — small, don’t overstate. The bigger shift is mix-and-match spirituality: 2018 Pew, about six in ten American adults hold at least one “New Age” belief, common among churchgoers too. Yet 83% still believe in God or a universal spirit. Spiritual hunger, not only unbelief.",
  },
  {
    position: 7,
    html: imageSlide("the-jesus-test", 7, "Jesus must remain at the center — 1 John 4:2"),
    outline_html: `<p><strong>Jesus must remain at the center.</strong></p><p>1 John 4:1&ndash;3 &mdash; &ldquo;Every spirit that acknowledges that Jesus Christ has come in the flesh is from God.&rdquo;</p><p>John does NOT say, believe every voice. He doesn&rsquo;t say, be afraid of every voice. He says: TEST.</p><p>The Jesus Test: What does this teaching do with Jesus? Not &ldquo;do they mention Jesus?&rdquo; Not &ldquo;do they admire Jesus?&rdquo;</p><p><strong>The Jesus Test isn&rsquo;t, &ldquo;Do you admire Jesus?&rdquo; The question is, &ldquo;Who is Jesus?&rdquo;</strong></p><p>1 Corinthians 15:3&ndash;4 &mdash; of first importance: Christ died for our sins, was buried, was raised. Scripture itself recognizes a center.</p><p>Three questions when I hear something: What does it say about Jesus? Does it lead me toward following Jesus? Does it line up with what Jesus taught?</p><p>Tradition, culture, teachers, experience, opinions, religion &mdash; all of it gets brought back to Jesus. Once he is secure at the center, maybe I don&rsquo;t have to be so frightened of listening.</p>`,
    notes: "“Spirits” = the inspiration behind prophets and teachers; the error John faced denied Jesus truly came as a human being (the letter never names it — say it that way). “Has come in the flesh” is perfect tense: his real humanity, death, and resurrection. 1 John 4:15 widens the door. Bede: confession is “not by tongue but by deeds, not by sounding but by loving.”",
  },
  {
    position: 8,
    html: imageSlide("the-jesus-test", 8, "How do we remain open without becoming critical?"),
    outline_html: `<p><strong>How do we remain open without becoming critical?</strong></p><p>One of the big questions of this whole series.</p><p>Two dangers: CLOSED &mdash; &ldquo;I already know they&rsquo;re wrong.&rdquo; CRITICAL &mdash; &ldquo;I am listening mainly to find what&rsquo;s wrong.&rdquo; Neither is discernment.</p><p><strong>A critical spirit listens for what to reject. A discerning spirit listens carefully enough to recognize what is true.</strong></p><p>Can I listen to someone I disagree with? Can I hear one true thing without endorsing everything? Paul did. Can I recognize God&rsquo;s truth somewhere I didn&rsquo;t expect to find it?</p><p>Being open doesn&rsquo;t mean being gullible. Being discerning doesn&rsquo;t mean being suspicious. We need both openness and an anchor.</p>`,
    notes: null,
  },
  {
    position: 9,
    html: imageSlide("the-jesus-test", 9, "Test it. Keep what is good. Leave what isn’t. — 1 Thessalonians 5:21–22"),
    outline_html: `<p><strong>Test it. Keep what is good. Leave what isn&rsquo;t.</strong></p><p>1 Thessalonians 5:19&ndash;22. Paul is specifically talking about prophecy &mdash; don&rsquo;t stretch the text without saying so. He doesn&rsquo;t say believe it all; he doesn&rsquo;t say shut it all down. He says: TEST IT.</p><p>Picture testing metal: not destroying it, not accepting it because it shines &mdash; examining it to discover what it really is.</p><p>TEST IT &mdash; is it true? does it agree with Christ? what fruit does it produce? KEEP WHAT IS GOOD &mdash; don&rsquo;t throw away truth because of where you found it. LEAVE WHAT ISN&rsquo;T &mdash; I don&rsquo;t have to swallow the whole package.</p><p><strong>You don&rsquo;t have to accept everything someone says in order to receive something good from them.</strong></p><p>Truth doesn&rsquo;t become false because it came from somebody outside our circle.</p>`,
    notes: null,
  },
  {
    position: 10,
    html: imageSlide("the-jesus-test", 10, "Discernment isn’t about finding something to reject. It’s about recognizing what is good."),
    outline_html: `<p><strong>Discernment isn&rsquo;t about finding something to reject. It&rsquo;s about recognizing what is good.</strong></p><p>Paul didn&rsquo;t merely say reject what is evil. He first said: hold on to what is GOOD.</p><p>Widen the circle: Christians outside our tradition, songs, books, churches doing things we could learn from, people who disagree with us who still see something we&rsquo;ve missed.</p><p><strong>We don&rsquo;t have to surrender our convictions in order to listen. And we don&rsquo;t have to reject a person in order to disagree with them.</strong></p><p>Friends in the faith: start with what we share, be honest about where we disagree, keep studying together. Embrace the greater. Talk through the lesser. Jesus belongs at the center.</p><p><strong>Closing story &mdash; Chaplain Emil Kapaun, Korea, 1950&ndash;51.</strong></p><p>Army chaplain from a Kansas farm town. Unsan, Nov 1&ndash;2, 1950: moved under fire to comfort the wounded, refused to escape, stayed with the men who couldn&rsquo;t walk; captured. In the Pyoktong camp he foraged for food, boiled clean water, washed clothes, cleansed wounds, led prayer at night.</p><p>Easter 1951: purple stole, led dozens of prisoners to the ruins of an old church &mdash; &ldquo;men of different faith, perhaps some men of no faith &mdash; sang the Lord&rsquo;s Prayer.&rdquo; Died May 23, 1951: &ldquo;I&rsquo;m going where I&rsquo;ve always wanted to go.&rdquo; Blessed the guards: &ldquo;Forgive them, for they know not what they do.&rdquo; Medal of Honor, April 11, 2013.</p><p><strong>When everything else is stripped away, what&rsquo;s left is Jesus. That&rsquo;s the center. That&rsquo;s where we test from.</strong></p><p>SYSTEM &mdash; &ldquo;How can I reach God?&rdquo; &rarr; SAVIOR &mdash; &ldquo;God is coming to us.&rdquo; Paul walked into Athens; he didn&rsquo;t run. And now we walk into our Athens.</p>`,
    notes: "Stay on this slide through the Kapaun story. Then advance to the closing title.",
  },
  {
    position: 11,
    html: imageSlide("the-jesus-test", 11, "Hold On to What Is Good — Open to every good gift. Anchored in Christ."),
    outline_html: `<p><strong>Three things to remember</strong></p><p><strong>Jesus is the center. &rarr; Test what you hear. &rarr; Hold on to what is good.</strong></p><p><strong>If Jesus is firmly at the center, we don&rsquo;t have to be afraid of the noise around us.</strong></p><p>We can listen. We can test. We can learn. We can disagree. And when we discover something genuinely good &mdash; hold on to it.</p><p>Invitation.</p>`,
    notes: "Back to the title for the invitation.",
  },
];

/**
 * Ask Better Questions (Lesson 2) — Joe's finished 16:9 slide images, served
 * from public/sermons/ask-better-questions/slides/NN.jpg. Slide 01 is the
 * series title; the outline text on each slide is Joe's own notes.
 */
const askBetterQuestionsSlides: SeedSlideInput[] = [
  {
    position: 1,
    html: imageSlide("ask-better-questions", 1, "Hold On to What Is Good — Open to every good gift. Anchored in Christ."),
    outline_html: `<p><strong>Slide &mdash; We are in a series, Hold On To What Is Good.</strong></p>`,
    notes: "Series title.",
  },
  {
    position: 2,
    html: imageSlide("ask-better-questions", 2, "1 Thessalonians 5:21–22 (ESV) — but test everything; hold fast what is good. Abstain from every form of evil."),
    outline_html: `<p><strong>Slide &mdash; 1 Thessalonians 5:21</strong></p>`,
    notes: null,
  },
  {
    position: 3,
    html: imageSlide("ask-better-questions", 3, "Lesson 2 — Ask Better Questions"),
    outline_html: `<p><strong>Slide &mdash; Today&rsquo;s lesson, Ask Better Questions.</strong></p><p>Kids go through a phase and ask why, how, what&hellip;</p><p>Marriage &mdash; you asked the right questions and she married you.</p><p>Aren&rsquo;t you glad that someone before you asked better questions? Holidays, more dessert choices. Transportation &mdash; is there something better than a wagon, from cars to cars with A/C.</p><p><strong>History &mdash; we enjoy wonderful things because others dared to ask better questions:</strong></p><p><strong>1. Alexander Fleming</strong> &mdash; penicillin (1928). Noticed that mold had killed bacteria in one of his cultures. Instead of simply discarding the sample, <strong>he investigated</strong> what had happened.</p><p><strong>2. Isaac Newton</strong> &mdash; gravity. Sat in the garden of his family home and saw an apple fall straight down, rather than sideways or up. Wondered why it always fell toward the Earth&rsquo;s center &mdash; the start of his law of universal gravitation.</p><p><strong>3. Albert Einstein</strong> &mdash; relativity (1905). Explored questions about light, motion, space, and time. Imagined <strong>what it would be like</strong> to travel alongside a beam of light. His willingness to <strong>question established assumptions</strong> helped transform physics.</p><p>Is there something to be learned by asking a better question?</p>`,
    notes: "Hold on the title through the opening stories and the three examples.",
  },
  {
    position: 4,
    html: imageSlide("ask-better-questions", 4, "Proverbs 18:15 (ESV) — An intelligent heart acquires knowledge, and the ear of the wise seeks knowledge."),
    outline_html: `<p><strong>Slide &mdash; Proverbs 18:15 says it beautifully:</strong></p><p><em>&ldquo;The heart of the discerning acquires knowledge, for the ears of the wise seek it out.&rdquo;</em> (NIV)</p>`,
    notes: "Notes are the NIV; the slide is the ESV.",
  },
  {
    position: 5,
    html: imageSlide("ask-better-questions", 5, "The posture of wisdom is, “Let me understand this better.”"),
    outline_html: `<p>The posture of wisdom is not, <em>&ldquo;Let me find what is wrong with this.&rdquo;</em></p><p><strong>It is, &ldquo;Let me understand this better.&rdquo;</strong></p><p>Wisdom is <strong>curious</strong> before it is critical.</p><p>Wisdom <strong>begins</strong> by asking, &ldquo;What can I learn?&rdquo;</p><p><strong>There&rsquo;s a difference between being critical vs seeking.</strong></p><p>Matthew 6:33 &mdash; Seek first the Kingdom of God. In Spanish, &ldquo;buscar.&rdquo;</p><p>Illustration: my dad told me to go get the garden hoe from the tool shed &mdash; not motivated, not likely to find it.</p><p>Illustration: Christmas presents under the tree, Ofilia &mdash; so motivated she kept looking until she found out what was inside.</p><p><strong>Whoever really wants to find something seeks it out, and finds it. Seek first the kingdom &mdash; God will make sure you find it.</strong></p>`,
    notes: null,
  },
  {
    position: 6,
    html: imageSlide("ask-better-questions", 6, "Acts 17:11 (ESV) — Now these Jews were more noble than those in Thessalonica; they received the word with all eagerness, examining the Scriptures daily to see if these things were so."),
    outline_html: `<p><strong>Acts 17:11 &mdash; The Bereans</strong></p><p>They &ldquo;received the message with great eagerness and examined the Scriptures every day to see if what Paul said was true.&rdquo;</p><p>They were <strong>open enough to listen</strong> and <strong>grounded enough to examine</strong>.</p><p>&ldquo;Questioning the preacher was called noble.&rdquo;</p><p>Nobody in that church got lectured for asking.</p>`,
    notes: "These Jews stood out because other Jews were not like this.",
  },
  {
    position: 7,
    html: imageSlide("ask-better-questions", 7, "A faith that welcomes questions isn’t weaker."),
    outline_html: `<p><strong>A faith that welcomes questions isn&rsquo;t weaker.</strong> (It&rsquo;s Berean.) Being informed!</p><p>These Jews stood out because other Jews were not like this.</p><p><strong>What team would you pick?</strong></p><p>Is this a practice that you incorporate in your spiritual journey? Ask better questions &middot; ask deeper questions &middot; seek to understand.</p><p>Questions lead to <strong>conversations</strong>, to <strong>investigating</strong>, to <strong>sharing</strong>.</p><p>Someone in the kingdom gets blessed.</p>`,
    notes: null,
  },
  {
    position: 8,
    html: imageSlide("ask-better-questions", 8, "God Came Near — Max Lucado"),
    outline_html: `<p><strong>God Came Near</strong> by Max Lucado</p>`,
    notes: null,
  },
  {
    position: 9,
    html: imageSlide("ask-better-questions", 9, "It — Craig Groeschel"),
    outline_html: `<p><strong>It</strong> by Craig Groeschel</p>`,
    notes: null,
  },
  {
    position: 10,
    html: imageSlide("ask-better-questions", 10, "Life On Purpose — Jeff Little, Milestone Church"),
    outline_html: `<p><strong>Life On Purpose</strong> by Jeff Little</p>`,
    notes: null,
  },
  {
    position: 11,
    html: imageSlide("ask-better-questions", 11, "Life On Purpose, a study in Colossians — seven weeks"),
    outline_html: `<p>Life On Purpose &mdash; a study in Colossians, seven weeks: Christ in You &middot; Your Thinking &middot; Your Relationships &middot; Your Peace &middot; Your Family &middot; Your Work &middot; Make the Most of Every Opportunity.</p>`,
    notes: null,
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
  buildDeck("seed-deck-6", "the-jesus-test", "The Jesus Test", "the-jesus-test", theJesusTestSlides),
  buildDeck("seed-deck-7", "ask-better-questions", "Ask Better Questions", "ask-better-questions", askBetterQuestionsSlides),
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
