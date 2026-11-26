import type { Metadata } from "next";
import { Gate } from "@/components/together/Gate";
import { MeetingContent } from "@/components/together/MeetingContent";
import { getMember } from "@/lib/together/access";

export const metadata: Metadata = {
  title: "Where we go from here",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

/** Prep for the members' vision meeting. Same sign-in as /together. */
export default async function MeetingPage() {
  const member = await getMember();
  return member ? <MeetingContent /> : <Gate />;
}
