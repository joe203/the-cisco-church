# TheCiscoChurch.org — Temporary Sermon Site

A deliberately small site for the **Cisco Church of Christ** in Cisco, Texas.
Built with **Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Supabase**,
containerized for the self-hosted DigitalOcean + Caddy stack.

> **This is a temporary site.** Its job is a warm first impression, service
> times, sermon pages with materials, and live HTML slides. A full build comes
> later. `CLAUDE.md` is the authoritative spec.

## Getting started

```bash
npm install
cp .env.example .env      # fill in Supabase keys + presenter key
npm run dev               # http://localhost:3000
```

Without Supabase keys the site runs on bundled seed data — pages never render
empty. Add the keys and the database takes over.

## Environment

```
NEXT_PUBLIC_SUPABASE_URL=https://supabase.concan.church
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...     # server only
PRESENTER_KEY=...                 # unlocks presenter control
```

## Brand

Warm dark-and-parchment system derived from Joe's hand-built sermon pages:
Espresso `#17110D` / Pitch `#0D0906` dark fields, Parchment `#EDE6DA` / Bone
`#F7F2E9` light bands, Lamplight `#C9A063` gold accent, Bodoni Moda display +
Figtree body. Full token table in `CLAUDE.md`.

## Routes

```
/                        homepage — congregation hero, times & location, welcome, recent sermons
/sermons                 archive, newest first
/sermons/[slug]          single sermon — deck viewer, scripture, points, resources, speaker
/slides/[deck]           live viewer — follows the presenter in real time
/slides/[deck]/present   presenter controls (PRESENTER_KEY required)
/api/deck/[deck]/state   POST — advance the live cursor (server-side write)
```

## How the slides work

Slides are HTML fragments in Postgres. One row in `cisco_deck_state` holds the
live cursor per deck.

- **Presenter** opens `/slides/[deck]/present`, enters the presenter key once,
  advances with arrows/space/tap. Each advance POSTs to a Route Handler that
  writes with the service role key.
- **Viewers** (projector + phones) open `/slides/[deck]` and follow via
  Supabase Realtime; a 5-second poll runs alongside as a fallback.
- When `is_live` is false the viewer is self-paced.

The browser only ever holds the anon key, and the anon key can only read.

## Database

Self-hosted Supabase at `supabase.concan.church`, **shared with other
FiveSixteen projects**. Every table is `cisco_`-prefixed with RLS. Schema lives
in `supabase/migrations/` — if it isn't in the repo, it doesn't exist.

```
cisco_speakers       slug, name, photo_url, tags[], bio
cisco_sermons        slug, title, thesis, scripture, dates, media URLs, is_featured
cisco_sermon_points  sermon_id, position, title, label, body
cisco_decks          slug, title, sermon_id
cisco_slides         deck_id, position, html, notes (never public)
cisco_deck_state     deck_id, current_slide, is_live      ← the realtime row
```

Realtime requires:

```sql
alter publication supabase_realtime add table cisco_deck_state;
alter table cisco_deck_state replica identity full;
```

## Deployment (DigitalOcean + Caddy)

```bash
docker build -t cisco-church . \
  && docker stop cisco-church 2>/dev/null; docker rm cisco-church 2>/dev/null \
  ; docker run -d --name cisco-church --network n8n_default --env-file .env cisco-church
```

Caddyfile:

```
theciscochurch.org, www.theciscochurch.org {
    reverse_proxy cisco-church:3000
}
```

## Needed from the church

- [x] Service times — Sun 9:30 class · 10:30 worship · 6:00 PM evening · Wed 7:00 PM
- [x] Street address — 1701 Avenue N, Cisco, TX 76437
- [x] Contact phone — (254) 442-1450
- [ ] Contact email, if one should be published
- [ ] Facebook / YouTube / livestream URL, if one exists
- [ ] The four photos in `PHOTO_GUIDE.md`
- [ ] Sermon assets: artwork, guide PDFs, slide content

Until these arrive, `lib/site.ts` carries clearly marked `TODO` placeholders.

## Deliberately not built

About · leadership · ministries · groups · events calendar · giving · public
accounts · contact form · general CMS. All deferred to the permanent site.
