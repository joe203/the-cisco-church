import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { LiveRefresh } from "@/components/sections/LiveRefresh";
import { StayCurrent } from "@/components/sections/StayCurrent";
import { todayInCisco } from "@/lib/series";

// Every public page is built fresh for each visit and never saved by a browser,
// so a visitor can't land on old content. New pages here inherit this.
export const dynamic = "force-dynamic";

// Sermons show up on most public pages (spotlight, archive, downloads), so every
// open page follows them. Slides aren't watched directly (their rows carry
// presenter notes); scripts/sync-sermons.mjs touches the deck row on every run.
const SERMON_TABLES = ["cisco_sermons", "cisco_sermon_points", "cisco_series", "cisco_speakers", "cisco_decks"];

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <StayCurrent build={process.env.BUILD_STAMP ?? "dev"} day={todayInCisco()} />
      <LiveRefresh tables={SERMON_TABLES} />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
