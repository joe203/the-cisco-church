import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { StayCurrent } from "@/components/sections/StayCurrent";
import { todayInCisco } from "@/lib/series";

// Every public page is built fresh for each visit and never saved by a browser,
// so a visitor can't land on old content. New pages here inherit this.
export const dynamic = "force-dynamic";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <StayCurrent build={process.env.BUILD_STAMP ?? "dev"} day={todayInCisco()} />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
