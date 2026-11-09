// Copy every sermon, series, speaker and slide deck from lib/seed.ts into the
// database, then read it all back and check it matches. Open pages update live.
//
//   node scripts/sync-sermons.mjs            sync + check
//   node scripts/sync-sermons.mjs --check    check only (no writes)
//   node scripts/sync-sermons.mjs --public   check what the PUBLIC can read (anon key)
//
// lib/seed.ts stays the place sermons are written; this script is how an edit
// reaches the live site without a rebuild. New files under public/ (artwork,
// slide images, handout PDFs) still need a deploy. A sermon or deck removed
// from seed.ts is removed from the database too.
// Reads .env.local (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_ANON_KEY).

import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { seedDecks, seedSermons } from "../lib/seed.ts";

try {
  process.loadEnvFile(".env.local");
} catch {
  // fall through — the variables may already be in the environment
}

const mode = process.argv[2] ?? "sync";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = mode === "--public" ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL plus the service (or anon) key must be set (.env.local).");
  process.exit(1);
}
const db = createClient(url, key, { db: { schema: "cisco" }, auth: { persistSession: false } });

/** Stable uuid per row, so re-running updates rows in place instead of duplicating them. */
function uuidFor(kind, slug) {
  const h = createHash("sha1").update(`cisco:${kind}:${slug}`).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-8${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

function must({ error }, what) {
  if (error) {
    console.error(`FAILED: ${what}: ${error.message}`);
    process.exit(1);
  }
}

async function sync() {
  const speakers = new Map();
  const series = new Map();
  for (const s of seedSermons) {
    if (s.speaker) speakers.set(s.speaker.slug, s.speaker);
    if (s.series) series.set(s.series.slug, s.series);
  }

  must(await db.from("cisco_speakers").upsert(
    [...speakers.values()].map((p) => ({
      id: uuidFor("speaker", p.slug), slug: p.slug, name: p.name, photo_url: p.photo_url ?? null, tags: p.tags ?? [], bio: p.bio ?? null,
    })),
    { onConflict: "slug" },
  ), "speakers");

  must(await db.from("cisco_series").upsert(
    [...series.values()].map((s) => ({
      id: uuidFor("series", s.slug), slug: s.slug, title: s.title, scripture_ref: s.scripture_ref ?? null, tagline: s.tagline ?? null, artwork_url: s.artwork_url ?? null,
    })),
    { onConflict: "slug" },
  ), "series");

  must(await db.from("cisco_sermons").upsert(
    seedSermons.map((s) => ({
      id: uuidFor("sermon", s.slug),
      slug: s.slug,
      title: s.title,
      thesis: s.thesis ?? null,
      teaser: s.teaser ?? null,
      scripture_ref: s.scripture_ref ?? null,
      scripture_text: s.scripture_text ?? null,
      sermon_date: s.sermon_date,
      artwork_url: s.artwork_url ?? null,
      summary: s.summary ?? null,
      youtube_url: s.youtube_url ?? null,
      podcast_url: s.podcast_url ?? null,
      guide_url: s.guide_url ?? null,
      pdf_url: s.pdf_url ?? null,
      nuggets: s.nuggets ?? [],
      guide_questions: s.guide_questions ?? [],
      speaker_id: s.speaker ? uuidFor("speaker", s.speaker.slug) : null,
      series_id: s.series ? uuidFor("series", s.series.slug) : null,
      lesson_number: s.lesson_number ?? null,
      is_featured: Boolean(s.is_featured),
    })),
    { onConflict: "slug" },
  ), "sermons");

  for (const s of seedSermons) {
    const sermonId = uuidFor("sermon", s.slug);
    const points = s.points ?? [];
    if (points.length) {
      must(await db.from("cisco_sermon_points").upsert(
        points.map((p) => ({ sermon_id: sermonId, position: p.position, title: p.title, label: p.label ?? null, body: p.body ?? null })),
        { onConflict: "sermon_id,position" },
      ), `points for ${s.slug}`);
    }
    must(await db.from("cisco_sermon_points").delete().eq("sermon_id", sermonId)
      .not("position", "in", `(${[0, ...points.map((p) => p.position)].join(",")})`), `extra points for ${s.slug}`);
  }

  must(await db.from("cisco_decks").upsert(
    seedDecks.map((d) => ({
      id: uuidFor("deck", d.slug),
      slug: d.slug,
      title: d.title,
      sermon_id: d.sermon_slug ? uuidFor("sermon", d.sermon_slug) : null,
      metadata: { backgrounds: d.backgrounds ?? {} },
    })),
    { onConflict: "slug" },
  ), "decks");

  for (const d of seedDecks) {
    const deckId = uuidFor("deck", d.slug);
    must(await db.from("cisco_slides").upsert(
      d.slidesWithNotes.map((s) => ({ deck_id: deckId, position: s.position, html: s.html, outline_html: s.outline_html ?? null, bg: s.bg ?? null, notes: s.notes ?? null })),
      { onConflict: "deck_id,position" },
    ), `slides for ${d.slug}`);
    must(await db.from("cisco_slides").delete().eq("deck_id", deckId)
      .not("position", "in", `(${[0, ...d.slidesWithNotes.map((s) => s.position)].join(",")})`), `extra slides for ${d.slug}`);
  }

  // Anything no longer in seed.ts comes out of the database too.
  const quoted = (list) => `(${list.map((x) => `"${x}"`).join(",")})`;
  must(await db.from("cisco_decks").delete().not("slug", "in", quoted(seedDecks.map((d) => d.slug))), "removed decks");
  must(await db.from("cisco_sermons").delete().not("slug", "in", quoted(seedSermons.map((s) => s.slug))), "removed sermons");

  console.log(`synced ${seedSermons.length} sermons, ${series.size} series, ${speakers.size} speaker(s), ${seedDecks.length} decks`);
}

// ---- check: read back with the same queries lib/data.ts uses and compare to seed.ts

const SERMON_COLUMNS = `slug, title, thesis, teaser, scripture_ref, scripture_text, sermon_date, artwork_url, summary, youtube_url, podcast_url, guide_url, pdf_url, nuggets, guide_questions, is_featured, lesson_number,
   series:cisco_series(slug, title, scripture_ref, tagline, artwork_url)`;
const FIELDS = ["slug", "title", "thesis", "teaser", "scripture_ref", "scripture_text", "sermon_date", "artwork_url", "summary", "youtube_url", "podcast_url", "guide_url", "pdf_url", "is_featured", "lesson_number"];

const one = (v) => (Array.isArray(v) ? v[0] : v) ?? null;
// Key order doesn't matter (jsonb and embedded rows come back in their own order).
const canon = (v) =>
  Array.isArray(v) ? v.map(canon)
  : v && typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k])]))
  : v;
const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b));

async function check() {
  const problems = [];
  const differ = (where, a, b) => { if (!same(a, b)) problems.push(`${where}\n    database: ${JSON.stringify(a)?.slice(0, 160)}\n    seed.ts:  ${JSON.stringify(b)?.slice(0, 160)}`); };

  const { data: rows, error } = await db
    .from("cisco_sermons")
    .select(`${SERMON_COLUMNS}, points:cisco_sermon_points(position, title, label, body), speaker:cisco_speakers(slug, name, photo_url, tags, bio), decks:cisco_decks(slug)`);
  if (error) { console.error(`FAILED to read sermons: ${error.message}`); process.exit(1); }
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  if (rows.length !== seedSermons.length) problems.push(`sermon count: database ${rows.length}, seed.ts ${seedSermons.length}`);

  for (const s of seedSermons) {
    const r = bySlug.get(s.slug);
    if (!r) { problems.push(`missing sermon ${s.slug}`); continue; }
    for (const f of FIELDS) differ(`${s.slug}.${f}`, r[f] ?? null, f === "is_featured" ? Boolean(s[f]) : (s[f] ?? null));
    differ(`${s.slug}.nuggets`, r.nuggets ?? [], s.nuggets ?? []);
    differ(`${s.slug}.guide_questions`, r.guide_questions ?? [], s.guide_questions ?? []);
    const series = one(r.series);
    differ(`${s.slug}.series`, series, s.series ? { slug: s.series.slug, title: s.series.title, scripture_ref: s.series.scripture_ref ?? null, tagline: s.series.tagline ?? null, artwork_url: s.series.artwork_url ?? null } : null);
    const sp = one(r.speaker);
    differ(`${s.slug}.speaker`, sp, s.speaker ? { slug: s.speaker.slug, name: s.speaker.name, photo_url: s.speaker.photo_url ?? null, tags: s.speaker.tags ?? [], bio: s.speaker.bio ?? null } : null);
    differ(`${s.slug}.points`, [...(r.points ?? [])].sort((a, b) => a.position - b.position),
      (s.points ?? []).map((p) => ({ position: p.position, title: p.title, label: p.label ?? null, body: p.body ?? null })));
    differ(`${s.slug}.deck`, one(r.decks)?.slug ?? null, s.deck_slug ?? null);
  }

  const slideCols = mode === "--public" ? "position, html, outline_html, bg" : "position, html, outline_html, bg, notes";
  for (const d of seedDecks) {
    const { data: deck, error: deckError } = await db
      .from("cisco_decks")
      .select(`slug, title, metadata, sermon:cisco_sermons(slug), slides:cisco_slides(${slideCols})`)
      .eq("slug", d.slug)
      .maybeSingle();
    if (deckError || !deck) { problems.push(`missing deck ${d.slug} ${deckError?.message ?? ""}`); continue; }
    differ(`deck ${d.slug}.title`, deck.title, d.title);
    differ(`deck ${d.slug}.sermon`, one(deck.sermon)?.slug ?? null, d.sermon_slug ?? null);
    differ(`deck ${d.slug}.backgrounds`, deck.metadata?.backgrounds ?? {}, d.backgrounds ?? {});
    const want = d.slidesWithNotes.map((s) => ({
      position: s.position, html: s.html, outline_html: s.outline_html ?? null, bg: s.bg ?? null, ...(mode === "--public" ? {} : { notes: s.notes ?? null }),
    }));
    differ(`deck ${d.slug}.slides`, [...deck.slides].sort((a, b) => a.position - b.position), want);
  }

  if (problems.length) {
    console.error(`CHECK FAILED — ${problems.length} difference(s):\n  ${problems.join("\n  ")}`);
    process.exit(1);
  }
  console.log(`check passed${mode === "--public" ? " (public view)" : ""}: ${seedSermons.length} sermons and ${seedDecks.length} decks match lib/seed.ts exactly`);
}

if (mode === "sync") await sync();
await check();
