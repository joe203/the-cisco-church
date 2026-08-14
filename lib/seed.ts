import type { Deck, DeckState, Sermon, SermonDetail, SlideWithNotes, Speaker } from "./types";

/**
 * Bundled fallback data, mirroring supabase/migrations/002_seed.sql.
 * Used whenever Supabase env vars are absent or a query fails — the site
 * must never render empty because the database is unreachable.
 *
 * The two older sermons are PLACEHOLDER content so the card grid and
 * archive can be judged with more than one item. TODO(Joe): replace with
 * real past sermons.
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
  thesis: "God celebrates results.",
  scripture_ref: "Matthew 25:14–30",
  scripture_text:
    "“Well done, good and faithful servant. You have been faithful over a little; I will set you over much. Enter into the joy of your master.”",
  sermon_date: "2026-08-17",
  artwork_url: null,
  summary:
    "Jesus told a story about a master, three servants, and a long absence — and it does not end the way we would write it. The parable of the talents is warm to the workers and unsparing to the fearful, and it asks a question most of us would rather not sit with: what did you do with what you were given? This lesson walks through each servant and lands on five hard truths about how the Kingdom actually works.",
  youtube_url: null,
  podcast_url: null,
  guide_url: null,
  pdf_url: null,
  is_featured: true,
  deck_slug: "the-hard-truth",
  speaker: joe,
  points: [
    {
      position: 1,
      title: "The Ready Servant",
      label: "Five Talents",
      body: "Given the most, he went at once and put it to work. Readiness is not a personality trait — it is a decision made before the opportunity arrives.",
    },
    {
      position: 2,
      title: "The Faithful Servant",
      label: "Two Talents",
      body: "He received less and was praised identically. The master measures faithfulness against what was entrusted, never against what someone else was given.",
    },
    {
      position: 3,
      title: "The Fearful Servant",
      label: "One Talent",
      body: "He buried the gift and called it prudence. Fear dressed up as caution still leaves the master's property in a hole in the ground.",
    },
    {
      position: 4,
      title: "Five Hard Truths",
      label: "The Reckoning",
      body: "The master comes back. Accounts get settled. And the parable closes with truths about reward, risk, and responsibility that are hard precisely because they are clear.",
    },
  ],
};

/* PLACEHOLDER past sermons — replace with real ones. */
const shepherd: SermonDetail = {
  id: "seed-sermon-2",
  slug: "the-lord-is-my-shepherd",
  title: "The Lord Is My Shepherd",
  thesis: "Provision begins with belonging.",
  scripture_ref: "Psalm 23:1–6",
  scripture_text: "“The Lord is my shepherd; I shall not want.”",
  sermon_date: "2026-08-10",
  artwork_url: null,
  summary:
    "PLACEHOLDER — a sample past sermon so the archive has depth. David's most familiar psalm, read slowly enough to notice what it actually promises.",
  youtube_url: null,
  podcast_url: null,
  guide_url: null,
  pdf_url: null,
  is_featured: false,
  deck_slug: null,
  speaker: joe,
  points: [],
};

const saltLight: SermonDetail = {
  id: "seed-sermon-3",
  slug: "salt-and-light",
  title: "Salt and Light",
  thesis: "A hidden disciple is a contradiction.",
  scripture_ref: "Matthew 5:13–16",
  scripture_text: "“You are the light of the world. A city set on a hill cannot be hidden.”",
  sermon_date: "2026-08-03",
  artwork_url: null,
  summary:
    "PLACEHOLDER — a sample past sermon so the card grid can be judged with more than one item in it.",
  youtube_url: null,
  podcast_url: null,
  guide_url: null,
  pdf_url: null,
  is_featured: false,
  deck_slug: null,
  speaker: joe,
  points: [],
};

export const seedSermons: SermonDetail[] = [hardTruth, shepherd, saltLight];

export const seedSlides: SlideWithNotes[] = [
  {
    position: 1,
    html: `<p class="kicker">Cisco Church of Christ</p><h1>The Hard Truth <em>About the Kingdom</em></h1><p class="ref">Matthew 25:14–30</p>`,
    notes: "Welcome everyone. Read the parable in full before advancing.",
  },
  {
    position: 2,
    html: `<blockquote>“For it will be like a man going on a journey, who called his servants and entrusted to them his property.”</blockquote><p class="ref">Matthew 25:14</p>`,
    notes: "Set the scene — a long absence, real money, real trust.",
  },
  {
    position: 3,
    html: `<p class="kicker">One</p><h2>The Ready Servant</h2><p>Five talents. He went <strong>at once</strong> and traded with them.</p>`,
    notes: "Readiness is decided before the opportunity arrives.",
  },
  {
    position: 4,
    html: `<p class="kicker">Two</p><h2>The Faithful Servant</h2><p>Two talents — and the <strong>same praise</strong> as five.</p>`,
    notes: "Faithfulness is measured against what was entrusted.",
  },
  {
    position: 5,
    html: `<p class="kicker">Three</p><h2>The Fearful Servant</h2><p>“I was afraid, and I hid your talent in the ground.”</p>`,
    notes: "Fear dressed up as prudence. Slow down here.",
  },
  {
    position: 6,
    html: `<p class="kicker">The Reckoning</p><h2>Five Hard Truths</h2><p>The master returns. Accounts get settled. The Kingdom celebrates <strong>results</strong>.</p>`,
    notes: "Land the five truths, then invitation.",
  },
];

export const seedDeck: Deck = {
  id: "seed-deck-1",
  slug: "the-hard-truth",
  title: "The Hard Truth About the Kingdom",
  sermon_slug: "the-hard-truth-about-the-kingdom",
  slides: seedSlides.map(({ position, html }) => ({ position, html })),
};

export const seedDeckState: DeckState = {
  current_slide: 1,
  is_live: false,
};

export function seedSermonList(): Sermon[] {
  return seedSermons.map(({ points: _p, speaker: _s, deck_slug: _d, ...sermon }) => sermon);
}
