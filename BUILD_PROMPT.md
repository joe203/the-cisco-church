# BUILD PROMPT — TheCiscoChurch.org

*Paste everything below the line into Claude Code as your opening message. Have
`CLAUDE.md`, `README.md`, and `PHOTO_GUIDE.md` in the project root first.*

---

We're building **TheCiscoChurch.org** — a temporary site for the **Cisco Church
of Christ** in Cisco, Texas. Read `CLAUDE.md` before anything else, invoke the
`frontend-design` skill, and invoke the `fivesixteen-supabase-tenancy` skill
before writing any SQL.

## What this site is for

Two jobs, in this order:

1. Make someone who's never heard of this church think *these are real people and
   I could walk in on Sunday.*
2. Host sermons. Each sermon gets its own full page with slides, a reflection
   guide, a YouTube link, and a short speaker bio. The homepage shows sermon
   cards; clicking one opens that sermon's page.

It is temporary and will be replaced. Three routes, done extremely well, beats
twelve routes done adequately.

## Routes

```
/                        homepage
/sermons/[slug]          full sermon page
/slides/[deck]           live slide viewer (follows presenter in realtime)
/slides/[deck]/present   presenter controls
```

No about page, no staff page, no ministries, no events calendar, no giving page.
If you think one is needed, ask first.

## Homepage sections

1. **Hero — this Sunday.** The featured sermon: title, passage, one-line thesis,
   and one action. Not a centered headline over a stock photo. See the
   anti-generic brief below.
2. **Service times + location.** Day, time, street address, map link. Must be
   reachable without hunting.
3. **Sermons.** A grid of sermon cards pulled from Supabase. Each card carries
   the sermon artwork, title, passage, and date, and links to `/sermons/[slug]`.
   Adding a card means inserting a row — nothing in the code changes.
4. **A short welcome.** Three or four sentences about what a Sunday morning is
   like here. Keep it plain and human.
5. **Footer.** Address, service times, contact, copyright.

## Sermon page structure

This mirrors the pages Joe already builds by hand. Follow this order:

1. **Slide deck viewer**, full width at the top. Large slide, thumbnail strip
   beneath, prev/next arrows, arrow-key navigation, "N of M" counter.
2. **Title band** on a light field — small uppercase eyebrow ("A sermon on
   Matthew 25"), the sermon title large in the display serif, and a one-line
   thesis in italic beneath ("God celebrates results.").
3. **Key scripture** on a dark field — the passage set large in italic serif,
   reference below in gold.
4. **The points.** Numbered cards, one per main movement of the sermon, each with
   a title, a short label ("Five Talents"), and two or three sentences. Content
   comes from the database, so the count varies — design for 3 to 6.
5. **About this lesson** — a paragraph of prose introducing the message.
6. **Resources** — Listen (podcast), Preview (reflection guide), Download (PDF),
   and Watch (YouTube). Omit any card whose URL is null; never render a dead
   button.
7. **Meet the speaker** — photo, name, role tags, bio.
8. **Back to all sermons.**

## Data model

Supabase, self-hosted at `https://supabase.concan.church`. Shared instance —
every table prefixed `cisco_`, RLS on all of them, migrations in
`supabase/migrations/`. Show me the SQL before you run it.

```
cisco_sermons        slug, title, thesis, scripture_ref, scripture_text,
                     sermon_date, artwork_url, summary, youtube_url,
                     podcast_url, guide_url, pdf_url, speaker_id, is_featured

cisco_sermon_points  sermon_id, position, title, label, body

cisco_speakers       slug, name, photo_url, tags[], bio

cisco_decks          slug, title, sermon_id
cisco_slides         deck_id, position, html, notes
cisco_deck_state     deck_id, current_slide, is_live
```

The homepage hero uses `is_featured`, falling back to the nearest upcoming
`sermon_date`. Never hardcode which sermon is featured.

Church details (name, times, address, phone, map link) stay in `lib/site.ts` —
they change rarely and don't need a table.

## Visual identity

Derived from Joe's existing sermon pages. Use these tokens exactly.

| Token | Hex | Use |
|-------|-----|-----|
| Espresso | `#17110D` | Dominant dark field |
| Pitch | `#0D0906` | Hero, footer, deepest layer |
| Parchment | `#EDE6DA` | Light bands |
| Bone | `#F7F2E9` | Cards on parchment |
| Lamplight | `#C9A063` | Accent — eyebrows, references, borders, CTAs |
| Burnish | `#8A6A32` | Accent hover/pressed |
| Cream | `#F4EDE2` | Text on dark |
| Ash | `#A2937F` | Muted text on dark |
| Umber | `#3D3128` | Muted text on light |

**Type:**
- Display — **Bodoni Moda**. High contrast, used large and sparingly.
- Body — **Figtree**.
- Utility — Figtree uppercase, `0.14em` tracking, for eyebrows and labels.
- Script belongs on sermon artwork only. Never in the UI.

The site alternates dark and light bands. Dark is the home key — the page should
open dark, and parchment sections should read as breaths between, not the other
way around.

## The anti-generic brief — read this twice

Joe's explicit ask: **this must not look like an AI-generated website.** There is
a recognizable house style that language models fall into, and avoiding it is a
primary requirement of this build, not a nice-to-have.

**Do not produce any of these:**
- A hero that is a full-bleed photo with a centered white headline, a centered
  subhead, and two buttons side by side.
- Three equal columns of cards, each with a circular icon at the top.
- Gradient mesh blobs, glows, or aurora backgrounds.
- The same centered heading + centered subhead + centered content rhythm repeated
  down the entire page.
- Every section at the same max-width with the same vertical padding.
- One uniform fade-up-on-scroll applied to every element on the page.
- Rounded-corner cards with `shadow-md` on a light gray background.
- Icon-in-a-circle as the visual answer to every section.
- Copy like "Join us as we grow together in faith," "Experience God's love," or
  "A place to belong." If a sentence could appear on any church site in America,
  cut it.

**Do this instead:**
- **Asymmetry.** Let the hero be off-balance — type stacked hard left with the
  artwork bleeding off the right edge, or type overlapping the image. Something
  with a spine, not a center line.
- **An editorial type scale.** Real jumps in size. A display line at 5–8rem next
  to body at 1rem. Contrast is what makes a page look designed rather than
  generated.
- **Varied section rhythm.** Some sections full-bleed, some inset, some split.
  Alternate dark and light. Vary vertical padding deliberately.
- **Structural devices that mean something.** Number the sermon points, because
  a sermon actually has an order. Don't number things that aren't sequences.
- **Real language.** "Sundays at 10:30, on Highway 6" beats "Join us for
  worship." Name the town. Name the street.

## The signature

Spend the boldness in one place.

**Primary — the card becomes the page.** When someone clicks a sermon card, the
card's artwork expands into the sermon page's hero using the View Transitions
API. The image is the shared element; everything else cross-fades around it.
Done well, it makes a three-page site feel like a single continuous surface, and
almost no church site does it.

Implement it as progressive enhancement — full navigation must work with the API
unsupported and with `prefers-reduced-motion: reduce`.

Before building, propose **three hero concepts** and let Joe choose. One of them
should be genuinely risky. Two directions worth exploring:

- *The letterboard.* Every small-town church has a sign out front with this
  week's title on it. The hero is that sign, rendered as type rather than an
  illustration of one.
- *The passage first.* The hero's largest element is a line of this week's
  scripture, with the sermon title as a small eyebrow above it. The text is what
  the church is about — let it be the biggest thing on the page.

## Motion

- `transform` and `opacity` only. Never `transition-all`.
- Spring-ish easing, not `ease-in-out`. Around 300–450ms.
- One orchestrated page-load sequence on the hero. Scattered effects everywhere
  else read as AI-generated — restraint is the tell of a human designer.
- Scroll reveals: stagger them, and skip anything above the fold.
- `prefers-reduced-motion` respected throughout. Test it.

## Content for the first pass

Church name: **Cisco Church of Christ**. Everything else Joe hasn't supplied yet
— put a clearly marked `TODO` in `lib/site.ts` and tell him what's missing rather
than inventing service times or an address.

Seed the database with one real sermon so the pages have something true in them:

- Title: *The Hard Truth About the Kingdom*
- Passage: Matthew 25:14–30
- Thesis: *God celebrates results.*
- Points: The Ready Servant (Five Talents) · The Faithful Servant (Two Talents) ·
  The Fearful Servant (One Talent) · Five Hard Truths (The Reckoning)
- Speaker: Joe Cabrera — Minister, Educator, Consultant

Add two placeholder sermons so the card grid can be judged with more than one
item in it.

## Build order

1. **Propose before building.** Confirm the palette, present three hero concepts
   with ASCII wireframes, list the homepage sections in order, and name the
   signature element you're committing to. **Stop and wait for Joe's approval.**
2. **Schema.** Write the migration, show the SQL, wait for approval, then run it.
   Verify RLS blocks anon writes — test it, don't assume it.
3. **Scaffold + homepage.** Screenshot at 390px and 1440px. Two comparison
   rounds minimum before showing Joe.
4. **Sermon page.** Same screenshot discipline.
5. **Slides.** Viewer, presenter, realtime sync. Verify the sync on two devices,
   then verify it survives a network drop.
6. **Docker + Caddy** and a deploy check.

## Deferred — do not build now

The "Ask About This Lesson" chat assistant and the SMS notify-me box exist on
Joe's current pages. Both are out of scope for v1. Leave room for them in the
sermon page layout, but don't build them.
