import { NextResponse } from "next/server";
import { findSeedDeck, seedDeckNotes } from "@/lib/seed";
import { getServiceClient } from "@/lib/supabase/server";
import type { DeckState } from "@/lib/types";

/**
 * The only write path in the whole app.
 *
 * GET  ?key=            → { current_slide, is_live, is_blank } — poll for viewers.
 * GET  with valid key   → also { notes: [...] } for the presenter view.
 * POST { key, action }  → advance | back | jump | blank | live | end.
 *                         PRESENTER_KEY gated.
 *
 * The browser only ever holds the anon key; every state change lands here and
 * is executed with the service role key after the presenter secret checks out.
 *
 * When Supabase is not configured, deck state lives in this module's memory —
 * the app runs as a single process, so presenter and screens on DIFFERENT
 * devices still sync through it (screens poll). It resets on restart, which
 * only means "back to slide 1". Once Supabase is connected, the database
 * becomes the store and Realtime pushes changes instantly.
 */

type Params = { deck: string };

const memoryState = new Map<string, DeckState>();

function memory(deckSlug: string): DeckState {
  let state = memoryState.get(deckSlug);
  if (!state) {
    state = { current_slide: 1, is_live: false, is_blank: false };
    memoryState.set(deckSlug, state);
  }
  return state;
}

function keyIsValid(key: string | null): boolean {
  const expected = process.env.PRESENTER_KEY;
  return Boolean(expected && key && key === expected);
}

async function resolveDeck(deckSlug: string) {
  const db = getServiceClient();
  if (!db) return { db: null, deck: null };
  const { data } = await db
    .from("cisco_decks")
    .select("id, slug, slides:cisco_slides(position, html, notes)")
    .eq("slug", deckSlug)
    .maybeSingle();
  return { db, deck: data as { id: string; slug: string; slides: { position: number; notes: string | null }[] } | null };
}

function applyAction(
  state: DeckState,
  action: string | undefined,
  position: number | undefined,
  slideCount: number,
): DeckState | null {
  const next = { ...state };
  switch (action) {
    case "advance":
      next.current_slide = Math.min(slideCount, next.current_slide + 1);
      break;
    case "back":
      next.current_slide = Math.max(1, next.current_slide - 1);
      break;
    case "jump":
      if (typeof position !== "number") return null;
      next.current_slide = Math.min(slideCount, Math.max(1, Math.round(position)));
      break;
    case "blank":
      next.is_blank = !next.is_blank;
      break;
    case "live":
      next.is_live = true;
      break;
    case "end":
      next.is_live = false;
      break;
    default:
      return null;
  }
  return next;
}

export async function GET(request: Request, { params }: { params: Promise<Params> }) {
  const { deck: deckSlug } = await params;
  const url = new URL(request.url);
  const withNotes = keyIsValid(url.searchParams.get("key"));

  const { db, deck } = await resolveDeck(deckSlug);

  if (!db || !deck) {
    // No database configured — serve seed decks from in-process state.
    const notes = seedDeckNotes(deckSlug);
    if (!notes) {
      return NextResponse.json({ error: "Unknown deck" }, { status: 404 });
    }
    return NextResponse.json({
      ...memory(deckSlug),
      offline: true,
      ...(withNotes && { notes }),
    });
  }

  const { data: state } = await db
    .from("cisco_deck_state")
    .select("current_slide, is_live, is_blank")
    .eq("deck_id", deck.id)
    .maybeSingle();

  return NextResponse.json({
    current_slide: state?.current_slide ?? 1,
    is_live: state?.is_live ?? false,
    is_blank: state?.is_blank ?? false,
    ...(withNotes && {
      notes: [...deck.slides]
        .sort((a, b) => a.position - b.position)
        .map((s) => ({ position: s.position, notes: s.notes ?? null })),
    }),
  });
}

export async function POST(request: Request, { params }: { params: Promise<Params> }) {
  const { deck: deckSlug } = await params;

  let body: { key?: string; action?: string; position?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!keyIsValid(body.key ?? null)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { db, deck } = await resolveDeck(deckSlug);

  if (!db || !deck) {
    // No database — persist in process memory so screens on other devices
    // stay in sync through their polls.
    const seed = findSeedDeck(deckSlug);
    if (!seed) {
      return NextResponse.json({ error: "Unknown deck" }, { status: 404 });
    }
    const next = applyAction(memory(deckSlug), body.action, body.position, seed.slides.length || 1);
    if (!next) {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
    memoryState.set(deckSlug, next);
    return NextResponse.json({ ...next, offline: true });
  }

  const slideCount = deck.slides.length || 1;
  const { data: existing } = await db
    .from("cisco_deck_state")
    .select("current_slide, is_live, is_blank")
    .eq("deck_id", deck.id)
    .maybeSingle();

  const current: DeckState = {
    current_slide: existing?.current_slide ?? 1,
    is_live: existing?.is_live ?? false,
    is_blank: existing?.is_blank ?? false,
  };
  const next = applyAction(current, body.action, body.position, slideCount);
  if (!next) {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  const { error } = await db.from("cisco_deck_state").upsert({
    deck_id: deck.id,
    current_slide: next.current_slide,
    is_live: next.is_live,
    is_blank: next.is_blank,
  });

  if (error) {
    return NextResponse.json({ error: "Write failed" }, { status: 500 });
  }

  return NextResponse.json(next);
}
