import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideSheet, NuggetsSheet, OutlineSheet, RecapSheet } from "@/components/downloads/Handouts";
import { getSermonDetail } from "@/lib/data";
import { canBuildPiece, isPrintPiece } from "@/lib/downloads";

export const revalidate = 300;

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type Params = { slug: string; piece: string };

/** Just the sheet, no site header or footer — what the View window on /downloads shows. */
export default async function EmbeddedHandoutPage({ params }: { params: Promise<Params> }) {
  const { slug, piece } = await params;
  if (!isPrintPiece(piece)) notFound();
  const sermon = await getSermonDetail(slug);
  if (!sermon || !canBuildPiece(sermon, piece)) notFound();

  return (
    <div className="min-h-dvh bg-sand p-3 sm:p-5">
      {piece === "guide" && <GuideSheet sermon={sermon} />}
      {piece === "outline" && <OutlineSheet sermon={sermon} />}
      {piece === "recap" && <RecapSheet sermon={sermon} />}
      {piece === "nuggets" && <NuggetsSheet sermon={sermon} />}
    </div>
  );
}
