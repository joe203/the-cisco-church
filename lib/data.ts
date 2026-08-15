import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { findSeedDeck, seedDeckState, seedSermonList, seedSermons } from "./seed";
import type { Deck, DeckState, Sermon, SermonDetail } from "./types";

/**
 * Server-side data layer. Reads use the ANON key — every read on this site
 * is public by design (RLS: public SELECT, no writes).
 *
 * Every function falls back to bundled seed data when Supabase is
 * unconfigured or unreachable: the site must never render empty because
 * the database is down.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- untyped shared instance, schema pinned to "cisco"
type Db = SupabaseClient<any, any, any, any, any>;

let cached: Db | null | undefined;

function db(): Db | null {
  if (cached !== undefined) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  cached = url && anonKey
    ? createClient(url, anonKey, {
        db: { schema: "cisco" },
        auth: { persistSession: false },
      })
    : null;
  return cached;
}

const SERMON_COLUMNS =
  "id, slug, title, thesis, scripture_ref, scripture_text, sermon_date, artwork_url, summary, youtube_url, podcast_url, guide_url, pdf_url, is_featured";

export async function getSermonList(): Promise<Sermon[]> {
  const client = db();
  if (client) {
    const { data, error } = await client
      .from("cisco_sermons")
      .select(SERMON_COLUMNS)
      .order("sermon_date", { ascending: false });
    if (!error && data && data.length > 0) return data as Sermon[];
  }
  return seedSermonList().sort((a, b) => b.sermon_date.localeCompare(a.sermon_date));
}

/** Featured = `is_featured`, falling back to the newest by date. Never hardcoded. */
export async function getFeaturedSermon(): Promise<Sermon | null> {
  const list = await getSermonList();
  if (list.length === 0) return null;
  return list.find((s) => s.is_featured) ?? list[0];
}

export async function getRecentSermons(count = 3): Promise<Sermon[]> {
  const list = await getSermonList();
  return list.slice(0, count);
}

export async function getSermonDetail(slug: string): Promise<SermonDetail | null> {
  const client = db();
  if (client) {
    const { data, error } = await client
      .from("cisco_sermons")
      .select(
        `${SERMON_COLUMNS},
         points:cisco_sermon_points(position, title, label, body),
         speaker:cisco_speakers(id, slug, name, photo_url, tags, bio),
         decks:cisco_decks(slug)`,
      )
      .eq("slug", slug)
      .maybeSingle();
    if (!error && data) {
      const { points, speaker, decks, ...sermon } = data as Record<string, unknown>;
      const pointList = (points as SermonDetail["points"] | null) ?? [];
      const deckList = (decks as { slug: string }[] | null) ?? [];
      return {
        ...(sermon as Sermon),
        points: [...pointList].sort((a, b) => a.position - b.position),
        speaker: (speaker as SermonDetail["speaker"]) ?? null,
        deck_slug: deckList[0]?.slug ?? null,
      };
    }
  }
  return seedSermons.find((s) => s.slug === slug) ?? null;
}

export async function getDeck(slug: string): Promise<Deck | null> {
  const client = db();
  if (client) {
    // Explicit columns on cisco_slides — anon has no grant on `notes`.
    const { data, error } = await client
      .from("cisco_decks")
      .select(
        `id, slug, title, metadata,
         sermon:cisco_sermons(slug),
         slides:cisco_slides(position, html, outline_html, bg)`,
      )
      .eq("slug", slug)
      .maybeSingle();
    if (!error && data) {
      const { slides, sermon, metadata, ...deck } = data as Record<string, unknown>;
      const slideList = (slides as Deck["slides"] | null) ?? [];
      const sermonRow = sermon as { slug: string } | { slug: string }[] | null;
      const meta = (metadata as { backgrounds?: Deck["backgrounds"] } | null) ?? {};
      return {
        ...(deck as Omit<Deck, "slides" | "sermon_slug" | "backgrounds">),
        sermon_slug: Array.isArray(sermonRow) ? (sermonRow[0]?.slug ?? null) : (sermonRow?.slug ?? null),
        backgrounds: meta.backgrounds ?? {},
        slides: [...slideList].sort((a, b) => a.position - b.position),
      };
    }
  }
  return findSeedDeck(slug);
}

export async function getDeckState(deckId: string): Promise<DeckState> {
  const client = db();
  if (client) {
    const { data, error } = await client
      .from("cisco_deck_state")
      .select("current_slide, is_live, is_blank")
      .eq("deck_id", deckId)
      .maybeSingle();
    if (!error && data) return data as DeckState;
  }
  return seedDeckState;
}
