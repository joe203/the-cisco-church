import { stat } from "node:fs/promises";
import path from "node:path";

/**
 * Handouts for Joe's Wednesday-night class. They are not sermons, so they live
 * apart from the sermon data (no archive entry, no homepage spotlight) and
 * appear only on /downloads.
 *
 * The print layout is `/downloads/class/<slug>`; `node scripts/build-handouts.mjs
 * class <slug>` saves it as `public/downloads/class/<slug>.pdf`.
 */

export type ClassGuide = {
  slug: string;
  title: string;
  series: string;
  /** Opening paragraph under the title, shown on the sheet. */
  intro: string;
  groups: { heading: string; questions: string[] }[];
  /** The one question the class closes on. */
  closing: string;
};

export const classGuides: ClassGuide[] = [
  {
    slug: "vision-next-steps",
    title: "God’s vision helps us discover our next steps.",
    series: "Vision Series",
    intro: "Use these on your own or with the class. Think it through, and write down what stands out.",
    groups: [
      {
        heading: "Seeing God’s vision",
        questions: [
          "What do you think Genesis 1 and 2 reveal about the kind of relationship God wanted with humanity?",
          "What do you feel was lost in Genesis 3 besides access to the Garden?",
          "Where else in Scripture do we see God expressing His desire to live among His people?",
        ],
      },
      {
        heading: "Watching God act",
        questions: [
          "After humanity turned away, how did God continue moving toward humanity?",
          "Why did God form a people rather than work only with isolated individuals?",
          "What role did the Law play in moving people toward God’s larger purpose?",
          "What did Jesus make possible that rules, sacrifices, and human effort could not accomplish?",
        ],
      },
      {
        heading: "Understanding the church",
        questions: [
          "If God’s vision is a restored family, what should people experience when they are among God’s people?",
          "Are there church activities that we sometimes mistake for the vision itself?",
          "How can a church be busy with religious activity while overlooking God’s desire for a relationship?",
          "If God desires to be our Father and calls us His sons and daughters, how should that shape the way we treat people who are different from us?",
        ],
      },
      {
        heading: "A closer look",
        questions: [
          "Where can we already see evidence of God’s vision in our congregation?",
          "Where is there still a gap between God’s vision and what people experience among us?",
          "What is one way our congregation could make God’s welcome, presence, or love more visible?",
        ],
      },
    ],
    closing:
      "If God’s vision is to bring people into a loving relationship with Himself, what kind of church are we being invited to become?",
  },
];

export function getClassGuide(slug: string): ClassGuide | null {
  return classGuides.find((g) => g.slug === slug) ?? null;
}

export function classGuideUrl(slug: string): string {
  return `/downloads/class/${slug}.pdf`;
}

export type ClassDownload = {
  guide: ClassGuide;
  url: string;
  viewUrl: string;
  filename: string;
  sizeLabel: string | null;
};

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Class guides whose PDF has been built, so a download button is never dead. */
export async function getClassDownloads(): Promise<ClassDownload[]> {
  const found = await Promise.all(
    classGuides.map(async (guide): Promise<ClassDownload | null> => {
      try {
        const { size } = await stat(path.join(process.cwd(), "public", classGuideUrl(guide.slug)));
        return {
          guide,
          url: classGuideUrl(guide.slug),
          viewUrl: `/downloads/class/${guide.slug}`,
          filename: `${guide.slug}.pdf`,
          sizeLabel: formatSize(size),
        };
      } catch {
        return null;
      }
    }),
  );
  return found.filter((d): d is ClassDownload => d !== null);
}
