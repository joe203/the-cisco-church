import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClassGuideSheet } from "@/components/downloads/ClassHandout";
import { getClassGuide } from "@/lib/classes";

export const revalidate = 300;

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Just the sheet, no site header or footer — what the View window on /downloads shows. */
export default async function EmbeddedClassGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const guide = getClassGuide((await params).slug);
  if (!guide) notFound();

  return (
    <div className="min-h-dvh bg-sand p-3 sm:p-5">
      <ClassGuideSheet guide={guide} />
    </div>
  );
}
