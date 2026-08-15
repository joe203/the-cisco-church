# CURRENT_STATUS — TheCiscoChurch.org
Updated: 2026-08-14 (evening) · Read this first when starting a new session.

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
- **Placeholder:** the three seed sermons ("The Hard Truth About the Kingdom"
  is the intended real first sermon; the two older ones are samples), the
  6-slide demo deck, Joe's bio (no photo — section renders text-only by
  design). Sermon assets (guide PDF, YouTube/podcast links, artwork) come
  next session.
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
