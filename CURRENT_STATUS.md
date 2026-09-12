# CURRENT_STATUS — TheCiscoChurch.org
Updated: 2026-09-12 · Read this first when starting a new session.

## NEXT TASK (Joe's stated priority)

**Add a new sermon to the home page.** Joe will supply the sermon details.
Everything needed is listed under "How to add a sermon" below — read that
section before starting, and ask Joe only for the details you can't derive
(title, date, scripture, links, assets).

---

## Where things stand

**Everything is committed, deployed, and live at https://theciscochurch.org.**
Working tree clean at `ddaf710`; the droplet is running that same commit.
No pending or half-finished work.

**Re-verified 2026-09-12** (a month after the last work session): homepage,
`/sermons`, a sermon page, both the screen and controls routes, the old
`/present` → `/controls` 308 redirect, and key `1701` driving the deck — all
answering correctly. Container up ~3 weeks, no drift.

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
