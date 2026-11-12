import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeedbackPage } from "@/components/together/FeedbackPage";

export const metadata: Metadata = {
  title: "How’s it going?",
  robots: { index: false, follow: false },
};

/** Design preview only. Disappears in production; the real page sits behind the sign-in. */
export default function FeedbackPreview() {
  if (process.env.NODE_ENV === "production") notFound();
  return <FeedbackPage name="Pat Sample" preview />;
}
