import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClassGuideSheet } from "@/components/downloads/ClassHandout";
import { PrintButton } from "@/components/bulletin/PrintButton";
import { classGuideUrl, getClassGuide } from "@/lib/classes";

export const revalidate = 300;

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const guide = getClassGuide((await params).slug);
  if (!guide) return {};
  return { title: `Discussion guide: ${guide.series}`, robots: { index: false, follow: true } };
}

export default async function ClassGuidePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const guide = getClassGuide(slug);
  if (!guide) notFound();

  return (
    <div className="bg-sand py-8 print:bg-white print:py-0">
      <div className="mx-auto mb-5 flex max-w-[8.5in] flex-wrap items-center justify-between gap-4 px-5 sm:px-0 print:hidden">
        <Link href="/downloads" className="btn-ghost !py-1">
          <span aria-hidden>&larr;</span> All downloads
        </Link>
        <div className="flex items-center gap-6">
          <a
            href={classGuideUrl(slug)}
            download={`${slug}.pdf`}
            className="eyebrow link-under text-teal hover:text-deepsea"
          >
            Download PDF
          </a>
          <PrintButton label="Print" />
        </div>
      </div>
      <ClassGuideSheet guide={guide} />
    </div>
  );
}
