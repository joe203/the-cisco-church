# CLAUDE.md — TheCiscoChurch.org
# Built for: Joe | FiveSixteen.ai
# Version: 3.0 — Authoritative. Supersedes BUILD_PROMPT.md and KICKOFF.md where they differ.

---

## Always Do First
- **Read `CURRENT_STATUS.md`** — live-site state, direction, and gotchas. It is
  updated at the end of each working session and is more current than this file.
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.
- **Invoke the `fivesixteen-supabase-tenancy` skill** before writing any database code, migration, or RLS policy.
- **Read `lib/site.ts`** before touching any page. Church details live there.
- **Re-read the Scope Fence below** before adding anything. This site's biggest risk is scope creep.

## How Decisions Work (changed 2026-08-14)
Joe does **not** want a proposal-and-approval cycle for normal design and
engineering decisions. Make reasonable professional choices (layout, spacing,
copy, component structure, motion, architecture) and build. He reacts to the
working site. Stop and ask only when a decision genuinely needs information
only he has, or when a wrong assumption would create a significant problem
(e.g. anything touching the shared Supabase instance destructively).

Missing content never blocks development — use obvious, well-structured
placeholders, mark them `TODO` in `lib/site.ts`, and keep a running list for Joe.

---

## What This Site Is

A **temporary** site for the **Cisco Church of Christ** in Cisco, Texas, where
Joe serves in an interim ministry role. Its jobs, in order:

1. Make a first-time visitor feel *these are real people and I could walk in on
   Sunday.* The homepage leads with **the congregation, not the sermon**.
2. Tell a visitor when and where the church meets.
3. Host sermons — each gets a full page with slides, reflection guide, watch/
   listen links, and speaker bio. Sermon cards on the homepage and archive.
4. **Serve live HTML sermon slides** that follow the presenter in real time.

It will be replaced by a full build later. Everything it does, it should do
well; everything else it should not do at all.

**Priorities: Simple. Warm. Useful. Fast. Easy to maintain. Easy for a visitor
to understand.** No complexity for its own sake — clever ideas (e.g. a live
slide takeover on the homepage) are deferred unless they solve a v1 problem.

---

## Scope Fence (Hard Boundary)

**In scope — v1:**
- Homepage (hero → service times/location → welcome → recent sermons → footer)
- Sermon archive (`/sermons`) + individual sermon pages (`/sermons/[slug]`)
- Downloadable materials per sermon (guide, PDF, podcast/YouTube links)
- **Live HTML slide decks** — presenter view, viewer view, realtime sync
- Service times, address, map link, contact

**Explicitly out of scope — do not build, do not suggest:**
- About / staff / leadership / ministries / events / calendar pages
- Giving/donations
- Public user accounts or signup
- CMS or general-purpose admin panel
- Newsletter signup, contact forms, chat widgets
- The "Ask About This Lesson" chat assistant and SMS notify-me box (exist on
  Joe's hand-built pages; deferred — leave room in the sermon layout)

If a request seems to need one of these, **stop and ask Joe**.

---

## Routes

```
/                        homepage
/sermons                 archive, newest first
/sermons/[slug]          full sermon page
/slides/[deck]           live slide viewer (follows presenter; self-paced when not live)
/slides/[deck]/present   presenter controls (PRESENTER_KEY gated)
/api/deck/[deck]/state   POST — presenter writes, server-side only
```

## Homepage section order

1. **Hero** — energy-forward: "SOMETHING NEW IS HAPPENING IN CISCO." in heavy
   italic caps on a diagonal gold field (see `photos/hero_sample.png` for the
   inspiration). Not a sermon, not a passage. A worship photo lands in the
   dark right-hand field once supplied.
2. **Service times + location** — day, time, street address, map link. Visible
   without hunting.
3. **Welcome / What to Expect** — what a Sunday morning here is actually like.
4. **Recent sermons** — a few recent cards from the database → `/sermons/[slug]`,
   with a link to the full archive.
5. **Footer** — address, times, contact, copyright.

## Sermon page order (mirrors Joe's hand-built pages)

1. Slide deck viewer (self-paced) full-width at top — falls back to artwork if no deck
2. Title band on light: eyebrow → title in display serif → italic thesis
3. Key scripture on dark: passage large in italic serif, reference in gold
4. Numbered points (content-driven, design for 3–6)
5. About this lesson — prose paragraph
6. Resources — Listen / Preview / Download / Watch; omit any card with a null URL
7. Meet the speaker — photo, name, role tags, bio
8. Back to all sermons

---

## Database — Supabase

### Connection
- **URL:** `https://supabase.concan.church` (self-hosted, **shared instance**)
- `lib/supabase/client.ts` — browser client, **anon key only**, read-only in practice
- `lib/supabase/server.ts` — server client, **service role key**, only inside
  Route Handlers, never imported into a Client Component

### Environment
```
NEXT_PUBLIC_SUPABASE_URL=https://supabase.concan.church
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...     # server only, never NEXT_PUBLIC_
PRESENTER_KEY=...                 # shared secret gating presenter control
```
Ship `.env.example` with placeholders. Never commit `.env`.

### Shared-instance rules
- **Prefix every table `cisco_`.** No exceptions.
- **RLS on every table, always.**
- Do not modify, query, or migrate any table that is not `cisco_`-prefixed.
- Migrations are numbered SQL files in `supabase/migrations/`, applied on the
  droplet via `docker exec -i supabase-db psql -U supabase_admin -d postgres`.
  Dashboard-only changes don't exist.

### Schema (sermons are database-driven; church details are not)

```
cisco_speakers       slug, name, photo_url, tags[], bio
cisco_sermons        slug, title, thesis, scripture_ref, scripture_text,
                     sermon_date, artwork_url, summary, youtube_url,
                     podcast_url, guide_url, pdf_url, speaker_id, is_featured
cisco_sermon_points  sermon_id, position, title, label, body
cisco_decks          slug, title, sermon_id
cisco_slides         deck_id, position, html, notes   ← notes never reach anon
cisco_deck_state     deck_id, current_slide, is_live  ← the realtime row
```

The homepage features `is_featured`, falling back to the newest `sermon_date`.
Never hardcode which sermon is featured. Adding a sermon = inserting rows —
nothing in the code changes.

### RLS + security model
- Public **SELECT** for anon on all `cisco_` tables, **except**
  `cisco_slides.notes` (column-level grant excludes it — clients must select
  explicit columns, never `*`, on `cisco_slides`).
- **No anon INSERT/UPDATE/DELETE anywhere.** All writes go through Route
  Handlers using the service role key, gated by `PRESENTER_KEY`.
- The browser can only read; advancing a slide is a server call that proves it
  knows the presenter secret.

### Realtime
Viewer subscribes to `postgres_changes` on `cisco_deck_state` filtered to its
deck. On self-hosted the table must be in the publication:

```sql
alter publication supabase_realtime add table cisco_deck_state;
alter table cisco_deck_state replica identity full;
```

Verify realtime actually fires before declaring sync done. Viewers also poll
every 5s as a fallback — a dropped socket during a live service must never
strand a projected screen.

### Local fallback
When Supabase env vars are absent or a query fails, the data layer
(`lib/data.ts`) falls back to bundled seed data (`lib/seed.ts`) that mirrors
the seed migration. The site must never render empty because the database is
unreachable.

---

## Slide System

### Presenter (`/slides/[deck]/present`)
- Gated by `PRESENTER_KEY` (entered once, held in `sessionStorage`).
- Advance: right arrow, spacebar, tap right half. Back: left arrow, tap left half.
- Shows current slide, next-slide preview, presenter notes, slide count, live toggle.
- Every advance POSTs to the Route Handler; optimistic local advance so the
  presenter never waits on the network.

### Viewer (`/slides/[deck]`)
- Fullscreen, dark, no site chrome.
- Follows the realtime cursor when `is_live`; self-paced otherwise.
- Cross-fade between slides — `opacity` only, ~200ms, respects `prefers-reduced-motion`.
- Projector-legible: minimum body text 32px at 1080p, high contrast, no thin weights.

### Slide HTML
- HTML fragments in `cisco_slides.html`. **Sanitize on render**
  (`isomorphic-dompurify`) — always, even though only Joe authors slides.
- Styling comes from `app/slides/slides.css`, not inline styles in stored HTML.

---

## Technology Stack

- **Next.js 16 (App Router)** + **TypeScript** + **React 19**. Never SvelteKit,
  Remix, Pages Router, or plain HTML.
- **Tailwind CSS v4 — CSS-first.** Design tokens live in `@theme` inside
  `app/globals.css`. There is **no `tailwind.config.ts`**.
- No CSS Modules, no styled-components.
- Fonts via `next/font/google`.
- Route Handlers for all writes. No Server Actions for presenter control.
- `npx tsc --noEmit` must exit clean before any session is declared complete.

### Modern platform usage (progressive enhancement only, never decoration)
- Fluid type/space with `clamp()`; `text-wrap: balance` on headings, `pretty` on body.
- Container queries for sermon cards.
- `@starting-style` for the hero entry sequence; CSS scroll-driven reveals below
  the fold with `@supports` guard. No scroll libraries.
- View Transition on sermon-card → sermon-page artwork where supported; plain
  navigation everywhere else.
- `dvh` for full-height surfaces. OKLCH `color-mix()` for derived hovers/tints.
- Everything animated stays on `transform`/`opacity` and respects
  `prefers-reduced-motion`.

### Infrastructure
- **Host:** main FiveSixteen droplet `67.207.83.48` (`ssh droplet`), app dir `/root/the-cisco-church`.
- **Reverse proxy:** Caddy as a host systemd service — proxies to `localhost:<host-port>`.
- **Container network:** `web` (external). This droplet has **no `n8n_default`** —
  the old rule referencing it is obsolete here.
- **Host port:** `3060` → container `3000` (3000–3050 are taken by other apps).

```bash
# Deploy / rebuild on the droplet
cd /root/the-cisco-church && git pull \
  && docker compose --env-file .env up -d --build
```

Caddyfile block (note: domain is **theciscochurch.org** — one "c" in "cisco"):
```
theciscochurch.org {
    reverse_proxy localhost:3060
}
www.theciscochurch.org {
    redir https://theciscochurch.org{uri} permanent
}
```

---

## Project Structure

```
project-root/
├── CLAUDE.md                    ← this file, authoritative
├── README.md
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── next.config.ts               ← output: 'standalone', viewTransition flag
├── tsconfig.json
├── package.json
├── supabase/
│   └── migrations/              ← numbered SQL, source of truth for schema
├── app/
│   ├── layout.tsx               ← fonts, metadata, header/footer
│   ├── page.tsx                 ← homepage
│   ├── globals.css              ← Tailwind v4 @theme tokens + base styles
│   ├── sermons/
│   │   ├── page.tsx             ← archive
│   │   └── [slug]/page.tsx      ← single sermon
│   ├── slides/
│   │   ├── slides.css           ← scoped slide styling
│   │   └── [deck]/
│   │       ├── page.tsx         ← viewer
│   │       └── present/page.tsx ← presenter
│   └── api/deck/[deck]/state/route.ts
├── components/
│   ├── sections/                ← Hero, ServiceBand, Welcome, RecentSermons, Footer…
│   ├── sermons/                 ← SermonCard, DeckViewer, PointCard, ResourceCard…
│   └── slides/                  ← SlideFrame, PresenterControls, LiveViewer
├── lib/
│   ├── site.ts                  ← church details + TODO placeholders
│   ├── seed.ts                  ← fallback data mirroring the seed migration
│   ├── data.ts                  ← Supabase queries with seed fallback
│   └── supabase/
│       ├── client.ts            ← browser, anon key
│       └── server.ts            ← server, service role
└── public/
    ├── images/                  ← the four photos from PHOTO_GUIDE.md
    └── sermons/[slug]/          ← guide + slide PDFs
```

---

## Visual Identity (UNDER REVISION — see CURRENT_STATUS.md)

**2026-08-14:** Joe likes this palette but finds it **too dark for this site**
— the look must communicate **life and adventure**. He is supplying
inspiration images; expect a lighter, more energetic rework. Until that lands,
the tokens below remain in force.

**Naming:** the site brands as **"The Cisco Church"**. "Church of Christ"
appears **sparingly** — one footer mention on the homepage, no more. Voice:
energy, momentum, things happening. Never "small church / country church /
simple worship / the way we've always done it."

Derived from Joe's existing hand-built sermon pages. Use these tokens exactly.

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

- **Display:** Bodoni Moda — large sizes only (~2.5rem+); never small UI text.
- **Body:** Figtree. **Utility:** Figtree uppercase, `0.14em` tracking.
- Script belongs on sermon artwork only. Never in the UI.
- The site alternates dark and light bands; **dark is the home key**. Parchment
  sections read as breaths between dark movements.
- Slides: dark field, Cream text, Lamplight scripture references. Built for a
  dark room.

### Anti-generic guardrails (unchanged, non-negotiable)
- Never the default Tailwind palette; tokens above only.
- No full-bleed-photo + centered-headline + two-buttons hero. No three equal
  columns with circular icons. No gradient blobs. No uniform centered rhythm.
- Asymmetry over centering; editorial type scale (real size jumps); varied
  section rhythm; number only true sequences.
- Real language. "Sundays at 10:30, on Highway 6" beats "Join us for worship."
  If a sentence could appear on any church site in America, cut it.
- Layered, color-tinted shadows — never flat `shadow-md`.
- Motion: `transform`/`opacity` only, never `transition-all`, spring-ish easing
  300–450ms, one orchestrated hero sequence, staggered reveals below the fold
  only, `prefers-reduced-motion` respected and tested.
- Every clickable element has hover, focus-visible, and active states.

---

## Design Principles
1. Nobody reads — they scan. Short paragraphs, bold key points.
2. First impressions happen in half a second.
3. Never fake stock photos — a real, imperfect phone photo of the actual
   congregation beats polished stock every time.
4. Clarity converts. Pretty alone does not.
5. Cut copy in half, then in half again. A slide is one idea.
6. Service times and address stay easy to find at every screen size.
7. Speed is non-negotiable — 3s max on mobile with weak signal.
8. Design for the visitor: *"Is there a place for me here?"*
9. Fewer pages done well beats many mediocre pages.

---

## Launch Checklist
- [ ] Service times and location visible without scrolling on mobile
- [ ] Map link opens correctly on iOS and Android
- [ ] Recent sermons follow the hero and welcome sections
- [ ] Guide and slide PDFs download on mobile Safari
- [ ] `/sermons` archive sorts newest first
- [ ] RLS enabled and verified on every `cisco_` table
- [ ] Anon key confirmed unable to write — test it, don't assume it
- [ ] Anon confirmed unable to read `cisco_slides.notes`
- [ ] Realtime sync verified on two devices, then again after a network drop
- [ ] Presenter works on a phone with the deck projected elsewhere
- [ ] Slides legible from the back of the room at projector size
- [ ] Service role key absent from the client bundle (grep the build output)
- [ ] Lighthouse mobile performance ≥ 90
- [ ] Keyboard focus visible on every link and button
- [ ] Dockerfile and docker-compose building clean
- [ ] Metadata, favicon, OG image set for **theciscochurch.org**

---

## Local Development
- `npm run dev` on `http://localhost:3000`. Never screenshot `file:///`.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- `node screenshot.mjs http://localhost:3000 [label]` → `./temporary screenshots/`
- Read the PNG with the Read tool and analyze directly.
- Minimum 2 comparison rounds before presenting. Be specific.
- Screenshot mobile (390px), desktop (1440px), and slides at 1920×1080.

---

## Hard Rules
- Next.js App Router only. No pages/sections/features outside the Scope Fence.
- No table without the `cisco_` prefix. No table without RLS.
- Never touch other projects' tables on the shared instance.
- Service role key never reachable by a browser. No anon writes, ever.
- Never render stored slide HTML without sanitizing.
- No `transition-all`. No default Tailwind blue/indigo.
- Containers always on the external `web` network (this droplet has no `n8n_default`).
- Never commit `.env`. No `console.log`/`console.error` in production paths.
- Never invent church details — `TODO` in `lib/site.ts` and tell Joe.
- Domain is **theciscochurch.org** everywhere.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
