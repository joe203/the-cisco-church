import { stat } from "node:fs/promises";
import path from "node:path";
import { getSermonDetail, getSermonList } from "./data";
import type { SermonDetail } from "./types";

/**
 * Downloads are organized around the sermon: each lesson gets whichever of
 * these pieces exist for it.
 *
 *  - guide    — the reflection guide: a hand-made PDF (`guide_url`) when one
 *               exists, otherwise generated from the sermon's `guide_questions`.
 *  - recap    — the lesson in a page or two, built from the sermon's data.
 *  - outline  — a skeletal notes page with room to write, built from the points.
 *  - nuggets  — a few standout lines ("gold nuggets"), from `sermon.nuggets`.
 *
 * recap / outline / nuggets (and a questions-based guide) are generated: the print layouts live at
 * `/downloads/[slug]/[piece]`, and `node scripts/build-handouts.mjs <slug>`
 * saves them as PDFs in `public/downloads/<slug>/`. A piece is listed only
 * when its PDF exists, so a download button is never dead.
 */

export type PieceKind = "guide" | "recap" | "outline" | "nuggets";
/** Every piece can be generated; a hand-made guide PDF simply takes precedence. */
export type PrintPiece = PieceKind;

export const pieceOrder: PieceKind[] = ["guide", "recap", "nuggets", "outline"];
export const printPieces: PrintPiece[] = ["guide", "recap", "outline", "nuggets"];

export const pieceMeta: Record<PieceKind, { label: string; blurb: string }> = {
  guide: {
    label: "Reflection guide",
    blurb: "Questions to work through alone or with a group.",
  },
  recap: {
    label: "Sermon recap",
    blurb: "The whole lesson on a page or two, with its verses.",
  },
  nuggets: {
    label: "Gold nuggets",
    blurb: "A few lines worth keeping.",
  },
  outline: {
    label: "Notes page",
    blurb: "The outline with room to write your own thoughts.",
  },
};

export function isPrintPiece(value: string): value is PrintPiece {
  return (printPieces as string[]).includes(value);
}

/** Can this sermon supply the content for a printable piece? */
export function canBuildPiece(sermon: SermonDetail, piece: PrintPiece): boolean {
  if (piece === "nuggets") return (sermon.nuggets ?? []).length > 0;
  if (piece === "guide") return (sermon.guide_questions ?? []).length > 0;
  return sermon.points.length > 0;
}

export function pieceUrl(slug: string, piece: PrintPiece): string {
  return `/downloads/${slug}/${piece}.pdf`;
}

export type Piece = {
  kind: PieceKind;
  /** The file to download. */
  url: string;
  /** Where "View" goes: the on-site print page for generated pieces, else the file. */
  viewUrl: string;
  filename: string;
  sizeLabel: string | null;
};

export type SermonDownloads = {
  sermon: SermonDetail;
  pieces: Piece[];
};

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Size of a bundled /public file, or null when it isn't there. */
async function fileSize(url: string): Promise<number | null> {
  if (!url.startsWith("/") || url.includes("..")) return null;
  try {
    return (await stat(path.join(process.cwd(), "public", url))).size;
  } catch {
    return null;
  }
}

async function piecesFor(sermon: SermonDetail): Promise<Piece[]> {
  const candidates: { kind: PieceKind; url: string | null }[] = [
    { kind: "guide", url: sermon.guide_url ?? pieceUrl(sermon.slug, "guide") },
    ...printPieces
      .filter((kind) => kind !== "guide")
      .map((kind) => ({ kind, url: pieceUrl(sermon.slug, kind) })),
  ];

  const found = await Promise.all(
    candidates.map(async ({ kind, url }): Promise<Piece | null> => {
      if (!url) return null;
      const bytes = await fileSize(url);
      // Remote guide links can't be checked; local files must exist.
      if (bytes === null && url.startsWith("/")) return null;
      return {
        kind,
        url,
        viewUrl: url === pieceUrl(sermon.slug, kind) ? `/downloads/${sermon.slug}/${kind}` : url,
        filename: `${sermon.slug}-${kind}.pdf`,
        sizeLabel: bytes === null ? null : formatSize(bytes),
      };
    }),
  );

  return pieceOrder.flatMap((kind) => found.filter((p): p is Piece => p?.kind === kind));
}

/** Every sermon that has at least one download, newest first. */
export async function getSermonDownloads(): Promise<SermonDownloads[]> {
  const list = await getSermonList();
  const details = await Promise.all(list.map((s) => getSermonDetail(s.slug)));

  const withPieces = await Promise.all(
    details
      .filter((s): s is SermonDetail => s !== null)
      .map(async (sermon) => ({ sermon, pieces: await piecesFor(sermon) })),
  );

  return withPieces
    .filter((d) => d.pieces.length > 0)
    .sort((a, b) => b.sermon.sermon_date.localeCompare(a.sermon.sermon_date));
}
