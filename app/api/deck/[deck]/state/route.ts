import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/server";
import { seedDeck, seedDeckState, seedSlides } from "@/lib/seed";

/**
 * The only write path in the whole app.
 *
 * GET  ?key=            → { current_slide, is_live } — poll fallback for viewers.
 * GET  with valid key   → also { notes: [...] } for the presenter view.
 * POST { key, action }  → advance | back | jump | live | end. PRESENTER_KEY gated.
 *
 * The browser only ever holds the anon key; every state change lands here and
 * is executed with the service role key after the presenter secret checks out.
 */

type Params = { deck: string };

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

export async function GET(request: Request, { params }: { params: Promise<Params> }) {
  const { deck: deckSlug } = await params;
  const url = new URL(request.url);
  const withNotes = keyIsValid(url.searchParams.get("key"));

  const { db, deck } = await resolveDeck(deckSlug);

  if (!db || !deck) {
    // No database configured (local dev) — serve the seed deck so the flow
    // stays testable end to end.
    if (deckSlug !== seedDeck.slug) {
      return NextResponse.json({ error: "Unknown deck" }, { status: 404 });
    }
    return NextResponse.json({
      ...seedDeckState,
      offline: true,
      ...(withNotes && {
        notes: seedSlides.map((s) => ({ position: s.position, notes: s.notes })),
      }),
    });
  }

  const { data: state } = await db
    .from("cisco_deck_state")
    .select("current_slide, is_live")
    .eq("deck_id", deck.id)
    .maybeSingle();

  return NextResponse.json({
    current_slide: state?.current_slide ?? 1,
    is_live: state?.is_live ?? false,
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
    // Offline/local mode: acknowledge so the presenter UI keeps working,
    // but nothing is persisted and viewers won't sync.
    return NextResponse.json({ ok: true, offline: true });
  }

  const slideCount = deck.slides.length || 1;
  const { data: existing } = await db
    .from("cisco_deck_state")
    .select("current_slide, is_live")
    .eq("deck_id", deck.id)
    .maybeSingle();

  let current = existing?.current_slide ?? 1;
  let isLive = existing?.is_live ?? false;

  switch (body.action) {
    case "advance":
      current = Math.min(slideCount, current + 1);
      break;
    case "back":
      current = Math.max(1, current - 1);
      break;
    case "jump":
      if (typeof body.position !== "number") {
        return NextResponse.json({ error: "jump requires position" }, { status: 400 });
      }
      current = Math.min(slideCount, Math.max(1, Math.round(body.position)));
      break;
    case "live":
      isLive = true;
      break;
    case "end":
      isLive = false;
      break;
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  const { error } = await db
    .from("cisco_deck_state")
    .upsert({ deck_id: deck.id, current_slide: current, is_live: isLive });

  if (error) {
    return NextResponse.json({ error: "Write failed" }, { status: 500 });
  }

  return NextResponse.json({ current_slide: current, is_live: isLive });
}
