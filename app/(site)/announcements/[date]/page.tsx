import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AnnouncementsView } from "@/components/announcements/AnnouncementsView";
import { getWeeks } from "@/lib/announcements";

type Params = { date: string };

export const metadata: Metadata = {
  title: "Earlier announcements",
  robots: { index: false, follow: true },
};

// A week only exists here once it has been replaced by a newer one.
export const dynamic = "force-dynamic";

export default async function EarlierAnnouncementsPage({ params }: { params: Promise<Params> }) {
  const { date } = await params;
  const { current, earlier } = getWeeks();
  if (date === current.date) redirect("/announcements");
  const week = earlier.find((w) => w.date === date);
  if (!week) notFound();
  return <AnnouncementsView week={week} isCurrent={false} />;
}
