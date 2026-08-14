import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Presenter } from "@/components/slides/Presenter";
import { getDeck, getDeckState } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Presenter",
  robots: { index: false },
};

type Params = { deck: string };

export default async function PresenterPage({ params }: { params: Promise<Params> }) {
  const { deck: deckSlug } = await params;
  const deck = await getDeck(deckSlug);
  if (!deck || deck.slides.length === 0) notFound();

  const initialState = await getDeckState(deck.id);

  return <Presenter deck={deck} initialState={initialState} />;
}
