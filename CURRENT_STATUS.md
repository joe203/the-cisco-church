# CURRENT_STATUS — TheCiscoChurch.org
Updated: 2026-10-02 · Read this first when starting a new session.

## OPEN ITEMS (updated 2026-10-01, end of the bulletin/mail build session)

Live at theciscochurch.org: bulletin, staff login, PDF upload, bulletin-by-email,
admin inbox, text alert on new mail. Details are in CLAUDE.md -> "Bulletin + staff
area" and the sections below. What is NOT finished:

1. **Replace the borrowed Telnyx key** (Joe, next week). The droplet `.env` uses
   EasyCaseload's `TELNYX_API_KEY` / `TELNYX_FROM_NUMBER` (copied server-side
   2026-10-01). Create a Cisco-specific key, swap both values in
   `/root/the-cisco-church/.env`, then
   `docker compose --env-file .env up -d --force-recreate`. A test text to
   210-422-0607 already arrived, so the number/carrier path works.
2. **Real-world test of the two email paths.** Simulated deliveries pass (15 for
   bulletin@, 26 for the inbox) but a real email through Mailgun has not yet been
   confirmed for either: (a) email the Oct 4 PDF to bulletin@theciscochurch.org
   from a staff address -> expect an "already published" reply; (b) email
   hello@theciscochurch.org from Gmail -> expect an inbox row, a text, and a
   working reply. Check `cisco_inbound_log` (bulletin) and `cisco_mail` (inbox).
3. **Cyndi's first real bulletin** (login `ciscochurchofchrist@outlook.com`,
   secretary). Her PDF has only been tested via Joe uploading it. Check her first
   email-in draft against the paper copy.
4. **Surveys / feedback forms** are still out of scope (CLAUDE.md). The mailbox
   exists so they can receive replies; building forms needs the fence updated first.
5. The Oct 11 bulletin is an unpublished draft Joe started.

Mailgun routes (account-level, prio): 0 Concan x2 (not ours), 1
`bulletin@theciscochurch.org` -> /api/inbound/bulletin, 5 `.*@theciscochurch.org`
-> /api/inbound/mail, 10 catch_all -> FiveSixteen n8n (not ours). Do not remove
Cisco's MX records — Mailgun receiving depends on them.

---

## Bulletin + staff login (built 2026-10-01 — NOT yet deployed/committed)

Joe asked for an online bulletin to replace the printed one, plus logins so he
and the secretary (Cyndi Kitchens) can maintain it. Full design + rules are in
CLAUDE.md → "Bulletin + staff area". State at end of session:

- Code complete and type-clean; 37-check end-to-end test passed against the
  real shared Supabase (guards, role limits, conflict 409, publish, carry-over,
  anon can't read drafts/roster/write). Test accounts were deleted.
- **Done on the droplet:** `007_bulletin.sql` applied; `cisco` added to
  `PGRST_DB_SCHEMAS`; `theciscochurch.org` (+www) added to
  `ADDITIONAL_REDIRECT_URLS`; rest + auth recreated; `cisco` app added to the
  shared auth-mailer and rebuilt (sender `no-reply@theciscochurch.org`; the domain was added to Mailgun 2026-10-01 and needs its DNS records verified before emails send). Backups: `/root/supabase/docker/.env.bak.2026-10-01-cisco`,
  `/root/apps/auth-mailer/*.bak-20261001-cisco`.
- **Local `.env.local`** now holds the Supabase URL/anon/service keys (backup
  `.env.local.bak-bulletin`). The local dev server therefore talks to the REAL
  shared database.
- **To go live:** commit + push; add `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` to
  `/root/the-cisco-church/.env`; rebuild (the NEXT_PUBLIC values are build
  args); `node scripts/add-staff.mjs <joe's email> admin "Joe"`; then sign in
  on production to verify the real emailed link (the one thing that can't be
  tested locally).
- With Supabase connected, decks/sermons still fall back to seed data because
  001–006 are unapplied — slides keep working from process memory as before.
- Open: optional article
  image upload (needs a storage bucket + policies); announcements don't
  auto-expire (staff remove them); `site.email` now set from the bulletin.

## Bulletin PDF import (built + verified 2026-10-01 — live)

Secretary uploads her finished paper bulletin as a PDF → Claude reads it →
draft bulletin for that Sunday → she/Joe checks and publishes. Needs
`ANTHROPIC_API_KEY` (set on the droplet and in `.env.local`; the key must be
created INSIDE a console workspace — an unscoped key 400s with "not scoped to a
workspace"). Verified against the real API on the Oct 4 PDF: ~24s, date and
order of service identical to the hand-typed copy, article identical to the
character; it also caught a name I had mistyped ("Joy Davies"). Save/replace/
refuse paths tested against the DB. Not yet exercised: a bulletin exported by the
secretary's own software (Word/Publisher) — first real upload from her is the
true test; always read the draft against the paper copy.

## Where things stand

**Everything is committed, deployed, and live at https://theciscochurch.org.**
Working tree clean; the droplet is running the same commit. No pending or
half-finished work.

**2026-09-28 session:** built the hero video reel (see its own section
below) and fixed two things Joe flagged: Wednesday night was showing a
single wrong 7:00 PM slot (now Meal 5:30 / Bible Study 6:00 in
`lib/site.ts`), and the hero's "Worship that lifts" line overclaimed where
the service actually is — reworded to Joe's own framing, "We're building a
new worship experience that lifts... Come grow with us."

- Next.js 16 (App Router) + Tailwind v4 + TypeScript, container `cisco-church`
  on the droplet (`ssh droplet`), repo `/root/the-cisco-church`, external `web`
  network, host port **3060**, Caddy proxies `theciscochurch.org → :3060`.
- Deploy: `cd /root/the-cisco-church && git pull && docker compose --env-file .env up -d --build`
- GitHub: https://github.com/joe203/the-cisco-church (private).
- **PRESENTER_KEY: `1701`** — one key for ALL decks (single site-wide env var,
  not per-deck). Same value locally and in production.
- Controller route is **`/slides/[deck]/controls`** (renamed from `/present`
  2026-08-16; the old path 308-redirects so bookmarks still work).
- Data still comes from bundled seed data (`lib/seed.ts`); Supabase is written
  but deliberately NOT connected yet.

## Homepage hero — "glass diagonal" + Joe's edited video (2026-10-02)

Replaced the 2026-09-28 rotating reel (7 short clips/stills) with **one
video Joe edits himself** (`video_v2/website_hero_clip_v5.mp4`, ~28s) that
loops behind the hero. Joe picked this layout from three trial versions
(wide diagonal / glass diagonal / framed 16:9 card).

**Layout (`components/sections/Hero.tsx`):**
- One continuous section from the top edge. On `/` the site header floats
  over the hero (transparent, white type, full-bleed gutters) — see
  `SiteHeader.tsx` (`usePathname() === "/"`). Every other page keeps the
  light Cloud bar. Joe: the old light bar "didn't go with the page".
- Desktop: the video runs **full-bleed behind everything**; the diagonal
  teal field is a **translucent pane (opacity 0.9)** over it, edged by a
  thin marigold line. Pane top edge at 54vw, bottom at 36vw (moved left
  twice at Joe's request so the clear window holds the speaker). The
  headline runs from a 48px left margin and its last line ("IN CISCO.",
  outlined) crosses the line onto the footage — intended.
- Headline size `clamp(3rem, min(8.4vw, 12vh), 7.4rem)` — the vh cap keeps
  the CTA above the fold on 1280×720 laptops.
- Mobile / reduced motion: no video at all; solid teal pane, trail photo
  slants in below (unchanged behaviour).

**Video framing rules (learned over v2–v5):**
- Only ~the right 40% of the frame is the clear window; the rest shows
  dimmed through the teal. Subjects and anything readable go right of the
  line; the left must still be REAL footage — flat black fill shows
  through the glass as a "chopped" block (v4's problem).
- Joe has an overlay for his editor: `video_v2/hero-glass-guide.png`
  (1920×1080, gold line = the diagonal at 1440×900, the tightest common
  desktop ratio). Regenerate it if the diagonal moves.
- No burned-in captions — the headline already carries the message, and
  captions get cut by the line.

**Swapping in a new edit:** Joe drops `video_v2/website_hero_clip_vN.mp4`, then
```
ffmpeg -i video_v2/website_hero_clip_vN.mp4 -an -c:v libx264 -preset slow \
  -crf 28 -pix_fmt yuv420p -movflags +faststart public/videos/hero/hero-reel-vN.mp4
ffmpeg -ss 2.5 -i video_v2/website_hero_clip_vN.mp4 -frames:v 1 -q:v 5 \
  public/videos/hero/hero-reel-vN-poster.jpg
```
Keep full 1080p (1280-wide looked soft stretched full-bleed; ~4.7MB for
28s, desktop-only). Point `lib/heroMedia.ts` at the new file, delete the old
one, screenshot several timestamps by pausing the `<video>` and setting
`currentTime` in puppeteer (far more reliable than timing a live loop).
`HeroReel.tsx` still supports a multi-item rotation (a single entry loops
natively), so going back to a clip/still reel needs no code change.

## What's live

**Site:** homepage (hero → service band → welcome → recent sermons → footer),
`/sermons` archive, `/sermons/[slug]` sermon pages — all in the light
"Texas morning" palette (teal / coral / marigold on warm white).

**Sermons (2)** — both real, with artwork, reflection-guide PDFs, YouTube
links, 5 outline-based points each, and image slide decks:
- `the-bag-of-seeds` — Matthew 13:1–23, 2026-07-26, **is_featured: true**
- `the-hard-truth-about-the-kingdom` — Matthew 25:14–30, 2026-07-19

**Slide decks (5)** at `/slides/[deck]` + `/slides/[deck]/controls`:
| Deck slug | Type | Notes |
|---|---|---|
| `the-obvious` | Composed HTML, 23 slides | The reference build — see design system below |
| `knowledge` | 8 supplied images | Joe's finished artwork; outline text read off the images |
| `the-bag-of-seeds` | 7 images | Attached to its sermon page |
| `the-hard-truth` | 7 images | Attached to its sermon page |
| `open-water-faith` | Composed HTML, 40 slides | Video-loop backgrounds; standalone, no sermon page |

Joe preached with `the-obvious` and reported it worked: *"pretty decent…
good for the first trial."*

**Preaching sheets** — a new, separate thing from the slide decks (added
2026-09-12). Joe writes these by hand as one self-contained HTML file: a
keyboard prompter that highlights one block at a time so he can keep his
place while preaching. They are **static files in `public/preach/`**, served
by a rewrite in `next.config.ts` (`/preach/:sheet` → `/preach/:sheet.html`)
so the URL is short enough to type on a strange computer. They are NOT Next
pages — no layout, no `globals.css`, no shared tokens. Leave them that way.

| Sheet | URL | Sermon |
|---|---|---|
| `new-life` | `/preach/new-life` | Make Room for a New Life — The New Thing series, Sept 13 |

`new-life` notes: all scripture is **NIV** (Biblica credit line at the foot,
required for quotation); 29 slide cues map every one of the 34 slides in
Joe's PowerPoint deck. A cue block turns **cyan** instead of the usual gold
and carries a `Slide n` margin tag — that colour change is Joe's signal to
click his clicker. Labels beginning `+` mark build slides that add a line to
the previous slide rather than replacing it. Marked up with
`data-slide` / `data-slidelabel` on `.step` elements; the CSS and the badge
in the control bar read those attributes, so re-mapping is an attribute edit.

Every sheet is `noindex, nofollow` and nothing links to it. These are Joe's
working notes, not visitor content — do not surface them in nav or sitemaps.
**Edit `public/preach/*.html` directly**; it is the source of truth (the
original drafts live in the gitignored `incoming/`, which is not deployed).

---

## The slide design system (HARD-WON — do not relitigate)

These rules came from several rounds of Joe rejecting work. Follow them.

1. **Slides are ANCHORS, not captions.** One slide per movement-beat, holding
   for minutes. A slide that changes every time the preacher makes a point is
   a distraction and Joe will reject it. ~20 slides for a 35–40 min sermon.
2. **One background for the whole deck.** No color changes mid-sermon — they
   make the room wonder what's happening. Title artwork opens and closes;
   every content slide sits on the same ground.
3. **Two type families maximum, taken from the sermon's own title artwork.**
   Joe notices font variation immediately and dislikes it. For `the-obvious`:
   **Archivo** (heavy caps display + spaced labels) + **Newsreader**
   (statements, questions, scripture). Loaded in `app/layout.tsx`.
   - **Never a slab serif** (Ultra was rejected: "looks Western").
4. **Nothing smaller than ~44px at 1080p** — must read from the back row.
5. **Fade transitions** between slides (View Transitions cross-fade, 0.55s).
6. **The controller carries the speaker's ENTIRE outline, verbatim** — it
   replaces his printed manuscript. Never paraphrase it down.
7. Ambient motion is allowed only if it's nearly invisible (the breathing
   hairline `.ambient-rule`, the 36s `drift` Ken Burns).

**Slide type classes** (`app/slides/slides.css`, `.panel` scope):
`.mega` (Archivo 900 caps punch) · `.statement` (Newsreader 600) ·
`.question` (Newsreader italic) · `.scripture` (passages) · `.kicker` /
`.badge` (spaced caps labels) · `.rows` (litany table) · `.nums` (numbered
challenge) · `.fill.parchment` (the procedural vintage ground).
Staged reveal: `class="stage" data-stage="2"` lands ~2.8s later — ONE click.

**Review workflow:** `node scripts/render-deck.mjs <deck-slug>` renders every
slide to `slide_review/<slug>/*.png` (gitignored) for Joe to inspect or drag
into Claude Desktop. Requires the dev server running.

---

## How to add a sermon (the next task)

A sermon on the homepage is separate from a slide deck. Homepage cards come
from `getRecentSermons()` → `seedSermons` in `lib/seed.ts`.

1. **Assets** → `public/sermons/<slug>/`: `artwork.jpg` (16:9, sharp → 1600w),
   `reflection-guide.pdf`, and `slides/NN.jpg` if there's a deck (1920w).
   Convert with a sharp script; source material goes in `past_sermons/<name>/`
   (gitignored — heavy).
2. **`lib/seed.ts`** — add a `SermonDetail` to `seedSermons`. Fields that
   matter: `slug`, `title`, `thesis`, `scripture_ref`, `scripture_text`,
   `sermon_date` (ISO), `artwork_url`, `summary`, `youtube_url`, `guide_url`,
   `is_featured`, `deck_slug`, `points[]` (5, drawn from Joe's real outline —
   his own language, slide taglines as labels).
   - **Set `is_featured: true` on the new one and false on `bagOfSeeds`**, or
     leave all false and let newest-by-date win. Never hardcode elsewhere.
3. **Deck (optional)** — add a `SeedSlideInput[]` and register it in
   `seedDecks` via `buildDeck(...)`.
4. **Mirror into SQL** — `supabase/migrations/002_seed.sql` for the sermon
   rows; for decks run `node scripts/export-deck-sql.mjs <slug> <uuid>` into a
   new numbered migration. Keep seed.ts and SQL identical.
5. Verify: `npx tsc --noEmit`, screenshot the homepage + `/sermons/<slug>`,
   confirm the guide PDF serves 200. Then commit, push, deploy.

Existing migrations: 001 init, 002 seed, 003 presentation, 004 open water,
005 the obvious, 006 knowledge.

---

## Still wanted from Joe (not blocking)

- Speaker photo + preferred bio (section renders text-only by design now).
- Contact email, Facebook / YouTube channel links (`lib/site.ts`, null = hidden).
- Favicon + OG image design.
- A real worship photo for the hero, and an exterior/building shot.

## Deliberately deferred

- **Supabase.** Migrations are written and idempotent but NOT applied. Steps:
  apply via `docker exec -i supabase-db psql -U supabase_admin -d postgres <
  file.sql`; add `cisco` to `PGRST_DB_SCHEMAS` in the Supabase docker `.env` +
  recreate PostgREST; set `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY` +
  `SUPABASE_SERVICE_ROLE_KEY` in the droplet `.env`; rebuild; run the
  RLS/notes/realtime checks in `supabase/migrations/README.md`. Schema is
  `cisco`, tables `cisco_`-prefixed, clients pass `db: { schema: "cisco" }`.
  Until then, deck state lives in the state route's process memory and
  tablet→projector sync works through the 2s poll (verified live).
- **HyperFrames / animated slide visuals.** Discussed repeatedly, never used.
  Joe's actual ask is "find a tool that makes slides genuinely engaging" — the
  tool choice is ours. The background system already accepts rendered mp4
  loops (`cisco_decks.metadata->backgrounds`), so animated moments can drop in
  per slide whenever we build them.

## Gotchas

- **No `n8n_default` network on this droplet.** External `web` network; Caddy
  proxies to `localhost:3060`.
- Changing `public/images/` requires clearing `.next/cache/images` or Next
  serves the stale optimized copy.
- Lockfile pins `@emnapi/runtime` + `@emnapi/core` as devDependencies (Windows
  npm omits them; `npm ci` then fails on Linux). Docker base is node:24-alpine.
- `sharp` can't be imported from the scratchpad — import it by absolute path:
  `node_modules/sharp/dist/index.mjs`.
- `scripts/render-deck.mjs` waits for the slide to commit before checking for
  staged elements; don't "optimize" that wait away or staged slides shoot early.
- The screen swallows View Transition `AbortError` on purpose (advancing
  mid-fade skips the transition — expected, not a bug).
- `next dev` appends a self-managing `nextjs-agent-rules` block to CLAUDE.md —
  leave it alone.
- **The dev server from the last session is stopped.** Start a fresh one with
  `npm run dev` (binds :3000) before screenshotting or rendering decks.
- Source folders `past_sermons/`, `presentation_module/`, `knowledge_slides/`,
  `sample_slides/`, `slide_review/` are gitignored (heavy / local-only).
