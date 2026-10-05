import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideSheet, NuggetsSheet, OutlineSheet, RecapSheet } from "@/components/downloads/Handouts";
import { PrintButton } from "@/components/bulletin/PrintButton";
import { getSermonDetail } from "@/lib/data";
import { canBuildPiece, isPrintPiece, pieceMeta, pieceUrl } from "@/lib/downloads";

export const revalidate = 300;

type Params = { slug: string; piece: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, piece } = await params;
  const sermon = await getSermonDetail(slug);
  if (!sermon || !isPrintPiece(piece)) return {};
  return {
    title: `${pieceMeta[piece].label}: ${sermon.title}`,
    robots: { index: false, follow: true },
  };
}

export default async function HandoutPage({ params }: { params: Promise<Params> }) {
  const { slug, piece } = await params;
  if (!isPrintPiece(piece)) notFound();
  const sermon = await getSermonDetail(slug);
  if (!sermon || !canBuildPiece(sermon, piece)) notFound();

  return (
    <div className="bg-sand py-8 print:bg-white print:py-0">
      <div className="mx-auto mb-5 flex max-w-[8.5in] flex-wrap items-center justify-between gap-4 px-5 sm:px-0 print:hidden">
        <Link href="/downloads" className="btn-ghost !py-1">
          <span aria-hidden>&larr;</span> All downloads
        </Link>
        <div className="flex items-center gap-6">
          <a
            href={pieceUrl(slug, piece)}
            download={`${slug}-${piece}.pdf`}
            className="eyebrow link-under text-teal hover:text-deepsea"
          >
            Download PDF
          </a>
          <PrintButton label="Print" />
        </div>
      </div>

      {piece === "guide" && <GuideSheet sermon={sermon} />}
      {piece === "outline" && <OutlineSheet sermon={sermon} />}
      {piece === "recap" && <RecapSheet sermon={sermon} />}
      {piece === "nuggets" && <NuggetsSheet sermon={sermon} />}
    </div>
  );
}
