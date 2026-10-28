import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TogetherContent } from "@/components/together/TogetherContent";

export const metadata: Metadata = {
  title: "Where we’re headed",
  robots: { index: false, follow: false },
};

/** Design preview only. Disappears in production; the real page sits behind the sign-in. */
export default function TogetherPreview() {
  if (process.env.NODE_ENV === "production") notFound();
  return <TogetherContent />;
}
