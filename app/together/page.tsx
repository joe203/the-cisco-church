import type { Metadata } from "next";
import { Gate } from "@/components/together/Gate";
import { TogetherContent } from "@/components/together/TogetherContent";
import { getMember } from "@/lib/together/access";

export const metadata: Metadata = {
  title: "Where we’re headed",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function TogetherPage() {
  const member = await getMember();
  return member ? <TogetherContent /> : <Gate />;
}
