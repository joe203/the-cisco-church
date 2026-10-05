import { Hero } from "@/components/sections/Hero";
import { SermonSpotlight } from "@/components/sections/SermonSpotlight";
import { ServiceBand } from "@/components/sections/ServiceBand";
import { Welcome } from "@/components/sections/Welcome";
import { getSeriesLessons, getSermonSpotlight } from "@/lib/data";
import { getSermonDownloads } from "@/lib/downloads";

export const revalidate = 300;

export default async function HomePage() {
  const spotlight = await getSermonSpotlight();
  const lessons = spotlight?.sermon.series ? await getSeriesLessons(spotlight.sermon.series.slug) : [];
  const downloads = spotlight
    ? (await getSermonDownloads()).find((d) => d.sermon.slug === spotlight.sermon.slug)
    : undefined;

  return (
    <>
      <Hero featured={spotlight?.sermon ?? null} />
      <ServiceBand />
      {spotlight && <SermonSpotlight spotlight={spotlight} pieces={downloads?.pieces ?? []} lessons={lessons} />}
      <Welcome />
    </>
  );
}
