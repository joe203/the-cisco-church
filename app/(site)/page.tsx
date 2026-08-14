import { Hero } from "@/components/sections/Hero";
import { RecentSermons } from "@/components/sections/RecentSermons";
import { ServiceBand } from "@/components/sections/ServiceBand";
import { Welcome } from "@/components/sections/Welcome";
import { getFeaturedSermon } from "@/lib/data";

export const revalidate = 300;

export default async function HomePage() {
  const featured = await getFeaturedSermon();

  return (
    <>
      <Hero featured={featured} />
      <ServiceBand />
      <Welcome />
      <RecentSermons />
    </>
  );
}
