# CURRENT_STATUS — TheCiscoChurch.org
Updated: 2026-08-15 · Read this first when starting a new session.

## Latest session (2026-08-15, part 5): "The Obvious" deck

- Joe's next sermon **The Obvious** (Deut 6:4–9, 20; outline in
  `past_sermons/the_obvious/`) is built as deck slug `the-obvious`
  (`/slides/the-obvious` + `/present`). Deliberately lean: **23 slides**
  (vs Open Water's 40) — statements/quotes only where they land,
  full-manuscript outline segments on the controller.
- Design: Joe's parchment-doorway artwork (`photos/slide_background.png`,
  title baked in) is the full-bleed background of EVERY slide
  (`public/sermons/the-obvious/bg.jpg`); text renders in the open parchment
  right of the doorway via new `.panel` styles in `slides.css` — dark ink
  (#3D2B1C), olive kicker/refs (#5C6B35). New `img.slide-image.drift` class
  adds a 36s Ken Burns zoom so the background breathes.
- `005_the_obvious.sql` generated via the export script.
- Production PRESENTER_KEY changed to `cut-the-rope-1701` (Joe's request;
  container recreated, site verified up). Local remains `local-dev-key`.
- HyperFrames (animated slide visuals) discussed but not yet used — the
  background system accepts rendered mp4 loops whenever we generate them.

## Earlier (2026-08-15, part 4): the presentation module

Joe supplied `presentation_module/` (his hand-built Open Water Faith HTML
deck — controller + screen synced via BroadcastChannel, same-machine only)
and asked for it to become the site's permanent, every-sermon system. Built:

- **Controller** (`/slides/[deck]/present`, rewritten `Presenter.tsx`):
  locked centered slide preview + Back/Next/Blank/Go-live on top; the full
  sermon outline scrolls beneath in its own region; tap a segment → that
  slide hits the screen; current segment highlighted + auto-centered.
  Clicker keys (PageUp/PageDown) supported. `b` = blank.
- **Screen** (`/slides/[deck]`, updated `LiveViewer.tsx`): looping video
  background layers (deck metadata `backgrounds`, per-slide `bg` key,
  cross-fade on change), blank keeps background running, F = fullscreen,
  poll now 2s. Follows controller when live; self-paced otherwise.
- **Staged reveals** (`slides.css`): `class="stage" data-stage="2"` lands
  ~2.8s after slide entry — long/split quotes are ONE click, never two.
  Controller preview shows all stages at once. Slide bodies now centered.
- **Sync without Supabase**: the state route keeps per-deck state in process
  memory, so tablet→projector sync works TODAY through the 2s poll.
  Verified end-to-end with puppeteer (outline click → server state → screen
  followed, background switched at "Cut the Rope"). Supabase later = same
  API, Realtime push, poll as fallback.
- **Schema**: `003_presentation.sql` adds `cisco_slides.outline_html`, `.bg`,
  `cisco_deck_state.is_blank` (+ anon grant). `004_open_water_faith.sql` is
  GENERATED — `node scripts/export-deck-sql.mjs <slug> <uuid>` exports any
  seed deck to SQL (the tool for future sermons too).
- **Open Water Faith deck** fully converted into `lib/seed.ts`: 40 slides,
  outline segments + presenter cues, shore/open video loops (ffmpeg-encoded
  56MB→12MB at `public/sermons/open-water-faith/bg/`). No sermon page — deck
  is standalone at `/slides/open-water-faith`.
- Existing image decks (hard-truth, bag-of-seeds) work in the new controller
  (outline falls back to notes text).
- Still to explore per Joe: HyperFrames-generated background loops / visuals
  per sermon; his `photos/slide_background.png` ("The Obvious") awaits that
  sermon's deck as an image background.

## Earlier (2026-08-15, part 3): outlines + real slide decks wired in

- Joe added his full sermon outlines and slide-deck PNGs to `past_sermons/`.
  Sermon-page points for BOTH sermons were rewritten from the real outlines
  (5 points each, using Joe's own language and slide taglines as labels).
- **Both sermons now have real image slide decks** in the live slide system:
  7 slides each at `public/sermons/[slug]/slides/NN.jpg` (1920w jpg via
  sharp). Deck slugs: `the-hard-truth`, `the-bag-of-seeds`. The old 6-slide
  HTML demo deck is gone.
- Seed refactor: `lib/seed.ts` now exports `seedDecks` (plural) +
  `findSeedDeck()` + `seedDeckNotes()`; `lib/data.ts` and the deck state API
  route use them. Image slides are `<img class="slide-image">` fragments —
  full-bleed rule added to `app/slides/slides.css`; DOMPurify passes img/src/
  class/alt through. Presenter notes were written from the outlines.
- Bag of Seeds deck skips `slide_00.png` (QR-code variant of the title).
- Joe confirmed the inferred dates (Jul 19 / Jul 26) are correct.
- `002_seed.sql` kept in exact sync with `lib/seed.ts`.
- Verified: tsc clean, both sermon pages + fullscreen viewer screenshots,
  deck state API 200 for both decks. Still not committed/deployed.

## Earlier (2026-08-15, part 2): two REAL sermons are in

- Joe supplied assets in `past_sermons/` (reflection-guide PDFs + Cloudinary
  title-slide links + YouTube links) for his two real past sermons. Both are
  now wired through `lib/seed.ts` **and** `supabase/migrations/002_seed.sql`
  (kept in sync); the two fake placeholder sermons are gone.
  - **The Bag of Seeds** — Matthew 13:1–23, YouTube `q1ILOtr_yAM`, featured
    (newest). No slide deck.
  - **The Hard Truth About the Kingdom** — Matthew 25:14–30, YouTube
    `BrBm6-QasUo`, thesis corrected to "God celebrates faithfulness." Keeps
    the 6-slide demo deck (`the-hard-truth`), which matches this sermon.
- Assets live at `public/sermons/[slug]/artwork.jpg` (title slides, sharp →
  1600w jpg) and `.../reflection-guide.pdf`. Verified serving as 200
  `application/pdf`. Resource cards (Preview/Watch) light up automatically.
- **TODO(Joe): confirm sermon dates** — 2026-07-19 (Hard Truth) and
  2026-07-26 (Bag of Seeds) were inferred from slide-upload timestamps.
- Sermon artwork is 16:9, so card/banner slots are now `aspect-video`
  (featured card art column widened to 1.5fr).
- Joe approved the light redesign ("much better feel"). Still not committed
  or deployed.

## Earlier this session (2026-08-15): design refresh to "Texas morning"

- **The full light-palette redesign is built locally and NOT yet committed or
  deployed.** Joe asked for a lighter, fun, celebrative look based on the Oak
  Hills sample images he added to `photos/` (`sample_*.png`, `hero_sample.png`).
- New identity: warm-white base, teal diagonal hero over a real photo
  (`trail-rock.jpg` — kids on a trail rock), coral CTAs, marigold accents,
  Bricolage Grotesque display font, rounded cards, tilted "snapshot" photos.
  Full token table now lives in CLAUDE.md → Visual Identity.
- Sweep covered: homepage (hero, service band, welcome, recent sermons),
  header/footer, `/sermons` archive, `/sermons/[slug]`, sermon cards +
  typographic artwork fallback (now teal). **Slides/presenter deliberately
  keep the dark gold-on-espresso look** (projector rooms); the deck viewer
  band on sermon pages was re-grounded on Ink instead of Pitch.
- Photos: `photos/*.png` were converted/graded (sharp, +5% brightness, +10%
  saturation) into `public/images/` — new files `trail-rock.jpg`,
  `road-trip.jpg`, `kids-outside.jpg`; regenerated `youth.jpg`,
  `fellowship-ladies.jpg`, `congregation.jpg`, `bible-class.jpg`,
  `fellowship-men.jpg`. Remember the `.next/cache/images` gotcha.
- Verified: `tsc` clean; desktop + mobile + reduced-motion screenshots; slide
  viewer unchanged. Awaiting Joe's reaction before commit/deploy.

## Where things stand

**The site is LIVE at https://theciscochurch.org** — SSL valid (Let's Encrypt,
auto-renews), `www` redirects to the bare domain, DNS delegated to
DigitalOcean nameservers (`ns1–3.digitalocean.com`), apex + www A records →
`67.207.83.48`.

## What's been accomplished

### Built and deployed
- **Full site** on Next.js 16 (App Router) + Tailwind v4 + TypeScript:
  homepage (hero → service band → welcome → recent sermons → footer),
  `/sermons` archive (grouped by year), `/sermons/[slug]` full sermon pages,
  live slide system (`/slides/[deck]` realtime viewer + `/slides/[deck]/present`
  presenter + `PRESENTER_KEY`-gated API route).
- **Deployed** on the main FiveSixteen droplet (`ssh droplet`), repo at
  `/root/the-cisco-church`, container `cisco-church` on the external `web`
  network, host port **3060**, Caddy (host systemd) proxying
  `theciscochurch.org → localhost:3060`.
- **GitHub:** https://github.com/joe203/the-cisco-church (private; droplet
  pulls with the token embedded in its git remote, same pattern as
  stockdale-church). Deploy = `cd /root/the-cisco-church && git pull && docker
  compose --env-file .env up -d --build`.
- **PRESENTER_KEY** was generated on the droplet: `cat /root/the-cisco-church/.env`.
  Local dev uses `.env.local` (`local-dev-key`).

### Naming + copy direction (established with Joe, applies to ALL future copy)
- Site is branded **"The Cisco Church"** (header, footer, page titles).
- **"Church of Christ" is used sparingly** — exactly one homepage mention, in
  the footer: "The Church of Christ in Cisco, Texas is a place where good
  things are happening." Don't add more mentions.
- **No "small church / country church / simple / the way we've always done it"
  framing — ever.** The voice is: energy, momentum, things happening, a great
  worship experience. "Fresh" and "new" are on-message. Never say anything
  that would need an apology later (e.g. "no stage lights" — stage upgrades
  are planned).
- Hero headline: "SOMETHING NEW IS HAPPENING IN CISCO." — heavy italic
  uppercase Figtree on a diagonal gold field, last line outlined as it crosses
  onto the dark side (inspired by `photos/hero_sample.png`, Oak Hills style).
  Hero photo slot deliberately empty for now.

### Content state
- **Real:** service times (Sun 9:30 class / 10:30 worship / 6:00 PM evening;
  Wed 7:00 PM), address (1701 Avenue N, Cisco, TX 76437), phone
  ((254) 442-1450), map link. All in `lib/site.ts`.
- **Real photos** in `public/images/` (converted from `photos/`, neutral
  names, no VBS labels — Joe confirmed they're publicly published already):
  hero = laughing ladies; welcome = wide fellowship-hall shot, men, youth
  selfie, kids in pews.
- **Real sermons:** both seed sermons are real with artwork, guides, and
  YouTube links (see the top section). Still placeholder: the 6-slide demo
  deck content, Joe's bio (no photo — section renders text-only by design).
- Data layer (`lib/data.ts`) currently serves bundled seed data
  (`lib/seed.ts`) because Supabase env vars are not set — by design.

## Direction / what's next (in order)

1. **Sermons + slides (Joe's immediate priority).** Post the real sermon,
   build its slide deck, replace the two placeholder sermons. Joe wants to
   work on this "tonight or tomorrow."
2. **Design refresh — IMPORTANT.** Joe likes the current color scheme but for
   THIS site it reads **too dark**. The look must communicate **life and
   adventure**. He will post inspiration images of a sample site. Expect a
   palette/mood rework (likely lighter, more energetic) while keeping the
   quality bar. Don't start this before seeing his inspiration images.
3. **Supabase (deliberately last, after the site is otherwise settled).**
   Migrations are written and idempotent in `supabase/migrations/` but NOT
   applied. Steps: apply 001 + 002 via `docker exec -i supabase-db psql -U
   supabase_admin -d postgres < file.sql`; add `cisco` to `PGRST_DB_SCHEMAS`
   in the Supabase docker `.env` + recreate PostgREST; set
   `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY` in the
   droplet `.env`; rebuild; run the RLS/notes/realtime verification in
   `supabase/migrations/README.md`. App uses the **`cisco` Postgres schema**
   (tables still `cisco_`-prefixed), clients pass `db: { schema: "cisco" }`.
4. **Still wanted from Joe (not blocking):** speaker photo + preferred bio,
   contact email (if any), Facebook/YouTube links, favicon/OG design (a
   gold-on-espresso monogram was offered), eventually a real worship photo for
   the hero slot and an exterior/building shot.

## Gotchas the next session should know

- **This droplet has NO `n8n_default` network.** Apps run on the external
  `web` network; Caddy proxies to `localhost:<port>`. Port 3060 is this app's.
- Changing files in `public/images/` requires clearing
  `.next/cache/images` (and restarting) or Next serves the stale optimized
  copy.
- The lockfile pins `@emnapi/runtime` + `@emnapi/core` as devDependencies —
  Windows npm omits them otherwise and `npm ci` fails on Linux. Docker base is
  node:24-alpine for npm-11 lockfile compatibility.
- `screenshot.mjs` (puppeteer-core + cached Chrome) captures with
  `captureBeyondViewport: false` so CSS `view()` scroll animations render;
  label containing "reduced" tests `prefers-reduced-motion`, "slides" shoots
  1920×1080 viewport-only.
- `next dev` appends a self-managing `nextjs-agent-rules` block to CLAUDE.md —
  leave it alone.
- Local prod server may be running from a previous session — check before
  starting another (`npm run dev` / `npm run start` both bind :3000).
