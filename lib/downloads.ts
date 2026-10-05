import { stat } from "node:fs/promises";
import path from "node:path";
import { getSermonList } from "./data";

/**
 * The downloads catalog — printable handouts only (no video; that's a
 * separate page that will link back here).
 *
 * Two sources feed `/downloads`:
 *  1. Every sermon with a `guide_url` automatically gets a reflection guide
 *     entry, so adding a sermon never means editing this file.
 *  2. `manualDownloads` below — everything else (sermon notes, verse cards,
 *     quote sheets, general handouts).
 *
 * To add a handout: drop the PDF in `public/downloads/` and add one entry to
 * `manualDownloads`. Set `sermon_slug` to link it to a sermon page.
 */

export type DownloadKind = "guide" | "notes" | "verses" | "quotes" | "handout";

export type Download = {
  id: string;
  kind: DownloadKind;
  title: string;
  /** One or two plain sentences: what this is and who it's for. */
  blurb: string | null;
  /** ISO date (yyyy-mm-dd) — newest first within each kind. */
  date: string;
  /** Public path, e.g. "/downloads/the-bag-of-seeds-notes.pdf". */
  url: string;
  /** Saved-as name when downloaded. Defaults to the file's own name. */
  filename?: string;
  sermon_slug?: string;
  sermon_title?: string;
  scripture_ref?: string | null;
};

export type DownloadItem = Download & { sizeLabel: string | null };

export const kindMeta: Record<
  DownloadKind,
  { label: string; plural: string; blurb: string; band: string }
> = {
  guide: {
    label: "Reflection guide",
    plural: "Reflection guides",
    blurb: "Questions to work through on your own or with a group after the lesson.",
    band: "bg-teal text-white",
  },
  notes: {
    label: "Sermon notes",
    plural: "Sermon notes",
    blurb: "The highlights of a lesson on one page — to review, mark up, or share.",
    band: "bg-clay text-white",
  },
  verses: {
    label: "Verses",
    plural: "Verses to keep",
    blurb: "The passages from a lesson, ready to print and put where you'll see them.",
    band: "bg-deepsea text-white",
  },
  quotes: {
    label: "Quotes",
    plural: "Quotes worth keeping",
    blurb: "Lines from a lesson worth reading again.",
    band: "bg-marigold text-ink",
  },
  handout: {
    label: "Handout",
    plural: "Handouts",
    blurb: "Everything else we put on paper.",
    band: "bg-ink text-white",
  },
};

export const kindOrder: DownloadKind[] = ["guide", "notes", "verses", "quotes", "handout"];

export const manualDownloads: Download[] = [];

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** File size for a bundled /public file; null for remote URLs or missing files. */
async function sizeLabelFor(url: string): Promise<string | null> {
  if (!url.startsWith("/") || url.includes("..")) return null;
  try {
    const file = await stat(path.join(process.cwd(), "public", url));
    return formatSize(file.size);
  } catch {
    return null;
  }
}

export async function getDownloads(): Promise<DownloadItem[]> {
  const sermons = await getSermonList();

  const guides: Download[] = sermons
    .filter((s) => s.guide_url)
    .map((s) => ({
      id: `guide-${s.slug}`,
      kind: "guide",
      title: s.title,
      blurb: s.thesis,
      date: s.sermon_date,
      url: s.guide_url as string,
      filename: `${s.slug}-reflection-guide.pdf`,
      sermon_slug: s.slug,
      sermon_title: s.title,
      scripture_ref: s.scripture_ref,
    }));

  const manualUrls = new Set(manualDownloads.map((d) => d.url));
  const all = [...manualDownloads, ...guides.filter((g) => !manualUrls.has(g.url))].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return Promise.all(all.map(async (d) => ({ ...d, sizeLabel: await sizeLabelFor(d.url) })));
}
