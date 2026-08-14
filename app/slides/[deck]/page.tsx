import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LiveViewer } from "@/components/slides/LiveViewer";
import { getDeck, getDeckState } from "@/lib/data";

export const dynamic = "force-dynamic";

type Params = { deck: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { deck: deckSlug } = await params;
  const deck = await getDeck(deckSlug);
  return {
    title: deck ? `${deck.title} — Slides` : "Slides",
    robots: { index: false },
  };
}

export default async function SlideViewerPage({ params }: { params: Promise<Params> }) {
  const { deck: deckSlug } = await params;
  const deck = await getDeck(deckSlug);
  if (!deck || deck.slides.length === 0) notFound();

  const initialState = await getDeckState(deck.id);

  return <LiveViewer deck={deck} initialState={initialState} />;
}
