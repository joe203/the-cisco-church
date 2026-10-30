import type { Metadata } from "next";
import { AnnouncementsView } from "@/components/announcements/AnnouncementsView";
import { getWeeks } from "@/lib/announcements";

export const metadata: Metadata = {
  title: "Announcements",
  description:
    "Everything from the screen on Sunday, to read at your own pace — dates, times, and details.",
};

// Which week is current depends on today's date, so never serve a cached copy.
export const dynamic = "force-dynamic";

export default function AnnouncementsPage() {
  const { current, earlier } = getWeeks();
  return <AnnouncementsView week={current} isCurrent earlierWeeks={earlier} />;
}
