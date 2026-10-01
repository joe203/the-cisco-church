import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BulletinView } from "@/components/bulletin/BulletinView";
import { getPublishedBulletin } from "@/lib/bulletin/data";
import { formatDate } from "@/lib/format";

export const revalidate = 300;

type Props = { params: Promise<{ date: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const bulletin = await getPublishedBulletin(date);
  return { title: bulletin ? `Bulletin — ${formatDate(date)}` : "Bulletin" };
}

export default async function PastBulletinPage({ params }: Props) {
  const { date } = await params;
  const bulletin = await getPublishedBulletin(date);
  if (!bulletin) notFound();
  return <BulletinView bulletin={bulletin} />;
}
