import type { Metadata } from "next";
import { FeedbackGate } from "@/components/together/FeedbackGate";
import { FeedbackPage } from "@/components/together/FeedbackPage";
import { getFeedbackMember } from "@/lib/feedback/access";

export const metadata: Metadata = {
  title: "How’s it going?",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

/** Signed in through an emailed link → the form; otherwise → "email me a link". */
export default async function FeedbackRoute({ searchParams }: { searchParams: Promise<{ link?: string }> }) {
  const member = await getFeedbackMember();
  if (!member) return <FeedbackGate expired={(await searchParams).link === "expired"} />;
  return <FeedbackPage name={member.name} />;
}
