import type { MetadataRoute } from "next";
import { getSermonList } from "@/lib/data";
import { isAnnounced } from "@/lib/series";

const ORIGIN = "https://theciscochurch.org";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sermons = (await getSermonList()).filter((s) => isAnnounced(s));

  return [
    { url: `${ORIGIN}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${ORIGIN}/sermons`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${ORIGIN}/downloads`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${ORIGIN}/bulletin`, changeFrequency: "weekly", priority: 0.7 },
    ...sermons.map((s) => ({
      url: `${ORIGIN}/sermons/${s.slug}`,
      lastModified: s.sermon_date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
