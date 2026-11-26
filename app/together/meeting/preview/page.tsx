import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MeetingContent } from "@/components/together/MeetingContent";

export const metadata: Metadata = {
  title: "Where we go from here",
  robots: { index: false, follow: false },
};

/** Design preview only. Disappears in production; the real page sits behind the sign-in. */
export default function MeetingPreview() {
  if (process.env.NODE_ENV === "production") notFound();
  return <MeetingContent />;
}
