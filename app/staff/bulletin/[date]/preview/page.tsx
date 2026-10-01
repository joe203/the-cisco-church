import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BulletinView } from "@/components/bulletin/BulletinView";
import { isIsoDate } from "@/lib/bulletin/schema";
import { getBulletinForStaff } from "@/lib/bulletin/staff-data";
import { getStaff } from "@/lib/supabase/auth";

export const metadata: Metadata = { title: "Preview", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PreviewPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const staff = await getStaff();
  if (!staff) redirect("/staff/login");
  if (!isIsoDate(date)) notFound();
  const bulletin = await getBulletinForStaff(date);
  if (!bulletin) notFound();

  return (
    <BulletinView
      bulletin={bulletin}
      previewNote={
        bulletin.status === "published"
          ? "Preview — this is what visitors see right now."
          : "Preview of your draft — visitors can’t see this until you publish."
      }
    />
  );
}
